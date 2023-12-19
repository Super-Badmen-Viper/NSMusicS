using NSMusicS;
using NSMusicS.Models;
using NSMusicS.Models.APP_DB_SqlLite.Category;
using NSMusicS.Models.APP_DB_SqlLite.Product;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.APP_DB_SqlLite.Product
{
    public class Product_Singer_Info
    {
        public string Album_Name { get; set; }
        public string Album_Performer_Name { get; set; }

        public string SongList_Name_AND_Album_Performer_Name_AND_Album_Name { get; set; }

        public int Category_SingerList_ID { get; set; }
        public virtual Category_SingerList_Info category_SingerList_Info { get; set; }
    }
}
