using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;
using static System.Net.Mime.MediaTypeNames;

namespace MoZhi_Song_Duration_Allocation.UserControlLibrary.MainWindow_Buttom_SingerKrcSinging_Panel.UserControl_ListviewItem_SingerKrc
{
    /// <summary>
    /// UserControl_ListviewItem_SingerKrc.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_ListviewItem_SingerKrc : UserControl
    {
        public UserControl_ListviewItem_SingerKrc()
        {
            InitializeComponent();

            Init();

            //降低Bitmapscalingmode，加速图像渲染
            RenderOptions.SetBitmapScalingMode(Text_Storyboard_slider_Up,BitmapScalingMode.LowQuality);

            //启动动画，让其进入预备状态（没有Begin，就无法Resume）
            Text_Storyboard_slider_Up.Begin();
            Text_Storyboard_slider_Up.Pause();

            Singer_Image_Size_2 = (int)this.Height;
            Singer_Image_Size_1 = Singer_Image_Size_2 - 6;

            storyboard.Begin();
        }

        /// <summary>
        /// 动画数值
        /// </summary>
        public int Singer_Image_Size_1 = 40;
        public int Singer_Image_Size_2 = 46;

        /// <summary>
        /// 秒表
        /// </summary>
        public Stopwatch stopwatch_Singer_Singing_Time_Text = new Stopwatch();
        /// <summary>
        /// 定时器显示秒表数值
        /// </summary>
        public DispatcherTimer dispatcherTimer_Singer_Singing_Time_Text;

        /// <summary>
        /// 秒表关闭动画
        /// </summary>
        public Stopwatch stopwatch_Singer_Slider = new Stopwatch();      
        /// <summary>
        /// 定时器关闭动画
        /// </summary>
        public DispatcherTimer dispatcherTimer_Singer_Slider;

        
        /// <summary>
        /// 初始化信息
        /// </summary>
        public void Init()
        {
            dispatcherTimer_Singer_Singing_Time_Text = new DispatcherTimer();
            dispatcherTimer_Singer_Singing_Time_Text.Tick += new EventHandler(Begin_Singer_Singing_Time_Text_Animation);
            dispatcherTimer_Singer_Singing_Time_Text.Interval = new TimeSpan(0, 0, 0, 0, 1);

            dispatcherTimer_Singer_Slider = new DispatcherTimer();
            dispatcherTimer_Singer_Slider.Tick += DispatcherTimer_Singer_Slider_Tick;
            dispatcherTimer_Singer_Slider.Interval = new TimeSpan(0, 0, 0, 0, 1);
        }

        //Text_Storyboard_slider_Up动画持续的时间
        double Singer_Slider_Pause_Time;
        /// <summary>
        /// 开启时长分配动画的定时暂停动画
        /// </summary>
        /// <param name="timespan"></param>
        public void Timer_To_Pause_Text_Storyboard_slider_Up(TimeSpan timespan)
        {
            //设置持续的时间，类似Duration
            Singer_Slider_Pause_Time = timespan.TotalMilliseconds;
            //开始秒表计时
            stopwatch_Singer_Slider.Start();
            //开始定时秒表时间
            dispatcherTimer_Singer_Slider.Start();
        }
        private void DispatcherTimer_Singer_Slider_Tick(object? sender, EventArgs e)
        {
            if (stopwatch_Singer_Slider.IsRunning)//如果秒表正在计时
            {
                TimeSpan ts = stopwatch_Singer_Slider.Elapsed;

                if (ts.TotalMilliseconds >= Singer_Slider_Pause_Time)//如果超过定时的秒表时间
                {
                    //则停止时长分配动画
                    stopwatch_Singer_Singing_Time_Text.Stop();
                    dispatcherTimer_Singer_Singing_Time_Text.Stop();
                    Text_Storyboard_slider_Up.Pause();

                    dispatcherTimer_Singer_Slider.Stop();//关闭定时器
                    stopwatch_Singer_Slider.Reset();//重置秒表


                    //开启选中动画
                    DoubleAnimation doubleAnimation = new DoubleAnimation();
                    doubleAnimation.From = Singer_Image_Size_2;
                    doubleAnimation.To = Singer_Image_Size_1;
                    doubleAnimation.Duration = new Duration(TimeSpan.FromMilliseconds(100));
                    this.BeginAnimation(UserControl.HeightProperty, doubleAnimation);
                    doubleAnimation.From = 1000;
                    doubleAnimation.To = 1714;
                    this.BeginAnimation(UserControl.WidthProperty, doubleAnimation);
                    doubleAnimation.From = Singer_Image_Size_2;
                    doubleAnimation.To = Singer_Image_Size_1;
                    this.Border_Singer_Image.BeginAnimation(UserControl.HeightProperty, doubleAnimation);
                    doubleAnimation.From = Singer_Image_Size_2;
                    doubleAnimation.To = Singer_Image_Size_1;
                    this.Border_Singer_Image.BeginAnimation(UserControl.WidthProperty, doubleAnimation);

                    this.stopwatch_Singer_Singing_Time_Text.Stop();
                    this.Text_Storyboard_slider_Up.Pause();

                    this.stopwatch_Singer_Singing_Time_Text.Stop();
                    this.dispatcherTimer_Singer_Singing_Time_Text.Stop();
                    this.Text_Storyboard_slider_Up.Pause();

                    this.BeginAnimation(UserControl.WidthProperty, null);
                    this.BeginAnimation(UserControl.HeightProperty, null);

                    /*this.Border_Singer_Image.Width = 88;
                    this.Border_Singer_Image.Height = 88;
                    this.Border_Singer_Image.BeginAnimation(UserControl.WidthProperty, null);
                    this.Border_Singer_Image.BeginAnimation(UserControl.HeightProperty, null);*/
                }
            }
        }

        /// <summary>
        /// 开启歌手歌唱时长 Time Text动画
        /// </summary>
        public void Begin_Singer_Singing_Time_Text_Animation(object sender, EventArgs e)
        {
            if (stopwatch_Singer_Singing_Time_Text.IsRunning)
            {
                try
                {
                    TimeSpan ts = stopwatch_Singer_Singing_Time_Text.Elapsed;
                    textBlock_Time.Text = ts.TotalSeconds.ToString().Substring(0, 4);
                }
                catch { }
            }
        }             
    }
}
