using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows.Media.Animation;
using System.Windows.Media;

namespace MoZhiMusic_Ultimate.ViewModels.Init_Animations_Info
{
    public class Text_Animations
    {
        /// <summary>
        /// 字符平移 
        /// </summary>
        public class Text_Animations_Direction_Horizontal
        {
            /// <summary>
            /// 文本框超出容器范围，则开启水平平移显示动画
            /// </summary>
            /// <param name="textBox">需要判断的文本框控件</param>
            /// <returns></returns>
            [Obsolete]
            public (Boolean, Canvas, LinearDoubleKeyFrame, LinearDoubleKeyFrame) IsTextTrimmed(
            TextBox textBox,
            Canvas canvas,
            LinearDoubleKeyFrame linearDoubleKeyFrame_Font_Direction_Left,
            LinearDoubleKeyFrame linearDoubleKeyFrame_Font_Direction_Right)
            {
                Typeface typeface = new Typeface(
                    textBox.FontFamily,
                    textBox.FontStyle,
                    textBox.FontWeight,
                    textBox.FontStretch);

                FormattedText formattedText = new FormattedText(
                    textBox.Text,
                    System.Threading.Thread.CurrentThread.CurrentCulture,
                    textBox.FlowDirection,
                    typeface,
                    textBox.FontSize,
                    textBox.Foreground);

                if (formattedText.Width > canvas.Width)
                    if (linearDoubleKeyFrame_Font_Direction_Left != null)
                    {
                        linearDoubleKeyFrame_Font_Direction_Left.Value = (formattedText.Width * -1) + 100;//+100是因为得到的文本长度通常>真正的文本长度
                        linearDoubleKeyFrame_Font_Direction_Right.Value = linearDoubleKeyFrame_Font_Direction_Right.Value;
                    }

                return (formattedText.Width > canvas.Width,
                    canvas, 
                    linearDoubleKeyFrame_Font_Direction_Left, 
                    linearDoubleKeyFrame_Font_Direction_Right);
            }
        }

            
    }
}
