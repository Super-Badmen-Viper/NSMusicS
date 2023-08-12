using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_List_Infos
{
    public class SongList_Info_Current_Playlists
    {
        public ObservableCollection<Song_Info> songList_Infos_Current_Playlist { get; set; }

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
