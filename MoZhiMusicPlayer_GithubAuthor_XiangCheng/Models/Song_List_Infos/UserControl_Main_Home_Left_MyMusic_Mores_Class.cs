using MoZhiMusicPlayer_GithubAuthor_XiangCheng.UserControlLibrary.Main_Home_Left_MyMusic_UserControls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_List_Infos
{
    public class UserControl_Main_Home_Left_MyMusic_Mores_Class
    {
        public static List<UserControl_Main_Home_Left_MyMusic_More> userControl_Main_Home_Left_MyMusic_Mores { get; set; }
        public static List<UserControl_Main_Home_Left_MyMusic_More> Retuen_This()
        {
            userControl_Main_Home_Left_MyMusic_Mores = Return_This_UserControl_Main_Home_Left_MyMusic_More();
            return userControl_Main_Home_Left_MyMusic_Mores;
        }
        private static List<UserControl_Main_Home_Left_MyMusic_More> Return_This_UserControl_Main_Home_Left_MyMusic_More()
        {
            if (userControl_Main_Home_Left_MyMusic_Mores == null)
                userControl_Main_Home_Left_MyMusic_Mores = new List<UserControl_Main_Home_Left_MyMusic_More>();

            return userControl_Main_Home_Left_MyMusic_Mores;
        }
    }
}
