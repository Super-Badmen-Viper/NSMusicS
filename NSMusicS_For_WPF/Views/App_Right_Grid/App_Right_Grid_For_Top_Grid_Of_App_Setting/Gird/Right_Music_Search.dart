import 'dart:math';

import 'package:flutter/material.dart';
import 'package:nsmusics_for_flutter/Resource_Library/App_System_Theme/App_System_Theme_Of_SVG.dart';

class Right_Music_Search extends StatelessWidget {
  const Right_Music_Search({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 194,
      height: 30,
      margin: EdgeInsets.only(right: 12),
      decoration: BoxDecoration(//圆角属性
        color: Color(0xFFF7F9FC),
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.25), // 阴影颜色和不透明度
            spreadRadius: 0, // 阴影的扩散半径
            blurRadius: 4, // 阴影的模糊半径
            offset: Offset(0, 0), // 阴影的偏移量
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 20,height: 20,
            margin: EdgeInsets.only(left: 6),
            child: SVG_Search,
          ),
          Expanded(
            child: Container(
              width: 160,height: 30,
              margin: EdgeInsets.only(left: 8),
              alignment: Alignment.centerLeft,
              child: Text(
                //设置文本对象的Text的文本内容
                "林俊杰 - 冻结",
                //设置文本对象的Text的文本显示的属性
                style: TextStyle(
                    fontSize: 16,
                    color: Color(0xFFA4A9B4),
                    height: 1.2, //1倍行高
                    fontWeight: FontWeight.w400
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

}