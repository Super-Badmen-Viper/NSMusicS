using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.Windows;
using System.Windows.Data;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Data;
using SQLitePCL;
using static NSMusicS.Models.Song_List_Infos.SongList_Info_Save;
using static NSMusicS.Models.Servies_For_API_Info.API_Song_Info;
using SkiaSharp;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.StartPanel;
using NSMusicS;
using NSMusicS.Models;
using NSMusicS.Models.APP_DB_SqlLite.SS_Convert;
using NSMusicS.Models.APP_DB_SqlLite.Product;
using NSMusicS.Models.APP_DB_SqlLite.ProductContext;
using NSMusicS.Models.APP_DB_SqlLite.Category;
using NSMusicS.Models.Song_List_Infos;
using Song_Info = NSMusicS.Models.Song_List_Infos.Song_Info;

namespace NSMusicS.Models.APP_DB_SqlLite.SS_Convert
{
    internal class Convert_Song_List_Infos
    {
        public ProductContext_Song_Info dbContext;
        ///public List<ProductContext_Song_Info> productContext_Song_Infos = new List<ProductContext_Song_Info>();

        ObservableCollection<ObservableCollection<SongList_Info>> songList_Infos;
        ObservableCollection<Song_Info> songList_Infos_Current_Playlist;

        public CollectionViewSource categoryViewSource;
        public CollectionViewSource productViewSource;

        private static Uri ImageBrush_LoveEnter
            = new Uri(@"Resource\\Button_Image_Svg\\已收藏.svg", UriKind.Relative);
        private static Uri ImageBrush_LoveNormal
            = new Uri(@"Resource\\Button_Image_Svg\\收藏.svg", UriKind.Relative);

        public static ObservableCollection<Song_Info> song_Infos_Love { get; set; }

        public Convert_Song_List_Infos()
        {
            ///string path = @"Resource\SongListInfo_ini\";
            ///dbContext = new ProductContext_Song_Info(path + "ProductContext_Song_Infos");
            dbContext = new ProductContext_Song_Info("ProductContext_Song_Infos");
            dbContext.Database.EnsureCreated();
            dbContext.Category_SongList_Infos.Load();
            dbContext.Product_Song_Infos.Load();

            /*ProductContext_Song_Info temp_0 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_Love");
            temp_0.Database.EnsureCreated();
            temp_0.Category_SongList_Infos.Load();
            temp_0.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_0);

            ProductContext_Song_Info temp_1 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_ALL");
            temp_1.Database.EnsureCreated();
            temp_1.Category_SongList_Infos.Load();
            temp_1.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_1);

            ProductContext_Song_Info temp_2 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_Auto");
            temp_2.Database.EnsureCreated();
            temp_2.Category_SongList_Infos.Load();
            temp_2.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_2);

            ProductContext_Song_Info temp_3 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_6");
            temp_3.Database.EnsureCreated();
            temp_3.Category_SongList_Infos.Load();
            temp_3.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_3);

            ProductContext_Song_Info temp_4 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_4");
            temp_4.Database.EnsureCreated();
            temp_4.Category_SongList_Infos.Load();
            temp_4.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_4);

            ProductContext_Song_Info temp_5 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_5");
            temp_5.Database.EnsureCreated();
            temp_5.Category_SongList_Infos.Load();
            temp_5.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_5);

            ProductContext_Song_Info temp_6 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_6");
            temp_6.Database.EnsureCreated();
            temp_6.Category_SongList_Infos.Load();
            temp_6.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_6);

            ProductContext_Song_Info temp_7 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_7");
            temp_7.Database.EnsureCreated();
            temp_7.Category_SongList_Infos.Load();
            temp_7.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_7);

            ProductContext_Song_Info temp_8 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_8");
            temp_8.Database.EnsureCreated();
            temp_8.Category_SongList_Infos.Load();
            temp_8.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_8);

            ProductContext_Song_Info temp_9 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_9");
            temp_9.Database.EnsureCreated();
            temp_9.Category_SongList_Infos.Load();
            temp_9.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_9);

            ProductContext_Song_Info temp_10 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_10");
            temp_10.Database.EnsureCreated();
            temp_10.Category_SongList_Infos.Load();
            temp_10.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_10);

            ProductContext_Song_Info temp_11 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_11");
            temp_11.Database.EnsureCreated();
            temp_11.Category_SongList_Infos.Load();
            temp_11.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_11);

            ProductContext_Song_Info temp_12 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_12");
            temp_12.Database.EnsureCreated();
            temp_12.Category_SongList_Infos.Load();
            temp_12.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_12);

            ProductContext_Song_Info temp_13 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_13");
            temp_13.Database.EnsureCreated();
            temp_13.Category_SongList_Infos.Load();
            temp_13.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_13);

            ProductContext_Song_Info temp_14 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_14");
            temp_14.Database.EnsureCreated();
            temp_14.Category_SongList_Infos.Load();
            temp_14.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_14);

            ProductContext_Song_Info temp_15 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_15");
            temp_15.Database.EnsureCreated();
            temp_15.Category_SongList_Infos.Load();
            temp_15.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_15);

            ProductContext_Song_Info temp_16 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_16");
            temp_16.Database.EnsureCreated();
            temp_16.Category_SongList_Infos.Load();
            temp_16.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_16);

            ProductContext_Song_Info temp_17 = new ProductContext_Song_Info(path + "ProductContext_Song_Info_Current");
            temp_17.Database.EnsureCreated();
            temp_17.Category_SongList_Infos.Load();
            temp_17.Product_Song_Infos.Load();
            productContext_Song_Infos.Add(temp_17);*/
        }

        /// <summary>
        /// 数组转换  ObservableCollection<Song_Info>  ->  ObservableCollection<Product_Song_Info>
        /// </summary>
        /// <param name="temp"></param>
        /// <returns></returns>
        public ObservableCollection<Product_Song_Info> Create_Product_Song_Infos(ObservableCollection<Song_Info> temp, string list_name)
        {
            if (temp != null)
            {
                ObservableCollection<Product_Song_Info> songs = new ObservableCollection<Product_Song_Info>();
                foreach (var item in temp)
                {
                    Product_Song_Info _Song_Info = new Product_Song_Info();
                    _Song_Info.Song_No = item.Song_No;
                    _Song_Info.Song_Name = item.Song_Name;
                    _Song_Info.Singer_Name = item.Singer_Name;
                    _Song_Info.Song_Url = item.Song_Url;
                    ///_Song_Info.Song_Duration = item.Song_Duration;
                    _Song_Info.Song_Like = item.Song_Like;
                    _Song_Info.Album_Name = item.Album_Name;
                    ///_Song_Info.MV_Path = item.MV_Path;

                    _Song_Info.SongList_Name_AND_Song_Url = list_name + ":" + item.Song_Url;

                    songs.Add(_Song_Info);
                }
                return songs;
            }
            return null;
        }

        /// <summary>
        /// 读取单个歌曲 Product_Song_Info->Song_Info
        /// </summary>
        /// <param name="category_SongList_ID"></param>
        /// <param name="category_SongList_Name"></param>
        /// <param name="song_url"></param>
        /// <returns></returns>
        public async Task<Song_Info> Read_Song_From_DatabaseAsync(Product_Song_Info product_Song, int category_SongList_ID, string category_SongList_Name)
        {
            var songlists = await dbContext.Category_SongList_Infos
                .Where(list => list.Category_SongList_Name == category_SongList_Name)
                .ToListAsync();
            if (songlists.Any())
            {
                foreach (var list in songlists)
                {
                    foreach (var item in list.Product_Song_Infos)
                    {
                        var song = await dbContext.Product_Song_Infos
                            .Where(s => s.Song_Url.Equals(product_Song.Song_Url))
                            .ToListAsync();

                        if (song.Any())
                        {
                            Song_Info _Song_Info = new Song_Info();
                            _Song_Info.Song_No = item.Song_No;
                            _Song_Info.Song_Name = item.Song_Name;
                            _Song_Info.Singer_Name = item.Singer_Name;
                            _Song_Info.Song_Url = item.Song_Url;
                            ///_Song_Info.Song_Duration = item.Song_Duration;
                            _Song_Info.Song_Like = item.Song_Like;
                            _Song_Info.Album_Name = item.Album_Name;
                            ///_Song_Info.MV_Path = item.MV_Path;

                            _Song_Info.Visibility_Playing = Visibility.Collapsed;

                            if (_Song_Info.Song_Like == 1)
                                _Song_Info.Song_Like_Image = ImageBrush_LoveEnter;
                            else
                                _Song_Info.Song_Like_Image = ImageBrush_LoveNormal;

                            if (song_Infos_Love != null && song_Infos_Love.Any(s => s.Song_Url.Equals(_Song_Info.Song_Url)))
                            {
                                _Song_Info.Song_Like = 1;
                                _Song_Info.Song_Like_Image = ImageBrush_LoveEnter;
                            }

                            _Song_Info.Song_MV_Image = null;

                            return _Song_Info;
                        }
                    }
                }
            }

            return null;
        }
        /// <summary>
        /// 保存单个歌曲 Song_Info->Product_Song_Info
        /// </summary>
        /// <param name="song"></param>
        /// <param name="category_SongList_ID"></param>
        /// <param name="list_name"></param>
        /// <returns></returns>
        public async Task Save_Song_To_DatabaseAsync(Song_Info song, int category_SongList_ID, string list_name)
        {
            if (song != null)
            {
                Category_SongList_Info category_SongList_Info = new Category_SongList_Info();
                category_SongList_Info.Category_SongList_Name = list_name;

                var result_songlist = await dbContext.Category_SongList_Infos
                                            .Where(temp => temp.Category_SongList_Name.Equals(category_SongList_Info.Category_SongList_Name))
                                            .ToListAsync();

                if (!result_songlist.Any())
                {
                    var lastCategory = await dbContext.Category_SongList_Infos
                                                  .OrderByDescending(c => c.Category_SongList_ID)
                                                  .FirstOrDefaultAsync();

                    if (lastCategory != null)
                        category_SongList_Info.Category_SongList_ID = lastCategory.Category_SongList_ID + 1;

                    dbContext.Category_SongList_Infos.Add(category_SongList_Info);
                    await dbContext.SaveChangesAsync();
                }
                else
                {
                    category_SongList_Info = result_songlist.FirstOrDefault();
                }

                if (dbContext.Category_SongList_Infos.Any())
                {
                    if (song != null)
                    {
                        var existingSong = await dbContext.Product_Song_Infos
                                                    .Where(temp => temp.Song_Url.Equals(song.Song_Url))
                                                    .FirstOrDefaultAsync();
                        if (existingSong == null)
                        {
                            Product_Song_Info product_Song = new Product_Song_Info();

                            product_Song.Category_SongList_ID = category_SongList_Info.Category_SongList_ID;
                            product_Song.category_SongList_Info = category_SongList_Info;
                            product_Song.SongList_Name_AND_Song_Url = list_name + ":" + song.Song_Url;

                            product_Song.Song_No = song.Song_No;
                            product_Song.Song_Name = song.Song_Name;
                            product_Song.Singer_Name = song.Singer_Name;
                            product_Song.Song_Url = song.Song_Url;
                            ///product_Song.Song_Duration = song.Song_Duration;
                            product_Song.Song_Like = song.Song_Like;
                            product_Song.Album_Name = song.Album_Name;
                            ///product_Song.MV_Path = song.MV_Path;

                            dbContext.Product_Song_Infos.Add(product_Song);
                            await dbContext.SaveChangesAsync();
                        }
                    }
                }
            }
        }

        /// <summary>
        /// 从内置数据库中 读取整个歌单
        /// </summary>
        /// <param name="category_SongList_ID"></param>
        /// <param name="category_SongList_Name"></param>
        /// <returns></returns>
        public async Task<ObservableCollection<SongList_Info>> Read_Songs_From_DatabaseAsync(int category_SongList_ID, string category_SongList_Name)
        {
            var playlists = new ObservableCollection<SongList_Info>();

            var songlists = await dbContext.Category_SongList_Infos
                .Where(list => list.Category_SongList_Name == category_SongList_Name)
                .ToListAsync();
            if (songlists.Any())
            {
                foreach (var list in songlists)
                {
                    var playlist = new SongList_Info();
                    playlist.ID = list.Category_SongList_ID;
                    playlist.Name = list.Category_SongList_Name;
                    playlist.Songs = new ObservableCollection<Song_Info>();

                    var songs = await dbContext.Product_Song_Infos
                        .Where(song => song.Category_SongList_ID == list.Category_SongList_ID)
                        .ToListAsync();

                    foreach (var item in songs)
                    {
                        Song_Info _Song_Info = new Song_Info();
                        _Song_Info.Song_No = item.Song_No;
                        _Song_Info.Song_Name = item.Song_Name;
                        _Song_Info.Singer_Name = item.Singer_Name;
                        _Song_Info.Song_Url = item.Song_Url;
                        ///_Song_Info.Song_Duration = item.Song_Duration;
                        _Song_Info.Song_Like = item.Song_Like;
                        _Song_Info.Album_Name = item.Album_Name;
                        ///_Song_Info.MV_Path = item.MV_Path;

                        _Song_Info.Visibility_Playing = Visibility.Collapsed;

                        if (_Song_Info.Song_Like == 1)
                            _Song_Info.Song_Like_Image = ImageBrush_LoveEnter;
                        else
                            _Song_Info.Song_Like_Image = ImageBrush_LoveNormal;

                        if (song_Infos_Love != null && song_Infos_Love.Any(s => s.Song_Url.Equals(_Song_Info.Song_Url)))
                        {
                            _Song_Info.Song_Like = 1;
                            _Song_Info.Song_Like_Image = ImageBrush_LoveEnter;
                        }

                        _Song_Info.Song_MV_Image = null;


                        playlist.Songs.Add(_Song_Info);
                    }

                    if (category_SongList_Name.Equals("我的收藏"))
                    {
                        song_Infos_Love = new ObservableCollection<Song_Info>(playlist.Songs);
                    }

                    playlists.Add(playlist);
                }
            }
            else
            {
                var templist = new SongList_Info();
                templist.ID = category_SongList_ID;
                templist.Name = category_SongList_Name;
                templist.Songs = new ObservableCollection<Song_Info>();

                playlists.Add(templist);
            }

            return playlists;
        }

        /// <summary>
        /// 保存整个歌单至 内置数据库
        /// </summary>
        /// <param name="songs"></param>
        /// <param name="category_SongList_ID"></param>
        /// <param name="list_name"></param>
        /// <returns></returns>
        public void Save_SongList_To_Database(ObservableCollection<Product_Song_Info> songs, int category_SongList_ID, string list_name)
        {
            if (songs.Count > 0)
            {
                Category_SongList_Info category_SongList_Info = new Category_SongList_Info();
                category_SongList_Info.Category_SongList_Name = list_name;

                var result_songlist = dbContext.Category_SongList_Infos
                                            .Where(temp => temp.Category_SongList_Name.Equals(category_SongList_Info.Category_SongList_Name))
                                            .ToList();

                if (!result_songlist.Any())
                {
                    var lastCategory = dbContext.Category_SongList_Infos
                                                  .OrderByDescending(c => c.Category_SongList_ID)
                                                  .FirstOrDefault();

                    if (lastCategory != null)
                        category_SongList_Info.Category_SongList_ID = lastCategory.Category_SongList_ID + 1;

                    dbContext.Category_SongList_Infos.Add(category_SongList_Info);

                    /// 必须Save，否则无法存储到dbContext.Category_SongList_Infos
                    dbContext.SaveChanges();
                }
                else
                {
                    category_SongList_Info = result_songlist.FirstOrDefault();
                }

                if (dbContext.Category_SongList_Infos.Any())
                {
                    foreach (Product_Song_Info song in songs)
                    {
                        if (song != null)
                        {
                            var existingAlbum = dbContext.Product_Song_Infos
                                .Where(temp => temp.Song_Url.Equals(song.SongList_Name_AND_Song_Url))
                                .FirstOrDefault();
                            if (existingAlbum == null)
                            {
                                song.Category_SongList_ID = category_SongList_Info.Category_SongList_ID;
                                song.category_SongList_Info = category_SongList_Info;
                                if (dbContext.Product_Song_Infos.Find(song.SongList_Name_AND_Song_Url) == null)
                                {
                                    dbContext.Product_Song_Infos.Add(song);
                                    /// 必须Save，否则无法存储到dbContext.Product_Song_Infos
                                    dbContext.SaveChanges();
                                }
                            }
                            else if (!existingAlbum.Category_SongList_ID.Equals(category_SongList_Info.Category_SongList_ID))
                            {
                                song.Category_SongList_ID = category_SongList_Info.Category_SongList_ID;
                                song.category_SongList_Info = category_SongList_Info;
                                if (dbContext.Product_Song_Infos.Find(song.SongList_Name_AND_Song_Url) == null)
                                {
                                    dbContext.Product_Song_Infos.Add(song);
                                    /// 必须Save，否则无法存储到dbContext.Product_Song_Infos
                                    dbContext.SaveChanges();
                                }
                            }
                        }
                    }

                }
            }
        }
        public async Task Save_SongList_To_DatabaseAsync(ObservableCollection<Product_Song_Info> songs, int category_SongList_ID, string list_name)
        {
            if (songs.Count > 0)
            {
                Category_SongList_Info category_SongList_Info = new Category_SongList_Info();
                category_SongList_Info.Category_SongList_Name = list_name;

                var result_songlist = await dbContext.Category_SongList_Infos
                                            .Where(temp => temp.Category_SongList_Name.Equals(category_SongList_Info.Category_SongList_Name))
                                            .ToListAsync();

                if (!result_songlist.Any())
                {
                    var lastCategory = await dbContext.Category_SongList_Infos
                                                  .OrderByDescending(c => c.Category_SongList_ID)
                                                  .FirstOrDefaultAsync();

                    if (lastCategory != null)
                        category_SongList_Info.Category_SongList_ID = lastCategory.Category_SongList_ID + 1;

                    dbContext.Category_SongList_Infos.Add(category_SongList_Info);
                    await dbContext.SaveChangesAsync();
                }
                else
                {
                    category_SongList_Info = result_songlist.FirstOrDefault();
                }

                if (dbContext.Category_SongList_Infos.Any())
                {
                    foreach (Product_Song_Info song in songs)
                    {
                        if (song != null)
                        {
                            var existingAlbum = await dbContext.Product_Song_Infos
                                .Where(temp => temp.Song_Url.Equals(song.SongList_Name_AND_Song_Url))
                                .FirstOrDefaultAsync();
                            if (existingAlbum == null)
                            {
                                song.Category_SongList_ID = category_SongList_Info.Category_SongList_ID;
                                song.category_SongList_Info = category_SongList_Info;
                                if (await dbContext.Product_Song_Infos.FindAsync(song.SongList_Name_AND_Song_Url) == null)
                                {
                                    dbContext.Product_Song_Infos.Add(song);
                                    await dbContext.SaveChangesAsync();
                                }
                            }
                            else if (!existingAlbum.Category_SongList_ID.Equals(category_SongList_Info.Category_SongList_ID))
                            {
                                song.Category_SongList_ID = category_SongList_Info.Category_SongList_ID;
                                song.category_SongList_Info = category_SongList_Info;
                                if (await dbContext.Product_Song_Infos.FindAsync(song.SongList_Name_AND_Song_Url) == null)
                                {
                                    dbContext.Product_Song_Infos.Add(song);
                                    await dbContext.SaveChangesAsync();
                                }
                            }
                        }
                    }

                }
            }
        }

        /// <summary>
        /// 清除指定歌单数据 -> 数据库
        /// </summary>
        /// <param name="category_SongList_ID"></param>
        /// <param name="list_name"></param>
        /// <returns></returns>
        public async Task Clear_SongList_To_DatabaseAsync(int category_SongList_ID, string list_name)
        {
            var allCategories = await dbContext.Category_SongList_Infos.ToListAsync();
            dbContext.Category_SongList_Infos.RemoveRange(allCategories);

            var allProducts = await dbContext.Product_Song_Infos.ToListAsync();
            dbContext.Product_Song_Infos.RemoveRange(allProducts);

            await dbContext.SaveChangesAsync();
        }
    }
}
