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
    /// UserControl_音乐馆.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_音乐馆 : UserControl
    {
        public UserControl_音乐馆()
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
            ScrollViewer_5.Width = this.ActualWidth;
            ScrollViewer_6.Width = this.ActualWidth;
            ScrollViewer_7.Width = this.ActualWidth;
        }
    }
}
