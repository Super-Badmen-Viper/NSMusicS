using MoZhiMusic_Ultimate.Models.Song_List_Infos;
using MoZhiMusic_Ultimate.Views.Home_Page.Home_Buttombar_Panel;
using MoZhiMusic_Ultimate.Views.Home_Page.Home_Sidebar_Panel;
using MoZhiMusic_Ultimate.Views.MusicPlayer_Page;
using System;
using System.Collections.Generic;
using System.ComponentModel;
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
using System.Windows.Media.Effects;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.StartPanel;


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

            Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory);

            Init_ALL_UI();


            MediaElement_Song.Source = new Uri(@"E:\\KuGou\\aespa - 怪火 (Illusion).mp3");
            MediaElement_Song.Play();
            MediaElement_Song.LoadedBehavior = MediaState.Play;


            //加载歌单信息
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"UserData/User_Account_Information/Song_List_Info/Song_List_Info_ALL.xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"UserData/User_Account_Information/Song_List_Info/Song_List_Info_Love.xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"UserData/User_Account_Information/Song_List_Info/Song_List_Info_Auto.xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"UserData/User_Account_Information/Song_List_Info/Song_List_Info_More.xml"));
            /*// 将歌单信息显示在界面上
            foreach (var playlist in songList_Infos)
            {
                // 创建一个新的歌单项
                var playlistItem = new TreeViewItem();
                playlistItem.Header = playlist.Name;
                playlistItem.Foreground = Brushes.White;

                // 将歌曲信息添加到歌单项中
                foreach (var song in playlist.Songs)
                {
                    var songItem = new TreeViewItem();
                    songItem.Header = song.Song_Name;
                    songItem.Foreground = Brushes.White;

                    playlistItem.Items.Add(songItem);
                }

                // 将歌单项添加到侧边栏中
                home_Page_Selection.TreeView_SongList_Info.Items.Add(playlistItem);
            }*/


            songList_Page_Local.Data_Grid_SongList.ItemsSource = songList_Infos[1][0].Songs;
            songList_Infos_Current_Playlist = songList_Infos[1][0].Songs;

            /*SongList_Info_Find songList_Info_Find = new SongList_Info_Find();
            songList_Info_Find.*/
        }

        public string Path_App;
        //所有的歌单列表集合
        private List<List<SongList_Info>> songList_Infos = new List<List<SongList_Info>>();
        //当前的播放列表
        private List<Song_Info> songList_Infos_Current_Playlist = new List<Song_Info>();

        #region UI Binding
        private void Init_ALL_UI()
        {
            Init_UI_Home_Page();
            Init_UI_MusicPlayer_Page();
            Init_UI_SongList_Page();

            Init_Spectrum_Visualization();//初始化音频频谱

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
            home_Media_UserControl.panel_Media_Navigation_Normal.Border_Hover_BackGround.MouseLeftButtonDown += Border_Hover_BackGround_MouseLeftButtonDown;

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
        
        Thickness thickness_ListView_Temp_MRC_Margin = new Thickness();
        /// <summary>
        /// 播放器界面专辑图标 悬浮与点击事件
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
        private void Border_Hover_BackGround_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            try
            {
                blurEffect.Radius = 0;
                musicPlayer_Song_Playback.VerticalAlignment = VerticalAlignment.Bottom;

                if (!Bool_Singer_Image_Animation)
                    musicPlayer_Song_Playback.Panel_Image.Visibility = Visibility.Visible;

                home_Media_UserControl.panel_Media_Navigation_Normal.Visibility = Visibility.Hidden;
                home_Media_UserControl.panel_Play_Seting_Normal.Visibility = Visibility.Hidden;
                home_Media_UserControl.panel_Media_Navigation_PlayMode.Visibility = Visibility.Visible;
                home_Media_UserControl.panel_Play_Seting_PlayMode.Visibility = Visibility.Visible;

                musicPlayer_Song_Playback.ListView_Temp_MRC.Visibility = Visibility.Hidden;
                //实例化一个DoubleAnimation类。
                doubleAnimation = new DoubleAnimation();
                //设置From属性。
                doubleAnimation.From = 0;
                //设置To属性。
                doubleAnimation.To = this.ActualHeight - 40;
                //设置Duration属性。
                doubleAnimation.Duration = new Duration(TimeSpan.FromMilliseconds(200));
                //设置动画完成事件
                doubleAnimation.Completed += DoubleAnimation_Completed;
                //为元素设置BeginAnimation方法。
                musicPlayer_Song_Playback.BeginAnimation(UserControl.HeightProperty, doubleAnimation);
            }
            catch { }
        }
        


        DispatcherTimer dispatcherTimer_Silder;
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

                    //开启频谱动画
                    dispatcherTimer_Spectrum_Visualization.Start();
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

        //bool Bool_Button_Play_Pause_Player;//播放状态
        //bool Bool_OpenMainMusicPlayer;//是否打开播放器
        bool Bool_Singer_Image_Animation;   //歌手写真动画
        bool Bool_Jukebox_Playing;          //专辑动画
        DoubleAnimation doubleAnimation;//进入音频播放器窗体动画
        BlurEffect blurEffect = new BlurEffect();//专辑播放界面，模糊玻璃

        private void Init_UI_MusicPlayer_Page()
        {
            //初始化musicPlayer_Song_Playback位置
            doubleAnimation = new DoubleAnimation();
            doubleAnimation.From = this.ActualHeight;
            doubleAnimation.To = 0;
            doubleAnimation.Duration = new Duration(TimeSpan.FromMilliseconds(200));
            doubleAnimation.Completed += DoubleAnimation_Completed;
            musicPlayer_Song_Playback.BeginAnimation(UserControl.HeightProperty, doubleAnimation);
            musicPlayer_Song_Playback.Panel_Image.Visibility = Visibility.Hidden;

            musicPlayer_Song_Playback.Button_Return_MainWindow.Click += Button_Return_MainWindow_Click; ;
        }

        private void Button_Return_MainWindow_Click(object sender, RoutedEventArgs e)
        {
            //blurEffect.Radius数值超过0会造成动画UI卡顿
            blurEffect.Radius = 0;
            musicPlayer_Song_Playback.VerticalAlignment = VerticalAlignment.Bottom;

            try
            {
                musicPlayer_Song_Playback.Panel_Image.Visibility = Visibility.Hidden;

                home_Media_UserControl.panel_Media_Navigation_Normal.Visibility = Visibility.Visible;
                home_Media_UserControl.panel_Play_Seting_Normal.Visibility = Visibility.Visible;
                home_Media_UserControl.panel_Media_Navigation_PlayMode.Visibility = Visibility.Hidden;
                home_Media_UserControl.panel_Play_Seting_PlayMode.Visibility = Visibility.Hidden;

                musicPlayer_Song_Playback.ListView_Temp_MRC.Visibility = Visibility.Hidden;
                //实例化一个DoubleAnimation类。
                doubleAnimation = new DoubleAnimation();
                //设置From属性。
                doubleAnimation.From = this.ActualHeight - 20;
                //设置To属性。
                doubleAnimation.To = 0;
                //设置Duration属性。
                doubleAnimation.Duration = new Duration(TimeSpan.FromMilliseconds(200));
                //设置动画完成事件
                doubleAnimation.Completed += DoubleAnimation_Completed;
                //为元素设置BeginAnimation方法。
                musicPlayer_Song_Playback.BeginAnimation(UserControl.HeightProperty, doubleAnimation);
            }
            catch { }
        }

        /// <summary>
        /// 主界面切换动画完成事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void DoubleAnimation_Completed(object sender, EventArgs e)
        {
            musicPlayer_Song_Playback.ListView_Temp_MRC.Visibility = Visibility.Visible;
        }
        #endregion

        #region MVPlayer_Page Binding

        #endregion

        #region SongList_Page Binding
        private void Init_UI_SongList_Page()
        {
            songList_Page_Local.Data_Grid_SongList.MouseDoubleClick += Data_Grid_SongList_MouseDoubleClick;
        }

        private void Data_Grid_SongList_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            //1.判定是哪一个歌单
            //2.将songList_Infos_Current_Playlist设置为指定的歌单
            //3.传入当前歌单的选中index
            Play_Song(songList_Page_Local.Data_Grid_SongList.SelectedIndex);
        }
        private void Play_Song(int index)
        {
            MediaElement_Song.Source = new Uri(songList_Infos_Current_Playlist[index].Song_Url);
            MediaElement_Song.Play();
            MediaElement_Song.LoadedBehavior = MediaState.Play;
        }
        #endregion

        #region Floating_Control_Page Binding

        #endregion

        #region Online_Music_Page Binding

        #endregion

        #region AI_MoZhiYun_Page Binding

        #endregion

        #region MediaElement_Song 歌曲资源初始化加载

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
            //专辑封面转动
            musicPlayer_Song_Playback.Image_Song_Storyboard.Begin();
            musicPlayer_Song_Playback.Storyboard_BeginMusic_Jukebox_Close.Begin();//关闭所有指针动画
            musicPlayer_Song_Playback.Storyboard_BeginMusic_Jukebox_Open.Begin();//开启指针动画，并来回动画
            //开启频谱动画
            dispatcherTimer_Spectrum_Visualization.Start();
        }

        private void MediaElement_Song_MediaEnded(object sender, RoutedEventArgs e)
        {
            //Slider层参数清零
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Width.Value = 0;
            home_Media_UserControl.panel_MediaPlaying_Display_Process_Silder.Silder_Music_Temp_Width.Value = 0;

            Load_MediaElement_Song_MediaOpened();
        }


        #endregion

        #region 音乐可视化

        DispatcherTimer dispatcherTimer_Spectrum_Visualization;
        /// <summary>
        /// 初始化歌曲频谱同步
        /// </summary>
        public void Init_Spectrum_Visualization()
        {
            dispatcherTimer_Spectrum_Visualization = new DispatcherTimer();
            dispatcherTimer_Spectrum_Visualization.Tick += Spectrum_Visualization_Play_Tick;
            dispatcherTimer_Spectrum_Visualization.Interval = new TimeSpan(0, 0, 0, 0, 600);

            Spectrum_time = 75;
            dispatcherTimer_Spectrum_Visualization.Interval = new TimeSpan(0, 0, 0, 0, Spectrum_time * 2);

            home_Media_UserControl.panel_Playing_Media_Audio_Spectrum_Line.
                        audioSpectrogram.StartStopBtn_Click();
        }
        public void Spectrum_Visualization_Play_Tick(object sender, EventArgs e)
        {
            Take_Spectrum_Visualization();
        }
        int Spectrum_time = 0;
        float Spectrum_Value = 0;
        public void Take_Spectrum_Visualization()
        {
            if (home_Media_UserControl.panel_Playing_Media_Audio_Spectrum_Line.
                        audioSpectrogram.animation_points != null)
            {
                int half_animation_points_length = home_Media_UserControl.panel_Playing_Media_Audio_Spectrum_Line.
                        audioSpectrogram.animation_points.Count;

                if (half_animation_points_length == 106)
                {
                    for (int i = 0; i < home_Media_UserControl.panel_Playing_Media_Audio_Spectrum_Line.
                                List_storyboard.Count; i++)
                    {
                        home_Media_UserControl.panel_Playing_Media_Audio_Spectrum_Line.
                            List_doubleAnimation[i].KeyFrames.Clear();

                        LinearDoubleKeyFrame linearDoubleKeyFrame_1 = new LinearDoubleKeyFrame();
                        LinearDoubleKeyFrame linearDoubleKeyFrame_2 = new LinearDoubleKeyFrame();

                        linearDoubleKeyFrame_1.KeyTime = new TimeSpan(0, 0, 0, 0,
                            (int)Spectrum_time);

                        //结束值设置为上次动画保存的位置
                        linearDoubleKeyFrame_2.Value = Spectrum_Value;
                        linearDoubleKeyFrame_2.KeyTime = new TimeSpan(0, 0, 0, 0,
                            (int)Spectrum_time);

                        linearDoubleKeyFrame_1.Value = home_Media_UserControl.panel_Playing_Media_Audio_Spectrum_Line.
                                audioSpectrogram.animation_points[i];
                        if (linearDoubleKeyFrame_1.Value < -0.5)
                            linearDoubleKeyFrame_1.Value = -0.48;

                        home_Media_UserControl.panel_Playing_Media_Audio_Spectrum_Line.
                            List_doubleAnimation[i]
                                .KeyFrames.Add(linearDoubleKeyFrame_1);
                        home_Media_UserControl.panel_Playing_Media_Audio_Spectrum_Line.
                            List_doubleAnimation[i]
                                .KeyFrames.Add(linearDoubleKeyFrame_2);
                        home_Media_UserControl.panel_Playing_Media_Audio_Spectrum_Line.
                            List_doubleAnimation[i]
                                .Duration = new TimeSpan(0, 0, 0, 0, (int)Spectrum_time * 2);

                        home_Media_UserControl.panel_Playing_Media_Audio_Spectrum_Line.
                            List_storyboard[i]
                                .Children[0] = home_Media_UserControl.panel_Playing_Media_Audio_Spectrum_Line.
                                    List_doubleAnimation[i];
                        home_Media_UserControl.panel_Playing_Media_Audio_Spectrum_Line.
                            List_storyboard[i]
                                .Begin();
                 
                        //保留此次动画的Value值
                        Spectrum_Value = (float)(linearDoubleKeyFrame_1.Value);
                    }
                }
            }
        }

        #endregion

        #endregion


        private void Window_SizeChanged(object sender, SizeChangedEventArgs e)
        {
            //位于播放器界面时，解除动画绑定  对高度属性的占用 -->设置height将有效，否则无效
            if (home_Media_UserControl.panel_Media_Navigation_Normal.Visibility == Visibility.Hidden)
                musicPlayer_Song_Playback.BeginAnimation(UserControl.HeightProperty, null);

            musicPlayer_Song_Playback.Width = this.ActualWidth;
            musicPlayer_Song_Playback.Height = this.ActualHeight - 40;
        }
        private void Window_StateChanged(object sender, EventArgs e)
        {
            if (WindowState == WindowState.Maximized)
            {
                // 在窗口最大化后执行某些操作
                // ...
            }
        }
        private void Window_Closing(object sender, CancelEventArgs e)
        {
            
        }
        private void Window_Closed(object sender, EventArgs e)
        {
            //保存歌单信息
            var playlists = new List<SongList_Info>();
            playlists = songList_Infos[0];
            SongList_Info_Save.SaveSongList_Infos(Path_App + @"UserData/User_Account_Information/Song_List_Info/Song_List_Info_ALL.xml", playlists);
            playlists = new List<SongList_Info>();
            playlists = songList_Infos[1];
            SongList_Info_Save.SaveSongList_Infos(Path_App + @"UserData/User_Account_Information/Song_List_Info/Song_List_Info_Love.xml", playlists);
            playlists = new List<SongList_Info>();
            playlists = songList_Infos[2];
            SongList_Info_Save.SaveSongList_Infos(Path_App + @"UserData/User_Account_Information/Song_List_Info/Song_List_Info_Auto.xml", playlists);
            playlists = new List<SongList_Info>();
            playlists = songList_Infos[3];
            SongList_Info_Save.SaveSongList_Infos(Path_App + @"UserData/User_Account_Information/Song_List_Info/Song_List_Info_More.xml", playlists);

            //彻底关闭WPF
            Application.Current.Shutdown(-1);
            Environment.Exit(0);
        }
    }
}
