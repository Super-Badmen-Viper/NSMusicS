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
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_Init_Info.Init_SongList_Info;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.SongList_Info;

using WinInterop = System.Windows.Interop;//最大化显示任务栏
using System.Runtime.InteropServices;
using System.IO;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.Song_Mrc_Info;
using System.Windows.Media.Animation;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.Window_Hover_MRC_Panel;
using System.Windows.Media.Effects;
using System.Threading;
using System.Collections;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.Main_Home_Left_MyMusic_UserControls;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.MainWindow_Buttom_MusicPlayer_UserControls;
using System.Globalization;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.TaskbarClock;
using NAudio.Wave;
using NAudio.Dsp;
using VisioForge.MediaFramework.NAudio.VisioForge;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.MusicPlayer_Main.UserControls;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.MusicPlayer_Main;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            
            init();


            Once_Animation();

            Init_Spectrum_Visualization();
        }

        

        #region 初始化
        /// <summary>
        /// 初始化事件
        /// </summary>
        private void init()
        {
            //显示位置在屏幕中心
            this.WindowStartupLocation = WindowStartupLocation.CenterScreen;
            //去除窗体边框
            //this.WindowStyle = WindowStyle.None;this.AllowsTransparency = true;

            Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";

            //切换双击歌单歌曲播放事件
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.MouseDoubleClick += userControl_ButtonFrame_MusicPlayer_ListView_Download_SongList_Info_MouseDoubleClick;
            userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.MouseDoubleClick += userControl_ButtonFrame_MusicPlayer_ListView_Download_SongList_Info_MouseDoubleClick;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.MouseDoubleClick += userControl_ButtonFrame_MusicPlayer_ListView_Download_SongList_Info_MouseDoubleClick;
            userControl_Main_Home_Left_MyMusic_Try_Listen.ListView_Download_SongList_Info.MouseDoubleClick += userControl_ButtonFrame_MusicPlayer_ListView_Download_SongList_Info_MouseDoubleClick;

            load_SongList_Info.DataGridView_List_ALL_Loaded();//读取歌单信息，并存储
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_ALL;
            userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_Love;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_Auto;
            userControl_Main_Home_Left_MyMusic_Try_Listen.ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen;
            //设置当前播放列表
            bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name = "listView_Item_Bing_ALL.listView_Temp_Info_End_ALL";
            listView_Item_Bing_ALL.listView_SongList = userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info;

            musicPlayer_Main_UserControl.Panel_Image.Visibility = Visibility.Hidden;
            //高度绑定至动画，修改height就无法控制（启动时触发Window_SizeChanged事件导致height不为0不能隐藏）
            doubleAnimation = new DoubleAnimation();
            doubleAnimation.From = musicPlayer_Main_UserControl.ActualHeight;
            doubleAnimation.To = 0;
            doubleAnimation.Duration = new Duration(TimeSpan.FromMilliseconds(2));
            musicPlayer_Main_UserControl.BeginAnimation(UserControl.HeightProperty, doubleAnimation);

            //this.MediaElement_Song.LoadedBehavior = MediaState.Manual;

            //检查歌单保险触发是否正确
            Init_MakeTrue_IniSystemInfo();
        }

        #endregion
        #region 检查歌单保险触发是否正确
        /// <summary>
        /// 检查歌单保险触发是否正确
        /// </summary>
        public void Init_MakeTrue_IniSystemInfo()
        {
            //检查歌单保险触发是否正确
            string temp = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource\SongListInfo_ini\SongList_MakeSure_Ini\SongList_MakeSure.ini";
            FileStream FS_List_Save = new FileStream(temp, FileMode.Open);
            StreamReader SR_List = new StreamReader(FS_List_Save);
            string bool_make_true = SR_List.ReadLine();
            SR_List.Close();
            FS_List_Save.Close();
            if (bool_make_true != null)
            {
                if (bool_make_true.Equals("已检索"))
                {
                    FS_List_Save = new FileStream(temp, FileMode.Create);
                    StreamWriter SW_List = new StreamWriter(FS_List_Save);//无法静态
                    SW_List.WriteLine("未检索");
                    //清空缓冲区
                    //关闭流
                    SW_List.Flush();
                    SW_List.Close();
                    //FS_List.Flush();
                    FS_List_Save.Close();
                }
            }
            temp = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource\SongListInfo_ini\SongList_MakeSure_Ini\SongList_Find_Select_Song_MakeSure.ini";
            FS_List_Save = new FileStream(temp, FileMode.Open);
            SR_List = new StreamReader(FS_List_Save);
            bool_make_true = SR_List.ReadLine();
            SR_List.Close();
            FS_List_Save.Close();
            if (bool_make_true != null)
            {
                if (bool_make_true.Equals("已检索"))
                {
                    FS_List_Save = new FileStream(temp, FileMode.Create);
                    StreamWriter SW_List = new StreamWriter(FS_List_Save);//无法静态
                    SW_List.WriteLine("未检索");
                    //清空缓冲区
                    //关闭流
                    SW_List.Flush();
                    SW_List.Close();
                    //FS_List.Flush();
                    FS_List_Save.Close();
                }
            }
        }

        #endregion

        /// <summary>
        /// 拖动窗口
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Window_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            try
            {
                this.DragMove();
            }
            catch { }
        }

        Load_SongList_Info load_SongList_Info = new Load_SongList_Info();
        Save_SongList_Info save_SongList_Info = new Save_SongList_Info();
        public ListView_Item_Bing_ALL listView_Item_Bing_ALL = ListView_Item_Bing_ALL.Retuen_This();
        public Bool_listView_Temp_Info_End_Clear bool_ListView_Temp_Info_End_Clear = Bool_listView_Temp_Info_End_Clear.Retuen_This();

        public string Path_App;


        #region 页面选择区
        /// <summary>
        /// 清空控件背景色
        /// </summary>
        public void Clear_Windows_Left_ALL_UserControl_BackGround()
        {
            userControl_ButtonFrame_MusicSquare.BoolMouseLeftDown = false; userControl_ButtonFrame_MusicSquare.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
            userControl_ButtonFrame_MusicVideo.BoolMouseLeftDown = false; userControl_ButtonFrame_MusicVideo.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
            userControl_ButtonFrame_RadioStation.BoolMouseLeftDown = false; userControl_ButtonFrame_RadioStation.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
            userControl_ButtonFrame_MusicLove.BoolMouseLeftDown = false; userControl_ButtonFrame_MusicLove.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
            userControl_ButtonFrame_ThisWindowsMusicAndDownload.BoolMouseLeftDown = false; userControl_ButtonFrame_ThisWindowsMusicAndDownload.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
            userControl_ButtonFrame_MusicRecentlyPlayed.BoolMouseLeftDown = false; userControl_ButtonFrame_MusicRecentlyPlayed.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
            userControl_ButtonFrame_MusicTryListenList.BoolMouseLeftDown = false; userControl_ButtonFrame_MusicTryListenList.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));

            userControl_音乐馆.Visibility = Visibility.Hidden;
            userControl_视频.Visibility = Visibility.Hidden;
            userControl_电台.Visibility = Visibility.Hidden;
        }
        /// <summary>
        /// 窗体进入动画
        /// </summary>
        public void Grid_Animation_MouseLeftClick()
        {
            double temp = Grid_Helper_UserControlLibrary.ActualWidth;
            //实例化一个DoubleAnimation类。
            doubleAnimation = new DoubleAnimation();
            //设置From属性。
            doubleAnimation.From = temp - 60;
            //设置To属性。
            doubleAnimation.To = temp;
            //设置Duration属性。
            doubleAnimation.Duration = new Duration(TimeSpan.FromMilliseconds(80));
            doubleAnimation.Completed += Grid_Animation_Completed_Grid_Helper_UserControlLibrary;
            //为元素设置BeginAnimation方法。
            Grid_Helper_UserControlLibrary.BeginAnimation(UserControl.WidthProperty, doubleAnimation);
            Grid_Helper_UserControlLibrary.HorizontalAlignment = HorizontalAlignment.Stretch;

            temp = Frame_Show.ActualWidth;
            //实例化一个DoubleAnimation类。
            doubleAnimation = new DoubleAnimation();
            //设置From属性。
            doubleAnimation.From = temp - 60;
            //设置To属性。
            doubleAnimation.To = temp;
            //设置Duration属性。
            doubleAnimation.Duration = new Duration(TimeSpan.FromMilliseconds(80));
            doubleAnimation.Completed += Grid_Animation_Completed_Frame_Show;
            //为元素设置BeginAnimation方法。
            Frame_Show.BeginAnimation(UserControl.WidthProperty, doubleAnimation);
            Frame_Show.HorizontalAlignment = HorizontalAlignment.Stretch;
        }
        /// <summary>
        /// 解除动画绑定
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Grid_Animation_Completed_Grid_Helper_UserControlLibrary(object sender, EventArgs e)
        {
            Grid_Helper_UserControlLibrary.BeginAnimation(UserControl.WidthProperty, null);
        }
        private void Grid_Animation_Completed_Frame_Show(object sender, EventArgs e)
        {
            Frame_Show.BeginAnimation(UserControl.WidthProperty, null);

            //同步所有歌单的歌曲数量
            Reset_ListView_Download_SongList_Info_ShowSongNums();
        }


        private void UserControl_ButtonFrame_MusicSquare_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Clear_Windows_Left_ALL_UserControl_BackGround();
            userControl_ButtonFrame_MusicSquare.BoolMouseLeftDown = true;
            userControl_ButtonFrame_MusicSquare.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FF1FD3AD"));

            userControl_音乐馆.Visibility = Visibility.Visible;
            Grid_Animation_MouseLeftClick();/// 窗体进入动画
        }

        private void UserControl_ButtonFrame_MusicVideo_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Clear_Windows_Left_ALL_UserControl_BackGround();
            userControl_ButtonFrame_MusicVideo.BoolMouseLeftDown = true;
            userControl_ButtonFrame_MusicVideo.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FF1FD3AD"));

            userControl_视频.Visibility = Visibility.Visible;
            Grid_Animation_MouseLeftClick();/// 窗体进入动画
        }

        private void UserControl_ButtonFrame_RadioStation_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Clear_Windows_Left_ALL_UserControl_BackGround();
            userControl_ButtonFrame_RadioStation.BoolMouseLeftDown = true;
            userControl_ButtonFrame_RadioStation.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FF1FD3AD"));

            userControl_电台.Visibility = Visibility.Visible;
            Grid_Animation_MouseLeftClick();/// 窗体进入动画
        }

        #endregion

        #region Main_Top
        /// <summary>
        /// Top 初始化
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void UserControl_ButtonFrame_TopPanel_Loaded(object sender, RoutedEventArgs e)
        {
            brush_Max.ImageSource = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\Max.png"));
            brush_MaxNormal.ImageSource = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\MaxNormal.png"));


            //最大化显示任务栏
            this.SourceInitialized += new EventHandler(win_SourceInitialized);

            //最大化，最小化，退出
            userControl_ButtonFrame_TopPanel.Button_Exit.Click += Button_Exit_Click;
            userControl_ButtonFrame_TopPanel.Button_Max.Click += Button_Max_Click;
            userControl_ButtonFrame_TopPanel.Button_Min.Click += Button_Min_Click;
            musicPlayer_Main_UserControl.Button_Exit.Click += Button_Exit_Click;
            musicPlayer_Main_UserControl.Button_Max.Click += Button_Max_Click;
            musicPlayer_Main_UserControl.Button_Min.Click += Button_Min_Click;
        }

        ImageBrush brush_Max = new ImageBrush();//最大化
        ImageBrush brush_MaxNormal = new ImageBrush();//正常窗口

        /// <summary>
        /// 退出
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Exit_Click(object sender, RoutedEventArgs e)
        {
            Application.Current.Shutdown(-1);//关闭
        }

        #region 窗口最大化，显示任务栏
        /// <summary>
        /// 窗口最大化，显示任务栏
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        void win_SourceInitialized(object sender, EventArgs e)
        {
            System.IntPtr handle = (new WinInterop.WindowInteropHelper(this)).Handle;
            WinInterop.HwndSource.FromHwnd(handle).AddHook(new WinInterop.HwndSourceHook(WindowProc));
        }

        private static System.IntPtr WindowProc(
              System.IntPtr hwnd,
              int msg,
              System.IntPtr wParam,
              System.IntPtr lParam,
              ref bool handled)
        {
            switch (msg)
            {
                case 0x0024:
                    WmGetMinMaxInfo(hwnd, lParam);
                    handled = true;
                    break;
            }

            return (System.IntPtr)0;
        }

        private static void WmGetMinMaxInfo(System.IntPtr hwnd, System.IntPtr lParam)
        {

            MINMAXINFO mmi = (MINMAXINFO)Marshal.PtrToStructure(lParam, typeof(MINMAXINFO));

            // Adjust the maximized size and position to fit the work area of the correct monitor
            int MONITOR_DEFAULTTONEAREST = 0x00000002;
            System.IntPtr monitor = MonitorFromWindow(hwnd, MONITOR_DEFAULTTONEAREST);

            if (monitor != System.IntPtr.Zero)
            {

                MONITORINFO monitorInfo = new MONITORINFO();
                GetMonitorInfo(monitor, monitorInfo);
                RECT rcWorkArea = monitorInfo.rcWork;
                RECT rcMonitorArea = monitorInfo.rcMonitor;
                mmi.ptMaxPosition.x = Math.Abs(rcWorkArea.left - rcMonitorArea.left);
                mmi.ptMaxPosition.y = Math.Abs(rcWorkArea.top - rcMonitorArea.top);
                mmi.ptMaxSize.x = Math.Abs(rcWorkArea.right - rcWorkArea.left);
                mmi.ptMaxSize.y = Math.Abs(rcWorkArea.bottom - rcWorkArea.top);
            }

            Marshal.StructureToPtr(mmi, lParam, true);
        }


        /// <summary>
        /// POINT aka POINTAPI
        /// </summary>
        [StructLayout(LayoutKind.Sequential)]
        public struct POINT
        {
            /// <summary>
            /// x coordinate of point.
            /// </summary>
            public int x;
            /// <summary>
            /// y coordinate of point.
            /// </summary>
            public int y;

            /// <summary>
            /// Construct a point of coordinates (x,y).
            /// </summary>
            public POINT(int x, int y)
            {
                this.x = x;
                this.y = y;
            }
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct MINMAXINFO
        {
            public POINT ptReserved;
            public POINT ptMaxSize;
            public POINT ptMaxPosition;
            public POINT ptMinTrackSize;
            public POINT ptMaxTrackSize;
        };



        /// <summary>
        /// </summary>
        [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Auto)]
        public class MONITORINFO
        {
            /// <summary>
            /// </summary>            
            public int cbSize = Marshal.SizeOf(typeof(MONITORINFO));

            /// <summary>
            /// </summary>            
            public RECT rcMonitor = new RECT();

            /// <summary>
            /// </summary>            
            public RECT rcWork = new RECT();

            /// <summary>
            /// </summary>            
            public int dwFlags = 0;
        }


        /// <summary> Win32 </summary>
        [StructLayout(LayoutKind.Sequential, Pack = 0)]
        public struct RECT
        {
            /// <summary> Win32 </summary>
            public int left;
            /// <summary> Win32 </summary>
            public int top;
            /// <summary> Win32 </summary>
            public int right;
            /// <summary> Win32 </summary>
            public int bottom;

            /// <summary> Win32 </summary>
            public static readonly RECT Empty = new RECT();

            /// <summary> Win32 </summary>
            public int Width
            {
                get { return Math.Abs(right - left); }  // Abs needed for BIDI OS
            }
            /// <summary> Win32 </summary>
            public int Height
            {
                get { return bottom - top; }
            }

            /// <summary> Win32 </summary>
            public RECT(int left, int top, int right, int bottom)
            {
                this.left = left;
                this.top = top;
                this.right = right;
                this.bottom = bottom;
            }


            /// <summary> Win32 </summary>
            public RECT(RECT rcSrc)
            {
                this.left = rcSrc.left;
                this.top = rcSrc.top;
                this.right = rcSrc.right;
                this.bottom = rcSrc.bottom;
            }

            /// <summary> Win32 </summary>
            public bool IsEmpty
            {
                get
                {
                    // BUGBUG : On Bidi OS (hebrew arabic) left > right
                    return left >= right || top >= bottom;
                }
            }
            /// <summary> Return a user friendly representation of this struct </summary>
            public override string ToString()
            {
                if (this == RECT.Empty) { return "RECT {Empty}"; }
                return "RECT { left : " + left + " / top : " + top + " / right : " + right + " / bottom : " + bottom + " }";
            }

            /// <summary> Determine if 2 RECT are equal (deep compare) </summary>
            public override bool Equals(object obj)
            {
                if (!(obj is Rect)) { return false; }
                return (this == (RECT)obj);
            }

            /// <summary>Return the HashCode for this struct (not garanteed to be unique)</summary>
            public override int GetHashCode()
            {
                return left.GetHashCode() + top.GetHashCode() + right.GetHashCode() + bottom.GetHashCode();
            }


            /// <summary> Determine if 2 RECT are equal (deep compare)</summary>
            public static bool operator ==(RECT rect1, RECT rect2)
            {
                return (rect1.left == rect2.left && rect1.top == rect2.top && rect1.right == rect2.right && rect1.bottom == rect2.bottom);
            }

            /// <summary> Determine if 2 RECT are different(deep compare)</summary>
            public static bool operator !=(RECT rect1, RECT rect2)
            {
                return !(rect1 == rect2);
            }


        }

        [DllImport("user32")]
        internal static extern bool GetMonitorInfo(IntPtr hMonitor, MONITORINFO lpmi);

        /// <summary>
        /// 
        /// </summary>
        [DllImport("User32")]
        internal static extern IntPtr MonitorFromWindow(IntPtr handle, int flags);

        #endregion


        /// <summary>
        /// 窗口最大化
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Max_Click(object sender, RoutedEventArgs e)
        {
            if (userControl_ButtonFrame_TopPanel.Button_Max.Background == brush_Max)//最大化按钮
            {
                this.WindowState = System.Windows.WindowState.Maximized;

                userControl_ButtonFrame_TopPanel.Button_Max.Background = brush_MaxNormal;

                musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Width = 1920;
                musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Height = 1080;
                musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Width = 1920;
                musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Height = 1080;
            }
            else//最小化按钮
            {
                this.WindowState = System.Windows.WindowState.Normal;
                
                userControl_ButtonFrame_TopPanel.Button_Max.Background = brush_Max;
            }


            //歌词上下行移动
            //生成歌词路径
            //Create_Steam_Song_MRC();
        }
        /// <summary>
        /// 最小化
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Min_Click(object sender, RoutedEventArgs e)
        {
            this.WindowState = System.Windows.WindowState.Minimized;
        }

        #endregion

        #region userControl_ButtonFrame_MusicPlayer控件初始化
        /// <summary>
        /// userControl_ButtonFrame_MusicPlayer控件初始化
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void userControl_ButtonFrame_MusicPlayer_Loaded(object sender, RoutedEventArgs e)
        {
            userControl_ButtonFrame_MusicPlayer.Silder_Music_Width.Value = 0;

            //加载歌曲进度条
            userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.ValueChanged += Timeline_ValueChanged;

            //加载siler鼠标是否悬浮事件          
            userControl_ButtonFrame_MusicPlayer.Silder_Music_Width.MouseMove += Mouse_Over_Silder_Music_Width;
            userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.MouseLeave += Mouse_Leave_Silder_Music_Width;
            userControl_ButtonFrame_MusicPlayer.MouseLeave += Mouse_Leave_Silder_Music_Width;

            //初始化歌曲进度
            dispatcherTimer_Silder = new DispatcherTimer();
            dispatcherTimer_Silder.Tick += new EventHandler(DispatcherTimer_Silder_Tick); // 超过计时器间隔时发生，时间轴向前走1秒       
            dispatcherTimer_Silder.Interval = TimeSpan.FromMilliseconds(100); // 间隔1秒
            dispatcherTimer_Silder.Start();

            //初始化桌面歌词
            DispatcherTimer_MRC = new DispatcherTimer();
            DispatcherTimer_MRC.Tick += new EventHandler(Media_Song_MRC_Play_Tick); // 超过计时器间隔时发生，时间轴向前走1秒       
            DispatcherTimer_MRC.Interval = TimeSpan.FromMilliseconds(50); // 间隔1秒

            //播放器缓冲流绑定
            MediaElement_Song.MediaOpened += MediaElement_Song_MediaOpened;
            MediaElement_Song.MediaEnded += MediaElement_Song_MediaEnded;



            //Button_Play_Pause_Player绑定至Button_Play_Pause_Player_Click单击事件
            userControl_ButtonFrame_MusicPlayer.Button_Play_Pause_Player.Click += Button_Play_Pause_Player_Click;
            userControl_ButtonFrame_MusicPlayer.Button_Before.Click += Button_Music_Up_Song;
            userControl_ButtonFrame_MusicPlayer.Button_Next.Click += Button_Music_Next_Song;
            userControl_ButtonFrame_MusicPlayer.Border_Hover_BackGround.MouseLeftButtonDown += Button_Border_Hover_BackGround_Click_OpenMainMusicPlayer;

            thickness_Grid_MusicPlayer_Main_UserControl_Normal.Left = 210;
            thickness_Grid_MusicPlayer_Main_UserControl_Enter.Left = 40;
            thickness_Grid_MusicPlayer_Main_UserControl_Enter.Right = 40;

            musicPlayer_Main_UserControl.Button_Return_MainWindow.Click += Button_Return_MainWindow_Click_CloseMainMusicPlayer;
            //选中项更改
            musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectionChanged += ListView_Temp_MRC_ScrollIntoView;
            //鼠标滚轮
            musicPlayer_Main_UserControl.TextBox_ListViewMRC_Up.MouseWheel += ListView_Temp_MRC_MouseWheel;
            //鼠标移出
            musicPlayer_Main_UserControl.ListView_Temp_MRC_Temp.MouseLeave += ListView_Temp_MRC_MouseLeave;
            //跳转至选中歌词歌曲进度
            musicPlayer_Main_UserControl.ListView_Temp_MRC_Temp.MouseDoubleClick += ListView_Temp_MRC_Temp_MouseDoubleClick;

            //设置专辑背景封面
            Image_墨智音乐 = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\Music_Album.png"));


            //初始化歌手图片文件夹
            singer_photo[0] = "歌手图片1";
            singer_photo[1] = "歌手图片2";
            singer_photo[2] = "歌手图片3";
            singer_photo[3] = "歌手图片4";
            singer_photo[4] = "歌手图片5";
            singer_photo[5] = "歌手图片6";
            singer_photo[6] = "歌手图片7";
            singer_photo[7] = "歌手图片8";
            singer_photo[8] = "歌手图片9";
            singer_photo[9] = "歌手图片10";
            singer_photo[10] = "歌手图片11";
            singer_photo[11] = "歌手图片12";
            singer_photo[12] = "歌手图片13";
            singer_photo[13] = "歌手图片14";
            singer_photo[14] = "歌手图片15";
            singer_photo[15] = "歌手图片16";
            singer_photo[16] = "歌手图片17";
            singer_photo[17] = "歌手图片18";
            singer_photo[18] = "歌手图片19";
            singer_photo[19] = "歌手图片20";
            singer_photo[20] = "歌手图片21";
            singer_photo[21] = "歌手图片22";
            singer_photo[22] = "歌手图片23";
            singer_photo[23] = "歌手图片24";

            //初始化背景切换动画事件加载
            bgstoryboard = new Storyboard();
            bgstoryboard.AutoReverse = false;
            bgstoryboard.FillBehavior = FillBehavior.HoldEnd;
            bgstoryboard.RepeatBehavior = new RepeatBehavior(1);
            BgSwitchIni();

            //单个歌手背景动画
            timer_Singer_Photo_One = new DispatcherTimer();
            timer_Singer_Photo_One.Interval = TimeSpan.FromMilliseconds(7777);
            timer_Singer_Photo_One.Tick += Change_Singer_Photo_To_Grid_Back;
            //多个歌手背景动画
            timer_Singer_Photo_One_Lot = new DispatcherTimer();
            timer_Singer_Photo_One_Lot.Interval = TimeSpan.FromMilliseconds(7777);
            timer_Singer_Photo_One_Lot.Tick += Change_Singer_Photo_To_Grid_Back_Lot;

            //设置进入播放器界面，返回主界面事件
            userControl_ButtonFrame_MusicPlayer.Button_Singer_Image_Animation_To_WindowsDesktop.Visibility = Visibility.Hidden;
            userControl_ButtonFrame_MusicPlayer.Button_Singer_Image_Animation.MouseLeftButtonDown += Button_Singer_Image_Animation_Click;
            userControl_ButtonFrame_MusicPlayer.Button_Singer_Image_Animation_To_WindowsDesktop.MouseLeftButtonDown += button_Open_Windows_Picture_Click;
            userControl_ButtonFrame_MusicPlayer.Button_Desk_MRC.Click += Button_Window_Hover_MRC_Panel;
            userControl_ButtonFrame_MusicPlayer.Button_Desk_MRC_Right.Click += Button_Window_Hover_MRC_Panel;
            //隐藏播放顺序与音量设置按键
            userControl_ButtonFrame_MusicPlayer.Stack_Panel_Order.Visibility = Visibility.Hidden;
            userControl_ButtonFrame_MusicPlayer.Stack_Panel_Voice.Visibility = Visibility.Hidden;
            //设置播放顺序按键
            userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Click += Button_WMP_Song_Order_Click;
            userControl_ButtonFrame_MusicPlayer.Stack_Button_Radom_Order.MouseLeftButtonDown += Stack_Button_Radom_Click;
            userControl_ButtonFrame_MusicPlayer.Stack_Button_Normal_Order.MouseLeftButtonDown += Stack_Button_Normal_Click;
            userControl_ButtonFrame_MusicPlayer.Stack_Button_OnlyOne_Order.MouseLeftButtonDown += Stack_Button_OnlyOne_Click;
            userControl_ButtonFrame_MusicPlayer.Stack_Button_List_Order.MouseLeftButtonDown += Stack_Button_List_Click;
            //设置音量按键
            userControl_ButtonFrame_MusicPlayer.Button_Music_Voice_Speed.Click += Button_WMP_Song_Voice_Click;
            userControl_ButtonFrame_MusicPlayer.Slider_Voice.Maximum = 1;
            userControl_ButtonFrame_MusicPlayer.Slider_Voice.Value = MediaElement_Song.Volume;
            userControl_ButtonFrame_MusicPlayer.Voice_Nums.Text = Convert.ToInt32((userControl_ButtonFrame_MusicPlayer.Slider_Voice.Value) * 100) + "%";
            userControl_ButtonFrame_MusicPlayer.Slider_Voice.ValueChanged += WMP_Song_Slider_Voice_Value_Changed;

            //存储Windows背景图片
            //定义存储缓冲区大小
            StringBuilder s = new StringBuilder(300);
            //获取Window 桌面背景图片地址，使用缓冲区
            SystemParametersInfo(SPI_GETDESKWALLPAPER, 300, s, 0);
            //缓冲区中字符进行转换
            wallpaper_path.Append(s.ToString()); //系统桌面背景图片路径

            //设置按键背景
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.brush_LoveNormal.ImageSource = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心.png"));
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.brush_LoveEnter.ImageSource = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心 - 副本.png"));
            userControl_Main_Home_Left_MyMusic_My_Love.Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";
            userControl_Main_Home_Left_MyMusic_My_Love.brush_LoveNormal.ImageSource = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心.png"));
            userControl_Main_Home_Left_MyMusic_My_Love.brush_LoveEnter.ImageSource = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心 - 副本.png"));
            userControl_Main_Home_Left_MyMusic_Recent_Play.Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";
            userControl_Main_Home_Left_MyMusic_Recent_Play.brush_LoveNormal.ImageSource = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心.png"));
            userControl_Main_Home_Left_MyMusic_Recent_Play.brush_LoveEnter.ImageSource = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心 - 副本.png"));
            userControl_Main_Home_Left_MyMusic_Try_Listen.Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";
            userControl_Main_Home_Left_MyMusic_Try_Listen.brush_LoveNormal.ImageSource = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心.png"));
            userControl_Main_Home_Left_MyMusic_Try_Listen.brush_LoveEnter.ImageSource = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心 - 副本.png"));

            //调整歌词列表的边距
            thickness_ListView_Temp_MRC_Margin = musicPlayer_Main_UserControl.ListView_Temp_MRC.Margin;

            //设置触发器，检测当前歌曲数量
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.SourceUpdated += ListView_Download_SongList_Info_SourceUpdated;
            userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.SourceUpdated += ListView_Download_SongList_Info_SourceUpdated;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.SourceUpdated += ListView_Download_SongList_Info_SourceUpdated;
            userControl_Main_Home_Left_MyMusic_Try_Listen.ListView_Download_SongList_Info.SourceUpdated += ListView_Download_SongList_Info_SourceUpdated;
            //设置添加手动导入歌曲文件按钮事件
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Stack_Button_Add_Select_Song.MouseLeftButtonDown += ThisWindowsMusicAndDownload_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_My_Love.Stack_Button_Add_Select_Song.MouseLeftButtonDown += My_Love_Button_Add_PC_Select_Song_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_Recent_Play.Stack_Button_Add_Select_Song.MouseLeftButtonDown += Recent_Play_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_Try_Listen.Stack_Button_Add_Select_Song.MouseLeftButtonDown += Try_Listen_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown;
            
            
            //设置歌单_更多操作置入按钮事件
            //userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Stack_Button_LotSelects_Take.MouseLeftButtonDown += Stack_Button_LotSelects_Take_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Stack_Button_Find_Song_Info.MouseLeftButtonDown += Stack_Button_Find_Song_Info_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Stack_Button_ThisPcSong_Find.MouseLeftButtonDown += Stack_Button_ThisPcSong_Find_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Stack_Button_Update_Song_Better.MouseLeftButtonDown += Stack_Button_Update_Song_Better_MouseLeftButtonDown;
            //userControl_Main_Home_Left_MyMusic_My_Love.Stack_Button_LotSelects_Take.MouseLeftButtonDown += Stack_Button_LotSelects_Take_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_My_Love.Stack_Button_Find_Song_Info.MouseLeftButtonDown += Stack_Button_Find_Song_Info_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_My_Love.Stack_Button_ThisPcSong_Find.MouseLeftButtonDown += Stack_Button_ThisPcSong_Find_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_My_Love.Stack_Button_Update_Song_Better.MouseLeftButtonDown += Stack_Button_Update_Song_Better_MouseLeftButtonDown;
            //userControl_Main_Home_Left_MyMusic_Recent_Play.Stack_Button_LotSelects_Take.MouseLeftButtonDown += Stack_Button_LotSelects_Take_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_Recent_Play.Stack_Button_Find_Song_Info.MouseLeftButtonDown += Stack_Button_Find_Song_Info_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_Recent_Play.Stack_Button_ThisPcSong_Find.MouseLeftButtonDown += Stack_Button_ThisPcSong_Find_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_Recent_Play.Stack_Button_Update_Song_Better.MouseLeftButtonDown += Stack_Button_Update_Song_Better_MouseLeftButtonDown;
            //userControl_Main_Home_Left_MyMusic_Try_Listen.Stack_Button_LotSelects_Take.MouseLeftButtonDown += Stack_Button_LotSelects_Take_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_Try_Listen.Stack_Button_Find_Song_Info.MouseLeftButtonDown += Stack_Button_Find_Song_Info_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_Try_Listen.Stack_Button_ThisPcSong_Find.MouseLeftButtonDown += Stack_Button_ThisPcSong_Find_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_Try_Listen.Stack_Button_Update_Song_Better.MouseLeftButtonDown += Stack_Button_Update_Song_Better_MouseLeftButtonDown;
           
            //设置添加本地所有歌曲文件按钮事件            
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += ThisWindowsMusicAndDownload_Stack_Button_Add_PC_ALL_Song_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_My_Love.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += My_Love_Button_Add_PC_ALL_Song_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_Recent_Play.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += Recent_Play_Stack_Button_Add_PC_ALL_Song_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_Try_Listen.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += Try_Listen_Stack_Button_Add_PC_ALL_Song_MouseLeftButtonDown;
            //设置播放全部按钮
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Button_Play_ALL_Song.MouseLeftButtonDown += Paly_ALL_Song;
            userControl_Main_Home_Left_MyMusic_My_Love.Button_Play_ALL_Song.MouseLeftButtonDown += Paly_ALL_Song;
            userControl_Main_Home_Left_MyMusic_Recent_Play.Button_Play_ALL_Song.MouseLeftButtonDown += Paly_ALL_Song;
            userControl_Main_Home_Left_MyMusic_Try_Listen.Button_Play_ALL_Song.MouseLeftButtonDown += Paly_ALL_Song;
            /*//设置选中删除按钮
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Stack_Button_Delete_Select_ItemSong.MouseLeftButtonDown += Button_Delete_Click;
            userControl_Main_Home_Left_MyMusic_My_Love.Stack_Button_Delete_Select_ItemSong.MouseLeftButtonDown += Button_Delete_Click;
            userControl_Main_Home_Left_MyMusic_Recent_Play.Stack_Button_Delete_Select_ItemSong.MouseLeftButtonDown += Button_Delete_Click;
            userControl_Main_Home_Left_MyMusic_Try_Listen.Stack_Button_Delete_Select_ItemSong.MouseLeftButtonDown += Button_Delete_Click;*/
        }




        #endregion



        bool Bool_Button_Play_Pause_Player;//播放状态
        bool Bool_OpenMainMusicPlayer;//是否打开播放器
        bool Bool_Button_Singer_Image_Animation;//歌手写真动画
        DoubleAnimation doubleAnimation;//窗体动画
        BlurEffect blurEffect = new BlurEffect();
        #region MusicPlayer_Left控件进入
        private void UserControl_ButtonFrame_MusicLove_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (listView_Item_Bing_ALL.listView_Temp_Info_End_Love != null)
            {
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_TryListen_Clear = false;
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_ALL_Clear = false;
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_Auto_Clear = false;
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_Love_Clear = false;

                Clear_Windows_Left_ALL_UserControl_BackGround();
                userControl_ButtonFrame_MusicLove.BoolMouseLeftDown = true;
                userControl_ButtonFrame_MusicLove.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FF1FD3AD"));

                if (listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Count > 0)
                {
                    userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = null;
                    //歌曲序号重构
                    for (int i = 0; i < listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Count; i++)
                    {
                        listView_Item_Bing_ALL.listView_Temp_Info_End_Love.ElementAt(i).Song_No = i + 1;
                    }
                    userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_Love;

                }

                listView_Item_Bing_ALL.listView_SongList.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_Love;
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_Love_Clear = true;
                bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name = "listView_Item_Bing_ALL.listView_Temp_Info_End_Love";
                userControl_Main_Home_Left_MyMusic_My_Love.Visibility = Visibility.Visible;
                userControl_Main_Home_Left_MyMusic_Recent_Play.Visibility = Visibility.Hidden;
                userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Visibility = Visibility.Hidden;
                userControl_Main_Home_Left_MyMusic_Try_Listen.Visibility = Visibility.Hidden;
                Grid_Animation_MouseLeftClick();/// 窗体进入动画
                
            }
        }

        private void UserControl_ButtonFrame_ThisWindowsMusicAndDownload_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (listView_Item_Bing_ALL.listView_Temp_Info_End_ALL != null)
            {
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_TryListen_Clear = false;
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_ALL_Clear = false;
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_Auto_Clear = false;
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_Love_Clear = false;

                Clear_Windows_Left_ALL_UserControl_BackGround();
                userControl_ButtonFrame_ThisWindowsMusicAndDownload.BoolMouseLeftDown = true;
                userControl_ButtonFrame_ThisWindowsMusicAndDownload.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FF1FD3AD"));

                if (listView_Item_Bing_ALL.listView_Temp_Info_End_ALL.Count > 0)
                {
                    userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = null;
                    //歌曲序号重构
                    for (int i = 0; i < listView_Item_Bing_ALL.listView_Temp_Info_End_ALL.Count; i++)
                    {
                        listView_Item_Bing_ALL.listView_Temp_Info_End_ALL.ElementAt(i).Song_No = i + 1;
                    }
                    userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_ALL;

                }

                listView_Item_Bing_ALL.listView_SongList.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_ALL;
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_ALL_Clear = true;
                bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name = "listView_Item_Bing_ALL.listView_Temp_Info_End_ALL";
                userControl_Main_Home_Left_MyMusic_My_Love.Visibility = Visibility.Hidden;
                userControl_Main_Home_Left_MyMusic_Recent_Play.Visibility = Visibility.Hidden;
                userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Visibility = Visibility.Visible;
                userControl_Main_Home_Left_MyMusic_Try_Listen.Visibility = Visibility.Hidden;
                Grid_Animation_MouseLeftClick();/// 窗体进入动画
            }
        }
        private void UserControl_ButtonFrame_MusicRecentlyPlayed_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (listView_Item_Bing_ALL.listView_Temp_Info_End_Auto != null)
            {
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_TryListen_Clear = false;
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_ALL_Clear = false;
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_Auto_Clear = false;
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_Love_Clear = false;

                Clear_Windows_Left_ALL_UserControl_BackGround();
                userControl_ButtonFrame_MusicRecentlyPlayed.BoolMouseLeftDown = true;
                userControl_ButtonFrame_MusicRecentlyPlayed.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FF1FD3AD"));

                if (listView_Item_Bing_ALL.listView_Temp_Info_End_Auto.Count > 0)
                {
                    userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
                    //歌曲序号重构
                    for (int i = 0; i < listView_Item_Bing_ALL.listView_Temp_Info_End_Auto.Count; i++)
                    {
                        listView_Item_Bing_ALL.listView_Temp_Info_End_Auto.ElementAt(i).Song_No = i + 1;
                    }
                    userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_Auto;

                }

                listView_Item_Bing_ALL.listView_SongList.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_Auto;
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_Auto_Clear = true;
                bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name = "listView_Item_Bing_ALL.listView_Temp_Info_End_Auto";
                userControl_Main_Home_Left_MyMusic_My_Love.Visibility = Visibility.Hidden;
                userControl_Main_Home_Left_MyMusic_Recent_Play.Visibility = Visibility.Visible;
                userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Visibility = Visibility.Hidden;
                userControl_Main_Home_Left_MyMusic_Try_Listen.Visibility = Visibility.Hidden;
                Grid_Animation_MouseLeftClick();/// 窗体进入动画
            }
        }
        private void UserControl_ButtonFrame_MusicTryListenList_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen != null)
            {
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_TryListen_Clear = false;
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_ALL_Clear = false;
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_Auto_Clear = false;
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_Love_Clear = false;

                Clear_Windows_Left_ALL_UserControl_BackGround();
                userControl_ButtonFrame_MusicTryListenList.BoolMouseLeftDown = true;
                userControl_ButtonFrame_MusicTryListenList.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FF1FD3AD"));

                if (listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen.Count > 0)
                {
                    userControl_Main_Home_Left_MyMusic_Try_Listen.ListView_Download_SongList_Info.ItemsSource = null;
                    //歌曲序号重构
                    for (int i = 0; i < listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen.Count; i++)
                    {
                        listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen.ElementAt(i).Song_No = i + 1;
                    }
                    userControl_Main_Home_Left_MyMusic_Try_Listen.ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen;
                }

                listView_Item_Bing_ALL.listView_SongList.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen;
                bool_ListView_Temp_Info_End_Clear.Bool_listView_Temp_Info_End_TryListen_Clear = true;
                bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name = "listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen";
                userControl_Main_Home_Left_MyMusic_My_Love.Visibility = Visibility.Hidden;
                userControl_Main_Home_Left_MyMusic_Recent_Play.Visibility = Visibility.Hidden;
                userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Visibility = Visibility.Hidden;
                userControl_Main_Home_Left_MyMusic_Try_Listen.Visibility = Visibility.Visible;
                Grid_Animation_MouseLeftClick();/// 窗体进入动画
            }
        }

        #endregion
        #region MusicPlayer_Top控件按键操作       
        Thickness thickness_Grid_MusicPlayer_Main_UserControl_Normal = new Thickness();
        Thickness thickness_Grid_MusicPlayer_Main_UserControl_Enter = new Thickness();


        Thickness thickness_ListView_Temp_MRC_Margin_Center;
        /// <summary>
        /// 打开主播放器
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Button_Border_Hover_BackGround_Click_OpenMainMusicPlayer(object sender, EventArgs e)
        {
            blurEffect.Radius = 0;
            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.Effect = blurEffect;

            try
            {
                Bool_OpenMainMusicPlayer = true;

                musicPlayer_Main_UserControl.VerticalAlignment = VerticalAlignment.Bottom;

                Frame_Buttom_MusicPlayerUserControl.Margin = thickness_Grid_MusicPlayer_Main_UserControl_Enter;
                if (!Bool_Button_Singer_Image_Animation)
                    musicPlayer_Main_UserControl.Panel_Image.Visibility = Visibility.Visible;

                musicPlayer_Main_UserControl.Width = this.Width - 20;
                musicPlayer_Main_UserControl.Height = this.Height - 20;

                userControl_ButtonFrame_MusicPlayer.Grid_MusicPlayer_MainWindow_Left.Visibility = Visibility.Hidden;
                userControl_ButtonFrame_MusicPlayer.Grid_MusicPlayer_MainWindow_Right.Visibility = Visibility.Hidden;
                userControl_ButtonFrame_MusicPlayer.Grid_MusicPlayer_Main_Left.Visibility = Visibility.Visible;
                userControl_ButtonFrame_MusicPlayer.Grid_MusicPlayer_Main_Right.Visibility = Visibility.Visible;
                userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.Visibility = Visibility.Visible;

                if (Int_Button_WMP_Song_Order == 0)
                    userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/顺序播放 (1).png")));
                else if (Int_Button_WMP_Song_Order == 1)
                    userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/24gl-repeatOnce2 (1).png")));
                else if (Int_Button_WMP_Song_Order == 2)
                    userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/随机播放_32 (1).png")));
                else
                    userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/列表循环 (1).png")));

                userControl_ButtonFrame_MusicPlayer.Button_Before.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/上一首 (1).png")));
                userControl_ButtonFrame_MusicPlayer.Button_Next.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/下一首 (1).png")));
                userControl_ButtonFrame_MusicPlayer.Button_Music_Voice_Speed.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/音量 (1).png")));


                musicPlayer_Main_UserControl.ListView_Temp_MRC.Visibility = Visibility.Hidden;
                //实例化一个DoubleAnimation类。
                doubleAnimation = new DoubleAnimation();
                //设置From属性。
                doubleAnimation.From = 0;
                //设置To属性。
                doubleAnimation.To = this.ActualHeight - 20;
                //设置Duration属性。
                doubleAnimation.Duration = new Duration(TimeSpan.FromMilliseconds(200));
                //设置动画完成事件
                doubleAnimation.Completed += DoubleAnimation_Completed;
                //为元素设置BeginAnimation方法。
                musicPlayer_Main_UserControl.BeginAnimation(UserControl.HeightProperty, doubleAnimation);
            }
            catch { }

        }
        /// <summary>
        /// 返回主界面
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Button_Return_MainWindow_Click_CloseMainMusicPlayer(object sender, EventArgs e)
        {
            //blurEffect.Radius数值超过0会造成动画UI卡顿
            blurEffect.Radius = 0;
            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.Effect = blurEffect;


            try
            {
                Bool_OpenMainMusicPlayer = false;

                musicPlayer_Main_UserControl.VerticalAlignment = VerticalAlignment.Bottom;

                Frame_Buttom_MusicPlayerUserControl.Margin = thickness_Grid_MusicPlayer_Main_UserControl_Normal;
                musicPlayer_Main_UserControl.Panel_Image.Visibility = Visibility.Hidden;

                musicPlayer_Main_UserControl.Width = this.Width - 20;
                musicPlayer_Main_UserControl.Height = this.Height - 20;

                userControl_ButtonFrame_MusicPlayer.Grid_MusicPlayer_MainWindow_Left.Visibility = Visibility.Visible;
                userControl_ButtonFrame_MusicPlayer.Grid_MusicPlayer_MainWindow_Right.Visibility = Visibility.Visible;
                userControl_ButtonFrame_MusicPlayer.Grid_MusicPlayer_Main_Left.Visibility = Visibility.Hidden;
                userControl_ButtonFrame_MusicPlayer.Grid_MusicPlayer_Main_Right.Visibility = Visibility.Hidden;
                userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.Visibility = Visibility.Hidden;

                if (Int_Button_WMP_Song_Order == 0)
                    userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/顺序播放.png")));
                else if (Int_Button_WMP_Song_Order == 1)
                    userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/24gl-repeatOnce2.png")));
                else if (Int_Button_WMP_Song_Order == 2)
                    userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/随机播放_32.png")));
                else
                    userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/列表循环.png")));

                userControl_ButtonFrame_MusicPlayer.Button_Before.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/上一首.png")));
                userControl_ButtonFrame_MusicPlayer.Button_Next.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/下一首.png")));
                userControl_ButtonFrame_MusicPlayer.Button_Music_Voice_Speed.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/音量.png")));

                musicPlayer_Main_UserControl.ListView_Temp_MRC.Visibility = Visibility.Hidden;
                //实例化一个DoubleAnimation类。
                doubleAnimation = new DoubleAnimation();
                //设置From属性。
                doubleAnimation.From = this.ActualHeight;
                //设置To属性。
                doubleAnimation.To = 0;
                //设置Duration属性。
                doubleAnimation.Duration = new Duration(TimeSpan.FromMilliseconds(200));
                //设置动画完成事件
                doubleAnimation.Completed += DoubleAnimation_Completed;
                //为元素设置BeginAnimation方法。
                musicPlayer_Main_UserControl.BeginAnimation(UserControl.HeightProperty, doubleAnimation);
            }
            catch { }

        }

        Thickness thickness_ListView_Temp_MRC_Margin = new Thickness();
        /// <summary>
        /// 主界面切换动画完成事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void DoubleAnimation_Completed(object sender, EventArgs e)
        {
            blurEffect.Radius = 46;
            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.Effect = blurEffect;

            musicPlayer_Main_UserControl.ListView_Temp_MRC.Visibility = Visibility.Visible;
        }

        

        #endregion
        #region MusicPlayer_Buttom控件按键操作  

        /// <summary>
        /// 桌面歌词
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Button_Window_Hover_MRC_Panel(object sender, EventArgs e)
        {
            if (!window_Hover_MRC_Panel.Bool_Open_MRC_Panel)
            {
                window_Hover_MRC_Panel.Show();

                window_Hover_MRC_Panel.Bool_Open_MRC_Panel = true;
            }
            else
            {
                window_Hover_MRC_Panel.Hide();

                window_Hover_MRC_Panel.Bool_Open_MRC_Panel = false;
            }
        }

        /// <summary>
        /// 开启歌手写真动画
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Button_Singer_Image_Animation_Click(object sender, EventArgs e)
        {
            if (!Bool_Button_Singer_Image_Animation)
            {
                Open_Singer_Image_Animation();

                musicPlayer_Main_UserControl.TextBox_SongName.Visibility = Visibility.Hidden;
                musicPlayer_Main_UserControl.TextBox_SingerName.Visibility = Visibility.Hidden;
                musicPlayer_Main_UserControl.TextBox_SongAlbumName.Visibility = Visibility.Hidden;
                userControl_ButtonFrame_MusicPlayer.Button_Singer_Image_Animation_To_WindowsDesktop.Visibility = Visibility.Visible;

                thickness_ListView_Temp_MRC_Margin_Center = musicPlayer_Main_UserControl.ListView_Temp_MRC.Margin;
                thickness_ListView_Temp_MRC_Margin_Center.Left = 0;
                thickness_ListView_Temp_MRC_Margin_Center.Right = 0;
                musicPlayer_Main_UserControl.ListView_Temp_MRC.Margin = thickness_ListView_Temp_MRC_Margin_Center;
                musicPlayer_Main_UserControl.TextBox_ListViewMRC_Up.Margin = thickness_ListView_Temp_MRC_Margin_Center;
                musicPlayer_Main_UserControl.ListView_Temp_MRC_Temp.Margin = thickness_ListView_Temp_MRC_Margin_Center;
                musicPlayer_Main_UserControl.ListView_Temp_MRC.Width = 1000;
            }
            else
            {
                thread_timer_Singer_Photo_One = new Thread(new ThreadStart(() =>
                {
                    Dispatcher.BeginInvoke(new Action(delegate ()
                    {
                        timer_Singer_Photo_One.Stop();
                        timer_Singer_Photo_One_Lot.Stop();
                    }));
                }));
                thread_timer_Singer_Photo_One.Start();

                Bool_Timer_Singer_Photo_1 = false;
                Bool_Timer_Singer_Photo_1_lot = false;

                userControl_ButtonFrame_MusicPlayer.Button_Singer_Image_Animation_Image.Source = new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/开关-关 (1).png"));
                Bool_Button_Singer_Image_Animation = false;

                musicPlayer_Main_UserControl.Image_Singer_Buttom.Visibility = Visibility.Visible;
                //musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close.Visibility = Visibility.Visible;
                musicPlayer_Main_UserControl.Border_SingerPhoto_Mode_Close_BackGround.Visibility = Visibility.Visible;
                musicPlayer_Main_UserControl.Panel_Image.Visibility = Visibility.Visible;
                //关闭桌面写真
                userControl_ButtonFrame_MusicPlayer.Button_Singer_Image_Animation_To_WindowsDesktop.Visibility = Visibility.Hidden;
                SystemParametersInfo(20, 1, wallpaper_path, 1);
                Bool_Windows_Wallpaper = false;
                userControl_ButtonFrame_MusicPlayer.Button_Singer_Image_Animation_Image_To_WindowsDesktop.Source = new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/开关-关 (1).png"));


                //实例化一个DoubleAnimation类。
                doubleAnimation = new DoubleAnimation();
                //设置From属性。
                doubleAnimation.From = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.Opacity;
                //设置To属性。
                doubleAnimation.To = 1;
                //设置Duration属性。
                doubleAnimation.Duration = new Duration(TimeSpan.FromMilliseconds(200));
                //为元素设置BeginAnimation方法。
                musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.BeginAnimation(UserControl.OpacityProperty, doubleAnimation);


                musicPlayer_Main_UserControl.TextBox_SongName.Visibility = Visibility.Visible;
                musicPlayer_Main_UserControl.TextBox_SingerName.Visibility = Visibility.Visible;
                musicPlayer_Main_UserControl.TextBox_SongAlbumName.Visibility = Visibility.Visible;

                musicPlayer_Main_UserControl.ListView_Temp_MRC.Margin = thickness_ListView_Temp_MRC_Margin;
                musicPlayer_Main_UserControl.TextBox_ListViewMRC_Up.Margin = thickness_ListView_Temp_MRC_Margin;
                musicPlayer_Main_UserControl.ListView_Temp_MRC_Temp.Margin = thickness_ListView_Temp_MRC_Margin;
                musicPlayer_Main_UserControl.ListView_Temp_MRC.Width = 444;
            }
        }
        public void Open_Singer_Image_Animation()
        {
            Change_Image_Singer();//切换歌手图片

            userControl_ButtonFrame_MusicPlayer.Button_Singer_Image_Animation_Image.Source = new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/开关-开 (1).png"));
            Bool_Button_Singer_Image_Animation = true;

            musicPlayer_Main_UserControl.Image_Singer_Buttom.Visibility = Visibility.Visible;
            //musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close.Visibility = Visibility.Hidden;
            musicPlayer_Main_UserControl.Border_SingerPhoto_Mode_Close_BackGround.Visibility = Visibility.Hidden;
            musicPlayer_Main_UserControl.Panel_Image.Visibility = Visibility.Hidden;


            //实例化一个DoubleAnimation类。
            doubleAnimation = new DoubleAnimation();
            //设置From属性。
            doubleAnimation.From = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.Opacity;
            //设置To属性。
            doubleAnimation.To = 0;
            //设置Duration属性。
            doubleAnimation.Duration = new Duration(TimeSpan.FromMilliseconds(200));
            //为元素设置BeginAnimation方法。
            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.BeginAnimation(UserControl.OpacityProperty, doubleAnimation);
        }





        /// <summary>
        /// 播放/暂停
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Play_Pause_Player_Click(object sender, RoutedEventArgs e)
        {
            if (!Bool_Button_Play_Pause_Player)
            {
                userControl_ButtonFrame_MusicPlayer.Button_Play_Pause_Player.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\暂停.png")));
                Bool_Button_Play_Pause_Player = true;

                MediaElement_Song.Play();
                MediaElement_Song.LoadedBehavior = MediaState.Play;
                dispatcherTimer_Spectrum_Visualization.Start();
                musicPlayer_Main_UserControl.Image_Song_Storyboard.Resume();

                if (myTextBlock_Storyboard != null)
                {
                    myTextBlock_Storyboard.Resume();
                    window_Hover_MRC_Panel.Text_Storyboard.Resume();
                    if (window_Hover_MRC_Panel.Text_Storyboard_slider_Up != null) {
                        window_Hover_MRC_Panel.Text_Storyboard_slider_Up.Resume();
                        window_Hover_MRC_Panel.Text_Storyboard_slider_Down.Resume();
                    }
                }

                //为元素设置BeginAnimation方法。
                musicPlayer_Main_UserControl.Storyboard_BeginMusic_Jukebox_Open.Begin();
            }
            else
            {
                userControl_ButtonFrame_MusicPlayer.Button_Play_Pause_Player.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\24gf-playCircle.png")));
                Bool_Button_Play_Pause_Player = false;

                MediaElement_Song.Pause();
                MediaElement_Song.LoadedBehavior = MediaState.Pause;
                dispatcherTimer_Spectrum_Visualization.Stop();
                musicPlayer_Main_UserControl.Image_Song_Storyboard.Pause();

                if (myTextBlock_Storyboard != null)
                {
                    myTextBlock_Storyboard.Pause();
                    window_Hover_MRC_Panel.Text_Storyboard.Pause();
                    if (window_Hover_MRC_Panel.Text_Storyboard_slider_Up != null)
                    {
                        window_Hover_MRC_Panel.Text_Storyboard_slider_Up.Pause();
                        window_Hover_MRC_Panel.Text_Storyboard_slider_Down.Pause();
                    }
                }

                //为元素设置BeginAnimation方法。
                musicPlayer_Main_UserControl.Storyboard_BeginMusic_Jukebox_Close.Begin();
            }
        }
        /// <summary>
        /// 上一首
        /// </summary>
        public void Button_Music_Up_Song(object sender, EventArgs e)
        {
            WMP_Song_Play_Ids_UP_DOWN = -1;
            Change_MediaElement_Song_id_incrse();
            Change_MediaElement_Source();
        }
        /// <summary>
        /// 下一首
        /// </summary>
        public void Button_Music_Next_Song(object sender, EventArgs e)
        {
            WMP_Song_Play_Ids_UP_DOWN = 1;
            Change_MediaElement_Song_id_incrse();
            Change_MediaElement_Source();
        }
        bool Bool_Button_WMP_Song_Order;
        int Int_Button_WMP_Song_Order;//-1:列表  0:默认  1:单曲  2:随机
        /// <summary>
        /// 播放顺序
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Button_WMP_Song_Order_Click(object sender, EventArgs e)
        {
            if (!Bool_Button_WMP_Song_Order)
            {
                userControl_ButtonFrame_MusicPlayer.Stack_Panel_Order.Visibility = Visibility.Visible;
                Bool_Button_WMP_Song_Order = true;
            }
            else
            {
                userControl_ButtonFrame_MusicPlayer.Stack_Panel_Order.Visibility = Visibility.Hidden;
                Bool_Button_WMP_Song_Order = false;
            }
        }

        /// <summary>
        /// 随机播放
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Stack_Button_Radom_Click(object sender, EventArgs e)
        {
            Int_Button_WMP_Song_Order = 2;
            WMP_Song_Order = 2;

            if (!Bool_OpenMainMusicPlayer)
                userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\随机播放_32.png")));
            else
                userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\随机播放_32 (1).png")));

            userControl_ButtonFrame_MusicPlayer.Stack_Panel_Order.Visibility = Visibility.Hidden;
            Bool_Button_WMP_Song_Order = false;
        }
        /// <summary>
        /// 顺序播放
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Stack_Button_Normal_Click(object sender, EventArgs e)
        {
            Int_Button_WMP_Song_Order = 0;
            WMP_Song_Order = 0;

            if (!Bool_OpenMainMusicPlayer)
                userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\顺序播放.png")));
            else
                userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\顺序播放 (1).png")));

            userControl_ButtonFrame_MusicPlayer.Stack_Panel_Order.Visibility = Visibility.Hidden;
            Bool_Button_WMP_Song_Order = false;
        }
        /// <summary>
        /// 单曲循环
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Stack_Button_OnlyOne_Click(object sender, EventArgs e)
        {
            Int_Button_WMP_Song_Order = 1;
            WMP_Song_Order = 1;

            if (!Bool_OpenMainMusicPlayer)
                userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\24gl-repeatOnce2.png")));
            else
                userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\24gl-repeatOnce2 (1).png")));

            userControl_ButtonFrame_MusicPlayer.Stack_Panel_Order.Visibility = Visibility.Hidden;
            Bool_Button_WMP_Song_Order = false;
        }
        /// <summary>
        /// 列表循环
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Stack_Button_List_Click(object sender, EventArgs e)
        {
            Int_Button_WMP_Song_Order = -1;
            WMP_Song_Order = 0;

            if (!Bool_OpenMainMusicPlayer)
                userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\列表循环.png")));
            else
                userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\列表循环 (1).png")));

            userControl_ButtonFrame_MusicPlayer.Stack_Panel_Order.Visibility = Visibility.Hidden;
            Bool_Button_WMP_Song_Order = false;
        }

        bool Bool_Button_WMP_Song_Voice;
        /// <summary>
        /// 音量控制
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Button_WMP_Song_Voice_Click(object sender, EventArgs e)
        {
            if (!Bool_Button_WMP_Song_Voice)
            {
                userControl_ButtonFrame_MusicPlayer.Stack_Panel_Voice.Visibility = Visibility.Visible;
                Bool_Button_WMP_Song_Voice = true;
            }
            else
            {
                userControl_ButtonFrame_MusicPlayer.Stack_Panel_Voice.Visibility = Visibility.Hidden;
                Bool_Button_WMP_Song_Voice = false;
            }
        }
        public void WMP_Song_Slider_Voice_Value_Changed(object sender, EventArgs e)
        {
            MediaElement_Song.Volume = userControl_ButtonFrame_MusicPlayer.Slider_Voice.Value;
            userControl_ButtonFrame_MusicPlayer.Voice_Nums.Text = Convert.ToInt32((userControl_ButtonFrame_MusicPlayer.Slider_Voice.Value) * 100) + "%";
        }

        #endregion
        #region MusicPlayer

        #region MediaElement_Song歌曲资源初始化加载

        private void MediaElement_Song_MediaOpened(object sender, RoutedEventArgs e)//一定几率导致双缓冲,同时执行开启与结束事件
        {
            Load_MediaElement_Song_MediaOpened();
        }
        public void Load_MediaElement_Song_MediaOpened()
        {
            Bool_Button_Play_Pause_Player = true;

            userControl_ButtonFrame_MusicPlayer.Silder_Music_Width.Maximum = MediaElement_Song.NaturalDuration.TimeSpan.TotalMilliseconds;
            userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.Maximum = userControl_ButtonFrame_MusicPlayer.Silder_Music_Width.Maximum;

            userControl_ButtonFrame_MusicPlayer.Silder_Music_Width.Value = 0;
            userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.Value = 0;

            test2 = MediaElement_Song.NaturalDuration.TimeSpan;

            //是否开启歌手写真轮播
            if (Bool_Button_Singer_Image_Animation)
            {
                thread_timer_Singer_Photo_One = new Thread(new ThreadStart(() =>
                {
                    Dispatcher.BeginInvoke(new Action(delegate ()
                    {
                        timer_Singer_Photo_One.Stop();
                        timer_Singer_Photo_One_Lot.Stop();
                    }));
                }));
                thread_timer_Singer_Photo_One.Start();

                Bool_Timer_Singer_Photo_1 = false;
                Bool_Timer_Singer_Photo_1_lot = false;

                Open_Singer_Image_Animation();
            }

            MediaElement_Song.LoadedBehavior = MediaState.Play;

            if (File.Exists(Singer_Image_Url))
            {
                ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                test.Stretch = Stretch.UniformToFill;
                musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Background = test;
            }

            musicPlayer_Main_UserControl.Image_Song_Storyboard.Begin();

            //为元素设置BeginAnimation方法。
            musicPlayer_Main_UserControl.Storyboard_BeginMusic_Jukebox_Open.Begin();
        }

        private void MediaElement_Song_MediaEnded(object sender, RoutedEventArgs e)
        {
            WMP_Song_Play_Ids_UP_DOWN = 1;

            userControl_ButtonFrame_MusicPlayer.Silder_Music_Width.Value = 0;
            userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.Value = 0;

            if (WMP_Song_Order == 1)
            {
                Change_MediaElement_Source();

                Load_MediaElement_Song_MediaOpened();
            }
            else
            {
                Change_MediaElement_Song_id_incrse();
                Change_MediaElement_Source();
            }

            //为元素设置BeginAnimation方法。
            musicPlayer_Main_UserControl.Storyboard_BeginMusic_Jukebox_Close.Begin();
        }

        #endregion

        #region 时间轴sidler
        DispatcherTimer dispatcherTimer_Silder;    // 用于时间轴  
        public static double TimeLine_Nums;
        TimeSpan test1;
        TimeSpan test2;

        /// <summary>
        /// 鼠标移入silder
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Mouse_Over_Silder_Music_Width(object sender, MouseEventArgs e)
        {
            TimeLine_Nums = userControl_ButtonFrame_MusicPlayer.Silder_Music_Width.Value;

            //同步两个silder的长度
            userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.Value = userControl_ButtonFrame_MusicPlayer.Silder_Music_Width.Value;

            userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.Visibility = Visibility.Visible;
        }


        /// <summary>
        /// 鼠标移除silder
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Mouse_Leave_Silder_Music_Width(object sender, MouseEventArgs e)
        {
            userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.Visibility = Visibility.Hidden;

            userControl_ButtonFrame_MusicPlayer.Silder_Music_Width.Value = userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.Value;
        }

        /// <summary>
        /// 直接跳转会导致播放器控件连续触发读取完成，读完事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Timeline_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            //只有在silder_temp值改变才执行歌曲进度跳转
            if (TimeLine_Nums != userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.Value)
            {
                //只有在鼠标悬浮与silder_temp上才执行歌曲进度跳转
                if (userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.IsMouseOver)
                {
                    dispatcherTimer_Silder.Stop();

                    MediaElement_Song.Position = new TimeSpan(0, 0, 0, 0, (int)userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.Value);

                    userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.Visibility = Visibility.Hidden;

                    //歌词滚动
                    if (ListBox_MRC_Song_MRC_Time != null)
                    {
                        //如果选中的  跳转的播放进度  在  当前播放进度  之前
                        if (userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.Value < userControl_ButtonFrame_MusicPlayer.Silder_Music_Width.Value)
                        {
                            musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex = 0;
                            musicPlayer_Main_UserControl.ListView_Temp_MRC.ScrollIntoView(musicPlayer_Main_UserControl.ListView_Temp_MRC.Items[0]);//先滚动至第一行歌词
                            //ListView_MRC.ScrollIntoView(ListView_MRC.Items[0]);//先滚动至第一行歌词                          
                        }
                        //歌词时间匹配方法  会自动跳转至指定选中歌词行
                    }

                    dispatcherTimer_Silder.Start();
                }
            }
        }


        private void DispatcherTimer_Silder_Tick(object sender, EventArgs e)
        {
            test1 = MediaElement_Song.Position;

            // 时间轴slider滑动值随播放内容位置变化
            userControl_ButtonFrame_MusicPlayer.Silder_Music_Width.Value = MediaElement_Song.Position.TotalMilliseconds;

            TimeLine_Nums = userControl_ButtonFrame_MusicPlayer.Silder_Music_Width.Value;

            userControl_ButtonFrame_MusicPlayer.TextBox_Song_Time.Text = test1.ToString(@"mm\:ss") + @" \ " + test2.ToString(@"mm\:ss");
            userControl_ButtonFrame_MusicPlayer.TextBox_Song_Time_Left.Text = userControl_ButtonFrame_MusicPlayer.TextBox_Song_Time.Text;

            userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.Value = userControl_ButtonFrame_MusicPlayer.Silder_Music_Width.Value;

        }
        #endregion
        
        #region 音乐播放

        public int WMP_Song_Order;//播放顺序 
        public int WMP_Song_Play_Ids;//歌曲序号
        public int WMP_Song_Play_Ids_UP_DOWN;//上一首or下一首
        Random rd = new Random();
        /// <summary>
        /// 指定歌曲id的值
        /// </summary>
        public void Change_MediaElement_Song_id_incrse()
        {
            //顺序播放
            if (WMP_Song_Order == 0)
            {
                if (WMP_Song_Play_Ids_UP_DOWN == 1)
                {
                    if (WMP_Song_Play_Ids != listView_Item_Bing_ALL.listView_SongList.Items.Count)
                        WMP_Song_Play_Ids++;
                    else
                        WMP_Song_Play_Ids = 1;
                }
                else if (WMP_Song_Play_Ids_UP_DOWN == -1)
                {
                    if (WMP_Song_Play_Ids != 1)
                        WMP_Song_Play_Ids--;
                    else
                        WMP_Song_Play_Ids = listView_Item_Bing_ALL.listView_SongList.Items.Count;
                }
            }
            //单曲循环
            else if (WMP_Song_Order == 1)
            {
                if (WMP_Song_Play_Ids_UP_DOWN == 1)
                {
                    if (WMP_Song_Play_Ids != listView_Item_Bing_ALL.listView_SongList.Items.Count)
                        WMP_Song_Play_Ids++;
                    else
                        WMP_Song_Play_Ids = 1;
                }
                else if (WMP_Song_Play_Ids_UP_DOWN == -1)
                {
                    if (WMP_Song_Play_Ids != 1)
                        WMP_Song_Play_Ids--;
                    else
                        WMP_Song_Play_Ids = listView_Item_Bing_ALL.listView_SongList.Items.Count;
                }
            }
            //随机播放
            else if (WMP_Song_Order == 2)
            {
                WMP_Song_Play_Ids = rd.Next(1, this.listView_Item_Bing_ALL.listView_SongList.Items.Count + 1);//(生成1~10之间的随机数，不包括10)
            }
        }


        public string Song_MRC_Path;
        string Singer_Name;
        string Song_Name;
        string Song_Url;
        string Song_Image_Name;
        public int Select_DoubleClick_ListView = 0;
        /// <summary>
        /// 根据歌曲id的值，播放指定路径
        /// </summary>
        public void Change_MediaElement_Source()
        {
            window_Hover_MRC_Panel.TextBlock_1.Text = "科技源于生活，技术源于创新";
            window_Hover_MRC_Panel.TextBlock_2.Text = "毒蛇云生态，致力于生活更便捷";
            if (window_Hover_MRC_Panel.Bool_Open_MRC_Panel)
            {
                window_Hover_MRC_Panel.Text_DoubleAnimation.Duration = new Duration(new TimeSpan(0, 0, 0, 0, 3333));
                window_Hover_MRC_Panel.Text_Storyboard.Begin();
            }

            if (Select_DoubleClick_ListView == 1)
            {
                WMP_Song_Play_Ids = listView_Item_Bing_ALL.listView_SongList.SelectedIndex + 1;
                Select_DoubleClick_ListView = 0;
            }

            try
            {
                string path = ((ListView_Item_Bing)listView_Item_Bing_ALL.listView_SongList.Items[WMP_Song_Play_Ids - 1]).Song_Url;

                if (!File.Exists(path))
                    path = Path_App + path;

                //指定播放路径
                MediaElement_Song.Source = new Uri(path);
                Song_Url = MediaElement_Song.Source.ToString();
                if (dispatcherTimer_Spectrum_Visualization != null)
                {
                    //userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.Take_Spectrum_Visualization(Song_Url);
                    dispatcherTimer_Spectrum_Visualization.Start();
                }

                //保存当前正在播放的歌曲信息
                //Song_No = ((ListView_Item_Bing)listView_Item_Bing_ALL.listView_SongList.Items[WMP_Song_Play_Ids - 1]).Song_No;
                Song_Name = ((ListView_Item_Bing)listView_Item_Bing_ALL.listView_SongList.Items[WMP_Song_Play_Ids - 1]).Song_Name.Trim();
                Singer_Name = ((ListView_Item_Bing)listView_Item_Bing_ALL.listView_SongList.Items[WMP_Song_Play_Ids - 1]).Singer_Name;
                //Song_Url = ((ListView_Item_Bing)listView_Item_Bing_ALL.listView_SongList.Items[WMP_Song_Play_Ids - 1]).Song_Url;
                Song_Image_Name = ((ListView_Item_Bing)listView_Item_Bing_ALL.listView_SongList.Items[WMP_Song_Play_Ids - 1]).Album_Name;

                //开始播放
                MediaElement_Song.Play();
                //设置播放器播放状态为play
                MediaElement_Song.LoadedBehavior = MediaState.Play;
                //设置播放
                userControl_ButtonFrame_MusicPlayer.Button_Play_Pause_Player.Background = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\暂停.png")));



                //歌曲逻辑
                //Change_MediaElement_Song_Source();//打开歌词显示
                //生成歌曲名
                Song_MRC_Path = Singer_Name + " - " + Song_Name;
                //切换歌曲，歌手，专辑名
                Change_TextBox_To_SingerSong_Name();
                //选中播放的列
                listView_Item_Bing_ALL.listView_SongList.SelectedIndex = WMP_Song_Play_Ids - 1;

                //检测歌手数量，设置歌手动画循环方式
                if (Singer_Name.IndexOf("、") <= 0)//单歌手
                {
                    Bool_Timer_Singer_Photo_1 = true;
                    Bool_Timer_Singer_Photo_1_lot = false;
                }
                else//多歌手
                {
                    Bool_Timer_Singer_Photo_1 = false;
                    Bool_Timer_Singer_Photo_1_lot = true;
                }

                //生成歌词路径
                Create_Steam_Song_MRC();

                try
                {
                    //切换专辑图片
                    Change_Image_Song();
                }
                catch (Exception ex)
                {
                    MessageBox.Show("异常！" + ex.ToString());
                }

            }
            catch
            {
                try
                {
                    string temp = Path_App + @"\" + ((ListView_Item_Bing)listView_Item_Bing_ALL.listView_SongList.Items[WMP_Song_Play_Ids - 1]).Song_Url;
                    MessageBox.Show("此音乐文件路径不存在：\n" + temp);
                }
                catch { }
            }
        }




        /// <summary>
        /// 切换歌曲，歌手，专辑名
        /// </summary>
        public void Change_TextBox_To_SingerSong_Name()
        {
            //如果当前播放的歌曲信息不为空
            if (Song_Name != null)
            {
                string Song_Name_Temp = Song_Name;

                //设置歌手名
                musicPlayer_Main_UserControl.TextBox_SingerName.Text = "歌手 :  "+Singer_Name;
                musicPlayer_Main_UserControl.TextBox_SingerName.TextAlignment = TextAlignment.Center;
                musicPlayer_Main_UserControl.TextBox_SingerName_Animation.Text = "歌手 :  " + Singer_Name;
                musicPlayer_Main_UserControl.TextBox_SingerName_Animation.TextAlignment = TextAlignment.Center;
                //设置歌曲名
                musicPlayer_Main_UserControl.TextBox_SongName.Text = Song_Name_Temp/*.Substring(Song_Name_Temp_Last_Num + 3)*/.Trim();
                musicPlayer_Main_UserControl.TextBox_SongName.TextAlignment = TextAlignment.Center;
                musicPlayer_Main_UserControl.TextBox_SongName_Animation.Text = Song_Name_Temp/*.Substring(Song_Name_Temp_Last_Num + 3)*/.Trim();
                musicPlayer_Main_UserControl.TextBox_SongName_Animation.TextAlignment = TextAlignment.Center;
                //设置专辑名
                musicPlayer_Main_UserControl.TextBox_SongAlbumName.Text = "专辑 :  " + Song_Image_Name;
                musicPlayer_Main_UserControl.TextBox_SongAlbumName.TextAlignment = TextAlignment.Center;
                musicPlayer_Main_UserControl.TextBox_SongAlbumName_Animation.Text = "专辑 :  " + Song_Image_Name;
                musicPlayer_Main_UserControl.TextBox_SongAlbumName_Animation.TextAlignment = TextAlignment.Center;
                //设置歌曲全名
                userControl_ButtonFrame_MusicPlayer.Song_Name.Text = Singer_Name + " - " + Song_Name;
            }
        }


        /// <summary>
        /// 双击播放音乐
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void userControl_ButtonFrame_MusicPlayer_ListView_Download_SongList_Info_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            if(bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_Love"))
                listView_Item_Bing_ALL.listView_SongList = userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info;
            else if (bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_ALL"))
                listView_Item_Bing_ALL.listView_SongList = userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info;
            else if (bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_Auto"))
                listView_Item_Bing_ALL.listView_SongList = userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info;
            else if (bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen"))
                listView_Item_Bing_ALL.listView_SongList = userControl_Main_Home_Left_MyMusic_Try_Listen.ListView_Download_SongList_Info;

            Select_DoubleClick_ListView = 1;
            Change_MediaElement_Source();
        }



        #endregion

        #region 歌词切换

        public string[] ListBox_MRC_Song_MRC_Text;//歌词文件文本歌词内容的集合
        public double[] ListBox_MRC_Song_MRC_Time;//歌词文件文本歌词时间的集合
        public double Start_Song_MRC_Time;
        public double End_Song_MRC_Time;

        //歌词信息类
        Dao_ListBox_Temp_MRC dao_ListBox_Temp_MRC = new Dao_ListBox_Temp_MRC();
        /// <summary>
        /// 生成歌词路径
        /// </summary>
        public void Create_Steam_Song_MRC()
        {
            //歌词数组信息输出类指代为 Dao_ListBox_Temp_MRC

            //歌词文件文本歌词内容的集合
            ListBox_MRC_Song_MRC_Text = new string[999];
            //歌词文件文本歌词时间的集合
            ListBox_MRC_Song_MRC_Time = new double[999];
            //创建获取 歌词数组信息输出类 
            dao_ListBox_Temp_MRC = new Dao_ListBox_Temp_MRC();
            //设置要分析的歌词文件（mrc）路径
            string MRC_URL = Path_App + @"\Mrc\" + Song_MRC_Path + @".mrc";
            string CRC_URL = MRC_URL.Replace("Mrc", "Crc"); CRC_URL = CRC_URL.Replace("mrc", "crc");

            if (!File.Exists(MRC_URL))
                MRC_URL = Path_App + @"\Mrc\" + Song_MRC_Path + @".krc"; CRC_URL = MRC_URL.Replace("Mrc", "Crc"); CRC_URL = CRC_URL.Replace("krc", "crc");

            try
            {
                //如果歌词文件存在
                if (File.Exists(MRC_URL))
                {
                    //调用 Dao_ListBox_Temp_MRC内的方法 生成歌词数组方法，分析歌词数组信息并存储在 Dao_ListBox_Temp_MRC内
                    dao_ListBox_Temp_MRC.player_lrc_Save_Text(MRC_URL);
                    try
                    {
                        //字同步  生成树状结构(优化)
                        dao_ListBox_Temp_MRC.Take_TreeMRCInfo(MRC_URL);
                        //行同步   分析树状歌词结构（未优化）
                        dao_ListBox_Temp_MRC.Take_TreeMRCInfo();

                        //读取不到的动画，需要往后增加读取不到的行数，防止动画不对应
                        int count = 0;
                        count = dao_ListBox_Temp_MRC.Return_ListBox_Temp_MRC_Bing(CRC_URL).Length - dao_ListBox_Temp_MRC.MRC_Line_Info.Length - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums * 2;
                        dao_ListBox_Temp_MRC.LRC_Text_Null_Nums += count;
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show("Error：生成树状结构(优化)\n" + ex.Message);
                    }

                    

                    //传递歌词数组，将listview的数据源绑定至 分析完成的在Dao_ListBox_Temp_MRC内存储的歌词数组信息
                    musicPlayer_Main_UserControl.ListView_Temp_MRC.ItemsSource = dao_ListBox_Temp_MRC.Return_ListBox_Temp_MRC_Bing(CRC_URL);
                    musicPlayer_Main_UserControl.ListView_Temp_MRC_Temp.ItemsSource = dao_ListBox_Temp_MRC.Return_ListBox_Temp_MRC_Bing(null);
                    
                    //获取当前歌词文件文本的   歌词内容数组和歌词时间数组
                    //获取分析完成的在 Dao_ListBox_Temp_MRC 内存储的 歌词文件文本歌词内容Text的集合
                    ListBox_MRC_Song_MRC_Text = dao_ListBox_Temp_MRC.Return_ListBox_Temp_MRC_Text();
                    //获取分析完成的在 Dao_ListBox_Temp_MRC 内存储的 歌词文件文本歌词内容Time的集合
                    ListBox_MRC_Song_MRC_Time = dao_ListBox_Temp_MRC.Return_ListBox_Temp_MRC_Time();

                    //生成歌曲第一句和最后一句的时间
                    //获取分析完成的在 Dao_ListBox_Temp_MRC 内存储的 歌曲第一句的时间（毫秒）
                    Start_Song_MRC_Time = dao_ListBox_Temp_MRC.Return_Start_Song_MRC_Time();
                    //获取分析完成的在 Dao_ListBox_Temp_MRC 内存储的 歌曲最后一句的时间（毫秒）
                    End_Song_MRC_Time = dao_ListBox_Temp_MRC.Return_End_Song_MRC_Time();

                    //歌词滚动
                    if (ListBox_MRC_Song_MRC_Time != null)
                    {
                        musicPlayer_Main_UserControl.ListView_Temp_MRC.ScrollIntoView(musicPlayer_Main_UserControl.ListView_Temp_MRC.Items[0]);//先滚动至第一行歌词              
                        //ListView_MRC.ScrollIntoView(ListView_MRC.Items[0]);//先滚动至第一行歌词             
                    }

                    //开启定时器，歌词同步           
                    thread_DispatcherTimer_MRC = new Thread(new ThreadStart(() =>
                    {
                        Dispatcher.BeginInvoke(new Action(delegate ()
                        {
                            DispatcherTimer_MRC.Start();
                        }));
                    }));
                    thread_DispatcherTimer_MRC.Start();
                }
                else
                {
                    //获取mrc歌词失败，转而获取Lrc歌词

                    //停止歌词同步
                    thread_DispatcherTimer_MRC = new Thread(new ThreadStart(() =>
                    {
                        Dispatcher.BeginInvoke(new Action(delegate ()
                        {
                            DispatcherTimer_MRC.Stop();
                        }));
                    }));
                    thread_DispatcherTimer_MRC.Start();

                    //ListView_MRC.ItemsSource = null;
                    musicPlayer_Main_UserControl.ListView_Temp_MRC.ItemsSource = null;
                    musicPlayer_Main_UserControl.ListView_Temp_MRC_Temp.ItemsSource = null;
                        
                    ListBox_MRC_Song_MRC_Text = null;
                    ListBox_MRC_Song_MRC_Time = null;
                    Start_Song_MRC_Time = 0;
                    End_Song_MRC_Time = 0;                 
                }
            }
            catch
            {
                //获取mrc歌词失败，转而获取Lrc歌词

                //停止歌词同步
                thread_DispatcherTimer_MRC = new Thread(new ThreadStart(() =>
                {
                    Dispatcher.BeginInvoke(new Action(delegate ()
                    {
                        DispatcherTimer_MRC.Stop();
                    }));
                }));
                thread_DispatcherTimer_MRC.Start();
                //Bool_Timer_MRC = false;

                //ListView_MRC.ItemsSource = null;
                musicPlayer_Main_UserControl.ListView_Temp_MRC.ItemsSource = null;
                musicPlayer_Main_UserControl.ListView_Temp_MRC_Temp.ItemsSource = null;
                
                ListBox_MRC_Song_MRC_Text = null;
                ListBox_MRC_Song_MRC_Time = null;
                Start_Song_MRC_Time = 0;
                End_Song_MRC_Time = 0;
                
            }
        }



        #endregion

        Window_Hover_MRC_Panel window_Hover_MRC_Panel = new Window_Hover_MRC_Panel();
        #region 歌词行同步动画
        DispatcherTimer DispatcherTimer_MRC;
        TimeSpan MRC_Span;
        int MRC_Line_Nums = 1;

        ListBoxItem myListBoxItem;
        ContentPresenter myContentPresenter;
        DataTemplate myDataTemplate;
        Storyboard myTextBlock_Storyboard;
        DoubleAnimationUsingKeyFrames myTextBlock_DoubleAnimationUsingKeyFrames;
        LinearDoubleKeyFrame linearDoubleKeyFrame;
        TextBlock myTextBlock_TextBlock;
        DoubleAnimationUsingKeyFrames window_Hover_MRC_PanelmyTextBlock_DoubleAnimationUsingKeyFrames;

        Thread thread_ListView_Temp_MRC_ScrollIntoView;
        Thread thread_myTextBlock_Storyboard;
        Thread thread_window_Hover_MRC_Panel_Text_Storyboard_slider_UpDown;
        Thread thread_DispatcherTimer_MRC;
        Thread thread_timer_Singer_Photo_One;
        Thread thread_timer_Singer_Photo_One_Lot;
        /// <summary>
        /// 当musicPlayer_Main_UserControl.ListView_Temp_MRC选中项发送改变时
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void ListView_Temp_MRC_ScrollIntoView(object sender, EventArgs e)
        {
            if (DispatcherTimer_MRC.IsEnabled)
            {
                if (musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex != -1 && musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex < musicPlayer_Main_UserControl.ListView_Temp_MRC.Items.Count)
                {
                    thread_ListView_Temp_MRC_ScrollIntoView = new Thread(new ThreadStart(() => {
                        Dispatcher.BeginInvoke(new Action(delegate () {
                            musicPlayer_Main_UserControl.ListView_Temp_MRC.ScrollIntoView(musicPlayer_Main_UserControl.ListView_Temp_MRC.Items[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex + MRC_Line_Nums]);//移动到指定行                   
                        }));
                    }));
                    thread_ListView_Temp_MRC_ScrollIntoView.Priority = ThreadPriority.Lowest;
                    thread_ListView_Temp_MRC_ScrollIntoView.Start();

                    //生成歌词提词同步动画
                    if (ListBox_MRC_Song_MRC_Time[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex] != 0)
                    {
                        try
                        {
                            int temp = dao_ListBox_Temp_MRC.MRC_Line_Info[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums].This_MRC_Duration;
                            //int temp = (int)(ListBox_MRC_Song_MRC_Time[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex + 1] - ListBox_MRC_Song_MRC_Time[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex]);


                            if (myTextBlock_Storyboard != null)
                                myTextBlock_Storyboard.Remove();//清空渐变过的歌词行颜色
                            myListBoxItem =
                                (ListBoxItem)(musicPlayer_Main_UserControl.ListView_Temp_MRC.ItemContainerGenerator.ContainerFromIndex(musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex));
                            if (myListBoxItem != null)
                            {
                                //查找并获取ListView选中项中的对象
                                myContentPresenter = FindVisualChild<ContentPresenter>(myListBoxItem);
                                myDataTemplate = myContentPresenter.ContentTemplate;
                                myTextBlock_Storyboard = (Storyboard)myDataTemplate.FindName("Text_Storyboard", myContentPresenter);
                                myTextBlock_TextBlock = (TextBlock)myDataTemplate.FindName("Text_TextBlock", myContentPresenter);
                                myTextBlock_DoubleAnimationUsingKeyFrames = (DoubleAnimationUsingKeyFrames)myDataTemplate.FindName("Text_DoubleAnimationUsingKeyFrames", myContentPresenter);
                                myTextBlock_DoubleAnimationUsingKeyFrames.Duration = new Duration(new TimeSpan(0, 0, 0, 0, temp));

                                //初始动画位置，-0.5为左边的原点，长度为1
                                double X = -0.5;

                                //每个字符的物理长度
                                ArrayList Values_temp = new ArrayList();
                                //每个字符相加_>的总长度
                                double Sum_Values_temp = 0;
                                for (int i = 0; i < dao_ListBox_Temp_MRC.MRC_Line_Info[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                    .Int_MoreByte_Nums; i++)
                                {
                                    double temp_double = Convert.ToDouble(MeasureString(dao_ListBox_Temp_MRC.MRC_Line_Info[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                    .Array_Morebyte_Text[i].ToString()));
                                    Sum_Values_temp += temp_double;//每个字符相加_>的总长度
                                    Values_temp.Add(temp_double);//每个字符的物理长度
                                }

                                //状态，是否停顿
                                bool null_time = false;
                                //获取歌词字符统一间距的比率
                                double ALL_Byte_Width = Math.Round(Convert.ToDouble(1.0 / Sum_Values_temp),6);
                                //获取每个字符同步时动画所移动的距离
                                ArrayList ALL_Byte_Values = new ArrayList();
                                for (int i = 0; i < dao_ListBox_Temp_MRC.MRC_Line_Info[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                    .Int_MoreByte_Nums; i++)
                                {
                                    int temp_BeginTime = Convert.ToInt16(
                                        dao_ListBox_Temp_MRC.MRC_Line_Info
                                            [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                    .Array_Morebyte_BeginTime[i]);//此字符开始时间
                                    int temp_Duration = Convert.ToInt16(
                                        dao_ListBox_Temp_MRC.MRC_Line_Info
                                            [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                    .Array_Morebyte_Duration[i]);//此字符持续时间

                                    if (null_time == true)
                                    {
                                        ALL_Byte_Values.Add(0);
                                        null_time = false;
                                    }

                                    //判别动画是否有停顿
                                    if (i != dao_ListBox_Temp_MRC.MRC_Line_Info
                                        [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                            - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                .Int_MoreByte_Nums - 1//if  i != Array_Morebyte_BeginTime的最后一位（防止数组越界）
                                        &&
                                        temp_BeginTime + temp_Duration !=  //if  此动画的开始时间+持续时间 != 下一段动画的开始时间
                                        Convert.ToInt16(dao_ListBox_Temp_MRC.MRC_Line_Info
                                            [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                    .Array_Morebyte_BeginTime[i + 1]))//if 动画时间 中间有 空白时间（动画停顿）
                                    {
                                        null_time = true;
                                    }

                                    //将字符相加_>的总长度缩小为1
                                    //同时各字符的长度 按相对应的比率 缩小，使之相加为1
                                    //得到了每个字符同步时动画所移动的距离
                                    ALL_Byte_Values.Add(Convert.ToDouble(Values_temp[i]) * ALL_Byte_Width);
                                }

                                //                        
                                ArrayList timeSpan_nums = new ArrayList();
                              
                                int temp_null_time = 0;
                                for (int i = 0; 
                                    i < dao_ListBox_Temp_MRC.MRC_Line_Info
                                        [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex 
                                            - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                .Int_MoreByte_Nums; //歌词字符总数
                                    i++)
                                {
                                    int temp_BeginTime = Convert.ToInt16(
                                        dao_ListBox_Temp_MRC.MRC_Line_Info
                                            [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex 
                                                - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                    .Array_Morebyte_BeginTime[i]);//此字符开始时间
                                    int temp_Duration = Convert.ToInt16(
                                        dao_ListBox_Temp_MRC.MRC_Line_Info
                                            [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex 
                                                - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                    .Array_Morebyte_Duration[i]);//此字符持续时间                     

                                    if (null_time == true)
                                    {
                                        timeSpan_nums.Add(":" + temp_null_time);// : 作为动画停顿标记
                                        null_time = false;
                                    }                
                                    //判别动画是否有停顿
                                    if (i != dao_ListBox_Temp_MRC.MRC_Line_Info
                                        [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                            - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                .Int_MoreByte_Nums - 1//if  i != Array_Morebyte_BeginTime的最后一位（防止数组越界）
                                        && 
                                        temp_BeginTime + temp_Duration != //if  此动画的开始时间+持续时间 != 下一段动画的开始时间
                                        Convert.ToInt16(dao_ListBox_Temp_MRC.MRC_Line_Info
                                            [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                    .Array_Morebyte_BeginTime[i+1]))//if 动画时间 中间有 空白时间（动画停顿）
                                    {
                                        temp_null_time = //求出此停顿动画的序列时间，并插入至动画序列timeSpan_nums
                                            Convert.ToInt16(
                                                dao_ListBox_Temp_MRC.MRC_Line_Info
                                                    [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                        - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                    .Array_Morebyte_BeginTime[i + 1]
                                                    )
                                             - 
                                            (temp_BeginTime + temp_Duration);//动画停顿的时间

                                        null_time = true;
                                    }

                                    timeSpan_nums.Add(temp_BeginTime + temp_Duration);//求字符总动画时间->毫秒数字
                                }
                                ArrayList temp_nums = new ArrayList();//字符动画，timeSpan的Duration秒数
                                ArrayList line_nums = new ArrayList();//字符动画，timeSpan的Duration毫秒数
                                for (int i = 0; i < timeSpan_nums.Count; i++)
                                {
                                    try
                                    {
                                        if (timeSpan_nums[i].ToString().IndexOf(":") < 0)
                                        {
                                            int temp_seconds = Convert.ToInt16(timeSpan_nums[i]) / 1000;
                                            int temp_milliseconds = Convert.ToInt16(timeSpan_nums[i].ToString()
                                                .Substring(timeSpan_nums[i].ToString().Trim().Length - 3, 3));
                                            line_nums.Add(temp_seconds);//求动画秒数
                                            temp_nums.Add(temp_milliseconds);//求动画毫秒数
                                        }
                                        else//此动画需要停顿
                                        {
                                            //i+1；将停顿动画时间 设置为下一个下标的 Begion时间
                                            int temp_seconds = Convert.ToInt16(timeSpan_nums[i + 1]) / 1000;
                                            int temp_milliseconds = Convert.ToInt16(timeSpan_nums[i + 1].ToString()
                                                .Substring(timeSpan_nums[i + 1].ToString().Trim().Length - 3, 3));
                                            line_nums.Add(temp_seconds);//求动画秒数
                                            temp_nums.Add(temp_milliseconds);//求动画毫秒数
                                        }
                                    }
                                    catch { }
                                }

                                myTextBlock_DoubleAnimationUsingKeyFrames.KeyFrames.Clear();
                                for (int i = 0; i < timeSpan_nums.Count; i++)
                                {
                                    linearDoubleKeyFrame = new LinearDoubleKeyFrame();

                                    if (timeSpan_nums[i].ToString().IndexOf(":") < 0)
                                    {
                                        //设置动画的X轴距离
                                        X += Convert.ToDouble(ALL_Byte_Values[i].ToString());//固定的区间内，动画该持续的时间
                                        //科学计数法转换，防止出现科学计数法
                                        X = Convert.ToDouble(ChangeToDecimal(X.ToString()));

                                        if (i != dao_ListBox_Temp_MRC.MRC_Line_Info[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums].Int_MoreByte_Nums - 1)
                                            linearDoubleKeyFrame.Value = X;
                                        else
                                            linearDoubleKeyFrame.Value = 0.5;
                                        //设置动画完成所需的时间
                                        linearDoubleKeyFrame.KeyTime = new TimeSpan(0, 0, 0,
                                            Convert.ToInt16(line_nums[i]), Convert.ToInt16(temp_nums[i]));
                                    }
                                    else//此动画需要停顿
                                    {
                                        linearDoubleKeyFrame.Value = X;
                                        //设置动画完成所需的时间
                                        linearDoubleKeyFrame.KeyTime = new TimeSpan(0, 0, 0,
                                            Convert.ToInt16(line_nums[i]), Convert.ToInt16(temp_nums[i]));
                                    }
                                    //添加至DoubleAnimationUsingKeyFrames
                                    myTextBlock_DoubleAnimationUsingKeyFrames.KeyFrames.Add(linearDoubleKeyFrame);
                                }

                                //开启动画                              
                                thread_myTextBlock_Storyboard = new Thread(new ThreadStart(() =>{
                                    Dispatcher.BeginInvoke(new Action(delegate (){
                                        myTextBlock_Storyboard.Begin();
                                    }));
                                }));
                                thread_myTextBlock_Storyboard.Priority = ThreadPriority.Highest;
                                thread_myTextBlock_Storyboard.Start();
                            }



                            //保持同步
                            window_Hover_MRC_Panel.Text_DoubleAnimation.Duration = new Duration(new TimeSpan(0, 0, 0, 0, temp));
                            //动画进度设置为0
                            linearDoubleKeyFrame = new LinearDoubleKeyFrame();
                            linearDoubleKeyFrame.Value = -0.5;
                            linearDoubleKeyFrame.KeyTime = new TimeSpan(0, 0, 0, 0, 0);
                            myTextBlock_DoubleAnimationUsingKeyFrames.KeyFrames.Add(linearDoubleKeyFrame);
                            window_Hover_MRC_Panel.Text_DoubleAnimation.KeyFrames = myTextBlock_DoubleAnimationUsingKeyFrames.KeyFrames;
                            window_Hover_MRC_Panel.Text_Storyboard.Begin();



                            try
                            {
                                temp = (int)(ListBox_MRC_Song_MRC_Time[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex + 1] - ListBox_MRC_Song_MRC_Time[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex]);
                                if (temp < 0)
                                    temp = (int)(MediaElement_Song.NaturalDuration.TimeSpan.TotalMilliseconds - ListBox_MRC_Song_MRC_Time[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex]);
                                //生成歌词同步进度Silder动画
                                window_Hover_MRC_Panel.Text_DoubleAnimation_slider_Up.Duration = new Duration(new TimeSpan(0, 0, 0, 0, temp));
                                window_Hover_MRC_Panel.Text_DoubleAnimation_slider_Down.Duration = new Duration(new TimeSpan(0, 0, 0, 0, temp));
                                thread_window_Hover_MRC_Panel_Text_Storyboard_slider_UpDown = new Thread(new ThreadStart(() => {
                                    Dispatcher.BeginInvoke(new Action(delegate () {                                                                              
                                        window_Hover_MRC_Panel.Text_Storyboard_slider_Up.Begin();                                             
                                        window_Hover_MRC_Panel.Text_Storyboard_slider_Down.Begin();
                                    }));
                                }));
                                thread_window_Hover_MRC_Panel_Text_Storyboard_slider_UpDown.Priority = ThreadPriority.Highest;
                                thread_window_Hover_MRC_Panel_Text_Storyboard_slider_UpDown.Start();
                            }
                            catch { }
                        }
                        catch { }
                    }
                }
            }
        }
        /// <summary>
        /// 查找元素
        /// </summary>
        /// <typeparam name="childItem"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        private childItem FindVisualChild<childItem>(DependencyObject obj)
            where childItem : DependencyObject
        {
            for (int i = 0; i < VisualTreeHelper.GetChildrenCount(obj); i++)
            {
                DependencyObject child = VisualTreeHelper.GetChild(obj, i);
                if (child != null && child is childItem)
                {
                    return (childItem)child;
                }
                else
                {
                    childItem childOfChild = FindVisualChild<childItem>(child);
                    if (childOfChild != null)
                        return childOfChild;
                }
            }
            return null;       
        }
        /// <summary>
        /// 获取字符宽度width
        /// </summary>
        TextBlock textBlock_Mrc_Byte_Width = new TextBlock();
        private double MeasureString(string candidate)
        {
            var formattedText = new FormattedText(
                candidate,
                CultureInfo.CurrentCulture,
                FlowDirection.LeftToRight,
                new Typeface(this.textBlock_Mrc_Byte_Width.FontFamily, 
                this.textBlock_Mrc_Byte_Width.FontStyle, 
                this.textBlock_Mrc_Byte_Width.FontWeight, 
                this.textBlock_Mrc_Byte_Width.FontStretch),
                this.textBlock_Mrc_Byte_Width.FontSize,
                Brushes.Black,
                new NumberSubstitution(),
                1);
            Size size = new Size(formattedText.Width, formattedText.Height);
            return size.Width;
        }
        /// <summary>
        /// 数字科学计数法处理
        /// </summary>
        /// <param name="strData"></param>
        /// <returns></returns>
        private Decimal ChangeToDecimal(string strData)
        {
            Decimal dData = 0.0M;
            if (strData.Contains("E"))
            {
                dData = Convert.ToDecimal(Decimal.Parse(strData.ToString(), System.Globalization.NumberStyles.Float));
            }
            else
            {
                dData = Convert.ToDecimal(strData);
            }
            return Math.Round(dData, 7);
        }

        

        void textbox_PreviewTextInput(object sender, TextCompositionEventArgs e)
        {
            TextBox box = (TextBox)sender;
            e.Handled = box.Text.Length > 5;
        }

        #endregion

        #region 歌词行同步

        public void Media_Song_MRC_Play_Tick(object sender, EventArgs e)
        {
            //使用双区间来判定同步当前音频文件时间信息所处歌词时间信息的位置
            //0有时访问不到
            if (ListBox_MRC_Song_MRC_Time != null)
            {
                if (MediaElement_Song.Position.TotalMilliseconds <= Start_Song_MRC_Time)
                {
                    for (int i = 0; i < ListBox_MRC_Song_MRC_Time.Length; i++)
                    {
                        if (ListBox_MRC_Song_MRC_Time[i] != 0)
                        {
                            if(musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex != i)
                            {
                                musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex = i;                                
                            }

                            if (window_Hover_MRC_Panel.Bool_Open_MRC_Panel)
                            {
                                window_Hover_MRC_Panel.TextBlock_1.Text = ListBox_MRC_Song_MRC_Text[i];
                                window_Hover_MRC_Panel.TextBlock_2.Text = ListBox_MRC_Song_MRC_Text[i + 1];
                            }
                            

                            break;
                        }
                    }
                }
                else if (MediaElement_Song.Position.TotalMilliseconds >= End_Song_MRC_Time)
                {
                    for (int i = ListBox_MRC_Song_MRC_Time.Length - 1; i >= 0; i--)
                    {
                        if (ListBox_MRC_Song_MRC_Time[i] != 0)
                        {
                            if (musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex != i)
                            {
                                musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex = i;                               
                            }

                            if (window_Hover_MRC_Panel.Bool_Open_MRC_Panel)
                            {
                                window_Hover_MRC_Panel.TextBlock_1.Text = ListBox_MRC_Song_MRC_Text[i];
                                window_Hover_MRC_Panel.TextBlock_2.Text = ListBox_MRC_Song_MRC_Text[i + 1];
                            }

                            break;
                        }
                    }
                }
                else
                {
                    for (int i = 7; i < ListBox_MRC_Song_MRC_Time.Length; i++)
                    {
                        if (ListBox_MRC_Song_MRC_Time[i] != 0)
                        {
                            if (MediaElement_Song.Position.TotalMilliseconds >= ListBox_MRC_Song_MRC_Time[i])
                            {
                                if (MediaElement_Song.Position.TotalMilliseconds < ListBox_MRC_Song_MRC_Time[i + 1])
                                {
                                    if (musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex != i)
                                    {
                                        musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex = i;                              
                                    }

                                    if (window_Hover_MRC_Panel.Bool_Open_MRC_Panel)
                                    {
                                        window_Hover_MRC_Panel.TextBlock_1.Text = ListBox_MRC_Song_MRC_Text[i];
                                        window_Hover_MRC_Panel.TextBlock_2.Text = ListBox_MRC_Song_MRC_Text[i + 1];
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            else
            {
                thread_DispatcherTimer_MRC = new Thread(new ThreadStart(() =>
                {
                    Dispatcher.BeginInvoke(new Action(delegate ()
                    {
                        DispatcherTimer_MRC.Stop();
                    }));
                }));
                thread_DispatcherTimer_MRC.Start();
            }
        }

        /// <summary>
        /// 当ListView_Temp_MRC   鼠标滚轮
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void ListView_Temp_MRC_MouseWheel(object sender, EventArgs e)
        {
            if (musicPlayer_Main_UserControl.ListView_Temp_MRC.Visibility == Visibility.Visible)
            {
                if (musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex != -1)
                {
                    musicPlayer_Main_UserControl.ListView_Temp_MRC_Temp.SelectedIndex = musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex;
                    musicPlayer_Main_UserControl.ListView_Temp_MRC_Temp.ScrollIntoView(musicPlayer_Main_UserControl.ListView_Temp_MRC_Temp.Items[musicPlayer_Main_UserControl.ListView_Temp_MRC_Temp.SelectedIndex + MRC_Line_Nums]);//移动到指定行   

                    musicPlayer_Main_UserControl.ListView_Temp_MRC_Temp.Visibility = Visibility.Visible;
                    musicPlayer_Main_UserControl.ListView_Temp_MRC.Visibility = Visibility.Hidden;
                }
            }

        }
        /// <summary>
        /// 当ListView_Temp_MRC   鼠标移出
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void ListView_Temp_MRC_MouseLeave(object sender, EventArgs e)
        {
            Show_Media_Siler();

            if(musicPlayer_Main_UserControl.ListView_Temp_MRC.Items.Count > 0)
                if(musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex >= 0)
                    musicPlayer_Main_UserControl.ListView_Temp_MRC.ScrollIntoView(musicPlayer_Main_UserControl.ListView_Temp_MRC.Items[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex + MRC_Line_Nums]);//先滚动至第一行歌词

        }
        /// <summary>
        /// 开启歌曲进度同步滑块
        /// </summary>
        public void Show_Media_Siler()
        {
            //ListView_MRC.Visibility = Visibility.Visible;
            musicPlayer_Main_UserControl.ListView_Temp_MRC.Visibility = Visibility.Visible;
            musicPlayer_Main_UserControl.ListView_Temp_MRC_Temp.Visibility = Visibility.Hidden;
        }

        /// <summary>
        /// 根据歌词跳转歌曲进度
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ListView_Temp_MRC_Temp_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            //歌词滚动
            if (ListBox_MRC_Song_MRC_Time != null)
            {
                int line_num = musicPlayer_Main_UserControl.ListView_Temp_MRC_Temp.SelectedIndex;

                if (ListBox_MRC_Song_MRC_Time[line_num] != 0)
                {
                    //如果选中的  跳转的播放进度  在  当前播放进度  之前
                    if (line_num < musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex)
                    {
                        musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex = 0;
                        musicPlayer_Main_UserControl.ListView_Temp_MRC.ScrollIntoView(musicPlayer_Main_UserControl.ListView_Temp_MRC.Items[0]);//先滚动至第一行歌词                     
                    }
                    //歌词时间匹配方法  会自动跳转至指定选中歌词行

                    //跳转至指定Value的进度
                    //ts_Song = new TimeSpan(0, 0, 0, 0, Convert.ToInt32(ListBox_MRC_Song_MRC_Time[line_num]));
                    MediaElement_Song.Position = new TimeSpan(0, 0, 0, 0, Convert.ToInt32(ListBox_MRC_Song_MRC_Time[line_num]));
                 
                    //关闭歌词选择进度面板
                    Show_Media_Siler();
                }
            }
        }

        #endregion

        #region 专辑切换
        string Song_Image_Url;
        /*ShellClass Shell32_Class = new ShellClass();//调用Shell32.dll  ,   查找mp3文件信息
        Folder Folderdir;
        FolderItem FolderItemitem;*/
        BitmapImage Image_墨智音乐;
        /// <summary>
        /// 切换歌曲专辑图片
        /// </summary>
        public void Change_Image_Song()
        {
            //如果读取到专辑名
            if (Song_Image_Name.Length > 0) //专辑模式
            {
                //生成专辑名所在路径
                Song_Image_Url = Path_App + @"\Song_ALbum\" + Song_Image_Name + @".jpg";
                //如果专辑文件存在
                if (File.Exists(Song_Image_Url))
                {
                    musicPlayer_Main_UserControl.Image_Song.Source = new BitmapImage(new Uri(Song_Image_Url));
                    musicPlayer_Main_UserControl.Image_Song.Stretch = Stretch.UniformToFill;
                    musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                    musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush.Stretch = Stretch.UniformToFill;
                    musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.Background = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush;

                    userControl_ButtonFrame_MusicPlayer.Border_Song_Image.Background = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                }
                //如果专辑文件不存在
                else
                {
                    //如果当前歌曲名不为空
                    if (Song_Name != null)
                    {
                        //专辑名为歌曲名
                        Song_Image_Name = Song_Name;

                        //生成专辑名所在路径
                        Song_Image_Url = Path_App + @"\Song_ALbum\" + Song_Image_Name + @".jpg";
                        //如果歌曲图片文件存在
                        if (File.Exists(Song_Image_Url))
                        {
                            musicPlayer_Main_UserControl.Image_Song.Source = new BitmapImage(new Uri(Song_Image_Url));
                            musicPlayer_Main_UserControl.Image_Song.Stretch = Stretch.UniformToFill;
                            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush.Stretch = Stretch.UniformToFill;
                            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.Background = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush;
                            //Panel_Image.Background = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                            userControl_ButtonFrame_MusicPlayer.Border_Song_Image.Background = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                        }
                        //默认图片
                        else
                        {
                            //获取歌手名
                            string Singer_Image_Name = Singer_Name.Trim();
                            //生成专辑名所在路径
                            Song_Image_Url = Path_App + @"\Song_ALbum\" + Singer_Image_Name + @".jpg";
                            //如果歌曲图片存在
                            if (File.Exists(Song_Image_Url))
                            {
                                musicPlayer_Main_UserControl.Image_Song.Source = new BitmapImage(new Uri(Song_Image_Url));
                                musicPlayer_Main_UserControl.Image_Song.Stretch = Stretch.UniformToFill;
                                musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                                musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush.Stretch = Stretch.UniformToFill;
                                musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.Background = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush;
                                //Panel_Image.Background = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                                userControl_ButtonFrame_MusicPlayer.Border_Song_Image.Background = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                            }
                            else
                            {
                                musicPlayer_Main_UserControl.Image_Song.Source = Image_墨智音乐;
                                musicPlayer_Main_UserControl.Image_Song.Stretch = Stretch.UniformToFill;
                                musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush = new ImageBrush(Image_墨智音乐);
                                musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush.Stretch = Stretch.UniformToFill;
                                musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.Background = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush;
                                //Panel_Image.Background = new ImageBrush(Image_唱片4);
                                userControl_ButtonFrame_MusicPlayer.Border_Song_Image.Background = new ImageBrush(Image_墨智音乐);
                            }
                        }
                    }
                }
            }
            //未读取到专辑名
            else
            {
                //不显示专辑名
                musicPlayer_Main_UserControl.TextBox_SongAlbumName.Text = "专辑 :  ";
                musicPlayer_Main_UserControl.TextBox_SongAlbumName.TextAlignment = TextAlignment.Center;

                //如果当前歌曲名不为空
                if (Song_Name != null)
                {
                    string Song_Name_Temp = Song_Name;
                    int Song_Name_Temp_Last_Num = Song_Name_Temp.LastIndexOf("-");
                    if (Song_Name_Temp_Last_Num > 0)
                    {
                        Song_Name_Temp.Substring(Song_Name_Temp_Last_Num + 1).Trim();
                    }

                    //专辑名为歌曲名
                    Song_Image_Name = Song_Name_Temp.Substring(Song_Name_Temp_Last_Num + 1).Trim();


                    //生成专辑名所在路径
                    Song_Image_Url = Path_App + @"\Song_ALbum\" + Song_Image_Name + @".jpg";
                    //如果歌曲图片存在
                    if (File.Exists(Song_Image_Url))
                    {
                        musicPlayer_Main_UserControl.Image_Song.Source = new BitmapImage(new Uri(Song_Image_Url));
                        musicPlayer_Main_UserControl.Image_Song.Stretch = Stretch.UniformToFill;
                        musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                        musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush.Stretch = Stretch.UniformToFill;
                        musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.Background = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush;
                        //Panel_Image.Background = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                        userControl_ButtonFrame_MusicPlayer.Border_Song_Image.Background = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                    }
                    //默认图片
                    else
                    {
                        //获取歌手名
                        string Singer_Image_Name = Singer_Name.Trim();
                        //生成专辑名所在路径
                        Song_Image_Url = Path_App + @"\Song_ALbum\" + Singer_Image_Name + @".jpg";
                        //如果歌曲图片存在
                        if (File.Exists(Song_Image_Url))
                        {
                            musicPlayer_Main_UserControl.Image_Song.Source = new BitmapImage(new Uri(Song_Image_Url));
                            musicPlayer_Main_UserControl.Image_Song.Stretch = Stretch.UniformToFill;
                            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush.Stretch = Stretch.UniformToFill;
                            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.Background = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush;
                            //Panel_Image.Background = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                            userControl_ButtonFrame_MusicPlayer.Border_Song_Image.Background = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                        }
                        else
                        {
                            musicPlayer_Main_UserControl.Image_Song.Source = Image_墨智音乐;
                            musicPlayer_Main_UserControl.Image_Song.Stretch = Stretch.UniformToFill;
                            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush = new ImageBrush(Image_墨智音乐);
                            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush.Stretch = Stretch.UniformToFill;
                            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.Background = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush;
                            //Panel_Image.Background = new ImageBrush(Image_唱片4);
                            userControl_ButtonFrame_MusicPlayer.Border_Song_Image.Background = new ImageBrush(Image_墨智音乐);
                        }
                    }

                }
            }
        }

        #endregion

        #region   切换歌手图片背景

        public bool Bool_Button_Back_Click = true;
        public bool Bool_Timer_Singer_Photo_1;
        public bool Bool_Timer_Singer_Photo_1_lot;
        public bool Bool_Timer_Image_Trans;

        string Singer_Image_Url;
        string Singer_Name_Temp = "未知歌手";//记录当前歌手名
        int Singer_Name_Temp_Nums;//记录当前歌手图片动画状态

        public void Change_Image_Singer_FrmMain_OnePhoto()
        {
            //如果歌手名不为空
            if (Singer_Name != null)
            {
                //如果当前播放的歌曲信息不为空
                if (Singer_Name != null)
                {      
                    //获取歌手名
                    string Singer_Image_Name = Singer_Name.Trim();
                    //生成歌手图片所在路径
                    Singer_Image_Url = Path_App + @"\Singer_Image\" + singer_photo[0] + @"\" + Singer_Image_Name + @".jpg";
                    //如果歌手图片存在
                    if (File.Exists(Singer_Image_Url))
                    {
                        ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                        test.Stretch = Stretch.UniformToFill;
                        musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;
                        BgSwitch(Singer_Image_Url);  
                    }
                    else
                    {
                        //多歌手
                        if (Singer_Image_Name.IndexOf("、") > 0)
                        {
                            Singer_Image_Name = Singer_Image_Name.Substring(0, Singer_Image_Name.IndexOf("、"));

                            Singer_Image_Url = Path_App + @"\Singer_Image\" + singer_photo[0] + @"\" + Singer_Image_Name + @".jpg";
                            //如果歌手图片存在
                            if (File.Exists(Singer_Image_Url))
                            {
                                ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                                test.Stretch = Stretch.UniformToFill;
                                musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;
                                BgSwitch(Singer_Image_Url);
                            }
                            else
                            {
                                Singer_Image_Url = Path_App + @"\Singer_Image\歌手图片1\巨浪.jpg";
                                ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                                test.Stretch = Stretch.UniformToFill;
                                musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;
                                BgSwitch(Singer_Image_Url);
                            }
                        }
                        else
                        {
                            Singer_Image_Url = Path_App + @"\Singer_Image\歌手图片1\巨浪.jpg";
                            ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                            test.Stretch = Stretch.UniformToFill;
                            musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;
                            BgSwitch(Singer_Image_Url);
                        }
                    }

                    if (Bool_Windows_Wallpaper == true)
                        Change_Windows_Background();//切换桌面写真
                }
            }
        }

        /// <summary>
        /// 切换歌手背景图片
        /// </summary>
        public void Change_Image_Singer()
        {
            //如果歌手名不为空
            if (Singer_Name != null)
            {
                //如果当前歌手不是上一位歌手
                if (Singer_Name_Temp != Singer_Name.Trim())
                {
                    //关闭多歌手模式
                    thread_timer_Singer_Photo_One = new Thread(new ThreadStart(() =>
                    {
                        Dispatcher.BeginInvoke(new Action(delegate ()
                        {
                            timer_Singer_Photo_One.Stop();
                            timer_Singer_Photo_One_Lot.Stop();
                        }));
                    }));
                    thread_timer_Singer_Photo_One.Start();

                    //如果当前播放的歌曲信息不为空
                    if (Singer_Name != null)
                    {
                        //获取歌手名
                        string Singer_Image_Name = Singer_Name.Trim();
                        //生成歌手图片所在路径
                        Singer_Image_Url = Path_App + @"\Singer_Image\" + singer_photo[0] + @"\" + Singer_Image_Name + @".jpg";
                        //如果歌手图片存在
                        if (File.Exists(Singer_Image_Url))
                        {
                            Create_Arraylist_Singer_Photo(Take_Singer_Nums(Singer_Image_Name));
                            Singer_Name_Temp = Singer_Image_Name;
                        }
                        //默认图片
                        else
                        {
                            //多歌手
                            if (Singer_Image_Name.IndexOf("、") > 0)
                            {
                                Create_Arraylist_Singer_Photo(Take_Singer_Nums(Singer_Image_Name));
                                Singer_Name_Temp = Singer_Image_Name;
                            }
                            else
                            {
                                Singer_Image_Url = Path_App + @"\Singer_Image\歌手图片1\巨浪.jpg";
                                ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                                test.Stretch = Stretch.UniformToFill;
                                musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;
                                BgSwitch(Singer_Image_Url);

                                //清空歌手图片轮播信息
                                //周杰伦、梁心颐、杨瑞代
                                temp = null;
                                //每个歌手的照片数
                                Singer_Photo_Nums = null;
                                //多图歌手序号
                                singer_photo_nums_More = null;
                                List_Singer_Names = null;

                                Singer_Name_Temp = "未知歌手";
                                Singer_Name_Temp_Nums = 0;

                                if (Bool_Windows_Wallpaper == true)
                                {
                                    Change_Windows_Background();//切换桌面写真
                                }
                            }
                        }
                    }
                    //播放的歌曲信息为空
                    //默认图片
                    else
                    {
                        Singer_Image_Url = Path_App + @"\Singer_Image\歌手图片1\巨浪.jpg";

                        ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                        test.Stretch = Stretch.UniformToFill;
                        musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;
                        BgSwitch(Singer_Image_Url);

                        //清空歌手图片轮播信息
                        //周杰伦、梁心颐、杨瑞代
                        temp = null;
                        //每个歌手的照片数
                        Singer_Photo_Nums = null;
                        //多图歌手序号
                        singer_photo_nums_More = null;
                        List_Singer_Names = null;

                        Singer_Name_Temp = "未知歌手";
                        Singer_Name_Temp_Nums = 0;

                        if (Bool_Windows_Wallpaper == true)
                        {
                            Change_Windows_Background();//切换桌面写真
                        }
                    }
                }
                else
                {
                    if (Singer_Name_Temp_Nums == 1)
                    {
                        //MessageBox.Show("1");
                        thread_timer_Singer_Photo_One = new Thread(new ThreadStart(() =>
                        {
                            Dispatcher.BeginInvoke(new Action(delegate ()
                            {
                                timer_Singer_Photo_One.Start();
                                timer_Singer_Photo_One_Lot.Stop();
                            }));
                        }));
                        thread_timer_Singer_Photo_One.Start();

                        Bool_Timer_Singer_Photo_1 = true;
                        Bool_Timer_Singer_Photo_1_lot = false;

                        SongBegin_OnceAnimation();
                    }
                    else if (Singer_Name_Temp_Nums == 2)
                    {
                        //MessageBox.Show("2");
                        thread_timer_Singer_Photo_One = new Thread(new ThreadStart(() =>
                        {
                            Dispatcher.BeginInvoke(new Action(delegate ()
                            {
                                timer_Singer_Photo_One.Stop();
                                timer_Singer_Photo_One_Lot.Start();
                            }));
                        }));
                        thread_timer_Singer_Photo_One.Start();

                        Bool_Timer_Singer_Photo_1 = false;
                        Bool_Timer_Singer_Photo_1_lot = true;

                        SongBegin_OnceAnimation();
                    }

                }
            }
        }

        /// <summary>
        /// 歌手数量
        /// </summary>
        public int Take_Singer_Nums(string Singer_Image_Name)
        {
            int nums = 1;

            for (int i = 0; i < Singer_Image_Name.Length; i++)
            {
                if (Singer_Image_Name.IndexOf("、") > 0)
                {
                    nums++;
                    Singer_Image_Name = Singer_Image_Name.Substring(Singer_Image_Name.IndexOf("、") + 1);
                }
                else
                    break;
            }

            return nums;//歌手的数量
        }

        string[] temp;
        int Singer_Nums = 0;
        //存储当前歌曲的歌手名
        string[] List_Singer_Names;
        /// <summary>
        /// 创建歌手数组
        /// </summary>
        /// <param name="singer_nums"></param>
        public void Create_Arraylist_Singer_Photo(int singer_nums)
        {
            Singer_Nums = singer_nums;
            List_Singer_Names_nums = singer_nums - 1;

            //周杰伦、梁心颐、杨瑞代
            temp = new string[singer_nums];
            //每个歌手的照片数
            Singer_Photo_Nums = new int[singer_nums];
            //多图歌手序号
            singer_photo_nums_More = new int[singer_nums];


            for (int i = 0; i < singer_nums; i++)
                if (temp[i] == null)
                    temp[i] = Singer_Name.Trim();

            List_Singer_Names = new string[singer_nums];

            for (int i = 0; i < List_Singer_Names.Length; i++)
            {
                if (List_Singer_Names[i] == null)
                {
                    if (temp[i] != null)
                    {
                        if (temp[i].IndexOf("、") > 0)
                        {
                            List_Singer_Names[i] = temp[i].Substring(0, temp[i].IndexOf("、"));
                            Temp_Singer_Photo_Nums(i, List_Singer_Names[i]);//检测每个歌手的照片数量

                            if (temp[i + 1] != null)
                            {
                                string tempstring = temp[i + 1].Substring(temp[i].IndexOf("、") + 1);
                                //清除所有字符前一位的
                                for (int j = i + 1; j < List_Singer_Names.Length; j++)
                                    if (temp[j] != null)
                                        temp[j] = tempstring;
                            }
                        }
                        else
                        {
                            List_Singer_Names[i] = temp[i];
                            Temp_Singer_Photo_Nums(i, List_Singer_Names[i]);//检测每个歌手的照片数量
                            break;
                        }
                    }

                }
            }


            try
            {
                singer_times = 0;
                Singer_Image_Url = Path_App + @"\Singer_Image\" + singer_photo[0] + @"\" + List_Singer_Names[singer_times] + @".jpg";
                //如果歌手图片存在
                if (File.Exists(Singer_Image_Url))
                {
                    //1719,10
                    ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                    test.Stretch = Stretch.UniformToFill;
                    musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;
                    BgSwitch(Singer_Image_Url);

                    if (List_Singer_Names.Length - 1 == 0)
                        singer_times = 0;
                    else
                    {
                        singer_times = 1;
                        singer_photo_nums_More[0] = 1;
                    }

                    singer_photo_nums = 1;
                    Start_Singer_Photo_Change_Timer();
                }
                else
                {
                    Singer_Image_Url = Path_App + @"\Singer_Image\歌手图片1\巨浪.jpg";

                    ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                    test.Stretch = Stretch.UniformToFill;
                    musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;
                    BgSwitch(Singer_Image_Url);
                }
            }
            catch(Exception ex) {
                MessageBox.Show("应用程序发生不可恢复的异常，将要退出！"+ ex.ToString());

                Singer_Image_Url = Path_App + @"\Singer_Image\歌手图片1\巨浪.jpg";
                ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                test.Stretch = Stretch.UniformToFill;
                musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;
                BgSwitch(Singer_Image_Url);
            }
        }

        DispatcherTimer timer_Singer_Photo_One;
        DispatcherTimer timer_Singer_Photo_One_Lot;
        /// <summary>
        /// 开始歌手图片切换轮播
        /// </summary>
        public void Start_Singer_Photo_Change_Timer()
        {

            //单个歌手
            if (singer_times == 0)
            {
                thread_timer_Singer_Photo_One = new Thread(new ThreadStart(() =>
                {
                    Dispatcher.BeginInvoke(new Action(delegate ()
                    {
                        timer_Singer_Photo_One_Lot.Stop();
                        timer_Singer_Photo_One.Start();
                    }));
                }));
                thread_timer_Singer_Photo_One.Start();

                Bool_Timer_Singer_Photo_1 = true;//记录状态
                Bool_Timer_Singer_Photo_1_lot = false;

                Singer_Name_Temp_Nums = 1;

                SongBegin_OnceAnimation();
            }
            else
            {
                thread_timer_Singer_Photo_One = new Thread(new ThreadStart(() =>
                {
                    Dispatcher.BeginInvoke(new Action(delegate ()
                    {
                        timer_Singer_Photo_One.Stop();
                        timer_Singer_Photo_One_Lot.Start();
                    }));
                }));
                thread_timer_Singer_Photo_One.Start();

                Bool_Timer_Singer_Photo_1 = false;//记录状态
                Bool_Timer_Singer_Photo_1_lot = true;

                Singer_Name_Temp_Nums = 2;

                SongBegin_OnceAnimation();
            }
        }

        //存储歌手含有的照片数
        int[] Singer_Photo_Nums = new int[6];
        public void Temp_Singer_Photo_Nums(int singer_index, string singer_name)
        {
            Singer_Photo_Nums[singer_index] = 0;

            //List_Singer_Names[singer_times]
            for (int i = 0; i < singer_photo.Length - 1; i++)
            {
                Singer_Image_Url = Path_App + @"\Singer_Image\" + singer_photo[i] + @"\" + singer_name + @".jpg";
                if (File.Exists(Singer_Image_Url))
                    Singer_Photo_Nums[singer_index]++;
            }
        }

        //存储歌手照片所在文件夹名
        string[] singer_photo = new string[24];
        int singer_photo_nums = 0;

        int List_Singer_Names_nums = 0;
        int singer_times = 0;
        /// <summary>
        /// Timer  切换歌手背景图
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Change_Singer_Photo_To_Grid_Back(object sender, EventArgs e)
        {
            try
            {
                Singer_Image_Url = Path_App + @"\Singer_Image\" + singer_photo[singer_photo_nums] + @"\" + List_Singer_Names[singer_times] + @".jpg";
                if (!File.Exists(Singer_Image_Url))
                {
                    singer_photo_nums = 0;
                    Singer_Image_Url = Path_App + @"\Singer_Image\" + singer_photo[singer_photo_nums] + @"\" + List_Singer_Names[singer_times] + @".jpg";
                }
                if (File.Exists(Singer_Image_Url))
                {
                    ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                    test.Stretch = Stretch.UniformToFill;
                    musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;
                    BgSwitch(Singer_Image_Url);

                    thread_timer_Singer_Photo_One_Lot = new Thread(new ThreadStart(() =>
                    {
                        Dispatcher.BeginInvoke(new Action(delegate ()
                        {
                            bgstoryboard.Begin(musicPlayer_Main_UserControl.Grid_down_Singer_Photo);
                        }));
                    }));
                    thread_timer_Singer_Photo_One_Lot.Start();
                    if (Bool_Windows_Wallpaper == true)
                        Change_Windows_Background();//切换桌面写真

                    singer_times++;
                    singer_photo_nums++;
                    if (singer_times > List_Singer_Names_nums)
                        singer_times = 0;
                    if (singer_photo_nums > singer_photo.Length - 1)
                        singer_photo_nums = 0;
                }
                else
                {
                    thread_timer_Singer_Photo_One = new Thread(new ThreadStart(() =>
                    {
                        Dispatcher.BeginInvoke(new Action(delegate ()
                        {
                            timer_Singer_Photo_One.Stop();
                        }));
                    }));
                    thread_timer_Singer_Photo_One.Start();
                }
            }
            catch
            {
                thread_timer_Singer_Photo_One = new Thread(new ThreadStart(() =>
                {
                    Dispatcher.BeginInvoke(new Action(delegate ()
                    {
                        timer_Singer_Photo_One.Stop();
                    }));
                }));
                thread_timer_Singer_Photo_One.Start();
            }
        }


        int[] singer_photo_nums_More = new int[6];
        /// <summary>
        /// Timer  切换歌手背景图
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Change_Singer_Photo_To_Grid_Back_Lot(object sender, EventArgs e)
        {
            try
            {
                //如果该歌手图片数量超过1张
                if (Singer_Photo_Nums[singer_times] > 1)
                {
                    Singer_Image_Url = Path_App + @"\Singer_Image\" + singer_photo[singer_photo_nums_More[singer_times]] + @"\" + List_Singer_Names[singer_times] + @".jpg";
                    if (File.Exists(Singer_Image_Url))
                    {
                        ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                        test.Stretch = Stretch.UniformToFill;
                        musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;                   
                        BgSwitch(Singer_Image_Url);
                        thread_timer_Singer_Photo_One_Lot = new Thread(new ThreadStart(() =>
                        {
                            Dispatcher.BeginInvoke(new Action(delegate ()
                            {
                                bgstoryboard.Begin(musicPlayer_Main_UserControl.Grid_down_Singer_Photo);
                            }));
                        }));
                        thread_timer_Singer_Photo_One_Lot.Start();
                        if (Bool_Windows_Wallpaper == true)
                            Change_Windows_Background();//切换桌面写真

                        //超过当前文件夹序号
                        if (singer_photo_nums_More[singer_times] > Singer_Photo_Nums[singer_times] - 2)
                            singer_photo_nums_More[singer_times] = 0;
                        else
                            singer_photo_nums_More[singer_times]++;

                        //歌手名下标变化
                        singer_times++;
                        if (singer_times > List_Singer_Names_nums)
                            singer_times = 0;
                    }
                    else
                        timer_Singer_Photo_One_Lot.Stop();
                }
                else if (Singer_Photo_Nums[singer_times] == 1)
                {
                    Singer_Image_Url = Path_App + @"\Singer_Image\" + singer_photo[singer_photo_nums] + @"\" + List_Singer_Names[singer_times] + @".jpg";
                    if (!File.Exists(Singer_Image_Url))
                    {
                        singer_photo_nums = 0;
                        Singer_Image_Url = Path_App + @"\Singer_Image\" + singer_photo[singer_photo_nums] + @"\" + List_Singer_Names[singer_times] + @".jpg";
                    }

                    if (File.Exists(Singer_Image_Url))
                    {
                        ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                        test.Stretch = Stretch.UniformToFill;
                        musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;
                        BgSwitch(Singer_Image_Url);

                        thread_timer_Singer_Photo_One_Lot = new Thread(new ThreadStart(() =>
                        {
                            Dispatcher.BeginInvoke(new Action(delegate ()
                            {
                                bgstoryboard.Begin(musicPlayer_Main_UserControl.Grid_down_Singer_Photo);
                            }));
                        }));
                        thread_timer_Singer_Photo_One_Lot.Start();
                        if (Bool_Windows_Wallpaper == true)
                            Change_Windows_Background();//切换桌面写真

                        singer_times++;
                        singer_photo_nums++;
                        if (singer_times > List_Singer_Names_nums)
                            singer_times = 0;
                        if (singer_photo_nums > singer_photo.Length - 1)
                            singer_photo_nums = 0;
                    }
                    else
                    {
                        timer_Singer_Photo_One_Lot.Stop();
                    }
                }
                else
                {
                    //如果该歌手没有图片
                    if (Singer_Photo_Nums[singer_times] == 0)
                    {
                        List_Singer_Names_nums -= 1;

                        //从歌手图片切换列表中清除该歌手
                        int[] temp_nums = new int[Singer_Photo_Nums.Length - 1];
                        for (int i = 0; i < Singer_Photo_Nums.Length; i++)
                            if (Singer_Photo_Nums[i] != 0)
                                if (temp_nums[i] == 0)
                                    temp_nums[i] = Singer_Photo_Nums[i];

                        Singer_Photo_Nums = new int[temp_nums.Length];
                        for (int i = 0; i < Singer_Photo_Nums.Length; i++)
                            if (temp_nums[i] != 0)
                                if (Singer_Photo_Nums[i] == 0)
                                    Singer_Photo_Nums[i] = temp_nums[i];

                        //歌手名下标变化
                        singer_times++;
                        singer_photo_nums++;
                        if (singer_times > List_Singer_Names_nums)
                            singer_times = 0;
                        if (singer_photo_nums > singer_photo.Length - 1)
                            singer_photo_nums = 0;

                        //如果该歌手图片数量超过1张
                        if (Singer_Photo_Nums[singer_times] > 1)
                        {
                            Singer_Image_Url = Path_App + @"\Singer_Image\" + singer_photo[singer_photo_nums_More[singer_times]] + @"\" + List_Singer_Names[singer_times] + @".jpg";
                            if (File.Exists(Singer_Image_Url))
                            {
                                ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                                test.Stretch = Stretch.UniformToFill;
                                musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;
                                BgSwitch(Singer_Image_Url);

                                thread_timer_Singer_Photo_One_Lot = new Thread(new ThreadStart(() =>
                                {
                                    Dispatcher.BeginInvoke(new Action(delegate ()
                                    {
                                        bgstoryboard.Begin(musicPlayer_Main_UserControl.Grid_down_Singer_Photo);
                                    }));
                                }));
                                thread_timer_Singer_Photo_One_Lot.Start();
                                if (Bool_Windows_Wallpaper == true)
                                    Change_Windows_Background();//切换桌面写真

                                //超过当前文件夹序号
                                if (singer_photo_nums_More[singer_times] > Singer_Photo_Nums[singer_times] - 2)
                                    singer_photo_nums_More[singer_times] = 0;
                                else
                                    singer_photo_nums_More[singer_times]++;

                                //歌手名下标变化
                                singer_times++;
                                if (singer_times > List_Singer_Names_nums)
                                    singer_times = 0;
                            }
                            else
                                timer_Singer_Photo_One_Lot.Stop();
                        }
                        else if (Singer_Photo_Nums[singer_times] == 1)
                        {
                            Singer_Image_Url = Path_App + @"\Singer_Image\" + singer_photo[singer_photo_nums] + @"\" + List_Singer_Names[singer_times] + @".jpg";
                            if (!File.Exists(Singer_Image_Url))
                            {
                                singer_photo_nums = 0;
                                Singer_Image_Url = Path_App + @"\Singer_Image\" + singer_photo[singer_photo_nums] + @"\" + List_Singer_Names[singer_times] + @".jpg";
                            }

                            if (File.Exists(Singer_Image_Url))
                            {
                                ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                                test.Stretch = Stretch.UniformToFill;
                                musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;
                                BgSwitch(Singer_Image_Url);

                                thread_timer_Singer_Photo_One_Lot = new Thread(new ThreadStart(() =>
                                {
                                    Dispatcher.BeginInvoke(new Action(delegate ()
                                    {
                                        bgstoryboard.Begin(musicPlayer_Main_UserControl.Grid_down_Singer_Photo);
                                    }));
                                }));
                                thread_timer_Singer_Photo_One_Lot.Start();
                                if (Bool_Windows_Wallpaper == true)
                                    Change_Windows_Background();//切换桌面写真

                                singer_times++;
                                singer_photo_nums++;
                                if (singer_times > List_Singer_Names_nums)
                                    singer_times = 0;
                                if (singer_photo_nums > singer_photo.Length - 1)
                                    singer_photo_nums = 0;
                            }
                            else
                                timer_Singer_Photo_One_Lot.Stop();
                        }
                    }
                }
            }
            catch
            {
                timer_Singer_Photo_One_Lot.Stop();
            }
        }

        /// <summary>
        /// 过渡动画效果占用5%CPU使用率
        /// </summary>
        ObjectAnimationUsingKeyFrames oa;
        ObjectAnimationUsingKeyFrames oa_2;
        /// <summary>
        /// 对指定的图片路径进行动画处理
        /// </summary>
        /// <param name="imgPath"></param>
        private void BgSwitch(string imgPath)
        {
            /*var obj = bgstoryboard.Children.FirstOrDefault(c => c is ObjectAnimationUsingKeyFrames);
            if (obj != null)
            {
                oa = obj as ObjectAnimationUsingKeyFrames;
                if (oa.KeyFrames.Count > 0)
                {
                    oa.KeyFrames[0].Value = new BitmapImage(new Uri(imgPath));
                }
            }*/
            oa = bgstoryboard.Children.FirstOrDefault(c => c is ObjectAnimationUsingKeyFrames) as ObjectAnimationUsingKeyFrames;
            oa.KeyFrames[0].Value = new BitmapImage(new Uri(imgPath));
        }


        Storyboard bgstoryboard = null;
        /// <summary>
        /// 动画生成
        /// </summary>
        private void BgSwitchIni()
        {
            //动画占用过高CPU及GPU
            //此动画效果为渲染所有的像素，效率过低
            //应更改为     多区块渲染过渡 / 线性渲染过渡 / 淡化渲染过渡 / 模糊重叠过渡渲染
            DoubleAnimationUsingKeyFrames da = new DoubleAnimationUsingKeyFrames();
            EasingDoubleKeyFrame sd = new EasingDoubleKeyFrame(0, KeyTime.FromTimeSpan(TimeSpan.FromMilliseconds(200)));
            da.KeyFrames.Add(sd);
            Storyboard.SetTargetName(da, musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Name);
            DependencyProperty[] propertyChain = new DependencyProperty[]
            {
                    Panel.BackgroundProperty,
                    Brush.OpacityProperty
            };
            Storyboard.SetTargetProperty(da, new PropertyPath("(0).(1)", propertyChain));

            ObjectAnimationUsingKeyFrames oa = new ObjectAnimationUsingKeyFrames();
            DiscreteObjectKeyFrame diso = new DiscreteObjectKeyFrame(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\Space.png", UriKind.Absolute)), KeyTime.FromTimeSpan(TimeSpan.FromMilliseconds(10)));
            oa.KeyFrames.Add(diso);
            oa.BeginTime = new TimeSpan(0, 0, 0, 1, 0);
            Storyboard.SetTargetName(oa, musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Name);
            DependencyProperty[] propertyChain2 = new DependencyProperty[]
            {
                    Panel.BackgroundProperty,
                    ImageBrush.ImageSourceProperty
            };
            Storyboard.SetTargetProperty(oa, new PropertyPath("(0).(1)", propertyChain2));

            DoubleAnimationUsingKeyFrames da2 = new DoubleAnimationUsingKeyFrames();
            da2.BeginTime = new TimeSpan(0, 0, 0, 1, 5);
            EasingDoubleKeyFrame sd2 = new EasingDoubleKeyFrame(1, KeyTime.FromTimeSpan(TimeSpan.FromMilliseconds(200)));
            da2.KeyFrames.Add(sd2);
            Storyboard.SetTargetName(da2, musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Name);
            Storyboard.SetTargetProperty(da2, new PropertyPath("(0).(1)", propertyChain));
         
            bgstoryboard.Children.Add(da);
            bgstoryboard.Children.Add(oa);
            bgstoryboard.Children.Add(da2);
        }

        DispatcherTimer once_animation;
        DispatcherTimer once_animation_end;
        int init_animation_bacnground;
        ArrayList animation_image_url;
        public void Once_Animation()
        {
            init_animation_bacnground = 0;
            animation_image_url = new ArrayList
            {
                Path_App + @"\Button_Image_Ico\默认背景1 (1).jpg",
                Path_App + @"\Button_Image_Ico\默认背景1 (2).jpg"
            };

            //初始化桌面歌词
            once_animation = new DispatcherTimer();
            once_animation.Tick += Once_animation_Tick;
            once_animation.Interval = TimeSpan.FromMilliseconds(66); // 间隔1秒
            once_animation.Start();

            once_animation_end = new DispatcherTimer();
            once_animation_end.Tick += Once_animation_end_Tick;
            once_animation_end.Interval = TimeSpan.FromMilliseconds(88); // 间隔1秒
            once_animation_end.Start();
        }

        private void Once_animation_end_Tick(object? sender, EventArgs e)
        {
            once_animation.Stop();
            once_animation_end.Stop();
        }
        private void Once_animation_Tick(object? sender, EventArgs e)
        {
            string Singer_Image_Url = animation_image_url[init_animation_bacnground].ToString();

            ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
            test.Stretch = Stretch.UniformToFill;
            musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;
            BgSwitch(Singer_Image_Url);
            thread_timer_Singer_Photo_One_Lot = new Thread(new ThreadStart(() =>
            {
                Dispatcher.BeginInvoke(new Action(delegate ()
                {
                    bgstoryboard.Begin(musicPlayer_Main_UserControl.Grid_down_Singer_Photo);
                }));
            }));
            thread_timer_Singer_Photo_One_Lot.Start();

            init_animation_bacnground++;
        }
        bool bool_SongBegin_OnceAnimation = false;
        /// <summary>
        /// 启动一次动画，覆盖第一次歌手动画不启动的Bug，仅覆盖一次
        /// </summary>
        private void SongBegin_OnceAnimation()
        {
            if (bool_SongBegin_OnceAnimation == false)
            {
                //先启动动画，防止不刷新
                BgSwitch(Singer_Image_Url);
                thread_timer_Singer_Photo_One_Lot = new Thread(new ThreadStart(() =>
                {
                    Dispatcher.BeginInvoke(new Action(delegate ()
                    {
                        bgstoryboard.Begin(musicPlayer_Main_UserControl.Grid_down_Singer_Photo);
                    }));
                }));
                thread_timer_Singer_Photo_One_Lot.Start();

                bool_SongBegin_OnceAnimation = true;
            }
        }

        #endregion

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
            dispatcherTimer_Spectrum_Visualization.Interval = new TimeSpan(0,0,0,0,600);

            Spectrum_time = 5;
            dispatcherTimer_Spectrum_Visualization.Interval = new TimeSpan(0, 0, 0, 0, Spectrum_time * 2);

            userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                        audioSpectrogram.StartStopBtn_Click();
        }

        public void Spectrum_Visualization_Play_Tick(object sender, EventArgs e)
        {
            //使用双区间来判定同步当前音频文件时间信息所处歌词时间信息的位置
            //0有时访问不到
            if (ListBox_MRC_Song_MRC_Time != null)
            {
                if (MediaElement_Song.Position.TotalMilliseconds <= Start_Song_MRC_Time)
                {
                    for (int i = 0; i < ListBox_MRC_Song_MRC_Time.Length; i++)
                    {
                        if (ListBox_MRC_Song_MRC_Time[i] != 0)
                        {
                            Take_Spectrum_Visualization();
                            break;
                        }
                    }
                }
                else if (MediaElement_Song.Position.TotalMilliseconds >= End_Song_MRC_Time)
                {
                    for (int i = ListBox_MRC_Song_MRC_Time.Length - 1; i >= 0; i--)
                    {
                        if (ListBox_MRC_Song_MRC_Time[i] != 0)
                        {
                            Take_Spectrum_Visualization();

                            break;
                        }
                    }
                }
                else
                {
                    for (int i = 7; i < ListBox_MRC_Song_MRC_Time.Length; i++)
                    {
                        if (ListBox_MRC_Song_MRC_Time[i] != 0)
                        {
                            if (MediaElement_Song.Position.TotalMilliseconds >= ListBox_MRC_Song_MRC_Time[i])
                            {
                                if (MediaElement_Song.Position.TotalMilliseconds < ListBox_MRC_Song_MRC_Time[i + 1])
                                {
                                    Take_Spectrum_Visualization();

                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        
        int Spectrum_time = 0;
        float Spectrum_Value = 0;
        public void Take_Spectrum_Visualization()
        {
            if (userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                        audioSpectrogram.animation_points != null)
            {
                int half_animation_points_length = userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                        audioSpectrogram.animation_points.Count;

                if (half_animation_points_length == 53)
                {
                    for (int i = 0; i < userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                                List_storyboard.Count; i++)
                    {
                        userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                            List_doubleAnimation[i].KeyFrames.Clear();

                        LinearDoubleKeyFrame linearDoubleKeyFrame_1 = new LinearDoubleKeyFrame();
                        LinearDoubleKeyFrame linearDoubleKeyFrame_2 = new LinearDoubleKeyFrame();

                        linearDoubleKeyFrame_1.KeyTime = new TimeSpan(0, 0, 0, 0,
                            (int)Spectrum_time);

                        linearDoubleKeyFrame_2.Value = Spectrum_Value;//结束值设置为上次动画的位置
                        linearDoubleKeyFrame_2.KeyTime = new TimeSpan(0, 0, 0, 0,
                            (int)Spectrum_time);

                        /*假如只有26 而非  106
                         则左13，右13，
                         则左[53-13]->[53]  ，  右[54]->[54+13]   
                         */
                        if (i < half_animation_points_length)
                        {
                            linearDoubleKeyFrame_1.Value = userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                                audioSpectrogram.animation_points[i];

                            userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                            List_doubleAnimation[
                                    half_animation_points_length - i + (53 - half_animation_points_length)
                                ].KeyFrames.Add(linearDoubleKeyFrame_1);
                            userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                                List_doubleAnimation[
                                    half_animation_points_length - i + (53 - half_animation_points_length)
                                ].KeyFrames.Add(linearDoubleKeyFrame_2);

                            userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                                List_doubleAnimation[
                                    half_animation_points_length - i + (53 - half_animation_points_length)
                                ].Duration = new TimeSpan(0, 0, 0, 0, (int)Spectrum_time * 2);
                            userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                                List_storyboard[
                                    half_animation_points_length - i + (53 - half_animation_points_length)
                                ].Children[0] = userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                                    List_doubleAnimation[
                                        half_animation_points_length - i + (53 - half_animation_points_length)
                                    ];
                            userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                                List_storyboard[
                                    half_animation_points_length - i + (53 - half_animation_points_length)
                                ].Begin();
                        }
                        else
                        {
                            linearDoubleKeyFrame_1.Value = userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                                audioSpectrogram.animation_points[i - half_animation_points_length + (53 - half_animation_points_length)];


                            userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                            List_doubleAnimation[
                                    i - half_animation_points_length + 53 + (53 - half_animation_points_length)
                                ].KeyFrames.Add(linearDoubleKeyFrame_1);
                            userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                                List_doubleAnimation[
                                    i - half_animation_points_length + 53 + (53 - half_animation_points_length)
                                ].KeyFrames.Add(linearDoubleKeyFrame_2);

                            userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                                List_doubleAnimation[
                                    i - half_animation_points_length + 53 + (53 - half_animation_points_length)
                                ].Duration = new TimeSpan(0, 0, 0, 0, (int)Spectrum_time * 2);
                            userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                                List_storyboard[
                                    i - half_animation_points_length + 53 + (53 - half_animation_points_length)
                                ].Children[0] = userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                                    List_doubleAnimation[
                                        i - half_animation_points_length + 53 + (53 - half_animation_points_length)
                                    ];
                            userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                                List_storyboard[
                                    i - half_animation_points_length + 53 + (53 - half_animation_points_length)
                                ].Begin();
                        }

                        Spectrum_Value = (float)linearDoubleKeyFrame_1.Value;//保留此次动画的Value值
                    }
                }
            }
        }

        
        #endregion


        #region 播放全部

        /// <summary>
        /// 播放全部
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Paly_ALL_Song(object sender, MouseButtonEventArgs e)
        {
            if (bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_Love"))
                listView_Item_Bing_ALL.listView_SongList = userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info;
            else if (bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_ALL"))
                listView_Item_Bing_ALL.listView_SongList = userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info;
            else if (bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_Auto"))
                listView_Item_Bing_ALL.listView_SongList = userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info;
            else if (bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen"))
                listView_Item_Bing_ALL.listView_SongList = userControl_Main_Home_Left_MyMusic_Try_Listen.ListView_Download_SongList_Info;

            //播放列表选定项设置为0
            listView_Item_Bing_ALL.listView_SongList.SelectedIndex = 0;

            Select_DoubleClick_ListView = 1;
            Change_MediaElement_Source();
        }

        #endregion
        #region 手动添加音乐
        private void ThisWindowsMusicAndDownload_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            string SongList_Path = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource\SongListInfo_ini\Local_ThisPC_song_search_YouSelect.exe";
            System.Diagnostics.Process.Start(SongList_Path); //调用该命令，在程序启动时打开Excel程序

            //创建定时器，每隔1秒读取ini配置，检查里面的数值是否被更改（被Local_ThisPC_song_search_ALL.exe更改则重启歌单数据源）
            DispatcherTimer_Add_PC_Select_Song();           
        }
        private void My_Love_Button_Add_PC_Select_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            string SongList_Path = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource\SongListInfo_ini\Local_ThisPC_song_search_YouSelect.exe";
            System.Diagnostics.Process.Start(SongList_Path); //调用该命令，在程序启动时打开Excel程序
            DispatcherTimer_Add_PC_Select_Song();
        }
        private void Recent_Play_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            string SongList_Path = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource\SongListInfo_ini\Local_ThisPC_song_search_YouSelect.exe";
            System.Diagnostics.Process.Start(SongList_Path); //调用该命令，在程序启动时打开Excel程序
            DispatcherTimer_Add_PC_Select_Song();
        }
        private void Try_Listen_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            string SongList_Path = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource\SongListInfo_ini\Local_ThisPC_song_search_YouSelect.exe";
            System.Diagnostics.Process.Start(SongList_Path); //调用该命令，在程序启动时打开Excel程序
            DispatcherTimer_Add_PC_Select_Song();
        }

        DispatcherTimer dispatcher_Add_PC_Select_Song;
        /// <summary>
        /// 检测查找本地音乐是否完成
        /// </summary>
        private void DispatcherTimer_Add_PC_Select_Song()
        {
            MessageBox.Show("需要歌单操作的歌单，在歌曲完全导入之前，所有的歌单会保持冻结状态");
            userControl_ButtonFrame_MusicLove.IsEnabled = false;
            userControl_ButtonFrame_ThisWindowsMusicAndDownload.IsEnabled = false;
            userControl_ButtonFrame_MusicRecentlyPlayed.IsEnabled = false;
            userControl_ButtonFrame_MusicTryListenList.IsEnabled = false;
            userControl_Main_Home_Left_MyMusic_My_Love.IsEnabled = false;
            userControl_Main_Home_Left_MyMusic_Recent_Play.IsEnabled = false;
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.IsEnabled = false;
            userControl_Main_Home_Left_MyMusic_Try_Listen.IsEnabled = false;

            dispatcher_Add_PC_Select_Song = new DispatcherTimer();
            dispatcher_Add_PC_Select_Song.Tick += DispatcherTimer_Add_PC_Select_Song_Tick;
            dispatcher_Add_PC_Select_Song.Interval = new TimeSpan(0, 0, 0, 3);
            dispatcher_Add_PC_Select_Song.Start();
        }
        private void DispatcherTimer_Add_PC_Select_Song_Tick(object sender, EventArgs e)
        {
            string temp = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource\SongListInfo_ini\SongList_MakeSure_Ini\SongList_Find_Select_Song_MakeSure.ini";
            FileStream FS_List_Save = new FileStream(temp, FileMode.Open);
            StreamReader SR_List = new StreamReader(FS_List_Save);
            string bool_make_true = SR_List.ReadLine();
            SR_List.Close();
            FS_List_Save.Close();
            if (bool_make_true != null)
            {
                if (bool_make_true.Equals("已检索"))
                {
                    dispatcher_Add_PC_Select_Song = null;

                    FS_List_Save = new FileStream(temp, FileMode.Create);
                    StreamWriter SW_List = new StreamWriter(FS_List_Save);//无法静态
                    SW_List.WriteLine("未检索");
                    //清空缓冲区
                    //关闭流
                    SW_List.Flush();
                    SW_List.Close();
                    //FS_List.Flush();
                    FS_List_Save.Close();

                    Hand_Add_listView_SongList_Source();
                }
                else if (bool_make_true.Equals("未完成"))
                {
                    dispatcher_Add_PC_Select_Song = null;

                    FS_List_Save = new FileStream(temp, FileMode.Create);
                    StreamWriter SW_List = new StreamWriter(FS_List_Save);//无法静态
                    SW_List.WriteLine("未检索");
                    //清空缓冲区
                    //关闭流
                    SW_List.Flush();
                    SW_List.Close();
                    //FS_List.Flush();
                    FS_List_Save.Close();
                }
            }
        }
        /// <summary>
        /// 重置歌单和播放列表的数据源
        /// </summary>
        private void Hand_Add_listView_SongList_Source()
        {
            if (bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_Love"))
            {              
                load_SongList_Info.Load_Data_ALL_D_Grid_View_Select_Songs();
                Add_Select_Songs_To_listView_Item_Bing_ALL(listView_Item_Bing_ALL.listView_Temp_Info_End_Love);
                userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = null;
                userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_Love;
                listView_Item_Bing_ALL.listView_SongList = userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info;
            }
            else if (bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_ALL"))
            {
                load_SongList_Info.Load_Data_ALL_D_Grid_View_Select_Songs();
                Add_Select_Songs_To_listView_Item_Bing_ALL(listView_Item_Bing_ALL.listView_Temp_Info_End_ALL);
                userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = null;
                userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_ALL;
                listView_Item_Bing_ALL.listView_SongList = userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info;
            }
            else if (bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_Auto"))
            {
                load_SongList_Info.Load_Data_ALL_D_Grid_View_Select_Songs();
                Add_Select_Songs_To_listView_Item_Bing_ALL(listView_Item_Bing_ALL.listView_Temp_Info_End_Auto);
                userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
                userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_Auto;
                listView_Item_Bing_ALL.listView_SongList = userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info;
            }
            else if (bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen"))
            {
                load_SongList_Info.Load_Data_ALL_D_Grid_View_Select_Songs();
                Add_Select_Songs_To_listView_Item_Bing_ALL(listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen);
                userControl_Main_Home_Left_MyMusic_Try_Listen.ListView_Download_SongList_Info.ItemsSource = null;
                userControl_Main_Home_Left_MyMusic_Try_Listen.ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen;
                listView_Item_Bing_ALL.listView_SongList = userControl_Main_Home_Left_MyMusic_Try_Listen.ListView_Download_SongList_Info;
            }

            userControl_ButtonFrame_MusicLove.IsEnabled = true;
            userControl_ButtonFrame_ThisWindowsMusicAndDownload.IsEnabled = true;
            userControl_ButtonFrame_MusicRecentlyPlayed.IsEnabled = true;
            userControl_ButtonFrame_MusicTryListenList.IsEnabled = true;
            userControl_Main_Home_Left_MyMusic_My_Love.IsEnabled = true;
            userControl_Main_Home_Left_MyMusic_Recent_Play.IsEnabled = true;
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.IsEnabled = true;
            userControl_Main_Home_Left_MyMusic_Try_Listen.IsEnabled = true;
        }
        /// <summary>
        /// 添加选中歌曲至末尾
        /// </summary>
        /// <param name="listView_Temp_Info_End_Infos"></param>
        private void Add_Select_Songs_To_listView_Item_Bing_ALL(List<ListView_Item_Bing> listView_Temp_Info_End_Infos)
        {
            int nums = listView_Temp_Info_End_Infos.Count;
            if (nums == 0)
                nums = 1;
            bool Is_Love = false;
            if (bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_Love"))
                Is_Love = true;
            for (int i = 0; i < listView_Item_Bing_ALL.listView_Temp_Info_End_Temp.Count; i++)
            {
                listView_Item_Bing_ALL.listView_Temp_Info_End_Temp[i].Song_No = nums + i;
                if (Is_Love == true)
                {
                    listView_Item_Bing_ALL.listView_Temp_Info_End_Temp[i].Song_Like_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心 - 副本.png")));
                    listView_Item_Bing_ALL.listView_Temp_Info_End_Temp[i].Song_Like = 1;
                }

                listView_Temp_Info_End_Infos.Add(listView_Item_Bing_ALL.listView_Temp_Info_End_Temp[i]);
            }
        }

        #endregion
        #region 查找本地音乐

        private void ThisWindowsMusicAndDownload_Stack_Button_Add_PC_ALL_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            string SongList_Path = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource\SongListInfo_ini\Local_ThisPC_song_search_ALL.exe";
            System.Diagnostics.Process.Start(SongList_Path); //调用该命令，在程序启动时打开Excel程序

            //创建定时器，每隔1秒读取ini配置，检查里面的数值是否被更改（被Local_ThisPC_song_search_ALL.exe更改则重启歌单数据源）
            DispatcherTimer_Add_PC_ALL_Song();
        }
        private void My_Love_Button_Add_PC_ALL_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            string SongList_Path = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource\SongListInfo_ini\Local_ThisPC_song_search_ALL.exe";
            System.Diagnostics.Process.Start(SongList_Path); //调用该命令，在程序启动时打开Excel程序
            DispatcherTimer_Add_PC_ALL_Song();
        }
        private void Recent_Play_Stack_Button_Add_PC_ALL_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            string SongList_Path = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource\SongListInfo_ini\Local_ThisPC_song_search_ALL.exe";
            System.Diagnostics.Process.Start(SongList_Path); //调用该命令，在程序启动时打开Excel程序
            DispatcherTimer_Add_PC_ALL_Song();
        }
        private void Try_Listen_Stack_Button_Add_PC_ALL_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            string SongList_Path = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource\SongListInfo_ini\Local_ThisPC_song_search_ALL.exe";
            System.Diagnostics.Process.Start(SongList_Path); //调用该命令，在程序启动时打开Excel程序
            DispatcherTimer_Add_PC_ALL_Song();
        }

        DispatcherTimer dispatcher_Add_PC_ALL_Song;
        /// <summary>
        /// 检测查找本地音乐是否完成
        /// </summary>
        private void DispatcherTimer_Add_PC_ALL_Song()
        {
            MessageBox.Show("需要歌单操作的歌单，在歌曲完全导入之前，所有的歌单会保持冻结状态");
            userControl_ButtonFrame_MusicLove.IsEnabled = false;
            userControl_ButtonFrame_ThisWindowsMusicAndDownload.IsEnabled = false;
            userControl_ButtonFrame_MusicRecentlyPlayed.IsEnabled = false;
            userControl_ButtonFrame_MusicTryListenList.IsEnabled = false;
            userControl_Main_Home_Left_MyMusic_My_Love.IsEnabled = false;
            userControl_Main_Home_Left_MyMusic_Recent_Play.IsEnabled = false;
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.IsEnabled = false;
            userControl_Main_Home_Left_MyMusic_Try_Listen.IsEnabled = false;

            dispatcher_Add_PC_ALL_Song = new DispatcherTimer();
            dispatcher_Add_PC_ALL_Song.Tick += DispatcherTimer_Add_PC_ALL_Song_Tick;
            dispatcher_Add_PC_ALL_Song.Interval = new TimeSpan(0,0,0,3);
            dispatcher_Add_PC_ALL_Song.Start();
        }
        private void DispatcherTimer_Add_PC_ALL_Song_Tick(object sender, EventArgs e)
        {
            string temp = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource\SongListInfo_ini\SongList_MakeSure_Ini\SongList_MakeSure.ini";
            FileStream FS_List_Save = new FileStream(temp, FileMode.Open);
            StreamReader SR_List = new StreamReader(FS_List_Save);
            string bool_make_true = SR_List.ReadLine();
            SR_List.Close();
            FS_List_Save.Close();
            if (bool_make_true != null)
            {
                if (bool_make_true.Equals("已检索"))
                {
                    dispatcher_Add_PC_ALL_Song = null;

                    FS_List_Save = new FileStream(temp, FileMode.Create);
                    StreamWriter SW_List = new StreamWriter(FS_List_Save);//无法静态
                    SW_List.WriteLine("未检索");
                    //清空缓冲区
                    //关闭流
                    SW_List.Flush();
                    SW_List.Close();
                    //FS_List.Flush();
                    FS_List_Save.Close();

                    Reset_listView_SongList_Source();
                }
                else if (bool_make_true.Equals("未完成"))
                {
                    dispatcher_Add_PC_ALL_Song = null;

                    FS_List_Save = new FileStream(temp, FileMode.Create);
                    StreamWriter SW_List = new StreamWriter(FS_List_Save);//无法静态
                    SW_List.WriteLine("未检索");
                    //清空缓冲区
                    //关闭流
                    SW_List.Flush();
                    SW_List.Close();
                    //FS_List.Flush();
                    FS_List_Save.Close();
                }
            }
        }
        /// <summary>
        /// 重置歌单和播放列表的数据源
        /// </summary>
        private void Reset_listView_SongList_Source()
        {
            if (bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_Love"))
            {
                load_SongList_Info.Load_Data_ALL_D_Grid_View_2();
                userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = null;
                userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_Love;
                listView_Item_Bing_ALL.listView_SongList = userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info;
            }
            else if (bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_ALL"))
            {
                load_SongList_Info.Load_Data_ALL_D_Grid_View_1();
                userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = null;
                userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_ALL;
                listView_Item_Bing_ALL.listView_SongList = userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info;
            }       
            else if (bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_Auto"))
            {
                load_SongList_Info.Load_Data_ALL_D_Grid_View_3();
                userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
                userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_Auto;
                listView_Item_Bing_ALL.listView_SongList = userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info;
            }
            else if (bool_ListView_Temp_Info_End_Clear.FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen"))
            {
                load_SongList_Info.Load_Data_ALL_D_Grid_View_4();
                userControl_Main_Home_Left_MyMusic_Try_Listen.ListView_Download_SongList_Info.ItemsSource = null;
                userControl_Main_Home_Left_MyMusic_Try_Listen.ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen;
                listView_Item_Bing_ALL.listView_SongList = userControl_Main_Home_Left_MyMusic_Try_Listen.ListView_Download_SongList_Info;            
            }

            userControl_ButtonFrame_MusicLove.IsEnabled = true;
            userControl_ButtonFrame_ThisWindowsMusicAndDownload.IsEnabled = true;
            userControl_ButtonFrame_MusicRecentlyPlayed.IsEnabled = true;
            userControl_ButtonFrame_MusicTryListenList.IsEnabled = true;
            userControl_Main_Home_Left_MyMusic_My_Love.IsEnabled = true;
            userControl_Main_Home_Left_MyMusic_Recent_Play.IsEnabled = true;
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.IsEnabled = true;
            userControl_Main_Home_Left_MyMusic_Try_Listen.IsEnabled = true;
            MessageBox.Show("导入成功");
        }

        #endregion
        #region 批量操作
        
        #endregion
        #region 匹配歌曲
        private void Stack_Button_Find_Song_Info_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {

        }
        #endregion
        #region 本地歌曲恢复助手
        private void Stack_Button_ThisPcSong_Find_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {

        }
        #endregion
        #region 音质升级
        private void Stack_Button_Update_Song_Better_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {

        }
        #endregion
        #region 显示当前歌曲数量

        private void ListView_Download_SongList_Info_SourceUpdated(object sender, DataTransferEventArgs e)
        {
            Reset_ListView_Download_SongList_Info_ShowSongNums();
        }
        /// <summary>
        /// 同步当前歌单歌曲数量
        /// </summary>
        public void Reset_ListView_Download_SongList_Info_ShowSongNums()
        {
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Windows_Song_Nums.Text
                = "本地歌曲" + userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.Items.Count.ToString();
            userControl_Main_Home_Left_MyMusic_My_Love.Love_Song_Nums.Text
                = "歌曲" + userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.Items.Count.ToString();
            userControl_Main_Home_Left_MyMusic_Recent_Play.Recent_Song_Nums.Text
                = "歌曲" + userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.Items.Count.ToString();
            userControl_Main_Home_Left_MyMusic_Try_Listen.TryListen_Song_Nums.Text
                = "试听歌曲" + userControl_Main_Home_Left_MyMusic_Try_Listen.ListView_Download_SongList_Info.Items.Count.ToString();
        }

        #endregion


        #region 获得指定元素的父元素
        /// 获得指定元素的父元素
        /// </summary>
        /// <typeparam name="T">指定页面元素</typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public T GetParentObject<T>(DependencyObject obj) where T : FrameworkElement
        {
            DependencyObject parent = VisualTreeHelper.GetParent(obj);

            while (parent != null)
            {
                if (parent is T)
                {
                    return (T)parent;
                }

                parent = VisualTreeHelper.GetParent(parent);
            }

            return null;
        }
        /// <summary>
        /// 获得指定元素的所有子元素(这里需要有一个从DataTemplate里获取控件的函数)
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public List<T> GetChildObjects_Name<T>(DependencyObject obj, string name) where T : FrameworkElement
        {
            DependencyObject child = null;
            List<T> childList = new List<T>();
            for (int i = 0; i <= VisualTreeHelper.GetChildrenCount(obj) - 1; i++)
            {
                child = VisualTreeHelper.GetChild(obj, i);
                if (child is T && (((T)child).Name == name || string.IsNullOrEmpty(name)))
                {
                    childList.Add((T)child);
                }
                childList.AddRange(GetChildObjects_Name<T>(child, ""));//指定集合的元素添加到List队尾
            }
            return childList;
        }
        /// <summary>
        /// 获得指定元素的所有子元素
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public List<T> GetChildObjects<T>(DependencyObject obj) where T : FrameworkElement
        {
            DependencyObject child = null;
            List<T> childList = new List<T>();

            for (int i = 0; i <= VisualTreeHelper.GetChildrenCount(obj) - 1; i++)
            {
                child = VisualTreeHelper.GetChild(obj, i);

                if (child is T)
                {
                    childList.Add((T)child);
                }
                childList.AddRange(GetChildObjects<T>(child));
            }
            return childList;
        }
        /// <summary>
        /// 查找子元素
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public T GetChildObject<T>(DependencyObject obj, string name) where T : FrameworkElement
        {
            DependencyObject child = null;
            T grandChild = null;


            for (int i = 0; i <= VisualTreeHelper.GetChildrenCount(obj) - 1; i++)
            {
                child = VisualTreeHelper.GetChild(obj, i);


                if (child is T && (((T)child).Name == name | string.IsNullOrEmpty(name)))
                {
                    return (T)child;
                }
                else
                {
                    grandChild = GetChildObject<T>(child, name);
                    if (grandChild != null)
                        return grandChild;
                }
            }
            return null;
        }
        #endregion

        #region 前端响应

        Thickness thickness;
        /// <summary>
        /// 窗体大小变化事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Window_SizeChanged(object sender, SizeChangedEventArgs e)
        {
            musicPlayer_Main_UserControl.VerticalAlignment = VerticalAlignment.Stretch;

            musicPlayer_Main_UserControl.Width = this.Width - 20;

            //位于播放器界面时，解除动画绑定  对高度属性的占用 -->设置height将有效，否则无效
            if(Bool_OpenMainMusicPlayer)
                musicPlayer_Main_UserControl.BeginAnimation(UserControl.HeightProperty, null);

            musicPlayer_Main_UserControl.Height = this.ActualHeight - 20;


            if (this.Width >= 1000 && this.Width <= 1100)
            {
                musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Width = 1300;
                musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Width = 1300;
            }
            else if (this.Width >= 1100 && this.Width <= 1400)
            {
                musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Width = 1600;
                musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Width = 1600;
            }
            else if (this.Width >= 1400 && this.Width <= 1700)
            {
                musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Width = 1920;
                musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Width = 1920;
            }
            if (this.Height >= 562 && this.Height <= 731)
            {
                musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Height = 731;
                musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Height = 731;
            }
            else if (this.Height >= 731 && this.Height <= 900)
            {
                musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Height = 900;
                musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Height = 900;
            }
            else if (this.Height >= 900 && this.Height <= 1000)
            {
                musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Height = 1080;
                musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Height = 1080;
            }

        }




        #endregion

        /// <summary>
        /// 桌面写真模式
        /// 应制作悬浮于桌面的画布，仅歌手图片切换动画，歌词同步悬浮于桌面且置于底层
        /// 桌面无法直接控制(取消焦点 Fousable = false)，桌面无响应操作
        /// </summary>
        /// <param name="uAction"></param>
        /// <param name="uParam"></param>
        /// <param name="lpvParam"></param>
        /// <param name="fuWinIni"></param>
        /// <returns></returns>
        [System.Runtime.InteropServices.DllImport("user32.dll", CharSet = System.Runtime.InteropServices.CharSet.Auto, SetLastError = true)]
        public static extern int SystemParametersInfo(int uAction, int uParam, StringBuilder lpvParam, int fuWinIni);
        private const int SPI_GETDESKWALLPAPER = 0x0073;
        #region 桌面写真模式

        //调用
        public static StringBuilder wallpaper_path = new StringBuilder();
        StringBuilder SingerPicPath = new StringBuilder();
        public bool Bool_Windows_Wallpaper = false;

        /// <summary>
        /// 桌面写真模式
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void button_Open_Windows_Picture_Click(object sender, EventArgs e)
        {
            if(Singer_Image_Url == null || Singer_Image_Url.Length <= 0)
            {
                MessageBox.Show("请先播放音乐，打开歌手写真");
            }
            else if (Bool_Windows_Wallpaper == false)
            {
                //刷新Windows存储的背景图片信息
                wallpaper_path.Clear();
                //存储Windows背景图片
                //定义存储缓冲区大小
                StringBuilder s = new StringBuilder(300);
                //获取Window 桌面背景图片地址，使用缓冲区
                SystemParametersInfo(SPI_GETDESKWALLPAPER, 300, s, 0);
                //缓冲区中字符进行转换
                wallpaper_path.Append(s.ToString()); //系统桌面背景图片路径

                Change_Windows_Background();

                //顺便开启桌面歌词
                if (!window_Hover_MRC_Panel.Bool_Open_MRC_Panel)
                {
                    window_Hover_MRC_Panel.Show();

                    window_Hover_MRC_Panel.Bool_Open_MRC_Panel = true;
                }

                Bool_Windows_Wallpaper = true;
                userControl_ButtonFrame_MusicPlayer.Button_Singer_Image_Animation_Image_To_WindowsDesktop.Source = new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/开关-开 (1).png"));
            }
            else
            {
                SystemParametersInfo(20, 1, wallpaper_path, 1);            

                //刷新Windows存储的背景图片信息
                wallpaper_path.Clear();
                //存储Windows背景图片
                //定义存储缓冲区大小
                StringBuilder s = new StringBuilder(300);
                //获取Window 桌面背景图片地址，使用缓冲区
                SystemParametersInfo(SPI_GETDESKWALLPAPER, 300, s, 0);
                //缓冲区中字符进行转换
                wallpaper_path.Append(s.ToString()); //系统桌面背景图片路径

                Bool_Windows_Wallpaper = false;
                userControl_ButtonFrame_MusicPlayer.Button_Singer_Image_Animation_Image_To_WindowsDesktop.Source = new BitmapImage(new Uri(Path_App + "/Button_Image_Ico/开关-关 (1).png"));
            }          
        }
        public void Change_Windows_Background()
        {
            SingerPicPath.Clear();

            //如果歌手图片存在
            if (File.Exists(Singer_Image_Url))
                SingerPicPath.Append(Singer_Image_Url);//获取歌手图片所在路径  

            SystemParametersInfo(20, 1, SingerPicPath, 1);

            Bool_Windows_Wallpaper = true;
        }
        #endregion

        private void Window_Closed(object sender, EventArgs e)
        {
            //关闭桌面写真
            if (Bool_Windows_Wallpaper == true)
                SystemParametersInfo(20, 1, wallpaper_path, 1);

            save_SongList_Info.Save_ALL_SongListInfo();

            Environment.Exit(-1);
        }
    }
}
