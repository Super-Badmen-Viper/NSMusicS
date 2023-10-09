using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Xml;

namespace NSMusicS.Models.APP_Personalized_Skin
{
    public class Personalized_Skin_UserData_Reader
    {
        public static Data_Personalized_Skin Load(string filePath)
        {
            // 定义 Data_Personalized_Skin 类
            Data_Personalized_Skin data = new Data_Personalized_Skin();

            // 加载 XML 文件
            XmlDocument doc = new XmlDocument();
            doc.Load(filePath);

            // 获取 Personalized_Skin 元素
            XmlElement root = doc.DocumentElement;
            XmlElement personalizedSkin = (XmlElement)root.SelectSingleNode("Personalized_Skin");

            // 获取 Personalized Skin 序号
            int skinNumber = Convert.ToInt32(personalizedSkin.InnerText);

            // 获取 Skins 元素
            XmlElement skins = (XmlElement)root.SelectSingleNode("Skins");

            // 获取所有 Skin 元素
            XmlNodeList skinNodes = skins.SelectNodes("Skin");

            // 创建 Skins 列表
            List<Skin> skinList = new List<Skin>();

            // 遍历所有 Skin 元素
            foreach (XmlElement skinNode in skinNodes)
            {
                // 获取 Sidebar_Background 和 Frame_Background 属性
                string sidebarBackground = skinNode.SelectSingleNode("Sidebar_Background").InnerText;
                string frameBackground = skinNode.SelectSingleNode("Frame_Background").InnerText;

                // 创建 Skin 对象并添加到列表中
                Skin skin = new Skin
                {
                    Sidebar_Background = sidebarBackground,
                    Frame_Background = frameBackground
                };
                skinList.Add(skin);
            }

            // 获取 ImageBrush_this_app_Background 元素
            XmlElement imageBrushes = (XmlElement)root.SelectSingleNode("ImageBrush_this_app_Background");

            // 获取所有 ImageBrush 的 ImageSource URL
            List<string> imageBrushUrls = new List<string>();
            XmlNodeList imageBrushNodes = imageBrushes.SelectNodes("ImageSource");
            foreach (XmlElement imageBrushNode in imageBrushNodes)
            {
                string imageUrl = imageBrushNode.InnerText;
                imageBrushUrls.Add(imageUrl);
            }

            // 存储 Personalized Skin 的数据
            data.Personalized_Skin = skinNumber;
            data.Skins = skinList;
            data.ImageBrush_this_app_Background = imageBrushUrls;

            return data;
        }
    }
}
