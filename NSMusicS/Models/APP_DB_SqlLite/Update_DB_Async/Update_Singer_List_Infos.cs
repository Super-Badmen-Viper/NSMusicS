using NSMusicS.Models.Song_Extract_Infos;
using NSMusicS.Models.Song_List_Infos;
using NSMusicS.Models.Song_List_Of_Album_SongList_Infos;
using NSMusicS.Models.Song_List_Of_AlbumList_Infos;
using NSMusicS.Services.Services_For_API_GetResult;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace NSMusicS.Models.APP_DB_SqlLite.Update_DB_Async
{
    public class Update_Singer_List_Infos
    {
        private ObservableCollection<ObservableCollection<SongList_Info>> songList_Infos { get; set; }
        //当前专辑模式——专辑列表
        private ObservableCollection<Album_Performer_Infos> Album_Model_3_List_s = new ObservableCollection<Album_Performer_Infos>();
        //当前专辑模式——专辑列表
        private ObservableCollection<ObservableCollection<Album_Performer_List_Infos_For_Model_3>> Album_Model_3_DB_List_s = new ObservableCollection<ObservableCollection<Album_Performer_List_Infos_For_Model_3>>();


        public static Update_Singer_List_Infos This__ { get; set; }
        public static Update_Singer_List_Infos Retuen_This()
        {
            This__ = Return_This_();
            return This__;
        }
        private static Update_Singer_List_Infos Return_This_()
        {
            if (This__ == null)
                This__ = new Update_Singer_List_Infos();

            return This__;
        }

        string Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";

        SongList_Info_Sort songList_Info_Sort = new SongList_Info_Sort();
        ViewModule_Search_Song_For_Cloud_Music viewModule_Search_Song_For_Cloud_Music = ViewModule_Search_Song_For_Cloud_Music.Retuen_This();


        
        /// <summary>
        ///  加载歌手_专辑模式数据（数据库）
        /// </summary>
        public async Task<ObservableCollection<Album_Performer_Infos>> Load_SingerInfo_For_PerformerShow_DB(
            ObservableCollection<Song_Info> SongList, int Singer_Model_3_Of_List_Select_Index)
        {
            var tcs = new TaskCompletionSource<ObservableCollection<Album_Performer_Infos>>();

            await Task.Run(async () =>
            {
                #region 加载歌手_专辑模式数据
                // 加载歌手-专辑选择列表：优先度：MoZhi专辑>内嵌专辑>Null
                ObservableCollection<Song_Info> song_Infos1 = new ObservableCollection<Song_Info>(SongList);
                song_Infos1 = await songList_Info_Sort.Start_Sort_Song_Of_Select_List(song_Infos1, 0, false);

                List<Song_Info> song_Infos = new List<Song_Info>(song_Infos1);
                var uniqueSingerNames = song_Infos.Select(s => s.Singer_Name).Distinct();

                foreach (var singerName in uniqueSingerNames)
                {
                    viewModule_Search_Song_For_Cloud_Music.Show_API_HttpClient_Complete = Visibility.Visible;

                    var album = new Album_Performer_Infos();
                    //var singer = new Singer_Info();

                    //获取指定 Singer_Name 和 Album_Name 列中的不重复 Song_Url
                    var uniqueSongUrls = song_Infos// 使用 LINQ 查询获取指定 Singer_Name 和 Album_Name 列中的不重复 Song_Url 属性值
                    .Where(song => song.Singer_Name == singerName)
                    .Select(song => song.Song_Url)
                    .Distinct();

                    //仅获取排在第一张专辑图片
                    var songUrl = uniqueSongUrls.ElementAt(0);
                    if (!File.Exists(songUrl))
                    {
                        songUrl = Path_App + songUrl;
                    }

                    if (File.Exists(songUrl))
                    {
                        using (MemoryStream memoryStream = Song_Extract_Info.Extract_MemoryStream_AlbumImage_Of_This_SongUrl(songUrl))
                        {
                            if (memoryStream != null)
                            {
                                // 获取系统的临时文件夹路径
                                string tempFolderPath = Path_App + @"\Temp";
                                // 创建唯一的文件名，例如使用 GUID
                                string uniqueFileName = $"{Guid.NewGuid()}.jpg";
                                // 组合临时文件路径和唯一文件名
                                string tempFilePath = Path.Combine(tempFolderPath, uniqueFileName);

                                using (FileStream fileStream = new FileStream(tempFilePath, FileMode.Create, FileAccess.Write, FileShare.ReadWrite))
                                {
                                    fileStream.Write(memoryStream.ToArray(), 0, memoryStream.ToArray().Length);
                                }
                                //File.WriteAllBytes(tempFilePath, imageBytes);

                                album.Album_Performer_Image = new Uri(tempFilePath);
                                //singer.Singer_Image_Uri = new Uri(tempFilePath);
                            }
                            else
                            {
                                album.Album_Performer_Image = null;
                            }

                            //演唱者
                            album.Album_Performer_Name = singerName;
                            //singer.Singer_Name = singerName;
                            //各专辑名
                            var Albums = song_Infos.Where(s => s.Singer_Name == singerName)
                                                                .Select(s => s.Album_Name)
                                                                .Distinct();
                            album.List_Album_Names = new List<string>(Albums);
                            //专辑数量
                            int uniqueAlbumCount = song_Infos.Where(s => s.Singer_Name == singerName)
                                                                .Select(s => s.Album_Name)
                                                                .Distinct()
                                                                .Count();
                            album.Album_Performer_Of_AlbumNums = uniqueAlbumCount + " 张专辑";

                            Application.Current.Dispatcher.Invoke(() =>
                            {
                                Album_Model_3_DB_List_s[Singer_Model_3_Of_List_Select_Index][0].Singers.Add(album);
                            });
                        }

                    }
                }

                //加载歌手-所有专辑列表
                //
                //获取所有歌手（数据）
                ALL_Performer_ALL_AlbumSongList aLL_Performer_ALL_AlbumSongList = ALL_Performer_ALL_AlbumSongList.Retuen_This();
                aLL_Performer_ALL_AlbumSongList.ALL_Performers.Clear();

                //Clear
                song_Infos1 = null;

                #endregion

                tcs.SetResult(Album_Model_3_DB_List_s[Singer_Model_3_Of_List_Select_Index][0].Singers);
            });

            return await tcs.Task;
        }
    }
}
