using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace 墨智音乐_3._0._1.UserControlLibrary.MusicPlayer_Main
{
    /// <summary>
    /// MusicPlayer_Main_UserControl.xaml 的交互逻辑
    /// </summary>
    public partial class MusicPlayer_Main_UserControl : UserControl
    {
        public MusicPlayer_Main_UserControl()
        {
            InitializeComponent();

            TextBox_SongName.TextAlignment = TextAlignment.Center;
            TextBox_SingerName.TextAlignment = TextAlignment.Center;
            TextBox_SongAlbumName.TextAlignment = TextAlignment.Center;

            Image_Song_Storyboard = Resources["Image_Song_Animation"] as Storyboard;

            ellipseGeometry = new EllipseGeometry();
            ellipseGeometry.RadiusX = 175;
            ellipseGeometry.RadiusY = 175;
            ellipseGeometry.Center = new Point(175,175);
        }

        public Storyboard Image_Song_Storyboard;
        public EllipseGeometry ellipseGeometry;
        public int model_Song_Album;
        private void Image_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            /*if(model_Song_Album == 0)//圆形图片框+旋转动画
            {
                Image_Song.Clip = ellipseGeometry;
                Image_Song_Storyboard.Begin();

                model_Song_Album = 1;
            }
            else if(model_Song_Album == 1)//图片消失
            {
                Image_Song_Storyboard.Stop();
                Image_Song.Clip = null;

                Panel_Image.Visibility = Visibility.Hidden;

                model_Song_Album = 2;
            }
            else//方形图片框
            {
                Panel_Image.Visibility = Visibility.Visible;
                
                model_Song_Album = 0;
            }*/
        }
    }
}
