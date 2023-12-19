using Microsoft.EntityFrameworkCore;
using NSMusicS;
using NSMusicS.Models;
using NSMusicS.Models.APP_DB_SqlLite.Category;
using NSMusicS.Models.APP_DB_SqlLite.Product;
using NSMusicS.Models.APP_DB_SqlLite.ProductContext;
using NSMusicS.Models.APP_DB_SqlLite.SS_Convert;
using NSMusicS.Models.Song_List_Of_AlbumList_Infos;
using SkiaSharp;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Data;

namespace NSMusicS.Models.APP_DB_SqlLite.SS_Convert
{
    internal class Convert_Singer_List_Infos
    {
        public ProductContext_Singer_Info dbContext;
        ///public List<ProductContext_Singer_Info> productContext_Item_Singer_Infos = new List<ProductContext_Singer_Info>();

        public CollectionViewSource categoryViewSource;
        public CollectionViewSource productViewSource;

        public Convert_Singer_List_Infos()
        {
            dbContext = new ProductContext_Singer_Info("ProductContext_Singer_Infos");
            dbContext.Database.EnsureCreated();
            dbContext.Category_SingerList_Infos.Load();
            dbContext.Product_Singer_Infos.Load();

            /*ProductContext_Item_Singer_Info temp_0 = new ProductContext_Item_Singer_Info("ProductContext_Singer_Info_Love");
            temp_0.Database.EnsureCreated();
            temp_0.Category_SingerList_Infos.Load();
            temp_0.Product_Singer_Infos.Load();
            productContext_Item_Singer_Infos.Add(temp_0);

            ProductContext_Item_Singer_Info temp_1 = new ProductContext_Item_Singer_Info("ProductContext_Singer_Info_ALL");
            temp_1.Database.EnsureCreated();
            temp_1.Category_SingerList_Infos.Load();
            temp_1.Product_Singer_Infos.Load();
            productContext_Item_Singer_Infos.Add(temp_1);
            
            ProductContext_Item_Singer_Info temp_2 = new ProductContext_Item_Singer_Info("ProductContext_Singer_Info_Auto");
            temp_2.Database.EnsureCreated();
            temp_2.Category_SingerList_Infos.Load();
            temp_2.Product_Singer_Infos.Load();
            productContext_Item_Singer_Infos.Add(temp_2);
            


            ProductContext_Item_Singer_Info temp_00 = new ProductContext_Item_Singer_Info("ProductContext_Singer_Info_Current");
            temp_00.Database.EnsureCreated();
            temp_00.Category_SingerList_Infos.Load();
            temp_00.Product_Singer_Infos.Load();
            productContext_Item_Singer_Infos.Add(temp_00);*/
        }

        /// <summary>
        /// 数组转换 ObservableCollection<Album_Performer_Infos> temp  ->  ObservableCollection<Category_SingerList_Info>
        /// </summary>
        /// <param name="temp"></param>
        /// <returns></returns>
        public ObservableCollection<Category_SingerList_Info> Category_SingerList_Infos(ObservableCollection<Album_Performer_Infos> temp, string list_name)
        {
            if (temp != null)
            {
                ObservableCollection<Category_SingerList_Info> singers = new ObservableCollection<Category_SingerList_Info>();

                foreach (var item in temp)
                {
                    if (item.Album_Performer_Name != null)
                    {
                        if (item.List_Album_Names != null && item.List_Album_Names.Count > 0)
                        {
                            ObservableCollection<Product_Singer_Info> albums = new ObservableCollection<Product_Singer_Info>();

                            foreach (var al_name in item.List_Album_Names)
                            {
                                Product_Singer_Info _Album_Info = new Product_Singer_Info();
                                _Album_Info.Album_Name = al_name;
                                _Album_Info.Album_Performer_Name = item.Album_Performer_Name;
                                _Album_Info.SongList_Name_AND_Album_Performer_Name_AND_Album_Name = list_name + ":" + item.Album_Performer_Name + ":" + al_name;
                                albums.Add(_Album_Info);
                            }

                            Category_SingerList_Info _Singer_Info = new Category_SingerList_Info();
                            _Singer_Info.Album_Performer_Image = item.Album_Performer_Image;
                            _Singer_Info.Album_Performer_Of_AlbumNums = item.Album_Performer_Of_AlbumNums;
                            _Singer_Info.Album_Performer_Name = item.Album_Performer_Name;

                            foreach (var album in albums)
                            {
                                _Singer_Info.Product_Singer_Infos.Add(album);
                            }

                            singers.Add(_Singer_Info);
                        }
                    }
                }


                return singers;
            }
            return null;
        }


        public async Task<ObservableCollection<Album_Performer_Infos>> Read_Singers_From_DatabaseAsync(int num, string category_SongList_Name)
        {
            var album_Performer_Infos_list = new ObservableCollection<Album_Performer_Infos>();

            var singerlists = await dbContext.Category_SingerList_Infos
                .Where(list => list.Category_SongList_Name == category_SongList_Name)
                .ToListAsync();
            if (singerlists.Any())
            {
                foreach (var list in singerlists)
                {
                    var ap_ = new Album_Performer_Infos();
                    ap_.Album_Performer_Name = list.Album_Performer_Name;
                    ap_.Album_Performer_Image = list.Album_Performer_Image;
                    ap_.Album_Performer_Of_AlbumNums = list.Album_Performer_Of_AlbumNums;
                    ap_.List_Album_Names = new List<string>();

                    var singers = await dbContext.Product_Singer_Infos
                        .Where(singer => singer.Category_SingerList_ID == list.Category_SingerList_ID)
                        .ToListAsync();
                    foreach (var item in singers)
                    {
                        ap_.List_Album_Names.Add(item.Album_Name);
                    }

                    album_Performer_Infos_list.Add(ap_);
                }
            }

            return album_Performer_Infos_list;
        }
        /// <summary>
        /// 保存歌手专辑列表至 内置数据库
        /// </summary>
        /// <param name="singers">此歌单对应的专辑列表</param>
        /// <param name="num">此歌单的下标</param>
        /// <returns></returns>
        public async Task Save_SingerList_To_DatabaseAsync(ObservableCollection<Category_SingerList_Info> singers, int num, string list_name)
        {
            if (singers.Count > 0)
            {
                int nums_count = 0;
                foreach (var singer in singers)
                {
                    Category_SingerList_Info category_SingerList_Info = new Category_SingerList_Info();

                    var result_singerlist = await dbContext.Category_SingerList_Infos
                                            .Where(temp => temp.Album_Performer_Name.Equals(singer.Album_Performer_Name))
                                            .ToListAsync();
                    if (!result_singerlist.Any())
                    {
                        var lastCategory = await dbContext.Category_SingerList_Infos
                                                      .OrderByDescending(c => c.Category_SingerList_ID)
                                                      .FirstOrDefaultAsync();

                        if (lastCategory != null)
                            category_SingerList_Info.Category_SingerList_ID = lastCategory.Category_SingerList_ID + 1;

                        category_SingerList_Info.Album_Performer_Image = singer.Album_Performer_Image;
                        category_SingerList_Info.Album_Performer_Name = singer.Album_Performer_Name;
                        category_SingerList_Info.Album_Performer_Of_AlbumNums = singer.Album_Performer_Of_AlbumNums;
                        category_SingerList_Info.Category_SongList_Name = list_name;

                        dbContext.Category_SingerList_Infos.Add(category_SingerList_Info);
                        await dbContext.SaveChangesAsync();
                    }
                    else
                    {
                        category_SingerList_Info = result_singerlist.FirstOrDefault();
                    }

                    if (dbContext.Category_SingerList_Infos.Any())
                    {
                        foreach (var album in singer.Product_Singer_Infos)
                        {
                            if (album != null)
                            {
                                var existingAlbum = await dbContext.Product_Singer_Infos
                                    .Where(temp => temp.Album_Name.Equals(album.Album_Name))
                                    .FirstOrDefaultAsync();
                                if (existingAlbum == null)
                                {
                                    album.Category_SingerList_ID = category_SingerList_Info.Category_SingerList_ID;
                                    album.category_SingerList_Info = category_SingerList_Info;
                                    if (await dbContext.Product_Singer_Infos.FindAsync(album.SongList_Name_AND_Album_Performer_Name_AND_Album_Name) == null)
                                    {
                                        dbContext.Product_Singer_Infos.Add(album);
                                        await dbContext.SaveChangesAsync();
                                    }
                                }
                                else if (!existingAlbum.Album_Performer_Name.Equals(category_SingerList_Info.Album_Performer_Name))
                                {
                                    album.Category_SingerList_ID = category_SingerList_Info.Category_SingerList_ID;
                                    album.category_SingerList_Info = category_SingerList_Info;
                                    if (await dbContext.Product_Singer_Infos.FindAsync(album.SongList_Name_AND_Album_Performer_Name_AND_Album_Name) == null)
                                    {
                                        dbContext.Product_Singer_Infos.Add(album);
                                        await dbContext.SaveChangesAsync();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
