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

namespace NSMusicS_For_WPF
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            Init_System();
        }

        #region System
        private void Init_System()
        {
            this.MouseLeftButtonDown += Window_MouseMove;
            app_Right_Grid_For_Top_Grid_Of_App_Setting.Button_Min.MouseLeftButtonDown += Window_Min;
            app_Right_Grid_For_Top_Grid_Of_App_Setting.Button_Max.MouseLeftButtonDown += Window_Max;
            app_Right_Grid_For_Top_Grid_Of_App_Setting.Button_Close.MouseLeftButtonDown += Window_Close;
            app_Right_Grid_For_Top_Grid_Of_App_Setting.Button_Exit.MouseLeftButtonDown += Window_Exit;
        }
        private void Window_MouseMove(object sender, MouseButtonEventArgs e)
        {
            try{this.DragMove();}catch { }
        }
        private void Window_Min(object sender, MouseButtonEventArgs e)
        {
            this.WindowState = System.Windows.WindowState.Minimized;
        }
        private void Window_Max(object sender, MouseButtonEventArgs e)
        {
            if (this.WindowState == System.Windows.WindowState.Maximized)
            {
                this.WindowState = System.Windows.WindowState.Normal;
            }
            else
            {
                this.WindowState = System.Windows.WindowState.Maximized;
            }
        }
        private void Window_Close(object sender, MouseButtonEventArgs e)
        {
            this.WindowState = System.Windows.WindowState.Minimized;
        }
        private void Window_Exit(object sender, MouseButtonEventArgs e)
        {
            Environment.Exit(-1);
        }
        #endregion
    }
}
