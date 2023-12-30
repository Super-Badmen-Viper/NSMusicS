using NSMusicS.UserControlLibrary.MusicPlayer_Main.MusicPlayer_Model_Control_Albums.ViewModel_Assembly_Album_Show;
using NSMusicS.UserControlLibrary.MusicPlayer_Main.MusicPlayer_Model_Control_Singers.ViewModel_Assembly_Singer_Show;
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

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main
{
    /// <summary>
    /// MusicPlayer_Model_3_Singer_UserControl.xaml 的交互逻辑
    /// </summary>
    public partial class MusicPlayer_Model_3_Singer_UserControl : UserControl
    {
        public MusicPlayer_Model_3_Singer_UserControl()
        {
            InitializeComponent();

            viewModel_Assembly_Singer_Class = ViewModel_Assembly_Singer_Class.Retuen_This();

            this.DataContext = viewModel_Assembly_Singer_Class;
            this.ItemsControl_AlbumList.ItemsSource = viewModel_Assembly_Singer_Class.Singer_Infos;
        }
        ViewModel_Assembly_Singer_Class viewModel_Assembly_Singer_Class;
    }
}
