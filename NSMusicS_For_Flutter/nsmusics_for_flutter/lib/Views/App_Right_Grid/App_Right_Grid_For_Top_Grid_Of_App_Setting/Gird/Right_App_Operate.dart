import 'dart:math';
import 'package:bitsdojo_window/bitsdojo_window.dart';
import 'package:flutter/material.dart';
import 'package:nsmusics_for_flutter/Resource_Library/App_System_Theme/App_System_Theme_Of_SVG.dart';

import '../../../../Resource_Library/App_System_Theme/App_System_Theme_Of_Colors.dart';

class Right_App_Operate extends StatelessWidget {
  const Right_App_Operate({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return
      ///系统按钮区
      Container(
        width: 165,
        height: 70,
        margin: EdgeInsets.only(right: 28),
        child: Row(
          children: [
            Container(
              width: 20,height: 20,
              margin: EdgeInsets.only(left: 10),
              child: SVG_Setting,
            ),
            Container(
              width: 20,height: 20,
              margin: EdgeInsets.only(left: 10),
              child: SVG_Skin,
            ),
            Container(
              width: 20,height: 20,
              margin: EdgeInsets.only(left: 10),
              child: SVG_Min,
            ),
            Container(
              width: 20,height: 20,
              margin: EdgeInsets.only(left: 10),
              child: SVG_Max,
            ),
            Container(
              width: 20,height: 20,
              margin: EdgeInsets.only(left: 10),
              child: SVG_Close,
            ),
            ///const WindowButtons(),
          ],
        ),
      );
  }
}



///APP 应用设置 按钮
class WindowButtons extends StatefulWidget {
  const WindowButtons({Key? key}) : super(key: key);

  @override
  _WindowButtonsState createState() => _WindowButtonsState();
}
///APP 应用设置 按钮 （触发事件/状态）
class _WindowButtonsState extends State<WindowButtons> {
  void maximizeOrRestore() {
    setState(() {
      appWindow.maximizeOrRestore();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Transform.scale(
          scale: 2.5,
          child:Container(
            width: 23,height: 23,
            margin: EdgeInsets.only(left: 4),
            child: MinimizeWindowButton(
              colors: buttonColors,
            ),
          ),
        ),
        Transform.scale(
          scale: 2.5,
          child: Container(
            width: 23,height: 23,
            margin: EdgeInsets.only(left: 6,top: 1),
            child: appWindow.isMaximized?
            RestoreWindowButton(
              colors: buttonColors,
              onPressed: maximizeOrRestore,
            )
                :
            MaximizeWindowButton(
              colors: buttonColors,
              onPressed: maximizeOrRestore,
            ),
          ),
        ),
        Transform.scale(
            scale: 3,
            child: Container(
              width: 23,height: 23,
              margin: EdgeInsets.only(left: 4),
              child: CloseWindowButton(
                  colors: closeButtonColors
              ),
            )
        ),
      ],
    );
  }
}