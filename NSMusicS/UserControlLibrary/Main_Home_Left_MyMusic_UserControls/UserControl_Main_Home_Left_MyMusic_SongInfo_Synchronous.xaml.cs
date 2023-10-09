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
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace NSMusicS.UserControlLibrary.Main_Home_Left_MyMusic_UserControls
{
    /// <summary>
    /// UserControl_Main_Home_Left_MyMusic_SongInfo_Synchronous.xaml 的交互逻辑
    /// </summary>
    public partial class UserControl_Main_Home_Left_MyMusic_SongInfo_Synchronous : UserControl
    {
        public UserControl_Main_Home_Left_MyMusic_SongInfo_Synchronous()
        {
            InitializeComponent();
        }

        public string Data_Source = "";
        public string Port = "";
        public string Database = "";
        public string User_Id = "";
        public string Password = "";
        public string connectionString = "";
        public string Sql_String = "";

        public string Web_API = "";


        private void Button_Connectio_SqlServer_Click(object sender, RoutedEventArgs e)
        {
            
        }
        private void Button_Connectio_MySql_Click(object sender, RoutedEventArgs e)
        {
            
        }

        private void TextBox_Connection_Data_Source_TextChanged(object sender, TextChangedEventArgs e)
        {
            Data_Source = TextBox_Connection_Data_Source.Text;
        }
        private void TextBox_Connection_Initial_Catalog_TextChanged(object sender, TextChangedEventArgs e)
        {
            Database = TextBox_Connection_Initial_Catalog.Text;
        }
        private void TextBox_Connection_User_ID_TextChanged(object sender, TextChangedEventArgs e)
        {
            User_Id = TextBox_Connection_User_ID.Text;
        }
        private void TextBox_Connection_Password_TextChanged(object sender, TextChangedEventArgs e)
        {
            Password = TextBox_Connection_Password.Text;
        }
        private void TextBox_Connection_Port_TextChanged(object sender, TextChangedEventArgs e)
        {
            Port = TextBox_Connection_Port.Text;
        }

        private void TextBox_Sql_Edit_TextChanged(object sender, TextChangedEventArgs e)
        {
            Sql_String = TextBox_Sql_Edit.Text;
        }

        private void TextBox_Web_API_TextChanged(object sender, TextChangedEventArgs e)
        {
            Web_API = TextBox_Web_API.Text;
        }
    }
}
