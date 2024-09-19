![Frame 1](https://github.com/user-attachments/assets/3b36ad41-2ec4-4c17-850f-072fe309430e)
<div style="display: flex; align-items: center;">
    <div>
        <h2>NSMusicS</h2>
        <p>
            A local music software that is expected to support multiple platforms with AI capabilities and multimodal features.<br>
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
| [NSMusicS (Now)](https://github.com/Super-Badmen-Viper/NSMusicS)   |<font color="#00dd00">updateing</font>             |Go,docker,MongoDB,Gin,JWT Authentication Middleware [![My Skills](https://skillicons.dev/icons?i=go,docker,mongodb)](https://skillicons.dev) electron,docker,vue,nodejs,ts,vite,sqlite [![My Skills](https://skillicons.dev/icons?i=electron,docker,vue,nodejs,ts,vite,sqlite)](https://skillicons.dev)  | [Xiang Cheng](https://github.com/Super-Badmen-Viper)  | (Windows,Linux(ubuntu+,Docker),MacOS,Android11++,IOS) Based on the Chrome kernel    | A-GPL 3.0 | Open source + Commercial | 
| [NSMusicS_WPF (Old)](https://github.com/Super-Badmen-Viper/NSMusicS_WPF)   |<font color="#00dd00">complete</font> | dotnet8(wpf),cs,window,sqlite [![My Skills](https://skillicons.dev/icons?i=dotnet,cs,windows,sqlite)](https://skillicons.dev)           | [Xiang Cheng](https://github.com/Super-Badmen-Viper)   | (Windows10++)             | A-GPL 3.0 | Open source + Commercial | 
| NSMusicS_For_PythonApp_Of_AudioProcessing   |<font color="#00dd00">will developed</font>             | pytorch,py [![My Skills](https://skillicons.dev/icons?i=pytorch,py)](https://skillicons.dev)  | [Xiang Cheng](https://github.com/Super-Badmen-Viper)  |    python    | Apache License 2.0 | Open source | 
| NSMusicS_For_Knowledge_Graph   |<font color="#FF0000">Not started</font>|  NebulaGraph / Neo4j <image width="200" src="https://www-cdn.nebula-graph.io/nebula-website-5.0/images/logo.png"/>      | [Xiang Cheng](https://github.com/Super-Badmen-Viper)   | (Windows10++/Linux)             | A-GPL 3.0 | Open source + Commercial | 
| NSMusicS_For_Flutter   |<font color="#FF0000">Not started</font>    | flutter,dart  [![My Skills](https://skillicons.dev/icons?i=flutter,dart)](https://skillicons.dev)    | [Xiang Cheng](https://github.com/Super-Badmen-Viper)   | (Windows10++,Linux(ubuntu+,群晖Nas+Docker),MacOS,Android11++,IOS) | A-GPL 3.0 | Open source + Commercial | 
| MZMusic   |<font color="#FF0000">Not started</font>             | electron,docker,vue,nodejs,ts,vite  [![My Skills](https://skillicons.dev/icons?i=electron,docker,vue,nodejs,ts,vite)](https://skillicons.dev)  | [MZMusic Team](https://github.com/MZMusic)  | (win,linux,macos...)      | Apache License 2.0 | Open source | 

### The management dashboard for NSMusicS_Web
  - [Dashboard For NSMusicS_Web](https://github.com/users/Super-Badmen-Viper/projects/4)
    
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
   
  - [NSMusicS_WPF (Old)](https://github.com/Super-Badmen-Viper/NSMusicS_WPF)：Development completed
  <table>
    <tr>
      <td><img src="doc/Test (2).png" width="594"></td>
      <td><img src="doc/Test (3).png" width="594"></td>
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

## Related projects:(Thanks)
- NSMusicS Web Of Thanks：
  - [Electron](https://github.com/electron/electron)
  - [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
  - [howler.js](https://github.com/goldfire/howler.js)
  - [Node-MPV](https://github.com/j-holub/Node-MPV)
  - [Vue3](https://github.com/vuejs/vue)
  - [go-backend-clean-architecture](https://github.com/amitshekhariitbhu/go-backend-clean-architecture)
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
