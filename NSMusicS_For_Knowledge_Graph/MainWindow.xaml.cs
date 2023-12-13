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
using System;
using Application = System.Windows.Application;
using System.Collections.ObjectModel;

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
            this.DataContext = vs_singer_info;
        }
        private async void Button_Click(object sender, RoutedEventArgs e)
        {
            ListBox_Show.Items.Clear();

            await Init_Find_CloudMusicInfo_In_KG();

            await Init_Run_Cypher_In_Neo4jAsync();

            using (StreamWriter writer = new StreamWriter("out_error.txt"))
            {
                foreach (string line in Error_Info)
                {
                    writer.WriteLine(line);
                }
            }

            this.Close();
        }

        public List<string> Error_Info = new List<string>();

        private string web_url = "";//输入neteasecloudmusicapi网易云API地址 
        ViewModule_Search_Singer_ALL_Info vs_singer_info; 
        public async Task Init_Run_Cypher_In_Neo4jAsync()
        {
            Application.Current.Dispatcher.Invoke(() =>
            {
                var newItem = "正在将txt中的Cypher语句，逐行提交至Neo4j执行。。。";
                ListBox_Show.Items.Add(newItem);
                ListBox_Show.ScrollIntoView(newItem);
            });

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
                    Application.Current.Dispatcher.Invoke(() =>
                    {
                        var newItem = "：" + (num_s + 1) + "：" + line;
                        ListBox_Show.Items.Add(newItem);
                        ListBox_Show.ScrollIntoView(newItem);
                    });


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
                Error_Info.Add("第"+ num_s+"行："+ Cql);
            }
            finally
            {
                // 关闭会话
                await session.CloseAsync();
            }
        }


        public int singer_nums = 200;
        public int song_nums = 200;

        public async Task Init_Find_CloudMusicInfo_In_KG()
        {
            /// 1.获取    所有的热门歌手的基本信息
            await Find_1_For_Singer_Basic_Info();

            Application.Current.Dispatcher.Invoke(() =>
            {
                var newItem = "所有歌手基本信息提取完成";
                ListBox_Show.Items.Add(newItem);
                ListBox_Show.ScrollIntoView(newItem);
            });

            /// 2.补全    所有的热门歌手的详情信息
            await Find_2_For_Singer_Details_Info();

            Application.Current.Dispatcher.Invoke(() =>
            {
                var newItem = "所有歌手详情提取完成";
                ListBox_Show.Items.Add(newItem);
                ListBox_Show.ScrollIntoView(newItem);
            });

            /// 3.获取    所有的热门歌手的 各自所有的热歌（根据热歌）
            await Find_3_For_Singer_HotSongs();

            Application.Current.Dispatcher.Invoke(() =>
            {
                var newItem = "所有歌手热歌提取完成";
                ListBox_Show.Items.Add(newItem);
                ListBox_Show.ScrollIntoView(newItem);
            });

            /// 4.获取    所有的热门歌手的 各自所有的专辑（根据热歌找到专辑id，进而找到该专辑所有歌曲）
            /// 不找该专辑所有歌曲，仅匹配当前热歌专辑信息
            await Find_4_For_Singer_ALL_Album();

            Application.Current.Dispatcher.Invoke(() =>
            {
                var newItem = "所有歌手专辑提取完成";
                ListBox_Show.Items.Add(newItem);
                ListBox_Show.ScrollIntoView(newItem);
            });

            /// 5.获取    所有的热门歌手的 各自所有的热歌 对应的MV信息
            await Find_5_For_Singer_ALL_MV();

            Application.Current.Dispatcher.Invoke(() =>
            {
                var newItem = "所有歌手MV提取完成";
                ListBox_Show.Items.Add(newItem);
                ListBox_Show.ScrollIntoView(newItem);
            });



            try
            {
                /// 6.生成Cypher语句，写入到txt中
                MERGE_Cypher_To_Neo4j_Line();

                Application.Current.Dispatcher.Invoke(() =>
                {
                    var newItem = "生成Cypher语句，写入到txt完成";
                    ListBox_Show.Items.Add(newItem);
                    ListBox_Show.ScrollIntoView(newItem);
                });
            }
            catch { }
        }

        public async Task Find_1_For_Singer_Basic_Info()
        {
            string apiUrl = web_url + "/top/artists?limit="+ singer_nums;// ：/toplist/artist
            using (HttpClient client = new HttpClient())
            {
                using (HttpResponseMessage response = await client.GetAsync(apiUrl))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        response.EnsureSuccessStatusCode();
                        string json = await response.Content.ReadAsStringAsync();
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
                                };
                                if (ms.ar_name != null)
                                    ms.ar_name = ms.ar_name.Replace("\"","");
                                if (ms.ar_picUrl != null)
                                    ms.ar_picUrl = ms.ar_picUrl.Replace("\"", "");
                                if (ms.ar_img1v1Url != null)
                                    ms.ar_img1v1Url = ms.ar_img1v1Url.Replace("\"", "");

                                vs_singer_info.musicData_Singer_Infos.Add(ms);

                                Application.Current.Dispatcher.Invoke(() =>
                                {
                                    var newItem = "获取歌手基本信息" + "：" + record["id"] + "：" + record["name"];
                                    ListBox_Show.Items.Add(newItem);
                                    ListBox_Show.ScrollIntoView(newItem);
                                });
                            }
                        }
                        recordsArray.Clear();
                        recordsArray = null;
                    }
                }
            }
        }
        public async Task Find_2_For_Singer_Details_Info()
        {
            for (int i = 0; i < vs_singer_info.musicData_Singer_Infos.Count; i++)
            {
                Application.Current.Dispatcher.Invoke(() =>
                {
                    var newItem = "获取歌手详情中。。。。" + "："+ (i+1) +"/"+ vs_singer_info.musicData_Singer_Infos.Count + "：" + vs_singer_info.musicData_Singer_Infos[i].ar_name;
                    ListBox_Show.Items.Add(newItem);
                    ListBox_Show.ScrollIntoView(newItem);
                });

                MusicData_Singer_Info temp = vs_singer_info.musicData_Singer_Infos[i];
                string apiUrl = web_url + "/artist/desc?id=" + temp.ar_id.ToString();
                using (HttpClient client = new HttpClient())
                {
                    using (HttpResponseMessage response = await client.GetAsync(apiUrl))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            response.EnsureSuccessStatusCode();
                            string json = await response.Content.ReadAsStringAsync();

                            JObject root = JObject.Parse(json); 
                            JToken dataToken;
                            if (root.TryGetValue("briefDesc", out dataToken))
                            {
                                MusicData_Singer_Details ms = new MusicData_Singer_Details
                                {
                                    ti = "歌手简介",
                                    txt = "歌手简介：" + dataToken.ToString(),
                                };
                                if (ms.ti != null)
                                    ms.ti = ms.ti.Replace("\"", "");
                                if (ms.txt != null)
                                    ms.txt = ms.txt.Replace("\"", "");

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
                                        ti = RetainChineseString((string)record["ti"]),
                                        txt = (string)record["ti"] + "：" + (string)record["txt"],
                                    };
                                    if (ms.ti != null)
                                        ms.ti = ms.ti.Replace("\"", "");
                                    if (ms.txt != null)
                                        ms.txt = ms.txt.Replace("\"", "");

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
        private string RetainChineseString(string? str)
        {
            if (string.IsNullOrEmpty(str))
            {
                return string.Empty;
            }

            StringBuilder chineseString = new StringBuilder();
            foreach (char c in str)
            {
                if (IsChinese(c))
                {
                    chineseString.Append(c);
                }
            }

            return chineseString.ToString();
        }
        private bool IsChinese(char c)
        {
            return (c >= 0x4E00 && c <= 0x9FA5) || // 基本汉字
                   (c >= 0x9FA6 && c <= 0x9FEF) || // 扩展A
                   (c >= 0x3400 && c <= 0x4DBF) || // 扩展B
                   (c >= 0x20000 && c <= 0x2A6DF) || // 扩展C
                   (c >= 0x2A700 && c <= 0x2B73F) || // 扩展D
                   (c >= 0x2B740 && c <= 0x2B81F) || // 扩展E
                   (c >= 0x2B820 && c <= 0x2CEAF) || // 扩展F
                   (c >= 0xF900 && c <= 0xFAFF) || // 兼容汉字
                   (c >= 0x2F800 && c <= 0x2FA1F); // 兼容表意文字
        }


        public async Task Find_3_For_Singer_HotSongs()
        {
            for (int i = 0; i < vs_singer_info.musicData_Singer_Infos.Count; i++)
            {
                Application.Current.Dispatcher.Invoke(() =>
                {
                    var newItem = "获取歌手热歌中。。。。" + "：" + (i + 1) + "/" + vs_singer_info.musicData_Singer_Infos.Count + "：" + vs_singer_info.musicData_Singer_Infos[i].ar_name;
                    ListBox_Show.Items.Add(newItem);
                    ListBox_Show.ScrollIntoView(newItem);
                });

                MusicData_Singer_Info temp = vs_singer_info.musicData_Singer_Infos[i];
                string apiUrl = web_url + "/artists/songs?id=" + temp.ar_id.ToString() + "&limit="+ song_nums;//默认100首
                using (HttpClient client = new HttpClient())
                {
                    using (HttpResponseMessage response = await client.GetAsync(apiUrl))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            response.EnsureSuccessStatusCode();
                            string json = await response.Content.ReadAsStringAsync();
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
                                    ms = await Get_Song_Url(ms.id, ms);
                                    if (ms.name != null)
                                        ms.name = ms.name.Replace("\"", "");
                                    if (ms.al_name != null)
                                        ms.al_name = ms.al_name.Replace("\"", "");
                                    if (ms.ar_name != null)
                                        ms.ar_name = ms.ar_name.Replace("\"", "");

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
        public async Task<MusicData_Singer_HotSongs> Get_Song_Url(int song_id, MusicData_Singer_HotSongs ms)
        {
            var tcs = new TaskCompletionSource<MusicData_Singer_HotSongs>();

            string apiUrl = web_url + "/song/url?id=" + song_id;
            using (HttpClient client = new HttpClient())
            {
                using (HttpResponseMessage response = await client.GetAsync(apiUrl))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        response.EnsureSuccessStatusCode();
                        string json = await response.Content.ReadAsStringAsync();
                        JArray recordsArray = (JArray)JObject.Parse(json)["data"];
                        if (recordsArray != null && recordsArray.Count > 0)
                        {
                            foreach (JObject record in recordsArray)
                            {
                                ms.url = (string)record["url"];

                                if (ms.url != null)
                                    ms.url = ms.url.Replace("\"", "");

                                tcs.SetResult(ms);
                            }
                        }
                        recordsArray.Clear();
                        recordsArray = null;
                    }
                }
            }

            return await tcs.Task;
        }

        public async Task Find_4_For_Singer_ALL_Album()
        {
            for (int i = 0; i < vs_singer_info.musicData_Singer_Infos.Count; i++)
            {
                Application.Current.Dispatcher.Invoke(() =>
                {
                    var newItem = "获取歌手所有专辑中。。。" + "：" + (i + 1) + "/" + vs_singer_info.musicData_Singer_Infos.Count + "：" + vs_singer_info.musicData_Singer_Infos[i].ar_name;
                    ListBox_Show.Items.Add(newItem);
                    ListBox_Show.ScrollIntoView(newItem);
                });

                MusicData_Singer_Info temp = vs_singer_info.musicData_Singer_Infos[i];
                for (int k = 0; k < temp.musicData_Singer_HotSongs.Count; k++)
                {
                    string apiUrl = web_url + "/album?id=" + temp.musicData_Singer_HotSongs[k].al_id.ToString();
                    using (HttpClient client = new HttpClient())
                    {
                        using (HttpResponseMessage response = await client.GetAsync(apiUrl))
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                response.EnsureSuccessStatusCode();
                                string json = await response.Content.ReadAsStringAsync();
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
                                            if (ms.al_name != null)
                                                ms.al_name = ms.al_name.Replace("\"", "");
                                            if (ms.al_picUrl != null)
                                                ms.al_picUrl = ms.al_picUrl.Replace("\"", "");
                                            if (ms.ar_name != null)
                                                ms.ar_name = ms.ar_name.Replace("\"", "");


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
        public async Task Find_5_For_Singer_ALL_MV()
        {
            for (int i = 0; i < vs_singer_info.musicData_Singer_Infos.Count; i++)
            {
                Application.Current.Dispatcher.Invoke(() =>
                {
                    var newItem = "获取歌手所有MV中" + "：" + (i + 1) + "/" + vs_singer_info.musicData_Singer_Infos.Count + "：" + vs_singer_info.musicData_Singer_Infos[i].ar_name;
                    ListBox_Show.Items.Add(newItem);
                    ListBox_Show.ScrollIntoView(newItem);
                });

                MusicData_Singer_Info temp = vs_singer_info.musicData_Singer_Infos[i];
                for (int k = 0; k < temp.musicData_Singer_HotSongs.Count; k++)
                {
                    if (temp.musicData_Singer_HotSongs[k].mv != 0)
                    {
                        string apiUrl = web_url + "/mv/detail?mvid=" + temp.musicData_Singer_HotSongs[k].mv.ToString();
                        using (HttpClient client = new HttpClient())
                        {
                            using (HttpResponseMessage response = await client.GetAsync(apiUrl))
                            {
                                if (response.IsSuccessStatusCode)
                                {
                                    response.EnsureSuccessStatusCode();
                                    string json = await response.Content.ReadAsStringAsync();

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
                                            mv_brs = (JArray)dataObject["brs"],

                                            ar_id = (int)dataObject["artists"][0]["id"],
                                            ar_name = (string)dataObject["artists"][0]["name"],
                                        };
                                        ms = await Get_MV_Url((int)dataObject["id"], ms);
                                        if (ms.mv_name != null)
                                            ms.mv_name = ms.mv_name.Replace("\"", "");
                                        if (ms.mv_cover != null)
                                            ms.mv_cover = ms.mv_cover.Replace("\"", "");
                                        if (ms.ar_name != null)
                                            ms.ar_name = ms.ar_name.Replace("\"", "");

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
        }
        public async Task<MusicData_Singer_ALL_MV> Get_MV_Url(int mv_id, MusicData_Singer_ALL_MV ms)
        {
            var tcs = new TaskCompletionSource<MusicData_Singer_ALL_MV>();

            string br = "";
            string size = "";
            if (ms.mv_brs != null && ms.mv_brs.Count > 0)
            {
                foreach (JObject record in ms.mv_brs)
                {
                    br = (string)record["br"];
                    size = (string)record["size"];
                }
            }

            string apiUrl = web_url + "/mv/url?id=" + mv_id + "&r=" + br;
            using (HttpClient client = new HttpClient())
            {
                using (HttpResponseMessage response = await client.GetAsync(apiUrl))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        response.EnsureSuccessStatusCode();
                        string json = await response.Content.ReadAsStringAsync();

                        JObject root = JObject.Parse(json);
                        JToken dataToken;
                        if (root.TryGetValue("data", out dataToken))
                        {
                            ms.mv_url = (string)dataToken["url"];
                            ms.mv_size = size;

                            if (ms.mv_url != null)
                                ms.mv_url = ms.mv_url.Replace("\"", "");

                            tcs.SetResult(ms);
                        }
                    }
                }
            }

            return await tcs.Task;
        }



        public void MERGE_Cypher_To_Neo4j_Line()
        {
            List<string> lines = new List<string>();
            int p = 1;
            /// 创建初始节点
            lines.Add("MERGE (:hotSongs_Singer {name:\"热门歌手\"})");
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
                lines.Add("MERGE (:hotSongs_" + this_ar_id + " {name:\"热歌\"})");
                lines.Add("MERGE (:al_" + this_ar_id + " {name:\"专辑\"})");
                lines.Add("MERGE (:briefDesc_" + this_ar_id + "{name:\"歌手详情\"})");
                lines.Add("MERGE (:mvs_" + this_ar_id + "{name:\"MV\"})");

                /// 开始创建该歌手的热歌，专辑，MV信息
                for (int k = 0; k < vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs.Count; k++)
                {
                    /// 1.添加该热歌
                    int id = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs[k].id;
                    string name = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs[k].name;
                    int dt = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs[k].dt;
                    int mv = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs[k].mv;
                    string url = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs[k].url;

                    lines.Add("MERGE (p" + p + ":hotSongs_" + this_ar_id + ")"
                        +" MERGE (p" +(p + 1) + ":Song_"+ id + " {id: \""+ id + "\", name: \""+ name + "\", dt: \""+ dt + "\", mv: \""+ mv + "\", url: \""+ url + "\"})"
                        + " MERGE (p" + p + ")-[:该歌手所有热歌中包括]->(p" +(p + 1) + ")");
                    p += 2;

                    /// 2.添加该热歌的专辑，并将此专辑与热歌 绑定 指向关系
                    int al_id = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs[k].al_id;
                    try
                    {
                        var result = from album in vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_ALL_Albums
                                     where album.al_id == al_id
                                     select album;
                        if (result != null)
                        {
                            foreach (var album in result)
                            {
                                /// alia先空着,  写入\"防止 Cypher出现识别\"\"错误
                                lines.Add(" MERGE (p" + p + ":al_" + al_id + " {id:\"" + al_id + "\"}) SET p" + p + ".name = \"" + album.al_name + "\",p" + p + ".alia = [\"null\"],p" + p + ".picUrl = \"" + album.al_picUrl + "\"");
                                p += 2;

                                lines.Add(" MERGE (p" + p + ":al_" + this_ar_id + ")"
                                + " MERGE (p" + (p + 1) + ": al_" + al_id + ")"
                                + " MERGE(p" + p + ") - [:该歌手所有专辑中包括]->(p" + (p + 1) + ")");
                                p += 2;

                                lines.Add("MERGE (p" + p + ":al_" + al_id + ")"
                                + " MERGE (p" + (p + 1) + ":Song_" + id + ")"
                                + " MERGE (p" + p + ")-[:该专辑包括此歌曲]->(p" + (p + 1) + ")");
                                p += 2;

                                break;/// 只读取一个
                            }
                        }
                        result = null;
                    }
                    catch { }

                    /// 3.添加该歌曲的MV
                    int mv_id = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_HotSongs[k].mv;
                    if (mv_id != 0)
                    {
                        try
                        {
                            var result_mv = from mv_ in vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_ALL_MVs
                                            where mv_.mv_id == mv_id
                                            select mv_;
                            if (result_mv != null)
                            {
                                foreach (var _mv in result_mv)
                                {
                                    lines.Add("MERGE (:mv_" + mv_id + " {id:\"" + mv_id + "\",name:\"" + _mv.mv_name + "\",cover:\"" + _mv.mv_cover + "\",url:\""+ _mv .mv_url+ "\",size:\""+ _mv.mv_size+ "\"})"
                                    + " MERGE (p" + p + ":mvs_" + this_ar_id + ")"
                                    + " MERGE (p" + (p + 1) + ":mv_" + mv_id + ")"
                                    + " MERGE (p" + p + ")-[:该歌手所有MV中包括此MV]->(p" + (p + 1) + ")");
                                    p += 2;

                                    lines.Add("MERGE (p" + p + ":Song_" + id + ")"
                                    + " MERGE (p" + (p + 1) + ":mv_" + mv_id + ")"
                                    + " MERGE (p" + p + ")-[:该歌曲的MV]->(p" + (p + 1) + ")");
                                    p += 2;
                                }
                            }
                            result_mv = null;
                        }
                        catch { }
                    }
                }

                /// 然后创建该歌手的简介信息
                if (vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details != null && vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details.Count > 0)
                {
                    /// 该歌手的详细信息
                    for (int d = 0; d < vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details.Count; d++)
                    {
                        string ti = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details[d].ti;
                        string txt = vs_singer_info.musicData_Singer_Infos[i].musicData_Singer_Details[d].txt;
                        if (txt != null)
                        {
                            txt = txt.Replace("\n", "");
                            txt = txt.Replace("\t", "");
                            txt = txt.Replace("\"", "");
                        }

                        lines.Add("MERGE (:introduction_" + this_ar_id + "_txt_" + d + " { name :\"" + txt + "\" })"
                        + " MERGE (y" + p + ":introduction_" + this_ar_id + "_txt_" + d + ")"
                        + " MERGE (y" + (p + 1) + ":briefDesc_" + this_ar_id + ")"
                        + " MERGE (y" + (p + 1) + ")-[:该歌手详情中包括此信息]->(y" + p + ")");
                        p += 2;
                    }
                }

                /// 最后创建该歌手的本身节点，并连接以上节点
                lines.Add("MERGE (:Singer_" + this_ar_id + " {id:\"" + this_ar_id + "\",name:\"" + this_ar_name + "\",picUrl:\"" + this_ar_picUrl + "\",img1v1Url:\"" + this_ar_img1v1Url + "\",albumSize:\"" + this_ar_albumSize + "\",alias:[\"null\",\"null\"],musicSize:\"" + this_ar_musicSize + "\",mvSize:\"" + this_ar_mvSize + "\"})"
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