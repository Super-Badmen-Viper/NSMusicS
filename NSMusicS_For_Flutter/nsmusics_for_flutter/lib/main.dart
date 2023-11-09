///自定义窗体设置///来自https://pub.dev/packages/bitsdojo_window
import 'package:bitsdojo_window/bitsdojo_window.dart';
/*
main.cpp
  自定义窗体设置,来自https://pub.dev/packages/bitsdojo_window
  #include <bitsdojo_window_windows/bitsdojo_window_plugin.h>
  auto bdw = bitsdojo_window_configure(BDW_CUSTOM_FRAME | BDW_HIDE_ON_STARTUP);
*/

import 'package:flutter/material.dart';
import 'Resource_Library/App_System_Theme/App_System_Theme_Of_Colors.dart';
import 'Views/App_Left_Grid/App_Left_Grid.dart';
import 'Views/App_Right_Grid/App_Right_Grid.dart';


///主方法入口
void main() {
  ///先启动窗体
  runApp(const MyApp());

  ///自定义窗体设置///来自https://pub.dev/packages/bitsdojo_window
  doWhenWindowReady(() {
    const initialSize = Size(1000, 684);
    appWindow.minSize = initialSize;
    appWindow.size = initialSize;
    appWindow.alignment = Alignment.center;
    appWindow.show();
  });
}
///主窗体
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,/// 消除页面右上角的debug条幅
      home: Scaffold(/// Scaffold 是整个页面的根部件，作为 MaterialApp 的 home 属性的子部件。
        /// 它有一个名为 body 的属性，用于设置页面的主要内容。
        body: ClipRRect(
          //borderRadius: BorderRadius.circular(20), /// 设置圆角半径

          child: WindowBorder(/// WindowBorder：用于包裹子组件并添加窗口边框的小部件(来自bitsdojo_window包)
            color: app_border_Color,
            width: 1,
            child: Stack(
              children: [

                ///主内容
                Container(
                  width: double.infinity, // 设置宽度为屏幕宽度
                  child: Row(/// children的内容将Row水平排列
                    children: const [
                      App_Left_Grid(),
                      App_Right_Grid(),
                    ],
                    /// App_Left_Grid() 和 App_Right_Grid() 这两个子部件将水平排列在一行上，它们之间没有间隔。
                  ),
                ),

                ///窗体拖动功能：Positioned.fill置于底部表示最顶部
                Positioned.fill(
                  child: MoveWindow()
                )

              ],
            ),
          ),

        ),
      ),
    );
  }
}





/*
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // 这个小部件是应用程序的根。
  @override
  Widget build(BuildContext context) {
    //构建此应用程序
    return MaterialApp(
      //构建此应用的title
      title: 'Flutter Demo',

      //构建此应用的theme
      theme: ThemeData(
        //这是您应用程序的主题。
        //
        //试试这个：试着用“flutter run”运行你的应用程序。你会看到的
        //该应用程序有一个蓝色工具栏。然后，在不退出应用程序的情况下，
        //尝试将下面colorScheme中的seedColor更改为Colors.green
        //然后调用“hot-reload”（保存更改或按“hot
        //reload”按钮，或者如果您使用
        //启动应用程序的命令行）。
        //
        //请注意，计数器没有重置为零；应用程序
        //在重新加载过程中不会丢失状态。
        //要重置状态，不是使用热重载，而是重新启动。
        //
        //这也适用于代码，而不仅仅适用于值：大多数代码更改都可以
        //仅通过热重新加载进行测试。
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),

      //构建此应用的初始页面MyHomePage
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

//MyHomePage页面
class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  //它有一个State对象（定义如下），该对象包含影响
  //它看起来怎么样。
  //此类是状态的配置。它包含以下值（
  //以标题为例），以及
  //构建方法所使用的。Widget子类中的字段是
  //始终标记为“最终”。

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}
//MyHomePage页面的内置状态（事件触发）
class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;
  // 定义_counter变量递增方法
  void _incrementCounter() {
    setState(() {
      // 这个对 setState 的调用告诉 Flutter 框架，在这个 State 中有一些变化发生了，
      // 这会导致框架重新运行下面的 build 方法，
      // 以便显示可以反映更新后的值。
      // 如果我们在不调用 setState() 的情况下改变了 _counter，
      // 那么 build 方法将不会再次被调用，因此看起来什么都不会发生。
      _counter++;
    });
  }

  // _MyHomePageState类的触发重建方法
  // (此为Flutter的重绘机制，每次出发事件都会重绘UI控件)
  // 每次调用 setState 时，都会重新运行此方法，例如在上面的 _incrementCounter 方法中。
  @override
  Widget build(BuildContext context) {
    // Flutter 框架已经经过优化，使得重新运行 build 方法很快，
    // 这样您就可以只重新构建需要更新的部分，
    // 而无需逐个更改小部件的实例。
    return Scaffold(
      //appBar控件的重绘
      appBar: AppBar(
        // 试一下这个：尝试在这里将颜色更改为特定的颜色（例如 Colors.amber），
        // 然后触发热重载，看看 AppBar 的颜色会改变，而其他颜色保持不变。
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        // 在这里，我们从由 App.build 方法创建的 MyHomePage 对象中获取值，
        // 并将其用于设置我们的 AppBar 标题。
        title: Text(widget.title),
      ),
      //让body组件的child子组件在body组件的Center位置进行重绘
      body: Center(
        // Center 是一个布局小部件。它接受一个子组件并将其放置在父组件的中间位置。
        child: Column(
          // Column 也是一个布局小部件。它接受一个子组件列表，并将它们垂直排列。
          // 默认情况下，它会水平调整自身大小以适应子组件，并尝试与父组件一样高。
          // Column 有各种属性来控制其自身的大小和子组件的位置。
          // 在这里，我们使用 mainAxisAlignment 来垂直居中子组件；
          // 主轴在这里是垂直轴，因为 Column 是垂直排列的（交叉轴则是水平轴）。

          // 试一下这个：调用 "debug painting"
          // （在 IDE 中选择 "Toggle Debug Paint" 操作，或在控制台中按下 "p"）
          // 可以看到每个小部件的线框图。
          mainAxisAlignment: MainAxisAlignment.center,

          children: <Widget>[

            const Text(
              'You have pushed the button this many times:',
            ),

            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),

            ColorBox(Colors.lightBlueAccent,Colors.white),
          ],

        ),

      ),

      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
      // 这个尾逗号在构建方法中可以使自动格式化更加美观。

    );
  }
}
 */

///Flutter 之 Container, Row, Column,Expanded,Flexible
// Container由负责布局、绘画、定位和大小调整的几个控件组成，由LimitedBox、ConstrainedBox、 Align、Padding、DecoratedBox和Transform控件组成。
// (Creates a widget that combines common painting, positioning, and sizing widgets)
//
// Row:水平布局控件，能够将子控件水平排列
// (Creates a horizontal array of children)
//
// Column:垂直布局控件，能够将子控件垂直排列
// (Creates a vertical array of children)
//
// Expanded:强制子组件填充可用空间
// (A widget that expands a child of a [Row], [Column], or [Flex])
//
// Flexible组件:可以使Row、Column、Flex等子组件在主轴方向有填充可用空间的‘‘能力’’
// (A widget that controls how a child of a [Row], [Column], or [Flex] flexes.)

///StatefulWidget与StatelessWidget
// ColorBox生成组件类
// StatefulWidget ,是可变的，它们可以随着时间的推移而改变状态
// StatefulWidget 需要实现两个类：一个是StatefulWidget类本身，另一个是State类，用于管理状态
class ColorBox extends StatefulWidget{
  final Color ColorBox_Background;
  final Color ColorBox_Text_Background;
  //设置此ColorBox类的传入参数，默认返回此ColorBox类的构建函数中的return对象Container(.....)
  ColorBox(this.ColorBox_Background,this.ColorBox_Text_Background);

  //组件构建函数
  @override
  _ColorState createState() => _ColorState();
}
// ColorBox类UI组件内置逻辑
class _ColorState extends State<ColorBox>{
  //类属性
  int _count = 0;

  Widget build(BuildContext context) {
    //返回一个指定的组件对象（Container）
    return Container(
      //在对象()中的()内设置此组件的UI属性
      width: 300, height: 100,

      decoration: BoxDecoration(//圆角属性
        borderRadius: BorderRadius.circular(20), // 设置圆角半径为10
        color: widget.ColorBox_Background,//访问父类widget的属性
      ),
      //color: widget.ColorBox_Background,//访问父类widget的属性

      //设置其此组件内的child内容，类似WPF Grid中的Children
      child: Center(
        //生成一个TextButton组件
        child:TextButton(
          onPressed: (){
            setState(() {
              _count++;
            });
          },
          //往此组件的child内容，添加一个指定的对象类型(这里添加Text对象)
          child: Text(
            //设置文本对象的Text的文本内容
            "九歌：$_count",
            //设置文本对象的Text的文本显示的属性
            style: TextStyle(
                fontSize: 30,
                color: widget.ColorBox_Text_Background,
                fontWeight: FontWeight.bold
            ),
          ),
        ),
      ),
    );
  }
}
/* //StatelessWidget接口，只需要实现一个build方法来构建UI，是不可变的，它们在创建后不会改变状态
   //在性能方面，StatelessWidget比StatefulWidget更加高效。因为StatelessWidget没有可变状态，所以它们只需要在创建时构建一次
  class ColorBox extends StatelessWidget{
  final Color ColorBox_Background;
  final Color ColorBox_Text_Background;
  //设置此ColorBox类的传入参数，默认返回此ColorBox类的构建函数中的return对象Container(.....)
  ColorBox(this.ColorBox_Background,this.ColorBox_Text_Background);

  //组件构建函数
  @override
  Widget build(BuildContext context) {
    //返回一个指定的组件对象（Container）
    return Container(
      //在对象()中的()内设置此组件的UI属性
      width: 200,height: 100,
      color: ColorBox_Background,

      //设置其此组件内的child内容，类似WPF Grid中的Children
      child: Center(
        //往此组件的child内容，添加一个指定的对象类型(这里添加Text对象)
        child: Text(
          //设置文本对象的Text的文本内容
          "NSMusicS:九歌",
          //设置文本对象的Text的文本显示的属性
          style: TextStyle(
            fontSize: 20,
            color: ColorBox_Text_Background,
            fontWeight: FontWeight.bold
          ),
        ),
      ),
    );
  }
}
 */
/*
1.StatelessWidget和StatefulWidget都是Widget的子类，可以直接使用Flutter提供的这些类进行构建。
2.在StatefulWidget中，我们需要实现一个State类来管理状态，并在State的build方法中构建UI。
3.在StatefulWidget中，我们需要使用setState方法来更新状态，以触发UI的重新构建。
4.在使用StatefulWidget时，我们需要特别注意内存泄漏的问题。因为StatefulWidget中的状态是可变的，如果我们不注意及时释放资源，就可能导致内存泄漏。
 */



