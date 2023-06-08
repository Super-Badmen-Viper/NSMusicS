using GLib;
using Microsoft.VisualBasic;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_Init_Info.Init_SongList_Info;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.SingerImage_Info;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Xml;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.SongList_Info.ViewModel
{
    public class PlaylistViewModel
    {
        public ListView listView_SongList;//当前的播放列表

        public string Path_App;
        private static ListView_Item_Bing_ALL listView_Item_Bing_ALL = ListView_Item_Bing_ALL.Retuen_This();

        private StreamReader SR_List = null;//读取

        ObservableCollection<List<ListView_Item_Bing>> observableCollection = new ObservableCollection<List<ListView_Item_Bing>>();
        public PlaylistViewModel()
        {
            Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";

            //XmlDocument读取xml文件
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.Load(Path_App + @"\SongListInfo_ini\SongList_Ini\SongList.xml");
            //获取xml根节点
            XmlNode xmlRoot = xmlDoc.DocumentElement;
            //读取所有的name节点
            foreach (XmlNode node in xmlRoot.SelectNodes("ListName"))
            {
                //循环输出
                Console.WriteLine("id:{0},name:{1}", node.Attributes["id"].InnerText, node.InnerText);

                int id = Convert.ToInt16(node.Attributes["id"].Value);
                string temp = Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory + @"\Resource\SongListInfo_ini\SongList_Ini\" + node.InnerText + ".ini");
                var lines = File.ReadAllLines(temp);
                int RowCount = lines.Length;
                FileStream FS_List_Save = new FileStream(temp, FileMode.Open);
                SR_List = new StreamReader(FS_List_Save);

                if (id == 1)
                    Load_SongList_Info.Load_Data_ALL(listView_Item_Bing_ALL.listView_Temp_Info_End_ALL, FS_List_Save, SR_List, 1, RowCount);
                else if (id == 2)
                    Load_SongList_Info.Load_Data_ALL(listView_Item_Bing_ALL.listView_Temp_Info_End_Love, FS_List_Save, SR_List, 2, RowCount);
                else if (id == 3)
                    Load_SongList_Info.Load_Data_ALL(listView_Item_Bing_ALL.listView_Temp_Info_End_Auto, FS_List_Save, SR_List, 3, RowCount);
                else if (id == 4)
                    Load_SongList_Info.Load_Data_ALL(listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen, FS_List_Save, SR_List, 4, RowCount);
                else
                {
                    //自定义的歌单列表
                    //.ListView_Download_SongList_Info.MouseDoubleClick +=    //双击事件，判定读取此歌单，
                }


                SR_List = null;

            }
        }

    }
}
