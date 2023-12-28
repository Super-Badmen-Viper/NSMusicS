using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media.Animation;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.MusicPlayer_Model_Control_Albums.ViewModel_Control
{
    public class ScrollViewerAnimation : ScrollViewer
    {
        //记录上一次的滚动位置
        private double LastLocation = 0;
        //记录上一次滚动是否完成
        private bool LastScroll = true;
        //重写鼠标滚动事件
        protected override void OnMouseWheel(MouseWheelEventArgs e)
        {
            if (LastScroll == true)
            {
                double WheelChange = e.Delta;
                //可以更改一次滚动的距离倍数 (WheelChange可能为正负数!)
                double newOffset = LastLocation - (WheelChange * 2);
                //Animation并不会改变真正的VerticalOffset(只是它的依赖属性) 所以将VOffset设置到上一次的滚动位置 (相当于衔接上一个动画)
                ScrollToVerticalOffset(LastLocation);
                //碰到底部和顶部时的处理
                if (newOffset < 0)
                    newOffset = 0;
                if (newOffset > ScrollableHeight)
                    newOffset = ScrollableHeight;

                LastScroll = false;

                AnimateScroll(newOffset);
                LastLocation = newOffset;
                //告诉ScrollViewer我们已经完成了滚动
                e.Handled = true;
            }
        }
        private void AnimateScroll(double ToValue)
        {
            //为了避免重复，先结束掉上一个动画
            BeginAnimation(ScrollViewerBehavior.VerticalOffsetProperty, null);
            DoubleAnimation Animation = new DoubleAnimation();
            Animation.EasingFunction = new CubicEase() { EasingMode = EasingMode.EaseOut };
            Animation.From = VerticalOffset;
            Animation.To = ToValue;
            Animation.Duration = TimeSpan.FromMilliseconds(200);
            Animation.Completed += Animation_Completed;
            Timeline.SetDesiredFrameRate(Animation, 60);
            BeginAnimation(ScrollViewerBehavior.VerticalOffsetProperty, Animation);
        }
        private void Animation_Completed(object? sender, EventArgs e)
        {
            LastScroll = true;
        }
    }

}
