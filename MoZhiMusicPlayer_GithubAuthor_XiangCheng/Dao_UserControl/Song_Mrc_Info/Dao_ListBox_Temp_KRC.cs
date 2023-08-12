using GLib;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using static System.Net.Mime.MediaTypeNames;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.Song_Mrc_Info
{
    class Dao_ListBox_Temp_MRC
    {
        public StreamReader Song_Lrc_StreamReader;//将当前的歌词文件转化临时文件流
        public String A_String_Read;//传递临时生成的歌词时间

        public List<MRC_Line_Info> mrc_Line_Info;
        public List<string> mrc_A_line_Text;
        public List<double> mrc_A_line_Time;
        public static string Song_MRC_Path;//歌词文件所在的路径
        public double Start_Song_MRC_Time;
        public double End_Song_MRC_Time;
        //歌词信息类
        public ArrayList arrayList_MRC_line = new ArrayList();


        /// <summary>
        /// LRC_Text决定歌词列表空白行数
        /// </summary>
        public int LRC_Text_Null_Nums = 7;

        /// <summary>
        /// 使用歌词字同步
        /// </summary>
        #region 歌词字同步
        /// <summary>
        /// 获取初始MRC行数据
        /// </summary>
        /// <param name="SongLrcPath">歌词文件的文件路径</param>
        public void Take_TreeMRCInfo(string SongLrcPath)
        {
            try
            {
                Song_Lrc_StreamReader = new StreamReader(SongLrcPath, Encoding.UTF8);//完成后继续自动清理缓存

                if (Song_Lrc_StreamReader.EndOfStream == false)//指示当前流位置是否在结尾
                {
                    while ((A_String_Read = Song_Lrc_StreamReader.ReadLine()) != null)
                    {
                        if (!string.IsNullOrWhiteSpace(A_String_Read) && isPureNum(A_String_Read.Substring(1, 1)))
                        {
                            int nums_temp_1 = A_String_Read.IndexOf("]");
                            if (A_String_Read.Length > nums_temp_1)
                            {
                                arrayList_MRC_line.Add(A_String_Read);
                            }
                        }
                    }
                }
            }
            catch
            {

            }
            Console.WriteLine();

            if (arrayList_MRC_line.Count > 0)
                if (arrayList_MRC_line[0].ToString().IndexOf("<") > -1)
                {
                    Init_MRC_Info();
                }
                else
                {
                    Init_Lrc_Info();
                }
        }
        public bool isPureNum(string str)
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

        public void Init_Lrc_Info()
        {
            mrc_Line_Info = new List<MRC_Line_Info>();
            for (int i = 0; i < arrayList_MRC_line.Count; i++)
            {
                MRC_Line_Info temp = new MRC_Line_Info();
                mrc_Line_Info.Add(temp);
            }

            mrc_A_line_Text = new List<string>();
            mrc_A_line_Time = new List<double>();

            string temp_head_start = "";
            string temp_head_duration = "";
            string temp_text = "";

            //初始化歌词行动画时间
            for (int i = 0; i < arrayList_MRC_line.Count; i++)
            {
                temp_head_start = arrayList_MRC_line[i].ToString();
                temp_head_duration = temp_head_start;
                temp_text = temp_head_start;

                Match match = Regex.Match(temp_head_start, @"\[(\d{2}):(\d{2})\.(\d{3})\]");
                if (match.Success)
                {
                    int minutes = int.Parse(match.Groups[1].Value);
                    int seconds = int.Parse(match.Groups[2].Value);
                    int milliseconds = int.Parse(match.Groups[3].Value);

                    int totalMilliseconds = (minutes * 60 + seconds) * 1000 + milliseconds;

                    mrc_Line_Info[i].This_MRC_Line = i + 1;
                    mrc_Line_Info[i].This_MRC_Start_Time = totalMilliseconds;
                    mrc_Line_Info[i].This_MRC_Duration = 0;
                }

                mrc_Line_Info[i].String_Lrc_Line = temp_head_start.Substring(temp_head_start.IndexOf("]") + 1);
            }

            //This_MRC_Start_Time为0时定时器无法捕捉
            for (int i = 0; i < mrc_Line_Info.Count; i++)
            {
                if (mrc_Line_Info[i].This_MRC_Start_Time == 0)
                {
                    mrc_Line_Info[i].This_MRC_Start_Time = 222;
                }
            }

            //设置其他的算法属性
            //mrc_A_line_Text,mrc_A_line_Time,Start_Song_MRC_Time,mrc_A_line_Time
            for (int i = 0; i < mrc_Line_Info.Count; i++)
            {
                mrc_A_line_Text.Add(mrc_Line_Info[i].String_Lrc_Line);
                mrc_A_line_Time.Add(mrc_Line_Info[i].This_MRC_Start_Time);
            }
            Start_Song_MRC_Time = mrc_A_line_Time[0];
            End_Song_MRC_Time = -1;//表示这是lrc

            //将数组前后各扩容7个空位，更好的匹配UI显示歌词
            List<string> temp_string = new List<string>();
            for (int i = 0; i < mrc_A_line_Text.Count + 14; i++)
            {
                if (i < 7)
                {
                    temp_string.Add("       ");
                }
                else if (i < mrc_A_line_Text.Count + 7)
                {
                    temp_string.Add(mrc_A_line_Text[i - 7]);
                }
                else if (i < mrc_A_line_Text.Count + 14)
                {
                    temp_string.Add("       ");
                }
            }
            mrc_A_line_Text = temp_string;

            List<double> temp_double = new List<double>();
            for (int i = 0; i < mrc_A_line_Time.Count + 14; i++)
            {
                if (i < 7)
                {
                    temp_double.Add(0);
                }
                else if (i < mrc_A_line_Time.Count + 7)
                {
                    temp_double.Add(mrc_A_line_Time[i - 7]);
                }
                else if (i < mrc_A_line_Time.Count + 14)
                {
                    temp_double.Add(0);
                }
            }
            mrc_A_line_Time = temp_double;
        }


        /// <summary>
        /// 初始化歌词行字节信息
        /// </summary>
        public void Init_MRC_Info()
        {
            mrc_Line_Info = new List<MRC_Line_Info>();
            for (int i = 0; i < arrayList_MRC_line.Count; i++)
            {
                MRC_Line_Info temp = new MRC_Line_Info();
                mrc_Line_Info.Add(temp);
            }

            mrc_A_line_Text = new List<string>();
            mrc_A_line_Time = new List<double>();

            string temp_head_start = "";
            string temp_head_duration = "";
            string temp_text = "";

            //初始化歌词行动画时间
            for (int i = 0; i < arrayList_MRC_line.Count; i++)
            {
                temp_head_start = arrayList_MRC_line[i].ToString();
                temp_head_duration = temp_head_start;
                temp_text = temp_head_start;

                mrc_Line_Info[i].This_MRC_Line = i + 1;
                mrc_Line_Info[i].This_MRC_Start_Time = Convert.ToInt32(temp_head_start.Substring(temp_head_start.IndexOf("[") + 1, temp_head_start.IndexOf(",") - temp_head_start.IndexOf("[") - 1));
                mrc_Line_Info[i].This_MRC_Duration = Convert.ToInt32(temp_head_duration.Substring(temp_head_duration.IndexOf(",") + 1, temp_head_duration.IndexOf("]") - temp_head_duration.IndexOf(",") - 1));

                //<0,204,0>林<204,204,0>俊<408,203,0>杰 <611,203,0>- <814,203,0>Always <1017,254,0>Online
                temp_text = temp_text.Substring(temp_text.IndexOf("]") + 1);
                if (temp_text.IndexOf("<") > -1)
                {
                    while (true)
                    {
                        //添加歌词行单个字符动画开始时间
                        if (temp_text.IndexOf(",") > temp_text.IndexOf("<"))
                            mrc_Line_Info[i].Array_Morebyte_BeginTime.Add(temp_text.Substring(temp_text.IndexOf("<") + 1, temp_text.IndexOf(",") - temp_text.IndexOf("<") - 1));
                        else
                            mrc_Line_Info[i].Array_Morebyte_BeginTime.Add(temp_text.Substring(temp_text.IndexOf("<") + 1, temp_text.IndexOf(",") - temp_text.IndexOf("<") - 1));

                        //添加歌词行单个字符动画持续时间
                        //204,0>林<204,204,0>俊<408,203,0>杰 <611,203,0>- <814,203,0>Always <1017,254,0>Online
                        temp_text = temp_text.Substring(temp_text.IndexOf(",") + 1);
                        mrc_Line_Info[i].Array_Morebyte_Duration.Add(temp_text.Substring(0, temp_text.IndexOf(",")));

                        //添加歌词字节
                        //林<204,204,0>俊<408,203,0>杰 <611,203,0>- <814,203,0>Always <1017,254,0>Online
                        temp_text = temp_text.Substring(temp_text.IndexOf(">") + 1);
                        if (temp_text.IndexOf("<") > 0)
                            mrc_Line_Info[i].Array_Morebyte_Text.Add(temp_text.Substring(0, temp_text.IndexOf("<")));
                        else
                            mrc_Line_Info[i].Array_Morebyte_Text.Add(temp_text);

                        //计算歌词字节数量
                        mrc_Line_Info[i].Int_MoreByte_Nums++;

                        //验证是否还存在字符
                        if (temp_text.IndexOf("<") > 0)
                            temp_text = temp_text.Substring(temp_text.IndexOf("<"));//去除已添加的歌词字节
                        else
                            break;
                    }
                }
            }

            int nums_This_MRC_Duration = 0;
            for (int i = 0; i < mrc_Line_Info[mrc_Line_Info.Count - 1].Int_MoreByte_Nums; i++)
            {
                nums_This_MRC_Duration += Convert.ToInt32(mrc_Line_Info[mrc_Line_Info.Count - 1].Array_Morebyte_Duration[i]);
            }
            mrc_Line_Info[mrc_Line_Info.Count - 1].This_MRC_Duration = nums_This_MRC_Duration;
            //未指定目标

            //This_MRC_Start_Time为0时定时器无法捕捉
            for (int i = 0; i < mrc_Line_Info.Count; i++)
            {
                if (mrc_Line_Info[i].This_MRC_Start_Time == 0)
                {
                    mrc_Line_Info[i].This_MRC_Start_Time = 222;
                }
            }

            //Duration重新设置为mrc_Line_Info[i].This_MRC_Duration
            for (int i = 0; i < mrc_Line_Info.Count; i++)
            {
                int Duration_Line = 
                    Convert.ToInt32(mrc_Line_Info[i].Array_Morebyte_BeginTime[
                        mrc_Line_Info[i].Array_Morebyte_BeginTime.Count - 1])
                    + Convert.ToInt32(mrc_Line_Info[i].Array_Morebyte_Duration[
                        mrc_Line_Info[i].Array_Morebyte_Duration.Count - 1]);
                mrc_Line_Info[i].This_MRC_Duration = Duration_Line;
            }

            //设置其他的算法属性
            //mrc_A_line_Text,mrc_A_line_Time,Start_Song_MRC_Time,mrc_A_line_Time
            for (int i = 0; i < mrc_Line_Info.Count; i++)
            {
                string temp = "";
                for (int j = 0; j < mrc_Line_Info[i].Array_Morebyte_Text.Count; j++)
                {
                    temp += mrc_Line_Info[i].Array_Morebyte_Text[j];
                }
                mrc_A_line_Text.Add(temp);
                mrc_A_line_Time.Add(mrc_Line_Info[i].This_MRC_Start_Time);
            }
            Start_Song_MRC_Time = mrc_A_line_Time[0];
            End_Song_MRC_Time = mrc_Line_Info[mrc_Line_Info.Count - 1].This_MRC_Start_Time;

            //将数组前后各扩容7个空位，更好的匹配UI显示歌词
            List<string> temp_string = new List<string>();
            for (int i = 0; i < mrc_A_line_Text.Count + 14; i++)
            {
                if(i < 7)
                {
                    temp_string.Add("       ");
                }
                else if(i < mrc_A_line_Text.Count + 7)
                {
                    temp_string.Add(mrc_A_line_Text[i - 7]);
                }
                else if (i < mrc_A_line_Text.Count + 14)
                {
                    temp_string.Add("       ");
                }
            }
            mrc_A_line_Text = temp_string;

            List<double> temp_double = new List<double>();
            for (int i = 0; i < mrc_A_line_Time.Count + 14; i++)
            {
                if (i < 7)
                {
                    temp_double.Add(0);
                }
                else if (i < mrc_A_line_Time.Count + 7)
                {
                    temp_double.Add(mrc_A_line_Time[i - 7]);
                }
                else if (i < mrc_A_line_Time.Count + 14)
                {
                    temp_double.Add(0);
                }
            }
            mrc_A_line_Time = temp_double;

        }

        #endregion


        /// <summary>
        /// 获取歌词信息方法集合
        /// </summary>
        #region 获取歌词信息方法集合
        /// <summary>
        /// 为语言添加翻译
        /// </summary>
        public ArrayList Add_Chinese_To_Kera(string CRC_URL)
        {
            ArrayList arrayList = new ArrayList();

            arrayList = Take_TreeCRCInfo(CRC_URL, arrayList);

            return arrayList;
        }
        /// <summary>
        /// 获取初始MRC行数据
        /// </summary>
        /// <param name="SongLrcPath">歌词文件的文件路径</param>
        public ArrayList Take_TreeCRCInfo(string SongLrcPath, ArrayList arrayList)
        {
            try
            {
                if (File.Exists(SongLrcPath) == true)
                {
                    Song_Lrc_StreamReader = new StreamReader(SongLrcPath, Encoding.UTF8);//完成后继续自动清理缓存

                    if (Song_Lrc_StreamReader.EndOfStream == false)//指示当前流位置是否在结尾
                    {
                        A_String_Read = "";
                        while ((A_String_Read = Song_Lrc_StreamReader.ReadLine()) != null)
                        {
                            arrayList.Add(A_String_Read.Trim() + "\n");
                        }
                    }
                }
            }
            catch { }

            return arrayList;
        }

        List<Dao_ListBox_Temp_MRC_Bing> dao_ListBox_Temp_MRC_Bing;
        /// <summary>
        /// 过滤韩文以及添加翻译
        /// </summary>
        /// <returns>数据绑定,返回ListBox所包含的歌词文本</returns>
        public List<Dao_ListBox_Temp_MRC_Bing> Return_ListBox_Temp_MRC_Bing(string CRC_URL)
        {
            dao_ListBox_Temp_MRC_Bing = new List<Dao_ListBox_Temp_MRC_Bing>();

            List<Dao_ListBox_Temp_MRC_Bing> Temp_MRC_Bing = new List<Dao_ListBox_Temp_MRC_Bing>();
            if (mrc_A_line_Text != null)
            {
                //去除歌词行中的空格，防止歌词动画分段显示
                //Trim()，去除字符串前后的指定字符
                //Replace()，
                for (int i = 0; i < mrc_A_line_Text.Count; i++)
                {
                    if (mrc_A_line_Text[i] != null)
                    {
                        //检测到韩文，需要去除空格，不然TextBlock动画会分段显示
                        if (System.Text.RegularExpressions.Regex.IsMatch(
                            mrc_A_line_Text[i].Replace(" ", "").ToString(), @"^[\uac00-\ud7ff]+$"))
                        {
                            //韩文
                            mrc_A_line_Text[i] = mrc_A_line_Text[i].Replace(" ", "");
                        }
                    }
                }

                for (int i = 0; i < mrc_A_line_Text.Count; i++)
                {
                    if (mrc_A_line_Text[i] != null)
                    {
                        Dao_ListBox_Temp_MRC_Bing temp = new Dao_ListBox_Temp_MRC_Bing();
                        temp.Song_MRC_Line = mrc_A_line_Text[i];
                        Temp_MRC_Bing.Add(temp);
                    }
                }

                //获取CRC
                if (CRC_URL != null)
                {
                    ArrayList arrayList = Add_Chinese_To_Kera(CRC_URL);
                    //添加歌词翻译
                    for (int i = Temp_MRC_Bing.Count - 1 - 7; i >= 0; i--)
                    {
                        if (arrayList.Count == 0)
                            break;
                        if (Temp_MRC_Bing[i] != null)
                        {
                            Dao_ListBox_Temp_MRC_Bing temp = new Dao_ListBox_Temp_MRC_Bing();
                            temp = Temp_MRC_Bing[i];

                            string singer_Mrc_To_Substring = arrayList[arrayList.Count - 1].ToString();

                            temp.Song_CRC_Line += (singer_Mrc_To_Substring);
                            arrayList.RemoveAt(arrayList.Count - 1);

                            Temp_MRC_Bing[i] = temp;
                        }
                    }
                }
            }


            return Temp_MRC_Bing;
        }


        /// <summary>
        /// 返回ListBox所包含的歌词内容
        /// </summary>
        /// <returns>返回ListBox所包含的歌词内容</returns>
        public List<string> Return_ListBox_Temp_MRC_Text()
        {
            

            return mrc_A_line_Text;
        }
        /// <summary>
        /// 返回ListBox所包含的歌词时间
        /// </summary>
        /// <returns>返回ListBox所包含的歌词时间</returns>
        public List<double> Return_ListBox_Temp_MRC_Time()
        {
            

            return mrc_A_line_Time;
        }
        /// <summary>
        /// 生成这首歌词第一句歌词开始的时间
        /// </summary>
        /// <returns></returns>
        public double Return_Start_Song_MRC_Time()
        {
            

            return Start_Song_MRC_Time;
        }
        /// <summary>
        /// 生成这首歌词最后一句歌词开始的时间
        /// </summary>
        /// <returns></returns>
        public double Return_End_Song_MRC_Time()
        {
            

            return End_Song_MRC_Time;
        }

        #endregion


    }
}
