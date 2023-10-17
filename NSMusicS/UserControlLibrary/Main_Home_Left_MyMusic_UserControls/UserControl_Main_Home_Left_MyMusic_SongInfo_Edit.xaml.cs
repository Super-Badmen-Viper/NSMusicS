using NSMusicS.Models.Song_Extract_Infos;
using NSMusicS.Models.Song_List_Infos;
using Shell32;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
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

namespace NSMusicS.UserControlLibrary.Main_Home_Left_MyMusic_UserControls
{
    /// <summary>
    /// UserControl_Main_Home_Left_MyMusic_SongInfo_Edit.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Main_Home_Left_MyMusic_SongInfo_Edit : UserControl
    {
        public UserControl_Main_Home_Left_MyMusic_SongInfo_Edit()
        {
            InitializeComponent();

            Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";
        }
        public string Path_App;

        public string Search_Song_Name = "";
        public string Search_this_SongUrl = "";

        public string Edit_Song_Name = "";
        public string Edit_Singer_Name = "";
        public string Edit_Album_Name = "";

        Song_Info song_info = new Song_Info();
        ShellClass sh = new ShellClass();
        Regex regex;
        Match match;
        Folder Folderdir;
        FolderItem FolderItemitem;

        private void TextBox_Search_Song_Name_TextChanged(object sender, TextChangedEventArgs e)
        {
            Search_Song_Name = TextBox_Search_Song_Name.Text;
        }
        private async void ComBox_Show_Search_Song_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (ComBox_Show_Search_Song.SelectedIndex > -1)
            {
                Search_this_SongUrl = ComBox_Show_Search_Song.SelectedItem.ToString().Substring(
                    ComBox_Show_Search_Song.SelectedItem.ToString().LastIndexOf("_Url:") + 5
                    );

                //TextBox_Edit_Song_Name.Text = Search_this_SongUrl.

                regex = new Regex(@"^(.*?)(?:\s+-\s+(.*))?\.(?:mp3|flac|wav)$");

                if (!string.IsNullOrWhiteSpace(Search_this_SongUrl))
                {
                    string fileName = System.IO.Path.GetFileName(Search_this_SongUrl);
                    match = regex.Match(fileName);              

                    if (match.Success && match.Groups.Count >= 3)
                    {
                        string singerName = match.Groups[1].Value.Trim();
                        string songName = match.Groups[2].Value.Trim();

                        Folderdir = sh.NameSpace(System.IO.Path.GetDirectoryName(Search_this_SongUrl));
                        FolderItemitem = Folderdir.ParseName(System.IO.Path.GetFileName(Search_this_SongUrl));
                        string albumName = Folderdir.GetDetailsOf(FolderItemitem, 14);

                        song_info = new Song_Info();
                        if (songName.Length > 0)
                        {
                            song_info.Singer_Name = singerName;
                            song_info.Song_Name = songName;
                            song_info.Album_Name = albumName;

                            TextBox_Edit_Song_Name.Text = songName;
                            TextBox_Edit_Singer_Name.Text = singerName;
                            TextBox_Edit_Album_Name.Text = albumName;

                            Edit_Song_Name = TextBox_Edit_Song_Name.Text;
                            Edit_Singer_Name = TextBox_Edit_Singer_Name.Text;
                            Edit_Album_Name = TextBox_Edit_Album_Name.Text;

                            //则读取 音频文件 内嵌封面
                            BitmapImage bitmapImage = new BitmapImage();
                            bitmapImage = Song_Extract_Info.Extract_AlbumImage_Of_This_SongUrl(Search_this_SongUrl);

                            if (bitmapImage != null)
                            {
                                ImageBrush imageBrush = new ImageBrush();
                                imageBrush.ImageSource = bitmapImage;
                                imageBrush.Stretch = Stretch.UniformToFill;
                                Set_This_Song_AlbumImage.Background = imageBrush;
                                imageBrush = null;
                                bitmapImage = null;
                            }
                            else
                            {
                                Set_This_Song_AlbumImage.Background = new SolidColorBrush(Colors.White);
                            }

                            //获取内嵌歌词
                            Set_This_Song_Lyic.Text = Song_Extract_Info.Get_Lyic_Of_This_SongUrl(Search_this_SongUrl);
                        }
                    }
                }
            }
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


        private void OpenFolderInExplorer(string folderPath)
        {
            try
            {
                System.Diagnostics.Process.Start("explorer.exe", folderPath);
            }
            catch (Exception ex)
            {
                MessageBox.Show("无法打开文件夹：" + ex.Message);
            }
        }
        private void Button_Open_To_Singer_Resource_Click(object sender, RoutedEventArgs e)
        {
            string folderPath = Path_App + @"\Singer_Image\"; // 替换为您想要打开的文件夹路径
            OpenFolderInExplorer(folderPath);
        }

        private void Button_Open_To_Album_Resource_Click(object sender, RoutedEventArgs e)
        {
            string folderPath = Path_App + @"\Song_ALbum\"; // 替换为您想要打开的文件夹路径
            OpenFolderInExplorer(folderPath);
        }

        private void Button_Open_To_Mrc_Resource_Click(object sender, RoutedEventArgs e)
        {
            string folderPath = Path_App + @"\Mrc\"; // 替换为您想要打开的文件夹路径
            OpenFolderInExplorer(folderPath);
        }

        private void Button_Open_To_Crc_Resource_Click(object sender, RoutedEventArgs e)
        {
            string folderPath = Path_App + @"\Crc\"; // 替换为您想要打开的文件夹路径
            OpenFolderInExplorer(folderPath);
        }
    }
}
