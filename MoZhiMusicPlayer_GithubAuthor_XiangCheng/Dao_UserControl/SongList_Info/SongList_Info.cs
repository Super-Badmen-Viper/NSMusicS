using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.SongList_Info
{
    public class SongList_Info
    {
        //This SongList's Name
        public string SongListName { get; set; }
        //This SongList's Like_Nums
        public int This_SongList_Like_Nums { get; set; }
        //This SongList's Image
        public ImageBrush SongListShowImage { get; set; }
        //ListView_Info_DataSource  -> SongList
        public List<ListView_Item_Bing> This_SongList_ItemSource { get; set; }

        //This SongList's WritterUser_ID 
        public int SongList_WritterUser_ID { get; set; }
        //This SongList's WritterUser_Name
        public string SongList_WritterUser_Name { get; set; }
        //This SongList's Updateing Date
        public string Date_Update_Time { get; set; }
    }
}
