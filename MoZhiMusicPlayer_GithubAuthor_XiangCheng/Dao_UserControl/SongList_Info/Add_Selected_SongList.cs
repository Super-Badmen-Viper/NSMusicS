using Shell32;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Threading;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.SongList_Info
{
    public class Add_Selected_SongList
    {
        private static Add_Selected_SongList add_Selected_SongList;

        public static Add_Selected_SongList Retuen_This()
        {
            add_Selected_SongList = Return_This_listView_Item_Bing_ALL();

            return add_Selected_SongList;
        }
        public static Add_Selected_SongList Return_This_listView_Item_Bing_ALL()
        {
            if (add_Selected_SongList == null)
            {
                add_Selected_SongList = new Add_Selected_SongList();
            }

            return add_Selected_SongList;
        }



        //MainWindow Get_FrmMain = MainWindow.Retuen_This();
        ListView_Item_Bing_ALL listView_Item_Bing_ALL;


        public void Retuen_Selected_SongLists(ListView_Item_Bing[] ListView_Item_Bing)
        {
            listView_Item_Bing_ALL = ListView_Item_Bing_ALL.Retuen_This();

            if (listView_Item_Bing_ALL.listView_Temp_Info_End_Auto == null)
                listView_Item_Bing_ALL.listView_Temp_Info_End_Auto = new List<ListView_Item_Bing>();

            //追加数列至本地音乐列表  Get_FrmMain.userControl_主界面_FrmMain.listView_Item_Bing_ALL.listView_Temp_Info_End_ALL.
            for (int i = 0; i < ListView_Item_Bing.Length; i++)
            {
                if (ListView_Item_Bing[i] != null)
                    listView_Item_Bing_ALL.listView_Temp_Info_End_Auto.Add(ListView_Item_Bing[i]);
            }

        }

        public string[] Return_Select_One_Mp3List()
        {


            return null;
        }

        #region 获取本机所有mp3音乐文件路径集合

        /* Thread thread;
         DispatcherTimer dispatcherTimer;*/
        /// <summary>
        /// 获取本机所有mp3音乐文件路径集合
        /// </summary>
        public void Return_PC_ALL_Mp3Info()
        {

            /*Thread thread = new Thread(new ThreadStart(() =>
            {
                //做一些耗时操作，这里用线程休眠10秒来模拟 
                Thread.Sleep(TimeSpan.FromSeconds(10));

                finds();
            }));
            thread.Start();*/

            MessageBoxResult messageBoxResult = MessageBox.Show("开始检索本机所有音乐", "", MessageBoxButton.YesNo);

            if (messageBoxResult == MessageBoxResult.Yes)
            {
                //获取当前UI进程的子线程
                /*Get_FrmMain.userControl_主界面_FrmMain.ListView_Temp_Info.Dispatcher.Invoke((Action)(() =>
                {
                    //，为子线程开启多线程 执行耗时操作     //直接执行会占用此UI线程，导致界面假死，后台依然在执行
                    Thread thread = new Thread(new ThreadStart(() =>
                    {
                        //做一些耗时操作，这里用线程休眠10秒来模拟 
                        //Thread.Sleep(TimeSpan.FromSeconds(10));

                        finds();
                    }));
                    thread.Start();

                    *//*thread = new Thread(finds);//多线程遍历本机音乐文件
                    thread.Start();

                    dispatcherTimer = new DispatcherTimer();
                    dispatcherTimer.Interval = TimeSpan.FromMilliseconds(1000);
                    dispatcherTimer.Tick += Clear_Memo;
                    dispatcherTimer.Start();*//*



                }));*/
            }
            else
            {

            }

        }


        public ListView_Item_Bing[] ListView_Item_Bing_Temp;
        public bool ListView_Item_Bing_Bool;

        public static string[] Finds_AllSong = new string[9999];
        public static string[] Finds_AllSong_End = new string[9999];
        public string[] All_Song_Path;//导入歌曲     临时存储选定的所有文件夹内 MP3文件信息
        public string[] All_Info_Path;
        public void finds()
        {
            //获取本地硬盘驱动器 
            string[] localDrives = Directory.GetLogicalDrives();
            foreach (string eachDrive in localDrives)
            {
                if (!Directory.Exists(eachDrive))
                {
                    MessageBox.Show("文件夹不存在");
                }

                //遍历文件夹
                DirectoryInfo theFolder = new DirectoryInfo(eachDrive);
                FileInfo[] thefileInfo = theFolder.GetFiles("*.mp3", SearchOption.TopDirectoryOnly);
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
                            //listBox1.Items.Add(NextFile.FullName);
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

            ListView_Item_Bing_Temp = Resert_SongList_Info(All_Info_Path);//生成ListViewBing数列

            ListView_Item_Bing_Bool = true;

            listView_Item_Bing_ALL = ListView_Item_Bing_ALL.Retuen_This();

            if (listView_Item_Bing_ALL.listView_Temp_Info_End_ALL == null)
                listView_Item_Bing_ALL.listView_Temp_Info_End_ALL = new List<ListView_Item_Bing>();

            //追加数列至本地音乐列表  Get_FrmMain.userControl_主界面_FrmMain.listView_Item_Bing_ALL.listView_Temp_Info_End_ALL.
            for (int i = 0; i < ListView_Item_Bing_Temp.Length; i++)
            {
                listView_Item_Bing_ALL.listView_Temp_Info_End_ALL.Add(ListView_Item_Bing_Temp.ElementAt(i));
            }

            Console.ReadLine();
            MessageBox.Show("已导入本机所有mp3音乐至本地音乐");


            //t1.Abort();
            //Add_Song_Into_List(Test_List_Name);//方法已过时，将弃用

            //Song_Find_ALL_List.Text = "查找本机所有歌曲";

            //SongIds_New_Update_All();


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
                        break;
                    }
                }
            }
        }

        int Nums_Song_Name_Index;
        string Song_Path_1;
        string Song_Path_2;
        public void Find_Like_AllFiles()//删除重复的歌曲
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


        /// <summary>
        /// 返回处理后的音乐文件集合ListviewBing信息
        /// </summary>
        /// <param name="All_Info_Path"></param>
        /// <returns></returns>
        public ListView_Item_Bing[] Resert_SongList_Info(string[] All_Info_Path)
        {
            try
            {
                All_Song_Path = new string[9999];

                string Temp_Song_Name;
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
                string Song_Src_Paths;
                string Song_Path_Temp;
                int Song_Path_Temp_SongName;
                string Singer_Name_Temp;
                ShellClass Shell32_Class = new ShellClass();//调用Shell32.dll  ,   查找mp3文件信息
                Folder Folderdir;
                FolderItem FolderItemitem;
                string Aldum_Temp;
                int Song_Ids_Temp = 1;


                ListView_Item_Bing_Temp = new ListView_Item_Bing[9999];


                for (int i = 0; i < All_Song_Path.Length; i++)
                {
                    if (All_Song_Path[i] != null)
                    {
                        if (All_Song_Path[i].ToString().Length > 0)
                        {
                            ListView_Item_Bing listView_Item_Bing_Temp = new ListView_Item_Bing();

                            Nums_Song_Name_Index = All_Song_Path[i].LastIndexOf(@"\");
                            Nums_Song_Name_Index = Nums_Song_Name_Index + 1;

                            Song_Src_Paths = All_Song_Path[i];
                            Song_Path_Temp = All_Song_Path[i];
                            Song_Path_Temp = Song_Path_Temp.Substring(Nums_Song_Name_Index, Song_Path_Temp.Length - Nums_Song_Name_Index);
                            String temp_song = All_Song_Path[i];

                            Song_Path_Temp_SongName = All_Song_Path[i].IndexOf("-");


                            if (Song_Path_Temp_SongName > 0)
                            {
                                Singer_Name_Temp = Song_Path_Temp;
                                Singer_Name_Temp = Singer_Name_Temp.Substring(0, Singer_Name_Temp.IndexOf("-"));
                                //Singer_Name_Temp = Singer_Name_Temp.Substring(Nums_Song_Name_Index, Singer_Name_Temp.Length - Nums_Song_Name_Index);

                                if (Singer_Name_Temp.Length > 0 && Singer_Name_Temp != null)
                                {

                                    //dataGridView_List_ALL.Rows.Add();


                                    Singer_Name_Temp.Trim();




                                    //dataGridView_List_ALL.Rows[i].Cells[0].Value = Singer_Name_Temp;//索引设置为-1，索引初始值为0，所以排首列
                                    listView_Item_Bing_Temp.Singer_Name = Singer_Name_Temp;




                                    Song_Path_Temp_SongName = Song_Path_Temp.LastIndexOf(".mp3");
                                    if (Song_Path_Temp.LastIndexOf(".mp3") <= 0)
                                    {
                                        Song_Path_Temp_SongName = Song_Path_Temp.LastIndexOf(".flac");
                                    }

                                    song_name_temp = Song_Path_Temp;
                                    song_name_temp = song_name_temp.Substring(0, Song_Path_Temp_SongName);

                                    //读取
                                    Folderdir = Shell32_Class.NameSpace(System.IO.Path.GetDirectoryName(Song_Src_Paths));
                                    FolderItemitem = Folderdir.ParseName(System.IO.Path.GetFileName(Song_Src_Paths));
                                    Aldum_Temp = Folderdir.GetDetailsOf(FolderItemitem, 14);




                                    //dataGridView_List_ALL.Rows[i].Cells[1].Value = song_name_temp;//设置DisplayMember属性显示为"全部"
                                    listView_Item_Bing_Temp.Song_Name = song_name_temp;
                                    //dataGridView_List_ALL.Rows[i].Cells[2].Value = Aldum_Temp;
                                    listView_Item_Bing_Temp.Album_Name = Aldum_Temp;
                                    //dataGridView_List_ALL.Rows[i].Cells[3].Value = Song_Src_Paths;
                                    listView_Item_Bing_Temp.Song_Url = Song_Src_Paths;
                                    //dataGridView_List_ALL.Rows[i].Cells[4].Value = Song_Ids_Temp;
                                    listView_Item_Bing_Temp.Song_No = Song_Ids_Temp;

                                    //listView_Item_Bing_Temp.Song_Like_Image = new ImageBrush(new BitmapImage(new Uri(Get_FrmMain.Path_App + @"\图片资源\按键图片\c_like-2.png")));
                                    listView_Item_Bing_Temp.Song_Like = 0;



                                    Song_Ids_Temp++;





                                    for (int k = 0; k < ListView_Item_Bing_Temp.Length; k++)
                                    {
                                        if (ListView_Item_Bing_Temp[k] == null)
                                        {
                                            ListView_Item_Bing_Temp[k] = listView_Item_Bing_Temp;
                                            break;
                                        }
                                    }



                                }
                            }
                            /* else
                             {
                                 //dataGridView_List_ALL.Rows.Add();
                                 //dataGridView_List_ALL.Rows[i].Cells[0].Value = "未知歌手";//索引设置为-1，索引初始值为0，所以排首列
                                 listView_Item_Bing_Temp.Singer_Name = "未知歌手";
                                 //dataGridView_List_ALL.Rows[i].Cells[1].Value = Song_Path_Temp;//设置DisplayMember属性显示为"全部"
                                 listView_Item_Bing_Temp.Song_Name = Song_Path_Temp;
                                 //dataGridView_List_ALL.Rows[i].Cells[2].Value = "  ";
                                 listView_Item_Bing_Temp.Album_Name = "";
                                 //dataGridView_List_ALL.Rows[i].Cells[3].Value = Song_Src_Paths;
                                 listView_Item_Bing_Temp.Song_Url = Song_Src_Paths;
                                 //dataGridView_List_ALL.Rows[i].Cells[4].Value = Song_Ids_Temp;
                                 listView_Item_Bing_Temp.Song_No = Song_Ids_Temp;


                                 Song_Ids_Temp++;


                             }


                             ListView_Item_Bing_Temp.Add(listView_Item_Bing_Temp);*/

                        }
                    }
                }


                return ListView_Item_Bing_Temp;
            }
            catch
            {
                return ListView_Item_Bing_Temp;
            }
        }

        #endregion
    }
}
