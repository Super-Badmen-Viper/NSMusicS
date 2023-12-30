using MaterialDesignThemes.Wpf.Transitions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.MusicPlayer_Model_Control_Albums.ViewModel_Assembly_Singer_Show
{
    public class Singer_Info
    {
        public int Singer_No { get; set; }
        public string Singer_Name { get; set; }
        public string Singer_Explain { get; set; }
        public Uri Singer_Image_Uri { get; set; }
        public TransitionEffect Effact { get; set; }

        /// <summary>
        /// model_2
        /// </summary>
        public string Album_Name { get; set; }

        public double Width { get; set; }
        public double Height { get; set; }
        public Thickness Margin { get; set; }

        public static explicit operator Singer_Info(DependencyObject v)
        {
            throw new NotImplementedException();
        }
    }
}
