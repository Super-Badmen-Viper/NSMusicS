using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Controls;
using System.Windows.Media;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.SongList_Info
{
    public class ListView_Item_Bing
    {
        public string Singer_Name { get; set; }
        public string Song_Name { get; set; }
        public string Album_Name { get; set; }
        public string Song_Url { get; set; }
        public int Song_No { get; set; }
        public int Song_Like { get; set; }
        public ImageBrush Song_Like_Image { get; set; }
        public ImageBrush Song_MV_Image { get; set; }
        public ImageBrush Song_Agora_Image { get; set; }//音质

        public string MV_Path;

        public string Song_Image_Name;
        public string Song_MRC_Path;
        private static ListView_Item_Bing listView_Item_Bing;
        public static ListView_Item_Bing Retuen_This()
        {
            listView_Item_Bing = Return_This_listView_Item_Bing();
            return listView_Item_Bing;
        }
        public static ListView_Item_Bing Return_This_listView_Item_Bing()
        {
            if (listView_Item_Bing == null)
                listView_Item_Bing = new ListView_Item_Bing();

            return listView_Item_Bing;
        }


        public static explicit operator ListBoxItem(ListView_Item_Bing v)
        {
            throw new NotImplementedException();
        }
    }
}
