using MoZhiMusic_Ultimate.Models.Song_List_Infos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace MoZhiMusic_Ultimate.Views.SongList_Page
{
    /// <summary>
    /// SongList_Page_Local.xaml 的交互逻辑
    /// </summary>
    public partial class SongList_Page_Local : UserControl
    {
        public SongList_Page_Local()
        {
            InitializeComponent();
        }

        /// <summary>
        /// 单选框选中  所有/取消 歌曲
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void SelectAll_Checked(object sender, RoutedEventArgs e)
        {
            List<Song_Info> temp = (List<Song_Info>)Data_Grid_SongList.ItemsSource;
            for (int i = 0; i < temp.Count; i++)
            {
                var item = temp[i];
                Song_Info dataModel = item as Song_Info;
                dataModel.IsChecked = true;
                item = dataModel;
                temp[i] = item;
            }
            Data_Grid_SongList.ItemsSource = null;
            Data_Grid_SongList.ItemsSource = temp;
        }
        private void SelectAll_Unchecked(object sender, RoutedEventArgs e)
        {
            SelectAll_Unchecked();
        }
        private void SelectAll_Unchecked()
        {
            List<Song_Info> temp = (List<Song_Info>)Data_Grid_SongList.ItemsSource;
            for (int i = 0; i < temp.Count; i++)
            {
                var item = temp[i];
                Song_Info dataModel = item as Song_Info;
                dataModel.IsChecked = false;
                item = dataModel;
                temp[i] = item;
            }
            Data_Grid_SongList.ItemsSource = null;
            Data_Grid_SongList.ItemsSource = temp;
        }




        /// <summary>
        /// 删除选中项
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Delete_Click(object sender, MouseButtonEventArgs e)
        {

        }
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


        private void Stack_Button_LotSelects_Take_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Grid_NormalModel_1.Visibility = Visibility.Hidden;
            Grid_NormalModel_2.Visibility = Visibility.Hidden;
            Grid_ListItem_CrudModel_1.Margin = new Thickness(0, 90, 0, 0);
            Grid_ListItem_CrudModel_2.Visibility = Visibility.Visible;

            Data_Grid_SongList.Columns[0].Visibility = Visibility.Visible;
            Data_Grid_SongList.SelectedIndex = -1;
        }

        private void Stack_Button_Exit_LotLItemCrud_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Grid_NormalModel_1.Visibility = Visibility.Visible;
            Grid_NormalModel_2.Visibility = Visibility.Visible;
            Grid_ListItem_CrudModel_1.Margin = new Thickness(0, 180, 0, 0);
            Grid_ListItem_CrudModel_2.Visibility = Visibility.Hidden;
            Data_Grid_SongList.Columns[0].Visibility = Visibility.Collapsed;

            //取消选中
            SelectAll_Unchecked();
        }
    }
}
