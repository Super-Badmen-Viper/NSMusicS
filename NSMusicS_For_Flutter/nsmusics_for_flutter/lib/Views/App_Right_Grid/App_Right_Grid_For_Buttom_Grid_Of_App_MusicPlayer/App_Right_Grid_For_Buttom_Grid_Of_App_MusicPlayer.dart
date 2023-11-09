import 'package:flutter/material.dart';
import 'package:bitsdojo_window/bitsdojo_window.dart';
import 'package:flutter/material.dart';
import 'package:nsmusics_for_flutter/Views/App_Right_Grid/App_Right_Grid_For_Buttom_Grid_Of_App_MusicPlayer/Gird/Left_Music_Info.dart';
import 'package:nsmusics_for_flutter/Views/App_Right_Grid/App_Right_Grid_For_Buttom_Grid_Of_App_MusicPlayer/Gird/Middle_Music_Player.dart';
import 'package:nsmusics_for_flutter/Views/App_Right_Grid/App_Right_Grid_For_Buttom_Grid_Of_App_MusicPlayer/Gird/Right_Music_Operate.dart';
import '../../../Resource_Library/App_System_Theme/App_System_Theme_Of_Colors.dart';

class App_Right_Grid_For_Buttom_Grid_Of_App_MusicPlayer extends StatelessWidget {
  const App_Right_Grid_For_Buttom_Grid_Of_App_MusicPlayer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 80,
      decoration: BoxDecoration(//圆角属性
        color: Color(0xFFF7F9FC),
        borderRadius: BorderRadius.only(
            topLeft: Radius.circular(30),topRight: Radius.zero,
            bottomLeft:  Radius.zero,bottomRight: Radius.circular(10)
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.25), // 阴影颜色和不透明度
            spreadRadius: 0, // 阴影的扩散半径
            blurRadius: 30, // 阴影的模糊半径
            offset: Offset(0, 0), // 阴影的偏移量
          ),
        ],
      ),

      child: Stack(
        children: [

          ///
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween, // 使子组件分别向左、中间、右对齐
            children: [
              Container(
                width: 300,
                height: 80,
                decoration: BoxDecoration(//圆角属性
                  borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(30),topRight: Radius.zero,
                      bottomLeft:  Radius.zero,bottomRight: Radius.zero
                  ),
                ),
                child: Left_Music_Info(),
              ),
              Container(
                margin: EdgeInsets.only(top:14),
                child: Align(
                  alignment: Alignment.topCenter,
                  child: Container(
                    width: 200,
                    height: 40,
                    child: Middle_Music_Player(),
                  ),
                ),
              ),
              Container(
                width: 300,
                height: 80,
                child: Right_Music_Operate(),
              ),
            ],
          ),


          ///
          Expanded(
            child: Align(
              alignment: Alignment.bottomCenter,
              child: Stack(
                children: [
                  Container(
                    width: 300,height: 4,
                    margin: EdgeInsets.only(bottom:10),
                    decoration: BoxDecoration(//圆角属性
                      color: Color(0xFFD9D9D9),
                      borderRadius: BorderRadius.circular(20), // 设置圆角半径为10
                    ),
                  ),
                  Container(
                    width: 200,height: 4,
                    margin: EdgeInsets.only(bottom:10),
                    decoration: BoxDecoration(//圆角属性
                      color: Color(0xFF464646),
                      borderRadius: BorderRadius.circular(20), // 设置圆角半径为10
                    ),
                  ),
                ],
              ),
            )
          )
        ],
      ),
    );
  }

}