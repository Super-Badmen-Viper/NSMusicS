using MoZhiMusic_Ultimate.Views.Home_Page.Home_Buttombar_Panel;
using System;
using System.Collections.Generic;
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
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace MoZhiMusic_Ultimate
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            Init_ALL_UI();

            /*MediaElement_Song.Source = new Uri(@"E:\\KuGou\\aespa - 怪火 (Illusion).mp3");
            MediaElement_Song.Play();
            MediaElement_Song.LoadedBehavior = MediaState.Play;*/
        }

        #region UI Binding
        private void Init_ALL_UI()
        {
            Init_UI_Home_Page();

            MediaElement_Song.MediaOpened += MediaElement_Song_MediaOpened;
            MediaElement_Song.MediaEnded += MediaElement_Song_MediaEnded;
        }

        #region Home_Page Binding
        private void Init_UI_Home_Page()
        {
            Init_UI_Home_Topbar_Panel();
            Init_UI_Home_Sidebar_Panel();
            Init_UI_Home_Buttombar_Panel();
        }
        private void Init_UI_Home_Topbar_Panel()
        {

        }
        private void Init_UI_Home_Sidebar_Panel()
        {

        }
        private void Init_UI_Home_Buttombar_Panel()
        {
            home_Media_UserControl.panel_Media_Navigation_Normal.Border_Song_Image.MouseEnter += Border_Hover_BackGround_MouseEnter;
            home_Media_UserControl.panel_Media_Navigation_Normal.Border_Hover_BackGround.MouseLeave += Border_Hover_BackGround_MouseLeave;

            //加载siler事件
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Temp_Width.ValueChanged += Timeline_ValueChanged;
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Width.MouseMove += Mouse_Over_Silder_Music_Width;
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Temp_Width.MouseLeave += Mouse_Leave_Silder_Music_Width;
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.MouseLeave += Mouse_Leave_Silder_Music_Width;
            dispatcherTimer_Silder = new DispatcherTimer();
            dispatcherTimer_Silder.Tick += new EventHandler(DispatcherTimer_Silder_Tick);
            dispatcherTimer_Silder.Interval = TimeSpan.FromMilliseconds(100);
            dispatcherTimer_Silder.Start();
        }

        #region Home_Page/Home_Buttombar_Panel
        /// <summary>
        /// 播放器界面专辑图标悬浮
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Border_Hover_BackGround_MouseEnter(object sender, MouseEventArgs e)
        {
            home_Media_UserControl.panel_Media_Navigation_Normal.Border_Hover_BackGround.Visibility = Visibility.Visible;
            home_Media_UserControl.panel_Media_Navigation_Normal.Border_Hover_BackGround_Black.Visibility = Visibility.Visible;
        }
        private void Border_Hover_BackGround_MouseLeave(object sender, MouseEventArgs e)
        {
            home_Media_UserControl.panel_Media_Navigation_Normal.Border_Hover_BackGround.Visibility = Visibility.Hidden;
            home_Media_UserControl.panel_Media_Navigation_Normal.Border_Hover_BackGround_Black.Visibility = Visibility.Hidden;
        }

        DispatcherTimer dispatcherTimer_Silder;    // 用于时间轴  
        public static double TimeLine_Nums;
        TimeSpan TimeSpan_This_Media_NaturalDuration;
        /// <summary>
        /// 鼠标移入silder
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Mouse_Over_Silder_Music_Width(object sender, MouseEventArgs e)
        {
            TimeLine_Nums = home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Width.Value;

            //同步两个silder的长度
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Temp_Width.Value = home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Width.Value;
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Temp_Width.Visibility = Visibility.Visible;
        }
        /// <summary>
        /// 鼠标移除silder
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Mouse_Leave_Silder_Music_Width(object sender, MouseEventArgs e)
        {
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Temp_Width.Visibility = Visibility.Hidden;
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Width.Value = home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Temp_Width.Value;
        }
        /// <summary>
        /// 直接跳转会导致播放器控件连续触发读取完成，读完事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Timeline_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            //只有在silder_temp值改变才执行歌曲进度跳转
            if (TimeLine_Nums != home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Temp_Width.Value)
            {
                //只有在鼠标悬浮与silder_temp上才执行歌曲进度跳转
                if (home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Temp_Width.IsMouseOver)
                {
                    dispatcherTimer_Silder.Stop();

                    MediaElement_Song.Position = new TimeSpan(0, 0, 0, 0, (int)home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Temp_Width.Value);

                    home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Temp_Width.Visibility = Visibility.Hidden;

                    //歌词滚动
                    /*if (ListBox_MRC_Song_MRC_Time != null)
                    {
                        //如果选中的  跳转的播放进度  在  当前播放进度  之前
                        if (home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Temp_Width.Value < home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Width.Value)
                        {
                            musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex = 0;
                            musicPlayer_Main_UserControl.ListView_Temp_MRC.ScrollIntoView(musicPlayer_Main_UserControl.ListView_Temp_MRC.Items[0]);//先滚动至第一行歌词
                            //ListView_MRC.ScrollIntoView(ListView_MRC.Items[0]);//先滚动至第一行歌词                          
                        }
                        //歌词时间匹配方法  会自动跳转至指定选中歌词行
                    }*/

                    dispatcherTimer_Silder.Start();
                }
            }
        }
        private void DispatcherTimer_Silder_Tick(object sender, EventArgs e)
        {
            // 时间轴slider滑动值随播放内容位置变化
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Width.Value = MediaElement_Song.Position.TotalMilliseconds;
            //保存当前Value，供Change检测
            TimeLine_Nums = home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Width.Value;
            //更新播放时间显示
            home_Media_UserControl.panel_Play_Seting_Normal.TextBox_Song_Time.Text = MediaElement_Song.Position.ToString(@"mm\:ss") + @" \ " + TimeSpan_This_Media_NaturalDuration.ToString(@"mm\:ss");
            home_Media_UserControl.panel_Media_Navigation_PlayMode.TextBox_Song_Time_Left.Text = home_Media_UserControl.panel_Play_Seting_Normal.TextBox_Song_Time.Text;
            //同步Slider层参数
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Temp_Width.Value = home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Width.Value;

        }
        #endregion

        #endregion

        #region MusicPlayer_Page Binding

        #endregion

        #region MVPlayer_Page Binding

        #endregion

        #region SongList_Page Binding

        #endregion

        #region Floating_Control_Page Binding

        #endregion

        #region Online_Music_Page Binding

        #endregion

        #region AI_MoZhiYun_Page Binding

        #endregion

        #region MediaElement_Song歌曲资源初始化加载

        private void MediaElement_Song_MediaOpened(object sender, RoutedEventArgs e)//一定几率导致双缓冲,同时执行开启与结束事件
        {
            Load_MediaElement_Song_MediaOpened();
        }
        public void Load_MediaElement_Song_MediaOpened()
        {
            //重置Slider播放进度参数
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Width.Maximum = MediaElement_Song.NaturalDuration.TimeSpan.TotalMilliseconds;
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Temp_Width.Maximum = home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Width.Maximum;
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Width.Value = 0;
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Temp_Width.Value = 0;
            //重置当前Media的最终时长
            TimeSpan_This_Media_NaturalDuration = MediaElement_Song.NaturalDuration.TimeSpan;
            //设置播放
            MediaElement_Song.LoadedBehavior = MediaState.Play;
        }

        private void MediaElement_Song_MediaEnded(object sender, RoutedEventArgs e)
        {
            //Slider层参数清零
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Width.Value = 0;
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Temp_Width.Value = 0;

            Load_MediaElement_Song_MediaOpened();
        }

        #endregion

        #endregion
    }
}
