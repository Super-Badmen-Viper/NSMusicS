import 'package:flutter/material.dart';
import 'package:flutter/material.dart';
import '../../../Resource_Library/App_System_Theme/App_System_Theme_Of_Colors.dart';
import '../../../Resource_Library/App_System_Theme/App_System_Theme_Of_SVG.dart';
import 'Gird/Left_Music_Mode_Select.dart';
import 'Gird/Right_App_Operate.dart';
import 'Gird/Right_Music_Search.dart';

class App_Right_Grid_For_Top_Grid_Of_App_Setting extends StatelessWidget {
  const App_Right_Grid_For_Top_Grid_Of_App_Setting({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 70,
      decoration: BoxDecoration(//圆角属性
        color: Color(0xFFF7F9FC),
        borderRadius: BorderRadius.only(
            topLeft: Radius.zero,topRight: Radius.circular(10),
            bottomLeft:  Radius.circular(30),bottomRight: Radius.zero
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
          Align(
            alignment: Alignment.centerLeft,
            child: Row(
              children: [
                Container(
                  width: 400,
                  height: 70,
                  margin: EdgeInsets.only(right: 12),
                  decoration: BoxDecoration(//圆角属性
                    borderRadius: BorderRadius.only(
                        topLeft: Radius.zero,topRight: Radius.zero,
                        bottomLeft:  Radius.circular(30),bottomRight: Radius.zero
                    ),
                  ),
                  child: Row(
                    children: [
                      Left_Music_Mode_Select('单曲',30,Color(0xFF35C1FF),Color(0xFF333333)),
                      Left_Music_Mode_Select('专辑',10,Color(0x0035C1FF),Color(0xFFADADAD)),
                      Left_Music_Mode_Select('曲库',10,Color(0x0035C1FF),Color(0xFFADADAD)),
                      Left_Music_Mode_Select('NAS',10,Color(0x0035C1FF),Color(0xFFADADAD)),
                      Left_Music_Mode_Select('专业',10,Color(0x0035C1FF),Color(0xFFADADAD)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Align(
            alignment: Alignment.centerRight,
            child: Row(
              children: [
                Spacer(), // 占用剩余空间

                ///搜索框
                Right_Music_Search(),

                ///系统按钮区
                Right_App_Operate(),
              ],
            ),
          )
        ],
      ),
    );
  }

}


