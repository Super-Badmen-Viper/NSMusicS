using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using TagLib;
using System.IO;

namespace NSMusicS
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        protected override async void OnStartup(StartupEventArgs e)
        {
            AppDomain.CurrentDomain.UnhandledException += (sender, e) =>
            {
                Exception exception = e.ExceptionObject as Exception;
                if (exception != null)
                {
                    //写入信息，标识此应用已关闭
                    System.IO.File.WriteAllText(
                        System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource" + @"/Temp_System/Close.txt",
                        "close");
                }
            };

        }

        /*protected override async void OnStartup(StartupEventArgs e)
        {
            // 异步初始化其他窗口或资源
            await InitializeOtherWindowsAsync();

            // 如果有其他初始化操作，可以在此等待完成
        }

        private async Task InitializeOtherWindowsAsync()
        {
            await Task.Run(() =>
            {
                // 异步初始化其他窗口或资源的逻辑
                System.Threading.Thread.Sleep(2000); // 模拟异步初始化操作
            });

            // 在主线程上显示其他窗口
            Application.Current.Dispatcher.Invoke(() =>
            {
                var otherWindow = new MainWindow();
                otherWindow.Show();
            });
        }*/

    }

    /*SplashScreen splashScreen = new SplashScreen("/Resource/Music_Album.png");
            splashScreen.Show(true);*/
    /*//上面Show()方法中设置为true时，程序启动完成后启动图片就会自动关闭，
    //设置为false时，启动图片不会自动关闭，需要使用下面一句设置显示时间，例如23s
    splashScreen.Close(new TimeSpan(0, 0, 23));
    base.OnStartup(e);*/
}