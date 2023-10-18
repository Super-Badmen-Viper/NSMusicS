using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace NSMusicS_Lottie_Begin
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            // 当前.exe 应用锁
            ProcessManager.GetProcessLock();

            // 外部NSMsuicS.exe 应用锁（判定指定exe是否执行）
            filePath = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"NSMusicS\Resource\Temp_System\Close.txt";
            if (File.Exists(filePath))
            {
                bool close = false;
                using (var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                {
                    using (var reader = new StreamReader(fileStream))
                    {
                        // 检测文件内容中是否包含 "1" 
                        if (reader.ReadToEnd().Contains("open"))
                        {
                            fileStream.Dispose(); reader.Dispose();
                            close = true;
                            
                        }
                    }
                }
                if (close)
                    Environment.Exit(-1);

            }

            WindowStartupLocation = WindowStartupLocation.CenterScreen;

            string installer1Path = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"NSMusicS\NSMusicS.exe";
            StartInstaller(installer1Path);

            // 初始化定时器
            DispatcherTimer timer = new DispatcherTimer(); // 100毫秒间隔
            timer.Tick += Timer_Tick;
            timer.Interval += new TimeSpan(0, 0, 0, 0, 100);
            timer.Start();
        }
        static string filePath;

        static Process StartInstaller(string installerPath)
        {
            try
            {
                Process installerProcess = new Process();
                installerProcess.StartInfo.FileName = installerPath;

                installerProcess.Start();

                return installerProcess;
            }
            catch { return null; }
        }

        int time_nums = 0;
        private void Timer_Tick(object? sender, EventArgs e)
        {
            if (File.Exists(filePath))
            {
                bool close = false;
                using (var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                {
                    using (var reader = new StreamReader(fileStream))
                    {
                        // 检测文件内容中是否包含 "1" 
                        if (reader.ReadToEnd().Contains("open"))
                        {
                            fileStream.Dispose(); reader.Dispose();
                            close = true;

                        }
                    }
                }
                if (close)
                    Environment.Exit(-1);

                //超过10s
                time_nums++;
                TextBlock_Loading_Text.Text += ".";
                if (time_nums % 3 == 0)
                {
                    TextBlock_Loading_Text.Text = "初始化加载中,,请稍候...";
                }

                /*if (time_nums == 100)
                {
                    if (IsProcessRunning(System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"/NSMusicS/NSMusicS.exe"))
                    {
                        Environment.Exit(-1);
                    }
                }*/
            }else
                Environment.Exit(-1);

        }
        

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
    }
}
