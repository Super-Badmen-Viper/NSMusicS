using MaterialDesignThemes.Wpf.Transitions;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows.Media;
using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.Command;
using TransitionEffect = MaterialDesignThemes.Wpf.Transitions.TransitionEffect;
using ImageMagick;
using NSMusicS.Dao_UserControl.SingerImage_Info;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls.UserControl_Animation.ViewModel
{
    /// <summary>
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
            string imgPath, 
            double width, 
            double height,
            int numCutCells,
            int numCutRows,
            int duration,
            int num_Delay)
        {
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
                SingerImage_Cut singerImage_Cut = SingerImage_Cut.Retuen_This();

                ObservableCollection<ImageBrush> ObservableCollection_ImageBrush_SingerImageCut = await singerImage_Cut.CutImage_ImageBrush(imgPath);
                Singer_ImagerCut_Infos = new ObservableCollection<Singer_ImagerCut_Info>();

                Num_Singer_ImagerCut_Infos = 0;
                Singer_ImagerCut_Infos.Clear();
                for (int i = 0; i < numCutCells * numCutRows; i++)
                {
                    Singer_ImagerCut_Infos.Add(new Singer_ImagerCut_Info()
                    {
                        image_no = "image_no_" + i,
                        image_i = ObservableCollection_ImageBrush_SingerImageCut[i],
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
        private ObservableCollection<Singer_ImagerCut_Info> singer_ImagerCut_Infos;
        public ObservableCollection<Singer_ImagerCut_Info> Singer_ImagerCut_Infos
        {
            get { return singer_ImagerCut_Infos; }
            set { singer_ImagerCut_Infos = value; RaisePropertyChanged(); }
        }
    }
}
