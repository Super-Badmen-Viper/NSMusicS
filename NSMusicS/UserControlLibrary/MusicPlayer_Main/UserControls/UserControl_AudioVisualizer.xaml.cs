using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using System.Threading;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using System.Windows.Threading;
using NAudio.CoreAudioApi;
using NAudio.Wave;
using NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls.UserControl_AudioVisualizers;
using NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls.VIewModules_AudioVisualizers;
using Brush = System.Windows.Media.Brush;
using Color = System.Windows.Media.Color;
using Point = System.Windows.Point;
using Rectangle = System.Windows.Shapes.Rectangle;
using Visualizer = NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls.UserControl_AudioVisualizers.Visualizer;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls
{
    /// <summary>
    /// UserControl_AudioVisualizer.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_AudioVisualizer : UserControl
    {
        /// <summary>
        /// 表示正在清理spectrumData内存，为true则不执行绘制的代码
        /// </summary>
        bool spectrumData_Clear = false;
        public ObservableCollection<double> spectrumData = new ObservableCollection<double>();// 频谱数据   
        /// <summary>
        /// 收集产生的PathGeometry
        /// </summary>
        public ObservableCollection<PathGeometry> pathGeometries = new ObservableCollection<PathGeometry>();

        public WasapiCapture capture; // 音频捕获
        private Visualizer visualizer; // 可视化
        public int wave_data_size;
        public Timer? dataTimer;
        public Timer? drawingTimer;

        private ObservableCollection<Color> allColors = new ObservableCollection<Color>();// 渐变颜色
        public Storyboard Image_Song_Storyboard;

        public UserControl_AudioVisualizer()
        {
            InitializeComponent();
        }
        [DllImport("kernel32.dll")]
        private static extern bool SetProcessWorkingSetSize(IntPtr proc, int min, int max);

        /// <summary>
        /// 重置启动 频谱可视化
        /// </summary>
        /// <param name="wave_data_size"></param>
        /// <param name="DeviceNumber"></param>
        public void Reset_Visualizer(int wave_data_size, MMDevice defaultOutputDevice)
        {
            //释放内存
            if (Environment.OSVersion.Platform == PlatformID.Win32NT)
            {
                SetProcessWorkingSetSize(System.Diagnostics.Process.GetCurrentProcess().Handle, -1, -1);
            }
            GC.Collect();
            GC.WaitForPendingFinalizers();

            // 设置录制的音频输出源
            if (capture != null)
            {
                capture.Dispose();
                capture = null;
            }
            visualizer = null;



            capture = new WasapiLoopbackCapture(defaultOutputDevice); // 捕获电脑发出的声音
            capture.ShareMode = AudioClientShareMode.Shared;// 使用独占模式

            visualizer = new Visualizer(wave_data_size); // 新建一个可视化器, 并使用 256 个采样进行傅里叶变换

            capture.WaveFormat = WaveFormat.CreateIeeeFloatWaveFormat(8192, 1); // 指定捕获的格式, 单声道, 32位深度, IeeeFloat 编码, 8192采样率
            capture.DataAvailable += Capture_DataAvailable; // 订阅事件

            capture.StartRecording();

            drawingTimer = null;
            dataTimer = new Timer(DataTimer_Tick, null, 30, 30);



            allColors.Clear();
            //Color.FromArgb(255, allColors[i].R, allColors[i].G, allColors[i].B);
            allColors = new ObservableCollection<Color>(GetAllHsvColors()); // 获取所有的渐变颜色 (HSV 颜色)

            Image_Song_Storyboard = Resources["Image_Song_Animation"] as Storyboard;

            this.wave_data_size = wave_data_size;

            //释放内存
            if (Environment.OSVersion.Platform == PlatformID.Win32NT)
            {
                SetProcessWorkingSetSize(System.Diagnostics.Process.GetCurrentProcess().Handle, -1, -1);
            }
            GC.Collect();
            GC.WaitForPendingFinalizers();
        }
        /// <summary>
        /// 关闭 频谱可视化
        /// </summary>
        public void Close_Visualizer()
        {
            this.wave_data_size = 0;

            capture.StopRecording();
            capture.DataAvailable -= Capture_DataAvailable; // 订阅事件
            capture.Dispose();
            capture = null;

            if (spectrumData != null)
                spectrumData.Clear();
            if (pathGeometries != null)
                pathGeometries.Clear();

            dataTimer = null;
            drawingTimer = null;

            visualizer = null;

            allColors.Clear();

            Image_Song_Storyboard = null;

            //释放内存
            if (Environment.OSVersion.Platform == PlatformID.Win32NT)
            {
                SetProcessWorkingSetSize(System.Diagnostics.Process.GetCurrentProcess().Handle, -1, -1);
            }
            GC.Collect();
            GC.WaitForPendingFinalizers();
        }

        /// <summary>
        /// 获取 HSV 中所有的基础颜色 (饱和度和明度均为最大值)
        /// </summary>
        /// <returns>所有的 HSV 基础颜色(共 256 * 6 个, 并且随着索引增加, 颜色也会渐变)</returns>
        private Color[] GetAllHsvColors()
        {
            Color[] result = new Color[256 * 6];

            for (int i = 0; i <= 255; i++)
            {
                result[i] = Color.FromArgb(255, 255, (byte)i, 0);
            }

            for (int i = 0; i <= 255; i++)
            {
                result[256 + i] = Color.FromArgb(255, (byte)(255 - i), 255, 0);
            }

            for (int i = 0; i <= 255; i++)
            {
                result[512 + i] = Color.FromArgb(255, 0, 255, (byte)i);
            }

            for (int i = 0; i <= 255; i++)
            {
                result[768 + i] = Color.FromArgb(255, 0, (byte)(255 - i), 255);
            }

            for (int i = 0; i <= 255; i++)
            {
                result[1024 + i] = Color.FromArgb(255, (byte)i, 0, 255);
            }

            for (int i = 0; i <= 255; i++)
            {
                result[1280 + i] = Color.FromArgb(255, 255, 0, (byte)(255 - i));
            }

            return result;
        }
        private void Capture_DataAvailable(object? sender, WaveInEventArgs e)
        {
            int length = e.BytesRecorded / 4; // 采样的数量 (每一个采样是 4 字节)
            double[] result = new double[length]; // 声明结果

            for (int i = 0; i < length; i++)
                result[i] = BitConverter.ToSingle(e.Buffer, i * 4); // 取出采样值

            if (visualizer != null)
                visualizer.PushSampleData(result); // 将新的采样存储到 可视化器 中

            length = 0; result = null;
        }

        /// <summary>
        /// 画曲线
        /// </summary>
        /// <param name="g"></param>
        /// <param name="brush"></param>
        /// <param name="spectrumData"></param>
        /// <param name="pointCount"></param>
        /// <param name="drawingWidth"></param>
        /// <param name="xOffset"></param>
        /// <param name="yOffset"></param>
        /// <param name="scale"></param>
        private void DrawCurve(Path g, Brush brush,
            ObservableCollection<double> spectrumData, int pointCount, double drawingWidth,
            double xOffset, double yOffset, double scale)
        {
            if (pathGeometries != null)
            {
                Point[] points = new Point[pointCount];
                for (int i = 0; i < pointCount; i++)
                {
                    double x = i * drawingWidth / pointCount;
                    double y = spectrumData[i * spectrumData.Count / pointCount] * scale + yOffset;
                    points[i] = new Point(x, y);

                    x = 0; y = 0;
                }

                PathFigure fig = new PathFigure
                {
                    StartPoint = points[0]
                };
                fig.Segments.Add(new PolyLineSegment(points, true));
                PathGeometry pathGeometry = new PathGeometry();
                try
                {
                    if (!spectrumData_Clear)
                    {
                        pathGeometry.Figures.Add(fig);
                        pathGeometries.Add(pathGeometry);
                        g.Data = pathGeometries[pathGeometries.Count - 1];
                        if (!SpectrumData_Zero)
                            g.StrokeThickness = 1;
                        else
                            g.StrokeThickness = 0;
                        g.Stroke = null;
                        g.Stroke = brush;

                    }
                    else
                        pathGeometry = null;
                }
                catch
                {
                    pathGeometry = null;
                }

                points = null; fig = null; brush = null;
            }
        }


        /// <summary>
        /// 画圆环条
        /// </summary>
        /// <param name="g">表示要绘制路径的对象（Path）</param>
        /// <param name="inner">内部颜色，用于渐变填充的起始颜色。</param>
        /// <param name="outer">外部颜色，用于渐变填充的结束颜色。</param>
        /// <param name="spectrumData">包含条纹数据的可观察集合。</param>
        /// <param name="stripCount">条纹的数量。</param>
        /// <param name="xOffset">圆环的中心点的偏移量。</param>
        /// <param name="yOffset">圆环的半径。</param>
        /// <param name="radius">条纹之间的间距。</param>
        /// <param name="spacing">圆环的旋转角度。param>
        /// <param name="scale">条纹高度的缩放比例。</param>
        private void DrawCircleGradientStrips(
            Path g, Color inner, Color outer, ObservableCollection<double> spectrumData, int stripCount,
            double xOffset, double yOffset, double radius,
            double spacing, double rotation, double scale)
        {
            if (spectrumData != null && spectrumData.Count == stripCount)
            {
                try
                {
                    //旋转角度转弧度
                    double rotationAngle = Math.PI / 180 * rotation;

                    //等分圆周，每个（竖条+空白）对应的弧度
                    double blockWidth = Math.PI * 2 / spectrumData.Count; // angle

                    //每个竖条对应的弧度
                    double stripWidth = blockWidth - MathF.PI / 180 * spacing; // angle

                    Point[] points = new Point[spectrumData.Count];

                    for (int i = 0; i < spectrumData.Count; i++)
                    {
                        double x = blockWidth * i + rotationAngle; // angle
                        double y = 0;
                        var result = spectrumData.FirstOrDefault();
                        if (result != null)
                        {
                            int num = i * spectrumData.Count / spectrumData.Count;
                            if (num < spectrumData.Count)
                                y = spectrumData[i * spectrumData.Count / spectrumData.Count] * scale; // height
                        }
                        points[i] = new Point(x, y);
                    }

                    rotationAngle = 0; blockWidth = 0;

                    PathGeometry temp_pg = new PathGeometry();
                    try
                    {
                        for (int i = 0; i < spectrumData.Count; i++)
                        {
                            double sinStart = Math.Sin(points[i].X);
                            double sinEnd = Math.Sin(points[i].X + stripWidth);
                            double cosStart = Math.Cos(points[i].X);
                            double cosEnd = Math.Cos(points[i].X + stripWidth);

                            Point[] polygon = new Point[]
                            {
                                new Point((cosStart * radius + xOffset), (sinStart * radius + yOffset)),
                                new Point((cosEnd * radius + xOffset), (sinEnd * radius + yOffset)),
                                new Point((cosEnd * (radius + points[i].Y) + xOffset), (sinEnd * (radius + points[i].Y) + yOffset)),
                                new Point((cosStart * (radius + points[i].Y) + xOffset), (sinStart * (radius + points[i].Y) + yOffset))
                            };

                            sinStart = 0; sinEnd = 0; cosStart = 0; cosEnd = 0;

                            PathFigure fig = new PathFigure
                            {
                                StartPoint = polygon[0],
                                IsFilled = true
                            };
                            fig.Segments.Add(new PolyLineSegment(polygon, false));

                            temp_pg.Figures.Add(fig);

                            polygon = null; fig = null;
                        }
                        stripWidth = 0;

                        pathGeometries.Add(temp_pg);
                        g.Data = pathGeometries[pathGeometries.Count - 1];

                        double maxHeight = points.Max(v => v.Y);
                        g.Fill = new LinearGradientBrush(
                            new GradientStopCollection()
                            {
                                /*new GradientStop(Colors.Transparent, 0),*/
                                new GradientStop(
                                    Color.FromArgb(255, inner.R, inner.G, inner.B), radius / (radius + maxHeight)),
                                new GradientStop(
                                    Color.FromArgb(255, outer.R, outer.G, outer.B), 1)
                            },
                            new Point(xOffset, 0),
                            new Point(xOffset, 1)
                        ); ;

                        points = null; maxHeight = 0;
                    }
                    catch
                    {
                        temp_pg = null; points = null;
                    }
                }
                catch { }
            }
        }
        /// <param name="g">表示要绘制路径的对象（Path）</param>
        /// <param name="inner">内部颜色，用于渐变填充的起始颜色。</param>
        /// <param name="outer">外部颜色，用于渐变填充的结束颜色。</param>
        /// <param name="spectrumData">包含条纹数据的可观察集合。</param>
        /// <param name="stripCount">条纹的数量。</param>
        /// <param name="xOffset">圆环的中心点的偏移量。</param>
        /// <param name="yOffset">圆环的半径。</param>
        /// <param name="radius">条纹之间的间距。</param>
        /// <param name="spacing">圆环的旋转角度。param>
        /// <param name="scale">条纹高度的缩放比例。</param>
        private void DrawCircleGradientStrips_Double(
            Path g, Color inner, Color outer, 
            ObservableCollection<double> spectrumData, int stripCount,
            double xOffset, double yOffset, double radius,
            double spacing, double rotation, double scale)
        {
            if (spectrumData != null && spectrumData.Count == stripCount)
            {
                try
                {
                    //旋转角度转弧度
                    double rotationAngle = Math.PI / 180 * rotation;

                    //等分圆周，每个（竖条+空白）对应的弧度
                    double blockWidth = Math.PI * 2 / spectrumData.Count; // angle

                    //每个竖条对应的弧度
                    double stripWidth = blockWidth - MathF.PI / 180 * spacing; // angle

                    Point[] points = new Point[spectrumData.Count];

                    for (int i = 0; i < spectrumData.Count; i++)
                    {
                        double x = blockWidth * i + rotationAngle; // angle
                        double y = 0;
                        var result = spectrumData.FirstOrDefault();
                        if (result != null)
                        {
                            int num = i * spectrumData.Count / spectrumData.Count;
                            if (num < spectrumData.Count)
                                y = spectrumData[i * spectrumData.Count / spectrumData.Count] * scale; // height
                        }
                        points[i] = new Point(x, y);
                    }

                    rotationAngle = 0; blockWidth = 0;

                    PathGeometry temp_pg = new PathGeometry();
                    try
                    {
                        for (int i = 0; i < spectrumData.Count; i++)
                        {
                            //绘制线条，并指定角度
                            double sinStart = Math.Sin(points[i].X);
                            double sinEnd = Math.Sin(points[i].X + stripWidth);
                            double cosStart = Math.Cos(points[i].X);
                            double cosEnd = Math.Cos(points[i].X + stripWidth);
                            Point[] polygon = new Point[]
                            {
                                new Point((cosStart * radius + xOffset), (sinStart * radius + yOffset)),
                                new Point((cosEnd * radius + xOffset), (sinEnd * radius + yOffset)),
                                new Point((cosEnd * (radius + points[i].Y) + xOffset), (sinEnd * (radius + points[i].Y) + yOffset)),
                                new Point((cosStart * (radius + points[i].Y) + xOffset), (sinStart * (radius + points[i].Y) + yOffset))
                            };
                            sinStart = 0; sinEnd = 0; cosStart = 0; cosEnd = 0;

                            PathFigure fig = new PathFigure
                            {
                                StartPoint = polygon[0],
                                IsFilled = true
                            };
                            fig.Segments.Add(new PolyLineSegment(polygon, false));

                            temp_pg.Figures.Add(fig);

                            polygon = null; fig = null;
                        }
                        stripWidth = 0;

                        pathGeometries.Add(temp_pg);
                        g.Data = pathGeometries[pathGeometries.Count - 1];

                        double maxHeight = points.Max(v => v.Y);
                        g.Fill = new LinearGradientBrush(
                            new GradientStopCollection()
                            {
                                /*new GradientStop(Colors.Transparent, 0),*/
                                new GradientStop(
                                    Color.FromArgb(255, inner.R, inner.G, inner.B), radius / (radius + maxHeight)),
                                new GradientStop(
                                    Color.FromArgb(255, outer.R, outer.G, outer.B), 1)
                            },
                            new Point(xOffset, 0),
                            new Point(xOffset, 1)
                        ); ;

                        points = null; maxHeight = 0;
                    }
                    catch
                    {
                        temp_pg = null; points = null;
                    }
                }
                catch { }
            }
        }

        bool SpectrumData_Zero;
        /// <summary>
        /// 用来刷新频谱数据以及实现频谱数据缓动
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void DataTimer_Tick(object? state)
        {
            if (pathGeometries != null)
            {
                pathGeometries.Clear();
            }
            else
                pathGeometries = new ObservableCollection<PathGeometry>();

            if (visualizer != null)
            {
                if (visualizer.GetSpectrumData().Max() > 0)
                {
                    double[] newSpectrumData = visualizer.GetSpectrumData(); // 从可视化器中获取频谱数据
                    newSpectrumData = MakeSmooth(newSpectrumData, 2); // 平滑频谱数据
                    spectrumData = new ObservableCollection<double>(newSpectrumData);

                    if (spectrumData.Count == 0)
                    {
                        return;
                    }
                    else
                    {
                        if (spectrumData.Count == newSpectrumData.Length)
                        {
                            for (int i = 0; i < newSpectrumData.Length; i++) // 计算旧频谱数据和新频谱数据之间的 "中间值"
                            {
                                double oldData = spectrumData[i];
                                double newData = newSpectrumData[i];
                                double lerpData =
                                    oldData + (newData - oldData) * .4f; // 每一次执行, 频谱值会向目标值移动 20% (如果太大, 缓动效果不明显, 如果太小, 频谱会有延迟的感觉)
                                spectrumData[i] = lerpData;

                                oldData = 0; newData = 0; lerpData = 0;
                            }
                            spectrumData_Clear = false;
                            drawingTimer = new Timer(DrawingTimer_Tick, null, 30, 30);

                            newSpectrumData = null;

                            SpectrumData_Zero = false;
                        }
                    }
                }
                else
                {
                    SpectrumData_Zero = true;
                }
            }
        }

        int colorIndex = 0;
        double rotation = 0;
        DispatcherOperation? lastInvocation;
        /// <summary>
        /// 绘制频谱数据
        /// </summary>
        /// <param name="state"></param>
        public void DrawingTimer_Tick(object? state)
        {
            if (spectrumData == null)
                return;
            if (lastInvocation != null &&
                lastInvocation.Status == DispatcherOperationStatus.Executing)
                return;

            if (spectrumData.Count > 0)
            {
                if (!spectrumData_Clear)
                {
                    try
                    {
                        lastInvocation = Dispatcher.InvokeAsync(() =>
                        {
                            try
                            {
                                rotation += .1;
                                colorIndex++;

                                DrawCurve(
                                    sampleWave_1, new SolidColorBrush(allColors[colorIndex % allColors.Count]), SmoothData(new ObservableCollection<double>(visualizer.SampleData), 2), visualizer.SampleData.Length,
                                            drawingPanel.ActualWidth, 0, drawingPanel.ActualHeight / 2,
                                            Math.Min(drawingPanel.ActualHeight / 10, 100)
                                    );
                                DrawCurve(
                                    sampleWave_2, new SolidColorBrush(allColors[colorIndex % allColors.Count]), SmoothData(ReverseArray(new ObservableCollection<double>(visualizer.SampleData)), 2), visualizer.SampleData.Length,
                                    drawingPanel.ActualWidth, 0, drawingPanel.ActualHeight / 2,
                                    Math.Min(drawingPanel.ActualHeight / 10, 100)
                                );
                                
                                DrawCircleGradientStrips(
                                    circle_1, allColors[colorIndex % allColors.Count], allColors[(colorIndex + 200) % allColors.Count],
                                    spectrumData, spectrumData.Count,//频谱数据
                                    drawingPanel.ActualWidth / 2, drawingPanel.ActualHeight / 2,//圆环位置
                                    110,//大小
                                    1, rotation, drawingPanel.ActualHeight * (visualizer.waveDataSize / 40 /* 通道数 / 51.2 */)  //频谱高度 幅度
                                );
                                DrawCircleGradientStrips_Double(
                                    circle_3, allColors[colorIndex % allColors.Count], allColors[(colorIndex + 200) % allColors.Count],
                                    spectrumData, spectrumData.Count,//频谱数据
                                    drawingPanel.ActualWidth / 2, drawingPanel.ActualHeight / 2,//圆环位置
                                    136 + (Math.Min(drawingPanel.ActualHeight, drawingPanel.ActualHeight) / 6) * (spectrumData.Average() * 120),//大小
                                    2, -rotation, 1600  //频谱高度 幅度
                                    );
                            }
                            catch {
                                if (drawingTimer != null)
                                    drawingTimer.Dispose();
                            }
                        });
                    }
                    catch {
                        if (drawingTimer != null)
                            drawingTimer.Dispose();
                        goto loop;
                    }
                }
            }
            loop:;
        }
        private ObservableCollection<double> ReverseArray(ObservableCollection<double> array)
        {
            ObservableCollection<double> reversedArray = new ObservableCollection<double>();
            int j = array.Count - 1;

            for (int i = 0; i < array.Count; i++)
            {
                reversedArray.Add(array[i]);
                j--;
            }

            array.Clear();
            array = null;

            return reversedArray;
        }
        private ObservableCollection<double> SmoothData(ObservableCollection<double> data, int windowSize)
        {
            ObservableCollection<double> smoothedData = new ObservableCollection<double>();
            for (int i = 0; i < data.Count; i++)
            {
                int windowStartIndex = Math.Max(0, i - windowSize / 2);
                int windowEndIndex = Math.Min(data.Count - 1, i + windowSize / 2);
                double sum = 0;
                for (int j = windowStartIndex; j <= windowEndIndex; j++)
                {
                    sum += data[j];
                }
                smoothedData.Add((double)(sum / (windowEndIndex - windowStartIndex + 1)));

                windowStartIndex = 0; windowEndIndex = 0; sum = 0;
            }

            data.Clear(); data = null;
            windowSize = 0;

            return smoothedData;
        }
        private double[] MakeSmooth(double[] data, int radius)
        {
            double[] GetWeights(int radius)
            {
                double Gaussian(double x) => Math.Pow(Math.E, (-4 * x * x)); // 憨批高斯函数

                int len = 1 + radius * 2; // 长度
                int end = len - 1; // 最后的索引
                double radiusF = (double)radius; // 半径浮点数
                double[] weights = new double[len]; // 权重

                for (int i = 0; i <= radius; i++) // 先把右边的权重算出来
                    weights[radius + i] = Gaussian(i / radiusF);
                for (int i = 0; i < radius; i++) // 把右边的权重拷贝到左边
                    weights[i] = weights[end - i];

                double total = weights.Sum();
                for (int i = 0; i < len; i++) // 使权重合为 0
                    weights[i] = weights[i] / total;

                len = 0; end = 0; radiusF = 0; total = 0;

                return weights;
            }

            void ApplyWeights(double[] buffer, double[] weights)
            {
                int len = buffer.Length;
                for (int i = 0; i < len; i++)
                    buffer[i] = buffer[i] * weights[i];

                len = 0;
            }


            double[] weights = GetWeights(radius);
            double[] buffer = new double[1 + radius * 2];

            double[] result = new double[data.Length];
            if (data.Length < radius)
            {
                Array.Fill(result, data.Average());
                return result;
            }


            for (int i = 0; i < radius; i++)
            {
                Array.Fill(buffer, data[i], 0, radius + 1); // 填充缺省
                for (int j = 0; j < radius; j++) // 
                {
                    buffer[radius + 1 + j] = data[i + j];
                }

                ApplyWeights(buffer, weights);
                result[i] = buffer.Sum();
            }

            for (int i = radius; i < data.Length - radius; i++)
            {
                for (int j = 0; j < radius; j++) // 
                {
                    buffer[j] = data[i - j];
                }

                buffer[radius] = data[i];

                for (int j = 0; j < radius; j++) // 
                {
                    buffer[radius + j + 1] = data[i + j];
                }

                ApplyWeights(buffer, weights);
                result[i] = buffer.Sum();
            }

            for (int i = data.Length - radius; i < data.Length; i++)
            {
                Array.Fill(buffer, data[i], 0, radius + 1); // 填充缺省
                for (int j = 0; j < radius; j++) // 
                {
                    buffer[radius + 1 + j] = data[i - j];
                }

                ApplyWeights(buffer, weights);
                result[i] = buffer.Sum();
            }

            return result;
        }
    }
}