using NSMusicS.Models.Servies_For_API_Info;
using NSMusicS.Models.Song_Audio_Out.CSCore_Ffmpeg;
using NSMusicS.Models.Song_Extract_Infos;
using NSMusicS.Models.Song_Json_To_WebAPI;
using NSMusicS.Models.Song_List_Infos;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Application = System.Windows.Application;

namespace NSMusicS.Services.Services_For_API_GetResult
{
    public class Cloud_Music_DownLoad
    {
        /// <summary>
        /// 下载指定 音质信息 的歌曲文件
        /// </summary>
        /// <param name="song_MaxBrLevel_Info"></param>
        public async void DownLoad_Song_For_Song_MaxBrLevel_Info(Song_MaxBrLevel_Info song_MaxBrLevel_Info, bool bool_Image, bool bool_lyic)
        {
            FolderBrowserDialog folderDialog = new FolderBrowserDialog();
            if (folderDialog.ShowDialog() == DialogResult.OK)
            {
                await Task.Run(() =>
                {
                    string savePath = null;

                    savePath = folderDialog.SelectedPath;

                    string filename = savePath + "\\" + song_MaxBrLevel_Info.Song_File_Name;

                    using (WebClient client = new WebClient())
                    {
                        try
                        {
                            client.DownloadFile(song_MaxBrLevel_Info.Song_Url, filename);

                            Application.Current.Dispatcher.Invoke(() =>
                            {
                                /*userControl_Download_Progress.downloadProgressBar.Value += downloadProgressBar_values_;
                                userControl_Download_Progress.downloadProgressBar_Num.Text = Convert.ToInt32(userControl_Download_Progress.downloadProgressBar.Value) + "%";

                                userControl_Download_Progress.
                                ListBox_Download.Items.Add("下载成功：" + musicData.musicUrl);*/
                            });
                        }
                        catch (Exception ex)
                        {
                            Application.Current.Dispatcher.Invoke(() =>
                            {
                                /*userControl_Download_Progress.
                                ListBox_Download.Items.Add("下载出错：" + musicData.musicUrl + "，错误信息：" + ex.Message);*/
                            });
                        }
                    }

                    //添加至本地音乐
                    Add_DownLoad_File_To_SongList(filename, bool_Image, bool_lyic);
                });
            }
        }

        /// <summary>
        /// 下载指定 MV信息 的视频MV文件
        /// </summary>
        /// <param name="song_MV_Info"></param>
        public void DownLoad_Song_For_Song_MV_Info(Song_MV_Info song_MV_Info)
        {

        }

        /// <summary>
        /// 自动添加至本地音乐 
        /// </summary>
        /// <param name="filename"></param>
        public async void Add_DownLoad_File_To_SongList(string filename,bool bool_Image,bool bool_lyic)
        {
            Application.Current.Dispatcher.Invoke(async () =>
            {
                ViewModule_Search_Song_For_Cloud_Music viewModule_Search_Song_For_Cloud_Music = ViewModule_Search_Song_For_Cloud_Music.Retuen_This();
                //
                Find_Song_Of_SelectFiles find_Song_Of_SelectFiles = new Find_Song_Of_SelectFiles();
                //刷新内存区域的引用
                ObservableCollection<ObservableCollection<Models.Song_List_Infos.SongList_Info>> songList_Infos = SongList_Info.Retuen_This();
                //
                string temp = viewModule_Search_Song_For_Cloud_Music.Song_Set_Infos.Album_Name.ToString().ToString();
                songList_Infos[2][0].Songs = await find_Song_Of_SelectFiles.Start_Set_Song_Of_DownLoad_Files(
                    songList_Infos[2][0].Songs, 
                    2,
                    filename,
                    temp);
                //
                SongList_Info.Retuen_This()[2][0].Songs = songList_Infos[2][0].Songs;
                
                //设置内嵌
                if (bool_Image)
                {
                    Song_Extract_Info.Set_AlbumImage_Of_This_SongUrl(filename, viewModule_Search_Song_For_Cloud_Music.Song_Set_Infos.imageSource, temp);
                }
                if (bool_lyic)
                {
                    Song_Extract_Info.Set_Lyic_Of_This_SongUrl(filename, viewModule_Search_Song_For_Cloud_Music.Song_Set_Infos.Lyic);
                }

                MessageBox.Show("下载成功："+ filename + "\n已添加至默认列表");
            });
        }
    }
}
