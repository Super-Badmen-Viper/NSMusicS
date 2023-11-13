import 'dart:math';

import 'package:flutter/material.dart';
import 'package:nsmusics_for_flutter/Resource_Library/App_System_Theme/App_System_Theme_Of_SVG.dart';

class Left_Music_Mode_Select extends StatelessWidget {

  final String? Model_Name;
  final double Model_Margin_Left_Nums;
  final Color? Model_Current_Color;
  final Color? Model_Name_Font_Color;
  const Left_Music_Mode_Select(this.Model_Name,this.Model_Margin_Left_Nums,this.Model_Current_Color,this.Model_Name_Font_Color);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 55,height: 55,
      margin: EdgeInsets.only(left: Model_Margin_Left_Nums),
      child: Column(
        children: [
          Container(
            margin: EdgeInsets.only(top: 14),
            child: Text(
              //设置文本对象的Text的文本内容
              "$Model_Name",
              //设置文本对象的Text的文本显示的属性
              style: TextStyle(
                  fontSize: 20,
                  color: Model_Name_Font_Color,
                  height: 1.2, //1倍行高
                  fontWeight: FontWeight.w400
              ),
            ),
          ),
          Container(
            width: 10,height: 10,
            margin: EdgeInsets.only(top: 6),
            decoration: BoxDecoration(//圆角属性
              color: Model_Current_Color,//Color(0xFF35C1FF),
              borderRadius: BorderRadius.circular(20), // 设置圆角半径为10
            ),
          ),
        ],
      ),
    );
  }

}