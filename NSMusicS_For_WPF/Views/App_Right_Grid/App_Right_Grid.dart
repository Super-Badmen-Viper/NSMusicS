///自定义窗体设置///来自https://pub.dev/packages/bitsdojo_window
import 'package:bitsdojo_window/bitsdojo_window.dart';
import 'package:flutter/material.dart';

import '../../Resource_Library/App_System_Theme/App_System_Theme_Of_Colors.dart';
import 'App_Right_Grid_For_Buttom_Grid_Of_App_MusicPlayer/App_Right_Grid_For_Buttom_Grid_Of_App_MusicPlayer.dart';
import 'App_Right_Grid_For_Right_Current_SongList/App_Right_Grid_For_Right_Current_SongList.dart';
import 'App_Right_Grid_For_Top_Grid_Of_App_Setting/App_Right_Grid_For_Top_Grid_Of_App_Setting.dart';


///App-Grid-右
class App_Right_Grid extends StatelessWidget {
  const App_Right_Grid({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Expanded(///Expanded 占满界面
        child: Container(
          color: app_Right_grid_color,
          /// child：Stack支持多个子组件嵌套（不同平面）
          child: Stack(
            children: [
              Align(
                alignment: Alignment.topLeft,
                child: App_Right_Grid_For_Top_Grid_Of_App_Setting(),
              ),
              Align(
                alignment: Alignment.bottomLeft,
                child: App_Right_Grid_For_Buttom_Grid_Of_App_MusicPlayer(),
              ),
              Align(
                alignment: Alignment.centerRight,
                child: App_Right_Grid_For_Right_Current_SongList(),
              )
            ],
          ),
        )
    );
  }
}