using NSMusicS.Services.Services_For_API_GetResult;
using NSMusicS.UserControlLibrary.Main_UserControls;
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

namespace NSMusicS.UserControlLibrary.Window_Hover_MRC_Panel
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

            Panel_Player_Set.Visibility = Visibility.Collapsed;
            Panel_DeskLyic_Setting.Visibility = Visibility.Collapsed;

            SvgViewbox_Button_Lock_Lyic.Source = brush_Lock_True;

            viewModule_Search_Song = ViewModule_Search_Song.Retuen_This();
            this.DataContext = ViewModule_Search_Song.Retuen_This();
        }
        ViewModule_Search_Song viewModule_Search_Song;

        public bool Bool_Open_MRC_Panel;

        public Uri brush_Lock_True
            = new Uri(@"Resource\\Button_Image_Svg\\锁定.svg", UriKind.Relative);
        public Uri brush_Lock_False
            = new Uri(@"Resource\\Button_Image_Svg\\解锁.svg", UriKind.Relative);

        /// <summary>
        /// 拖动窗口
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Window_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            try
            {
                if (SvgViewbox_Button_Lock_Lyic.Source == brush_Lock_True)
                {
                    this.DragMove();
                }
            }
            catch { }
        }

        private void Window_Desk_MRC1_MouseLeave(object sender, MouseEventArgs e)
        {
            if (SvgViewbox_Button_Lock_Lyic.Source == brush_Lock_True)
            {
                //#A8343434
                Panel_Lyic_Show.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));

                Panel_Player_Set.Visibility = Visibility.Collapsed;
                Panel_DeskLyic_Setting.Visibility = Visibility.Collapsed;
            }
        }

        private void Panel_DeskLyic_Setting_MouseLeave(object sender, MouseEventArgs e)
        {
            //Panel_DeskLyic_Setting.Visibility = Visibility.Collapsed;
        }
        private void Window_Desk_MRC1_MouseMove(object sender, MouseEventArgs e)
        {
            if (SvgViewbox_Button_Lock_Lyic.Source == brush_Lock_True)
            {
                //#A8343434
                Panel_Lyic_Show.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#A8343434"));

                Panel_Player_Set.Visibility = Visibility.Visible;
            }
        }


        private void Lyic_FontSize_Up_MouseMove(object sender, MouseEventArgs e)
        {
            if (SvgViewbox_Button_Lock_Lyic.Source == brush_Lock_True)
            {
                Lyic_FontSize_Up.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#F3F3F3"));
            }
        }
        private void Lyic_FontSize_Up_MouseLeave(object sender, MouseEventArgs e)
        {
            Lyic_FontSize_Up.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }

        private void Lyic_FontSize_Down_MouseMove(object sender, MouseEventArgs e)
        {
            if (SvgViewbox_Button_Lock_Lyic.Source == brush_Lock_True)
            {
                Lyic_FontSize_Down.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#F3F3F3"));
            }
        }
        private void Lyic_FontSize_Down_MouseLeave(object sender, MouseEventArgs e)
        {
            Lyic_FontSize_Down.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }

        private void Lyic_FontColor_Set_MouseMove(object sender, MouseEventArgs e)
        {
            if (SvgViewbox_Button_Lock_Lyic.Source == brush_Lock_True)
            {
                Lyic_FontColor_Set.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#F3F3F3"));
            }
        }
        private void Lyic_FontColor_Set_MouseLeave(object sender, MouseEventArgs e)
        {
            Lyic_FontColor_Set.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }

        private void Lyic_LineNum_Set_MouseMove(object sender, MouseEventArgs e)
        {
            if (SvgViewbox_Button_Lock_Lyic.Source == brush_Lock_True)
            {
                Lyic_LineNum_Set.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#F3F3F3"));
            }
        }
        private void Lyic_LineNum_Set_MouseLeave(object sender, MouseEventArgs e)
        {
            Lyic_LineNum_Set.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00000000"));
        }

        private void Lyic_FontSize_Up_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            int fontsize = (int)TextBlock_1.FontSize;
            fontsize++;
            TextBlock_1.FontSize = fontsize;
            TextBlock_2.FontSize = fontsize;

            for (int i = 0; i < StackPanel_Lyic.Children.Count; i++)
            {
                UserControl_Mrc_Byte _Mrc_Byte = (UserControl_Mrc_Byte)StackPanel_Lyic.Children[i];
                _Mrc_Byte.FontSize = fontsize;
            }
        }

        private void Lyic_FontSize_Down_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            int fontsize = (int)TextBlock_1.FontSize;
            fontsize--;
            TextBlock_1.FontSize = fontsize;
            TextBlock_2.FontSize = fontsize;

            for (int i = 0; i < StackPanel_Lyic.Children.Count; i++)
            {
                UserControl_Mrc_Byte _Mrc_Byte = (UserControl_Mrc_Byte)StackPanel_Lyic.Children[i];
                _Mrc_Byte.FontSize = fontsize;
            }
        }

        private void Lyic_FontColor_Set_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {

        }

        private void Lyic_LineNum_Set_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if(TextBlock_2.Visibility == Visibility.Visible)
            {
                TextBlock_Panel_1.Visibility = Visibility.Collapsed;
                TextBlock_2.Visibility = Visibility.Collapsed;
                Lyic_LineNum_Set.Text = "双行歌词";
            }
            else
            {
                TextBlock_Panel_1.Visibility = Visibility.Visible;
                TextBlock_2.Visibility = Visibility.Visible;
                Lyic_LineNum_Set.Text = "单行歌词";
            }
        }

        private void Button_Lyic_Setting_Click(object sender, RoutedEventArgs e)
        {
            if(Panel_DeskLyic_Setting.Visibility == Visibility.Visible)
            {
                Panel_DeskLyic_Setting.Visibility = Visibility.Collapsed;
            }
            else
            {
                Panel_DeskLyic_Setting.Visibility = Visibility.Visible;
            }
        }
    }
}
