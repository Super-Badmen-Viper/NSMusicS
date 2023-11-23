using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static NSMusicS.Models.Servies_For_API_Info.API_Song_Info;

namespace NSMusicS.Models.Servies_For_API_Info
{
    public class Json_Search_Song
    {
        public static string Retuen_This_SearchText()
        {
            SearchText = This_SearchText();
            return SearchText;
        }
        /*public static string Retuen_This_SearchPageNum()
        {
            SearchPageNum = This_SearchPageNum();
            return SearchPageNum;
        }*/
        public static string Retuen_This_Search_Song_id()
        {
            Song_id = This_Search_Song_id();
            return Song_id;
        }
        public static string Retuen_This_Search_Singer_id()
        {
            Singer_id = This_Singer_id();
            return Singer_id;
        }
        public static string Retuen_This_Search_MV_id()
        {
            MV_id = This_MV_id();
            return MV_id;
        }
        public static string Retuen_This_Search_Album_id()
        {
            Album_id = This_Album_id();
            return Album_id;
        }
        public static string Retuen_This_Search_Song_Web_Url()
        {
            Song_Web_Url = This_Song_Url();
            return Song_Web_Url;
        }
        public static string Retuen_This_Search_Album_Url()
        {
            Album_Url = This_Album_Url();
            return Album_Url;
        }



        public static string SearchText { get; set; }

        private static string This_SearchText()
        {
            if (SearchText == null)
                SearchText = "";

            return SearchText;
        }


        public static string Song_id { get; set; }

        private static string This_Search_Song_id()
        {
            if (Song_id == null)
                Song_id = "";

            return Song_id;
        }

        public static string Singer_id { get; set; }

        private static string This_Singer_id()
        {
            if (Singer_id == null)
                Singer_id = "";

            return Singer_id;
        }

        public static string MV_id { get; set; }

        private static string This_MV_id()
        {
            if (MV_id == null)
                MV_id = "";

            return MV_id;
        }

        public static string Album_id { get; set; }

        private static string This_Album_id()
        {
            if (Album_id == null)
                Album_id = "";

            return Album_id;
        }



        public static string Song_Web_Url { get; set; }

        private static string This_Song_Url()
        {
            if (Song_Web_Url == null)
                Song_Web_Url = "";

            return Song_Web_Url;
        }

        public static string Album_Url { get; set; }

        private static string This_Album_Url()
        {
            if (Album_Url == null)
                Album_Url = "";

            return Album_Url;
        }



        public static string Song_Name { get; set; }


        public static string Singer_Name { get; set; }


        public static string Album_Name { get; set; }


        public static string Song_File { get; set; }

    }
}
