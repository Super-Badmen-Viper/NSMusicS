using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System;
using System.Reflection;
using System.ComponentModel;
using NAudio.Extras;

namespace NSMusicS.Models.Song_Audio_Out
{
    public class EqualizerBand_Info
    {
        public float Bandwidth { get; set; }
        public float Frequency { get; set;}
        public float Gain { get; set;}
    }
}
