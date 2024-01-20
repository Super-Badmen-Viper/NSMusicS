using NAudio.Wave;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows.Forms;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls.VIewModules_AudioVisualizers;
using NAudio.CoreAudioApi;
using NAudio.Dsp;
using NAudio.Wave;
using NAudio.Wave.SampleProviders;


namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls
{
    /// <summary>
    /// 部分代码来源：comSlimeNullAudioTest.git  
    /// </summary>
    public class AudioSpectrogram
    {
        public AudioSpectrogram() {

            InitializeCapture();
        }
        private static AudioSpectrogram audioSpectrogram;
        public static AudioSpectrogram Retuen_This()
        {
            audioSpectrogram = Return_This_listView_Item_Bing_ALL();
            return audioSpectrogram;
        }
        public static AudioSpectrogram Return_This_listView_Item_Bing_ALL()
        {
            if (audioSpectrogram == null)
            {
                audioSpectrogram = new AudioSpectrogram();
            }
            return audioSpectrogram;
        }

        public List<float> animation_points = new List<float>();
        public ViewModule viewModule = new ViewModule();
        [DllImport("Kernel32.dll", EntryPoint = "GetConsoleWindow", CharSet = CharSet.Auto)]
        static extern IntPtr GetWindowConsole();
        private void InitializeCapture()
        {
            capture?.Dispose();

            capture = new WasapiLoopbackCapture();
            capture.DataAvailable += SaveSamples;
            capture.DataAvailable += WriteFrame;

            bitsPerSample = capture.WaveFormat.BitsPerSample;
            sampleRate = capture.WaveFormat.SampleRate;
            channelCount = capture.WaveFormat.Channels;

            if (viewModule.IsRecording)
                capture.StartRecording();
        }
        private void ConvertSamples(object sender, EventArgs e)
        {
            if (viewModule.IsPlaying && reader != null)
            {
                byte[] buffer = new byte[4096 * 4];
                long position = reader.Position;
                int readed = reader.Read(buffer, 0, 4096 * 4);
                reader.Position = position;
                Samples = Enumerable
                    .Range(0, readed / 4)
                    .Select(i => BitConverter.ToSingle(buffer, i * 4))
                    .ToArray();
            }
        }

        AudioFileReader reader;
        WaveFileWriter writer;
        WaveOut wout;
        WasapiCapture capture;
        BufferedGraphics bufferedGraphics;
        Func<float, float> dftDataFilter;

        int bitsPerSample;
        int sampleRate;
        int channelCount;

        double frequencyPerIndex;
        float[] Samples;           // 保存的样本
        double[] DftData;          // 

        object SamplesLock = new object();
        object DftDataLock = new object();

        /// <summary>
        /// 生成一个适用于过滤绘制数据的委托, 它可以压制绘制数据在一定范围内 (原理是激活函数)
        /// </summary>
        /// <param name="xmin">x最小值</param>
        /// <param name="xmax">x最大值</param>
        /// <param name="ymin">y最小值</param>
        /// <param name="ymax">y最大值</param>
        /// <returns></returns>
        private Func<float, float> GenDataFilter(float xmin, float xmax, float ymin, float ymax)
        {
            Func<float, float> sigmoid = (z) => (float)(1f / (1f + Math.Pow(Math.E, (-z))));
            return (num) => (float)(Math.Tanh((num - xmin) / (xmax - xmin) * 2) * (ymax - ymin) + ymin);
        }

        /// <summary>
        /// 将 WasapiCapture 所捕捉到的数据转换为样本保存到数组
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void SaveSamples(object sender, WaveInEventArgs e)
        {
            if (e.BytesRecorded == 0)
                return;
            int bytesPerSample = bitsPerSample / 8;
            lock (SamplesLock)
                Samples = Enumerable
                              .Range(0, e.BytesRecorded / 4)
                              .Select(i => BitConverter.ToSingle(e.Buffer, i * 4)).ToArray();   // 获取采样
        }
        
        /// <summary>
        /// 将录制的数据写入到保存到文件或流
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void WriteFrame(object sender, WaveInEventArgs e)
        {
            if (viewModule.IsRecording && viewModule.IsSaveFile)
                writer?.Write(e.Buffer, 0, e.BytesRecorded);
        }

        /// <summary>
        /// 当 Panel 尺寸变更时, 重新分配 BufferedGraphics
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void DrawPanelResize(object sender, EventArgs e)
        {
            if (bufferedGraphics == null)
                return;
            lock (bufferedGraphics)
            {
                dftDataFilter = null;
                bufferedGraphics.Dispose();
                bufferedGraphics = null;
            }
        }

        /// <summary>
        /// 从 double 中平滑的取得一个值
        /// 例如 curve[0] = 0, curve[1] = 100, 那么通过此方法访问 curve[0.5], 可得到 50
        /// </summary>
        /// <param name="curve"></param>
        /// <param name="index"></param>
        /// <returns></returns>
        double IndexCurvePoint(double[] curve, double index)
        {
            int
                floor = (int)Math.Min(Math.Floor(index), curve.Length - 1),
                ceiling = (int)Math.Min(Math.Ceiling(index), curve.Length - 1);
            if (floor == ceiling)
                return curve[floor];
            double
                left = curve[floor],
                right = curve[ceiling];
            return left + (right - left) * (index - floor);
        }

        /// <summary>
        /// 从 double 中平滑的获取一个值
        /// 索引以百分比的形式指定, 基本原理时调用 GetCurvePoint
        /// </summary>
        /// <param name="sequence"></param>
        /// <param name="percent"></param>
        /// <returns></returns>
        double GetCurvePoint(double[] sequence, double percent)
        {
            return IndexCurvePoint(sequence, percent * sequence.Length);
        }

        Action drawAction;
        /// <summary>
        /// 根据 DftData, 将频谱绘制到窗体
        /// </summary>
        /// <param name="s"></param>
        /// <param name="args"></param>
        public void RenderPanel(object s, EventArgs args)
        {
            if (DftData == null || DftData.Length == 0 || frequencyPerIndex == 0)
                return;
            lock (DftDataLock)
            {
                MusicLineVisualDraw();
            }
        }

        float curveMultiple = 1;
        double curveFrequencyEnd = 2500d;
        private void MusicLineVisualDraw()
        {
            curveFrequencyEnd = 2500d;

            int hz2500index = (int)(curveFrequencyEnd / frequencyPerIndex);
            double[] resultPaint = DftData.Take(hz2500index).ToArray(); // 106  0~105     71  1~71    ->>>   

            float dataRight = resultPaint.Length, panelRight = 1140, panelHeight = 100;
            dftDataFilter ??= (v) => v;
            PointF[] points = Enumerable.Range(0, resultPaint.Length).Select(i =>
                new PointF(
                    (int)(i / dataRight * panelRight),
                    panelHeight - dftDataFilter((float)resultPaint[i] * curveMultiple)))
                .ToArray();


            //参数调整,为0则不执行
            int size_1_SmoothData = 3;//预处理数据，第一次SmoothData平滑
            int size_average = 40;//对animation_points超出的部分进行平均量增减(上下波动幅度)。
            double size_Error_point = 0.95;//超出频谱动画范围，重新设置为？
            int size_2_SmoothData = 8;//第二次SmoothData平滑

            //显示频谱的动画个数
            int animation_points_Count = 106;
            #region 频谱数据，浓缩平滑预处理

            animation_points.Clear();
            //数据浓缩为animation_points_Count长度
            points = CondenseData(points, animation_points_Count);
            for (int i = 0; i < points.Length; i++)
            {
                for (int j = points.Length / 4; j < points.Length / 4 + points.Length / 2; j++)
                {
                    animation_points.Add(points[i].Y);
                    animation_points[animation_points.Count - 1] = (float)(animation_points[animation_points.Count - 1] / 100 - 0.2);
                    break;
                }
            }
            //w,b参数
            //对animation_points进行SmoothData平滑
            if (size_1_SmoothData != 0)
                animation_points = SmoothData(animation_points, size_1_SmoothData);
            #endregion

            #region 频谱数据常规处理，防止越界

            for (int i = 0; i < (int)(animation_points.Count / animation_points_Count * (int)(animation_points_Count / 2)); i++)
                animation_points[animation_points.Count - 1 - i] = animation_points[i];

            //使频谱数据相反转置
            for (int i = 0; i < animation_points.Count; i++)
                animation_points[i] = -(float)(animation_points[i]);

            //此处temp防止下标越界超过53
            List<float> temp = new List<float>();
            if (animation_points.Count > animation_points_Count)
            {
                temp = new List<float>();
                for (int i = 0; i < animation_points_Count; i++)
                    temp.Add(animation_points[i]);
                animation_points = temp;
            }
            #endregion

            #region 频谱数据转置，再次平滑处理

            if (animation_points.Count == animation_points_Count)
            {
                //对animation_points数据相反转置操作
                //Reverse (int index, int count);
                //  参数: index,要反转的范围的从零开始的起始索引
                //        count,要反转的范围内的元素数。
                animation_points.Reverse(0, 53);
                animation_points.Reverse(53, 53);

                if (size_average != 0)
                {
                    //对超过0的数据，求增量平均值，处理
                    float sum_average = 0;
                    int count_sum_average = 0;
                    for (int j = 0; j < animation_points.Count; j++)
                    {
                        if (animation_points[j] > 0)
                        {
                            sum_average += animation_points[j];
                            count_sum_average++;
                        }
                    }
                    //w,b参数
                    //对animation_points超出的部分进行平均量增减。减少方差，增加均匀度
                    sum_average /= (count_sum_average + size_average);
                    for (int i = 0; i < animation_points.Count; i++)
                    {
                        if (animation_points[i] <= 0)
                            animation_points[i] += sum_average;
                        else if (animation_points[i] > 0.4)
                        {
                            animation_points[i] = (float)size_Error_point;
                            animation_points[i] -= sum_average;
                        }
                    }
                }
                //w,b参数
                //对animation_points进行SmoothData平滑
                if (size_2_SmoothData != 0)
                    animation_points = SmoothData(animation_points, size_2_SmoothData);

                for (int i = 0; i < (int)(animation_points_Count / 4); i++)
                    animation_points[animation_points.Count - 1 - i] = animation_points[i];
            }
            #endregion

            //w,b参数
            //对animation_points进行SmoothData平滑
            if (size_2_SmoothData != 0)
                animation_points = SmoothData(animation_points, size_2_SmoothData);

            for (int i = 0; i < (int)(animation_points_Count / 4); i++)
                animation_points[animation_points.Count - 1 - i] = animation_points[i];
        }

        #region 数据浓缩平滑所使用的函数

        /// <summary>
        /// PointF[]数据浓缩
        /// </summary>
        /// <param name="data"></param>
        /// <param name="newSize"></param>
        /// <returns></returns>
        public static PointF[] CondenseData(PointF[] data, int newSize)
        {
            PointF[] condensedData = new PointF[newSize];
            float stepSize = (float)data.Length / newSize;
            float i = 0;
            for (int j = 0; j < newSize; j++)
            {
                condensedData[j] = data[(int)i];
                i += stepSize;
            }
            return condensedData;
        }
        /// <summary>
        /// 创建一个SmoothData平滑函数，使音频频谱数据分布更均匀平滑
        /// </summary>
        /// <param name="data"></param>
        /// <param name="windowSize"></param>
        /// <returns></returns>
        public static PointF[] SmoothData(PointF[] data, int windowSize)
        {
            PointF[] smoothedData = new PointF[data.Length];
            for (int i = 0; i < data.Length; i++)
            {
                float sumX = 0;
                float sumY = 0;
                int count = 0;
                for (int j = Math.Max(0, i - windowSize / 2); j < Math.Min(data.Length, i + windowSize / 2); j++)
                {
                    sumX += data[j].X;
                    sumY += data[j].Y;
                    count++;
                }
                smoothedData[i] = new PointF(sumX / count, sumY / count);
            }
            return smoothedData;
        }
        public static List<float> SmoothData(List<float> data, int windowSize)
        {        
            List<float> smoothedData = new List<float>();
            for (int i = 0; i < data.Count; i++)
            {
                int windowStartIndex = Math.Max(0, i - windowSize / 2);
                int windowEndIndex = Math.Min(data.Count - 1, i + windowSize / 2);
                double sum = 0;
                for (int j = windowStartIndex; j <= windowEndIndex; j++)
                {
                    sum += data[j];
                }
                smoothedData.Add((float)(sum / (windowEndIndex - windowStartIndex + 1)));
            }
            return smoothedData;
        }
        #endregion


        /// <summary>
        /// 根据 Samples, 将采样进行傅里叶变换以求得 DftData
        /// </summary>
        /// <param name="s"></param>
        /// <param name="args"></param>
        public void ProcessFrame(object s, EventArgs args)
        {
            if (Samples == null)
                return;
            float[][] chanelSamples;
            lock (SamplesLock)
                chanelSamples = Enumerable
                    .Range(0, channelCount)
                    .Select(i => Enumerable
                        .Range(0, Samples.Length / channelCount)
                        .Select(j => Samples[i + j * channelCount])
                        .ToArray())
                    .ToArray();

            float[] chanelAverageSamples = Enumerable
                .Range(0, chanelSamples[0].Length)
                .Select(i => Enumerable
                    .Range(0, channelCount)
                    .Select(j => chanelSamples[j][i])
                    .Average())
                .ToArray();

            float[] sampleSrc = chanelAverageSamples;
            int log = (int)Math.Floor(Math.Log(sampleSrc.Length, 2));
            float[] filledSamples = new float[(int)Math.Pow(2, log)];
            Array.Copy(sampleSrc, filledSamples, Math.Min(sampleSrc.Length, filledSamples.Length));   // 填充数据
            Complex[] complexSrc = filledSamples.Select((v, i) => new Complex() { X = v }).ToArray();
            FastFourierTransform.FFT(false, log, complexSrc);     // 进行傅里叶变换
            double[] result = complexSrc.Select(v => Math.Sqrt(v.X * v.X + v.Y * v.Y)).ToArray();    // 取得结果
            double[] reresult = result.Take(result.Length / 2).ToArray();                            // 取一半

            frequencyPerIndex = (double)sampleRate / filledSamples.Length;
            UpdateDftData(reresult, 0.8, 0.5);
        }

        /// <summary>
        /// 平滑的更新 DftData
        /// </summary>
        /// <param name="newData"></param>
        /// <param name="upParam"></param>
        /// <param name="downParam"></param>
        /// <returns></returns>
        private double[] UpdateDftData(double[] newData, double upParam = 1, double downParam = 1)
        {
            if (DftData == null || DftData.Length == 0)
                return DftData = newData.Select(v => v * upParam).ToArray();
            lock (DftDataLock)
            {
                try
                {
                    return DftData = newData.Select((v, i) =>
                    {
                        double lastData = GetCurvePoint(DftData, (double)i / newData.Length);
                        double incre = v - lastData;
                        return lastData + incre * (incre > 0 ? upParam : downParam);
                    }).ToArray();
                }
                catch (IndexOutOfRangeException)
                {
                    return null;
                }
            }
        }

        /// <summary>
        /// 开始与暂停
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void StartBtn_Click()
        {
            capture.StartRecording();

            viewModule.IsRecording ^= true;
        }
        public void StopBtn_Click()
        {
            if (writer != null)
                writer.Close();
            capture.StopRecording();

            viewModule.IsRecording ^= false;
        }
    }
}
