using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.Song_List_Of_Album_SongList_Infos
{
    public class ALL_Performer_ALL_AlbumSongList
    {
        public ObservableCollection<This_Performer_ALL_AlbumSongList> ALL_Performers = new ObservableCollection<This_Performer_ALL_AlbumSongList>();

        public static ALL_Performer_ALL_AlbumSongList all_Performer_ALL_AlbumSongList { get; set; }
        public static ALL_Performer_ALL_AlbumSongList Retuen_This()
        {
            all_Performer_ALL_AlbumSongList = Return_This_SongList_Info();
            return all_Performer_ALL_AlbumSongList;
        }
        private static ALL_Performer_ALL_AlbumSongList Return_This_SongList_Info()
        {
            if (all_Performer_ALL_AlbumSongList == null)
                all_Performer_ALL_AlbumSongList = new ALL_Performer_ALL_AlbumSongList();

            return all_Performer_ALL_AlbumSongList;
        }
    }
}
