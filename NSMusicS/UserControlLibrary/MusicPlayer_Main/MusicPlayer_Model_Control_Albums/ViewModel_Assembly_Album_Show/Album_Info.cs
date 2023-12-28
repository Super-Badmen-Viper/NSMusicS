using MaterialDesignThemes.Wpf.Transitions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.MusicPlayer_Model_Control_Albums.ViewModel_Assembly_Album_Show
{
    public class Album_Info
    {
        public int Album_No { get; set; }
        public string Album_Name { get; set; }
        public string Album_Explain { get; set; }
        public Uri Album_Image_Uri { get; set; }
        public TransitionEffect Effact { get; set; }

        public double Width { get; set; }
        public double Height { get; set; }
        public Thickness Margin { get; set; }
    }
}
