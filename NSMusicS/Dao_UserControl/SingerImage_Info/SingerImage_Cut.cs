using System;
using System.Collections.Generic;
using System.Windows.Media.Imaging;
using System.Windows.Media;
using System.Windows;
using System.Drawing;
using System.IO;
using Image = System.Drawing.Image;
using System.Runtime.InteropServices;
using System.Collections.ObjectModel;
using System.Threading.Tasks;

namespace NSMusicS.Dao_UserControl.SingerImage_Info
{
    public class SingerImage_Cut
    {
        private static SingerImage_Cut singerImage_Cut;
        public static SingerImage_Cut Retuen_This()
        {
            singerImage_Cut = Return_This_SingerImage_Cut();
            return singerImage_Cut;
        }
        private static SingerImage_Cut Return_This_SingerImage_Cut()
        {
            if (singerImage_Cut == null)
                singerImage_Cut = new SingerImage_Cut();

            return singerImage_Cut;
        }

        ObservableCollection<ImageBrush> imageBrushs = new ObservableCollection<ImageBrush>();
        public int numCutCells = 4;
        public int numCutRows = 4;

        /// <summary>
        /// 1920*1080 按16:9倍率切分 -> 120*120,切分为144份，分布为16*9
        /// </summary>
        /// <param name="imgPhoto"></param>
        /// <param name="rows"></param>
        /// <param name="cols"></param>
        /// <returns></returns>
        public async Task<ObservableCollection<ImageBrush>> CutImage_ImageBrush(string tbImagePath)
        {
            var tcs = new TaskCompletionSource<ObservableCollection<ImageBrush>>();

            await Task.Run(() =>
            {
                imageBrushs = new ObservableCollection<ImageBrush>();
                btCut(tbImagePath);

                tcs.SetResult(imageBrushs); // 设置结果到 TaskCompletionSource
            });

            return await tcs.Task;
        }


        //开始图片切割
        private void btCut(string tbImagePath)
        {
            FileInfo fileImg = new FileInfo(tbImagePath);
            try
            {
                using (Bitmap b = new Bitmap(fileImg.FullName))
                {
                    ObservableCollection<Rectangle> lstRect = CreateAvgCutRectangle(b.Width, b.Height, (int)numCutRows, (int)numCutCells);
                    for (int i = 0; i < lstRect.Count; i++)
                    {
                        CutImage(tbImagePath, lstRect[i].X, lstRect[i].Y, lstRect[i].Width, lstRect[i].Height,
                            string.Format("{0}_{1}.bmp", fileImg.Name.Remove(fileImg.Name.LastIndexOf(".")),
                                NumToNostring(i)));
                    }
                    lstRect = null;
                } 
            }
            catch (Exception ex)
            {
                System.Windows.MessageBox.Show(ex+"此图像数据：ERROE\n"+ fileImg.FullName);
            }
            fileImg = null;
        }

        /// <summary>
        /// 把原始图片按照指定的分块切割并保存到目标路径中
        /// </summary>
        /// <param name="srcImagePath">原始图片即要切割的图片的路径</param>
        /// <param name="srcX">切割左上角点X坐标</param>
        /// <param name="srcY">切割左上角点Y坐标</param>
        /// <param name="srcWidth">切割宽度</param>
        /// <param name="srcHeight">切割高度</param>
        /// <param name="dstImagePath">要保存到的目标路径</param>
        private void CutImage(string srcImagePath, int srcX, int srcY, int srcWidth, int srcHeight, string dstImagePath)
        {      
            int dstWidth = srcWidth, dstHeight = srcHeight;
            using (Bitmap bitmap = new Bitmap(dstWidth, dstHeight))
            {
                using (Graphics g = Graphics.FromImage(bitmap))
                {
                    using (Image img = Image.FromFile(srcImagePath))
                    {
                        g.DrawImage(img, new Rectangle(0, 0, dstWidth, dstHeight),
                            new Rectangle(srcX, srcY, srcWidth, srcHeight), GraphicsUnit.Pixel);
                        //g.Save();
                        //bitmap.Save(Path.Combine(SavePath, dstImagePath));

                        //在WPF中，Image控件不支持Bitmap类型，但支持ImageSource类型，因此需要进行类型转换
                        Application.Current.Dispatcher.Invoke(() =>
                        {
                            ImageSource imageSource = BitmapSourceConvert.ToBitmapSource(bitmap);
                            imageBrushs.Add(new ImageBrush(imageSource));
                        });
                    }
                }
            }
        }

        public static class BitmapSourceConvert
        {
            /// <summary>
            /// Delete a GDI object
            /// </summary>
            /// <param name="o">The poniter to the GDI object to be deleted</param>
            /// <returns></returns>
            [DllImport("gdi32")]
            private static extern int DeleteObject(IntPtr o);
            /// <summary>
            /// Convert an Bitmap to a WPF BitmapSource. The result can be used in the Set Property of Image.Source
            /// </summary>
            /// <param name="image">Bitmap</param>
            /// <returns>The equivalent BitmapSource</returns>
            public static BitmapSource ToBitmapSource(System.Drawing.Bitmap image)
            {
                IntPtr ptr = image.GetHbitmap();//obtain the Hbitmap
                BitmapSource bs = System.Windows.Interop.Imaging.CreateBitmapSourceFromHBitmap
                (
                    ptr,
                    IntPtr.Zero,
                    Int32Rect.Empty,
                    System.Windows.Media.Imaging.BitmapSizeOptions.FromEmptyOptions()
                );
                DeleteObject(ptr);//release the HBitmap

                return bs;
            }
        }

        /// <summary>
        /// 根据原始图像大小和要切割的数量创建切割分块合集
        /// </summary>
        /// <param name="imgWidth">要切割的图片的宽度</param>
        /// <param name="imgHeight">要切割的图片的高度</param>
        /// <param name="cutRowsNum">要切割的行数</param>
        /// <param name="cutCellsNum">要切割的列数</param>
        /// <returns></returns>
        private ObservableCollection<Rectangle> CreateAvgCutRectangle(int imgWidth, int imgHeight, int cutRowsNum, int cutCellsNum)
        {
            ObservableCollection<Rectangle> lstRect = new ObservableCollection<Rectangle>();
            int avgWidth = imgWidth / cutCellsNum;//每块的平均宽度
            int avgHeight = imgHeight / cutRowsNum;//每块的平均高度
            int offsetX = 0, offsetY = 0;
            int cutHeight = avgHeight;
            int cutWidth = avgWidth;
            while (true)
            {
                //列分块
                if (imgHeight - offsetY < avgHeight * 2)
                    cutHeight = imgHeight - offsetY;

                offsetX = 0;
                cutWidth = avgWidth;
                while (true)
                {
                    //行分块
                    if (imgWidth - offsetX < avgWidth * 2)
                        cutWidth = imgWidth - offsetX;
                    lstRect.Add(new Rectangle(offsetX, offsetY, cutWidth, cutHeight));
                    offsetX += cutWidth;
                    if (offsetX >= imgWidth) break;
                }
                offsetY += cutHeight;
                if (offsetY >= imgHeight) break;
            }

            return lstRect;
        }

        /// <summary>
        /// 把数值转换成等长字符串，前加0
        /// </summary>
        /// <param name="num"></param>
        /// <returns></returns>
        private string NumToNostring(int num)
        {
            string zero = string.Empty;
            if (num < 10) zero = "00";
            else if (num < 100) zero = "0";
            else zero = "";
            return zero + num.ToString();
        }
    }
}
