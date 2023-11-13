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

namespace NSMusicS_For_WPF.Views.App_Left_Grid.App_Left_Grid_Of_Model_1
{
    /// <summary>
    /// App_Left_Grid_Of_Model_1_1_My_Music.xaml 的交互逻辑
    /// </summary>
    public partial class App_Left_Grid_Of_Model_1_1_My_Music : UserControl
    {
        public App_Left_Grid_Of_Model_1_1_My_Music()
        {
            InitializeComponent();

            userControl_Left_Bar_Button_1_My_Love.MouseLeftButtonDown += UserControl_Left_Bar_Button_1_My_Love_MouseLeftButtonDown;
            userControl_Left_Bar_Button_2_Local_Music.MouseLeftButtonDown += UserControl_Left_Bar_Button_2_Local_Music_MouseLeftButtonDown;
            userControl_Left_Bar_Button_3_Auto_List.MouseLeftButtonDown += UserControl_Left_Bar_Button_3_Auto_List_MouseLeftButtonDown;
            userControl_Left_Bar_Button_4_User_List.MouseLeftButtonDown += UserControl_Left_Bar_Button_4_User_List_MouseLeftButtonDown;
            userControl_Left_Bar_Button_5_K_Song.MouseLeftButtonDown += UserControl_Left_Bar_Button_5_K_Song_MouseLeftButtonDown;
            userControl_Left_Bar_Button_6_Identify_Song.MouseLeftButtonDown += UserControl_Left_Bar_Button_6_Identify_Song_MouseLeftButtonDown;
            userControl_Left_Bar_Button_7_Recommended_Songs.MouseLeftButtonDown += UserControl_Left_Bar_Button_7_Recommended_Songs_MouseLeftButtonDown;
            userControl_Left_Bar_Button_8_Score_Generation.MouseLeftButtonDown += UserControl_Left_Bar_Button_8_Score_Generation_MouseLeftButtonDown;
        }

        public void Check_False_ALL()
        {
            userControl_Left_Bar_Button_1_My_Love.Check_False();
            userControl_Left_Bar_Button_2_Local_Music.Check_False();
            userControl_Left_Bar_Button_3_Auto_List.Check_False();
            userControl_Left_Bar_Button_4_User_List.Check_False();
            userControl_Left_Bar_Button_5_K_Song.Check_False();
            userControl_Left_Bar_Button_6_Identify_Song.Check_False();
            userControl_Left_Bar_Button_7_Recommended_Songs.Check_False();
            userControl_Left_Bar_Button_8_Score_Generation.Check_False();
        }

        private void UserControl_Left_Bar_Button_1_My_Love_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Check_False_ALL();
            userControl_Left_Bar_Button_1_My_Love.Check_True();
        }
        private void UserControl_Left_Bar_Button_2_Local_Music_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Check_False_ALL();
            userControl_Left_Bar_Button_2_Local_Music.Check_True();
        }
        private void UserControl_Left_Bar_Button_3_Auto_List_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Check_False_ALL();
            userControl_Left_Bar_Button_3_Auto_List.Check_True();
        }
        private void UserControl_Left_Bar_Button_4_User_List_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Check_False_ALL();
            userControl_Left_Bar_Button_4_User_List.Check_True();
        }
        private void UserControl_Left_Bar_Button_5_K_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Check_False_ALL();
            userControl_Left_Bar_Button_5_K_Song.Check_True();
        }
        private void UserControl_Left_Bar_Button_6_Identify_Song_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Check_False_ALL();
            userControl_Left_Bar_Button_6_Identify_Song.Check_True();
        }
        private void UserControl_Left_Bar_Button_7_Recommended_Songs_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Check_False_ALL();
            userControl_Left_Bar_Button_7_Recommended_Songs.Check_True();
        }
        private void UserControl_Left_Bar_Button_8_Score_Generation_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Check_False_ALL();
            userControl_Left_Bar_Button_8_Score_Generation.Check_True();
        }

    }
}
