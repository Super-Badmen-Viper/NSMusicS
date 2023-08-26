using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Threading;

using WinInterop = System.Windows.Interop;//最大化显示任务栏
using System.Runtime.InteropServices;
using System.IO;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.Song_Mrc_Info;
using System.Windows.Media.Animation;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.Window_Hover_MRC_Panel;
using System.Windows.Media.Effects;
using System.Threading;
using System.Collections;
using System.Globalization;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.SingerImage_Info;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.MusicPlayer_Main.UserControls.UserControl_Animation.ViewModel;
using TextAlignment = System.Windows.TextAlignment;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.MusicPlayer_Main;
using System.Windows.Controls.Primitives;
using MaterialDesignThemes.Wpf.Transitions;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_List_Infos;
using System.Threading.Tasks;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.Windows_Song_Finds;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.Main_Home_Left_MyMusic_UserControls;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.MainWindow_Left_MyMusic_UserControls;
using System.Collections.Concurrent;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Services;
using System.Net;
using System.Security.Policy;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_Json_To_WebAPI;
using Gst;
using Shell32;
using Uri = System.Uri;
using Application = System.Windows.Application;
using Task = System.Threading.Tasks.Task;
using System.Text.RegularExpressions;
using TagLib;
using File = System.IO.File;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.Main_Home_TOP_UserControls;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.APP_Personalized_Skin;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.Window;
using System.Windows.Interop;
using static System.Net.Mime.MediaTypeNames;
using System.Collections.ObjectModel;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Services.Services_For_API_GetResult;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.MainWindow_Buttom_MusicPlayer_UserControls;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.Main_Home_Right_MyMusic_UserControls;
using Org.BouncyCastle.Utilities.Encoders;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.Main_UserControls;
using Hardcodet.Wpf.TaskbarNotification;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.MusicPlayer_Main.UserControls;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.MainWindow_TOP_UserControls;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        /// TaskbarIcon tbi = new TaskbarIcon();
        /// <summary>
        /// 需要优化
        /// 已关闭专辑动画，频谱动画
        /// </summary>
        public MainWindow()
        {
            InitializeComponent();
            //
            Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";
            savePath = Path_App + @"/Music/";

            init();

            Once_Animation();

            Init_Animation();

            Init_Spectrum_Visualization();

            //初始化歌单信息
            Init_SongList_Info();
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = songList_Infos[1][0].Songs;
            userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = songList_Infos[0][0].Songs;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[2][0].Songs;

            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.ItemsSource = songList_Infos_Current_Playlist;
            
            userControl_SongList_Infos_Current_Playlist.Visibility = Visibility.Collapsed;
            //---
            windows_Song_Find.Back_Button.Click += Back_Button_Click;

            //初始化歌单信息编辑
            Init_SongListInfo_Edit();

            //切换双击歌单歌曲播放事件
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.MouseDoubleClick += userControl_ButtonFrame_MusicPlayer_ListView_Download_SongList_Info_MouseDoubleClick_ALL;
            userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.MouseDoubleClick += userControl_ButtonFrame_MusicPlayer_ListView_Download_SongList_Info_MouseDoubleClick_Love;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.MouseDoubleClick += userControl_ButtonFrame_MusicPlayer_ListView_Download_SongList_Info_MouseDoubleClick_Auto;
            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.MouseDoubleClick += userControl_SongList_Infos_Current_Playlist_ListView_Download_SongList_Info_MouseDoubleClick_Current_Playlist;

            userControl_SongList_Infos_Current_Playlist.Button_Clear_This_Current_Playlist.MouseLeftButtonDown += Button_Clear_This_Current_Playlist_MouseLeftButtonDown;
            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.MouseLeave += userControl_SongList_Infos_Current_Playlist_ListView_Download_SongList_Info_MouseLeave;
            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.MouseEnter += userControl_SongList_Infos_Current_Playlist_ListView_Download_SongList_Info_MouseEnter;

            userControl_ButtonFrame_MusicPlayer.Button_ListView_Selected.Click += userControl_ButtonFrame_MusicPlayer_Button_ListView_Selected_Click;
            userControl_ButtonFrame_MusicPlayer.Button_ListView_Selected_Right.Click += userControl_ButtonFrame_MusicPlayer_Button_ListView_Selected_Click;
            userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength.MouseLeftButtonDown += userControl_ButtonFrame_MusicPlayer_Button_ListView_Selected_Click;
            userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength_Right.MouseLeftButtonDown += userControl_ButtonFrame_MusicPlayer_Button_ListView_Selected_Click;


            //
            userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Button_Connectio_SqlServer.Click += Button_Connectio_SqlServer_Click;
            userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Button_Connectio_MySql.Click += Button_Connectio_MySql_Click;
            userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Button_Run_this_SQL.Click += Button_Run_this_SQL_Click;
            userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Button_DownLoad_ALL_Music_Urls.Click += Button_DownLoad_ALL_Music_Urls_Click;
            userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Button_Begin_Conn_API.Click += Button_Begin_Conn_API_Click;

            //
            viewModule_Search_Song = ViewModule_Search_Song.Retuen_This();
            this.DataContext = ViewModule_Search_Song.Retuen_This();

        }


        #region 播放列表设置

        private void Button_Clear_This_Current_Playlist_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            songList_Infos_Current_Playlist.Clear();
            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.ItemsSource = songList_Infos_Current_Playlist;
        }

        private void userControl_ButtonFrame_MusicPlayer_Button_ListView_Selected_Click(object sender, RoutedEventArgs e)
        {
            if(userControl_SongList_Infos_Current_Playlist.Visibility == Visibility.Visible)
                userControl_SongList_Infos_Current_Playlist.Visibility = Visibility.Collapsed;
            else
                userControl_SongList_Infos_Current_Playlist.Visibility = Visibility.Visible;
        }

        private void userControl_SongList_Infos_Current_Playlist_ListView_Download_SongList_Info_MouseEnter(object sender, MouseEventArgs e)
        {
            Reset_Current_Playlist();
        }
        private void userControl_SongList_Infos_Current_Playlist_ListView_Download_SongList_Info_MouseLeave(object sender, MouseEventArgs e)
        {
            Reset_Current_Playlist();
        }
        public void Reset_Current_Playlist()
        {
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = songList_Infos[1][0].Songs;

            userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = songList_Infos[0][0].Songs;

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[2][0].Songs;

            for (int i = 0; i < userControl_Main_Home_Left_MyMusic_Mores.Count; i++)
            {
                userControl_Main_Home_Left_MyMusic_Mores[i].ListView_Download_SongList_Info.ItemsSource =
                    null;
                userControl_Main_Home_Left_MyMusic_Mores[i].ListView_Download_SongList_Info.ItemsSource =
                    songList_Infos[i + 3][0].Songs;
            }

            songList_Infos_Current_Playlist = SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;
            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.ItemsSource = songList_Infos_Current_Playlist;

            userControl_Main_Home_Left_MyMusic_Mores_TabControl.ItemsSource = userControl_Main_Home_Left_MyMusic_Mores;
        }
        #endregion

        ViewModule_Search_Song viewModule_Search_Song;


        public string Path_App;

        //所有的歌单列表集合
        private ObservableCollection<ObservableCollection<Models.Song_List_Infos.SongList_Info>> songList_Infos;
        //当前的播放列表
        private ObservableCollection<Song_Info> songList_Infos_Current_Playlist;
        //当前正在播放的歌曲
        private Song_Info this_Song_Info = new Song_Info();

        //自定义歌单 ComboBoxItem子项集合，通过SelectionChanged启动用户控件 集合
        private List<ComboBoxItem_Name> comboBoxItem_userControl_Main_Home_Left_MyMusic_Mores = UserControl_Main_Home_Left_MyMusic_Mores_Class.comboBoxItem_userControl_Main_Home_Left_MyMusic_Mores;
        //自定义歌单 用户控件 集合
        private List<UserControl_Main_Home_Left_MyMusic_More> userControl_Main_Home_Left_MyMusic_Mores = UserControl_Main_Home_Left_MyMusic_Mores_Class.Retuen_This();
        //选中歌曲，添加到 ComboBoxItem子项集合
        private List<ComboBoxItem_Name> comboBoxItem_ComBox_Select_Add_SongList = UserControl_Main_Home_Left_MyMusic_Mores_Class.comboBoxItem_ComBox_Select_Add_SongList;

        //歌曲搜索
        Windows_Song_Find_Float windows_Song_Find = new Windows_Song_Find_Float();


        #region 歌单信息重加载
        public void Init_SongList_Info()
        {
            //加载歌单信息
            songList_Infos = SongList_Info.Retuen_This();
            songList_Infos_Current_Playlist = SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;
            //加载次序不能变
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Love.xml"));
            SongList_Info_Reader.song_Infos_Love = songList_Infos[0][0].Songs;
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_ALL.xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Auto.xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (3).xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (4).xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (5).xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (6).xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (7).xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (8).xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (9).xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (10).xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (11).xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (12).xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (13).xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (14).xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (15).xml"));
            songList_Infos.Add(SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (16).xml"));
            //
            SongList_Info.songList_Infos = songList_Infos;

            
            //加载保存过的播放列表
            //保存播放列表
            songList_Infos_Current_Playlist = SongList_Info_Reader.ReadSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Current_Playlist.xml")[0].Songs;
            SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist = songList_Infos_Current_Playlist;
            userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength.Text = songList_Infos_Current_Playlist.Count.ToString();
            userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength_Right.Text = songList_Infos_Current_Playlist.Count.ToString();


            //加载自定义歌单列表 用户控件
            UserControl_Main_Home_Left_MyMusic_Mores_Class.userControl_Main_Home_Left_MyMusic_Mores.Clear();//清空数据
            userControl_Main_Home_Left_MyMusic_Mores = UserControl_Main_Home_Left_MyMusic_Mores_Class.Retuen_This();//重新赋值
            for (int i = 3; i < 17; i++)
            {
                //先给歌曲排序，防止歌曲序号不对
                for (int j = 0; j < songList_Infos[i][0].Songs.Count; j++)
                {
                    songList_Infos[i][0].Songs[j].Song_No = j + 1;
                }

                UserControl_Main_Home_Left_MyMusic_More temp = new UserControl_Main_Home_Left_MyMusic_More();
                temp.this_SongList_Name.Text = songList_Infos[i][0].Name;
                temp.Name = "Song_List_Info_More_" + i;
                //传入数据源
                temp.this_SongList_Info_Set(songList_Infos[i][0].Songs, i);
                //设置数据源
                temp.ListView_Download_SongList_Info.ItemsSource = songList_Infos[i][0].Songs;
                //双击播放事件
                temp.ListView_Download_SongList_Info.MouseDoubleClick += ListView_Download_SongList_Info_MouseDoubleClick;
                //启动本地歌曲查找
                if (i == 3)
                {
                    temp.Stack_Button_Add_Select_Song.MouseLeftButtonDown +=
                        SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_3;
                    temp.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_3;
                }
                else if (i == 4)
                {
                    temp.Stack_Button_Add_Select_Song.MouseLeftButtonDown +=
                        SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_4;
                    temp.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_4;
                }
                else if (i == 5)
                {
                    temp.Stack_Button_Add_Select_Song.MouseLeftButtonDown +=
                        SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_5;
                    temp.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_5;
                }
                else if (i == 6)
                {
                    temp.Stack_Button_Add_Select_Song.MouseLeftButtonDown +=
                        SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_6;
                    temp.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_6;
                }
                else if (i == 7)
                {
                    temp.Stack_Button_Add_Select_Song.MouseLeftButtonDown +=
                        SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_7;
                    temp.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_7;
                }
                else if (i == 8)
                {
                    temp.Stack_Button_Add_Select_Song.MouseLeftButtonDown +=
                        SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_8;
                    temp.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_8;
                }
                else if (i == 9)
                {
                    temp.Stack_Button_Add_Select_Song.MouseLeftButtonDown +=
                        SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_9;
                    temp.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_9;
                }
                else if (i == 10)
                {
                    temp.Stack_Button_Add_Select_Song.MouseLeftButtonDown +=
                        SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_10;
                    temp.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_10;
                }
                else if (i == 11)
                {
                    temp.Stack_Button_Add_Select_Song.MouseLeftButtonDown +=
                        SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_11;
                    temp.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_11;
                }
                else if (i == 12)
                {
                    temp.Stack_Button_Add_Select_Song.MouseLeftButtonDown +=
                        SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_12;
                    temp.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_12;
                }
                else if (i == 13)
                {
                    temp.Stack_Button_Add_Select_Song.MouseLeftButtonDown +=
                        SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_13;
                    temp.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_13;
                }
                else if (i == 14)
                {
                    temp.Stack_Button_Add_Select_Song.MouseLeftButtonDown +=
                        SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_14;
                    temp.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_14;
                }
                else if (i == 15)
                {
                    temp.Stack_Button_Add_Select_Song.MouseLeftButtonDown +=
                        SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_15;
                    temp.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_15;
                }
                else if (i == 16)
                {
                    temp.Stack_Button_Add_Select_Song.MouseLeftButtonDown +=
                        SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_16;
                    temp.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_16;
                }

                userControl_Main_Home_Left_MyMusic_Mores.Add(temp);
            }
            UserControl_Main_Home_Left_MyMusic_Mores_Class.userControl_Main_Home_Left_MyMusic_Mores = userControl_Main_Home_Left_MyMusic_Mores;//保存数据
            //加载自定义歌单列表 启动 “用户控件”的按钮
            ComboBoxItem_Name comboBoxItem = new ComboBoxItem_Name();
            comboBoxItem_userControl_Main_Home_Left_MyMusic_Mores.Clear();
            for (int i = 0; i < userControl_Main_Home_Left_MyMusic_Mores.Count; i++)
            {
                comboBoxItem = new ComboBoxItem_Name();
                comboBoxItem.Name = songList_Infos[i + 3][0].Name;

                comboBoxItem_userControl_Main_Home_Left_MyMusic_Mores.Add(comboBoxItem);
            }
            UserControl_Main_Home_Left_MyMusic_Mores_Class.comboBoxItem_userControl_Main_Home_Left_MyMusic_Mores = comboBoxItem_userControl_Main_Home_Left_MyMusic_Mores;
            ComBox_Select_SongList.ItemsSource = comboBoxItem_userControl_Main_Home_Left_MyMusic_Mores;
            userControl_Main_Home_Left_MyMusic_Mores_TabControl.ItemsSource = userControl_Main_Home_Left_MyMusic_Mores;


            //加载歌曲选中 添加到指定歌单 ComBox_Select_Add_SongList数据源
            comboBoxItem_ComBox_Select_Add_SongList.Clear();
            comboBoxItem = new ComboBoxItem_Name(); 
            comboBoxItem.Name = "我的收藏";
            comboBoxItem_ComBox_Select_Add_SongList.Add(comboBoxItem);
            comboBoxItem = new ComboBoxItem_Name(); 
            comboBoxItem.Name = "本地下载";
            comboBoxItem_ComBox_Select_Add_SongList.Add(comboBoxItem);
            comboBoxItem = new ComboBoxItem_Name(); 
            comboBoxItem.Name = "默认列表";
            comboBoxItem_ComBox_Select_Add_SongList.Add(comboBoxItem);
            for (int i = 0; i < comboBoxItem_userControl_Main_Home_Left_MyMusic_Mores.Count; i++)
            {
                comboBoxItem = new ComboBoxItem_Name(); 
                comboBoxItem.Name = comboBoxItem_userControl_Main_Home_Left_MyMusic_Mores[i].Name.ToString();
                comboBoxItem_ComBox_Select_Add_SongList.Add(comboBoxItem);
            }
            UserControl_Main_Home_Left_MyMusic_Mores_Class.comboBoxItem_ComBox_Select_Add_SongList = comboBoxItem_ComBox_Select_Add_SongList;
            //绑定添加源
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ComBox_Select_Add_SongList.ItemsSource = comboBoxItem_ComBox_Select_Add_SongList;
            userControl_Main_Home_Left_MyMusic_My_Love.ComBox_Select_Add_SongList.ItemsSource = comboBoxItem_ComBox_Select_Add_SongList;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ComBox_Select_Add_SongList.ItemsSource = comboBoxItem_ComBox_Select_Add_SongList;
            for (int i = 0; i < userControl_Main_Home_Left_MyMusic_Mores.Count; i++)
            {
                userControl_Main_Home_Left_MyMusic_Mores[i].ComBox_Select_Add_SongList.ItemsSource = comboBoxItem_ComBox_Select_Add_SongList;
            }
            windows_Song_Find.ComBox_Select_SongList.ItemsSource = comboBoxItem_ComBox_Select_Add_SongList;

        }

        
        int ComBox_Select_SongList_SelectIndex;
        /// <summary>
        /// 选择自定义歌单
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ComBox_Select_SongList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            ComBox_Select_SongList_SelectIndex = ComBox_Select_SongList.SelectedIndex;
            //重新绑定数据源，之前为null，防止数据与UI渲染刷新冲突
            userControl_Main_Home_Left_MyMusic_Mores_TabControl.ItemsSource = userControl_Main_Home_Left_MyMusic_Mores;
            //重置歌单信息
            Reset_Current_Playlist();

            if (ComBox_Select_SongList_SelectIndex != -1)
            {
                userControl_Main_Home_Left_MyMusic_Mores_TabControl.SelectedIndex = ComBox_Select_SongList_SelectIndex;
                userControl_Main_Home_Left_MyMusic_Mores_TabControl.Visibility = Visibility.Visible;

                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Visibility = Visibility.Collapsed;
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Singer_Name.Text = "";
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Song_Name.Text = "";
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Album_Name.Text = "";
                userControl_Main_Home_Left_MyMusic_My_Love.Visibility = Visibility.Collapsed;
                userControl_Main_Home_Left_MyMusic_Recent_Play.Visibility = Visibility.Collapsed;
                userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Visibility = Visibility.Collapsed;
                userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Visibility = Visibility.Collapsed;
                userControl_Main_Home_TOP_Personalized_Skins.Visibility = Visibility.Collapsed;
                userControl_Main_Home_Left_OnlineMusic_Search_Song.Visibility = Visibility.Collapsed;

                //应该统一将歌单控件设置为同一List<>，懒得优化了
                //ListView_Download_SongList_Info.ItemsSource设置为null
                //防止数据与UI渲染不同步崩溃
                userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = null;
                userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = null;
                userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;

                Clear_Windows_Left_ALL_UserControl_BackGround();  
                Grid_Animation_MouseLeftClick();/// 窗体进入动画
            }
            else
            {
                userControl_Main_Home_Left_MyMusic_Mores_TabControl.Visibility = Visibility.Collapsed;
            }

            //同步歌曲曲目数量
            for (int i = 0; i < userControl_Main_Home_Left_MyMusic_Mores.Count; i++)
            {
                userControl_Main_Home_Left_MyMusic_Mores
                    [i]
                    .Recent_Song_Nums.Text
                    = "歌曲：" + userControl_Main_Home_Left_MyMusic_Mores
                    [i]
                    .ListView_Download_SongList_Info.Items.Count.ToString();
                userControl_Main_Home_Left_MyMusic_Mores_TabControl.ItemsSource = null;
                userControl_Main_Home_Left_MyMusic_Mores_TabControl.ItemsSource = userControl_Main_Home_Left_MyMusic_Mores;
            }
        }
        /// <summary>
        /// 自定义歌单选择 鼠标左键按下 重置为-1
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ComBox_Select_SongList_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            ComBox_Select_SongList.SelectedIndex = -1;     
        }
        
        /// <summary>
        /// 本地搜索音乐 返回保存歌单信息
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Back_Button_Click(object sender, RoutedEventArgs e)
        {
            Reset_App_ItemsSource();
        }
        private void Reset_App_ItemsSource()
        {
            songList_Infos = null;
            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.ItemsSource = null;
            SongList_Info.songList_Infos = null;

            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            for (int i = 0; i < userControl_Main_Home_Left_MyMusic_Mores.Count; i++)
            {
                userControl_Main_Home_Left_MyMusic_Mores[i].ListView_Download_SongList_Info.ItemsSource = null;
            }


            Init_SongList_Info();
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = songList_Infos[1][0].Songs;
            userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = songList_Infos[0][0].Songs;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[2][0].Songs;
            for (int i = 0; i < userControl_Main_Home_Left_MyMusic_Mores.Count; i++)
            {
                userControl_Main_Home_Left_MyMusic_Mores[i].ListView_Download_SongList_Info.ItemsSource = songList_Infos[i + 3][0].Songs;
            }

        }

        #endregion
        #region 歌曲信息保存
        public void Save_SongListInfo()
        {
            var playlists = new ObservableCollection<SongList_Info>();
            playlists = songList_Infos[0];
            SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Love.xml", playlists);
            playlists = new ObservableCollection<SongList_Info>();
            playlists = songList_Infos[1];
            SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_ALL.xml", playlists);
            playlists = new ObservableCollection<SongList_Info>();
            playlists = songList_Infos[2];
            SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Auto.xml", playlists);
            for (int i = 3; i < 17; i++)
            {
                playlists = new ObservableCollection<SongList_Info>();
                playlists = songList_Infos[i];
                SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (" + i + ").xml", playlists);
            }

            //保存播放列表
            playlists = new ObservableCollection<SongList_Info>();
            SongList_Info songList_ = new SongList_Info();
            playlists.Add(songList_);
            playlists[0].ID = -1;
            playlists[0].Name = "播放列表";
            playlists[0].Songs = songList_Infos_Current_Playlist;
            SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Current_Playlist.xml", playlists);
        }
        #endregion

        #region 歌曲信息编辑

        /// <summary>
        /// 初始化 歌曲信息编辑
        /// </summary>
        private void Init_SongListInfo_Edit()
        {
            //歌单信息编辑 
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Select_SongList.SelectionChanged += SongInfo_Edit_ComBox_Select_SongList_SelectionChanged;
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Button_Edit_SongList_Name.Click += Button_Edit_SongList_Name_Click;

            //歌曲信息编辑
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Button_Search_Song_Name.Click += Button_Search_Song_Name_Click;
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Button_Save_To_SongList.Click += Button_Save_To_SongList_Click;
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Button_Save_To_File.Click += Button_Save_To_File_Click; ;

            //音乐资源导入
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Singer_Image.Drop += ListBox_Singer_Image_Drop;
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Album_Image.Drop += ListBox_Album_Image_Drop;
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Mrc_Image.Drop += ListBox_Mrc_Image_Drop;
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Crc_Image.Drop += ListBox_Crc_Image_Drop;
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Singer_Image.MouseDoubleClick += ListBox_Singer_Image_MouseDoubleClick;
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Album_Image.MouseDoubleClick += ListBox_Album_Image_MouseDoubleClick;
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Mrc_Image.MouseDoubleClick += ListBox_Mrc_Image_MouseDoubleClick;
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Crc_Image.MouseDoubleClick += ListBox_Crc_Image_MouseDoubleClick;
        }


        /// <summary>
        /// 歌曲信息编辑
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Edit_ALL_SongInfo_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Visibility = Visibility.Visible;
            userControl_Main_Home_Left_MyMusic_My_Love.Visibility = Visibility.Collapsed;
            userControl_Main_Home_Left_MyMusic_Recent_Play.Visibility = Visibility.Collapsed;
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Visibility = Visibility.Collapsed;
            userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Visibility = Visibility.Collapsed;

            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Select_SongList.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Select_SongList.ItemsSource = comboBoxItem_userControl_Main_Home_Left_MyMusic_Mores;

            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.
                                Edit_Singer_Name = "";
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.
                                Edit_Song_Name = "";
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.
                                Edit_Album_Name = "";

            Grid_Animation_MouseLeftClick();/// 窗体进入动画
            Clear_Windows_Left_ALL_UserControl_BackGround();
            Button_Edit_ALL_SongInfo.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#60FFFFFF"));
        }

        #region 歌单信息编辑 
        int SongInfo_Edit_SelectIndex;
        /// <summary>
        /// 选择歌单（并修改）
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void SongInfo_Edit_ComBox_Select_SongList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Select_SongList.SelectedIndex > -1)//0~13
            {
                SongInfo_Edit_SelectIndex = userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Select_SongList.SelectedIndex;

                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Temp_SongList_Name.Text =
                (userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Select_SongList.Items
                [SongInfo_Edit_SelectIndex] as ComboBoxItem_Name).Name;
            }
        }
        /// <summary>
        /// 修改歌单 名称
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Edit_SongList_Name_Click(object sender, RoutedEventArgs e)
        {
            if (SongInfo_Edit_SelectIndex > -1)//0~13
            {
                //加载歌单信息：下标16
                songList_Infos = SongList_Info.Retuen_This();
                songList_Infos
                    [SongInfo_Edit_SelectIndex + 3][0].Name =
                    userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Temp_SongList_Name.Text;
                //刷新指针数据
                SongList_Info.songList_Infos = 
                    songList_Infos;


                //清空绑定
                ComBox_Select_SongList.ItemsSource = null;
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Select_SongList.ItemsSource = null;
                //自定义歌单子项，下标13：数据源设置：选择自定义歌单
                comboBoxItem_userControl_Main_Home_Left_MyMusic_Mores =
                    UserControl_Main_Home_Left_MyMusic_Mores_Class.comboBoxItem_userControl_Main_Home_Left_MyMusic_Mores;
                comboBoxItem_userControl_Main_Home_Left_MyMusic_Mores
                    [SongInfo_Edit_SelectIndex].Name =
                    userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Temp_SongList_Name.Text;
                //刷新指针数据
                UserControl_Main_Home_Left_MyMusic_Mores_Class.comboBoxItem_userControl_Main_Home_Left_MyMusic_Mores = 
                    comboBoxItem_userControl_Main_Home_Left_MyMusic_Mores;
                //重新绑定
                ComBox_Select_SongList.ItemsSource = comboBoxItem_userControl_Main_Home_Left_MyMusic_Mores;
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Select_SongList.ItemsSource = comboBoxItem_userControl_Main_Home_Left_MyMusic_Mores;


                //清空绑定
                userControl_Main_Home_Left_MyMusic_Mores_TabControl.ItemsSource = null;
                //自定义歌单子项，下标13：控件设置
                userControl_Main_Home_Left_MyMusic_Mores =
                    UserControl_Main_Home_Left_MyMusic_Mores_Class.Retuen_This();
                userControl_Main_Home_Left_MyMusic_Mores
                    [SongInfo_Edit_SelectIndex].
                    this_SongList_Name.Text =
                    userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Temp_SongList_Name.Text;
                //刷新指针数据
                UserControl_Main_Home_Left_MyMusic_Mores_Class.userControl_Main_Home_Left_MyMusic_Mores =
                    userControl_Main_Home_Left_MyMusic_Mores;
                //重新绑定
                userControl_Main_Home_Left_MyMusic_Mores_TabControl.ItemsSource = userControl_Main_Home_Left_MyMusic_Mores;


                //清空绑定
                userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ComBox_Select_Add_SongList.ItemsSource = null;
                userControl_Main_Home_Left_MyMusic_My_Love.ComBox_Select_Add_SongList.ItemsSource = null;
                userControl_Main_Home_Left_MyMusic_Recent_Play.ComBox_Select_Add_SongList.ItemsSource = null;
                for (int i = 0; i < userControl_Main_Home_Left_MyMusic_Mores.Count; i++)
                {
                    userControl_Main_Home_Left_MyMusic_Mores[i].ComBox_Select_Add_SongList.ItemsSource = null;
                }
                windows_Song_Find.ComBox_Select_SongList.ItemsSource = null;
                //自定义歌单子项，下标16：数据源设置：添加到自定义歌单
                comboBoxItem_ComBox_Select_Add_SongList =
                    UserControl_Main_Home_Left_MyMusic_Mores_Class.comboBoxItem_ComBox_Select_Add_SongList;
                comboBoxItem_ComBox_Select_Add_SongList
                    [SongInfo_Edit_SelectIndex + 3].Name =
                    userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Temp_SongList_Name.Text;
                //刷新指针数据
                UserControl_Main_Home_Left_MyMusic_Mores_Class.comboBoxItem_ComBox_Select_Add_SongList =
                    comboBoxItem_ComBox_Select_Add_SongList;
                //重新绑定
                userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ComBox_Select_Add_SongList.ItemsSource = comboBoxItem_ComBox_Select_Add_SongList;
                userControl_Main_Home_Left_MyMusic_My_Love.ComBox_Select_Add_SongList.ItemsSource = comboBoxItem_ComBox_Select_Add_SongList;
                userControl_Main_Home_Left_MyMusic_Recent_Play.ComBox_Select_Add_SongList.ItemsSource = comboBoxItem_ComBox_Select_Add_SongList;
                for (int i = 0; i < userControl_Main_Home_Left_MyMusic_Mores.Count; i++)
                {
                    userControl_Main_Home_Left_MyMusic_Mores[i].ComBox_Select_Add_SongList.ItemsSource = comboBoxItem_ComBox_Select_Add_SongList;
                }
                windows_Song_Find.ComBox_Select_SongList.ItemsSource = comboBoxItem_ComBox_Select_Add_SongList;



                //清空输入栏
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Temp_SongList_Name.Text = "";
            }
        }


        #endregion

        #region 歌曲信息编辑

        /// <summary>
        /// 查找并返回 所有相似的歌曲名
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        /// <exception cref="NotImplementedException"></exception>
        private void Button_Search_Song_Name_Click(object sender, RoutedEventArgs e)
        {
            songList_Infos = SongList_Info.Retuen_This();
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Show_Search_Song.Items.Clear();

            if (userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Search_Song_Name.Length > 0)
            {
                //查找并保存（所有的歌单）
                for (int i = 0; i < songList_Infos.Count; i++)
                {
                    for (int j = 0; j < songList_Infos[i][0].Songs.Count; j++)
                    {
                        if (songList_Infos[i][0].Songs[j].Song_Name.IndexOf(
                            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Search_Song_Name
                            ) > -1
                            ||
                            songList_Infos[i][0].Songs[j].Singer_Name.IndexOf(
                            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Search_Song_Name
                            ) > -1
                            )
                        {
                            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Show_Search_Song.Items.Add(
                                songList_Infos[i][0].Songs[j].Singer_Name + " - " +
                                songList_Infos[i][0].Songs[j].Song_Name + "_Url:" +
                                songList_Infos[i][0].Songs[j].Song_Url
                                );
                        }
                    }
                }
                //去重
                for (int i = 0; i < userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Show_Search_Song.Items.Count; i++)
                {
                    for (int j = i + 1; j < userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Show_Search_Song.Items.Count; j++)
                    {
                        if (userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Show_Search_Song.Items[i].Equals(
                            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Show_Search_Song.Items[j]
                            ))
                            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Show_Search_Song.Items.Remove(
                                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Show_Search_Song.Items[j]
                                );
                    }
                }

                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Show_Search_Song.IsDropDownOpen = true;
            }
            else
            {
                MessageBox.Show("请填写完整的歌曲信息");
            }
        }

        /// <summary>
        /// 仅保存至歌单
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Save_To_SongList_Click(object sender, RoutedEventArgs e)
        {
            if (userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Edit_Singer_Name.Length > 0 &&
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Edit_Song_Name.Length > 0 &&
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Edit_Album_Name.Length > 0
                )
            {
                songList_Infos = SongList_Info.Retuen_This();
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Show_Search_Song.Items.Clear();

                //保存（所有的歌单）
                for (int i = 0; i < songList_Infos.Count; i++)
                {
                    for (int j = 0; j < songList_Infos[i][0].Songs.Count; j++)
                    {
                        if (songList_Infos[i][0].Songs[j].Song_Url.Equals(
                            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Search_this_SongUrl
                            ))
                        {
                            songList_Infos[i][0].Songs[j].Singer_Name = userControl_Main_Home_Left_MyMusic_SongInfo_Edit.
                                    Edit_Singer_Name;
                            songList_Infos[i][0].Songs[j].Song_Name = userControl_Main_Home_Left_MyMusic_SongInfo_Edit.
                                    Edit_Song_Name;
                            songList_Infos[i][0].Songs[j].Album_Name = userControl_Main_Home_Left_MyMusic_SongInfo_Edit.
                                    Edit_Album_Name;
                        }
                    }
                }
                SongList_Info.songList_Infos = songList_Infos;
                MessageBox.Show("保存成功");

                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Singer_Name.Text = "";
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Song_Name.Text = "";
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Album_Name.Text = "";
            }
            else
            {
                MessageBox.Show("请填写完整的歌曲信息");
            }
        }
        private void Button_Save_To_File_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Edit_Singer_Name.Length > 0 &&
                    userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Edit_Song_Name.Length > 0 &&
                    userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Edit_Album_Name.Length > 0
                    )
                {
                    songList_Infos = SongList_Info.Retuen_This();
                    userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ComBox_Show_Search_Song.Items.Clear();
                    string url = "";
                    bool playing = false;
                    //保存（所有的歌单）
                    for (int i = 0; i < songList_Infos.Count; i++)
                    {
                        for (int j = 0; j < songList_Infos[i][0].Songs.Count; j++)
                        {
                            if (songList_Infos[i][0].Songs[j].Song_Url.Equals(
                                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Search_this_SongUrl
                                ))
                            {
                                url = songList_Infos[i][0].Songs[j].Song_Url;
                                if (viewModule_Search_Song.MediaElement_Song_Url != null)
                                    if (viewModule_Search_Song.MediaElement_Song_Url.LocalPath != null)
                                        if (viewModule_Search_Song.MediaElement_Song_Url.LocalPath.Equals(url))
                                        {
                                            playing = true;
                                            break;
                                        }

                                songList_Infos[i][0].Songs[j].Singer_Name = userControl_Main_Home_Left_MyMusic_SongInfo_Edit.
                                    Edit_Singer_Name;
                                songList_Infos[i][0].Songs[j].Song_Name = userControl_Main_Home_Left_MyMusic_SongInfo_Edit.
                                    Edit_Song_Name;
                                songList_Infos[i][0].Songs[j].Album_Name = userControl_Main_Home_Left_MyMusic_SongInfo_Edit.
                                    Edit_Album_Name;
                            }
                        }
                    }
                    if (playing == false)
                    {
                        //保存（本地文件）
                        string temp = @url;
                        string music_flie = url.Substring(url.LastIndexOf("."));//音频格式后缀保存

                        var file = TagLib.File.Create(url);
                        file.Tag.Album = userControl_Main_Home_Left_MyMusic_SongInfo_Edit.
                                        Edit_Album_Name;
                        file.Tag.Performers = new string[] { userControl_Main_Home_Left_MyMusic_SongInfo_Edit.
                            Edit_Singer_Name};
                        file.Tag.Title = userControl_Main_Home_Left_MyMusic_SongInfo_Edit.
                                        Edit_Singer_Name + " - " + userControl_Main_Home_Left_MyMusic_SongInfo_Edit.
                                        Edit_Song_Name;
                        file.Save();
                        file.Dispose();

                        url = url.Substring(0, url.LastIndexOf(@"\") + 1) + file.Tag.Title + music_flie;

                        // 修改文件名
                        File.Move(@temp, @url);
                        for (int i = 0; i < songList_Infos.Count; i++)
                        {
                            for (int j = 0; j < songList_Infos[i][0].Songs.Count; j++)
                            {
                                if (songList_Infos[i][0].Songs[j].Song_Url.Equals(temp))
                                {
                                    songList_Infos[i][0].Songs[j].Song_Url = url;
                                }
                            }
                        }

                        SongList_Info.songList_Infos = songList_Infos;
                        MessageBox.Show("保存成功");
                    }
                    else
                    {
                        MessageBox.Show("请切换当前播放歌曲，已占用资源无法进行修改");
                    }

                    userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Singer_Name.Text = "";
                    userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Song_Name.Text = "";
                    userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Album_Name.Text = "";
                }
                else
                {
                    MessageBox.Show("请填写完整的歌曲信息");
                }
            }
            catch (Exception ex)
            {
                // 在窗口中显示错误消息
                MessageBox.Show("发生错误：" + ex.Message, "错误", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        #endregion

        //private List<>
        #region 音乐资源导入
        
        private void ListBox_Singer_Image_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            // 显示选择文件对话框
            Microsoft.Win32.OpenFileDialog dialog = new Microsoft.Win32.OpenFileDialog();
            dialog.Multiselect = true;//该值确定是否可以选择多个文件
            dialog.Title = "请选择文件夹";
            dialog.Filter = "(*.jpg)|*.jpg;";
            dialog.ShowDialog();
            
            string[] files = dialog.FileNames;
            foreach (string file in files)
            {
                if (file.IndexOf("jpg") > -1)
                {
                    if (File.Exists(file))
                    {
                        // 获取文件名和目标路径
                        string fileName = Path.GetFileName(file);
                        string destPath = "";
                        for (int i = 0; i < singer_photo.Length; i++)
                        {
                            destPath = Path_App + @"/Singer_Image/" + singer_photo[i] + "/" + fileName;
                            if (File.Exists(destPath) == false)
                            {
                                // 复制文件
                                File.Copy(file, destPath, true);
                                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Singer_Image.Items.Add("导入成功：" + fileName);
                                break;
                            }
                            else if (i == singer_photo.Length - 1)
                            {
                                MessageBox.Show("文件存储量超过上限");
                                destPath = "";
                            }
                        }
                    }
                }
                else
                {
                    userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Singer_Image.Items.Add("导入失败：" + file);
                }
            }
        }
        private void ListBox_Singer_Image_Drop(object sender, DragEventArgs e)
        {
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Singer_Image.Items.Clear();

            if (e.Data.GetDataPresent(DataFormats.FileDrop))
            {
                string[] files = (string[])e.Data.GetData(DataFormats.FileDrop);
                foreach (string file in files)
                {
                    if (file.IndexOf("jpg") > -1)
                    {
                        if (File.Exists(file))
                        {
                            // 获取文件名和目标路径
                            string fileName = Path.GetFileName(file);
                            string destPath = "";
                            for (int i = 0; i < singer_photo.Length; i++)
                            {
                                destPath = Path_App + @"/Singer_Image/" + singer_photo[i] + "/" + fileName;
                                if (File.Exists(destPath) == false)
                                {
                                    // 复制文件
                                    File.Copy(file, destPath, true);
                                    userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Singer_Image.Items.Add("导入成功：" + fileName);
                                    break;
                                }
                                else if (i == singer_photo.Length - 1)
                                {
                                    MessageBox.Show("文件存储量超过上限");
                                    destPath = "";
                                }
                            }
                        }
                    }
                    else
                    {
                        userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Singer_Image.Items.Add("导入失败：" + file);
                    }
                }
            }
        }

        private void ListBox_Album_Image_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            // 显示选择文件对话框
            Microsoft.Win32.OpenFileDialog dialog = new Microsoft.Win32.OpenFileDialog();
            dialog.Multiselect = true;//该值确定是否可以选择多个文件
            dialog.Title = "请选择文件夹";
            dialog.Filter = "(*.jpg)|*.jpg;";
            dialog.ShowDialog();

            string[] files = dialog.FileNames;
            foreach (string file in files)
            {
                if (file.IndexOf("jpg") > -1)
                {
                    if (File.Exists(file))
                    {
                        // 获取文件名和目标路径
                        string fileName = Path.GetFileName(file);
                        string destPath = Path_App + @"/Song_ALbum/" + fileName;
                        // 复制文件
                        File.Copy(file, destPath, true);
                        userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Album_Image.Items.Add("导入成功：" + fileName);
                    }
                }
                else
                {
                    userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Album_Image.Items.Add("导入失败：" + file);
                }
            }
        }
        private void ListBox_Album_Image_Drop(object sender, DragEventArgs e)
        {
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Album_Image.Items.Clear();

            if (e.Data.GetDataPresent(DataFormats.FileDrop))
            {
                string[] files = (string[])e.Data.GetData(DataFormats.FileDrop);
                foreach (string file in files)
                {
                    if (file.IndexOf("jpg") > -1)
                    {
                        if (File.Exists(file))
                        {
                            // 获取文件名和目标路径
                            string fileName = Path.GetFileName(file);
                            string destPath = Path_App + @"/Song_ALbum/" + fileName;
                            // 复制文件
                            File.Copy(file, destPath, true);
                            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Album_Image.Items.Add("导入成功：" + fileName);
                        }
                    }
                    else
                    {
                        userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Album_Image.Items.Add("导入失败：" + file);
                    }
                }
            }
        }

        private void ListBox_Mrc_Image_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            // 显示选择文件对话框
            Microsoft.Win32.OpenFileDialog dialog = new Microsoft.Win32.OpenFileDialog();
            dialog.Multiselect = true;//该值确定是否可以选择多个文件
            dialog.Title = "请选择文件夹";
            dialog.Filter = "(*.mrc,*.krc,*.lrc)|*.mrc;*.krc;*.lrc";
            dialog.ShowDialog();

            string[] files = dialog.FileNames;
            foreach (string file in files)
            {
                if (file.IndexOf("mrc") > -1 || file.IndexOf("lrc") > -1 || file.IndexOf("krc") > -1)
                {
                    if (File.Exists(file))
                    {
                        // 获取文件名和目标路径
                        string fileName = Path.GetFileName(file);
                        string destPath = Path_App + @"/Mrc/" + fileName;
                        // 复制文件
                        File.Copy(file, destPath, true);
                        userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Mrc_Image.Items.Add("导入成功：" + fileName);
                    }
                }
                else
                {
                    userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Mrc_Image.Items.Add("导入失败：" + file);
                }
            }
        }
        private void ListBox_Mrc_Image_Drop(object sender, DragEventArgs e)
        {
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Mrc_Image.Items.Clear();

            if (e.Data.GetDataPresent(DataFormats.FileDrop))
            {
                string[] files = (string[])e.Data.GetData(DataFormats.FileDrop);
                foreach (string file in files)
                {
                    if (file.IndexOf("mrc") > -1 || file.IndexOf("lrc") > -1 || file.IndexOf("krc") > -1)
                    {
                        if (File.Exists(file))
                        {
                            // 获取文件名和目标路径
                            string fileName = Path.GetFileName(file);
                            string destPath = Path_App + @"/Mrc/" + fileName;
                            // 复制文件
                            File.Copy(file, destPath, true);
                            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Mrc_Image.Items.Add("导入成功：" + fileName);
                        }
                    }
                    else
                    {
                        userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Mrc_Image.Items.Add("导入失败：" + file);
                    }
                }
            }
        }

        private void ListBox_Crc_Image_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            // 显示选择文件对话框
            Microsoft.Win32.OpenFileDialog dialog = new Microsoft.Win32.OpenFileDialog();
            dialog.Multiselect = true;//该值确定是否可以选择多个文件
            dialog.Title = "请选择文件夹";
            dialog.Filter = "(*.crc)|*.crc;";
            dialog.ShowDialog();

            string[] files = dialog.FileNames;
            foreach (string file in files)
            {
                if (file.IndexOf("crc") > -1)
                {
                    if (File.Exists(file))
                    {
                        // 获取文件名和目标路径
                        string fileName = Path.GetFileName(file);
                        string destPath = Path_App + @"/Crc/" + fileName;
                        // 复制文件
                        File.Copy(file, destPath, true);
                        userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Crc_Image.Items.Add("导入成功：" + fileName);
                    }
                }
                else
                {
                    userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Crc_Image.Items.Add("导入失败：" + file);
                }
            }
        }
        private void ListBox_Crc_Image_Drop(object sender, DragEventArgs e)
        {
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Crc_Image.Items.Clear();

            if (e.Data.GetDataPresent(DataFormats.FileDrop))
            {
                string[] files = (string[])e.Data.GetData(DataFormats.FileDrop);
                foreach (string file in files)
                {
                    if (file.IndexOf("crc") > -1)
                    {
                        if (File.Exists(file))
                        {
                            // 获取文件名和目标路径
                            string fileName = Path.GetFileName(file);
                            string destPath = Path_App + @"/Crc/" + fileName;
                            // 复制文件
                            File.Copy(file, destPath, true);
                            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Crc_Image.Items.Add("导入成功：" + fileName);
                        }
                    }
                    else
                    {
                        userControl_Main_Home_Left_MyMusic_SongInfo_Edit.ListBox_Crc_Image.Items.Add("导入失败：" + file);
                    }
                }
            }
        }
        #endregion

        #endregion

        List<String> MusicUrls_CompleteDownLoad = new List<string>();
        #region 同步音乐数据库 数据库连接

        List<string> musicUrls;
        Services_Connection_SqlServer connection_SqlServer;
        Services_Connection_MySql connection_MySql;
        string savePath;

        private void Button_Connectio_SqlServer_Click(object sender, RoutedEventArgs e)
        {
            if (userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Data_Source.Length > 0 &&
                userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Database.Length > 0 &&
                userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.User_Id.Length > 0 &&
                userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Password.Length > 0)
            {
                string connectionString = 
                    "Data Source="+ userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Data_Source+ 
                    ";Initial Catalog="+ userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Database + 
                    ";User ID="+ userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.User_Id+ 
                    ";Password="+ userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Password;
                connection_SqlServer = new Services_Connection_SqlServer(
                    connectionString
                    );
            }
            else
            {
                MessageBox.Show("请先输入以上的远程数据库连接字段");
            }
        }
        private void Button_Connectio_MySql_Click(object sender, RoutedEventArgs e)
        {
            if (userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Data_Source.Length > 0 &&
               userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Database.Length > 0 &&
               userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.User_Id.Length > 0 &&
               userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Password.Length > 0 &&
               userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Port.Length > 0
               )
            {
                string connectionString = "server=" + userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Data_Source +
                           ";port=" + userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Port +
                           ";uid=" + userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.User_Id +
                           ";pwd=" + userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Password +
                           ";database=" + userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Database + ";";

                connection_MySql = new Services_Connection_MySql(
                    connectionString
                    );
            }
            else
            {
                MessageBox.Show("请先输入以上的远程数据库连接字段");
            }
        }
        private void Button_Run_this_SQL_Click(object sender, RoutedEventArgs e)
        {
            if(musicUrls != null)
                musicUrls.Clear();
            userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.
                            ListBox_Music_Urls_Show.Items.Clear();

            if (userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Port.Length < 0)
            {
                musicUrls = connection_SqlServer.GetMusicUrls(
                    userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Sql_String
                    );
            }
            else
            {
                musicUrls = connection_MySql.GetMusicUrls(
                    userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Sql_String
                    );
            }

            foreach (string url in musicUrls)
            {
                userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.
                            ListBox_Music_Urls_Show.Items.Add(url);
            }
        }
        private void Button_DownLoad_ALL_Music_Urls_Click(object sender, RoutedEventArgs e)
        {
            userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.
                            ListBox_Music_Urls_DownLoad_Results_Display.Items.Clear();

            using (WebClient client = new WebClient())
            {
                foreach (string url in musicUrls)
                {
                    try
                    {
                        string filename = savePath + url.Substring(url.LastIndexOf("/") + 1);
                        client.DownloadFile(url, filename);

                        //添加到歌单。。。。。
                        //
                    }
                    catch (Exception ex)
                    {
                        userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.
                            ListBox_Music_Urls_DownLoad_Results_Display.Items.Add("下载出错：" + url);
                    }
                }
            }
        }

        #endregion
        #region 同步音乐数据库 API获取

        private void Button_Begin_Conn_API_Click(object sender, RoutedEventArgs e)
        {
            MusicUrls_CompleteDownLoad.Clear();
            songList_Infos[1][0].Songs.Clear();//存储在本地音乐

            // 创建Services_Web_API对象
            Services_Web_API api = new Services_Web_API();

            // 获取music_url
            List<MusicData> musicDataList = api.GetMusicData();

            //显示music_url
            userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.ListBox_Music_Urls_Show.Items.Clear();
            foreach (MusicData musicData in musicDataList)
            {
                userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.ListBox_Music_Urls_Show.Items.Add("Music data received: " + musicData);
            }

            //下载music_url
            userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.ListBox_Music_Urls_DownLoad_Results_Display.Items.Clear();
            DownloadMusicAsync(savePath, musicDataList);
        }

        private void DownloadMusicAsync(string savePath, List<MusicData> musicDataList)
        {
            using (WebClient client = new WebClient())
            {
                foreach (MusicData musicData in musicDataList)
                {
                    string filename = savePath + musicData.music_url.Substring(musicData.music_url.LastIndexOf("/") + 1);

                    try
                    {
                        client.DownloadFile(musicData.music_url, filename);

                        userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.
                            ListBox_Music_Urls_DownLoad_Results_Display.Items.Add("下载成功：" + musicData.music_url);

                        MusicUrls_CompleteDownLoad.Add(filename);
                    }
                    catch (Exception ex)
                    {
                        userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.
                            ListBox_Music_Urls_DownLoad_Results_Display.Items.Add("下载出错：" + musicData.music_url + "，错误信息：" + ex.Message);
                    }
                }
            }

            // 下载完成后的处理代码
            Import_Downloaded_Music();
        }

        private void Import_Downloaded_Music()
        {
            if (MusicUrls_CompleteDownLoad.Count > 0)
            {
                ParseSongInfo(MusicUrls_CompleteDownLoad);
            }
        }

        private void ParseSongInfo(List<string> allSongPath)
        {
            int songIdsTemp = 0;

            foreach (string songPath in allSongPath)
            {
                int numsSongNameIndex = songPath.LastIndexOf(@"\") + 1;
                string songNameTemp = songPath.Substring(numsSongNameIndex);
                int songPathTempSongName = songNameTemp.LastIndexOf(".mp3");

                Song_Info songInfo = new Song_Info();

                if (songPathTempSongName <= 0)
                {
                    songPathTempSongName = songNameTemp.LastIndexOf(".flac");

                    if (songPathTempSongName <= 0)
                    {
                        songPathTempSongName = songNameTemp.LastIndexOf(".wav");
                    }
                }

                if (songPathTempSongName > 0 && numsSongNameIndex < songPathTempSongName)
                {
                    string singerNameTemp = songNameTemp;
                    int num1 = singerNameTemp.LastIndexOf(" - ");

                    if (num1 > 0)
                    {
                        singerNameTemp = singerNameTemp.Substring(0, num1).Trim(); 

                        if (!string.IsNullOrEmpty(singerNameTemp))
                        {
                            songInfo.Singer_Name = singerNameTemp;
                            songInfo.Song_Url = songPath;
                            songInfo.Song_No = songIdsTemp++;

                            string songNameTemp2 = songNameTemp.Substring(num1 + 3, songPathTempSongName - num1 - 3).Trim();
                            songInfo.Song_Name = songNameTemp2;

                            string albumTemp = GetAlbumName(songPath);
                            songInfo.Album_Name = albumTemp;

                            
                        }
                    }                   
                }
                else
                {
                    songInfo.Singer_Name = "未知" ;
                    songInfo.Song_Url = songPath;
                    songInfo.Song_No = songIdsTemp++;

                    songInfo.Song_Name = songPath.Substring(songPath.LastIndexOf("/") + 1);

                    songInfo.Album_Name = "未知";
                }

                songList_Infos[1][0].Songs.Add(songInfo);
            }

            //保存在Song_List_Info_ALL.xml中
            Save_SongListInfo();

            //重置数据源，重新读取xml
            Reset_App_ItemsSource();
        }
        private string GetAlbumName(string songPath)
        {
            string albumTemp = string.Empty;
            Shell shell = new Shell();
            Folder dir = shell.NameSpace(Path.GetDirectoryName(songPath));
            FolderItem item = dir.ParseName(Path.GetFileName(songPath));
            albumTemp = dir.GetDetailsOf(item, 14);
            return albumTemp;
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
            //播放列表选定项设置为0
            songList_Infos[1][0].SelectedIndex = 0;

            Select_DoubleClick_ListView = 1;
            Change_MediaElement_Source();
        }

        #endregion
        #region 手动添加音乐
        /// <summary>
        /// 确认别的歌单是否存在我的收藏的歌曲
        /// </summary>

        private void ThisWindowsMusicAndDownload_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[1][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFiles(songList_Infos[1][0].Songs,1);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[1][0].Songs;
        }
        private void My_Love_Button_Add_PC_Select_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[0][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFiles(songList_Infos[0][0].Songs,0);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[0][0].Songs;
        }
        private void Recent_Play_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[2][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFiles(songList_Infos[2][0].Songs,2);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[2][0].Songs;
        }

        int Song_Find_SongList_SelectedIndex;

        private void SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_3(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 3;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFiles(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_4(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 4;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFiles(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_5(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 5;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFiles(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_6(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 6;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFiles(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_7(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 7;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFiles(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_8(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 8;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFiles(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_9(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 9;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFiles(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_10(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 10;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFiles(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_11(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 11;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFiles(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_12(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 12;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFiles(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_13(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 13;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFiles(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_14(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 14;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFiles(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_15(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 15;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFiles(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown_16(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 16;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFiles(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        #endregion
        #region 添加本地音乐文件夹
        private void ThisWindowsMusicAndDownload_Stack_Button_Add_PC_SelectFolderBrowser_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[1][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFolderBrowser(songList_Infos[1][0].Songs, 1);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[1][0].Songs;
        }
        private void MyLove_Stack_Button_Add_PC_SelectFolderBrowser_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[0][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFolderBrowser(songList_Infos[0][0].Songs, 1);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[0][0].Songs;
        }
        private void Recent_Play_Stack_Button_Add_PC_SelectFolderBrowser_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[2][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFolderBrowser(songList_Infos[2][0].Songs, 1);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[2][0].Songs;
        } 

        private void SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_3(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 3;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFolderBrowser(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_4(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 4;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFolderBrowser(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_5(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 5;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFolderBrowser(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_6(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 6;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFolderBrowser(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_7(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 7;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFolderBrowser(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_8(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 8;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFolderBrowser(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_9(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 9;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFolderBrowser(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_10(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 10;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFolderBrowser(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_11(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 11;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFolderBrowser(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_12(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 12;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFolderBrowser(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_13(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 13;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFolderBrowser(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_14(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 14;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFolderBrowser(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_15(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 15;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFolderBrowser(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        private void SongListMore_Stack_Button_Add_PC_SelectFolderBrowser_MouseLeftButtonDown_16(object sender, MouseButtonEventArgs e)
        {
            Song_Find_SongList_SelectedIndex = 16;

            Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
            songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs = find_Song_Of_SelectFiles.Start_Find_Song_Of_SelectFolderBrowser(songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs, Song_Find_SongList_SelectedIndex);

            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[Song_Find_SongList_SelectedIndex][0].Songs;
        }
        #endregion


        #region UI Init加载

        #region 页面选择区
        /// <summary>
        /// 清空控件背景色
        /// </summary>
        public void Clear_Windows_Left_ALL_UserControl_BackGround()
        {
            userControl_ButtonFrame_MusicLove.BoolMouseLeftDown = false; 
            userControl_ButtonFrame_MusicLove.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
            userControl_ButtonFrame_ThisWindowsMusicAndDownload.BoolMouseLeftDown = false; 
            userControl_ButtonFrame_ThisWindowsMusicAndDownload.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
            userControl_ButtonFrame_MusicRecentlyPlayed.BoolMouseLeftDown = false; 
            userControl_ButtonFrame_MusicRecentlyPlayed.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
            Button_Edit_ALL_SongInfo.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }
        /// <summary>
        /// 窗体进入动画
        /// </summary>
        public void Grid_Animation_MouseLeftClick()
        {
            // 创建一个线程来执行动画
            Thread animationThread = new Thread(() =>
            {
                // 在新线程中执行动画
                Dispatcher.Invoke(() =>
                {
                    double temp = Frame_Show.ActualWidth;
                    //实例化一个DoubleAnimation类。
                    doubleAnimation = new DoubleAnimation();
                    //设置From属性。
                    doubleAnimation.From = temp - 60;
                    //设置To属性。
                    doubleAnimation.To = temp;
                    //设置Duration属性。
                    doubleAnimation.Duration = new Duration(TimeSpan.FromMilliseconds(200));
                    doubleAnimation.Completed += Grid_Animation_Completed_Frame_Show;
                    //为元素设置BeginAnimation方法。
                    Frame_Show.BeginAnimation(UserControl.WidthProperty, doubleAnimation);
                    Frame_Show.HorizontalAlignment = HorizontalAlignment.Stretch;
                });
            });
            animationThread.Start();
        }
        /// <summary>
        /// 解除动画绑定
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Grid_Animation_Completed_Frame_Show(object sender, EventArgs e)
        {
            Frame_Show.BeginAnimation(UserControl.WidthProperty, null);
        }

        #endregion

        #region App 初始化
        /// <summary>
        /// 初始化事件
        /// </summary>
        private void init()
        {
            //显示位置在屏幕中心
            this.WindowStartupLocation = WindowStartupLocation.CenterScreen;
            //去除窗体边框
            //this.WindowStyle = WindowStyle.None;this.AllowsTransparency = true;

            
            //高度绑定至动画，修改height就无法控制（启动时触发Window_SizeChanged事件导致height不为0不能隐藏）
            doubleAnimation = new DoubleAnimation();
            doubleAnimation.From = musicPlayer_Main_UserControl.ActualHeight;
            doubleAnimation.To = 0;
            doubleAnimation.Duration = new Duration(TimeSpan.FromMilliseconds(2));
            musicPlayer_Main_UserControl.BeginAnimation(UserControl.HeightProperty, doubleAnimation);

        }
        #endregion

        #region UI动画初始化
        public void Init_Animation()
        {
            //初始化背景切换动画事件加载
            bgstoryboard = new Storyboard();
            bgstoryboard.AutoReverse = false;
            bgstoryboard.FillBehavior = FillBehavior.HoldEnd;
            bgstoryboard.RepeatBehavior = new RepeatBehavior(1);
            BgSwitchIni();
            //动画参数设置
            num_duration = 200;
            num_Delay = 200;
            singerImage_Cut.numCutCells = 4;
            singerImage_Cut.numCutRows = 1;
            //单个歌手背景动画
            timer_Singer_Photo_One = new DispatcherTimer();
            timer_Singer_Photo_One.Interval = TimeSpan.FromMilliseconds(7777);
            timer_Singer_Photo_One.Tick += Change_Singer_Photo_To_Grid_Back;
            //多个歌手背景动画
            timer_Singer_Photo_One_Lot = new DispatcherTimer();
            timer_Singer_Photo_One_Lot.Interval = TimeSpan.FromMilliseconds(7777);
            timer_Singer_Photo_One_Lot.Tick += Change_Singer_Photo_To_Grid_Back_Lot;
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

            //App 设置
            userControl_ButtonFrame_TopPanel.Button_App_Setting.Click += Button_App_Setting_Click;
            userControl_ButtonFrame_App_Setting.Visibility = Visibility.Collapsed;

            //皮肤设置
            userControl_ButtonFrame_TopPanel.Button_Personalized_Skin.Click += Button_Personalized_Skin_Click;
            userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_1.MouseLeftButtonDown += Border_this_app_Background_1_MouseLeftButtonDown;
            userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_2.MouseLeftButtonDown += Border_this_app_Background_2_MouseLeftButtonDown;
            userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_3.MouseLeftButtonDown += Border_this_app_Background_3_MouseLeftButtonDown;
            userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_4.MouseLeftButtonDown += Border_this_app_Background_4_MouseLeftButtonDown;
            userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_5.MouseLeftButtonDown += Border_this_app_Background_5_MouseLeftButtonDown;
            userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_6.MouseLeftButtonDown += Border_this_app_Background_6_MouseLeftButtonDown;
            userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_7.MouseLeftButtonDown += Border_this_app_Background_7_MouseLeftButtonDown;
            userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_8.MouseLeftButtonDown += Border_this_app_Background_8_MouseLeftButtonDown;
            userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_User.MouseLeftButtonDown += Border_this_app_Background_User_MouseLeftButtonDown;
            //读取xml皮肤设置
            Data_Personalized_Skin.data_Personalized_Skins = Personalized_Skin_UserData_Reader.Load(Path_App + @"\User_Data\Data_Personalized_Skin.xml");
            if(Data_Personalized_Skin.data_Personalized_Skins
                .Personalized_Skin != -1)
            {
                if (Data_Personalized_Skin.data_Personalized_Skins
                    .Personalized_Skin == 1)
                {
                    this.Background = userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_1.Background;
                }
                else if (Data_Personalized_Skin.data_Personalized_Skins
                    .Personalized_Skin == 2)
                {
                    this.Background = userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_2.Background;
                }
                else if (Data_Personalized_Skin.data_Personalized_Skins
                    .Personalized_Skin == 3)
                {
                    this.Background = userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_3.Background;
                }
                else if (Data_Personalized_Skin.data_Personalized_Skins
                    .Personalized_Skin == 4)
                {
                    this.Background = userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_4.Background;
                }
                else if (Data_Personalized_Skin.data_Personalized_Skins
                    .Personalized_Skin == 5)
                {
                    this.Background = userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_5.Background;
                }
                else if (Data_Personalized_Skin.data_Personalized_Skins
                    .Personalized_Skin == 6)
                {
                    this.Background = userControl_Main_Home_TOP_Personalized_Skins.gradientBrush_6;
                }
                else if (Data_Personalized_Skin.data_Personalized_Skins
                    .Personalized_Skin == 7)
                {
                    this.Background = userControl_Main_Home_TOP_Personalized_Skins.gradientBrush_7;
                }
                else if (Data_Personalized_Skin.data_Personalized_Skins
                    .Personalized_Skin == 8)
                {
                    this.Background = userControl_Main_Home_TOP_Personalized_Skins.gradientBrush_8;
                }
            }
            else
            {
                ImageBrush temp = new ImageBrush();
                temp.ImageSource = new BitmapImage(new Uri(Data_Personalized_Skin.data_Personalized_Skins.ImageBrush_this_app_Background[0]));
                temp.Stretch = Stretch.UniformToFill;

                userControl_Main_Home_TOP_Personalized_Skins.ImageBrush_this_app_Background = temp;
                this_app_Background.Background = temp;

                Frame_Show.Background = null;
                userControl_ButtonFrame_TopPanel.Background = null;
            }
        }


        /// <summary>
        /// 皮肤设置
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        /// <exception cref="NotImplementedException"></exception>
        private void Button_Personalized_Skin_Click(object sender, RoutedEventArgs e)
        {
            userControl_Main_Home_TOP_Personalized_Skins.Visibility = Visibility.Visible;

            userControl_Main_Home_Left_MyMusic_My_Love.Visibility = Visibility.Collapsed;
            userControl_Main_Home_Left_MyMusic_Recent_Play.Visibility = Visibility.Collapsed;
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Visibility = Visibility.Collapsed;
            userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Visibility = Visibility.Collapsed;
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
        #region 最大化显示任务栏
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
            try
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

            }
            catch
            {

            }
            Thread.Sleep(50);
            Size_Changed();

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

        #region Main_Buttom控件初始化
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
            window_Hover_MRC_Panel.Button_Play_Pause_Player.Click += Button_Play_Pause_Player_Click;
            userControl_TaskbarIcon.Button_Play_Pause_Player.Click += Button_Play_Pause_Player_Click;
            userControl_ButtonFrame_MusicPlayer.Button_Before.Click += Button_Music_Up_Song;
            window_Hover_MRC_Panel.Button_Before.Click += Button_Music_Up_Song;
            userControl_TaskbarIcon.Button_Before.Click += Button_Music_Up_Song;
            userControl_ButtonFrame_MusicPlayer.Button_Next.Click += Button_Music_Next_Song;
            window_Hover_MRC_Panel.Button_Next.Click += Button_Music_Next_Song;
            userControl_TaskbarIcon.Button_Next.Click += Button_Music_Next_Song;
            userControl_ButtonFrame_MusicPlayer.Border_Hover_BackGround.MouseLeftButtonDown += Button_Border_Hover_BackGround_Click_OpenMainMusicPlayer;

            thickness_Grid_MusicPlayer_Main_UserControl_Normal.Left = 210;
            thickness_Grid_MusicPlayer_Main_UserControl_Enter.Left = 0;
            thickness_Grid_MusicPlayer_Main_UserControl_Enter.Right = 0;

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

            //设置进入播放器界面，返回主界面事件
            userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Mrc_Animation_Image.MouseLeftButtonDown += Button_Mrc_Animation_MouseLeftButtonDown;
            //
            userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Song_AudioSpectrogram_Image.MouseLeftButtonDown += Button_Song_AudioSpectrogram_MouseLeftButtonDown;
            //
            userControl_ButtonFrame_MusicPlayer.Button_Singer_Image_Animation_To_WindowsDesktop.Visibility = Visibility.Collapsed;
            userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Singer_Image_Animation_Image.MouseLeftButtonDown += Button_Singer_Image_Animation_Click;
            //
            userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Singer_Image_Animation_Image_To_WindowsDesktop.MouseLeftButtonDown += button_Open_Windows_Picture_Click;
            //
            userControl_ButtonFrame_MusicPlayer.Button_Desk_MRC.Click += Button_Window_Hover_MRC_Panel;
            userControl_ButtonFrame_MusicPlayer.Button_Desk_MRC_Right.Click += Button_Window_Hover_MRC_Panel;
            userControl_TaskbarIcon.Open_Desktop_Lyic.MouseLeftButtonDown += Button_Window_Hover_MRC_Panel;
            userControl_TaskbarIcon.SvgViewbox_Open_Desktop_Lyic.MouseLeftButtonDown += Button_Window_Hover_MRC_Panel;
            //隐藏播放顺序与音量设置按键
            userControl_ButtonFrame_MusicPlayer.Stack_Panel_Order.Visibility = Visibility.Collapsed;
            userControl_ButtonFrame_MusicPlayer.Stack_Panel_Voice.Visibility = Visibility.Collapsed;
            //设置播放顺序按键
            userControl_ButtonFrame_MusicPlayer.Button_Music_Order.Click += Button_WMP_Song_Order_Click;
            userControl_ButtonFrame_MusicPlayer.Stack_Button_Radom_Order.MouseLeftButtonDown += Stack_Button_Radom_Click;
            userControl_ButtonFrame_MusicPlayer.Stack_Button_Normal_Order.MouseLeftButtonDown += Stack_Button_Normal_Click;
            userControl_ButtonFrame_MusicPlayer.Stack_Button_OnlyOne_Order.MouseLeftButtonDown += Stack_Button_OnlyOne_Click;
            userControl_ButtonFrame_MusicPlayer.Stack_Button_List_Order.MouseLeftButtonDown += Stack_Button_List_Click;
            //
            userControl_ButtonFrame_MusicPlayer.SvgViewbox_Stack_Button_Radom_Order.MouseLeftButtonDown += Stack_Button_Radom_Click;
            userControl_ButtonFrame_MusicPlayer.SvgViewbox_Stack_Button_Normal_Order.MouseLeftButtonDown += Stack_Button_Normal_Click;
            userControl_ButtonFrame_MusicPlayer.SvgViewbox_Stack_Button_OnlyOne_Order.MouseLeftButtonDown += Stack_Button_OnlyOne_Click;
            userControl_ButtonFrame_MusicPlayer.SvgViewbox_Stack_Button_List_Order.MouseLeftButtonDown += Stack_Button_List_Click;
            //设置音量按键
            userControl_ButtonFrame_MusicPlayer.Button_Music_Voice_Speed.Click += Button_WMP_Song_Voice_Click;
            userControl_ButtonFrame_MusicPlayer.Slider_Voice.Maximum = 1;
            userControl_ButtonFrame_MusicPlayer.Slider_Voice.Value = MediaElement_Song.Volume;
            userControl_ButtonFrame_MusicPlayer.Voice_Nums.Text = Convert.ToInt32((userControl_ButtonFrame_MusicPlayer.Slider_Voice.Value) * 100) + "%";
            userControl_ButtonFrame_MusicPlayer.Slider_Voice.ValueChanged += WMP_Song_Slider_Voice_Value_Changed;
            //
            userControl_TaskbarIcon.Slider_Voice.Maximum = 1;
            userControl_TaskbarIcon.Slider_Voice.Value = MediaElement_Song.Volume;
            userControl_TaskbarIcon.Slider_Voice.ValueChanged += WMP_Song_Slider_Voice_Value_Temp_Changed;
            //
            userControl_ButtonFrame_MusicPlayer.Button_Voice_Close.MouseLeftButtonDown += Button_Voice_Close_MouseLeftButtonDown;

            //存储Windows背景图片
            //定义存储缓冲区大小
            StringBuilder s = new StringBuilder(300);
            //获取Window 桌面背景图片地址，使用缓冲区
            SystemParametersInfo(SPI_GETDESKWALLPAPER, 300, s, 0);
            //缓冲区中字符进行转换
            wallpaper_path.Append(s.ToString()); //系统桌面背景图片路径

            //设置按键背景
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";
            
            //调整歌词列表的边距
            thickness_ListView_Temp_MRC_Margin = musicPlayer_Main_UserControl.ListView_Temp_MRC.Margin;

            //设置添加手动导入歌曲文件按钮事件
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Stack_Button_Add_Select_Song.MouseLeftButtonDown += ThisWindowsMusicAndDownload_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_My_Love.Stack_Button_Add_Select_Song.MouseLeftButtonDown += My_Love_Button_Add_PC_Select_Song_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_Recent_Play.Stack_Button_Add_Select_Song.MouseLeftButtonDown += Recent_Play_Stack_Button_Add_PC_Select_Song_MouseLeftButtonDown;

            //设置添加本地所有歌曲文件按钮事件            
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += ThisWindowsMusicAndDownload_Stack_Button_Add_PC_SelectFolderBrowser_Song_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_My_Love.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += MyLove_Stack_Button_Add_PC_SelectFolderBrowser_Song_MouseLeftButtonDown;
            userControl_Main_Home_Left_MyMusic_Recent_Play.Stack_Button_Add_PC_ALL_Song.MouseLeftButtonDown += Recent_Play_Stack_Button_Add_PC_SelectFolderBrowser_Song_MouseLeftButtonDown;

            /*// 定义颜色和透明度
            Color baseColor = Color.FromRgb(240, 240, 240); // F0F0F0
            Color highlightColor = Color.FromRgb(255, 255, 255); // FFFFFF
            Color shadowColor = Color.FromRgb(0, 0, 0); // 000000
            // 创建线性渐变刷
            new SolidColorBrush((Color)ColorConverter.ConvertFromString("#60FFFFFF")) = new LinearGradientBrush();
            new SolidColorBrush((Color)ColorConverter.ConvertFromString("#60FFFFFF")).StartPoint = new Point(0, 0);
            new SolidColorBrush((Color)ColorConverter.ConvertFromString("#60FFFFFF")).EndPoint = new Point(1, 0);
            new SolidColorBrush((Color)ColorConverter.ConvertFromString("#60FFFFFF")).GradientStops.Add(new GradientStop(highlightColor, 0));
            new SolidColorBrush((Color)ColorConverter.ConvertFromString("#60FFFFFF")).GradientStops.Add(new GradientStop(baseColor, 1));
            userControl_ButtonFrame_ThisWindowsMusicAndDownload.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#60FFFFFF"));*/

            userControl_TaskbarIcon.Close_ThisApp.MouseLeftButtonDown += Window_Closed;
            userControl_TaskbarIcon.SvgViewbox_Close_ThisApp.MouseLeftButtonDown += Window_Closed;
        }

        


        #endregion

        bool Bool_Mrc_Animation = true;//是否开启歌词逐字
        bool Bool_Button_Play_Pause_Player;//播放状态
        bool Bool_OpenMainMusicPlayer;//是否打开播放器
        bool Bool_Button_Singer_Image_Animation;//歌手写真动画
        bool Bool_Animation_Storyboard_BeginMusic_Jukebox_Playing;//是否已启动动画
        DoubleAnimation doubleAnimation;//窗体动画
        BlurEffect blurEffect = new BlurEffect();
        #region MusicPlayer_Left控件进入

        private void userControl_ButtonFrame_Search_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
           /* userControl_Main_Home_Left_OnlineMusic_Search_Song.Visibility = Visibility.Visible;

            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Visibility = Visibility.Collapsed;
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Singer_Name.Text = "";
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Song_Name.Text = "";
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Album_Name.Text = "";

            userControl_Main_Home_Left_MyMusic_My_Love.Visibility = Visibility.Collapsed;
            userControl_Main_Home_Left_MyMusic_Recent_Play.Visibility = Visibility.Collapsed;
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Visibility = Visibility.Collapsed;
            userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Visibility = Visibility.Collapsed;

            userControl_Main_Home_TOP_Personalized_Skins.Visibility = Visibility.Collapsed;*/

        }

        private void userControl_ButtonFrame_Search_Singer_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {

        }

        private void userControl_ButtonFrame_Search_Album_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {

        }



        /// <summary>
        /// 同步音乐数据库
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Load_UserData_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            /*userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Visibility = Visibility.Collapsed;
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Singer_Name.Text = "";
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Song_Name.Text = "";
            userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Album_Name.Text = "";

            userControl_Main_Home_Left_MyMusic_My_Love.Visibility = Visibility.Collapsed;
            userControl_Main_Home_Left_MyMusic_Recent_Play.Visibility = Visibility.Collapsed;
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Visibility = Visibility.Collapsed;
            userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Visibility = Visibility.Visible;

            userControl_Main_Home_TOP_Personalized_Skins.Visibility = Visibility.Collapsed;
            userControl_Main_Home_Left_OnlineMusic_Search_Song.Visibility = Visibility.Collapsed;*/
        }

        private void UserControl_ButtonFrame_MusicLove_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            ComBox_Select_SongList_SelectIndex = -1;
            ComBox_Select_SongList.SelectedIndex = ComBox_Select_SongList_SelectIndex;

            //此前ItemsSource为空，防止数据与UI不同步导致崩溃，现在重新绑定数据源
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = songList_Infos[1][0].Songs;
            userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = songList_Infos[0][0].Songs;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[2][0].Songs;
            //防止数据与UI不同步导致崩溃，设置为null
            userControl_Main_Home_Left_MyMusic_Mores_TabControl.ItemsSource = null;

            if (songList_Infos[0][0].Songs != null)
            {
                Clear_Windows_Left_ALL_UserControl_BackGround();
                userControl_ButtonFrame_MusicLove.BoolMouseLeftDown = true;
                userControl_ButtonFrame_MusicLove.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#60FFFFFF"));

                if (songList_Infos[0][0].Songs.Count > 0)
                {
                    userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = null;
                    //歌曲序号重构
                    for (int i = 0; i < songList_Infos[0][0].Songs.Count; i++)
                    {
                        songList_Infos[0][0].Songs.ElementAt(i).Song_No = i + 1;
                    }
                    userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = songList_Infos[0][0].Songs;

                }
                
                userControl_Main_Home_Left_MyMusic_My_Love.Visibility = Visibility.Visible;
                userControl_Main_Home_Left_MyMusic_Recent_Play.Visibility = Visibility.Collapsed;
                userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Visibility = Visibility.Collapsed;
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Visibility = Visibility.Collapsed;
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Singer_Name.Text = "";
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Song_Name.Text = "";
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Album_Name.Text = "";
                userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Visibility = Visibility.Collapsed;
                userControl_Main_Home_TOP_Personalized_Skins.Visibility = Visibility.Collapsed;
                userControl_Main_Home_Left_OnlineMusic_Search_Song.Visibility = Visibility.Collapsed;

                Grid_Animation_MouseLeftClick();/// 窗体进入动画

                //同步歌曲曲目数量
                userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload
                    .Recent_Song_Nums.Text
                    = "歌曲：" + userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload
                    .ListView_Download_SongList_Info.Items.Count.ToString();
            }
        }

        private void UserControl_ButtonFrame_ThisWindowsMusicAndDownload_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            ComBox_Select_SongList_SelectIndex = -1;
            ComBox_Select_SongList.SelectedIndex = ComBox_Select_SongList_SelectIndex;

            //此前ItemsSource为空，防止数据与UI不同步导致崩溃，现在重新绑定数据源
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = songList_Infos[1][0].Songs;
            userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = songList_Infos[0][0].Songs;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[2][0].Songs;
            //防止数据与UI不同步导致崩溃，设置为null
            userControl_Main_Home_Left_MyMusic_Mores_TabControl.ItemsSource = null;

            if (songList_Infos[1][0].Songs != null)
            {
                Clear_Windows_Left_ALL_UserControl_BackGround();
                userControl_ButtonFrame_ThisWindowsMusicAndDownload.BoolMouseLeftDown = true;
                userControl_ButtonFrame_ThisWindowsMusicAndDownload.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#60FFFFFF"));

                if (songList_Infos[1][0].Songs.Count > 0)
                {
                    userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = null;
                    //歌曲序号重构
                    for (int i = 0; i < songList_Infos[1][0].Songs.Count; i++)
                    {
                        songList_Infos[1][0].Songs.ElementAt(i).Song_No = i + 1;
                    }
                    userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = songList_Infos[1][0].Songs;

                }

                userControl_Main_Home_Left_MyMusic_My_Love.Visibility = Visibility.Collapsed;
                userControl_Main_Home_Left_MyMusic_Recent_Play.Visibility = Visibility.Collapsed;
                userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Visibility = Visibility.Visible;
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Visibility = Visibility.Collapsed;
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Singer_Name.Text = "";
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Song_Name.Text = "";
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Album_Name.Text = "";
                userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Visibility = Visibility.Collapsed;
                userControl_Main_Home_TOP_Personalized_Skins.Visibility = Visibility.Collapsed;
                userControl_Main_Home_Left_OnlineMusic_Search_Song.Visibility = Visibility.Collapsed;

                Grid_Animation_MouseLeftClick();/// 窗体进入动画

                //同步歌曲曲目数量
                userControl_Main_Home_Left_MyMusic_My_Love
                    .Recent_Song_Nums.Text
                    = "歌曲：" + userControl_Main_Home_Left_MyMusic_My_Love
                    .ListView_Download_SongList_Info.Items.Count.ToString();
            }
        }
        private void UserControl_ButtonFrame_MusicRecentlyPlayed_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            ComBox_Select_SongList_SelectIndex = -1;
            ComBox_Select_SongList.SelectedIndex = ComBox_Select_SongList_SelectIndex;

            //此前ItemsSource为空，防止数据与UI不同步导致崩溃，现在重新绑定数据源
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.ListView_Download_SongList_Info.ItemsSource = songList_Infos[1][0].Songs;
            userControl_Main_Home_Left_MyMusic_My_Love.ListView_Download_SongList_Info.ItemsSource = songList_Infos[0][0].Songs;
            userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[2][0].Songs;
            //防止数据与UI不同步导致崩溃，设置为null
            userControl_Main_Home_Left_MyMusic_Mores_TabControl.ItemsSource = null;

            if (songList_Infos[2][0].Songs != null)
            {
                Clear_Windows_Left_ALL_UserControl_BackGround();
                userControl_ButtonFrame_MusicRecentlyPlayed.BoolMouseLeftDown = true;
                userControl_ButtonFrame_MusicRecentlyPlayed.Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#60FFFFFF"));

                if (songList_Infos[2][0].Songs.Count > 0)
                {
                    userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = null;
                    //歌曲序号重构
                    for (int i = 0; i < songList_Infos[2][0].Songs.Count; i++)
                    {
                        songList_Infos[2][0].Songs.ElementAt(i).Song_No = i + 1;
                    }
                    userControl_Main_Home_Left_MyMusic_Recent_Play.ListView_Download_SongList_Info.ItemsSource = songList_Infos[2][0].Songs;

                }

                userControl_Main_Home_Left_MyMusic_My_Love.Visibility = Visibility.Collapsed;
                userControl_Main_Home_Left_MyMusic_Recent_Play.Visibility = Visibility.Visible;
                userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload.Visibility = Visibility.Collapsed;
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.Visibility = Visibility.Collapsed;
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Singer_Name.Text = "";
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Song_Name.Text = "";
                userControl_Main_Home_Left_MyMusic_SongInfo_Edit.TextBox_Edit_Album_Name.Text = "";
                userControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.Visibility = Visibility.Collapsed;
                userControl_Main_Home_TOP_Personalized_Skins.Visibility = Visibility.Collapsed;
                userControl_Main_Home_Left_OnlineMusic_Search_Song.Visibility = Visibility.Collapsed;

                Grid_Animation_MouseLeftClick();/// 窗体进入动画

                //同步歌曲曲目数量
                userControl_Main_Home_Left_MyMusic_Recent_Play
                    .Recent_Song_Nums.Text
                    = "歌曲：" + userControl_Main_Home_Left_MyMusic_Recent_Play
                    .ListView_Download_SongList_Info.Items.Count.ToString();
            }
        }

        #endregion
        #region MusicPlayer_Top控件按键操作      
        /// <summary>
        /// APP 皮肤设置
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        /// <exception cref="NotImplementedException"></exception>
        private void Border_this_app_Background_1_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this_app_Background.Background = userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_1.Background;

            Data_Personalized_Skin.data_Personalized_Skins.Personalized_Skin = 1;

            Personalized_Skin_UserData_Save.Save(
                Path_App + @"\User_Data\Data_Personalized_Skin.xml",
                Data_Personalized_Skin.data_Personalized_Skins
            );
        }
        private void Border_this_app_Background_2_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this_app_Background.Background = userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_2.Background;

            Data_Personalized_Skin.data_Personalized_Skins.Personalized_Skin = 2;

            Personalized_Skin_UserData_Save.Save(
                Path_App + @"\User_Data\Data_Personalized_Skin.xml",
                Data_Personalized_Skin.data_Personalized_Skins
            );
        }
        private void Border_this_app_Background_3_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this_app_Background.Background = userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_3.Background;

            Data_Personalized_Skin.data_Personalized_Skins.Personalized_Skin = 3;

            Personalized_Skin_UserData_Save.Save(
                Path_App + @"\User_Data\Data_Personalized_Skin.xml",
                Data_Personalized_Skin.data_Personalized_Skins
            );
        }
        private void Border_this_app_Background_4_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this_app_Background.Background = userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_4.Background;

            Data_Personalized_Skin.data_Personalized_Skins.Personalized_Skin = 4;

            Personalized_Skin_UserData_Save.Save(
                Path_App + @"\User_Data\Data_Personalized_Skin.xml",
                Data_Personalized_Skin.data_Personalized_Skins
            );
        }
        private void Border_this_app_Background_5_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this_app_Background.Background = userControl_Main_Home_TOP_Personalized_Skins.Border_this_app_Background_5.Background;

            Data_Personalized_Skin.data_Personalized_Skins.Personalized_Skin = 5;

            Personalized_Skin_UserData_Save.Save(
                Path_App + @"\User_Data\Data_Personalized_Skin.xml",
                Data_Personalized_Skin.data_Personalized_Skins
            );
        }
        private void Border_this_app_Background_6_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this_app_Background.Background = userControl_Main_Home_TOP_Personalized_Skins.gradientBrush_6;

            Data_Personalized_Skin.data_Personalized_Skins.Personalized_Skin = 6;

            Personalized_Skin_UserData_Save.Save(
                Path_App + @"\User_Data\Data_Personalized_Skin.xml",
                Data_Personalized_Skin.data_Personalized_Skins
            );
        }
        private void Border_this_app_Background_7_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this_app_Background.Background = userControl_Main_Home_TOP_Personalized_Skins.gradientBrush_7;

            Data_Personalized_Skin.data_Personalized_Skins.Personalized_Skin = 7;

            Personalized_Skin_UserData_Save.Save(
                Path_App + @"\User_Data\Data_Personalized_Skin.xml",
                Data_Personalized_Skin.data_Personalized_Skins
            );
        }
        private void Border_this_app_Background_8_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this_app_Background.Background = userControl_Main_Home_TOP_Personalized_Skins.gradientBrush_8;

            Data_Personalized_Skin.data_Personalized_Skins.Personalized_Skin = 8;

            Personalized_Skin_UserData_Save.Save(
                Path_App + @"\User_Data\Data_Personalized_Skin.xml",
                Data_Personalized_Skin.data_Personalized_Skins
            );
        }

        private void Border_this_app_Background_User_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            // 显示选择文件对话框
            Microsoft.Win32.OpenFileDialog dialog = new Microsoft.Win32.OpenFileDialog();
            dialog.Multiselect = false;//该值确定是否可以选择多个文件
            dialog.Title = "请选择文件夹";
            dialog.Filter = "(*.jpg,*.png)|*.jpg;*.png;";
            dialog.ShowDialog();

            if (dialog.FileName != null)
            {
                if (dialog.FileName.Length > 0)
                {
                    ImageBrush temp = new ImageBrush();
                    temp.ImageSource = new BitmapImage(new Uri(dialog.FileNames[0]));
                    temp.Stretch = Stretch.UniformToFill;
                    userControl_Main_Home_TOP_Personalized_Skins.ImageBrush_this_app_Background = temp;

                    this_app_Background.Background = temp;

                    Data_Personalized_Skin.data_Personalized_Skins.Personalized_Skin = -1;
                    Data_Personalized_Skin.data_Personalized_Skins.ImageBrush_this_app_Background[0] = dialog.FileNames[0];

                    Personalized_Skin_UserData_Save.Save(
                        Path_App + @"\User_Data\Data_Personalized_Skin.xml",
                        Data_Personalized_Skin.data_Personalized_Skins
                    );
                }
            }
        }

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
            try
            {
                Bool_OpenMainMusicPlayer = true;
                userControl_ButtonFrame_MusicPlayer.Bool_Player_Model = true;

                musicPlayer_Main_UserControl.VerticalAlignment = VerticalAlignment.Bottom;

                Frame_Buttom_MusicPlayerUserControl.Margin = thickness_Grid_MusicPlayer_Main_UserControl_Enter;

                //专辑旋转，性能优化需要隐藏
                if (!Bool_Button_Singer_Image_Animation)
                    //musicPlayer_Main_UserControl.Panel_Image.Visibility = Visibility.Visible;

                musicPlayer_Main_UserControl.Width = this.Width ;
                musicPlayer_Main_UserControl.Height = this.Height ;

                userControl_ButtonFrame_MusicPlayer.Grid_MusicPlayer_MainWindow_Right.Visibility = Visibility.Collapsed;
                userControl_ButtonFrame_MusicPlayer.Grid_MusicPlayer_Main_Right.Visibility = Visibility.Visible;
                userControl_ButtonFrame_MusicPlayer.TextBox_Song_Time_Temp.Visibility = Visibility.Visible;
                userControl_ButtonFrame_MusicPlayer.TextBox_Song_Album_Name.Visibility = Visibility.Collapsed;
                userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.Visibility = Visibility.Visible;

                musicPlayer_Main_UserControl.ListView_Temp_MRC.Visibility = Visibility.Collapsed;
                musicPlayer_Main_UserControl.TextBox_SongName.Visibility = Visibility.Visible;
                musicPlayer_Main_UserControl.TextBox_SingerName.Visibility = Visibility.Visible;
                musicPlayer_Main_UserControl.TextBox_SongAlbumName.Visibility = Visibility.Visible;

                GC.Collect();
                // 创建一个线程来执行动画
                Thread animationThread = new Thread(() =>
                {
                    // 在新线程中执行动画
                    Dispatcher.Invoke(() =>
                    {
                        DoubleAnimation animation = new DoubleAnimation
                        {
                            From = 0,
                            To = this.ActualHeight,
                            Duration = TimeSpan.FromMilliseconds(200) // 设置动画持续时间
                            /*EasingFunction = new CubicEase() // 设置缓动函数（可选，用于调整动画效果）*/
                        };
                        Storyboard storyboard = new Storyboard();
                        storyboard.Children.Add(animation);
                        Storyboard.SetTarget(animation, musicPlayer_Main_UserControl);
                        Storyboard.SetTargetProperty(animation, new PropertyPath(Grid.HeightProperty));
                        storyboard.Completed += DoubleAnimation_Completed;

                        Timeline.SetDesiredFrameRate(storyboard, 60);
                        storyboard.Begin();
                    });
                });
                animationThread.Start();

                userControl_ButtonFrame_MusicPlayer.Border_Hover_BackGround.MouseLeftButtonDown -= Button_Border_Hover_BackGround_Click_OpenMainMusicPlayer;
                userControl_ButtonFrame_MusicPlayer.Border_Hover_BackGround.MouseLeftButtonDown += Button_Return_MainWindow_Click_CloseMainMusicPlayer;
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
            try
            {
                Bool_OpenMainMusicPlayer = false;
                userControl_ButtonFrame_MusicPlayer.Bool_Player_Model = false;

                musicPlayer_Main_UserControl.VerticalAlignment = VerticalAlignment.Bottom;

                Frame_Buttom_MusicPlayerUserControl.Margin = thickness_Grid_MusicPlayer_Main_UserControl_Normal;

                musicPlayer_Main_UserControl.Width = this.Width ;
                musicPlayer_Main_UserControl.Height = this.Height ;

                userControl_ButtonFrame_MusicPlayer.Grid_MusicPlayer_MainWindow_Right.Visibility = Visibility.Visible;
                userControl_ButtonFrame_MusicPlayer.Grid_MusicPlayer_Main_Right.Visibility = Visibility.Collapsed;
                userControl_ButtonFrame_MusicPlayer.TextBox_Song_Time_Temp.Visibility = Visibility.Collapsed;
                userControl_ButtonFrame_MusicPlayer.TextBox_Song_Album_Name.Visibility = Visibility.Visible;
                userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.Visibility = Visibility.Collapsed;

                musicPlayer_Main_UserControl.ListView_Temp_MRC.Visibility = Visibility.Collapsed;
                musicPlayer_Main_UserControl.TextBox_SongName.Visibility = Visibility.Collapsed;
                musicPlayer_Main_UserControl.TextBox_SingerName.Visibility = Visibility.Collapsed;
                musicPlayer_Main_UserControl.TextBox_SongAlbumName.Visibility = Visibility.Collapsed;

                GC.Collect();

                // 创建一个线程来执行动画
                Thread animationThread = new Thread(() =>
                {
                    // 在新线程中执行动画
                    Dispatcher.Invoke(() =>
                    {
                        DoubleAnimation animation = new DoubleAnimation
                        {
                            From = this.ActualHeight,
                            To = 0,
                            Duration = TimeSpan.FromMilliseconds(200) // 设置动画持续时间
                           /* EasingFunction = new CubicEase() // 设置缓动函数（可选，用于调整动画效果）*/
                        };
                        Storyboard storyboard = new Storyboard();
                        storyboard.Children.Add(animation);
                        Storyboard.SetTarget(animation, musicPlayer_Main_UserControl);
                        Storyboard.SetTargetProperty(animation, new PropertyPath(Grid.HeightProperty));
                        storyboard.Completed += DoubleAnimation_Completed;
                        Timeline.SetDesiredFrameRate(storyboard, 60);
                        storyboard.Begin();
                    });
                });
                animationThread.Start();

                userControl_ButtonFrame_MusicPlayer.Border_Hover_BackGround.MouseLeftButtonDown -= Button_Return_MainWindow_Click_CloseMainMusicPlayer;
                userControl_ButtonFrame_MusicPlayer.Border_Hover_BackGround.MouseLeftButtonDown += Button_Border_Hover_BackGround_Click_OpenMainMusicPlayer;
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

                userControl_TaskbarIcon.TextBlock_Open_Desktop_Lyic.Text = "关闭桌面歌词";
            }
            else
            {
                window_Hover_MRC_Panel.Hide();

                window_Hover_MRC_Panel.Bool_Open_MRC_Panel = false;

                userControl_TaskbarIcon.TextBlock_Open_Desktop_Lyic.Text = "开启桌面歌词";
            }
        }


        /// <summary>
        /// 开启逐字动画
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        /// <exception cref="NotImplementedException"></exception>
        private void Button_Mrc_Animation_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if(Bool_Mrc_Animation == false)
            {
                userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Mrc_Animation_Image.Source = new Uri(Path_App + "/Button_Image_Svg/开关-开.svg");

                Bool_Mrc_Animation = true;
            }
            else
            {
                userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Mrc_Animation_Image.Source = new Uri(Path_App + "/Button_Image_Svg/开关-关.svg");

                Bool_Mrc_Animation = false;
            }
        }

        /// <summary>
        /// 开启频谱动画
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        /// <exception cref="NotImplementedException"></exception>
        private void Button_Song_AudioSpectrogram_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                            audioSpectrogram.viewModule.IsRecording == false)
            {
                dispatcherTimer_Spectrum_Visualization.Start();

                userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                            audioSpectrogram.StartBtn_Click();

                userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.Visibility = Visibility.Visible;
                userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Song_AudioSpectrogram_Image.Source = new Uri(Path_App + "/Button_Image_Svg/开关-开.svg");

                userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                            audioSpectrogram.viewModule.IsRecording = true;
            }
            else
            {
                dispatcherTimer_Spectrum_Visualization.Stop();

                userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                            audioSpectrogram.StopBtn_Click();

                userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.Visibility = Visibility.Collapsed;
                userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Song_AudioSpectrogram_Image.Source = new Uri(Path_App + "/Button_Image_Svg/开关-关.svg");

                userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                            audioSpectrogram.viewModule.IsRecording = false;
            }
        }

        /// <summary>
        /// 开启歌手写真动画
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Button_Singer_Image_Animation_Click(object sender, EventArgs e)
        {
            userControl_ButtonFrame_MusicPlayer.Bool_Player_Model = true;

            if (!Bool_Button_Singer_Image_Animation)
            {
                Open_Singer_Image_Animation();

                userControl_ButtonFrame_MusicPlayer.Button_Singer_Image_Animation_To_WindowsDesktop.Visibility = Visibility.Visible;
                userControl_ButtonFrame_MusicPlayer.Button_Singer_Image_Animation_Image_To_WindowsDesktop.Visibility = Visibility.Visible;
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

                userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Singer_Image_Animation_Image.Source = new Uri(Path_App + "/Button_Image_Svg/开关-关.svg");
                Bool_Button_Singer_Image_Animation = false;

                musicPlayer_Main_UserControl.Image_Singer_Buttom.Visibility = Visibility.Visible;
                
                //关闭桌面写真
                userControl_ButtonFrame_MusicPlayer.Button_Singer_Image_Animation_To_WindowsDesktop.Visibility = Visibility.Collapsed;
                userControl_ButtonFrame_MusicPlayer.Button_Singer_Image_Animation_Image_To_WindowsDesktop.Visibility = Visibility.Collapsed;
                SystemParametersInfo(20, 1, wallpaper_path, 1);
                Bool_Windows_Wallpaper = false;
                userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Singer_Image_Animation_Image_To_WindowsDesktop.Source = new Uri(Path_App + "/Button_Image_Svg/开关-关.svg");


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
            }
        }
        public void Open_Singer_Image_Animation()
        {
            Change_Image_Singer();//切换歌手图片

            userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Singer_Image_Animation_Image.Source = new Uri(Path_App + "/Button_Image_Svg/开关-开.svg");
            Bool_Button_Singer_Image_Animation = true;

            musicPlayer_Main_UserControl.Image_Singer_Buttom.Visibility = Visibility.Visible;
            //musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close.Visibility = Visibility.Collapsed;


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
            if (viewModule_Search_Song.MediaElement_Song_Url != null)
            {
                if (viewModule_Search_Song.MediaElement_Song_Url.ToString().Length > 0)
                {
                    if (!Bool_Button_Play_Pause_Player)
                    {
                        userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Play_Pause_Player.Source = new Uri(Path_App + @"\Button_Image_Svg\暂停.svg");
                        window_Hover_MRC_Panel.SvgViewbox_Button_Play_Pause_Player.Source = new Uri(Path_App + @"\Button_Image_Svg\暂停.svg");
                        userControl_TaskbarIcon.SvgViewbox_Button_Play_Pause_Player.Source = new Uri(Path_App + @"\Button_Image_Svg\暂停.svg");
                        Bool_Button_Play_Pause_Player = true;

                        MediaElement_Song.Play();
                        MediaElement_Song.LoadedBehavior = MediaState.Play;

                        if (myTextBlock_Storyboard != null)
                        {
                            myTextBlock_Storyboard.Resume();
                            //window_Hover_MRC_Panel.Text_Storyboard.Resume();
                            if (window_Hover_MRC_Panel.Text_Storyboard_slider_Up != null)
                            {
                                window_Hover_MRC_Panel.Text_Storyboard_slider_Up.Resume();
                                window_Hover_MRC_Panel.Text_Storyboard_slider_Down.Resume();

                                if (storyboard_lyic != null)
                                    storyboard_lyic.Resume();
                                if (storyboard_lyic_desk != null)
                                    storyboard_lyic_desk.Resume();
                            }
                        }
                    }
                    else
                    {
                        userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Play_Pause_Player.Source = new Uri(Path_App + @"\Button_Image_Svg\播放.svg");
                        window_Hover_MRC_Panel.SvgViewbox_Button_Play_Pause_Player.Source = new Uri(Path_App + @"\Button_Image_Svg\播放.svg");
                        userControl_TaskbarIcon.SvgViewbox_Button_Play_Pause_Player.Source = new Uri(Path_App + @"\Button_Image_Svg\播放.svg");
                        Bool_Button_Play_Pause_Player = false;

                        MediaElement_Song.Pause();
                        MediaElement_Song.LoadedBehavior = MediaState.Pause;

                        if (myTextBlock_Storyboard != null)
                        {
                            myTextBlock_Storyboard.Pause();
                            //window_Hover_MRC_Panel.Text_Storyboard.Pause();
                            if (window_Hover_MRC_Panel.Text_Storyboard_slider_Up != null)
                            {
                                window_Hover_MRC_Panel.Text_Storyboard_slider_Up.Pause();
                                window_Hover_MRC_Panel.Text_Storyboard_slider_Down.Pause();

                                if (storyboard_lyic != null)
                                    storyboard_lyic.Pause();
                                if (storyboard_lyic_desk != null)
                                    storyboard_lyic_desk.Pause();
                            }
                        }
                    }
                }
            }
            else
            {
                //则播放播放列表的第一首
                if(songList_Infos_Current_Playlist.Count > 0)
                {
                    if (File.Exists(songList_Infos_Current_Playlist[0].Song_Url))
                    {
                        viewModule_Search_Song.MediaElement_Song_Url = new Uri(songList_Infos_Current_Playlist[0].Song_Url);
                        WMP_Song_Play_Ids = 1;
                        Change_MediaElement_Source();
                    }
                    else
                    {
                        string path = Path_App + songList_Infos_Current_Playlist[0].Song_Url;
                        if (File.Exists(path))
                        {
                            viewModule_Search_Song.MediaElement_Song_Url = new Uri(path);
                            WMP_Song_Play_Ids = 1;
                            Change_MediaElement_Source();
                        }
                        else
                        {
                            MessageBox.Show("歌曲文件路径错误：" + songList_Infos_Current_Playlist[0].Song_Url);
                        }
                    }
                }
                
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

        int Int_Button_WMP_Song_Order;//-1:列表  0:默认  1:单曲  2:随机
        /// <summary>
        /// 播放顺序
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Button_WMP_Song_Order_Click(object sender, EventArgs e)
        {
            if (userControl_ButtonFrame_MusicPlayer.Stack_Panel_Order.Visibility == Visibility.Collapsed)
            {
                userControl_ButtonFrame_MusicPlayer.Stack_Panel_Order.Visibility = Visibility.Visible;
            }
            else
            {
                userControl_ButtonFrame_MusicPlayer.Stack_Panel_Order.Visibility = Visibility.Collapsed;
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

            userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Music_Order.Source = new Uri(Path_App + @"\Button_Image_Svg\随机播放.svg");

            userControl_ButtonFrame_MusicPlayer.Stack_Panel_Order.Visibility = Visibility.Collapsed;
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

            userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Music_Order.Source = new Uri(Path_App + @"\Button_Image_Svg\顺序播放.svg");

            userControl_ButtonFrame_MusicPlayer.Stack_Panel_Order.Visibility = Visibility.Collapsed;
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

            userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Music_Order.Source = new Uri(Path_App + @"\Button_Image_Svg\单曲循环.svg");

            userControl_ButtonFrame_MusicPlayer.Stack_Panel_Order.Visibility = Visibility.Collapsed;
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

            userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Music_Order.Source = new Uri(Path_App + @"\Button_Image_Svg\列表循环.svg");

            userControl_ButtonFrame_MusicPlayer.Stack_Panel_Order.Visibility = Visibility.Collapsed;
        }

        /// <summary>
        /// 音量控制
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void Button_WMP_Song_Voice_Click(object sender, EventArgs e)
        {
            if (userControl_ButtonFrame_MusicPlayer.Stack_Panel_Voice.Visibility == Visibility.Collapsed)
            {
                userControl_ButtonFrame_MusicPlayer.Stack_Panel_Voice.Visibility = Visibility.Visible;
            }
            else
            {
                userControl_ButtonFrame_MusicPlayer.Stack_Panel_Voice.Visibility = Visibility.Collapsed;
            }
        }
        public void WMP_Song_Slider_Voice_Value_Changed(object sender, EventArgs e)
        {
            MediaElement_Song.Volume = userControl_ButtonFrame_MusicPlayer.Slider_Voice.Value;
            userControl_ButtonFrame_MusicPlayer.Voice_Nums.Text = Convert.ToInt32((userControl_ButtonFrame_MusicPlayer.Slider_Voice.Value) * 100).ToString();
            userControl_TaskbarIcon.Slider_Voice.Value = userControl_ButtonFrame_MusicPlayer.Slider_Voice.Value;
        }
        public void WMP_Song_Slider_Voice_Value_Temp_Changed(object sender, EventArgs e)
        {
            MediaElement_Song.Volume = userControl_TaskbarIcon.Slider_Voice.Value;
            userControl_ButtonFrame_MusicPlayer.Voice_Nums.Text = Convert.ToInt32((userControl_ButtonFrame_MusicPlayer.Slider_Voice.Value) * 100).ToString();
            userControl_ButtonFrame_MusicPlayer.Slider_Voice.Value = userControl_TaskbarIcon.Slider_Voice.Value;
        }
        private void Button_Voice_Close_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            userControl_ButtonFrame_MusicPlayer.Slider_Voice.Value = 0;
            MediaElement_Song.Volume = userControl_ButtonFrame_MusicPlayer.Slider_Voice.Value;
            userControl_ButtonFrame_MusicPlayer.Voice_Nums.Text = Convert.ToInt32((userControl_ButtonFrame_MusicPlayer.Slider_Voice.Value) * 100).ToString();
        }
        #endregion

        #region UI 窗体大小Changed响应

        Thickness thickness;
        /// <summary>
        /// 窗体大小变化事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Window_SizeChanged(object sender, SizeChangedEventArgs e)
        {
            Size_Changed();
        }

        public void Size_Changed()
        {
            // 取消Task.Delay(200).ContinueWith任务
            var tokenSource = new CancellationTokenSource();
            var token = tokenSource.Token;
            tokenSource.CancelAfter(200);

            Task.Delay(10, token).ContinueWith(task =>
            {
                if (task.IsCanceled)
                {
                    return;
                }

                musicPlayer_Main_UserControl.VerticalAlignment = VerticalAlignment.Stretch;
                musicPlayer_Main_UserControl.HorizontalAlignment = HorizontalAlignment.Stretch;

                musicPlayer_Main_UserControl.Width = this.Width;
                musicPlayer_Main_UserControl.Height = this.Height;

                //位于播放器界面时，解除动画绑定  对高度属性的占用 -->设置height将有效，否则无效
                if (Bool_OpenMainMusicPlayer)
                    musicPlayer_Main_UserControl.BeginAnimation(UserControl.HeightProperty, null);

                //补齐歌手写真切换动画产生的缝隙，切分动画参数为奇数时需要
                int num_epos_SingerImageAnimation = 0;

                if (this.Width >= 1000 && this.Width <= 1100)
                {
                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Width = 1300 - num_epos_SingerImageAnimation;
                    musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Width = 1300 - num_epos_SingerImageAnimation;

                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Height =
                        musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Width / 1.777777777;
                    musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Height =
                        musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Width / 1.777777777;
                }
                else if (this.Width >= 1100 && this.Width <= 1400)
                {
                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Width = 1600 - num_epos_SingerImageAnimation;
                    musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Width = 1600 - num_epos_SingerImageAnimation;

                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Height =
                        musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Width / 1.777777777;
                    musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Height =
                        musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Width / 1.777777777;
                }
                else
                {
                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Width = this.Width;
                    musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Width = this.Width;

                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Height =
                        musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Width / 1.777777777;
                    musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Height =
                        musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Width / 1.777777777;
                }

                if (this.Height >= 500 && this.Height <= 600)
                {
                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Height = 700 - num_epos_SingerImageAnimation;
                    musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Height = 700 - num_epos_SingerImageAnimation;

                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Width =
                        musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Height * 1.777777777;
                    musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Width =
                        musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Height * 1.777777777;
                }
                else if (this.Height >= 600 && this.Height <= 800)
                {
                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Height = 900 - num_epos_SingerImageAnimation;
                    musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Height = 900 - num_epos_SingerImageAnimation;

                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Width =
                        musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Height * 1.777777777;
                    musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Width =
                        musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Height * 1.777777777;
                }
                else
                {
                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Height = this.Height;
                    musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Height = this.Height;

                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Width =
                        musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Height * 1.777777777;
                    musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Width =
                        musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Height * 1.777777777;
                }

                // 在更新布局后清理任务
                Task.Run(() =>
                {
                    // do some cleanup
                });
            }, TaskScheduler.FromCurrentSynchronizationContext());
        }


        #endregion

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
            if (Singer_Image_Url == null || Singer_Image_Url.Length <= 0)
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
                userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Singer_Image_Animation_Image_To_WindowsDesktop.Source = new Uri(Path_App + "/Button_Image_Svg/开关-开.svg");
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
                userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Singer_Image_Animation_Image_To_WindowsDesktop.Source = new Uri(Path_App + "/Button_Image_Svg/开关-关.svg");
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

        #endregion

        #region MusicPlayer播放器

        #region MediaElement_Song歌曲资源初始化加载

        private void MediaElement_Song_MediaOpened(object sender, RoutedEventArgs e)//一定几率导致双缓冲,同时执行开启与结束事件
        {
            Load_MediaElement_Song_MediaOpened();
        }
        public void Load_MediaElement_Song_MediaOpened()
        {
            Bool_Button_Play_Pause_Player = true;

            if (MediaElement_Song.NaturalDuration.HasTimeSpan)
            {
                TimeSpan durationTimeSpan = MediaElement_Song.NaturalDuration.TimeSpan;
                userControl_ButtonFrame_MusicPlayer.Silder_Music_Width.Maximum = durationTimeSpan.TotalMilliseconds;



                //K歌模块
                /*LinearDoubleKeyFrame linearDoubleKeyFrame_1 = new LinearDoubleKeyFrame();
                linearDoubleKeyFrame_1.Value = 0;
                linearDoubleKeyFrame_1.KeyTime = new TimeSpan(0);

                LinearDoubleKeyFrame linearDoubleKeyFrame_2 = new LinearDoubleKeyFrame();
                linearDoubleKeyFrame_2.Value = - musicPlayer_Main_UserControl.content1.ActualWidth;
                linearDoubleKeyFrame_2.KeyTime = durationTimeSpan;

                musicPlayer_Main_UserControl.DoubleAnimationUsingKeyFrames_TextBlock_Song_Name.KeyFrames.Clear();
                musicPlayer_Main_UserControl.DoubleAnimationUsingKeyFrames_TextBlock_Song_Name.KeyFrames.Add(linearDoubleKeyFrame_1);
                musicPlayer_Main_UserControl.DoubleAnimationUsingKeyFrames_TextBlock_Song_Name.KeyFrames.Add(linearDoubleKeyFrame_2);
                musicPlayer_Main_UserControl.StoryBorad_Singing_Mode.Begin();*/




            }
            else
            {
                MessageBox.Show("无法获取此歌曲的NaturalDuration.TimeSpan");
            }
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

            //为元素设置BeginAnimation方法。
            if (!Bool_Animation_Storyboard_BeginMusic_Jukebox_Playing)
            {
                Bool_Animation_Storyboard_BeginMusic_Jukebox_Playing = true;
            }

            MediaElement_Song.Play();
            MediaElement_Song.LoadedBehavior = MediaState.Play;
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
            userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.Visibility = Visibility.Collapsed;

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

                    userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.Visibility = Visibility.Collapsed;

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


                    // K歌模块
                    // 跳转K歌进度
                    /*if (musicPlayer_Main_UserControl.StoryBorad_Singing_Mode != null)
                    {
                        // 计算进度条的比值
                        double targetProgress = MediaElement_Song.NaturalDuration.TimeSpan.TotalMilliseconds / userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.Value;

                        // 获取K歌 总时间进度
                        double temp = (musicPlayer_Main_UserControl.StoryBorad_Singing_Mode.Children[0] as DoubleAnimationUsingKeyFrames)
                            .KeyFrames[1].KeyTime.TimeSpan.TotalMilliseconds;

                        // 计算要跳转的时间点
                        int nums = (int)(temp / targetProgress);

                        // 使用 TimeFromMilliseconds 创建 TimeSpan 对象
                        TimeSpan seekTime = TimeSpan.FromMilliseconds(nums);

                        musicPlayer_Main_UserControl.StoryBorad_Singing_Mode.Seek(seekTime);
                    }*/

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
            userControl_ButtonFrame_MusicPlayer.TextBox_Song_Time_Temp.Text = test1.ToString(@"mm\:ss") + @" \ " + test2.ToString(@"mm\:ss");

            userControl_ButtonFrame_MusicPlayer.Silder_Music_Temp_Width.Value = userControl_ButtonFrame_MusicPlayer.Silder_Music_Width.Value;

        }
        #endregion
        
        #region 音乐播放

        public int WMP_Song_Order;//播放顺序 
        public int WMP_Song_Play_Ids;//歌曲序号songList_Infos_Current_Playlist
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
                    if (WMP_Song_Play_Ids != songList_Infos_Current_Playlist.Count)
                        WMP_Song_Play_Ids++;
                    else
                        WMP_Song_Play_Ids = 1;
                }
                else if (WMP_Song_Play_Ids_UP_DOWN == -1)
                {
                    if (WMP_Song_Play_Ids != 1)
                        WMP_Song_Play_Ids--;
                    else
                        WMP_Song_Play_Ids = songList_Infos_Current_Playlist.Count;
                }
            }
            //单曲循环
            else if (WMP_Song_Order == 1)
            {
                if (WMP_Song_Play_Ids_UP_DOWN == 1)
                {
                    if (WMP_Song_Play_Ids != songList_Infos_Current_Playlist.Count)
                        WMP_Song_Play_Ids++;
                    else
                        WMP_Song_Play_Ids = 1;
                }
                else if (WMP_Song_Play_Ids_UP_DOWN == -1)
                {
                    if (WMP_Song_Play_Ids != 1)
                        WMP_Song_Play_Ids--;
                    else
                        WMP_Song_Play_Ids = songList_Infos_Current_Playlist.Count;
                }
            }
            //随机播放
            else if (WMP_Song_Order == 2)
            {
                WMP_Song_Play_Ids = rd.Next(1, this.songList_Infos_Current_Playlist.Count + 1);//(生成1~10之间的随机数，不包括10)
            }    
        }


        public int Select_DoubleClick_ListView = 0;
        int Before_Playing;
        /// <summary>
        /// 根据歌曲id的值，播放指定路径
        /// </summary>
        public void Change_MediaElement_Source()
        {
            //禁止修改
            //window_Hover_MRC_Panel.TextBlock_1.Text = "科技源于生活，技术源于创新";
            window_Hover_MRC_Panel.TextBlock_2.Text = "MZMusic 极致音乐体验";
            if (window_Hover_MRC_Panel.Bool_Open_MRC_Panel)
            {
                //window_Hover_MRC_Panel.Text_DoubleAnimation.Duration = new Duration(new TimeSpan(0, 0, 0, 0, 3333));
                //window_Hover_MRC_Panel.Text_Storyboard.Begin();
            }

            //双击播放
            if (Select_DoubleClick_ListView == 1)
            {
                WMP_Song_Play_Ids = userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.SelectedIndex + 1;
                Select_DoubleClick_ListView = 0;
            }

            try
            {
                if (songList_Infos_Current_Playlist.Count > 0)
                {
                    //如果正在播放的歌曲 从SongList_Info_Current_Playlists中移除
                    if (SongList_Info_Current_Playlists.Bool_Restart_Playing == true)
                    {
                        WMP_Song_Play_Ids = 1;//播放第一首
                        SongList_Info_Current_Playlists.Bool_Restart_Playing = false;
                    }

                    string path = songList_Infos_Current_Playlist[WMP_Song_Play_Ids - 1].Song_Url;

                    if (!File.Exists(path))
                        path = Path_App + path;

                    //指定播放路径
                    viewModule_Search_Song.MediaElement_Song_Url = new Uri(path);
                    this_Song_Info.Song_Url = viewModule_Search_Song.MediaElement_Song_Url.ToString();

                    //保存当前正在播放的歌曲信息
                    this_Song_Info.Song_No = songList_Infos_Current_Playlist[WMP_Song_Play_Ids - 1].Song_No;
                    this_Song_Info.Song_Name = songList_Infos_Current_Playlist[WMP_Song_Play_Ids - 1].Song_Name.Trim();
                    this_Song_Info.Singer_Name = songList_Infos_Current_Playlist[WMP_Song_Play_Ids - 1].Singer_Name;
                    this_Song_Info.Song_Url = songList_Infos_Current_Playlist[WMP_Song_Play_Ids - 1].Song_Url;
                    this_Song_Info.Album_Name = songList_Infos_Current_Playlist[WMP_Song_Play_Ids - 1].Album_Name;

                    //开始播放
                    MediaElement_Song.Play();
                    //设置播放器播放状态为play
                    MediaElement_Song.LoadedBehavior = MediaState.Play;
                    //设置播放
                    userControl_ButtonFrame_MusicPlayer.SvgViewbox_Button_Play_Pause_Player.Source = new Uri(Path_App + @"\Button_Image_Svg\暂停.svg");
                    window_Hover_MRC_Panel.SvgViewbox_Button_Play_Pause_Player.Source = new Uri(Path_App + @"\Button_Image_Svg\暂停.svg");
                    userControl_TaskbarIcon.SvgViewbox_Button_Play_Pause_Player.Source = new Uri(Path_App + @"\Button_Image_Svg\暂停.svg");

                    //切换歌曲，歌手，专辑名
                    Change_TextBox_To_SingerSong_Name();
                    //
                    userControl_TaskbarIcon.ThisWindow_Song_Name.Text = this_Song_Info.Singer_Name + " - " + this_Song_Info.Song_Name;
                    userControl_TaskbarIcon.ThisWindow_Song_Name_Right.Text = this_Song_Info.Singer_Name + " - " + this_Song_Info.Song_Name;
                    //
                    userControl_ButtonFrame_MusicPlayer.TextBox_Song_Album_Name.Text = this_Song_Info.Album_Name;

                    //检测歌手数量，设置歌手动画循环方式
                    if (this_Song_Info.Singer_Name.IndexOf("、") <= 0)//单歌手
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

                    //设置该歌曲状态为正在播放
                    songList_Infos_Current_Playlist[WMP_Song_Play_Ids - 1].Bool_Playing = true;
                    for (int i = 0; i < songList_Infos_Current_Playlist.Count; i++)
                    {
                        if (i != WMP_Song_Play_Ids - 1)
                            songList_Infos_Current_Playlist[i].Bool_Playing = false;
                    }
                    //移动到指定行  WMP_Song_Play_Ids - 1
                    if (userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.Items.Count > 0)
                    {
                        userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.SelectedIndex = WMP_Song_Play_Ids - 1;

                        int scoll_nums = WMP_Song_Play_Ids - 1;
                        if (scoll_nums > userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.Items.Count - 1)
                            scoll_nums = 0;

                        userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.ScrollIntoView(
                            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.Items[
                            scoll_nums]
                            );
                    }

                }
            }
            catch
            {
                try
                {
                    string temp = Path_App + @"\" + ((Song_Info)songList_Infos[1][0].Songs[WMP_Song_Play_Ids - 1]).Song_Url;
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
            if (this_Song_Info.Song_Name != null)
            {
                string Song_Name_Temp = this_Song_Info.Song_Name;

                //设置歌手名
                musicPlayer_Main_UserControl.TextBox_SingerName.Text = "歌手 :  " + this_Song_Info.Singer_Name;
                musicPlayer_Main_UserControl.TextBox_SingerName.TextAlignment = TextAlignment.Center;
                //设置歌曲名
                musicPlayer_Main_UserControl.TextBox_SongName.Text = Song_Name_Temp/*.Substring(Song_Name_Temp_Last_Num + 3)*/.Trim();
                musicPlayer_Main_UserControl.TextBox_SongName.TextAlignment = TextAlignment.Center;
                //设置专辑名
                musicPlayer_Main_UserControl.TextBox_SongAlbumName.Text = "专辑 :  " + this_Song_Info.Album_Name;
                musicPlayer_Main_UserControl.TextBox_SongAlbumName.TextAlignment = TextAlignment.Center;
                //设置歌曲全名
                userControl_ButtonFrame_MusicPlayer.Song_Name.Text = this_Song_Info.Singer_Name + " - " + this_Song_Info.Song_Name;
            }
        }


        /// <summary>
        /// 双击播放音乐
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void userControl_ButtonFrame_MusicPlayer_ListView_Download_SongList_Info_MouseDoubleClick_ALL(object sender, MouseButtonEventArgs e)
        {
            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.ItemsSource = songList_Infos[1][0].Songs;
            ObservableCollection<Song_Info> temp = songList_Infos[1][0].Songs;
            songList_Infos_Current_Playlist = new ObservableCollection<Song_Info>(temp);
            SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist = songList_Infos_Current_Playlist;
            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.ItemsSource = songList_Infos_Current_Playlist;

            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.SelectedIndex =
                userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload
                .ListView_Download_SongList_Info.SelectedIndex;

            
            Select_DoubleClick_ListView = 1;
            Change_MediaElement_Source();

            //同步歌曲曲目数量
            userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload
                .Recent_Song_Nums.Text
                = "歌曲：" + userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload
                .ListView_Download_SongList_Info.Items.Count.ToString();

            userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength.Text =
                   userControl_Main_Home_Left_MyMusic_ThisWindowsMusicAndDownload
                .ListView_Download_SongList_Info.Items.Count.ToString();
            userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength_Right.Text =
                userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength.Text;
            userControl_SongList_Infos_Current_Playlist.TextBlock_This_SongListName.Text = 
                songList_Infos[1][0].Name +" - " +
               userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength.Text + " 首歌曲";

        }
        private void userControl_ButtonFrame_MusicPlayer_ListView_Download_SongList_Info_MouseDoubleClick_Love(object sender, MouseButtonEventArgs e)
        {
            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.ItemsSource = songList_Infos[0][0].Songs;
            ObservableCollection<Song_Info> temp = songList_Infos[0][0].Songs;
            songList_Infos_Current_Playlist = new ObservableCollection<Song_Info>(temp);
            SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist = songList_Infos_Current_Playlist;
            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.ItemsSource = songList_Infos_Current_Playlist;

            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.SelectedIndex =
                userControl_Main_Home_Left_MyMusic_My_Love
                .ListView_Download_SongList_Info.SelectedIndex;

            
            Select_DoubleClick_ListView = 1;
            Change_MediaElement_Source();

            //同步歌曲曲目数量
            userControl_Main_Home_Left_MyMusic_My_Love
                .Recent_Song_Nums.Text
                = "歌曲：" + userControl_Main_Home_Left_MyMusic_My_Love
                .ListView_Download_SongList_Info.Items.Count.ToString();
            userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength.Text =
                  userControl_Main_Home_Left_MyMusic_My_Love
                .ListView_Download_SongList_Info.Items.Count.ToString();
            userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength_Right.Text =
                userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength.Text;
            userControl_SongList_Infos_Current_Playlist.TextBlock_This_SongListName.Text = 
                songList_Infos[0][0].Name + " - " + 
                userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength.Text + " 首歌曲";

        }
        private void userControl_ButtonFrame_MusicPlayer_ListView_Download_SongList_Info_MouseDoubleClick_Auto(object sender, MouseButtonEventArgs e)
        {
            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.ItemsSource = songList_Infos[2][0].Songs;
            ObservableCollection<Song_Info> temp = songList_Infos[2][0].Songs;
            songList_Infos_Current_Playlist = new ObservableCollection<Song_Info>(temp);
            SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist = songList_Infos_Current_Playlist;
            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.ItemsSource = songList_Infos_Current_Playlist;

            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.SelectedIndex =
                userControl_Main_Home_Left_MyMusic_Recent_Play
                .ListView_Download_SongList_Info.SelectedIndex;

            Select_DoubleClick_ListView = 1;
            Change_MediaElement_Source();

            //同步歌曲曲目数量
            userControl_Main_Home_Left_MyMusic_Recent_Play
                .Recent_Song_Nums.Text
                = "歌曲：" + userControl_Main_Home_Left_MyMusic_Recent_Play
                .ListView_Download_SongList_Info.Items.Count.ToString();
            userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength.Text =
                   userControl_Main_Home_Left_MyMusic_Recent_Play
                .ListView_Download_SongList_Info.Items.Count.ToString();
            userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength_Right.Text =
                userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength.Text;
            userControl_SongList_Infos_Current_Playlist.TextBlock_This_SongListName.Text =
                songList_Infos[2][0].Name + " - " + 
                userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength.Text + " 首歌曲";
        }
        /// <summary>
        /// 双击播放当前的播放列表
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void userControl_SongList_Infos_Current_Playlist_ListView_Download_SongList_Info_MouseDoubleClick_Current_Playlist(object sender, MouseButtonEventArgs e)
        {
            Select_DoubleClick_ListView = 1;
            Change_MediaElement_Source();
        }
        /// <summary>
        /// 双击播放自定义歌单
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ListView_Download_SongList_Info_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.ItemsSource =
                songList_Infos[ComBox_Select_SongList_SelectIndex][0].Songs;

            ObservableCollection<Song_Info> temp = songList_Infos[ComBox_Select_SongList_SelectIndex + 3][0].Songs;
            songList_Infos_Current_Playlist = new ObservableCollection<Song_Info>(temp);//+3是因为此数组为所有的歌单，16个
            SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist = songList_Infos_Current_Playlist;
            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.ItemsSource = songList_Infos_Current_Playlist;

            userControl_SongList_Infos_Current_Playlist.ListView_Download_SongList_Info.SelectedIndex =
                userControl_Main_Home_Left_MyMusic_Mores
                [ComBox_Select_SongList_SelectIndex]
                .ListView_Download_SongList_Info.SelectedIndex;

            
            Select_DoubleClick_ListView = 1;
            Change_MediaElement_Source();

            //同步歌曲曲目数量
            userControl_Main_Home_Left_MyMusic_Mores
                [ComBox_Select_SongList_SelectIndex]
                .Recent_Song_Nums.Text
                = "歌曲：" + userControl_Main_Home_Left_MyMusic_Mores
                [ComBox_Select_SongList_SelectIndex]
                .ListView_Download_SongList_Info.Items.Count.ToString();
            userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength.Text =
                   userControl_Main_Home_Left_MyMusic_Mores
                [ComBox_Select_SongList_SelectIndex]
                .ListView_Download_SongList_Info.Items.Count.ToString();
            userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength_Right.Text =
                userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength.Text;
            userControl_SongList_Infos_Current_Playlist.TextBlock_This_SongListName.Text = 
                songList_Infos[ComBox_Select_SongList_SelectIndex][0].Name + " - " +
                userControl_ButtonFrame_MusicPlayer.TextBox_SongList_NumLength.Text + " 首歌曲";

        }



        #endregion

        #region 歌词切换
        bool bool_lrc;

        public List<string> ListBox_MRC_Song_MRC_Text;//歌词文件文本歌词内容的集合
        public List<double> ListBox_MRC_Song_MRC_Time;//歌词文件文本歌词时间的集合
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
            ListBox_MRC_Song_MRC_Text = new List<string>();
            //歌词文件文本歌词时间的集合
            ListBox_MRC_Song_MRC_Time = new List<double>();
            //创建获取 歌词数组信息输出类 
            dao_ListBox_Temp_MRC = new Dao_ListBox_Temp_MRC();
            //设置要分析的歌词文件（mrc）路径
            string Song_MRC_Path = this_Song_Info.Singer_Name + " - " + this_Song_Info.Song_Name;
            string MRC_URL = Path_App + @"\Mrc\" + Song_MRC_Path + @".mrc";
            string CRC_URL = MRC_URL.Replace("Mrc", "Crc"); CRC_URL = CRC_URL.Replace("mrc", "crc");

            bool_lrc = false;
            if (!File.Exists(MRC_URL))
                MRC_URL = Path_App + @"\Mrc\" + Song_MRC_Path + @".krc"; CRC_URL = MRC_URL.Replace("Mrc", "Crc"); CRC_URL = CRC_URL.Replace("krc", "crc");
            if (!File.Exists(MRC_URL))
            {
                MRC_URL = Path_App + @"\Mrc\" + Song_MRC_Path + @".lrc"; CRC_URL = MRC_URL.Replace("Mrc", "Crc"); CRC_URL = CRC_URL.Replace("lrc", "crc");
                bool_lrc = true;
            }

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
                        musicPlayer_Main_UserControl.ListView_Temp_MRC.ItemsSource = dao_ListBox_Temp_MRC.Return_ListBox_Temp_MRC_Bing(CRC_URL);
                        musicPlayer_Main_UserControl.ListView_Temp_MRC_Temp.ItemsSource = dao_ListBox_Temp_MRC.Return_ListBox_Temp_MRC_Bing(null);

                        //获取Text的集合
                        ListBox_MRC_Song_MRC_Text = dao_ListBox_Temp_MRC.Return_ListBox_Temp_MRC_Text();
                        //获取Time的集合
                        ListBox_MRC_Song_MRC_Time = dao_ListBox_Temp_MRC.Return_ListBox_Temp_MRC_Time();

                        //生成歌曲第一句和最后一句的时间
                        //获取歌曲第一句的时间（毫秒）
                        Start_Song_MRC_Time = dao_ListBox_Temp_MRC.Return_Start_Song_MRC_Time();
                        //获取歌曲最后一句的时间（毫秒）
                        End_Song_MRC_Time = dao_ListBox_Temp_MRC.Return_End_Song_MRC_Time();

                        if (bool_lrc == true)
                        {
                            //获取分析完成的在 Dao_ListBox_Temp_MRC 内存储的 歌曲最后一句的时间（毫秒）
                            if (MediaElement_Song.NaturalDuration.HasTimeSpan)
                            {
                                TimeSpan durationTimeSpan = MediaElement_Song.NaturalDuration.TimeSpan;
                                End_Song_MRC_Time = durationTimeSpan.TotalMilliseconds - 1111;
                            }
                            else
                            {
                                End_Song_MRC_Time = Convert.ToDouble(
                                    dao_ListBox_Temp_MRC.mrc_Line_Info[
                                        dao_ListBox_Temp_MRC.mrc_Line_Info.Count - 1].
                                        This_MRC_Start_Time + 1111
                                );
                            }
                        }


                        //歌词滚动
                        if (ListBox_MRC_Song_MRC_Time != null)
                        {
                            musicPlayer_Main_UserControl.ListView_Temp_MRC.ScrollIntoView(musicPlayer_Main_UserControl.ListView_Temp_MRC.Items[0]);//先滚动至第一行歌词              
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

                        //ListView_MRC.ItemsSource = null;
                        musicPlayer_Main_UserControl.ListView_Temp_MRC.ItemsSource = null;
                        musicPlayer_Main_UserControl.ListView_Temp_MRC_Temp.ItemsSource = null;

                        ListBox_MRC_Song_MRC_Text = null;
                        ListBox_MRC_Song_MRC_Time = null;
                        Start_Song_MRC_Time = 0;
                        End_Song_MRC_Time = 0;
                    }
                }
                else
                {
                    //获取mrc歌词失败，转而获取Lrc歌词

                    //停止歌词同步
                    DispatcherTimer_MRC.Stop();

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
                DispatcherTimer_MRC.Stop();
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
        int MRC_Line_Nums = 3;

        ListBoxItem myListBoxItem;
        ContentPresenter myContentPresenter;
        DataTemplate myDataTemplate;
        Storyboard myTextBlock_Storyboard;
        DoubleAnimationUsingKeyFrames myTextBlock_DoubleAnimationUsingKeyFrames;
        LinearDoubleKeyFrame linearDoubleKeyFrame;
        TextBlock myTextBlock_TextBlock;
        DoubleAnimationUsingKeyFrames window_Hover_MRC_PanelmyTextBlock_DoubleAnimationUsingKeyFrames;

        StackPanel stackPanel_Byte_Lyic;
        int Before_Byte_Lyic;
        Storyboard storyboard_lyic = new Storyboard();
        Storyboard storyboard_lyic_desk = new Storyboard();
        private List<Storyboard> storyboardCollection = new List<Storyboard>(); // 存储当前正在播放的逐字动画（Plus升级版）
        private List<Storyboard> storyboardCollection_Desk = new List<Storyboard>(); // 存储多个Storyboard的集合

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
                    Application.Current.Dispatcher.Invoke(() =>
                    {

                        thread_ListView_Temp_MRC_ScrollIntoView = new Thread(new ThreadStart(() =>
                        {
                            Dispatcher.BeginInvoke(new Action(delegate ()
                            {
                                musicPlayer_Main_UserControl.ListView_Temp_MRC.ScrollIntoView(musicPlayer_Main_UserControl.ListView_Temp_MRC.Items[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex + MRC_Line_Nums]);//移动到指定行                   
                            }));
                        }));
                        thread_ListView_Temp_MRC_ScrollIntoView.Priority = ThreadPriority.Lowest;
                        thread_ListView_Temp_MRC_ScrollIntoView.Start();

                        if (Bool_Mrc_Animation == true)
                        {
                            if (bool_lrc == false)
                            {
                                //生成歌词提词同步动画
                                if (ListBox_MRC_Song_MRC_Time[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex] != 0)
                                {
                                    try
                                    {
                                        int temp = dao_ListBox_Temp_MRC.mrc_Line_Info[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums].This_MRC_Duration;
                                        //int temp = (int)(ListBox_MRC_Song_MRC_Time[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex + 1] - ListBox_MRC_Song_MRC_Time[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex]);


                                        if (myTextBlock_Storyboard != null)
                                            myTextBlock_Storyboard.Remove();//清空渐变过的歌词行颜色
                                        myListBoxItem =
                                            (ListBoxItem)(musicPlayer_Main_UserControl.ListView_Temp_MRC.ItemContainerGenerator.ContainerFromIndex(musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex));
                                        if (myListBoxItem != null)
                                        {
                                            //查找并获取ListView选中项中的对象
                                            myContentPresenter = FindVisualChild<ContentPresenter>(myListBoxItem);
                                            if (myContentPresenter != null)
                                            {
                                                myDataTemplate = myContentPresenter.ContentTemplate;
                                                if (myDataTemplate != null)
                                                {
                                                    /*myTextBlock_Storyboard = (Storyboard)myDataTemplate.FindName("Text_Storyboard", myContentPresenter);
                                                    myTextBlock_TextBlock = (TextBlock)myDataTemplate.FindName("Text_TextBlock", myContentPresenter);
                                                    myTextBlock_DoubleAnimationUsingKeyFrames = (DoubleAnimationUsingKeyFrames)myDataTemplate.FindName("Text_DoubleAnimationUsingKeyFrames", myContentPresenter);
                                                    myTextBlock_DoubleAnimationUsingKeyFrames.Duration = new Duration(new TimeSpan(0, 0, 0, 0, temp));

                                                    //初始动画位置，-0.5为左边的原点，长度为1
                                                    double X = -0.5;

                                                    //每个字符的物理长度
                                                    ArrayList Values_temp = new ArrayList();
                                                    //每个字符相加_>的总长度
                                                    double Sum_Values_temp = 0;
                                                    for (int i = 0; i < dao_ListBox_Temp_MRC.mrc_Line_Info[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                        .Int_MoreByte_Nums; i++)
                                                    {
                                                        double temp_double = Convert.ToDouble(MeasureString(dao_ListBox_Temp_MRC.mrc_Line_Info[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
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

                                                    //初始化关键帧属性
                                                    for (int i = 0; i < dao_ListBox_Temp_MRC.mrc_Line_Info[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                        .Int_MoreByte_Nums; i++)
                                                    {
                                                        int temp_BeginTime = Convert.ToInt16(
                                                            dao_ListBox_Temp_MRC.mrc_Line_Info
                                                                [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                                    - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                        .Array_Morebyte_BeginTime[i]);//此字符开始时间
                                                        int temp_Duration = Convert.ToInt16(
                                                            dao_ListBox_Temp_MRC.mrc_Line_Info
                                                                [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                                    - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                        .Array_Morebyte_Duration[i]);//此字符持续时间

                                                        if (null_time == true)
                                                        {
                                                            ALL_Byte_Values.Add(0);
                                                            null_time = false;
                                                        }

                                                        //判别动画是否有停顿
                                                        if (i != dao_ListBox_Temp_MRC.mrc_Line_Info
                                                            [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                                - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                                    .Int_MoreByte_Nums - 1//if  i != Array_Morebyte_BeginTime的最后一位（防止数组越界）
                                                            &&
                                                            temp_BeginTime + temp_Duration !=  //if  此动画的开始时间+持续时间 != 下一段动画的开始时间
                                                            Convert.ToInt16(dao_ListBox_Temp_MRC.mrc_Line_Info
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

                                                    //计算关键帧 属性                      
                                                    ArrayList timeSpan_nums = new ArrayList();

                                                    int temp_null_time = 0;
                                                    for (int i = 0;
                                                        i < dao_ListBox_Temp_MRC.mrc_Line_Info
                                                            [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                                - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                                    .Int_MoreByte_Nums; //歌词字符总数
                                                        i++)
                                                    {
                                                        int temp_BeginTime = Convert.ToInt16(
                                                            dao_ListBox_Temp_MRC.mrc_Line_Info
                                                                [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                                    - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                        .Array_Morebyte_BeginTime[i]);//此字符开始时间
                                                        int temp_Duration = Convert.ToInt16(
                                                            dao_ListBox_Temp_MRC.mrc_Line_Info
                                                                [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                                    - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                        .Array_Morebyte_Duration[i]);//此字符持续时间                     

                                                        if (null_time == true)
                                                        {
                                                            timeSpan_nums.Add(":" + temp_null_time);// : 作为动画停顿标记
                                                            null_time = false;
                                                        }
                                                        //判别动画是否有停顿
                                                        if (i != dao_ListBox_Temp_MRC.mrc_Line_Info
                                                            [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                                - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                                    .Int_MoreByte_Nums - 1//if  i != Array_Morebyte_BeginTime的最后一位（防止数组越界）
                                                            &&
                                                            temp_BeginTime + temp_Duration != //if  此动画的开始时间+持续时间 != 下一段动画的开始时间
                                                            Convert.ToInt16(dao_ListBox_Temp_MRC.mrc_Line_Info
                                                                [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                                    - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                                        .Array_Morebyte_BeginTime[i + 1]))//if 动画时间 中间有 空白时间（动画停顿）
                                                        {
                                                            temp_null_time = //求出此停顿动画的序列时间，并插入至动画序列timeSpan_nums
                                                                Convert.ToInt16(
                                                                    dao_ListBox_Temp_MRC.mrc_Line_Info
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


                                                    //关键帧动画属性赋值
                                                    myTextBlock_DoubleAnimationUsingKeyFrames.KeyFrames.Clear();
                                                    for (int i = 0; i < timeSpan_nums.Count; i++)
                                                    {
                                                        linearDoubleKeyFrame = new LinearDoubleKeyFrame();

                                                        if (timeSpan_nums[i].ToString().IndexOf(":") < 0)
                                                        {
                                                            //设置动画的X轴距离
                                                            X += Convert.ToDouble(ALL_Byte_Values[i].ToString());//固定的区间内，动画该持续的时间
                                                                                                                 //科学计数法转换，防止出现科学计数法
                                                            linearDoubleKeyFrame.Value = Convert.ToDouble(ChangeToDecimal(X.ToString()));

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
                                                    thread_myTextBlock_Storyboard = new Thread(new ThreadStart(() =>
                                                    {
                                                        Dispatcher.BeginInvoke(new Action(delegate ()
                                                        {
                                                            myTextBlock_Storyboard.Begin();
                                                        }));
                                                    }));
                                                    thread_myTextBlock_Storyboard.Priority = ThreadPriority.Highest;
                                                    thread_myTextBlock_Storyboard.Start();*/
                                                    myTextBlock_Storyboard = (Storyboard)myDataTemplate.FindName("Text_Storyboard", myContentPresenter);
                                                    myTextBlock_TextBlock = (TextBlock)myDataTemplate.FindName("Text_TextBlock", myContentPresenter);
                                                    myTextBlock_TextBlock.Visibility = Visibility.Collapsed;
                                                    //
                                                    stackPanel_Byte_Lyic = (StackPanel)myDataTemplate.FindName("StackPanel_Lyic", myContentPresenter);
                                                }
                                            }
                                        }


                                        //歌词逐字算法 Plus最终版
                                        //
                                        stackPanel_Byte_Lyic.Children.Clear();
                                        window_Hover_MRC_Panel.StackPanel_Lyic.Children.Clear();
                                        //
                                        List<UserControl_Mrc_Byte> userControl_Mrc_Bytes = new List<UserControl_Mrc_Byte>();
                                        for (int i = 0; i < dao_ListBox_Temp_MRC.mrc_Line_Info[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums].
                                            Array_Morebyte_Text.Count; i++)
                                        {
                                            int temp_BeginTime = Convert.ToInt16(
                                                            dao_ListBox_Temp_MRC.mrc_Line_Info
                                                                [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                                    - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                        .Array_Morebyte_BeginTime[i]);//此字符开始时间
                                            int temp_Duration = Convert.ToInt16(
                                                            dao_ListBox_Temp_MRC.mrc_Line_Info
                                                                [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                                    - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                        .Array_Morebyte_Duration[i]);//此字符持续时间

                                            int temp_WaitTime = 0;                  //判别动画是否有停顿
                                            if (i != dao_ListBox_Temp_MRC.mrc_Line_Info
                                                [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                    - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                        .Int_MoreByte_Nums - 1//if  i != Array_Morebyte_BeginTime的最后一位（防止数组越界）
                                                && temp_BeginTime + temp_Duration != //if  此动画的开始时间+持续时间 != 下一段动画的开始时间
                                                            Convert.ToInt16(dao_ListBox_Temp_MRC.mrc_Line_Info
                                                                [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                                    - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                                        .Array_Morebyte_BeginTime[i + 1]))
                                            {
                                                temp_WaitTime = Convert.ToInt16(
                                                                    dao_ListBox_Temp_MRC.mrc_Line_Info
                                                                        [musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex
                                                                            - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums]
                                                                        .Array_Morebyte_BeginTime[i + 1]
                                                                        )
                                                                 -
                                                                (temp_BeginTime + temp_Duration);//动画停顿的时间
                                            }

                                            #region 1111111
                                            UserControl_Mrc_Byte mrc_Byte_ = new UserControl_Mrc_Byte();
                                            //设置文本
                                            mrc_Byte_.TextBlock_1.FontSize = 32;
                                            mrc_Byte_.TextBlock_1.Text = dao_ListBox_Temp_MRC.mrc_Line_Info[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums].
                                                Array_Morebyte_Text[i].ToString();
                                            GradientStop gradientStop = (GradientStop)mrc_Byte_.TextBlock_1.FindName("GradientStop_Background");
                                            gradientStop.Color = Colors.White;
                                            mrc_Byte_.TextBlock_1.Effect = null;

                                            //设置动画
                                            Storyboard storyboard = (Storyboard)mrc_Byte_.TextBlock_1.FindName("Text_Storyboard");
                                            storyboard.Duration = new Duration(new TimeSpan(0, 0, 0, 0, temp_Duration + temp_WaitTime));
                                            //
                                            DoubleAnimationUsingKeyFrames doubleAnimationUsingKeyFrames = (DoubleAnimationUsingKeyFrames)mrc_Byte_.TextBlock_1.FindName("Text_DoubleAnimation");
                                            doubleAnimationUsingKeyFrames.KeyFrames.Clear();
                                            //
                                            LinearDoubleKeyFrame linearDoubleKeyFrame = new LinearDoubleKeyFrame();
                                            linearDoubleKeyFrame.Value = 0.51;
                                            linearDoubleKeyFrame.KeyTime = new TimeSpan(0, 0, 0, 0, Convert.ToInt16(temp_Duration));
                                            doubleAnimationUsingKeyFrames.KeyFrames.Add(linearDoubleKeyFrame);
                                            //
                                            //判别动画是否有停顿
                                            if (temp_WaitTime != 0)
                                            {
                                                LinearDoubleKeyFrame linearDoubleKeyFrame_Pause = new LinearDoubleKeyFrame();//用以实现停顿
                                                linearDoubleKeyFrame_Pause.Value = 0.51;
                                                linearDoubleKeyFrame_Pause.KeyTime = new TimeSpan(0, 0, 0, 0, Convert.ToInt16(
                                                    temp_WaitTime
                                                    ));

                                                doubleAnimationUsingKeyFrames.KeyFrames.Add(linearDoubleKeyFrame_Pause);
                                            }
                                            #endregion

                                            #region 2222222
                                            UserControl_Mrc_Byte mrc_Byte_desk = new UserControl_Mrc_Byte();
                                            //设置文本
                                            mrc_Byte_desk.TextBlock_1.FontSize = window_Hover_MRC_Panel.TextBlock_1.FontSize;
                                            mrc_Byte_desk.TextBlock_1.Text = dao_ListBox_Temp_MRC.mrc_Line_Info[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex - dao_ListBox_Temp_MRC.LRC_Text_Null_Nums].
                                                Array_Morebyte_Text[i].ToString();

                                            //设置动画
                                            Storyboard storyboard_desk = (Storyboard)mrc_Byte_desk.TextBlock_1.FindName("Text_Storyboard");
                                            storyboard_desk.Duration = new Duration(new TimeSpan(0, 0, 0, 0, temp_Duration + temp_WaitTime));
                                            //
                                            DoubleAnimationUsingKeyFrames doubleAnimationUsingKeyFrames_desk = (DoubleAnimationUsingKeyFrames)mrc_Byte_desk.TextBlock_1.FindName("Text_DoubleAnimation");
                                            doubleAnimationUsingKeyFrames_desk.KeyFrames.Clear();
                                            //
                                            LinearDoubleKeyFrame linearDoubleKeyFrame_desk = new LinearDoubleKeyFrame();
                                            linearDoubleKeyFrame_desk.Value = 0.51;
                                            linearDoubleKeyFrame_desk.KeyTime = new TimeSpan(0, 0, 0, 0, Convert.ToInt16(temp_Duration));
                                            doubleAnimationUsingKeyFrames_desk.KeyFrames.Add(linearDoubleKeyFrame_desk);
                                            //
                                            //判别动画是否有停顿
                                            if (temp_WaitTime != 0)
                                            {
                                                LinearDoubleKeyFrame linearDoubleKeyFrame_Pause = new LinearDoubleKeyFrame();//用以实现停顿
                                                linearDoubleKeyFrame_Pause.Value = 0.51;
                                                linearDoubleKeyFrame_Pause.KeyTime = new TimeSpan(0, 0, 0, 0, Convert.ToInt16(
                                                    temp_WaitTime
                                                    ));

                                                doubleAnimationUsingKeyFrames_desk.KeyFrames.Add(linearDoubleKeyFrame_Pause);
                                            }
                                            #endregion

                                            //userControl_Mrc_Bytes.Add(mrc_Byte);
                                            mrc_Byte_.Margin = new Thickness(0, 0, 0, 0);
                                            mrc_Byte_desk.Margin = new Thickness(0, 0, -20, 0);

                                            stackPanel_Byte_Lyic.Children.Add(mrc_Byte_);
                                            window_Hover_MRC_Panel.StackPanel_Lyic.Children.Add(mrc_Byte_desk);
                                        }
                                        //启动动画
                                        if (stackPanel_Byte_Lyic != null)
                                        {
                                            BindAnimationCompleted(stackPanel_Byte_Lyic.Children);

                                            BindAnimationCompleted_Desk(window_Hover_MRC_Panel.StackPanel_Lyic.Children);
                                        }
                                        //初始化上一个颜色的字体和渐变
                                        //
                                        if (Before_Byte_Lyic > -1)
                                        {
                                            myListBoxItem =
                                                (ListBoxItem)(musicPlayer_Main_UserControl.ListView_Temp_MRC.ItemContainerGenerator.ContainerFromIndex(Before_Byte_Lyic));
                                            if (myListBoxItem != null)
                                            {
                                                //查找并获取ListView选中项中的对象
                                                myContentPresenter = FindVisualChild<ContentPresenter>(myListBoxItem);
                                                if (myContentPresenter != null)
                                                {
                                                    myDataTemplate = myContentPresenter.ContentTemplate;
                                                    if (myDataTemplate != null)
                                                    {
                                                        stackPanel_Byte_Lyic = (StackPanel)myDataTemplate.FindName("StackPanel_Lyic", myContentPresenter);
                                                        myTextBlock_TextBlock = (TextBlock)myDataTemplate.FindName("Text_TextBlock", myContentPresenter);
                                                        myTextBlock_TextBlock.Visibility = Visibility.Visible;

                                                        stackPanel_Byte_Lyic.Children.Clear();
                                                        /*for (int i = 0; i < stackPanel_Byte_Lyic.Children.Count; i++)
                                                        {
                                                            UserControl_Mrc_Byte userControl_ = (UserControl_Mrc_Byte)stackPanel_Byte_Lyic.Children[i];
                                                            userControl_.TextBlock_1.FontSize = 22;
                                                            userControl_.TextBlock_1.Foreground = Brushes.White;
                                                        }*/
                                                    }
                                                }
                                            }
                                        }
                                        Before_Byte_Lyic = musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex;


                                        try
                                        {
                                            temp = (int)(ListBox_MRC_Song_MRC_Time[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex + 1] - ListBox_MRC_Song_MRC_Time[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex]);
                                            if (temp < 0)
                                                temp = (int)(MediaElement_Song.NaturalDuration.TimeSpan.TotalMilliseconds - ListBox_MRC_Song_MRC_Time[musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex]);
                                            //生成歌词同步进度Silder动画
                                            window_Hover_MRC_Panel.Text_DoubleAnimation_slider_Up.Duration = new Duration(new TimeSpan(0, 0, 0, 0, temp));
                                            window_Hover_MRC_Panel.Text_DoubleAnimation_slider_Down.Duration = new Duration(new TimeSpan(0, 0, 0, 0, temp));
                                            thread_window_Hover_MRC_Panel_Text_Storyboard_slider_UpDown = new Thread(new ThreadStart(() =>
                                            {
                                                Dispatcher.BeginInvoke(new Action(delegate ()
                                                {
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
                        else//不开启逐字
                        {

                        }
                    });
                }
            }
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
                Brushes.White,
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

        #region 歌词行同步

        public void Media_Song_MRC_Play_Tick(object sender, EventArgs e)
        {
            //使用双区间来判定同步当前音频文件时间信息所处歌词时间信息的位置
            //0有时访问不到
            if (ListBox_MRC_Song_MRC_Time != null && ListBox_MRC_Song_MRC_Time.Count > 0)
            {
                if (MediaElement_Song.Position.TotalMilliseconds <= Start_Song_MRC_Time)
                {
                    for (int i = 0; i < ListBox_MRC_Song_MRC_Time.Count; i++)
                    {
                        if (ListBox_MRC_Song_MRC_Time[i] != 0)
                        {
                            if (musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex != i)
                            {
                                musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex = i;
                            }

                            if (window_Hover_MRC_Panel.Bool_Open_MRC_Panel)
                            {
                                //window_Hover_MRC_Panel.TextBlock_1.Text = ListBox_MRC_Song_MRC_Text[i];
                                window_Hover_MRC_Panel.TextBlock_2.Text = ListBox_MRC_Song_MRC_Text[i + 1];
                            }


                            break;
                        }
                    }
                }
                else if (MediaElement_Song.Position.TotalMilliseconds >= End_Song_MRC_Time)
                {
                    for (int i = ListBox_MRC_Song_MRC_Time.Count - 1; i >= 0; i--)
                    {
                        if (ListBox_MRC_Song_MRC_Time[i] != 0)
                        {
                            if (musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex != i)
                            {
                                musicPlayer_Main_UserControl.ListView_Temp_MRC.SelectedIndex = i;
                            }

                            if (window_Hover_MRC_Panel.Bool_Open_MRC_Panel)
                            {
                                //window_Hover_MRC_Panel.TextBlock_1.Text = ListBox_MRC_Song_MRC_Text[i];
                                window_Hover_MRC_Panel.TextBlock_2.Text = ListBox_MRC_Song_MRC_Text[i + 1];
                            }

                            break;
                        }
                    }
                }
                else
                {
                    for (int i = 7; i < ListBox_MRC_Song_MRC_Time.Count; i++)
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
                                        //window_Hover_MRC_Panel.TextBlock_1.Text = ListBox_MRC_Song_MRC_Text[i];
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
                DispatcherTimer_MRC.Stop();
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
                    musicPlayer_Main_UserControl.ListView_Temp_MRC.Visibility = Visibility.Collapsed;
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
            musicPlayer_Main_UserControl.ListView_Temp_MRC_Temp.Visibility = Visibility.Collapsed;
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
            if (this_Song_Info.Album_Name.Length > 0) //专辑模式
            {
                //生成专辑名所在路径
                Song_Image_Url = Path_App + @"\Song_ALbum\" + this_Song_Info.Album_Name + @".jpg";
                //如果专辑文件存在
                if (File.Exists(Song_Image_Url))
                {
                    musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                    musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush.Stretch = Stretch.UniformToFill;
                    musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.Background = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush;

                    userControl_ButtonFrame_MusicPlayer.Border_Song_Image.Background = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush;
                }
                //如果专辑文件不存在
                else
                {
                    //如果当前歌曲名不为空
                    if (this_Song_Info.Song_Name != null)
                    {
                        //专辑名为歌曲名
                        this_Song_Info.Album_Name = this_Song_Info.Song_Name;

                        //生成专辑名所在路径
                        Song_Image_Url = Path_App + @"\Song_ALbum\" + this_Song_Info.Album_Name + @".jpg";
                        //如果歌曲图片文件存在
                        if (File.Exists(Song_Image_Url))
                        {
                            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush.Stretch = Stretch.UniformToFill;
                            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.Background = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush;
                            //Panel_Image.Background = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                            userControl_ButtonFrame_MusicPlayer.Border_Song_Image.Background = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush;
                        }
                        //默认图片
                        else
                        {
                            //获取歌手名
                            string Singer_Image_Name = this_Song_Info.Singer_Name.Trim();
                            //生成专辑名所在路径
                            Song_Image_Url = Path_App + @"\Song_ALbum\" + Singer_Image_Name + @".jpg";
                            //如果歌曲图片存在
                            if (File.Exists(Song_Image_Url))
                            {
                                musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                                musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush.Stretch = Stretch.UniformToFill;
                                musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.Background = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush;
                                //Panel_Image.Background = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                                userControl_ButtonFrame_MusicPlayer.Border_Song_Image.Background = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush;
                            }
                            else
                            {
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
                if (this_Song_Info.Song_Name != null)
                {
                    string Song_Name_Temp = this_Song_Info.Song_Name;
                    int Song_Name_Temp_Last_Num = Song_Name_Temp.LastIndexOf("-");
                    if (Song_Name_Temp_Last_Num > 0)
                    {
                        Song_Name_Temp.Substring(Song_Name_Temp_Last_Num + 1).Trim();
                    }

                    //专辑名为歌曲名
                    this_Song_Info.Album_Name = Song_Name_Temp.Substring(Song_Name_Temp_Last_Num + 1).Trim();


                    //生成专辑名所在路径
                    Song_Image_Url = Path_App + @"\Song_ALbum\" + this_Song_Info.Album_Name + @".jpg";
                    //如果歌曲图片存在
                    if (File.Exists(Song_Image_Url))
                    {
                        musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                        musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush.Stretch = Stretch.UniformToFill;
                        musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.Background = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush;
                        //Panel_Image.Background = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                        userControl_ButtonFrame_MusicPlayer.Border_Song_Image.Background = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush;
                    }
                    //默认图片
                    else
                    {
                        //获取歌手名
                        string Singer_Image_Name = this_Song_Info.Singer_Name.Trim();
                        //生成专辑名所在路径
                        Song_Image_Url = Path_App + @"\Song_ALbum\" + Singer_Image_Name + @".jpg";
                        //如果歌曲图片存在
                        if (File.Exists(Song_Image_Url))
                        {
                            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush.Stretch = Stretch.UniformToFill;
                            musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround.Background = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush;
                            //Panel_Image.Background = new ImageBrush(new BitmapImage(new Uri(Song_Image_Url)));
                            userControl_ButtonFrame_MusicPlayer.Border_Song_Image.Background = musicPlayer_Main_UserControl.Grid_SingerPhoto_Mode_Close_BackGround_ImageBrush;
                        }
                        else
                        {
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

        SingerImage_Cut singerImage_Cut = SingerImage_Cut.Retuen_This();
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
            if (this_Song_Info.Singer_Name != null)
            {
                //如果当前播放的歌曲信息不为空
                if (this_Song_Info.Singer_Name != null)
                {      
                    //获取歌手名
                    string Singer_Image_Name = this_Song_Info.Singer_Name.Trim();
                    //生成歌手图片所在路径
                    Singer_Image_Url = Path_App + @"\Singer_Image\" + singer_photo[0] + @"\" + Singer_Image_Name + @".jpg";
                    //如果歌手图片存在
                    if (File.Exists(Singer_Image_Url))
                    {
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
                                BgSwitch(Singer_Image_Url);
                            }
                            else
                            {
                                musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Visibility = Visibility.Collapsed;

                                Singer_Image_Url = Path_App + @"\Singer_Image\歌手图片1\巨浪.jpg";
                                ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                                test.Stretch = Stretch.UniformToFill;
                                musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;

                                musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Background = test;
                            }
                        }
                        else
                        {
                            musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Visibility = Visibility.Collapsed;

                            Singer_Image_Url = Path_App + @"\Singer_Image\歌手图片1\巨浪.jpg";
                            ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                            test.Stretch = Stretch.UniformToFill;
                            musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;

                            musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Background = test;

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
            if (this_Song_Info.Singer_Name != null)
            {
                //如果当前歌手不是上一位歌手
                if (Singer_Name_Temp != this_Song_Info.Singer_Name.Trim())
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
                    if (this_Song_Info.Singer_Name != null)
                    {
                        //获取歌手名
                        string Singer_Image_Name = this_Song_Info.Singer_Name.Trim();
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
                                musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Visibility = Visibility.Collapsed;

                                Singer_Image_Url = Path_App + @"\Singer_Image\歌手图片1\巨浪.jpg";
                                ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                                test.Stretch = Stretch.UniformToFill;
                                musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;

                                musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Background = test;


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
                        musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Visibility = Visibility.Collapsed;

                        Singer_Image_Url = Path_App + @"\Singer_Image\歌手图片1\巨浪.jpg";
                        ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                        test.Stretch = Stretch.UniformToFill;
                        musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;

                        musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Background = test;


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
                    temp[i] = this_Song_Info.Singer_Name.Trim();

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
                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Visibility = Visibility.Collapsed;

                    Singer_Image_Url = Path_App + @"\Singer_Image\歌手图片1\巨浪.jpg";
                    ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                    test.Stretch = Stretch.UniformToFill;
                    musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;

                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Background = test;
                }
            }
            catch(Exception ex) {
                MessageBox.Show("应用程序发生不可恢复的异常，将要退出！"+ ex.ToString());

                musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Visibility = Visibility.Collapsed;

                Singer_Image_Url = Path_App + @"\Singer_Image\歌手图片1\巨浪.jpg";
                ImageBrush test = new ImageBrush(new BitmapImage(new Uri(Singer_Image_Url)));
                test.Stretch = Stretch.UniformToFill;
                musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;

                musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Background = test;
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
                    BgSwitch(Singer_Image_Url);

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
                        BgSwitch(Singer_Image_Url);              

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
                        BgSwitch(Singer_Image_Url);

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
                                BgSwitch(Singer_Image_Url);

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
                                BgSwitch(Singer_Image_Url);

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




        #endregion
        #region 切换写真动画
        int animation_select = 0;

        MainViewModel_Animation_1 MyVM;
        string imgPath;
        ImageBrush test;
        DispatcherTimer dispatcherTimer_SingerImageCut;
        int num_SingerImageAnimation_no = 0;//写真切分组合多参数动画，参数下标值，已弃用
        int num_duration = 0;
        int num_Delay = 0;
        /// <summary>
        /// 对指定的图片路径进行动画处理
        /// </summary>
        /// <param name="imgPath"></param>
        private void BgSwitch(string imgPath)
        {
            // 创建一个线程来执行动画
            Thread animationThread = new Thread(() =>
            {
                // 在新线程中执行动画
                Dispatcher.Invoke(() =>
                {
                    musicPlayer_Main_UserControl.ItemsControl_SingerImageCut.Visibility = Visibility.Visible;

                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Visibility = Visibility.Visible;
                    musicPlayer_Main_UserControl.DataContext = null;

                    num_duration = 200;
                    num_Delay = 200;

                    musicPlayer_Main_UserControl.DataContext = new MainViewModel_Animation_1(
                                    imgPath,
                                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.ActualWidth / singerImage_Cut.numCutCells,
                                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.ActualHeight / singerImage_Cut.numCutRows,
                                    singerImage_Cut.numCutCells,
                                    singerImage_Cut.numCutRows,
                                    num_duration,
                                    num_Delay
                                    );

                    MyVM = musicPlayer_Main_UserControl.DataContext as MainViewModel_Animation_1;
                    if (MyVM != null && MyVM.RefCommand.CanExecute(null))
                        MyVM.RefCommand.Execute(null);

                    this.imgPath = imgPath;
                    dispatcherTimer_SingerImageCut = new DispatcherTimer();
                    dispatcherTimer_SingerImageCut.Tick += DispatcherTimer_SingerImageCut_Tick;
                    dispatcherTimer_SingerImageCut.Interval = TimeSpan.FromMilliseconds(1);
                    dispatcherTimer_SingerImageCut.Start();

                    animation_select = 0;

                    /*if (animation_select == 0)
                    {
                        musicPlayer_Main_UserControl.ItemsControl_SingerImageCut.Visibility = Visibility.Collapsed;
                        dispatcherTimer_SingerImageCut = null;

                        musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Visibility = Visibility.Visible;
                        //动画0：三层动画：耗性能
                        oa = bgstoryboard.Children.FirstOrDefault(c => c is ObjectAnimationUsingKeyFrames) as ObjectAnimationUsingKeyFrames;
                        oa.KeyFrames[0].Value = new BitmapImage(new Uri(imgPath));

                        thread_timer_Singer_Photo_One_Lot = new Thread(new ThreadStart(() =>
                        {
                            Dispatcher.BeginInvoke(new Action(delegate ()
                            {
                                bgstoryboard.Begin(musicPlayer_Main_UserControl.Grid_down_Singer_Photo);
                            }));
                        }));
                        thread_timer_Singer_Photo_One_Lot.Start();

                        ImageBrush test = new ImageBrush(new BitmapImage(new Uri(imgPath)));
                        test.Stretch = Stretch.UniformToFill;
                        musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;

                        animation_select = 1;
                    }
                    else
                    {
                        musicPlayer_Main_UserControl.ItemsControl_SingerImageCut.Visibility = Visibility.Visible;

                        musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Visibility = Visibility.Visible;
                        musicPlayer_Main_UserControl.DataContext = null;

                        num_duration = 200;
                        num_Delay = 200;

                        musicPlayer_Main_UserControl.DataContext = new MainViewModel_Animation_1(
                                        imgPath,
                                        musicPlayer_Main_UserControl.Grid_down_Singer_Photo.ActualWidth / singerImage_Cut.numCutCells,
                                        musicPlayer_Main_UserControl.Grid_down_Singer_Photo.ActualHeight / singerImage_Cut.numCutRows,
                                        singerImage_Cut.numCutCells,
                                        singerImage_Cut.numCutRows,
                                        num_duration,
                                        num_Delay
                                        );

                        MyVM = musicPlayer_Main_UserControl.DataContext as MainViewModel_Animation_1;
                        if (MyVM != null && MyVM.RefCommand.CanExecute(null))
                            MyVM.RefCommand.Execute(null);

                        this.imgPath = imgPath;
                        dispatcherTimer_SingerImageCut = new DispatcherTimer();
                        dispatcherTimer_SingerImageCut.Tick += DispatcherTimer_SingerImageCut_Tick;
                        dispatcherTimer_SingerImageCut.Interval = TimeSpan.FromMilliseconds(1);
                        dispatcherTimer_SingerImageCut.Start();

                        animation_select = 0;
                    }*/
                });
            });
            // 启动线程并等待线程执行完毕
            animationThread.Start();

        }

        private void DispatcherTimer_SingerImageCut_Tick(object? sender, EventArgs e)
        {
            if (MyVM != null)
                if (MyVM.Num_Singer_ImagerCut_Infos == singerImage_Cut.numCutCells * singerImage_Cut.numCutRows)
                {
                    ImageBrush test = new ImageBrush(new BitmapImage(new Uri(imgPath)));
                    test.Stretch = Stretch.UniformToFill;
                    musicPlayer_Main_UserControl.Grid_Up_Singer_Photo.Background = test;
                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Visibility = Visibility.Collapsed;
                    musicPlayer_Main_UserControl.Grid_down_Singer_Photo.Background = test;

                    if(dispatcherTimer_SingerImageCut != null)
                        dispatcherTimer_SingerImageCut.Stop();
                    dispatcherTimer_SingerImageCut = null;
                    MyVM = null;
                    singerImage_Cut = null;
                    singerImage_Cut = SingerImage_Cut.Retuen_This();
                }
        }

        #region 已弃用 歌手写真动画
        /// <summary>
        /// 过渡动画效果占用5%CPU使用率
        /// </summary>
        ObjectAnimationUsingKeyFrames oa;
        ObjectAnimationUsingKeyFrames oa_2;
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

            BgSwitch(Singer_Image_Url);

            init_animation_bacnground++;
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
            dispatcherTimer_Spectrum_Visualization.Interval = new TimeSpan(0, 0, 0, 0, 400);

            Spectrum_time = 75;
            dispatcherTimer_Spectrum_Visualization.Interval = new TimeSpan(0, 0, 0, 0, Spectrum_time * 2);
        }
        public void Spectrum_Visualization_Play_Tick(object sender, EventArgs e)
        {
            Take_Spectrum_Visualization();
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

                if (half_animation_points_length == 106)
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

                        //结束值设置为上次动画保存的位置
                        linearDoubleKeyFrame_2.Value = Spectrum_Value;
                        linearDoubleKeyFrame_2.KeyTime = new TimeSpan(0, 0, 0, 0,
                            (int)Spectrum_time);

                        linearDoubleKeyFrame_1.Value = userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                                audioSpectrogram.animation_points[i];
                        if (linearDoubleKeyFrame_1.Value < -0.5)
                            linearDoubleKeyFrame_1.Value = -0.48;

                        userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                            List_doubleAnimation[i]
                                .KeyFrames.Add(linearDoubleKeyFrame_1);
                        userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                            List_doubleAnimation[i]
                                .KeyFrames.Add(linearDoubleKeyFrame_2);
                        userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                            List_doubleAnimation[i]
                                .Duration = new TimeSpan(0, 0, 0, 0, (int)Spectrum_time * 2);

                        userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                            List_storyboard[i]
                                .Children[0] = userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                                    List_doubleAnimation[i];
                        userControl_ButtonFrame_MusicPlayer.userControl_Spectrum_Visualization.
                            List_storyboard[i]
                                .Begin();

                        //保留此次动画的Value值
                        Spectrum_Value = (float)(linearDoubleKeyFrame_1.Value);
                    }
                }
            }
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

        #endregion



        #region API加载

        #region 搜索


        #endregion


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
        /// <summary>
        /// 关闭
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Window_Closed(object sender, EventArgs e)
        {
            //关闭桌面写真
            if (Bool_Windows_Wallpaper == true)
                SystemParametersInfo(20, 1, wallpaper_path, 1);

            //保存歌单信息
            Save_SongListInfo();

            userControl_TaskbarIcon.myNotifyIcon.Dispose();

            Environment.Exit(-1);
        }

        /// <summary>
        /// APP 设置
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        /// <exception cref="NotImplementedException"></exception>
        private void Button_App_Setting_Click(object sender, RoutedEventArgs e)
        {
            if(userControl_ButtonFrame_App_Setting.Visibility == Visibility.Collapsed)
            {
                userControl_ButtonFrame_App_Setting.Visibility = Visibility.Visible;
            }
            else
            {
                userControl_ButtonFrame_App_Setting.Visibility = Visibility.Collapsed;
            }
        }

        private void Grid_Operation_Panel_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            userControl_ButtonFrame_MusicPlayer.Stack_Panel_Voice.Visibility = Visibility.Collapsed;
            userControl_ButtonFrame_MusicPlayer.Stack_Panel_Order.Visibility = Visibility.Collapsed;
            userControl_SongList_Infos_Current_Playlist.Visibility = Visibility.Collapsed;
            userControl_ButtonFrame_App_Setting.Visibility = Visibility.Collapsed;
        }


        private void Frame_Manager_ButtonList_ScrollViewer_MouseLeave(object sender, MouseEventArgs e)
        {
            Frame_Manager_ButtonList_ScrollViewer.VerticalScrollBarVisibility = ScrollBarVisibility.Hidden;
        }
        private void Frame_Manager_ButtonList_ScrollViewer_MouseMove(object sender, MouseEventArgs e)
        {
            Frame_Manager_ButtonList_ScrollViewer.VerticalScrollBarVisibility = ScrollBarVisibility.Visible;
        }
    }
}
