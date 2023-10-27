//using SMBLibrary.SMB1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.Services.Services_For_NAS
{
    public class Cloud_NAS_SMB_Manage
    {
        /*#region SMBLibrary

        private static Cloud_NAS_SMB_GetSet cloud_NAS_SMB_GetSet = new Cloud_NAS_SMB_GetSet();

        /// <summary>
        /// 登录，并返回 此级的所有共享文件夹
        /// </summary>
        public static bool isConnected;
        public static List<string> shares;
        public static List<string> NAS_SMB1_Login_And_ShowShares(string ip, string username, string password)
        {
            shares = cloud_NAS_SMB_GetSet.Begin_Cloud_NAS_SMB1_Login(ip, username, password);
            if (shares != null)
                return shares;

            return null;
        }
        public static List<string> NAS_SMB2_Login_And_ShowShares(string ip, string username, string password)
        {
            shares = cloud_NAS_SMB_GetSet.Begin_Cloud_NAS_SMB2_Login(ip, username, password);
            if (shares != null)
                return shares;

            return null;
        }

        /// <summary>
        /// 获取选中的共享文件夹，其中的文件列表
        /// </summary>
        public static List<FindInformation> fileList2;
        public static List<FindInformation> NAS_SMB_Get_FileList(string shared_name)
        {
            fileList2 = cloud_NAS_SMB_GetSet.Begin_Cloud_NAS_SMB_Get_FileList(shared_name);
            if (fileList2 != null)
                return fileList2;

            return null;
        }

        /// <summary>
        /// 获取选中的文件的byte[]流
        /// </summary>
        public static byte[] data;
        public static byte[] NAS_SMB_Get_Read_SelectFile_Bytes(string shared_name, string filePath)
        {
            data = cloud_NAS_SMB_GetSet.Begin_Cloud_NAS_SMB_Get_Read_SelectFile_Bytes(shared_name, filePath);
            if (data != null) 
                return data;

            return null;
        }

        #endregion*/


    }
}
