using NSMusicS.UserControlLibrary.MusicPlayer_Main.MusicPlayer_Model_Control_Albums.ViewModel_Assembly_Album_Show;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.MusicPlayer_Model_Control_Albums.ViewModel_Assembly_Singer_Show
{
    public class Singer_Info_Class
    {
        public List<string> Singer_Names { get; set; }
        public List<Uri> Singer_Image_Uris { get; set; }
        public List<string> Singer_Explain { get; set; }

        /// <summary>
        /// 鼠标刷新加载
        /// </summary>
        public int Start_Index { get; set; }
        public int End_Index { get; set; }

        public static Singer_Info_Class Singer_Info_Class_s { get; set; }
        public static Singer_Info_Class Retuen_This()
        {
            Singer_Info_Class_s = Return_This_();
            return Singer_Info_Class_s;
        }
        private static Singer_Info_Class Return_This_()
        {
            if (Singer_Info_Class_s == null)
                Singer_Info_Class_s = new Singer_Info_Class();

            return Singer_Info_Class_s;
        }
    }
}
