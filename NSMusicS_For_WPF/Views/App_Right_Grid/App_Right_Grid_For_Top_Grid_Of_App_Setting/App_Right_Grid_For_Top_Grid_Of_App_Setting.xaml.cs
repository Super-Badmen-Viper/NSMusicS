using NSMusicS_For_WPF.VIewModels.Button;
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

namespace NSMusicS_For_WPF.Views.App_Right_Grid.App_Right_Grid_For_Top_Grid_Of_App_Setting
{
    /// <summary>
    /// App_Right_Grid_For_Top_Grid_Of_App_Setting.xaml 的交互逻辑
    /// </summary>
    public partial class App_Right_Grid_For_Top_Grid_Of_App_Setting : UserControl
    {
        public App_Right_Grid_For_Top_Grid_Of_App_Setting()
        {
            InitializeComponent();

            SvgViewbox_Button_Search.Source = new Uri(@"Resources\\UI_SVG\\7B8290\\搜索01.svg", UriKind.Relative);
            SvgViewbox_Button_Setting.Source = new Uri(@"Resources\\UI_SVG\\7B8290\\设置.svg", UriKind.Relative);
            SvgViewbox_Button_Skin.Source = new Uri(@"Resources\\UI_SVG\\7B8290\\皮肤.svg", UriKind.Relative);
            SvgViewbox_Button_Min.Source = new Uri(@"Resources\\UI_SVG\\7B8290\\最小化.svg", UriKind.Relative);
            SvgViewbox_Button_Max.Source = new Uri(@"Resources\\UI_SVG\\7B8290\\最大化.svg", UriKind.Relative);
            SvgViewbox_Button_Close.Source = new Uri(@"Resources\\UI_SVG\\7B8290\\关闭.svg", UriKind.Relative);
            SvgViewbox_Button_Exit.Source = new Uri(@"Resources\\UI_SVG\\7B8290\\启动.svg", UriKind.Relative);

            userControl_Top_Bar_Button_1_Model_Single.MouseLeftButtonDown += UserControl_Top_Bar_Button_1_Model_Single_MouseLeftButtonDown;
            userControl_Top_Bar_Button_2_Model_Album.MouseLeftButtonDown += UserControl_Top_Bar_Button_2_Model_Album_MouseLeftButtonDown;
            userControl_Top_Bar_Button_3_Model_Music_library.MouseLeftButtonDown += UserControl_Top_Bar_Button_3_Model_Music_library_MouseLeftButtonDown;
            userControl_Top_Bar_Button_4_Model_NAS.MouseLeftButtonDown += UserControl_Top_Bar_Button_4_Model_NAS_MouseLeftButtonDown;
        }

        public void Check_False_ALL()
        {
            userControl_Top_Bar_Button_1_Model_Single.Check_False();
            userControl_Top_Bar_Button_2_Model_Album.Check_False();
            userControl_Top_Bar_Button_3_Model_Music_library.Check_False();
            userControl_Top_Bar_Button_4_Model_NAS.Check_False();
        }

        private void UserControl_Top_Bar_Button_1_Model_Single_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Check_False_ALL();
            userControl_Top_Bar_Button_1_Model_Single.Check_True();
        }
        private void UserControl_Top_Bar_Button_2_Model_Album_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Check_False_ALL();
            userControl_Top_Bar_Button_2_Model_Album.Check_True();
        }
        private void UserControl_Top_Bar_Button_3_Model_Music_library_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Check_False_ALL();
            userControl_Top_Bar_Button_3_Model_Music_library.Check_True();
        }
        private void UserControl_Top_Bar_Button_4_Model_NAS_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Check_False_ALL();
            userControl_Top_Bar_Button_4_Model_NAS.Check_True();
        }

        

        
    }
}
