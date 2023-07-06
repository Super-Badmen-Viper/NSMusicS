using Microsoft.Win32;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_List_Infos;
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
using VisioForge.Libs.NDI;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.Main_Home_Left_MyMusic_UserControls
{
    /// <summary>
    /// UserControl_Main_Home_Left_MyMusic_Recent_Play.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Main_Home_Left_MyMusic_Recent_Play : UserControl
    {
        public UserControl_Main_Home_Left_MyMusic_Recent_Play()
        {
            InitializeComponent();

            userControl_Main_Home_Left_MyMusic_Recent_Play = this;

            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();
        }

        private static UserControl_Main_Home_Left_MyMusic_Recent_Play userControl_Main_Home_Left_MyMusic_Recent_Play;
        public static UserControl_Main_Home_Left_MyMusic_Recent_Play Retuen_This()
        {
            userControl_Main_Home_Left_MyMusic_Recent_Play = Return_This_userControl_Main_Home_Left_MyMusic_Recent_Play();
            return userControl_Main_Home_Left_MyMusic_Recent_Play;
        }
        public static UserControl_Main_Home_Left_MyMusic_Recent_Play Return_This_userControl_Main_Home_Left_MyMusic_Recent_Play()
        {
            if (userControl_Main_Home_Left_MyMusic_Recent_Play == null)
                userControl_Main_Home_Left_MyMusic_Recent_Play = new UserControl_Main_Home_Left_MyMusic_Recent_Play();

            return userControl_Main_Home_Left_MyMusic_Recent_Play;
        }

        public string Path_App;
        static List<List<Models.Song_List_Infos.SongList_Info>> songList_Infos;
        static List<Song_Info> songList_Infos_Current_Playlist;

        /// <summary>
        /// 初始化加载
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void UserControl_Loaded(object sender, RoutedEventArgs e)
        {
            GridViewColumn_Check_ListView_Song.Width = 0;
            GridViewColumn_Love_Add_ListView_Song_Normal.Width = 30;

            Stack_Panel_Add_Song.Visibility = Visibility.Hidden;
            Stack_Panel_More_Takes.Visibility = Visibility.Hidden;

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
        //已选中的歌曲信息
        public ArrayList Song_Info_Temp = new ArrayList();
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
                Song_Info_Temp.Add(this.ListView_Download_SongList_Info.Items[Convert.ToInt32(ck_Selected.Tag) - 1]);
            }
            else if (ck_Selected.IsChecked == false)
            {
                Song_Info_Temp.Remove(this.ListView_Download_SongList_Info.Items[Convert.ToInt32(ck_Selected.Tag) - 1]);
            }
        }
        #endregion

        #region 添加此歌曲到我的收藏
        public ImageBrush brush_LoveNormal = new ImageBrush();
        public ImageBrush brush_LoveEnter = new ImageBrush();
        public ArrayList Song_Info_Love = new ArrayList();
        /// <summary>
        /// 添加此歌曲到我的收藏
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Love_ListView_Song_Click(object sender, RoutedEventArgs e)
        {
            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();

            //歌单歌曲排序
            Sort_SongList();

            Button ck_Selected_temp = sender as Button;

            Select_Add_Or_Delete(ck_Selected_temp, songList_Infos[2][0].Songs);

            Sort_SongList();
        }


        public void Select_Add_Or_Delete(Button ck_Selected_temp, List<Song_Info> listView_Temp_Info_End)
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

            Check_LoveSong_In_LoveSongList(ck_Selected, listView_Temp_Info_End);
        }
        /// <summary>
        /// 添加
        /// </summary>
        /// <param name="listView_Temp_Info_End"></param>
        public void Add_LoveSong_ToThisSongList(Button ck_Selected, List<Song_Info> listView_Temp_Info_End)
        {
            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();

            Song_Info temp = listView_Temp_Info_End.Find(delegate (Song_Info x) { return x.Song_No == Convert.ToInt32(ck_Selected.Tag); });

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
                    temp.Song_Like_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心 - 副本.png")));
                    temp.Song_Like = 1;
                    songList_Infos[0][0].Songs.Add(temp);
                }
                else
                    MessageBox.Show("该歌曲已添加至我的收藏");
            }
        }
        /// <summary>
        /// 移除
        /// </summary>
        /// <param name="listView_Temp_Info_End"></param>
        public void Remove_LoveSong_ToThisSongList(Button ck_Selected, List<Song_Info> listView_Temp_Info_End)
        {
            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();

            Song_Info temp = listView_Temp_Info_End.Find(delegate (Song_Info x) { return x.Song_No == Convert.ToInt32(ck_Selected.Tag); });
            string songurl = temp.Song_Url;
            foreach (Song_Info _Item_Bing in songList_Infos[0][0].Songs)
            {
                if (_Item_Bing.Song_Url.Equals(songurl))
                {
                    Song_Info temp_love = songList_Infos[0][0].Songs.Find(delegate (Song_Info x) { return x.Song_Url.Equals(songurl); });

                    temp_love.Song_Like_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心.png")));
                    temp_love.Song_Like = 0;
                    songList_Infos[0][0].Songs.Remove(temp_love);

                    temp.Song_Like_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心.png")));
                    temp.Song_Like = 0;

                    if (songList_Infos[0][0].Songs != null)
                    {
                        ListView_Download_SongList_Info.ItemsSource = null;
                        ListView_Download_SongList_Info.ItemsSource = listView_Temp_Info_End;
                    }
                    break;
                }
            }
        }

        /// <summary>
        /// 检查是否在我的收藏
        /// </summary>
        public void Check_LoveSong_In_LoveSongList(Button ck_Selected, List<Song_Info> listView_Temp_Info_End)
        {
            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();

            for (int i = 0; i < songList_Infos[0][0].Songs.Count; i++)
            {
                for (int j = 0; j < listView_Temp_Info_End.Count; j++)
                {
                    if (songList_Infos[0][0].Songs[i].Song_Url.Equals(listView_Temp_Info_End[j].Song_Url))
                    {
                        ck_Selected.MinHeight = 1;
                        ck_Selected.Background = brush_LoveEnter;

                        Check_LoveSong_In_LoveSongList_Reset_SongList_Info();
                    }
                }
            }
        }
        public void Check_LoveSong_In_LoveSongList_Reset_SongList_Info()
        {
            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();

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

            if (this.Song_Info_Temp.Count > 0)
            {
                //歌单歌曲排序
                Sort_SongList();

                int nums_select = 0;
                for (int i = 0; i < this.Song_Info_Temp.Count; i++)
                {
                    //检测删除了多少列
                    nums_select++;
                    Song_Info temp = songList_Infos[2][0].Songs.Find(delegate (Song_Info x) { return x.Song_Url.Equals(Convert.ToString(((Song_Info)Song_Info_Temp[i]).Song_Url)); });
                    songList_Infos[2][0].Songs.Remove(temp);
                }
                this.Song_Info_Temp.Clear();

                if (nums_select > 0)
                {
                    //歌曲序号重构
                    for (int i = 0; i < songList_Infos[2][0].Songs.Count; i++)
                    {
                        songList_Infos[2][0].Songs.ElementAt(i).Song_No = i + 1;
                    }

                    //切换歌曲播放列表
                    songList_Infos_Current_Playlist = SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;

                    songList_Infos_Current_Playlist = null;
                    songList_Infos_Current_Playlist = songList_Infos[2][0].Songs;
                    ListView_Download_SongList_Info.ItemsSource = null;
                    ListView_Download_SongList_Info.ItemsSource = songList_Infos[2][0].Songs;
                }
            }
        }

        public void Sort_SongList()
        {
            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();

            songList_Infos_Current_Playlist = SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;

            List<Song_Info> temp = new List<Song_Info>();
            for (int i = 0; i < songList_Infos_Current_Playlist.Count; i++)
            {
                temp.Add((Song_Info)songList_Infos_Current_Playlist[i]);
            }

            //我的收藏歌曲序号重构
            //歌曲序号重构
            for (int i = 0; i < songList_Infos[2][0].Songs.Count; i++)
            {
                songList_Infos[2][0].Songs.ElementAt(i).Song_No = i + 1;
            }

            songList_Infos_Current_Playlist = songList_Infos[2][0].Songs;
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

            Song_Info_Temp.Clear();

            if (Check_ALL_Song == true)
            {
                for (int i = 0; i < songList_Infos[2][0].Songs.Count; i++)
                {
                    Song_Info_Temp.Add(songList_Infos[2][0].Songs[i]);
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
                Song_Info_Temp.Clear();

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
                Stack_Panel_Add_Song.Visibility = Visibility.Hidden;
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
                Stack_Panel_More_Takes.Visibility = Visibility.Hidden;
            else
                Stack_Panel_More_Takes.Visibility = Visibility.Visible;


        }



        private void Stack_Button_Add_Select_Song_MouseEnter(object sender, MouseEventArgs e)
        {
            //#A8343434
            Stack_Button_Add_Select_Song.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FFE3E3E3"));
        }
        private void Stack_Button_Add_Select_Song_MouseLeave(object sender, MouseEventArgs e)
        {
            //#A8343434
            Stack_Button_Add_Select_Song.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }
        private void Stack_Button_Add_PC_ALL_Song_MouseEnter(object sender, MouseEventArgs e)
        {
            //#A8343434
            Stack_Button_Add_PC_ALL_Song.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FFE3E3E3"));
        }
        private void Stack_Button_Add_PC_ALL_Song_MouseLeave(object sender, MouseEventArgs e)
        {
            //#A8343434
            Stack_Button_Add_PC_ALL_Song.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }

        private void Button_Play_ALL_Song_MouseEnter(object sender, MouseEventArgs e)
        {
            Border_Play_ALL_Song.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FF1EC79D"));
        }

        private void Button_Play_ALL_Song_MouseLeave(object sender, MouseEventArgs e)
        {
            Border_Play_ALL_Song.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FF1FD1A5"));
        }

        private void Stack_Button_LotSelects_Take_MouseEnter(object sender, MouseEventArgs e)
        {
            Stack_Button_LotSelects_Take.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FFE3E3E3"));
        }
        private void Stack_Button_LotSelects_Take_MouseLeave(object sender, MouseEventArgs e)
        {
            Stack_Button_LotSelects_Take.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }

        private void Stack_Button_Find_Song_Info_MouseEnter(object sender, MouseEventArgs e)
        {
            Stack_Button_Find_Song_Info.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FFE3E3E3"));
        }
        private void Stack_Button_Find_Song_Info_MouseLeave(object sender, MouseEventArgs e)
        {
            Stack_Button_Find_Song_Info.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }

        private void Stack_Button_ThisPcSong_Find_MouseEnter(object sender, MouseEventArgs e)
        {
            Stack_Button_ThisPcSong_Find.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FFE3E3E3"));
        }
        private void Stack_Button_ThisPcSong_Find_MouseLeave(object sender, MouseEventArgs e)
        {
            Stack_Button_ThisPcSong_Find.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }

        private void Stack_Button_Update_Song_Better_MouseEnter(object sender, MouseEventArgs e)
        {
            Stack_Button_Update_Song_Better.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FFE3E3E3"));
        }
        private void Stack_Button_Update_Song_Better_MouseLeave(object sender, MouseEventArgs e)
        {
            Stack_Button_Update_Song_Better.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }

        private void Stack_Button_LotSelects_Take_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Grid_NormalModel_1.Visibility = Visibility.Hidden;
            Grid_NormalModel_2.Visibility = Visibility.Hidden;
            Grid_ListItem_CrudModel_1.Margin = new Thickness(0, 90, 0, 0);
            Grid_ListItem_CrudModel_2.Visibility = Visibility.Visible;
            GridViewColumn_Check_ListView_Song.Width = 30;
        }

        private void Stack_Button_Exit_LotLItemCrud_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Grid_NormalModel_1.Visibility = Visibility.Visible;
            Grid_NormalModel_2.Visibility = Visibility.Visible;
            Grid_ListItem_CrudModel_1.Margin = new Thickness(0, 180, 0, 0);
            Grid_ListItem_CrudModel_2.Visibility = Visibility.Hidden;
            GridViewColumn_Check_ListView_Song.Width = 0;
        }
    }
}
