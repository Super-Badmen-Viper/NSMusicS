![NSMusicS_Frame](https://github.com/user-attachments/assets/be41a673-8a3d-4c88-8b44-b839b9ab660c)

## NSMusicS | 九歌
 It should not only implement its own streaming services, but also be compatible with various mainstream open-source streaming servers, And implement cross platform professional music clients for various operating systems, ensuring data interoperability between the client and server of each operating system
 
 The expectation of the NSMusicS series products is to enable people around the world to use free, open-source, and user-friendly music products
 
 大道之行，天下为公。人神恋歌，九歌韵世。  
 汨罗江流，香魂袅袅。美人已逝，风韵长存。  
 念卿不返，壮志何哀？承卿遗志，继往开来。  
 
## NSMusicS-Electron | 九歌 : Desktop-client
- [x] supporting the Windows platform (which will soon support Linux、MacOS、Docker) 
- [x] compatible with streaming media servers Navidrome (which will soon be compatible with Subsonic、Jellyfin、Emby、NSMusicS)
- [x] music library management
- [x] professional audio playback
- [ ] Rich sound effects playback
- [x] internationalization
- [ ] various music usage scenarios(For NSMusicS-GO: Server)
## NSMusicS-GO | 九歌 : Server
- [ ] compatible with streaming media servers (which will soon be compatible with Navidrome、Subsonic、Jellyfin、Emby)
- [ ] music library management
- [ ] various music usage scenarios (karaoke, Home audio and video, Provide cloud services for cross platform music experience, etc.)
- [ ] artificial intelligence(Listen to music to identify music, extract music accompaniment, and rate karaoke singing, etc.)
- [ ] knowledge graph(Recommendation system, Graph database, etc.)
- [ ] internationalization
## NSMusicS-Flutter | 九歌 : Mobile-client
- [ ] music library management
- [ ] professional audio playback
- [ ] Rich sound effects playback
- [ ] internationalization
- [ ] various music usage scenarios(For NSMusicS-GO: Server)

## Screenshots:
  - [x] NSMusicS(Electron)：Under development    
  <img src="doc/Web (0).png" width="49.5%"><img src="doc/Web (1).png" width="49.5%"><img src="doc/Web (2).png" width="49.5%"><img src="doc/Web (3).png" width="49.5%">

## Downloads
  - [NSMusicS Electron Test (Now)](https://github.com/Super-Badmen-Viper/NSMusicS/releases)
  - [NSMusicS_Win(WPF)_3.1.0 (Old)](https://github.com/Super-Badmen-Viper/NSMusicS_WPF/releases/tag/NSMusicS_Win(WPF)_0.9.0)

## Version：
| Project   | Development status | Technology Framework     | Author/Copyright Owner | Operating systems         | LICENSE          |
| :-----    | :----:              | :----:                   | :----:             | :----:                    | :----:                    | 
| [NSMusicS <br> (Electron / GO)](https://github.com/Super-Badmen-Viper/NSMusicS)   |<font color="#00dd00">updateing</font>             | electron,nodejs,vue,ts,sqlite,docker [![My Skills](https://skillicons.dev/icons?i=electron,nodejs,vue,ts,sqlite,docker)](https://skillicons.dev) Go,MongoDB,Gin,JWT,sqlite,docker [![My Skills](https://skillicons.dev/icons?i=go,mongodb,sqlite,docker)](https://skillicons.dev) | [Xiang Cheng](https://github.com/Super-Badmen-Viper)  | Windows<br>Linux(ubuntu+)<br>Docker<br>MacOS | A-GPL 3.0 | Open source / Prohibition of commercial use | 
| NSMusicS_For_Flutter   |<font color="#00dd00">will developed</font> |  flutter,dart,androidstudio  [![My Skills](https://skillicons.dev/icons?i=flutter,dart,androidstudio)](https://skillicons.dev)   | [Xiang Cheng](https://github.com/Super-Badmen-Viper)   | Android11++ <br> IOS <br> HarmonyOS | A-GPL 3.0 | Open source / Prohibition of commercial use | 
| NSMusicS_For_Audio   |<font color="#00dd00">will developed</font>  | pytorch,py,jupyter,matlab ![My Skills](https://go-skill-icons.vercel.app/api/icons?i=pytorch,py,jupyter,matlab)  | [Xiang Cheng](https://github.com/Super-Badmen-Viper)  |    Windows10++<br>Linux<br>Docker   | A-GPL 3.0 | Open source / Prohibition of commercial use | 
| NSMusicS_For_KG   |<font color="#00dd00">will developed</font> |  NebulaGraph / Neo4j <image width="200" src="https://www-cdn.nebula-graph.io/nebula-website-5.0/images/logo.png"/>      | [Xiang Cheng](https://github.com/Super-Badmen-Viper)   | Windows10++<br>Linux<br>Docker | A-GPL 3.0 | Open source / Prohibition of commercial use | 

## Using the source code of NSMusicS-Electron
#### If you would like to experience the latest development progress of NSMusicS-Electron:
```sh
cd NSMusicS\NSMusicS-Electron
# node      -v  20.15.0
# npm       -v  10.4.0
npm install  /or/  cnpm install # Recommended use cnpm install
# Install MPV in the Windows environment (requires its executable file compressed file) 
# https://mpv.io/installation/
# unzip its contents to (NSMusicS\NSMusicS-Electron\resources\mpv-x86_64-20240623)
```
```sh
# You need to recompile the native module better sqlite3 to allow the sqlite database to read normally
# You can use either of the following two methods (Choose method A or B)
## method A.
    Delete the files in the following path first: NSMusicS\NSMusicS-Electron\node_modules\better-sqlite3\build\Release\better_sqlite3.node
    Then copy the file from the following path: NSMusicS\NSMusicS-Electron\resources\better_sqlite3.node
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
npm run build-only # Package into the current system_configs's software package (such as exe)
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
  - .......
- NSMusicS Web ImageResource Thanks:
  - <a href="https://www.freepik.com/free-photo/black-retro-vinyl-record-design-element_12189639.htm#fromView=search&page=5&position=9&uuid=c046ed77-1d8d-4858-b3d8-e8a96afa3d8d">Image by rawpixel.com on Freepik</a>
- NSMusicS WPF Of Thanks:
  - [NAudio](https://github.com/naudio/NAudio)
  - [cscore](https://github.com/filoe/cscore)
  - [LottieSharp](https://github.com/quicoli/LottieSharp)
  - [AudioVisualizer](https://github.com/SlimeNull/AudioVisualizer)
  - .......

## Author's Message
 - As this project is currently independently developed by Xiang Cheng(myself), programming standards are a personal habit of the Xiang Cheng(myself), and coding standards are not yet standardized enough. However, this project will continue to undergo self refactoring and reverse development. It can be affirmed that in the future, NSMusicS will form a standard coding specification, which will be beneficial for the community to develop third-party NSMusicS plugins, Enable NSMusicS to meet the diverse needs of more potential customers，Most importantly, NSMusicS will always be open source and continuously updated
 - The expectation of the NSMusicS series products is to enable people around the world to use free, open-source, and user-friendly music products
 - The Chinese name of the project is "Nine Songs Music | 九歌", abbreviated as NSMusicS<br> inspired by ["Chu Ci"], to commemorate ["Qu Yuan"]<br>
 - 项目中文名为：九歌，缩写为: NSMusicS<br> 灵感来源于：[楚辞]，谨以纪念：[屈原]，
