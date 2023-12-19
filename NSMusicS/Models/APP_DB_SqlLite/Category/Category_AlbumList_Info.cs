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

namespace NSMusicS.Models.APP_DB_SqlLite.Category
{
    public class Category_AlbumList_Info
    {
        public int Category_AlbumList_ID { get; set; }
        public string Category_AlbumList_Name { get; set; }

        public virtual ICollection<Product_Album_Info> Product_Album_Infos
        {
            get; private set;
        } = new ObservableCollection<Product_Album_Info>();
    }
}
