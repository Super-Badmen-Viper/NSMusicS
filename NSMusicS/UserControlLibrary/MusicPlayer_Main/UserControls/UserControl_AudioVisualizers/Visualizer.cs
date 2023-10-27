using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FftComplex = FftSharp.Complex;
using FftTransform = FftSharp.Transform;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls.UserControl_AudioVisualizers
{
    public class Visualizer
    {
        //private int _m;
        private double[] _sampleData;
        private DateTime _lastTime;
        private SecondOrderDynamicsForArray _dynamics;

        public int waveDataSize;

        /// <summary>
        /// 采样数据
        /// </summary>
        public double[] SampleData => _sampleData;

        public Visualizer(int waveDataSize)
        {
            if (!(Get2Flag(waveDataSize)))
                throw new ArgumentException("长度必须是 2 的 n 次幂");
            //_m = (int)Math.Log2(waveDataSize);
            _lastTime = DateTime.Now;
            _sampleData = new double[waveDataSize];
            _dynamics = new SecondOrderDynamicsForArray(1, 1, 1, 0, waveDataSize / 2);

            this.waveDataSize = waveDataSize;
        }

        /// <summary>
        /// 判断是否是 2 的整数次幂
        /// </summary>
        /// <param name="num"></param>
        /// <returns></returns>
        private bool Get2Flag(int num)
        {
            if (num < 1)
                return false;
            return (num & num - 1) == 0;
        }

        public void PushSampleData(double[] waveData)
        {
            if (waveData.Length > _sampleData.Length)
            {
                Array.Copy(waveData, waveData.Length - _sampleData.Length, _sampleData, 0, _sampleData.Length);
            }
            else
            {
                Array.Copy(_sampleData, waveData.Length, _sampleData, 0, _sampleData.Length - waveData.Length);
                Array.Copy(waveData, 0, _sampleData, _sampleData.Length - waveData.Length, waveData.Length);
            }
        }

        /// <summary>
        /// 获取频谱数据 (数据已经删去共轭部分)
        /// </summary>
        /// <returns></returns>
        public double[] GetSpectrumData()
        {
            DateTime now = DateTime.Now;
            double deltaTime = (now - _lastTime).TotalSeconds;
            _lastTime = now;

            int len = _sampleData.Length;
            FftComplex[] data = new FftComplex[len];

            for (int i = 0; i < len; i++)
                data[i] = new FftComplex(_sampleData[i], 0);

            FftTransform.FFT(data);

            int halfLen = len / 2;
            double[] spectrum = new double[halfLen];           // 傅里叶变换结果左右对称, 只需要取一半
            for (int i = 0; i < halfLen; i++)
                spectrum[i] = data[i].Magnitude / len;

            var window = new FftSharp.Windows.Bartlett();
            window.Create(halfLen);
            window.ApplyInPlace(spectrum, false);

            //return spectrum;
            return _dynamics.Update(deltaTime, spectrum);
        }

        /// <summary>
        /// 取指定频率内的频谱数据
        /// </summary>
        /// <param name="spectrum">源频谱数据</param>
        /// <param name="sampleRate">采样率</param>
        /// <param name="frequency">目标频率</param>
        /// <returns></returns>
        public static double[] TakeSpectrumOfFrequency(double[] spectrum, double sampleRate, double frequency)
        {
            double frequencyPerSampe = sampleRate / spectrum.Length;

            int lengthInNeed = (int)(Math.Min(frequency / frequencyPerSampe, spectrum.Length));
            double[] result = new double[lengthInNeed];
            Array.Copy(spectrum, 0, result, 0, lengthInNeed);
            return result;
        }

        /// <summary>
        /// 简单的数据模糊
        /// </summary>
        /// <param name="data">数据</param>
        /// <param name="radius">模糊半径</param>
        /// <returns>结果</returns>
        public static double[] MakeSmooth(double[] data, int radius)
        {
            double[] GetWeights(int radius)
            {
                double Gaussian(double x) => Math.Pow(Math.E, (-4 * x * x));        // 憨批高斯函数

                int len = 1 + radius * 2;                         // 长度
                int end = len - 1;                                // 最后的索引
                double radiusF = (double)radius;                    // 半径浮点数
                double[] weights = new double[len];                 // 权重

                for (int i = 0; i <= radius; i++)                 // 先把右边的权重算出来
                    weights[radius + i] = Gaussian(i / radiusF);
                for (int i = 0; i < radius; i++)                  // 把右边的权重拷贝到左边
                    weights[i] = weights[end - i];

                double total = weights.Sum();
                for (int i = 0; i < len; i++)                  // 使权重合为 0
                    weights[i] = weights[i] / total;

                return weights;
            }

            void ApplyWeights(double[] buffer, double[] weights)
            {
                int len = buffer.Length;
                for (int i = 0; i < len; i++)
                    buffer[i] = buffer[i] * weights[i];
            }


            double[] weights = GetWeights(radius);
            double[] buffer = new double[1 + radius * 2];

            double[] result = new double[data.Length];
            if (data.Length < radius)
            {
                Array.Fill(result, data.Average());
                return result;
            }


            for (int i = 0; i < radius; i++)
            {
                Array.Fill(buffer, data[i], 0, radius + 1);      // 填充缺省
                for (int j = 0; j < radius; j++)                 // 
                {
                    buffer[radius + 1 + j] = data[i + j];
                }

                ApplyWeights(buffer, weights);
                result[i] = buffer.Sum();
            }

            for (int i = radius; i < data.Length - radius; i++)
            {
                for (int j = 0; j < radius; j++)                 // 
                {
                    buffer[j] = data[i - j];
                }

                buffer[radius] = data[i];

                for (int j = 0; j < radius; j++)                 // 
                {
                    buffer[radius + j + 1] = data[i + j];
                }

                ApplyWeights(buffer, weights);
                result[i] = buffer.Sum();
            }

            for (int i = data.Length - radius; i < data.Length; i++)
            {
                Array.Fill(buffer, data[i], 0, radius + 1);      // 填充缺省
                for (int j = 0; j < radius; j++)                 // 
                {
                    buffer[radius + 1 + j] = data[i - j];
                }

                ApplyWeights(buffer, weights);
                result[i] = buffer.Sum();
            }

            return result;
        }
    }
}
