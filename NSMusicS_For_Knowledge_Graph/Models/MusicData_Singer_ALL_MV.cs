using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS_For_Knowledge_Graph.Models
{
    public class MusicData_Singer_ALL_MV
    {
        public int mv_id {  get; set; }
        public string mv_name { get; set; }
        public string mv_cover { get; set; }
        public string mv_url { get; set; }
        public JArray mv_brs { get; set; }/// MV画质数组（....）

        public int ar_id { get; set; }
        public string ar_name { get; set; }
    }
}
