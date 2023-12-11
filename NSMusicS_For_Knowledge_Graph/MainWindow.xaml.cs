using Neo4j.Driver;
using Newtonsoft.Json.Linq;
using NSMusicS_For_Knowledge_Graph.Models;
using NSMusicS_For_Knowledge_Graph.Services.Services_For_API_GetResult;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using static System.Net.Mime.MediaTypeNames;
using Neo4j.Driver;
using System;

namespace NSMusicS_For_Knowledge_Graph
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            vs_singer_info = ViewModule_Search_Singer_ALL_Info.Retuen_This();
            this.Content = vs_singer_info;

            Init_Find_CloudMusicInfo_In_KG();

            Init_Run_Cypher_In_Neo4jAsync();
        }

        private string web_url = "";//输入neteasecloudmusicapi网易云API地址 music.liyp.cc/api
        ViewModule_Search_Singer_ALL_Info vs_singer_info; 
        public async Task Init_Run_Cypher_In_Neo4jAsync()
        {
            int num_s = 0;

            List<string> list = new List<string>();
            _driver = GraphDatabase.Driver(_dbHost, AuthTokens.Basic(_dbUser, _dbPassword));
            await ExcuteQueryAsync("MATCH (n) DETACH DELETE n", num_s);
            num_s++;
            using (StreamReader sr = new StreamReader("output.txt"))
            {
                string line;
                while ((line = sr.ReadLine()) != null)
                {
                    await ExcuteQueryAsync(line, num_s);
                    num_s++;
                }
            }
        }
        private string _dbHost = "bolt://localhost:7687";
        private string _dbUser = "neo4j";
        private string _dbPassword = "neo4j";
        private IDriver _driver;
        [Obsolete]
        public async Task ExcuteQueryAsync(string Cql, int num_s)
        {
            var session = _driver.AsyncSession();
            try
            {
                var result = await session.WriteTransactionAsync(async tx =>
                {
                    var result = await tx.RunAsync(Cql);
                    await tx.CommitAsync();
                    return result;
                });

                // 处理结果
            }
            catch (Exception ex)
            {
                MessageBox.Show("第"+ num_s+"行："+ Cql);
            }
            finally
            {
                // 关闭会话
                await session.CloseAsync();
            }
        }



        public void Init_Find_CloudMusicInfo_In_KG()
        {
            /// 1.获取    所有的热门歌手的基本信息
            Find_1_For_Singer_Basic_Info();
            /// 2.补全    所有的热门歌手的详情信息
            Find_2_For_Singer_Details_Info();
            /// 3.获取    所有的热门歌手的 各自所有的热歌（根据热歌）
            Find_3_For_Singer_HotSongs();
            /// 4.获取    所有的热门歌手的 各自所有的专辑（根据热歌找到专辑id，进而找到该专辑所有歌曲）
            /// 不找该专辑所有歌曲，仅匹配当前热歌专辑信息
            Find_4_For_Singer_ALL_Album();
            /// 5.获取    所有的热门歌手的 各自所有的热歌 对应的MV信息
            Find_5_For_Singer_ALL_MV();

            /// 6.生成Cypher语句，写入到txt中
            Create_Cypher_To_Neo4j_Line();
        }
        public void Find_1_For_Singer_Basic_Info()
        {
            string apiUrl = web_url + "/top/artists?offset=0&limit=1";// 5个歌手
            using (HttpClient client = new HttpClient())
            {
                using (HttpResponseMessage response = client.GetAsync(apiUrl).Result)
                {
                    if (response.IsSuccessStatusCode)
                    {
                        response.EnsureSuccessStatusCode();
                        string json = response.Content.ReadAsStringAsync().Result;
                        JArray recordsArray = (JArray)JObject.Parse(json)["artists"];
                        if (recordsArray != null && recordsArray.Count > 0)
                        {
                            foreach (JObject record in recordsArray)
                            {
                                MusicData_Singer_Info ms = new MusicData_Singer_Info
                                {
                                    ar_id = (int)record["id"],
                                    ar_name = (string)record["name"],
                                    ar_picUrl = (string)record["picUrl"],
                                    ar_img1v1Url = (string)record["img1v1Url"],
                                    ar_alias = (JArray)record["alias"],
                                    ar_musicSize = (int)record["musicSize"],
                                    ar_albumSize = (int)record["albumSize"],
                                    //mvSize = (int)record["mvSize"]
                                };

                                vs_singer_info.musicData_Singer_Infos.Add(ms);
                            }
                        }
                        recordsArray.Clear();
                        recordsArray = null;
                    }
                }
            }
        }
        public void Find_2_For_Singer_Details_Info()
        {
            for (int i = 0; i < vs_singer_info.musicData_Singer_Infos.Count; i++)
            {
                MusicData_Singer_Info temp = vs_singer_info.musicData_Singer_Infos[i];
                string apiUrl = web_url + "/artist/desc?id=" + temp.ar_id.ToString();
                using (HttpClient client = new HttpClient())
                {
                    using (HttpResponseMessage response = client.GetAsync(apiUrl).Result)
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            response.EnsureSuccessStatusCode();
                            string json = response.Content.ReadAsStringAsync().Result;

                            JObject root = JObject.Parse(json); 
                            JToken dataToken;
                            if (root.TryGetValue("briefDesc", out dataToken))
                            {
                                MusicData_Singer_Details ms = new MusicData_Singer_Details
                                {
                                    ti = "歌手简介",
                                    txt = dataToken.ToString(),
                                };

                                if (vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details == null)
                                {
                                    vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details = new List<MusicData_Singer_Details>();
                                }
                                vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details.Add(ms);
                            }
                            

                            JArray recordsArray = (JArray)JObject.Parse(json)["introduction"];
                            if (recordsArray != null && recordsArray.Count > 0)
                            {
                                foreach (JObject record in recordsArray)
                                {
                                    MusicData_Singer_Details ms = new MusicData_Singer_Details
                                    {
                                        ti = (string)record["ti"],
                                        txt = (string)record["txt"],
                                    };

                                    if (vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details == null)
                                    {
                                        vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details = new List<MusicData_Singer_Details>();
                                    }
                                    vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details.Add(ms);
                                }
                            }
                            recordsArray.Clear();
                            recordsArray = null;
                        }
                    }
                }
            }

            
        }
        public void Find_3_For_Singer_HotSongs()
        {
            for (int i = 0; i < vs_singer_info.musicData_Singer_Infos.Count; i++)
            {
                MusicData_Singer_Info temp = vs_singer_info.musicData_Singer_Infos[i];
                string apiUrl = web_url + "/artists/songs?id=" + temp.ar_id.ToString();//默认50首
                using (HttpClient client = new HttpClient())
                {
                    using (HttpResponseMessage response = client.GetAsync(apiUrl).Result)
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            response.EnsureSuccessStatusCode();
                            string json = response.Content.ReadAsStringAsync().Result;
                            JArray recordsArray = (JArray)JObject.Parse(json)["hotSongs"];
                            if (recordsArray != null && recordsArray.Count > 0)
                            {
                                foreach (JObject record in recordsArray)
                                {
                                    MusicData_Singer_HotSongs ms = new MusicData_Singer_HotSongs
                                    {
                                        id = (int)record["id"],
                                        name = (string)record["name"],
                                        dt = (int)record["dt"],
                                        mv = (int)record["mv"],

                                        al_id = (int)record["al"]["id"],
                                        al_name = (string)record["al"]["name"],

                                        ar_id = (int)record["ar"][0]["id"],
                                        ar_name = (string)record["ar"][0]["name"],
                                    };


                                    if (vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs == null)
                                    {
                                        vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs = new List<MusicData_Singer_HotSongs>();
                                    }
                                    vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs.Add(ms);
                                }
                            }
                            recordsArray.Clear();
                            recordsArray = null;
                        }
                    }
                }
            }
        }
        public void Find_4_For_Singer_ALL_Album()
        {
            for (int i = 0; i < vs_singer_info.musicData_Singer_Infos.Count; i++)
            {
                MusicData_Singer_Info temp = vs_singer_info.musicData_Singer_Infos[i];
                for (int k = 0; k < temp.musicData_Singer_HotSongs.Count; k++)
                {
                    string apiUrl = web_url + "/album?id=" + temp.musicData_Singer_HotSongs[k].al_id.ToString();
                    using (HttpClient client = new HttpClient())
                    {
                        using (HttpResponseMessage response = client.GetAsync(apiUrl).Result)
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                response.EnsureSuccessStatusCode();
                                string json = response.Content.ReadAsStringAsync().Result;
                                JArray recordsArray = (JArray)JObject.Parse(json)["songs"];

                                if (recordsArray != null && recordsArray.Count > 0)
                                {
                                    /// 不找该专辑所有歌曲，仅匹配当前热歌专辑信息
                                    JObject record_0 = (JObject)recordsArray[0];
                                    recordsArray.Clear();
                                    recordsArray.Add(record_0);
                                    if (recordsArray != null && recordsArray.Count > 0)
                                    {
                                        foreach (JObject record in recordsArray)
                                        {
                                            MusicData_Singer_ALL_Album ms = new MusicData_Singer_ALL_Album
                                            {
                                                al_id = (int)record["al"]["id"],
                                                al_name = (string)record["al"]["name"],
                                                al_picUrl = (string)record["al"]["picUrl"],

                                                alias = (JArray)record["ar"][0]["alias"],
                                                ar_id = (int)record["ar"][0]["id"],
                                                ar_name = (string)record["ar"][0]["name"],
                                            };


                                            if (vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_ALL_Albums == null)
                                            {
                                                vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_ALL_Albums = new List<MusicData_Singer_ALL_Album>();
                                                vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_ALL_Albums.Add(ms);
                                            }
                                            else
                                            {
                                                /// 检查专辑id是否重复，去重
                                                var result = from album in vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_ALL_Albums
                                                             where album.al_id == ms.al_id
                                                             select album;

                                                // Check if the result contains any items
                                                if (!result.Any())
                                                {
                                                    vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_ALL_Albums.Add(ms);
                                                }
                                            }
                                        }
                                    }
                                    recordsArray.Clear();
                                    recordsArray = null;
                                }
                            }
                        }
                    }
                }
            }
        }
        public void Find_5_For_Singer_ALL_MV()
        {
            for (int i = 0; i < vs_singer_info.musicData_Singer_Infos.Count; i++)
            {
                MusicData_Singer_Info temp = vs_singer_info.musicData_Singer_Infos[i];
                for (int k = 0; k < temp.musicData_Singer_HotSongs.Count; k++)
                {
                    string apiUrl = web_url + "/mv/detail?mvid=" + temp.musicData_Singer_HotSongs[k].mv.ToString();
                    using (HttpClient client = new HttpClient())
                    {
                        using (HttpResponseMessage response = client.GetAsync(apiUrl).Result)
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                response.EnsureSuccessStatusCode();
                                string json = response.Content.ReadAsStringAsync().Result;

                                JObject root = JObject.Parse(json);
                                JToken dataToken;
                                if (root.TryGetValue("data", out dataToken))
                                {
                                    JObject dataObject = (JObject)dataToken;

                                    MusicData_Singer_ALL_MV ms = new MusicData_Singer_ALL_MV
                                    {
                                        mv_id = (int)dataObject["id"],
                                        mv_name = (string)dataObject["name"],
                                        mv_cover = (string)dataObject["cover"],
                                        //mv_url = (int)dataObject["ar"][0]["id"],
                                        mv_brs = (JArray)dataObject["brs"],

                                        ar_id = (int)dataObject["artists"][0]["id"],
                                        ar_name = (string)dataObject["artists"][0]["name"],
                                    };

                                    if (vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_ALL_MVs == null)
                                    {
                                        vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_ALL_MVs = new List<MusicData_Singer_ALL_MV>();
                                    }
                                    vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_ALL_MVs.Add(ms);
                                }
                            }
                        }
                    }
                }
            }
        }
        public void Create_Cypher_To_Neo4j_Line()
        {
            List<string> lines = new List<string>();
            int p = 1;
            /// 创建初始节点
            lines.Add("CREATE (:hotSongs_Singer {name:'热门歌手'})");
            for (int i = 0; i < vs_singer_info.musicData_Singer_Infos.Count; i++)
            {
                int this_ar_id= vs_singer_info.musicData_Singer_Infos[i].ar_id;
                string this_ar_name = vs_singer_info.musicData_Singer_Infos[i].ar_name;
                string this_ar_picUrl = vs_singer_info.musicData_Singer_Infos[i].ar_picUrl;
                string this_ar_img1v1Url = vs_singer_info.musicData_Singer_Infos[i].ar_img1v1Url;
                int this_ar_albumSize = vs_singer_info.musicData_Singer_Infos[i].ar_albumSize;
                //alias
                int this_ar_musicSize = vs_singer_info.musicData_Singer_Infos[i].ar_musicSize;
                int this_ar_mvSize = vs_singer_info.musicData_Singer_Infos[i].ar_mvSize;

                /// 创建该歌手的初始分类节点
                lines.Add("CREATE (:hotSongs_" + this_ar_id + " {name:'热歌'})");
                lines.Add("CREATE (:al_" + this_ar_id + " {name:'专辑'})");
                lines.Add("CREATE (:briefDesc_" + this_ar_id + "{name:'歌手详情'})");
                lines.Add("CREATE (:mvs_" + this_ar_id + "{name:'MV'})");

                /// 开始创建该歌手的热歌，专辑，MV信息
                for (int k = 0; k < vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs.Count; k++)
                {
                    /// 1.添加该热歌
                    int id = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs[k].id;
                    string name = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs[k].name;
                    int dt = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs[k].dt;
                    int mv = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs[k].mv;

                    lines.Add("MERGE (p" + p + ":hotSongs_" + this_ar_id + ")"
                        +" MERGE (p" +(p + 1) + ":Song_"+ id + " {id: '"+ id + "', name: '"+ name + "', dt: '"+ dt + "', mv: '"+ mv + "'})"
                        +" MERGE (p" + p + ")-[:该歌手所有热歌中包括]->(p" +(p + 1) + ")");
                    p += 2;

                    /// 2.添加该热歌的专辑，并将此专辑与热歌 绑定 指向关系
                    int al_id = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs[k].al_id;
                    var result = from album in vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_ALL_Albums
                                 where album.al_id == al_id
                                 select album;
                    foreach (var album in result)
                    {
                        /// alia先空着,  写入\"防止 Cypher出现识别''错误
                        lines.Add(" MERGE (p" + p + ":al_"+ al_id + " {id:'"+ al_id + "'}) SET p" + p + ".name = \"" + album.al_name + "\",p" + p + ".alia = ['null'],p" + p + ".picUrl = '" + album.al_picUrl + "'");
                        p += 2;

                        lines.Add(" MERGE (p" + p + ":al_"+ this_ar_id + ")"
                        +" MERGE (p" + (p + 1) + ": al_"+ al_id + ")"
                        + " MERGE(p" + p + ") - [:该歌手所有专辑中包括]->(p" + (p + 1) + ")");
                        p += 2;

                        lines.Add("MERGE (p" + p + ":al_"+ al_id + ")"
                        +" MERGE (p" + (p + 1) + ":Song_"+ id + ")"
                        + " MERGE (p" + p + ")-[:该专辑包括此歌曲]->(p" + (p + 1) + ")");
                        p += 2;

                        break;/// 只读取一个
                    }

                    /// 3.添加该歌曲的MV
                    int mv_id = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs[k].mv;
                    var result_mv = from mv_ in vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_ALL_MVs
                             where mv_.mv_id == mv_id
                             select mv_;
                    foreach (var _mv in result_mv)
                    {
                        /// url和size先空着
                        lines.Add("CREATE (:mv_" + mv_id + " {id:'" + mv_id + "',name:'"+ _mv.mv_name + "',cover:'"+ _mv.mv_cover+ "',url:'null',size:'null'})"
                        +" MERGE (p" + p + ":mvs_" + this_ar_id + ")"
                        +" MERGE (p" + (p + 1) + ":mv_" + mv_id + ")"
                        + " MERGE (p" + p + ")-[:该歌手所有MV中包括此MV]->(p" + (p + 1) + ")");
                        p += 2;

                        lines.Add("MERGE (p" + p + ":Song_"+ id + ")"
                        +" MERGE (p" +(p + 1) +":mv_"+ mv_id + ")"
                        + " MERGE (p" + p + ")-[:该歌曲的MV]->(p" + (p + 1) + ")");
                        p += 2;
                    }

                }

                /// 然后创建该歌手的简介信息
                if (vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details != null && vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details.Count > 0)
                {
                    string briefDesc_ti = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details[0].ti;
                    string briefDesc_txt = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details[0].txt;
                    briefDesc_txt = briefDesc_txt.Replace("\n", "");
                    briefDesc_txt = briefDesc_txt.Replace("\t", "");
                    briefDesc_txt = briefDesc_txt.Replace("\"", "");
                    lines.Add("CREATE (:briefDesc_" + this_ar_id + "_txt { "+ briefDesc_ti + ":\"" + briefDesc_txt + "\" })"
                    +" MERGE (y" + p + ":briefDesc_" + this_ar_id + "_txt)"
                    +" MERGE (y" + (p + 1) + ":briefDesc_" + this_ar_id + ")"
                    + " MERGE (y" + (p + 1) + ")-[:该歌手详情中包括此信息]->(y" + p + ")");
                    p += 2;
                    /// 该歌手的详细信息
                    for (int d = 0; d < vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details.Count; d++)
                    {
                        string ti = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details[d].ti;
                        string txt = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details[d].txt;
                        txt = txt.Replace("\n", "");
                        txt = txt.Replace("\t", "");
                        txt = txt.Replace("\"", "");

                        lines.Add("CREATE (:introduction_" + this_ar_id + "_txt_" + d + " { " + ti + " :\"" + txt + "\" })"
                        +" MERGE (y" + p + ":introduction_" + this_ar_id + "_txt_" + d + ")"
                        +" MERGE (y" + (p + 1) + ":briefDesc_" + this_ar_id + ")"
                        + " MERGE (y" + (p + 1) + ")-[:该歌手详情中包括此信息]->(y" + p + ")");
                        p += 2;
                    }
                }

                /// 最后创建该歌手的本身节点，并连接以上节点
                lines.Add("CREATE (:Singer_" + this_ar_id + " {id:'" + this_ar_id + "',name:'" + this_ar_name + "',picUrl:'" + this_ar_picUrl + "',img1v1Url:'" + this_ar_img1v1Url + "',albumSize:'" + this_ar_albumSize + "',alias:['null','null'],musicSize:'" + this_ar_musicSize + "',mvSize:'" + this_ar_mvSize + "'})"
                + " MERGE (s" + p + ":Singer_" + this_ar_id + ")"
                + " MERGE (s" + (p + 1) + ":hotSongs_" + this_ar_id + ")"
                + " MERGE (s" + p + ")-[:该歌手信息包括]->(s" + (p + 1) + ")");
                p += 2;

                lines.Add("MERGE (s" + p + ":Singer_"+this_ar_id+")"
                +" MERGE (s" + (p + 1) + ":al_"+this_ar_id+")"
                + " MERGE (s" + p + ")-[:该歌手信息包括]->(s" + (p + 1) + ")");
                p += 2;

                lines.Add("MERGE (s" + p + ":Singer_"+this_ar_id+")"
                +" MERGE (s" + (p + 1) + ":mvs_"+this_ar_id+")"
                + " MERGE (s" + p + ")-[:该歌手信息包括]->(s" + (p + 1) + ")");
                p += 2;

                lines.Add("MERGE (s" + p + ":Singer_"+this_ar_id+")"
                +" MERGE (s" + (p + 1) + ":briefDesc_"+this_ar_id+")"
                + " MERGE (s" + p + ")-[:该歌手信息包括]->(s" + (p + 1) + ")");
                p += 2;

                /// 将此歌手连接至热门歌手
                lines.Add("MERGE (L" + p + ":hotSongs_Singer)"
                +" MERGE (L" + (p + 1) + ":Singer_" + this_ar_id + ")"
                + " MERGE (L" + p + ")-[:热门歌手包括]->(L" + (p + 1) + ")");
                p += 2;
            }

            using (StreamWriter writer = new StreamWriter("output.txt"))
            {
                foreach (string line in lines)
                {
                    writer.WriteLine(line);
                }
            }
        }
    }
}