using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_List_Infos
{
    public class SongList_Info
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public ObservableCollection<Song_Info> Songs { get; set; }
        public int SelectedIndex { get; set; }

        public static ObservableCollection<ObservableCollection<Models.Song_List_Infos.SongList_Info>> songList_Infos { get; set; }
        public static ObservableCollection<ObservableCollection<Models.Song_List_Infos.SongList_Info>> Retuen_This()
        {
            songList_Infos = Return_This_SongList_Info();
            return songList_Infos;
        }
        private static ObservableCollection<ObservableCollection<Models.Song_List_Infos.SongList_Info>> Return_This_SongList_Info()
        {
            if (songList_Infos == null)
                songList_Infos = new ObservableCollection<ObservableCollection<Models.Song_List_Infos.SongList_Info>>();

            return songList_Infos;
        }
    }
}
