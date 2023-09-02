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
    }
}
