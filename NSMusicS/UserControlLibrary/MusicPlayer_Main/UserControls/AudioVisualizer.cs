using NAudio.CoreAudioApi;
using NAudio.Wave;
using NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls.VIewModules_AudioVisualizers;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Forms;
using System.Windows.Interop;
using static NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls.AudioVisualizer;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls
{
    public class AudioVisualizer
    {

    }

    /*public class AudioVisualizer
    {
        System.Windows.Forms.Timer dataTimer = new Timer();
        System.Windows.Forms.Timer drawingTimer = new Timer();
        public class DrawingPanel
        {
            public int Width;
            public int Height;
        }
        DrawingPanel drawingPanel = new DrawingPanel();

        WasapiCapture capture;             // 音频捕获
        Visualizer visualizer;             // 可视化
        double[]? spectrumData;            // 频谱数据

        RawColor4[] allColors;                 // 渐变颜色

        Factory fac;
        RenderTarget rt;

        public AudioVisualizer(Window window)
        {
            //初始化
            dataTimer.Interval = 30;
            dataTimer.Tick += DataTimer_Tick;
            //
            drawingTimer.Interval = 30;
            drawingTimer.Tick += DrawingTimer_Tick;
            //
            drawingPanel.Width = (int)window.Width;
            drawingPanel.Height = (int)window.Height;


            capture = new WasapiLoopbackCapture();          // 捕获电脑发出的声音
            visualizer = new Visualizer(256);               // 新建一个可视化器, 并使用 256 个采样进行傅里叶变换

            allColors = GetAllHsvColors();                  // 获取所有的渐变颜色 (HSV 颜色)

            capture.WaveFormat = WaveFormat.CreateIeeeFloatWaveFormat(8192, 1);      // 指定捕获的格式, 单声道, 32位深度, IeeeFloat 编码, 8192采样率
            capture.DataAvailable += Capture_DataAvailable;                          // 订阅事件

            fac = new Factory();

            var windowHandle = new WindowInteropHelper(window).Handle;

            rt = new WindowRenderTarget(fac,
                new RenderTargetProperties(
                    new PixelFormat(SharpDX.DXGI.Format.R8G8B8A8_UNorm, AlphaMode.Ignore)),
                new HwndRenderTargetProperties()
                {
                    Hwnd = windowHandle,
                    PixelSize = new Size2(drawingPanel.Width, drawingPanel.Height),
                    PresentOptions = PresentOptions.None,
                });
        }

        /// <summary>
        /// 获取 HSV 中所有的基础颜色 (饱和度和明度均为最大值)
        /// </summary>
        /// <returns>所有的 HSV 基础颜色(共 256 * 6 个, 并且随着索引增加, 颜色也会渐变)</returns>
        private RawColor4[] GetAllHsvColors()
        {
            RawColor4[] result = new RawColor4[256 * 6];

            for (int i = 0; i < 256; i++)
            {
                result[i] = new RawColor4(1, i / 255f, 0, 1);
            }

            for (int i = 0; i < 256; i++)
            {
                result[256 + i] = new RawColor4((255 - i) / 255f, 1, 0, 1);
            }

            for (int i = 0; i < 256; i++)
            {
                result[512 + i] = new RawColor4(0, 1, i / 255f, 1);
            }

            for (int i = 0; i < 256; i++)
            {
                result[768 + i] = new RawColor4(0, (255 - i) / 255f, 1, 1);
            }

            for (int i = 0; i < 256; i++)
            {
                result[1024 + i] = new RawColor4(i / 255f, 0, 1, 1);
            }

            for (int i = 0; i < 256; i++)
            {
                result[1280 + i] = new RawColor4(1, 0, (255 - i) / 255f, 1);
            }

            return result;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Capture_DataAvailable(object? sender, WaveInEventArgs e)
        {
            int length = e.BytesRecorded / 4;           // 采样的数量 (每一个采样是 4 字节)
            double[] result = new double[length];       // 声明结果

            for (int i = 0; i < length; i++)
                result[i] = BitConverter.ToSingle(e.Buffer, i * 4);      // 取出采样值

            visualizer.PushSampleData(result);          // 将新的采样存储到 可视化器 中
        }

        /// <summary>
        /// 用来刷新频谱数据
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void DataTimer_Tick(object? sender, EventArgs e)
        {
            double[] newSpectrumData = visualizer.GetSpectrumData();         // 从可视化器中获取频谱数据
            newSpectrumData = Visualizer.MakeSmooth(newSpectrumData, 2);                // 平滑频谱数据

            spectrumData = newSpectrumData;
        }

        /// <summary>
        /// 绘制一个渐变的 波浪
        /// </summary>
        /// <param name="g">绘图目标</param>
        /// <param name="down">下方颜色</param>
        /// <param name="up">上方颜色</param>
        /// <param name="spectrumData">频谱数据</param>
        /// <param name="pointCount">波浪中, 点的数量</param>
        /// <param name="drawingWidth">波浪的宽度</param>
        /// <param name="xOffset">波浪的起始X坐标</param>
        /// <param name="yOffset">波浪的其实Y坐标</param>
        /// <param name="scale">频谱的缩放(使用负值可以翻转波浪)</param>
        private void DrawGradient(RenderTarget g, RawColor4 down, RawColor4 up, double[] spectrumData, int pointCount, int drawingWidth, float xOffset, float yOffset, double scale)
        {
            RawVector2[] points = new RawVector2[pointCount + 2];
            for (int i = 0; i < pointCount; i++)
            {
                double x = i * drawingWidth / pointCount + xOffset;
                double y = spectrumData[i * spectrumData.Length / pointCount] * scale + yOffset;
                points[i + 1] = new RawVector2((float)x, (float)y);
            }

            points[0] = new RawVector2(xOffset, yOffset);
            points[points.Length - 1] = new RawVector2(xOffset + drawingWidth, yOffset);

            using PathGeometry geo = new PathGeometry(fac);
            using GeometrySink sink = geo.Open();
            sink.BeginFigure(points[0], FigureBegin.Filled);
            for (int i = 1; i < points.Length; i++)
                sink.AddLine(points[i]);
            sink.EndFigure(FigureEnd.Closed);

            float upP = (float)points.Min(v => v.Y);

            if (Math.Abs(upP - yOffset) < 1)
                return;

            LinearGradientBrushProperties linearGradientBrushProperties = new LinearGradientBrushProperties() { StartPoint = new RawVector2(0, yOffset), EndPoint = new RawVector2(0, upP) };
            using GradientStopCollection gradientStopCollection =
                new GradientStopCollection(rt, new GradientStop[] { new GradientStop() { Position = 0, Color = down }, new GradientStop() { Position = 1, Color = up } });
            using LinearGradientBrush brush = new LinearGradientBrush(rt, linearGradientBrushProperties, gradientStopCollection);

            g.FillGeometry(geo, brush);
        }

        /// <summary>
        /// 绘制渐变的条形
        /// </summary>
        /// <param name="g">绘图目标</param>
        /// <param name="down">下方颜色</param>
        /// <param name="up">上方颜色</param>
        /// <param name="spectrumData">频谱数据</param>
        /// <param name="stripCount">条形的数量</param>
        /// <param name="drawingWidth">绘图的宽度</param>
        /// <param name="xOffset">绘图的起始 X 坐标</param>
        /// <param name="yOffset">绘图的起始 Y 坐标</param>
        /// <param name="spacing">条形与条形之间的间隔(像素)</param>
        /// <param name="scale"></param>
        private void DrawGradientStrips(RenderTarget g, RawColor4 down, RawColor4 up, double[] spectrumData, int stripCount, int drawingWidth, float xOffset, float yOffset, float spacing, double scale)
        {
            float stripWidth = (drawingWidth - spacing * stripCount) / stripCount;
            RawVector2[] points = new RawVector2[stripCount];

            for (int i = 0; i < stripCount; i++)
            {
                double x = stripWidth * i + spacing * i + xOffset;
                double y = spectrumData[i * spectrumData.Length / stripCount] * scale;   // height
                points[i] = new RawVector2((float)x, (float)y);
            }

            float upP = (float)points.Min(v => v.Y < 0 ? yOffset + v.Y : yOffset);
            float downP = (float)points.Max(v => v.Y < 0 ? yOffset : yOffset + v.Y);

            if (downP < yOffset)
                downP = yOffset;

            if (Math.Abs(upP - downP) < 1)
                return;

            LinearGradientBrushProperties linearGradientBrushProperties = new LinearGradientBrushProperties() { StartPoint = new RawVector2(0, downP), EndPoint = new RawVector2(0, upP) };
            using GradientStopCollection gradientStopCollection =
                new GradientStopCollection(rt, new GradientStop[] { new GradientStop() { Position = 0, Color = down }, new GradientStop() { Position = 1, Color = up } });
            using SharpDX.Direct2D1.Brush brush = new LinearGradientBrush(rt, linearGradientBrushProperties, gradientStopCollection);

            for (int i = 0; i < stripCount; i++)
            {
                RawVector2 p = points[i];
                float y = yOffset;
                float height = p.Y;

                if (height < 0)
                {
                    y += height;
                    height = -height;
                }

                g.FillRectangle(new RawRectangleF(p.X, y, p.X + stripWidth, y + height), brush);
            }
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
        private void DrawCurve(RenderTarget g, SharpDX.Direct2D1.Brush brush, double[] spectrumData, int pointCount, int drawingWidth, double xOffset, double yOffset, double scale)
        {
            RawVector2[] points = new RawVector2[pointCount];
            for (int i = 0; i < pointCount; i++)
            {
                double x = i * drawingWidth / pointCount + xOffset;
                double y = spectrumData[i * spectrumData.Length / pointCount] * scale + yOffset;
                points[i] = new RawVector2((float)x, (float)y);
            }

            using PathGeometry geo = new PathGeometry(fac);
            using GeometrySink sink = geo.Open();
            sink.BeginFigure(points[0], FigureBegin.Filled);
            for (int i = 1; i < pointCount; i++)
                sink.AddLine(points[i]);
            sink.EndFigure(FigureEnd.Open);
            sink.Close();

            g.DrawGeometry(geo, brush);
        }

        private void DrawCircleStrips(RenderTarget g, SharpDX.Direct2D1.Brush brush, double[] spectrumData, int stripCount, double xOffset, double yOffset, double radius, double spacing, double rotation, double scale)
        {
            double rotationAngle = Math.PI / 180 * rotation;
            double blockWidth = MathF.PI * 2 / stripCount;           // angle
            double stripWidth = blockWidth - MathF.PI / 180 * spacing;                // angle
            RawVector2[] points = new RawVector2[stripCount];

            for (int i = 0; i < stripCount; i++)
            {
                double x = blockWidth * i + rotationAngle;      // angle
                double y = spectrumData[i * spectrumData.Length / stripCount] * scale;   // height
                points[i] = new RawVector2((float)x, (float)y);
            }

            for (int i = 0; i < stripCount; i++)
            {
                RawVector2 p = points[i];
                double sinStart = Math.Sin(p.X);
                double sinEnd = Math.Sin(p.X + stripWidth);
                double cosStart = Math.Cos(p.X);
                double cosEnd = Math.Cos(p.X + stripWidth);

                RawVector2 p0 = new RawVector2((float)(cosStart * radius + xOffset), (float)(sinStart * radius + yOffset));
                RawVector2 p1 = new RawVector2((float)(cosEnd * radius + xOffset), (float)(sinEnd * radius + yOffset));
                RawVector2 p2 = new RawVector2((float)(cosEnd * (radius + p.Y) + xOffset), (float)(sinEnd * (radius + p.Y) + yOffset));
                RawVector2 p3 = new RawVector2((float)(cosStart * (radius + p.Y) + xOffset), (float)(sinStart * (radius + p.Y) + yOffset));

                using PathGeometry geo = new PathGeometry(fac);
                using GeometrySink sink = geo.Open();
                sink.BeginFigure(p0, FigureBegin.Filled);
                sink.AddLine(p1);
                sink.AddLine(p2);
                sink.AddLine(p3);
                sink.EndFigure(FigureEnd.Closed);
                sink.Close();

                g.FillGeometry(geo, brush);
            }
        }

        /// <summary>
        /// 画圆环条
        /// </summary>
        /// <param name="g"></param>
        /// <param name="inner"></param>
        /// <param name="outer"></param>
        /// <param name="spectrumData"></param>
        /// <param name="stripCount"></param>
        /// <param name="xOffset"></param>
        /// <param name="yOffset"></param>
        /// <param name="radius"></param>
        /// <param name="spacing"></param>
        /// <param name="scale"></param>
        private void DrawCircleGradientStrips(RenderTarget g, RawColor4 inner, RawColor4 outer, double[] spectrumData, int stripCount, double xOffset, double yOffset, double radius, double spacing, double rotation, double scale)
        {
            double rotationAngle = Math.PI / 180 * rotation;
            double blockWidth = Math.PI * 2 / stripCount;           // angle
            double stripWidth = blockWidth - MathF.PI / 180 * spacing;                // angle
            RawVector2[] points = new RawVector2[stripCount];

            for (int i = 0; i < stripCount; i++)
            {
                double x = blockWidth * i + rotationAngle;      // angle
                double y = spectrumData[i * spectrumData.Length / stripCount] * scale;   // height
                points[i] = new RawVector2((float)x, (float)y);
            }

            double maxHeight = points.Max(v => v.Y);
            double outerRadius = radius + maxHeight;

            using GradientStopCollection gradientStopCollection = new GradientStopCollection(rt, new GradientStop[]
            {
                new GradientStop() { Position = 0, Color = inner },
                new GradientStop() { Position = 1, Color = outer }
            });

            RawVector2[] polygon = new RawVector2[4];
            for (int i = 0; i < stripCount; i++)
            {
                RawVector2 p = points[i];
                double sinStart = Math.Sin(p.X);
                double sinEnd = Math.Sin(p.X + stripWidth);
                double cosStart = Math.Cos(p.X);
                double cosEnd = Math.Cos(p.X + stripWidth);

                RawVector2
                    p0 = new RawVector2((float)(cosStart * radius + xOffset), (float)(sinStart * radius + yOffset)),
                    p1 = new RawVector2((float)(cosEnd * radius + xOffset), (float)(sinEnd * radius + yOffset)),
                    p2 = new RawVector2((float)(cosEnd * (radius + p.Y) + xOffset), (float)(sinEnd * (radius + p.Y) + yOffset)),
                    p3 = new RawVector2((float)(cosStart * (radius + p.Y) + xOffset), (float)(sinStart * (radius + p.Y) + yOffset));

                polygon[0] = p0;
                polygon[1] = p1;
                polygon[2] = p2;
                polygon[3] = p3;


                RawVector2 innerP = new RawVector2((p0.X + p1.X) / 2, (p0.Y + p1.Y) / 2);
                RawVector2 outerP = new RawVector2((p2.X + p3.X) / 2, (p2.Y + p3.Y) / 2);

                Vector2 offset = new Vector2(outerP.X - innerP.X, outerP.Y - innerP.Y);
                if (MathF.Sqrt(offset.X * offset.X + offset.Y * offset.Y) < 3)
                    continue;

                using PathGeometry geo = new PathGeometry(fac);
                using GeometrySink sink = geo.Open();
                sink.BeginFigure(p0, FigureBegin.Filled);
                sink.AddLine(p1);
                sink.AddLine(p2);
                sink.AddLine(p3);
                sink.EndFigure(FigureEnd.Closed);
                sink.Close();

                LinearGradientBrushProperties linearGradientBrushProperties =
                    new LinearGradientBrushProperties() { StartPoint = innerP, EndPoint = outerP };
                using LinearGradientBrush brush = new LinearGradientBrush(rt,
                    linearGradientBrushProperties, gradientStopCollection);

                g.FillGeometry(geo, brush);

                brush.Dispose();
            }
        }

        private void DrawStrips(RenderTarget g, SharpDX.Direct2D1.Brush brush, double[] spectrumData, int stripCount, int drawingWidth, float xOffset, float yOffset, float spacing, double scale)
        {
            float stripWidth = (drawingWidth - spacing * stripCount) / stripCount;
            RawVector2[] points = new RawVector2[stripCount];

            for (int i = 0; i < stripCount; i++)
            {
                double x = stripWidth * i + spacing * i + xOffset;
                double y = spectrumData[i * spectrumData.Length / stripCount] * scale;   // height
                points[i] = new RawVector2((float)x, (float)y);
            }

            for (int i = 0; i < stripCount; i++)
            {
                RawVector2 p = points[i];
                float y = yOffset;
                float height = p.Y;

                if (height < 0)
                {
                    y += height;
                    height = -height;
                }

                g.FillRectangle(new RawRectangleF(p.X, y, p.X + stripWidth, y + height), brush);
            }
        }

        private void DrawGradientBorder(RenderTarget g, RawColor4 inner, RawColor4 outer, RawRectangleF area, double scale, float width)
        {
            int thickness = (int)(width * scale);

            RawRectangleF rect = new RawRectangleF(area.Left, area.Top, area.Right, area.Bottom);

            RawRectangleF up = new RawRectangleF(rect.Left, rect.Top, rect.Right, rect.Top + thickness);
            RawRectangleF down = new RawRectangleF(rect.Left, rect.Bottom - thickness, rect.Right, rect.Bottom);
            RawRectangleF left = new RawRectangleF(rect.Left, rect.Top, rect.Left + thickness, rect.Bottom);
            RawRectangleF right = new RawRectangleF(rect.Right - thickness, rect.Top, rect.Right, rect.Bottom);

            using GradientStopCollection gradientStopCollection = new GradientStopCollection(rt, new GradientStop[]
            {
                new GradientStop() { Position = 0, Color = inner },
                new GradientStop() { Position = 1, Color = outer }
            });

            using LinearGradientBrush upB = new LinearGradientBrush(rt,
                new LinearGradientBrushProperties() { StartPoint = new RawVector2(up.Left, up.Bottom), EndPoint = new RawVector2(up.Left, up.Top) }, gradientStopCollection);
            using LinearGradientBrush downB = new LinearGradientBrush(rt,
                new LinearGradientBrushProperties() { StartPoint = new RawVector2(down.Left, down.Top), EndPoint = new RawVector2(down.Left, down.Bottom) }, gradientStopCollection);
            using LinearGradientBrush leftB = new LinearGradientBrush(rt,
                new LinearGradientBrushProperties() { StartPoint = new RawVector2(left.Right, left.Top), EndPoint = new RawVector2(left.Left, left.Top) }, gradientStopCollection);
            using LinearGradientBrush rightB = new LinearGradientBrush(rt,
                new LinearGradientBrushProperties() { StartPoint = new RawVector2(right.Left, right.Top), EndPoint = new RawVector2(right.Right, right.Top) }, gradientStopCollection);

            g.FillRectangle(up, upB);
            g.FillRectangle(down, downB);
            g.FillRectangle(left, leftB);
            g.FillRectangle(right, rightB);
        }

        int colorIndex = 0;
        double rotation = 0;
        private void DrawingTimer_Tick(object? sender, EventArgs e)
        {
            if (spectrumData == null)
                return;

            rotation += .1;
            colorIndex++;

            RawColor4 color1 = allColors[colorIndex % allColors.Length];
            RawColor4 color2 = allColors[(colorIndex + 200) % allColors.Length];

            double[] bassArea = Visualizer.TakeSpectrumOfFrequency(spectrumData, capture.WaveFormat.SampleRate, 250);
            double bassScale = bassArea.Average() * 100;
            double extraScale = Math.Min(drawingPanel.Width, drawingPanel.Height) / 6;

            RawRectangleF border = new RawRectangleF(0, 0, drawingPanel.Width, drawingPanel.Height);
            using SolidColorBrush sampleBrush = new SolidColorBrush(rt, new RawColor4(238 / 255f, 130 / 255f, 238 / 255f, 1));

            rt.BeginDraw();

            float n = 255f;
            Color color = Color.Transparent;
            RawColor4 rawColor4 = new RawColor4(color.R / n, color.G / n, color.B / n, color.A / n);
            rt.Clear(null);
            rt.Clear(rawColor4);
            //rt.FillRectangle(border, new SolidColorBrush(rt, new RawColor4(0, 0, 0, 0.1f)));

            DrawGradientBorder(rt, new RawColor4(color1.R, color1.G, color1.B, 0), color2, border, bassScale, drawingPanel.Width / 10);

            DrawGradientStrips(rt, color1, color2, spectrumData, spectrumData.Length, drawingPanel.Width, 0, drawingPanel.Height, 3, -drawingPanel.Height * 10);
            DrawCircleGradientStrips(rt, color1, color2, spectrumData, spectrumData.Length, drawingPanel.Width / 2, drawingPanel.Height / 2, MathF.Min(drawingPanel.Width, drawingPanel.Height) / 4 + extraScale * bassScale, 1, rotation, drawingPanel.Width / 6 * 10);

            DrawCurve(rt, sampleBrush, visualizer.SampleData, visualizer.SampleData.Length, drawingPanel.Width, 0, drawingPanel.Height / 2, MathF.Min(drawingPanel.Height / 10, 100));

            rt.EndDraw();
        }

        private void MainWindow_Load(object sender, EventArgs e)
        {
            capture.StartRecording();
            dataTimer.Start();
            drawingTimer.Start();
        }

        private void MainWindow_FormClosed(object sender, FormClosedEventArgs e)
        {
            Environment.Exit(0);
        }

        public void Start_AudioVisualizer()
        {
            capture.StartRecording();
            dataTimer.Start();
            drawingTimer.Start();
        }
        public void Close_AudioVisualizer()
        {
            capture.StopRecording();
            dataTimer.Stop();
            drawingTimer.Stop();
        }
    }*/
}
