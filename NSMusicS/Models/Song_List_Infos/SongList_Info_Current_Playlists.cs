using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.Song_List_Infos
{
    public class SongList_Info_Current_Playlists : INotifyPropertyChanged
    {
        //添加次序 专辑模式
        public int Album_To_Current_Playlist;

        private ObservableCollection<Song_Info> current_Playlist { get; set; }
        public ObservableCollection<Song_Info> songList_Infos_Current_Playlist
        {
            get
            {
                return current_Playlist;
            }
            set
            {
                if (current_Playlist != value)
                {
                    current_Playlist = value;
                    OnPropertyChanged("songList_Infos_Current_Playlist");
                }
            }
        }
        public event PropertyChangedEventHandler PropertyChanged;
        protected internal virtual void OnPropertyChanged(string propertyName)
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
        }


        //是否重置播放列表（用于正在播放的歌曲，被移出songList_Infos_Current_Playlist）
        public static bool Bool_Restart_Playing = false;

        private static SongList_Info_Current_Playlists songList_Infos;
        public static SongList_Info_Current_Playlists Retuen_This()
        {
            songList_Infos = Return_This_SongList_Info_Current_Playlists();
            return songList_Infos;
        }
        private static SongList_Info_Current_Playlists Return_This_SongList_Info_Current_Playlists()
        {
            if (songList_Infos == null)
                songList_Infos = new SongList_Info_Current_Playlists();

            return songList_Infos;
        }
    }
}
