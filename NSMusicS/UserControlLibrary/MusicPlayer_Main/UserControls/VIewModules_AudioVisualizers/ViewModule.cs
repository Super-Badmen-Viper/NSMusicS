using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls.VIewModules_AudioVisualizers
{
    public class ViewModule
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
