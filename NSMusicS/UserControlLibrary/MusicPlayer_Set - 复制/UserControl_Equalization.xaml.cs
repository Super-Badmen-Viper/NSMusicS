using NSMusicS.Models.Song_Audio_Out;
using NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls.VIewModules_AudioVisualizers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Forms;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using UserControl = System.Windows.Controls.UserControl;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Set
{
    /// <summary>
    /// UserControl_Equalization.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Equalization : UserControl
    {
        public UserControl_Equalization()
        {
            InitializeComponent();

            MediaElement_Song viewModel = MediaElement_Song.Retuen_This();
            this.DataContext = viewModel;
        }
    }
}
