using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.MusicPlayer_Main.UserControls.VIewModules
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
