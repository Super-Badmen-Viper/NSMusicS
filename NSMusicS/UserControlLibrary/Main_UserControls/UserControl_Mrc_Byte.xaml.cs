using System;
using System.Collections.Generic;
using System.Globalization;
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

namespace NSMusicS.UserControlLibrary.Main_UserControls
{
    /// <summary>
    /// UserControl_Mrc_Byte.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Mrc_Byte : UserControl
    {
        public UserControl_Mrc_Byte()
        {
            InitializeComponent();
        }

        public double _width;
        public double _height;
        private void TextBlock_1_DataContextChanged(object sender, DependencyPropertyChangedEventArgs e)
        {
            (_width,_height) = MeasureString(this.TextBlock_1, this.TextBlock_1.Text);
        }

        private (double,double) MeasureString(TextBlock textBlock, string candidate)
        {
            var formattedText = new FormattedText(
                candidate,
                CultureInfo.CurrentCulture,
                FlowDirection.LeftToRight,
                new Typeface(textBlock.FontFamily, textBlock.FontStyle, textBlock.FontWeight, textBlock.FontStretch),
                textBlock.FontSize,
                Brushes.Black,
                new NumberSubstitution(),
                TextFormattingMode.Display,
                1);

            double wid_space = candidate.Count(char.IsWhiteSpace) * 4;

            return (formattedText.Width + wid_space, formattedText.Height);
        }
    }
}
