using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using static MoZhiMusic_Ultimate.ViewModels.Init_Animations_Info.Text_Animations;

namespace MoZhiMusic_Ultimate.Views.Home_Page.Home_Buttombar_Panel.UserControls
{
    /// <summary>
    /// Panel_Media_Navigation_Normal.xaml 的交互逻辑
    /// </summary>
    public partial class Panel_Media_Navigation_Normal : UserControl
    {
        public Panel_Media_Navigation_Normal()
        {
            InitializeComponent();
        }
        
        /// <summary>
        /// 当文本超出显示，则开启字幕滚动动画
        /// Stack与TextBox宽度需要设置内超出宽度  ，以便滚动动画时文本不被Canvas遮住
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        [Obsolete]
        private void Song_Name_DataContextChanged(object sender, TextChangedEventArgs e)
        {
            if (StoryBorad_Song_Name != null)
            {
                Text_Animations_Direction_Horizontal text_Animations = new Text_Animations_Direction_Horizontal();
                var temp = text_Animations.IsTextTrimmed(Song_Name, Canvas_Song_Name, LinearDoubleKeyFrame_Text_Direction_Left, LinearDoubleKeyFrame_Text_Direction_Right);
                if (temp.Item1 == true)
                {
                    Canvas_Song_Name = temp.Item2;
                    LinearDoubleKeyFrame_Text_Direction_Left = temp.Item3;
                    LinearDoubleKeyFrame_Text_Direction_Right = temp.Item4;
                    StoryBorad_Song_Name.Begin();
                }
                else
                    StoryBorad_Song_Name.Stop();
            }
        }

        
    }
}
