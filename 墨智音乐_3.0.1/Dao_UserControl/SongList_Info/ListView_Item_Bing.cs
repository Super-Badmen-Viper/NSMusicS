using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Controls;
using System.Windows.Media;

namespace 墨智音乐_3._0._1.Dao_UserControl.SongList_Info
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
        public ImageBrush Song_Agora_Image { get; set; }

        public static explicit operator ListBoxItem(ListView_Item_Bing v)
        {
            throw new NotImplementedException();
        }
    }
}
