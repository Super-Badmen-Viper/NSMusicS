using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_List_Of_AlbumList_Infos
{
    public class Album_Performer_List_Infos
    {
        public static ObservableCollection<Album_Performer_Infos> Album_Performer_s { get; set; }
        public static ObservableCollection<Album_Performer_Infos> Retuen_This()
        {
            Album_Performer_s = Return_This_Album_Performer_List_Infos();
            return Album_Performer_s;
        }
        private static ObservableCollection<Album_Performer_Infos> Return_This_Album_Performer_List_Infos()
        {
            if (Album_Performer_s == null)
                Album_Performer_s = new ObservableCollection<Album_Performer_Infos>();

            return Album_Performer_s;
        }
    }
}
