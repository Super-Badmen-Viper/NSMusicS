using NSMusicS.Models.Song_List_Of_AlbumList_Infos;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.MusicPlayer_Model_Control_Albums.ViewModel_Assembly_Album_Show
{
    public class Album_Info_Class
    {
        public List<string> Album_Names {  get; set; }
        public List<Uri> Album_Image_Uris {  get; set; }
        public List<string> Album_Explain { get; set; }

        /// <summary>
        /// 鼠标刷新加载
        /// </summary>
        public int Start_Index { get; set; }
        public int End_Index { get; set; }  

        public static Album_Info_Class Album_Info_Class_s { get; set; }
        public static Album_Info_Class Retuen_This()
        {
            Album_Info_Class_s = Return_This_();
            return Album_Info_Class_s;
        }
        private static Album_Info_Class Return_This_()
        {
            if (Album_Info_Class_s == null)
                Album_Info_Class_s = new Album_Info_Class();

            return Album_Info_Class_s;
        }
    }
}
