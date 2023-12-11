using CommunityToolkit.Mvvm.Input;
using GalaSoft.MvvmLight;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NSMusicS_For_Knowledge_Graph.Models;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace NSMusicS_For_Knowledge_Graph.Services.Services_For_API_GetResult
{
    public class ViewModule_Search_Singer_ALL_Info : ViewModelBase
    {
        /// <summary>
        /// API连接
        /// </summary>
        private HttpClient client;

        public static ViewModule_Search_Singer_ALL_Info viewModule_Search_Song { get; set; }
        public static ViewModule_Search_Singer_ALL_Info Retuen_This()
        {
            viewModule_Search_Song = Return_This_ViewModule_Search_Song();
            return viewModule_Search_Song;
        }
        private static ViewModule_Search_Singer_ALL_Info Return_This_ViewModule_Search_Song()
        {
            if (viewModule_Search_Song == null)
                viewModule_Search_Song = new ViewModule_Search_Singer_ALL_Info();
            return viewModule_Search_Song;
        }

        public ViewModule_Search_Singer_ALL_Info()
        {
            client = new HttpClient();

            musicData_Singer_Infos = new ObservableCollection<MusicData_Singer_Info>();

            /*//搜索关键词，适合搜索
            RefCommand_Search_Song = new RelayCommand(async () =>
            {
                try
                {
                    //异步获取API信息，不卡顿Show_API_HttpClient_Complete内的动画
                    string apiUrl = "https://netease-cloud-music-api-two-rust-66.vercel.app/cloudsearch?keywords="
                                    + Json_Search_Song.SearchText;// + "&limit=100";
                    // Make the API call asynchronously
                    HttpResponseMessage response = await client.GetAsync(apiUrl);
                    response.EnsureSuccessStatusCode();
                    string json = await response.Content.ReadAsStringAsync();
                    // Deserialize the JSON response asynchronously

                    ApiResponse_Search_Songs = await Task.Run(() => JsonConvert.DeserializeObject<ApiResponse_Search_Song>(json));

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
                                Show_Search_Song temp = new Show_Search_Song();
                                temp.Song_No = i + 1;
                                temp.Song_Name = ApiResponse_Search_Songs.result.songs[i].name;
                                temp.Song_id = ApiResponse_Search_Songs.result.songs[i].id.ToString();
                                temp.Singer_Name = singer_name;
                                temp.Singer_id = ApiResponse_Search_Songs.result.songs[i].ar[0].id.ToString();//只保留第一位歌手
                                temp.Album_Name = ApiResponse_Search_Songs.result.songs[i].al.name;
                                temp.Album_id = ApiResponse_Search_Songs.result.songs[i].al.id.ToString();
                                temp.Album_Url = ApiResponse_Search_Songs.result.songs[i].al.picUrl;
                                temp.Song_Duration = ApiResponse_Search_Songs.result.songs[i].dt.ToString();
                                temp.Song_Like_Image = Song_Like_Image;
                                temp.Song_MV_Image = Song_MV_Image;
                                temp.Song_DownLoad_Image = Song_DownLoad_Image;
                                temp.Song_UpLoad_Tone_Quality = Song_UpLoad_Tone_Quality;

                                ShowSelect_Search_Songs.Add(temp);
                            });
                        }
                    });
                    *//*Application.Current.Dispatcher.Invoke(() =>
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
                    });*//*
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
            //获取歌曲详情（获取音质），适合选择下载页面使用
            RefCommand_Get_Song_Info = new RelayCommand(async () =>
            {
                string apiUrl = "https://netease-cloud-music-api-two-rust-66.vercel.app/song/detail?ids="
                                + Json_Search_Song.Song_id;                                     
                HttpResponseMessage response = await client.GetAsync(apiUrl);
                response.EnsureSuccessStatusCode();
                string json = await response.Content.ReadAsStringAsync();

                ApiResponse_Get_Privileges = await Task.Run(() => JsonConvert.DeserializeObject<ApiResponse_Search_Song>(json));


                for (int i = 0; i < ApiResponse_Search_Songs.result.songs.Count; i++)
                {
                    if (ApiResponse_Search_Songs.result.songs[i].id.ToString() == Json_Search_Song.Song_id)
                    {
                        ApiResponse_Search_Songs.result.privileges[i] = ApiResponse_Get_Privileges.result.privileges[0];
                        if(ApiResponse_Get_Privileges.result.privileges[0].maxBrLevel.Equals(
                            Show_Search_Song.Song_MaxBrLevel.standard.ToString()))
                            ShowSelect_Search_Songs[i].MaxBrLevel = Show_Search_Song.Song_MaxBrLevel.standard;
                        else if (ApiResponse_Get_Privileges.result.privileges[0].maxBrLevel.Equals(
                            Show_Search_Song.Song_MaxBrLevel.higher.ToString()))
                            ShowSelect_Search_Songs[i].MaxBrLevel = Show_Search_Song.Song_MaxBrLevel.higher;
                        else if (ApiResponse_Get_Privileges.result.privileges[0].maxBrLevel.Equals(
                            Show_Search_Song.Song_MaxBrLevel.exhigh.ToString()))
                            ShowSelect_Search_Songs[i].MaxBrLevel = Show_Search_Song.Song_MaxBrLevel.exhigh;
                        else if (ApiResponse_Get_Privileges.result.privileges[0].maxBrLevel.Equals(
                            Show_Search_Song.Song_MaxBrLevel.lossless.ToString()))
                            ShowSelect_Search_Songs[i].MaxBrLevel = Show_Search_Song.Song_MaxBrLevel.lossless;
                        else if (ApiResponse_Get_Privileges.result.privileges[0].maxBrLevel.Equals(
                            Show_Search_Song.Song_MaxBrLevel.hires.ToString()))
                            ShowSelect_Search_Songs[i].MaxBrLevel = Show_Search_Song.Song_MaxBrLevel.hires;
                        else if (ApiResponse_Get_Privileges.result.privileges[0].maxBrLevel.Equals(
                            Show_Search_Song.Song_MaxBrLevel.jyeffect.ToString()))
                            ShowSelect_Search_Songs[i].MaxBrLevel = Show_Search_Song.Song_MaxBrLevel.jyeffect;
                        else if (ApiResponse_Get_Privileges.result.privileges[0].maxBrLevel.Equals(
                            Show_Search_Song.Song_MaxBrLevel.sky.ToString()))
                            ShowSelect_Search_Songs[i].MaxBrLevel = Show_Search_Song.Song_MaxBrLevel.sky;
                        else if (ApiResponse_Get_Privileges.result.privileges[0].maxBrLevel.Equals(
                            Show_Search_Song.Song_MaxBrLevel.jymaster.ToString()))
                            ShowSelect_Search_Songs[i].MaxBrLevel = Show_Search_Song.Song_MaxBrLevel.jymaster;
                    }
                }
            });
            //获取歌曲的Url地址，适合在线播放
            RefCommand_Get_Song_Info_Url = new RelayCommand(async () =>
            {
                //更改绑定在控价的数据源，仅在 RefCommand = new RelayCommand(async () =>内有效
                Application.Current.Dispatcher.Invoke(() =>
                {
                    Show_API_HttpClient_Complete = Visibility.Visible;//显示动画
                });
                // 异步等待,UI刷新Show_API_HttpClient_Complete
                await Task.Delay(50);


                string apiUrl = "https://netease-cloud-music-api-two-rust-66.vercel.app/song/url/v1?id="
                                + Json_Search_Song.Song_id + "&level=standard";
                HttpResponseMessage response = await client.GetAsync(apiUrl);
                response.EnsureSuccessStatusCode();
                string json = await response.Content.ReadAsStringAsync();

                ApiResponse_Get_Urls = await Task.Run(() => JsonConvert.DeserializeObject<ApiResponse_Get_Url>(json));


                //获取url
                string temp_string = Json_Search_Song.Song_Web_Url;
                temp_string = ApiResponse_Get_Urls.data[0].url;
                Json_Search_Song.Song_Web_Url = temp_string;
                //下载url
                *//*var url = Json_Search_Song.Song_Web_Url;
                var save = Json_Search_Song.Song_File;
                if (!File.Exists(save))
                {
                    using (var web = new WebClient())
                    {
                        web.DownloadFile(url, save);
                    }
                }*//*
                //添加url到songList_Infos_Current_Playlist
                ObservableCollection<Song_Info> songList_Infos_Current_Playlist =
                SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;
                Song_Info temp = new Song_Info();
                temp.Song_Name = Json_Search_Song.Song_Name;
                temp.Singer_Name = Json_Search_Song.Singer_Name;
                temp.Album_Name = Json_Search_Song.Album_Name;
                temp.Song_Url = Json_Search_Song.Song_File;
                temp.Song_No = 0;
                songList_Infos_Current_Playlist = new ObservableCollection<Song_Info>();
                songList_Infos_Current_Playlist.Add(temp);
                SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist =
                    songList_Infos_Current_Playlist;
                *//*//同步信息到UI
                Song_Name = Json_Search_Song.Song_Name;
                Singer_Name = Json_Search_Song.Singer_Name;
                Album_Name = Json_Search_Song.Album_Name;
                Song_Name_ALL = Singer_Name + " - " + Song_Name;*//*
                //获取专辑图片
                string temp_image_url = "";
                for (int i = 0; i < ShowSelect_Search_Songs.Count; i++)
                {
                    if (ShowSelect_Search_Songs[i].Song_id.Equals(Json_Search_Song.Song_id))
                        temp_image_url = ShowSelect_Search_Songs[i].Album_Url;
                }
                //Album_Image = new BitmapImage(new Uri(temp_image_url));

                if (Json_Search_Song.Song_Web_Url != null)
                    MediaElement_Song_Url = new Uri(Json_Search_Song.Song_Web_Url);


                // 在 UI 线程上更新 Show_API_HttpClient_Complete 属性
                Application.Current.Dispatcher.Invoke(() =>
                {
                    Show_API_HttpClient_Complete = Visibility.Collapsed;
                });
                // 异步等待,UI刷新Show_API_HttpClient_Complete
                await Task.Delay(50);
            });
            RefCommand_Search_Singer = new RelayCommand(async () =>
            {

            });*/

            /// 先获取所有热门歌手  --  基础信息+歌手详情
            RefCommand_Search_1_Singer_Info = new RelayCommand(async () =>
            {
                string apiUrl = "http://124.223.62.181:3000/top/artists?offset=0&limit=100";
                HttpResponseMessage response = client.GetAsync(apiUrl).Result;
                if (response.IsSuccessStatusCode)
                {
                    response.EnsureSuccessStatusCode();
                    string json = response.Content.ReadAsStringAsync().Result;
                    JObject jsonObject = JObject.Parse(json);
                    // 获取 "records" 字段下的数组内容
                    JArray recordsArray = (JArray)jsonObject["artists"];
                    if (recordsArray != null && recordsArray.Count > 0)
                    {
                        // 遍历数组内容
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
                                ar_mvSize = (int)record["mvSize"]
                            };

                            musicData_Singer_Infos.Add(ms);
                        }
                    }
                }
            });
            RefCommand_Search_2_Singer_HotSongs = new RelayCommand(async () =>
            {

            });
            RefCommand_Search_3_Singer_ALL_Album = new RelayCommand(async () =>
            {

            });
            RefCommand_Search_4_Singer_ALL_MV = new RelayCommand(async () =>
            {

            });
        }

        /// <summary>
        /// 触发事件 搜索200条数据
        /// </summary>
        public RelayCommand RefCommand_Search_Song { get; set; }
        /// <summary>
        /// 触发事件 搜索该歌手50条热歌 / 所有专辑(下的所有歌曲)
        /// </summary>
        public RelayCommand RefCommand_Search_Singer { get; set; }
        /// <summary>
        /// 触发事件 获取单歌曲详情(补全)
        /// </summary>
        public RelayCommand RefCommand_Get_Song_Info { get; set; }
        /// <summary>
        /// 触发事件 获取单歌曲url地址
        /// </summary>
        public RelayCommand RefCommand_Get_Song_Info_Url { get; set; }

        /// <summary>
        /// 所有歌手信息
        /// </summary>
        private ObservableCollection<MusicData_Singer_Info> _musicData_Singer_Infos;
        public ObservableCollection<MusicData_Singer_Info> musicData_Singer_Infos
        {
            get { return _musicData_Singer_Infos; }
            set { _musicData_Singer_Infos = value; RaisePropertyChanged(); }
        }
        public RelayCommand RefCommand_Search_1_Singer_Info { get; set; }
        public RelayCommand RefCommand_Search_2_Singer_HotSongs { get; set; }
        public RelayCommand RefCommand_Search_3_Singer_ALL_Album { get; set; }
        public RelayCommand RefCommand_Search_4_Singer_ALL_MV { get; set; }
    }
}
