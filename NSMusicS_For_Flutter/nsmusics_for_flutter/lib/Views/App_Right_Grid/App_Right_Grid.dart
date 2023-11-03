///自定义窗体设置///来自https://pub.dev/packages/bitsdojo_window
import 'package:bitsdojo_window/bitsdojo_window.dart';
import 'package:flutter/material.dart';
import '../App_System_Theme/App_System_Theme_Of_Colors.dart';

///App-Grid-右
class App_Right_Grid extends StatelessWidget {
  const App_Right_Grid({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        decoration: const BoxDecoration(
          /// 渐变色
          /*gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [backgroundStartColor, backgroundEndColor],
              stops: [0.0, 1.0]),*/
          /// 纯色
          color: app_Right_grid_color,
        ),
        child: Column(children: [
          ///添加标题栏控件
          WindowTitleBarBox(
            ///已Row行排列的方式排列
            child: Row(
              ///在其children中，添加移动窗体函数，以及添加对3个按钮事件(最小化，最大化，退出)
              children: [Expanded(child: MoveWindow()), const WindowButtons()],
            ),
          )
        ]),
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
        MinimizeWindowButton(colors: buttonColors),
        appWindow.isMaximized
            ? RestoreWindowButton(
          colors: buttonColors,
          onPressed: maximizeOrRestore,
        )
            : MaximizeWindowButton(
          colors: buttonColors,
          onPressed: maximizeOrRestore,
        ),
        CloseWindowButton(colors: closeButtonColors),
      ],
    );
  }
}