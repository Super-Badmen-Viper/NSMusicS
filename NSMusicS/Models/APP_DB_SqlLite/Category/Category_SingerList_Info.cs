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
    public class Category_SingerList_Info
    {
        public Uri Album_Performer_Image { get; set; }
        public string Album_Performer_Of_AlbumNums { get; set; }
        public string Album_Performer_Name { get; set; }

        public int Category_SingerList_ID { get; set; }
        public string Category_SongList_Name { get; set; }
        public virtual ICollection<Product_Singer_Info> Product_Singer_Infos
        {
            get; private set;
        } = new ObservableCollection<Product_Singer_Info>();///public List<string> List_Album_Names { get; set; }
    }
}
