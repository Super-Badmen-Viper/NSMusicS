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

        public static ObservableCollection<Album_Performer_Infos> Album_Model_2_List_s { get; set; }
        public static ObservableCollection<Album_Performer_Infos> Retuen_This_Lists()
        {
            Album_Model_2_List_s = Retuen_This_Album_Model_2_List_s();
            return Album_Model_2_List_s;
        }
        private static ObservableCollection<Album_Performer_Infos> Retuen_This_Album_Model_2_List_s()
        {
            if (Album_Model_2_List_s == null)
                Album_Model_2_List_s = new ObservableCollection<Album_Performer_Infos>();

            return Album_Model_2_List_s;
        }

        public static ObservableCollection<ObservableCollection<Album_Performer_List_Infos_For_Model_2>> Album_Model_2_DBList_s { get; set; }
        public static ObservableCollection<ObservableCollection<Album_Performer_List_Infos_For_Model_2>> Retuen_This_DB_Lists()
        {
            Album_Model_2_DBList_s = Retuen_This_Album_Model_2_DB_List_s();
            return Album_Model_2_DBList_s;
        }
        private static ObservableCollection<ObservableCollection<Album_Performer_List_Infos_For_Model_2>> Retuen_This_Album_Model_2_DB_List_s()
        {
            if (Album_Model_2_DBList_s == null)
                Album_Model_2_DBList_s = new ObservableCollection<ObservableCollection<Album_Performer_List_Infos_For_Model_2>>();

            return Album_Model_2_DBList_s;
        }
    }
}
