using NSMusicS.Models.Servies_For_API_Info;
using NSMusicS.Services.Services_For_API_GetResult;
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

namespace NSMusicS.UserControlLibrary.Main_Home_Left_OnlineMusic_UserControls
{
    /// <summary>
    /// UserControl_Main_Home_Left_OnlineMusic_Search_Song.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Main_Home_Left_OnlineMusic_Search_Song : UserControl
    {
        public UserControl_Main_Home_Left_OnlineMusic_Search_Song()
        {
            InitializeComponent();

            viewModule_Search_Song = ViewModule_Search_Song.Retuen_This();
            this.DataContext = ViewModule_Search_Song.Retuen_This();
        }
        ViewModule_Search_Song viewModule_Search_Song;
        public string Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";


        private void TbxInput_TextChanged(object sender, TextChangedEventArgs e)
        {
            string json_Search_Song = Json_Search_Song.Retuen_This_SearchText();
            json_Search_Song = TbxInput_Search.Text;
            Json_Search_Song.SearchText = json_Search_Song;

            viewModule_Search_Song = ViewModule_Search_Song.Retuen_This();
            viewModule_Search_Song.ShowSelect_Search_Songs.Clear();
            //viewModule_Search_Song.ShowSelect_Search_Songs_ALL.Clear();
            viewModule_Search_Song.Show_API_HttpClient_Complete = Visibility.Collapsed;
        }
        private void TbxInput_Page_TextChanged(object sender, TextChangedEventArgs e)
        {
            /*string page_num = Json_Search_Song.Retuen_This_SearchPageNum();
            page_num = TbxInput_Page.Text;
            Json_Search_Song.SearchPageNum = page_num;

            viewModule_Search_Song = ViewModule_Search_Song.Retuen_This();
            viewModule_Search_Song.ShowSelect_Search_Songs.Clear();
            viewModule_Search_Song.Show_API_HttpClient_Complete = Visibility.Collapsed;*/
        }

        /// <summary>
        /// 记下被选择的歌曲的信息
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ListView_Download_SongList_Info_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            Show_Search_Song temp = (Show_Search_Song)ListView_Download_SongList_Info.SelectedItem;
            if (temp != null)
            {
                string temp_string = Json_Search_Song.Retuen_This_Search_Song_id();
                temp_string = temp.Song_id;
                Json_Search_Song.Song_id = temp_string;

                temp_string = Json_Search_Song.Retuen_This_Search_Singer_id();
                temp_string = temp.Singer_id;
                Json_Search_Song.Singer_id = temp_string;

                temp_string = Json_Search_Song.Retuen_This_Search_MV_id();
                temp_string = temp.MV_id;
                Json_Search_Song.MV_id = temp_string;

                temp_string = Json_Search_Song.Retuen_This_Search_Album_id();
                temp_string = temp.Album_id;
                Json_Search_Song.Album_id = temp_string;

                temp_string = Json_Search_Song.Song_File;
                temp_string = Path_App + @"\Music\" + temp.Singer_Name + " - " + temp.Song_Name + ".mp3";
                Json_Search_Song.Song_File = temp_string;

                Json_Search_Song.Song_Name = temp.Song_Name;
                Json_Search_Song.Singer_Name = temp.Singer_Name;
                Json_Search_Song.Album_Name = temp.Album_Name;
            }
        }
        private void OnListViewItemDoubleClick(object sender, MouseButtonEventArgs e)
        {
            var vm = viewModule_Search_Song;

            vm.RefCommand_Get_Song_Info_Url.Execute(null);
        }

        private void Love_ListView_Song_Click(object sender, RoutedEventArgs e)
        {

        }

        private void Download_This_Song_Click(object sender, RoutedEventArgs e)
        {

        }

        
    }
}
