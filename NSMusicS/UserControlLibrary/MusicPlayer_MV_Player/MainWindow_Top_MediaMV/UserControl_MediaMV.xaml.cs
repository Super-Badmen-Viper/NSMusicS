using NSMusicS.UserControlLibrary.MainWindow_Buttom_MusicPlayer_UserControls;
using NSMusicS.UserControlLibrary.MainWindow_TOP_UserControls;
using NSMusicS.UserControlLibrary.MusicPlayer_Main;
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
using System.Windows.Threading;

namespace NSMusicS.UserControlLibrary.MusicPlayer_MV_Player.MainWindow_Top_MediaMV
{
    /// <summary>
    /// UserControl_MediaMV.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_MediaMV : UserControl
    {
        public UserControl_MediaMV()
        {
            InitializeComponent();

            //初始化
            Init();//初始化数据，可在 VS2022 XAML预览界面直接预览
        }

        string Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";

        /// <summary>
        /// 初始化事件
        /// </summary>
        public void Init()
        {
            //隐藏控件
            userControl_Media_ButtomSilderPanel.Visibility = Visibility.Collapsed;

            //所有重叠层绑定鼠标移入移出事件
            userControl_Media_ButtomSilderPanel.MouseEnter += Mouse_Over_Silder_Music_Width;
            userControl_Media_ButtomSilderPanel.MouseLeave += Mouse_Leave_Silder_Music_Width;
            userControl_MV_Take_TextBlock.MouseEnter += Mouse_Over_Silder_Music_Width;
            userControl_MV_Take_TextBlock.MouseLeave += Mouse_Leave_Silder_Music_Width;

            //音量控制
            //userControl_Media_ButtomSilderPanel.Button_Music_Voice_Speed.Click += Show_Voice_Silder;
            userControl_Media_ButtomSilderPanel.Slider_Voice.Maximum = 1;
            userControl_Media_ButtomSilderPanel.Slider_Voice.Value = 0.5;
            userControl_Media_ButtomSilderPanel.Slider_Voice.ValueChanged += Slider_Voice_ValueChanged;

            //加载siler鼠标是否悬浮事件          
            userControl_Media_ButtomSilderPanel.Silder_Music_Width.MouseMove += Mouse_Over_Silder_Music_Width_MV;
            userControl_Media_ButtomSilderPanel.Silder_Music_Temp_Width.MouseLeave += Mouse_Leave_Silder_Music_Width_MV;

            //播放器缓冲流绑定
            MediaMent_MV.MediaEnded += Grid_MediaElement_MV_MediaClosing;
            MediaMent_MV.MediaOpened += Grid_MediaElement_MV_MediaOpened;

            //初始化歌曲进度
            dispatcherTimer_Silder = new DispatcherTimer();
            dispatcherTimer_Silder.Tick += new EventHandler(DispatcherTimer_Silder_Tick); // 超过计时器间隔时发生，时间轴向前走1秒       
            dispatcherTimer_Silder.Interval = TimeSpan.FromMilliseconds(111); // 间隔1秒

            //加载歌曲进度条
            userControl_Media_ButtomSilderPanel.Silder_Music_Temp_Width.ValueChanged += Timeline_ValueChanged_MV;

            userControl_Media_ButtomSilderPanel.Button_Play_Pause_Player.Click += Button_Play_Pause_Player_Click;
            userControl_Media_ButtomSilderPanel.Button_Pull_APP.Click += Button_Pull_APP_Click;
            userControl_Media_ButtomSilderPanel.Button_Max.Click += Button_Max_Click;
            
            brush_MaxNormal.ImageSource = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\退出全屏-01 (1).png"));
            brush_Max.ImageSource = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\全屏-01 (1).png"));
            brush_Pull_APPNormal.ImageSource = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\缩小 (1).png"));
            brush_Pull_APP.ImageSource = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\/放大 (1).png"));
            userControl_Media_ButtomSilderPanel.Button_Max.Background = brush_Max;
            userControl_Media_ButtomSilderPanel.Button_Pull_APP.Background = brush_Pull_APP;
        }

        double width_normal = 0;
        double height_normal = 0;
        ImageBrush brush_Max = new ImageBrush();//最大化
        ImageBrush brush_MaxNormal = new ImageBrush();//正常窗口
        ImageBrush brush_Pull_APP = new ImageBrush();//最大化
        ImageBrush brush_Pull_APPNormal = new ImageBrush();//正常窗口
        private void Button_Pull_APP_Click(object sender, RoutedEventArgs e)
        {
            Window mainWindow;
            width_normal = this.ActualWidth;
            height_normal = this.ActualHeight;
            if (userControl_Media_ButtomSilderPanel.Button_Pull_APP.Background == brush_Pull_APP)//最大化按钮
            {
                mainWindow = Window.GetWindow(this);
                mainWindow.WindowState = WindowState.Maximized;

                userControl_Media_ButtomSilderPanel.Button_Pull_APP.Background = brush_Pull_APPNormal;

                
            }
            else//最小化按钮
            {
                mainWindow = Window.GetWindow(this);
                mainWindow.WindowState = WindowState.Normal;

                userControl_Media_ButtomSilderPanel.Button_Pull_APP.Background = brush_Pull_APP;
            }
        }
        private void Button_Max_Click(object sender, RoutedEventArgs e)
        {
            Window mainWindow;
            width_normal = this.ActualWidth;
            height_normal = this.ActualHeight;
            if (userControl_Media_ButtomSilderPanel.Button_Max.Background == brush_Max)//最大化按钮
            {
                mainWindow = Window.GetWindow(this);
                mainWindow.WindowState = WindowState.Maximized;

                userControl_Media_ButtomSilderPanel.Button_Max.Background = brush_MaxNormal;

                this.Width = mainWindow.ActualWidth;
                this.Height = mainWindow.ActualHeight;
            }
            else//最小化按钮
            {
                mainWindow = Window.GetWindow(this);
                mainWindow.WindowState = WindowState.Normal;

                userControl_Media_ButtomSilderPanel.Button_Max.Background = brush_Max;
            }
        }
        

        /// <summary>
        /// 播放or暂停
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        /// <exception cref="NotImplementedException"></exception>
        private void Button_Play_Pause_Player_Click(object sender, RoutedEventArgs e)
        {
            if (MediaMent_MV.LoadedBehavior == MediaState.Play)
            {
                MediaMent_MV.Pause();
                MediaMent_MV.LoadedBehavior = MediaState.Pause;
                userControl_Media_ButtomSilderPanel.Button_Play_Pause_Player.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\24gf-playCircle.png")));
            }
            else
            {
                MediaMent_MV.Play();
                MediaMent_MV.LoadedBehavior = MediaState.Play;
                userControl_Media_ButtomSilderPanel.Button_Play_Pause_Player.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\暂停.png")));
            }
        }

        #region 鼠标移入silder_TextBlock

        /// <summary>
        /// 鼠标移入silder_TextBlock
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Mouse_Over_Silder_Music_Width(object sender, MouseEventArgs e)
        {
            userControl_Media_ButtomSilderPanel.Visibility = Visibility.Visible;
        }
        /// <summary>
        /// 鼠标移除silder_TextBlock
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Mouse_Leave_Silder_Music_Width(object sender, MouseEventArgs e)
        {
            userControl_Media_ButtomSilderPanel.Visibility = Visibility.Collapsed;
        }
        /// <summary>
        /// 鼠标移入silder_调整播放进度
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Mouse_Over_Silder_Music_Width_MV(object sender, MouseEventArgs e)
        {
            TimeLine_Nums_MV = userControl_Media_ButtomSilderPanel.Silder_Music_Width.Value;

            //同步两个silder的长度
            userControl_Media_ButtomSilderPanel.Silder_Music_Temp_Width.Value = userControl_Media_ButtomSilderPanel.Silder_Music_Width.Value;

            userControl_Media_ButtomSilderPanel.Silder_Music_Temp_Width.Visibility = Visibility.Visible;
        }
        /// <summary>
        /// 鼠标移除silder_调整播放进度
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Mouse_Leave_Silder_Music_Width_MV(object sender, MouseEventArgs e)
        {
            userControl_Media_ButtomSilderPanel.Silder_Music_Temp_Width.Visibility = Visibility.Collapsed;
        }
        #endregion

        #region 音量

        /// <summary>
        /// 更改音量
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Slider_Voice_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            MediaMent_MV.Volume = userControl_Media_ButtomSilderPanel.Slider_Voice.Value;
        }
        #endregion

        #region MediaElement数据流开启与结束事件
        public void Grid_MediaElement_MV_MediaOpened(object sender, RoutedEventArgs e)
        {
            userControl_Media_ButtomSilderPanel.Silder_Music_Width.Maximum = MediaMent_MV.NaturalDuration.TimeSpan.TotalMilliseconds;
            userControl_Media_ButtomSilderPanel.Silder_Music_Temp_Width.Maximum = userControl_Media_ButtomSilderPanel.Silder_Music_Width.Maximum;

            userControl_Media_ButtomSilderPanel.Silder_Music_Width.Value = 0;
            userControl_Media_ButtomSilderPanel.Silder_Music_Temp_Width.Value = 0;

            test2_MV = MediaMent_MV.NaturalDuration.TimeSpan;
        }
        public void Grid_MediaElement_MV_MediaClosing(object sender, RoutedEventArgs e)
        {
            /*if (WMP_Song_Play_Ids_MV > this.ListView_Temp_Info.Items.Count)
                WMP_Song_Play_Ids_MV = 0;

            if (Bool_Button_MV_CLick == true && userControl_MV.MediaMent_MV.Source != null)//MV进度
            {
                Next_MV_WhileTrue();
            }*/
        }
        public void Next_MV_WhileTrue()
        {

        }
        #endregion

        #region 时间轴

        TimeSpan test1;
        TimeSpan test2;
        TimeSpan test1_MV;
        TimeSpan test2_MV;
        public DispatcherTimer dispatcherTimer_Silder;    // 用于时间轴  
        public double TimeLine_Nums;
        public double TimeLine_Nums_MV;

        private void DispatcherTimer_Silder_Tick(object sender, EventArgs e)
        {
            if (/*Bool_Button_MV_CLick == true &&*/ MediaMent_MV.Source != null && MediaMent_MV.LoadedBehavior == MediaState.Play)
            {
                test1_MV = MediaMent_MV.Position;
                // 时间轴slider滑动值随播放内容位置变化
                userControl_Media_ButtomSilderPanel.Silder_Music_Width.Value = MediaMent_MV.Position.TotalMilliseconds;
                TimeLine_Nums = userControl_Media_ButtomSilderPanel.Silder_Music_Width.Value;
                userControl_Media_ButtomSilderPanel.TextBox_Song_Time.Text = test1_MV.ToString(@"mm\:ss") + @"\" + test2_MV.ToString(@"mm\:ss");
                userControl_Media_ButtomSilderPanel.Silder_Music_Temp_Width.Value = userControl_Media_ButtomSilderPanel.Silder_Music_Width.Value;
            }
            else if (MediaMent_MV.LoadedBehavior == MediaState.Play && MediaMent_MV.LoadedBehavior == MediaState.Pause)
            {
                test1 = MediaMent_MV.Position;

                // 时间轴slider滑动值随播放内容位置变化
                userControl_Media_ButtomSilderPanel.Silder_Music_Width.Value = MediaMent_MV.Position.TotalMilliseconds;

                TimeLine_Nums = userControl_Media_ButtomSilderPanel.Silder_Music_Width.Value;

                userControl_Media_ButtomSilderPanel.TextBox_Song_Time.Text = test1.ToString(@"mm\:ss") + @"\" + test2.ToString(@"mm\:ss");

                userControl_Media_ButtomSilderPanel.Silder_Music_Temp_Width.Value = userControl_Media_ButtomSilderPanel.Silder_Music_Width.Value;
            }
        }

        /// <summary>
        /// 直接跳转会导致播放器控件连续触发读取完成，读完事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Timeline_ValueChanged_MV(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            //只有在silder_temp值改变才执行歌曲进度跳转
            if (TimeLine_Nums != userControl_Media_ButtomSilderPanel.Silder_Music_Temp_Width.Value)
            {
                //只有在鼠标悬浮与silder_temp上才执行歌曲进度跳转
                if (userControl_Media_ButtomSilderPanel.Silder_Music_Temp_Width.IsMouseOver)
                {
                    dispatcherTimer_Silder.Stop();

                    MediaMent_MV.Position = new TimeSpan(0, 0, 0, 0, (int)userControl_Media_ButtomSilderPanel.Silder_Music_Temp_Width.Value);

                    userControl_Media_ButtomSilderPanel.Silder_Music_Temp_Width.Visibility = Visibility.Collapsed;

                    dispatcherTimer_Silder.Start();

                }
            }
        }

        #endregion

        private void UserControl_Loaded(object sender, RoutedEventArgs e)
        {
            MediaMent_MV.Source = new Uri(Path_App + @"/MV/AOA - 짧은 치마 (Miniskirt) Music Video Teaser Drama ver..mp4");
            dispatcherTimer_Silder.Start();
        }
    }
}
