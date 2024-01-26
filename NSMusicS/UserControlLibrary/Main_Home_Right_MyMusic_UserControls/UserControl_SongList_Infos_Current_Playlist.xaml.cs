
using LottieSharp.WPF;
using Microsoft.Win32;
using NSMusicS.Models.APP_DB_SqlLite.Update_DB_Async;
using NSMusicS.Models.Song_List_Infos;
using SharpVectors.Converters;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace NSMusicS.UserControlLibrary.Main_Home_Right_MyMusic_UserControls
{
    /// <summary>
    /// UserControl_SongList_Infos_Current_Playlist.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_SongList_Infos_Current_Playlist : UserControl
    {
        public UserControl_SongList_Infos_Current_Playlist()
        {
            InitializeComponent();

            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();

            Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";

            /*LinearGradientBrush gradientBrush_8 = new LinearGradientBrush();
            gradientBrush_8.StartPoint = new Point(0, 0); // 渐变的起始点
            gradientBrush_8.EndPoint = new Point(1, 0);   // 渐变的结束点
            gradientBrush_8.GradientStops.Add(new GradientStop((Color)ColorConverter.ConvertFromString("#434343"), 0));
            gradientBrush_8.GradientStops.Add(new GradientStop((Color)ColorConverter.ConvertFromString("#000000"), 1));

            this_Background.Background = gradientBrush_8;*/
        }

        public string Path_App;
        static ObservableCollection<ObservableCollection<Models.Song_List_Infos.SongList_Info>> songList_Infos;
        static ObservableCollection<Song_Info> songList_Infos_Current_Playlist;
        //已选中的歌曲信息
        public ArrayList Song_Info_Selects = new ArrayList();

        Update_Song_List_Infos update_Song_List_Infos = Update_Song_List_Infos.Retuen_This();

        public Uri brush_LoveEnter
            = new Uri(@"Resource\\Button_Image_Svg\\已收藏.svg", UriKind.Relative);
        public Uri brush_LoveNormal
            = new Uri(@"Resource\\Button_Image_Svg\\收藏.svg", UriKind.Relative);

        //此控件的歌单信息
        static int songList_Infos_Index;

        /// <summary>
        /// 初始化加载
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void UserControl_Loaded(object sender, RoutedEventArgs e)
        {
            GridViewColumn_Check_ListView_Song.Width = 0;
            GridViewColumn_Love_Add_ListView_Song_Normal.Width = 30;

            ListView_Download_SongList_Info.MouseDoubleClick += ListView_Download_SongList_Info_MouseDoubleClick;
        }

        private void ListView_Download_SongList_Info_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();

            //歌单歌曲排序
            Sort_SongList();
        }


        /// <summary>
        /// 选择行
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_SongList_Select_Click(object sender, RoutedEventArgs e)
        {
            //歌单歌曲排序
            Sort_SongList();
        }

        #region 选中此音乐/正在播放

        /// <summary>
        /// 选中此音乐
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Check_ListView_Song_Click(object sender, RoutedEventArgs e)
        {
            //歌单歌曲排序
            Sort_SongList();

            CheckBox ck_Selected = sender as CheckBox;

            if (ck_Selected.IsChecked == true)
            {
                Song_Info_Selects.Add(this.ListView_Download_SongList_Info.Items[Convert.ToInt32(ck_Selected.Tag) - 1]);
            }
            else if (ck_Selected.IsChecked == false)
            {
                Song_Info_Selects.Remove(this.ListView_Download_SongList_Info.Items[Convert.ToInt32(ck_Selected.Tag) - 1]);
            }
        }

        /// <summary>
        /// 正在播放
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Loading_LottieAnimationView_IsVisibleChanged(object sender, DependencyPropertyChangedEventArgs e)
        {
            LottieAnimationView temp = sender as LottieAnimationView;
            if (temp != null)
            {
                if (temp.Visibility == Visibility.Visible)
                {
                    temp.PlayAnimation();
                }
                else
                {
                    temp.StopAnimation();
                }
            }
        }
        #endregion

        #region 添加此歌曲到我的收藏

        /// <summary>
        /// 添加此歌曲到我的收藏
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Love_ListView_Song_Click(object sender, RoutedEventArgs e)
        {
            songList_Infos_Current_Playlist = SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;

            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();

            //歌单歌曲排序
            Sort_SongList();

            Button ck_Selected_temp = sender as Button;

            Select_Add_Or_Delete(ck_Selected_temp);

            Sort_SongList();
        }


        public void Select_Add_Or_Delete(Button ck_Selected_temp)
        {
            Button ck_Selected = ck_Selected_temp;
            SvgViewbox SvgViewbox_Love_ListView_Song = (SvgViewbox)ck_Selected.FindName("SvgViewbox_Love_ListView_Song");
            //添加
            if (SvgViewbox_Love_ListView_Song.Source.Equals(brush_LoveNormal))//初始为0，代表未添加至我的收藏
            {
                Add_LoveSong_ToThisSongList(ck_Selected);
            }
            else
            {
                Remove_LoveSong_ToThisSongList(ck_Selected);
            }

            Check_LoveSong_In_LoveSongList(ck_Selected);

            SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist = songList_Infos_Current_Playlist;
            ListView_Download_SongList_Info.ItemsSource = null;
            ListView_Download_SongList_Info.ItemsSource = songList_Infos_Current_Playlist;
        }
        /// <summary>
        /// 添加
        /// </summary>
        /// <param name="songList_Infos_Current_Playlist"></param>
        public void Add_LoveSong_ToThisSongList(Button ck_Selected)
        {
            songList_Infos_Current_Playlist = SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;

            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();

            //歌单歌曲排序
            Sort_SongList();

            if (songList_Infos != null)
            {
                if (songList_Infos.Count != 0)
                {
                    Song_Info temp = FindSongInfoBySongNo(
                        Convert.ToInt16(ck_Selected.Tag),
                        songList_Infos_Current_Playlist);

                    if (songList_Infos[0][0].Songs.Contains(temp) == false)
                    {
                        bool Simple_Song = false;
                        //查找是否重复
                        for (int i = 0; i < songList_Infos[0][0].Songs.Count; i++)
                        {
                            if (songList_Infos[0][0].Songs.ElementAt(i).Singer_Name == temp.Singer_Name)
                            {
                                if (songList_Infos[0][0].Songs.ElementAt(i).Song_Name == temp.Song_Name)
                                {
                                    Simple_Song = true;
                                    break;
                                }
                            }
                        }
                        if (Simple_Song == false)
                        {
                            //原歌单图片设置为喜欢
                            temp.Song_Like_Image = brush_LoveEnter;
                            temp.Song_Like = 1;
                            temp.Song_No = songList_Infos[0][0].Songs.Count + 1;

                            Song_Info newSongInfo = new Song_Info();
                            newSongInfo.Song_Name = temp.Song_Name;
                            newSongInfo.Singer_Name = temp.Singer_Name;
                            newSongInfo.Album_Name = temp.Album_Name;
                            newSongInfo.Song_Url = temp.Song_Url;
                            newSongInfo.Song_Duration = temp.Song_Duration;
                            newSongInfo.Song_No = temp.Song_No;
                            newSongInfo.Song_Like = temp.Song_Like;
                            newSongInfo.MV_Path = temp.MV_Path;
                            newSongInfo.IsChecked = temp.IsChecked;
                            newSongInfo.Song_Like_Image = temp.Song_Like_Image;
                            newSongInfo.Song_MV_Image = temp.Song_MV_Image;
                            newSongInfo.Bool_Playing = temp.Bool_Playing;

                            songList_Infos[0][0].Songs.Add(newSongInfo);

                            update_Song_List_Infos.DB_Select_Model(1, newSongInfo, 0);
                        }
                        else
                            MessageBox.Show("该歌曲已添加至我的收藏");
                    }
                }
            }

            //歌单歌曲排序
            Sort_SongList();
        }
        /// <summary>
        /// 移除
        /// </summary>
        /// <param name="songList_Infos_Current_Playlist"></param>
        public void Remove_LoveSong_ToThisSongList(Button ck_Selected)
        {
            songList_Infos_Current_Playlist = SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;

            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();

            if (songList_Infos != null)
            {
                if (songList_Infos.Count != 0)
                {
                    Song_Info temp = FindSongInfoBySongNo(
                        Convert.ToInt16(ck_Selected.Tag),
                        songList_Infos_Current_Playlist);
                    string songurl = temp.Song_Url;
                    foreach (Song_Info _Item_Bing in songList_Infos[0][0].Songs)
                    {
                        if (_Item_Bing.Song_Url.Equals(songurl))
                        {
                            Song_Info temp_love = FindSongInfoBySongUrl(
                                songurl,
                                songList_Infos[0][0].Songs);

                            temp_love.Song_Like_Image = brush_LoveNormal;
                            temp_love.Song_Like = 0;
                            songList_Infos[0][0].Songs.Remove(temp_love);
                            update_Song_List_Infos.DB_Select_Model(2, temp_love, 0);

                            temp.Song_Like_Image = brush_LoveNormal;
                            temp.Song_Like = 0;

                            ListView_Download_SongList_Info.ItemsSource = null;
                            ListView_Download_SongList_Info.ItemsSource = songList_Infos_Current_Playlist;

                            break;
                        }
                    }
                }
            }

            //歌单歌曲排序
            Sort_SongList();
        }

        /// <summary>
        /// 检查是否在我的收藏
        /// </summary>
        public void Check_LoveSong_In_LoveSongList(Button ck_Selected)
        {
            songList_Infos_Current_Playlist = SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;

            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();

            //歌单歌曲排序
            Sort_SongList();

            if (songList_Infos != null)
            {
                if (songList_Infos.Count != 0)
                {
                    for (int i = 0; i < songList_Infos[0][0].Songs.Count; i++)
                    {
                        for (int j = 0; j < songList_Infos_Current_Playlist.Count; j++)
                        {
                            if (songList_Infos[0][0].Songs[i].Song_Url.Equals(songList_Infos_Current_Playlist[j].Song_Url))
                            {
                                ck_Selected.MinHeight = 1;

                                SvgViewbox SvgViewbox_Love_ListView_Song = (SvgViewbox)ck_Selected.FindName("SvgViewbox_Love_ListView_Song");

                                SvgViewbox_Love_ListView_Song.Source = brush_LoveEnter;
                            }
                        }
                    }
                    //所有的歌单 与我的收藏 相同的歌曲 设置为喜欢图像
                    Check_LoveSong_In_LoveSongList_Reset_SongList_Info();
                }
            }

            //歌单歌曲排序
            Sort_SongList();
        }
        public async void Check_LoveSong_In_LoveSongList_Reset_SongList_Info()
        {
            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();

            //歌单歌曲排序
            Sort_SongList();

            if (songList_Infos != null)
            {
                if (songList_Infos.Count != 0)
                {
                    //分开操作，防止数据遗漏

                    //从下标1开始，跳过我的收藏
                    for (int i = 1; i < songList_Infos.Count; i++)//所有的 歌曲列表 数量
                    {
                        for (int j = 0; j < songList_Infos[i][0].Songs.Count; j++)//遍历到的 歌曲列表 中含有的 歌曲数量
                        {
                            for (int g = 0; g < songList_Infos[0][0].Songs.Count; g++)//我的收藏歌单 中含有的 歌曲数量
                            {
                                if (!songList_Infos[i][0].Songs[j].Song_Url.Equals(songList_Infos[0][0].Songs[g].Song_Url))
                                {
                                    if (songList_Infos[i][0].Songs[j].Song_Like != 0)
                                    {
                                        songList_Infos[i][0].Songs[j].Song_Like = 0;
                                        songList_Infos[i][0].Songs[j].Song_Like_Image = brush_LoveNormal;

                                        await update_Song_List_Infos.DB_Select_Model(3, songList_Infos[i][0].Songs[j], i);
                                    }
                                }
                            }
                        }
                    }
                    for (int i = 1; i < songList_Infos.Count; i++)//所有的 歌曲列表 数量
                    {
                        for (int j = 0; j < songList_Infos[i][0].Songs.Count; j++)//遍历到的 歌曲列表 中含有的 歌曲数量
                        {
                            for (int g = 0; g < songList_Infos[0][0].Songs.Count; g++)//我的收藏歌单 中含有的 歌曲数量
                            {
                                if (songList_Infos[i][0].Songs[j].Song_Url.Equals(songList_Infos[0][0].Songs[g].Song_Url))
                                {
                                    if (songList_Infos[i][0].Songs[j].Song_Like != 1)
                                    {
                                        songList_Infos[i][0].Songs[j].Song_Like = 1;
                                        songList_Infos[i][0].Songs[j].Song_Like_Image = brush_LoveEnter;

                                        await update_Song_List_Infos.DB_Select_Model(3, songList_Infos[i][0].Songs[j], i);
                                    }
                                }
                            }
                        }
                    }

                    songList_Infos_Current_Playlist = SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;
                    if (songList_Infos_Current_Playlist != null)
                    {
                        for (int i = 0; i < songList_Infos_Current_Playlist.Count; i++)
                        {
                            for (int g = 0; g < songList_Infos[0][0].Songs.Count; g++)//我的收藏歌单 中含有的 歌曲数量
                            {
                                if (!songList_Infos_Current_Playlist[i].Song_Url.Equals(songList_Infos[0][0].Songs[g].Song_Url))
                                {
                                    if (songList_Infos_Current_Playlist[i].Song_Like != 0)
                                    {
                                        songList_Infos_Current_Playlist[i].Song_Like = 0;
                                        songList_Infos_Current_Playlist[i].Song_Like_Image = brush_LoveNormal;

                                        await update_Song_List_Infos.DB_Select_Model(3, songList_Infos_Current_Playlist[i], 17);
                                    }
                                }
                            }
                        }
                        for (int i = 0; i < songList_Infos_Current_Playlist.Count; i++)
                        {
                            for (int g = 0; g < songList_Infos[0][0].Songs.Count; g++)//我的收藏歌单 中含有的 歌曲数量
                            {
                                if (songList_Infos_Current_Playlist[i].Song_Url.Equals(songList_Infos[0][0].Songs[g].Song_Url))
                                {
                                    if (songList_Infos_Current_Playlist[i].Song_Like != 1)
                                    {
                                        songList_Infos_Current_Playlist[i].Song_Like = 1;
                                        songList_Infos_Current_Playlist[i].Song_Like_Image = brush_LoveEnter;

                                        await update_Song_List_Infos.DB_Select_Model(3, songList_Infos_Current_Playlist[i], 17);
                                    }
                                }
                            }
                        }
                        SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist = songList_Infos_Current_Playlist;
                    }

                }
            }

            //歌单歌曲排序
            Sort_SongList();
        }
        #endregion


        private void Delete_ListView_Song(object sender, RoutedEventArgs e)
        {
            Button ck_Selected = sender as Button;

            songList_Infos_Current_Playlist = SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;

            if (songList_Infos_Current_Playlist[Convert.ToInt16(ck_Selected.Tag) - 1].Bool_Playing == true)
                SongList_Info_Current_Playlists.Bool_Restart_Playing = true;
            else
                SongList_Info_Current_Playlists.Bool_Restart_Playing = false;


            songList_Infos_Current_Playlist.RemoveAt(Convert.ToInt16(ck_Selected.Tag) - 1);
            for (int i = 0; i < songList_Infos_Current_Playlist.Count; i++)
            {
                songList_Infos_Current_Playlist[i].Song_No = i + 1;
            }

            ListView_Download_SongList_Info.ItemsSource = null;
            ListView_Download_SongList_Info.ItemsSource = songList_Infos_Current_Playlist;

            SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist = songList_Infos_Current_Playlist;

            //歌单歌曲排序
            Sort_SongList();
        }


        /// <summary>
        /// 歌单歌曲排序
        /// </summary>
        public void Sort_SongList()
        {
            //刷新内存区域的引用
            songList_Infos_Current_Playlist = SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;
            if (songList_Infos_Current_Playlist != null)
            {
                for (int i = 0; i < songList_Infos_Current_Playlist.Count; i++)
                {
                    songList_Infos_Current_Playlist[i].Song_No = i + 1;
                }
            }

            SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist = songList_Infos_Current_Playlist;
        }


        #region 获得指定元素的父元素
        /// 获得指定元素的父元素
        /// </summary>
        /// <typeparam name="T">指定页面元素</typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public T GetParentObject<T>(DependencyObject obj) where T : FrameworkElement
        {
            DependencyObject parent = VisualTreeHelper.GetParent(obj);

            while (parent != null)
            {
                if (parent is T)
                {
                    return (T)parent;
                }

                parent = VisualTreeHelper.GetParent(parent);
            }

            return null;
        }
        /// <summary>
        /// 获得指定元素的所有子元素(这里需要有一个从DataTemplate里获取控件的函数)
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public List<T> GetChildObjects_Name<T>(DependencyObject obj, string name) where T : FrameworkElement
        {
            DependencyObject child = null;
            List<T> childList = new List<T>();
            for (int i = 0; i <= VisualTreeHelper.GetChildrenCount(obj) - 1; i++)
            {
                child = VisualTreeHelper.GetChild(obj, i);
                if (child is T && (((T)child).Name == name || string.IsNullOrEmpty(name)))
                {
                    childList.Add((T)child);
                }
                childList.AddRange(GetChildObjects_Name<T>(child, ""));//指定集合的元素添加到List队尾
            }
            return childList;
        }
        /// <summary>
        /// 获得指定元素的所有子元素
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public List<T> GetChildObjects<T>(DependencyObject obj) where T : FrameworkElement
        {
            DependencyObject child = null;
            List<T> childList = new List<T>();

            for (int i = 0; i <= VisualTreeHelper.GetChildrenCount(obj) - 1; i++)
            {
                child = VisualTreeHelper.GetChild(obj, i);

                if (child is T)
                {
                    childList.Add((T)child);
                }
                childList.AddRange(GetChildObjects<T>(child));
            }
            return childList;
        }
        /// <summary>
        /// 查找子元素
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        public T GetChildObject<T>(DependencyObject obj, string name) where T : FrameworkElement
        {
            DependencyObject child = null;
            T grandChild = null;


            for (int i = 0; i <= VisualTreeHelper.GetChildrenCount(obj) - 1; i++)
            {
                child = VisualTreeHelper.GetChild(obj, i);


                if (child is T && (((T)child).Name == name | string.IsNullOrEmpty(name)))
                {
                    return (T)child;
                }
                else
                {
                    grandChild = GetChildObject<T>(child, name);
                    if (grandChild != null)
                        return grandChild;
                }
            }
            return null;
        }
        #endregion

        public Song_Info FindSongInfoBySongNo(int songNo, ObservableCollection<Song_Info> songInfoList)
        {
            foreach (Song_Info songInfo in songInfoList)
            {
                if (songInfo.Song_No == songNo)
                {
                    return songInfo;
                }
            }

            return null;
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

        
    }
}
