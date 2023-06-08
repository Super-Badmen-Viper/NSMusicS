using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.SongList_Info;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_Init_Info.Init_SongList_Info
{
    public class Load_SongList_Info
    {
        public static string Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";

        //实例化一个文件流--->与写入文件相关联
        //静态读取Resource文件会一直占用，导致只能写入不能导出，出现文件内容清空
        private FileStream FS_List_Save = null;
        private StreamWriter SW_List = null;//写入 
        private StreamReader SR_List = null;//读取

        static string[] singer_Name;
        static string[] song_Name;
        static string[] album_Name;
        static string[] song_Url;
        static int[] song_No;

        private static ListView_Item_Bing_ALL listView_Item_Bing_ALL = ListView_Item_Bing_ALL.Retuen_This();

        public static void Load_Data_ALL(List<ListView_Item_Bing> Save_Load_List_Name, FileStream FS_List_Save, StreamReader SR_List,int num, int RowCount)
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
