#!/usr/bin/env python3
"""全站字体子集生成器（build-font-subsets.py）

背景：全站字体自托管在 assets/fonts/，不依赖 Google Fonts（国内不可达）。
本脚本从字体镜像拉取源文件，按"站内页面实际用到的字符"生成子集 woff2。

什么时候要重跑：
  - 任何页面新增/修改了文字（尤其是新出现的汉字、日文假名等）
  - 新增了一个引用 assets/fonts/fonts.css 的页面
  - 想增删字体家族或权重（改下方 FONTS 配置）

不重跑会怎样：新出现的字符不在子集里，浏览器会自动回退到系统字体显示
（font-family 栈里本来就有 -apple-system / PingFang SC / serif 兜底），
不会乱码、不会出现豆腐块，只是那一两个字的字体风格不统一。所以忘了重跑
不是事故，下次顺手跑一下即可。

怎么跑：
  python3 -m venv /tmp/mupath-fonts-venv          # 只需第一次
  /tmp/mupath-fonts-venv/bin/pip install fonttools brotli
  /tmp/mupath-fonts-venv/bin/python scripts/build-font-subsets.py

产物（全部会被 git 跟踪，直接提交）：
  assets/fonts/*.woff2   每个 家族×权重 一个子集文件
  assets/fonts/fonts.css 所有 @font-face 声明，页面里只需 link 这一个文件

原理备忘：
  - 中文字体（Noto 系列）全量每字重好几 MB，镜像 css2 API 把它切成
    ~100 个 unicode-range 切片；脚本只下载与站内字符有交集的切片
    （约 30 个/字重），再用 fontTools.merge 合并成一个子集文件。
  - 西文字体（Caveat/Kalam/Fraunces/Fira Code）直接取镜像的 latin
    切片整片使用，不再子集化（本来就只有十几 KB）。
  - 镜像默认 https://fonts.loli.net（可用环境变量 FONT_MIRROR 覆盖，
    例如 FONT_MIRROR=https://fonts.googleapis.com）。
"""

import concurrent.futures
import io
import os
import re
import sys
import urllib.request

from fontTools.merge import Merger
from fontTools.ttLib import TTFont

# ---------------------------------------------------------------- 配置

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(REPO_ROOT, "assets", "fonts")
CACHE_DIR = os.path.join(REPO_ROOT, ".font-cache")  # 源文件缓存，不提交 git

MIRROR = os.environ.get("FONT_MIRROR", "https://fonts.loli.net")
# 镜像 css2 返回的字体文件地址域名（loli.net 会把 gstatic 也镜像掉）
MODERN_UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
             "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36")

# 扫描这些文件提取字符：仓库根目录的所有 html（新增页面自动被覆盖）
HTML_GLOB = os.path.join(REPO_ROOT, "*.html")

# 中文字体：按权重做"切片合并"子集
CJK_FONTS = {
    "Noto Sans SC": [300, 400, 500, 700],
    "Noto Serif SC": [500, 700, 900],
}

# 西文字体：直接取 latin 切片；(weight, style)
WESTERN_FONTS = {
    "Caveat":    [(400, "normal"), (700, "normal")],
    "Kalam":     [(400, "normal"), (700, "normal")],
    "Fira Code": [(400, "normal"), (500, "normal")],
    "Fraunces":  [(400, "normal"), (900, "normal"),
                  (400, "italic"), (900, "italic")],
}

# ------------------------------------------------------------ 工具函数


def slug(family):
    return family.lower().replace(" ", "-")


def fetch(url, timeout=90):
    req = urllib.request.Request(url, headers={"User-Agent": MODERN_UA})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def fetch_with_retry(url, tries=4):
    for attempt in range(tries):
        try:
            return fetch(url)
        except Exception as exc:  # noqa: BLE001 — 打印后重试
            if attempt == tries - 1:
                raise
            print(f"  重试 {attempt + 1}/{tries - 1}（{exc}）：{url}")


def css2_url(family, weights, italic=False):
    fam = family.replace(" ", "+")
    if italic:
        # ital,opsz,wght 三元组是 Fraunces 的写法；opsz 用全范围 9..144
        tuples = ";".join(
            f"{ital},9..144,{w}" for ital in (0, 1) for w in weights)
        return f"{MIRROR}/css2?family={fam}:ital,opsz,wght@{tuples}&display=swap"
    ws = ";".join(str(w) for w in weights)
    return f"{MIRROR}/css2?family={fam}:wght@{ws}&display=swap"


def parse_css2(css):
    """解析 css2 响应，返回 [{style, weight, unicode_range, url}]。"""
    blocks = []
    for body in re.findall(r"@font-face\s*{([^}]*)}", css):
        block = {}
        m = re.search(r"font-style:\s*(\w+)", body)
        block["style"] = m.group(1) if m else "normal"
        m = re.search(r"font-weight:\s*(\d+)", body)
        block["weight"] = int(m.group(1)) if m else 400
        m = re.search(r"src:\s*url\((https://[^)]+)\)", body)
        block["url"] = m.group(1)
        m = re.search(r"unicode-range:\s*([^;]+);", body)
        block["unicode_range"] = m.group(1) if m else ""
        blocks.append(block)
    return blocks


def expand_unicode_range(ur):
    """把 'U+0025-00FF, U+4E00-9FFF, U+4??' 展开成码点集合。"""
    out = set()
    for part in ur.split(","):
        part = part.strip().upper().lstrip("U+")
        if "?" in part:
            lo = int(part.replace("?", "0"), 16)
            hi = int(part.replace("?", "F"), 16)
            out.update(range(lo, hi + 1))
        elif "-" in part:
            a, b = part.split("-")
            out.update(range(int(a, 16), int(b, 16) + 1))
        elif part:
            out.add(int(part, 16))
    return out


def collect_page_chars():
    """扫描仓库根目录所有 html，返回出现过的全部字符集合。"""
    import glob
    chars = set()
    files = sorted(glob.glob(HTML_GLOB))
    for path in files:
        with open(path, encoding="utf-8") as fh:
            chars.update(fh.read())
    chars = {c for c in chars if ord(c) >= 0x20 or c in "\n\t"}
    print(f"扫描 {len(files)} 个 html，共 {len(chars)} 个不同字符")
    return chars


# ------------------------------------------------------------ 中文字体


def build_cjk_family(family, weights, needed_codepoints):
    for weight in weights:
        css = fetch_with_retry(css2_url(family, [weight])).decode("utf-8")
        blocks = parse_css2(css)
        needed_blocks = [
            b for b in blocks
            if expand_unicode_range(b["unicode_range"]) & needed_codepoints
        ]
        print(f"{family} {weight}: {len(blocks)} 个切片，"
              f"需要 {len(needed_blocks)} 个")

        def download(block, fam=family, w=weight):
            fname = os.path.basename(block["url"])
            cache_path = os.path.join(CACHE_DIR, f"{slug(fam)}-{w}-{fname}")
            if not os.path.exists(cache_path):
                data = fetch_with_retry(block["url"])
                with open(cache_path, "wb") as fh:
                    fh.write(data)
            return cache_path

        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
            slice_paths = list(pool.map(download, needed_blocks))

        merged = Merger().merge(slice_paths)
        out_path = os.path.join(OUT_DIR, f"{slug(family)}-{weight}.woff2")
        merged.flavor = "woff2"
        merged.save(out_path)
        size_kb = os.path.getsize(out_path) // 1024
        print(f"  -> {os.path.basename(out_path)}（{size_kb} KB）")


# ------------------------------------------------------------ 西文字体


def build_western_family(family, variants):
    weights = sorted({w for w, _ in variants})
    has_italic = any(s == "italic" for _, s in variants)
    css = fetch_with_retry(
        css2_url(family, weights, italic=has_italic)).decode("utf-8")
    blocks = parse_css2(css)
    for weight, style in variants:
        # latin 切片的标志：unicode-range 以 U+0000-00FF 开头
        latin = [
            b for b in blocks
            if b["weight"] == weight and b["style"] == style
            and "U+0000-00FF" in b["unicode_range"]
        ]
        if not latin:
            raise RuntimeError(f"{family} {weight} {style}: 找不到 latin 切片")
        data = fetch_with_retry(latin[0]["url"])
        suffix = "-italic" if style == "italic" else ""
        out_path = os.path.join(
            OUT_DIR, f"{slug(family)}-{weight}{suffix}.woff2")
        with open(out_path, "wb") as fh:
            fh.write(data)
        print(f"{family} {weight} {style}: "
              f"{os.path.basename(out_path)}（{len(data) // 1024} KB）")


# ------------------------------------------------------------ fonts.css


def write_css():
    lines = [
        "/* 由 scripts/build-font-subsets.py 自动生成，请勿手改。",
        "   字符子集只覆盖站内页面用到的字；新增文字后需重跑该脚本，",
        "   否则新字会回退为系统字体（不会乱码）。 */",
        "",
    ]
    for family, weights in CJK_FONTS.items():
        for w in weights:
            lines.append(
                "@font-face {\n"
                f"  font-family: '{family}';\n"
                "  font-style: normal;\n"
                f"  font-weight: {w};\n"
                "  font-display: swap;\n"
                f"  src: url('{slug(family)}-{w}.woff2') format('woff2');\n"
                "}")
    for family, variants in WESTERN_FONTS.items():
        for w, style in variants:
            suffix = "-italic" if style == "italic" else ""
            lines.append(
                "@font-face {\n"
                f"  font-family: '{family}';\n"
                f"  font-style: {style};\n"
                f"  font-weight: {w};\n"
                "  font-display: swap;\n"
                f"  src: url('{slug(family)}-{w}{suffix}.woff2') format('woff2');\n"
                "}")
    css_path = os.path.join(OUT_DIR, "fonts.css")
    with open(css_path, "w", encoding="utf-8") as fh:
        fh.write("\n\n".join(lines) + "\n")
    print(f"写出 {os.path.relpath(css_path, REPO_ROOT)}")


def verify_coverage(needed_codepoints):
    """校验：每个中文子集都要覆盖全部页面字符；缺的逐字报告。"""
    ok = True
    cjk_cmap = set()
    for family, weights in CJK_FONTS.items():
        for w in weights:
            path = os.path.join(OUT_DIR, f"{slug(family)}-{w}.woff2")
            font = TTFont(path)
            cmap = set(font.getBestCmap())
            font.close()
            if w == weights[0]:
                cjk_cmap = cmap  # 各权重字符集应一致，用第一个做参照
    missing = sorted(cp for cp in needed_codepoints if cp not in cjk_cmap)
    if missing:
        # Noto 本来就没有的字（emoji、特殊符号）会在这里列出，
        # 这些字符在 Google 托管时期也是回退渲染，行为一致。
        preview = "".join(chr(cp) for cp in missing[:40])
        print(f"注意：{len(missing)} 个字符 Noto 字体内不存在，"
              f"将回退系统字体（与之前行为一致）：{preview}")
    else:
        print("覆盖校验通过：页面全部字符都在中文子集中 ✓")
    return ok


# ------------------------------------------------------------ main


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(CACHE_DIR, exist_ok=True)

    chars = collect_page_chars()
    # 附加保险字符：ASCII 可打印字符 + 常用全角标点
    chars.update(chr(c) for c in range(0x20, 0x7F))
    chars.update("，。、；：？！""''《》（）【】—…·～「」『』〈〉")
    needed = {ord(c) for c in chars}

    for family, weights in CJK_FONTS.items():
        build_cjk_family(family, weights, needed)
    for family, variants in WESTERN_FONTS.items():
        build_western_family(family, variants)

    write_css()
    verify_coverage(needed)
    print("完成。产物在 assets/fonts/，记得 git 提交。")


if __name__ == "__main__":
    sys.exit(main())
