///自定义窗体设置///来自https://pub.dev/packages/bitsdojo_window
import 'package:bitsdojo_window/bitsdojo_window.dart';
import 'package:flutter/material.dart';


const app_border_Color = Color(0xFFB71C1C);
const app_Left_grid_color = Color(0xFFF0F3F6);
const app_Right_grid_color = Color(0xFFF7F9FC);

final gradientColors = [
  const Color(0x99FF004D),
  const Color(0x99FF2222),
  const Color(0x99EC002B),
];
final Sideba_Page_Selection_Button_Style_Color = LinearGradient(
  colors: gradientColors,
  stops: [0.0, 0.5, 1.0],
);
final Sideba_Page_NotSelection_Button_Style_Color = LinearGradient(
  colors: gradientColors,
  stops: [0.0, 0.0, 0.0],
);

final buttonColors = WindowButtonColors(
    mouseOver: const Color(0x00D32F2F),
    mouseDown: const Color(0x00B71C1C),
    iconNormal: const Color(0xFF646B7C),
    iconMouseOver: Colors.black,
    iconMouseDown: const Color(0xFF646B7C));

final closeButtonColors = WindowButtonColors(
    mouseOver: const Color(0x00D32F2F),
    mouseDown: const Color(0x00B71C1C),
    iconNormal: const Color(0xFF646B7C),
    iconMouseOver: Colors.black);


