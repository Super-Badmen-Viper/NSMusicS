using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.Song_List_Infos
{
    public class SongList_Info : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;
        protected internal virtual void OnPropertyChanged(string propertyName)
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
        }

        public int ID { get; set; }
        public string Name { get; set; }
        public int SelectedIndex { get; set; }

        private ObservableCollection<Song_Info> songs { get; set; }
        public ObservableCollection<Song_Info> Songs
        {
            get
            {
                return songs;
            }
            set
            {
                if (songs != value)
                {
                    songs = value;
                    OnPropertyChanged("Songs");
                }
            }
        }

        public static ObservableCollection<ObservableCollection<SongList_Info>> songList_Infos { get; set; }
        public static ObservableCollection<ObservableCollection<SongList_Info>> Retuen_This()
        {
            songList_Infos = Return_This_SongList_Info();
            return songList_Infos;
        }
        private static ObservableCollection<ObservableCollection<SongList_Info>> Return_This_SongList_Info()
        {
            if (songList_Infos == null)
                songList_Infos = new ObservableCollection<ObservableCollection<SongList_Info>>();

            return songList_Infos;
        }
    }
}
