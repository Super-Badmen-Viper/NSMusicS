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
        }
        ViewModule_Search_Song viewModule_Search_Song;
    }
}
