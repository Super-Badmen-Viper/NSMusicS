using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
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
using NSMusicS.Models.Song_Audio_Out;
using NSMusicS.Models.Song_List_Infos;
using NAudio.SoundFont;

namespace NSMusicS.UserControlLibrary.Window_Hover_EQ_Panel
{
    /// <summary>
    /// Window_Hover_EQ_Panel.xaml 的交互逻辑
    /// </summary>
    public partial class Window_Hover_EQ_Panel : Window
    {
        public Window_Hover_EQ_Panel()
        {
            InitializeComponent();

            MediaElement_Song viewModel = MediaElement_Song.Retuen_This();
            this.DataContext = viewModel;

            Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";

            Init_EQ_Bands_For_Model_1s();

            Slider_Model_1_Eq_Num31.ValueChanged += Slider_Model_1_Eq_Num31_ValueChanged;
            Slider_Model_1_Eq_Num62.ValueChanged += Slider_Model_1_Eq_Num62_ValueChanged;
            Slider_Model_1_Eq_Num125.ValueChanged += Slider_Model_1_Eq_Num125_ValueChanged;
            Slider_Model_1_Eq_Num250.ValueChanged += Slider_Model_1_Eq_Num250_ValueChanged;
            Slider_Model_1_Eq_Num500.ValueChanged += Slider_Model_1_Eq_Num500_ValueChanged;
            Slider_Model_1_Eq_Num1k.ValueChanged += Slider_Model_1_Eq_Num1k_ValueChanged;
            Slider_Model_1_Eq_Num2k.ValueChanged += Slider_Model_1_Eq_Num2k_ValueChanged;
            Slider_Model_1_Eq_Num4k.ValueChanged += Slider_Model_1_Eq_Num4k_ValueChanged;
            Slider_Model_1_Eq_Num8k.ValueChanged += Slider_Model_1_Eq_Num8k_ValueChanged;
            Slider_Model_1_Eq_Num16k.ValueChanged += Slider_Model_1_Eq_Num16k_ValueChanged;
            Slider_Model_1_Eq_Num20k.ValueChanged += Slider_Model_1_Eq_Num20k_ValueChanged;
        }
        string Path_App;

        public List<EQ_Bands_For_Model_1> eQ_Bands_For_Model_1s = new List<EQ_Bands_For_Model_1>();
        private List<ComboBoxItem_Name> eQ_ComboBoxItem_Name_For_Model_1s = new List<ComboBoxItem_Name>();

        float[] popPresets;
        float[] dancePresets;
        float[] bluesPresets;
        float[] classicalPresets;
        float[] jazzPresets;
        float[] slowSongPresets;
        float[] electronicPresets;
        float[] rockPresets;
        float[] countryPresets;
        float[] vocalPresets;
        float[] customPreset;

        /// <summary>
        /// 初始化 均衡器 预设数据
        /// </summary>
        private void Init_EQ_Bands_For_Model_1s()
        {
            ComboBoxItem_Name comboBoxItem = new ComboBoxItem_Name();
            comboBoxItem.Name = "流行";
            eQ_ComboBoxItem_Name_For_Model_1s.Add(comboBoxItem);
            comboBoxItem = new ComboBoxItem_Name();
            comboBoxItem.Name = "舞曲";
            eQ_ComboBoxItem_Name_For_Model_1s.Add(comboBoxItem);
            comboBoxItem = new ComboBoxItem_Name();
            comboBoxItem.Name = "蓝调";
            eQ_ComboBoxItem_Name_For_Model_1s.Add(comboBoxItem);
            comboBoxItem = new ComboBoxItem_Name();
            comboBoxItem.Name = "古典";
            eQ_ComboBoxItem_Name_For_Model_1s.Add(comboBoxItem);
            comboBoxItem = new ComboBoxItem_Name();
            comboBoxItem.Name = "爵士";
            eQ_ComboBoxItem_Name_For_Model_1s.Add(comboBoxItem);
            comboBoxItem = new ComboBoxItem_Name();
            comboBoxItem.Name = "慢歌";
            eQ_ComboBoxItem_Name_For_Model_1s.Add(comboBoxItem);
            comboBoxItem = new ComboBoxItem_Name();
            comboBoxItem.Name = "电子乐";
            eQ_ComboBoxItem_Name_For_Model_1s.Add(comboBoxItem);
            comboBoxItem = new ComboBoxItem_Name();
            comboBoxItem.Name = "摇滚";
            eQ_ComboBoxItem_Name_For_Model_1s.Add(comboBoxItem);
            comboBoxItem = new ComboBoxItem_Name();
            comboBoxItem.Name = "乡村";
            eQ_ComboBoxItem_Name_For_Model_1s.Add(comboBoxItem);
            comboBoxItem = new ComboBoxItem_Name();
            comboBoxItem.Name = "人声";
            eQ_ComboBoxItem_Name_For_Model_1s.Add(comboBoxItem);
            comboBoxItem = new ComboBoxItem_Name();
            comboBoxItem.Name = "自定义";
            eQ_ComboBoxItem_Name_For_Model_1s.Add(comboBoxItem);

            ComBox_Select_Eq.ItemsSource = eQ_ComboBoxItem_Name_For_Model_1s;
            ComBox_Select_Eq.SelectedIndex = -1;
            ComBox_Select_Eq.SelectionChanged += ComBox_Select_Eq_SelectionChanged;

            float[] popPresets = { 4, 2, 0, -3, -6, -6, -3, 0, 1, 3 };
            this.popPresets = popPresets;

            float[] dancePresets = { 7, 6, 3, 0, 0, -4, -6, -6, 0, 0 };
            this.dancePresets = dancePresets;

            float[] bluesPresets = { 3, 6, 8, 3, -2, 0, 4, 7, 9, 10 };
            this.bluesPresets = bluesPresets;

            float[] classicalPresets = { 0, 0, 0, 0, 0, 0, -6, -6, -6, -8 };
            this.classicalPresets = classicalPresets;

            float[] jazzPresets = { 0, 0, 1, 4, 4, 4, 0, 1, 3, 3 };
            this.jazzPresets = jazzPresets;

            float[] slowSongPresets = { 5, 4, 2, 0, -2, 0, 3, 6, 7, 8 };
            this.slowSongPresets = slowSongPresets;

            float[] electronicPresets = { 6, 5, 0, -5, -4, 0, 6, 8, 8, 7 };
            this.electronicPresets = electronicPresets;

            float[] rockPresets = { 7, 4, -4, 7, -2, 1, 5, 7, 9, 9 };
            this.rockPresets = rockPresets;

            float[] countryPresets = { 5, 6, 2, -5, 1, 1, -5, 3, 8, 5 };
            this.countryPresets = countryPresets;

            float[] vocalPresets = { -2, -1, -1, 0, 3, 4, 3, 0, 0, 1 };
            this.vocalPresets = vocalPresets;

            float[] customPreset = EQ_Bands_For_Model_1_Reader.Read_Eq_Bands(Path_App + @"\User_Data\Data_Eq_Model_1.xml");
            this.customPreset = customPreset;

            float[][] presets = { popPresets, dancePresets, bluesPresets, classicalPresets, jazzPresets, slowSongPresets, electronicPresets, rockPresets, countryPresets, vocalPresets , customPreset };

            eQ_Bands_For_Model_1s = new List<EQ_Bands_For_Model_1>();

            for (int i = 0; i < 11; i++)
            {
                EQ_Bands_For_Model_1 eQ_Bands_ = new EQ_Bands_For_Model_1();
                eQ_Bands_.Eq_Name = eQ_ComboBoxItem_Name_For_Model_1s[i].Name;

                float[] preset = presets[i];

                eQ_Bands_For_Model_1s.Add(eQ_Bands_);

                for (int j = 0; j < 11; j++)
                {
                    switch (j)
                    {
                        case 0:
                            eQ_Bands_For_Model_1s[i].Band1 = preset[j];
                            break;
                        case 1:
                            eQ_Bands_For_Model_1s[i].Band2 = preset[j];
                            break;
                        case 2:
                            eQ_Bands_For_Model_1s[i].Band3 = preset[j];
                            break;
                        case 3:
                            eQ_Bands_For_Model_1s[i].Band4 = preset[j];
                            break;
                        case 4:
                            eQ_Bands_For_Model_1s[i].Band5 = preset[j];
                            break;
                        case 5:
                            eQ_Bands_For_Model_1s[i].Band6 = preset[j];
                            break;
                        case 6:
                            eQ_Bands_For_Model_1s[i].Band7 = preset[j];
                            break;
                        case 7:
                            eQ_Bands_For_Model_1s[i].Band8 = preset[j];
                            break;
                        case 8:
                            eQ_Bands_For_Model_1s[i].Band9 = preset[j];
                            break;
                        case 9:
                            eQ_Bands_For_Model_1s[i].Band10 = preset[j];
                            break;
                        case 10:
                            eQ_Bands_For_Model_1s[i].Band11 = 0;
                            break;
                    }
                }
            }

        }
        /// <summary>
        /// 选择均衡器音效
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        /// <exception cref="NotImplementedException"></exception>
        private void ComBox_Select_Eq_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            try
            {
                if (ComBox_Select_Eq.SelectedIndex > -1)
                {
                    EQ_Bands_For_Model_1 eQ_Bands_For_Model_1 = eQ_Bands_For_Model_1s[ComBox_Select_Eq.SelectedIndex];

                    Slider_Model_1_Eq_Num31.Value = eQ_Bands_For_Model_1.Band1;
                    Slider_Model_1_Eq_Num62.Value = eQ_Bands_For_Model_1.Band2;
                    Slider_Model_1_Eq_Num125.Value = eQ_Bands_For_Model_1.Band3;
                    Slider_Model_1_Eq_Num250.Value = eQ_Bands_For_Model_1.Band4;
                    Slider_Model_1_Eq_Num500.Value = eQ_Bands_For_Model_1.Band5;
                    Slider_Model_1_Eq_Num1k.Value = eQ_Bands_For_Model_1.Band6;
                    Slider_Model_1_Eq_Num2k.Value = eQ_Bands_For_Model_1.Band7;
                    Slider_Model_1_Eq_Num4k.Value = eQ_Bands_For_Model_1.Band8;
                    Slider_Model_1_Eq_Num8k.Value = eQ_Bands_For_Model_1.Band9;
                    Slider_Model_1_Eq_Num16k.Value = eQ_Bands_For_Model_1.Band10;
                    Slider_Model_1_Eq_Num20k.Value = eQ_Bands_For_Model_1.Band11;

                    TextBlock_Select_Eq.Text = eQ_Bands_For_Model_1.Eq_Name;

                    ComBox_Select_Eq.SelectedIndex = -1;
                }
            }
            catch
            {

            }
        }

        #region 弃用
        private void Slider_Model_1_Eq_Num31_ValueChanged(object sender, RoutedPropertyChangedEventArgs<Double> e)
        {
            
        }
        private void Slider_Model_1_Eq_Num62_ValueChanged(object sender, RoutedPropertyChangedEventArgs<Double> e)
        {
            
        }
        private void Slider_Model_1_Eq_Num125_ValueChanged(object sender, RoutedPropertyChangedEventArgs<Double> e)
        {
            
        }
        private void Slider_Model_1_Eq_Num250_ValueChanged(object sender, RoutedPropertyChangedEventArgs<Double> e)
        {
            
        }
        private void Slider_Model_1_Eq_Num500_ValueChanged(object sender, RoutedPropertyChangedEventArgs<Double> e)
        {
            
        }
        private void Slider_Model_1_Eq_Num1k_ValueChanged(object sender, RoutedPropertyChangedEventArgs<Double> e)
        {
            
        }
        private void Slider_Model_1_Eq_Num2k_ValueChanged(object sender, RoutedPropertyChangedEventArgs<Double> e)
        {
            
        }
        private void Slider_Model_1_Eq_Num4k_ValueChanged(object sender, RoutedPropertyChangedEventArgs<Double> e)
        {
            Text_Model_1_Eq_Num4k.Text = Slider_Model_1_Eq_Num4k.Value.ToString();
        }
        private void Slider_Model_1_Eq_Num8k_ValueChanged(object sender, RoutedPropertyChangedEventArgs<Double> e)
        {
            Text_Model_1_Eq_Num8k.Text = Slider_Model_1_Eq_Num8k.Value.ToString();
        }
        private void Slider_Model_1_Eq_Num16k_ValueChanged(object sender, RoutedPropertyChangedEventArgs<Double> e)
        {
            Text_Model_1_Eq_Num16k.Text = Slider_Model_1_Eq_Num16k.Value.ToString();
        }
        private void Slider_Model_1_Eq_Num20k_ValueChanged(object sender, RoutedPropertyChangedEventArgs<Double> e)
        {
            Text_Model_1_Eq_Num20k.Text = Slider_Model_1_Eq_Num20k.Value.ToString();
        }
        #endregion





        /// <summary>
        /// 拖动窗口
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Window_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            try
            {
                this.DragMove();
            }
            catch { }
        }

        /// <summary>
        /// 重置均衡器
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void SvgViewbox_Researt_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            try
            {
                Slider_Model_1_Eq_Num31.Value = 0;
                Slider_Model_1_Eq_Num62.Value = 0;
                Slider_Model_1_Eq_Num125.Value = 0;
                Slider_Model_1_Eq_Num250.Value = 0;
                Slider_Model_1_Eq_Num500.Value = 0;
                Slider_Model_1_Eq_Num1k.Value = 0;
                Slider_Model_1_Eq_Num2k.Value = 0;
                Slider_Model_1_Eq_Num4k.Value = 0;
                Slider_Model_1_Eq_Num8k.Value = 0;
                Slider_Model_1_Eq_Num16k.Value = 0;
                Slider_Model_1_Eq_Num20k.Value = 0;

                TextBlock_Select_Eq.Text = "无";

                if (ComBox_Select_Eq.SelectedIndex == 10)
                {
                    EQ_Bands_For_Model_1 eQ_Bands_For_Model_1 = eQ_Bands_For_Model_1s[
                        ComBox_Select_Eq.SelectedIndex];

                    // 定义 Slider 控件数组
                    Slider[] sliders = new Slider[]
                    {
                    Slider_Model_1_Eq_Num31,
                    Slider_Model_1_Eq_Num62,
                    Slider_Model_1_Eq_Num125,
                    Slider_Model_1_Eq_Num250,
                    Slider_Model_1_Eq_Num500,
                    Slider_Model_1_Eq_Num1k,
                    Slider_Model_1_Eq_Num2k,
                    Slider_Model_1_Eq_Num4k,
                    Slider_Model_1_Eq_Num8k,
                    Slider_Model_1_Eq_Num16k,
                    Slider_Model_1_Eq_Num20k
                    };

                    // 定义 int[] 数组
                    float[] values = new float[11];

                    // 循环遍历 Slider 控件并将其值赋给数组
                    for (int i = 0; i < sliders.Length; i++)
                    {
                        float value = (float)sliders[i].Value;

                        // 将值赋给数组
                        values[i] = value;
                    }
                    EQ_Bands_For_Model_1_Save.Save_Eq_Bands(Path_App + @"\User_Data\Data_Eq_Model_1.xml", values);

                    float[] customPreset = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
                    this.customPreset = customPreset;

                    eQ_Bands_For_Model_1s[10].Band1 = 0;
                    eQ_Bands_For_Model_1s[10].Band2 = 0;
                    eQ_Bands_For_Model_1s[10].Band3 = 0;
                    eQ_Bands_For_Model_1s[10].Band4 = 0;
                    eQ_Bands_For_Model_1s[10].Band5 = 0;
                    eQ_Bands_For_Model_1s[10].Band6 = 0;
                    eQ_Bands_For_Model_1s[10].Band7 = 0;
                    eQ_Bands_For_Model_1s[10].Band8 = 0;
                    eQ_Bands_For_Model_1s[10].Band9 = 0;
                    eQ_Bands_For_Model_1s[10].Band10 = 0;
                    eQ_Bands_For_Model_1s[10].Band11 = 0;
                }
            }
            catch
            {

            }
        }

        /// <summary>
        /// 退出均衡器界面
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void SvgViewbox_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            try
            {
                this.Visibility = Visibility.Collapsed;
            }
            catch
            {

            }
        }

        
    }
}
