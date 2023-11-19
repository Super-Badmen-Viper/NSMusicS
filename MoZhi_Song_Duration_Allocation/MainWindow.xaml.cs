using MoZhi_Song_Duration_Allocation.UserControlLibrary.MainWindow_Buttom_SingerKrcSinging_Panel.UserControl_ListviewItem_SingerKrc;
using MoZhi_Song_Duration_Allocation.Dao_UserControl.Song_Mrc_Info;
using MoZhi_Song_Duration_Allocation.UserControlLibrary.MainWindow_Buttom_SingerKrcSinging_Panel;
using MoZhi_Song_Duration_Allocation.UserControlLibrary.MainWindow_Buttom_SingerKrcSinging_Panel.UserControl_ListviewItem_SingerKrc;
using MoZhi_Song_Duration_Allocation.UserControlLibrary.MainWindow_Middle_Silder;
using MoZhi_Song_Duration_Allocation.UserControlLibrary.MainWindow_Top_MediaMV;
using MoZhi_Song_Duration_Allocation.UserControlLibrary.MainWindow_Top_MediaMV.UserControl_Media_ButtomSilderPanel;
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

            DoubleAnimation doubleAnimation = new DoubleAnimation();
            doubleAnimation.From = 0;
            doubleAnimation.To = 540;
            doubleAnimation.Duration = new Duration(TimeSpan.FromMilliseconds(1800));
            doubleAnimation.Completed += DoubleAnimation_Completed;
            userControl_MediaMV.BeginAnimation(UserControl.HeightProperty, doubleAnimation);

            /*DoubleAnimation temp = new DoubleAnimation();
            temp.From = 0;
            temp.To = 438;
            temp.Duration = new Duration(TimeSpan.FromMilliseconds(2000));
            userControl_ListviewKrc_Panel.BeginAnimation(UserControl.WidthProperty, temp);
            temp.From = 0;
            temp.To = 200;
            temp.Duration = new Duration(TimeSpan.FromMilliseconds(800));
            userControl_SingerKrcSinging_Panel.BeginAnimation(UserControl.WidthProperty, temp);*/
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
            temp_Song_ = -200;// 5000,-1000:OB  0:Lotto  

            userControl_MediaMV.MediaMent_MV.Play();
            userControl_MediaMV.MediaMent_MV.LoadedBehavior = MediaState.Play;

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
                    userControl_ListviewKrc_Panel.ListView_Temp_MRC.ItemsSource = dao_ListBox_Temp_MRC.Return_ListBox_Temp_MRC_Bing(CRC_URL);
                    userControl_ListviewKrc_Panel.ListView_Temp_MRC_Temp.ItemsSource = dao_ListBox_Temp_MRC.Return_ListBox_Temp_MRC_Bing(CRC_URL);

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
                        userControl_ListviewKrc_Panel.ListView_Temp_MRC.ScrollIntoView(userControl_ListviewKrc_Panel.ListView_Temp_MRC.Items[0]);//先滚动至第一行歌词              
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
                    userControl_ListviewKrc_Panel.ListView_Temp_MRC.ItemsSource = null;
                    userControl_ListviewKrc_Panel.ListView_Temp_MRC_Temp.ItemsSource = null;

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
                userControl_ListviewKrc_Panel.ListView_Temp_MRC.ItemsSource = null;
                userControl_ListviewKrc_Panel.ListView_Temp_MRC_Temp.ItemsSource = null;

                ListBox_MRC_Song_MRC_Text = null;
                ListBox_MRC_Song_MRC_Time = null;
                Start_Song_MRC_Time = 0;
                End_Song_MRC_Time = 0;

            }
        }



        #endregion

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
        /// 当userControl_ListviewKrc_Panel.ListView_Temp_MRC选中项发送改变时
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void ListView_Temp_MRC_ScrollIntoView(object sender, EventArgs e)
        {
            if (DispatcherTimer_MRC.IsEnabled)
            {
                if (userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex != -1 && userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex < userControl_ListviewKrc_Panel.ListView_Temp_MRC.Items.Count)
                {
                    MRC_Line_Nums = 0;

                    thread_ListView_Temp_MRC_ScrollIntoView = new Thread(new ThreadStart(() => {
                        Dispatcher.BeginInvoke(new Action(delegate () {
                            userControl_ListviewKrc_Panel.ListView_Temp_MRC.ScrollIntoView(userControl_ListviewKrc_Panel.ListView_Temp_MRC.Items[userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex + MRC_Line_Nums]);//移动到指定行                   
                        }));
                    }));
                    thread_ListView_Temp_MRC_ScrollIntoView.Priority = ThreadPriority.Lowest;
                    thread_ListView_Temp_MRC_ScrollIntoView.Start();


                    //生成歌词提词同步动画
                    if (ListBox_MRC_Song_MRC_Time[userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex] != 0)
                    {
                        try
                        {
                            int temp = dao_ListBox_Temp_MRC.MRC_Line_Info[userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums].This_MRC_Duration;
                            //int temp = (int)(ListBox_MRC_Song_MRC_Time[userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex + 1] - ListBox_MRC_Song_MRC_Time[userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex]);


                            if (myTextBlock_Storyboard != null)
                                myTextBlock_Storyboard.Remove();//清空渐变过的歌词行颜色
                            myListBoxItem =
                                (ListBoxItem)(userControl_ListviewKrc_Panel.ListView_Temp_MRC.ItemContainerGenerator.ContainerFromIndex(userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex));
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
                                for (int i = 0; i < dao_ListBox_Temp_MRC.MRC_Line_Info[userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                    .Int_MoreByte_Nums; i++)
                                {
                                    double temp_double = Convert.ToDouble(MeasureString(dao_ListBox_Temp_MRC.MRC_Line_Info[userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                    .Array_Morebyte_Text[i].ToString()));
                                    Sum_Values_temp += temp_double;//每个字符相加_>的总长度
                                    Values_temp.Add(temp_double);//每个字符的物理长度
                                }

                                //状态，是否停顿
                                bool null_time = false;
                                //获取歌词字符统一间距的比率
                                double ALL_Byte_Width = Math.Round(Convert.ToDouble(1.0 / Sum_Values_temp), 6);
                                //获取每个字符同步时动画所移动的距离
                                ArrayList ALL_Byte_Values = new ArrayList();
                                for (int i = 0; i < dao_ListBox_Temp_MRC.MRC_Line_Info[userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                    .Int_MoreByte_Nums; i++)
                                {
                                    int temp_BeginTime = Convert.ToInt16(
                                        dao_ListBox_Temp_MRC.MRC_Line_Info
                                            [userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex
                                                - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                    .Array_Morebyte_BeginTime[i]);//此字符开始时间
                                    int temp_Duration = Convert.ToInt16(
                                        dao_ListBox_Temp_MRC.MRC_Line_Info
                                            [userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex
                                                - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                    .Array_Morebyte_Duration[i]);//此字符持续时间  （不包含空白时间段） 待优化

                                    if (null_time == true)
                                    {
                                        ALL_Byte_Values.Add(0);
                                        null_time = false;
                                    }

                                    //判别动画是否有停顿
                                    if (i != dao_ListBox_Temp_MRC.MRC_Line_Info
                                        [userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex
                                            - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                .Int_MoreByte_Nums - 1//if  i != Array_Morebyte_BeginTime的最后一位（防止数组越界）
                                        &&
                                        temp_BeginTime + temp_Duration !=
                                        Convert.ToInt16(dao_ListBox_Temp_MRC.MRC_Line_Info
                                            [userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex
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
                                        [userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex
                                            - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                .Int_MoreByte_Nums; //歌词字符总数
                                    i++)
                                {
                                    int temp_BeginTime = Convert.ToInt16(
                                        dao_ListBox_Temp_MRC.MRC_Line_Info
                                            [userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex
                                                - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                    .Array_Morebyte_BeginTime[i]);//此字符开始时间
                                    int temp_Duration = Convert.ToInt16(
                                        dao_ListBox_Temp_MRC.MRC_Line_Info
                                            [userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex
                                                - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                    .Array_Morebyte_Duration[i]);//此字符持续时间  （不包含空白时间段） 待优化                          

                                    if (null_time == true)
                                    {
                                        timeSpan_nums.Add(":" + temp_null_time);// : 作为动画停顿标记
                                        null_time = false;
                                    }
                                    //判别动画是否有停顿
                                    if (i != dao_ListBox_Temp_MRC.MRC_Line_Info
                                        [userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex
                                            - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                .Int_MoreByte_Nums - 1//if  i != Array_Morebyte_BeginTime的最后一位（防止数组越界）
                                        &&
                                        temp_BeginTime + temp_Duration !=
                                        Convert.ToInt16(dao_ListBox_Temp_MRC.MRC_Line_Info
                                            [userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex
                                                - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                    .Array_Morebyte_BeginTime[i + 1]))//if 动画时间 中间有 空白时间（动画停顿）
                                    {
                                        temp_null_time = Convert.ToInt16(dao_ListBox_Temp_MRC.MRC_Line_Info
                                            [userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex
                                                - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                    .Array_Morebyte_BeginTime[i + 1])
                                                    - (temp_BeginTime + temp_Duration);//动画停顿的时间
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

                                        if (i != dao_ListBox_Temp_MRC.MRC_Line_Info[userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums].Int_MoreByte_Nums - 1)
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

                                //MV歌词                                
                                TextBlock_Mrc_Line.Text = myTextBlock_TextBlock.Text;
                                //动画进度设置为0
                                linearDoubleKeyFrame = new LinearDoubleKeyFrame();
                                linearDoubleKeyFrame.Value = -0.5;
                                linearDoubleKeyFrame.KeyTime = new TimeSpan(0, 0, 0, 0, 0);
                                myTextBlock_DoubleAnimationUsingKeyFrames.KeyFrames.Add(linearDoubleKeyFrame);

                                Text_DoubleAnimation.KeyFrames = myTextBlock_DoubleAnimationUsingKeyFrames.KeyFrames;
                                //开启歌词 动态 时长分配
                                

                                //开启动画                              
                                thread_myTextBlock_Storyboard = new Thread(new ThreadStart(() =>
                                {
                                    Dispatcher.BeginInvoke(new Action(delegate ()
                                    {
                                        string Mrc_Line_To_TwoLine = TextBlock_Mrc_Line.Text;
                                        if (Mrc_Line_To_TwoLine.IndexOf("(") >= 0)
                                        {
                                            Mrc_Line_To_TwoLine = Mrc_Line_To_TwoLine.Replace("\n", "");
                                            Mrc_Line_To_TwoLine =
                                                Mrc_Line_To_TwoLine.Substring(0, Mrc_Line_To_TwoLine.IndexOf("(")) + "\n" +
                                                Mrc_Line_To_TwoLine.Substring(Mrc_Line_To_TwoLine.IndexOf("("))                            ;               
                                        }

                                        Find_Singer_Name_To_Dynamic_Allocation(
                                        Mrc_Line_To_TwoLine,
                                        myTextBlock_DoubleAnimationUsingKeyFrames//传递动画至  时长分配动画
                                    );
                                    }));
                                }));
                                thread_myTextBlock_Storyboard.Priority = ThreadPriority.Highest;
                                thread_myTextBlock_Storyboard.Start();

                                //********************************************************Text_Storyboard.Completed += Text_Storyboard_Completed_userControl_ListviewItem_SingerKrc;
                                //开启动画
                                //降低Bitmapscalingmode，加速图像渲染
                                RenderOptions.SetBitmapScalingMode(myTextBlock_Storyboard, BitmapScalingMode.LowQuality);
                                RenderOptions.SetBitmapScalingMode(Text_Storyboard, BitmapScalingMode.LowQuality);

                                myTextBlock_Storyboard.Begin();
                                TextBlock_Mrc_Line.Visibility = Visibility.Visible;//动画完成后显示歌词
                                Text_Storyboard.Begin();
                            }
                        }
                        catch { }
                    }
                }
            }
        }

        private void Text_Storyboard_Completed(object sender, EventArgs e)
        {
            TextBlock_Mrc_Line.Visibility = Visibility.Hidden;//动画完成后关闭歌词
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

        #endregion

        //MV与歌曲的歌词时间差
        double temp_Song_;
        bool Is_Chinese;
        #region 歌词行同步

        public void Media_Song_MRC_Play_Tick(object sender, EventArgs e)
        {
            //使用双区间来判定同步当前音频文件时间信息所处歌词时间信息的位置
            //0有时访问不到
            if (ListBox_MRC_Song_MRC_Time != null)
            {
                if (userControl_MediaMV.MediaMent_MV.Position.TotalMilliseconds <= Start_Song_MRC_Time + temp_Song_)
                {
                    for (int i = 0; i < ListBox_MRC_Song_MRC_Time.Length; i++)
                        if (ListBox_MRC_Song_MRC_Time[i] != 0)
                        {
                            if (userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex != i)
                                userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex = i;

                            break;
                        }
                }
                else if (userControl_MediaMV.MediaMent_MV.Position.TotalMilliseconds >= End_Song_MRC_Time + temp_Song_)
                {
                    for (int i = ListBox_MRC_Song_MRC_Time.Length - 1; i >= 0; i--)
                        if (ListBox_MRC_Song_MRC_Time[i] != 0)
                        {
                            if (userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex != i)
                                userControl_ListviewKrc_Panel.ListView_Temp_MRC.SelectedIndex = i;

                            break;
                        }
                }
                else
                {
                    for (int i = 7; i < ListBox_MRC_Song_MRC_Time.Length; i++)
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



        #endregion


        #endregion


        #region 歌词同步_时长分配_动态分配算法

        int Singer_No_To_Animation = 0;
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
        public void Find_Singer_Name_To_Dynamic_Allocation(string singer_name, DoubleAnimationUsingKeyFrames doubleAnimationUsingKeyFrames)
        {
            if(Singer_No_To_Animation == -1)
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
            }
            else
            {
                //清除数据
                Singer_Description.Clear();
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
            }

            string Mrc_Line = singer_name;

            //没有进入合唱 时长分配
            if (singer_name.IndexOf(Singer_Name[Singer_Name.Count - 1].ToString()) < 0)//匹配最后一位成功，最后一位是组合名
            {
                //检查此歌词内含有的歌手名，并添加至Singer_Description
                for (int i = 0; i < userControl_SingerKrcSinging_Panel.ListBox_Items_SingerKrc_Animation.Children.Count; i++)
                {
                    if (singer_name.IndexOf(Singer_Name[i].ToString()) >= 0)
                    {
                        Singer_Description.Add(Singer_Name[i].ToString());
                        singer_name = singer_name.Substring(
                            singer_name.IndexOf(
                                ")"
                                ) + 1
                            );
                    }
                }

                int singer_nums = 0;

                for (int i = 0; i < userControl_SingerKrcSinging_Panel.ListBox_Items_SingerKrc_Animation.Children.Count; i++)
                {
                    userControl_ListviewItem_SingerKrc =
                        userControl_SingerKrcSinging_Panel.ListBox_Items_SingerKrc_Animation.Children[i] as UserControl_ListviewItem_SingerKrc;

                    for (int j = 0; j < Singer_Description.Count; j++)
                    {
                        if (userControl_ListviewItem_SingerKrc.textBlock_SingerName.Text
                            .IndexOf(
                                    Singer_Description[j].ToString()
                                ) >= 0
                            )
                        {
                            singer_nums++;

                            /*if (!Is_Chinese)
                            {
                                userControl_ListviewItem_SingerKrc.textBlock_SongKrcLine.Text =
                                    Mrc_Line.Substring(0, Mrc_Line.IndexOf("\n"))
                                    + "\n" +
                                    Mrc_Line.Substring(Mrc_Line.LastIndexOf(")") + 1);
                            }
                            else
                            {
                                userControl_ListviewItem_SingerKrc.textBlock_SongKrcLine.Text = Mrc_Line.Substring(0, Mrc_Line.IndexOf("\n"));
                            }*/

                            //传入动画时间，定时关闭Slider动画
                            userControl_ListviewItem_SingerKrc.Timer_To_Pause_Text_Storyboard_slider_Up(doubleAnimationUsingKeyFrames.Duration.TimeSpan);
                            //开启Slider动画
                            userControl_ListviewItem_SingerKrc.stopwatch_Singer_Singing_Time_Text.Start();//开启秒表类
                            userControl_ListviewItem_SingerKrc.dispatcherTimer_Singer_Singing_Time_Text.Start();
                            userControl_ListviewItem_SingerKrc.Text_Storyboard_slider_Up.Resume();

                            userControl_ListviewItem_SingerKrc.Border_Singer_Image_Current_Play.Visibility = Visibility.Visible;
                            userControl_ListviewItem_SingerKrc.textBlock_SingerName.Foreground = (SolidColorBrush)new BrushConverter().ConvertFrom("#00A9FF");

                            //开启歌词同步动画
                            /*userControl_ListviewItem_SingerKrc.Text_DoubleAnimation.KeyFrames = doubleAnimationUsingKeyFrames.KeyFrames;
                            userControl_ListviewItem_SingerKrc.Text_Storyboard.Begin();*/

                            //开启选中动画
                            /*DoubleAnimation doubleAnimation = new DoubleAnimation();
                            doubleAnimation.From = userControl_ListviewItem_SingerKrc.Singer_Image_Size_1;
                            doubleAnimation.To = userControl_ListviewItem_SingerKrc.Singer_Image_Size_2;
                            doubleAnimation.Duration = new Duration(TimeSpan.FromMilliseconds(100));
                            userControl_ListviewItem_SingerKrc.BeginAnimation(UserControl.HeightProperty, doubleAnimation);
                            //
                            doubleAnimation.From = 0;
                            doubleAnimation.To = 1000;
                            userControl_ListviewItem_SingerKrc.BeginAnimation(UserControl.WidthProperty, doubleAnimation);
                            //
                            doubleAnimation.From = userControl_ListviewItem_SingerKrc.Singer_Image_Size_1;
                            doubleAnimation.To = userControl_ListviewItem_SingerKrc.Singer_Image_Size_2;
                            userControl_ListviewItem_SingerKrc.Border_Singer_Image.BeginAnimation(UserControl.HeightProperty, doubleAnimation);
                            //
                            doubleAnimation.From = userControl_ListviewItem_SingerKrc.Singer_Image_Size_1;
                            doubleAnimation.To = userControl_ListviewItem_SingerKrc.Singer_Image_Size_2;
                            userControl_ListviewItem_SingerKrc.Border_Singer_Image.BeginAnimation(UserControl.WidthProperty, doubleAnimation);*/


                            Singer_No_To_Animation = i;
                        }
                        if (singer_nums == Singer_Description.Count)//已唤醒各歌手时长分配，退出
                            break;

                        
                    }
                }
            }
            else//启动全体时长匹配
            {
                for (int i = 0; i < userControl_SingerKrcSinging_Panel.ListBox_Items_SingerKrc_Animation.Children.Count; i++)
                {
                    userControl_ListviewItem_SingerKrc =
                        userControl_SingerKrcSinging_Panel.ListBox_Items_SingerKrc_Animation.Children[i] as UserControl_ListviewItem_SingerKrc;

                    /*if (!Is_Chinese)
                    {
                        userControl_ListviewItem_SingerKrc.textBlock_SongKrcLine.Text =
                            Mrc_Line.Substring(0, Mrc_Line.IndexOf("\n"))
                            + "\n" +
                            Mrc_Line.Substring(Mrc_Line.LastIndexOf(")") + 1);
                    }
                    else
                    {
                        userControl_ListviewItem_SingerKrc.textBlock_SongKrcLine.Text = Mrc_Line.Substring(0, Mrc_Line.IndexOf("\n"));
                    }*/

                    //传入动画时间，定时关闭Slider动画
                    userControl_ListviewItem_SingerKrc.Timer_To_Pause_Text_Storyboard_slider_Up(doubleAnimationUsingKeyFrames.Duration.TimeSpan);
                    //开启Slider动画
                    userControl_ListviewItem_SingerKrc.stopwatch_Singer_Singing_Time_Text.Start();//开启秒表类
                    userControl_ListviewItem_SingerKrc.dispatcherTimer_Singer_Singing_Time_Text.Start();
                    userControl_ListviewItem_SingerKrc.Text_Storyboard_slider_Up.Resume();

                    userControl_ListviewItem_SingerKrc.Border_Singer_Image_Current_Play.Visibility = Visibility.Visible;
                    userControl_ListviewItem_SingerKrc.textBlock_SingerName.Foreground = (SolidColorBrush)new BrushConverter().ConvertFrom("#00A9FF");

                    //开启歌词同步动画
                    /*userControl_ListviewItem_SingerKrc.Text_DoubleAnimation.KeyFrames = doubleAnimationUsingKeyFrames.KeyFrames;
                    userControl_ListviewItem_SingerKrc.Text_Storyboard.Begin();*/

                    Singer_No_To_Animation = -1;
                }
            }
        }
        #endregion

        private void DispatcherTimer_Sort_Of_Singing_Time_Tick(object? sender, EventArgs e)
        {
            userControl_SingerKrcSinging_Panel.Move_Top();
        }
    }
}
