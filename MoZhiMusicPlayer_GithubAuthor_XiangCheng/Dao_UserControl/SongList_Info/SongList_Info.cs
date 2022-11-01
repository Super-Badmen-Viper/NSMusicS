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
        string SongListName { get; set; }
        //This SongList's Like_Nums
        int This_SongList_Like_Nums { get; set; }
        //This SongList's Image
        public ImageBrush SongListShowImage { get; set; }
        //ListView_Info_DataSource  -> SongList
        List<ListView_Item_Bing> listView_Item_Bings { get; set; }

        //This SongList's WritterUser_ID 
        int SongList_WritterUser_ID { get; set; }
        //This SongList's WritterUser_Name
        string SongList_WritterUser_Name { get; set; }
        //This SongList's Updateing Date
        string Date_Update_Time { get; set; }
    }
}
