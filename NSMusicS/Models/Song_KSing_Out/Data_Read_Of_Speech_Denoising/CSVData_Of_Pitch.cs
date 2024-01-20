using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.Song_KSing_Out.Data_Read_Of_Speech_Denoising
{
    public class CSVData_Of_Pitch
    {
        public double Playback_Time { get; set; }
        public double Pitch { get; set; }   //Pitch默认读取时为0~40，需扩大为0~200(CanvasTop为0~200)，方便数据处理
        public double Start_Time { get; set; }
        public double Duration { get; set; }
        public double End_Time { get; set; }
    }
}
