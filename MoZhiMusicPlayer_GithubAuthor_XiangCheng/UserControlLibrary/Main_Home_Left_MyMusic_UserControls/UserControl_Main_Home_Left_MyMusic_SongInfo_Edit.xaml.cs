using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_List_Infos;
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
    /// UserControl_Main_Home_Left_MyMusic_SongInfo_Edit.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Main_Home_Left_MyMusic_SongInfo_Edit : UserControl
    {
        public UserControl_Main_Home_Left_MyMusic_SongInfo_Edit()
        {
            InitializeComponent();
        }

        public string Search_Song_Name = "";
        public string Search_this_SongUrl = "";

        public string Edit_Song_Name = "";
        public string Edit_Singer_Name = "";
        public string Edit_Album_Name = "";

        private void TextBox_Search_Song_Name_TextChanged(object sender, TextChangedEventArgs e)
        {
            Search_Song_Name = TextBox_Search_Song_Name.Text;
        }
        private void ComBox_Show_Search_Song_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if(ComBox_Show_Search_Song.SelectedIndex > -1)
                Search_this_SongUrl = ComBox_Show_Search_Song.SelectedItem.ToString().Substring(
                    ComBox_Show_Search_Song.SelectedItem.ToString().LastIndexOf("_Url:") + 5
                    );      
        }

        private void TextBox_Edit_Song_Name_TextChanged(object sender, TextChangedEventArgs e)
        {
            Edit_Song_Name = TextBox_Edit_Song_Name.Text;
        }
        private void TextBox_Edit_Singer_Name_TextChanged(object sender, TextChangedEventArgs e)
        {
            Edit_Singer_Name = TextBox_Edit_Singer_Name.Text;
        }
        private void TextBox_Edit_Album_Name_TextChanged(object sender, TextChangedEventArgs e)
        {
            Edit_Album_Name = TextBox_Edit_Album_Name.Text;
        }


        private void ListBox_Singer_Image_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {

        }
        private void ListBox_Album_Image_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {

        }
        private void ListBox_Mrc_Image_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {

        }
        private void ListBox_Crc_Image_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {

        }
    }
}
