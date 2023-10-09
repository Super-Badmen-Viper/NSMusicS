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

namespace NSMusicS.Helper_UserControlLibrary
{
    /// <summary>
    /// UserControl_Image.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Image : UserControl
    {
        public UserControl_Image()
        {
            InitializeComponent();
        }

        string Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";

        /// <summary>
        /// StAckPanel背景色
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void This_Xaml_BackGround_MouseLeave(object sender, MouseEventArgs e)
        {
            //#A8343434
            StackPanel_Move_Black.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));//无色

            Image_Play_This_SongList.Visibility = System.Windows.Visibility.Collapsed;
        }
        private void This_Xaml_BackGround_MouseMove(object sender, MouseEventArgs e)
        {
            //#A8343434
            StackPanel_Move_Black.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#A8343434"));

            Image_Play_This_SongList.Visibility = System.Windows.Visibility.Visible;
        }


        string Song_Image_Url;
        /// <summary>
        /// 播放键背景色5
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      3
        private void This_Image_BackGround_MouseLeave(object sender, MouseEventArgs e)
        {
            Song_Image_Url = Path_App + @"\Button_Image_Ico\24gf-playCircle (1).png";
            //#A8343434
            Image_Play_This_SongList.Source = new BitmapImage(new Uri(Song_Image_Url));

            StackPanel_Move_Black.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));//无色

        }
        private void This_Image_BackGround_MouseMove(object sender, MouseEventArgs e)
        {
            Song_Image_Url = Path_App + @"\Button_Image_Ico\24gf-playCircle.png";
            //#A8343434
            Image_Play_This_SongList.Source = new BitmapImage(new Uri(Song_Image_Url));

            StackPanel_Move_Black.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#A8343434"));

            Image_Play_This_SongList.Visibility = System.Windows.Visibility.Visible;
        }
    }
}
