using NSMusicS.Models.Song_List_Infos;
using NSMusicS.Models.Song_List_Of_Album_SongList_Infos;
using NSMusicS.Services.Services_For_API_GetResult;
using NSMusicS.UserControlLibrary.Main_Home_Left_MyMusic_UserControls;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
using NSMusicS.Models.APP_DB_SqlLite.SS_Convert;
using NSMusicS.Models.APP_DB_SqlLite.Product;
using MaterialDesignThemes.Wpf.Transitions;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.MusicPlayer_Model_Control_Albums
{
    /// <summary>
    /// Assembly_Albums_And_Track.xaml 的交互逻辑
    /// </summary>
    public partial class Assembly_Albums_And_Track : UserControl
    {
        public Assembly_Albums_And_Track()
        {
            InitializeComponent();

            StackPanel_This_Album_Info.Visibility = Visibility.Collapsed;
            Model_Normal.Visibility = Visibility.Visible;

            viewModule_Search_Song = ViewModule_Search_Song.Retuen_This();
        }
        ViewModule_Search_Song viewModule_Search_Song;
        private ObservableCollection<Song_Info> songList_Infos_Current_Playlist;
        private ObservableCollection<ObservableCollection<Models.Song_List_Infos.SongList_Info>> songList_Infos;

        /// <summary>
        /// 标记此歌手
        /// </summary>
        public string Singer_Name;

        public Uri Uri_Album_Image;

        private void Model_View_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            /*Model_Normal.Visibility = Visibility.Visible;
            Model_View.Visibility = Visibility.Collapsed;*/
        }
        private void Model_View_MouseLeave(object sender, MouseEventArgs e)
        {
            /*Model_Normal.Visibility = Visibility.Collapsed;
            Model_View.Visibility = Visibility.Visible;*/
        }

        private void UserControl_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (StackPanel_This_Album_Info.Visibility == Visibility.Visible)
            {
                StackPanel_This_Album_Info.Visibility = Visibility.Collapsed;
                /*Model_Normal.Visibility = Visibility.Collapsed;
                Model_View.Visibility = Visibility.Visible;*/
            }
            else
                StackPanel_This_Album_Info.Visibility = Visibility.Visible;
        }

        private void StackPanel_This_Album_Info_MouseLeave(object sender, MouseEventArgs e)
        {
            StackPanel_This_Album_Info.Visibility = Visibility.Collapsed;
        }


        private void ListView_For_This_Album_ALL_Song_MouseLeave(object sender, MouseEventArgs e)
        {
            ListView_For_This_Album_ALL_Song.SelectedIndex = -1;
        }

        //覆盖原有的播放列表，为此单一专辑播放
        /// <summary>
        /// 添加此专辑到 专辑播放列表 All_Performer_ALL_AlbumCurrent_Playlist
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ListView_For_This_Album_ALL_Song_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            Album_SongList_Infos album_SongList_Infos = new Album_SongList_Infos();
            album_SongList_Infos.Album_Image = Uri_Album_Image;
            album_SongList_Infos.Album_Name = TextBlock_Album_Name.Text;
            album_SongList_Infos.album_SongList_Infos = (ObservableCollection<Assembly_Album_SongList_Item>)ListView_For_This_Album_ALL_Song.ItemsSource;

            This_Performer_ALL_AlbumSongList this_Performer_ALL = new This_Performer_ALL_AlbumSongList();
            this_Performer_ALL.Singer_Name = this.Singer_Name;
            this_Performer_ALL.Albums = new ObservableCollection<Album_SongList_Infos>();
            this_Performer_ALL.Albums.Add(album_SongList_Infos);

            viewModule_Search_Song.All_Performer_ALL_AlbumCurrent_Playlist = new ALL_Performer_ALL_AlbumSongList();
            viewModule_Search_Song.All_Performer_ALL_AlbumCurrent_Playlist.ALL_Performers = new ObservableCollection<This_Performer_ALL_AlbumSongList>();
            viewModule_Search_Song.All_Performer_ALL_AlbumCurrent_Playlist.ALL_Performers.Clear();
            viewModule_Search_Song.All_Performer_ALL_AlbumCurrent_Playlist.ALL_Performers.Add(this_Performer_ALL);

            viewModule_Search_Song.WMP_Song_Play_Ids = ListView_For_This_Album_ALL_Song.SelectedIndex;

            //覆盖 播放列表
            SongList_Info_Current_Playlists.Retuen_This().Album_To_Current_Playlist = 0;
        }


        public Uri brush_LoveEnter
            = new Uri(@"Resource\\Button_Image_Svg\\已收藏.svg", UriKind.Relative);
        public Uri brush_LoveNormal
            = new Uri(@"Resource\\Button_Image_Svg\\收藏.svg", UriKind.Relative);
        //已选中的歌曲信息
        public ArrayList Song_Info_Selects = new ArrayList();
        //
        public int ComBox_Select;
        //
        /// <summary>
        /// 添加到歌单（将此专辑内所有歌曲添加到其它歌单）
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (ComBox_Select_Add_SongList.SelectedIndex != -1)
            {
                //刷新内存区域的引用
                songList_Infos = SongList_Info.Retuen_This();

                ObservableCollection<Assembly_Album_SongList_Item> this_Album_ALL_Song = (ObservableCollection<Assembly_Album_SongList_Item>)ListView_For_This_Album_ALL_Song.ItemsSource;
                for (int i = 0; i < this_Album_ALL_Song.Count; i++)
                {
                    Song_Info newSongInfo = new Song_Info();
                    newSongInfo.Song_Name = this_Album_ALL_Song[i].Song_Name;
                    newSongInfo.Singer_Name = Singer_Name;
                    newSongInfo.Album_Name = this_Album_ALL_Song[i].Album_Name;
                    newSongInfo.Song_Url = this_Album_ALL_Song[i].Song_Url;
                    newSongInfo.Song_Duration = this_Album_ALL_Song[i].Song_Duration;
                    newSongInfo.Song_No = i + 1;
                    newSongInfo.Song_Like = 0;
                    newSongInfo.MV_Path = null;
                    newSongInfo.IsChecked = false;
                    newSongInfo.Song_Like_Image = brush_LoveNormal;
                    newSongInfo.Song_MV_Image = null;
                    newSongInfo.Bool_Playing = false;

                    //检查是否在我的收藏
                    for (int r = 0; r < songList_Infos[0][0].Songs.Count; r++)
                    {
                        if (newSongInfo.Song_Url.Equals(songList_Infos[0][0].Songs[r].Song_Url))
                            newSongInfo.Song_Like_Image = brush_LoveEnter;
                    }

                    Song_Info_Selects.Add(newSongInfo);
                }

                if (songList_Infos != null)
                {
                    if (songList_Infos.Count != 0)
                    {
                        if (Song_Info_Selects.Count > 0)
                        {
                            ComBox_Select = ComBox_Select_Add_SongList.SelectedIndex;
                            if (ComBox_Select == -1)
                            {
                                MessageBox.Show("ComBox_Select（下标）为-1，警告");
                            }
                            else if (ComBox_Select == 0)//本身若是我的收藏歌单，则屏蔽
                            {
                                if (songList_Infos[0][0] != null)
                                {
                                    if (songList_Infos[0][0].Songs != null)
                                    {
                                        for (int i = 0; i < Song_Info_Selects.Count; i++)
                                        {
                                            Song_Info temp = FindSongInfoBySongUrl(
                                                Convert.ToString(((Song_Info)Song_Info_Selects[i]).Song_Url),
                                                songList_Infos[0][0].Songs);
                                            if (temp == null)//如果没有重复的歌曲，则添加
                                            {
                                                ((Song_Info)Song_Info_Selects[i]).Song_Like = 1;
                                                ((Song_Info)Song_Info_Selects[i]).Song_Like_Image = brush_LoveEnter;

                                                Song_Info newSongInfo = new Song_Info();
                                                newSongInfo.Song_Name = ((Song_Info)Song_Info_Selects[i]).Song_Name;
                                                newSongInfo.Singer_Name = ((Song_Info)Song_Info_Selects[i]).Singer_Name;
                                                newSongInfo.Album_Name = ((Song_Info)Song_Info_Selects[i]).Album_Name;
                                                newSongInfo.Song_Url = ((Song_Info)Song_Info_Selects[i]).Song_Url;
                                                newSongInfo.Song_Duration = ((Song_Info)Song_Info_Selects[i]).Song_Duration;
                                                newSongInfo.Song_No = songList_Infos[0][0].Songs.Count + 1 + i;
                                                newSongInfo.Song_Like = ((Song_Info)Song_Info_Selects[i]).Song_Like;
                                                newSongInfo.MV_Path = ((Song_Info)Song_Info_Selects[i]).MV_Path;
                                                newSongInfo.IsChecked = ((Song_Info)Song_Info_Selects[i]).IsChecked;
                                                newSongInfo.Song_Like_Image = ((Song_Info)Song_Info_Selects[i]).Song_Like_Image;
                                                newSongInfo.Song_MV_Image = ((Song_Info)Song_Info_Selects[i]).Song_MV_Image;
                                                newSongInfo.Bool_Playing = ((Song_Info)Song_Info_Selects[i]).Bool_Playing;

                                                songList_Infos[0][0].Songs.Add(newSongInfo);
                                            }
                                        }
                                        //排序
                                        //songList_Infos[0][0].Songs = songList_Infos[0][0].Songs.OrderBy(s => s.Singer_Name + s.Song_Name).ToList();
                                        for (int i = 0; i < songList_Infos[0][0].Songs.Count; i++)
                                        {
                                            songList_Infos[0][0].Songs[i].Song_No = i + 1;
                                        }


                                        //清空被选中的信息：后端
                                        Song_Info_Selects.Clear();
                                    }
                                }
                            }
                            else if (ComBox_Select == 1)
                            {
                                if (songList_Infos[1][0] != null)
                                {
                                    if (songList_Infos[1][0].Songs != null)
                                    {
                                        for (int i = 0; i < Song_Info_Selects.Count; i++)
                                        {
                                            Song_Info temp = FindSongInfoBySongUrl(
                                                Convert.ToString(((Song_Info)Song_Info_Selects[i]).Song_Url),
                                                songList_Infos[1][0].Songs);
                                            if (temp == null)//如果没有重复的歌曲，则添加
                                            {
                                                Song_Info newSongInfo = new Song_Info();
                                                newSongInfo.Song_Name = ((Song_Info)Song_Info_Selects[i]).Song_Name;
                                                newSongInfo.Singer_Name = ((Song_Info)Song_Info_Selects[i]).Singer_Name;
                                                newSongInfo.Album_Name = ((Song_Info)Song_Info_Selects[i]).Album_Name;
                                                newSongInfo.Song_Url = ((Song_Info)Song_Info_Selects[i]).Song_Url;
                                                newSongInfo.Song_Duration = ((Song_Info)Song_Info_Selects[i]).Song_Duration;
                                                newSongInfo.Song_No = songList_Infos[1][0].Songs.Count + 1 + i;
                                                newSongInfo.Song_Like = ((Song_Info)Song_Info_Selects[i]).Song_Like;
                                                newSongInfo.MV_Path = ((Song_Info)Song_Info_Selects[i]).MV_Path;
                                                newSongInfo.IsChecked = ((Song_Info)Song_Info_Selects[i]).IsChecked;
                                                newSongInfo.Song_Like_Image = ((Song_Info)Song_Info_Selects[i]).Song_Like_Image;
                                                newSongInfo.Song_MV_Image = ((Song_Info)Song_Info_Selects[i]).Song_MV_Image;
                                                newSongInfo.Bool_Playing = ((Song_Info)Song_Info_Selects[i]).Bool_Playing;

                                                songList_Infos[1][0].Songs.Add(newSongInfo);
                                            }
                                        }
                                        //排序
                                        //songList_Infos[1][0].Songs = songList_Infos[1][0].Songs.OrderBy(s => s.Singer_Name + s.Song_Name).ToList();
                                        for (int i = 0; i < songList_Infos[1][0].Songs.Count; i++)
                                        {
                                            songList_Infos[1][0].Songs[i].Song_No = i + 1;
                                        }


                                        //清空被选中的信息：后端
                                        Song_Info_Selects.Clear();
                                    }
                                }
                            }
                            else if (ComBox_Select == 2)
                            {
                                if (songList_Infos[2][0] != null)
                                {
                                    if (songList_Infos[2][0].Songs != null)
                                    {
                                        for (int i = 0; i < Song_Info_Selects.Count; i++)
                                        {
                                            Song_Info temp = FindSongInfoBySongUrl(
                                                Convert.ToString(((Song_Info)Song_Info_Selects[i]).Song_Url),
                                                songList_Infos[2][0].Songs);
                                            if (temp == null)//如果没有重复的歌曲，则添加
                                            {
                                                Song_Info newSongInfo = new Song_Info();
                                                newSongInfo.Song_Name = ((Song_Info)Song_Info_Selects[i]).Song_Name;
                                                newSongInfo.Singer_Name = ((Song_Info)Song_Info_Selects[i]).Singer_Name;
                                                newSongInfo.Album_Name = ((Song_Info)Song_Info_Selects[i]).Album_Name;
                                                newSongInfo.Song_Url = ((Song_Info)Song_Info_Selects[i]).Song_Url;
                                                newSongInfo.Song_Duration = ((Song_Info)Song_Info_Selects[i]).Song_Duration;
                                                newSongInfo.Song_No = songList_Infos[2][0].Songs.Count + 1 + i;
                                                newSongInfo.Song_Like = ((Song_Info)Song_Info_Selects[i]).Song_Like;
                                                newSongInfo.MV_Path = ((Song_Info)Song_Info_Selects[i]).MV_Path;
                                                newSongInfo.IsChecked = ((Song_Info)Song_Info_Selects[i]).IsChecked;
                                                newSongInfo.Song_Like_Image = ((Song_Info)Song_Info_Selects[i]).Song_Like_Image;
                                                newSongInfo.Song_MV_Image = ((Song_Info)Song_Info_Selects[i]).Song_MV_Image;
                                                newSongInfo.Bool_Playing = ((Song_Info)Song_Info_Selects[i]).Bool_Playing;

                                                songList_Infos[2][0].Songs.Add(newSongInfo);
                                            }
                                        }
                                        //排序
                                        //songList_Infos[2][0].Songs = songList_Infos[2][0].Songs.OrderBy(s => s.Singer_Name + s.Song_Name).ToList();
                                        for (int i = 0; i < songList_Infos[2][0].Songs.Count; i++)
                                        {
                                            songList_Infos[2][0].Songs[i].Song_No = i + 1;
                                        }

                                        //清空被选中的信息：后端
                                        Song_Info_Selects.Clear();

                                    }
                                }
                            }
                            else//自定义歌单
                            {
                                if (songList_Infos[ComBox_Select][0] != null)
                                {
                                    if (songList_Infos[ComBox_Select][0].Songs != null)
                                    {
                                        List<UserControl_Main_Home_Left_MyMusic_More> userControl_Main_Home_Left_MyMusic_Mores =
                                            UserControl_Main_Home_Left_MyMusic_Mores_Class.Retuen_This();
                                        if (userControl_Main_Home_Left_MyMusic_Mores[ComBox_Select - 3] != null)
                                        {

                                            userControl_Main_Home_Left_MyMusic_Mores[ComBox_Select - 3].
                                                ListView_Download_SongList_Info.ItemsSource = null;

                                            for (int i = 0; i < Song_Info_Selects.Count; i++)
                                            {
                                                Song_Info temp = FindSongInfoBySongUrl(
                                                    Convert.ToString(((Song_Info)Song_Info_Selects[i]).Song_Url),
                                                    songList_Infos[ComBox_Select][0].Songs);
                                                if (temp == null)//如果没有重复的歌曲，则添加
                                                {
                                                    Song_Info newSongInfo = new Song_Info();
                                                    newSongInfo.Song_Name = ((Song_Info)Song_Info_Selects[i]).Song_Name;
                                                    newSongInfo.Singer_Name = ((Song_Info)Song_Info_Selects[i]).Singer_Name;
                                                    newSongInfo.Album_Name = ((Song_Info)Song_Info_Selects[i]).Album_Name;
                                                    newSongInfo.Song_Url = ((Song_Info)Song_Info_Selects[i]).Song_Url;
                                                    newSongInfo.Song_Duration = ((Song_Info)Song_Info_Selects[i]).Song_Duration;
                                                    newSongInfo.Song_No = songList_Infos[ComBox_Select][0].Songs.Count + 1 + i;
                                                    newSongInfo.Song_Like = ((Song_Info)Song_Info_Selects[i]).Song_Like;
                                                    newSongInfo.MV_Path = ((Song_Info)Song_Info_Selects[i]).MV_Path;
                                                    newSongInfo.IsChecked = ((Song_Info)Song_Info_Selects[i]).IsChecked;
                                                    newSongInfo.Song_Like_Image = ((Song_Info)Song_Info_Selects[i]).Song_Like_Image;
                                                    newSongInfo.Song_MV_Image = ((Song_Info)Song_Info_Selects[i]).Song_MV_Image;
                                                    newSongInfo.Bool_Playing = ((Song_Info)Song_Info_Selects[i]).Bool_Playing;

                                                    songList_Infos[ComBox_Select][0].Songs.Add(newSongInfo);
                                                }
                                            }
                                            //排序
                                            //songList_Infos[ComBox_Select][0].Songs = songList_Infos[ComBox_Select][0].Songs.OrderBy(s => s.Singer_Name + s.Song_Name).ToList();
                                            for (int i = 0; i < songList_Infos[ComBox_Select][0].Songs.Count; i++)
                                            {
                                                songList_Infos[ComBox_Select][0].Songs[i].Song_No = i + 1;
                                            }

                                            //清空被选中的信息：后端
                                            Song_Info_Selects.Clear();

                                            userControl_Main_Home_Left_MyMusic_Mores[ComBox_Select - 3].
                                                ListView_Download_SongList_Info.ItemsSource = songList_Infos[ComBox_Select][0].Songs;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                ComBox_Select_Add_SongList.SelectedIndex = -1;

                //保存歌单信息
                Save_SongListInfoAsync();
            }
        }
        public Song_Info FindSongInfoBySongUrl(string SongUrl, ObservableCollection<Song_Info> songInfoList)
        {
            foreach (Song_Info songInfo in songInfoList)
            {
                if (songInfo.Song_Url.Equals(SongUrl))
                {
                    return songInfo;
                }
            }

            return null;
        }


        Convert_Song_List_Infos convert_Song_Info = new Convert_Song_List_Infos();
        public async Task Save_SongListInfoAsync()
        {
            /*songList_Infos = SongList_Info.Retuen_This();

            var playlists = new ObservableCollection<SongList_Info>();
            playlists = songList_Infos[0];
            /// SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Love.xml", playlists);
            await convert_Song_Info.Save_SongList_To_DatabaseAsync(
                convert_Song_Info.Create_Product_Song_Infos(playlists[0].Songs),
                0, "我的收藏");

            playlists = new ObservableCollection<SongList_Info>();
            playlists = songList_Infos[1];
            /// SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_ALL.xml", playlists);
            await convert_Song_Info.Save_SongList_To_DatabaseAsync(
                convert_Song_Info.Create_Product_Song_Infos(playlists[0].Songs),
                1, "本地音乐");

            playlists = new ObservableCollection<SongList_Info>();
            playlists = songList_Infos[2];
            /// SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Auto.xml", playlists);
            await convert_Song_Info.Save_SongList_To_DatabaseAsync(
                convert_Song_Info.Create_Product_Song_Infos(playlists[0].Songs),
                2, "默认列表");

            for (int i = 3; i < 17; i++)
            {
                playlists = new ObservableCollection<SongList_Info>();
                playlists = songList_Infos[i];
                /// SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (" + i + ").xml", playlists);
                await convert_Song_Info.Save_SongList_To_DatabaseAsync(
                    convert_Song_Info.Create_Product_Song_Infos(playlists[0].Songs),
                    3, "歌单" + i);
            }*/
        }
        public ObservableCollection<Product_Song_Info> Create_Product_Song_Infos(ObservableCollection<Song_Info> temp)
        {
            ObservableCollection<Product_Song_Info> songs = new ObservableCollection<Product_Song_Info>();
            foreach (var item in temp)
            {
                Product_Song_Info _Song_Info = new Product_Song_Info();
                _Song_Info.Song_No = item.Song_No;
                _Song_Info.Song_Name = item.Song_Name;
                _Song_Info.Singer_Name = item.Singer_Name;
                _Song_Info.Song_Url = item.Song_Url;
                ///_Song_Info.Song_Duration = item.Song_Duration;
                _Song_Info.Song_Like = item.Song_Like;
                _Song_Info.Album_Name = item.Album_Name;
                ///_Song_Info.MV_Path = item.MV_Path;

                songs.Add(_Song_Info);
            }
            return songs;
        }




        /// <summary>
        /// 播放此专辑
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Play_This_Album_Click(object sender, RoutedEventArgs e)
        {
            Album_SongList_Infos album_SongList_Infos = new Album_SongList_Infos();
            album_SongList_Infos.Album_Image = Uri_Album_Image;
            album_SongList_Infos.Album_Name = TextBlock_Album_Name.Text;
            album_SongList_Infos.album_SongList_Infos = (ObservableCollection<Assembly_Album_SongList_Item>)ListView_For_This_Album_ALL_Song.ItemsSource;

            This_Performer_ALL_AlbumSongList this_Performer_ALL = new This_Performer_ALL_AlbumSongList();
            this_Performer_ALL.Singer_Name = this.Singer_Name;
            this_Performer_ALL.Albums = new ObservableCollection<Album_SongList_Infos>();
            this_Performer_ALL.Albums.Add(album_SongList_Infos);

            viewModule_Search_Song.All_Performer_ALL_AlbumCurrent_Playlist = new ALL_Performer_ALL_AlbumSongList();
            viewModule_Search_Song.All_Performer_ALL_AlbumCurrent_Playlist.ALL_Performers = new ObservableCollection<This_Performer_ALL_AlbumSongList>();
            viewModule_Search_Song.All_Performer_ALL_AlbumCurrent_Playlist.ALL_Performers.Clear();
            viewModule_Search_Song.All_Performer_ALL_AlbumCurrent_Playlist.ALL_Performers.Add(this_Performer_ALL);

            ListView_For_This_Album_ALL_Song.SelectedIndex = 0;
            viewModule_Search_Song.WMP_Song_Play_Ids = ListView_For_This_Album_ALL_Song.SelectedIndex;

            //覆盖 播放列表
            SongList_Info_Current_Playlists.Retuen_This().Album_To_Current_Playlist = 0;
        }



        /// <summary>
        /// 插入到播放列表 首部
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Add_This_Album_To_Current_Playlist_Top_Click(object sender, RoutedEventArgs e)
        {
            Album_SongList_Infos album_SongList_Infos = new Album_SongList_Infos();
            album_SongList_Infos.Album_Image = Uri_Album_Image;
            album_SongList_Infos.Album_Name = TextBlock_Album_Name.Text;
            album_SongList_Infos.album_SongList_Infos = (ObservableCollection<Assembly_Album_SongList_Item>)ListView_For_This_Album_ALL_Song.ItemsSource;

            This_Performer_ALL_AlbumSongList this_Performer_ALL = new This_Performer_ALL_AlbumSongList();
            this_Performer_ALL.Singer_Name = this.Singer_Name;
            this_Performer_ALL.Albums = new ObservableCollection<Album_SongList_Infos>();
            this_Performer_ALL.Albums.Add(album_SongList_Infos);

            viewModule_Search_Song.All_Performer_ALL_AlbumCurrent_Playlist = new ALL_Performer_ALL_AlbumSongList();

            if (viewModule_Search_Song.All_Performer_ALL_AlbumCurrent_Playlist.ALL_Performers == null)
                viewModule_Search_Song.All_Performer_ALL_AlbumCurrent_Playlist.ALL_Performers = new ObservableCollection<This_Performer_ALL_AlbumSongList>();

            viewModule_Search_Song.All_Performer_ALL_AlbumCurrent_Playlist.ALL_Performers.Add(this_Performer_ALL);

            //添加到播放列表 首部
            SongList_Info_Current_Playlists.Retuen_This().Album_To_Current_Playlist = 1;
        }
        /// <summary>
        /// 插入到播放列表 尾部
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Add_This_Album_To_Current_Playlist_Buttom_Click(object sender, RoutedEventArgs e)
        {
            Album_SongList_Infos album_SongList_Infos = new Album_SongList_Infos();
            album_SongList_Infos.Album_Image = Uri_Album_Image;
            album_SongList_Infos.Album_Name = TextBlock_Album_Name.Text;
            album_SongList_Infos.album_SongList_Infos = (ObservableCollection<Assembly_Album_SongList_Item>)ListView_For_This_Album_ALL_Song.ItemsSource;

            This_Performer_ALL_AlbumSongList this_Performer_ALL = new This_Performer_ALL_AlbumSongList();
            this_Performer_ALL.Singer_Name = this.Singer_Name;
            this_Performer_ALL.Albums = new ObservableCollection<Album_SongList_Infos>();
            this_Performer_ALL.Albums.Add(album_SongList_Infos);

            viewModule_Search_Song.All_Performer_ALL_AlbumCurrent_Playlist = new ALL_Performer_ALL_AlbumSongList();

            if (viewModule_Search_Song.All_Performer_ALL_AlbumCurrent_Playlist.ALL_Performers == null)
                viewModule_Search_Song.All_Performer_ALL_AlbumCurrent_Playlist.ALL_Performers = new ObservableCollection<This_Performer_ALL_AlbumSongList>();

            viewModule_Search_Song.All_Performer_ALL_AlbumCurrent_Playlist.ALL_Performers.Add(this_Performer_ALL);

            //添加到播放列表 首部
            SongList_Info_Current_Playlists.Retuen_This().Album_To_Current_Playlist = 2;
        }


    }
}

