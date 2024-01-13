using NSMusicS.Services.Services_For_API_GetResult;
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
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main
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

            Bool_Album_Storyboard = true;
            Bool_Player_Model = 0;
        }
        ViewModule_Search_Song viewModule_Search_Song;

        /// <summary>
        /// 专辑CD控件
        /// </summary>
        public bool Bool_Album_Storyboard;
        /// <summary>
        /// 播放器样式
        /// 0：有CD控件
        /// 1：无CD控件，歌词靠左
        /// </summary>
        public int Bool_Player_Model;
    }
}
