using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Effects;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using static MoZhiMusicPlayer_GithubAuthor_XiangCheng.MainWindow;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.MusicPlayer_Main.UserControls
{
    /// <summary>
    /// UserControl_Spectrum_Visualization.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Spectrum_Visualization : UserControl
    {
        public UserControl_Spectrum_Visualization()
        {
            InitializeComponent();
        }

        public class Rectangle_Spectrum_Visualization
        {

        }

        private void UserControl_Loaded(object sender, RoutedEventArgs e)
        {

            for (int i = 0; i < 71; i++)
            {
                Canvas canvas = new Canvas
                {
                    Name = "canvas" + (i + 1),
                    Width = 100,
                    Height = 100,
                    HorizontalAlignment = HorizontalAlignment.Left,
                    VerticalAlignment = VerticalAlignment.Top
                };
                Rectangle rectangle = new Rectangle
                {
                    Name = "rectangle" + (i + 1),
                    Width = 60,
                    Height = 80,
                    Margin = new Thickness(20, 20, 20, 20),
                    RenderTransformOrigin = new Point(0.5, 0.5)
                };
                TransformGroup transformGroup = new TransformGroup();
                transformGroup.Children.Add(new ScaleTransform());
                transformGroup.Children.Add(new SkewTransform());
                transformGroup.Children.Add(new RotateTransform { Angle = 180 });
                transformGroup.Children.Add(new TranslateTransform());
                rectangle.RenderTransform = transformGroup;

                LinearGradientBrush linearGradientBrush = new LinearGradientBrush
                {
                    StartPoint = new Point(0, 0),
                    EndPoint = new Point(0, 1)
                };

                TranslateTransform translateTransform = new TranslateTransform
                {
                    Y = -0.5
                };
                linearGradientBrush.RelativeTransform = translateTransform;
                linearGradientBrush.GradientStops.Add(new GradientStop { Color = Colors.White, Offset = 0.51 });
                linearGradientBrush.GradientStops.Add(new GradientStop { Color = Color.FromArgb(255, 0, 255, 162), Offset = 0.49 });
                rectangle.Fill = linearGradientBrush;

                EventTrigger eventTrigger = new EventTrigger
                {
                    RoutedEvent = UIElement.MouseLeftButtonDownEvent
                };
                Storyboard storyboard = new Storyboard();
                DoubleAnimation doubleAnimation = new DoubleAnimation
                {
                    Duration = TimeSpan.FromSeconds(0.5),
                    By = 0.2
                };
                Storyboard.SetTarget(doubleAnimation, rectangle);
                Storyboard.SetTargetProperty(doubleAnimation, new PropertyPath("(UIElement.RenderTransform).(TranslateTransform.Y)"));
                storyboard.Children.Add(doubleAnimation);
                BeginStoryboard beginStoryboard = new BeginStoryboard
                {
                    Storyboard = storyboard
                };
                eventTrigger.Actions.Add(beginStoryboard);
                rectangle.Triggers.Add(eventTrigger);

                rectangle.Effect = new DropShadowEffect
                {
                    Color = Colors.White,
                    BlurRadius = 4,
                    ShadowDepth = 1,
                    Opacity = 1,
                    Direction = 90,
                    RenderingBias = RenderingBias.Performance
                };

                canvas.Children.Add(rectangle);
                StackPanel_Test.Children.Add(canvas);
            }


        }


        /* private void Button_OnClick(object sender, RoutedEventArgs e) { 
             var storyboard = new Storyboard(); 
             var doubleAnimation = new DoubleAnimation(); 
             Storyboard.SetTarget(doubleAnimation, ButtonTranslateTransform); 
             Storyboard.SetTargetProperty(doubleAnimation, new PropertyPath(TranslateTransform.XProperty)); 
             doubleAnimation.To = 100; 
             doubleAnimation.Duration = new Duration(TimeSpan.FromSeconds(2)); 
             storyboard.Children.Add(doubleAnimation); 
             storyboard.Begin(); 
         }
         private void Button_OnClick(object sender, RoutedEventArgs e) {
             var storyboard = new Storyboard(); 
             var doubleAnimation = new DoubleAnimation(); 
             Storyboard.SetTarget(doubleAnimation, Button); 
             Storyboard.SetTargetProperty(doubleAnimation, new PropertyPath("(UIElement.RenderTransform).(TranslateTransform.X)")); 
             doubleAnimation.To = 100; 
             doubleAnimation.Duration = new Duration(TimeSpan.FromSeconds(2)); 
             storyboard.Children.Add(doubleAnimation); 
             storyboard.Begin(); 
         }*/

    }
}
