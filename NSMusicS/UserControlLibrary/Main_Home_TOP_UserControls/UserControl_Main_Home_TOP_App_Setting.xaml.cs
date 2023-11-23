using NSMusicS.UserControlLibrary.Main_Home_TOP_UserControls.UserControls_App_Setting;
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

namespace NSMusicS.UserControlLibrary.Main_Home_TOP_UserControls
{
    /// <summary>
    /// UserControl_Main_Home_TOP_App_Setting.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Main_Home_TOP_App_Setting : UserControl
    {
        public UserControl_Main_Home_TOP_App_Setting()
        {
            InitializeComponent();

            Select_Set_Panel_For_Set_1_Normal_Set.IsEnabled = false;
            Select_Set_Panel_For_Set_2_Download_And_Caching.IsEnabled = false;
            Select_Set_Panel_For_Set_3_Hot_Keys.IsEnabled = false;
            Select_Set_Panel_For_Set_4_Player_Lyic.IsEnabled = false;
            Select_Set_Panel_For_Set_5_Window_Lyic.IsEnabled = false;
            Select_Set_Panel_For_Set_6_Audio.IsEnabled = true;
            Select_Set_Panel_For_Set_7_Web.IsEnabled = false;
        }

        public void Clear_Selected_Set_Panel_For_Selected()
        {
            userControl_Set_1_Normal_Set.Visibility = Visibility.Collapsed;
            userControl_Set_2_Download_And_Caching.Visibility = Visibility.Collapsed;
            userControl_Set_3_Hot_Keys.Visibility = Visibility.Collapsed;
            userControl_Set_4_Player_Lyic.Visibility = Visibility.Collapsed;
            userControl_Set_5_Window_Lyic.Visibility = Visibility.Collapsed;
            userControl_Set_6_Audio.Visibility = Visibility.Collapsed;
            userControl_Set_7_Web.Visibility = Visibility.Collapsed;
        }

        private void Select_Set_Panel_For_Set_1_Normal_Set_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Clear_Selected_Set_Panel_For_Selected();

            userControl_Set_1_Normal_Set.Visibility = Visibility.Visible;
        }
        private void Select_Set_Panel_For_Set_2_Download_And_Caching_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Clear_Selected_Set_Panel_For_Selected();

            userControl_Set_2_Download_And_Caching.Visibility = Visibility.Visible;
        }
        private void Select_Set_Panel_For_Set_3_Hot_Keys_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Clear_Selected_Set_Panel_For_Selected();

            userControl_Set_3_Hot_Keys.Visibility = Visibility.Visible;
        }
        private void Select_Set_Panel_For_Set_4_Player_Lyic_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Clear_Selected_Set_Panel_For_Selected();

            userControl_Set_4_Player_Lyic.Visibility = Visibility.Visible;
        }
        private void Select_Set_Panel_For_Set_5_Window_Lyic_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Clear_Selected_Set_Panel_For_Selected();

            userControl_Set_5_Window_Lyic.Visibility = Visibility.Visible;
        }
        private void Select_Set_Panel_For_Set_6_Audio_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Clear_Selected_Set_Panel_For_Selected();

            userControl_Set_6_Audio.Visibility = Visibility.Visible;
        }
        private void Select_Set_Panel_For_Set_7_Web_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Clear_Selected_Set_Panel_For_Selected();

            userControl_Set_7_Web.Visibility = Visibility.Visible;
        }


    }
}
