using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.Windows;
using System.Windows.Data;
using NSMusicS.Models.Song_List_Infos.Product;
using NSMusicS.Models.Song_List_Infos.ProductContext;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Data;
using SQLitePCL;
using NSMusicS.Models.Song_List_Infos.Category;
using static NSMusicS.Models.Song_List_Infos.SongList_Info_Save;
using static NSMusicS.Models.Servies_For_API_Info.API_Song_Info;
using SkiaSharp;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.StartPanel;

namespace NSMusicS.Models.Song_List_Infos.Convert_Song_Info
{
    internal class Convert_Song_List_Infos
    {
        public ProductContext_Song_Info dbContext =
            new ProductContext_Song_Info();

        ObservableCollection<ObservableCollection<Models.Song_List_Infos.SongList_Info>> songList_Infos;
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
            dbContext.Database.EnsureCreated();

            // load the entities into EF Core
            dbContext.Category_SongList_Infos.Load();//歌单
            // bind to the source
            categoryViewSource = new CollectionViewSource();
            categoryViewSource.Source =
                dbContext.Category_SongList_Infos.Local.ToObservableCollection();

            dbContext.Product_Song_Infos.Load();//歌曲
            productViewSource = new CollectionViewSource();
            productViewSource.Source =
                dbContext.Product_Song_Infos.Local.ToObservableCollection();
        }

        /// <summary>
        /// 从内置数据库中 读取歌单
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
                        _Song_Info.Song_Duration = item.Song_Duration;
                        _Song_Info.Song_Like = item.Song_Like;
                        _Song_Info.Album_Name = item.Album_Name;
                        _Song_Info.MV_Path = item.MV_Path;

                        _Song_Info.Visibility_Playing = System.Windows.Visibility.Collapsed;

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
        /// 保存歌单至 内置数据库
        /// </summary>
        /// <param name="songs"></param>
        /// <param name="num"></param>
        /// <param name="list_name"></param>
        /// <returns></returns>
        public async Task Save_SongList_To_DatabaseAsync(ObservableCollection<Product_Song_Info> songs, int num, string list_name)
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
                            var existingSong = await dbContext.Product_Song_Infos
                                                        .Where(temp => temp.Song_Url.Equals(song.Song_Url))
                                                        .FirstOrDefaultAsync();

                            if (existingSong == null)
                            {
                                song.Category_SongList_ID = category_SongList_Info.Category_SongList_ID;
                                song.category_SongList_Info = category_SongList_Info;

                                dbContext.Product_Song_Infos.Add(song);
                                await dbContext.SaveChangesAsync();
                            }
                        }
                    }
                }
            }
        }
    }
}
