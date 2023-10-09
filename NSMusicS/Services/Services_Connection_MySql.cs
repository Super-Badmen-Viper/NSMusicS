using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
//using MySql.Data.MySqlClient;

namespace NSMusicS.Services
{
    public class Services_Connection_MySql
    {
        /*private readonly string connectionString;
        public MySqlConnection connection;
        private bool Bool_connection;

        public Services_Connection_MySql(string connectionString)
        {
            this.connectionString = connectionString;

            using (connection = new MySqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    Bool_connection = true;
                    MessageBox.Show("连接成功");
                }
                catch (Exception ex)
                {
                    Bool_connection = false;
                    MessageBox.Show("连接失败");
                }
            }
        }

        public List<string> GetMusicUrls(string Sql_String)
        {
            return ExecuteQuery(Sql_String);
        }
        private List<string> ExecuteQuery(string queryString)
        {
            List<string> results = new List<string>();

            if (Bool_connection == true)
            {
                try
                {
                    connection = new MySqlConnection(connectionString);
                    connection.Open();

                    MySqlCommand command = new MySqlCommand(queryString, connection);
                    MySqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        results.Add(reader.GetString(0));
                    }
                }
                catch (Exception ex)
                {
                    // 处理异常
                }
            }
            else
            {
                results = null;
                MessageBox.Show("未连接到数据库");
            }

            return results;
        }*/
    }
}