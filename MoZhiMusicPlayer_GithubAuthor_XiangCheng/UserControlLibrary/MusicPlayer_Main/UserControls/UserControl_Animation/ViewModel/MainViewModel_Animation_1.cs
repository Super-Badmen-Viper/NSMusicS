using MaterialDesignThemes.Wpf.Transitions;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows.Media;
using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.Command;
using TransitionEffect = MaterialDesignThemes.Wpf.Transitions.TransitionEffect;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.MusicPlayer_Main.UserControls.UserControl_Animation.ViewModel
{
    /// <summary>
    /// 作者我不懂动画机制，手写实在不会，只能借助框架和类库的帮助了，嘿嘿
    /// 这个动画机制解决了，那么可以利用这个库的功能来实现真正的字同步同步算法
    /// 理论上可以达到和腾讯歌词同步算法同样的水准，哈哈【doge】
    /// 老夫我正是卡在不懂动画机制不会手写才无法更进一步优化同步算法
    /// </summary>
    public class MainViewModel_Animation_1 : ViewModelBase
    {
        public class Singer_ImagerCut_Info
        {
            public string image_no { get; set; }
            public ImageBrush image_i { get; set; }
            public TransitionEffect Effact { get; set; }

            public double Width { get; set; }
            public double Height { get; set; }
        }
        public int Num_Singer_ImagerCut_Infos { get; set; }//检测是否已完成RelayCommand

        public MainViewModel_Animation_1(
            List<ImageBrush> List_ImageBrush_SingerImageCut, 
            double width, 
            double height,
            int numCutCells, 
            int numCutRows, 
            int duration, 
            int num_Delay)
        {
            Singer_ImagerCut_Infos = new ObservableCollection<Singer_ImagerCut_Info>();

            kinds = new List<TransitionEffectKind>
            {
                TransitionEffectKind.ExpandIn,
                TransitionEffectKind.FadeIn,
                TransitionEffectKind.SlideInFromLeft,
                TransitionEffectKind.SlideInFromTop,
                TransitionEffectKind.SlideInFromRight,
                TransitionEffectKind.SlideInFromBottom
            };

            RefCommand = new RelayCommand(async () =>
            {
                Num_Singer_ImagerCut_Infos = 0;
                Singer_ImagerCut_Infos.Clear();
                for (int i = 0; i < numCutCells * numCutRows; i++)
                {
                    Singer_ImagerCut_Infos.Add(new Singer_ImagerCut_Info()
                    {
                        image_no = "image_no_" + i,
                        image_i = List_ImageBrush_SingerImageCut[i],
                        Width = width,
                        Height = height,
                        Effact = new TransitionEffect()
                        {
                            Kind = kinds[new Random().Next(2, 6)],
                            Duration = new TimeSpan(0, 0, 0, 0, duration)
                        }
                    });
                    await Task.Delay(num_Delay);
                    Num_Singer_ImagerCut_Infos++;
                }
            });
        }

        public RelayCommand RefCommand { get; set; }
        public List<TransitionEffectKind> kinds;
        public ObservableCollection<Singer_ImagerCut_Info> singer_ImagerCut_Infos;
        public ObservableCollection<Singer_ImagerCut_Info> Singer_ImagerCut_Infos
        {
            get { return singer_ImagerCut_Infos; }
            set { singer_ImagerCut_Infos = value; RaisePropertyChanged(); }
        }
        public static implicit operator ObservableCollection<object>(MainViewModel_Animation_1 v)
        {
            throw new NotImplementedException();
        }
    }
}
