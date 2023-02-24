using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Controls;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.SongList_Info
{
    public class ListView_Item_Bing_ALL
    {
        public ListView listView_SongList;//当前的播放列表

        public List<ListView_Item_Bing> listView_Temp_Info_End_ALL = new List<ListView_Item_Bing>();
        public List<ListView_Item_Bing> listView_Temp_Info_End_Love = new List<ListView_Item_Bing>();
        public List<ListView_Item_Bing> listView_Temp_Info_End_Auto = new List<ListView_Item_Bing>();
        public List<ListView_Item_Bing> listView_Temp_Info_End_TryListen = new List<ListView_Item_Bing>();
        public List<ListView_Item_Bing> listView_Temp_Info_End_Temp = new List<ListView_Item_Bing>();

        public bool In_process_of_SongList_listView_Temp_Info_End_ALL;
        public bool In_process_of_SongList_listView_Temp_Info_End_Love;
        public bool In_process_of_SongList_listView_Temp_Info_End_Auto;
        public bool In_process_of_SongList_listView_Temp_Info_End_TryListen;

        private static ListView_Item_Bing_ALL listView_Item_Bing_ALL;
        public static ListView_Item_Bing_ALL Retuen_This()
        {
            listView_Item_Bing_ALL = Return_This_listView_Item_Bing_ALL();
            return listView_Item_Bing_ALL;
        }
        public static ListView_Item_Bing_ALL Return_This_listView_Item_Bing_ALL()
        {
            if (listView_Item_Bing_ALL == null)
                listView_Item_Bing_ALL = new ListView_Item_Bing_ALL();

            return listView_Item_Bing_ALL;
        }
    }
}
