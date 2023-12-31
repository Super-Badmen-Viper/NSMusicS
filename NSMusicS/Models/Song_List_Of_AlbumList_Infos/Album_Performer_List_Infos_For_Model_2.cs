using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.Song_List_Of_AlbumList_Infos
{
    public class Album_Performer_List_Infos_For_Model_2
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public ObservableCollection<Album_Performer_Infos> Albums { get; set; }

        public static ObservableCollection<ObservableCollection<Album_Performer_List_Infos_For_Model_2>> Album_Performer_s { get; set; }
        public static ObservableCollection<ObservableCollection<Album_Performer_List_Infos_For_Model_2>> Retuen_This()
        {
            Album_Performer_s = Return_This_Album_Performer_List_Infos();
            return Album_Performer_s;
        }
        private static ObservableCollection<ObservableCollection<Album_Performer_List_Infos_For_Model_2>> Return_This_Album_Performer_List_Infos()
        {
            if (Album_Performer_s == null)
                Album_Performer_s = new ObservableCollection<ObservableCollection<Album_Performer_List_Infos_For_Model_2>>();

            return Album_Performer_s;
        }
    }
}
