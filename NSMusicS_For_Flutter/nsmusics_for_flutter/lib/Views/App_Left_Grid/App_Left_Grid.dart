///自定义窗体设置///来自https://pub.dev/packages/bitsdojo_window
import 'package:bitsdojo_window/bitsdojo_window.dart';
import 'package:flutter/material.dart';

import '../../Resource_Library/App_System_Theme/App_System_Theme_Of_Colors.dart';
import 'App_Left_Grid_For_Top_Grid_Of_LOGO/App_Left_Grid_For_Top_Grid_Of_LOGO.dart';
import 'App_Left_Grid_Of_Model_1/App_Left_Grid_Of_Model_1_1_My_Music.dart';
import 'App_Left_Grid_Of_Model_1/App_Left_Grid_Of_Model_1_2_AI_Music.dart';
import 'App_Left_Grid_Of_Model_1/App_Left_Grid_Of_Model_1_3_Love_Album.dart';


///App-Grid-左
class App_Left_Grid extends StatelessWidget {
  const App_Left_Grid({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return SizedBox(
        width: 180,
        child: Container(
            color: app_Left_grid_color,
            /// child：Stack支持多个子组件嵌套（不同平面）
            child: Stack(
                /// children內直接写入对象名
                children: [
                  App_Left_Grid_For_Top_Grid_Of_LOGO(

                  ),//LOGO区域
                  App_Left_Grid_Of_Model_1_1_My_Music(

                  ),
                  App_Left_Grid_Of_Model_1_2_AI_Music(

                  ),
                  App_Left_Grid_Of_Model_1_3_Love_Album(

                  )


                ],
            ),
        )
    );
  }
}