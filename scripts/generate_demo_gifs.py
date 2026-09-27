import os
import shutil
import subprocess
from playwright.sync_api import sync_playwright

CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# ----------------- DEMO 01 HTML (0ms 本地回显对比) -----------------
DEMO01_HTML = """<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="file:///Users/limuyu/work/my_homepage/assets/fonts/fonts.css">
<style>
  :root {
    --blue: #BDE7E5; --blue-deep: #3F7A77; --blue-soft: #E8F6F5;
    --yellow-soft: #FCE8EC; --ink: #694B40; --ink-light: #8B6F5C; --ink-faint: #A89488;
    --paper: #FFFDF8; --line: #E7D7C4;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #FBF2E3; font-family: 'Noto Sans SC', sans-serif;
    display: flex; justify-content: center; align-items: center; min-height: 100vh;
    padding: 24px;
  }
  .demo-container {
    width: 960px; background: #FFFDF8; border: 2px solid var(--line);
    border-radius: 16px; padding: 24px 28px;
    box-shadow: 0 10px 30px rgba(105,75,64,0.08);
  }
  .demo-title {
    font-family: 'Noto Serif SC', serif; font-size: 24px; font-weight: 900;
    color: var(--ink); margin-bottom: 18px; display: flex; justify-content: space-between; align-items: baseline;
  }
  .demo-title .hand { font-family: 'Caveat', cursive; font-size: 24px; color: var(--blue-deep); }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  
  .card {
    background: #FFF; border: 1.5px solid var(--line); border-radius: 12px;
    padding: 18px 20px; display: flex; flex-direction: column; justify-content: space-between; min-height: 250px;
  }
  .card.recommended {
    border-left: 7px solid #3F7A77; background: linear-gradient(180deg, #F0F9F8 0%, #FFF 30%);
  }
  .card.discouraged {
    border-left: 7px solid #C0392B; background: linear-gradient(180deg, #FAF1F0 0%, #FFF 30%);
  }
  .badge {
    display: inline-block; font-family: 'Fira Code', monospace; font-size: 15px; font-weight: 700;
    padding: 3px 10px; border-radius: 4px; margin-bottom: 8px;
  }
  .card.recommended .badge { background: #D8ECE9; color: #2F635E; border: 1px solid #A4CEC9; }
  .card.discouraged .badge { background: #FCE6E4; color: #93382D; border: 1px solid #E5B2AC; }
  
  .card-caption { font-size: 16px; line-height: 1.5; color: var(--ink-light); margin-bottom: 14px; }
  .card-caption strong { color: var(--ink); }

  .chat-box { min-height: 70px; display: flex; flex-direction: column; justify-content: flex-end; }
  .bubble {
    align-self: flex-end; background: #E8F6F5; border: 1.5px solid #9DD5D3;
    padding: 9px 13px; border-radius: 10px 10px 2px 10px; font-size: 16px; color: var(--ink);
    box-shadow: 0 2px 8px rgba(63,122,119,0.1); opacity: 0; transform: translateY(8px);
    transition: all 0.15s ease;
  }
  .bubble.show { opacity: 1; transform: translateY(0); }
  
  .input-row {
    display: flex; gap: 8px; align-items: center; background: #FFF;
    border: 1.5px solid var(--line); border-radius: 8px; padding: 9px 12px; margin-top: 12px;
  }
  .input-row.waiting { background: #FBF8F3; border-color: #EAC8CD; }
  .input-text {
    flex: 1; font-family: 'Fira Code', monospace; font-size: 15px; color: var(--ink);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .input-text.placeholder { color: var(--ink-faint); }
  
  .btn {
    font-family: 'Fira Code', monospace; font-size: 14px; font-weight: 700;
    padding: 6px 14px; border-radius: 6px; border: 0; cursor: pointer;
  }
  .btn.send { background: var(--ink); color: #FFF; }
  .btn.stop { background: #C0392B; color: #FFF; }
  .btn.spinner { background: #E8E2D9; color: var(--ink-light); }
  
  .click-circle {
    position: absolute; right: 26px; top: 12px; width: 30px; height: 30px; border-radius: 50%;
    background: rgba(192, 57, 43, 0.4); border: 2px solid #C0392B;
    transform: scale(0); opacity: 0;
  }
  .click-circle.pop {
    animation: popAnim 0.35s ease-out;
  }
  @keyframes popAnim {
    0% { transform: scale(0.4); opacity: 1; }
    100% { transform: scale(2.2); opacity: 0; }
  }
</style>
</head>
<body>
<div class="demo-container">
  <div class="demo-title">
    <span>DEMO 01 · 0ms 瞬间回显 vs 等待网络握手</span>
    <span class="hand">instant echo is free perceived performance</span>
  </div>
  <div class="grid-2">
    <div class="card recommended">
      <div>
        <span class="badge">✦ RECOMMENDED · 0ms 瞬间回显</span>
        <div class="card-caption">
          <strong>点击瞬间：</strong>输入框清空，消息气泡即时上屏，Send 秒切 Stop。
        </div>
      </div>
      <div>
        <div class="chat-box">
          <div id="rec-bubble" class="bubble">帮我写一封关于异步协作的说明邮件</div>
        </div>
        <div class="input-row">
          <span id="rec-input" class="input-text">帮我写一封关于异步协作的说明邮件</span>
          <button id="rec-btn" class="btn send">↑ Send</button>
        </div>
      </div>
    </div>
    <div class="card discouraged">
      <div>
        <span class="badge">✕ DISCOURAGED · 等网络握手</span>
        <div class="card-caption">
          <strong>等待握手：</strong>文字留滞输入框，转圈发呆，用户以为没点准连击三次。
        </div>
      </div>
      <div>
        <div class="chat-box" style="visibility:hidden;"><div class="bubble">占位</div></div>
        <div class="input-row waiting" style="position:relative;">
          <span id="disc-input" class="input-text">帮我写一封关于异步协作的说明邮件</span>
          <button id="disc-btn" class="btn spinner">↻ 握手中...</button>
          <div id="click-circle" class="click-circle"></div>
        </div>
      </div>
    </div>
  </div>
</div>
<script>
window.setStep = function(step) {
  const b = document.getElementById('rec-bubble');
  const i = document.getElementById('rec-input');
  const btn = document.getElementById('rec-btn');
  const c = document.getElementById('click-circle');

  if (step === 0) {
    b.className = 'bubble';
    i.className = 'input-text';
    i.innerText = '帮我写一封关于异步协作的说明邮件';
    btn.className = 'btn send';
    btn.innerText = '↑ Send';
    c.className = 'click-circle';
  } else if (step === 1) {
    b.className = 'bubble show';
    i.className = 'input-text placeholder';
    i.innerText = '问点什么...';
    btn.className = 'btn stop';
    btn.innerText = '■ Stop';
  } else if (step === 2) {
    c.className = 'click-circle pop';
  } else if (step === 3) {
    c.className = 'click-circle';
    void c.offsetWidth;
    c.className = 'click-circle pop';
  }
};
</script>
</body>
</html>
"""

# ----------------- DEMO 03 HTML (真实挂钟时间 vs 90% 伪进度条) -----------------
DEMO03_HTML = """<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="file:///Users/limuyu/work/my_homepage/assets/fonts/fonts.css">
<style>
  :root {
    --blue: #BDE7E5; --blue-deep: #3F7A77; --blue-soft: #E8F6F5;
    --yellow-soft: #FCE8EC; --ink: #694B40; --ink-light: #8B6F5C; --ink-faint: #A89488;
    --paper: #FFFDF8; --line: #E7D7C4;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #FBF2E3; font-family: 'Noto Sans SC', sans-serif;
    display: flex; justify-content: center; align-items: center; min-height: 100vh;
    padding: 24px;
  }
  .demo-container {
    width: 960px; background: #FFFDF8; border: 2px solid var(--line);
    border-radius: 16px; padding: 24px 28px;
    box-shadow: 0 10px 30px rgba(105,75,64,0.08);
  }
  .demo-title {
    font-family: 'Noto Serif SC', serif; font-size: 24px; font-weight: 900;
    color: var(--ink); margin-bottom: 18px; display: flex; justify-content: space-between; align-items: baseline;
  }
  .demo-title .hand { font-family: 'Caveat', cursive; font-size: 24px; color: var(--blue-deep); }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  
  .card {
    background: #FFF; border: 1.5px solid var(--line); border-radius: 12px;
    padding: 18px 20px; display: flex; flex-direction: column; justify-content: space-between; min-height: 250px;
  }
  .card.recommended {
    border-left: 7px solid #3F7A77; background: linear-gradient(180deg, #F0F9F8 0%, #FFF 30%);
  }
  .card.discouraged {
    border-left: 7px solid #C0392B; background: linear-gradient(180deg, #FAF1F0 0%, #FFF 30%);
  }
  .badge {
    display: inline-block; font-family: 'Fira Code', monospace; font-size: 15px; font-weight: 700;
    padding: 3px 10px; border-radius: 4px; margin-bottom: 8px;
  }
  .card.recommended .badge { background: #D8ECE9; color: #2F635E; border: 1px solid #A4CEC9; }
  .card.discouraged .badge { background: #FCE6E4; color: #93382D; border: 1px solid #E5B2AC; }
  
  .card-caption { font-size: 16px; line-height: 1.5; color: var(--ink-light); margin-bottom: 14px; }
  .card-caption strong { color: var(--ink); }

  .timer-box {
    background: #FFF; border: 1.5px solid var(--blue-deep); border-radius: 8px;
    padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;
  }
  .timer-val {
    font-family: 'Fira Code', monospace; font-variant-numeric: tabular-nums;
    font-weight: 700; font-size: 26px; color: var(--ink); letter-spacing: 0.04em;
  }
  .timer-sub { font-size: 14px; color: var(--ink-faint); margin-top: 3px; }
  .pulse-dot {
    width: 12px; height: 12px; border-radius: 50%; background: #3F7A77;
    box-shadow: 0 0 0 4px rgba(63,122,119,0.2);
  }

  .bar-box {
    background: #FFF; border: 1.5px solid #EAC8CD; border-radius: 8px;
    padding: 16px 18px;
  }
  .bar-track {
    width: 100%; height: 14px; background: #EAE3D8; border-radius: 7px; overflow: hidden;
  }
  .bar-fill {
    height: 100%; width: 0%; background: #D98880; border-radius: 7px;
    transition: width 0.3s ease;
  }
  .bar-label {
    font-family: 'Fira Code', monospace; font-size: 14px; color: #A34338; font-weight: 700;
    text-align: right; margin-top: 8px;
  }
</style>
</head>
<body>
<div class="demo-container">
  <div class="demo-title">
    <span>DEMO 03 · 真实已逝时间 vs 90% 虚假进度条</span>
    <span class="hand">elapsed time is honest, fake bars are deceitful</span>
  </div>
  <div class="grid-2">
    <div class="card recommended">
      <div>
        <span class="badge">✦ RECOMMENDED · 真实已逝挂钟时间</span>
        <div class="card-caption">
          <strong>真实挂钟秒数（Wall Time）：</strong>等宽数字稳步跳动，向用户证明系统依然持续活跃。
        </div>
      </div>
      <div>
        <div class="timer-box">
          <div>
            <div id="timer-val" class="timer-val">00:00.0s</div>
            <div class="timer-sub">检索并提取上下文节点 (Wall Time)</div>
          </div>
          <div class="pulse-dot"></div>
        </div>
      </div>
    </div>
    <div class="card discouraged">
      <div>
        <span class="badge">✕ DISCOURAGED · 虚假伪进度条</span>
        <div class="card-caption">
          <strong>停滞在 90% 的谎言：</strong>快速飙到 90% 然后永久静止，用户不知是死是活。
        </div>
      </div>
      <div>
        <div class="bar-box">
          <div class="bar-track">
            <div id="bar-fill" class="bar-fill"></div>
          </div>
          <div id="bar-label" class="bar-label">0% STARTING</div>
        </div>
      </div>
    </div>
  </div>
</div>
<script>
window.setTime = function(sec, barPercent, barText) {
  const t = document.getElementById('timer-val');
  const bf = document.getElementById('bar-fill');
  const bl = document.getElementById('bar-label');

  t.innerText = `00:${sec.toFixed(1).padStart(4, '0')}s`;
  bf.style.width = barPercent + '%';
  bl.innerText = barText;
};
</script>
</body>
</html>
"""

def render_demo01_gif(out_path):
    temp_dir = "/tmp/demo01_frames"
    shutil.rmtree(temp_dir, ignore_errors=True)
    os.makedirs(temp_dir, exist_ok=True)

    html_file = "/tmp/demo01.html"
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(DEMO01_HTML)

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME_PATH, headless=True)
        page = browser.new_page(viewport={"width": 1020, "height": 420}, device_scale_factor=2)
        page.goto(f"file://{html_file}", wait_until="networkidle")
        page.wait_for_timeout(300)

        f_idx = 0
        # Phase 1: 准备点击 (8 帧)
        page.evaluate("window.setStep(0)")
        for _ in range(8):
            page.screenshot(path=f"{temp_dir}/f_{f_idx:04d}.png")
            f_idx += 1

        # Phase 2: 0ms 瞬间回显发生！左侧气泡上屏，输入框清空，Stop 呈现 (14 帧)
        page.evaluate("window.setStep(1)")
        for _ in range(12):
            page.screenshot(path=f"{temp_dir}/f_{f_idx:04d}.png")
            f_idx += 1

        # Phase 3: 右侧等不及了，狂点第一次 (7 帧)
        page.evaluate("window.setStep(2)")
        for _ in range(7):
            page.screenshot(path=f"{temp_dir}/f_{f_idx:04d}.png")
            f_idx += 1

        # Phase 4: 右侧狂点第二次 (12 帧)
        page.evaluate("window.setStep(3)")
        for _ in range(12):
            page.screenshot(path=f"{temp_dir}/f_{f_idx:04d}.png")
            f_idx += 1

        browser.close()

    cmd = [
        "ffmpeg", "-y", "-framerate", "10",
        "-i", f"{temp_dir}/f_%04d.png",
        "-vf", "split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer",
        out_path
    ]
    subprocess.run(cmd, check=True)
    print(f"Created: {out_path}")

def render_demo03_gif(out_path):
    temp_dir = "/tmp/demo03_frames"
    shutil.rmtree(temp_dir, ignore_errors=True)
    os.makedirs(temp_dir, exist_ok=True)

    html_file = "/tmp/demo03.html"
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(DEMO03_HTML)

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME_PATH, headless=True)
        page = browser.new_page(viewport={"width": 1020, "height": 420}, device_scale_factor=2)
        page.goto(f"file://{html_file}", wait_until="networkidle")
        page.wait_for_timeout(300)

        f_idx = 0
        # 模拟 0s 到 8s
        # 左侧匀速跳秒 0.0 -> 7.8
        # 右侧在前 1.5s 猛冲到 90%，之后死死卡在 90%
        timeline = [
            (0.0, 0, "0% STARTING"),
            (0.4, 30, "30% LOADING..."),
            (0.8, 65, "65% PARSING..."),
            (1.2, 85, "85% FAST..."),
            (1.6, 90, "STALLED AT 90% 假死？"),
            (2.2, 90, "STALLED AT 90% 假死？"),
            (3.0, 90, "STALLED AT 90% 纹丝不动"),
            (4.2, 90, "STALLED AT 90% 怎么还不动？"),
            (5.5, 90, "STALLED AT 90% 崩溃了吗？"),
            (6.8, 90, "STALLED AT 90% 产生退弹冲动"),
            (7.8, 90, "STALLED AT 90% 信任崩塌"),
        ]

        for sec, bar_pct, bar_txt in timeline:
            page.evaluate(f"window.setTime({sec}, {bar_pct}, '{bar_txt}')")
            repeat = 5 if sec >= 1.6 else 3
            for _ in range(repeat):
                page.screenshot(path=f"{temp_dir}/f_{f_idx:04d}.png")
                f_idx += 1

        browser.close()

    cmd = [
        "ffmpeg", "-y", "-framerate", "10",
        "-i", f"{temp_dir}/f_%04d.png",
        "-vf", "split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer",
        out_path
    ]
    subprocess.run(cmd, check=True)
    print(f"Created: {out_path}")

if __name__ == "__main__":
    out_dir = "/Users/limuyu/Desktop/wait-xhs-cards"
    render_demo01_gif(os.path.join(out_dir, "demo-01-instant-echo.gif"))
    render_demo03_gif(os.path.join(out_dir, "demo-03-honest-timer.gif"))
