<img src="https://github.com/user-attachments/assets/be41a673-8a3d-4c88-8b44-b839b9ab660c" width="49%">
<img src="https://github.com/user-attachments/assets/7534a7e7-c45a-4813-9210-2fc66c686164" width="49%">

# NSMusicS Workspace

Language: [English](README.md) | [Chinese](README.zh-CN.md)

NSMusicS is a cross-platform music client project for local libraries, private cloud music, and self-hosted streaming ecosystems.  
Its paired server, [NineSong](https://github.com/Super-Badmen-Viper/NineSong), provides the cloud-native backend for music today and is also intended to support broader personal digital center scenarios over time, including video, gallery, notes, documents, and more.

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Super-Badmen-Viper/NSMusicS)

## Current Release And Roadmap

As of April 9, 2026:

- The latest Windows release is already live on Microsoft Store.
- Microsoft Store web page: [https://apps.microsoft.com/detail/9N0RWS2TJXG1](https://apps.microsoft.com/detail/9N0RWS2TJXG1)
- Windows Store deep link: `ms-windows-store://pdp/?productid=9N0RWS2TJXG1`
- A 15-day free trial is currently available on Windows.
- The current Electron and Web delivery line is a transition release that keeps the project available before the next-generation client wave lands.
- The next refactored client wave is targeted for roughly mid-May 2026.
- That refactored wave is planned to include React, React Native, Vue, and Angular client lines.
- The Electron and Web variants in that wave are intended to follow the official and community-recommended best practices of each stack instead of forcing one shared implementation style across all frameworks.
- App Store releases for macOS and iOS, plus the Google Play release for Android, are planned next.
- The product direction remains centered on local music libraries, private cloud music, compatibility with major self-hosted servers, and deeper integration with [NineSong](https://github.com/Super-Badmen-Viper/NineSong).

If you want the newest production-facing build first, start from Microsoft Store.  
If you want to follow the architecture, roadmap, and ecosystem direction, this repository remains the main workspace entry point.

## Why NSMusicS

NSMusicS is designed for people whose music no longer lives in one simple folder.

- It supports local music libraries and private cloud music scenarios.
- It works with major self-hosted music servers such as Navidrome, Jellyfin, and Emby.
- It is being built as a unified music hub instead of a single-source player.
- It focuses on large-library usability through search, metadata, tags, ratings, playlists, and lyrics workflows.
- It also pushes beyond basic playback through lossless support, lyric precision, audio effects, immersive playback views, and theme customization.

As of March 22, 2026, the main NSMusicS open-source repository had reached 2,265 GitHub stars.  
The product line first built credibility through open-source distribution, then moved toward the current refactoring roadmap.

## Product Planning

The current planning direction includes:

- The current Electron/Web release line serving as the transition edition before the refactored client wave ships.
- A refactored NSMusicS client wave targeted for roughly mid-May 2026.
- Parallel client lines for React, React Native, Vue, and Angular.
- Electron and Web implementations for the refactored wave following the best-practice direction of each stack and its surrounding community.
- Continued evolution of the NineSong-backed client and cloud experience.
- Expansion of the cross-platform product line across Windows, macOS, iOS, Android, Linux, and later HarmonyOS scenarios.
- Deeper support for local libraries, private cloud music, and broader self-hosted media workflows.

## Ecosystem Components

### NSMusicS Electron

The desktop client currently covers:

- Windows
- macOS
- Linux
- Docker-oriented desktop and web-adjacent scenarios

Current status:

- This is the currently released transition client line.
- It remains the bridge release until the refactored React, React Native, Vue, and Angular client wave is published.
- Its Web mirror and Docker delivery remain important for the current transition period.

Current focus areas include:

- Music library management
- Compatibility with NineSong, Navidrome, Jellyfin, and Emby
- Local library playback
- Professional playback workflows
- Internationalization
- Background and tray playback

### NineSong Server

[NineSong](https://github.com/Super-Badmen-Viper/NineSong) is the server-side foundation paired with NSMusicS.  
Compared with conventional music servers, its direction emphasizes:

- Richer music library management
- Stronger metadata and tag workflows
- Better music-focused search behavior
- Advanced playback scenarios such as CUE-related workflows
- Recommendation capabilities based on user data and metadata
- A broader long-term personal digital center architecture

Archived public-readme references:

- English reference: [doc/NineSong_Open_Source_Reference.md](doc/NineSong_Open_Source_Reference.md)
- Chinese reference: [doc/NineSong_Open_Source_Reference.zh-CN.md](doc/NineSong_Open_Source_Reference.zh-CN.md)

Important status note:

- The archived public NineSong README describes the open-source backend repository as a frozen public snapshot rather than a continuously updated open-source backend.

If you want detailed backend capabilities, deployment packages, or server-side roadmap context, refer to the NineSong repository directly:

- NineSong repository: https://github.com/Super-Badmen-Viper/NineSong
- NineSong releases: https://github.com/Super-Badmen-Viper/NineSong/releases/

### NSMusicS Flutter

The Flutter product line represents the next major cross-platform client direction for:

- Android
- iOS
- Windows
- macOS

The current roadmap expects the refactored edition around two months later, with mobile store releases planned after the Windows track already in market.

## Downloads

- Windows production release: [Microsoft Store Web Page](https://apps.microsoft.com/detail/9N0RWS2TJXG1)
- Windows Store deep link: `ms-windows-store://pdp/?productid=9N0RWS2TJXG1`
- Electron releases: https://github.com/Super-Badmen-Viper/NSMusicS/releases
- Web mirror Docker image: https://hub.docker.com/r/xiangch007/nsmusics
- Legacy WPF release: https://github.com/Super-Badmen-Viper/NSMusicS_WPF/releases/tag/NSMusicS_Win(WPF)_0.9.0
- NineSong releases: https://github.com/Super-Badmen-Viper/NineSong/releases/

## Screenshots

- NSMusicS Electron is under active development.
- Current preview set:

<img src="doc/Web (0).png" width="49.5%"><img src="doc/Web (1).png" width="49.5%">
<img src="doc/Web (2).png" width="49.5%"><img src="doc/Web (3).png" width="49.5%">
<img src="doc/Web (4).png" width="49.5%"><img src="doc/Web (5).png" width="49.5%">

## Version Matrix

| Project | Status | Stack | Platforms | License |
| --- | --- | --- | --- | --- |
| [NSMusicS Desktop and Docker](https://github.com/Super-Badmen-Viper/NSMusicS) | Transition release | Electron, Node.js, Vue, TypeScript, SQLite, Docker | Windows, Linux, Docker, macOS | AGPL-3.0 with commercial-use restrictions noted in project docs |
| [NineSong](https://github.com/Super-Badmen-Viper/NineSong) | Frozen public snapshot | Go, MongoDB, Gin, JWT, SQLite, Docker | Docker | AGPL-3.0 with commercial-use restrictions noted in project docs |
| NineSongAI | Updating | Java, MongoDB, Spring Boot, MySQL, Docker | Docker | AGPL-3.0 with commercial-use restrictions noted in project docs |
| NineSongPro | Updating | Java, MongoDB, Spring Cloud Alibaba, MySQL, Docker | Docker | AGPL-3.0 with commercial-use restrictions noted in project docs |
| NSMusicS For Flutter | Updating | Flutter, Dart | Android, iOS, Windows, macOS | AGPL-3.0 with commercial-use restrictions noted in project docs |
| NSMusicS For HarmonyOS | Planned | ArkTS, ArkUI | HarmonyOS | AGPL-3.0 with commercial-use restrictions noted in project docs |
| NSMusicS For Audio | Planned | PyTorch, Python, Jupyter, MATLAB | Docker | AGPL-3.0 with commercial-use restrictions noted in project docs |
| NSMusicS For Knowledge Graph | Planned | NebulaGraph or Neo4j | Docker | AGPL-3.0 with commercial-use restrictions noted in project docs |
| [NSMusicS WPF](https://github.com/Super-Badmen-Viper/NSMusicS_WPF) | Needs refactor | .NET, C#, SQLite | Windows | AGPL-3.0 with commercial-use restrictions noted in project docs |

## Community

- QQ Group 1: full
- QQ Group 2: `610551734`

## Sponsorship

- Afdian: https://afdian.com/a/fu_zi_qian

<img src="doc/sponsor.png" height="160"> <img src="doc/spomsor_weichat.jpg" height="160"> <img src="doc/spomsor_qq.jpg" height="160">

## Development

### Run NSMusicS Electron

Detailed development references:

- English guide: [doc/NSMusicS_Electron_Development.md](doc/NSMusicS_Electron_Development.md)
- Chinese guide: [doc/NSMusicS_Electron_Development.zh-CN.md](doc/NSMusicS_Electron_Development.zh-CN.md)

```sh
cd NSMusicS\NSMusicS-Electron
# node -v 20.15.0
# npm -v 10.4.0
npm install
# or:
cnpm install
```

Install MPV separately for local desktop playback scenarios:

- MPV installation: https://mpv.io/installation/
- Windows unpack path: `NSMusicS\NSMusicS-Electron\resources\mpv-x86_64-20241124`
- macOS unpack path: `NSMusicS\NSMusicS-Electron\resources\mpv-x86_64-20241124`

If `better-sqlite3` needs manual rebuild support:

```sh
cd NSMusicS/NSMusicS-Electron/node_modules/better-sqlite3
npm install electron-rebuild -D
```

For the full fallback paths, including the old manual binary replacement flow, use the development guides linked above.

Run the app:

```sh
cd NSMusicS\NSMusicS-Electron
npm run dev
```

Build the app:

```sh
cd NSMusicS\NSMusicS-Electron
npm run build
```

## Related Projects And Dependencies

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

## Attribution

Image resource attributions remain available in the repository and project assets.  
For the current image list and historical dependency credits, see:

- [doc/Historical_Attributions.md](doc/Historical_Attributions.md)
- [doc/Historical_Attributions.zh-CN.md](doc/Historical_Attributions.zh-CN.md)

## Vision

NSMusicS is still being independently developed and is still being refactored.  
The long-term goal is to let more users access free, open-source, and user-friendly music products with stronger architecture, richer interoperability, and a broader ecosystem foundation.

The name NSMusicS comes from "Nine Song Music Super" and is inspired by *Chu Ci* and the legacy of Qu Yuan.
