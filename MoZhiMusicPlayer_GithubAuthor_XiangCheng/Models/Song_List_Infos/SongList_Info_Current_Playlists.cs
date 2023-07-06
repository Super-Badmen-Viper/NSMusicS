using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_List_Infos
{
    public class SongList_Info_Current_Playlists
    {
        public List<Song_Info> songList_Infos_Current_Playlist { get; set; }

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
