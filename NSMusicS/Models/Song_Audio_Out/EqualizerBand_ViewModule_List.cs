using CSCore.Streams.Effects;
using NAudio.Extras;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.ObjectModel;
using ViewModelBase = NSMusicS.Models.Song_Audio_Out.EQ_ViewModel.ViewModelBase;

namespace NSMusicS.Models.Song_Audio_Out
{
    public class EqualizerBand_ViewModule_List : ViewModelBase
    {
        public static EqualizerBand_ViewModule_List equalizerBand_List { get; set; }
        public static EqualizerBand_ViewModule_List Retuen_This()
        {
            equalizerBand_List = Return_This_EqualizerBand_List();
            return equalizerBand_List;
        }
        private static EqualizerBand_ViewModule_List Return_This_EqualizerBand_List()
        {
            if (equalizerBand_List == null)
                equalizerBand_List = new EqualizerBand_ViewModule_List();

            return equalizerBand_List;
        }


        public ObservableCollection<EqualizerBand_Info> equalizerBand_Infos;
        public EqualizerBand[] bands;

        public void ResetLoad_EqualizerBand_List(int bandCount)
        {
            if (equalizerBand_Infos != null && equalizerBand_Infos.Count > 0)
            {
                bands = new EqualizerBand[bandCount];

                for (int i = 0; i < bandCount; i++)
                {
                    bands[i] = new EqualizerBand { 
                        Bandwidth = equalizerBand_Infos[i].Bandwidth, 
                        Frequency = equalizerBand_Infos[i].Frequency, 
                        Gain = equalizerBand_Infos[i].Gain
                    };
                }
            }
        }

        public float this[int index]
        {
            get => bands[index].Gain;
            set
            {
                if (bands[index].Gain != value)
                {
                    bands[index].Gain = value;
                    OnPropertyChanged(("Band"+ index + 1).ToString());
                }
            }
        }
    }
}
