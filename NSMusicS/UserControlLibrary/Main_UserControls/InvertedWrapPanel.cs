using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows;

namespace NSMusicS.UserControlLibrary.Main_UserControls
{
    public class InvertedWrapPanel : WrapPanel
    {
        private int itemsPerRow = 0;

        protected override Size MeasureOverride(Size availableSize)
        {
            if (Orientation == Orientation.Horizontal)
            {
                return base.MeasureOverride(availableSize);
            }
            else //Orientation is vertical
            {
                double w = availableSize.Width;

                double maxChildWidth = 0;

                foreach (UIElement child in Children)
                {
                    //Get the current childs desired size parameters
                    child.Measure(availableSize);

                    //Store off the maximum child width
                    if (child.DesiredSize.Width > maxChildWidth)
                        maxChildWidth = child.DesiredSize.Width;
                }

                //See how many items we can fit in a row
                itemsPerRow = Convert.ToInt32(Math.Floor(w / maxChildWidth));

                return base.MeasureOverride(availableSize);
            }
        }

        protected override Size ArrangeOverride(Size finalSize)
        {
            if (Orientation == Orientation.Horizontal)
            {
                return base.ArrangeOverride(finalSize);
            }
            else //Orientation is vertical
            {
                double currentX = 0;
                double currentY = 0;

                int col = 0;

                double lastX = 0;
                double lastWidth = 0;

                //Arrays to store differing column heights
                double[] lastY = new double[itemsPerRow];
                double[] lastHeight = new double[itemsPerRow];

                double[] colHeights = new double[itemsPerRow];

                foreach (UIElement child in Children)
                {
                    //If we've reached the end of a row
                    if (col >= itemsPerRow)
                    {
                        col = 0;
                        currentX = 0; //reset the x-coordinate for first column
                    }
                    else
                        currentX = lastX + lastWidth; //Increase the x-coordinate

                    //Increase the y-coordinates for the current column
                    currentY = lastY[col] + lastHeight[col];

                    //Draw the element
                    child.Arrange(new Rect(currentX, currentY, child.DesiredSize.Width, child.DesiredSize.Height));

                    //Store off the current child's parameters
                    lastX = currentX;
                    lastWidth = child.DesiredSize.Width;

                    lastY[col] = currentY;
                    lastHeight[col] = child.DesiredSize.Height;

                    colHeights[col] += child.DesiredSize.Height;

                    col++;
                }

                //Set the height of the panel to the max column height.
                //Otherwise scroll bar will set height to infinity.
                double maxHeight = 0;

                foreach (double d in colHeights)
                {
                    if (d > maxHeight)
                        maxHeight = d;
                }

                base.Height = maxHeight;

                return finalSize;
            }
        }
    }
}
