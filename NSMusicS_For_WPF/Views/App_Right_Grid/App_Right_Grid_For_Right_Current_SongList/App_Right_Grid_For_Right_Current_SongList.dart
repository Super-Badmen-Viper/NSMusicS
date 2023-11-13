import 'package:flutter/material.dart';

import '../../../Resource_Library/App_System_Reuse_Style/Items/SongInfo_SongList_ListViewItem_Style.dart';
import '../../../Resource_Library/App_System_Theme/App_System_Theme_Of_SVG.dart';

class App_Right_Grid_For_Right_Current_SongList extends StatelessWidget {
  const App_Right_Grid_For_Right_Current_SongList({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 440,height: 522,
      margin: EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(//圆角属性
        color: Color(0xFFFFFFFF),
        borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20),topRight: Radius.zero,
            bottomLeft: Radius.circular(20),bottomRight: Radius.zero
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
      child: Column(
        children: [
          Container(
            height: 60,
            child: Row(
              children: [
                Container(
                  margin: EdgeInsets.only(left: 20,top: 10),
                  child: Text(
                    //设置文本对象的Text的文本内容
                    "播放列表",
                    //设置文本对象的Text的文本显示的属性
                    style: TextStyle(
                        fontSize: 22,
                        color: Color(0xFF283248),
                        fontWeight: FontWeight.w900
                    ),
                  ),
                ),
                Container(
                  margin: EdgeInsets.only(left:2,top: 0),
                  child: Text(
                    //设置文本对象的Text的文本内容
                    "6",
                    //设置文本对象的Text的文本显示的属性
                    style: TextStyle(
                        fontSize: 12,
                        color: Color(0xFF8C919F),
                        fontWeight: FontWeight.w400
                    ),
                  ),
                ),
                Container(
                  margin: EdgeInsets.only(left:116,top: 10),
                  width: 82,height: 40,
                  child: Row(
                    children: [
                      Container(
                        margin: EdgeInsets.only(right: 4),
                        width: 20,height: 20,
                        child: SVG_Song_Copy,
                      ),
                      Text(
                        "收藏全部",
                        //设置文本对象的Text的文本显示的属性
                        style: TextStyle(
                            fontSize: 13,
                            color: Color(0xFF8C919F),
                            fontWeight: FontWeight.w700
                        ),
                      )
                    ],
                  ),
                ),
                Container(
                  margin: EdgeInsets.only(left:36,top: 10),
                  width: 80,height: 40,
                  child: Row(
                    children: [
                      Container(
                        margin: EdgeInsets.only(right: 2),
                        width: 20,height: 20,
                        child: SVG_Song_Delete,
                      ),
                      Text(
                        "清空",
                        //设置文本对象的Text的文本显示的属性
                        style: TextStyle(
                            fontSize: 13,
                            color: Color(0xFF8C919F),
                            fontWeight: FontWeight.w700
                        ),
                      )
                    ],
                  ),
                )
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: EdgeInsets.only(top:12),
              itemCount: 30,
              itemBuilder: (BuildContext context, int index) {
              return Container(
                child: SongInfo_SongList_ListViewItem_Style(),
              );

                //子Widget
                /*return Container(
                  height: 50,
                  child: ListTile(title: Text("$index")),
                );*/
              },
              //设置分割线，颜色为黑色，高度为1   ListView.separated(
              /*separatorBuilder: (BuildContext context, int index){
                return Divider(color: Colors.black, height: 1,);
              },*/
            ),
          )
        ],
      ),
    );
  }

}