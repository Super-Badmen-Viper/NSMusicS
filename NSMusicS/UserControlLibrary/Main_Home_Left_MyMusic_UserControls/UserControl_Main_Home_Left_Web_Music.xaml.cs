using NSMusicS.Models.Servies_For_API_Info;
using NSMusicS.Models.Song_Audio_Out;
using NSMusicS.Models.Song_Extract_Infos;
using NSMusicS.Models.Song_List_Infos;
using NSMusicS.Services.Services_For_API_GetResult;
using NSMusicS.UserControlLibrary.Main_Home_Right_MyMusic_UserControls;
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

namespace NSMusicS.UserControlLibrary.Main_Home_Left_MyMusic_UserControls
{
    /// <summary>
    /// UserControl_Main_Home_Left_Web_Music.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Main_Home_Left_Web_Music : UserControl
    {
        public UserControl_Main_Home_Left_Web_Music()
        {
            InitializeComponent();

            viewModule_Search_Song_For_Cloud_Music = ViewModule_Search_Song_For_Cloud_Music.Retuen_This();
            this.DataContext = viewModule_Search_Song_For_Cloud_Music;

            //绑定搜索 数据源
            ListView_Show_SongList_Info.ItemsSource = viewModule_Search_Song_For_Cloud_Music.ShowSelect_Search_Songs;

            //绑定 音质信息 数据源 数据Change事件
            viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos.CollectionChanged += Song_MaxBrLevel_Infos_CollectionChanged;
            //绑定 MV信息   数据源 数据Change事件
            viewModule_Search_Song_For_Cloud_Music.Song_MV_Infos.CollectionChanged += Song_MV_Infos_CollectionChanged;

            TextBox_Web_API.Text = "";
        }


        public ViewModule_Search_Song_For_Cloud_Music viewModule_Search_Song_For_Cloud_Music;
        /// <summary>
        /// 是否启用Show列表 点击事件
        /// 0：歌曲
        /// 1：歌手
        /// 2：专辑
        /// </summary>
        public int ListView_Show_SongList_Info_Click_Mode;

        /// <summary>
        /// 搜索框Enter事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void TextBox_Serach_KeyDown(object sender, KeyEventArgs e)
        {
            Begin_Search();

            //显示操作面板
            GridViewColumn_SongTake.Width = 160;

            //
            ListView_Show_SongList_Info_Click_Mode = 0;
        }
        public void Begin_Search()
        {
            if (TextBox_Web_API.Text.Length > 0 && TextBox_Serach.Text.Length > 0)
            {
                Json_Search_Song.SearchText = TextBox_Serach.Text;
                viewModule_Search_Song_For_Cloud_Music.Api_client = TextBox_Web_API.Text;

                //执行搜索
                viewModule_Search_Song_For_Cloud_Music.RefCommand_Search_Song.Execute(null);

                //关闭下载面板
                viewModule_Search_Song_For_Cloud_Music.Show_API_HttpClient_ALL_BrLevel_Infos_Complete = Visibility.Collapsed;
            }
        }

        public Show_Search_Song Slect_Song_Info;

        /// <summary>
        /// 播放选中的web音乐
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Play_This_Song_Click(object sender, RoutedEventArgs e)
        {
            if (ListView_Show_SongList_Info_Click_Mode == 0)
            {
                Button button = sender as Button;
                if (button != null)
                {
                    ListViewItem listViewItem = FindVisualParent<ListViewItem>(button);
                    if (listViewItem != null)
                    {
                        int rowIndex = ListView_Show_SongList_Info.ItemContainerGenerator.IndexFromContainer(listViewItem);
                        ListView_Show_SongList_Info.SelectedIndex = rowIndex;
                    }
                    listViewItem = null;
                }

                MouseButtonEventArgs args = new MouseButtonEventArgs(Mouse.PrimaryDevice, 0, MouseButton.Left);
                args.RoutedEvent = UIElement.MouseRightButtonDownEvent;
                ListView_Show_SongList_Info.RaiseEvent(args);

                //关闭下载面板
                viewModule_Search_Song_For_Cloud_Music.Show_API_HttpClient_ALL_BrLevel_Infos_Complete = Visibility.Collapsed;
            }
        }
        private static T FindVisualParent<T>(DependencyObject obj) where T : DependencyObject
        {
            while (obj != null)
            {
                if (obj is T)
                {
                    return (T)obj;
                }
                obj = VisualTreeHelper.GetParent(obj);
            }
            return null;
        }
        /// <summary>
        /// 下载选中的文件信息
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Change_DownLoad_Song_SaveFile_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos != null &&
                viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos.Count > 0
                )
            {
                //音质选择
                Song_MaxBrLevel_Info song_MaxBrLevel_Info = null;
                //MV资源 选择
                Song_MV_Info song_MV_Info = null;
                //
                if (RadioButton_BrLevel_standard.IsChecked == true)
                {
                    song_MaxBrLevel_Info = viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[0];
                }
                else if (RadioButton_BrLevel_higher.IsChecked == true)
                {
                    song_MaxBrLevel_Info = viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[1];
                }
                else if (RadioButton_BrLevel_exhigh.IsChecked == true)
                {
                    song_MaxBrLevel_Info = viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[2];
                }
                else if (RadioButton_BrLevel_lossless.IsChecked == true)
                {
                    song_MaxBrLevel_Info = viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[3];
                }
                else if (RadioButton_BrLevel_hires.IsChecked == true)
                {
                    song_MaxBrLevel_Info = viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[4];
                }
                else if (RadioButton_BrLevel_jyeffect.IsChecked == true)
                {
                    song_MaxBrLevel_Info = viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[5];
                }
                else if (RadioButton_BrLevel_sky.IsChecked == true)
                {
                    song_MaxBrLevel_Info = viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[6];
                }
                else if (RadioButton_BrLevel_jymaster.IsChecked == true)
                {
                    song_MaxBrLevel_Info = viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[7];
                }
                else if (RadioButton_MV_DownLoad.IsChecked == true)
                {
                    if (viewModule_Search_Song_For_Cloud_Music.Song_MV_Infos != null 
                        && viewModule_Search_Song_For_Cloud_Music.Song_MV_Infos.Count > 0
                        )
                    {
                        song_MV_Info = viewModule_Search_Song_For_Cloud_Music.Song_MV_Infos[0];
                    }
                }
                //
                bool bool_Image = false;
                bool bool_lyic = false;
                if (RadioButton_AlbumImage_SaveThisSOng.IsChecked == true)
                {
                    bool_Image = true;
                }
                if (RadioButton_LyicText_SaveThisSOng.IsChecked == true)
                {
                    bool_lyic = true;
                }

                Cloud_Music_DownLoad cloud_Music_DownLoad = new Cloud_Music_DownLoad();
                if (song_MaxBrLevel_Info != null)
                {
                    //下载并添加至歌单
                    cloud_Music_DownLoad.DownLoad_Song_For_Song_MaxBrLevel_Info(song_MaxBrLevel_Info, bool_Image, bool_lyic);
                }
                else if(song_MV_Info != null)
                {
                    cloud_Music_DownLoad.DownLoad_Song_For_Song_MV_Info(song_MV_Info);
                }

                song_MaxBrLevel_Info = null; song_MV_Info = null; cloud_Music_DownLoad = null;
            }

            //隐藏下载信息面板
            viewModule_Search_Song_For_Cloud_Music.Show_API_HttpClient_ALL_BrLevel_Infos_Complete = Visibility.Collapsed;
        }
        /// <summary>
        /// 显示下载信息面板
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_DownLoad_This_Song_Click(object sender, RoutedEventArgs e)
        {
            Clear_ALL_RadioButton_BrLevel_Check();

            //加载动画
            viewModule_Search_Song_For_Cloud_Music.Show_API_HttpClient_Complete = Visibility.Visible;
            //
            viewModule_Search_Song_For_Cloud_Music.Show_API_HttpClient_ALL_BrLevel_Infos_Complete = Visibility.Collapsed;

            //找到该Item项
            Button button = sender as Button;
            if (button != null)
            {
                ListViewItem listViewItem = FindVisualParent<ListViewItem>(button);
                if (listViewItem != null)
                {
                    int rowIndex = ListView_Show_SongList_Info.ItemContainerGenerator.IndexFromContainer(listViewItem);
                    ListView_Show_SongList_Info.SelectedIndex = rowIndex;
                }
                listViewItem = null;
            }
            //确立该Item项属性
            Show_Search_Song Slect_Song_Info = (Show_Search_Song)ListView_Show_SongList_Info.SelectedItem;
            if (Slect_Song_Info != null)
            {
                if (ListView_Show_SongList_Info.SelectedIndex > -1 &&
                    ListView_Show_SongList_Info.SelectedIndex < viewModule_Search_Song_For_Cloud_Music.ShowSelect_Search_Songs.Count
                    )
                {
                    Json_Search_Song.Song_id = Slect_Song_Info.Song_id;
                    //
                    Json_Search_Song.Song_Name = Slect_Song_Info.Song_Name;
                    Json_Search_Song.Singer_Name = Slect_Song_Info.Singer_Name;
                    Json_Search_Song.Album_Name = Slect_Song_Info.Album_Name;

                    TextBlock_This_SongName.Text = Json_Search_Song.Singer_Name + " - " + Json_Search_Song.Song_Name;

                    //获取各音质信息
                    viewModule_Search_Song_For_Cloud_Music.RefCommand_Get_Song_Info.Execute(null);
                }
            }
        }
        
        /// <summary>
        /// 该歌曲音质信息Change事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        /// <exception cref="NotImplementedException"></exception>
        private void Song_MaxBrLevel_Infos_CollectionChanged(object? sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            if (viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos != null)
            {
                int i = viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos.Count - 1;
                if (i > -1)
                {
                    if (viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[i].Song_MaxBrLevel.Equals("standard"))
                    {
                        RadioButton_BrLevel_standard.Content = "标准 (" + viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[i].Song_BrLevel_File_Size + "M)";
                        RadioButton_BrLevel_standard.IsEnabled = true;
                    }
                    else if (viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[i].Song_MaxBrLevel.Equals("higher"))
                    {
                        RadioButton_BrLevel_higher.Content = "较高 (" + viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[i].Song_BrLevel_File_Size + "M)";
                        RadioButton_BrLevel_higher.IsEnabled = true;
                    }
                    else if (viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[i].Song_MaxBrLevel.Equals("exhigh"))
                    {
                        RadioButton_BrLevel_exhigh.Content = "极高 (" + viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[i].Song_BrLevel_File_Size + "M)";
                        RadioButton_BrLevel_exhigh.IsEnabled = true;
                    }
                    else if (viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[i].Song_MaxBrLevel.Equals("lossless"))
                    {
                        RadioButton_BrLevel_lossless.Content = "无损 (" + viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[i].Song_BrLevel_File_Size + "M)";
                        RadioButton_BrLevel_lossless.IsEnabled = true;
                    }
                    else if (viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[i].Song_MaxBrLevel.Equals("hires"))
                    {
                        RadioButton_BrLevel_hires.Content = "Hi-Res (" + viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[i].Song_BrLevel_File_Size + "M)";
                        RadioButton_BrLevel_hires.IsEnabled = true;
                    }
                    else if (viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[i].Song_MaxBrLevel.Equals("jyeffect"))
                    {
                        RadioButton_BrLevel_jyeffect.Content = "高清环绕声 (" + viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[i].Song_BrLevel_File_Size + "M)";
                        RadioButton_BrLevel_jyeffect.IsEnabled = true;
                    }
                    else if (viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[i].Song_MaxBrLevel.Equals("sky"))
                    {
                        RadioButton_BrLevel_sky.Content = "沉浸环绕声 (" + viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[i].Song_BrLevel_File_Size + "M)";
                        RadioButton_BrLevel_sky.IsEnabled = true;
                    }
                    else if (viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[i].Song_MaxBrLevel.Equals("jymaster"))
                    {
                        RadioButton_BrLevel_jymaster.Content = "超清母带 (" + viewModule_Search_Song_For_Cloud_Music.Song_MaxBrLevel_Infos[i].Song_BrLevel_File_Size + "M)";
                        RadioButton_BrLevel_jymaster.IsEnabled = true;
                    }
                }
            }
        }
        /// <summary>
        /// 该歌曲 MV信息 Change事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        /// <exception cref="NotImplementedException"></exception>
        private void Song_MV_Infos_CollectionChanged(object? sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            RadioButton_BrLevel_standard.Visibility = Visibility.Visible;
            RadioButton_BrLevel_standard.Width = 200;
            RadioButton_BrLevel_higher.Visibility = Visibility.Visible;
            RadioButton_BrLevel_higher.Width = 200;
            RadioButton_BrLevel_exhigh.Visibility = Visibility.Visible;
            RadioButton_BrLevel_exhigh.Width = 200;
            RadioButton_BrLevel_lossless.Visibility = Visibility.Visible;
            RadioButton_BrLevel_lossless.Width = 200;
            RadioButton_BrLevel_hires.Visibility = Visibility.Visible;
            RadioButton_BrLevel_hires.Width = 200;
            RadioButton_BrLevel_jyeffect.Visibility = Visibility.Visible;
            RadioButton_BrLevel_jyeffect.Width = 200;
            RadioButton_BrLevel_sky.Visibility = Visibility.Visible;
            RadioButton_BrLevel_sky.Width = 200;
            RadioButton_BrLevel_jymaster.Visibility = Visibility.Visible;
            RadioButton_BrLevel_jymaster.Width = 200;

            RadioButton_MV_DownLoad.Content = "MV下载";
            RadioButton_MV_DownLoad.Visibility = Visibility.Visible;
            RadioButton_MV_DownLoad.Width = 400;
            RadioButton_MV_DownLoad.IsEnabled = false;

            RadioButton_AlbumImage_SaveThisSOng.Content = "专辑嵌入";
            RadioButton_AlbumImage_SaveThisSOng.Visibility = Visibility.Visible;
            RadioButton_AlbumImage_SaveThisSOng.Width = 400;

            RadioButton_LyicText_SaveThisSOng.Content = "歌词嵌入";
            RadioButton_LyicText_SaveThisSOng.Visibility = Visibility.Visible;
            RadioButton_LyicText_SaveThisSOng.Width = 400;

            if (viewModule_Search_Song_For_Cloud_Music.Song_MV_Infos != null &&
                viewModule_Search_Song_For_Cloud_Music.Song_MV_Infos.Count > 0
                )
            {
                RadioButton_MV_DownLoad.Content = "MV下载 (" + viewModule_Search_Song_For_Cloud_Music.Song_MV_Infos[0].MV_FileSize + "M)";
                RadioButton_MV_DownLoad.Visibility = Visibility.Visible;
                RadioButton_MV_DownLoad.Width = 400;
                RadioButton_MV_DownLoad.IsEnabled = true;
            }
        }

        /// <summary>
        /// API字段
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void TextBox_Web_API_TextChanged(object sender, TextChangedEventArgs e)
        {
            viewModule_Search_Song_For_Cloud_Music.Api_client = TextBox_Web_API.Text;
        }

        /// <summary>
        /// 选中初始化
        /// </summary>
        public void Clear_ALL_RadioButton_BrLevel_Check()
        {
            RadioButton_BrLevel_standard.IsChecked = false;
            RadioButton_BrLevel_higher.IsChecked = false;
            RadioButton_BrLevel_exhigh.IsChecked = false;
            RadioButton_BrLevel_lossless.IsChecked = false;
            RadioButton_BrLevel_hires.IsChecked = false;
            RadioButton_BrLevel_jyeffect.IsChecked = false;
            RadioButton_BrLevel_sky.IsChecked = false;
            RadioButton_BrLevel_jymaster.IsChecked = false;
            //
            RadioButton_MV_DownLoad.IsChecked = false;
            //默认嵌入 专辑封面和歌词
            RadioButton_AlbumImage_SaveThisSOng.IsChecked = true;
            RadioButton_LyicText_SaveThisSOng.IsChecked = true;

            RadioButton_BrLevel_standard.IsEnabled = false;
            RadioButton_BrLevel_higher.IsEnabled = false;
            RadioButton_BrLevel_exhigh.IsEnabled = false;
            RadioButton_BrLevel_lossless.IsEnabled = false;
            RadioButton_BrLevel_hires.IsEnabled = false;
            RadioButton_BrLevel_jyeffect.IsEnabled = false;
            RadioButton_BrLevel_sky.IsEnabled = false;
            RadioButton_BrLevel_jymaster.IsEnabled = false;
            //
            RadioButton_MV_DownLoad.IsEnabled = false;
            //默认嵌入 专辑封面和歌词
            RadioButton_AlbumImage_SaveThisSOng.IsEnabled = true;
            RadioButton_LyicText_SaveThisSOng.IsEnabled = true;

            RadioButton_BrLevel_standard.Visibility = Visibility.Collapsed;
            RadioButton_BrLevel_higher.Visibility = Visibility.Collapsed;
            RadioButton_BrLevel_exhigh.Visibility = Visibility.Collapsed;
            RadioButton_BrLevel_lossless.Visibility = Visibility.Collapsed;
            RadioButton_BrLevel_hires.Visibility = Visibility.Collapsed;
            RadioButton_BrLevel_jyeffect.Visibility = Visibility.Collapsed;
            RadioButton_BrLevel_sky.Visibility = Visibility.Collapsed;
            RadioButton_BrLevel_jymaster.Visibility = Visibility.Collapsed;
            //
            RadioButton_MV_DownLoad.Visibility = Visibility.Collapsed;
            RadioButton_AlbumImage_SaveThisSOng.Visibility = Visibility.Collapsed;
            RadioButton_LyicText_SaveThisSOng.Visibility = Visibility.Collapsed;

            RadioButton_BrLevel_standard.Content = "标准";
            RadioButton_BrLevel_higher.Content = "较高";
            RadioButton_BrLevel_exhigh.Content = "极高";
            RadioButton_BrLevel_lossless.Content = "无损";
            RadioButton_BrLevel_hires.Content = "Hi-Res";
            RadioButton_BrLevel_jyeffect.Content = "高清环绕声";
            RadioButton_BrLevel_sky.Content = "沉浸环绕声";
            RadioButton_BrLevel_jymaster.Content = "超清母带";
            //
            RadioButton_MV_DownLoad.Content = "MV下载";
            RadioButton_AlbumImage_SaveThisSOng.Content = "专辑嵌入";
            RadioButton_LyicText_SaveThisSOng.Content = "歌词嵌入";

            RadioButton_BrLevel_standard.Width = 0;
            RadioButton_BrLevel_higher.Width = 0;
            RadioButton_BrLevel_exhigh.Width = 0;
            RadioButton_BrLevel_lossless.Width = 0;
            RadioButton_BrLevel_hires.Width = 0;
            RadioButton_BrLevel_jyeffect.Width = 0;
            RadioButton_BrLevel_sky.Width = 0;
            RadioButton_BrLevel_jymaster.Width = 0;
            //
            RadioButton_MV_DownLoad.Width = 0;
            RadioButton_AlbumImage_SaveThisSOng.Width = 0;
            RadioButton_LyicText_SaveThisSOng.Width = 0;
        }

        /// <summary>
        /// 关闭下载面板
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void UserControl_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            viewModule_Search_Song_For_Cloud_Music.Show_API_HttpClient_ALL_BrLevel_Infos_Complete = Visibility.Collapsed;
        }

        /// <summary>
        /// 下载界面显示
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Check_DownLoad_Panel_Click(object sender, RoutedEventArgs e)
        {
            if (ListView_Grid_DownLoad_Panel.Visibility == Visibility.Visible)
            {
                ListView_Show_SongList_Info.Visibility = Visibility.Visible;
                ListView_Grid_DownLoad_Panel.Visibility = Visibility.Collapsed;
                Button_Check_DownLoad_Panel.Content = "打开下载界面";
            }
            else
            {
                ListView_Show_SongList_Info.Visibility = Visibility.Collapsed;
                ListView_Grid_DownLoad_Panel.Visibility = Visibility.Visible;
                Button_Check_DownLoad_Panel.Content = "关闭下载界面";
            }
        }


        /// <summary>
        /// 搜索歌曲
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Search_Song_Click(object sender, RoutedEventArgs e)
        {
            if (TextBox_Serach.Text.Length > 0 && TextBox_Serach.Text.ToString().IndexOf("&type=") < 0)
            {
                //TextBox_Serach.Text = TextBox_Serach.Text + "&type=1";
                Begin_Search();
                //TextBox_Serach.Text = TextBox_Serach.Text.ToString().Substring(0, TextBox_Serach.Text.ToString().IndexOf("&type="));
            }

            //显示操作面板
            GridViewColumn_SongTake.Width = 160;

            //
            ListView_Show_SongList_Info_Click_Mode = 0;
        }
        /// <summary>
        /// 搜索歌手
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Search_Singer_Click(object sender, RoutedEventArgs e)
        {
            if (TextBox_Serach.Text.Length > 0 && TextBox_Serach.Text.ToString().IndexOf("&type=") < 0)
            {
                TextBox_Serach.Text = TextBox_Serach.Text + "&type=100";
                Begin_Search();
                TextBox_Serach.Text = TextBox_Serach.Text.ToString().Substring(0, TextBox_Serach.Text.ToString().IndexOf("&type="));
            }

            //显示操作面板
            GridViewColumn_SongTake.Width = 0;

            //
            ListView_Show_SongList_Info_Click_Mode = 1;
        }
        /// <summary>
        /// 搜索专辑
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Search_Album_Click(object sender, RoutedEventArgs e)
        {
            if (TextBox_Serach.Text.Length > 0 && TextBox_Serach.Text.ToString().IndexOf("&type=") < 0)
            {
                TextBox_Serach.Text = TextBox_Serach.Text + "&type=10";
                Begin_Search();
                TextBox_Serach.Text = TextBox_Serach.Text.ToString().Substring(0, TextBox_Serach.Text.ToString().IndexOf("&type="));
            }

            //显示操作面板
            GridViewColumn_SongTake.Width = 0;

            //
            ListView_Show_SongList_Info_Click_Mode = 2;
        }

        
    }
}
