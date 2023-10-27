using NSMusicS_Sound_Plugin.Views.VIews_NSMusicS_Equalizer_Speciality.UserControl_Graphic_Panel.UserControls;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace NSMusicS_Sound_Plugin
{
    /// <summary>
    /// NSMusicS_Equalizer_Speciality.xaml 的交互逻辑
    /// </summary>
    public partial class NSMusicS_Equalizer_Speciality : Window
    {
        public NSMusicS_Equalizer_Speciality()
        {
            InitializeComponent();

            List<GridLength> gridLengths = new List<GridLength>();
            gridLengths.Add(new GridLength(25));
            gridLengths.Add(new GridLength(40));
            gridLengths.Add(new GridLength(63));
            gridLengths.Add(new GridLength(100));
            gridLengths.Add(new GridLength(160));
            gridLengths.Add(new GridLength(250));
            gridLengths.Add(new GridLength(400));
            gridLengths.Add(new GridLength(630));
            gridLengths.Add(new GridLength(1000));
            gridLengths.Add(new GridLength(1600));
            gridLengths.Add(new GridLength(2500));
            gridLengths.Add(new GridLength(4000));
            gridLengths.Add(new GridLength(6300));
            gridLengths.Add(new GridLength(10000));
            gridLengths.Add(new GridLength(16000));


            panel_Reference_Gridlines.Create_Reference_Gridlines(
                21, new GridLength(), 10,
                gridLengths.Count, gridLengths,true
                );
        }

        
    }
}
