using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Data.SqlClient;

namespace NSMusicS.Services
{
    public class Services_Connection_SqlServer
    {
        private readonly string connectionString;
        public SqlConnection connection;
        private bool Bool_connection;

        public Services_Connection_SqlServer(string connectionString)
        {
            this.connectionString = connectionString;

            using (connection = new SqlConnection(connectionString))
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
                    connection = new SqlConnection(connectionString);
                    connection.Open();

                    SqlCommand command = new SqlCommand(queryString, connection);
                    SqlDataReader reader = command.ExecuteReader();

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
        }
    }
}
