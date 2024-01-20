using NSMusicS.Models.Servies_For_API_Info;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Net.Http;
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
using static NSMusicS.Models.Servies_For_API_Info.API_Song_Info;
using CommunityToolkit.Mvvm.Input;
using GalaSoft.MvvmLight;
using MaterialDesignThemes.Wpf.Transitions;
using NSMusicS.Models.Song_Json_To_WebAPI;
using NSMusicS.Models.Song_List_Infos;
using Newtonsoft.Json;
using NSMusicS.Services.Services_For_API_GetResult;

namespace NSMusicS.UserControlLibrary.MainWindow_TOP_UserControls
{
    /// <summary>
    /// UserControl_ButtonFrame_TopPanel.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_ButtonFrame_TopPanel : UserControl
    {
        public UserControl_ButtonFrame_TopPanel()
        {
            InitializeComponent();

            viewModule_Search_Song = ViewModule_Search_Song.Retuen_This();
            viewModule_Search_Song.Show_API_HttpClient_Complete = Visibility.Collapsed;
            this.DataContext = ViewModule_Search_Song.Retuen_This();

            SvgViewbox_Button_Search.Source = new Uri(@"Resources\\UI_SVG\\FFFFFF\\搜索01.svg", UriKind.Relative);
            SvgViewbox_Button_Setting.Source = new Uri(@"Resources\\UI_SVG\\FFFFFF\\设置.svg", UriKind.Relative);
            SvgViewbox_Button_Skin.Source = new Uri(@"Resources\\UI_SVG\\FFFFFF\\皮肤.svg", UriKind.Relative);
            SvgViewbox_Button_Min.Source = new Uri(@"Resources\\UI_SVG\\FFFFFF\\最小化.svg", UriKind.Relative);
            SvgViewbox_Button_Max.Source = new Uri(@"Resources\\UI_SVG\\FFFFFF\\最大化.svg", UriKind.Relative);
            SvgViewbox_Button_Exit.Source = new Uri(@"Resources\\UI_SVG\\FFFFFF\\启动.svg", UriKind.Relative);

            Model_1.MouseLeftButtonDown += Model_1_MouseLeftButtonDown;
            Model_2.MouseLeftButtonDown += Model_2_MouseLeftButtonDown;
            Model_3.MouseLeftButtonDown += Model_3_MouseLeftButtonDown;
            Model_4.MouseLeftButtonDown += Model_4_MouseLeftButtonDown;
        }
        ViewModule_Search_Song viewModule_Search_Song;

        public void Check_False_ALL()
        {
            Model_1.Check_False();
            Model_2.Check_False();
            Model_3.Check_False();
            Model_4.Check_False();
        }

        private void Model_1_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Check_False_ALL();
            Model_1.Check_True();
        }
        private void Model_2_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Check_False_ALL();
            Model_2.Check_True();
        }
        private void Model_3_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Check_False_ALL();
            Model_3.Check_True();
        }
        private void Model_4_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            Check_False_ALL();
            Model_4.Check_True();
        }
    }
}
