using MoZhi_Song_Duration_Allocation.UserControlLibrary.MainWindow_Buttom_SingerKrcSinging_Panel.UserControl_ListviewItem_SingerKrc;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace MoZhi_Song_Duration_Allocation.UserControlLibrary.MainWindow_Buttom_SingerKrcSinging_Panel
{
    /// <summary>
    /// UserControl_SingerKrcSinging_Panel.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_SingerKrcSinging_Panel : UserControl
    {
        public UserControl_SingerKrcSinging_Panel()
        {
            InitializeComponent();

            Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";

            Init();
        }
        public ObservableCollection<UserControl_ListviewItem_SingerKrc.UserControl_ListviewItem_SingerKrc> userControl_ListviewItem_SingerKrcs;
        public void Move_Top()
        {
            /// 排序
            List<UserControl_ListviewItem_SingerKrc.UserControl_ListviewItem_SingerKrc> items = new List<UserControl_ListviewItem_SingerKrc.UserControl_ListviewItem_SingerKrc>();
            foreach (var item in userControl_ListviewItem_SingerKrcs)
            {
                items.Add(item);
            }
            items = items.OrderByDescending(item => item.stopwatch_Singer_Singing_Time_Text.Elapsed).ToList();


            double max = 0;
            string i_ = "";
            UserControl_ListviewItem_SingerKrc.UserControl_ListviewItem_SingerKrc temp = null;
            for (int i = 0; i < userControl_ListviewItem_SingerKrcs.Count; i++)
            {
                TimeSpan ts = userControl_ListviewItem_SingerKrcs[i].stopwatch_Singer_Singing_Time_Text.Elapsed;
                if (max < ts.TotalMilliseconds)
                {
                    max = ts.TotalMilliseconds;
                    temp = userControl_ListviewItem_SingerKrcs[i];
                    i_ = userControl_ListviewItem_SingerKrcs[i].textBlock_SingerName.Text.ToString();
                }
            }
            if (i_.Length > 0)
            {
                int i_num = 0;

                double num = (600 - (Singer_Name.Count * 80)) / 2; num += 33;
                for (int i = 0; i < ListBox_Items_SingerKrc_Animation.Children.Count;i++)
                {
                    UserControl_ListviewItem_SingerKrc.UserControl_ListviewItem_SingerKrc krc = (UserControl_ListviewItem_SingerKrc.UserControl_ListviewItem_SingerKrc)ListBox_Items_SingerKrc_Animation.Children[i];
                    if (krc.textBlock_SingerName.Text.ToString().Equals(i_))
                    {
                        i_num = i;
                    }
                    else
                    {
                        for (int k = 0; k < items.Count; k++)
                        {
                            if (items[k].textBlock_SingerName.Text.ToString().
                                Equals(krc.textBlock_SingerName.Text.ToString()))
                            {
                                double targetValue = num + 80 * k;
                                ListBox_Items_SingerKrc_Animation.Children[i].BeginAnimation(
                                    Canvas.TopProperty, 
                                    new DoubleAnimation(targetValue, TimeSpan.FromMilliseconds(500)));
                                break;
                            }
                        }
                    }
                }

                num = (600 - (Singer_Name.Count * 80)) / 2;num += 33;
                ListBox_Items_SingerKrc_Animation.Children[i_num].BeginAnimation(
                    Canvas.TopProperty, 
                    new DoubleAnimation(num, TimeSpan.FromMilliseconds(500)));
            }

            //ListBox_Items_SingerKrc_Animation.Items.Refresh();

            

        }

        string Path_App;
        public ArrayList Singer_Name;
        private void Init()
        {
            UserControl_ListviewItem_SingerKrc.UserControl_ListviewItem_SingerKrc userControl_ListviewItem_SingerKrc = new UserControl_ListviewItem_SingerKrc.UserControl_ListviewItem_SingerKrc();

            //检测歌手数量
            Singer_Name = new ArrayList
            {
                /*"柳智敏KARINA","金旼炡WINTER","宁艺卓NINGNING","内永枝利GISELLE","aespa ALL"*/

                "KAI金钟仁",
                "BAEKHYUN边伯贤",
                "CHANYEOL朴灿烈",
                "SUHO金俊勉",
                "SEHUN吴世勋",
                "CHEN金钟大",
                "EXO全体"

                /*"KAI金钟仁",
                "BAEKHYUN边伯贤",
                "CHANYEOL朴灿烈",
                "SUHO金俊勉",
                "SEHUN吴世勋",
                "D.O都敬秀",
                "CHEN金钟大",
                "XIUMIN金珉锡",
                "LAY张艺兴",*/
                /*"TAO黄子韬",
                "LUHAN鹿晗",
                "KRIS吴亦凡"*/
            };

            userControl_ListviewItem_SingerKrcs = new ObservableCollection<UserControl_ListviewItem_SingerKrc.UserControl_ListviewItem_SingerKrc>();

            //正序添加，除了组合名
            for (int i = 0; i < Singer_Name.Count - 1; i++)
            {
                userControl_ListviewItem_SingerKrc = new UserControl_ListviewItem_SingerKrc.UserControl_ListviewItem_SingerKrc();
                userControl_ListviewItem_SingerKrc.Name = "Singer_No_"+ i;
                userControl_ListviewItem_SingerKrc.textBlock_Time.Text = "0.0";
                userControl_ListviewItem_SingerKrc.textBlock_SingerName.Text = Singer_Name[i].ToString();
                userControl_ListviewItem_SingerKrc.Singer_Image.ImageSource = new BitmapImage(new Uri(Path_App + @"\Singer_Head\" + Singer_Name[i].ToString() + ".jpg"));

                userControl_ListviewItem_SingerKrc.Margin = new Thickness(0, 0, 0, 10);

                userControl_ListviewItem_SingerKrcs.Add(userControl_ListviewItem_SingerKrc);
            }

            double num = (600 - (Singer_Name.Count * 80)) / 2;
            foreach (var item in userControl_ListviewItem_SingerKrcs)
            {
                ListBox_Items_SingerKrc_Animation.Children.Add(item);
                ListBox_Items_SingerKrc_Animation.Children[
                    ListBox_Items_SingerKrc_Animation.Children.Count - 1].SetValue(Canvas.TopProperty, num);
                num += 80;
            }

            //添加组合名，合唱时长分配
            //Singer_Name.Add("EXO全体");
            //Singer_Name.Add("@全体成员");
        }
        /*
         * 歌词时长分配守则：
         *      Mrc文件，歌词行中需要留出时间空隙
         *          防止定时器因为时间线程调度不够，而错过对象的获取
         *          
         *      Crc文件，歌词行歌手名的前后顺序，需要按照Singer_Name数组的排放顺序——顺位
         *          如：(SUHO金俊勉)(CHEN金钟大)   而不能是(CHEN金钟大)(SUHO金俊勉)
         *          
         *      Crc文件格式：
         *          (EXO全体)出口标志灯
                    (EXO全体)就此熄灭
                    (SUHO金俊勉)(CHEN金钟大)到此为止吧从我身边消失吧
                    (BAEKHYUN边伯贤)(CHANYEOL朴灿烈)某夜
                    (BAEKHYUN边伯贤)(CHANYEOL朴灿烈)在黑暗中看到
                    (BAEKHYUN边伯贤)(CHANYEOL朴灿烈)追赶我的奇妙身影
                    (EXO全体)出口标志灯
                    (EXO全体)就此熄灭
                    (SUHO金俊勉)(CHEN金钟大)我看着镜子中的自己
                    (SUHO金俊勉)(CHEN金钟大)从我身边消失吧
                    (SEHUN吴世勋)走开
                    (SEHUN吴世勋)从我身边消失吧
         */
    }
}