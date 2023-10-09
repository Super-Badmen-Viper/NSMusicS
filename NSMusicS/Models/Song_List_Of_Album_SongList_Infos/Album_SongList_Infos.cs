using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace NSMusicS.Models.Song_List_Of_Album_SongList_Infos
{
    public class Album_SongList_Infos
    {
        public ImageBrush Album_Image { get; set; }
        public string Singer_Name { get; set; }
        public string Album_Name { get; set; }
        public ObservableCollection<Assembly_Album_SongList_Item> album_SongList_Infos { get; set; }
    }
}
