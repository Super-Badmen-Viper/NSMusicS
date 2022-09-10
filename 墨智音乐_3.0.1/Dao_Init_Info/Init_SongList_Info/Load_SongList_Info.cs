using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using 墨智音乐_3._0._1.Dao_UserControl.SongList_Info;

namespace 墨智音乐_3._0._1.Dao_Init_Info.Init_SongList_Info
{
    public class Load_SongList_Info
    {
        public string Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";

        //实例化一个文件流--->与写入文件相关联
        //静态读取Resource文件会一直占用，导致只能写入不能导出，出现文件内容清空
        private FileStream FS_List_Save = null;
        private StreamWriter SW_List = null;//写入 
        private StreamReader SR_List = null;//读取

        string[] singer_Name;
        string[] song_Name;
        string[] album_Name;
        string[] song_Url;
        int[] song_No;

        private ListView_Item_Bing_ALL listView_Item_Bing_ALL = ListView_Item_Bing_ALL.Retuen_This();

        public void DataGridView_List_ALL_Loaded()
        {
            #region
            /* ListBox_Select_ListView.Items.Add("本地音乐_listView_Temp_Info_End_ALL");
             ListBox_Select_ListView.Items.Add("我的收藏_listView_Temp_Info_End_Love");
             ListBox_Select_ListView.Items.Add("默认列表_listView_Temp_Info_End_Auto");*/

            //加载歌单歌曲信息，多线程
            //解析mp3文件绝对路径，通过引用Shell32_Class包读取mp3文件流中的专辑信息
            //解析时占用线程Resource较多，需要多线程
            /*var t1 = new Thread(Load_Data_ALL_D_Grid_View_1);//读取歌曲文件信息
            t1.Start();
            var t2 = new Thread(Load_Data_ALL_D_Grid_View_2);//读取歌曲文件信息
            t2.Start();
            var t3 = new Thread(Load_Data_ALL_D_Grid_View_3);//读取歌曲文件信息
            t3.Start();*/
            #endregion

            //先读取我的收藏歌单里的歌曲信息
            Load_Data_ALL_D_Grid_View_2();

            Load_Data_ALL_D_Grid_View_1();

            Load_Data_ALL_D_Grid_View_3();

            Load_Data_ALL_D_Grid_View_4();
        }


        /// <summary>
        /// 读取歌单
        /// </summary>
        public void Load_Data_ALL_D_Grid_View_1()
        {
            string temp = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory + @"\Resource\SongListInfo_ini\SongList_Ini\本地音乐.ini");

            var lines = File.ReadAllLines(temp);
            int RowCount = lines.Length;

            FileStream FS_List_Save = new FileStream(temp, FileMode.Open);
            SR_List = new StreamReader(FS_List_Save);

            Load_Data_ALL(listView_Item_Bing_ALL.listView_Temp_Info_End_ALL, FS_List_Save, SR_List, 1, RowCount);

            SR_List = null;
        }
        /// <summary>
        /// 读取歌单
        /// </summary>
        public void Load_Data_ALL_D_Grid_View_2()
        {
            string temp = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory + @"\Resource\SongListInfo_ini\SongList_Ini\我喜欢.ini");

            var lines = File.ReadAllLines(temp);
            int RowCount = lines.Length;

            FileStream FS_List_Save = new FileStream(temp, FileMode.Open);
            SR_List = new StreamReader(FS_List_Save);            

            Load_Data_ALL(listView_Item_Bing_ALL.listView_Temp_Info_End_Love, FS_List_Save, SR_List, 2, RowCount);

            SR_List = null;
        }
        /// <summary>
        /// 读取歌单
        /// </summary>
        public void Load_Data_ALL_D_Grid_View_3()
        {
            string temp = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory + @"\Resource\SongListInfo_ini\SongList_Ini\最近播放.ini");

            var lines = File.ReadAllLines(temp);
            int RowCount = lines.Length;

            FileStream FS_List_Save = new FileStream(temp, FileMode.Open);
            SR_List = new StreamReader(FS_List_Save);

            Load_Data_ALL(listView_Item_Bing_ALL.listView_Temp_Info_End_Auto, FS_List_Save, SR_List, 3, RowCount);

            SR_List = null;
        }
        /// <summary>
        /// 读取歌单
        /// </summary>
        public void Load_Data_ALL_D_Grid_View_4()
        {
            string temp = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory + @"\Resource\SongListInfo_ini\SongList_Ini\试听列表.ini");

            var lines = File.ReadAllLines(temp);
            int RowCount = lines.Length;

            FileStream FS_List_Save = new FileStream(temp, FileMode.Open);
            SR_List = new StreamReader(FS_List_Save);

            Load_Data_ALL(listView_Item_Bing_ALL.listView_Temp_Info_End_Auto, FS_List_Save, SR_List, 4, RowCount);

            SR_List = null;
        }
        /// <summary>
        /// 读取歌单
        /// </summary>
        public void Load_Data_ALL_D_Grid_View_Select_Songs()
        {
            string temp = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory + @"\Resource\SongListInfo_ini\SongList_Find_Select_Song\Find_Song.ini");

            var lines = File.ReadAllLines(temp);
            int RowCount = lines.Length;

            FileStream FS_List_Save = new FileStream(temp, FileMode.Open);
            SR_List = new StreamReader(FS_List_Save);

            Load_Data_ALL(listView_Item_Bing_ALL.listView_Temp_Info_End_Auto, FS_List_Save, SR_List, 0, RowCount);

            SR_List = null;
        }


        private void Load_Data_ALL(List<ListView_Item_Bing> Save_Load_List_Name, FileStream FS_List_Save, StreamReader SR_List,int num, int RowCount)
        {
            if (RowCount > 0)
            {
                singer_Name = new string[9999];
                song_Name = new string[9999];
                album_Name = new string[9999];
                song_Url = new string[9999];
                song_No = new int[9999];

                try//防止读取不到值
                {
                    for (int i = 0; i <= RowCount - 1; i++)
                    {
                        singer_Name[i] = SR_List.ReadLine();
                        song_Name[i] = SR_List.ReadLine();
                        album_Name[i] = SR_List.ReadLine();
                        song_Url[i] = SR_List.ReadLine();
                        song_No[i] = Convert.ToInt32(SR_List.ReadLine());
                    }

                    SR_List.Close();
                    FS_List_Save.Close();


                    int count = 0;

                    ListView_Item_Bing[] listView_Temp_Infos = new ListView_Item_Bing[9999];

                    for (int i = 0; i < singer_Name.Length; i++)
                    {
                        if (listView_Temp_Infos[i] == null)
                        {
                            if (singer_Name[i] != null)
                            {
                                if (song_Name[i] != null)
                                {
                                    if (song_Url[i] != null)
                                    {
                                        if (album_Name[i] != null)
                                        {
                                            ListView_Item_Bing temp = new ListView_Item_Bing();
                                            temp.Singer_Name = singer_Name[i];
                                            temp.Song_Name = song_Name[i];
                                            temp.Song_Url = song_Url[i];
                                            temp.Song_No = song_No[i];
                                            temp.Album_Name = album_Name[i];

                                            temp.Song_MV_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\视频播放.png")));
                                            temp.Song_Agora_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\agora_超高清音质.png")));
                                            //agora_超高清音质

                                            if (num == 2)
                                            {
                                                temp.Song_Like_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心 - 副本.png")));
                                                temp.Song_Like = 1;
                                            }
                                            else
                                            {
                                                if (listView_Item_Bing_ALL.listView_Temp_Info_End_Love != null)
                                                {
                                                    foreach (ListView_Item_Bing _Item_Bing in listView_Item_Bing_ALL.listView_Temp_Info_End_Love)
                                                    {
                                                        if (_Item_Bing != null)
                                                            if (_Item_Bing.Song_Url.Equals(temp.Song_Url))
                                                            {
                                                                temp.Song_Like_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心 - 副本.png")));
                                                                temp.Song_Like = 1;
                                                            }
                                                    }
                                                    if (temp.Song_Like != 1)
                                                    {
                                                        temp.Song_Like_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心.png")));
                                                        temp.Song_Like = 0;
                                                    }
                                                }
                                                else
                                                {
                                                    if (temp.Song_Like != 1)
                                                    {
                                                        temp.Song_Like_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心.png")));
                                                        temp.Song_Like = 0;
                                                    }
                                                }
                                            }

                                            listView_Temp_Infos[i] = temp;

                                            count++;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (num == 1)
                    {
                        listView_Item_Bing_ALL.listView_Temp_Info_End_ALL = new List<ListView_Item_Bing>();
                        for (int i = 0; i < count; i++)
                        {
                            if (listView_Temp_Infos[i] != null)
                            {


                                listView_Item_Bing_ALL.listView_Temp_Info_End_ALL.Add(listView_Temp_Infos[i]);
                            }
                            else
                            {
                                //listView_Item_Bing_ALL.listView_Temp_Info_End_ALL = null;
                                break;
                            }
                        }
                    }
                    else if (num == 2)
                    {
                        listView_Item_Bing_ALL.listView_Temp_Info_End_Love = new List<ListView_Item_Bing>();
                        for (int i = 0; i < count; i++)
                        {
                            if (listView_Temp_Infos[i] != null)
                            {
                                listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Add(listView_Temp_Infos[i]);
                            }
                            else
                            {
                                //listView_Item_Bing_ALL.listView_Temp_Info_End_Love = null;
                                break;
                            }
                        }
                    }
                    else if (num == 3)
                    {
                        listView_Item_Bing_ALL.listView_Temp_Info_End_Auto = new List<ListView_Item_Bing>();
                        for (int i = 0; i < count; i++)
                        {
                            if (listView_Temp_Infos[i] != null)
                            {
                                listView_Item_Bing_ALL.listView_Temp_Info_End_Auto.Add(listView_Temp_Infos[i]);
                            }
                            else
                            {
                                //listView_Item_Bing_ALL.listView_Temp_Info_End_Auto = null;
                                break;
                            }
                        }
                    }
                    else if (num == 4)
                    {
                        listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen = new List<ListView_Item_Bing>();
                        for (int i = 0; i < count; i++)
                        {
                            if (listView_Temp_Infos[i] != null)
                            {
                                listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen.Add(listView_Temp_Infos[i]);
                            }
                            else
                            {
                                //listView_Item_Bing_ALL.listView_Temp_Info_End_Auto = null;
                                break;
                            }
                        }
                    }
                    else if (num == 0)
                    {
                        listView_Item_Bing_ALL.listView_Temp_Info_End_Temp = new List<ListView_Item_Bing>();
                        for (int i = 0; i < count; i++)
                        {
                            if (listView_Temp_Infos[i] != null)
                            {
                                listView_Item_Bing_ALL.listView_Temp_Info_End_Temp.Add(listView_Temp_Infos[i]);
                            }
                            else
                            {
                                //listView_Item_Bing_ALL.listView_Temp_Info_End_Auto = null;
                                break;
                            }
                        }
                    }
                }
                catch
                {
                    Save_Load_List_Name = null;

                    if (num == 1)
                        listView_Item_Bing_ALL.listView_Temp_Info_End_ALL = null;
                    else if (num == 2)
                        listView_Item_Bing_ALL.listView_Temp_Info_End_Love = null;
                    else if (num == 3)
                        listView_Item_Bing_ALL.listView_Temp_Info_End_Auto = null;
                    else if (num == 4)
                        listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen = null;
                    else if (num == 0)
                        listView_Item_Bing_ALL.listView_Temp_Info_End_Temp = null;

                }
            }

        }

    }
}
