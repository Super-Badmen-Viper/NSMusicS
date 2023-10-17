using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using TagLib;

namespace NSMusicS
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            /*SplashScreen splashScreen = new SplashScreen("/Resource/Music_Album.png");
            splashScreen.Show(true);*/

            /*MainWindow_Lottie_Load mainWindow_Lottie_Load = new MainWindow_Lottie_Load();
            mainWindow_Lottie_Load.Show();*/

            /*//上面Show()方法中设置为true时，程序启动完成后启动图片就会自动关闭，
            //设置为false时，启动图片不会自动关闭，需要使用下面一句设置显示时间，例如23s
            splashScreen.Close(new TimeSpan(0, 0, 23));
            base.OnStartup(e);*/
        }
    }
}
