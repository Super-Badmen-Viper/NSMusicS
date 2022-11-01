using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media.Imaging;
using System.Windows.Media;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.SongList_Info
{
    public class SongList_Info_WebLoad
    {
        private FileStream FS_List = null;
        private StreamWriter SW_List = null;//写入 
        private StreamReader SR_List = null;//读取
        string[] singer_Name;
        string[] song_Name;
        string[] album_Name;
        string[] song_Url;
        int[] song_No;
        private ListView_Item_Bing_ALL listView_Item_Bing_ALL = ListView_Item_Bing_ALL.Retuen_This();
        public string Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";

        SongList_Info songList_Info = new SongList_Info();

        /// <summary>
        /// 填充音频文件集合到歌单列表中
        /// </summary>
        public void Fill_SongList()
        {
            //此文件路径，为web网络下载的歌单信息（从服务器端获取歌单数据，歌单数据保存在ini文件中）
            string temp = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory + @"\Resource\SongListInfo_ini\SongList_Ini\本地音乐.ini");

            var lines = File.ReadAllLines(temp);
            int RowCount = lines.Length;

            FileStream FS_List_Save = new FileStream(temp, FileMode.Open);
            SR_List = new StreamReader(FS_List_Save);

            Load_Data_ALL(songList_Info.This_SongList_ItemSource, FS_List, SR_List,RowCount);
        }

        /// <summary>
        /// 填充歌单信息
        /// </summary>
        /// <param name="Save_Load_List_Name">  需要填充数据的List<>  动态参数</param>
        /// <param name="FS_List_Save"></param>
        /// <param name="SR_List">歌单新</param>
        /// <param name="RowCount">歌单的歌曲数量</param>
        /// <returns></returns>
        private void Load_Data_ALL(List<ListView_Item_Bing> Save_Load_List_Name, FileStream FS_List_Save, StreamReader SR_List, int RowCount)
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

                                            /*if (love_true == 1)
                                            {
                                                temp.Song_Like_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心 - 副本.png")));
                                                temp.Song_Like = 1;
                                            }
                                            else
                                            {*/
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
                                            //}

                                            listView_Temp_Infos[i] = temp;

                                            count++;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    for (int i = 0; i < count; i++)
                    {
                        if (listView_Temp_Infos[i] != null)
                            Save_Load_List_Name.Add(listView_Temp_Infos[i]);
                        else
                            break;
                    }
                }
                catch
                {
                    
                }
            }
        }
    }
}
