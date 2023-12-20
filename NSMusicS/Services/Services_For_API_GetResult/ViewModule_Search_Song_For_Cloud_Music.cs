using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.Command;
using NSMusicS.Models.Servies_For_API_Info;
using NSMusicS.Models.Song_Audio_Out.CSCore_Ffmpeg;
using NSMusicS.Models.Song_List_Infos;
using NSMusicS.UserControlLibrary.Main_Home_Right_MyMusic_UserControls;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using static NSMusicS.Models.Servies_For_API_Info.API_Song_Info;
using static NSMusicS.Models.Servies_For_API_Info.API_Song_Info_Get_Url;
using static NSMusicS.Models.Servies_For_API_Info.Show_Search_Song;
using NSMusicS.Models.APP_DB_SqlLite.SS_Convert;
using NSMusicS.Models.APP_DB_SqlLite.Update_DB_Async;

namespace NSMusicS.Services.Services_For_API_GetResult
{
    public class ViewModule_Search_Song_For_Cloud_Music : ViewModelBase
    {
        public static ViewModule_Search_Song_For_Cloud_Music viewModule_Search_Song_For_Cloud_Music { get; set; }
        public static ViewModule_Search_Song_For_Cloud_Music Retuen_This()
        {
            viewModule_Search_Song_For_Cloud_Music = Return_This_ViewModule_Search_Song_For_Cloud_Music();
            return viewModule_Search_Song_For_Cloud_Music;
        }
        private static ViewModule_Search_Song_For_Cloud_Music Return_This_ViewModule_Search_Song_For_Cloud_Music()
        {
            if (viewModule_Search_Song_For_Cloud_Music == null)
                viewModule_Search_Song_For_Cloud_Music = new ViewModule_Search_Song_For_Cloud_Music();
            return viewModule_Search_Song_For_Cloud_Music;
        }

        public string Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";

        Update_Song_List_Infos update_Song_List_Infos = Update_Song_List_Infos.Retuen_This();

        public ViewModule_Search_Song_For_Cloud_Music()
        {
            //建立初始化连接对象
            client = new HttpClient();
            //反序列化json
            ApiResponse_Search_Songs = new ApiResponse_Search_Song();
            ApiResponse_Get_Privileges = new ApiResponse_Search_Song();
            ApiResponse_Get_Urls = new ApiResponse_Get_Url();
            //绑定的数据源属性
            ShowSelect_Search_Songs = new ObservableCollection<Show_Search_Song>();
            //
            Song_MaxBrLevel_Infos = new ObservableCollection<Song_MaxBrLevel_Info>();
            //
            maxBrLevel = "";
            //
            Song_MV_Infos = new ObservableCollection<Song_MV_Info>();
            //
            Song_Set_Infos = new Song_Set_Info();
            //
            Show_API_HttpClient_Complete = Visibility.Collapsed;
            //
            Show_API_HttpClient_ALL_BrLevel_Infos_Complete = Visibility.Collapsed;

            //搜索关键词，适合搜索
            RefCommand_Search_Song = new RelayCommand(async () =>
            {
                try
                {
                    if (Api_client != null && Api_client.Length > 0)
                    {
                        //更改绑定在控价的数据源，仅在 RefCommand = new RelayCommand(async () =>内有效
                        Application.Current.Dispatcher.Invoke(() =>
                    {
                        ShowSelect_Search_Songs.Clear();
                        Show_API_HttpClient_Complete = Visibility.Visible;//显示动画
                    });
                        // 异步等待,UI刷新Show_API_HttpClient_Complete
                        await Task.Delay(50);

                        //异步获取API信息，不卡顿Show_API_HttpClient_Complete内的动画
                        string apiUrl = Api_client + "/cloudsearch?keywords="
                                   + Json_Search_Song.SearchText + "&limit=100";
                                                                 // Make the API call asynchronously
                        HttpResponseMessage response = await client.GetAsync(apiUrl);
                        response.EnsureSuccessStatusCode();
                        string json = await response.Content.ReadAsStringAsync();
                        // Deserialize the JSON response asynchronously
                        ApiResponse_Search_Songs = await Task.Run(() => JsonConvert.DeserializeObject<ApiResponse_Search_Song>(json));

                        if (ApiResponse_Search_Songs != null)
                        {
                            if (ApiResponse_Search_Songs.result.songs != null)// 单曲显示
                            {
                                //异步更改数据同步至UI
                                await Task.Run(() =>
                                {
                                    for (int i = 0; i < ApiResponse_Search_Songs.result.songs.Count; i++)
                                    {
                                        string singer_name = "";
                                        for (int j = 0; j < ApiResponse_Search_Songs.result.songs[i].ar.Count; j++)
                                        {
                                            singer_name += ApiResponse_Search_Songs.result.songs[i].ar[j].name;

                                            if (j == 0 && ApiResponse_Search_Songs.result.songs[i].ar.Count > 1)
                                                singer_name += "、";

                                            if (j != ApiResponse_Search_Songs.result.songs[i].ar.Count - 1)
                                                if (j != 0)
                                                    singer_name += "、";
                                        }


                                        //更改绑定在控价的数据源
                                        Application.Current.Dispatcher.Invoke(() =>
                                        {
                                            try
                                            {
                                                Show_Search_Song temp = new Show_Search_Song();
                                                temp.Song_No = i + 1;
                                                temp.Song_Name = ApiResponse_Search_Songs.result.songs[i].name;
                                                temp.Song_id = ApiResponse_Search_Songs.result.songs[i].id.ToString();
                                                temp.Singer_Name = singer_name;
                                                temp.Singer_id = ApiResponse_Search_Songs.result.songs[i].ar[0].id.ToString();//只保留第一位歌手
                                                temp.Album_Name = ApiResponse_Search_Songs.result.songs[i].al.name;
                                                temp.Album_id = ApiResponse_Search_Songs.result.songs[i].al.id.ToString();
                                                temp.Album_Url = ApiResponse_Search_Songs.result.songs[i].al.picUrl;

                                                TimeSpan timeSpan_1 = new TimeSpan(0, 0, 0, 0, ApiResponse_Search_Songs.result.songs[i].dt);
                                                var timeSpan = TimeSpan.FromSeconds(timeSpan_1.TotalSeconds);
                                                var result = string.Format("{0:D2}:{1:D2}", (int)timeSpan.TotalMinutes, timeSpan.Seconds);
                                                temp.Song_Duration = result;

                                                ShowSelect_Search_Songs.Add(temp);
                                            }
                                            catch
                                            {

                                            }
                                        });
                                    }
                                });
                            }
                            else if (ApiResponse_Search_Songs.result.albums != null)// 专辑显示
                            {
                                //异步更改数据同步至UI
                                await Task.Run(() =>
                                {
                                    for (int i = 0; i < ApiResponse_Search_Songs.result.albums.Count; i++)
                                    {
                                        string singer_name = "";
                                        for (int j = 0; j < ApiResponse_Search_Songs.result.albums[i].artists.Count; j++)
                                        {
                                            singer_name += ApiResponse_Search_Songs.result.albums[i].artists[j].name;

                                            if (j == 0 && ApiResponse_Search_Songs.result.albums[i].artists.Count > 1)
                                                singer_name += "、";

                                            if (j != ApiResponse_Search_Songs.result.albums[i].artists.Count - 1)
                                                if (j != 0)
                                                    singer_name += "、";
                                        }


                                        //更改绑定在控价的数据源
                                        Application.Current.Dispatcher.Invoke(() =>
                                        {
                                            try
                                            {
                                                Show_Search_Song temp = new Show_Search_Song();
                                                temp.Song_No = i + 1;
                                                temp.Song_Name = null;
                                                temp.Song_id = null;
                                                temp.Singer_Name = singer_name;
                                                temp.Singer_id = ApiResponse_Search_Songs.result.albums[i].artists[0].id.ToString();//只保留第一位歌手
                                                temp.Album_Name = ApiResponse_Search_Songs.result.albums[i].name;
                                                temp.Album_id = ApiResponse_Search_Songs.result.albums[i].id.ToString();
                                                temp.Album_Url = ApiResponse_Search_Songs.result.albums[i].picUrl;

                                                /*TimeSpan timeSpan_1 = new TimeSpan(0, 0, 0, 0, ApiResponse_Search_Songs.result.albums[i].dt);
                                                var timeSpan = TimeSpan.FromSeconds(timeSpan_1.TotalSeconds);
                                                var result = string.Format("{0:D2}:{1:D2}", (int)timeSpan.TotalMinutes, timeSpan.Seconds);
                                                temp.Song_Duration = result;*/

                                                ShowSelect_Search_Songs.Add(temp);
                                            }
                                            catch
                                            {

                                            }
                                        });
                                    }
                                });
                            }
                            else if (ApiResponse_Search_Songs.result.artists != null)
                            {
                                //异步更改数据同步至UI
                                await Task.Run(() =>
                                {
                                    for (int i = 0; i < ApiResponse_Search_Songs.result.artists.Count; i++)
                                    {
                                        string singer_name = ApiResponse_Search_Songs.result.artists[i].name;

                                        //更改绑定在控价的数据源
                                        Application.Current.Dispatcher.Invoke(() =>
                                        {
                                            try
                                            {
                                                Show_Search_Song temp = new Show_Search_Song();
                                                temp.Song_No = i + 1;
                                                temp.Song_Name = null;
                                                temp.Song_id = null;
                                                temp.Singer_Name = singer_name;
                                                temp.Singer_id = ApiResponse_Search_Songs.result.artists[i].id.ToString();//只保留第一位歌手
                                                temp.Album_Name = null;
                                                temp.Album_id = null;
                                                temp.Album_Url = null;


                                                /*TimeSpan timeSpan_1 = new TimeSpan(0, 0, 0, 0, ApiResponse_Search_Songs.result.artists[i].dt);
                                                var timeSpan = TimeSpan.FromSeconds(timeSpan_1.TotalSeconds);
                                                var result = string.Format("{0:D2}:{1:D2}", (int)timeSpan.TotalMinutes, timeSpan.Seconds);
                                                temp.Song_Duration = result;*/

                                                ShowSelect_Search_Songs.Add(temp);
                                            }
                                            catch
                                            {

                                            }
                                        });
                                    }
                                });
                            }
                        }
                        
                        /*Application.Current.Dispatcher.Invoke(() =>
                        {
                            ShowSelect_Search_Songs.Clear();
                            for (int i = 0; i < ShowSelect_Search_Songs_ALL.Count; i++)
                            {
                                Thread.Sleep(5);
                                ShowSelect_Search_Songs.Add(ShowSelect_Search_Songs_ALL[i]);
                            }
                        });*/
                        /*//默认装填前50条数据显示
                        Application.Current.Dispatcher.Invoke(() =>
                        {
                            ShowSelect_Search_Songs_Page_Number = 1;
                            ShowSelect_Search_Songs.Clear();

                            int count = 50;
                            if (ShowSelect_Search_Songs_ALL.Count < 50)
                                count = ShowSelect_Search_Songs_ALL.Count;
                            for (int i = 0; i < count; i++)
                            {
                                Thread.Sleep(5);
                                ShowSelect_Search_Songs.Add(ShowSelect_Search_Songs_ALL[i]);
                            }
                        });*/
                    }

                    
                }
                catch (HttpRequestException e)
                {
                    MessageBox.Show("Error: " + e.Message);
                }
                finally
                {


                    // 在 UI 线程上更新 Show_API_HttpClient_Complete 属性
                    Application.Current.Dispatcher.Invoke(() =>
                    {
                        Show_API_HttpClient_Complete = Visibility.Collapsed;
                    });
                    // 异步等待,UI刷新Show_API_HttpClient_Complete
                    await Task.Delay(50);
                }
            });

            //获取歌曲的Url地址，适合在线播放
            RefCommand_Get_Song_Info_Url = new RelayCommand(async () =>
            {
                if (Api_client != null && Api_client.Length > 0)
                {
                    //更改绑定在控价的数据源，仅在 RefCommand = new RelayCommand(async () =>内有效
                    Application.Current.Dispatcher.Invoke(() =>
                    {
                        Show_API_HttpClient_Complete = Visibility.Visible;//显示动画
                    });
                    // 异步等待,UI刷新Show_API_HttpClient_Complete
                    await Task.Delay(50);


                    string apiUrl = Api_client + "/song/url/v1?id="
                                    + Json_Search_Song.Song_id + "&level=standard";
                    HttpResponseMessage response = await client.GetAsync(apiUrl);
                    response.EnsureSuccessStatusCode();
                    string json = await response.Content.ReadAsStringAsync();
                    ApiResponse_Get_Urls = await Task.Run(() => JsonConvert.DeserializeObject<ApiResponse_Get_Url>(json));

                    //获取url
                    string temp_string = ApiResponse_Get_Urls.data[0].url;
                    Json_Search_Song.Song_Web_Url = temp_string;
                    //下载url
                    /*var url = Json_Search_Song.Song_Web_Url;
                    var save = Json_Search_Song.Song_File;
                    if (!File.Exists(save))
                    {
                        using (var web = new WebClient())
                        {
                            web.DownloadFile(url, save);
                        }
                    }*/
                    //添加url到songList_Infos_Current_Playlist
                    Application.Current.Dispatcher.Invoke(() =>
                    {
                        ObservableCollection<Song_Info> songList_Infos_Current_Playlist =
                        SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;
                        Song_Info temp = new Song_Info();
                        temp.Song_Name = Json_Search_Song.Song_Name;
                        temp.Singer_Name = Json_Search_Song.Singer_Name;
                        temp.Album_Name = Json_Search_Song.Album_Name;
                        temp.Song_Url = Json_Search_Song.Song_Web_Url;
                        temp.Song_No = 0;
                        songList_Infos_Current_Playlist.Clear();
                        songList_Infos_Current_Playlist.Add(temp);
                        SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist =
                            songList_Infos_Current_Playlist;
                    });

                    /*//同步信息到UI
                    Song_Name = Json_Search_Song.Song_Name;
                    Singer_Name = Json_Search_Song.Singer_Name;
                    Album_Name = Json_Search_Song.Album_Name;
                    Song_Name_ALL = Singer_Name + " - " + Song_Name;*/
                    //获取专辑图片
                    string temp_image_url = "";
                    for (int i = 0; i < ShowSelect_Search_Songs.Count; i++)
                    {
                        if (ShowSelect_Search_Songs[i].Song_id.Equals(Json_Search_Song.Song_id))
                            temp_image_url = ShowSelect_Search_Songs[i].Album_Url;
                    }
                    //Album_Image = new BitmapImage(new Uri(temp_image_url));

                    ViewModule_Search_Song viewModule_Search_Song = ViewModule_Search_Song.Retuen_This();
                    if (Json_Search_Song.Song_Web_Url != null)
                        viewModule_Search_Song.MediaElement_Song_Url = new Uri(Json_Search_Song.Song_Web_Url);


                    // 在 UI 线程上更新 Show_API_HttpClient_Complete 属性
                    Application.Current.Dispatcher.Invoke(() =>
                    {
                        Show_API_HttpClient_Complete = Visibility.Collapsed;
                    });
                    // 异步等待,UI刷新Show_API_HttpClient_Complete
                    await Task.Delay(50);
                }
            });

            //获取歌曲下载面板 详情
            RefCommand_Get_Song_Info = new RelayCommand(async () =>
            {
                try
                {
                    if (Api_client != null && Api_client.Length > 0)
                    {
                        string apiUrl = Api_client + "/song/detail?ids="
                                        + Json_Search_Song.Song_id;
                        HttpResponseMessage response = await client.GetAsync(apiUrl);
                        response.EnsureSuccessStatusCode();
                        string json = await response.Content.ReadAsStringAsync();

                        //MV信息：MV歌手和歌曲名 从音质中获取
                        Song_MV_Infos.Clear();
                        Song_MV_Info song_MV_Info = new Song_MV_Info();

                        #region 音质
                        //获取此歌曲的最大音质
                        maxBrLevel = "";
                        JObject jsonObject = JObject.Parse(json);
                        JArray privilegesArray = (JArray)jsonObject["privileges"];
                        JToken firstPrivilege = privilegesArray.FirstOrDefault();
                        if (firstPrivilege != null)
                        {
                            maxBrLevel = (string)firstPrivilege["maxBrLevel"];
                        }

                        //获取MV 歌手歌曲名
                        jsonObject = JObject.Parse(json);
                        song_MV_Info.Song_MV_Name = (string)jsonObject["songs"][0]["name"];
                        song_MV_Info.Singer_Name = (string)jsonObject["songs"][0]["ar"][0]["name"];
                        string MV_ID = (string)jsonObject["songs"][0]["mv"];
                        string file_name = song_MV_Info.Singer_Name + " - " + song_MV_Info.Song_MV_Name;


                        //匹配音质
                        Song_MaxBrLevel_Infos.Clear();
                        //
                        int nums = 0;
                        if (maxBrLevel.Equals(Show_Search_Song.Song_MaxBrLevel.standard.ToString()))
                            nums = 0;
                        if (maxBrLevel.Equals(Show_Search_Song.Song_MaxBrLevel.higher.ToString()))
                            nums = 1;
                        if (maxBrLevel.Equals(Show_Search_Song.Song_MaxBrLevel.exhigh.ToString()))
                            nums = 2;
                        if (maxBrLevel.Equals(Show_Search_Song.Song_MaxBrLevel.lossless.ToString()))
                            nums = 3;
                        if (maxBrLevel.Equals(Show_Search_Song.Song_MaxBrLevel.hires.ToString()))
                            nums = 4;
                        if (maxBrLevel.Equals(Show_Search_Song.Song_MaxBrLevel.jyeffect.ToString()))
                            nums = 5;
                        if (maxBrLevel.Equals(Show_Search_Song.Song_MaxBrLevel.sky.ToString()))
                            nums = 6;
                        if (maxBrLevel.Equals(Show_Search_Song.Song_MaxBrLevel.jymaster.ToString()))
                            nums = 7;
                        //
                        string Level = null;
                        file_name = file_name + ".";
                        //
                        string[] Levels = new string[] { "standard", "higher", "exhigh", "lossless", "hires", "jyeffect", "sky", "jymaster" };
                        for (int i = 0; i < nums + 1; i++)
                        {
                            await Get_BrLevel_Infos(Levels[i], file_name);
                        }
                        #endregion

                        #region MV

                        //匹配 MV资源
                        apiUrl = Api_client + "/mv/url?id=" + MV_ID;
                        response = await client.GetAsync(apiUrl);
                        response.EnsureSuccessStatusCode();
                        json = await response.Content.ReadAsStringAsync();
                        jsonObject = JObject.Parse(json);

                        //获取MV url和文件大小
                        song_MV_Info.MV_Url = (string)jsonObject["data"]["url"];
                        if (song_MV_Info.MV_Url != null)
                        {
                            string pattern = @"\.([^./?]+)(\?|$)";
                            Match match = Regex.Match(song_MV_Info.MV_Url, pattern);
                            if (match.Success)
                            {
                                song_MV_Info.MV_File_Name = song_MV_Info.Singer_Name + " - " + song_MV_Info.Song_MV_Name + "." + match.Groups[1].Value;
                                song_MV_Info.MV_FileSize = ConvertBytesToMegabytes((int)jsonObject["data"]["size"]);
                                Song_MV_Infos.Add(song_MV_Info);
                            }
                        }
                        #endregion

                        //
                        Song_Set_Infos = new Song_Set_Info();
                        #region 内嵌封面
                        //获取专辑图片 网络路径
                        string temp_image_url = "";
                        for (int i = 0; i < ShowSelect_Search_Songs.Count; i++)
                        {
                            if (ShowSelect_Search_Songs[i].Song_id.Equals(Json_Search_Song.Song_id))
                            {
                                temp_image_url = ShowSelect_Search_Songs[i].Album_Url;
                                Song_Set_Infos.Album_Name = ShowSelect_Search_Songs[i].Album_Name;
                                break;
                            }
                        }

                        Song_Set_Infos.imageSource = new BitmapImage(new Uri(temp_image_url));
                        #endregion

                        #region 内嵌歌词
                        //获取歌词
                        apiUrl = Api_client + "/lyric?id=" + Json_Search_Song.Song_id;
                        response = await client.GetAsync(apiUrl);
                        response.EnsureSuccessStatusCode();
                        json = await response.Content.ReadAsStringAsync();
                        jsonObject = JObject.Parse(json);
                        string lyic = null;
                        if ((string)jsonObject["klyric"]["lyric"] != null &&
                                jsonObject["klyric"]["lyric"].ToString().Length >= 66
                                )
                            lyic = (string)jsonObject["klyric"]["lyric"];
                        if (lyic == null || lyic.Length == 0 || lyic.Length < 66)
                            lyic = (string)jsonObject["lrc"]["lyric"];

                        Song_Set_Infos.Lyic = lyic;
                        #endregion

                        //
                        Show_API_HttpClient_ALL_BrLevel_Infos_Complete = Visibility.Visible;
                        Show_API_HttpClient_Complete = Visibility.Collapsed;
                    }
                }
                catch(Exception ex)
                {
                    MessageBox.Show("获取下载信息失败\n"+ ex );


                    Show_API_HttpClient_ALL_BrLevel_Infos_Complete = Visibility.Visible;
                    Show_API_HttpClient_Complete = Visibility.Collapsed;
                }
            });
        }

        #region 选定歌曲 数据+事件

        /// <summary>
        /// 同步播放web流
        /// </summary>
        /// <returns></returns>
        public async Task<ObservableCollection<Song_Info>> Play_Web_Music()
        {
            var tcs = new TaskCompletionSource<ObservableCollection<Song_Info>>();

            try
            {
                if (Api_client != null && Api_client.Length > 0)
                {
                    //更改绑定在控价的数据源，仅在 RefCommand = new RelayCommand(async () =>内有效
                    Application.Current.Dispatcher.Invoke(() =>
                {
                    Show_API_HttpClient_Complete = Visibility.Visible;//显示动画
                });
                    // 异步等待,UI刷新Show_API_HttpClient_Complete
                    await Task.Delay(50);

                    //获取单曲url
                    string apiUrl = Api_client + "/song/url/v1?id="
                                    + Json_Search_Song.Song_id + "&level=standard";
                    HttpResponseMessage response = await client.GetAsync(apiUrl);
                    response.EnsureSuccessStatusCode();
                    string json = await response.Content.ReadAsStringAsync();
                    ApiResponse_Get_Urls = await Task.Run(() => JsonConvert.DeserializeObject<ApiResponse_Get_Url>(json));

                    //获取歌词
                    apiUrl = Api_client + "/lyric?id=" + Json_Search_Song.Song_id;
                    response = await client.GetAsync(apiUrl);
                    response.EnsureSuccessStatusCode();
                    json = await response.Content.ReadAsStringAsync();
                    JObject jsonObject = JObject.Parse(json);
                    string lyic = null;
                    if (jsonObject != null)
                    {
                        try
                        {
                            if ((string)jsonObject["klyric"]["lyric"] != null &&
                                    jsonObject["klyric"]["lyric"].ToString().Length >= 66
                                    )
                                lyic = (string)jsonObject["klyric"]["lyric"];
                        }
                        catch { }
                        try
                        {
                            if (lyic == null || lyic.Length == 0 || lyic.Length < 66)
                                lyic = (string)jsonObject["lrc"]["lyric"];
                        }
                        catch { }
                    }

                    //获取url
                    string temp_string = ApiResponse_Get_Urls.data[0].url;
                    Json_Search_Song.Song_Web_Url = temp_string;
                    //添加url到songList_Infos_Current_Playlist
                    ObservableCollection<Song_Info> songList_Infos_Current_Playlist = null;
                    Application.Current.Dispatcher.Invoke(() =>
                    {
                        songList_Infos_Current_Playlist =
                        SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;
                        Song_Info temp = new Song_Info();
                        temp.Song_Name = Json_Search_Song.Song_Name;
                        temp.Singer_Name = Json_Search_Song.Singer_Name;
                        temp.Album_Name = Json_Search_Song.Album_Name;
                        temp.Song_Url = Json_Search_Song.Song_Web_Url;
                        temp.Song_No = 0;
                        songList_Infos_Current_Playlist.Clear();

                        //获取歌词内容
                        temp.Song_Web_Lyic = lyic;

                        //获取专辑图片 网络路径
                        string temp_image_url = "";
                        for (int i = 0; i < ShowSelect_Search_Songs.Count; i++)
                        {
                            if (ShowSelect_Search_Songs[i].Song_id.Equals(Json_Search_Song.Song_id))
                                temp_image_url = ShowSelect_Search_Songs[i].Album_Url;
                        }
                        temp.Song_Web_Album_Image = new Uri(temp_image_url);

                        songList_Infos_Current_Playlist.Add(temp);
                        SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist =
                            songList_Infos_Current_Playlist;
                    });



                    ViewModule_Search_Song viewModule_Search_Song = ViewModule_Search_Song.Retuen_This();
                    if (Json_Search_Song.Song_Web_Url != null)
                        viewModule_Search_Song.MediaElement_Song_Url = new Uri(Json_Search_Song.Song_Web_Url);

                    tcs.SetResult(songList_Infos_Current_Playlist);
                }
            }
            catch
            {
                Application.Current.Dispatcher.Invoke(() =>
                {
                    MessageBox.Show("无法访问服务器API");
                });
                return null;
            }

            return await tcs.Task;
        }

        /// <summary>
        /// 获取音质信息
        /// </summary>
        /// <param name="Level"></param>
        /// <returns></returns>
        public async Task<ObservableCollection<Song_Info>> Get_BrLevel_Infos(string Level,string file_name)
        {
            var tcs = new TaskCompletionSource<ObservableCollection<Song_Info>>();

            //获取单曲url的 音质名称和音质文件大小
            string apiUrl = Api_client + "/song/url/v1?id="
                            + Json_Search_Song.Song_id + "&level=" + Level;
            HttpResponseMessage response = await client.GetAsync(apiUrl);
            response.EnsureSuccessStatusCode();
            string json = await response.Content.ReadAsStringAsync();
            ApiResponse_Get_Urls = await Task.Run(() => JsonConvert.DeserializeObject<ApiResponse_Get_Url>(json));
            string fileSizeInMB = ConvertBytesToMegabytes(ApiResponse_Get_Urls.data[0].size);

            Song_MaxBrLevel_Info song_MaxBrLevel_Info = new Song_MaxBrLevel_Info();
            song_MaxBrLevel_Info.Song_BrLevel_File_Size = fileSizeInMB;
            song_MaxBrLevel_Info.Song_MaxBrLevel = Level;
            song_MaxBrLevel_Info.Song_Url = ApiResponse_Get_Urls.data[0].url;

            Match match = Regex.Match(song_MaxBrLevel_Info.Song_Url, @"\.(?<ext>\w+)$");
            if (match.Success)
            {
                string fileExtension = match.Groups["ext"].Value;
                song_MaxBrLevel_Info.Song_File_Name = file_name + fileExtension;
            }

            Song_MaxBrLevel_Infos.Add(song_MaxBrLevel_Info);

            tcs.SetResult(null);

            return await tcs.Task;
        }
        static string ConvertBytesToMegabytes(long bytes)
        {
            double megabytes = (bytes / 1024f) / 1024f;
            return megabytes.ToString("N2"); // 保留两位小数
        }

        /// <summary>
        /// 音质数据（选中歌曲）
        /// </summary>
        private ObservableCollection<Song_MaxBrLevel_Info> song_MaxBrLevel_Infos;
        public ObservableCollection<Song_MaxBrLevel_Info> Song_MaxBrLevel_Infos
        {
            get { return song_MaxBrLevel_Infos; }
            set { song_MaxBrLevel_Infos = value; RaisePropertyChanged(); }
        }
        /// <summary>
        /// 最大音质
        /// </summary>
        private string maxBrLevel;
        public string MaxBrLevel
        {
            get { return maxBrLevel; }
            set { maxBrLevel = value; RaisePropertyChanged(); }
        }
        /// <summary>
        /// MV信息
        /// </summary>
        private ObservableCollection<Song_MV_Info> song_MV_Infos;
        public ObservableCollection<Song_MV_Info> Song_MV_Infos
        {
            get { return song_MV_Infos; }
            set { song_MV_Infos = value; RaisePropertyChanged(); }
        }
        /// <summary>
        /// 音频内嵌信息  （专辑封面，歌词）
        /// </summary>
        private Song_Set_Info song_Set_Infos;
        public Song_Set_Info Song_Set_Infos
        {
            get { return song_Set_Infos; }
            set { song_Set_Infos = value; RaisePropertyChanged(); }
        }
        


        /// <summary>
        /// 显示加载动画
        /// </summary>
        private Visibility show_API_HttpClient_Complete;
        public Visibility Show_API_HttpClient_Complete
        {
            get { return show_API_HttpClient_Complete; }
            set { show_API_HttpClient_Complete = value; RaisePropertyChanged(); }
        }
        /// <summary>
        /// 显示下载面板
        /// </summary>
        private Visibility show_API_HttpClient_ALL_BrLevel_Infos_Complete;
        public Visibility Show_API_HttpClient_ALL_BrLevel_Infos_Complete
        {
            get { return show_API_HttpClient_ALL_BrLevel_Infos_Complete; }
            set { show_API_HttpClient_ALL_BrLevel_Infos_Complete = value; RaisePropertyChanged(); }
        }
        #endregion


        /// <summary>
        /// 返回的搜索结果
        /// </summary>
        private ObservableCollection<Show_Search_Song> showSelect_Search_Songs;
        public ObservableCollection<Show_Search_Song> ShowSelect_Search_Songs
        {
            get { return showSelect_Search_Songs; }
            set { showSelect_Search_Songs = value; RaisePropertyChanged(); }
        }

        /// <summary>
        /// API连接
        /// </summary>
        private HttpClient client;
        /// <summary>
        /// API字段
        /// </summary>
        public string Api_client = "";
        /// <summary>
        /// Json反序列化 对象属性 搜索歌曲，没有Privilege字段
        /// </summary>
        private ApiResponse_Search_Song apiResponse_Search_Songs;
        public ApiResponse_Search_Song ApiResponse_Search_Songs
        {
            get { return apiResponse_Search_Songs; }
            set { apiResponse_Search_Songs = value; RaisePropertyChanged(); }
        }
        /// <summary>
        /// Json反序列化 对象属性 搜索歌曲，有Privilege字段
        /// </summary>
        private ApiResponse_Search_Song apiResponse_Get_Privileges;
        public ApiResponse_Search_Song ApiResponse_Get_Privileges
        {
            get { return apiResponse_Get_Privileges; }
            set { apiResponse_Get_Privileges = value; RaisePropertyChanged(); }
        }
        /// <summary>
        /// 获取歌曲url
        /// </summary>
        private ApiResponse_Get_Url apiResponse_Get_Urls;
        public ApiResponse_Get_Url ApiResponse_Get_Urls
        {
            get { return apiResponse_Get_Urls; }
            set { apiResponse_Get_Urls = value; RaisePropertyChanged(); }
        }


        /// <summary>
        /// 触发事件 搜索200条数据
        /// </summary>
        public RelayCommand RefCommand_Search_Song { get; set; }
        /// <summary>
        /// 触发事件 获取单歌曲url地址    播放
        /// </summary>
        public RelayCommand RefCommand_Get_Song_Info_Url { get; set; }
        /// <summary>
        /// 触发事件 获取单歌曲详情(补全) 下载
        /// </summary>
        public RelayCommand RefCommand_Get_Song_Info { get; set; }

        /// <summary>
        /// 触发事件 搜索该歌手50条热歌 / 所有专辑(下的所有歌曲)
        /// </summary>
        public RelayCommand RefCommand_Search_Singer { get; set; }
        /// <summary>
        /// 触发事件 显示分页数据
        /// </summary>
        public RelayCommand RefCommand_ShowPage { get; set; }

    }
}
