using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Models.Song_KSing_Out.Data_Read_Of_Speech_Denoising
{
    public class Pitch_Processor
    {
        public class WeightedPitchData
        {
            public double Pitch { get; set; }
            public double Weight { get; set; }
        }

        public class PitchRepresentation
        {
            public double WeightedAverage { get; set; }//加权平均值
            public double PitchRange { get; set; }//音高范围

            public double CombinedRepresentation // 综合的音高代表值
            {
                get { return WeightedAverage + PitchRange; }
            }
        }
        public static PitchRepresentation CalculatePitchRepresentation(List<CSVData_Of_Pitch> pitchData)
        {
            double weightedAverage = CalculateWeightedAverage(pitchData);
            double pitchRange = CalculatePitchRange(pitchData);

            return new PitchRepresentation
            {
                WeightedAverage = weightedAverage,
                PitchRange = pitchRange
            };
        }

        public static double CalculateWeightedAverage(List<CSVData_Of_Pitch> pitchData)
        {
            // Calculate weights based on duration
            List<WeightedPitchData> weightedData = CalculateWeights(pitchData);

            // Calculate weighted average
            double sumWeightedPitch = weightedData.Sum(item => item.Pitch * item.Weight);
            double sumWeights = weightedData.Sum(item => item.Weight);

            if (sumWeights > 0)
                return sumWeightedPitch / sumWeights;
            else
                return 0.0;  // Return 0 if no valid weights
        }

        public static double CalculatePitchRange(List<CSVData_Of_Pitch> pitchData)
        {
            if (pitchData.Count == 0)
                return 0.0;

            double maxPitch = pitchData.Max(item => item.Pitch);
            double minPitch = pitchData.Min(item => item.Pitch);

            return maxPitch - minPitch;
        }

        private static List<WeightedPitchData> CalculateWeights(List<CSVData_Of_Pitch> pitchData)
        {
            List<WeightedPitchData> weightedData = new List<WeightedPitchData>();

            for (int i = 0; i < pitchData.Count - 1; i++)
            {
                double duration = pitchData[i + 1].Playback_Time - pitchData[i].Playback_Time;
                double weight = duration;

                weightedData.Add(new WeightedPitchData
                {
                    Pitch = pitchData[i].Pitch,
                    Weight = weight
                });
            }

            return weightedData;
        }
    }
}
