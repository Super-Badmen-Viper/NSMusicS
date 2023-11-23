using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace NSMusicS.Models.Servies_For_API_Info
{
    public class Show_Search_Song
    {
        public int Song_No { get; set; }


        public string Song_Url { get; set; }



        public string Song_Name { get; set; }


        public string Song_id { get; set; }


        public string Singer_Name { get; set; }


        public string Singer_id { get; set; }


        public string Album_Name { get; set; }


        public string Album_id { get; set; }


        public string Album_Url { get; set; }


        public string Song_Duration { get;set; }


        public string MV_id { get; set; }



        public ImageBrush Song_Like_Image { get; set; }



        public ImageBrush Song_MV_Image { get; set; }


        public ImageBrush Song_DownLoad_Image { get; set; }


        public ImageBrush Song_UpLoad_Tone_Quality { get; set; }



        public enum Song_MaxBrLevel
        {
            standard,//标准
            higher,//较高
            exhigh,//极高
            lossless,//无损
            hires,//Hi-res
            jyeffect,//高清环绕声
            sky,//沉浸环绕声
            jymaster//超清母带
        }
        public Song_MaxBrLevel MaxBrLevel { get; set; }


    }
}
