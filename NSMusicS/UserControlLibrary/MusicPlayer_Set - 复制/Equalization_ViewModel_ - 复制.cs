using GalaSoft.MvvmLight;
using NAudio.Extras;
using NAudio.Wave;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using NSMusicS.UserControlLibrary.MusicPlayer_Set.ViewModel;
using ViewModelBase = NSMusicS.UserControlLibrary.MusicPlayer_Set.ViewModel.ViewModelBase;
using CommunityToolkit.Mvvm.Input;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Set
{
    class Equalization_ViewModel : ViewModelBase
    {
        private Equalizer equalizer;
        private EqualizerBand[] bands;

        public Equalization_ViewModel()
        {
            bands = new EqualizerBand[]
                    {
                        new EqualizerBand {Bandwidth = 0.8f, Frequency = 31, Gain = 0},
                        new EqualizerBand {Bandwidth = 0.8f, Frequency = 62, Gain = 0},
                        new EqualizerBand {Bandwidth = 0.8f, Frequency = 125, Gain = 0},
                        new EqualizerBand {Bandwidth = 0.8f, Frequency = 250, Gain = 0},
                        new EqualizerBand {Bandwidth = 0.8f, Frequency = 500, Gain = 0},
                        new EqualizerBand {Bandwidth = 0.8f, Frequency = 1000, Gain = 0},
                        new EqualizerBand {Bandwidth = 0.8f, Frequency = 2000, Gain = 0},
                        new EqualizerBand {Bandwidth = 0.8f, Frequency = 4000, Gain = 0},
                        new EqualizerBand {Bandwidth = 0.8f, Frequency = 8000, Gain = 0},
                        new EqualizerBand {Bandwidth = 0.8f, Frequency = 1600, Gain = 0},
                        new EqualizerBand {Bandwidth = 0.8f, Frequency = 2000, Gain = 0},
                    };
            this.PropertyChanged += OnPropertyChanged;

            RefCommand_Set_Equalizer = new RelayCommand(async () =>
            {

            });
        }

        private void OnPropertyChanged(object sender, PropertyChangedEventArgs propertyChangedEventArgs)
        {
            equalizer?.Update();
        }

        public RelayCommand RefCommand_Set_Equalizer { get; set; }

        public float MinimumGain => -30;
        public float MaximumGain => 30;

        /// <summary>
        /// 31
        /// </summary>
        public float Band1
        {
            get => bands[0].Gain;
            set
            {
                if (bands[0].Gain != value)
                {
                    bands[0].Gain = value;
                    OnPropertyChanged("Band1");
                }
            }
        }
        /// <summary>
        /// 62
        /// </summary>
        public float Band2
        {
            get => bands[1].Gain;
            set
            {
                if (bands[1].Gain != value)
                {
                    bands[1].Gain = value;
                    OnPropertyChanged("Band2");
                }
            }
        }
        /// <summary>
        /// 125
        /// </summary>
        public float Band3
        {
            get => bands[2].Gain;
            set
            {
                if (bands[2].Gain != value)
                {
                    bands[2].Gain = value;
                    OnPropertyChanged("Band3");
                }
            }
        }
        /// <summary>
        /// 250
        /// </summary>
        public float Band4
        {
            get => bands[3].Gain;
            set
            {
                if (bands[3].Gain != value)
                {
                    bands[3].Gain = value;
                    OnPropertyChanged("Band4");
                }
            }
        }
        /// <summary>
        /// 500
        /// </summary>
        public float Band5
        {
            get => bands[4].Gain;
            set
            {
                if (bands[4].Gain != value)
                {
                    bands[4].Gain = value;
                    OnPropertyChanged("Band5");
                }
            }
        }
        /// <summary>
        /// 1k
        /// </summary>
        public float Band6
        {
            get => bands[5].Gain;
            set
            {
                if (bands[5].Gain != value)
                {
                    bands[5].Gain = value;
                    OnPropertyChanged("Band6");
                }
            }
        }
        /// <summary>
        /// 2k
        /// </summary>
        public float Band7
        {
            get => bands[6].Gain;
            set
            {
                if (bands[6].Gain != value)
                {
                    bands[6].Gain = value;
                    OnPropertyChanged("Band7");
                }
            }
        }
        /// <summary>
        /// 4k
        /// </summary>
        public float Band8
        {
            get => bands[7].Gain;
            set
            {
                if (bands[7].Gain != value)
                {
                    bands[7].Gain = value;
                    OnPropertyChanged("Band7");
                }
            }
        }
        /// <summary>
        /// 8k
        /// </summary>
        public float Band9
        {
            get => bands[8].Gain;
            set
            {
                if (bands[8].Gain != value)
                {
                    bands[8].Gain = value;
                    OnPropertyChanged("Band8");
                }
            }
        }
        /// <summary>
        /// 16k
        /// </summary>
        public float Band10
        {
            get => bands[9].Gain;
            set
            {
                if (bands[9].Gain != value)
                {
                    bands[9].Gain = value;
                    OnPropertyChanged("Band9");
                }
            }
        }
        /// <summary>
        /// 20k
        /// </summary>
        public float Band11
        {
            get => bands[10].Gain;
            set
            {
                if (bands[10].Gain != value)
                {
                    bands[10].Gain = value;
                    OnPropertyChanged("Band7");
                }
            }
        }
    }
}
