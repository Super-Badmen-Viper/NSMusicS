import 'dart:math';

import 'package:flutter/material.dart';
import 'package:nsmusics_for_flutter/Resource_Library/App_System_Theme/App_System_Theme_Of_SVG.dart';

class Middle_Music_Player extends StatelessWidget {
  const Middle_Music_Player({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center, // 使子组件分别向左、中间、右对齐
        children: [
          Container(
            width: 20,height: 20,
            child: SVG_Sequential_Playback,
            margin: EdgeInsets.only(right:10),
          ),
          Container(
            width: 26,height: 26,
            child: SVG_Previous,
            margin: EdgeInsets.only(right:10),
          ),
          Container(
            width: 32,height: 32,
            child: SVG_Play,
          ),
          Container(
            width: 26,height: 26,
            child: SVG_Next,
            margin: EdgeInsets.only(left:10),
          ),
          Container(
            width: 20,height: 20,
            child: Text(
              //设置文本对象的Text的文本内容
              "词",
              //设置文本对象的Text的文本显示的属性
              style: TextStyle(
                  fontSize: 20,
                  color: Colors.black,
                  height: 1.1, //1倍行高
                  fontWeight: FontWeight.w400
              ),
            ),
            margin: EdgeInsets.only(left:10),
          ),
        ],
      ),
    );
  }
}