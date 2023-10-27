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
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace NSMusicS_Sound_Plugin.Views.VIews_NSMusicS_Equalizer_Speciality.UserControl_Graphic_Panel.UserControls
{
    /// <summary>
    /// Panel_Reference_Gridlines.xaml 的交互逻辑
    /// </summary>
    public partial class Panel_Reference_Gridlines : UserControl
    {
        public Panel_Reference_Gridlines()
        {
            InitializeComponent();
        }

        /// <summary>
        /// 网格线 X轴
        /// 横轴线条 + 此线条的Label名称
        /// </summary>
        public ObservableCollection<(RowDefinition, string)> X_RowDefinitions 
            = new ObservableCollection<(RowDefinition, string)>();

        /// <summary>
        /// 网格线 Y轴
        /// 纵轴线条 + 此线条的Label名称
        /// </summary>
        public ObservableCollection<(ColumnDefinition, string)> Y_ColumnDefinitions 
            = new ObservableCollection<(ColumnDefinition, string)>();

        /// <summary>
        /// 生成此面板 网格线
        /// </summary>
        /// <param name="X_RowNums">X轴(行)数：EQ区间值</param>
        /// <param name="X_Row_Height">行高</param>
        /// <param name="X_Intervals">X轴区间</param>
        /// 
        /// <param name="Y_ColumnNums">Y轴(列)数：增益值</param>
        /// <param name="Y_Column_Width">列宽</param>
        /// 
        /// <param name="Equal_Proportion">网格线是否等比例</param>
        public void Create_Reference_Gridlines(
            int X_RowNums, GridLength X_Row_Height, int X_Intervals,
            int Y_ColumnNums, List<GridLength> Y_Column_Width,
            bool Equal_Proportion
            )
        {
            //初始化重置数据

            //21,20,10 ->   -100到100，每隔10一个区间(100,90,80,.....,-90,-100)
            X_RowDefinitions.Clear();
            Panel_Gridlines.RowDefinitions.Clear();
            //计算最大值与最小值
            int Max = (X_RowNums-1) * X_Intervals / 2;//100
            //生成每个网格线的Label
            List<string> X_Labels = new List<string>();
            for (int i = 0; i < X_RowNums; i++)
            {
                X_Labels.Add(Max.ToString());
                Max -= X_Intervals;
            }
            //
            for (int i = 0; i < X_RowNums; i++)
            {
                RowDefinition rowDefinition = new RowDefinition();
                if (!Equal_Proportion)
                    rowDefinition.Height = IntToGridLength(X_Row_Height.Value);

                X_RowDefinitions.Add((rowDefinition,X_Labels[i]));
                Panel_Gridlines.RowDefinitions.Add(rowDefinition);
            }

            Y_ColumnDefinitions.Clear();
            Panel_Gridlines.ColumnDefinitions.Clear();
            //
            List<string> Y_labels = new List<string>();
            foreach (GridLength gridLength in Y_Column_Width)
            {
                Y_labels.Add(ConvertToKNotation(Convert.ToInt32(gridLength.Value)));
            }
            for (int i = 0; i < Y_ColumnNums; i++)
            {
                ColumnDefinition columnDefinition = new ColumnDefinition();
                if (!Equal_Proportion)
                    columnDefinition.Width = IntToGridLength(Y_Column_Width[i].Value);

                Y_ColumnDefinitions.Add((columnDefinition, Y_labels[i]));
                Panel_Gridlines.ColumnDefinitions.Add(columnDefinition);
            }


            //多增加一行一列，用以显示文字
            Panel_Gridlines.RowDefinitions.Add(new RowDefinition());
            Panel_Gridlines.ColumnDefinitions.Add(new ColumnDefinition());
            Panel_Gridlines.RowDefinitions.Add(new RowDefinition());
            Panel_Gridlines.ColumnDefinitions.Add(new ColumnDefinition());
            // 500:330  45:16

            //
            for (int i = 0; i < Panel_Gridlines.RowDefinitions.Count - 2; i++)
            {
                TextBlock textBlock = new TextBlock();
                textBlock.HorizontalAlignment = HorizontalAlignment.Center;
                textBlock.VerticalAlignment = VerticalAlignment.Center;
                textBlock.TextAlignment = TextAlignment.Center;
                textBlock.Margin = new Thickness(-45, -16, 0, 0);
                textBlock.Text = X_Labels[i];
                Grid.SetRow(textBlock, i + 1); // 设置文本块所在的列
                Grid.SetColumn(textBlock, 1);
                Panel_Gridlines.Children.Add(textBlock);
            }
            for (int i = 0; i < Panel_Gridlines.ColumnDefinitions.Count - 2; i++)
            {
                TextBlock textBlock = new TextBlock();
                textBlock.HorizontalAlignment = HorizontalAlignment.Center;
                textBlock.VerticalAlignment = VerticalAlignment.Center;
                textBlock.TextAlignment = TextAlignment.Center;
                textBlock.Text = Y_labels[i];
                textBlock.Margin = new Thickness(-45, -16, 0, 0);
                Grid.SetRow(textBlock, X_RowNums + 1);
                Grid.SetColumn(textBlock, i + 2);
                Panel_Gridlines.Children.Add(textBlock);
            }

            

            Console.WriteLine();
        }
        

        /// <summary>
        /// 简化EQ频段的数值单位 （1000简化为k）
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        static string ConvertToKNotation(int number)
        {
            if (number < 1000)
            {
                return number.ToString();
            }
            else if (number < 10000)
            {
                double kValue = number / 1000.0;
                return kValue.ToString("0.0") + "k";
            }
            else
            {
                double kValue = number / 1000.0;
                return kValue.ToString("0") + "k";
            }
        }

        /// <summary>
        /// 计算Grid 网格线高度（不采用统一比例）
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        static GridLength IntToGridLength(double value)
        {
            if (value < 1)
            {
                return new GridLength(0, GridUnitType.Auto);
            }
            return new GridLength(value, GridUnitType.Star);
        }

        private void UserControl_SizeChanged(object sender, SizeChangedEventArgs e)
        {
            Panel_Gridlines.Width = this.Width - 60;
            Panel_Gridlines.Height = this.Height - 60;
            Panel_Gridlines.Margin = new Thickness(30);
        }
    }
}
