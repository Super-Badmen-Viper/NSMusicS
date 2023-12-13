using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS_For_Knowledge_Graph.Models
{
    public class MusicData_Singer_HotSongs
    {
        public int id {  get; set; }
        public string name { get; set; }
        public int dt { get; set; }
        public int mv { get; set; }
        public string url { get; set; }

        public int al_id { get; set; }
        public string al_name { get; set; }

        public int ar_id { get; set; }
        public string ar_name { get; set;}
    }
}
