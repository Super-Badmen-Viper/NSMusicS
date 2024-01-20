using NSMusicS.Models.Song_List_Infos;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Printing;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.Song_KSing_Out.Data_Read_Of_Speech_Denoising
{
    public class Song_KSing_Pitch_Infos : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;
        protected internal virtual void OnPropertyChanged(string propertyName)
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
        }
        public static Song_KSing_Pitch_Infos songList_Infos { get; set; }
        public static Song_KSing_Pitch_Infos Retuen_This()
        {
            songList_Infos = Retuen_This_();
            return songList_Infos;
        }
        private static Song_KSing_Pitch_Infos Retuen_This_()
        {
            if (songList_Infos == null)
                songList_Infos = new Song_KSing_Pitch_Infos();

            return songList_Infos;
        }

        public List<CSVData_Of_Pitch> csvDatas_Of_Pitch { get; set; }
        public List<Tuple<int, int>> vocal_Pitch_Ranges { get; set; }
    }
}
