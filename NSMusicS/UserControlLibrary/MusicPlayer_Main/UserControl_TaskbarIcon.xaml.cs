using NSMusicS.Services.Services_For_API_GetResult;
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
    /// UserControl_TaskbarIcon.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_TaskbarIcon : UserControl
    {
        public UserControl_TaskbarIcon()
        {
            InitializeComponent();

            viewModule_Search_Song = ViewModule_Search_Song.Retuen_This();
            this.DataContext = ViewModule_Search_Song.Retuen_This();
        }
        ViewModule_Search_Song viewModule_Search_Song;
    }
}
