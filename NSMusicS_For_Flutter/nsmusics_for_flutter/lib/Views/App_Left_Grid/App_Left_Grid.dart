///自定义窗体设置///来自https://pub.dev/packages/bitsdojo_window
import 'package:bitsdojo_window/bitsdojo_window.dart';
import 'package:flutter/material.dart';
import '../App_System_Theme/App_System_Theme_Of_Colors.dart';
import 'App_Left_Grid_For_Top_Grid_Of_LOGO/App_Left_Grid_For_Top_Grid_Of_LOGO.dart';


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

                  ///窗体拖动功能：Positioned.fill置于底部表示最顶部
                  /*Positioned.fill(///用于不同平面的嵌套的Positioned，fill表示铺满父容器
                      child: Column(
                        children: [
                          //WindowTitleBarBox(child: MoveWindow()),//添加标题栏拖动
                          //Expanded(child: Container()),//强制子组件填充可用空间
                          Expanded(child: MoveWindow()),//强制子组件填充可用空间
                        ],
                      )
                  )*/
                  Container(
                      margin: EdgeInsets.only(top: 77.142),
                      child: Container(
                        height: 200,
                        color: Colors.black,
                      )
                  ),
                  Container(
                      margin: EdgeInsets.only(top: 277.142),
                      child: Container(
                        height: 200,
                        color: Colors.blueGrey,
                      )
                  ),
                  Container(
                      margin: EdgeInsets.only(top: 477.142),
                      child: Container(
                        color: Colors.orange,
                      )
                  )


                ],
            ),
        )
    );
  }
}