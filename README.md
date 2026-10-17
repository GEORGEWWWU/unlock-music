# unlock-music

浏览器端的音乐解锁工具 —— [unlock-music](https://git.unlock-music.dev/um/web) Web 版 `1.10.8` 的构建产物整理版。

原始的 Vue 源码已经丢失，本仓库是把 vue-cli 打包产物（webpack bundle）格式化整理成可读前端代码后的版本，并且做了**完全离线化**改造：**页面不发起任何外部网络请求**，解密、元信息、封面全部在浏览器本地完成，文件不会上传。

## 特性

- 纯前端、纯本地：无后端、无接口、无埋点、无 CDN 依赖
- 多线程 Worker 解密（`navigator.hardwareConcurrency` 个 worker）
- 曲目信息与封面取自音频文件自身的标签（ID3v2 `TIT2/TPE1/TALB/APIC`、FLAC Vorbis Comment + `METADATA_BLOCK_PICTURE`）
- 支持批量拖拽、命名格式切换、立即保存、音频试听

## 支持的加密格式

| 来源 | 扩展名 |
| --- | --- |
| 网易云音乐 | `.ncm` |
| QQ 音乐 | `.qmc0` `.qmc3` `.qmcflac` `.qmcogg` `.mflac` `.mgg` |
| 酷狗音乐 | `.kgm` `.kgma` `.vpr` |
| 虾米音乐 | `.tm0` `.tm2` `.tm3` `.tm6` |
| JOOX | 需在「解密设定」里填入 32 位应用 UUID（本地保存，无需联网） |

## 目录结构

```
.
├── index.html          # 入口（可读格式）
├── js/                 # app / chunk-vendors / worker（均已格式化）
├── css/                # 样式
├── img/ fonts/         # 图标与字体（Element UI 图标字体，本地文件）
├── loader.js           # 首屏加载动画与浏览器检测
├── serve.js            # 本地预览用静态服务器（无依赖）
├── service-worker.js   # 已停用，仅保留自我注销的空实现
└── original/           # 原始未修改的压缩版，仅供对照
```

## 本地运行

```bash
node serve.js          # 默认 http://127.0.0.1:8123
node serve.js 9000     # 指定端口
```

> 请通过 http 访问，不要用 `file://` 直接打开 `index.html`：Worker 在 `file:` 协议下不可用，解密会退回单线程队列。

## 相对于原版的改动

原版有 4 处外部网络依赖，已全部移除：

1. `POST https://um-api.ixarea.com/music/app-version` —— 启动时的版本检查 → 改为始终"无更新"
2. `GET https://um-api.ixarea.com/meta/qq-music-raw/{id}` —— QMC 文件的在线曲目信息 → 改为直接失败，走原有的本地 meta 提取分支
3. `GET https://um-api.ixarea.com/music/qq-cover` —— 在线封面搜索 → 同上，改用文件内嵌封面
4. `service-worker.js` 从 `storage.googleapis.com` 拉取 workbox → 移除 Service Worker 注册

改动只发生在这几个"取在线信息"的函数和 SW 注册处，**核心解密链路（NCM AES/RC4、QMC/KGM 的 wasm、JOOX crypto）未做任何修改**。联网与否只影响"标签缺失的文件能否补全歌名与封面"。

## 说明

- 本仓库代码为构建产物，无法还原成 `.vue` 单文件组件形式的原始工程。
- 仅供解锁**自己合法购买**的音乐文件，请遵守当地法律法规及各平台服务条款。
- 原项目基于 MIT 许可。
