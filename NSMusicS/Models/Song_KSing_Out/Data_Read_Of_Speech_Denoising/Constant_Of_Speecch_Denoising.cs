using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace NSMusicS.Models.Song_KSing_Out.Data_Read_Of_Speech_Denoising
{
    /// <summary>
    /// 常数类：音高分析-K歌音阶动画面板
    /// 
    /// Set:
    ///    Canvas_KSing_Musical_Scale_Animation_Panel    ：Width , Children
    ///        UserControl_Musical_Scale_bar ：Canvas.Top , Canvas.Left
    ///            Background_Musical_Scale_bar：Width
    ///            Canvas_Musical_Scale_bar    ：Children
    ///                UserControl_Scale_bar_Subassembly_Schedule_Fill ：Width , Canvas.Left
    ///    Canvas_KSing_Pitch_Pointer ：Children
    ///        Border_KSing_Pitch_Pointer：Canvas.Top[0, 200]
    /// </summary>
    public class Constant_Of_Speecch_Denoising
    {
        /// <summary>
        /// Canvas音阶面板 Width
        /// </summary>
        public static double This_Song_Total_Second {  get; set; }

        /// <summary>
        /// Canvas音阶面板 Width常数（Duration->Width）12s->1200
        /// </summary>
        public static double constant_Canvas_KSing_Musical_Scale_Animation_Panel_Width = 100;
        /// <summary>
        /// 单个 未唱音阶 Width常数 （Duration->Width）
        /// </summary>
        public static double constant_Background_Musical_Scale_bar_Width = 100;
        /// <summary>
        /// 单个 已唱音阶 Width常数 （Duration->Width）
        /// </summary>
        public static double constant_UserControl_Scale_bar_Subassembly_Schedule_Fill = 100;
    }
}
