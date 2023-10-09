using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Animation;

namespace NSMusicS.Dao_UserControl.Song_Mrc_Info
{
    /// <summary>
    /// 歌词行信息及歌词字符信息
    /// </summary>
    public class MRC_Line_Info
    {
        //当前 歌词行行数
        public int This_MRC_Line;
        //当前 歌词行开始时间
        public int This_MRC_Start_Time;
        //当前 歌词行持续时间
        public int This_MRC_Duration;

        public string String_Lrc_Line;

        //当前 歌词行所有字节的数量
        public int Int_MoreByte_Nums;
        //当前 歌词行所有字节的 字节内容
        public ArrayList Array_Morebyte_Text = new ArrayList();
        //当前 歌词行字节的动画 开始时间     //停顿效果
        public ArrayList Array_Morebyte_BeginTime = new ArrayList();
        //当前 歌词行字节的动画 持续时间
        public ArrayList Array_Morebyte_Duration = new ArrayList();
        //<0,184,0>天<184,154,0>凉<338,367,0>了 <705,279,0>雨<984,218,0>下<1202,490,0>了 <1692,378,0>你<2070,365,0>走<2435,649,0>了       
    }
}
