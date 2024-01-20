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
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls_PlayMode_View
{
    /// <summary>
    /// UserControl_PlayMode_1_View_2_AlbumView.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_PlayMode_1_View_2_AlbumView : UserControl
    {
        public UserControl_PlayMode_1_View_2_AlbumView()
        {
            InitializeComponent();
            Image_Song_Storyboard = Resources["Image_Song_Animation"] as Storyboard;
            //Image_Song_Storyboard.Begin();

            //Border_Of_This_Album_Image_Of_Circle.Fill = new ImageBrush(new BitmapImage(new Uri("")));

            //Storyboard_Open_Album.Begin();

            //Storyboard_Close_Album = new Storyboard(Storyboard_Open_Album);
            //Storyboard_Close_Album_Box = Storyboard_Open_Album_Box;
        }

        /// <summary>
        /// 专辑动画启动 定时器
        /// </summary>
        public DispatcherTimer dispatcherTimer_Of_Album_Begin;
        public double Nums_Of_RotateTransform_Of_Album_Image_Angle;

        public Storyboard Image_Song_Storyboard;
        public Storyboard Storyboard_Close_Album;
        public Storyboard Storyboard_Close_Album_Box;
    }
}
