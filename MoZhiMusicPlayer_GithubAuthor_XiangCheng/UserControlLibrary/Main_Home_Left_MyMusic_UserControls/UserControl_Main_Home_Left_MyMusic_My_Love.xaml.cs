using Microsoft.Win32;
using System;
using System.Collections;
using System.Collections.Generic;
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
using Gst;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_List_Infos;
using Uri = System.Uri;
using System.Collections.ObjectModel;
using System.Windows.Threading;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.Main_Home_Left_MyMusic_UserControls
{
    /// <summary>
    /// UserControl_Main_Home_Left_MyMusic_My_Love.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Main_Home_Left_MyMusic_My_Love : UserControl
    {
        public UserControl_Main_Home_Left_MyMusic_My_Love()
        {
            InitializeComponent();

            Grid_ListItem_CrudModel_2.Visibility = Visibility.Collapsed;

            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();

            Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";
            brush_LoveNormal = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心 (1).png")));
            brush_LoveEnter = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心 - 副本.png")));
        }

        public string Path_App;
        private MainWindow mainWindow;
        static ObservableCollection<ObservableCollection<Models.Song_List_Infos.SongList_Info>> songList_Infos;
        static ObservableCollection<Song_Info> songList_Infos_Current_Playlist;
        //已选中的歌曲信息
        public ArrayList Song_Info_Selects = new ArrayList();
        public ImageBrush brush_LoveNormal = new ImageBrush();
        public ImageBrush brush_LoveEnter = new ImageBrush();

        /// <summary>
        /// 初始化加载
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void UserControl_Loaded(object sender, RoutedEventArgs e)
        {
            GridViewColumn_Check_ListView_Song.Width = 0;
            GridViewColumn_Love_Add_ListView_Song_Normal.Width = 30;

            Stack_Panel_Add_Song.Visibility = Visibility.Collapsed;
            Stack_Panel_More_Takes.Visibility = Visibility.Collapsed;

            ListView_Download_SongList_Info.MouseDoubleClick += ListView_Download_SongList_Info_MouseDoubleClick;
        }

        private void ListView_Download_SongList_Info_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();
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

        #region 选中此音乐
        
        /// <summary>
        /// 选中此音乐
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Check_ListView_Song_Click(object sender, RoutedEventArgs e)
        {
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
        #endregion

        #region 添加此歌曲到我的收藏
        
        /// <summary>
        /// 添加此歌曲到我的收藏
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Love_ListView_Song_Click(object sender, RoutedEventArgs e)
        {
            //歌单歌曲排序
            Sort_SongList();

            Button ck_Selected_temp = sender as Button;

            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();

            Select_Add_Or_Delete(ck_Selected_temp, songList_Infos[0][0].Songs);

            Sort_SongList();
        }


        public void Select_Add_Or_Delete(Button ck_Selected_temp, ObservableCollection<Song_Info> listView_Temp_Info_End)
        {
            Button ck_Selected = ck_Selected_temp;
            //添加
            if (Convert.ToInt32(ck_Selected.MinHeight) == 0)//初始为0，代表未添加至我的收藏
            {
                ck_Selected.MinHeight = 1;
                ck_Selected.Background = brush_LoveEnter;

                Add_LoveSong_ToThisSongList(ck_Selected, listView_Temp_Info_End);
            }
            else
            {
                ck_Selected.MinHeight = 0;
                ck_Selected.Background = brush_LoveNormal;

                Remove_LoveSong_ToThisSongList(ck_Selected, listView_Temp_Info_End);
            }

            //同步其他歌单
            Check_LoveSong_In_LoveSongList_Reset_SongList_Info();
        }
        /// <summary>
        /// 添加
        /// </summary>
        /// <param name="listView_Temp_Info_End"></param>
        public void Add_LoveSong_ToThisSongList(Button ck_Selected, ObservableCollection<Song_Info> listView_Temp_Info_End)
        {
            /*//刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();
            if (songList_Infos != null)
            {
                if (songList_Infos.Count != 0)
                {
                    Song_Info temp = null;
                    foreach (Song_Info songInfo in listView_Temp_Info_End)
                    {
                        if (songInfo.Song_No == Convert.ToInt32(ck_Selected.Tag))
                        {
                            // 找到符合条件的元素，进行处理
                            temp = songInfo;
                            break; // 可以选择在此处结束循环，因为已经找到了符合条件的元素
                        }
                    }

                    bool Contains_temp = false;
                    if (temp != null)
                        for (int i = 0; i < songList_Infos[0][0].Songs.Count; i++)
                        {
                            if (songList_Infos[0][0].Songs[i].Song_Url.Equals(
                                temp.Song_Url
                                ))
                                Contains_temp = true;
                        }
                    else
                        Contains_temp = false;

                    if (Contains_temp == false)
                    {
                        bool Simple_Song = false;
                        //查找是否重复
                        for (int i = 0; i < songList_Infos[0][0].Songs.Count; i++)
                        {
                            if (songList_Infos[0][0].Songs.ElementAt(i).Song_Url == temp.Song_Url)
                            {
                                Simple_Song = true;
                                break;
                            }
                        }
                        if (Simple_Song == false)
                        {
                            //原歌单图片设置为喜欢
                            temp.Song_Like_Image = brush_LoveEnter;
                            temp.Song_Like = 1;
                            temp.Song_No = songList_Infos[0][0].Songs.Count + 1;

                            Song_Info song_Info = new Song_Info();
                            song_Info.Song_Duration = temp.Song_Duration;
                            song_Info.Song_Name = temp.Song_Name;
                            song_Info.Singer_Name = temp.Singer_Name;
                            song_Info.Song_Url = temp.Song_Url;
                            song_Info.Song_No = temp.Song_No;
                            song_Info.Song_Like = temp.Song_Like;
                            song_Info.Song_Like_Image = temp.Song_Like_Image;
                            song_Info.MV_Path = temp.MV_Path;
                            song_Info.Song_MV_Image = temp.Song_Like_Image;
                            song_Info.Album_Name = temp.Album_Name;
                            song_Info.Bool_Playing = temp.Bool_Playing;

                            songList_Infos[0][0].Songs.Add(song_Info);
                        }
                        else
                            MessageBox.Show("该歌曲已添加至我的收藏");
                    }
                }
            }*/
        }
        /// <summary>
        /// 移除
        /// </summary>
        /// <param name="listView_Temp_Info_End"></param>
        public void Remove_LoveSong_ToThisSongList(Button ck_Selected, ObservableCollection<Song_Info> listView_Temp_Info_End)
        {
            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();
            if (songList_Infos != null)
            {
                if (songList_Infos.Count != 0)
                {
                    Song_Info temp = FindSongInfoBySongNo(
                        Convert.ToInt32(ck_Selected.Tag), 
                        listView_Temp_Info_End);
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

                            temp.Song_Like_Image = brush_LoveNormal;
                            temp.Song_Like = 0;

                            /*Remove__Reset_SongList_Info(temp.Song_Url);*/

                            if (songList_Infos[0][0].Songs != null)
                            {
                                ListView_Download_SongList_Info.ItemsSource = null;
                                ListView_Download_SongList_Info.ItemsSource = listView_Temp_Info_End;
                            }
                            break;
                        }
                    }
                }
            }
        }

        public void Check_LoveSong_In_LoveSongList_Reset_SongList_Info()
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
                                    songList_Infos[i][0].Songs[j].Song_Like = 0;
                                    songList_Infos[i][0].Songs[j].Song_Like_Image = brush_LoveNormal;
                                }
                            }
                        }
                    }

                    //从下标1开始，跳过我的收藏
                    for (int i = 1; i < songList_Infos.Count; i++)//所有的 歌曲列表 数量
                    {
                        for (int j = 0; j < songList_Infos[i][0].Songs.Count; j++)//遍历到的 歌曲列表 中含有的 歌曲数量
                        {
                            for (int g = 0; g < songList_Infos[0][0].Songs.Count; g++)//我的收藏歌单 中含有的 歌曲数量
                            {
                                if (songList_Infos[i][0].Songs[j].Song_Url.Equals(songList_Infos[0][0].Songs[g].Song_Url))
                                {
                                    songList_Infos[i][0].Songs[j].Song_Like = 1;
                                    songList_Infos[i][0].Songs[j].Song_Like_Image = brush_LoveEnter;
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
                                    songList_Infos_Current_Playlist[i].Song_Like = 0;
                                    songList_Infos_Current_Playlist[i].Song_Like_Image = brush_LoveNormal;
                                }
                            }
                        }

                        for (int i = 0; i < songList_Infos_Current_Playlist.Count; i++)
                        {
                            for (int g = 0; g < songList_Infos[0][0].Songs.Count; g++)//我的收藏歌单 中含有的 歌曲数量
                            {
                                if (songList_Infos_Current_Playlist[i].Song_Url.Equals(songList_Infos[0][0].Songs[g].Song_Url))
                                {
                                    songList_Infos_Current_Playlist[i].Song_Like = 1;
                                    songList_Infos_Current_Playlist[i].Song_Like_Image = brush_LoveEnter;
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

        #region 批量操作

        /// <summary>
        /// 删除选中项
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Delete_Click(object sender, MouseButtonEventArgs e)
        {
            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();
            if (songList_Infos != null)
            {
                if (songList_Infos.Count != 0)
                {
                    if (this.Song_Info_Selects.Count > 0)
                    {
                        //歌单歌曲排序
                        Sort_SongList();

                        ListView_Download_SongList_Info.ItemsSource = null;

                        int nums_select = 0;
                        for (int i = 0; i < this.Song_Info_Selects.Count; i++)
                        {
                            //检测删除了多少列
                            nums_select++;
                            Song_Info temp = FindSongInfoBySongUrl(
                                Convert.ToString(((Song_Info)Song_Info_Selects[i]).Song_Url), 
                                songList_Infos[0][0].Songs);
                            songList_Infos[0][0].Songs.Remove(temp);

                            //其他歌单 移除喜欢
                            Remove__Reset_SongList_Info(temp.Song_Url);
                        }
                        this.Song_Info_Selects.Clear();

                        if (nums_select > 0)
                        {
                            //歌曲序号重构
                            for (int i = 0; i < songList_Infos[0][0].Songs.Count; i++)
                            {
                                songList_Infos[0][0].Songs.ElementAt(i).Song_No = i + 1;
                            }
                        }

                        ListView_Download_SongList_Info.ItemsSource = songList_Infos[0][0].Songs;
                    }

                    //全选删除 我的喜欢
                    if (Check_ALL_Song == false)
                    {
                        Remove__Reset_SongList_Info();//清除其他歌单的所有喜欢按钮
                    }
                }
            }
        }

        public void Sort_SongList()
        {
            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();
            if (songList_Infos != null)
            {
                if (songList_Infos.Count != 0)
                {
                    for (int i = 0; i < songList_Infos.Count; i++)
                    {
                        for (int j = 0; j < songList_Infos[i][0].Songs.Count; j++)
                        {
                            songList_Infos[i][0].Songs[j].Song_No = j + 1;
                        }
                    }
                }
            }

            //同步歌曲曲目数量
            Reset_ListView_Download_SongList_Info_ShowSongNums();
        }
        /// <summary>
        /// 添加歌曲
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Add_Click(object sender, RoutedEventArgs e)
        {
            //歌单歌曲排序
            Sort_SongList();
        }

        /// <summary>
        /// 歌曲排序
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Sort_Click(object sender, RoutedEventArgs e)
        {
            //歌单歌曲排序
            Sort_SongList();
        }

        /// <summary>
        /// 移除 其他歌单的 喜欢按钮（单个移除）
        /// </summary>
        /// <param name="url"></param>
        public void Remove__Reset_SongList_Info(string url)
        {
            songList_Infos = SongList_Info.Retuen_This();
            if (songList_Infos != null)
            {
                if (songList_Infos.Count != 0)
                {
                    //从下标1开始，跳过我的收藏
                    for (int i = 1; i < songList_Infos.Count; i++)//所有的 歌曲列表 数量
                    {
                        for (int j = 0; j < songList_Infos[i][0].Songs.Count; j++)//遍历到的 歌曲列表 中含有的 歌曲数量
                        {
                            for (int g = 0; g < songList_Infos[0][0].Songs.Count; g++)//我的收藏歌单 中含有的 歌曲数量
                            {
                                if (songList_Infos[i][0].Songs[j].Song_Url.Equals(url))
                                {
                                    songList_Infos[i][0].Songs[j].Song_Like = 0;
                                    songList_Infos[i][0].Songs[j].Song_Like_Image = brush_LoveNormal;
                                }
                            }
                        }
                    }
                }
            }
        }
        /// <summary>
        /// 整个移除
        /// </summary>
        public void Remove__Reset_SongList_Info()
        {
            songList_Infos = SongList_Info.Retuen_This();
            if (songList_Infos != null)
            {
                if (songList_Infos.Count != 0)
                {
                    //从下标1开始，跳过我的收藏
                    //后端清除
                    for (int i = 1; i < songList_Infos.Count; i++)//所有的 歌曲列表 数量
                    {
                        for (int j = 0; j < songList_Infos[i][0].Songs.Count; j++)//遍历到的 歌曲列表 中含有的 歌曲数量
                        {
                            for (int g = 0; g < songList_Infos[0][0].Songs.Count; g++)//我的收藏歌单 中含有的 歌曲数量
                            {
                                if (songList_Infos[i][0].Songs[j].Song_Url.Equals(
                                    songList_Infos[0][0].Songs[g].Song_Url
                                    ))
                                {
                                    songList_Infos[i][0].Songs[j].Song_Like = 0;
                                    songList_Infos[i][0].Songs[j].Song_Like_Image = brush_LoveNormal;
                                }
                            }
                        }
                    }
                    //UI前端数据清除
                    for (int i = 1; i < songList_Infos.Count; i++)
                    {
                        for (int j = 0; j < songList_Infos[i][0].Songs.Count; j++)
                        {
                            if (songList_Infos[i][0].Songs[j].Song_Like == 1)
                            {
                                songList_Infos[i][0].Songs[j].Song_Like = 0;
                                songList_Infos[i][0].Songs[j].Song_Like_Image = brush_LoveNormal;
                            }
                        }
                    }
                }
            }
        }

        bool Check_ALL_Song = false;
        /// <summary>
        /// 全选 歌单列表 歌曲
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Stack_Check_ALL_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();
            if (songList_Infos != null)
            {
                if (songList_Infos.Count != 0)
                {
                    Song_Info_Selects.Clear();

                    if (Check_ALL_Song == true)
                    {
                        for (int i = 0; i < songList_Infos[0][0].Songs.Count; i++)
                        {
                            Song_Info_Selects.Add(songList_Infos[0][0].Songs[i]);
                        }

                        foreach (var item in ListView_Download_SongList_Info.Items)
                        {
                            ListViewItem listViewItem = ListView_Download_SongList_Info.ItemContainerGenerator.ContainerFromItem(item) as ListViewItem;
                            if (listViewItem != null)
                            {
                                CheckBox checkBox = FindVisualChild<CheckBox>(listViewItem);
                                if (checkBox != null)
                                {
                                    checkBox.IsChecked = true;
                                }
                            }
                        }

                        Check_ALL_Song = false;
                    }
                    else
                    {
                        Song_Info_Selects.Clear();

                        foreach (var item in ListView_Download_SongList_Info.Items)
                        {
                            ListViewItem listViewItem = ListView_Download_SongList_Info.ItemContainerGenerator.ContainerFromItem(item) as ListViewItem;
                            if (listViewItem != null)
                            {
                                CheckBox checkBox = FindVisualChild<CheckBox>(listViewItem);
                                if (checkBox != null)
                                {
                                    checkBox.IsChecked = false;
                                }
                            }
                        }

                        Check_ALL_Song = true;
                    }
                }
            }
        }
        private T FindVisualChild<T>(DependencyObject obj) where T : DependencyObject
        {
            for (int i = 0; i < VisualTreeHelper.GetChildrenCount(obj); i++)
            {
                DependencyObject child = VisualTreeHelper.GetChild(obj, i);
                if (child != null && child is T)
                {
                    return (T)child;
                }
                else
                {
                    T childOfChild = FindVisualChild<T>(child);
                    if (childOfChild != null)
                    {
                        return childOfChild;
                    }
                }
            }
            return null;
        }

        public int ComBox_Select;
        /// <summary>
        /// 将选中歌曲 添加到指定歌单
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();
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
                                            songList_Infos[1][0].Songs.Add((Song_Info)Song_Info_Selects[i]);
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
                                    //清空被选中的信息：UI
                                    foreach (var item in ListView_Download_SongList_Info.Items)
                                    {
                                        ListViewItem listViewItem = ListView_Download_SongList_Info.ItemContainerGenerator.ContainerFromItem(item) as ListViewItem;
                                        if (listViewItem != null)
                                        {
                                            CheckBox checkBox = FindVisualChild<CheckBox>(listViewItem);
                                            if (checkBox != null)
                                            {
                                                checkBox.IsChecked = false;
                                            }
                                        }
                                    }
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
                                            songList_Infos[2][0].Songs.Add((Song_Info)Song_Info_Selects[i]);
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
                                    //清空被选中的信息：UI
                                    foreach (var item in ListView_Download_SongList_Info.Items)
                                    {
                                        ListViewItem listViewItem = ListView_Download_SongList_Info.ItemContainerGenerator.ContainerFromItem(item) as ListViewItem;
                                        if (listViewItem != null)
                                        {
                                            CheckBox checkBox = FindVisualChild<CheckBox>(listViewItem);
                                            if (checkBox != null)
                                            {
                                                checkBox.IsChecked = false;
                                            }
                                        }
                                    }
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
                                                songList_Infos[ComBox_Select][0].Songs.Add((Song_Info)Song_Info_Selects[i]);
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
                                        //清空被选中的信息：UI
                                        foreach (var item in ListView_Download_SongList_Info.Items)
                                        {
                                            ListViewItem listViewItem = ListView_Download_SongList_Info.ItemContainerGenerator.ContainerFromItem(item) as ListViewItem;
                                            if (listViewItem != null)
                                            {
                                                CheckBox checkBox = FindVisualChild<CheckBox>(listViewItem);
                                                if (checkBox != null)
                                                {
                                                    checkBox.IsChecked = false;
                                                }
                                            }
                                        }

                                        userControl_Main_Home_Left_MyMusic_Mores[ComBox_Select - 3].
                                            ListView_Download_SongList_Info.ItemsSource = songList_Infos[ComBox_Select][0].Songs;
                                        //this_SongList_Info = songList_Infos[ComBox_Select][0].Songs;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            ComBox_Select_Add_SongList.SelectedIndex = 0;
        }

        #endregion


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

        /// <summary>
        /// 添加音乐
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void StackPanel_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (Stack_Panel_Add_Song.Visibility == Visibility.Visible)
                Stack_Panel_Add_Song.Visibility = Visibility.Collapsed;
            else
                Stack_Panel_Add_Song.Visibility = Visibility.Visible;
        }
        /// <summary>
        /// 更多操作
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void StackPanel_MouseLeftButtonDown_1(object sender, MouseButtonEventArgs e)
        {
            if (Stack_Panel_More_Takes.Visibility == Visibility.Visible)
                Stack_Panel_More_Takes.Visibility = Visibility.Collapsed;
            else
                Stack_Panel_More_Takes.Visibility = Visibility.Visible;

        }





        private void Stack_Button_Add_Select_Song_MouseEnter(object sender, MouseEventArgs e)
        {
            //#A8343434
            Stack_Button_Add_Select_Song.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("White"));
        }
        private void Stack_Button_Add_Select_Song_MouseLeave(object sender, MouseEventArgs e)
        {
            //#A8343434
            Stack_Button_Add_Select_Song.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }
        private void Stack_Button_Add_PC_ALL_Song_MouseEnter(object sender, MouseEventArgs e)
        {
            //#A8343434
            Stack_Button_Add_PC_ALL_Song.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("White"));
        }
        private void Stack_Button_Add_PC_ALL_Song_MouseLeave(object sender, MouseEventArgs e)
        {
            //#A8343434
            Stack_Button_Add_PC_ALL_Song.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }


        private void Stack_Button_LotSelects_Take_MouseEnter(object sender, MouseEventArgs e)
        {
            Stack_Button_LotSelects_Take.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("White"));
        }
        private void Stack_Button_LotSelects_Take_MouseLeave(object sender, MouseEventArgs e)
        {
            Stack_Button_LotSelects_Take.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }

        private void Stack_Button_Find_Song_Info_MouseEnter(object sender, MouseEventArgs e)
        {
            Stack_Button_Find_Song_Info.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("White"));
        }
        private void Stack_Button_Find_Song_Info_MouseLeave(object sender, MouseEventArgs e)
        {
            Stack_Button_Find_Song_Info.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }

        private void Stack_Button_ThisPcSong_Find_MouseEnter(object sender, MouseEventArgs e)
        {
            Stack_Button_ThisPcSong_Find.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("White"));
        }
        private void Stack_Button_ThisPcSong_Find_MouseLeave(object sender, MouseEventArgs e)
        {
            Stack_Button_ThisPcSong_Find.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }

        private void Stack_Button_Update_Song_Better_MouseEnter(object sender, MouseEventArgs e)
        {
            Stack_Button_Update_Song_Better.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("White"));
        }
        private void Stack_Button_Update_Song_Better_MouseLeave(object sender, MouseEventArgs e)
        {
            Stack_Button_Update_Song_Better.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }

        private void Stack_Button_Synchronize_User_Music_Resources_MouseEnter(object sender, MouseEventArgs e)
        {
            Stack_Button_Synchronize_User_Music_Resources.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("White"));
        }
        private void Stack_Button_Synchronize_User_Music_Resources_MouseLeave(object sender, MouseEventArgs e)
        {
            Stack_Button_Synchronize_User_Music_Resources.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }

        private void Stack_Button_LotSelects_Take_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Grid_NormalModel_1.Visibility = Visibility.Collapsed;
            Grid_NormalModel_2.Visibility = Visibility.Collapsed;
            Grid_ListItem_CrudModel_1.Margin = new Thickness(0,90,0,0);
            Grid_ListItem_CrudModel_2.Visibility = Visibility.Visible;
            GridViewColumn_Check_ListView_Song.Width = 30;
        }

        private void Stack_Button_Exit_LotLItemCrud_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Grid_NormalModel_1.Visibility = Visibility.Visible;
            Grid_NormalModel_2.Visibility = Visibility.Visible;
            Grid_ListItem_CrudModel_1.Margin = new Thickness(0, 180, 0, 0);
            Grid_ListItem_CrudModel_2.Visibility = Visibility.Collapsed;
            GridViewColumn_Check_ListView_Song.Width = 0;
        }

        private void ListView_Download_SongList_Info_SourceUpdated(object sender, DataTransferEventArgs e)
        {
            Reset_ListView_Download_SongList_Info_ShowSongNums();
        }
        /// <summary>
        /// 同步当前歌单歌曲数量
        /// </summary>
        public void Reset_ListView_Download_SongList_Info_ShowSongNums()
        {
            Recent_Song_Nums.Text
                = "歌曲：" + ListView_Download_SongList_Info.Items.Count.ToString();
        }


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

        /// <summary>
        /// 添加到 当前播放列表
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Add_Current_Playlist_Select_ItemSong_Click(object sender, MouseButtonEventArgs e)
        {
            songList_Infos_Current_Playlist = SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;

            for (int i = 0; i < Song_Info_Selects.Count; i++)
            {
                Song_Info temp = FindSongInfoBySongUrl(
                    Convert.ToString(((Song_Info)Song_Info_Selects[i]).Song_Url),
                    songList_Infos_Current_Playlist);
                if (temp == null)//如果没有重复的歌曲，则添加
                {
                    songList_Infos_Current_Playlist.Add((Song_Info)Song_Info_Selects[i]);
                }
            }
            //排序
            //songList_Infos_Current_Playlist = songList_Infos_Current_Playlist.OrderBy(s => s.Singer_Name + s.Song_Name).ToList();
            for (int i = 0; i < songList_Infos_Current_Playlist.Count; i++)
            {
                songList_Infos_Current_Playlist[i].Song_No = i + 1;
            }


            //清空被选中的信息：后端
            Song_Info_Selects.Clear();
            //清空被选中的信息：UI
            foreach (var item in ListView_Download_SongList_Info.Items)
            {
                ListViewItem listViewItem = ListView_Download_SongList_Info.ItemContainerGenerator.ContainerFromItem(item) as ListViewItem;
                if (listViewItem != null)
                {
                    CheckBox checkBox = FindVisualChild<CheckBox>(listViewItem);
                    if (checkBox != null)
                    {
                        checkBox.IsChecked = false;
                    }
                }
            }

            SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist = songList_Infos_Current_Playlist;
        }
    }
}
