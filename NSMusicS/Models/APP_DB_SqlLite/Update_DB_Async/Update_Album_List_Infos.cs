using Microsoft.EntityFrameworkCore;
using NSMusicS.Models.APP_DB_SqlLite.Category;
using NSMusicS.Models.APP_DB_SqlLite.Product;
using NSMusicS.Models.APP_DB_SqlLite.ProductContext;
using NSMusicS.Models.APP_DB_SqlLite.SS_Convert;
using NSMusicS.Models.Song_Extract_Infos;
using NSMusicS.Models.Song_List_Infos;
using NSMusicS.Models.Song_List_Of_AlbumList_Infos;
using NSMusicS.Services.Services_For_API_GetResult;
using SharpVectors.Dom.Svg;
using SkiaSharp;
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
    public class Update_Album_List_Infos
    {
        private ObservableCollection<ObservableCollection<SongList_Info>> songList_Infos { get; set; }
        //当前专辑模式——专辑列表
        private ObservableCollection<Album_Performer_Infos> Album_Model_2_List_s = new ObservableCollection<Album_Performer_Infos>();
        //当前专辑模式——专辑列表
        private ObservableCollection<ObservableCollection<Album_Performer_List_Infos_For_Model_2>> Album_Model_2_DB_List_s = new ObservableCollection<ObservableCollection<Album_Performer_List_Infos_For_Model_2>>();


        public static Update_Album_List_Infos This__ { get; set; }
        public static Update_Album_List_Infos Retuen_This()
        {
            This__ = Return_This_();
            return This__;
        }
        private static Update_Album_List_Infos Return_This_()
        {
            if (This__ == null)
                This__ = new Update_Album_List_Infos();

            return This__;
        }

        string Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";
        SongList_Info_Sort songList_Info_Sort = new SongList_Info_Sort();
        ViewModule_Search_Song_For_Cloud_Music viewModule_Search_Song_For_Cloud_Music = ViewModule_Search_Song_For_Cloud_Music.Retuen_This();

        /// <summary>
        /// 加载专辑模式数据（数据库加载）
        /// </summary>
        public async Task<ObservableCollection<Album_Performer_Infos>> Load_AlbumInfo_For_PerformerShow_DB(
            ObservableCollection<Song_Info> SongList, int Album_Model_2_Of_List_Select_Index)
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
                foreach (var singer in uniqueSingerNames)
                {
                    /// 获取每位歌手的信息
                    var this_singer_infos = song_Infos.Where(s => s.Singer_Name == singer).ToList();
                    /// 获取每位歌手的专辑名
                    var this_album_names = this_singer_infos.Select(s => s.Album_Name).Distinct();
                    foreach (var albumName in this_album_names)
                    {
                        viewModule_Search_Song_For_Cloud_Music.Show_API_HttpClient_Complete = Visibility.Visible;

                        var album = new Album_Performer_Infos();

                        /// 找出相同歌手+专辑名的第一首歌曲的路径
                        var uniqueSongUrls = this_singer_infos
                            .Where(song => song.Album_Name.Equals(albumName))
                            .Select(song => song.Song_Url)
                            .Distinct();
                        if (uniqueSongUrls.Any())
                        {
                            string songUrl = uniqueSongUrls.FirstOrDefault();
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
                                    album.Album_Performer_Name = singer;
                                    //专辑名
                                    album.Album_Name = albumName;
                                    //歌曲数量
                                    int uniqueSongCount = this_singer_infos.Count(s => s.Album_Name.Equals(albumName));
                                    album.Album_Performer_Of_AlbumNums = uniqueSongCount + " 首歌曲";

                                    Application.Current.Dispatcher.Invoke(() =>
                                    {
                                        Album_Model_2_DB_List_s[Album_Model_2_Of_List_Select_Index][0].Albums.Add(album);
                                    });
                                }
                            }
                        }
                    }
                }

                //Clear
                song_Infos1 = null;

                #endregion

                tcs.SetResult(Album_Model_2_DB_List_s[Album_Model_2_Of_List_Select_Index][0].Albums);
            });

            return await tcs.Task;
        }

        /// <summary>
        /// 读取所有歌单信息（同步）（数据库 -> 内存库）
        /// </summary>
        /// <returns></returns>
        public async Task LoadAlbumListsAsync()
        {
            LoadAlbumList_ALL(0, @"我的收藏");
            LoadAlbumList_ALL(1, @"本地音乐");
            LoadAlbumList_ALL(2, @"默认列表");
            LoadAlbumList_ALL(3, @"歌单3");
            LoadAlbumList_ALL(4, @"歌单4");
            LoadAlbumList_ALL(5, @"歌单5");
            LoadAlbumList_ALL(6, @"歌单6");
            LoadAlbumList_ALL(7, @"歌单7");
            LoadAlbumList_ALL(8, @"歌单8");
            LoadAlbumList_ALL(9, @"歌单9");
            LoadAlbumList_ALL(10, @"歌单10");
            LoadAlbumList_ALL(11, @"歌单11");
            LoadAlbumList_ALL(12, @"歌单12");
            LoadAlbumList_ALL(13, @"歌单13");
            LoadAlbumList_ALL(14, @"歌单14");
            LoadAlbumList_ALL(15, @"歌单15");
            LoadAlbumList_ALL(16, @"歌单16");
        }
        private async void LoadAlbumList_ALL(int num, string path)
        {
            Album_Model_2_DB_List_s = Album_Performer_List_Infos_For_Model_2.Retuen_This_DB_Lists();

            Convert_Album_List_Infos convert_Album_Info = new Convert_Album_List_Infos();
            using (convert_Album_Info.dbContext = new ProductContext_Album_Info("ProductContext_Album_Infos"))
            {
                convert_Album_Info.dbContext.Database.EnsureCreated();
                convert_Album_Info.dbContext.Category_AlbumList_Infos.Load();
                convert_Album_Info.dbContext.Product_Album_Infos.Load();

                var albumList = await convert_Album_Info.Read_Albums_From_DatabaseAsync_Dapper(num, path);
                /// 先按Song_No排序，因为默认主键不是Song_No，而UI需要Song_No排序的效果
                foreach (var album in albumList)
                {
                    album.Albums = new ObservableCollection<Album_Performer_Infos>(
                        album.Albums.OrderBy(album => album.Album_No));
                }
                lock (Album_Model_2_DB_List_s)
                {
                    Album_Model_2_DB_List_s.Add(albumList);
                }
            }
        }

        /// <summary>
        /// 保存所有歌单信息（异步）（内存库 -> 数据库）
        /// </summary>
        public async Task Save_AlbumListInfoAsync()
        {
            songList_Infos = SongList_Info.Retuen_This();
            Album_Model_2_DB_List_s = Album_Performer_List_Infos_For_Model_2.Retuen_This_DB_Lists();

            /// 避免DbContext的线程问题：不同线程同时使用DbContext的同一实例
            Convert_Album_List_Infos convert_Album_Info = new Convert_Album_List_Infos();

            using (convert_Album_Info.dbContext = new ProductContext.ProductContext_Album_Info("ProductContext_Album_Infos"))
            {
                convert_Album_Info.dbContext.Database.EnsureCreated();
                convert_Album_Info.dbContext.Category_AlbumList_Infos.Load();
                convert_Album_Info.dbContext.Product_Album_Infos.Load();

                convert_Album_Info.dbContext.Category_AlbumList_Infos.RemoveRange(convert_Album_Info.dbContext.Category_AlbumList_Infos);
                convert_Album_Info.dbContext.Product_Album_Infos.RemoveRange(convert_Album_Info.dbContext.Product_Album_Infos);
                convert_Album_Info.dbContext.SaveChanges();

                await convert_Album_Info.Save_AlbumList_To_DatabaseAsync_Dapper(
                    convert_Album_Info.Create_Product_Album_Infos(Album_Model_2_DB_List_s[0][0].Albums, "我的收藏"),
                    0, "我的收藏");

                await convert_Album_Info.Save_AlbumList_To_DatabaseAsync_Dapper(
                    convert_Album_Info.Create_Product_Album_Infos(Album_Model_2_DB_List_s[1][0].Albums, "本地音乐"),
                    1, "本地音乐");

                await convert_Album_Info.Save_AlbumList_To_DatabaseAsync_Dapper(
                    convert_Album_Info.Create_Product_Album_Infos(Album_Model_2_DB_List_s[2][0].Albums, "默认列表"),
                    2, "默认列表");

                for (int i = 3; i < 17; i++)
                {
                    await convert_Album_Info.Save_AlbumList_To_DatabaseAsync_Dapper(
                        convert_Album_Info.Create_Product_Album_Infos(Album_Model_2_DB_List_s[i][0].Albums, "歌单" + i),
                        3, "歌单" + i);
                }
            }
        }
    }
}
