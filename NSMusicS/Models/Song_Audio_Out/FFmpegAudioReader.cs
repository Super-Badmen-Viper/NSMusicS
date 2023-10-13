using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CSCore;
using NSMusicS.Models.Song_Audio_Out.CSCore_Ffmpeg;
using NAudio.Wave;
using NAudio.Wave.SampleProviders;

namespace NSMusicS.Models.Song_Audio_Out
{
    /// <summary>
    /// <see cref="WaveStream"/> for reading Audio files
    /// </summary>
    public class FFmpegAudioReader : WaveStream, ISampleProvider
    {
        public SampleChannel sampleChannel; // sample provider that gives us most stuff we need

        private IWaveSource ffmpegDecoder;
        private readonly NAudio.Wave.WaveFormat waveFormat;
        public override NAudio.Wave.WaveFormat WaveFormat
        {
            get { return waveFormat; }
        }

        public override long Length
        {
            get
            {
                if (ffmpegDecoder != null)
                    return ffmpegDecoder.Length;
                return 0;
            }
        }

        public override long Position
        {
            get
            {
                return ffmpegDecoder?.Position ?? 0;
            }
            set
            {
                if (ffmpegDecoder != null)
                {
                    ffmpegDecoder.Position = value;
                }
            }
        }

        public FFmpegAudioReader(string filename)
        {
            ffmpegDecoder = new FfmpegDecoder(filename);

            if (null != ffmpegDecoder)
            {
                int sampleRate = ffmpegDecoder.WaveFormat.SampleRate;
                int bitsPerSample = ffmpegDecoder.WaveFormat.BitsPerSample;
                int channels = ffmpegDecoder.WaveFormat.Channels;
                this.waveFormat = new NAudio.Wave.WaveFormat(sampleRate, bitsPerSample, channels);
            }
        }

        //fill pcm data to buffer
        public override int Read(byte[] buffer, int offset, int count)
        {
            if (ffmpegDecoder == null)
                return 0;

            int bytesRead = 0;
            int totalBytesRead = 0;

            while (totalBytesRead < count)
            {
                int bytesToRead = count - totalBytesRead;
                int bytesReadThisTime = ffmpegDecoder.Read(buffer, offset + totalBytesRead, bytesToRead);

                if (bytesReadThisTime == 0)
                    break;

                totalBytesRead += bytesReadThisTime;
            }

            return totalBytesRead;
        }


        protected override void Dispose(bool disposing)
        {
            if (null != ffmpegDecoder)
            {
                ffmpegDecoder.Dispose();
                ffmpegDecoder = null;
            }
        }

        /// <summary>
        /// Reads audio from this sample provider
        /// </summary>
        /// <param name="buffer">Sample buffer</param>
        /// <param name="offset">Offset into sample buffer</param>
        /// <param name="count">Number of samples required</param>
        /// <returns>Number of samples read</returns>
        public int Read(float[] buffer, int offset, int count)
        {
            return sampleChannel.Read(buffer, offset, count);
        }
    }
}
