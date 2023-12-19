using NSMusicS;
using NSMusicS.Models;
using NSMusicS.Models.APP_DB_SqlLite.Category;
using NSMusicS.Models.APP_DB_SqlLite.Product;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace NSMusicS.Models.APP_DB_SqlLite.Category
{
    public class Category_SongList_Info
    {
        public int Category_SongList_ID { get; set; }
        public string Category_SongList_Name { get; set; }

        public virtual ICollection<Product_Song_Info> Product_Song_Infos
        {
            get; private set;
        } = new ObservableCollection<Product_Song_Info>();
    }
}
