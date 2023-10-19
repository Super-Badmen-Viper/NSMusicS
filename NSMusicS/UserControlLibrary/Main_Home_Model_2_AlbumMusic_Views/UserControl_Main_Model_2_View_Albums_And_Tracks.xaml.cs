using NSMusicS.Services.Services_For_API_GetResult;
using NSMusicS.UserControlLibrary.MusicPlayer_Main;
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

namespace NSMusicS.UserControlLibrary.Main_Home_Model_2_AlbumMusic_Views
{
    /// <summary>
    /// UserControl_Main_Model_2_View_Albums_And_Tracks.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Main_Model_2_View_Albums_And_Tracks : UserControl
    {
        public UserControl_Main_Model_2_View_Albums_And_Tracks()
        {
            InitializeComponent();

            viewModule_Search_Song = ViewModule_Search_Song.Retuen_This();

            Loading_LottieAnimationView.IsPlaying = false;
        }
        ViewModule_Search_Song viewModule_Search_Song;



    }
}
