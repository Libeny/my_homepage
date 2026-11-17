# 主站托管与发布

## 迁移范围

- 日期：2026-11-18。
- 内容基线：`50bc041ff69671e2ebf3518e8836a938abcc5307`，即迁移前线上版本。
- 主站域名：`mupath.xyz`。
- 服务器公网 IP：`8.152.220.135`。
- 本次只迁移已有内容，不发布本地尚未提交的扭蛋机页面、FastAPI 后端或其他开发内容。
- 没有修改卜灵 API、旅册隧道、邮件 MX/TXT 或其他子域名记录。

## 当前访问路径

```text
访客 HTTPS
  → Cloudflare（mupath.xyz，Proxied）
  → 8.152.220.135:80（Nginx Proxy Manager，代理主机 ID 4）
  → 172.17.0.1:18081（宿主机 Nginx）
  → /opt/mupath-homepage/current
```

站点配置来源为 `deploy/homepage.nginx.conf`。宿主机安装位置为 `/etc/nginx/conf.d/mupath-homepage.conf`。

`18081` 只监听本机、Docker 网桥和 Tailscale 地址，不对公网地址监听。既有 Nginx Proxy Manager 继续占用公网 80/443 端口。本轮没有新增应用后端常驻进程。

### HTTPS 边界

本轮沿用 Cloudflare 现有的 **Flexible** 模式。访客到 Cloudflare 使用 HTTPS；Cloudflare 到源站使用 HTTP。迁移没有调整全域 SSL 模式，以免改变既有 `api.mupath.xyz` 的访问方式。

后续如改为 Full (strict)，必须先为相关源站配置有效证书，并分别验证主站与 API，再切换模式。

## 备案核验

阿里云「我的备案」页面确认：

- 网站域名：`mupath.xyz`。
- 网站名称：旅行助手网站。
- 网站备案号：京ICP备2026025883号-2。
- 订单状态：管局审核通过。
- 对应服务器公网 IP：`8.152.220.135`。

本次无需新增备案。首页保留个人主页内容，并在标题和页脚展示现有备案名称；页脚新增备案号及工信部链接。若未来更换登记名称，通过阿里云「变更备案」处理，不能把已有 App 备案号用于网站页脚。

官方说明：

- [备案服务器检查](https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/icp-filing-server-access-information-check)
- [备案信息专项核查](https://help.aliyun.com/zh/icp-filing/basic-icp-service/special-verification-icp-registration-information)
- [变更备案](https://help.aliyun.com/zh/icp-filing/basic-icp-service/change-the-record)

新增可见文字后，本轮重新运行字体脚本，并检查 7 个 Noto 字体对备案名称与备案号的字符覆盖。生成的 `fonts.css` 内容与原版一致；字体文件随本次页面改动一起提交。

## 发布目录与备份

```text
/opt/mupath-homepage/
  releases/20261118-50bc041-icp/   # 本轮发布文件
  current -> releases/20261118-50bc041-icp/
  manifests/20261118-50bc041-icp.json
  backups/npm-before-mupath-20261118.sqlite
```

备份目录仅 root 可访问。站点目录、子目录及文件必须对 Nginx 用户可读；归档解压后的子目录权限必须单独检查。

发布包不包含仓库隐藏文件、根目录的运维指令、`docs/`、`scripts/`、部署配置或 Python 服务端。Nginx 另行拒绝访问隐藏路径、环境变量文件、数据库、密钥和相关源代码文件。

当前不是自动部署。后续发布须从已确认的干净提交构建发布包，上传到新的 `releases/` 目录，检查文件清单，再原子切换 `current`。有可见文字变更时，先生成字体子集。修改 Nginx 配置后先运行 `nginx -t`，再 reload；reload 返回后仍须重新请求站点验证，不能仅凭配置检查通过判断站点可用。

## 验证方法

```bash
curl -I https://mupath.xyz/
curl https://mupath.xyz/health
curl https://api.mupath.xyz/health
curl -H 'Range: bytes=0-63' -I https://mupath.xyz/assets/intro-avatar.webm
```

主站响应应包含 `X-MuPath-Origin: aliyun`。主站健康检查应返回 `status=ok`、`service=mupath-homepage`。既有 API 健康检查应继续返回 `service=muyu-api`。

Cloudflare 保留原有邮箱保护功能，会改写邮件链接并插入解码脚本。因此公网首页不以原始字节哈希一致作为验收标准；源站文件按 SHA-256 校验，公网首页按去除既有邮箱保护改写后的 HTML 语义校验。

切换后的验证结果见本文件末尾的执行记录。

## 回退

GitHub Pages 配置与仓库 `CNAME` 保留。若主站必须回退，在 Cloudflare 恢复根域名的以下四条 A 记录，并移除指向 `8.152.220.135` 的根域名 A 记录：

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

四条记录原配置均为 Proxied，TTL 为 Auto。不要调整 API、邮件或其他子域名记录。恢复后验证公网首页，再决定是否停用 NPM 主站代理。后续服务器内的版本回退只需把 `current` 原子切换到上一个已验证的发布目录。

## 后续技术选型

本轮仍为现有静态页面。后续复杂交互可以评估 Vite + React + TypeScript，后端单独提供 API；Vite 构建产物仍可交给当前 Nginx 托管。该建议不代表已经完成 React 改造。不要在生产使用 `vite preview`，参见 [Vite 部署说明](https://vite.dev/guide/static-deploy.html)。

## 执行记录

2026-11-18 实测结果：

- 服务器发布清单包含 278 个文件，文件 SHA-256 校验全部一致。
- 私网对 278 个发布文件逐项 HEAD 检查，全部返回 200。
- 公网检查 25 个 HTML 文件和 4 个资源，共 29 个 URL，全部返回 200，且都带有阿里云源站标记。
- 公网首页在还原既有 Cloudflare 邮箱保护后，HTML 语义与发布文件一致。
- 公网字体样本 `noto-sans-sc-400.woff2` 与发布清单的 SHA-256 一致。
- 视频范围请求返回 206，读取 64 字节。
- 仓库隐藏文件、`server/.env`、运维指令和脚本的访问均返回 404。
- 02:47:56、02:48:03、02:48:11 三轮公网健康检查中，主站与既有 API 全部返回 200，服务状态均为 `ok`。
- DNS API 确认根域名仅保留 `8.152.220.135` 这一条 Proxied A 记录；另外 9 条记录保持不变。
- 宿主机和 NPM 的 Nginx 配置检查通过；宿主机 Nginx 与 `muyu@blue` 服务处于 active。

本轮验证范围为文件完整性、HTTP、资源传输、配置和健康检查；没有重新执行所有历史页面的交互测试。页面主体内容和交互代码沿用迁移前版本。

全站缓存清理请求因现有授权范围返回 401，未扩展令牌权限。随后直接验证了上述公网 URL、字体内容与源站标记，没有发现样本仍从旧源站返回的情况。
