using ImageMagick;
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

namespace NSMusicS.Helper_UserControlLibrary.音乐馆
{
    /// <summary>
    /// UserControl_分类歌单.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_分类歌单 : UserControl
    {
        public UserControl_分类歌单()
        {
            InitializeComponent();

            JpgSize = GetJpgSizeByMagickImage(Path_App + @"\Button_Image_Ico\1_分类歌单.jpg", /*out*/ JpgSize, /*out*/ Wpx, /*out*/ Hpx);
            if (JpgSize.Height != 0)
                nums_1 = JpgSize.Width / JpgSize.Height;
            JpgSize = GetJpgSizeByMagickImage(Path_App + @"\Button_Image_Ico\2_分类歌单.jpg", /*out*/ JpgSize, /*out*/ Wpx, /*out*/ Hpx);
            if (JpgSize.Height != 0)
                nums_2 = JpgSize.Width / JpgSize.Height;
            JpgSize = GetJpgSizeByMagickImage(Path_App + @"\Button_Image_Ico\3_分类歌单.jpg", /*out*/ JpgSize, /*out*/ Wpx, /*out*/ Hpx);
            if (JpgSize.Height != 0)
                nums_3 = JpgSize.Width / JpgSize.Height;

            Image_.Source = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\1_分类歌单.jpg"));
        }

        Size JpgSize;
        double Wpx;
        double Hpx;
        public static double nums_1 = 0.553;//1061 * 1917
        public static double nums_2 = 0.678;//1326 * 1954
        public static double nums_3 = 0.966;//2631 * 2722
        string Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";
        int Image_Num = 1;//控件大小调整时，不用一直刷新Image_.Source图片，节省资源

        private void UserControl_SizeChanged(object sender, SizeChangedEventArgs e)
        {
            if (this.ActualWidth >= 1150)
            {
                if (Image_Num != 3)
                {
                    Image_.Source = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\3_分类歌单.jpg"));
                }
                Grid_This_Background.Height = Grid_This_Background.ActualWidth / nums_3;
                Image_Num = 3;
            }
            else if (this.ActualWidth >= 943)
            {
                if (Image_Num != 2)
                {
                    Image_.Source = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\2_分类歌单.jpg"));
                }
                Grid_This_Background.Height = Grid_This_Background.ActualWidth / nums_2;
                Image_Num = 2;
            }
            else
            {
                if (Image_Num != 1)
                {
                    Image_.Source = new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\1_分类歌单.jpg"));
                }
                Grid_This_Background.Height = Grid_This_Background.ActualWidth / nums_1;
                Image_Num = 1;
            }

            if (Grid_This_Background.ActualWidth > 0)
            {
                //减一，保持Image_的大小随ActualWidth变化
                Image_.Width = Grid_This_Background.ActualWidth - 1;
                Image_.Height = Grid_This_Background.ActualHeight - 1;

            }

            //Thread.Sleep(10);
        }

        private void Grid_This_Background_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            MessageBox.Show("此功能未开发");
        }

        public static Size GetJpgSizeByMagickImage(string JpgPath, /*out*/ Size JpgSize, /*out*/ double Wpx, /*out*/ double Hpx)
        {
            try
            {
                MagickImageInfo image = new MagickImageInfo(JpgPath);
                int w = image.Width;//宽
                int h = image.Height;//高
                JpgSize = new Size(w, h);
                Wpx = image.Density.X;//分辨率
                Hpx = image.Density.Y;//分辨率
                if (image.Density.Units == DensityUnit.PixelsPerCentimeter)//判断分辨率单位
                {
                    Wpx *= 2.54;
                    Hpx *= 2.54;
                }
            }
            catch
            {
                JpgSize = new Size(0, 0);
                Wpx = 0; Hpx = 0;
            }

            return JpgSize;
        }

    }
}
