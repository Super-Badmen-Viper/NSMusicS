import 'package:flutter/material.dart';
import 'package:nsmusics_for_flutter/Resource_Library/App_System_Theme/App_System_Theme_Of_SVG.dart';

class SongInfo_SongList_ListViewItem_Style extends StatefulWidget {

  @override
  _SongInfo_SongList_ListViewItem_Style createState() => _SongInfo_SongList_ListViewItem_Style();
}
class _SongInfo_SongList_ListViewItem_Style extends State<SongInfo_SongList_ListViewItem_Style> {

  @override
  void initState() {
    super.initState();
    // Your initialization code here
    //print('Component initialized');
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 50,
      child: Row(
        children: [
          ///专辑图像
          Container(
            margin: EdgeInsets.only(left:22),
            height: 36,
            child: Image(
              image: AssetImage('Resource_UI_Ico/1x/NSMusicS.png'),
              //fit: BoxFit.scaleDown,
              fit: BoxFit.cover,
            ),
          ),
          ///歌曲标题名
          Container(
            margin: EdgeInsets.only(top:6,left: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  //设置文本对象的Text的文本内容
                  "你把我灌醉",
                  //设置文本对象的Text的文本显示的属性
                  style: TextStyle(
                      fontSize: 18,
                      color: Color(0xFF283248),
                      fontWeight: FontWeight.w500
                  ),
                ),
                Text(
                  //设置文本对象的Text的文本内容
                  "G.E.M.邓紫棋",
                  //设置文本对象的Text的文本显示的属性
                  style: TextStyle(
                      fontSize: 12,
                      color: Color(0xFF8A909E),
                      fontWeight: FontWeight.w400
                  ),
                ),
              ],
            ),
          ),
          ///歌曲操作
          Container(
            margin: EdgeInsets.only(left: 68),
            width: 80,
            child: Row(
              children: [
                Container(
                  width: 20,height: 20,
                  child: SVG_Love,
                ),
                Container(
                  margin: EdgeInsets.only(left: 8),
                  width: 20,height: 20,
                  child: SVG_Song_Copy,
                ),
                Container(
                  margin: EdgeInsets.only(left: 8),
                  width: 20,height: 20,
                  child: SVG_Help,
                ),
              ],
            ),
          ),
          ///歌曲时长
          Container(
            margin: EdgeInsets.only(left: 44),
            child: Text(
              //设置文本对象的Text的文本内容
              "04:45",
              //设置文本对象的Text的文本显示的属性
              style: TextStyle(
                  fontSize: 18,
                  color: Color(0xFF8A909E),
                  height: 1.2, //1倍行高
                  fontWeight: FontWeight.w400
              ),
            ),
          )
        ],
      ),
    );
  }
}