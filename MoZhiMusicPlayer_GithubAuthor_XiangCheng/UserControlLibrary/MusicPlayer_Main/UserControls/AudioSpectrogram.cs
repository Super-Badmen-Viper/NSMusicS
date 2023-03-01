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
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.MusicPlayer_Main.UserControls.VIewModules;
using NAudio.CoreAudioApi;
using NAudio.Dsp;
using NAudio.Wave;
using NAudio.Wave.SampleProviders;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.SongList_Info;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.MusicPlayer_Main.UserControls
{
    /// <summary>
    /// 主要代码来源：comSlimeNullAudioTest.git  
    /// 老夫想偷懒了[doge]，频谱分析暂时就先用别人的代码[doge]，改改又不是不能用[doge]
    /// </summary>
    public class AudioSpectrogram
    {
        public AudioSpectrogram() {

            InitializeCapture();

            Timer timer = new Timer();
            timer.Interval = 20;
            timer.Tick += ProcessFrame;
            timer.Tick += RenderPanel;
            timer.Start();
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
        private void RenderPanel(object s, EventArgs args)
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
            int hz2500index = (int)(curveFrequencyEnd / frequencyPerIndex);
            double[] resultPaint = DftData.Take(hz2500index).ToArray(); // 106  0~105     71  1~71    ->>>   

            float
                dataRight = resultPaint.Length, panelRight = 1040, panelHeight = 100;
            dftDataFilter ??= (v) => v;
            PointF[] points = Enumerable.Range(0, resultPaint.Length).Select(i =>
                new PointF(
                    (int)(i / dataRight * panelRight),
                    panelHeight - dftDataFilter((float)resultPaint[i] * curveMultiple)))
                .ToArray();

            animation_points.Clear();
            for (int i = 0; i < points.Length; i++)
            {
                if(i % 2 == 0)
                {
                    for (int j = 0; j < points.Length / 2; j++)
                    {
                        animation_points.Add(points[i].Y);

                        animation_points[animation_points.Count - 1] = (float)(animation_points[animation_points.Count - 1] / 100 - 1);
                        break;
                    }
                }
            }
            for (int i = 0; i < (int)(animation_points.Count / 53 * 20); i++)
            {
                animation_points[animation_points.Count - 1 - i] = animation_points[i];
            }

            if (animation_points.Count > 53)
            {
                List<float> temp = new List<float>();
                for (int i = 0; i < 53; i++)
                {
                    temp.Add(animation_points[i]);
                }

                animation_points = temp;
            }
        }

        /// <summary>
        /// 根据 Samples, 将采样进行傅里叶变换以求得 DftData
        /// </summary>
        /// <param name="s"></param>
        /// <param name="args"></param>
        private void ProcessFrame(object s, EventArgs args)
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
        public void StartStopBtn_Click()
        {
            if (viewModule.IsRecording)
            {
                if (writer != null)
                    writer.Close();
                capture.StopRecording();
            }
            else
                capture.StartRecording();

            viewModule.IsRecording ^= true;
        }
    }
}
