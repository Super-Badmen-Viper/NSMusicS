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
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;
using NSMusicS.Dao_UserControl.Song_Mrc_Info;
using NSMusicS.UserControlLibrary.Window_Hover_MRC_Panel;
using NAudio.Wave;


namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls
{
    /// <summary>
    /// UserControl_Spectrum_Visualization_2.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Spectrum_Visualization_2 : UserControl
    {
        public UserControl_Spectrum_Visualization_2()
        {
            InitializeComponent();

            Init_Info(List_storyboard, List_doubleAnimation);
        }
        public List<Storyboard> List_storyboard = new List<Storyboard>();
        public List<DoubleAnimationUsingKeyFrames> List_doubleAnimation = new List<DoubleAnimationUsingKeyFrames>();
        /// <summary>
        /// 初始化，获取所有动画对象及属性
        /// </summary>
        private void Init_Info(List<Storyboard> storyboard, List<DoubleAnimationUsingKeyFrames> doubleAnimation)
        {
            for (int i = 0; i < StackPanel_Test.Children.Count; i++)
            {
                Canvas canvas = StackPanel_Test.Children[i] as Canvas;
                Rectangle rectangle = (Rectangle)canvas.Children[0];
                EventTrigger trigger = (EventTrigger)rectangle.Triggers[0];
                BeginStoryboard beginStoryboard = (BeginStoryboard)trigger.Actions[0];
                storyboard.Add(beginStoryboard.Storyboard);
                doubleAnimation.Add(storyboard[storyboard.Count - 1].Children[0] as DoubleAnimationUsingKeyFrames);
            }
        }

        public AudioSpectrogram audioSpectrogram = AudioSpectrogram.Retuen_This();
    }
}
