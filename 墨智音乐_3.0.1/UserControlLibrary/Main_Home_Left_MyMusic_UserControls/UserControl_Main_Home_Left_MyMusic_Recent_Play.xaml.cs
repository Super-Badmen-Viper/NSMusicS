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
using 墨智音乐_3._0._1.Dao_Init_Info.Init_SongList_Info;
using 墨智音乐_3._0._1.Dao_UserControl.SongList_Info;

namespace 墨智音乐_3._0._1.UserControlLibrary.Main_Home_Left_MyMusic_UserControls
{
    /// <summary>
    /// UserControl_Main_Home_Left_MyMusic_Recent_Play.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Main_Home_Left_MyMusic_Recent_Play : UserControl
    {
        public UserControl_Main_Home_Left_MyMusic_Recent_Play()
        {
            InitializeComponent();
        }

        public string Path_App;
        public ListView_Item_Bing_ALL listView_Item_Bing_ALL = ListView_Item_Bing_ALL.Retuen_This();
        public Bool_listView_Temp_Info_End_Clear bool_ListView_Temp_Info_End_Clear = Bool_listView_Temp_Info_End_Clear.Retuen_This();

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
            //歌单歌曲排序
            Sort_SongList();

            Button ck_Selected = sender as Button;

            //刷新内存区域的引用
            listView_Item_Bing_ALL = ListView_Item_Bing_ALL.Retuen_This();

            if (listView_Item_Bing_ALL.listView_Temp_Info_End_Love == null)
                listView_Item_Bing_ALL.listView_Temp_Info_End_Love = new List<ListView_Item_Bing>();

            //添加
            if (Convert.ToInt32(ck_Selected.MinHeight) == 0)//初始为0，代表未添加至我的收藏
            {
                ck_Selected.MinHeight = 1;
                ck_Selected.Background = brush_LoveEnter;

                if (bool_ListView_Temp_Info_End_Clear.userControl_主界面_FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_ALL"))
                {
                    ListView_Item_Bing temp = listView_Item_Bing_ALL.listView_Temp_Info_End_ALL.Find(delegate (ListView_Item_Bing x) { return x.Song_No == Convert.ToInt32(ck_Selected.Tag); });

                    if (listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Contains(temp) == false)
                    {
                        bool Simple_Song = false;
                        //查找是否重复
                        for (int i = 0; i < listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Count; i++)
                        {
                            if (listView_Item_Bing_ALL.listView_Temp_Info_End_Love.ElementAt(i).Singer_Name == temp.Singer_Name)
                            {
                                if (listView_Item_Bing_ALL.listView_Temp_Info_End_Love.ElementAt(i).Song_Name == temp.Song_Name)
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
                            listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Add(temp);
                        }
                        else
                            MessageBox.Show("该歌曲已添加至我的收藏");

                    }
                    else
                        MessageBox.Show("该歌曲已添加至我的收藏");

                }
                else if (bool_ListView_Temp_Info_End_Clear.userControl_主界面_FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_Auto"))
                {
                    ListView_Item_Bing temp = listView_Item_Bing_ALL.listView_Temp_Info_End_Auto.Find(delegate (ListView_Item_Bing x) { return x.Song_No == Convert.ToInt32(ck_Selected.Tag); });

                    if (listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Contains(temp) == false)
                    {
                        bool Simple_Song = false;
                        //查找是否重复
                        for (int i = 0; i < listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Count; i++)
                        {
                            if (listView_Item_Bing_ALL.listView_Temp_Info_End_Love.ElementAt(i).Singer_Name == temp.Singer_Name)
                            {
                                if (listView_Item_Bing_ALL.listView_Temp_Info_End_Love.ElementAt(i).Song_Name == temp.Song_Name)
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
                            listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Add(temp);
                        }
                        else
                            MessageBox.Show("该歌曲已添加至我的收藏");

                    }
                    else
                        MessageBox.Show("该歌曲已添加至我的收藏");

                }
                else
                {
                    MessageBox.Show("该歌曲已添加至我的收藏");
                }


                //我的收藏歌曲序号重构
                //歌曲序号重构
                for (int i = 0; i < listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Count; i++)
                {
                    listView_Item_Bing_ALL.listView_Temp_Info_End_Love.ElementAt(i).Song_No = i + 1;
                }



                Sort_SongList();


                //移除
            }
            else
            {
                ck_Selected.MinHeight = 0;
                ck_Selected.Background = brush_LoveNormal;


                if (bool_ListView_Temp_Info_End_Clear.userControl_主界面_FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_ALL"))
                {
                    ListView_Item_Bing temp = listView_Item_Bing_ALL.listView_Temp_Info_End_ALL.Find(delegate (ListView_Item_Bing x) { return x.Song_No == Convert.ToInt32(ck_Selected.Tag); });

                    string songurl = temp.Song_Url;

                    foreach (ListView_Item_Bing _Item_Bing in listView_Item_Bing_ALL.listView_Temp_Info_End_Love)
                    {
                        if (_Item_Bing.Song_Url.Equals(songurl))
                        {
                            ListView_Item_Bing temp_love = listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Find(delegate (ListView_Item_Bing x) { return x.Song_Url.Equals(songurl); });

                            //原歌单图片设置为喜欢
                            temp_love.Song_Like_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心.png")));
                            temp_love.Song_Like = 0;
                            listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Remove(temp_love);

                            temp.Song_Like_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心.png")));
                            temp.Song_Like = 0;

                            if (listView_Item_Bing_ALL.listView_Temp_Info_End_Love != null)
                            {
                                ListView_Download_SongList_Info.ItemsSource = null;
                                ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_ALL;
                            }

                            break;
                        }
                    }

                }
                else if (bool_ListView_Temp_Info_End_Clear.userControl_主界面_FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_Auto"))
                {
                    ListView_Item_Bing temp = listView_Item_Bing_ALL.listView_Temp_Info_End_Auto.Find(delegate (ListView_Item_Bing x) { return x.Song_No == Convert.ToInt32(ck_Selected.Tag); });

                    string songurl = temp.Song_Url;

                    foreach (ListView_Item_Bing _Item_Bing in listView_Item_Bing_ALL.listView_Temp_Info_End_Love)
                    {
                        if (_Item_Bing.Song_Url.Equals(songurl))
                        {
                            ListView_Item_Bing temp_love = listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Find(delegate (ListView_Item_Bing x) { return x.Song_Url.Equals(songurl); });

                            //原歌单图片设置为喜欢
                            temp_love.Song_Like_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心.png")));
                            temp_love.Song_Like = 0;
                            listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Remove(temp_love);

                            temp.Song_Like_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心.png")));
                            temp.Song_Like = 0;

                            if (listView_Item_Bing_ALL.listView_Temp_Info_End_Love != null)
                            {
                                ListView_Download_SongList_Info.ItemsSource = null;
                                ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_Auto;
                            }

                            break;
                        }
                    }
                }
                else
                {
                    ListView_Item_Bing temp = listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Find(delegate (ListView_Item_Bing x) { return x.Song_No == Convert.ToInt32(ck_Selected.Tag); });

                    if (listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Contains(temp) == true)
                    {
                        bool Simple_Song = false;
                        //查找是否重复
                        for (int i = 0; i < listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Count; i++)
                        {
                            if (listView_Item_Bing_ALL.listView_Temp_Info_End_Love.ElementAt(i).Singer_Name == temp.Singer_Name)
                            {
                                if (listView_Item_Bing_ALL.listView_Temp_Info_End_Love.ElementAt(i).Song_Name == temp.Song_Name)
                                {
                                    Simple_Song = true;
                                    break;
                                }
                            }
                        }

                        if (Simple_Song == true)
                        {
                            //原歌单图片设置为喜欢
                            temp.Song_Like_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心.png")));
                            temp.Song_Like = 0;
                            listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Remove(temp);//移除出数据源                       
                        }


                    }
                }


                //我的收藏歌曲序号重构
                //歌曲序号重构
                for (int i = 0; i < listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Count; i++)
                {
                    listView_Item_Bing_ALL.listView_Temp_Info_End_Love.ElementAt(i).Song_No = i + 1;
                }

                Sort_SongList();
            }

        }
        #endregion


        string[] All_Info_Path;
        public ListView_Item_Bing[] ListView_Item_Bing_Temp;
        #region 添加音乐
        /// <summary>
        /// 添加本地音乐
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Add_Some_Song_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            if (bool_ListView_Temp_Info_End_Clear.userControl_主界面_FrmMain_ListView_Temp_Info_ItemSource_Name != null)
            {
                OpenFileDialog dialog = new OpenFileDialog();
                dialog.Multiselect = true;//该值确定是否可以选择多个文件
                dialog.Title = "请选择文件夹";
                dialog.Filter = "MP3文件 (.mp3)|*.mp3";

                dialog.ShowDialog();

                All_Info_Path = dialog.FileNames;

                add_Selected_SongList = new Add_Selected_SongList();

                ListView_Item_Bing_Temp = add_Selected_SongList.Resert_SongList_Info(All_Info_Path);//生成ListViewBing数列


                listView_Item_Bing_ALL = ListView_Item_Bing_ALL.Retuen_This();
                if (bool_ListView_Temp_Info_End_Clear.userControl_主界面_FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_ALL"))
                {
                    if (listView_Item_Bing_ALL.listView_Temp_Info_End_ALL == null)
                        listView_Item_Bing_ALL.listView_Temp_Info_End_ALL = new List<ListView_Item_Bing>();

                    //追加数列至本地音乐列表  Get_FrmMain.userControl_主界面_FrmMain.listView_Item_Bing_ALL.listView_Temp_Info_End_ALL.
                    for (int i = 0; i < ListView_Item_Bing_Temp.Length; i++)
                    {
                        if (ListView_Item_Bing_Temp[i] != null)
                            listView_Item_Bing_ALL.listView_Temp_Info_End_ALL.Add(ListView_Item_Bing_Temp[i]);
                    }
                }
                else if (bool_ListView_Temp_Info_End_Clear.userControl_主界面_FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_Love"))
                {
                    if (listView_Item_Bing_ALL.listView_Temp_Info_End_Love == null)
                        listView_Item_Bing_ALL.listView_Temp_Info_End_Love = new List<ListView_Item_Bing>();

                    //追加数列至本地音乐列表  Get_FrmMain.userControl_主界面_FrmMain.listView_Item_Bing_ALL.listView_Temp_Info_End_ALL.
                    for (int i = 0; i < ListView_Item_Bing_Temp.Length; i++)
                    {
                        if (ListView_Item_Bing_Temp[i] != null)
                            listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Add(ListView_Item_Bing_Temp[i]);
                    }
                }
                else if (bool_ListView_Temp_Info_End_Clear.userControl_主界面_FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_Auto"))
                {
                    if (listView_Item_Bing_ALL.listView_Temp_Info_End_Auto == null)
                        listView_Item_Bing_ALL.listView_Temp_Info_End_Auto = new List<ListView_Item_Bing>();

                    //追加数列至本地音乐列表  Get_FrmMain.userControl_主界面_FrmMain.listView_Item_Bing_ALL.listView_Temp_Info_End_ALL.
                    for (int i = 0; i < ListView_Item_Bing_Temp.Length; i++)
                    {
                        if (ListView_Item_Bing_Temp[i] != null)
                            listView_Item_Bing_ALL.listView_Temp_Info_End_Auto.Add(ListView_Item_Bing_Temp[i]);
                    }
                }



                //歌单歌曲排序
                Sort_SongList();

                Console.ReadLine();
                MessageBox.Show("已导入选中的mp3音乐");

                //ListBox_Select_ListView.Visibility = Visibility.Hidden;


            }
            else
            {
                MessageBox.Show("请选择到导入的歌曲列表");
            }
        }
        /// <summary>
        /// 添加本地音乐文件夹
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Add_ALL_Song_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            /*System.Windows.Forms.FolderBrowserDialog dialog = new System.Windows.Forms.FolderBrowserDialog();
            dialog.Description = "请选择本地音乐所在文件夹";
            if (dialog.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            {
                string path = dialog.SelectedPath; // "e:/go"
            }



            ListBox_Select_ListView.Visibility = Visibility.Hidden;*/
        }

        Add_Selected_SongList add_Selected_SongList;
        public static string[] Finds_AllSong = new string[9999];
        public static string[] Finds_AllSong_End = new string[9999];
        public string[] All_Song_Path;//导入歌曲     临时存储选定的所有文件夹内 MP3文件信息
        /// <summary>
        /// 检索添加本机所有音乐
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Add_PC_ALL_Song_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            /* var t1 = new Thread(finds);//多线程遍历本机音乐文件
             t1.Start();       */

            /* add_Selected_SongList = new Add_Selected_SongList();
             add_Selected_SongList.Return_PC_ALL_Mp3Info();*/



            //ListBox_Select_ListView.Visibility = Visibility.Hidden;
        }
        #endregion


        #region 批量操作
        /// <summary>
        /// 批量操作
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Select_Click(object sender, RoutedEventArgs e)
        {
            //歌单歌曲排序
            Sort_SongList();

            /*if (Button_Select.Content.Equals("批量操作"))
            {
                Button_Delete.Visibility = Visibility.Visible;
                Button_Load.Visibility = Visibility.Visible;
                Button_Select_Exit.Visibility = Visibility.Visible;

                //显示ListView_Download_SongList_Info中listviewitem中Check控件
                List<CheckBox> cks = GetChildObjects_Name<CheckBox>(this.ListView_Download_SongList_Info, "checkBox");
                foreach (var item in cks)
                {
                    item.Visibility = System.Windows.Visibility.Visible;
                }

                GridViewColumn_Check_ListView_Song.Width = 30;

                Button_Select.Content = "添加到";

            }
            else
            {
                ListBox_Select_ListView.Visibility = Visibility.Visible;





            }*/

        }
        /// <summary>
        /// 退出批量操作
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Select_Exit_Click(object sender, RoutedEventArgs e)
        {
            /*Button_Delete.Visibility = Visibility.Hidden;
            Button_Load.Visibility = Visibility.Hidden;
            Button_Select_Exit.Visibility = Visibility.Hidden;*/

            //清除listviewitem选中效果
            ListView_Download_SongList_Info.SelectedItems.Clear();


            //隐藏ListView_Download_SongList_Info中listviewitem中Check控件
            //并取消Check选中效果
            List<CheckBox> cks = GetChildObjects_Name<CheckBox>(this.ListView_Download_SongList_Info, "checkBox");
            foreach (var item in cks)
            {
                item.Visibility = System.Windows.Visibility.Hidden;
                item.IsChecked = false;
            }

            GridViewColumn_Check_ListView_Song.Width = 0;

            //Button_Select.Content = "批量操作";

            //ListBox_Select_ListView.Visibility = Visibility.Hidden;
        }
        /// <summary>
        /// 删除选中项
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Delete_Click(object sender, RoutedEventArgs e)
        {
            //歌单歌曲排序
            Sort_SongList();

            //ListView_Download_SongList_Info.Items.Remove(ListView_Download_SongList_Info.SelectedItems);
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

            /*if (ListBox_Select_ListView.Visibility == Visibility.Hidden)
            {
                ListBox_Select_ListView.Visibility = Visibility.Visible;
            }
            else
            {
                ListBox_Select_ListView.Visibility = Visibility.Hidden;
            }*/
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

        public void Sort_SongList()
        {
            if (bool_ListView_Temp_Info_End_Clear.userControl_主界面_FrmMain_ListView_Temp_Info_ItemSource_Name != null)
            {
                if (bool_ListView_Temp_Info_End_Clear.userControl_主界面_FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_ALL"))
                {

                    List<ListView_Item_Bing> temp = new List<ListView_Item_Bing>();
                    for (int i = 0; i < ListView_Download_SongList_Info.Items.Count; i++)
                    {
                        temp.Add((ListView_Item_Bing)ListView_Download_SongList_Info.Items[i]);
                    }

                    listView_Item_Bing_ALL.listView_Temp_Info_End_ALL = null;
                    ListView_Download_SongList_Info.ItemsSource = null;
                    listView_Item_Bing_ALL.listView_Temp_Info_End_ALL = temp;

                    //我的收藏歌曲序号重构
                    //歌曲序号重构
                    for (int i = 0; i < listView_Item_Bing_ALL.listView_Temp_Info_End_ALL.Count; i++)
                    {
                        listView_Item_Bing_ALL.listView_Temp_Info_End_ALL.ElementAt(i).Song_No = i + 1;
                    }

                    ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_ALL;
                }
                else if (bool_ListView_Temp_Info_End_Clear.userControl_主界面_FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_Love"))
                {
                    List<ListView_Item_Bing> temp = new List<ListView_Item_Bing>();
                    for (int i = 0; i < ListView_Download_SongList_Info.Items.Count; i++)
                    {
                        temp.Add((ListView_Item_Bing)ListView_Download_SongList_Info.Items[i]);
                    }

                    listView_Item_Bing_ALL.listView_Temp_Info_End_Love = null;
                    ListView_Download_SongList_Info.ItemsSource = null;
                    listView_Item_Bing_ALL.listView_Temp_Info_End_Love = temp;

                    //我的收藏歌曲序号重构
                    //歌曲序号重构
                    for (int i = 0; i < listView_Item_Bing_ALL.listView_Temp_Info_End_Love.Count; i++)
                    {
                        listView_Item_Bing_ALL.listView_Temp_Info_End_Love.ElementAt(i).Song_No = i + 1;
                    }

                    ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_Love;
                }
                else if (bool_ListView_Temp_Info_End_Clear.userControl_主界面_FrmMain_ListView_Temp_Info_ItemSource_Name.Equals("listView_Item_Bing_ALL.listView_Temp_Info_End_Auto"))
                {
                    List<ListView_Item_Bing> temp = new List<ListView_Item_Bing>();
                    for (int i = 0; i < ListView_Download_SongList_Info.Items.Count; i++)
                    {
                        temp.Add((ListView_Item_Bing)ListView_Download_SongList_Info.Items[i]);
                    }

                    listView_Item_Bing_ALL.listView_Temp_Info_End_Auto = null;
                    ListView_Download_SongList_Info.ItemsSource = null;
                    listView_Item_Bing_ALL.listView_Temp_Info_End_Auto = temp;

                    //我的收藏歌曲序号重构
                    //歌曲序号重构
                    for (int i = 0; i < listView_Item_Bing_ALL.listView_Temp_Info_End_Auto.Count; i++)
                    {
                        listView_Item_Bing_ALL.listView_Temp_Info_End_Auto.ElementAt(i).Song_No = i + 1;
                    }

                    ListView_Download_SongList_Info.ItemsSource = listView_Item_Bing_ALL.listView_Temp_Info_End_Auto;
                }
            }
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
    }
}
