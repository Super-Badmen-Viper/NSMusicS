import 'package:flutter/material.dart';

import '../../../../Resource_Library/App_System_Theme/App_System_Theme_Of_SVG.dart';

class Right_Music_Operate extends StatelessWidget {
  const Right_Music_Operate({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 300,
      height: 80,
      margin: EdgeInsets.only(left:70),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Container(
            width: 20,height: 20,
            child: SVG_Sound_Effects,
            margin: EdgeInsets.only(right:10),
          ),
          Container(
            width: 20,height: 20,
            child: SVG_PlayList,
            margin: EdgeInsets.only(right:10),
          ),
          Container(
            width: 20,height: 20,
            child: SVG_Volume,
            margin: EdgeInsets.only(right:4),
          ),
          Container(
            child: Align(
              alignment: Alignment.center,
              child: Stack(
                children: [
                  Container(
                    width: 100,height: 2,
                    decoration: BoxDecoration(//圆角属性
                      color: Color(0xFFD9D9D9),
                      borderRadius: BorderRadius.circular(20), // 设置圆角半径为10
                    ),
                  ),
                  Container(
                    width: 60,height: 2,
                    decoration: BoxDecoration(//圆角属性
                      color: Color(0xFF464646),
                      borderRadius: BorderRadius.circular(20), // 设置圆角半径为10
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}