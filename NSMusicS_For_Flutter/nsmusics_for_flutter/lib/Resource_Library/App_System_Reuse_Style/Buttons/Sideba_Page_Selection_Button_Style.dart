import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../App_System_Theme/App_System_Theme_Of_Colors.dart';


class Sideba_Page_Selection_Button_Style extends StatefulWidget {

  final Gradient? back_color;///背景颜色
  final bool? back_color_visible;
  final SvgPicture? SVG_Temp;
  final Color? font_color;///字体颜色
  final String button_text;///按钮文本
  //设置此ColorBox类的传入参数，默认返回此ColorBox类的构建函数中的return对象Container(.....)
  Sideba_Page_Selection_Button_Style(this.back_color_visible,this.back_color,this.font_color,this.button_text,this.SVG_Temp);

  @override
  _Sideba_Page_Selection_Button_Style createState() => _Sideba_Page_Selection_Button_Style();
}
class _Sideba_Page_Selection_Button_Style extends State<Sideba_Page_Selection_Button_Style> {

  @override
  void initState() {
    super.initState();
    // Your initialization code here
    //print('Component initialized');
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      child: Container(
        width: 142,
        height: 32,
        margin: EdgeInsets.only(left: 0,top: 0,right: 0,bottom: 4),
        child: Stack(
          children: [
            ///背景颜色
            Visibility(
              visible: widget.back_color_visible!,
              child: Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(//圆角属性
                    gradient: widget.back_color,
                    borderRadius: BorderRadius.circular(10), // 设置圆角半径为10
                  ),
                ),
              ),
            ),
            ///小图标
            Container(
              margin: EdgeInsets.only(left: 6,top: 6),
              width: 20,height: 20,
              decoration: BoxDecoration(//圆角属性
                //color: font_color,
                borderRadius: BorderRadius.circular(20), // 设置圆角半径为10
              ),
              child: widget.SVG_Temp,
            ),
            ///歌单文字
            Container(
              margin: EdgeInsets.only(left: 35,top: 7),
              child: Text(
                //设置文本对象的Text的文本内容
                widget.button_text,//"$widget.button_text",注意，这种写法会导致文本错误显示为该组件名
                //设置文本对象的Text的文本显示的属性
                style: TextStyle(
                    fontSize: 13,
                    color: widget.font_color,
                    fontWeight: FontWeight.w400
                ),
              ),
            ),

          ],
        ),
      ),
    );
  }
}