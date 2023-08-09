using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Services.Services_For_API_GetResult;
using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.MainWindow_Buttom_MusicPlayer_UserControls
{
    /// <summary>
    /// UserControl_ButtonFrame_MusicPlayer.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_ButtonFrame_MusicPlayer : UserControl
    {
        public UserControl_ButtonFrame_MusicPlayer()
        {
            InitializeComponent();

            Border_Hover_BackGround.Visibility = Visibility.Collapsed;

            viewModule_Search_Song = ViewModule_Search_Song.Retuen_This();
            this.DataContext = ViewModule_Search_Song.Retuen_This();
        }
        ViewModule_Search_Song viewModule_Search_Song;


        public bool Bool_Player_Model;
        private void Border_Hover_BackGround_MouseEnter(object sender, MouseEventArgs e)
        {
            if(!Bool_Player_Model)
                Border_Hover_BackGround.Visibility = Visibility.Visible;
        }

        private void Border_Hover_BackGround_MouseLeave(object sender, MouseEventArgs e)
        {
            Border_Hover_BackGround.Visibility = Visibility.Collapsed;
            //Border_Song_Image.Opacity = 1;
        }

        bool Test_Length;
        /// <summary>
        /// 当文本超出显示，则开启字幕滚动动画
        ///     Stack与TextBox宽度需要设置内超出宽度  ，以便滚动动画时文本不被Canvas遮住
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Song_Name_DataContextChanged(object sender, TextChangedEventArgs e)
        {
            Test_Length = IsTextTrimmed(Song_Name);

            if (StoryBorad_Song_Name != null)
            {         
                if (Test_Length == true)
                    StoryBorad_Song_Name.Begin();
                else
                    StoryBorad_Song_Name.Stop();
            }
        }
        /// <summary>
        /// 判断文本框内容是否超出容器范围
        /// </summary>
        /// <param name="textBox">需要判断的文本框控件</param>
        /// <returns></returns>
        public bool IsTextTrimmed(TextBox textBox)
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

           //如果歌曲名的长度大于Canvas的长度，则可以开启线性X轴动画，以便预览被遮盖的部分歌曲名
            bool isTrimmed = formattedText.Width > Canvas_Song_Name.Width;//固定长度

            //设置文本字幕动画的滚动长度位置  为  文本总长度length
            if (isTrimmed)
            {
                if (StoryBorad_Song_Name != null)
                    if (LinearDoubleKeyFrame_Song_Name_Text_Length != null)
                    {
                        LinearDoubleKeyFrame_Song_Name_Text_Length.Value = (formattedText.Width * -1) + 150;//+100是因为得到的文本长度通常>真正的文本长度
                        LinearDoubleKeyFrame_Song_Name_Text_Length_other.Value = LinearDoubleKeyFrame_Song_Name_Text_Length.Value;
                        StoryBorad_Song_Name.Resume();
                    }
            }
            else
                if (StoryBorad_Song_Name != null)
                    StoryBorad_Song_Name.Pause();

            return isTrimmed;
        }
    }
}
