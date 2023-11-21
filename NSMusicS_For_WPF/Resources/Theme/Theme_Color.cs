using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;
using Color = System.Windows.Media.Color;
using ColorConverter = System.Windows.Media.ColorConverter;

namespace NSMusicS_For_WPF.Resources.Theme
{
    public class Theme_Color
    {
        /// <summary>
        /// 经典白
        /// </summary>
        public Color color_1;
        /// <summary>
        /// 炫酷黑
        /// </summary>
        public Color color_2;
        /// <summary>
        /// 精致灰
        /// </summary>
        public Color color_3;
        /// <summary>
        /// 忆梦蓝
        /// </summary>
        public Color color_4;
        /// <summary>
        /// 粉墨红
        /// </summary>
        public Color color_5;
        /// <summary>
        /// 自定义
        /// </summary>
        public Color color_6;


        public Theme_Color()
        {
            color_1 = (Color)ColorConverter.ConvertFromString("#F7F9FC");
        }
    }
}
