﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace NSMusicS.Models.Song_List_Of_AlbumList_Infos
{
    public class Album_Performer_Infos
    {
        public ImageBrush Album_Performer_Image { get; set; }
        public string Album_Performer_Name { get; set; }
        public List<string> List_Album_Names { get; set; }
        public string Album_Performer_Of_AlbumNums { get; set; }
    }
}