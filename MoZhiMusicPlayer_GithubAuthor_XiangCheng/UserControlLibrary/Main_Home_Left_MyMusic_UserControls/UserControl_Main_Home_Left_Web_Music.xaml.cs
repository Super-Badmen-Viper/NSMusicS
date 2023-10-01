using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Servies_For_API_Info;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_Audio_Out;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_List_Infos;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Services.Services_For_API_GetResult;
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

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.Main_Home_Left_MyMusic_UserControls
{
    /// <summary>
    /// UserControl_Main_Home_Left_Web_Music.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Main_Home_Left_Web_Music : UserControl
    {
        public UserControl_Main_Home_Left_Web_Music()
        {
            InitializeComponent();

            Grid_Right_SongItem_Menu.Visibility = Visibility.Collapsed;

            viewModule_Search_Song_For_Cloud_Music = ViewModule_Search_Song_For_Cloud_Music.Retuen_This();
            this.DataContext = viewModule_Search_Song_For_Cloud_Music;

            //绑定搜索数据源
            ListView_Download_SongList_Info.ItemsSource = viewModule_Search_Song_For_Cloud_Music.ShowSelect_Search_Songs;


        }

        public ViewModule_Search_Song_For_Cloud_Music viewModule_Search_Song_For_Cloud_Music;

        /// <summary>
        /// 搜索框Enter事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void TextBox_Serach_KeyDown(object sender, KeyEventArgs e)
        {
            if (TextBox_Serach.Text.Length > 0)
            {
                Json_Search_Song.SearchText = TextBox_Serach.Text;

                //执行搜索
                viewModule_Search_Song_For_Cloud_Music.RefCommand_Search_Song.Execute(null);
            }
        }

        public Show_Search_Song Slect_Song_Info;
        /// <summary>
        /// 双击播放选中的web音乐
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ListView_Download_SongList_Info_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            
        }
        private void Button_Play_This_Song_Click(object sender, RoutedEventArgs e)
        {
            /*Slect_Song_Info = (Show_Search_Song)ListView_Download_SongList_Info.SelectedItem;
            if (Slect_Song_Info != null)
            {
                if (ListView_Download_SongList_Info.SelectedIndex > -1 &&
                    ListView_Download_SongList_Info.SelectedIndex < viewModule_Search_Song_For_Cloud_Music.ShowSelect_Search_Songs.Count
                    )
                {
                    Json_Search_Song.Song_id = Slect_Song_Info.Song_id;
                    //
                    Json_Search_Song.Song_Name = Slect_Song_Info.Song_Name; ;
                    Json_Search_Song.Singer_Name = Slect_Song_Info.Singer_Name; ;
                    Json_Search_Song.Album_Name = Slect_Song_Info.Album_Name; ;

                    Grid_Right_SongItem_Menu.Visibility = Visibility.Collapsed;
                }
            }*/
        }

        /// <summary>
        /// 右键菜单此歌曲选项
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ListView_Download_SongList_Info_MouseRightButtonDown(object sender, MouseButtonEventArgs e)
        {
            Song_Info song_Info = (Song_Info)ListView_Download_SongList_Info.SelectedItem;
            if (song_Info != null)
            {
                //为菜单项重新绑定事件
                Grid_Right_SongItem_Menu.Visibility = Visibility.Visible;

            }
        }
        /// <summary>
        /// 下载此音乐
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_DownLoad_This_Song_Click(object sender, RoutedEventArgs e)
        {

        }

        

        
    }
}
