<img src="https://github.com/user-attachments/assets/be41a673-8a3d-4c88-8b44-b839b9ab660c" width="49%">
<img src="https://github.com/user-attachments/assets/7534a7e7-c45a-4813-9210-2fc66c686164" width="49%">

# NSMusicS 工作区

语言版本：[English](README.md) | [中文](README.zh-CN.md)

NSMusicS 是一个面向本地音乐库、私有云音乐和自建流媒体生态的跨平台音乐客户端项目。  
与之配套的服务端 [NineSong](https://github.com/Super-Badmen-Viper/NineSong) 提供云原生后端能力，当前以音乐场景为核心，后续也会逐步扩展到视频、相册、笔记、文档等更完整的个人数字中心场景。

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Super-Badmen-Viper/NSMusicS)

## 当前发布与路线图

截至 2026 年 4 月 9 日：

- 最新的 Windows 版本已经上架微软商城。
- 微软商城网页链接：[https://apps.microsoft.com/detail/9N0RWS2TJXG1](https://apps.microsoft.com/detail/9N0RWS2TJXG1)
- Windows 商店深链：`ms-windows-store://pdp/?productid=9N0RWS2TJXG1`
- Windows 版本当前支持 15 天免费试用。
- 当前 Electron 与 Web 交付线属于过渡版本，用来承接下一代客户端矩阵正式落地前的这一段真空期。
- 下一轮重构后的客户端版本，当前目标时间为 2026 年 5 月中旬左右。
- 下一轮版本计划包含 React、React Native、Vue、Angular 四条客户端线。
- 其中对应的 Electron / Web 客户端会分别遵循各自技术栈官方与社区推荐的最佳实现范式，而不是强行维持单一统一风格。
- macOS / iOS 的 App Store 版本，以及 Android 的 Google Play 版本，是下一阶段的发布重点。
- 产品方向仍然围绕本地音乐库、私有云音乐、主流自建音乐服务器兼容，以及与 [NineSong](https://github.com/Super-Badmen-Viper/NineSong) 的更深度整合持续推进。

如果你想先体验面向用户的最新正式版本，优先从微软商城开始。  
如果你想了解架构、规划和生态方向，这个仓库仍然是当前最主要的工作区入口。

## 为什么是 NSMusicS

NSMusicS 面向的，不是只有一个文件夹的简单曲库，而是已经分散到多个来源的音乐资产。

- 支持本地音乐库和私有云音乐场景。
- 兼容 Navidrome、Jellyfin、Emby 等主流自建音乐服务器。
- 目标不是做单一来源播放器，而是做统一音乐入口。
- 更重视大规模曲库下的搜索、管理、标签、评分、播放列表和歌词体验。
- 不只停留在基础播放，还覆盖无损格式、歌词精度、音效处理、沉浸式播放和主题个性化。

截至 2026 年 3 月 22 日，NSMusicS 主开源仓库已经达到 2265 GitHub Star。  
整条产品线先通过开源版本建立口碑，再逐步推进现在的重构路线。

## 产品规划

当前规划重点包括：

- 当前 Electron / Web 版本继续作为过渡版本，承接正式重构版上线前的发布需求。
- 重构后的 NSMusicS 客户端矩阵，当前目标时间为 2026 年 5 月中旬左右。
- 并行推进 React、React Native、Vue、Angular 四条客户端实现线。
- 重构后的 Electron / Web 客户端会按照各自技术栈及其社区推荐实践分别实现。
- 持续推进与 NineSong 深度联动的客户端与云端体验。
- 持续扩展 Windows、macOS、iOS、Android、Linux，以及更后续的 HarmonyOS 方向。
- 继续强化本地曲库、私有云音乐和更广泛的自建媒体工作流支持。

## 生态组件

### NSMusicS Electron

当前桌面端方向覆盖：

- Windows
- macOS
- Linux
- Docker 相关桌面与 Web 邻接场景

当前状态：

- 这是当前对外发布的过渡客户端线。
- 在 React、React Native、Vue、Angular 新客户端矩阵正式发布前，它仍然承担现阶段交付任务。
- 当前过渡期内，Web 镜像与 Docker 交付仍然是重要组成部分。

当前重点能力包括：

- 音乐库管理
- 兼容 NineSong、Navidrome、Jellyfin、Emby
- 本地音乐库播放
- 专业化播放体验
- 国际化
- 后台与托盘播放

### NineSong 服务端

[NineSong](https://github.com/Super-Badmen-Viper/NineSong) 是与 NSMusicS 配套的服务端基础。  
相较于常规音乐服务器，它的方向更强调：

- 更完整的音乐库管理
- 更深入的元数据与标签工作流
- 更贴近音乐场景的搜索体验
- CUE 等更专业的播放与文件组织能力
- 基于用户数据和元数据的推荐能力
- 面向更完整个人数字中心的长期架构

公开 README 参考文档：

- 英文参考：[doc/NineSong_Open_Source_Reference.md](doc/NineSong_Open_Source_Reference.md)
- 中文参考：[doc/NineSong_Open_Source_Reference.zh-CN.md](doc/NineSong_Open_Source_Reference.zh-CN.md)

状态说明：

- 按你提供的 NineSong 开源 README 快照，公开的 NineSong 后端仓库应更适合理解为“冻结的公开快照”，而不是持续更新的开源后端主仓库。

如果你想查看服务端的详细能力、部署包和后续路线，请直接参考 NineSong 仓库：

- NineSong 仓库：https://github.com/Super-Badmen-Viper/NineSong
- NineSong Releases：https://github.com/Super-Badmen-Viper/NineSong/releases/

### NSMusicS Flutter

Flutter 产品线代表下一阶段的重要跨平台客户端方向，主要面向：

- Android
- iOS
- Windows
- macOS

当前路线图预计约两个月后推出重构版，移动端商店发布则会跟随 Windows 已上线节奏继续推进。

## 下载入口

- Windows 正式版：[Microsoft Store 网页版](https://apps.microsoft.com/detail/9N0RWS2TJXG1)
- Windows 商店深链：`ms-windows-store://pdp/?productid=9N0RWS2TJXG1`
- Electron Releases：https://github.com/Super-Badmen-Viper/NSMusicS/releases
- Web 镜像 Docker 镜像：https://hub.docker.com/r/xiangch007/nsmusics
- 旧版 WPF Releases：https://github.com/Super-Badmen-Viper/NSMusicS_WPF/releases/tag/NSMusicS_Win(WPF)_0.9.0
- NineSong Releases：https://github.com/Super-Badmen-Viper/NineSong/releases/

## 截图

- NSMusicS Electron 当前仍在持续开发中。
- 当前预览如下：

<img src="doc/Web (0).png" width="49.5%"><img src="doc/Web (1).png" width="49.5%">
<img src="doc/Web (2).png" width="49.5%"><img src="doc/Web (3).png" width="49.5%">
<img src="doc/Web (4).png" width="49.5%"><img src="doc/Web (5).png" width="49.5%">

## 版本矩阵

| 项目 | 状态 | 技术栈 | 平台 | 许可证 |
| --- | --- | --- | --- | --- |
| [NSMusicS Desktop and Docker](https://github.com/Super-Badmen-Viper/NSMusicS) | 过渡版本 | Electron、Node.js、Vue、TypeScript、SQLite、Docker | Windows、Linux、Docker、macOS | AGPL-3.0，商业使用限制以项目说明为准 |
| [NineSong](https://github.com/Super-Badmen-Viper/NineSong) | 公开快照（冻结） | Go、MongoDB、Gin、JWT、SQLite、Docker | Docker | AGPL-3.0，商业使用限制以项目说明为准 |
| NineSongAI | 持续更新 | Java、MongoDB、Spring Boot、MySQL、Docker | Docker | AGPL-3.0，商业使用限制以项目说明为准 |
| NineSongPro | 持续更新 | Java、MongoDB、Spring Cloud Alibaba、MySQL、Docker | Docker | AGPL-3.0，商业使用限制以项目说明为准 |
| NSMusicS For Flutter | 持续更新 | Flutter、Dart | Android、iOS、Windows、macOS | AGPL-3.0，商业使用限制以项目说明为准 |
| NSMusicS For HarmonyOS | 规划中 | ArkTS、ArkUI | HarmonyOS | AGPL-3.0，商业使用限制以项目说明为准 |
| NSMusicS For Audio | 规划中 | PyTorch、Python、Jupyter、MATLAB | Docker | AGPL-3.0，商业使用限制以项目说明为准 |
| NSMusicS For Knowledge Graph | 规划中 | NebulaGraph 或 Neo4j | Docker | AGPL-3.0，商业使用限制以项目说明为准 |
| [NSMusicS WPF](https://github.com/Super-Badmen-Viper/NSMusicS_WPF) | 待重构 | .NET、C#、SQLite | Windows | AGPL-3.0，商业使用限制以项目说明为准 |

## 社区

- QQ 群 1：已满
- QQ 群 2：`610551734`

## 赞助

- 爱发电：https://afdian.com/a/fu_zi_qian

<img src="doc/sponsor.png" height="160"> <img src="doc/spomsor_weichat.jpg" height="160"> <img src="doc/spomsor_qq.jpg" height="160">

## 开发说明

### 运行 NSMusicS Electron

详细开发文档：

- 英文版：[doc/NSMusicS_Electron_Development.md](doc/NSMusicS_Electron_Development.md)
- 中文版：[doc/NSMusicS_Electron_Development.zh-CN.md](doc/NSMusicS_Electron_Development.zh-CN.md)

```sh
cd NSMusicS\NSMusicS-Electron
# node -v 20.15.0
# npm -v 10.4.0
npm install
# 或者：
cnpm install
```

本地桌面播放场景需要额外安装 MPV：

- MPV 安装地址：https://mpv.io/installation/
- Windows 解压路径：`NSMusicS\NSMusicS-Electron\resources\mpv-x86_64-20241124`
- macOS 解压路径：`NSMusicS\NSMusicS-Electron\resources\mpv-x86_64-20241124`

如果 `better-sqlite3` 需要手动重建支持：

```sh
cd NSMusicS/NSMusicS-Electron/node_modules/better-sqlite3
npm install electron-rebuild -D
```

如果你需要旧版 README 中那套完整的手动二进制替换方案，也请直接查看上面的开发文档。

运行应用：

```sh
cd NSMusicS\NSMusicS-Electron
npm run dev
```

构建应用：

```sh
cd NSMusicS\NSMusicS-Electron
npm run build
```

## 相关项目与依赖

- [Electron](https://github.com/electron/electron)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- [howler.js](https://github.com/goldfire/howler.js)
- [MPV](https://github.com/mpv-player/mpv)
- [Node-MPV](https://github.com/j-holub/Node-MPV)
- [Vue3](https://github.com/vuejs/vue)
- [go-backend-clean-architecture](https://github.com/amitshekhariitbhu/go-backend-clean-architecture)
- [node-taglib-sharp](https://github.com/benrr101/node-taglib-sharp)
- [Naive UI](https://github.com/tusen-ai/naive-ui)
- [feishin](https://github.com/jeffvli/feishin)
- [navidrome](https://github.com/navidrome/navidrome)
- [jellyfin](https://github.com/jellyfin/jellyfin)
- [emby](https://github.com/MediaBrowser/Emby)

## 说明

图片资源署名仍然保留在仓库与项目资源中。  
如需查看当前图片引用和历史依赖致谢，请直接参考：

- [doc/Historical_Attributions.md](doc/Historical_Attributions.md)
- [doc/Historical_Attributions.zh-CN.md](doc/Historical_Attributions.zh-CN.md)

## 愿景

NSMusicS 目前仍然由作者独立开发，并持续进行重构。  
长期目标，是让更多用户都能使用到免费、开源、易用，同时具备更强架构能力、更好互通性和更完整生态基础的音乐产品。

NSMusicS 的名称来自 “Nine Song Music Super”，灵感来源于《楚辞》与屈原。
