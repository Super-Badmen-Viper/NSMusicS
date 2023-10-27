using System;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls.UserControl_AudioVisualizers
{
    public class SecondOrderDynamics
    {
        private double xp;// previous input
        private double y, yd; // state variables
        private double _w, _z, _d, k1, k2, k3; // dynamics constants

        public SecondOrderDynamics(double f, double z, double r, double x0)
        {
            //compute constants
            _w = 2 * Math.PI * f;
            _z = z;
            _d = _w * Math.Sqrt(Math.Abs(z * z - 1));
            k1 = z / (Math.PI * f);
            k2 = 1 / ((2 * Math.PI * f) * (2 * Math.PI * f));
            k3 = r * z / (2 * Math.PI * f);

            // initialize variables
            xp = x0;
            y = x0;
            yd = 0;
        }

        public double Update(double deltaTime, double x)
        {
            double xd = (x - xp) / deltaTime;
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

            y = y + deltaTime * yd;
            yd = yd + deltaTime * (x + k3 * xd - y - k1_stable * yd) / k2_stable;

            xp = x;
            return y;
        }
    }
}