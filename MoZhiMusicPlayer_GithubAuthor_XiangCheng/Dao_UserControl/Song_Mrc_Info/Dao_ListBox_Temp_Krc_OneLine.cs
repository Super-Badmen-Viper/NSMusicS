using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.Song_Mrc_Info
{
    class Dao_ListBox_Temp_MRC_OneLine
    {
        //歌词行开始的时间
        public int MRC_Line_Start_Time { get; set; }
        //歌词行持续的时间
        public int MRC_Line_Continue_Time { get; set; }
        //歌词行的内容
        public string MRC_Line_Text { get; set; }
        //单个歌词信息对象
        public Dao_ListBox_Temp_MRC_OneLine_MoreByte[] dao_listBox_temp_MRC_oneLine_moreByte { get; set; }

    }
}
