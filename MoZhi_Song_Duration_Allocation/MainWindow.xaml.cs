using MoZhi_Song_Duration_Allocation.UserControlLibrary.MainWindow_Buttom_SingerKrcSinging_Panel.UserControl_ListviewItem_SingerKrc;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
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
using System.Windows.Media.Effects;
using LibVLCSharp.Shared;
using NSMusicS.Dao_UserControl.Song_Mrc_Info;
using NSMusicS.UserControlLibrary.Main_UserControls;
using System.Runtime.InteropServices;
using MoZhi_Song_Duration_Allocation.UserControlLibrary.MainWindow_Buttom_ListviewKrc_Panel;
using System.Collections.ObjectModel;

namespace MoZhi_Song_Duration_Allocation
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            this.WindowState = WindowState.Maximized;

            DoubleAnimation doubleAnimation = new DoubleAnimation();
            doubleAnimation.From = 0;
            doubleAnimation.To = 800;
            doubleAnimation.Duration = new Duration(TimeSpan.FromMilliseconds(1800));
            doubleAnimation.Completed += DoubleAnimation_Completed;
            userControl_MediaMV.BeginAnimation(UserControl.HeightProperty, doubleAnimation);
        }
        [DllImport("kernel32.dll")]
        private static extern bool SetProcessWorkingSetSize(IntPtr proc, int min, int max);
        private void DispatcherTimer_memory_Tick(object? sender, EventArgs e)
        {
            if (Environment.OSVersion.Platform == PlatformID.Win32NT)
            {
                SetProcessWorkingSetSize(System.Diagnostics.Process.GetCurrentProcess().Handle, -1, -1);
            }
            GC.Collect();
            GC.WaitForPendingFinalizers();
        }
        private void DoubleAnimation_Completed(object? sender, EventArgs e)
        {
            Init();
        }
        public void Init()
        {
            Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";

            string temp = "aespa - Spicy";//aespa - Spicy  EXO - Obsession  EXO - LOTTO (Chinese Ver.)

            //设置要分析的歌词文件（mrc）路径
            MRC_URL = Path_App + @"\Krc\"+ temp + ".krc";
            CRC_URL = Path_App + @"\Crc\" + temp + ".crc";
            userControl_MediaMV.MediaMent_MV.Source = new Uri(Path_App + @"\MV\" + temp + ".mp4");
            Is_Chinese = true;
            temp_Song_ = -200;// 5000,-1000:OB  0:Lotto  -200:Spicy

            userControl_SingerKrcSinging_Panel.Singer_Name = new ArrayList
            {
                "柳智敏KARINA","金旼炡WINTER","宁艺卓NINGNING","内永枝利GISELLE","aespa ALL"

                /*"KAI金钟仁",
                "BAEKHYUN边伯贤",
                "CHANYEOL朴灿烈",
                "SUHO金俊勉",
                "SEHUN吴世勋",
                "CHEN金钟大",
                "EXO全体"*/

                /*"KAI金钟仁",
                "BAEKHYUN边伯贤",
                "CHANYEOL朴灿烈",
                "SUHO金俊勉",
                "SEHUN吴世勋",
                "D.O都敬秀",
                "CHEN金钟大",
                "XIUMIN金珉锡",
                "LAY张艺兴",*/
                /*"TAO黄子韬",
                "LUHAN鹿晗",
                "KRIS吴亦凡"*/
            };
            userControl_SingerKrcSinging_Panel.Init();

            userControl_MediaMV.MediaMent_MV.Play();
            userControl_MediaMV.MediaMent_MV.LoadedBehavior = MediaState.Play;

            //userControl_MediaMV.MediaMent_MV.Position = new TimeSpan(0,0,2,44,0);

            /*LibVLC _libvlc = new LibVLC();
            LibVLCSharp.Shared.MediaPlayer player = new LibVLCSharp.Shared.MediaPlayer(_libvlc);
            userControl_MediaMV.MediaPlayer = player;
            //通过设置宽高比为窗体宽高可达到视频铺满全屏的效果
            player.AspectRatio = this.Width + ":" + this.Height;
            string url = "rtsp://user:password@192.168.1.120:554/ch1/main/av_stream";
            using (LibVLCSharp.Shared.Media media = new Media(_libvlc, new Uri(Path_App + @"\MV\EXO - Obsession.mp4")))
            {
                userControl_MediaMV.MediaPlayer.Play(media);
            }*/

            //时长分配_动态分配算法_初始化
            Init_Dynamic_Allocation();

            //初始化桌面歌词
            DispatcherTimer_MRC = new DispatcherTimer();
            DispatcherTimer_MRC.Tick += new EventHandler(Media_Song_MRC_Play_Tick); // 超过计时器间隔时发生，时间轴向前走1秒       
            DispatcherTimer_MRC.Interval = TimeSpan.FromMilliseconds(1); // 间隔1秒
            //选中项更改
            userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectionChanged += ListView_Temp_MRC_ScrollIntoView;
            //生成歌词路径
            Create_Steam_Song_MRC();

            DispatcherTimer dispatcherTimer_Sort_Of_Singing_Time = new DispatcherTimer();
            dispatcherTimer_Sort_Of_Singing_Time.Interval = new TimeSpan(0, 0, 0, 0, 50);
            dispatcherTimer_Sort_Of_Singing_Time.Tick += DispatcherTimer_Sort_Of_Singing_Time_Tick;
            dispatcherTimer_Sort_Of_Singing_Time.Start();
        }

        static string Path_App;
        static string MRC_URL;
        static string CRC_URL;

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

        #region 歌词同步_Listview

        #region 歌词切换
        bool bool_lrc;

        public List<string> ListBox_MRC_Song_MRC_Text;//歌词文件文本歌词内容的集合
        public List<double> ListBox_MRC_Song_MRC_Time;//歌词文件文本歌词时间的集合
        public double Start_Song_MRC_Time;
        public double End_Song_MRC_Time;

        //歌词信息类
        Dao_ListBox_Temp_MRC dao_ListBox_Temp_MRC = new Dao_ListBox_Temp_MRC();
        ObservableCollection<Dao_ListBox_Temp_MRC_Bing> Temp_MRC_Bing;
        /// <summary>
        /// 生成歌词路径
        /// </summary>
        public void Create_Steam_Song_MRC()
        {
            ListBox_MRC_Song_MRC_Text = new List<string>();
            ListBox_MRC_Song_MRC_Time = new List<double>();
            dao_ListBox_Temp_MRC = new Dao_ListBox_Temp_MRC();

            try
            {
                //如果歌词文件存在
                if (File.Exists(MRC_URL))
                {
                    try
                    {
                        //字同步  生成树状结构(优化)
                        dao_ListBox_Temp_MRC.Take_TreeMRCInfo(MRC_URL);

                        //传递歌词数组，将listview的数据源绑定至 分析完成的在Dao_ListBox_Temp_MRC内存储的歌词数组信息
                        Temp_MRC_Bing = dao_ListBox_Temp_MRC.Return_ListBox_Temp_MRC_Bing(CRC_URL);
                        for (int i = 0; i < Temp_MRC_Bing.Count; i++)
                        {
                            Temp_MRC_Bing[i].Singer_Head_Image_Show = Visibility.Collapsed;

                            if (Temp_MRC_Bing[i].Song_CRC_Line != null)
                            {
                                if (Temp_MRC_Bing[i].Song_CRC_Line.Length > 0)
                                {
                                    if (Temp_MRC_Bing[i].Song_CRC_Line.LastIndexOf(")") > 0)
                                    {
                                        Temp_MRC_Bing[i].Song_CRC_Line = Temp_MRC_Bing[i].Song_CRC_Line.Insert(
                                            Temp_MRC_Bing[i].Song_CRC_Line.LastIndexOf(")") + 1
                                            , "\n");
                                    }

                                    if (Temp_MRC_Bing[i].Singer_Head_Image == null)
                                    {
                                        Temp_MRC_Bing[i].Singer_Head_Image = new Uri(Path_App + @"\Singer_Head\" +
                                            Temp_MRC_Bing[i].Song_CRC_Line.Substring(
                                                1, Temp_MRC_Bing[i].Song_CRC_Line.IndexOf(")") - 1
                                                )
                                            + ".jpg");
                                    }
                                }
                            }

                            
                        }
                        userControl_ListviewKrc_Panel.ListView_Temp_MRC.ItemsSource = Temp_MRC_Bing;

                        //获取Text的集合
                        ListBox_MRC_Song_MRC_Text = dao_ListBox_Temp_MRC.Return_ListBox_Temp_MRC_Text();
                        //获取Time的集合
                        ListBox_MRC_Song_MRC_Time = dao_ListBox_Temp_MRC.Return_ListBox_Temp_MRC_Time();

                        //生成歌曲第一句和最后一句的时间
                        //获取歌曲第一句的时间（毫秒）
                        Start_Song_MRC_Time = dao_ListBox_Temp_MRC.Return_Start_Song_MRC_Time();
                        //获取歌曲最后一句的时间（毫秒）
                        End_Song_MRC_Time = dao_ListBox_Temp_MRC.Return_End_Song_MRC_Time();

                        if (dao_ListBox_Temp_MRC.bool_lrc == true)
                        {
                            //获取分析完成的在 Dao_ListBox_Temp_MRC 内存储的 歌曲最后一句的时间（毫秒）
                            End_Song_MRC_Time = Convert.ToDouble(
                                    dao_ListBox_Temp_MRC.mrc_Line_Info[
                                        dao_ListBox_Temp_MRC.mrc_Line_Info.Count - 1].
                                        This_MRC_Start_Time
                                );

                            bool_lrc = true;
                        }
                        else
                        {

                            bool_lrc = false;
                        }


                        //歌词滚动
                        if (ListBox_MRC_Song_MRC_Time != null)
                        {
                            userControl_ListviewKrc_Panel.ListView_Temp_MRC.ScrollIntoView(userControl_ListviewKrc_Panel.ListView_Temp_MRC.Items[0]);//先滚动至第一行歌词              
                            //ListView_MRC.ScrollIntoView(ListView_MRC.Items[0]);//先滚动至第一行歌词             
                        }

                        //开启定时器，歌词同步           
                        DispatcherTimer_MRC.Start();

                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show("Error：生成树状结构(优化)\n" + ex.Message);
                        //获取mrc歌词失败，转而获取Lrc歌词

                        //停止歌词同步
                        DispatcherTimer_MRC.Stop();

                        ListBox_MRC_Song_MRC_Text = null;
                        ListBox_MRC_Song_MRC_Time = null;
                        Start_Song_MRC_Time = 0;
                        End_Song_MRC_Time = 0;
                    }
                }
                else
                {
                    
                }
            }
            catch
            {
                //获取mrc歌词失败，转而获取Lrc歌词

                //停止歌词同步
                DispatcherTimer_MRC.Stop();

                userControl_ListviewKrc_Panel.ListView_Temp_MRC.ItemsSource = null;

                ListBox_MRC_Song_MRC_Text = null;
                ListBox_MRC_Song_MRC_Time = null;
                Start_Song_MRC_Time = 0;
                End_Song_MRC_Time = 0;

            }
        }



        #endregion

        //MV与歌曲的歌词时间差
        double temp_Song_;
        bool Is_Chinese;

        #region 歌词行同步动画
        DispatcherTimer DispatcherTimer_MRC;
        int MRC_Line_Nums = 3;
        bool MRC_Sco = false;

        ListBoxItem myListBoxItem;
        ContentPresenter myContentPresenter;
        DataTemplate myDataTemplate;
        Storyboard myTextBlock_Storyboard;
        TextBlock myTextBlock_TextBlock;

        WrapPanel stackPanel_Byte_Lyic;
        int Before_Byte_Lyic;
        Storyboard storyboard_lyic = new Storyboard();
        Storyboard storyboard_lyic_desk = new Storyboard();
        private List<Storyboard> storyboardCollection = new List<Storyboard>(); // 存储当前正在播放的逐字动画（Plus升级版）
        private List<Storyboard> storyboardCollection_Desk = new List<Storyboard>(); // 存储多个Storyboard的集合
        /// <summary>
        /// 当userControl_ListviewKrc_Panel.ListView_Temp_MRC选中项发送改变时
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void ListView_Temp_MRC_ScrollIntoView(object sender, EventArgs e)
        {
            try
            {
                //释放此控件的内存，此控件大量使用会占用大量内存
                myTextBlock_TextBlock = null;
                GC.Collect();
                GC.WaitForPendingFinalizers();
                if (Environment.OSVersion.Platform == PlatformID.Win32NT)
                {
                    SetProcessWorkingSetSize(System.Diagnostics.Process.GetCurrentProcess().Handle, -1, -1);
                }

                bool Bool_Mrc_Animation = true;

                if (DispatcherTimer_MRC.IsEnabled)
                {
                    if (userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex != -1 && userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex < userControl_ListviewKrc_Panel.ListView_Temp_MRC.Items.Count)
                    {
                        Application.Current.Dispatcher.Invoke(() =>
                        {
                            MRC_Line_Nums = 0;

                            if (Bool_Mrc_Animation == true)
                            {
                                if (bool_lrc == false)
                                {
                                    //生成歌词提词同步动画
                                    if (ListBox_MRC_Song_MRC_Time[userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex] != 0)
                                    {

                                        int temp = dao_ListBox_Temp_MRC.mrc_Line_Info[userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums].This_MRC_Duration;
                                        //int temp = (int)(ListBox_MRC_Song_MRC_Time[userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex + 1] - ListBox_MRC_Song_MRC_Time[userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex]);


                                        if (myTextBlock_Storyboard != null)
                                            myTextBlock_Storyboard.Remove();//清空渐变过的歌词行颜色
                                        myListBoxItem =
                                            (ListBoxItem)(userControl_ListviewKrc_Panel.ListView_Temp_MRC.ItemContainerGenerator.ContainerFromIndex(userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex));
                                        if (myListBoxItem != null)
                                        {
                                            //查找并获取ListView选中项中的对象
                                            myContentPresenter = FindVisualChild<ContentPresenter>(myListBoxItem);
                                            if (myContentPresenter != null)
                                            {
                                                myDataTemplate = myContentPresenter.ContentTemplate;
                                                if (myDataTemplate != null)
                                                {
                                                    myTextBlock_Storyboard = (Storyboard)myDataTemplate.FindName("Text_Storyboard", myContentPresenter);
                                                    myTextBlock_TextBlock = (TextBlock)myDataTemplate.FindName("Text_TextBlock", myContentPresenter);
                                                    myTextBlock_TextBlock.Visibility = Visibility.Collapsed;
                                                    myTextBlock_TextBlock = null;
                                                    //
                                                    stackPanel_Byte_Lyic = (WrapPanel)myDataTemplate.FindName("StackPanel_Lyic", myContentPresenter);
                                                }
                                            }
                                        }

                                        //歌词逐字算法 Plus最终版
                                        //
                                        stackPanel_Byte_Lyic.Children.Clear();
                                        DoubleAnimationUsingKeyFrames doubleAnimationUsingKeyFrames = new DoubleAnimationUsingKeyFrames();
                                        //
                                        List<UserControl_Mrc_Byte> userControl_Mrc_Bytes = new List<UserControl_Mrc_Byte>();
                                        for (int i = 0; i < dao_ListBox_Temp_MRC.mrc_Line_Info[userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums].
                                            Array_Morebyte_Text.Count; i++)
                                        {
                                            int temp_BeginTime = Convert.ToInt16(
                                                            dao_ListBox_Temp_MRC.mrc_Line_Info
                                                                [userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex
                                                                    - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                        .Array_Morebyte_BeginTime[i]);//此字符开始时间
                                            int temp_Duration = Convert.ToInt16(
                                                            dao_ListBox_Temp_MRC.mrc_Line_Info
                                                                [userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex
                                                                    - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                        .Array_Morebyte_Duration[i]);//此字符持续时间

                                            int temp_WaitTime = 0;                  //判别动画是否有停顿
                                            if (i != dao_ListBox_Temp_MRC.mrc_Line_Info
                                                [userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex
                                                    - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                        .Int_MoreByte_Nums - 1//if  i != Array_Morebyte_BeginTime的最后一位（防止数组越界）
                                                && temp_BeginTime + temp_Duration != //if  此动画的开始时间+持续时间 != 下一段动画的开始时间
                                                            Convert.ToInt16(dao_ListBox_Temp_MRC.mrc_Line_Info
                                                                [userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex
                                                                    - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                                        .Array_Morebyte_BeginTime[i + 1]))
                                            {
                                                temp_WaitTime = Convert.ToInt16(
                                                                    dao_ListBox_Temp_MRC.mrc_Line_Info
                                                                        [userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex
                                                                            - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                                        .Array_Morebyte_BeginTime[i + 1]
                                                                        )
                                                                    -
                                                                (temp_BeginTime + temp_Duration);//动画停顿的时间
                                            }

                                            #region 1111111
                                            UserControl_Mrc_Byte mrc_Byte_ = new UserControl_Mrc_Byte();
                                            //设置文本
                                            mrc_Byte_.TextBlock_1.FontSize = 18;//34
                                            mrc_Byte_.TextBlock_1.FontWeight = FontWeights.Black;
                                            mrc_Byte_.TextBlock_1.Text = dao_ListBox_Temp_MRC.mrc_Line_Info[userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums].
                                                Array_Morebyte_Text[i].ToString();
                                            /*GradientStop gradientStop = (GradientStop)mrc_Byte_.TextBlock_1.FindName("GradientStop_Background");
                                            gradientStop.Color = Colors.White;*/
                                            //mrc_Byte_.TextBlock_1.Effect = null;

                                            //设置动画
                                            Storyboard storyboard = (Storyboard)mrc_Byte_.TextBlock_1.FindName("Text_Storyboard");
                                            storyboard.Duration = new Duration(new TimeSpan(0, 0, 0, 0, temp_Duration + temp_WaitTime));
                                            //
                                            doubleAnimationUsingKeyFrames = (DoubleAnimationUsingKeyFrames)mrc_Byte_.TextBlock_1.FindName("Text_DoubleAnimation");
                                            doubleAnimationUsingKeyFrames.KeyFrames.Clear();
                                            //
                                            LinearDoubleKeyFrame linearDoubleKeyFrame = new LinearDoubleKeyFrame();
                                            linearDoubleKeyFrame.Value = 0.51;
                                            linearDoubleKeyFrame.KeyTime = new TimeSpan(0, 0, 0, 0, Convert.ToInt16(temp_Duration));
                                            doubleAnimationUsingKeyFrames.KeyFrames.Add(linearDoubleKeyFrame);
                                            //
                                            //判别动画是否有停顿
                                            if (temp_WaitTime > 0)
                                            {
                                                LinearDoubleKeyFrame linearDoubleKeyFrame_Pause = new LinearDoubleKeyFrame();//用以实现停顿
                                                linearDoubleKeyFrame_Pause.Value = 0.51;
                                                linearDoubleKeyFrame_Pause.KeyTime = new TimeSpan(0, 0, 0, 0, Convert.ToInt16(
                                                    temp_WaitTime
                                                    ));

                                                doubleAnimationUsingKeyFrames.KeyFrames.Add(linearDoubleKeyFrame_Pause);
                                            }
                                            #endregion

                                            //userControl_Mrc_Bytes.Add(mrc_Byte);
                                            mrc_Byte_.Margin = new Thickness(0);

                                            stackPanel_Byte_Lyic.Children.Add(mrc_Byte_);
                                        }
                                        //启动动画
                                        try
                                        {
                                            if (stackPanel_Byte_Lyic != null)
                                            {
                                                BindAnimationCompleted(stackPanel_Byte_Lyic.Children);
                                            }

                                            MRC_Sco = true;
                                        }
                                        catch { MRC_Sco = false; }


                                        

                                        //开启歌词 动态 时长分配
                                        string Mrc_Line_To_TwoLine = dao_ListBox_Temp_MRC.Return_ListBox_Temp_MRC_Bing(CRC_URL)[
                                            userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex
                                            ].Song_CRC_Line;
                                        if (Mrc_Line_To_TwoLine != null)
                                        {
                                            if (Mrc_Line_To_TwoLine.IndexOf("(") >= 0)
                                            {
                                                Mrc_Line_To_TwoLine = Mrc_Line_To_TwoLine.Replace("\n", "");
                                                Mrc_Line_To_TwoLine =
                                                    Mrc_Line_To_TwoLine.Substring(0, Mrc_Line_To_TwoLine.IndexOf("(")) + "\n" +
                                                    Mrc_Line_To_TwoLine.Substring(Mrc_Line_To_TwoLine.IndexOf("("));
                                            }

                                            Find_Singer_Name_To_Dynamic_Allocation(Mrc_Line_To_TwoLine, doubleAnimationUsingKeyFrames.Duration.TimeSpan);
                                        }
                                        


                                        //初始化上一个颜色的字体和渐变
                                        //
                                        if (Before_Byte_Lyic > -1)
                                        {
                                            myListBoxItem =
                                                (ListBoxItem)(userControl_ListviewKrc_Panel.ListView_Temp_MRC.ItemContainerGenerator.ContainerFromIndex(Before_Byte_Lyic));
                                            if (myListBoxItem != null)
                                            {
                                                //查找并获取ListView选中项中的对象
                                                myContentPresenter = FindVisualChild<ContentPresenter>(myListBoxItem);
                                                if (myContentPresenter != null)
                                                {
                                                    myDataTemplate = myContentPresenter.ContentTemplate;
                                                    if (myDataTemplate != null)
                                                    {
                                                        stackPanel_Byte_Lyic = (WrapPanel)myDataTemplate.FindName("StackPanel_Lyic", myContentPresenter);
                                                        myTextBlock_TextBlock = (TextBlock)myDataTemplate.FindName("Text_TextBlock", myContentPresenter);
                                                        myTextBlock_TextBlock.Visibility = Visibility.Visible;
                                                        myTextBlock_TextBlock = null;

                                                        stackPanel_Byte_Lyic.Children.Clear();
                                                        stackPanel_Byte_Lyic = null;

                                                        Temp_MRC_Bing[Before_Byte_Lyic].Singer_Head_Image_Show = Visibility.Collapsed;
                                                    }
                                                }
                                            }
                                        }
                                        Before_Byte_Lyic = userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex;


                                        
                                    }
                                }
                                else
                                {
                                    MRC_Sco = true;
                                }
                            }
                            else//不开启逐字
                            {
                                MRC_Sco = true;
                            }
                            Foreable_Change_Hidden();

                            //歌词滚动
                            if (MRC_Sco)
                            {
                                if (userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex > 5 &&
                                        userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex < userControl_ListviewKrc_Panel.ListView_Temp_MRC.Items.Count - 3
                                    )
                                {
                                    userControl_ListviewKrc_Panel.ListView_Temp_MRC.ScrollIntoView(
                                        userControl_ListviewKrc_Panel.ListView_Temp_MRC.Items[
                                            userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex + MRC_Line_Nums
                                            ]
                                    );//移动到指定行
                                }
                            }

                        });
                    }
                }
            }
            catch { }
        }

        private object Obj { get; } = new object();
        private void BindAnimationCompleted(UIElementCollection controls)
        {
            storyboardCollection.Clear();
            lock (Obj)
            {
                foreach (UIElement control in controls)
                {
                    UserControl_Mrc_Byte userControl_Mrc_Byte = control as UserControl_Mrc_Byte;
                    if (userControl_Mrc_Byte != null)
                    {
                        Storyboard storyboard = (Storyboard)userControl_Mrc_Byte.TextBlock_1.FindName("Text_Storyboard");
                        if (storyboard != null)
                        {
                            storyboardCollection.Add(storyboard);

                            storyboard.Completed += (sender, e) =>
                            {
                                // 当前动画播放完成后，处理下一个动画
                                int nextIndex = storyboardCollection.IndexOf(storyboard) + 1;
                                if (nextIndex < storyboardCollection.Count)
                                {
                                    storyboard_lyic = storyboardCollection[nextIndex];
                                    storyboardCollection[nextIndex].Begin();
                                }
                                else
                                {
                                    Clear_Current_Singer_Info();
                                }
                            };
                        }
                    }
                }


                UserControl_Mrc_Byte userControl_Mrc_Byte1 = (UserControl_Mrc_Byte)controls[0];
                Storyboard storyboard1 = (Storyboard)userControl_Mrc_Byte1.TextBlock_1.FindName("Text_Storyboard");
                storyboard1.Begin();
            }
        }
        private void BindAnimationCompleted_Desk(UIElementCollection controls)
        {
            storyboardCollection_Desk.Clear();
            lock (Obj)
            {
                foreach (UIElement control in controls)
                {
                    UserControl_Mrc_Byte userControl_Mrc_Byte = control as UserControl_Mrc_Byte;
                    if (userControl_Mrc_Byte != null)
                    {
                        Storyboard storyboard = (Storyboard)userControl_Mrc_Byte.TextBlock_1.FindName("Text_Storyboard");
                        if (storyboard != null)
                        {
                            storyboardCollection_Desk.Add(storyboard);

                            storyboard.Completed += (sender, e) =>
                            {
                                // 当前动画播放完成后，处理下一个动画
                                int nextIndex = storyboardCollection_Desk.IndexOf(storyboard) + 1;
                                if (nextIndex < storyboardCollection_Desk.Count)
                                {
                                    storyboard_lyic_desk = storyboardCollection_Desk[nextIndex];
                                    storyboardCollection_Desk[nextIndex].Begin();
                                }
                            };
                        }
                    }
                }

                UserControl_Mrc_Byte userControl_Mrc_Byte1 = (UserControl_Mrc_Byte)controls[0];
                Storyboard storyboard1 = (Storyboard)userControl_Mrc_Byte1.TextBlock_1.FindName("Text_Storyboard");
                storyboard1.Begin();
            }
        }

        private void Foreable_Change_Hidden()
        {
            int line_count = 0;
            string[] colors = new string[] { "50FFFFFF", "70FFFFFF", "98FFFFFF", "98FFFFFF", "70FFFFFF", "50FFFFFF", "50FFFFFF" };
            ListBoxItem myListBoxItem = null;
            for (int i = userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex - 3; i < userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex + 4; i++)
            {
                if (i != userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex && i >= 0 && i < userControl_ListviewKrc_Panel.ListView_Temp_MRC.Items.Count)
                {
                    myListBoxItem = (ListBoxItem)(userControl_ListviewKrc_Panel.ListView_Temp_MRC.ItemContainerGenerator.ContainerFromIndex(i));

                    if (myListBoxItem != null)
                    {
                        ContentPresenter myContentPresenter = FindVisualChild<ContentPresenter>(myListBoxItem);

                        if (myContentPresenter != null)
                        {
                            DataTemplate myDataTemplate = myContentPresenter.ContentTemplate;

                            if (myDataTemplate != null)
                            {
                                TextBlock myTextBlock_TextBlock = (TextBlock)myDataTemplate.FindName("Text_TextBlock", myContentPresenter);
                                myTextBlock_TextBlock.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#" + colors[line_count]));
                                myTextBlock_TextBlock = null;
                                //
                                TextBlock myTextBlock_TextBlock_1 = (TextBlock)myDataTemplate.FindName("Text_TextBlock_1", myContentPresenter);
                                myTextBlock_TextBlock_1.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#" + colors[line_count]));
                                myTextBlock_TextBlock_1 = null;

                                line_count++;
                            }
                        }
                    }
                }
            }

            myListBoxItem = (ListBoxItem)(userControl_ListviewKrc_Panel.ListView_Temp_MRC.ItemContainerGenerator.ContainerFromIndex(userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex));
            if (myListBoxItem != null)
            {
                ContentPresenter myContentPresenter = FindVisualChild<ContentPresenter>(myListBoxItem);

                if (myContentPresenter != null)
                {
                    DataTemplate myDataTemplate = myContentPresenter.ContentTemplate;

                    if (myDataTemplate != null)
                    {
                        TextBlock myTextBlock_TextBlock = (TextBlock)myDataTemplate.FindName("Text_TextBlock", myContentPresenter);
                        myTextBlock_TextBlock.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FFFFFF"));
                        myTextBlock_TextBlock = null;
                        //
                        TextBlock myTextBlock_TextBlock_1 = (TextBlock)myDataTemplate.FindName("Text_TextBlock_1", myContentPresenter);
                        myTextBlock_TextBlock_1.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FFFFFF"));
                        myTextBlock_TextBlock_1 = null;
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
        #endregion


        #region 歌词行同步

        public void Media_Song_MRC_Play_Tick(object sender, EventArgs e)
        {
            //使用双区间来判定同步当前音频文件时间信息所处歌词时间信息的位置
            //0有时访问不到
            if (ListBox_MRC_Song_MRC_Time != null)
            {
                if (userControl_MediaMV.MediaMent_MV.Position.TotalMilliseconds <= Start_Song_MRC_Time + temp_Song_)
                {
                    for (int i = 0; i < ListBox_MRC_Song_MRC_Time.Count; i++)
                        if (ListBox_MRC_Song_MRC_Time[i] != 0)
                        {
                            if (userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex != i)
                                userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex = i;

                            break;
                        }
                }
                else if (userControl_MediaMV.MediaMent_MV.Position.TotalMilliseconds >= End_Song_MRC_Time + temp_Song_)
                {
                    for (int i = ListBox_MRC_Song_MRC_Time.Count - 1; i >= 0; i--)
                        if (ListBox_MRC_Song_MRC_Time[i] != 0)
                        {
                            if (userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex != i)
                                userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex = i;

                            break;
                        }
                }
                else
                {
                    for (int i = 7; i < ListBox_MRC_Song_MRC_Time.Count; i++)
                        if (ListBox_MRC_Song_MRC_Time[i] != 0)
                            if (userControl_MediaMV.MediaMent_MV.Position.TotalMilliseconds >= ListBox_MRC_Song_MRC_Time[i] + temp_Song_)
                                if (userControl_MediaMV.MediaMent_MV.Position.TotalMilliseconds < ListBox_MRC_Song_MRC_Time[i + 1] + temp_Song_)
                                {
                                    if (userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex != i)
                                        userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex = i;

                                    break;
                                }
                }
            }
            else
            {
                DispatcherTimer_MRC.Stop();
            }
        }



        #endregion


        #endregion


        #region 歌词同步_时长分配_动态分配算法

        ArrayList Singer_Name;
        ArrayList Singer_Description = new ArrayList();
        UserControl_ListviewItem_SingerKrc userControl_ListviewItem_SingerKrc;
        /// <summary>
        /// 时长分配_动态分配算法_初始化
        /// </summary>
        public void Init_Dynamic_Allocation()
        {
            Singer_Name = userControl_SingerKrcSinging_Panel.Singer_Name;
        }
        /// <summary>
        /// 设置并启动时长分配动画
        /// </summary>
        /// <param name="singer_name"></param>
        /// <param name="doubleAnimationUsingKeyFrames"></param>
        public void Find_Singer_Name_To_Dynamic_Allocation(string singer_name, TimeSpan timeSpan)
        {
            Clear_Current_Singer_Info();

            //没有进入合唱 时长分配
            if (singer_name.IndexOf(Singer_Name[Singer_Name.Count - 1].ToString()) < 0)//匹配最后一位成功，最后一位是组合名
            {
                //检查此歌词内含有的歌手名，并添加至Singer_Description
                for (int i = 0; i < Singer_Name.Count; i++)
                {
                    if (singer_name.IndexOf(Singer_Name[i].ToString()) >= 0)
                    {
                        Singer_Description.Add(Singer_Name[i].ToString());
                        singer_name = singer_name.Replace(Singer_Name[i].ToString(), "");
                    }
                }

                foreach (var item in Singer_Description)
                {
                    foreach (UserControl_ListviewItem_SingerKrc singerkrc in userControl_SingerKrcSinging_Panel.ListBox_Items_SingerKrc_Animation.Children)
                    {
                        if (singerkrc.textBlock_SingerName.Text.IndexOf( item.ToString() ) >= 0)
                        {
                            singerkrc.Timer_To_Pause_Text_Storyboard_slider_Up(timeSpan);

                            singerkrc.stopwatch_Singer_Singing_Time_Text.Start();//开启秒表类
                            singerkrc.dispatcherTimer_Singer_Singing_Time_Text.Start();
                            singerkrc.Text_Storyboard_slider_Up.Resume();

                            singerkrc.Border_Singer_Image_Current_Play.Visibility = Visibility.Visible;
                            singerkrc.textBlock_SingerName.Foreground = (SolidColorBrush)new BrushConverter().ConvertFrom("#B71110");
                        }
                    }
                }

            }
            else//启动全体时长匹配
            {
                for (int i = 0; i < userControl_SingerKrcSinging_Panel.ListBox_Items_SingerKrc_Animation.Children.Count; i++)
                {
                    userControl_ListviewItem_SingerKrc =
                        userControl_SingerKrcSinging_Panel.ListBox_Items_SingerKrc_Animation.Children[i] as UserControl_ListviewItem_SingerKrc;

                    //传入动画时间，定时关闭Slider动画
                    userControl_ListviewItem_SingerKrc.Timer_To_Pause_Text_Storyboard_slider_Up(timeSpan);
                    //开启Slider动画
                    userControl_ListviewItem_SingerKrc.stopwatch_Singer_Singing_Time_Text.Start();//开启秒表类
                    userControl_ListviewItem_SingerKrc.dispatcherTimer_Singer_Singing_Time_Text.Start();
                    userControl_ListviewItem_SingerKrc.Text_Storyboard_slider_Up.Resume();

                    userControl_ListviewItem_SingerKrc.Border_Singer_Image_Current_Play.Visibility = Visibility.Visible;
                    userControl_ListviewItem_SingerKrc.textBlock_SingerName.Foreground = (SolidColorBrush)new BrushConverter().ConvertFrom("#B71110");
                }
            }

            Temp_MRC_Bing[userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex].Singer_Head_Image_Show = Visibility.Visible;
        }

        private void Clear_Current_Singer_Info()
        {
            //清除数据
            Singer_Description.Clear();

            for (int i = 0; i < userControl_SingerKrcSinging_Panel.ListBox_Items_SingerKrc_Animation.Children.Count; i++)
            {
                UserControl_ListviewItem_SingerKrc userControl_ListviewItem_SingerKrc =
                    userControl_SingerKrcSinging_Panel.ListBox_Items_SingerKrc_Animation.Children[i] as UserControl_ListviewItem_SingerKrc;

                userControl_ListviewItem_SingerKrc.stopwatch_Singer_Singing_Time_Text.Stop();
                userControl_ListviewItem_SingerKrc.Text_Storyboard_slider_Up.Pause();
                userControl_ListviewItem_SingerKrc.Border_Singer_Image_Current_Play.Visibility = Visibility.Collapsed;
                userControl_ListviewItem_SingerKrc.textBlock_SingerName.Foreground = (SolidColorBrush)new BrushConverter().ConvertFrom("#FFFFFF");

                userControl_ListviewItem_SingerKrc.stopwatch_Singer_Singing_Time_Text.Stop();
                userControl_ListviewItem_SingerKrc.dispatcherTimer_Singer_Singing_Time_Text.Stop();
                userControl_ListviewItem_SingerKrc.Text_Storyboard_slider_Up.Pause();
            }

            Temp_MRC_Bing[Before_Byte_Lyic].Singer_Head_Image_Show = Visibility.Collapsed;

            /*if (Singer_No_To_Animation == -1)
            {
                for (int i = 0; i < userControl_SingerKrcSinging_Panel.ListBox_Items_SingerKrc_Animation.Children.Count; i++)
                {
                    UserControl_ListviewItem_SingerKrc userControl_ListviewItem_SingerKrc =
                        userControl_SingerKrcSinging_Panel.ListBox_Items_SingerKrc_Animation.Children[i] as UserControl_ListviewItem_SingerKrc;

                    userControl_ListviewItem_SingerKrc.stopwatch_Singer_Singing_Time_Text.Stop();
                    userControl_ListviewItem_SingerKrc.Text_Storyboard_slider_Up.Pause();
                    userControl_ListviewItem_SingerKrc.Border_Singer_Image_Current_Play.Visibility = Visibility.Collapsed;
                    userControl_ListviewItem_SingerKrc.textBlock_SingerName.Foreground = (SolidColorBrush)new BrushConverter().ConvertFrom("#FFFFFF");

                    userControl_ListviewItem_SingerKrc.stopwatch_Singer_Singing_Time_Text.Stop();
                    userControl_ListviewItem_SingerKrc.dispatcherTimer_Singer_Singing_Time_Text.Stop();
                    userControl_ListviewItem_SingerKrc.Text_Storyboard_slider_Up.Pause();
                }
            }
            else
            {
                for (int i = 0; i < userControl_SingerKrcSinging_Panel.ListBox_Items_SingerKrc_Animation.Children.Count; i++)
                {
                    if (i == Singer_No_To_Animation)
                    {
                        UserControl_ListviewItem_SingerKrc userControl_ListviewItem_SingerKrc =
                            userControl_SingerKrcSinging_Panel.ListBox_Items_SingerKrc_Animation.Children[i] as UserControl_ListviewItem_SingerKrc;

                        userControl_ListviewItem_SingerKrc.stopwatch_Singer_Singing_Time_Text.Stop();
                        userControl_ListviewItem_SingerKrc.Text_Storyboard_slider_Up.Pause();
                        userControl_ListviewItem_SingerKrc.Border_Singer_Image_Current_Play.Visibility = Visibility.Collapsed;
                        userControl_ListviewItem_SingerKrc.textBlock_SingerName.Foreground = (SolidColorBrush)new BrushConverter().ConvertFrom("#FFFFFF");

                        userControl_ListviewItem_SingerKrc.stopwatch_Singer_Singing_Time_Text.Stop();
                        userControl_ListviewItem_SingerKrc.dispatcherTimer_Singer_Singing_Time_Text.Stop();
                        userControl_ListviewItem_SingerKrc.Text_Storyboard_slider_Up.Pause();
                    }
                }
            }*/
        }
        #endregion

        private void DispatcherTimer_Sort_Of_Singing_Time_Tick(object? sender, EventArgs e)
        {
            userControl_SingerKrcSinging_Panel.Move_Top();
        }
    }
}
