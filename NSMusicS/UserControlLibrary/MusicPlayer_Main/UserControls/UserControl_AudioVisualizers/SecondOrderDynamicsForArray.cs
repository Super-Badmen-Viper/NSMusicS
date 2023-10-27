using System;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls.UserControl_AudioVisualizers
{
    public class SecondOrderDynamicsForArray
    {
        private double[] xps, xds;// previous input
        private double[] ys, yds; // state variables
        private double _w, _z, _d, k1, k2, k3; // dynamics constants

        /// <summary>
        /// 
        /// </summary>
        /// <param name="f"></param>
        /// <param name="z"></param>
        /// <param name="r"></param>
        /// <param name="x0"></param>
        /// <param name="size">Array size</param>
        public SecondOrderDynamicsForArray(double f, double z, double r, double x0, int size)
        {
            //compute constants
            _w = 2 * Math.PI * f;
            _z = z;
            _d = _w * Math.Sqrt(Math.Abs(z * z - 1));
            k1 = z / (Math.PI * f);
            k2 = 1 / ((2 * Math.PI * f) * (2 * Math.PI * f));
            k3 = r * z / (2 * Math.PI * f);

            // initialize variables
            xps = new double[size];
            ys = new double[size];

            xds = new double[size];
            yds = new double[size];

            Array.Fill(xps, x0);
            Array.Fill(ys, x0);
        }

        public double[] Update(double deltaTime, double[] xs)
        {
            if (xs.Length != xps.Length)
                throw new ArgumentException();

            for (int i = 0; i < xds.Length; i++)
                xds[i] = (xs[i] - xps[i]) / deltaTime;
            double k1_stable, k2_stable;
            if (_w * deltaTime < _z)
            {
                k1_stable = k1;
                k2_stable = Math.Max(Math.Max(k2, deltaTime * deltaTime / 2 + deltaTime * k1 / 2), deltaTime * k1);
            }
            else
            {
                double t1 = Math.Exp(-_z * _w * deltaTime);
                double alpha = 2 * t1 * (_z <= 1 ? Math.Cos(deltaTime * _d) : Math.Cosh(deltaTime * _d));
                double beta = t1 * t1;
                double t2 = deltaTime / (1 + beta - alpha);
                k1_stable = (1 - beta) * t2;
                k2_stable = deltaTime * t2;
            }

            for (int i = 0; i < ys.Length; i++)
            {
                ys[i] = ys[i] + deltaTime * yds[i];
                yds[i] = yds[i] + deltaTime * (xs[i] + k3 * xds[i] - ys[i] - k1_stable * yds[i]) / k2_stable;
            }

            for (int i = 0; i < xps.Length; i++)
                xps[i] = xs[i];
            return ys;
        }
    }
}