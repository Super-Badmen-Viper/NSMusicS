using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_List_Of_Album_SongList_Infos
{
    public class This_Performer_ALL_AlbumSongList
    {
        public string Singer_Name { get; set; }
        public ObservableCollection<Album_SongList_Infos> Albums { get; set; }
    }
}
