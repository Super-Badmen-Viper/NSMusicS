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
    /// UserControl_Left_Bar_Button_8_Score_Generation.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Left_Bar_Button_8_Score_Generation : UserControl
    {
        public UserControl_Left_Bar_Button_8_Score_Generation()
        {
            InitializeComponent();

            // Auto Setting
            SvgViewbox_Button.Source = brush_MouseNormal;
            Text_Button.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#646B7C"));
            // Define the gradient stops
            backgroundLinearBrush.GradientStops.Add(new GradientStop(Color.FromArgb(153, 255, 0, 77), 0));
            backgroundLinearBrush.GradientStops.Add(new GradientStop(Color.FromArgb(153, 255, 34, 34), 0.5096));
            backgroundLinearBrush.GradientStops.Add(new GradientStop(Color.FromArgb(153, 236, 0, 43), 1));
            // Set the gradient direction
            backgroundLinearBrush.StartPoint = new System.Windows.Point(0, 0);
            backgroundLinearBrush.EndPoint = new System.Windows.Point(1, 0);

            this.MouseMove += UserControl_Left_Bar_Button_2_Local_Music_MouseMove; ;
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

        public Uri brush_MouseEnter
           = new Uri(@"Resources\\UI_SVG\\FFFFFF\\乐谱.svg", UriKind.Relative);
        public Uri brush_MouseNormal
            = new Uri(@"Resources\\UI_SVG\\FFFFFF\\乐谱.svg", UriKind.Relative);
        public LinearGradientBrush backgroundLinearBrush = new LinearGradientBrush();

        public void Check_True()
        {
            BackGround_Button.Background = backgroundLinearBrush;
            SvgViewbox_Button.Source = brush_MouseEnter;
            Text_Button.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FFFFFF"));

            lock_Select = true;
        }
        public void Check_False()
        {
            BackGround_Button.Background = null;
            SvgViewbox_Button.Source = brush_MouseNormal;
            Text_Button.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#646B7C"));

            lock_Select = false;
        }
    }
}
