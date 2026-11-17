# 木鱼的个人主页

线上地址：<https://mupath.xyz/>。

## 当前托管方式

2026-11-18，主站从 GitHub Pages 迁移到现有阿里云服务器。

访问路径：Cloudflare → 阿里云 Nginx Proxy Manager → 宿主机 Nginx → 静态页面和资源。

GitHub 继续管理源码。GitHub Pages 和 `CNAME` 保留为回退入口。向 GitHub 推送代码不会自动更新阿里云发布目录；当前发布步骤、验证与回退方式见 [托管运维说明](docs/ops/hosting.md)。

本次迁移保留原有 HTML、CSS、JavaScript 和内容，不包含尚在本地开发的扭蛋机及其后端。

## 备案

域名 `mupath.xyz` 已在阿里云完成备案，备案名称为「旅行助手网站」，备案号为「京ICP备2026025883号-2」。首页标题和页脚展示备案名称，页脚备案号链接到工信部查询平台。

## 字体

页面使用 `assets/fonts/` 中的自托管字体。可见文字有变化时，运行 `scripts/build-font-subsets.py`，并一并提交生成的字体与 `fonts.css`。具体说明见 [字体说明](assets/fonts/README.md)。
