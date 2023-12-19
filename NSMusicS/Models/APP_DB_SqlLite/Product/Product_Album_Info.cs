using NSMusicS;
using NSMusicS.Models;
using NSMusicS.Models.APP_DB_SqlLite.Category;
using NSMusicS.Models.APP_DB_SqlLite.Product;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.APP_DB_SqlLite.Product
{
    public class Product_Album_Info
    {
        public string Album_Name { get; set; }
        public string Album_Image_Url { get; set; }
        public List<Product_Song_Info> product_Song_Infos { get; set; }

        /// <summary>
        /// 歌单+歌手+专辑名：主键
        /// </summary>
        public string SongList_Performer_Album_Name { get; set; }

        public int Category_AlbumList_ID { get; set; }
        public virtual Category_AlbumList_Info category_AlbumList_Info { get; set; }
    }
}
