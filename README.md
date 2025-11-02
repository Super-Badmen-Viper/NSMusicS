<img src="https://github.com/user-attachments/assets/be41a673-8a3d-4c88-8b44-b839b9ab660c" width="49%">
<img src="https://github.com/user-attachments/assets/7534a7e7-c45a-4813-9210-2fc66c686164" width="49%">

## NSMusicS | Nine Song Music : 九歌音乐
NSMusicS is a music(streaming/local) client project designed to support all platforms.  
The corresponding digital center server [NineSong](https://github.com/Super-Badmen-Viper/NineSong) is a server that is bound and paired with NSMusicS, providing high-quality cloud music services for NSMusicS. Of course, [NineSong](https://github.com/Super-Badmen-Viper/NineSong) will also provide cloud service scenarios for other application scenarios in the future (film and television videos, photo albums, novels, documents, notes).  

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Super-Badmen-Viper/NSMusicS)

While giving NSMusicS a star, please also give a star to its server, [NineSong](https://github.com/Super-Badmen-Viper/NineSong).

At the same time, NSMusicS is also compatible with various mainstream open-source streaming servers: Navidrome, Jellyfin, Emby. ....

In addition, NSMusicS also supports local mode to use local music libraries. And plan to support various types of network cloud drives，such as webdev，onedriver....

## [NineSong](https://github.com/Super-Badmen-Viper/NineSong) Server New Function
the NineSong official version 1.0.0 will be released At the end of July 2025. If you want to try using a hybrid version of NSMusicS and NineSong's Docker, you can deploy it in the NineSong project:   

[NSMusicS-Docker-0.8.0 Download](https://github.com/Super-Badmen-Viper/NineSong):
https://github.com/Super-Badmen-Viper/NineSong
Compared to other music servers (such as Navidrome, Jellyfin, Emby, Plex, Subsonic, Gonic), it offers the following [enhanced features](https://github.com/Super-Badmen-Viper/NineSong):   
- More comprehensive music library management:
- - [x] Rich single-level sorting options, supporting multi-level mixed sorting and multi-level mixed filtering;
- - [x] deeper processing of composite tags to make the relevance between musics more comprehensive;
- - [x] search jump optimization
- - - [x] Support fuzzy search based on title, album, artist, and lyrics (multiple mixed matching of Chinese Pinyin and simplified traditional Chinese characters);
- - - [x] recommended similar search results;
- More comprehensive music playback experience:
- - [x] various elegant playback styles[cover Square、cover Rotate、cover Beaut、cover Base、cover AlbumList];
- - [x] exclusive playback modes for various music files[normal model、cue-music model];
- CUE exclusive playback (CUE: wav、ape、flac) and CUE file management:
- - [x] Exclusive management page for music disc image (mirror) auxiliary files. 
- - [x] CUE playback styles suitable for music disc image features
- - [x] Visualized virtual track playback of CUE
- More complete TAG import and management:
- - [x] support for importing complete TAGs from more types of music files (including m4a、cue(wav、ape、flac));
- Personalized music recommendations based on user usage data: 
- - [x] Phase 1 : Add tag cloud and recommend music based on user interests.
- - [x] Phase 2 : Use lightweight recommendation algorithms based on usage data.
## Subsequent updates (Music Scene):
- More comprehensive music library management:
- - [ ] support for dual-page browsing mode (unlimited virtual list, paged list);
- - [ ] support uploading, downloading, and synchronizing music files between the server and client;
- More complete TAG import and management:
- - [ ] support for user-visualized TAG management, allowing remote uploads, auto-associating, manual merging of artist-album-single TAGs;
- - [ ] support for richer TAG fields: artist profile pictures, artist photos (multiple selection), album covers, song quality versions (multiple selection), and lyrics versions (single selection);
- ISO exclusive playback and ISO file management:
- - [ ] Exclusive management page for music disc image (mirror) auxiliary files.
- - [ ] ISO playback styles suitable for music disc image features
- - [ ] Visualized virtual track playback of ISO
- Support more sound effects settings: 
- - [ ] support for multi-channel audio effects 
- - [ ] support for Advanced/Standard/Simple EQ 
- Integrated free public welfare music TAG API: 
- - [ ] allowing users to obtain online TAGs for songs and choose whether to synchronize TAG data.
- Personalized music recommendations based on user usage data: 
- - [ ] Phase 3 : Build a music knowledge graph by analyzing music metadata to achieve smarter recommendations.
- - [ ] Phase 4 : Combine the knowledge graph with LLM (DeepSeek) for advanced music recommendations.


## How to Deploy Docker: https://github.com/Super-Badmen-Viper/NineSong
You first need to download the compressed file from the [ninesong releases](https://github.com/Super-Badmen-Viper/NineSong/releases/)  

You need to put the. env and docker-compose.yaml files [in the same folder](https://github.com/Super-Badmen-Viper/NineSong/releases/). You can customize the parameter configuration of. env and docker-compose.yaml, such as mapping the media library folder to the Volumes of the NineSong container.  

Note that if you update the mirrored version of NineSong, temporary resources in the media library (such as album covers) will also be deleted. You need to rescan the media library in the settings to regenerate temporary resources
```sh
run: docker compose up -d
login mail: admin@gmail.com
login password: admin123
```
How to Thoroughly Reinstall NineSong: Need to Clear Data Together with Volumes in Docker.  
Because considering that the image upgrade cannot affect the database data, if you delete the containers of NineSong, the data in their databases will not disappear unless you clear it together with the data in Volumes in Docker.

## NSMusicS-Electron | NineSong Music(Desktop-client) : 九歌音乐
- [x] supporting the Windows10+、MacOS(arm、x64)、Linux platform (which will soon support Docker)
- [x] music library management
- [ ] network cloud drives (webdev , onedriver....)
- [x] compatible with streaming media servers (NineSong, navidrome , jellyfin , emby)
- [ ] compatible with streaming media servers (Plex)
- [x] compatible with local music libraries (win10+、MacOS(arm、x64)、Linux、Docker)
- [x] [mpv](https://github.com/mpv-player/mpv) -play (win10+、MacOS(arm、x64)) 
- [ ] [mpv](https://github.com/mpv-player/mpv) -play (which will soon support Linux、Docker) 
- [x] professional audio playback
- [ ] Rich sound effects playback
- [x] internationalization
- [x] System backend playback -tray (win10+、MacOS(arm、x64))
- [ ] System backend playback -tray (which will soon support Linux) 
    
## [NineSong](https://github.com/Super-Badmen-Viper/NineSong) | [NineSong Multimedia(Server) : 九歌多媒体](https://github.com/Super-Badmen-Viper/NineSong)
- [ ] Compatible with streaming media servers (Jellyfin、Emby、Navidrome、Plex)
- [ ] General file library management(Audio、Video、Image、Text、Document、Archive、Executable、Database、Unknown)
- [ ] Scene of Streaming Music and Karaoke
- [ ] Scene of AI-Models deploy
- [ ] Scene of Intelligent Gallery album
- [ ] Scene of Film and Television Center
- [ ] Scene of Online Notes
- [ ] Scene of Document Workbench
- [ ] Scene of E-book reader
- [ ] Knowledge graph Recommendation system
- [ ] Internationalization
      
## NSMusicS-Flutter | NineSong Music(Mobile-client) : 九歌音乐
- [ ] music library management
- [ ] professional audio playback
- [ ] Rich sound effects playback
- [ ] internationalization
- [ ] various music usage scenarios(For NineSong: Server)

## Screenshots:
  - [x] NSMusicS(Electron, Docker-Web)：Under development    
  - [x] Normal Play Model

  <img src="doc/Web (0).png" width="49.5%"><img src="doc/Web (1).png" width="49.5%"><img src="doc/Web (2).png" width="49.5%"><img src="doc/Web (3).png" width="49.5%">
  - [x] Mini Play Model: Desktop floating mini window

  <img src="doc/Web (4).png" width="49.5%"><img src="doc/Web (5).png" width="49.5%">

## Downloads
  - [NSMusicS Electron Test (Now)](https://github.com/Super-Badmen-Viper/NSMusicS/releases)
  - [NSMusicS_Win(WPF)_3.1.0 (Old)](https://github.com/Super-Badmen-Viper/NSMusicS_WPF/releases/tag/NSMusicS_Win(WPF)_0.9.0)

## Group Chat
- QQ群聊
  - NSMusicS交流群（1）：（已满500人，请入2群）
  - NSMusicS交流群（2）：610551734
- Other | None

## Subsequent updates
- The cross platform version of NSMusicS Flutter for mobile devices will be released by the end of this year. marking a milestone in the [NineSong](https://github.com/Super-Badmen-Viper/NineSong) Music Scene as the first application scenario of the NineSong software ecosystem

- The NSMusicS client of Huawei HarmonyOS ecosystem will be released in 2026, also in conjunction with [NineSong](https://github.com/Super-Badmen-Viper/NineSong)

- After the initial development and improvement of NSMusicS, it will be integrated into various software ecosystems, such as:
  - [ ] Xiaomi Home Integration for Home Assistant:
    [github: ha_xiaomi_home](https://github.com/XiaoMi/ha_xiaomi_home) (米家集成：智能家居系统)
  - [ ] Xiaomi ecosystem of people, cars, and homes
    (小米：人车家全生态)

## Version：
| Project                                                                                                                              |                 Development status                 |                                                                 Technology Framework                                                                 | Author/Copyright Owner |              Operating systems               | LICENSE          |
|:-------------------------------------------------------------------------------------------------------------------------------------|:--------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------:| :----:             |:--------------------------------------------:| :----:                    | 
| [NSMusicS : (Desktop、Docker)](https://github.com/Super-Badmen-Viper/NSMusicS)                                                        |       <font color="#00dd00">updateing</font>       |   electron,nodejs,vue,ts,sqlite,docker [![My Skills](https://skillicons.dev/icons?i=electron,nodejs,vue,ts,sqlite,docker)](https://skillicons.dev)   | [Xiang Cheng](https://github.com/Super-Badmen-Viper)  | Windows<br>Linux(ubuntu+)<br>Docker<br>MacOS | A-GPL 3.0 | Open source / Prohibition of commercial use | 
| [NineSong](https://github.com/Super-Badmen-Viper/NSMusicS)                                                                           |       <font color="#00dd00">updateing</font>       |           Go,MongoDB,Gin,JWT,sqlite,docker [![My Skills](https://skillicons.dev/icons?i=go,mongodb,sqlite,docker)](https://skillicons.dev)           | [Xiang Cheng](https://github.com/Super-Badmen-Viper)  |                    Docker                    | A-GPL 3.0 | Open source / Prohibition of commercial use | 
| NineSongAI                                                                                                                           |       <font color="#00dd00">updateing</font>       |         Java,MongoDB,SpringBoot,MySQL,docker [![My Skills](https://skillicons.dev/icons?i=java,mongodb,spring,mysql,docker)](https://skillicons.dev)          | [Xiang Cheng](https://github.com/Super-Badmen-Viper)  |                    Docker                    | A-GPL 3.0 | Open source / Prohibition of commercial use | 
| NineSongPro                                                                                                                          |       <font color="#00dd00">updateing</font>       | Java,MongoDB,SpringCloudAlibaba,MySQL,docker [![My Skills](https://skillicons.dev/icons?i=java,mongodb,spring,mysql,docker)](https://skillicons.dev) | [Xiang Cheng](https://github.com/Super-Badmen-Viper)  |                    Docker                    | A-GPL 3.0 | Open source / Prohibition of commercial use | 
| NSMusicS_For_Flutter                                                                                                                 | <font color="#00dd00">updateing</font>             |            flutter,dart,androidstudio  [![My Skills](https://skillicons.dev/icons?i=flutter,dart,androidstudio)](https://skillicons.dev)             | [Xiang Cheng](https://github.com/Super-Badmen-Viper)   |             Android11++ <br> IOS             | A-GPL 3.0 | Open source / Prohibition of commercial use | 
| NSMusicS_For_HarmonyOS                                                                                                               |    <font color="#00dd00">will developed</font>     |                                                                     ArkTs,ArkUI                                                                      | [Xiang Cheng](https://github.com/Super-Badmen-Viper)   |     HarmonyOS      | A-GPL 3.0 | Open source / Prohibition of commercial use | 
| NSMusicS_For_Audio                                                                                                                   |    <font color="#00dd00">will developed</font>     |                   pytorch,py,jupyter,matlab ![My Skills](https://go-skill-icons.vercel.app/api/icons?i=pytorch,py,jupyter,matlab)                    | [Xiang Cheng](https://github.com/Super-Badmen-Viper)  |        Docker        | A-GPL 3.0 | Open source / Prohibition of commercial use | 
| NSMusicS_For_KG                                                                                                                      |    <font color="#00dd00">will developed</font>     |                  NebulaGraph / Neo4j <image width="200" src="https://www-cdn.nebula-graph.io/nebula-website-5.0/images/logo.png"/>                   | [Xiang Cheng](https://github.com/Super-Badmen-Viper)   |        Docker        | A-GPL 3.0 | Open source / Prohibition of commercial use | 
| [NSMusicS-WPF](https://github.com/Super-Badmen-Viper/NSMusicS_WPF) ?-> WinUI3  | <font color="#00dd00">need to be refactored</font> |                           .net,cs(C#),sqlite ![My Skills](https://go-skill-icons.vercel.app/api/icons?i=dotnet,cs,sqlite)                            | [Xiang Cheng](https://github.com/Super-Badmen-Viper)   |                 Windows10++                  | A-GPL 3.0 | Open source / Prohibition of commercial use | 

## sponsor
爱发电：https://afdian.com/a/fu_zi_qian  
<img src="doc/sponsor.png" height="160">   <img src="doc/spomsor_weichat.jpg" height="160">   <img src="doc/spomsor_qq.jpg" height="160">

## Using the source code of NSMusicS-Electron
#### If you would like to experience the latest development progress of NSMusicS-Electron:
```sh
cd NSMusicS\NSMusicS-Electron
# node      -v  20.15.0
# npm       -v  10.4.0
npm install  /or/  cnpm install # Recommended use cnpm install
# Install MPV in the Windows environment (requires its executable file compressed file) 
# https://mpv.io/installation/
# [windows] unzip its contents to: NSMusicS\NSMusicS-Electron\resources\mpv-x86_64-20241124
# [macos] unzip its contents to: NSMusicS\NSMusicS-Electron\resources\mpv-x86_64-20241124
# [linux] please waiting....
```
```sh
# You need to recompile the native module better sqlite3 to allow the sqlite database to read normally
# You can use either of the following two methods (Choose method A or B)
## method A. -> Recommend this, Ensure that the node version is 20.15.0
    Delete the files in the following path first: NSMusicS\NSMusicS-Electron\node_modules\better-sqlite3\build\Release\better_sqlite3.node
    Then copy the file from the following path: NSMusicS\NSMusicS-Electron\resources\node\win | linux | macos -> better-sqlite3.node
    Paste the copied file to the following path: NSMusicS\NSMusicS-Electron\node_modules\better-sqlite3\build\Release
## method B.
    cd NSMusicS/NSMusicS-Electron/node_modules/better-sqlite3 
    npm install electron-rebuild -D
    # 1.open better-sqlite3/package.json 
    # 2.scripts addline: "rebuild": "electron-rebuild -f -w better-sqlite3" 
    npm run rebuild 
```
```sh
cd NSMusicS\NSMusicS-Electron
npm run dev # Direct operation NSMusicS\NSMusicS-Electron
```
```sh
cd NSMusicS\NSMusicS-Electron
npm run build # Package into the current system_configs's software package (such as exe)
```

## Related projects:
- NSMusicS Web Of Thanks：
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
  - .......
- NSMusicS ImageResource Thanks:
  - <a href="https://www.freepik.com/free-photo/black-retro-vinyl-record-design-element_12189639.htm#fromView=search&page=5&position=9&uuid=c046ed77-1d8d-4858-b3d8-e8a96afa3d8d">Image by rawpixel.com on Freepik</a>
  - <a href="https://www.freepik.com/free-psd/black-vinyl-record-blank-label-music-nostalgia_411796139.htm#fromView=search&page=7&position=29&uuid=924b9d6f-166d-4abf-ae7a-91cb2c6f7d41&query=vinyl">Image by muhammad.abdullah on Freepik</a>
  - <a href="https://www.freepik.com/free-vector/cd-cover-design-mockup-vector_3758851.htm#fromView=search&page=2&position=37&uuid=9ffb6fa4-91f6-44b6-855c-0ef30dfc0fdf&query=album">Image by rawpixel.com on Freepik</a>
  - <a href="https://www.freepik.com/free-vector/cute-astronaut-singing-with-microphone-headset-cartoon-vector-icon-illustration-science-holiday_342437890.htm#fromView=search&page=1&position=41&uuid=35a74e38-4db8-40b0-89c9-4a9267d74826&query=singer">Image by catalyststuff on Freepik</a>
  - <a href="https://www.freepik.com/free-vector/cd-mock-up_1042134.htm#fromView=search&page=1&position=1&uuid=da331a05-47e9-42d2-ba07-c444e169648f&query=CD">Image by starline on Freepik</a>
- NSMusicS WPF Of Thanks:
  - [NAudio](https://github.com/naudio/NAudio)
  - [cscore](https://github.com/filoe/cscore)
  - [LottieSharp](https://github.com/quicoli/LottieSharp)
  - [AudioVisualizer](https://github.com/SlimeNull/AudioVisualizer)
  - .......

## Author's Message
 - As this project is currently independently developed by Xiang Cheng(myself), programming standards are a personal habit of the Xiang Cheng(myself), and coding standards are not yet standardized enough. However, this project will continue to undergo self refactoring and reverse development. It can be affirmed that in the future, NSMusicS will form a standard coding specification, which will be beneficial for the community to develop third-party NSMusicS plugins, Enable NSMusicS to meet the diverse needs of more potential customers，Most importantly, NSMusicS will always be open source and continuously updated
 - The expectation of the NSMusicS series products is to enable people around the world to use free, open-source, and user-friendly music products
 - 大道之行，天下为公。人神恋歌，九歌韵世。

The Chinese name of the project is "Nine Song Music Super | 九歌音乐", abbreviated as NSMusicS<br> inspired by ["Chu Ci"] | 楚辞, to commemorate ["Qu Yuan"] | 屈原<br>
