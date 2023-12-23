using NSMusicS.Dao_UserControl.Song_Mrc_Info;
using NSMusicS.Models.Song_List_Infos;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Interop;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using Brush = System.Windows.Media.Brush;

namespace NSMusicS.Models.Song_Extract_Infos
{
    public class Song_Extract_Info
    {
        /// <summary>
        /// 提取歌曲文件内专辑图片
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static BitmapImage Extract_AlbumImage_Of_This_SongUrl(string url)
        {
            BitmapImage bitmapImage = null;

            if (url.IndexOf(".wav") < 0)
            {
                if (File.Exists(url))
                {
                    using (TagLib.File xxxx = TagLib.File.Create(url))
                    {
                        if (xxxx.Tag.Pictures.Length >= 1)
                        {
                            try
                            {
                                using (MemoryStream stream = new MemoryStream(
                                    xxxx.Tag.Pictures[0].Data.Data))
                                {
                                    bitmapImage = new BitmapImage();
                                    bitmapImage.BeginInit();
                                    bitmapImage.StreamSource = stream;
                                    bitmapImage.CacheOption = BitmapCacheOption.OnLoad; // Load the image immediately
                                    bitmapImage.EndInit();
                                    bitmapImage.Freeze();
                                }

                                return bitmapImage;
                            }
                            catch { }
                        }
                    }
                }
            }

            bitmapImage = null;

            return null;
        }
        public async static Task<BitmapImage> Extract_AlbumImage_Of_This_SongUrl_async(string url)
        {
            var tcs = new TaskCompletionSource<BitmapImage>();

            await Task.Run(async () =>
            {
                BitmapImage bitmapImage = null;

                if (url.IndexOf(".wav") < 0)
                {
                    if (File.Exists(url))
                    {
                        using (TagLib.File xxxx = TagLib.File.Create(url))
                        {
                            if (xxxx.Tag.Pictures.Length >= 1)
                            {
                                try
                                {
                                    using (MemoryStream stream = new MemoryStream(
                                        xxxx.Tag.Pictures[0].Data.Data
                                        ))
                                    {
                                        bitmapImage = new BitmapImage();
                                        bitmapImage.BeginInit();
                                        bitmapImage.StreamSource = stream;
                                        bitmapImage.CacheOption = BitmapCacheOption.OnLoad; // Load the image immediately
                                        bitmapImage.EndInit();
                                        bitmapImage.Freeze();
                                    }

                                    tcs.SetResult(bitmapImage);
                                }
                                catch { }
                            }
                            xxxx.Dispose();
                        }
                    }
                }
            });

            return await tcs.Task;
        }
        public static MemoryStream Extract_MemoryStream_AlbumImage_Of_This_SongUrl(string url)
        {
            if (url.IndexOf(".wav") < 0)
            {
                if (File.Exists(url))
                {
                    try
                    {
                        using (TagLib.File xxxx = TagLib.File.Create(url))
                        {
                            if (xxxx.Tag.Pictures.Length >= 1)
                            {
                                try
                                {
                                    byte[] bin = xxxx.Tag.Pictures[0].Data.Data;
                                    xxxx.Dispose();

                                    return new MemoryStream(bin);
                                }
                                catch { }
                            }
                        }
                    }
                    catch { return null; }
                }
            }

            return null;
        }

        /// <summary>
        /// 设置歌曲文件内专辑图片
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static void Set_AlbumImage_Of_This_SongUrl(string url, ImageSource imageSource,string Album_Name)
        {
            try
            {
                if (url.IndexOf(".wav") < 0)
                {
                    if (File.Exists(url))
                    {
                        using (TagLib.File xxxx = TagLib.File.Create(url))
                        {
                            Image image = null;
                            if (imageSource is BitmapSource bitmapSource)
                            {
                                // 创建一个 MemoryStream 以保存 BitmapSource 数据
                                using (MemoryStream memoryStream = new MemoryStream())
                                {
                                    BitmapEncoder encoder = new PngBitmapEncoder(); // 选择适当的编码器
                                    encoder.Frames.Add(BitmapFrame.Create(bitmapSource));
                                    encoder.Save(memoryStream);

                                    // 从 MemoryStream 创建 System.Drawing.Image
                                    ImageConverter imageConverter = new ImageConverter();
                                    image = (Image)imageConverter.ConvertFrom(memoryStream.ToArray());
                                }

                            }
                            byte[] bin = ImageToByteArray(image);
                            //
                            image = null;

                            // define picture
                            TagLib.Id3v2.AttachedPictureFrame pic = new TagLib.Id3v2.AttachedPictureFrame();
                            pic.TextEncoding = TagLib.StringType.Latin1;
                            pic.MimeType = System.Net.Mime.MediaTypeNames.Image.Jpeg;
                            pic.Type = TagLib.PictureType.FrontCover;
                            pic.Data = bin;

                            // save picture to file
                            xxxx.Tag.Pictures = new TagLib.IPicture[1] { pic };
                            xxxx.Tag.Album = Album_Name;
                            xxxx.Save();
                        }
                    }
                }
            }catch (Exception ex)
            {
                MessageBox.Show(ex.Message + "专辑封面嵌入失败：" + url);
            }
        }
        public static byte[] ImageToByteArray(Image image)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                image.Save(ms, System.Drawing.Imaging.ImageFormat.Png); // 根据需要选择图像格式
                return ms.ToArray();
            }
        }

        /// <summary>
        /// 读取歌曲文件内 内嵌歌词（已转化为同步）
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static ArrayList Extract_Lyic_Of_This_SongUrl(string url)
        {
            ArrayList arrayList = null;
            using (TagLib.File xxxx = TagLib.File.Create(url))
            {
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
                    }
                }
            }

            return arrayList;
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


        /// <summary>
        /// 读取歌曲文件内 内嵌歌词（未转化为同步数据）
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static string Get_Lyic_Of_This_SongUrl(string url)
        {
            string lyic_Info = "";
            using (TagLib.File xxxx = TagLib.File.Create(url))
            {
                lyic_Info = xxxx.Tag.Lyrics;
            }
            return lyic_Info;
        }

        /// <summary>
        /// 设置歌曲文件内 内嵌歌词
        /// </summary>
        /// <param name="url"></param>
        /// <param name="lyic_Info"></param>
        /// <returns></returns>
        public static void Set_Lyic_Of_This_SongUrl(string url,string lyic_Info)
        {
            try
            {
                using (TagLib.File xxxx = TagLib.File.Create(url))
                {
                    xxxx.Tag.Lyrics = lyic_Info;
                    xxxx.Save();
                }
            }catch (Exception ex)
            {
                MessageBox.Show(ex.Message+"歌词嵌入失败");
            }
        }
    }
}
