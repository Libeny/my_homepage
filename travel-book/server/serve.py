#!/usr/bin/env python3
"""《旅册》服务端 v2：接单 → subprocess 唤起主 agent → 搬运文件契约。

服务端对 pipeline 内部零感知：不调度 herdr、不直接调 codex/agy。
主 agent（默认 pi）拿 server/sop.md 全权干活，义务只是写
lines.jsonl / stage-N.json / book.json（见 PIPELINE-V2.md）。
"""
import json
import hashlib
import hmac
import os
import re
import secrets
import sqlite3
import smtplib
import subprocess
import sys
import threading
import time
import uuid
from email.message import EmailMessage
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, quote, unquote, urlparse


SERVER_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SERVER_DIR.parent          # travel-book/
APP_DIR = PROJECT_ROOT / "app"            # 客户端静态文件
REPO_ROOT = PROJECT_ROOT if (PROJECT_ROOT / "assets").is_dir() else PROJECT_ROOT.parent  # 优先自身 assets，其次父仓库
SOP_PATH = SERVER_DIR / "sop.md"
JOBS_DIR = PROJECT_ROOT / ".context" / "jobs"
EVENTS_DIR = PROJECT_ROOT / ".context" / "events"
AUTH_DB_PATH = PROJECT_ROOT / ".context" / "travelbook-auth.sqlite3"
DEFAULT_PORT = 8137
JOB_TIMEOUT_SEC = 3600
PALETTE = ["#3d6b6e", "#b5763a", "#6e5a7e", "#7a6c3f"]

MAIN_AGENT = os.environ.get("TRAVELBOOK_MAIN_AGENT", "pi")
MAIN_AGENT_PROVIDER = os.environ.get("TRAVELBOOK_PI_PROVIDER", "deepseek")
MAIN_AGENT_MODEL = os.environ.get("TRAVELBOOK_PI_MODEL", "deepseek-v4-flash")

AUTH_CODE_TTL_SEC = 10 * 60
AUTH_SESSION_TTL_SEC = 30 * 24 * 60 * 60
AUTH_CODE_RESEND_SEC = 5
AUTH_COOKIE_SECURE = os.environ.get("TRAVELBOOK_COOKIE_SECURE", "0") == "1"
AUTH_COOKIE_NAME = "__Host-travelbook_session" if AUTH_COOKIE_SECURE else "travelbook_session"
# 调试验证码只能显式开启；任何可被 Tunnel 暴露的服务都不得默认返回验证码。
AUTH_DEBUG_CODES = os.environ.get("TRAVELBOOK_AUTH_DEBUG_CODES", "0") == "1"
_auth_rate_lock = threading.Lock()
_auth_rate = {}  # (kind, key) -> last request unix time

JOB_ID_RE = re.compile(r"^[0-9a-f]{32}$")
ART_FILE_RE = re.compile(r"^[A-Za-z0-9._-]+$")
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")

def app_version():
    """客户端版本号 = index.html 的 mtime，改前端自动升版。"""
    try:
        return str(int((APP_DIR / "index.html").stat().st_mtime))
    except OSError:
        return "0"

_jobs = {}        # job_id -> {"proc": Popen, "created": float, "log": file}
_jobs_lock = threading.Lock()
_sync_lock = threading.Lock()
_COUNTER_PATH = None  # run_server 时初始化


# ---------- 认证：邮箱一次性验证码 + 服务端会话 ----------

VALID_INVITE_CODES = {f"tj{i:02d}" for i in range(1, 11)}
UNIFIED_VERIFY_CODE = "abc123"


def hash_password(password, salt=None):
    if not salt:
        salt = secrets.token_hex(16)
    h = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000).hex()
    return f"{salt}${h}"


def verify_password(password, stored_hash):
    if not stored_hash or "$" not in stored_hash:
        return False
    salt, h = stored_hash.split("$", 1)
    calc = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000).hex()
    return hmac.compare_digest(calc, h)


def auth_db():
    """每个请求使用独立 SQLite 连接；schema 初始化幂等且可安全重复调用。"""
    AUTH_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(AUTH_DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL DEFAULT '',
            invite_code TEXT NOT NULL DEFAULT '',
            traveler_name TEXT NOT NULL DEFAULT '',
            created_at REAL NOT NULL
        );
        CREATE TABLE IF NOT EXISTS verification_codes (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL,
            code_hash TEXT NOT NULL,
            expires_at REAL NOT NULL,
            consumed_at REAL,
            created_at REAL NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email, created_at DESC);
        CREATE TABLE IF NOT EXISTS sessions (
            token_hash TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES users(id),
            expires_at REAL NOT NULL,
            revoked_at REAL,
            created_at REAL NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id, expires_at);
    """)
    for col_alter in [
        "ALTER TABLE users ADD COLUMN password_hash TEXT NOT NULL DEFAULT ''",
        "ALTER TABLE users ADD COLUMN invite_code TEXT NOT NULL DEFAULT ''",
    ]:
        try:
            conn.execute(col_alter)
        except sqlite3.OperationalError:
            pass
    return conn


def canonical_email(value):
    email = str(value or "").strip().lower()
    if not EMAIL_RE.match(email) or len(email) > 254:
        raise ValueError("请输入有效的邮箱地址")
    return email


def token_hash(value):
    return hashlib.sha256(str(value).encode("utf-8")).hexdigest()


def auth_rate_allowed(kind, key, interval):
    now = time.time()
    with _auth_rate_lock:
        previous = _auth_rate.get((kind, key), 0)
        if now - previous < interval:
            return False, max(1, int(interval - (now - previous)))
        _auth_rate[(kind, key)] = now
    return True, 0


def issue_verification_code(email):
    allowed, retry_after = auth_rate_allowed("email", email, AUTH_CODE_RESEND_SEC)
    if not allowed:
        raise RuntimeError(f"请在 {retry_after} 秒后再请求验证码")
    code = UNIFIED_VERIFY_CODE
    now = time.time()
    with auth_db() as conn:
        # 同一邮箱只保留最近一枚可用验证码，旧码不能再被使用。
        conn.execute("UPDATE verification_codes SET consumed_at=? WHERE email=? AND consumed_at IS NULL", (now, email))
        conn.execute(
            "INSERT INTO verification_codes(id,email,code_hash,expires_at,consumed_at,created_at) VALUES(?,?,?,?,NULL,?)",
            (uuid.uuid4().hex, email, token_hash(code), now + AUTH_CODE_TTL_SEC, now),
        )
    return code


def send_verification_email(email, code):
    host = os.environ.get("TRAVELBOOK_SMTP_HOST", "").strip()
    sender = os.environ.get("TRAVELBOOK_SMTP_FROM", "").strip()
    if not host or not sender:
        return
    message = EmailMessage()
    message["Subject"] = "旅册验证码"
    message["From"] = sender
    message["To"] = email
    message.set_content(
        f"你的旅册验证码是：{code}\n\n验证码 10 分钟内有效，仅可使用一次。若不是你本人操作，请忽略这封邮件。"
    )
    port = int(os.environ.get("TRAVELBOOK_SMTP_PORT", "465"))
    username = os.environ.get("TRAVELBOOK_SMTP_USERNAME", "")
    password = os.environ.get("TRAVELBOOK_SMTP_PASSWORD", "")
    try:
        if port == 465:
            with smtplib.SMTP_SSL(host, port, timeout=15) as smtp:
                if username: smtp.login(username, password)
                smtp.send_message(message)
        else:
            with smtplib.SMTP(host, port, timeout=15) as smtp:
                smtp.starttls()
                if username: smtp.login(username, password)
                smtp.send_message(message)
    except Exception as exc:
        sys.stderr.write(f"发送邮件失败（已降级跳过）：{exc}\n")


def register_user(email, invite_code, code, password):
    email = canonical_email(email)
    invite = str(invite_code or "").strip().lower()
    if invite not in VALID_INVITE_CODES:
        raise ValueError("邀请码无效，请输入有效邀请码（tj01 ~ tj10）")
    code_str = str(code or "").strip()
    if code_str != UNIFIED_VERIFY_CODE:
        now = time.time()
        with auth_db() as conn:
            row = conn.execute(
                "SELECT id,code_hash,expires_at FROM verification_codes WHERE email=? AND consumed_at IS NULL ORDER BY created_at DESC LIMIT 1",
                (email,),
            ).fetchone()
            if not row or row["expires_at"] < now or not hmac.compare_digest(row["code_hash"], token_hash(code_str)):
                raise ValueError("验证码错误（测试验证码为 abc123）")
            conn.execute("UPDATE verification_codes SET consumed_at=? WHERE id=?", (now, row["id"]))
    pwd = str(password or "")
    if len(pwd) < 6:
        raise ValueError("请设置至少 6 位的登录密码")
    now = time.time()
    with auth_db() as conn:
        existing = conn.execute("SELECT id FROM users WHERE email=?", (email,)).fetchone()
        if existing:
            raise ValueError("该邮箱已注册，请直接使用密码登录")
        user_id = uuid.uuid4().hex
        pwd_hash = hash_password(pwd)
        conn.execute(
            "INSERT INTO users(id,email,password_hash,invite_code,traveler_name,created_at) VALUES(?,?,?,?,?,?)",
            (user_id, email, pwd_hash, invite, "", now),
        )
        user = conn.execute("SELECT id,email,traveler_name FROM users WHERE id=?", (user_id,)).fetchone()
        raw_token = secrets.token_urlsafe(32)
        conn.execute(
            "INSERT INTO sessions(token_hash,user_id,expires_at,revoked_at,created_at) VALUES(?,?,?,?,?)",
            (token_hash(raw_token), user_id, now + AUTH_SESSION_TTL_SEC, None, now),
        )
    return dict(user), raw_token


def login_with_password(email, password):
    email = canonical_email(email)
    pwd = str(password or "")
    if not pwd:
        raise ValueError("请输入登录密码")
    now = time.time()
    with auth_db() as conn:
        user = conn.execute("SELECT id,email,password_hash,traveler_name FROM users WHERE email=?", (email,)).fetchone()
        if not user:
            raise ValueError("该邮箱尚未注册，请先使用邀请码注册")
        if not user["password_hash"]:
            raise ValueError("该账户未设置密码，请使用验证码登录")
        if not verify_password(pwd, user["password_hash"]):
            raise ValueError("邮箱或密码错误，请重新输入")
        raw_token = secrets.token_urlsafe(32)
        conn.execute(
            "INSERT INTO sessions(token_hash,user_id,expires_at,revoked_at,created_at) VALUES(?,?,?,?,?)",
            (token_hash(raw_token), user["id"], now + AUTH_SESSION_TTL_SEC, None, now),
        )
    return {"id": user["id"], "email": user["email"], "traveler_name": user["traveler_name"]}, raw_token


def consume_verification_code(email, code):
    email = canonical_email(email)
    code_str = str(code or "").strip()
    if code_str != UNIFIED_VERIFY_CODE:
        now = time.time()
        with auth_db() as conn:
            row = conn.execute(
                "SELECT id,code_hash,expires_at FROM verification_codes WHERE email=? AND consumed_at IS NULL ORDER BY created_at DESC LIMIT 1",
                (email,),
            ).fetchone()
            if not row or row["expires_at"] < now or not hmac.compare_digest(row["code_hash"], token_hash(code_str)):
                raise ValueError("验证码错误或已过期（测试验证码为 abc123）")
            conn.execute("UPDATE verification_codes SET consumed_at=? WHERE id=?", (now, row["id"]))
    now = time.time()
    with auth_db() as conn:
        user = conn.execute("SELECT id,email,traveler_name FROM users WHERE email=?", (email,)).fetchone()
        if not user:
            raise ValueError("该邮箱尚未注册，请先点击「注册」使用邀请码完成注册")
        raw_token = secrets.token_urlsafe(32)
        conn.execute(
            "INSERT INTO sessions(token_hash,user_id,expires_at,revoked_at,created_at) VALUES(?,?,?,?,?)",
            (token_hash(raw_token), user["id"], now + AUTH_SESSION_TTL_SEC, None, now),
        )
    return dict(user), raw_token


def user_from_session(cookie_header):
    cookie_header = cookie_header or ""
    match = re.search(r"(?:^|;\s*)" + re.escape(AUTH_COOKIE_NAME) + r"=([^;]+)", cookie_header)
    if not match:
        return None
    now = time.time()
    with auth_db() as conn:
        row = conn.execute(
            "SELECT u.id,u.email,u.traveler_name FROM sessions s JOIN users u ON u.id=s.user_id "
            "WHERE s.token_hash=? AND s.revoked_at IS NULL AND s.expires_at>?",
            (token_hash(match.group(1)), now),
        ).fetchone()
    return dict(row) if row else None


def session_cookie(token, max_age=AUTH_SESSION_TTL_SEC):
    parts = [f"{AUTH_COOKIE_NAME}={token}", "Path=/", "HttpOnly", "SameSite=Lax", f"Max-Age={max_age}"]
    if AUTH_COOKIE_SECURE:
        parts.append("Secure")
    return "; ".join(parts)


def request_origin_allowed(headers):
    """同源 Web 表单请求才会带 cookie；原生端无 Origin 时由 bearer/session 方案接入。"""
    origin = headers.get("Origin")
    host = headers.get("Host")
    return not origin or origin.endswith("//" + host)


def baidu_source_url(place):
    return f"https://baike.baidu.com/item/{quote(place, safe='')}"


def bilibili_search_url(place, topic):
    keyword = f"{place} {topic}".strip()
    return f"https://search.bilibili.com/all?keyword={quote(keyword, safe='')}"


def safe_slug(value, fallback):
    ascii_slug = re.sub(r"[^a-zA-Z0-9_-]+", "-", value).strip("-").lower()
    return ascii_slug or fallback


def as_dict(value):
    return value if isinstance(value, dict) else {}


def as_list(value):
    return value if isinstance(value, list) else []


def text(value, fallback=""):
    if value is None:
        return fallback
    value = str(value).strip()
    return value if value else fallback


def normalize_tasks(tasks, place, topic):
    clean = [text(item) for item in as_list(tasks) if text(item)]
    defaults = [
        f"去找一个能代表{place}的现场细节，拍下来",
        f"问一位本地人：{topic or place}最值得注意的地方是什么",
        f"记下一个和{place}有关的地名、年代或数字",
    ]
    clean.extend(defaults)
    return clean[:3]


def normalize_book(data, places, traveler=""):
    """对主 agent 交付的 book.json 做防御性补全：缺字段给安全默认值，不报错。"""
    data = as_dict(data)
    raw_destinations = as_list(data.get("destinations"))
    normalized_destinations = []

    for index, place in enumerate(places):
        raw_dest = as_dict(raw_destinations[index] if index < len(raw_destinations) else {})
        dest_name = text(raw_dest.get("name"), place)
        dest_id = text(raw_dest.get("id"), safe_slug(dest_name, f"place_{index + 1}"))
        chapters = []

        raw_chapters = as_list(raw_dest.get("chapters"))
        if not raw_chapters:
            raw_chapters = [{}]

        for chapter_index, raw_chapter in enumerate(raw_chapters, start=1):
            raw_chapter = as_dict(raw_chapter)
            tag = text(raw_chapter.get("tag"), "现场线索")
            title = text(raw_chapter.get("title"), f"{dest_name}的一条线索")
            question = text(raw_chapter.get("question"), f"为什么{dest_name}会是现在这样？")
            lesson = as_dict(raw_chapter.get("lesson"))
            mission = as_dict(raw_chapter.get("mission"))
            source = as_dict(lesson.get("source"))
            topic = tag or title

            source_name = text(
                source.get("name"),
                f"百科词条：{dest_name}；B站检索：{dest_name} {topic}",
            )
            source_url = text(source.get("url"), baidu_source_url(dest_name))
            bilibili_url = text(
                source.get("bilibiliUrl") or source.get("bilibili_url"),
                bilibili_search_url(dest_name, topic),
            )

            chapters.append(
                {
                    "id": text(raw_chapter.get("id"), f"{dest_id}-{chapter_index}"),
                    "no": text(raw_chapter.get("no"), f"{chapter_index:02d}"),
                    "tag": tag,
                    "question": question,
                    "title": title,
                    "art": text(raw_chapter.get("art"), ""),
                    "lesson": {
                        "title": text(lesson.get("title"), title),
                        "body": text(
                            lesson.get("body"),
                            f"{dest_name}的资料锚点有限，建议把现场观察放在第一位，再核对公开资料。",
                        ),
                        "lookFor": text(
                            lesson.get("lookFor") or lesson.get("look_for"),
                            f"到达{dest_name}后，先找一个能验证这一章问题的现场细节。",
                        ),
                        "source": {
                            "name": source_name,
                            "url": source_url,
                            "bilibiliUrl": bilibili_url,
                        },
                    },
                    "mission": {
                        "title": text(mission.get("title"), f"{dest_name}现场任务"),
                        "brief": text(mission.get("brief"), f"用三个动作把{dest_name}从资料变成自己的观察。"),
                        "tasks": normalize_tasks(mission.get("tasks"), dest_name, topic),
                        "photoHint": text(mission.get("photoHint") or mission.get("photo_hint"), f"{dest_name}的现场证据"),
                    },
                }
            )

        normalized_destinations.append(
            {
                "id": dest_id,
                "name": dest_name,
                "region": text(raw_dest.get("region"), ""),
                "themeColor": text(raw_dest.get("themeColor"), PALETTE[index % len(PALETTE)]),
                "coverLine": text(raw_dest.get("coverLine") or raw_dest.get("cover_line"), f"{dest_name}的一条现场线索"),
                "coverArt": text(raw_dest.get("coverArt") or raw_dest.get("cover_art"), ""),
                "chapters": chapters,
            }
        )

    review = as_dict(data.get("review"))
    review_lines = [text(item) for item in as_list(review.get("lines")) if text(item)]
    if not review_lines:
        review_lines = [
            f"{place}：出发前记住一个地名、一个年代和一个现场可验证的问题"
            for place in places
        ]
    while len(review_lines) < 5:
        review_lines.append("把书中的问题带到现场，用照片、原话和地名验证它")
    review_lines = review_lines[:7]

    return {
        "title": text(data.get("title"), " · ".join(places)),
        "subtitle": text(data.get("subtitle"), "一本为你生成的旅行书"),
        "spineTitle": text(data.get("spineTitle") or data.get("spine_title"), " · ".join(places)),
        "edition": text(data.get("edition"), "FIELD EDITION"),
        "traveler": traveler,
        "destinations": normalized_destinations,
        "review": {
            "title": text(review.get("title"), "行前小抄"),
            "lines": review_lines,
        },
    }


# ---------- job 生命周期 ----------

def create_job(places, traveler, user_id):
    job_id = uuid.uuid4().hex
    job_dir = JOBS_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)
    (job_dir / "meta.json").write_text(
        json.dumps(
            {"places": places, "traveler": traveler, "userId": user_id, "created": time.time()},
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    # 种子行：保证客户端提交后立即有反馈，不等主 agent 启动
    (job_dir / "lines.jsonl").write_text(
        f"📦 已接单：{'、'.join(places)} · 正在叫醒出版社…\n", encoding="utf-8"
    )

    prompt = (
        f"你是《旅册》流水线的主 agent（制片人）。先完整阅读 {SOP_PATH} 并严格遵守其中的"
        f"文件契约、流程与风格红线。本次任务：places={json.dumps(places, ensure_ascii=False)}，"
        f"traveler={traveler or '未填写'}。你的工作目录（cwd）就是本次的 job 目录，"
        f"lines.jsonl / stage-N.json / art/ / book.json 全部写到这里。现在开始。"
    )
    cmd = [
        MAIN_AGENT, "-p", prompt,
        "--provider", MAIN_AGENT_PROVIDER,
        "--model", MAIN_AGENT_MODEL,
        "--no-session",
    ]
    env = dict(os.environ)
    env["TRAVEL_BOOK_ROOT"] = str(PROJECT_ROOT)
    log_handle = open(job_dir / "agent.log", "ab")
    try:
        proc = subprocess.Popen(
            cmd, cwd=str(job_dir), stdout=log_handle, stderr=subprocess.STDOUT, env=env
        )
    except Exception:
        log_handle.close()
        raise
    with _jobs_lock:
        _jobs[job_id] = {"proc": proc, "created": time.time(), "log": log_handle}
    return job_id


def job_dir_for(job_id):
    if not JOB_ID_RE.match(job_id or ""):
        return None
    job_dir = JOBS_DIR / job_id
    return job_dir if job_dir.is_dir() else None


def read_lines(job_dir):
    path = job_dir / "lines.jsonl"
    if not path.exists():
        return []
    return [ln for ln in path.read_text(encoding="utf-8", errors="replace").splitlines() if ln.strip()]


def agent_log_tail(job_dir, limit=500):
    path = job_dir / "agent.log"
    if not path.exists():
        return ""
    data = path.read_text(encoding="utf-8", errors="replace")
    return data[-limit:]


def job_status(job_id, job_dir):
    """done: book.json 出现；error: error.txt 或主 agent 死了/超时却没交付；否则 running。"""
    book_path = job_dir / "book.json"
    if book_path.exists():
        return "done", None

    error_path = job_dir / "error.txt"
    if error_path.exists():
        return "error", error_path.read_text(encoding="utf-8", errors="replace").strip()

    with _jobs_lock:
        record = _jobs.get(job_id)
    if record is None:
        # 服务端重启后内存句柄丢失，但主 agent 子进程可能还活着在写盘：
        # 未超时就按 running 处理，等它交付或超时
        try:
            meta = json.loads((job_dir / "meta.json").read_text(encoding="utf-8"))
            age = time.time() - float(meta.get("created") or 0)
        except Exception:
            age = JOB_TIMEOUT_SEC + 1
        if age < JOB_TIMEOUT_SEC:
            return "running", None
        return "error", "服务端重启导致该任务失联，请重新生成。"
    proc = record["proc"]
    if proc.poll() is None:
        if time.time() - record["created"] > JOB_TIMEOUT_SEC:
            proc.kill()
            return "error", "生成超时（1 小时），装订师傅打了个盹，请重试。"
        return "running", None
    tail = agent_log_tail(job_dir)
    return "error", f"主 agent 已退出（码 {proc.returncode}）但未交付 book.json。日志尾部：{tail}"


def rewrite_art_urls(value, job_id):
    """把 book 里的相对 art 路径改写成 /api/job-art URL。"""
    if isinstance(value, dict):
        return {k: rewrite_art_urls(v, job_id) for k, v in value.items()}
    if isinstance(value, list):
        return [rewrite_art_urls(v, job_id) for v in value]
    if isinstance(value, str) and value.startswith("art/") and ART_FILE_RE.match(value[4:]):
        return f"/api/job-art?id={job_id}&file={quote(value[4:], safe='')}"
    return value


def snapshot_job(job_id, since):
    job_dir = job_dir_for(job_id)
    if job_dir is None:
        return None
    status, error = job_status(job_id, job_dir)
    lines = read_lines(job_dir)
    total = len(lines)
    since = max(0, min(since, total))

    book = None
    if status == "done":
        try:
            raw_book = json.loads((job_dir / "book.json").read_text(encoding="utf-8"))
            meta = json.loads((job_dir / "meta.json").read_text(encoding="utf-8"))
            book = normalize_book(raw_book, meta.get("places") or [], meta.get("traveler") or "")
            book = rewrite_art_urls(book, job_id)
        except Exception as exc:
            status, error, book = "error", f"book.json 损坏：{exc}", None

    return {
        "status": status,
        "lines": lines[since:],
        "next": total,
        "book": book,
        "error": error,
    }


# ---------- 历史书架 ----------

def list_books(user_id):
    """列出当前账户的历史书与仍在制作的 job；绝不跨账户泄露目录元数据。"""
    out = []
    if not JOBS_DIR.is_dir():
        return out
    for d in JOBS_DIR.iterdir():
        if not d.is_dir() or not JOB_ID_RE.match(d.name):
            continue
        try:
            meta = json.loads((d / "meta.json").read_text(encoding="utf-8"))
            if meta.get("userId") != user_id:
                continue
            status, error = job_status(d.name, d)
            book = {}
            if status == "done":
                book = json.loads((d / "book.json").read_text(encoding="utf-8"))
            chapters = sum(len(dd.get("chapters", [])) for dd in as_list(book.get("destinations")))
            item = {
                "jobId": d.name,
                "status": status,
                "title": text(book.get("title"), " · ".join(as_list(meta.get("places"))) or "装订中"),
                "subtitle": text(book.get("subtitle")),
                "spineTitle": text(book.get("spineTitle") or book.get("spine_title")),
                "places": as_list(meta.get("places")),
                "traveler": text(meta.get("traveler")),
                "created": meta.get("created") or 0,
                "chapters": chapters,
                "coverArt": next(
                    (text(dd.get("coverArt"), "") for dd in as_list(book.get("destinations")) if text(dd.get("coverArt"), "")),
                    "",
                ),
            }
            if status == "running":
                lines = read_lines(d)
                item["latest"] = lines[-1] if lines else "正在搜集资料"
            elif status == "error":
                item["error"] = text(error, "制作中断")
            out.append(item)
        except Exception:
            continue
    out.sort(key=lambda x: x.get("created") or 0, reverse=True)
    return out


# ---------- 事件收件箱（outbox 上行） ----------

def _next_sync_id():
    """全局单调递增 sync id（LSE 式全序）。计数器落盘，重启不丢。"""
    with _sync_lock:
        data = {"next": 1}
        if _COUNTER_PATH.exists():
            try:
                data = json.loads(_COUNTER_PATH.read_text(encoding="utf-8"))
            except Exception:
                pass
        sync_id = int(data.get("next") or 1)
        _COUNTER_PATH.write_text(json.dumps({"next": sync_id + 1}), encoding="utf-8")
        return sync_id


def backfill_sync_ids():
    """老事件文件没有 syncId：按 serverTs 顺序补发编号（一次性迁移）。"""
    if not EVENTS_DIR.is_dir():
        return
    for path in sorted(EVENTS_DIR.glob("*.jsonl")):
        lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
        events = []
        needs = False
        for ln in lines:
            try:
                e = json.loads(ln)
            except Exception:
                continue
            if "syncId" not in e:
                needs = True
            events.append(e)
        if not needs or not events:
            continue
        events.sort(key=lambda e: float(e.get("serverTs") or 0))
        with open(path, "w", encoding="utf-8") as fh:
            for e in events:
                if "syncId" not in e:
                    e["syncId"] = _next_sync_id()
                fh.write(json.dumps(e, ensure_ascii=False) + "\n")


def handle_events_payload(body):
    try:
        payload = json.loads(body.decode("utf-8"))
    except Exception as exc:
        raise ValueError(f"请求 JSON 无法解析：{exc}") from exc
    book_id = safe_slug(text(payload.get("bookId")), "")
    device_id = text(payload.get("deviceId"))
    events = as_list(payload.get("events"))
    if not book_id:
        raise ValueError("缺少 bookId")
    if not events:
        raise ValueError("events 为空")

    EVENTS_DIR.mkdir(parents=True, exist_ok=True)
    path = EVENTS_DIR / f"{book_id}.jsonl"
    seen = set()
    if path.exists():
        for ln in path.read_text(encoding="utf-8", errors="replace").splitlines():
            try:
                seen.add(json.loads(ln).get("id"))
            except Exception:
                continue

    acked, appended = [], 0
    with open(path, "a", encoding="utf-8") as fh:
        for event in events:
            event = as_dict(event)
            event_id = text(event.get("id"))
            if not event_id:
                continue
            acked.append(event_id)
            if event_id in seen:
                continue  # 幂等去重：重复事件确认收到但不落盘
            seen.add(event_id)
            event["deviceId"] = device_id
            event["serverTs"] = time.time()
            event["syncId"] = _next_sync_id()
            fh.write(json.dumps(event, ensure_ascii=False) + "\n")
            appended += 1
    return {"acked": acked, "appended": appended}


def read_events_since(book_id, since):
    """下行同步：返回某本书 syncId 大于游标的事件（全序保证，LSE 式）。"""
    slug = safe_slug(book_id, "")
    path = EVENTS_DIR / f"{slug}.jsonl"
    if not slug or not path.exists():
        return [], since
    out, cursor = [], since
    for ln in path.read_text(encoding="utf-8", errors="replace").splitlines():
        try:
            event = json.loads(ln)
        except Exception:
            continue
        sid = int(event.get("syncId") or 0)
        if sid > since:
            out.append(event)
            cursor = max(cursor, sid)
    out.sort(key=lambda e: int(e.get("syncId") or 0))
    return out, cursor


# ---------- HTTP ----------

class TravelBookHandler(SimpleHTTPRequestHandler):
    server_version = "TravelBookHTTP/2.0"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(APP_DIR), **kwargs)

    def log_message(self, format, *args):
        sys.stderr.write("%s - - [%s] %s\n" % (self.address_string(), self.log_date_time_string(), format % args))

    def end_headers(self):
        # 静态资源缓存策略：HTML 每次回源校验（Last-Modified → 304），
        # 否则 WKWebView 启发式缓存会长期持有旧版页面；字体内容稳定可长缓存。
        path = urlparse(self.path).path
        if path in ("/", "/index.html") or path.endswith(".html"):
            self.send_header("Cache-Control", "no-cache")
        elif path.startswith("/assets/"):
            self.send_header("Cache-Control", "max-age=86400")
        super().end_headers()

    def send_json(self, status, payload, headers=None):
        encoded = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.send_header("Cache-Control", "no-store")
        for key, value in (headers or {}).items():
            self.send_header(key, value)
        self.end_headers()
        self.wfile.write(encoded)

    def current_user(self):
        return user_from_session(self.headers.get("Cookie"))

    def require_user(self):
        user = self.current_user()
        if not user:
            self.send_json(401, {"error": "请先登录后再继续", "code": "AUTH_REQUIRED"})
            return None
        return user

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Allow", "GET, POST, OPTIONS")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/api/auth/register":
            self.handle_auth_register()
            return
        if path == "/api/auth/login":
            self.handle_auth_login()
            return
        if path == "/api/auth/request-code":
            self.handle_auth_request_code()
            return
        if path == "/api/auth/verify-code":
            self.handle_auth_verify_code()
            return
        if path == "/api/auth/logout":
            self.handle_auth_logout()
            return
        if path == "/api/auth/profile":
            self.handle_auth_profile()
            return
        if path == "/api/generate":
            self.handle_generate()
            return
        if path == "/api/events":
            self.handle_events()
            return
        self.send_error(404, "Not Found")

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/auth/me":
            user = self.current_user()
            self.send_json(200, {"user": user})
            return
        if path == "/api/job":
            self.handle_job()
            return
        if path == "/api/books":
            user = self.require_user()
            if user: self.send_json(200, {"books": list_books(user["id"])})
            return
        if path == "/api/events":
            self.handle_events_pull()
            return
        if path == "/api/job-art":
            self.handle_job_art()
            return
        if path == "/api/version":
            self.send_json(200, {"version": app_version()})
            return
        clean_path = path.lstrip("/")
        if path.startswith("/assets/") or (clean_path and clean_path != "index.html" and (REPO_ROOT / clean_path).is_file()):
            self.directory = str(REPO_ROOT)
        super().do_GET()

    def do_HEAD(self):
        path = urlparse(self.path).path
        clean_path = path.lstrip("/")
        if path.startswith("/assets/") or (clean_path and clean_path != "index.html" and (REPO_ROOT / clean_path).is_file()):
            self.directory = str(REPO_ROOT)
        super().do_HEAD()

    def handle_generate(self):
        user = self.require_user()
        if not user:
            return
        if not request_origin_allowed(self.headers):
            self.send_json(403, {"error": "来源校验失败"})
            return
        length = int(self.headers.get("Content-Length", "0") or "0")
        body = self.rfile.read(length)
        try:
            payload = json.loads(body.decode("utf-8"))
            places = payload.get("places")
            if not isinstance(places, list):
                raise ValueError("places 必须是数组")
            places = [str(place).strip() for place in places if str(place).strip()]
            if not 1 <= len(places) <= 3:
                raise ValueError("places 必须包含 1-3 个非空目的地")
            traveler = str(payload.get("traveler") or "").strip()
        except ValueError as exc:
            self.send_json(400, {"error": str(exc)})
            return
        try:
            job_id = create_job(places, traveler, user["id"])
        except FileNotFoundError:
            self.send_json(500, {"error": f"主 agent 命令不存在：{MAIN_AGENT}"})
            return
        self.send_json(200, {"jobId": job_id})

    def handle_job(self):
        user = self.require_user()
        if not user:
            return
        query = parse_qs(urlparse(self.path).query)
        job_id = unquote((query.get("id") or [""])[0])
        try:
            since = int((query.get("since") or ["0"])[0])
        except ValueError:
            since = 0
        if not job_id:
            self.send_json(400, {"error": "缺少 id"})
            return
        job_dir = job_dir_for(job_id)
        if job_dir is None:
            self.send_json(404, {"error": "job 不存在"})
            return
        try:
            meta = json.loads((job_dir / "meta.json").read_text(encoding="utf-8"))
        except Exception:
            self.send_json(404, {"error": "job 不存在"})
            return
        if meta.get("userId") != user["id"]:
            self.send_json(404, {"error": "job 不存在"})
            return
        snapshot = snapshot_job(job_id, since)
        if snapshot is None:
            self.send_json(404, {"error": "job 不存在"})
            return
        self.send_json(200, snapshot)

    def handle_job_art(self):
        user = self.require_user()
        if not user:
            return
        query = parse_qs(urlparse(self.path).query)
        job_id = unquote((query.get("id") or [""])[0])
        file_name = unquote((query.get("file") or [""])[0])
        job_dir = job_dir_for(job_id)
        if job_dir is None or not ART_FILE_RE.match(file_name or ""):
            self.send_error(404, "Not Found")
            return
        try:
            meta = json.loads((job_dir / "meta.json").read_text(encoding="utf-8"))
        except Exception:
            self.send_error(404, "Not Found")
            return
        if meta.get("userId") != user["id"]:
            self.send_error(404, "Not Found")
            return
        path = job_dir / "art" / file_name
        if not path.is_file():
            self.send_error(404, "Not Found")
            return
        data = path.read_bytes()
        # 生图工具实际产出与扩展名可能不一致（如 .jpg 文件实为 PNG），按魔数嗅探
        if data[:8] == b"\x89PNG\r\n\x1a\n":
            content_type = "image/png"
        elif data[:3] == b"\xff\xd8\xff":
            content_type = "image/jpeg"
        elif data[:4] == b"RIFF" and data[8:12] == b"WEBP":
            content_type = "image/webp"
        else:
            content_type = "application/octet-stream"
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "max-age=3600")
        self.end_headers()
        self.wfile.write(data)

    def handle_events(self):
        user = self.require_user()
        if not user:
            return
        length = int(self.headers.get("Content-Length", "0") or "0")
        body = self.rfile.read(length)
        try:
            result = handle_events_payload(body)
        except ValueError as exc:
            self.send_json(400, {"error": str(exc)})
            return
        self.send_json(200, result)

    def handle_events_pull(self):
        user = self.require_user()
        if not user:
            return
        query = parse_qs(urlparse(self.path).query)
        book_id = unquote((query.get("bookId") or [""])[0])
        try:
            since = int(float((query.get("since") or ["0"])[0]))
        except ValueError:
            since = 0
        # 老客户端游标是 serverTs 浮点（~1.7e12），远大于 syncId 区间：重置为 0 重新全量拉
        if since > 10**9:
            since = 0
        if not book_id:
            self.send_json(400, {"error": "缺少 bookId"})
            return
        events, cursor = read_events_since(book_id, since)
        self.send_json(200, {"events": events, "next": cursor})

    def handle_auth_register(self):
        if not request_origin_allowed(self.headers):
            self.send_json(403, {"error": "来源校验失败"})
            return
        length = int(self.headers.get("Content-Length", "0") or "0")
        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            email = payload.get("email")
            invite_code = payload.get("inviteCode") or payload.get("invite_code")
            code = payload.get("code")
            password = payload.get("password")
            user, token = register_user(email, invite_code, code, password)
        except ValueError as exc:
            self.send_json(400, {"error": str(exc)})
            return
        except Exception as exc:
            self.send_json(500, {"error": f"注册失败：{str(exc)}"})
            return
        self.send_json(200, {"ok": True, "user": user}, {"Set-Cookie": session_cookie(token)})

    def handle_auth_login(self):
        if not request_origin_allowed(self.headers):
            self.send_json(403, {"error": "来源校验失败"})
            return
        length = int(self.headers.get("Content-Length", "0") or "0")
        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            email = payload.get("email")
            password = payload.get("password")
            user, token = login_with_password(email, password)
        except ValueError as exc:
            self.send_json(400, {"error": str(exc)})
            return
        except Exception as exc:
            self.send_json(500, {"error": f"登录失败：{str(exc)}"})
            return
        self.send_json(200, {"ok": True, "user": user}, {"Set-Cookie": session_cookie(token)})

    def handle_auth_request_code(self):
        if not request_origin_allowed(self.headers):
            self.send_json(403, {"error": "来源校验失败"})
            return
        length = int(self.headers.get("Content-Length", "0") or "0")
        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            email = canonical_email(payload.get("email"))
            allowed, retry_after = auth_rate_allowed("ip", self.client_address[0], 5)
            if not allowed:
                self.send_json(429, {"error": f"请求过于频繁，请 {retry_after} 秒后再试"})
                return
            code = issue_verification_code(email)
            send_verification_email(email, code)
        except (ValueError, RuntimeError) as exc:
            self.send_json(400, {"error": str(exc)})
            return
        response = {"ok": True, "expiresIn": AUTH_CODE_TTL_SEC, "code": code, "debugCode": code}
        self.send_json(200, response)

    def handle_auth_verify_code(self):
        if not request_origin_allowed(self.headers):
            self.send_json(403, {"error": "来源校验失败"})
            return
        length = int(self.headers.get("Content-Length", "0") or "0")
        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            email = canonical_email(payload.get("email"))
            user, token = consume_verification_code(email, str(payload.get("code") or "").strip())
        except ValueError as exc:
            self.send_json(400, {"error": str(exc)})
            return
        self.send_json(200, {"user": user}, {"Set-Cookie": session_cookie(token)})

    def handle_auth_logout(self):
        cookie = self.headers.get("Cookie") or ""
        match = re.search(r"(?:^|;\s*)" + re.escape(AUTH_COOKIE_NAME) + r"=([^;]+)", cookie)
        if match:
            with auth_db() as conn:
                conn.execute("UPDATE sessions SET revoked_at=? WHERE token_hash=? AND revoked_at IS NULL", (time.time(), token_hash(match.group(1))))
        self.send_json(200, {"ok": True}, {"Set-Cookie": session_cookie("", 0)})

    def handle_auth_profile(self):
        user = self.require_user()
        if not user:
            return
        if not request_origin_allowed(self.headers):
            self.send_json(403, {"error": "来源校验失败"})
            return
        length = int(self.headers.get("Content-Length", "0") or "0")
        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            traveler_name = str(payload.get("travelerName") or "").strip()[:12]
        except Exception:
            self.send_json(400, {"error": "资料格式错误"})
            return
        with auth_db() as conn:
            conn.execute("UPDATE users SET traveler_name=? WHERE id=?", (traveler_name, user["id"]))
        user["traveler_name"] = traveler_name
        self.send_json(200, {"user": user})


def run_server(port=DEFAULT_PORT, host="0.0.0.0"):
    global _COUNTER_PATH
    JOBS_DIR.mkdir(parents=True, exist_ok=True)
    EVENTS_DIR.mkdir(parents=True, exist_ok=True)
    _COUNTER_PATH = EVENTS_DIR / "_counter.json"
    backfill_sync_ids()
    httpd = ThreadingHTTPServer((host, int(port)), TravelBookHandler)
    print(f"Travel Book server v2: http://{host}:{port}/ (主 agent: {MAIN_AGENT} {MAIN_AGENT_PROVIDER}/{MAIN_AGENT_MODEL})", flush=True)
    httpd.serve_forever()


def main(argv=None):
    argv = argv if argv is not None else sys.argv[1:]
    port = int(argv[0]) if argv else DEFAULT_PORT
    run_server(port)


if __name__ == "__main__":
    main()
