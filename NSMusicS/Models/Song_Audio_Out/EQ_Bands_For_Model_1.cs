using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.Song_Audio_Out
{
    public class EQ_Bands_For_Model_1
    {
        public string Eq_Name;

        public float MinimumGain => -12;
        public float MaximumGain => 12;

        /// <summary>
        /// 31
        /// </summary>
        public float Band1 { get; set; }
        /// <summary>
        /// 62
        /// </summary>
        public float Band2 { get; set; }
        /// <summary>
        /// 125
        /// </summary>
        public float Band3 { get; set; }
        /// <summary>
        /// 250
        /// </summary>
        public float Band4 { get; set; }
        /// <summary>
        /// 500
        /// </summary>
        public float Band5 { get; set; }
        /// <summary>
        /// 1k
        /// </summary>
        public float Band6 { get; set; }
        /// <summary>
        /// 2k
        /// </summary>
        public float Band7 { get; set; }
        /// <summary>
        /// 4k
        /// </summary>
        public float Band8 { get; set; }
        /// <summary>
        /// 8k
        /// </summary>
        public float Band9 { get; set; }
        /// <summary>
        /// 16k
        /// </summary>
        public float Band10 { get; set; }
        /// <summary>
        /// 20k
        /// </summary>
        public float Band11 { get; set; }
    }
}
