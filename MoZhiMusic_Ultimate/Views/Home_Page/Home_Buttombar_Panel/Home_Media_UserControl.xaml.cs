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

namespace MoZhiMusic_Ultimate.Views.Home_Page.Home_Buttombar_Panel
{
    /// <summary>
    /// Home_Buttombar_UserControl.xaml 的交互逻辑
    /// </summary>
    public partial class Home_Media_UserControl : UserControl
    {
        public Home_Media_UserControl()
        {
            InitializeComponent();

            panel_Player_Normal.Button_Music_Order.Click += Button_Music_Order_Click;
            panel_Player_Normal.Button_Music_Voice_Speed.Click += Button_Music_Voice_Speed_Click;
        }

        private void Button_Music_Order_Click(object sender, RoutedEventArgs e)
        {
            if (panel_Player_SongOrder.Visibility == Visibility.Visible)
                panel_Player_SongOrder.Visibility = Visibility.Hidden;
            else
                panel_Player_SongOrder.Visibility = Visibility.Visible;
        }
        private void Button_Music_Voice_Speed_Click(object sender, RoutedEventArgs e)
        {
            if (panel_Playing_MediaVoice.Visibility == Visibility.Visible)
                panel_Playing_MediaVoice.Visibility = Visibility.Hidden;
            else
                panel_Playing_MediaVoice.Visibility = Visibility.Visible;
        }
    }
}
