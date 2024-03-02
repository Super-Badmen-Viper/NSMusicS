using Microsoft.EntityFrameworkCore;
using NSMusicS.Models.APP_DB_SqlLite.Category;
using NSMusicS.Models.APP_DB_SqlLite.Product;
using NSMusicS.Models.APP_DB_SqlLite.ProductContext;
using NSMusicS.Models.APP_DB_SqlLite.SS_Convert;
using NSMusicS.Models.Song_Extract_Infos;
using NSMusicS.Models.Song_List_Infos;
using NSMusicS.Models.Song_List_Of_Album_SongList_Infos;
using NSMusicS.Models.Song_List_Of_AlbumList_Infos;
using NSMusicS.Services.Services_For_API_GetResult;
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
    /// <summary>
    /// Update_Song_List_Infos类功能说明：
    /// 
    /// 这种操作模式可以称为“异步保存”或“延迟保存”
    /// 其中内存中的数据被修改后并不立即保存到数据库
    /// 而是通过后台异步任务来执行保存操作。这样做的优点和缺点如下：
    /// 优点：
    ///     更快的响应速度： 操作内存中的数据通常比直接访问数据库快得多,
    ///         因此能够提供更快的用户响应速度，避免了等待数据库操作完成的时间。
    ///     减少数据库压力： 将批量操作推迟到后台异步执行可以减少对数据库的频繁访问,
    ///         从而减轻数据库的负担，特别是在高负载情况下。
    ///     改善用户体验： 数据的即时处理可以提供更流畅的用户体验,
    ///         因为界面操作不会因为等待数据库响应而出现卡顿现象。
    /// 缺点：
    ///     数据同步问题： 如果在保存之前出现应用程序崩溃或其他意外情况，(已解决)
    ///         可能会导致内存中的数据与数据库不一致，可能需要额外的处理来解决数据同步问题。
    ///     内存压力： 频繁操作大量数据可能会导致内存占用增加，(已解决)
    ///         特别是在长时间运行的应用程序中，可能需要考虑内存管理和性能方面的问题。
    ///     异步保存的复杂性： 在实现异步保存时，需要处理异步任务的管理、异常处理和数据一致性等问题，(已解决)
    ///         这可能增加代码复杂性和维护成本。
    /// 这种方式适用于需要在用户界面上提供即时响应和流畅体验的应用程序，
    /// 但需要权衡好数据的一致性和异步保存所带来的风险。
    /// 在设计时需要考虑好数据同步的机制，以确保内存数据和数据库数据的一致性。
    /// </summary>
    public class Update_Song_List_Infos
    {
        ObservableCollection<ObservableCollection<SongList_Info>> songList_Infos;
        ObservableCollection<Song_Info> songList_Infos_Current_Playlist;

        public static Update_Song_List_Infos update_Song_List_Infos { get; set; }
        public static Update_Song_List_Infos Retuen_This()
        {
            update_Song_List_Infos = Return_This_();
            return update_Song_List_Infos;
        }
        private static Update_Song_List_Infos Return_This_()
        {
            if (update_Song_List_Infos == null)
                update_Song_List_Infos = new Update_Song_List_Infos();

            return update_Song_List_Infos;
        }

        string Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";
       

        /// <summary>
        /// 读取所有歌单信息（同步）（数据库 -> 内存库）
        /// </summary>
        /// <returns></returns>
        public async Task LoadSongListsAsync()
        {
            // 异步加载其他资源
            var tasks = new List<Task>();
            /*tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_Love.xml")));
            tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_ALL.xml")));
            tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_Auto.xml")));
            tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (3).xml")));
            tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (4).xml")));
            tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (5).xml")));
            tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (6).xml")));
            tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (7).xml")));
            tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (8).xml")));
            tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (9).xml")));
            tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (10).xml")));
            tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (11).xml")));
            tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (12).xml")));
            tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (13).xml")));
            tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (14).xml")));
            tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (15).xml")));
            tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (16).xml")));
            tasks.Add(Task.Run(async () => LoadSongList_ALL(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_Current_Playlist.xml")));*/
            LoadSongList_ALL(0, @"我的收藏");
            LoadSongList_ALL(1, @"本地音乐");
            LoadSongList_ALL(2, @"默认列表");
            LoadSongList_ALL(3, @"歌单3");
            LoadSongList_ALL(4, @"歌单4");
            LoadSongList_ALL(5, @"歌单5");
            LoadSongList_ALL(6, @"歌单6");
            LoadSongList_ALL(7, @"歌单7");
            LoadSongList_ALL(8, @"歌单8");
            LoadSongList_ALL(9, @"歌单9");
            LoadSongList_ALL(10, @"歌单10");
            LoadSongList_ALL(11, @"歌单11");
            LoadSongList_ALL(12, @"歌单12");
            LoadSongList_ALL(13, @"歌单13");
            LoadSongList_ALL(14, @"歌单14");
            LoadSongList_ALL(15, @"歌单15");
            LoadSongList_ALL(16, @"歌单16");
            LoadSongList_ALL(17, @"播放列表");
            // 其他加载任务...

            // 等待所有任务完成
            await Task.WhenAll(tasks);
        }
        private async void LoadSongList_ALL(int num, string path)
        {
            songList_Infos = SongList_Info.Retuen_This();
            songList_Infos_Current_Playlist = SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;

            Convert_Song_List_Infos convert_Song_Info = new Convert_Song_List_Infos();    
            using (convert_Song_Info.dbContext = new ProductContext_Song_Info("ProductContext_Song_Infos"))
            {
                convert_Song_Info.dbContext.Database.EnsureCreated();
                convert_Song_Info.dbContext.Category_SongList_Infos.Load();
                convert_Song_Info.dbContext.Product_Song_Infos.Load();

                // var songList = SongList_Info_Reader.ReadSongList_Infos(Path_App + path);
                // var songList = SongList_Info_Reader.ReadSongList_Infos_To_Json(Path_App + path);
                var songList = await convert_Song_Info.Read_Songs_From_DatabaseAsync_Dapper(num, path);
                /// 先按Song_No排序，因为默认主键不是Song_No，而UI需要Song_No排序的效果
                foreach (var song in songList)
                {
                    song.Songs = new ObservableCollection<Song_Info>(
                        song.Songs.OrderBy(song => song.Song_No));
                }
                if (path.Contains("播放列表"))
                {
                    lock (songList_Infos_Current_Playlist)
                    {
                        songList_Infos_Current_Playlist = songList[0].Songs;
                    }
                }
                else
                {
                    lock (songList_Infos)
                    {
                        songList_Infos.Add(songList);
                    }
                }
            }
        }

        /// <summary>
        /// 歌单排序（数据库 -> 数据库）
        /// </summary>
        /// <param name="Sort_Num"></param>
        /// <param name="Sort_Double"></param>
        /// <param name="category_SongList_ID"></param>
        /// <returns></returns>
        public async Task Sort_SongListInfoAsync(int Sort_Num, bool Sort_Double,bool Sort_SingerName_Up, int category_SongList_ID)
        {
            Convert_Song_List_Infos convert_Song_Info = new Convert_Song_List_Infos();

            using (convert_Song_Info.dbContext = new ProductContext.ProductContext_Song_Info("ProductContext_Song_Infos"))
            {
                var songs = new List<Product_Song_Info>();

                List<Product_Song_Info> sortedList = null;

                if (Sort_Num == 0)      // Singer_Name
                {
                    /// 排序，返回序列
                    if (Sort_Double == true)
                    {
                        if (!Sort_SingerName_Up)
                        {
                            sortedList = convert_Song_Info.dbContext.Product_Song_Infos.OrderBy(song => song.Singer_Name).ToList();
                            Sort_SingerName_Up = true;
                        }
                        else
                        {
                            sortedList = convert_Song_Info.dbContext.Product_Song_Infos.OrderByDescending(song => song.Singer_Name).ToList();
                            Sort_SingerName_Up = false;
                        }
                    }
                    else
                    {
                        sortedList = convert_Song_Info.dbContext.Product_Song_Infos.OrderBy(song => song.Singer_Name).ToList();
                    }
                }
                else if (Sort_Num == 1) // Song_Name
                {
                    /// 排序，返回序列
                    if (Sort_Double == true)
                    {
                        if (!Sort_SingerName_Up)
                        {
                            sortedList = convert_Song_Info.dbContext.Product_Song_Infos.OrderBy(song => song.Song_Name).ToList();
                            Sort_SingerName_Up = true;
                        }
                        else
                        {
                            sortedList = convert_Song_Info.dbContext.Product_Song_Infos.OrderByDescending(song => song.Song_Name).ToList();
                            Sort_SingerName_Up = false;
                        }
                    }
                    else
                    {
                        sortedList = convert_Song_Info.dbContext.Product_Song_Infos.OrderBy(song => song.Song_Name).ToList();
                    }
                }
                else if (Sort_Num == 2) // Album_Name
                {
                    /// 排序，返回序列
                    if (Sort_Double == true)
                    {
                        if (!Sort_SingerName_Up)
                        {
                            sortedList = convert_Song_Info.dbContext.Product_Song_Infos.OrderBy(song => song.Album_Name).ToList();
                            Sort_SingerName_Up = true;
                        }
                        else
                        {
                            sortedList = convert_Song_Info.dbContext.Product_Song_Infos.OrderByDescending(song => song.Album_Name).ToList();
                            Sort_SingerName_Up = false;
                        }
                    }
                    else
                    {
                        sortedList = convert_Song_Info.dbContext.Product_Song_Infos.OrderBy(song => song.Album_Name).ToList();
                    }
                }
                else if (Sort_Num == 3)// Song_Duration
                {
                    /// 排序，返回序列
                    if (Sort_Double == true)
                    {
                        if (!Sort_SingerName_Up)
                        {
                            sortedList = convert_Song_Info.dbContext.Product_Song_Infos.OrderBy(song => song.Song_Duration).ToList();
                            Sort_SingerName_Up = true;
                        }
                        else
                        {
                            sortedList = convert_Song_Info.dbContext.Product_Song_Infos.OrderByDescending(song => song.Song_Duration).ToList();
                            Sort_SingerName_Up = false;
                        }
                    }
                    else
                    {
                        sortedList = convert_Song_Info.dbContext.Product_Song_Infos.OrderBy(song => song.Song_Duration).ToList();
                    }
                }

                /// 重置序列序号
                for (int i = 0; i < sortedList.Count; i++)
                {
                    Product_Song_Info song_Info = sortedList[i];
                    songs.Add(song_Info);
                }
                for (int i = 0; i < songs.Count; i++)
                {
                    songs[i].Song_No = i + 1;
                }

                /// 将序号同步至数据库
                foreach (var item in songs)
                {
                    await Update_Update_Song_To_DatabaseAsync_For_Product_Song_Info(item, category_SongList_ID);
                }

                /// 最后按序号排序，并保存
                // 获取排序后的列表
                var sorted_List = await convert_Song_Info.dbContext.Product_Song_Infos.OrderBy(song => song.Song_No).ToListAsync();
                // 清空原有数据表
                var allProducts = await convert_Song_Info.dbContext.Product_Song_Infos.ToListAsync();
                convert_Song_Info.dbContext.Product_Song_Infos.RemoveRange(allProducts);
                await convert_Song_Info.dbContext.SaveChangesAsync();
                // 将排序后的列表直接添加到数据库
                convert_Song_Info.dbContext.Product_Song_Infos.AddRange(sorted_List);
                await convert_Song_Info.dbContext.SaveChangesAsync();
            }
        }

        /// <summary>
        /// 保存所有歌单信息（异步）（内存库 -> 数据库）
        /// </summary>
        public async Task Save_SongListInfoAsync()
        {
            songList_Infos = SongList_Info.Retuen_This();
            songList_Infos_Current_Playlist = SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;

            /// 避免DbContext的线程问题：不同线程同时使用DbContext的同一实例
            Convert_Song_List_Infos convert_Song_Info = new Convert_Song_List_Infos();

            using (convert_Song_Info.dbContext = new ProductContext.ProductContext_Song_Info("ProductContext_Song_Infos"))
            {
                convert_Song_Info.dbContext.Database.EnsureCreated();
                convert_Song_Info.dbContext.Category_SongList_Infos.Load();
                convert_Song_Info.dbContext.Product_Song_Infos.Load();

                convert_Song_Info.dbContext.Category_SongList_Infos.RemoveRange(convert_Song_Info.dbContext.Category_SongList_Infos);
                convert_Song_Info.dbContext.Product_Song_Infos.RemoveRange(convert_Song_Info.dbContext.Product_Song_Infos);
                convert_Song_Info.dbContext.SaveChanges();

                ///
                ///SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Love.xml", playlists);
                SongList_Info_Save.SaveSongList_Infos_To_Json(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Love.xml", songList_Infos[0]);
                await convert_Song_Info.Save_SongList_To_DatabaseAsync_Dapper(
                    convert_Song_Info.Create_Product_Song_Infos(songList_Infos[0][0].Songs, "我的收藏"),
                    0, "我的收藏");

                ///
                SongList_Info_Save.SaveSongList_Infos_To_Json(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_ALL.xml", songList_Infos[1]);
                await convert_Song_Info.Save_SongList_To_DatabaseAsync_Dapper(
                    convert_Song_Info.Create_Product_Song_Infos(songList_Infos[1][0].Songs, "本地音乐"),
                    1, "本地音乐");

                ///
                SongList_Info_Save.SaveSongList_Infos_To_Json(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Auto.xml", songList_Infos[2]);
                await convert_Song_Info.Save_SongList_To_DatabaseAsync_Dapper(
                    convert_Song_Info.Create_Product_Song_Infos(songList_Infos[2][0].Songs, "默认列表"),
                    2, "默认列表");

                ///
                for (int i = 3; i < 17; i++)
                {
                    SongList_Info_Save.SaveSongList_Infos_To_Json(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (" + i + ").xml", songList_Infos[i]);
                    await convert_Song_Info.Save_SongList_To_DatabaseAsync_Dapper(
                        convert_Song_Info.Create_Product_Song_Infos(songList_Infos[i][0].Songs, "歌单" + i),
                        3, "歌单" + i);
                }
            }
        }

        #region CRUD （SqlLite写入性能表现差：不如整体保存至数据库）
        /// <summary>
        /// 增加：单个内存库歌曲保存至数据库
        /// </summary>
        /// <param name="song_Info"></param>
        /// <param name="category_SongList_ID"></param>
        /// <param name="list_name"></param>
        /// <returns></returns>
        private async Task Update_Add_Song_To_DatabaseAsync(Song_Info song_Info, int category_SongList_ID, string list_name)
        {
            /*Convert_Song_List_Infos convert_Song_Info = new Convert_Song_List_Infos();

            await convert_Song_Info.Add_Song_To_DatabaseAsync(song_Info, category_SongList_ID, list_name);*/
        }

        /// <summary>
        /// 删除：根据单个内存库的映射，删除数据库的指定歌曲
        /// </summary>
        /// <param name="song_Info"></param>
        /// <param name="category_SongList_ID"></param>
        /// <param name="list_name"></param>
        /// <returns></returns>
        private async Task Update_Delete_Song_To_DatabaseAsync(Song_Info song_Info, int category_SongList_ID, string list_name)
        {
            /*Convert_Song_List_Infos convert_Song_Info = new Convert_Song_List_Infos();

            await convert_Song_Info.Delete_Song_To_DatabaseAsync(song_Info, category_SongList_ID, list_name);*/
        }

        /// <summary>
        /// 更改：单个歌曲属性 Song_Info->Product_Song_Info（内存库 -> 数据库）
        /// </summary>
        /// <param name="song_Info"></param>
        /// <param name="category_SongList_ID"></param>
        /// <param name="list_name"></param>
        /// <returns></returns>
        private async Task Update_Update_Song_To_DatabaseAsync_For_SongInfo(Song_Info song_Info, int category_SongList_ID, string list_name)
        {
            /*Convert_Song_List_Infos convert_Song_Info = new Convert_Song_List_Infos();

            await convert_Song_Info.Update_Song_To_DatabaseAsync_For_Song_Info(song_Info, category_SongList_ID, list_name);*/
        }
        /// <summary>
        /// 更改：单个歌曲属性 Song_Info->Product_Song_Info（数据库 -> 数据库）
        /// </summary>
        /// <param name="song_Info"></param>
        /// <param name="category_SongList_ID"></param>>
        /// <returns></returns>
        private async Task Update_Update_Song_To_DatabaseAsync_For_Product_Song_Info(Product_Song_Info song_Info, int category_SongList_ID)
        {
            /*string list_name = category_SongList_ID switch
            {
                0 => "我的收藏",
                1 => "本地音乐",
                2 => "默认列表",
                17 => "播放列表",
                _ => "歌单" + category_SongList_ID
            };

            Convert_Song_List_Infos convert_Song_Info = new Convert_Song_List_Infos();

            await convert_Song_Info.Update_Song_To_DatabaseAsync_For_Product_Song_Info(song_Info, category_SongList_ID, list_name);*/
        }

        /// <summary>
        /// 查找：根据内存库查找数据库，返回单个数据库歌曲 Song_Info->Product_Song_Info
        /// </summary>
        /// <param name="song_Info"></param>
        /// <param name="category_SongList_ID"></param>
        /// <param name="list_name"></param>
        /// <returns></returns>
        private async Task Update_Find_Song_From_DatabaseAsync(Song_Info song_Info, int category_SongList_ID, string list_name)
        {
            /*Convert_Song_List_Infos convert_Song_Info = new Convert_Song_List_Infos();

            await convert_Song_Info.Find_Song_From_DatabaseAsync(song_Info, category_SongList_ID, list_name);*/
        }
        #endregion

        /// <summary>
        /// 数据库指令操作
        /// </summary>
        /// <param name="model_num">数据库语句模式选择 1-4=增，删，改，查</param>
        /// <param name="song_Info"></param>
        /// <param name="category_SongList_ID"></param>
        /// <returns></returns>
        public async Task DB_Select_Model(int model_num, Song_Info song_Info, int category_SongList_ID)
        {
            string list_name = category_SongList_ID switch
            {
                0 => "我的收藏",
                1 => "本地音乐",
                2 => "默认列表",
                17 => "播放列表",
                _ => "歌单" + category_SongList_ID
            };

            if (model_num == 1)/// 增
            {
                await Update_Add_Song_To_DatabaseAsync(song_Info, category_SongList_ID, list_name);
            }
            else if (model_num == 2)/// 删
            {
                await Update_Delete_Song_To_DatabaseAsync(song_Info, category_SongList_ID, list_name);
            }
            else if (model_num == 3)/// 改
            {
                await Update_Update_Song_To_DatabaseAsync_For_SongInfo(song_Info, category_SongList_ID, list_name);
            }
            else if (model_num == 4)/// 查
            {
                await Update_Find_Song_From_DatabaseAsync(song_Info, category_SongList_ID, list_name);
            }

        }
    }
}
