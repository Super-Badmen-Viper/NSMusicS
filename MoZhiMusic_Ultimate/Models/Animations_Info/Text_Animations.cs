using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows.Media.Animation;

namespace MoZhiMusic_Ultimate.Models.Animations_Info
{
    public class Text_Animations
    {
        /// <summary>
        /// 字符，水平平移，动画
        /// </summary>
        private class Text_Animations_Direction_Horizontal
        {
            Canvas Canvas_Text_Direction { get; set; }
            LinearDoubleKeyFrame LinearDoubleKeyFrame_Text_Direction_Left { get; set; }
            LinearDoubleKeyFrame LinearDoubleKeyFrame_Text_Direction_Right { get; set; }
        }
    }
}
