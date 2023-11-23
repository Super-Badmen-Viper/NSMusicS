using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.Servies_For_API_Info
{
    public class API_Song_Info
    {
        public class ApiResponse_Search_Song
        {
            public Result result { get; set; }
        }

        public class Result
        {
            public List<Song> songs { get; set; }
            public List<Privilege> privileges { get; set; }
            public List<Album> albums { get; set; }
            public int albumCount { get; set; }
            public int artistCount { get; set; }
            public List<Artist> artists { get; set; }
            public object searchQcReminder { get; set; }
        }

        public class Artist
        {
            public int id { get; set; }
            public string name { get; set; }
            public List<string> tns { get; set; }
            public List<string> alias { get; set; }
            public long picId { get; set; }
            public long img1v1Id { get; set; }
            public string briefDesc { get; set; }
            public string picUrl { get; set; }


            public string img1v1Url { get; set; }

            public int albumSize { get; set; }

            public string trans { get; set; }

            public int musicSize { get; set; }

            public string picId_str { get; set; }


            public object fansGroup { get; set; }

            public long img1v1 { get; set; }
            public int mvSize { get; set; }
            public bool followed { get; set; }

            public List<string> alia { get; set; }

        }
    

        public class Album
        {
            public int id { get; set; }

            public string name { get; set; }


            public string picUrl { get; set; }


            public List<string> tns { get; set; }


            public string pic_str { get; set; }

            public long pic { get; set; }

            public string idStr { get; set; }


            public string type { get; set; }

            public int size { get; set; }
            public long picId { get; set; }

            public string blurPicUrl { get; set; }

            public int companyId { get; set; }
            public long publishTime { get; set; }

            public string description { get; set; }


            public string tags { get; set; }


            public string company { get; set; }


            public string briefDesc { get; set; }


            public Artist artist { get; set; }


            public List<object> songs { get; set; }


            public List<string> alias { get; set; }

            public int status { get; set; }
            public int copyrightId { get; set; }

            public string commentThreadId { get; set; }


            public List<Artist> artists { get; set; }


            public string picId_str { get; set; }

            public bool isSub { get; set; }
        }

        public class HighQualityMusic
        {
            public int br { get; set; }
            public int fid { get; set; }
            public int size { get; set; }
            public double vd { get; set; }
            public int sr { get; set; }
        }

        public class Song
        {

            public string name { get; set; }

            public int id { get; set; }
            public int pst { get; set; }
            public int t { get; set; }

            public List<Artist> ar { get; set; }


            public List<string> alia { get; set; }

            public int pop { get; set; }
            public int st { get; set; }

            public string rt { get; set; }

            public int fee { get; set; }
            public int v { get; set; }

            public object crbt { get; set; }


            public string cf { get; set; }


            public Album al { get; set; }

            public int dt { get; set; }

            public HighQualityMusic h { get; set; }


            public HighQualityMusic m { get; set; }


            public HighQualityMusic l { get; set; }


            public HighQualityMusic sq { get; set; }


            public object hr { get; set; }


            public object a { get; set; }


            public string cd { get; set; }

            public int no { get; set; }

            public object rtUrl { get; set; }

            public int ftype { get; set; }

            public List<string> rtUrls { get; set; }

            public int djId { get; set; }
            public int copyright { get; set; }
            public int s_id { get; set; }
            public long mark { get; set; }
            public int originCoverType { get; set; }

            public object originSongSimpleData { get; set; }


            public object tagPicList { get; set; }

            public bool resourceState { get; set; }
            public int version { get; set; }

            public object songJumpInfo { get; set; }


            public object entertainmentTags { get; set; }

            public int single { get; set; }

            public object noCopyrightRcmd { get; set; }

            public int rtype { get; set; }

            public object rurl { get; set; }

            public int mv { get; set; }
            public int mst { get; set; }
            public int cp { get; set; }
            public long publishTime { get; set; }
        }

        public class FreeTrialPrivilege
        {
            public bool resConsumable { get; set; }
            public bool userConsumable { get; set; }

            public object listenType { get; set; }

        }

        public class ChargeInfo
        {
            public int rate { get; set; }

            public object chargeUrl { get; set; }


            public object chargeMessage { get; set; }

            public int chargeType { get; set; }
        }

        public class Privilege
        {
            public int id { get; set; }
            public int fee { get; set; }
            public int payed { get; set; }
            public int st { get; set; }
            public int pl { get; set; }
            public int dl { get; set; }
            public int sp { get; set; }
            public int cp { get; set; }
            public int subp { get; set; }
            public bool cs { get; set; }
            public int maxbr { get; set; }
            public int fl { get; set; }
            public bool toast { get; set; }
            public int flag { get; set; }
            public bool preSell { get; set; }
            public int playMaxbr { get; set; }
            public int downloadMaxbr { get; set; }
            public string maxBrLevel { get; set; }
            public string playMaxBrLevel { get; set; }


            public string downloadMaxBrLevel { get; set; }


            public string plLevel { get; set; }


            public string dlLevel { get; set; }


            public string flLevel { get; set; }


            public object rscl { get; set; }


            public FreeTrialPrivilege freeTrialPrivilege { get; set; }


            public List<ChargeInfo> chargeInfoList { get; set; }

        }

        
    }
}
