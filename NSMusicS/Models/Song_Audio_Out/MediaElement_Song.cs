using NAudio.Wave;
using NAudio.Dsp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WaveOutEvent = NAudio.Wave.WaveOutEvent;
using WaveOut = NAudio.Wave.WaveOut;
using WaveFormat = NAudio.Wave.WaveFormat;
using ISampleProvider = NAudio.Wave.ISampleProvider;
using NAudio.Extras;
using NAudio.Wave;
using Equalizer = NAudio.Extras.Equalizer;
using ViewModelBase = NSMusicS.Models.Song_Audio_Out.EQ_ViewModel.ViewModelBase;
using CommunityToolkit.Mvvm.Input;
using System.ComponentModel;
using NSMusicS.Services.Services_For_API_GetResult;
using System.Threading;
using CSCore;
using NSMusicS.Models.Song_Audio_Out.CSCore_Ffmpeg;
using NSMusicS.Models.Song_Audio_Out.NAduio;
using NAudio.Wave.SampleProviders;
using Newtonsoft.Json.Linq;
using System.Windows.Controls;
using AudioFileReader = NSMusicS.Models.Song_Audio_Out.NAduio.AudioFileReader;
using NAudio.CoreAudioApi;
using System.Windows.Threading;
using CSCore.CoreAudioAPI;
using MMDeviceEnumerator = NAudio.CoreAudioApi.MMDeviceEnumerator;
using MMDevice = NAudio.CoreAudioApi.MMDevice;
using DeviceState = NAudio.CoreAudioApi.DeviceState;
using DataFlow = NAudio.CoreAudioApi.DataFlow;
using Role = NAudio.CoreAudioApi.Role;
using CSCore.SoundOut;
using NSMusicS.Models.Song_List_Infos;
using WasapiOut = NAudio.Wave.WasapiOut;
using AudioClientShareMode = NAudio.CoreAudioApi.AudioClientShareMode;
//using AudioFileReader = NSMusicS.Models.Song_Audio_Out.NAduio.AudioFileReader;

namespace NSMusicS.Models.Song_Audio_Out
{
    public class MediaElement_Song : ViewModelBase
    {
        public WasapiOut wasapiOut;

        private FFmpegAudioReader audioFileReader_FFmpeg; //CSCore - FFmpeg音频库 接口版本
        private AudioFileReader audioFileReader; //基于NAudio音频库 版本
        private MediaFoundationReader audioFileReader_Web;//web流

        private SampleChannel sampleChannel;

        private Equalizer equalizer;
        private EqualizerBand[] bands;

        public event EventHandler MediaOpened; 
        public event EventHandler MediaEnded;

        public string audioFilePath;
        public string deviceName;
        public MMDevice defaultOutputDevice;
        public bool deviceNumber_change;

        #region plyaer
        public MediaElement_Song()
        {
            bands = new EqualizerBand[]
            {
                new EqualizerBand {Bandwidth = 0.8f, Frequency = 31, Gain = 0},
                new EqualizerBand {Bandwidth = 0.8f, Frequency = 62, Gain = 0},
                new EqualizerBand {Bandwidth = 0.8f, Frequency = 125, Gain = 0},
                new EqualizerBand {Bandwidth = 0.8f, Frequency = 250, Gain = 0},
                new EqualizerBand {Bandwidth = 0.8f, Frequency = 500, Gain = 0},
                new EqualizerBand {Bandwidth = 0.8f, Frequency = 1000, Gain = 0},
                new EqualizerBand {Bandwidth = 0.8f, Frequency = 2000, Gain = 0},
                new EqualizerBand {Bandwidth = 0.8f, Frequency = 4000, Gain = 0},
                new EqualizerBand {Bandwidth = 0.8f, Frequency = 8000, Gain = 0},
                new EqualizerBand {Bandwidth = 0.8f, Frequency = 16000, Gain = 0},
                new EqualizerBand {Bandwidth = 0.8f, Frequency = 20000, Gain = 0},
            };
            this.PropertyChanged += OnPropertyChanged;

            //获取并设置系统的当前音频输出源
            UpdateOutputDeviceInformation();

            wasapiOut = new WasapiOut(defaultOutputDevice, AudioClientShareMode.Shared, true, 100);
        }
        public void UpdateOutputDeviceInformation()
        {
            using (var enumerator = new MMDeviceEnumerator())
            {
                var devices = enumerator.EnumerateAudioEndPoints(DataFlow.Render, DeviceState.Active);
                for (int i = 0; i < devices.Count; i++)
                {
                    using (MMDevice device = devices[i])
                    {
                        if (device.State == DeviceState.Active && device.ID == enumerator.GetDefaultAudioEndpoint(DataFlow.Render, Role.Console).ID)
                        {
                            deviceName = device.FriendlyName;
                            defaultOutputDevice = devices[devices.Count - 1];

                            SetOutputDevice(device);

                            break;
                        }
                    }
                }
            }
        }
        private void OnPropertyChanged(object sender, PropertyChangedEventArgs propertyChangedEventArgs)
        {
            equalizer?.Update();
        }

        public RelayCommand RefCommand_Set_Equalizer { get; set; }

        public bool play_;
        /// <summary>
        /// 初始化播放
        /// </summary>
        /// <param name="audioFilePath"></param>
        public void Open(string audioFilePath)
        {
            if (audioFileReader != null)
            {
                audioFileReader.Dispose();
                audioFileReader = null;
            }
            if (audioFileReader_FFmpeg != null)
            {
                audioFileReader_FFmpeg.Dispose();
                audioFileReader_FFmpeg = null;
            }
            if (audioFileReader_Web != null)
            {
                audioFileReader_Web.Dispose();
                audioFileReader_Web = null;
            }

            if (sampleChannel != null)
                sampleChannel = null;

            if (equalizer != null)
                equalizer = null;

            if (wasapiOut != null)
            {
                wasapiOut.Dispose();
                wasapiOut = null;
            }
            wasapiOut = new WasapiOut(defaultOutputDevice, AudioClientShareMode.Shared, true, 100);


            GC.Collect();
            GC.WaitForPendingFinalizers();

            //选择编码器
            if (audioFilePath.IndexOf("http") < 0) {
                try
                {
                    //尝试使用Naudio 或者Naduio + cscore_FFmpeg混流(无损flac)
                    if (audioFilePath.EndsWith(".mp3", StringComparison.OrdinalIgnoreCase))
                        audioFileReader = new AudioFileReader(audioFilePath);
                    else if (audioFilePath.EndsWith(".wav", StringComparison.OrdinalIgnoreCase))
                        audioFileReader = new AudioFileReader(audioFilePath);
                    else if (audioFilePath.EndsWith(".aiff", StringComparison.OrdinalIgnoreCase))
                        audioFileReader = new AudioFileReader(audioFilePath);
                    else if (audioFilePath.EndsWith(".flac", StringComparison.OrdinalIgnoreCase))
                    {
                        audioFileReader_FFmpeg = new FFmpegAudioReader(audioFilePath);
                        sampleChannel = new SampleChannel(audioFileReader_FFmpeg);
                        audioFileReader_FFmpeg.sampleChannel = sampleChannel;

                        audioFileReader = new AudioFileReader(audioFilePath);
                        audioFileReader.sampleChannel = sampleChannel;
                    }
                    else
                    {
                        audioFileReader_FFmpeg = new FFmpegAudioReader(audioFilePath);
                        sampleChannel = new SampleChannel(audioFileReader_FFmpeg);
                        audioFileReader_FFmpeg.sampleChannel = sampleChannel;

                        audioFileReader = new AudioFileReader(audioFilePath);
                        audioFileReader.sampleChannel = sampleChannel;
                    }
                    
                    //尝试 初始化输出 均衡器
                    try
                    {
                        wasapiOut = new WasapiOut(defaultOutputDevice, AudioClientShareMode.Shared, true, 100);

                        deviceNumber_change = false;

                        equalizer = new Equalizer(audioFileReader, bands);
                        wasapiOut.Init(equalizer);

                        play_ = true;
                    }
                    catch//若不支持 Naudio均衡器，则默认 Naudio普通初始化输出
                    {
                        wasapiOut.Init(audioFileReader);

                        play_ = true;
                    }
                }
                catch//若不支持NAduio + cscore_FFmpeg混流 均衡器
                {
                    //仍 尝试 NAduio + cscore_FFmpeg混流 直接输出
                    try
                    {
                        audioFileReader_FFmpeg = new FFmpegAudioReader(audioFilePath);
                        sampleChannel = new SampleChannel(audioFileReader_FFmpeg);
                        audioFileReader_FFmpeg.sampleChannel = sampleChannel;

                        audioFileReader = new AudioFileReader(audioFilePath);
                        audioFileReader.sampleChannel = sampleChannel;

                        wasapiOut.Init(audioFileReader);
                    }
                    catch//cscore_FFmpeg混流，直接输出
                    {
                        audioFileReader_FFmpeg = new FFmpegAudioReader(audioFilePath);
                        wasapiOut.Init(audioFileReader_FFmpeg);
                    }
                }
            }
            else
            {
                //尝试 使用web流 音频
                try
                {
                    audioFileReader_Web = new MediaFoundationReader(audioFilePath);

                    deviceNumber_change = false;

                    wasapiOut.Init(audioFileReader_Web);

                    play_ = true;
                }
                catch
                {
                    play_ = false;
                }
            }     

            OnMediaOpened();

            this.audioFilePath = audioFilePath;
        }

        public void Play()
        {
            try
            {
                if (play_)
                    wasapiOut.Play();
            }catch (Exception ex)
            {
                play_ = false;
            }
        }

        public void Pause()
        {
            try
            {
                if (play_)
                    wasapiOut.Pause();
            }
            catch (Exception ex)
            {
                play_ = false;
            }
        }

        public void Stop()
        {
            try
            {
                if (play_)
                    wasapiOut.Stop();
            }
            catch (Exception ex)
            {
                play_ = false;
            }
        }

        public void Clear()
        {
            audioFileReader.Dispose();
            wasapiOut.Dispose();

            audioFileReader = null;
            wasapiOut = null;
        }

        private TimeSpan Error_TimeSpan = new TimeSpan();
        public TimeSpan CurrentTime
        {
            get
            {
                try
                {
                    if (audioFilePath != null)
                    {
                        if (audioFileReader_Web == null)
                        {
                            if (audioFilePath.IndexOf(".flac") >= 0)
                            {
                                Error_TimeSpan = audioFileReader_FFmpeg.CurrentTime;
                                return audioFileReader_FFmpeg.CurrentTime;
                            }
                            else
                            {
                                Error_TimeSpan = audioFileReader.CurrentTime;
                                return audioFileReader.CurrentTime;
                            }
                        }
                        else
                        {
                            Error_TimeSpan = audioFileReader_Web.CurrentTime;
                            return audioFileReader_Web.CurrentTime;
                        }
                    }
                    else
                    {
                        return TimeSpan.Zero;
                    }
                }
                catch
                {
                    return GetLastNonExceptionValue();
                }
            }
            set
            {
                if (audioFilePath != null)
                {
                    if (audioFileReader_Web == null)
                    {
                        if (audioFilePath.IndexOf(".flac") >= 0)
                        {
                            if (audioFileReader_FFmpeg != null)
                            {
                                Error_TimeSpan = value;
                                SetCurrentTimeAsync(value);
                            }
                        }
                        else
                        {
                            if (audioFileReader != null)
                            {
                                Error_TimeSpan = value;
                                SetCurrentTimeAsync(value);
                            }
                        }
                    }
                    else
                    {
                        Error_TimeSpan = value;
                        SetCurrentTimeAsync(value);
                    }
                }
            }
        }
        private TimeSpan GetLastNonExceptionValue()
        {
            return Error_TimeSpan;
        }
        public async Task SetCurrentTimeAsync(TimeSpan newTime)
        {
            await Task.Run(() =>
            {
                if (audioFilePath != null)
                {
                    if (audioFileReader_Web == null)
                    {
                        if (audioFilePath.IndexOf(".flac") >= 0)
                        {
                            if (audioFileReader_FFmpeg != null)
                            {
                                if (newTime.TotalMilliseconds != 0)
                                {
                                    audioFileReader_FFmpeg.CurrentTime = newTime;

                                    Thread.Sleep(500);
                                }
                            }
                        }
                        else
                        {
                            if (audioFileReader != null)
                            {
                                if (newTime.TotalMilliseconds != 0)
                                {
                                    audioFileReader.CurrentTime = newTime;

                                    Thread.Sleep(500);
                                }
                            }
                        }
                    }
                    else
                    {
                        if (audioFileReader_Web != null)
                        {
                            if (newTime.TotalMilliseconds != 0)
                            {
                                audioFileReader_Web.CurrentTime = newTime;

                                Thread.Sleep(500);
                            }
                        }
                    }
                }
            });
        }


        public TimeSpan TotalTime
        {
            get {
                if (audioFileReader_Web == null)
                {
                    if (audioFilePath.IndexOf(".flac") >= 0)
                    {
                        if (audioFileReader_FFmpeg != null)
                        {
                            return audioFileReader_FFmpeg?.TotalTime ?? TimeSpan.Zero;
                        }
                    }
                    else
                    {
                        if (audioFileReader != null)
                        {
                            return audioFileReader?.TotalTime ?? TimeSpan.Zero;
                        }
                    }

                    return TimeSpan.Zero;
                }
                else
                {
                    return audioFileReader_Web?.TotalTime ?? TimeSpan.Zero;
                }
            }
        }

        public float Volume
        {
            get { return wasapiOut?.Volume ?? 1.0f; }
            set
            {
                if (wasapiOut != null)
                {
                    wasapiOut.Volume = value;
                }
            }
        }

        public void SetOutputDevice(MMDevice device)
        {
            this.deviceName = device.DeviceFriendlyName;
            defaultOutputDevice = device;

            if (audioFilePath != null)
            {
                Open(audioFilePath);
            }
        }

        public void SetEqualizerBand(EqualizerBand[] temp)
        {
            if(temp != null)
                bands = temp;
        }

        private void OnMediaOpened()
        {
            MediaOpened?.Invoke(this, EventArgs.Empty);
        }

        #endregion

        #region EQ

        public float MinimumGain => -12;
        public float MaximumGain => 12 ;


        /// <summary>
        /// 总体增益
        /// </summary>
        private float bandwidth;
        public float Bandwidth
        {
            get => bands[0].Bandwidth;
            set
            {
                if (bands[0].Bandwidth != value)
                {
                    for (int i = 0; i < bands.Length; i++)
                    {
                        bands[i].Bandwidth = value;
                    }
                    OnPropertyChanged("Bandwidth");
                }
            }
        }

        /// <summary>
        /// 31
        /// </summary>
        public float Band1
        {
            get => bands[0].Gain;
            set
            {
                if (bands[0].Gain != value)
                {
                    bands[0].Gain = value;
                    OnPropertyChanged("Band1");
                }
            }
        }
        /// <summary>
        /// 62
        /// </summary>
        public float Band2
        {
            get => bands[1].Gain;
            set
            {
                if (bands[1].Gain != value)
                {
                    bands[1].Gain = value;
                    OnPropertyChanged("Band2");
                }
            }
        }
        /// <summary>
        /// 125
        /// </summary>
        public float Band3
        {
            get => bands[2].Gain;
            set
            {
                if (bands[2].Gain != value)
                {
                    bands[2].Gain = value;
                    OnPropertyChanged("Band3");
                }
            }
        }
        /// <summary>
        /// 250
        /// </summary>
        public float Band4
        {
            get => bands[3].Gain;
            set
            {
                if (bands[3].Gain != value)
                {
                    bands[3].Gain = value;
                    OnPropertyChanged("Band4");
                }
            }
        }
        /// <summary>
        /// 500
        /// </summary>
        public float Band5
        {
            get => bands[4].Gain;
            set
            {
                if (bands[4].Gain != value)
                {
                    bands[4].Gain = value;
                    OnPropertyChanged("Band5");
                }
            }
        }
        /// <summary>
        /// 1k
        /// </summary>
        public float Band6
        {
            get => bands[5].Gain;
            set
            {
                if (bands[5].Gain != value)
                {
                    bands[5].Gain = value;
                    OnPropertyChanged("Band6");
                }
            }
        }
        /// <summary>
        /// 2k
        /// </summary>
        public float Band7
        {
            get => bands[6].Gain;
            set
            {
                if (bands[6].Gain != value)
                {
                    bands[6].Gain = value;
                    OnPropertyChanged("Band7");
                }
            }
        }
        /// <summary>
        /// 4k
        /// </summary>
        public float Band8
        {
            get => bands[7].Gain;
            set
            {
                if (bands[7].Gain != value)
                {
                    bands[7].Gain = value;
                    OnPropertyChanged("Band7");
                }
            }
        }
        /// <summary>
        /// 8k
        /// </summary>
        public float Band9
        {
            get => bands[8].Gain;
            set
            {
                if (bands[8].Gain != value)
                {
                    bands[8].Gain = value;
                    OnPropertyChanged("Band8");
                }
            }
        }
        /// <summary>
        /// 16k
        /// </summary>
        public float Band10
        {
            get => bands[9].Gain;
            set
            {
                if (bands[9].Gain != value)
                {
                    bands[9].Gain = value;
                    OnPropertyChanged("Band9");
                }
            }
        }
        /// <summary>
        /// 20k
        /// </summary>
        public float Band11
        {
            get => bands[10].Gain;
            set
            {
                if (bands[10].Gain != value)
                {
                    bands[10].Gain = value;
                    OnPropertyChanged("Band7");
                }
            }
        }

        #endregion

        public static MediaElement_Song viewModule_MediaElement_Song { get; set; }
        public static MediaElement_Song Retuen_This()
        {
            viewModule_MediaElement_Song = Return_This_ViewModule_MediaElement_Song();
            return viewModule_MediaElement_Song;
        }
        private static MediaElement_Song Return_This_ViewModule_MediaElement_Song()
        {
            if (viewModule_MediaElement_Song == null)
                viewModule_MediaElement_Song = new MediaElement_Song();
            return viewModule_MediaElement_Song;
        }
    }
}
