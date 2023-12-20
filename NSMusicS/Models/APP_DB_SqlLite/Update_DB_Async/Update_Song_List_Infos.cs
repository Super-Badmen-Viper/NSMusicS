using Microsoft.EntityFrameworkCore;
using NSMusicS.Models.APP_DB_SqlLite.Category;
using NSMusicS.Models.APP_DB_SqlLite.Product;
using NSMusicS.Models.APP_DB_SqlLite.SS_Convert;
using NSMusicS.Models.Song_List_Infos;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace NSMusicS.Models.APP_DB_SqlLite.Update_DB_Async
{
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


        /// <summary>
        /// 读取所有歌单信息（同步）
        /// </summary>
        /// <returns></returns>
        public async Task LoadSongListsAsync()
        {
            // 异步加载其他资源
            var tasks = new List<Task>();
            /*tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_Love.xml")));
            tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_ALL.xml")));
            tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_Auto.xml")));
            tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (3).xml")));
            tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (4).xml")));
            tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (5).xml")));
            tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (6).xml")));
            tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (7).xml")));
            tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (8).xml")));
            tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (9).xml")));
            tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (10).xml")));
            tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (11).xml")));
            tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (12).xml")));
            tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (13).xml")));
            tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (14).xml")));
            tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (15).xml")));
            tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (16).xml")));
            tasks.Add(Task.Run(async () => LoadSongList(@"\SongListInfo_ini\SongList_Ini\Song_List_Info_Current_Playlist.xml")));*/
            LoadSongList(0, @"我的收藏");
            LoadSongList(1, @"本地音乐");
            LoadSongList(2, @"默认列表");
            LoadSongList(3, @"歌单3");
            LoadSongList(4, @"歌单4");
            LoadSongList(5, @"歌单5");
            LoadSongList(6, @"歌单6");
            LoadSongList(7, @"歌单7");
            LoadSongList(8, @"歌单8");
            LoadSongList(9, @"歌单9");
            LoadSongList(10, @"歌单10");
            LoadSongList(11, @"歌单11");
            LoadSongList(12, @"歌单12");
            LoadSongList(13, @"歌单13");
            LoadSongList(14, @"歌单14");
            LoadSongList(15, @"歌单15");
            LoadSongList(16, @"歌单16");
            LoadSongList(17, @"播放列表");
            // 其他加载任务...

            // 等待所有任务完成
            await Task.WhenAll(tasks);
        }
        private async void LoadSongList(int num, string path)
        {
            Convert_Song_List_Infos convert_Song_Info = new Convert_Song_List_Infos();

            songList_Infos = SongList_Info.Retuen_This();
            songList_Infos_Current_Playlist = SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;

            // var songList = SongList_Info_Reader.ReadSongList_Infos(Path_App + path);
            // var songList = SongList_Info_Reader.ReadSongList_Infos_To_Json(Path_App + path);
            var songList = await convert_Song_Info.Read_Songs_From_DatabaseAsync(num, path);
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

            convert_Song_Info.dbContext.Dispose();
            convert_Song_Info = null;
        }


        /// <summary>
        /// 保存所有歌单信息（异步）
        /// </summary>
        public async Task Save_SongListInfoAsync()
        {
            songList_Infos = SongList_Info.Retuen_This();
            songList_Infos_Current_Playlist = SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;

            /// 避免DbContext的线程问题：不同线程同时使用DbContext的同一实例
            Convert_Song_List_Infos convert_Song_Info = new Convert_Song_List_Infos();

            /// 删除所有歌单信息
            var allCategories = await convert_Song_Info.dbContext.Category_SongList_Infos.ToListAsync();
            convert_Song_Info.dbContext.Category_SongList_Infos.RemoveRange(allCategories);
            var allProducts = await convert_Song_Info.dbContext.Product_Song_Infos.ToListAsync();
            convert_Song_Info.dbContext.Product_Song_Infos.RemoveRange(allProducts);
            await convert_Song_Info.dbContext.SaveChangesAsync();

            ///
            ///SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Love.xml", playlists);
            ///SongList_Info_Save.SaveSongList_Infos_To_Json(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Love.xml", playlists);
            await convert_Song_Info.Save_SongList_To_DatabaseAsync(
                convert_Song_Info.Create_Product_Song_Infos(songList_Infos[0][0].Songs, "我的收藏"),
                0, "我的收藏");

            ///
            ///SongList_Info_Save.SaveSongList_Infos_To_Json(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_ALL.xml", playlists);
            await convert_Song_Info.Save_SongList_To_DatabaseAsync(
                convert_Song_Info.Create_Product_Song_Infos(songList_Infos[1][0].Songs, "本地音乐"),
                1, "本地音乐");

            ///
            ///SongList_Info_Save.SaveSongList_Infos_To_Json(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Auto.xml", playlists);
            await convert_Song_Info.Save_SongList_To_DatabaseAsync(
                convert_Song_Info.Create_Product_Song_Infos(songList_Infos[2][0].Songs, "默认列表"),
                2, "默认列表");

            ///
            for (int i = 3; i < 17; i++)
            {
                ///SongList_Info_Save.SaveSongList_Infos_To_Json(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (" + i + ").xml", playlists);
                await convert_Song_Info.Save_SongList_To_DatabaseAsync(
                    convert_Song_Info.Create_Product_Song_Infos(songList_Infos[i][0].Songs, "歌单" + i),
                    3, "歌单" + i);
            }

            convert_Song_Info.dbContext.Dispose();
            convert_Song_Info = null;
        }


        /// <summary>
        /// 增加：单个内存库歌曲保存至数据库
        /// </summary>
        /// <param name="song_Info"></param>
        /// <param name="category_SongList_ID"></param>
        /// <param name="list_name"></param>
        /// <returns></returns>
        public async Task Update_Add_Song_To_DatabaseAsync(Song_Info song_Info, int category_SongList_ID, string list_name)
        {
            Convert_Song_List_Infos convert_Song_Info = new Convert_Song_List_Infos();

            await convert_Song_Info.Add_Song_To_DatabaseAsync(song_Info, category_SongList_ID, list_name);
        }
        /// <summary>
        /// 删除：根据单个内存库的映射，删除数据库的指定歌曲
        /// </summary>
        /// <param name="song_Info"></param>
        /// <param name="category_SongList_ID"></param>
        /// <param name="list_name"></param>
        /// <returns></returns>
        public async Task Update_Delete_Song_To_DatabaseAsync(Song_Info song_Info, int category_SongList_ID, string list_name)
        {
            Convert_Song_List_Infos convert_Song_Info = new Convert_Song_List_Infos();

            await convert_Song_Info.Delete_Song_To_DatabaseAsync(song_Info, category_SongList_ID, list_name);
        }
        /// <summary>
        /// 更改：单个歌曲属性 Song_Info->Product_Song_Info
        /// </summary>
        /// <param name="song_Info"></param>
        /// <param name="category_SongList_ID"></param>
        /// <param name="list_name"></param>
        /// <returns></returns>
        public async Task Update_Update_Song_To_DatabaseAsync(Song_Info song_Info, int category_SongList_ID, string list_name)
        {
            Convert_Song_List_Infos convert_Song_Info = new Convert_Song_List_Infos();

            await convert_Song_Info.Update_Song_To_DatabaseAsync(song_Info, category_SongList_ID, list_name);
        }
        /// <summary>
        /// 查找：根据内存库查找数据库，返回单个数据库歌曲 Song_Info->Product_Song_Info
        /// </summary>
        /// <param name="song_Info"></param>
        /// <param name="category_SongList_ID"></param>
        /// <param name="list_name"></param>
        /// <returns></returns>
        public async Task Update_Find_Song_From_DatabaseAsync(Song_Info song_Info, int category_SongList_ID, string list_name)
        {
            Convert_Song_List_Infos convert_Song_Info = new Convert_Song_List_Infos();

            await convert_Song_Info.Find_Song_From_DatabaseAsync(song_Info, category_SongList_ID, list_name);
        }

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
                _ => "歌单" + (19 - category_SongList_ID)
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
                await Update_Update_Song_To_DatabaseAsync(song_Info, category_SongList_ID, list_name);
            }
            else if (model_num == 4)/// 查
            {
                await Update_Find_Song_From_DatabaseAsync(song_Info, category_SongList_ID, list_name);
            }
        }


    }
}
