using Microsoft.Win32;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_List_Infos;
using Shell32;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Forms;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.Windows_Song_Finds
{
    /// <summary>
    /// Windows_Song_Find_Float.xaml 的交互逻辑
    /// </summary>
    public partial class Windows_Song_Find_Float : Window
    {
        public Windows_Song_Find_Float()
        {
            InitializeComponent();
        }

        static string[] All_Info_Path;
        static string[] All_Song_Path = new string[9999];

        static string[] Finds_AllSong_End;
        static string[] Finds_AllSong;

        public ObservableCollection<Song_Info> list_Song_Info = new ObservableCollection<Song_Info>();
        static Song_Info song_info = new Song_Info();
        static string Song_Path_Temp = "";//存储临时生成的导入的后缀为mp3文件名
        static string Singer_Name_Temp = "";//存储临时提取的歌手名
        static string Song_Src_Paths = "";//存储临时提取的歌词
        static string Aldum_Temp;
        static int Song_Path_Temp_SongName;
        static int Song_Ids_Temp;
        static ShellClass sh = new ShellClass();//调用Shell32.dll  ,   查找mp3文件信息
        static Folder Folderdir;
        static FolderItem FolderItemitem;

        /// <summary>
        /// 开始手动添加
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnSearchClick(object sender, RoutedEventArgs e)
        {
            if (ComBox_Select_SongList.SelectedIndex > 0)
            {
                Button_Select_Add.Visibility = Visibility.Collapsed;
                Button_FindALL_Add.Visibility = Visibility.Collapsed;

                // 显示选择文件对话框
                Microsoft.Win32.OpenFileDialog dialog = new Microsoft.Win32.OpenFileDialog();
                dialog.Multiselect = true;//该值确定是否可以选择多个文件
                dialog.Title = "请选择文件夹";
                dialog.Filter = "(*.mp3,*.flac,*.wav)|*.mp3;*.flac;*.wav;";
                dialog.ShowDialog();
                All_Info_Path = dialog.FileNames;

                ListBox_Test.Items.Add("\n\n开始提取歌曲文件特征信息\n\n");

                // 创建一个后台线程来遍历歌曲文件并获取歌曲信息
                Thread thread = new Thread(() =>
                {
                    Return_Take_SongSrc_Info();

                    // 将搜索结果显示在 UI 界面中
                    Dispatcher.Invoke(() =>
                    {
                        Save_SongListInfo();

                        Button_Select_Add.Visibility = Visibility.Visible;
                        Button_FindALL_Add.Visibility = Visibility.Visible;

                        System.Windows.MessageBox.Show("导入成功");
                    });
                });

                // 启动后台线程
                thread.Start();
            }
            else
            {
                System.Windows.MessageBox.Show("请先选择需要导入的歌单");
            }


        }

        /// <summary>
        /// 本地查找所有音乐文件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void OnFindALLSongClick(object sender, RoutedEventArgs e)
        {
            if (ComBox_Select_SongList.SelectedIndex > -1)
            {
                ListBox_Test.Items.Add("\n\n开始提取歌曲文件特征信息\n\n");

                Button_Select_Add.Visibility = Visibility.Collapsed;
                Button_FindALL_Add.Visibility = Visibility.Collapsed;

                // 创建一个后台线程来遍历歌曲文件并获取歌曲信息
                Thread thread = new Thread(() =>
                {
                    Find_ALL_Song();//遍历磁盘

                    Return_Take_SongSrc_Info();

                    // 将搜索结果显示在 UI 界面中
                    Dispatcher.Invoke(() =>
                    {
                        Save_SongListInfo();

                        Button_Select_Add.Visibility = Visibility.Visible;
                        Button_FindALL_Add.Visibility = Visibility.Visible;

                        System.Windows.MessageBox.Show("导入成功");
                    });
                });

                // 启动后台线程
                thread.Start();
            }
            else
            {
                System.Windows.MessageBox.Show("请先选择需要导入的歌单");
            }
        }
        public void Find_ALL_Song()
        {
            Finds_AllSong = new string[9999];

            //获取本地硬盘驱动器 
            string[] localDrives = Directory.GetLogicalDrives();
            foreach (string eachDrive in localDrives)
            {
                //遍历文件夹
                DirectoryInfo theFolder = new DirectoryInfo(eachDrive);
                FileInfo[] thefileInfo = theFolder.GetFiles(".", SearchOption.TopDirectoryOnly);
                foreach (FileInfo NextFile in thefileInfo)
                { //遍历文件
                    //listBox1.Items.Add(NextFile.FullName);
                    FindAllFiles(NextFile.FullName);
                }
                //遍历子文件夹
                Find_Like_AllFiles();

                DirectoryInfo[] dirInfo = theFolder.GetDirectories();
                foreach (DirectoryInfo NextFolder in dirInfo)
                {
                    try
                    {
                        FileInfo[] fileInfo = NextFolder.GetFiles("*.mp3", SearchOption.AllDirectories);
                        foreach (FileInfo NextFile in fileInfo)
                        {//遍历文件
                            FindAllFiles(NextFile.FullName);
                        }
                        fileInfo = NextFolder.GetFiles("*.flac", SearchOption.AllDirectories);
                        foreach (FileInfo NextFile in fileInfo)
                        {//遍历文件
                            FindAllFiles(NextFile.FullName);
                        }
                        fileInfo = NextFolder.GetFiles("*.wav", SearchOption.AllDirectories);
                        foreach (FileInfo NextFile in fileInfo)
                        {//遍历文件
                            FindAllFiles(NextFile.FullName);
                        }
                    }
                    catch
                    {

                    }
                }
                Find_Like_AllFiles();
            }



            All_Info_Path = new string[9999];
            All_Song_Path = new string[9999];

            Finds_AllSong_End = new string[9999];

            foreach (string song_url in Finds_AllSong)
            {
                if (song_url != null)
                {
                    for (int i = 0; i < Finds_AllSong_End.Length; i++)
                    {
                        if (Finds_AllSong_End[i] == null)
                        {
                            Finds_AllSong_End[i] = song_url;
                            break;
                        }
                    }
                }
            }

            All_Info_Path = Finds_AllSong_End;
        }
        public void FindAllFiles(string fileDicPath)
        {
            for (int i = 0; i < Finds_AllSong.Length; i++)
            {
                if (Finds_AllSong[i] == null)
                {
                    if (fileDicPath != null)
                    {
                        Finds_AllSong[i] = fileDicPath;

                        // 将搜索结果显示在 UI 界面中
                        Dispatcher.Invoke(() =>
                        {
                            ListBox_Test.Items.Add(fileDicPath);
                            ListBox_Test.SelectedIndex = ListBox_Test.Items.Count - 1;
                            ListBox_Test.ScrollIntoView(ListBox_Test.SelectedItem);
                        });

                        break;
                    }
                }
            }
        }
        public static void Find_Like_AllFiles()//删除重复的歌曲
        {
            for (int i = 0; i < Finds_AllSong.Length; i++)
            {
                if (Finds_AllSong[i] != null)
                {
                    Nums_Song_Name_Index = Finds_AllSong[i].LastIndexOf(@"\");
                    Nums_Song_Name_Index = Nums_Song_Name_Index + 1;

                    Song_Path_1 = Finds_AllSong[i];
                    Song_Path_1 = Song_Path_1.Substring(Nums_Song_Name_Index, Song_Path_1.Length - Nums_Song_Name_Index);

                    for (int j = 0; j < Finds_AllSong.Length; j++)
                    {
                        if (Finds_AllSong[j] != null)
                        {
                            if (i != j)
                            {
                                Nums_Song_Name_Index = Finds_AllSong[j].LastIndexOf(@"\");
                                Nums_Song_Name_Index = Nums_Song_Name_Index + 1;

                                Song_Path_2 = Finds_AllSong[j];
                                Song_Path_2 = Song_Path_2.Substring(Nums_Song_Name_Index, Song_Path_2.Length - Nums_Song_Name_Index);

                                if (Song_Path_1.Equals(Song_Path_2))
                                {
                                    Finds_AllSong[j] = null;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }


        static string Temp_Song_Name;
        int num1;
        int num2;
        static string Song_Path_1;
        static string Song_Path_2;
        static int Nums_Song_Name_Index;

        public void Return_Take_SongSrc_Info()
        {
            foreach (String Song_Name in All_Info_Path)
            {
                if (Song_Name != null)
                {
                    Temp_Song_Name = Song_Name;
                    if (Temp_Song_Name.Substring(Temp_Song_Name.Length - 3, 3).Equals("mp3") || Temp_Song_Name.Substring(Temp_Song_Name.Length - 4, 4).Equals("flac"))//从指定的位置startIndex开始检索长度为length的子字符串
                    {
                        for (int i = 0; i < All_Song_Path.Length; i++)
                        {
                            if (All_Song_Path[i] == null)
                            {
                                All_Song_Path[i] = Song_Name;
                                break;
                            }
                        }
                    }
                }
            }
            string song_name_temp = "";
            for (int i = 0; i < All_Song_Path.Length; i++)
            {
                if (All_Song_Path[i] != null)
                {
                    if (All_Song_Path[i].ToString().Length > 0)
                    {
                        Nums_Song_Name_Index = All_Song_Path[i].LastIndexOf(@"\");
                        Nums_Song_Name_Index = Nums_Song_Name_Index + 1;

                        Song_Src_Paths = All_Song_Path[i];
                        Song_Path_Temp = All_Song_Path[i];
                        Song_Path_Temp = Song_Path_Temp.Substring(Nums_Song_Name_Index, Song_Path_Temp.Length - Nums_Song_Name_Index);
                        String temp_song = All_Song_Path[i];

                        Song_Path_Temp_SongName = All_Song_Path[i].LastIndexOf(" - ");

                        if (Song_Path_Temp_SongName > 0 && Nums_Song_Name_Index < Song_Path_Temp_SongName)
                        {
                            Singer_Name_Temp = Song_Path_Temp;
                            num1 = Singer_Name_Temp.LastIndexOf(" - ");
                            if (num1 > 0)
                            {

                                Singer_Name_Temp = Singer_Name_Temp.Substring(0, num1);
                                //Singer_Name_Temp = Singer_Name_Temp.Substring(Nums_Song_Name_Index, Singer_Name_Temp.Length - Nums_Song_Name_Index);

                                if (Singer_Name_Temp.Length > 0 && Singer_Name_Temp != null)
                                {
                                    Singer_Name_Temp.Trim();

                                    song_info = new Song_Info();

                                    song_info.Singer_Name = Singer_Name_Temp;//索引设置为-1，索引初始值为0，所以排首列

                                    Song_Path_Temp_SongName = Song_Path_Temp.LastIndexOf(".mp3");
                                    if (Song_Path_Temp.LastIndexOf(".mp3") <= 0)
                                    {
                                        Song_Path_Temp_SongName = Song_Path_Temp.LastIndexOf(".flac");
                                        if (Song_Path_Temp.LastIndexOf(".flac") <= 0)
                                        {
                                            Song_Path_Temp_SongName = Song_Path_Temp.LastIndexOf(".wav");
                                        }
                                    }

                                    song_name_temp = Song_Path_Temp;
                                    num2 = song_name_temp.IndexOf(" - ") + 3;
                                    song_name_temp = song_name_temp.Substring(num2, Song_Path_Temp_SongName - num2);

                                    //读取
                                    Folderdir = sh.NameSpace(System.IO.Path.GetDirectoryName(Song_Src_Paths));
                                    FolderItemitem = Folderdir.ParseName(System.IO.Path.GetFileName(Song_Src_Paths));
                                    Aldum_Temp = Folderdir.GetDetailsOf(FolderItemitem, 14);

                                    //song_info.Song_Name_Table = Song_Path_Temp.Substring(0, Song_Path_Temp_SongName);
                                    song_info.Song_Name = song_name_temp.Trim();//设置DisplayMember属性显示为"全部"
                                    song_info.Album_Name = Aldum_Temp;
                                    song_info.Song_Url = Song_Src_Paths;
                                    song_info.Song_No = Song_Ids_Temp;
                                    Song_Ids_Temp++;
                                    list_Song_Info.Add(song_info);

                                    // 将搜索结果显示在 UI 界面中
                                    Dispatcher.Invoke(() =>
                                    {
                                        ListBox_Test.Items.Add(song_info.Singer_Name + "\t" + song_info.Song_Name + "\t" + song_info.Album_Name + "\t" + song_info.Song_No + "\n");

                                        ListBox_Test.SelectedIndex = ListBox_Test.Items.Count - 1;
                                        ListBox_Test.ScrollIntoView(ListBox_Test.SelectedItem);
                                    });


                                }
                            }
                        }
                    }
                }
            }

        }

        private void Save_SongListInfo()
        {
            //刷新内存区域的引用
            ObservableCollection<ObservableCollection<Models.Song_List_Infos.SongList_Info>> songList_Infos = SongList_Info.Retuen_This();

            if (ComBox_Select == 0)
            {
                for (int i = 0; i < list_Song_Info.Count; i++)
                {
                    if (songList_Infos[0][0].Songs.Count > 0)
                    {
                        for (int j = 0; j < songList_Infos[0][0].Songs.Count; j++)
                        {
                            //查重
                            if (list_Song_Info[i].Song_Url.Equals(songList_Infos[0][0].Songs[j].Song_Url))
                                break;
                            //无重复，则添加
                            if (j == songList_Infos[0][0].Songs.Count - 1)
                                songList_Infos[0][0].Songs.Add(list_Song_Info[i]);
                        }
                    }
                    else
                    {
                        songList_Infos[0][0].Songs.Add(list_Song_Info[i]);
                    }
                }
                //排序
                //songList_Infos[0][0].Songs = songList_Infos[0][0].Songs.OrderBy(s => s.Singer_Name + s.Song_Name).ToList();
                for (int i = 0; i < songList_Infos[0][0].Songs.Count; i++)
                {
                    songList_Infos[0][0].Songs[i].Song_No = i + 1;
                }
                
            }
            else if (ComBox_Select == 1)
            {
                for (int i = 0; i < list_Song_Info.Count; i++)
                {
                    if (songList_Infos[1][0].Songs.Count > 0)
                    {
                        for (int j = 0; j < songList_Infos[1][0].Songs.Count; j++)
                        {
                            //查重
                            if (list_Song_Info[i].Song_Url.Equals(songList_Infos[1][0].Songs[j].Song_Url))
                                break;
                            //无重复，则添加
                            if (j == songList_Infos[1][0].Songs.Count - 1)
                                songList_Infos[1][0].Songs.Add(list_Song_Info[i]);
                        }
                    }
                    else
                    {
                        songList_Infos[1][0].Songs.Add(list_Song_Info[i]);
                    }
                }
                //排序
                //songList_Infos[1][0].Songs = songList_Infos[1][0].Songs.OrderBy(s => s.Singer_Name + s.Song_Name).ToList();
                for (int i = 0; i < songList_Infos[1][0].Songs.Count; i++)
                {
                    songList_Infos[1][0].Songs[i].Song_No = i + 1;
                }
            }
            else if (ComBox_Select == 2)
            {
                for (int i = 0; i < list_Song_Info.Count; i++)
                {
                    if (songList_Infos[2][0].Songs.Count > 0)
                    {
                        for (int j = 0; j < songList_Infos[2][0].Songs.Count; j++)
                        {
                            //查重
                            if (list_Song_Info[i].Song_Url.Equals(songList_Infos[2][0].Songs[j].Song_Url))
                                break;
                            //无重复，则添加
                            if (j == songList_Infos[2][0].Songs.Count - 1)
                                songList_Infos[2][0].Songs.Add(list_Song_Info[i]);
                        }
                    }
                    else
                    {
                        songList_Infos[2][0].Songs.Add(list_Song_Info[i]);
                    }
                }
                //排序
                //songList_Infos[2][0].Songs = songList_Infos[2][0].Songs.OrderBy(s => s.Singer_Name + s.Song_Name).ToList();
                for (int i = 0; i < songList_Infos[2][0].Songs.Count; i++)
                {
                    songList_Infos[2][0].Songs[i].Song_No = i + 1;
                }
            }
            else//自定义歌单
            {
                for (int i = 0; i < list_Song_Info.Count; i++)
                {
                    if (songList_Infos[ComBox_Select][0].Songs.Count > 0)
                    {
                        for (int j = 0; j < songList_Infos[ComBox_Select][0].Songs.Count; j++)
                        {
                            //查重
                            if (list_Song_Info[i].Song_Url.Equals(songList_Infos[ComBox_Select][0].Songs[j].Song_Url))
                                break;
                            //无重复，则添加
                            if (j == songList_Infos[ComBox_Select][0].Songs.Count - 1)
                                songList_Infos[ComBox_Select][0].Songs.Add(list_Song_Info[i]);
                        }
                    }
                    else
                    {
                        songList_Infos[ComBox_Select][0].Songs.Add(list_Song_Info[i]);
                    }
                }
                //排序
                //songList_Infos[ComBox_Select][0].Songs = songList_Infos[ComBox_Select][0].Songs.OrderBy(s => s.Singer_Name + s.Song_Name).ToList();
                for (int i = 0; i < songList_Infos[ComBox_Select][0].Songs.Count; i++)
                {
                    songList_Infos[ComBox_Select][0].Songs[i].Song_No = i + 1;
                }
            }

            //保存歌单信息
            string Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";
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
            SongList_Info.songList_Infos = songList_Infos;
        }

        private void Back_Windows_Click(object sender, RoutedEventArgs e)
        {
            ListBox_Test.Items.Clear();
            list_Song_Info.Clear();
            All_Song_Path = new string[9999];
            All_Info_Path = null;

            this.Visibility = Visibility.Collapsed;
        }

        public int ComBox_Select;
        private void ComBox_Select_SongList_Selected(object sender, SelectionChangedEventArgs e)
        {
            ComBox_Select = ComBox_Select_SongList.SelectedIndex;
        }
    }
}
