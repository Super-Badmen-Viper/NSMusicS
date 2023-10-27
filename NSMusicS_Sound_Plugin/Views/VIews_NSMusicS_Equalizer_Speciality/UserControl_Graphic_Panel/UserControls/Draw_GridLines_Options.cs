using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows;

namespace NSMusicS_Sound_Plugin.Views.VIews_NSMusicS_Equalizer_Speciality.UserControl_Graphic_Panel.UserControls
{
    public class GridOptions
    {
        //暂时不处理实时显示的事情
        #region 显示边框信息
        public static readonly DependencyProperty ShowBorderProperty =
            DependencyProperty.RegisterAttached("ShowBorder", typeof(bool), typeof(GridOptions)
                , new PropertyMetadata(OnShowBorderChanged));
        public static bool GetShowBorder(DependencyObject obj)
        {
            return (bool)obj.GetValue(ShowBorderProperty);
        }

        public static void SetShowBorder(DependencyObject obj, bool value)
        {
            obj.SetValue(ShowBorderProperty, value);
        }

        public static void OnShowBorderChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            var grid = d as Grid;
            if ((bool)e.OldValue)
                grid.Loaded -= (s, arg) => { };
            else
            {
                grid.Loaded += new RoutedEventHandler(GridLoaded);
            }
        }
        #endregion
        #region 线宽信息
        public static readonly DependencyProperty LineThicknessProperty =
           DependencyProperty.RegisterAttached("LineThickness", typeof(double), typeof(GridOptions),
               new PropertyMetadata(1d, OnGridLineThicknessChanged));
        public static double GetLineThickness(DependencyObject obj)
        {
            return (double)obj.GetValue(LineThicknessProperty);
        }

        public static void SetLineThickness(DependencyObject obj, double value)
        {
            obj.SetValue(LineThicknessProperty, value);
        }


        public static void OnGridLineThicknessChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {

        }
        #endregion

        public static readonly DependencyProperty LineBrushProperty =
            DependencyProperty.RegisterAttached("LineBrush", typeof(Brush), typeof(GridOptions),
                new PropertyMetadata(Brushes.Gray, OnGridLineBrushChanged));

        #region 线画刷问题
        public static Brush GetLineBrush(DependencyObject obj)
        {
            var brush = (Brush)obj.GetValue(LineBrushProperty);
            return brush ?? Brushes.LightGray;
        }

        public static void SetLineBrush(DependencyObject obj, Brush value)
        {
            obj.SetValue(LineBrushProperty, value);
        }

        public static void OnGridLineBrushChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {

        }
        #endregion

        private static void GridLoaded(object sender, RoutedEventArgs e)
        {
            #region 思路
            /*
             * 1、覆盖所有单元格都要包围上边框。
             * 2、边框线不能存在重复。每个单元格绘制【右下】部分，主体绘制右上部分
             */
            #endregion
            var grid = sender as Grid;
            var rowCount = Math.Max(1, grid.RowDefinitions.Count);
            var columnCount = Math.Max(1, grid.ColumnDefinitions.Count);
            #region 初始化标准数组
            int[,] flagArray = new int[rowCount, columnCount];
            #endregion
            var controls = grid.Children;
            var count = controls.Count;
            var settingThickness = GetLineThickness(grid);
            var borderBrush = GetLineBrush(grid);
            for (int i = 0; i < count; i++)
            {
                var item = controls[i] as FrameworkElement;
                var row = Grid.GetRow((item));
                var column = Grid.GetColumn(item);
                var rowSpan = Grid.GetRowSpan(item);
                var columnSpan = Grid.GetColumnSpan(item);
                for (int rowTemp = 0; rowTemp < rowSpan; rowTemp++)
                {
                    for (int colTemp = 0; colTemp < columnSpan; colTemp++)
                    {
                        flagArray[rowTemp + row, colTemp + column] = 1;
                    }
                }

                var border = CreateBorder(row, column, rowSpan, columnSpan, settingThickness);
                border.BorderBrush = borderBrush;

                grid.Children.RemoveAt(i);
                border.Child = item;
                grid.Children.Insert(i, border);
            }

            #region 整理为填充单元格
            for (int i = 0; i < rowCount; i++)
            {
                for (int k = 0; k < columnCount; k++)
                {
                    if (flagArray[i, k] == 0)
                    {
                        var border = CreateBorder(i, k, 1, 1, settingThickness);
                        border.BorderBrush = borderBrush;
                        grid.Children.Add(border);
                    }
                }
            }
            #endregion
        }

        private static Border CreateBorder(int row, int column, int rowSpan, int columnSpan, double thickness)
        {
            var useThickness = new Thickness(0, 0, thickness, thickness);
            if (row == 0)
                useThickness.Top = thickness;
            if (column == 0)
                useThickness.Left = thickness;
            var border = new Border()
            {
                BorderThickness = useThickness,
            };
            Grid.SetRow(border, row);
            Grid.SetColumn(border, column);
            Grid.SetRowSpan(border, rowSpan);
            Grid.SetColumnSpan(border, columnSpan);
            return border;
        }
    }
}
