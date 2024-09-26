![NSMusicS_Frame](https://github.com/user-attachments/assets/be41a673-8a3d-4c88-8b44-b839b9ab660c)
<div style="display: flex; align-items: center;">
    <div>
        <h2>NSMusicS | 九歌</h2>
        <p>
            A local/server music software that is expected to support multiple platforms with AI capabilities and multimodal features.<br>
        </p>
        <p>
            The current development phase is to develop an Elecetron cross platform music software that is compatible with Navichrome and has a beautiful UI, and to simultaneously develop music artificial intelligence and streaming services as cloud services for NSMusicS
        </p>
        <p>
            The goal of NSMusicS is to integrate various functions (such as artificial intelligence, streaming, music library management, cross platform, etc.), which can be understood as similar to Navidrome but with more features than Navidrome. It wants to become a plugin integrated application that can almost have all music functions.
        </p>
        <p>
            The expectation of the NSMusicS series products is to enable people around the world to use free, open-source, and user-friendly music products
        </p>
    </div>
</div>



## Version：
| Project   | Development status | Technology Framework     | Author/Copyright Owner | Operating systems         | LICENSE          |  Software positioning |
| :-----    | ----:              | ----:                    | ----:             | :----:                    | :----:                    | :----:                    |
| [NSMusicS (Now)](https://github.com/Super-Badmen-Viper/NSMusicS)   |<font color="#00dd00">updateing</font>             | electron,nodejs,vue,ts,sqlite,docker [![My Skills](https://skillicons.dev/icons?i=electron,nodejs,vue,ts,sqlite,docker)](https://skillicons.dev) Go,MongoDB,Gin,JWT,docker [![My Skills](https://skillicons.dev/icons?i=go,mongodb,sqlite,docker)](https://skillicons.dev) | [Xiang Cheng](https://github.com/Super-Badmen-Viper)  | Windows<br>Linux(ubuntu+)<br>Docker<br>MacOS | A-GPL 3.0 | Open source / Prohibition of commercial use | 
| NSMusicS_For_Flutter   |<font color="#00dd00">will developed</font> |  flutter,dart,androidstudio  [![My Skills](https://skillicons.dev/icons?i=flutter,dart,androidstudio)](https://skillicons.dev)   | [Xiang Cheng](https://github.com/Super-Badmen-Viper)   | Android11++ <br> IOS <br> HarmonyOS | A-GPL 3.0 | Open source / Prohibition of commercial use | 
| NSMusicS_For_Audio_Process   |<font color="#00dd00">will developed</font>  | pytorch,py,jupyter,matlab ![My Skills](https://go-skill-icons.vercel.app/api/icons?i=pytorch,py,jupyter,matlab)  | [Xiang Cheng](https://github.com/Super-Badmen-Viper)  |    Windows10++<br>Linux<br>Docker   | A-GPL 3.0 | Open source / Prohibition of commercial use | 
| NSMusicS_For_Knowledge_Graph   |<font color="#00dd00">will developed</font> |  NebulaGraph / Neo4j <image width="200" src="https://www-cdn.nebula-graph.io/nebula-website-5.0/images/logo.png"/>      | [Xiang Cheng](https://github.com/Super-Badmen-Viper)   | Windows10++<br>Linux<br>Docker | A-GPL 3.0 | Open source / Prohibition of commercial use | 

### Downloads
  - [NSMusicS Electron Test (Now)](https://github.com/Super-Badmen-Viper/NSMusicS/releases)
  - [NSMusicS_Win(WPF)_3.1.0 (Old)](https://github.com/Super-Badmen-Viper/NSMusicS_WPF/releases/tag/NSMusicS_Win(WPF)_0.9.0)

## Interface preview:
  - NSMusicS(Electron)：Under development
   <table>
      <tr>
        <td><img src="doc/Web (0).png" width="594"></td>
        <td><img src="doc/Web (1).png" width="594"></td>
      </tr>
   </table>

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
  - [Node-MPV](https://github.com/j-holub/Node-MPV)
  - [Vue3](https://github.com/vuejs/vue)
  - [go-backend-clean-architecture](https://github.com/amitshekhariitbhu/go-backend-clean-architecture)
  - [node-taglib-sharp](https://github.com/benrr101/node-taglib-sharp)
  - [Naive UI](https://github.com/tusen-ai/naive-ui)
- NSMusicS Web ImageResource Thanks:
  - <a href="https://www.freepik.com/free-photo/black-retro-vinyl-record-design-element_12189639.htm#fromView=search&page=5&position=9&uuid=c046ed77-1d8d-4858-b3d8-e8a96afa3d8d">Image by rawpixel.com on Freepik</a>
- NSMusicS WPF Of Thanks:
  - [NAudio](https://github.com/naudio/NAudio)
  - [cscore](https://github.com/filoe/cscore)
  - [LottieSharp](https://github.com/quicoli/LottieSharp)
  - [AudioVisualizer](https://github.com/SlimeNull/AudioVisualizer)

## Author's Message
 - As this project is currently independently developed by Xiang Cheng(myself), programming standards are a personal habit of the Xiang Cheng(myself), and coding standards are not yet standardized enough. However, this project will continue to undergo self refactoring and reverse development. It can be affirmed that in the future, NSMusicS will form a standard coding specification, which will be beneficial for the community to develop third-party NSMusicS plugins, Enable NSMusicS to meet the diverse needs of more potential customers，Most importantly, NSMusicS will always be open source and continuously updated
 - The expectation of the NSMusicS series products is to enable people around the world to use free, open-source, and user-friendly music products
 - The Chinese name of the project is "Nine Songs Music", abbreviated as NSMusicS<br> inspired by ["Chu Ci"], to commemorate ["Qu Yuan"]<br>
 - 项目中文名为：九歌，缩写为: NSMusicS<br> 灵感来源于：[楚辞]，谨以纪念：[屈原]，
 - 以下是此项目[九歌]为[屈原]撰写的怀人诗：
 - 思美人兮情何深，楚沉沦兮心难挨
 - 汨罗水畔美人逝，香魂袅袅映日升
 - 岁月悠悠山河在，芳草萋萋忆旧怀
 - 香草美人虽已逝，遗风遗韵长自新
 - 承卿遗志报家国，志士仁人继往开
 - 吾心虽念卿不返，壮志凌云何须哀
