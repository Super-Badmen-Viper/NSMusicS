using Microsoft.EntityFrameworkCore;
using NSMusicS;
using NSMusicS.Models;
using NSMusicS.Models.APP_DB_SqlLite.Product;
using NSMusicS.Models.APP_DB_SqlLite.ProductContext;
using NSMusicS.Models.APP_DB_SqlLite.SS_Convert;
using NSMusicS.Models.Song_List_Infos;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.APP_DB_SqlLite.SS_Convert
{
    public class Convert_Album_List_Infos
    {
        public ProductContext_Album_Info dbContext;

        public Convert_Album_List_Infos()
        {
            dbContext = new ProductContext_Album_Info("ProductContext_Album_Infos");
            dbContext.Database.EnsureCreated();
            dbContext.Category_AlbumList_Infos.Load();
            dbContext.Product_Album_Infos.Load();
        }

        /// <summary>
        /// 数组转换  ObservableCollection<Song_Info>  ->  ObservableCollection<Product_Album_Info>
        /// </summary>
        /// <param name="temp"></param>
        /// <returns></returns>
        public ObservableCollection<Product_Album_Info> Create_Product_Album_Infos(ObservableCollection<Song_Info> temp, string list_name)
        {
            /*if (temp != null)
            {
                ObservableCollection<Product_Album_Info> songs = new ObservableCollection<Product_Album_Info>();
                foreach (var item in temp)
                {
                    Product_Album_Info _Album_Info = new Product_Album_Info();
                    _Album_Info.Song_No = item.Song_No;
                    _Album_Info.Song_Name = item.Song_Name;
                    _Album_Info.Singer_Name = item.Singer_Name;
                    _Album_Info.Song_Url = item.Song_Url;
                    ///_Album_Info.Song_Duration = item.Song_Duration;
                    _Album_Info.Song_Like = item.Song_Like;
                    _Album_Info.Album_Name = item.Album_Name;
                    ///_Album_Info.MV_Path = item.MV_Path;

                    _Album_Info.SongList_Name_AND_Song_Url = list_name + ":" + item.Song_Url;

                    songs.Add(_Album_Info);
                }
                return songs;
            }*/
            return null;
        }
    }
}
