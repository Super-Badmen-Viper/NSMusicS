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

namespace NSMusicS.UserControlLibrary.Main_UserControls
{
    /// <summary>
    /// UserControl_Select_Folder_Of_SongAdd.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Select_Folder_Of_SongAdd : UserControl
    {
        public UserControl_Select_Folder_Of_SongAdd()
        {
            InitializeComponent();
        }

        private void Button_This_CLose_Click(object sender, RoutedEventArgs e)
        {
            this.Visibility = Visibility.Collapsed;
        }
    }
}
