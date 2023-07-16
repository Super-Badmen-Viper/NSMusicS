using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.APP_Personalized_Skin;
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

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.Main_Home_TOP_UserControls
{
    /// <summary>
    /// UserControl_Main_Home_TOP_Personalized_Skins.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Main_Home_TOP_Personalized_Skins : UserControl
    {
        public UserControl_Main_Home_TOP_Personalized_Skins()
        {
            InitializeComponent();

            //ImageBrush_this_app_Background.ImageSource = new BitmapImage(new Uri(""));
        }

        // 霜秋白
        public Skin skin_0 = new Skin()
        {
            Sidebar_Background = "#F6F6F6",
            Frame_Background = "#FAFAFA"
        };

        // 玄武黑
        public Skin skin_1 = new Skin()
        {
            Sidebar_Background = "#171718",
            Frame_Background = "#1E1E20"
        };

        // 用户自定义
        public ImageBrush ImageBrush_this_app_Background = new ImageBrush();
    }
}
