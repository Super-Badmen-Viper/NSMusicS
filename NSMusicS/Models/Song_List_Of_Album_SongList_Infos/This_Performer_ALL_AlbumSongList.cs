using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.Song_List_Of_Album_SongList_Infos
{
    public class This_Performer_ALL_AlbumSongList
    {
        public string Singer_Name { get; set; }
        private HashSet<Album_SongList_Infos> uniqueAlbums;

        public ObservableCollection<Album_SongList_Infos> Albums { get; set; }

        public This_Performer_ALL_AlbumSongList()
        {
            uniqueAlbums = new HashSet<Album_SongList_Infos>();
            Albums = new ObservableCollection<Album_SongList_Infos>();
        }

        public void AddAlbum(Album_SongList_Infos album)
        {
            if (uniqueAlbums.Add(album))
            {
                Albums.Add(album);
            }
        }
    }
}
