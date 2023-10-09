using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.APP_Personalized_Skin
{
    public class Data_Personalized_Skin
    {
        public static Data_Personalized_Skin data_Personalized_Skins { get; set; }
        public static Data_Personalized_Skin Retuen_This()
        {
            data_Personalized_Skins = Return_Data_Personalized_Skin();
            return data_Personalized_Skins;
        }
        private static Data_Personalized_Skin Return_Data_Personalized_Skin()
        {
            if (data_Personalized_Skins == null)
                data_Personalized_Skins = new Data_Personalized_Skin();

            return data_Personalized_Skins;
        }

        public int Personalized_Skin { get; set; }
        public List<Skin> Skins { get; set; }
        public List<string> ImageBrush_this_app_Background { get; set; }
    }
}
