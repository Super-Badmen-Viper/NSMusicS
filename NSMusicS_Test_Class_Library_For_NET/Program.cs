using System;
using System.Collections.Generic;
using Microsoft.VisualBasic.FileIO;

namespace NSMusicS_Test_Class_Library_For_NET
{
    class Program
    {
        static void Main()
        {
            string csvFilePath = "pitch_duration_info.csv";  // 替换为实际的CSV文件路径

            List<CSVData> csvDataList = ReadCSVFile(csvFilePath);
        }

        static List<CSVData> ReadCSVFile(string filePath)
        {
            List<CSVData> csvDataList = new List<CSVData>();

            using (TextFieldParser parser = new TextFieldParser(filePath))
            {
                parser.TextFieldType = FieldType.Delimited;
                parser.SetDelimiters(",");

                // 跳过标题行
                parser.ReadLine();

                while (!parser.EndOfData)
                {
                    string[] fields = parser.ReadFields();

                    if (fields != null)
                    {
                        // 在此处创建CSVData对象并添加到List中
                        CSVData csvData = new CSVData
                        {
                            Playback_Time = double.Parse(fields[0]),
                            Pitch = double.Parse(fields[1]),
                            Start_Time = double.Parse(fields[2]),
                            Duration = double.Parse(fields[3]),
                            End_Time = double.Parse(fields[4]),
                        };

                        csvDataList.Add(csvData);
                    }
                }
            }

            return csvDataList;
        }
    }

    class CSVData
    {
        public double Playback_Time { get; set; }
        public double Pitch { get; set; }
        public double Start_Time { get; set; }
        public double Duration { get; set; }
        public double End_Time { get; set; }
    }
}
