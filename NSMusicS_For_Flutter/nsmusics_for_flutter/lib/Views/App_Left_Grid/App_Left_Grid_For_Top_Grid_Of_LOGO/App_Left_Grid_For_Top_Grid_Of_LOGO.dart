import 'package:bitsdojo_window/bitsdojo_window.dart';
import 'package:flutter/material.dart';

class App_Left_Grid_For_Top_Grid_Of_LOGO extends StatelessWidget {
  const App_Left_Grid_For_Top_Grid_Of_LOGO({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
        child: Stack(
          children: [
            ///LOGO区域
            Container(
              height: 77.142,
              child: Row(///绘制LOGO
                children: [
                  ///图像LOGO
                  Container(
                    margin: EdgeInsets.only(left: 26),
                    width: 25.714,
                    height: 25.714,
                    clipBehavior: Clip.hardEdge,
                    /*child: Image(
                                  image: AssetImage('Resource_UI_Ico/1x/NSMusicS.png'),
                                  //fit: BoxFit.scaleDown,
                                  fit: BoxFit.cover,
                                ),*/
                    decoration: BoxDecoration(//圆角属性
                      color: Colors.black,
                      borderRadius: BorderRadius.circular(20), // 设置圆角半径为10
                    ),
                    child: Container(
                      margin: EdgeInsets.only(left: 8,top: 8,right: 8,bottom: 8),
                      decoration: BoxDecoration(//圆角属性
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20), // 设置圆角半径为10
                      ),
                    ),
                  ),
                  ///文本LOGO
                  Expanded(
                    child: Stack(
                      children: [
                        Positioned(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,/// 纵轴 排列方式
                              children: [
                                Container(
                                  margin: EdgeInsets.only(left: 10,top: 12),
                                  child: Text(
                                    //设置文本对象的Text的文本内容
                                    "NSMusicS • \n九歌",
                                    //设置文本对象的Text的文本显示的属性
                                    style: TextStyle(
                                        fontSize: 14,
                                        color: Colors.black,
                                        fontWeight: FontWeight.w400
                                    ),
                                  ),
                                ),
                              ],
                            )
                        ),
                        Positioned(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,/// 纵轴 排列方式
                              children: [
                                Container(
                                  margin: EdgeInsets.only(left: 10,top: 50),
                                  child: Text(
                                    //设置文本对象的Text的文本内容
                                    "Nine Song Music World",
                                    //设置文本对象的Text的文本显示的属性
                                    style: TextStyle(
                                        fontSize: 9,
                                        color: Colors.black,
                                        fontWeight: FontWeight.w400
                                    ),
                                  ),
                                ),
                              ],
                            )
                        )
                      ],
                    ),
                  )
                ],
              ),
            ),

            ///拖动窗体
            /*Positioned.fill(
              child: Container(
                  width: 180, height: 77.142,
                  child: MoveWindow()
              ),
            ),*/


          ],
        ),
    );
  }
}