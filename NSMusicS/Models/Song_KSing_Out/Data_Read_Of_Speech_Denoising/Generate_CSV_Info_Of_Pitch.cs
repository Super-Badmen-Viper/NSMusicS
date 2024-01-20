using Microsoft.VisualBasic.FileIO;
using NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls_PlayMode_View.UserControl_PlayMode_4_View_2_Childrens;
using System;
using System.Collections.Generic;
using System.Drawing.Drawing2D;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media.Animation;
using static NSMusicS.Models.Song_KSing_Out.Data_Read_Of_Speech_Denoising.Pitch_Processor;

namespace NSMusicS.Models.Song_KSing_Out.Data_Read_Of_Speech_Denoising
{
    /// <summary>
    /// Set:
    ///    Canvas_KSing_Musical_Scale_Animation_Panel    ：Width , Children
    ///        UserControl_Musical_Scale_bar ：Canvas.Top , Canvas.Left
    ///            Background_Musical_Scale_bar：Width
    ///            Canvas_Musical_Scale_bar    ：Children
    ///                UserControl_Scale_bar_Subassembly_Schedule_Fill ：Width , Canvas.Left
    ///    Canvas_KSing_Pitch_Pointer ：Children
    ///        Border_KSing_Pitch_Pointer：Canvas.Top[0, 200]
    ///        
    ///    1s -> 100
    /// </summary>
    public class Generate_CSV_Info_Of_Pitch
    {
        /// <summary>
        /// 读取音阶信息
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        public static List<CSVData_Of_Pitch> ReadCSVFile(string filePath)
        {
            List<CSVData_Of_Pitch> csvDataList = new List<CSVData_Of_Pitch>();

            using (TextFieldParser parser = new TextFieldParser(filePath))
            {
                parser.TextFieldType = FieldType.Delimited;
                parser.SetDelimiters(",");
                parser.ReadLine();// 跳过标题行
                while (!parser.EndOfData)
                {
                    string[] fields = parser.ReadFields();
                    if (fields != null)
                    {
                        CSVData_Of_Pitch csvData = new CSVData_Of_Pitch
                        {
                            Playback_Time = double.Parse(fields[0]),
                            Pitch = double.Parse(fields[1]) / 4 * 20,//Pitch默认读取时为0~40，需扩大为0~200(CanvasTop为0~200)，方便数据处理
                            Start_Time = double.Parse(fields[2]),
                            Duration = double.Parse(fields[3]),
                            End_Time = double.Parse(fields[4]),
                        };
                        csvDataList.Add(csvData);
                    }
                }
            }

            if (csvDataList != null && csvDataList.Count > 0)
                Constant_Of_Speecch_Denoising.This_Song_Total_Second = csvDataList[csvDataList.Count - 1].Playback_Time;

            return csvDataList;
        }

        /// <summary>
        /// 提取Pitch不为0的部分中的下标范围（提取人声部分）
        /// </summary>
        /// <param name="csvDataList"></param>
        /// <returns></returns>
        public static List<Tuple<int, int>> GetNonZeroPitchRanges(List<CSVData_Of_Pitch> csvDataList)
        {
            List<Tuple<int, int>> nonZeroRanges = new List<Tuple<int, int>>();

            int startIdx = -1;

            for (int i = 0; i < csvDataList.Count; i++)
            {
                if (csvDataList[i].Pitch != 0)
                {
                    // 当找到Pitch不为0的部分的起始位置时，记录起始下标
                    if (startIdx == -1)
                    {
                        startIdx = i;
                    }
                }
                else
                {
                    // 当找到Pitch为0的部分时，记录结束下标，并将起始下标重置为-1
                    if (startIdx != -1)
                    {
                        nonZeroRanges.Add(new Tuple<int, int>(startIdx, i - 1));
                        startIdx = -1;
                    }
                }
            }

            // 处理最后一段Pitch不为0的部分
            if (startIdx != -1)
            {
                nonZeroRanges.Add(new Tuple<int, int>(startIdx, csvDataList.Count - 1));
            }

            return nonZeroRanges;
        }

        /// <summary>
        /// 找到一个数组中与相似值最多的元素
        /// </summary>
        /// <param name="data"></param>
        /// <param name="epsilon">表示两个值之间的差距小于等于 epsilon 就认为它们是相似的</param>
        /// <returns></returns>
        public static double CalculateMode(List<double> data, double epsilon)
        {
            // 如果数据为空，则返回 NaN 或采用其他处理方法
            if (data.Count == 0)
            {
                return double.NaN; // 未定义的值，你可以根据实际情况进行修改
            }

            // 使用 epsilon 进行相似值的判断
            Dictionary<double, int> countDictionary = new Dictionary<double, int>();

            foreach (var value in data)
            {
                double similarValue = countDictionary.Keys.FirstOrDefault(key => Math.Abs(key - value) <= epsilon);

                if (similarValue != 0)
                {
                    // 更新相似值的计数
                    countDictionary[similarValue]++;
                }
                else
                {
                    // 添加新的相似值
                    countDictionary[value] = 1;
                }
            }

            // 找到计数最多的相似值
            double mode = countDictionary.OrderByDescending(kv => kv.Value).First().Key;

            return mode;
        }

        /// <summary>
        /// 生成音阶条数组
        /// </summary>
        /// <returns></returns>
        public static Dictionary<UserControl_Musical_Scale_bar, (double, double)> Get_UserControl_Musical_Scale_bars_For_Canvas_KSing_Musical_Scale()
        {
            Dictionary<UserControl_Musical_Scale_bar, (double, double)> temp = new Dictionary<UserControl_Musical_Scale_bar, (double, double)>();

            //控件高度20，面板高度200，Pitch已扩大为0~200，方便数据处理

            Song_KSing_Pitch_Infos song_KSing_Pitch_Infos = Song_KSing_Pitch_Infos.Retuen_This();
            if (song_KSing_Pitch_Infos.csvDatas_Of_Pitch != null && song_KSing_Pitch_Infos.csvDatas_Of_Pitch.Count > 0)
            {
                if (song_KSing_Pitch_Infos.vocal_Pitch_Ranges != null && song_KSing_Pitch_Infos.vocal_Pitch_Ranges.Count > 0)
                {
                    //读取csvDatas_Of_Pitch中的所有人声部分（不为0的部分）
                    foreach (var item in song_KSing_Pitch_Infos.vocal_Pitch_Ranges)
                    {
                        //筛选数据
                        if (song_KSing_Pitch_Infos.csvDatas_Of_Pitch[item.Item2].Playback_Time -
                            song_KSing_Pitch_Infos.csvDatas_Of_Pitch[item.Item1].Playback_Time > 0.2)
                        {
                            List<CSVData_Of_Pitch> datas = song_KSing_Pitch_Infos.csvDatas_Of_Pitch
                                //.Select(data => data.Pitch)
                                .Skip(item.Item1)
                                .Take(item.Item2 - item.Item1 + 1) // 加1是为了包含结束索引
                                .ToList();
                            // 指定划分的区间
                            double[] intervals = { 0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200 };
                            // 使用 LINQ 查询语句将数据分组
                            var groupedData = datas.GroupBy(d => intervals.FirstOrDefault(i => d.Playback_Time <= i))
                                                 .ToDictionary(g => g.Key, g => g.ToList());
                            // 遍历分组数据，实现更精准的音阶分布
                            foreach (var kvp in groupedData)
                            {
                                List<double> data_playback_Time = kvp.Value
                                        .Select(data_playback_Time => data_playback_Time.Playback_Time)
                                        .ToList();

                                double index_0 = data_playback_Time[0];
                                double index_1 = data_playback_Time[data_playback_Time.Count - 1];

                                List<double> data_pitch = kvp.Value
                                    .Select(data_pitch => data_pitch.Pitch)
                                    .ToList();

                                double canvas_left = index_0 * 100;

                                //double canvas_top = CalculateMode(data_pitch, 0.5);

                                /*double sum = 0;
                                for (int i = 0; i < data_pitch.Count; i++)
                                    sum += data_pitch[i];
                                double canvas_top = sum / data_pitch.Count;*/

                                PitchRepresentation pitchRepresentation = Pitch_Processor.CalculatePitchRepresentation(kvp.Value);
                                double canvas_top = pitchRepresentation.CombinedRepresentation - 80;

                                UserControl_Musical_Scale_bar scale_Bar = new UserControl_Musical_Scale_bar();
                                scale_Bar.Width = (index_1 - index_0) * 100;

                                temp.Add(scale_Bar, (canvas_left, canvas_top));
                            }

                        }
                    }
                }
            }
            return temp;
        }
    }
}
