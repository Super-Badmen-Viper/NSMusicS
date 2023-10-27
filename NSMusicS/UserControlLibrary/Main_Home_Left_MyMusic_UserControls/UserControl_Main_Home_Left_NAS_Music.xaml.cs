using NSMusicS.Services.Services_For_NAS;
//using SMBLibrary.SMB1;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
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

namespace NSMusicS.UserControlLibrary.Main_Home_Left_MyMusic_UserControls
{
    /// <summary>
    /// UserControl_Main_Home_Left_NAS_Music.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Main_Home_Left_NAS_Music : UserControl
    {
        public UserControl_Main_Home_Left_NAS_Music()
        {
            InitializeComponent();

           /* userControl_Text_Input_Account.SvgViewbox_Icon.Source = brush_Account;
            userControl_Text_Input_PassWord.SvgViewbox_Icon.Source = brush_PassWord;
            userControl_Text_Input_IP_Address.SvgViewbox_Icon.Source = brush_IP_Adress;*/

            userControl_Text_Input_Account.TextBock_Explain.Text = "账号";
            userControl_Text_Input_PassWord.TextBock_Explain.Text = "密码";
            userControl_Text_Input_IP_Address.TextBock_Explain.Text = "IP地址";

            //Button_Login_Nas.MouseLeftButtonDown += Button_Login_Nas_MouseLeftButtonDown;
        }

        /*public Uri brush_Account
            = new Uri(@"Resource\\Button_Image_Svg\\账号.svg", UriKind.Relative);
        public Uri brush_PassWord
            = new Uri(@"Resource\\Button_Image_Svg\\密码.svg", UriKind.Relative);
        public Uri brush_IP_Adress
            = new Uri(@"Resource\\Button_Image_Svg\\ip.svg", UriKind.Relative);

        /// <summary>
        /// 连接状态
        /// </summary>
        public static bool isConnected;
        /// <summary>
        /// 共享文件夹列表
        /// </summary>
        public static List<string> shares;
        /// <summary>
        /// 获取选中的共享文件夹，其中的文件列表
        /// </summary>
        public static List<FindInformation> fileList2;
        /// <summary>
        /// 获取选中的文件的byte[]流
        /// </summary>
        public static byte[] data;

        /// <summary>
        /// 登录，连接至Nas
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Button_Login_Nas_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            try
            {
                try
                {
                    // NAS WebDAV URL
                    string webDavUrl = userControl_Text_Input_IP_Address.Text_Box_Text.Text.ToString();

                    // NAS登录凭据
                    string username = userControl_Text_Input_Account.Text_Box_Text.Text.ToString();
                    string password = userControl_Text_Input_PassWord.Text_Box_Text.ToString();

                    // 创建 WebRequest 对象
                    WebRequest request = WebRequest.Create(webDavUrl);
                    request.Credentials = new NetworkCredential(username, password);
                    request.Method = "PROPFIND"; // 使用 PROPFIND 请求来获取文件列表

                    using (WebResponse response = request.GetResponse())
                    {
                        Stream responseStream = response.GetResponseStream();
                        StreamReader reader = new StreamReader(responseStream);

                        // 读取 WebDAV 服务器的响应
                        string responseText = reader.ReadToEnd();
                        Console.WriteLine("WebDAV Response:");
                        Console.WriteLine(responseText);

                        // 这里你可以解析 WebDAV 响应来获取文件列表或执行其他操作
                    }
                }
                catch (WebException ex)
                {
                    // 处理连接错误或身份验证失败等异常
                    Console.WriteLine("Error: " + ex.Message);
                }

                shares = Cloud_NAS_SMB_Manage.NAS_SMB2_Login_And_ShowShares(
                    userControl_Text_Input_Account.Text_Box_Text.Text.ToString(),
                    userControl_Text_Input_PassWord.Text_Box_Text.ToString(),
                    userControl_Text_Input_IP_Address.Text_Box_Text.Text.ToString()
                    );
            }
            catch( Exception ex )
            {

            }

            if ( shares != null )
                Grid_Nas_User_Login.Visibility = Visibility.Collapsed;
            else
                Grid_Nas_User_Login.Visibility = Visibility.Visible;


        }*/

        

    }
}
