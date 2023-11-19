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

namespace MoZhi_Song_Duration_Allocation.UserControlLibrary.MainWindow_Right_SongAlbum
{
    /// <summary>
    /// UserControl_SongImage_Media_Buttons.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_SongImage_Media_Buttons : UserControl
    {
        public UserControl_SongImage_Media_Buttons()
        {
            InitializeComponent();

            Init();
        }

        private void Init()
        {
            Border_ImageMove_MouseEventArgs.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
            Grid_Button.Visibility = Visibility.Hidden;
        }

        private void UserControl_MouseMove(object sender, MouseEventArgs e)
        {
            Border_ImageMove_MouseEventArgs.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#4C000000"));
            Grid_Button.Visibility = Visibility.Visible;
        }

        private void UserControl_MouseLeave(object sender, MouseEventArgs e)
        {
            Border_ImageMove_MouseEventArgs.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
            Grid_Button.Visibility = Visibility.Hidden;
        }
    }
}
