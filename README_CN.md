# 说明

## [这是NSMusicS的博客](http://124.223.62.181/):http://124.223.62.181/

- # Nine Song Music World(NSMusicS)说明：
- - 基于dotNET_C#_WPF的个人开源音乐客户端  
- - 演示效果：B站链接：
- - - Latest version:[https://www.bilibili.com/video/BV1kN4y1k7Pm](https://www.bilibili.com/video/BV1kN4y1k7Pm)
- - 将使用 Flutter 进行重构并部署到(Linux + Docker)/Mac/web/Android/IOS/Win
  - [NSMusicS-Flutter版本的Figma UI设计稿 ：](https://www.figma.com/file/bmE00Wr1JKk5j3CbxrMgHe/Flutter%E5%A4%9A%E5%B9%B3%E5%8F%B0%E7%89%88%E6%9C%AC%EF%BC%9A(Linux%2BDoccker)%2FWeb%2FWin%2FMacOS%2FIOS%2FAndroid?type=design&node-id=0%3A1&mode=design&t=VZZrp7eZH17RZzio-1)


## 功能：
  - 1.支持歌词字同步动画，同步歌词进度 （可兼容其它音乐软件的歌词文件）歌词字同步算法
  - 2.支持多歌手写真动画交叉轮播
  - 3.音频动态频谱动画
  - 4.基本的音乐播放器功能（无需解释，该有的肯定有）

# 版本：

| 项目 | 开发状态 | 技术框架 | 作者/版权所有者 | 操作系统 | 许可证 | 软件定位 |
| :----- | ----: | ----: | ----: | :----: | :----: | :----: |
| [NSMusicS](https://github.com/Super-Badmen-Viper/NSMusicS) |<font color="#00dd00">(已完成): 更新中</font>| .NET WPF C# | Xiang Cheng | (Windows10++) | A-GPL 3.0 | 开源 + 商业 |
| [NSMusicS_For_Flutter](https://github.com/Super-Badmen-Viper/NSMusicS/tree/main/NSMusicS_For_Flutter/nsmusics_for_flutter) |<font color=Yellow>(开发中)</font><font color="#00dd00">: 更新中</font> | Flutter Dart | Xiang Cheng | (Windows10++, Linux(ubuntu+, 群晖Nas+Docker), MacOS, Android11++, IOS) | A-GPL 3.0 | 开源 + 商业 |
| [MZMusic](https://github.com/MZMusic/MZMusic) |<font color=Red>未开始</font> | Electron+Vue3 | MZMusic Team | (Windows, Linux, MacOS...) | Apache License 2.0 | 开源 |

# 开发企划
 - ## NSMusicS 
    - 1.(Windows) (专业级)音乐播放器++
    - 2.NAS上数千万首歌曲级别的音乐库管理
    - 3.音乐和娱乐场景
      1. 基于声音指纹技术的听歌识曲模块（同时作为单独项目模型开源）
      2. 基于大数据用户行为分析的猜你喜欢模块
      3. 基于nlp的AI演唱模块，将歌曲的声音替换为你的声音（同时作为单独项目模型开源）
      4. 基于nlp的AI乐谱绘制模块（同时作为单独项目模型开源）
      5. 基于nlp的AI提取音频歌词同步信息
      6. 实现NSMusicS唱吧打分评测等功能
    - 4.Windows音乐IDE，类似于Adobe Audition

 - ## NSMusicS For Flutter
    - Flutter版本将是一个纯粹的音乐播放器
    - Flutter支持全平台的使用，(Windows10++, Linux(ubuntu+, 群晖Nas+Docker), MacOS, Android11++, IOS) 
    - 与NSMusicS相同，如上所述
      - 但是，它没有：
        1. 类似于Adobe Audition的Windows音乐IDE
    

 - ## MZMusic
    - ## unknown

# 界面预览：
  <table>
    <tr>
      <td><img src="https://github.com/Super-Badmen-Viper/NSMusicS/assets/83256054/5e040577-6693-4a94-b90d-8c46fcb59cd3" width="594"></td>
      <td><img src="doc/Test (1).png" width="594"></td>
    </tr>
    <tr>
      <td><img src="doc/Test (2).png" width="594"></td>
      <td><img src="doc/Test (3).png" width="594"></td>
    </tr>
    <tr>
      <td><img src="doc/Test (1_2).png" width="594"></td>
      <td><img src="doc/Test (1_3).png" width="594"></td>
    </tr>
  </table>
  
# NSMusicS第4版项目 开发文档/规划：-》 NSMusicS_Ultimate
  <img src="doc/NSMusicS 第4版 开发文档 规划 （更新中）.png" align="center" width="1200">
  
# 该项目的研发管理看板(仪表盘)：[https://github.com/users/Super-Badmen-Viper/projects/3](https://github.com/users/Super-Badmen-Viper/projects/3)
- 如果你想加入，请发邮件到我的QQ邮箱：1774148579@qq.com，超过5个人，我将会开展开源项目管理模式，九歌·韵世云开源组织正式开始活动

## 参与开源共建，QQ群交流群号：610551734：-》 NSMusicSYunOpenSourceCommunity(九歌·韵世云开源社区)

# 快速使用：
  - 请使用Visual Studio 2022版本进行Git clone与pull，否则旧版本的Visual Studio可能会出现无法生成的情况
  - [下载:](https://github.com/Super-Badmen-Viper/NSMusicS/releases/tag/NSMusicS_Win_3.0)
  - 我的QQ学习群号：228440692，欢迎加群，先给个star吧，群里有我整理好的项目，比Github更加容易开箱即用
  - 资源所在位置：NSMusicSPlayer/NSMusicSPlayer_GithubAuthor_XiangCheng/bin/Debug/net6.0-windows/Resource/之内（歌词，歌手写真，专辑图片等，可自行编辑）
  - 音乐附加资源下载（百度网盘资源）： 
  - - 链接：https://pan.baidu.com/s/1LbmClxXrEsO4-R9ISBKCoQ?pwd=zake 提取码：zake  
  - - 请将此网盘的Resource压缩包解压并覆盖至NSMusicSPlayer_GithubAuthor_XiangCheng\bin\Debug\net6.0-windows，取代同名文件夹 
  - - 声明：作者个人的音乐附加资源百度网盘资源(歌手写真，专辑图片等等)和此项目文件，都是来自网络的公开数据，仅做分享，无任何商业侵权行为，如有异议，请联系我删除 

# 免责申明：
- 本软件只提供其他开源项目接口的使用来获取数据，不提供任何资源上传、存储到服务器的功能。
- 本软件仅解析来自其他开源项目接口的内容，不会对解析到的音视频进行二次编码，部分视频会进行有限的格式转换、拼接等操作。
- 本软件解析得到的所有内容来自其他开源项目API和合法授权的商用API，其版权均归原作者和授权者所有。内容提供者、上传者、下载使用者应对其提供、上传、下载的内容承担全部责任。
- **本软件提供的所有内容，仅可用作学习交流使用，未经原作者授权，禁止用于其他用途。请在下载24小时内删除。为尊重作者版权，请前往资源的原始发布网站观看，支持原创，谢谢。**
- 因使用本软件产生的版权问题，软件作者概不负责。
- 本软件所使用的一切资源均来源于公共网络与合法授权网络，进出收益皆合法，软件作者概不负责。（如若需要，请联系作者删除）

# 开源协议：AGPL-3.0 license 原因：
- 你可以将其中的功能模块提取运用于任何活动(部分MIT)，但是不能将NSMusicSPlayer换皮，几乎整个拿走进行商业活动
- 如若发现违反我们的规定，我们将起诉并追回这所有产生的收益，并运用于慈善与开源活动支出
- 如果你想将我的（作者）算法和模型转移到其他开源/商业项目中，你必须清楚地表明算法和模型来自（作者）。
- 禁止伪造我的算法模型的版权，抄袭我的代码，并代表您（或团队）将其提交给其他项目。您必须清楚地指出算法模型的来源才能使用它或将其提交给另一个项目（否则您将收到我的律师函）

# 相关项目：
- [NAudio](https://github.com/naudio/NAudio)
- [cscore](https://github.com/filoe/cscore)
- [LottieSharp](https://github.com/quicoli/LottieSharp)
- [AudioTest](https://github.com/SlimeNull/AudioTest)

# 赞助(微信/支付宝)：
  <img src="doc/Test (4).png" align="center" width="400">
