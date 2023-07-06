using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoZhiMusic_Ultimate.Models.Song_List_Infos
{
    public class SongList_Info
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public List<Song_Info> Songs { get; set; }

        public static implicit operator List<object>(SongList_Info v)
        {
            throw new NotImplementedException();
        }
    }
}
