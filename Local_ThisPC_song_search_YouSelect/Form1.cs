using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Collections;
using System.IO;
using Shell32;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace Local_ThisPC_song_search_YouSelect
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }


        static string[] All_Info_Path;
        static string[] All_Song_Path = new string[9999];
        static string[] Finds_AllSong_End;
        static string[] Finds_AllSong;
        #region 遍历磁盘
        /// <summary>
        /// 开始扫描歌曲
        /// </summary>
        public void Find_ALL()
        {
            Form1.CheckForIllegalCrossThreadCalls = false;//取消对线程安全性的监控（不检测使用的线程是否是该控件的线程）

            //button1.Hide();

            Finds_AllSong = new string[9999];       

            FindAllFiles(All_Song_Path);


            listBox2.Items.Add("\n\n开始提取歌曲文件特征信息\n\n");
            this.listBox1.TopIndex = this.listBox1.Items.Count - (int)(this.listBox1.Height / this.listBox1.ItemHeight);
            Return_Take_SongSrc_Info();

            listBox2.Items.Add("\n开始排序\n");
            this.listBox1.TopIndex = this.listBox1.Items.Count - (int)(this.listBox1.Height / this.listBox1.ItemHeight);
            //数组按照歌曲名排序
            ArrayList temp_string = new ArrayList();//按照歌曲名排序de,序号混乱
            foreach (Song_Info tmps in list)
            {
                temp_string.Add(tmps.Song_Name_Table);//歌曲名排序//歌曲名独一无二性
            }
            temp_string.Sort();

            //中间存储
            List<Song_Info> song_Infos = new List<Song_Info>();

            foreach (string tmps in temp_string)
            {
                //寻找与temp_string与list相同歌曲名的项
                Song_Info temp_song_Info = list.Find(delegate (Song_Info x) { return x.Song_Name_Table == tmps; });
                if (temp_song_Info != null)
                    song_Infos.Add(temp_song_Info);
            }

            //歌曲序号排序
            int index = 1;
            for (int i = 0; i < song_Infos.Count; i++)
            {
                song_Infos[i].Song_No = index;
                index++;
            }

            list = new List<Song_Info>();
            list = song_Infos;
            listBox2.Items.Add("\n提取排序成功!!!!!\n");
            this.listBox1.TopIndex = this.listBox1.Items.Count - (int)(this.listBox1.Height / this.listBox1.ItemHeight);
            listBox2.Items.Add("\n开始保存！！！\n");
            this.listBox1.TopIndex = this.listBox1.Items.Count - (int)(this.listBox1.Height / this.listBox1.ItemHeight);

            Save_DataGridView();


            //return true;
        }

        public void FindAllFiles(string[] All_Song_Path)
        {
            for (int i = 0; i < All_Song_Path.Length; i++)
            {
                if (All_Song_Path[i] == null)
                {
                    listBox1.Items.Add(All_Song_Path[i] + "\n");
                    this.listBox1.TopIndex = this.listBox1.Items.Count - (int)(this.listBox1.Height / this.listBox1.ItemHeight);
                    break;
                    
                }
            }
        }

        static string Song_Path_1;
        static string Song_Path_2;
        static int Nums_Song_Name_Index;

        /// <summary>
        /// 删除重复的歌曲
        /// </summary>
        public static void Find_Like_AllFiles()
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

        #endregion


        static List<Song_Info> list = new List<Song_Info>();
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
        #region 读取歌曲路径数组，并分解为各信息
        static string Temp_Song_Name;
        int num1;
        int num2;
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
                                    song_info.Song_Name_Table = Song_Path_Temp;
                                    song_info.Song_Name = song_name_temp.Trim();//设置DisplayMember属性显示为"全部"
                                    song_info.Song_Aldum = Aldum_Temp;
                                    song_info.Song_Src = Song_Src_Paths;
                                    song_info.Song_No = Song_Ids_Temp;
                                    Song_Ids_Temp++;

                                    list.Add(song_info);

                                    listBox1.Items.Add(song_info.Singer_Name + "\t" + song_info.Song_Name + "\t" + song_info.Song_Aldum + "\t" + song_info.Song_No + "\n");
                                    this.listBox1.TopIndex = this.listBox1.Items.Count - (int)(this.listBox1.Height / this.listBox1.ItemHeight);
                                }
                            }
                        }
                    }
                }
            }

        }


        #endregion


        #region 歌单的保存

        //实例化一个文件流--->与写入文件相关联
        //静态读取资源文件会一直占用，导致只能写入不能导出，出现文件内容清空
        private static FileStream FS_List_Save = null;
        private static StreamWriter SW_List = null;//写入 
        private static StreamReader SR_List = null;//读取

        public void Save_DataGridView()
        {
            Save_Data_ALL_List();
            FS_List_Save = null;
            SW_List = null;

            //MessageBox.Show("完成");
            System.Environment.Exit(0);
        }
        public void Save_Data_ALL_List()
        {
            //不写入歌曲序号，直接导入列表其后
            string temp = Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory + @"\SongList_Find_Select_Song\Find_Song.ini");
            Clear_File_Info(temp);

            FS_List_Save = new FileStream(temp, FileMode.Create);
            SW_List = new StreamWriter(FS_List_Save);//无法静态
            Write_Song_Info(FS_List_Save);

            FS_List_Save = null;
            SW_List = null;

            //写入1，说明已经导入成功
            temp = Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory + @"\SongList_MakeSure_Ini\SongList_Find_Select_Song_MakeSure.ini");
            Clear_File_Info(temp);
            FS_List_Save = new FileStream(temp, FileMode.Create);
            SW_List = new StreamWriter(FS_List_Save);//无法静态
            SW_List.WriteLine("已检索");
            FormClosing = "已检索";
            SW_List.Flush();
            SW_List.Close();
            FS_List_Save.Close();
            FS_List_Save = null;
            SW_List = null;
        }
        public static void Clear_File_Info(string FullName)
        {
            //先清空文件信息
            FileStream fs = new FileStream(FullName, FileMode.Create);//清空此文件的数据
            fs.Flush();
            fs.Close();
        }

        /// <summary>
        /// 写入信息
        /// </summary>
        /// <param name="FS_List"></param>
        public static void Write_Song_Info(FileStream FS_List)
        {

            //开始写入
            if (list.Count > 0) //if有新的行可以插入
            {
                for (int i = 0; i < list.Count; i++)
                {
                    //如果某一列数据为空，就写入""，因为空对象不能调用tostring()；
                    if (list[i].Singer_Name != null)
                        SW_List.WriteLine(list[i].Singer_Name.ToString());

                    if (list[i].Song_Name != null)
                        SW_List.WriteLine(list[i].Song_Name.ToString());

                    if (list[i].Song_Aldum != null)
                        SW_List.WriteLine(list[i].Song_Aldum.ToString());

                    if (list[i].Song_Src != null)
                        SW_List.WriteLine(list[i].Song_Src.ToString());

                    if (list[i].Song_No != 0)
                        SW_List.WriteLine(list[i].Song_No.ToString());
                }
                //清空缓冲区
                SW_List.Flush();
                //关闭流
                SW_List.Close();
                FS_List.Close();
            }
        }




        #endregion

        private void button1_Click(object sender, EventArgs e)
        {
            OpenFileDialog dialog = new OpenFileDialog();
            dialog.Multiselect = true;//该值确定是否可以选择多个文件
            dialog.Title = "请选择文件夹";
            dialog.Filter = "(*.mp3,*.flac,*.wav)|*.mp3;*.flac;*.wav;";
            dialog.ShowDialog();
            All_Info_Path = dialog.FileNames;

            var t1 = new System.Threading.Thread(Find_ALL);
            t1.Start();

            button1.Hide();
        }

        string FormClosing = "";
        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {

        }

        private void Form1_FormClosed(object sender, FormClosedEventArgs e)
        {
            if (!FormClosing.Equals("已检索"))
            {
                //写入1，说明已经导入成功
                string temp = Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory + @"\SongList_MakeSure_Ini\SongList_MakeSure.ini");
                Clear_File_Info(temp);
                FS_List_Save = new FileStream(temp, FileMode.Create);
                SW_List = new StreamWriter(FS_List_Save);//无法静态
                SW_List.WriteLine("未完成");
                SW_List.Flush();
                SW_List.Close();
                FS_List_Save.Close();
                FS_List_Save = null;
                SW_List = null;
            }
        }
    }
}
