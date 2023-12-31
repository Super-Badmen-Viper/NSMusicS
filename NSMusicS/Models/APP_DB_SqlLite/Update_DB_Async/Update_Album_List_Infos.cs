using Microsoft.EntityFrameworkCore;
using NSMusicS.Models.APP_DB_SqlLite.Category;
using NSMusicS.Models.APP_DB_SqlLite.Product;
using NSMusicS.Models.APP_DB_SqlLite.ProductContext;
using NSMusicS.Models.APP_DB_SqlLite.SS_Convert;
using NSMusicS.Models.Song_List_Infos;
using NSMusicS.Models.Song_List_Of_AlbumList_Infos;
using SharpVectors.Dom.Svg;
using SkiaSharp;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace NSMusicS.Models.APP_DB_SqlLite.Update_DB_Async
{
    public class Update_Album_List_Infos
    {
        private ObservableCollection<ObservableCollection<Album_Performer_List_Infos_For_Model_2>> Album_ALL_s { get; set; }

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
            Album_ALL_s = Album_Performer_List_Infos_For_Model_2.Retuen_This();

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
                lock (Album_ALL_s)
                {
                    Album_ALL_s.Add(albumList);
                }
            }
        }

        /// <summary>
        /// 保存所有歌单信息（异步）（内存库 -> 数据库）
        /// </summary>
        public async Task Save_AlbumListInfoAsync()
        {
            Album_ALL_s = Album_Performer_List_Infos_For_Model_2.Retuen_This();

            /// 避免DbContext的线程问题：不同线程同时使用DbContext的同一实例
            Convert_Album_List_Infos convert_Album_Info = new Convert_Album_List_Infos();

            using (convert_Album_Info.dbContext = new ProductContext.ProductContext_Album_Info("ProductContext_Album_Infos"))
            {
                convert_Album_Info.dbContext.Database.EnsureCreated();
                convert_Album_Info.dbContext.Category_AlbumList_Infos.Load();
                convert_Album_Info.dbContext.Product_Album_Infos.Load();

                convert_Album_Info.dbContext.BulkDelete(convert_Album_Info.dbContext.Category_AlbumList_Infos);
                convert_Album_Info.dbContext.BulkDelete(convert_Album_Info.dbContext.Product_Album_Infos);
                convert_Album_Info.dbContext.SaveChanges();

                await convert_Album_Info.Save_AlbumList_To_DatabaseAsync_Dapper(
                    convert_Album_Info.Create_Product_Album_Infos(Album_ALL_s[0][0].Albums, "我的收藏"),
                    0, "我的收藏");

                await convert_Album_Info.Save_AlbumList_To_DatabaseAsync_Dapper(
                    convert_Album_Info.Create_Product_Album_Infos(Album_ALL_s[1][0].Albums, "本地音乐"),
                    1, "本地音乐");

                await convert_Album_Info.Save_AlbumList_To_DatabaseAsync_Dapper(
                    convert_Album_Info.Create_Product_Album_Infos(Album_ALL_s[2][0].Albums, "默认列表"),
                    2, "默认列表");

                for (int i = 3; i < 17; i++)
                {
                    await convert_Album_Info.Save_AlbumList_To_DatabaseAsync_Dapper(
                        convert_Album_Info.Create_Product_Album_Infos(Album_ALL_s[i][0].Albums, "歌单" + i),
                        3, "歌单" + i);
                }
            }
        }
    }
}
