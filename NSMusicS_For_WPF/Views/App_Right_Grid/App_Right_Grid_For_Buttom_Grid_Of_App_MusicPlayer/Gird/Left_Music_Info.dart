import 'package:flutter/material.dart';

import '../../../../Resource_Library/App_System_Theme/App_System_Theme_Of_SVG.dart';

class Left_Music_Info extends StatelessWidget {
  const Left_Music_Info({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 300,height: 80,
      child: Row(
        children: [

          ///专辑封面
          Container(
            width: 54,height: 54,
            margin: EdgeInsets.only(left: 24),
            clipBehavior: Clip.hardEdge,
            decoration: BoxDecoration(//圆角属性
              color: Color(0xFFF7F9FC),
              borderRadius: BorderRadius.circular(6),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.25), // 阴影颜色和不透明度
                  spreadRadius: 0, // 阴影的扩散半径
                  blurRadius: 20, // 阴影的模糊半径
                  offset: Offset(0, 0), // 阴影的偏移量
                ),
              ],
            ),
            child: Image(
              image: AssetImage('Resource_UI_Ico/PNG/初学者.jpg'),
              fit: BoxFit.scaleDown,
            ),
          ),

          ///歌曲信息
          Container(
            width: 200,height: 54,
            margin: EdgeInsets.only(left: 16),
            ///上下两部分
            child: Column(
              children: [
                ///滚动音乐标题名
                Container(
                  width: 200,
                  margin: EdgeInsets.only(top:1),
                  child: Row(
                    children: [
                      Container(
                        child: Text(
                          '薛之谦 - ',
                          textAlign: TextAlign.start,
                          style: TextStyle(
                            fontSize: 16,
                            color: Color(0xFF283248),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      Container(
                        margin: EdgeInsets.only(top:4),
                        child: Text(
                          '演员',
                          textAlign: TextAlign.start,
                          style: TextStyle(
                            fontSize: 12,
                            color: Color(0xFF283248),
                          ),

                        ),
                      )
                    ],
                  )
                ),

                ///音乐信息操作
                Container(
                  width: 200,height: 28,

                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Container(
                        width: 18,height: 18,
                        margin: EdgeInsets.only(right: 12),
                        child: SVG_Love,
                      ),
                      Container(
                        width: 18,height: 18,
                        margin: EdgeInsets.only(right: 12),
                        child: SVG_Server,
                      ),
                      Container(
                        width: 18,height: 18,
                        margin: EdgeInsets.only(right: 12),
                        child: SVG_Download,
                      ),
                    ],
                  ),
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}