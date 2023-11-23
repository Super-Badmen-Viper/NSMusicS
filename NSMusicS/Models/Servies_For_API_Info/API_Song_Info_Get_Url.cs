using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static NSMusicS.Models.Servies_For_API_Info.API_Song_Info;

namespace NSMusicS.Models.Servies_For_API_Info
{
    public class API_Song_Info_Get_Url
    {
        public class ApiResponse_Get_Url
        {
            public List<Data> data { get; set; }
            public int code { get; set; }
        }

        public class Data
        {
            public int id { get; set; }
            public string url { get; set; }
            public int br { get; set; }
            public int size { get; set; }
            public string md5 { get; set; }
            public int code { get; set; }
            public int expi { get; set; }
            public string type { get; set; }
            public double gain { get; set; }
            public double? peak { get; set; }
            public int fee { get; set; }
            public object uf { get; set; }
            public int payed { get; set; }
            public int flag { get; set; }
            public bool canExtend { get; set; }
            public object freeTrialInfo { get; set; }
            public string level { get; set; }
            public string encodeType { get; set; }
            public FreeTrialPrivilege freeTrialPrivilege { get; set; }
            public FreeTimeTrialPrivilege freeTimeTrialPrivilege { get; set; }
            public int urlSource { get; set; }
            public int rightSource { get; set; }
            public object podcastCtrp { get; set; }
            public object effectTypes { get; set; }
            public int time { get; set; }
        }

        public class FreeTrialPrivilege
        {
            public bool resConsumable { get; set; }
            public bool userConsumable { get; set; }
            public object listenType { get; set; }
            public object cannotListenReason { get; set; }
        }

        public class FreeTimeTrialPrivilege
        {
            public bool resConsumable { get; set; }
            public bool userConsumable { get; set; }
            public int type { get; set; }
            public int remainTime { get; set; }
        }     
    }
}
