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
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.MusicPlayer_Main
{
    /// <summary>
    /// MusicPlayer_Main_UserControl.xaml 的交互逻辑
    /// </summary>
    public partial class MusicPlayer_Main_UserControl : UserControl
    {
        public MusicPlayer_Main_UserControl()
        {
            InitializeComponent();

            /*TextBox_SongName.TextAlignment = TextAlignment.Center;
            TextBox_SingerName.TextAlignment = TextAlignment.Center;*/
            TextBox_SongAlbumName.TextAlignment = TextAlignment.Center;

            viewModule_Search_Song = ViewModule_Search_Song.Retuen_This();
            this.DataContext = ViewModule_Search_Song.Retuen_This();
        }
        ViewModule_Search_Song viewModule_Search_Song;
    }
}
