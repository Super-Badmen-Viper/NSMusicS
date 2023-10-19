using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace NSMusicS.Models.Song_List_Of_Album_SongList_Infos
{
    public class Album_SongList_Infos
    {
        public Uri Album_Image { get; set; }
        public string Singer_Name { get; set; }
        public string Album_Name { get; set; }
        public ObservableCollection<Assembly_Album_SongList_Item> album_SongList_Infos { get; set; }

        public string Album_Yaer { get; set; }
        public string Album_Genre { get; set; }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
                return false;

            // Compare the properties that define equality
            Album_SongList_Infos other = (Album_SongList_Infos)obj;
            return (Singer_Name == other.Singer_Name /* && Compare other properties */);
        }
        public override int GetHashCode()
        {
            // Generate a hash code based on the properties used in Equals method
            int hash = 17;
            hash = hash * 23 + Singer_Name.GetHashCode();
            // Include other properties in the hash code calculation
            return hash;
        }
    }
}
