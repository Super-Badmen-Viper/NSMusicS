using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_UserControl.SongList_Info;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Dao_Init_Info.Init_SongList_Info
{
    public class Save_SongList_Info
    {
        #region 歌单的保存

        /// <summary>
        /// 保存歌单歌曲信息
        /// </summary>
        public void Save_ALL_SongListInfo()
        {
            //歌单歌曲排序
            //userControl_主界面_FrmMain.Sort_SongList();
            Save_DataGridView();
        }

        ListView_Item_Bing_ALL listView_Item_Bing_ALL = ListView_Item_Bing_ALL.Retuen_This();

        //实例化一个文件流--->与写入文件相关联
        //静态读取资源文件会一直占用，导致只能写入不能导出，出现文件内容清空
        private FileStream FS_List_Save = null;
        private StreamWriter SW_List = null;//写入 
        private StreamReader SR_List = null;//读取

        public void Save_DataGridView()
        {
            Save_Data_ALL_List();

            FS_List_Save = null;

            SW_List = null;

        }
        string temp;
        public void Save_Data_ALL_List()
        {
            temp = Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory + @"\Resource\SongListInfo_ini\SongList_Ini\本地音乐.ini");
            Clear_File_Info(temp);

            FS_List_Save = new FileStream(temp, FileMode.Create);
            SW_List = new StreamWriter(FS_List_Save);//无法静态
            Write_Song_Info(listView_Item_Bing_ALL.listView_Temp_Info_End_ALL, FS_List_Save);


            temp = Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory + @"\Resource\SongListInfo_ini\SongList_Ini\我喜欢.ini");
            Clear_File_Info(temp);

            FS_List_Save = new FileStream(temp, FileMode.Create);
            SW_List = new StreamWriter(FS_List_Save);//无法静态
            Write_Song_Info(listView_Item_Bing_ALL.listView_Temp_Info_End_Love, FS_List_Save);


            temp = Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory + @"\Resource\SongListInfo_ini\SongList_Ini\最近播放.ini");
            Clear_File_Info(temp);

            FS_List_Save = new FileStream(temp, FileMode.Create);
            SW_List = new StreamWriter(FS_List_Save);//无法静态
            Write_Song_Info(listView_Item_Bing_ALL.listView_Temp_Info_End_Auto, FS_List_Save);

            temp = Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory + @"\Resource\SongListInfo_ini\SongList_Ini\试听列表.ini");
            Clear_File_Info(temp);

            FS_List_Save = new FileStream(temp, FileMode.Create);
            SW_List = new StreamWriter(FS_List_Save);//无法静态
            Write_Song_Info(listView_Item_Bing_ALL.listView_Temp_Info_End_TryListen, FS_List_Save);
        }
        public void Clear_File_Info(string FullName)
        {
            //先清空指定文件内所有信息
            FileStream fs = new FileStream(FullName, FileMode.Create);//清空此文件的数据
            fs.Flush();
            fs.Close();
        }

        private void Write_Song_Info(List<ListView_Item_Bing> Save_Load_List_Name, FileStream FS_List)
        {
            //开始写入
            if (Save_Load_List_Name != null && Save_Load_List_Name.Count > 0) //if有新的行可以插入
            {
                for (int i = 0; i < Save_Load_List_Name.Count; i++)
                {
                    //如果某一列数据为空，就写入""，因为空对象不能调用tostring()；
                    if (Save_Load_List_Name[i] != null)
                    {
                        if (Save_Load_List_Name[i].Singer_Name != null)
                            SW_List.WriteLine(Save_Load_List_Name[i].Singer_Name);

                        if (Save_Load_List_Name[i].Song_Name != null)
                            SW_List.WriteLine(Save_Load_List_Name[i].Song_Name);

                        if (Save_Load_List_Name[i].Album_Name != null)
                            SW_List.WriteLine(Save_Load_List_Name[i].Album_Name);

                        if (Save_Load_List_Name[i].Song_Url != null)
                            SW_List.WriteLine(Save_Load_List_Name[i].Song_Url);

                        if (Save_Load_List_Name[i].Song_No != 0)
                            SW_List.WriteLine(Save_Load_List_Name[i].Song_No);
                    }

                }
                //清空缓冲区
                //关闭流
                SW_List.Flush();
                SW_List.Close();

                //FS_List.Flush();
                FS_List.Close();
            }
        }

        #endregion
    }
}
