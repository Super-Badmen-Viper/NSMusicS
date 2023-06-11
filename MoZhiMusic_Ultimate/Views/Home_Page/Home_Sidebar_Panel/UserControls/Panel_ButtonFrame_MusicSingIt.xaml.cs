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

namespace MoZhiMusic_Ultimate.Views.Home_Page.Home_Sidebar_Panel.UserControls
{
    /// <summary>
    /// Panel_ButtonFrame_MusicSingIt.xaml 的交互逻辑
    /// </summary>
    public partial class Panel_ButtonFrame_MusicSingIt : UserControl
    {
        public Panel_ButtonFrame_MusicSingIt()
        {
            InitializeComponent();
        }

        public bool BoolMouseLeftDown;

        private void UserControl_MouseEnter(object sender, MouseEventArgs e)
        {
            if (!BoolMouseLeftDown)
                Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#7F4C4C4C"));
        }

        private void UserControl_MouseLeave(object sender, MouseEventArgs e)
        {
            if (!BoolMouseLeftDown)
                Border_Hover_BackGround.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }
    }
}
