using NSMusicS;
using NSMusicS.Models;
using NSMusicS.Models.APP_DB_SqlLite.Category;
using NSMusicS.Models.APP_DB_SqlLite.Product;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.APP_DB_SqlLite.Product
{
    public class Product_Song_Info
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Song_No { get; set; }

        public string Song_Name { get; set; }
        public string Singer_Name { get; set; }
        public string Album_Name { get; set; }
        public string Song_Url { get; set; }
        public string Song_Duration { get; set; }   
        public int Song_Like { get; set; }
        public string MV_Path { get; set; }

        public string SongList_Name_AND_Song_Url { get; set; }

        public int Category_SongList_ID { get; set; }
        public virtual Category_SongList_Info category_SongList_Info { get; set; }
    }
}
