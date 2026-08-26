# 发布约束

本站使用 `assets/fonts/` 下的自托管字体子集，不依赖在线字体服务。

只要新增或修改任何页面中的可见文字（尤其是中文、日文或新的英文字符），发布前必须重新生成字体子集，并将生成产物一并纳入发布包：

```bash
python3 -m venv /tmp/mupath-fonts-venv  # 首次需要
/tmp/mupath-fonts-venv/bin/pip install fonttools brotli
/tmp/mupath-fonts-venv/bin/python scripts/build-font-subsets.py
```

必须随页面改动一起提交：

- `assets/fonts/*.woff2`
- `assets/fonts/fonts.css`

不要手动编辑 `assets/fonts/fonts.css`。字体脚本与完整说明见 `scripts/build-font-subsets.py` 和 `assets/fonts/README.md`。
