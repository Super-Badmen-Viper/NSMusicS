using Dapper;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using NSMusicS;
using NSMusicS.Models;
using NSMusicS.Models.APP_DB_SqlLite.Category;
using NSMusicS.Models.APP_DB_SqlLite.Product;
using NSMusicS.Models.APP_DB_SqlLite.ProductContext;
using NSMusicS.Models.APP_DB_SqlLite.SS_Convert;
using NSMusicS.Models.Song_List_Infos;
using NSMusicS.Models.Song_List_Of_AlbumList_Infos;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace NSMusicS.Models.APP_DB_SqlLite.SS_Convert
{
    public class Convert_Album_List_Infos
    {
        public ProductContext_Album_Info dbContext;

        private ObservableCollection<Album_Performer_Infos> Album_ALL_s {  get; set; }


        /// <summary>
        /// 从 数据库 中读取整个歌单
        /// </summary>
        /// <param name="category_AlbumList_ID"></param>
        /// <param name="category_AlbumList_Name"></param>
        /// <returns></returns>
        public async Task<ObservableCollection<Album_Performer_List_Infos_For_Model_2>> Read_Albums_From_DatabaseAsync(int category_AlbumList_ID, string category_AlbumList_Name)
        {
            using (dbContext = new ProductContext_Album_Info("ProductContext_Album_Infos"))
            {
                dbContext.Database.EnsureCreated();
                dbContext.Category_AlbumList_Infos.Load();
                dbContext.Product_Album_Infos.Load();

                var playlists = new ObservableCollection<Album_Performer_List_Infos_For_Model_2>();

                var albumlists = await dbContext.Category_AlbumList_Infos
                    .Where(list => list.Category_AlbumList_Name == category_AlbumList_Name)
                    .ToListAsync();
                if (albumlists.Any())
                {
                    foreach (var list in albumlists)
                    {
                        var playlist = new Album_Performer_List_Infos_For_Model_2();
                        playlist.ID = list.Category_AlbumList_ID;
                        playlist.Name = list.Category_AlbumList_Name;
                        playlist.Albums = new ObservableCollection<Album_Performer_Infos>();

                        var albums = await dbContext.Product_Album_Infos
                            .Where(album => album.Category_AlbumList_ID == list.Category_AlbumList_ID)
                            .ToListAsync();

                        foreach (var item in albums)
                        {
                            Album_Performer_Infos _Album_Info = new Album_Performer_Infos();
                            _Album_Info.Album_No = item.Album_No;
                            _Album_Info.Album_Name = item.Album_Name;
                            _Album_Info.Album_Performer_Name = item.Singer_Name;
                            if (item.Album_Image_Url != null)
                                _Album_Info.Album_Performer_Image = new Uri(item.Album_Image_Url);
                            _Album_Info.Album_Performer_Of_AlbumNums = item.Albumr_Of_Song_Nums;
                            //_Album_Info.Song_Duration = item.Song_Duration;
                            //_Album_Info.Song_Like = item.Song_Like;
                           /* _Album_Info.MV_Path = item.MV_Path;
                            _Album_Info.IsChecked = false;

                            _Album_Info.Visibility_Playing = Visibility.Collapsed;

                            if (_Album_Info.Song_Like == 1)
                                _Album_Info.Song_Like_Image = ImageBrush_LoveEnter;
                            else
                                _Album_Info.Song_Like_Image = ImageBrush_LoveNormal;

                            if (song_Infos_Love != null && song_Infos_Love.Any(s => s.Song_Url.Equals(_Album_Info.Song_Url)))
                            {
                                _Album_Info.Song_Like = 1;
                                _Album_Info.Song_Like_Image = ImageBrush_LoveEnter;
                            }

                            _Album_Info.Song_MV_Image = null;*/


                            playlist.Albums.Add(_Album_Info);
                        }

                        /*if (category_AlbumList_Name.Equals("我的收藏"))
                        {
                            song_Infos_Love = new ObservableCollection<Album_Performer_Infos>(playlist.Albums);
                        }*/

                        playlists.Add(playlist);
                    }
                }
                else
                {
                    var templist = new Album_Performer_List_Infos_For_Model_2();
                    templist.ID = category_AlbumList_ID;
                    templist.Name = category_AlbumList_Name;
                    templist.Albums = new ObservableCollection<Album_Performer_Infos>();

                    playlists.Add(templist);
                }

                ObservableCollection<Album_Performer_List_Infos_For_Model_2> temp = new ObservableCollection<Album_Performer_List_Infos_For_Model_2>();
                Album_Performer_List_Infos_For_Model_2 list_Info = new Album_Performer_List_Infos_For_Model_2();
                list_Info.ID = category_AlbumList_ID;
                list_Info.Name = category_AlbumList_Name;
                list_Info.Albums = new ObservableCollection<Album_Performer_Infos>();
                foreach (var item in playlists)
                {
                    foreach (var song in item.Albums)
                    {
                        list_Info.Albums.Add(song);
                    }
                }
                temp.Add(list_Info);

                return temp;
            }
        }
        public async Task<ObservableCollection<Album_Performer_List_Infos_For_Model_2>> Read_Albums_From_DatabaseAsync_Dapper(int category_AlbumList_ID, string category_AlbumList_Name)
        {
            using (dbContext = new ProductContext_Album_Info("ProductContext_Album_Infos"))
            {
                dbContext.Database.EnsureCreated();
                dbContext.Category_AlbumList_Infos.Load();
                dbContext.Product_Album_Infos.Load();

                using (var connection = new SqliteConnection("Data Source=ProductContext_Album_Infos.db"))
                {
                    connection.Open();

                    var songlists = await connection.QueryAsync<Category_AlbumList_Info>("SELECT * FROM Category_AlbumList_Infos WHERE Category_AlbumList_Name = @Name", new { Name = category_AlbumList_Name });

                    var playlistTasks = songlists.Select(async list =>
                    {
                        var playlist = new Album_Performer_List_Infos_For_Model_2
                        {
                            ID = list.Category_AlbumList_ID,
                            Name = list.Category_AlbumList_Name,
                            Albums = new ObservableCollection<Album_Performer_Infos>()
                        };

                        var albums = await connection.QueryAsync<Product_Album_Info>("SELECT * FROM Product_Album_Infos WHERE Category_AlbumList_ID = @ID", new { ID = list.Category_AlbumList_ID });

                        foreach (var item in albums)
                        {
                            var _Album_Info = new Album_Performer_Infos
                            {
                                Album_No = item.Album_No,
                                Album_Performer_Name = item.Singer_Name,
                                Album_Name = item.Album_Name,
                                Album_Performer_Of_AlbumNums = item.Albumr_Of_Song_Nums
                                /* Song_Duration = item.Song_Duration,
                                 Song_Like = item.Song_Like,
                                 MV_Path = item.MV_Path,
                                 IsChecked = false,
                                 Visibility_Playing = Visibility.Collapsed,
                                 Song_Like_Image = item.Song_Like == 1 ? ImageBrush_LoveEnter : ImageBrush_LoveNormal,
                                 Song_MV_Image = null*/
                            };
                            if (item.Album_Image_Url != null)
                                if (File.Exists(item.Album_Image_Url))
                                    _Album_Info.Album_Performer_Image = new Uri(item.Album_Image_Url);

                            /*if (song_Infos_Love != null && song_Infos_Love.Any(s => s.Song_Url.Equals(_Album_Info.Song_Url)))
                            {
                                _Album_Info.Song_Like = 1;
                                _Album_Info.Song_Like_Image = ImageBrush_LoveEnter;
                            }*/

                            playlist.Albums.Add(_Album_Info);
                        }

                        /* if (category_AlbumList_Name.Equals("我的收藏"))
                         {
                             song_Infos_Love = new ObservableCollection<Album_Performer_Infos>(playlist.Songs);
                         }*/

                        return playlist;
                    });

                    var playlists = await Task.WhenAll(playlistTasks);

                    var temp = new ObservableCollection<Album_Performer_List_Infos_For_Model_2>();
                    var list_Info = new Album_Performer_List_Infos_For_Model_2
                    {
                        ID = category_AlbumList_ID,
                        Name = category_AlbumList_Name,
                        Albums = new ObservableCollection<Album_Performer_Infos>()
                    };

                    foreach (var item in playlists)
                    {
                        foreach (var album in item.Albums)
                        {
                            list_Info.Albums.Add(album);
                        }
                    }

                    temp.Add(list_Info);
                    return temp;
                }
            }
        }


        /// <summary>
        /// 保存整个歌单至 数据库（异步）
        /// </summary>
        /// <param name="albums"></param>
        /// <param name="category_AlbumList_ID"></param>
        /// <param name="list_name"></param>
        /// <returns></returns>
        public async Task Save_AlbumList_To_DatabaseAsync(ObservableCollection<Product_Album_Info> albums, int category_AlbumList_ID, string list_name)
        {
            using (dbContext = new ProductContext_Album_Info("ProductContext_Album_Infos"))
            {
                dbContext.Database.EnsureCreated();
                dbContext.Category_AlbumList_Infos.Load();
                dbContext.Product_Album_Infos.Load();

                List<Category_AlbumList_Info> albumlistsToAdd = new List<Category_AlbumList_Info>();
                List<Product_Album_Info> albumsToAdd = new List<Product_Album_Info>();
                List<Product_Album_Info> albumsToRemove = new List<Product_Album_Info>();

                if (albums.Count > 0)
                {
                    Category_AlbumList_Info category_AlbumList_Info = new Category_AlbumList_Info();
                    category_AlbumList_Info.Category_AlbumList_Name = list_name;

                    var result_albumlist = await dbContext.Category_AlbumList_Infos
                                                .Where(temp => temp.Category_AlbumList_Name.Equals(category_AlbumList_Info.Category_AlbumList_Name))
                                                .ToListAsync();

                    if (!result_albumlist.Any())
                    {
                        var lastCategory = await dbContext.Category_AlbumList_Infos
                                                      .OrderByDescending(c => c.Category_AlbumList_ID)
                                                      .FirstOrDefaultAsync();

                        if (lastCategory != null)
                            category_AlbumList_Info.Category_AlbumList_ID = lastCategory.Category_AlbumList_ID + 1;

                        albumlistsToAdd.Add(category_AlbumList_Info);
                    }
                    else
                        category_AlbumList_Info = result_albumlist.FirstOrDefault();

                    foreach (Product_Album_Info album in albums)
                    {
                        if (album != null)
                        {
                            var existingAlbum = await dbContext.Product_Album_Infos
                                .Where(temp => temp.SongList_Performer_Album_Name.Equals(album.SongList_Performer_Album_Name))
                                .FirstOrDefaultAsync();
                            if (existingAlbum == null)
                            {
                                album.Category_AlbumList_ID = category_AlbumList_Info.Category_AlbumList_ID;
                                album.category_AlbumList_Info = category_AlbumList_Info;
                                if (await dbContext.Product_Album_Infos.FindAsync(album.SongList_Performer_Album_Name) == null)
                                {
                                    albumsToAdd.Add(album);
                                }
                            }
                            else if (!existingAlbum.Category_AlbumList_ID.Equals(category_AlbumList_Info.Category_AlbumList_ID))
                            {
                                album.Category_AlbumList_ID = category_AlbumList_Info.Category_AlbumList_ID;
                                album.category_AlbumList_Info = category_AlbumList_Info;
                                if (await dbContext.Product_Album_Infos.FindAsync(album.SongList_Performer_Album_Name) == null)
                                {
                                    albumsToAdd.Add(album);
                                }
                            }
                            else
                            {
                                ///albumsToRemove.Add(album);
                                ///dbContext.Product_Album_Infos.Remove(album);
                            }
                        }
                    }

                    dbContext.Category_AlbumList_Infos.AddRange(albumlistsToAdd);
                    dbContext.Product_Album_Infos.AddRange(albumsToAdd);
                    dbContext.Product_Album_Infos.RemoveRange(albumsToRemove);
                    await dbContext.SaveChangesAsync();
                }
            }
        }
        public async Task Save_AlbumList_To_DatabaseAsync_Dapper(ObservableCollection<Product_Album_Info> albums, int category_AlbumList_ID, string list_name)
        {
            using (var connection = new SqliteConnection("Data Source=ProductContext_Album_Infos.db"))
            {
                connection.Open();

                var transaction = connection.BeginTransaction();

                try
                {
                    var category_AlbumList_Info = await connection.QueryFirstOrDefaultAsync<Category_AlbumList_Info>(
                        "SELECT * FROM Category_AlbumList_Infos WHERE Category_AlbumList_Name = @Name",
                        new { Name = list_name },
                        transaction
                    );

                    if (category_AlbumList_Info == null)
                    {
                        await connection.ExecuteAsync(
                            "INSERT INTO Category_AlbumList_Infos (Category_AlbumList_Name) VALUES (@Name)",
                            new { Name = list_name },
                            transaction
                        );

                        category_AlbumList_ID = await connection.ExecuteScalarAsync<int>(
                            "SELECT last_insert_rowid()",
                            null,
                            transaction
                        );
                    }
                    else
                    {
                        category_AlbumList_ID = category_AlbumList_Info.Category_AlbumList_ID;
                    }

                    foreach (var album in albums)
                    {
                        var existingSong = await connection.QueryFirstOrDefaultAsync<Product_Album_Info>(
                            "SELECT * FROM Product_Album_Infos WHERE SongList_Performer_Album_Name = @SongList_Performer_Album_Name",
                            new { SongList_Performer_Album_Name = album.SongList_Performer_Album_Name },
                            transaction
                        );
                        if (album != null)
                        {
                            /*if (album.MV_Path == null)
                                album.MV_Path = "null";*/

                            if (existingSong == null)
                            {
                                await connection.ExecuteAsync(
                                    @"INSERT INTO Product_Album_Infos (Album_No, Album_Name, Singer_Name, Album_Image_Url, 
                                    Albumr_Of_Song_Nums,
                                    SongList_Performer_Album_Name,Category_AlbumList_ID)
                                VALUES (@Album_No, @Album_Name, @Singer_Name, @Album_Image_Url, 
                                    @Albumr_Of_Song_Nums,
                                    @SongList_Performer_Album_Name,@Category_AlbumList_ID)",
                                    new
                                    {
                                        Album_No = album.Album_No,
                                        Album_Name = album.Album_Name,
                                        Singer_Name = album.Singer_Name,
                                        Album_Image_Url = album.Album_Image_Url,
                                        Albumr_Of_Song_Nums = album.Albumr_Of_Song_Nums,
                                        SongList_Performer_Album_Name = album.SongList_Performer_Album_Name,
                                        Category_AlbumList_ID = category_AlbumList_ID
                                    },
                                    transaction
                                );
                            }
                            else if (existingSong.Category_AlbumList_ID != category_AlbumList_ID)
                            {
                                await connection.ExecuteAsync(
                                    "UPDATE Product_Album_Infos SET Category_AlbumList_ID = @Category_AlbumList_ID WHERE SongList_Performer_Album_Name = @SongList_Performer_Album_Name",
                                    new { Category_AlbumList_ID = category_AlbumList_ID, SongList_Performer_Album_Name = album.SongList_Performer_Album_Name },
                                    transaction
                                );
                            }
                            else
                            {
                                // Delete the album or perform other actions if necessary
                            }
                        }
                    }

                    transaction.Commit();
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }


        /// <summary>
        /// 数组转换  ObservableCollection<Album_Performer_Infos>  ->  ObservableCollection<Product_Album_Info>
        /// </summary>
        /// <param name="temp"></param>
        /// <returns></returns>
        public ObservableCollection<Product_Album_Info> Create_Product_Album_Infos(ObservableCollection<Album_Performer_Infos> temp, string list_name)
        {
            if (temp != null)
            {
                ObservableCollection<Product_Album_Info> albums = new ObservableCollection<Product_Album_Info>();
                for (int i = 0; i < temp.Count; i++)
                {
                    Product_Album_Info _Album_Info = new Product_Album_Info();
                    _Album_Info.Album_No = (i + 1).ToString();
                    _Album_Info.Album_Name = temp[i].Album_Name;
                    _Album_Info.Singer_Name = temp[i].Album_Performer_Name;

                    if (temp[i].Album_Performer_Image != null)
                        _Album_Info.Album_Image_Url = temp[i].Album_Performer_Image.AbsolutePath;
                    else
                        _Album_Info.Album_Image_Url = "";

                    _Album_Info.Albumr_Of_Song_Nums = temp[i].Album_Performer_Of_AlbumNums;

                    _Album_Info.SongList_Performer_Album_Name = list_name + ":" + temp[i].Album_Performer_Name + ":" + temp[i].Album_Name;

                    albums.Add(_Album_Info);
                }
                return albums;
            }
            return null;
        }
    }
}
