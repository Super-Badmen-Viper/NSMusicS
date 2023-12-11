using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS_For_Knowledge_Graph.Models
{
    public class MusicData_Singer_ALL_Album
    {
        public int al_id { get; set; }
        public string al_name { get; set; }
        public string al_picUrl { get; set; }

        public JArray alias { get; set; }
        public int ar_id { get; set; }
        public string ar_name { get; set; }
    }
}
