using System;
using System.Collections.Generic;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace 墨智音乐_3._0._1.UserControlLibrary.Window_Hover_MRC_Panel
{
    /// <summary>
    /// Window1.xaml 的交互逻辑
    /// </summary>
    public partial class Window_Hover_MRC_Panel : Window
    {
        public Window_Hover_MRC_Panel()
        {
            InitializeComponent();

            //不显示在任务栏
            this.ShowInTaskbar = false;

            //窗口顶层
            this.Topmost = true;

            //禁止最大化，不允许修改大小
            this.ResizeMode = ResizeMode.NoResize;
        }

        public bool Bool_Open_MRC_Panel;

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

        private void Window_Desk_MRC1_MouseLeave(object sender, MouseEventArgs e)
        {
            //#A8343434
            this.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }

        private void Window_Desk_MRC1_MouseMove(object sender, MouseEventArgs e)
        {
            //#A8343434
            this.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#A8343434"));
        }
    }
}
