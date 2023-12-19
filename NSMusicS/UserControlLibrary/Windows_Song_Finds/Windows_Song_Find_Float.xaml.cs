using Microsoft.Win32;
using Shell32;
using System;
using System.Collections;
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
using NSMusicS.Models.APP_DB_SqlLite.SS_Convert;
using NSMusicS.Models.APP_DB_SqlLite.Product;
using NSMusicS.Models.Song_List_Infos;

namespace NSMusicS.UserControlLibrary.Windows_Song_Finds
{
    /// <summary>
    /// Windows_Song_Find_Float.xaml 的交互逻辑
    /// </summary>
    public partial class Windows_Song_Find_Float : Window
    {
        public Windows_Song_Find_Float()
        {
            InitializeComponent();

            Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";
            brush_LoveNormal = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心 (1).png")));
            brush_LoveEnter = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心 - 副本.png")));
        }
        public string Path_App;
        public ImageBrush brush_LoveNormal = new ImageBrush();
        public ImageBrush brush_LoveEnter = new ImageBrush();

        static ArrayList All_Info_Path = new ArrayList();
        static ArrayList All_Song_Path = new ArrayList();

        static ArrayList Finds_AllSong_End = new ArrayList();
        static ArrayList Finds_AllSong = new ArrayList();

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
            ListBox_Test.Items.Clear();

            if (ComBox_Select_SongList.SelectedIndex > -1)
            {
                Button_Select_Add.Visibility = Visibility.Collapsed;
                Button_FindALL_Add.Visibility = Visibility.Collapsed;

                // 显示选择文件对话框
                Microsoft.Win32.OpenFileDialog dialog = new Microsoft.Win32.OpenFileDialog();
                dialog.Multiselect = true;//该值确定是否可以选择多个文件
                dialog.Title = "请选择文件夹";
                dialog.Filter = "(*.mp3,*.flac,*.wav)|*.mp3;*.flac;*.wav;";
                dialog.ShowDialog();
                for (int i = 0; i < dialog.FileNames.Length; i++)
                {
                    All_Info_Path.Add(dialog.FileNames[i]);
                }

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


                        All_Info_Path = new ArrayList();
                        All_Song_Path = new ArrayList();

                        Finds_AllSong_End = new ArrayList();
                        Finds_AllSong = new ArrayList();

                        ListBox_Selects_SongList.Items.Clear();
                        ListBox_Test.Items.Clear();

                        Selects_SongList.Clear();

                        Song_Ids_Temp = 0;
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
        /// 手动扫描歌曲
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void OnFindALLSongClick(object sender, RoutedEventArgs e)
        {
            ListBox_Test.Items.Clear();

            if (ComBox_Select_SongList.SelectedIndex > -1)
            {
                ListBox_Test.Items.Add("\n\n开始提取歌曲文件特征信息\n\n");

                Button_Select_Add.Visibility = Visibility.Collapsed;
                Button_FindALL_Add.Visibility = Visibility.Collapsed;


                // 创建一个后台线程来遍历歌曲文件并获取歌曲信息
                Thread thread = new Thread(() =>
                {
                    /*Find_ALL_Song();//遍历磁盘*/
                    foreach (string folderPath in Selects_SongList)
                    {
                        if (folderPath.Length > 0)
                            SearchAudioFilesInFolder(folderPath);
                    }

                    Return_Take_SongSrc_Info();

                    // 将搜索结果显示在 UI 界面中
                    Dispatcher.Invoke(() =>
                    {
                        Save_SongListInfo();

                        Button_Select_Add.Visibility = Visibility.Visible;
                        Button_FindALL_Add.Visibility = Visibility.Visible;

                        System.Windows.MessageBox.Show("导入成功");

                        All_Info_Path = new ArrayList();
                        All_Song_Path = new ArrayList();

                        Finds_AllSong_End = new ArrayList();
                        Finds_AllSong = new ArrayList();

                        ListBox_Selects_SongList.Items.Clear();
                        ListBox_Test.Items.Clear();

                        Selects_SongList.Clear();

                        Song_Ids_Temp = 0;
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
            Finds_AllSong = new ArrayList();

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



            All_Info_Path = new ArrayList();
            All_Song_Path = new ArrayList();

            foreach (string song_url in Finds_AllSong)
            {
                if (song_url != null)
                {
                    All_Info_Path.Add(song_url);
                }
            }
        }
        public void FindAllFiles(string fileDicPath)
        {
            for (int i = 0; i < Finds_AllSong.Count; i++)
            {
                if (Finds_AllSong[i] == null)
                {
                    if (fileDicPath != null)
                    {
                        Finds_AllSong.Add(fileDicPath);

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
            for (int i = 0; i < Finds_AllSong.Count; i++)
            {
                if (Finds_AllSong[i] != null)
                {
                    Nums_Song_Name_Index = Finds_AllSong[i].ToString().LastIndexOf(@"\");
                    Nums_Song_Name_Index = Nums_Song_Name_Index + 1;

                    Song_Path_1 = Finds_AllSong[i].ToString();
                    Song_Path_1 = Song_Path_1.Substring(Nums_Song_Name_Index, Song_Path_1.Length - Nums_Song_Name_Index);

                    for (int j = 0; j < Finds_AllSong.Count; j++)
                    {
                        if (Finds_AllSong[j] != null)
                        {
                            if (i != j)
                            {
                                Nums_Song_Name_Index = Finds_AllSong[j].ToString().LastIndexOf(@"\");
                                Nums_Song_Name_Index = Nums_Song_Name_Index + 1;

                                Song_Path_2 = (string)Finds_AllSong[j];
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
            foreach (object item in All_Info_Path)
            {
                if (item is string Song_Name)
                {
                    All_Song_Path.Add(Song_Name);
                }
            }
            string song_name_temp = "";
            for (int i = 0; i < All_Song_Path.Count; i++)
            {
                if (All_Song_Path[i] != null)
                {
                    if (All_Song_Path[i].ToString().Length > 0)
                    {
                        Nums_Song_Name_Index = All_Song_Path[i].ToString().LastIndexOf(@"\");
                        Nums_Song_Name_Index = Nums_Song_Name_Index + 1;

                        Song_Src_Paths = All_Song_Path[i].ToString();
                        Song_Path_Temp = All_Song_Path[i].ToString();
                        Song_Path_Temp = Song_Path_Temp.Substring(Nums_Song_Name_Index, Song_Path_Temp.Length - Nums_Song_Name_Index);
                        String temp_song = All_Song_Path[i].ToString();

                        Song_Path_Temp_SongName = All_Song_Path[i].ToString().LastIndexOf(" - ");

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
                        else
                        {
                            song_info = new Song_Info();

                            song_info.Song_Name = Song_Path_Temp;//设置DisplayMember属性显示为"全部"
                            song_info.Album_Name = "未知";
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

        private async void Save_SongListInfo()
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
            Save_SongListInfoAsync();
        }

        private void Back_Windows_Click(object sender, RoutedEventArgs e)
        {
            ListBox_Test.Items.Clear();
            list_Song_Info.Clear();
            All_Song_Path = new ArrayList();
            All_Info_Path = new ArrayList();

            this.Visibility = Visibility.Collapsed;
        }

        public int ComBox_Select;
        private void ComBox_Select_SongList_Selected(object sender, SelectionChangedEventArgs e)
        {
            ComBox_Select = ComBox_Select_SongList.SelectedIndex;
        }


        public ArrayList Selects_SongList = new ArrayList();
        /// <summary>
        /// 添加要扫描的歌曲文件夹
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Add_SongList_Click(object sender, RoutedEventArgs e)
        {
            using (FolderBrowserDialog folderDialog = new FolderBrowserDialog())
            {
                folderDialog.ShowDialog();

                Selects_SongList.Add(folderDialog.SelectedPath);
                ListBox_Selects_SongList.Items.Add(folderDialog.SelectedPath);               
            }
        }

        private void SearchAudioFilesInFolder(string folderPath)
        {
            DirectoryInfo directory = new DirectoryInfo(folderPath);
            FileInfo[] audioFiles = directory.GetFiles("*.*", SearchOption.AllDirectories)
                .Where(file => IsAudioFile(file.Extension))
                .ToArray();

            foreach (FileInfo audioFile in audioFiles)
            {
                All_Info_Path.Add(audioFile.FullName);
            }
        }

        static bool IsAudioFile(string extension)
        {
            string[] audioExtensions = { ".mp3", ".wav", ".flac" };
            return audioExtensions.Contains(extension, StringComparer.OrdinalIgnoreCase);
        }


        /// <summary>
        /// 保存歌单信息
        /// </summary>
        ObservableCollection<ObservableCollection<Models.Song_List_Infos.SongList_Info>> songList_Infos;
        Convert_Song_List_Infos convert_Song_Info = new Convert_Song_List_Infos();
        public async Task Save_SongListInfoAsync()
        {
            /*songList_Infos = SongList_Info.Retuen_This();

            var playlists = new ObservableCollection<SongList_Info>();
            playlists = songList_Infos[0];
            /// SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Love.xml", playlists);
            await convert_Song_Info.Save_SongList_To_DatabaseAsync(
                convert_Song_Info.Create_Product_Song_Infos(playlists[0].Songs),
                0, "我的收藏");

            playlists = new ObservableCollection<SongList_Info>();
            playlists = songList_Infos[1];
            /// SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_ALL.xml", playlists);
            await convert_Song_Info.Save_SongList_To_DatabaseAsync(
                convert_Song_Info.Create_Product_Song_Infos(playlists[0].Songs),
                1, "本地音乐");

            playlists = new ObservableCollection<SongList_Info>();
            playlists = songList_Infos[2];
            /// SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Auto.xml", playlists);
            await convert_Song_Info.Save_SongList_To_DatabaseAsync(
                convert_Song_Info.Create_Product_Song_Infos(playlists[0].Songs),
                2, "默认列表");

            for (int i = 3; i < 17; i++)
            {
                playlists = new ObservableCollection<SongList_Info>();
                playlists = songList_Infos[i];
                /// SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (" + i + ").xml", playlists);
                await convert_Song_Info.Save_SongList_To_DatabaseAsync(
                    convert_Song_Info.Create_Product_Song_Infos(playlists[0].Songs),
                    3, "歌单" + i);
            }*/
        }
        public ObservableCollection<Product_Song_Info> Create_Product_Song_Infos(ObservableCollection<Song_Info> temp)
        {
            ObservableCollection<Product_Song_Info> songs = new ObservableCollection<Product_Song_Info>();
            foreach (var item in temp)
            {
                Product_Song_Info _Song_Info = new Product_Song_Info();
                _Song_Info.Song_No = item.Song_No;
                _Song_Info.Song_Name = item.Song_Name;
                _Song_Info.Singer_Name = item.Singer_Name;
                _Song_Info.Song_Url = item.Song_Url;
                ///_Song_Info.Song_Duration = item.Song_Duration;
                _Song_Info.Song_Like = item.Song_Like;
                _Song_Info.Album_Name = item.Album_Name;
                ///_Song_Info.MV_Path = item.MV_Path;

                songs.Add(_Song_Info);
            }
            return songs;
        }
    }
}
