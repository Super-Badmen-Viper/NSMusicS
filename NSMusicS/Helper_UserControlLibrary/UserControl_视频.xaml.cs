using NSMusicS.UserControlLibrary.MusicPlayer_MV_Player.MainWindow_Top_MediaMV;
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

namespace NSMusicS.Helper_UserControlLibrary
{
    /// <summary>
    /// UserControl_视频.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_视频 : UserControl
    {
        public UserControl_视频()
        {
            InitializeComponent();
        }

        string Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";

        private void TabItem_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            //Frame_Select_TabItem.Source = new Uri(@"/NSMusicS;component/Helper_UserControlLibrary/音乐馆/UserControl_精选.xaml");
        }



        private void UserControl_SizeChanged(object sender, SizeChangedEventArgs e)
        {
            ScrollViewer_1.Width = this.ActualWidth;
            ScrollViewer_2.Width = this.ActualWidth;
            ScrollViewer_3.Width = this.ActualWidth;
            ScrollViewer_4.Width = this.ActualWidth;
        }

        

        /*private void TextBlock_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            //StackPanel_MvPlayer.Visibility = Visibility.Visible;    

            musicPlayer_MV_Player_UserControl.userControl_MediaMV.MediaMent_MV.Source = new Uri(Path_App + @"/MV/AOA - 짧은 치마 (Miniskirt) Music Video Teaser Drama ver..mp4");
            musicPlayer_MV_Player_UserControl.userControl_MediaMV.MediaMent_MV.Play();
            musicPlayer_MV_Player_UserControl.userControl_MediaMV.MediaMent_MV.LoadedBehavior = MediaState.Play;
            musicPlayer_MV_Player_UserControl.userControl_MediaMV.dispatcherTimer_Silder.Start();
        }*/
    }
}
