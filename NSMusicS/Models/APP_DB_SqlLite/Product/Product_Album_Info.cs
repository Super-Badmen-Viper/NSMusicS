using NSMusicS;
using NSMusicS.Models;
using NSMusicS.Models.APP_DB_SqlLite.Category;
using NSMusicS.Models.APP_DB_SqlLite.Product;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.APP_DB_SqlLite.Product
{
    public class Product_Album_Info
    {
        /// <summary>
        /// 歌单+歌手+专辑名：主键
        /// </summary>
        public string SongList_Performer_Album_Name { get; set; }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Album_No { get; set; }

        public string Album_Name { get; set; }
        public string Singer_Name { get; set; }
        public string Album_Image_Url { get; set; }
        public string Albumr_Of_Song_Nums { get; set; }

        public int Category_AlbumList_ID { get; set; }
        public virtual Category_AlbumList_Info category_AlbumList_Info { get; set; }
    }
}
