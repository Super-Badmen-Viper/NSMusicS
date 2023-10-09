using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Dao_UserControl.Song_Mrc_Info
{
    class Dao_ListBox_Temp_MRC_OneLine_MoreByte
    {
        //单个歌词开始的时间
        public int MRC_One_Start_Time { get; set; }
        //单个歌词持续的时间
        public int MRC_One_Continue_Time { get; set; }
        //单个歌词结束的时间
        public int MRC_One_End_Time { get; set; }
        //单个歌词的内容
        public string MRC_One_Text { get; set; }
    }
}
