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

namespace NSMusicS_For_WPF.VIewModels.Button
{
    /// <summary>
    /// UserControl_Top_Bar_Button_4_Model_NAS.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Top_Bar_Button_4_Model_NAS : UserControl
    {
        public UserControl_Top_Bar_Button_4_Model_NAS()
        {
            InitializeComponent();

            Check_Selected.Visibility = Visibility.Collapsed;

            this.MouseMove += UserControl_Left_Bar_Button_2_Local_Music_MouseMove;
            this.MouseLeave += UserControl_Left_Bar_Button_2_Local_Music_MouseLeave;
        }
        bool MouseUp = false;
        bool lock_Select = false;
        private void UserControl_Left_Bar_Button_2_Local_Music_MouseMove(object sender, MouseEventArgs e)
        {
            if (BackGround_Button.Background == null && lock_Select == false)
            {
                BackGround_Button.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#E4E8EC"));
                MouseUp = true;
            }
        }
        private void UserControl_Left_Bar_Button_2_Local_Music_MouseLeave(object sender, MouseEventArgs e)
        {
            if (MouseUp && lock_Select == false)
            {
                BackGround_Button.Background = null;
                MouseUp = false;
            }
        }

        public void Check_True()
        {
            Check_Selected.Visibility = Visibility.Visible;
            Text_Button.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#333333"));

            lock_Select = true;
        }
        public void Check_False()
        {
            Check_Selected.Visibility = Visibility.Collapsed;
            Text_Button.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#ADADAD"));
            BackGround_Button.Background = null;

            lock_Select = false;    
        }
    }
}
