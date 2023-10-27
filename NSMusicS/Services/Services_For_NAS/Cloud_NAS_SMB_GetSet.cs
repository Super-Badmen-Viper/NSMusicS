using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
//using SMBLibrary;
//using SMBLibrary.Client;
//using SMBLibrary.Server;
using System.IO;
//using SMBLibrary.SMB1;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;
using System.Windows;

namespace NSMusicS.Services.Services_For_NAS
{
    /// <summary>
    /// 连接至NAS，并获取byte流数据
    /// </summary>
    public class Cloud_NAS_SMB_GetSet
    {
       /* #region SMBLibrary

        #region 连接/存储 对象
        /// <summary>
        /// SMB1客户端对象
        /// </summary>
        private static SMB1Client client1;
        private static SMB2Client client2;
        //private static SMB3Client client3;
        /// <summary>
        /// SMB文件存储对象
        /// </summary>
        private static ISMBFileStore fileStore;
        #endregion

        #region 状态
        /// <summary>
        /// 连接状态
        /// </summary>
        private static bool isConnected;
        /// <summary>
        /// 登录状态
        /// </summary>
        private static NTStatus status;
        #endregion

        #region 文件夹/文件 信息列表
        /// <summary>
        /// NAS上的共享文件夹列表
        /// </summary>
        private static List<string> shares;
        /// <summary>
        /// 选中的NAS目录中的文件列表
        /// </summary>
        List<FindInformation> fileList2;
        #endregion

        #region 操作文件
        /// <summary>
        /// 目录句柄
        /// </summary>
        private static object directoryHandle;

        /// <summary>
        /// 文件句柄
        /// </summary>
        private static object fileHandle;

        /// <summary>
        /// 文件状态对象
        /// </summary>
        private static FileStatus fileStatus;

        /// <summary>
        /// 内存流(读取文件)
        /// </summary>
        private static System.IO.MemoryStream stream = new System.IO.MemoryStream();
        /// <summary>
        /// 文件流(数据)
        /// </summary>
        private static byte[] data;
        private static long bytesRead = 0;
        #endregion



        #region 登录，并获取共享文件夹信息
        /// <summary>
        /// 登录并列出共享文件夹列表
        /// </summary>
        /// <param name="ip"></param>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public List<string> Begin_Cloud_NAS_SMB1_Login(string ip,string username,string password)
        {
            // 创建一个SMB1客户端对象，你也可以选择使用SMB2Client
            client1 = new SMB1Client();
            client2 = null;

            // 尝试连接到NAS设备的指定IP地址，使用SMBTransportType.DirectTCPTransport协议
            bool isConnected = client1.Connect(IPAddress.Parse(ip), SMBTransportType.DirectTCPTransport);

            // 检查是否成功连接到NAS
            if (isConnected)
            {
                // 使用空字符串（String.Empty）作为工作站名字，以及提供的用户名和密码登录到NAS
                status = client1.Login(String.Empty, username, password);

                // 检查登录是否成功
                if (status == NTStatus.STATUS_SUCCESS)
                {
                    // 获取NAS上的共享文件夹列表，并将状态保存在"status"变量中
                    shares = client1.ListShares(out status);

                    // 登出NAS，结束会话
                    client1.Logoff();

                    return shares;
                }
            }

            // 断开与NAS的连接
            client1.Disconnect();

            return null;
        }
        public List<string> Begin_Cloud_NAS_SMB2_Login(string ip, string username, string password)
        {
            // 创建一个SMB1客户端对象，你也可以选择使用SMB2Client
            client1 = null;
            client2 = new SMB2Client();

            // 尝试连接到NAS设备的指定IP地址，使用SMBTransportType.DirectTCPTransport协议
            bool isConnected = client2.Connect(IPAddress.Parse(ip), SMBTransportType.DirectTCPTransport);

            // 检查是否成功连接到NAS
            if (isConnected)
            {
                // 使用空字符串（String.Empty）作为工作站名字，以及提供的用户名和密码登录到NAS
                status = client2.Login(String.Empty, username, password);

                // 检查登录是否成功
                if (status == NTStatus.STATUS_SUCCESS)
                {
                    // 获取NAS上的共享文件夹列表，并将状态保存在"status"变量中
                    shares = client2.ListShares(out status);

                    // 登出NAS，结束会话
                    client2.Logoff();

                    return shares;
                }
            }

            // 断开与NAS的连接
            client2.Disconnect();

            return null;
        }
        #endregion

        #region 连接该共享文件夹，并列出其包含的 文件和目录
        /// <summary>
        /// 连接该共享文件夹，并列出其包含的 文件和目录 - SMB1
        /// </summary>
        /// <param name="shared_name">共享文件夹 名</param>
        /// <returns></returns>
        public List<FindInformation> Begin_Cloud_NAS_SMB_Get_FileList(string shared_name)
        {
            if (isConnected)
            {
                if (status != null && status == NTStatus.STATUS_SUCCESS)
                {
                    // 使用SMB客户端对象连接到共享文件夹 "Shared" 并将连接状态保存在 "status" 变量中
                    if (client1 != null)
                        fileStore = client1.TreeConnect(shared_name, out status);
                    else
                        fileStore = client2.TreeConnect(shared_name, out status);

                    // 检查连接是否成功
                    if (status == NTStatus.STATUS_SUCCESS)
                    {
                        // 创建一个目录文件句柄，并将文件状态保存在 "fileStatus" 中
                        status = fileStore.CreateFile(out directoryHandle, out fileStatus, "\\",
                            AccessMask.GENERIC_READ, SMBLibrary.FileAttributes.Directory, ShareAccess.Read | ShareAccess.Write,
                            CreateDisposition.FILE_OPEN, CreateOptions.FILE_DIRECTORY_FILE, null);

                        // 检查文件句柄创建是否成功
                        if (status == NTStatus.STATUS_SUCCESS)
                        {
                            // 查询目录中的文件信息，并将结果保存在 "fileList2" 变量中
                            status = ((SMB1FileStore)fileStore).QueryDirectory(out fileList2, "\\*", FindInformationLevel.SMB_FIND_FILE_DIRECTORY_INFO);

                            // 关闭之前创建的目录文件句柄
                            status = fileStore.CloseFile(directoryHandle);

                            // 返回操作成功的标志
                            return fileList2;
                        }
                    }

                    // 断开与文件存储的连接
                    status = fileStore.Disconnect();
                }
            }

            return null;
        }
        public bool Begin_Cloud_NAS_SMB_Connect_SMB2()
        {


            return false;
        }
        #endregion

        #region 读取选中的文件，返回byte[]流(未转化)
        /// <summary>
        /// 读取选中的文件，返回byte[]流(未转化)
        /// </summary>
        /// <param name="filePath"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        public byte[] Begin_Cloud_NAS_SMB_Get_Read_SelectFile_Bytes(string shared_name, string filePath)
        {
            // 使用SMB客户端对象连接到共享文件夹 "Shared" 并将连接状态保存在 "status" 变量中
            if (client1 != null)
                fileStore = client1.TreeConnect(shared_name, out status);
            else
                fileStore = client2.TreeConnect(shared_name, out status);


            // 如果使用的是SMB1FileStore，则在文件路径前添加 "\\" 来表示绝对路径
            if (fileStore is SMB1FileStore)
            {
                filePath = @"\\" + filePath;
            }

            // 创建一个文件句柄，打开指定路径的文件，并将文件状态保存在 "fileStatus" 中
            status = fileStore.CreateFile(out fileHandle, out fileStatus, filePath,
                AccessMask.GENERIC_READ | AccessMask.SYNCHRONIZE, SMBLibrary.FileAttributes.Normal, ShareAccess.Read,
                CreateDisposition.FILE_OPEN, CreateOptions.FILE_NON_DIRECTORY_FILE | CreateOptions.FILE_SYNCHRONOUS_IO_ALERT, null);

            // 检查文件句柄创建是否成功
            if (status == NTStatus.STATUS_SUCCESS)
            {
                // 循环读取文件数据并写入内存流
                while (true)
                {
                    // 从文件中读取数据，并将结果保存在 "data" 变量中
                    if (client1 != null)
                        status = fileStore.ReadFile(out data, fileHandle, bytesRead, (int)client1.MaxReadSize);
                    else
                        status = fileStore.ReadFile(out data, fileHandle, bytesRead, (int)client2.MaxReadSize);

                    // 检查读取状态是否成功或已到达文件末尾
                    if (status != NTStatus.STATUS_SUCCESS && status != NTStatus.STATUS_END_OF_FILE)
                    {
                        //throw new Exception("");
                        MessageBox.Show("Failed to read from file：读取文件失败");
                    }

                    // 如果已到达文件末尾或读取到的数据长度为0，则退出循环
                    if (status == NTStatus.STATUS_END_OF_FILE || data.Length == 0)
                    {
                        break;
                    }

                    // 更新已读取的字节数，并将数据写入内存流
                    bytesRead += data.Length;
                    stream.Write(data, 0, data.Length);
                }
            }

            // 关闭文件句柄
            status = fileStore.CloseFile(fileHandle);
            // 断开与文件存储的连接
            status = fileStore.Disconnect();

            return data;
        }
        #endregion

        #endregion

        #region RestSharp



        #endregion*/


    }
}
