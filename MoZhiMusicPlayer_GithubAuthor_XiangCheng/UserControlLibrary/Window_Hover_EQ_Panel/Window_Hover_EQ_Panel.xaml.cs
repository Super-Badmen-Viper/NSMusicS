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
using System.Windows.Shapes;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_Audio_Out;


namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.Window_Hover_EQ_Panel
{
    /// <summary>
    /// Window_Hover_EQ_Panel.xaml 的交互逻辑
    /// </summary>
    public partial class Window_Hover_EQ_Panel : Window
    {
        public Window_Hover_EQ_Panel()
        {
            InitializeComponent();

            MediaElement_Song viewModel = MediaElement_Song.Retuen_This();
            this.DataContext = viewModel;

            Slider_Model_1_Eq_Num31.ValueChanged += Slider_Model_1_Eq_Num31_ValueChanged;
            Slider_Model_1_Eq_Num62.ValueChanged += Slider_Model_1_Eq_Num62_ValueChanged;
            Slider_Model_1_Eq_Num125.ValueChanged += Slider_Model_1_Eq_Num125_ValueChanged;
            Slider_Model_1_Eq_Num250.ValueChanged += Slider_Model_1_Eq_Num250_ValueChanged;
            Slider_Model_1_Eq_Num500.ValueChanged += Slider_Model_1_Eq_Num500_ValueChanged;
            Slider_Model_1_Eq_Num1k.ValueChanged += Slider_Model_1_Eq_Num1k_ValueChanged;
            Slider_Model_1_Eq_Num2k.ValueChanged += Slider_Model_1_Eq_Num2k_ValueChanged;
            Slider_Model_1_Eq_Num4k.ValueChanged += Slider_Model_1_Eq_Num4k_ValueChanged;
            Slider_Model_1_Eq_Num8k.ValueChanged += Slider_Model_1_Eq_Num8k_ValueChanged;
            Slider_Model_1_Eq_Num16k.ValueChanged += Slider_Model_1_Eq_Num16k_ValueChanged;
            Slider_Model_1_Eq_Num20k.ValueChanged += Slider_Model_1_Eq_Num20k_ValueChanged;
        }

        private void Slider_Model_1_Eq_Num31_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            
        }
        private void Slider_Model_1_Eq_Num62_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            
        }
        private void Slider_Model_1_Eq_Num125_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            
        }
        private void Slider_Model_1_Eq_Num250_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            
        }
        private void Slider_Model_1_Eq_Num500_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            
        }
        private void Slider_Model_1_Eq_Num1k_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            
        }
        private void Slider_Model_1_Eq_Num2k_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            
        }
        private void Slider_Model_1_Eq_Num4k_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            Text_Model_1_Eq_Num4k.Text = Slider_Model_1_Eq_Num4k.Value.ToString();
        }
        private void Slider_Model_1_Eq_Num8k_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            Text_Model_1_Eq_Num8k.Text = Slider_Model_1_Eq_Num8k.Value.ToString();
        }
        private void Slider_Model_1_Eq_Num16k_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            Text_Model_1_Eq_Num16k.Text = Slider_Model_1_Eq_Num16k.Value.ToString();
        }
        private void Slider_Model_1_Eq_Num20k_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            Text_Model_1_Eq_Num20k.Text = Slider_Model_1_Eq_Num20k.Value.ToString();
        }

        /// <summary>
        /// 拖动窗口
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Window_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            try
            {
                this.DragMove();
            }
            catch { }
        }

        private void Slider_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {

        }

        private void SvgViewbox_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            this.Visibility = Visibility.Collapsed;
        }
    }
}
