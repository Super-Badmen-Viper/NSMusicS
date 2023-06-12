using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoZhiMusic_Ultimate.Models.Audio_Spectrogram_Info.Extracting_Audio_Spectrum_Info
{
    public class Audio_Info
    {
        public bool IsSaveFile;
        public string Filename;

        public bool IsRecording;
        public bool IsPlaying;
        public bool IsOffseting;

        public int RefreshInterval { get; set; }

        public void OnPropertyChanged(string propName) => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propName));
        public event PropertyChangedEventHandler PropertyChanged;
    }
}
