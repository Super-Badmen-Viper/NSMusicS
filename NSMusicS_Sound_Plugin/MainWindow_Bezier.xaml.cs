using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Xml.Linq;

namespace NSMusicS_Sound_Plugin
{
    /// <summary>
    /// Interaction logic for MainWindow_Bezier.xaml
    /// </summary>
    public partial class MainWindow_Bezier : Window
    {
        public MainWindow_Bezier()
        {
            InitializeComponent();

            canvas.MouseLeftButtonDown += Canvas_MouseLeftButtonDown;
            canvas.MouseRightButtonDown += Canvas_MouseRightButtonDown;//创建节点
            canvas.MouseMove += Canvas_MouseMove;
            canvas.MouseLeftButtonUp += Canvas_MouseLeftButtonUp;

            PolyBezierSegment polyBezierSegment = new PolyBezierSegment();
            polyBezierSegment.Points.Add(new Point(0, 0));
            polyBezierSegment.Points.Add(new Point(0, 0));
            polyBezierSegment.Points.Add(new Point(1000, 0));
            pathFigure.Segments.Clear();
            pathFigure.Segments.Add(polyBezierSegment);
        }

        

        private bool isDragging = false;

        private Point Begin_point = new Point(0,0);
        private Point End_point = new Point(1000,0);
        private List<Point> Middle_Points = new List<Point>();



        /// <summary>
        /// 每增加一个节点，各节点的首尾都需要重新计算(且累加相连)
        /// </summary>
        private List<PolyBezierSegment> List_polyBezierSegments = new List<PolyBezierSegment>();

        /// <summary>
        /// 上一个 选中点-X轴值
        /// </summary>
        double Previous_Node_X_Axis_Value = 0;

        /// <summary>
        /// 控制曲线幅度：表示已按住并打算拖动鼠标
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        /// <exception cref="NotImplementedException"></exception>
        private void Canvas_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            isDragging = true;
        }
        private void Canvas_MouseLeftButtonUp(object sender, MouseButtonEventArgs e)
        {
            isDragging = false;
        }
        /// <summary>
        /// 控制曲线幅度：拖动鼠标的同时
        /// 鼠标X与Y轴的值，影响所在曲线区间的曲线形态
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Canvas_MouseMove(object sender, MouseEventArgs e)
        {
            if (isDragging)
            {
                Point point = e.GetPosition(canvas); // 获取鼠标位置
                point = new Point(point.X, point.Y - 298);

                foreach (PolyBezierSegment temp in pathFigure.Segments)
                {
                    //1.找到鼠标位置X值，所位于哪条曲线的区间
                    if (point.X > temp.Points[0].X)
                    {
                        if (point.X < temp.Points[2].X)
                        {
                            //2.找到后，修改此曲线的曲线形态，

                            temp.Points[1] = new Point(
                                point.X,
                                point.Y * 2
                                );

                            break;
                        }
                    }
                }
            }
        }
        


        /// <summary>
        /// 创建节点
        /// 在此条贝塞尔曲线区间中，增加一个坐标点（鼠标位置）
        /// 使此区间的一条贝塞尔曲线，变成两条
        /// 第一条：初始坐标不变，曲线形状缩小，结束坐标为(鼠标位置的X坐标，0)
        /// 第二条：初始坐标为(鼠标位置的X坐标,0),曲线形状为()，结束坐标不变
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Canvas_MouseRightButtonDown(object sender, MouseButtonEventArgs e)
        {
            /// <summary>
            /// 如果未添加节点，则清除初始化的数据
            /// </summary>
            /*if (pathFigure.Segments.Count == 1)
            {
                pathFigure.Segments.Clear();
            }*/


            /// <summary>
            /// 根据鼠标位置 生成一条 贝塞尔曲线
            /// </summary>
            Point point = e.GetPosition(canvas); 
            point = new Point(point.X, point.Y - 298);
            // 生成一条 贝塞尔曲线，PolyBezierSegment(3坐标)
            PolyBezierSegment polyBezierSegment_1 = new PolyBezierSegment();
            PolyBezierSegment polyBezierSegment_2 = new PolyBezierSegment();
            //
            foreach (PolyBezierSegment temp in pathFigure.Segments)
            {
                //1.找到鼠标位置X值，所位于哪条曲线的区间
                if (point.X > temp.Points[0].X)
                {
                    if (point.X < temp.Points[2].X)
                    {
                        //2.找到该曲线后，将其一分为二，先重新计算第一条曲线

                        // 初始坐标：                         (上一个 选中点-X轴值,                         0)               （X轴值，后续需累加）
                        polyBezierSegment_1.Points.Add(new Point(temp.Points[0].X,                    0));
                        // 曲线形状：                         (偏移值,                                      选中点-y轴值)    （偏移值，默认为 初始节点到结束节点距离的一半，显示为规则半椭圆）
                        polyBezierSegment_1.Points.Add(new Point((temp.Points[0].X + point.X) / 2,    point.Y /*凸起量 point.Y*/));
                        // 结束坐标：                         (当前的 选中点-X轴值 + 累加,                  0)               （当前的 选中点-X轴值，后续需累加）
                        polyBezierSegment_1.Points.Add(new Point(point.X,                             0));

                        //3.计算第二条曲线
                        polyBezierSegment_2.Points.Add(new Point(point.X,                                       0));
                        polyBezierSegment_2.Points.Add(new Point((temp.Points[2].X - point.X)/2 + point.X,      point.Y));
                        polyBezierSegment_2.Points.Add(new Point(temp.Points[2].X,                              0));

                        break;
                    }
                }
            }


            /// <summary>
            /// 将当前生成的 贝塞尔曲线 添加至贝塞尔曲线数组中(UI显示)
            /// </summary>
            // 1.先保存当前的 贝塞尔曲线数组
            PathSegmentCollection Temp_Collection_PolyBezierSegment = new PathSegmentCollection(pathFigure.Segments);
            // 2.清空UI中的 贝塞尔曲线数组
            pathFigure.Segments.Clear();
            // 3.遍历所有的 贝塞尔曲线
            for (int i = 0; i < Temp_Collection_PolyBezierSegment.Count; i++)
            {
                // 4.找到 该下标的 (选中点)的最后一组坐标 的X轴值
                double Temp_Previous_Node_X_Axis_Value = ((PolyBezierSegment)Temp_Collection_PolyBezierSegment[i]).Points[2].X;
                // 5.1比较 当前新生成的 贝塞尔曲线的 第一组X轴值，是否在其后一位
                if (Temp_Previous_Node_X_Axis_Value > polyBezierSegment_1.Points[0].X)
                {
                    // 5.2.在此 数组遍历下标的 其后一位，则将当前新生成的 贝塞尔曲线 添加至其后一位
                    pathFigure.Segments.Add(polyBezierSegment_1);
                    pathFigure.Segments.Add(polyBezierSegment_2);

                    // 5.4.1.将剩下未添加的(即位于之前的UI贝塞尔曲线数组中，位于在此 数组遍历下标的 其后一位的 所有贝塞尔曲线，重新添加至当前的UI贝塞尔曲线数组)
                    // 5.4.2.相当于中间插值
                    for (int k = i + 1; k < Temp_Collection_PolyBezierSegment.Count; k++)
                    {
                        PolyBezierSegment temp_1 = (PolyBezierSegment)Temp_Collection_PolyBezierSegment[k];
                        pathFigure.Segments.Add(temp_1);
                    }

                    //5.5.退出循环，完成中间插值(贝塞尔曲线)
                    break;
                }
                else
                {
                    // 5.1.先添加在此下标之前的 贝塞尔曲线 至UI数组
                    pathFigure.Segments.Add(Temp_Collection_PolyBezierSegment[i]);
                }

            }
        }
    }
}
