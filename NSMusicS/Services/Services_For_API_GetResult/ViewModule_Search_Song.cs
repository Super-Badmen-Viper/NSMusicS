using CommunityToolkit.Mvvm.Input;
using GalaSoft.MvvmLight;
using NSMusicS.Models.Servies_For_API_Info;
using NSMusicS.Models.Song_List_Infos;
using NSMusicS.Models.Song_List_Of_Album_SongList_Infos;
using Newtonsoft.Json;
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
using static NSMusicS.Models.Servies_For_API_Info.API_Song_Info;
using static NSMusicS.Models.Servies_For_API_Info.API_Song_Info_Get_Url;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.Window;
using NSMusicS.Models.APP_DB_SqlLite.SS_Convert;
using NSMusicS.Models.APP_DB_SqlLite.Update_DB_Async;

namespace NSMusicS.Services.Services_For_API_GetResult
{
    /// <summary>
    /// C# 中的异步编程和 WPF 的 UI 线程问题。
    /// </summary>
    public class ViewModule_Search_Song : ViewModelBase
    {
        public static ViewModule_Search_Song viewModule_Search_Song { get; set; }
        public static ViewModule_Search_Song Retuen_This()
        {
            viewModule_Search_Song = Return_This_ViewModule_Search_Song();
            return viewModule_Search_Song;
        }
        private static ViewModule_Search_Song Return_This_ViewModule_Search_Song()
        {
            if (viewModule_Search_Song == null)
                viewModule_Search_Song = new ViewModule_Search_Song();
            return viewModule_Search_Song;
        }

        public string Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";
        public ImageBrush Song_Like_Image { get; set; }
        public ImageBrush Song_MV_Image { get; set; }
        public ImageBrush Song_DownLoad_Image { get; set; }
        public ImageBrush Song_UpLoad_Tone_Quality { get; set; }

        Update_Song_List_Infos update_Song_List_Infos = Update_Song_List_Infos.Retuen_This();

        public ViewModule_Search_Song()
        {
            Button_Play_Pause_Player_Image = new Uri(Path_App + @"\Button_Image_Svg\播放.svg");

            Song_Like_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\爱心 (1).png")));
            Song_MV_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\视频播放 (1).png")));
            Song_DownLoad_Image = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\下载 (1).png")));
            Song_UpLoad_Tone_Quality = new ImageBrush(new BitmapImage(new Uri(Path_App + @"\Button_Image_Ico\agora_超高清音质.png")));

            client = new HttpClient();

            //反序列化json
            ApiResponse_Search_Songs = new ApiResponse_Search_Song();
            ApiResponse_Get_Privileges = new ApiResponse_Search_Song();
            ApiResponse_Get_Urls = new ApiResponse_Get_Url();
            //绑定的数据源属性
            ShowSelect_Search_Songs = new ObservableCollection<Show_Search_Song>();

            

            //搜索关键词，适合搜索
            RefCommand_Search_Song = new RelayCommand(async () =>
            {
                try
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

            });
        }


        /// <summary>
        /// API连接
        /// </summary>
        private HttpClient client;
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
        /// 触发事件 搜索该歌手50条热歌 / 所有专辑(下的所有歌曲)
        /// </summary>
        public RelayCommand RefCommand_Search_Singer { get; set; }
        /// <summary>
        /// 触发事件 显示分页数据
        /// </summary>
        public RelayCommand RefCommand_ShowPage { get; set; }
        /// <summary>
        /// 触发事件 获取单歌曲详情(补全)
        /// </summary>
        public RelayCommand RefCommand_Get_Song_Info { get; set; }
        /// <summary>
        /// 触发事件 获取单歌曲url地址
        /// </summary>
        public RelayCommand RefCommand_Get_Song_Info_Url { get; set; }


        /// <summary>
        /// 显示的搜索结果
        /// </summary>
        private ObservableCollection<Show_Search_Song> showSelect_Search_Songs;
        public ObservableCollection<Show_Search_Song> ShowSelect_Search_Songs
        {
            get { return showSelect_Search_Songs; }
            set { showSelect_Search_Songs = value; RaisePropertyChanged(); }
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
        /// 音乐播放
        /// </summary>
        private Uri mediaElement_Song_Url;
        public Uri MediaElement_Song_Url
        {
            get { return mediaElement_Song_Url; }
            set { mediaElement_Song_Url = value; RaisePropertyChanged(); }
        }
        private string song_Name;
        public string Song_Name
        {
            get { return song_Name; }
            set { song_Name = value; RaisePropertyChanged(); }
        }
        private string singer_Name;
        public string Singer_Name
        {
            get { return singer_Name; }
            set { singer_Name = value; RaisePropertyChanged(); }
        }
        private string album_Name;
        public string Album_Name
        {
            get { return album_Name; }
            set { album_Name = value; RaisePropertyChanged(); }
        }
        private int wMP_Song_Order;
        public int WMP_Song_Order
        {
            get { return wMP_Song_Order; }
            set { wMP_Song_Order = value; RaisePropertyChanged(); }
        }
        private int wMP_Song_Play_Ids;
        public int WMP_Song_Play_Ids
        {
            get { return wMP_Song_Play_Ids; }
            set { wMP_Song_Play_Ids = value; RaisePropertyChanged(); }
        }
        private int wMP_Song_Play_Ids_UP_DOWN;
        public int WMP_Song_Play_Ids_UP_DOWN
        {
            get { return wMP_Song_Play_Ids_UP_DOWN; }
            set { wMP_Song_Play_Ids_UP_DOWN = value; RaisePropertyChanged(); }
        }

        private Uri button_Play_Pause_Player;
        public Uri Button_Play_Pause_Player_Image
        {
            get { return button_Play_Pause_Player; }
            set { button_Play_Pause_Player = value; RaisePropertyChanged(); }
        }
        
        /// <summary>
        /// 专辑模式
        /// </summary>
        private ALL_Performer_ALL_AlbumSongList aLL_Performer_ALL_AlbumSongList;
        public ALL_Performer_ALL_AlbumSongList All_Performer_ALL_AlbumCurrent_Playlist
        {
            get { return aLL_Performer_ALL_AlbumSongList; }
            set { aLL_Performer_ALL_AlbumSongList = value; RaisePropertyChanged(); }
        }

        /* private string album_Name_ALL;
         public string Song_Name_ALL
         {
             get { return album_Name_ALL; }
             set { album_Name_ALL = value; RaisePropertyChanged(); }
         }
         private string song_Name;
         public string Song_Name
         {
             get { return song_Name; }
             set { song_Name = value; RaisePropertyChanged(); }
         }
         private string singer_Name;
         public string Singer_Name
         {
             get { return singer_Name; }
             set { singer_Name = value; RaisePropertyChanged(); }
         }
         private string album_Name;
         public string Album_Name
         {
             get { return album_Name; }
             set { album_Name = value; RaisePropertyChanged(); }
         }
         private string song_No;
         public string Song_No
         {
             get { return song_No; }
             set { song_No = value; RaisePropertyChanged(); }
         }
         private string song_Url;
         public string Song_Url
         {
             get { return song_Url; }
             set { song_Url = value; RaisePropertyChanged(); }
         }


         private BitmapImage album_Image;
         public BitmapImage Album_Image
         {
             get { return album_Image; }
             set { album_Image = value; RaisePropertyChanged(); }
         }*/
    }
}
