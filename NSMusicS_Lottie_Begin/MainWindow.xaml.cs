using AutoUpdaterDotNET;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Forms;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;
using Application = System.Windows.Forms.Application;
using MessageBox = System.Windows.Forms.MessageBox;
using DialogResult = System.Windows.Forms.DialogResult;

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

            WindowStartupLocation = WindowStartupLocation.CenterScreen;

            AutoUpdater.Start(@"https://github.com/BeatBeatQQ/MoZhiMusicPlayer/releases/download/NSMusicS_Win3.0_Update/NSMusicS_AutoUpdate.xml");
            AutoUpdater.AppTitle = "升级更新";

            //不显示“稍后提醒”按钮
            AutoUpdater.ShowRemindLaterButton = false;

            //强制选项将隐藏稍后提醒，跳过和关闭按钮的标准更新对话框。
            //AutoUpdater.Mandatory = true;
            //AutoUpdater.UpdateMode = Mode.Forced;

            //将应用程序设定不需要管理员权限来替换旧版本
            AutoUpdater.RunUpdateAsAdmin = false;

            //设置为要下载更新文件的文件夹路径。如果没有提供，则默认为临时文件夹。
            AutoUpdater.DownloadPath = Environment.CurrentDirectory.Replace("\\NSMusicS_Win_3.0", "");

            //设置zip解压路径
            AutoUpdater.InstallationPath = Environment.CurrentDirectory.Replace("\\NSMusicS_Win_3.0", "");

            //自定义处理更新逻辑事件
            AutoUpdater.CheckForUpdateEvent += AutoUpdaterOnCheckForUpdateEvent;
        }
        private void AutoUpdaterOnCheckForUpdateEvent(UpdateInfoEventArgs args)
        {
            if (args.Error == null)
            {
                if (args.IsUpdateAvailable)
                {
                    DialogResult dialogResult;
                    if (args.Mandatory.Value)
                    {
                        dialogResult =
                            MessageBox.Show(
                                $@"新版本 {args.CurrentVersion} 可更新. 您正在使用版本 {args.InstalledVersion}. 这是必需的更新。按“确定”开始更新应用程序.", @"可用更新",
                                MessageBoxButtons.OK,
                                MessageBoxIcon.Information);
                    }
                    else
                    {
                        dialogResult =
                            MessageBox.Show(
                                $@"有新版本 {args.CurrentVersion} 可更新. 您正在使用版本 {args.InstalledVersion}. 是否立即更新应用程序？", @"可用更新",
                                MessageBoxButtons.YesNo,
                                MessageBoxIcon.Information);
                    }

                    if (dialogResult.Equals(System.Windows.Forms.DialogResult.Yes) || dialogResult.Equals(System.Windows.Forms.DialogResult.OK))
                    {
                        try
                        {
                            if (AutoUpdater.DownloadUpdate(args))
                            {
                                Application.Exit();
                                Close();
                            }
                        }
                        catch (Exception exception)
                        {
                            MessageBox.Show(exception.Message, exception.GetType().ToString(), MessageBoxButtons.OK,
                                MessageBoxIcon.Error);
                        }
                    }
                }
                else
                {
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

                    string installer1Path = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"NSMusicS\NSMusicS.exe";
                    StartInstaller(installer1Path);

                    // 初始化定时器
                    DispatcherTimer timer = new DispatcherTimer(); // 100毫秒间隔
                    timer.Tick += Timer_Tick;
                    timer.Interval += new TimeSpan(0, 0, 0, 0, 100);
                    timer.Start();
                }
                /*else
                {
                    MessageBox.Show(@"There is no update available please try again later.", @"No update available",
                        MessageBoxButtons.OK, MessageBoxIcon.Information);
                }*/
            }
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
