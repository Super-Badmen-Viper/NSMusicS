using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.WAVReader
{
    public class WAVReader //wav 文件读取类
    {
        private string Id; //文件标识
        private double Size;  //文件大小
        private string Type; //文件类型
        private string formatId;
        private double formatSize;      //数值为16或18，18则最后又附加信息
        private int formatTag;
        private int num_Channels;       //声道数目
        private int SamplesPerSec;      //采样率
        private int AvgBytesPerSec;     //每秒所需字节数 
        private int BlockAlign;         //数据块对齐单位(每个采样需要的字节数) 
        private int BitsPerSample;      //每个采样需要的bit数
        private string additionalInfo;  //附加信息
        private string dataId;
        private int dataSize;
        public List<double> wavdata = new List<double>();
        public void ReadWAVFile(string filePath)  //读取波形文件并显示
        {
            if (filePath == "") return;
            byte[] id = new byte[4];
            byte[] size = new byte[4];
            byte[] type = new byte[4];
            byte[] formatid = new byte[4];
            byte[] formatsize = new byte[4];
            byte[] formattag = new byte[2];
            byte[] numchannels = new byte[2];
            byte[] samplespersec = new byte[4];
            byte[] avgbytespersec = new byte[4];
            byte[] blockalign = new byte[2];
            byte[] bitspersample = new byte[2];
            byte[] additionalinfo = new byte[2];    //可选
            byte[] factid = new byte[4];
            byte[] factsize = new byte[4];
            byte[] factdata = new byte[4];
            byte[] dataid = new byte[4];
            byte[] datasize = new byte[4];
            using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read))
            {
                using (BinaryReader br = new BinaryReader(fs, Encoding.UTF8))
                {
                    #region  RIFF WAVE Chunk
                    br.Read(id, 0, 4);
                    br.Read(size, 0, 4);
                    br.Read(type, 0, 4);
                    Id = getString(id, 4);
                    long longsize = bytArray2Int(size);//十六进制转为十进制
                    Size = longsize * 1.0;
                    Type = getString(type, 4);
                    #endregion
                    #region Format Chunk
                    br.Read(formatid, 0, 4);
                    br.Read(formatsize, 0, 4);
                    br.Read(formattag, 0, 2);
                    br.Read(numchannels, 0, 2);
                    br.Read(samplespersec, 0, 4);
                    br.Read(avgbytespersec, 0, 4);
                    br.Read(blockalign, 0, 2);
                    br.Read(bitspersample, 0, 2);
                    if (getString(formatsize, 2) == "18")
                    {
                        br.Read(additionalinfo, 0, 2);
                        additionalInfo = getString(additionalinfo, 2);  //附加信息
                    }
                    formatId = getString(formatid, 4);
                    formatSize = bytArray2Int(formatsize);
                    byte[] tmptag = composeByteArray(formattag);
                    formatTag = bytArray2Int(tmptag);
                    byte[] tmpchanels = composeByteArray(numchannels);
                    num_Channels = bytArray2Int(tmpchanels);                //声道数目
                    SamplesPerSec = bytArray2Int(samplespersec);            //采样率
                    AvgBytesPerSec = bytArray2Int(avgbytespersec);          //每秒所需字节数   
                    byte[] tmpblockalign = composeByteArray(blockalign);
                    BlockAlign = bytArray2Int(tmpblockalign);              //数据块对齐单位(每个采样需要的字节数)
                    byte[] tmpbitspersample = composeByteArray(bitspersample);
                    BitsPerSample = bytArray2Int(tmpbitspersample);        // 每个采样需要的bit数     
                    #endregion
                    #region Data Chunk
                    byte[] d_flag = new byte[1];
                    while (true)
                    {
                        br.Read(d_flag, 0, 1);
                        if (getString(d_flag, 1) == "d")
                        {
                            break;
                        }
                    }
                    byte[] dt_id = new byte[4];
                    dt_id[0] = d_flag[0];
                    br.Read(dt_id, 1, 3);
                    dataId = getString(dt_id, 4);
                    br.Read(datasize, 0, 4);
                    dataSize = bytArray2Int(datasize);
                    List<string> testl = new List<string>();
                    if (BitsPerSample == 8)
                    {
                        for (int i = 0; i < dataSize; i++)
                        {
                            byte wavdt = br.ReadByte();
                            wavdata.Add(wavdt);
                        }
                    }
                    else if (BitsPerSample == 16)
                    {
                        for (int i = 0; i < dataSize / 2; i++)
                        {
                            short wavdt = br.ReadInt16();
                            wavdata.Add(wavdt);
                        }
                    }
                    #endregion
                }
            } //wavdata
        }
        // 数字节数组转换为int
        private int bytArray2Int(byte[] bytArray)
        {
            return bytArray[0] | (bytArray[1] << 8) | (bytArray[2] << 16) | (bytArray[3] << 24);
        }
        // 将字节数组转换为字符串
        private string getString(byte[] bts, int len)
        {
            char[] tmp = new char[len];
            for (int i = 0; i < len; i++)
            {
                tmp[i] = (char)bts[i];
            }
            return new string(tmp);
        }
        // 组成4个元素的字节数组
        private byte[] composeByteArray(byte[] bt)
        {
            byte[] tmptag = new byte[4] { 0, 0, 0, 0 };
            tmptag[0] = bt[0];
            tmptag[1] = bt[1];
            return tmptag;
        }
    }

    /*private void button5_Click(object sender, EventArgs e)//画wav波形图
    {
        WAVReader wr = new WAVReader();
        string path = @"E:\work\camer\GDI\GDI\bin\Debug\20171013T035701.wav";
        wr.ReadWAVFile(path);
        int ww = pictureBox1.Width;
        int hh = pictureBox1.Height;
        Graphics g = pictureBox1.CreateGraphics();
        g.SmoothingMode = SmoothingMode.AntiAlias;
        g.DrawLine(new Pen(Color.DarkSeaGreen, 1), new Point(0, hh / 2), new Point(ww, hh / 2));
        int prex = 0, prey = 0; //上一个坐标  
        int x = 0, y = 0;
        double k = hh / 2.0 / 32768.0;
        for (int i = 0; i < ww; i++)
        {
            x = i;
            y = hh - (int)(wr.wavdata[i * 3] * k + hh / 2);
            if (i != 0)
            {
                g.DrawLine(new Pen(Color.Red, 1), x, y, prex, prey);
            }
            prex = x;
            prey = y;
        }

    }*/
}
