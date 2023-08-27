using NAudio.Wave;
using NAudio.Dsp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VisioForge.Libs.NAudio.Wave;
using VisioForge.MediaFramework.DSP.Equalizer;
using WaveOutEvent = NAudio.Wave.WaveOutEvent;
using WaveOut = NAudio.Wave.WaveOut;
using WaveFormat = NAudio.Wave.WaveFormat;
using ISampleProvider = NAudio.Wave.ISampleProvider;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_Audio_Out
{
    public class MediaElement_Song
    {
        public WaveOutEvent waveOutEvent;
        private AudioFileReader audioFileReader;

        private Equalizer equalizer; // EQ instance

        public event EventHandler MediaOpened; 
        public event EventHandler MediaEnded;

        public MediaElement_Song()
        {
            waveOutEvent = new WaveOutEvent();
        }

        public void Open(string audioFilePath)
        {
            if (audioFileReader != null)
            {
                audioFileReader.Dispose();
                waveOutEvent.Dispose();
            }

            //equalizer = new Equalizer(10, 44100);   // Initialize EQ（波段数(5,10,,20)，采样率）
            //equalizer.Process((float)0.5,1);      //设置EQ 参数

            audioFileReader = new AudioFileReader(audioFilePath);
            waveOutEvent = new WaveOutEvent();
            waveOutEvent.Init(audioFileReader);
            //waveOutEvent.Init(new EqualizerSampleProvider(audioFileReader, equalizer)); // Use custom SampleProvider
            OnMediaOpened();
        }

        public void Play()
        {
            waveOutEvent.Play();
        }

        public void Pause()
        {
            waveOutEvent.Pause();
        }

        public void Stop()
        {
            waveOutEvent.Stop();
        }

        public TimeSpan CurrentTime
        {
            get { return audioFileReader?.CurrentTime ?? TimeSpan.Zero; }
            set
            {
                if (audioFileReader != null)
                {
                    audioFileReader.CurrentTime = value;
                }
            }
        }

        public TimeSpan TotalTime
        {
            get { return audioFileReader?.TotalTime ?? TimeSpan.Zero; }
        }

        public float Volume
        {
            get { return waveOutEvent?.Volume ?? 1.0f; }
            set
            {
                if (waveOutEvent != null)
                {
                    waveOutEvent.Volume = value;
                }
            }
        }

        public void SetOutputDevice(int deviceNumber)
        {
            if (WaveOut.DeviceCount > 0 && deviceNumber >= 0 && deviceNumber < WaveOut.DeviceCount)
            {
                waveOutEvent.DeviceNumber = deviceNumber;
            }
        }

        private void OnMediaOpened()
        {
            MediaOpened?.Invoke(this, EventArgs.Empty);
        }
    }

    public class Equalizer
    {
        /// <summary>
        /// 存储多个 BiQuadFilter 实例
        /// 每个实例对应一个均衡器的频段
        /// </summary>
        private readonly BiQuadFilter[] filters;

        /// <summary>
        /// 初始化均衡器对象
        /// </summary>
        /// <param name="numBands">均衡器的频段数量</param>
        /// <param name="sampleRate">音频的采样率</param>
        public Equalizer(int numBands, int sampleRate)
        {
            filters = new BiQuadFilter[numBands];
            for (int i = 0; i < numBands; i++)
            {
                //PeakingEQ 是 BiQuadFilter 类的一个静态方法
                //      用于创建一个具有峰值增强或降低效果的均衡器滤波器
                filters[i] = BiQuadFilter.PeakingEQ(
                    sampleRate, 200 * (i + 1), (float)0.5, 0
                    ); // You can adjust the parameters here
            }
        }

        /// <summary>
        /// 处理输入的音频样本并进行均衡处理
        /// </summary>
        /// <param name="sample">音频样本</param>
        /// <param name="band">频段索引</param>
        /// <returns>
        /// 接受一个音频样本 sample 和一个频段索引 band
        /// 然后将样本传递给对应频段的 BiQuadFilter 实例进行处理
        /// 返回处理后的样本
        /// </returns>
        public float Process(float sample, int band)
        {
            return filters[band].Transform(sample);
        }
    }

    public class EqualizerSampleProvider : ISampleProvider
    {
        private readonly ISampleProvider source;
        private readonly Equalizer equalizer;

        public WaveFormat WaveFormat => source.WaveFormat;

        public EqualizerSampleProvider(ISampleProvider source, Equalizer equalizer)
        {
            this.source = source;
            this.equalizer = equalizer;
        }

        public int Read(float[] buffer, int offset, int count)
        {
            int samplesRead = source.Read(buffer, offset, count);

            for (int n = 0; n < samplesRead; n++)
            {
                buffer[offset + n] = equalizer.Process(buffer[offset + n], 0); // Apply EQ to first band
            }

            return samplesRead;
        }
    }
}
