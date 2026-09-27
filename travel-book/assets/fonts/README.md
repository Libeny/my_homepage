# assets/fonts/ —— 全站自托管字体子集

本站字体**不依赖 Google Fonts**（国内不可达），全部自托管在这个目录。
页面只需一行引用：`<link rel="stylesheet" href="assets/fonts/fonts.css">`

## 文件是什么

- `fonts.css`：所有 `@font-face` 声明（自动生成，勿手改）
- `noto-sans-sc-*.woff2` / `noto-serif-sc-*.woff2`：中文子集，**只包含站内页面实际用到的字符**（约 1200 字），每字重 600–860 KB
- `caveat/kalam/fira-code/fraunces-*.woff2`：西文字体 latin 整片（12–79 KB）

## ⚠️ 新增文字后要重新生成子集

子集只覆盖生成时站内已有的字符。**改了文章、加了新汉字/新页面后**：

```bash
# 只需第一次准备环境：
python3 -m venv /tmp/mupath-fonts-venv
/tmp/mupath-fonts-venv/bin/pip install fonttools brotli

# 每次更新文字后：
/tmp/mupath-fonts-venv/bin/python scripts/build-font-subsets.py
```

跑完把 `assets/fonts/` 的变更一起 git 提交。

**忘了重跑也不会出事故**：缺字会回退成系统字体显示（PingFang SC / 雅黑），
不乱码、不出豆腐块，只是风格不统一，下次顺手重跑即可。

## 细节备忘

- 源文件来自 fonts.loli.net 镜像的 css2 API，缓存于 `.font-cache/`（不入 git）；
  换镜像用 `FONT_MIRROR` 环境变量。
- 完整原理与配置说明见 `scripts/build-font-subsets.py` 顶部注释。
- emoji（⚡✦🐻 等）不在 Noto 字体里，始终由系统字体渲染（与 Google 时代一致）。
