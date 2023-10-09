using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace NSMusicS.Models.Song_Audio_Out
{
    public class EQ_Bands_For_Model_1_Save
    {
        // 创建一个类来表示 XML 数据
        [XmlRoot("Data_Eq_Model_1")]
        public class Data_Eq_Model_1
        {
            [XmlElement("Nums")]
            public string Nums { get; set; }
        }


        public static void Save_Eq_Bands(string filePath, float[] nums)
        {
            try
            {
                string result = string.Join(",", nums);

                Data_Eq_Model_1 dataToSave = new Data_Eq_Model_1
                {
                    Nums = result
                };

                using (FileStream fileStream = new FileStream(filePath, FileMode.Create))
                {
                    XmlSerializer serializer = new XmlSerializer(typeof(Data_Eq_Model_1));
                    serializer.Serialize(fileStream, dataToSave);
                }
            }
            catch { }
        }
    }
}
