using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace NSMusicS.Models.Song_Audio_Out
{
    public class EQ_Bands_For_Model_1_Reader
    {
        [XmlRoot("Data_Eq_Model_1")]
        public class Data_Eq_Model_1
        {
            [XmlElement("Nums")]
            public string Nums { get; set; }
        }

        public static float[] Read_Eq_Bands(string filePath)
        {
            try
            {
                Data_Eq_Model_1 data;

                using (FileStream fileStream = new FileStream(filePath, FileMode.Open))
                {
                    XmlSerializer serializer = new XmlSerializer(typeof(Data_Eq_Model_1));
                    data = (Data_Eq_Model_1)serializer.Deserialize(fileStream);
                }

                string[] parts = data.Nums.Split(',');
                float[] numbers = Array.ConvertAll(parts, float.Parse);

                return numbers;
            }
            catch { }
            return null;
        }
    }
}
