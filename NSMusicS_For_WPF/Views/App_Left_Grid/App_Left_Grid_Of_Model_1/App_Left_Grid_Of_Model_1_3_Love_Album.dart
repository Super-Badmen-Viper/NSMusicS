import 'package:flutter/material.dart';
import '../../../Resource_Library/App_System_Reuse_Style/Buttons/Sideba_Page_Selection_Button_Style.dart';
import '../../../Resource_Library/App_System_Theme/App_System_Theme_Of_Colors.dart';
import '../../../Resource_Library/App_System_Theme/App_System_Theme_Of_SVG.dart';

class App_Left_Grid_Of_Model_1_3_Love_Album extends StatelessWidget {
  const App_Left_Grid_Of_Model_1_3_Love_Album({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      ///margin: EdgeInsets.only(top: 77.142),
      width: 180,
      child: Container(
          margin: EdgeInsets.only(top: 477.142),
          child: Container(

            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                ///标题栏1
                Container(
                  margin: EdgeInsets.only(top: 13),
                  width: 142,height: 21,
                  child: Text(
                    //设置文本对象的Text的文本内容
                    "☊-♪-我的音乐--------------------------",
                    //设置文本对象的Text的文本显示的属性
                    style: TextStyle(
                        fontSize: 8,
                        color: Color(0xFF646B7C),
                        fontWeight: FontWeight.w400
                    ),
                  ),
                ),
                ///按钮1
                Sideba_Page_Selection_Button_Style(
                    false,Sideba_Page_Selection_Button_Style_Color,Color(0xFF646B7C),"我的喜欢"
                    ,SVG_Love_Music
                ),
                Sideba_Page_Selection_Button_Style(
                    false,Sideba_Page_Selection_Button_Style_Color,Color(0xFF646B7C),"本地音乐"
                    ,SVG_Local_Music
                ),
                Sideba_Page_Selection_Button_Style(
                    false,Sideba_Page_Selection_Button_Style_Color,Color(0xFF646B7C),"默认列表"
                    ,SVG_Auto_List
                ),
                Sideba_Page_Selection_Button_Style(
                    false,Sideba_Page_Selection_Button_Style_Color,Color(0xFF646B7C),"自定义列表"
                    ,SVG_Custom_List
                ),
              ],
            ),
          )
      ),
    );
  }
}