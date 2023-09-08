using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.Song_Mrc_Info;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_Extract_Infos
{
    public class Song_Extract_Info
    {
        /// <summary>
        /// 提取歌曲文件内专辑图片
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static Image Extract_AlbumImage_Of_This_SongUrl(string url)
        {
            Image image = null;

            if (File.Exists(url))
            {
                TagLib.File xxxx = TagLib.File.Create(url);

                if (xxxx.Tag.Pictures.Length >= 1)
                {
                    byte[] bin = xxxx.Tag.Pictures[0].Data.Data;
                    image = ReturnPhoto(bin);
                }
            }

            return image;
        }
        private static Image ReturnPhoto(byte[] streamByte)
        {
            try
            {
                System.IO.MemoryStream ms = new System.IO.MemoryStream(streamByte);
                System.Drawing.Image img = System.Drawing.Image.FromStream(ms);

                return img;
            }
            catch
            {

            }
            return null;
        }

        public static ArrayList Extract_Lyic_Of_This_SongUrl(string url)
        {
            ArrayList arrayList;
            TagLib.File xxxx = TagLib.File.Create(url);
            if (xxxx.Tag.Lyrics != null)
            {
                if (xxxx.Tag.Lyrics.Length > 0)
                {
                    string[] lines;
                    if (xxxx.Tag.Lyrics.IndexOf("\r\n") >= 0)
                    {
                        lines = xxxx.Tag.Lyrics.Split(new[] { "\r\n" }, StringSplitOptions.RemoveEmptyEntries);

                        arrayList = new ArrayList();
                        foreach (string line in lines)
                            arrayList.Add(line);

                        for (int i = arrayList.Count - 1; i >= 0; i--)
                        {
                            string A_String_Read = arrayList[i].ToString();

                            if (!A_String_Read.Contains("<"))
                            {
                                arrayList.RemoveAt(i);
                            }
                        }
                    }
                    else
                    {
                        lines = xxxx.Tag.Lyrics.Split(new[] { "\n" }, StringSplitOptions.RemoveEmptyEntries);

                        arrayList = new ArrayList();
                        foreach (string line in lines)
                            arrayList.Add(line);
                    }

                    return arrayList;
                }
            }

            return null;
        }
        public static bool isPureNum(string str)
        {
            if (str.Length == 0 || str == null)//验证这个字符串是否为空
            {
                return false;
            }
            byte[] strBytes = Encoding.ASCII.GetBytes(str);//获取字符串的byte类型的字符数组，编码方式ASCII
            foreach (byte strByte in strBytes)
            {
                if ((strByte < 48) || (strByte > 57))     //判断每个字符是否为数字，根据每个字符的ASCII值所在范围判断
                {
                    return false;                     //不是，就返回false
                }
            }
            return true;                              //是，就返回true
        }
    }
}
