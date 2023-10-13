using NSMusicS.UserControlLibrary.MusicPlayer_Main;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace NSMusicS
{
    /// <summary>
    /// MainWindow_NSMusicS.xaml 的交互逻辑
    /// </summary>
    public partial class MainWindow_NSMusicS : Window
    {
        public MainWindow_NSMusicS()
        {
            InitializeComponent();
        }

        #region Windows_Set

        private void Window_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            try
            {
                this.DragMove();
            }
            catch { }
        }

        private void Window_SizeChanged(object sender, SizeChangedEventArgs e)
        {
            Size_Changed();
        }
        #region Size_Changed
        public void Size_Changed()
        {
            
        }
        #endregion

        private void Window_Closed(object sender, EventArgs e)
        {

        }

        #endregion



    }
}
