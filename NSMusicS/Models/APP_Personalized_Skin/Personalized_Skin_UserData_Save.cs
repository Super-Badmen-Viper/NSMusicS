using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace NSMusicS.Models.APP_Personalized_Skin
{
    public class Personalized_Skin_UserData_Save
    {
        public static void Save(string filePath, Data_Personalized_Skin data)
        {
            // 创建 XmlDocument 对象
            XmlDocument doc = new XmlDocument();

            // 创建 PersonalizedSettings 根元素
            XmlElement root = doc.CreateElement("PersonalizedSettings");
            doc.AppendChild(root);

            // 创建 Personalized_Skin 元素
            XmlElement personalizedSkin = doc.CreateElement("Personalized_Skin");
            personalizedSkin.InnerText = data.Personalized_Skin.ToString();
            root.AppendChild(personalizedSkin);

            // 创建 Skins 元素
            XmlElement skins = doc.CreateElement("Skins");
            foreach (Skin skin in data.Skins)
            {
                XmlElement newSkin = doc.CreateElement("Skin");
                XmlElement newSidebarBackground = doc.CreateElement("Sidebar_Background");
                newSidebarBackground.InnerText = skin.Sidebar_Background;
                XmlElement newFrameBackground = doc.CreateElement("Frame_Background");
                newFrameBackground.InnerText = skin.Frame_Background;
                newSkin.AppendChild(newSidebarBackground);
                newSkin.AppendChild(newFrameBackground);
                skins.AppendChild(newSkin);
            }
            root.AppendChild(skins);

            // 创建 ImageBrush_this_app_Background 元素
            XmlElement imageBrushes = doc.CreateElement("ImageBrush_this_app_Background");
            foreach (string imageUrl in data.ImageBrush_this_app_Background)
            {
                XmlElement newImageSource = doc.CreateElement("ImageSource");
                newImageSource.InnerText = imageUrl;
                imageBrushes.AppendChild(newImageSource);
            }
            root.AppendChild(imageBrushes);

            // 保存 XML 文件
            doc.Save(filePath);
        }
    }
}
