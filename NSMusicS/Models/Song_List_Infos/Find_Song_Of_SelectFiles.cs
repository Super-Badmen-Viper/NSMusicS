using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Forms;
using System.Windows.Media;
using System.Windows.Threading;
using NSMusicS.Models.Song_Audio_Out.CSCore_Ffmpeg;
using SharpVectors.Dom.Svg;
using Shell32;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.Window;
using Application = System.Windows.Application;
using DataFormats = System.Windows.DataFormats;
using DragEventArgs = System.Windows.DragEventArgs;
using MessageBox = System.Windows.MessageBox;
using Microsoft.EntityFrameworkCore;
using NSMusicS.Models.APP_DB_SqlLite.SS_Convert;
using NSMusicS.Models.APP_DB_SqlLite.Update_DB_Async;
using NSMusicS.Models.Song_List_Of_AlbumList_Infos;

namespace NSMusicS.Models.Song_List_Infos
{
    public class Find_Song_Of_SelectFiles
    {
        public static SongList_Info_Sort songList_Info_Sort = new SongList_Info_Sort();

        /// <summary>
        /// 下载音乐 歌曲文件 添加
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public async Task<ObservableCollection<Song_Info>> Start_Set_Song_Of_DownLoad_Files(
            ObservableCollection<Song_Info> Select_List, 
            int SongList_ID,
            string filename,
            string album_name)
        {
            var tcs = new TaskCompletionSource<ObservableCollection<Song_Info>>();

            await Task.Run(async () =>
            {
                List<string> song_url = new List<string>();
                song_url.Add(filename);
                ObservableCollection<Song_Info> list_Song_Info = SongInfo_Take(song_url);
                song_url.Clear(); song_url = null;

                Application.Current.Dispatcher.Invoke(() =>
                {
                    #region 数据处理
                    //3.去重
                    HashSet<string> uniqueSongUrls = new HashSet<string>();
                    List<Song_Info> updatedSelectList = new List<Song_Info>();
                    // 第一次遍历，将Select_List中的歌曲添加到新的updatedSelectList中，并同时记录已经添加的歌曲的URL
                    foreach (var songInfo in Select_List)
                    {
                        updatedSelectList.Add(songInfo);
                        uniqueSongUrls.Add(songInfo.Song_Url);
                    }
                    // 第二次遍历，将list_Song_Info中的歌曲添加到updatedSelectList中，但需要检查是否已经存在相同的URL
                    foreach (var songInfo in list_Song_Info)
                    {
                        if (!uniqueSongUrls.Contains(songInfo.Song_Url))
                        {
                            updatedSelectList.Add(songInfo);
                            uniqueSongUrls.Add(songInfo.Song_Url);
                        }
                    }
                    //去重后重新添加
                    Select_List.Clear();
                    for (int i = 0; i < updatedSelectList.Count; i++)
                    {
                        Song_Info song_Info = (Song_Info)updatedSelectList[i];

                        if (song_Info.Song_Url.Equals(filename))
                            song_Info.Album_Name = album_name;
                        
                        Select_List.Add(song_Info);
                    }
                    updatedSelectList.Clear(); updatedSelectList = null;
                    uniqueSongUrls.Clear(); uniqueSongUrls = null;

                    //5.确认是否在我的收藏中
                    if (SongList_ID != 0)
                    {
                        for (int i = 0; i < Select_List.Count; i++)
                        {
                            if (Select_List[i].Song_Like == 0)
                            {
                                Select_List[i].Song_Like_Image = ImageBrush_LoveNormal;//更改为SVG
                            }
                            else
                            {
                                Select_List[i].Song_Like = 1;
                                Select_List[i].Song_Like_Image = ImageBrush_LoveEnter;
                            }
                        }
                    }
                    else
                    {
                        for (int i = 0; i < Select_List.Count; i++)
                        {
                            Select_List[i].Song_Like = 1;
                            Select_List[i].Song_Like_Image = ImageBrush_LoveEnter;
                        }
                    }
                    for (int i = 0; i < Select_List.Count; i++)
                    {
                        if (Select_List[i].Song_Like_Image == ImageBrush_LoveEnter)
                        {
                            Select_List[i].Song_Like = 1;
                        }
                    }

                    //6.确认其它歌单是否存在我的收藏中的歌曲
                    Check_LoveSong_In_LoveSongList_Reset_SongList_Info();
                    #endregion
                });

                //排序（默认 歌手名）   
                Select_List = await songList_Info_Sort.Start_Sort_Song_Of_Select_List(Select_List, 0, true);

                tcs.SetResult(Select_List);
            });


            return await tcs.Task;
        }

        /// <summary>
        /// 手动 拖动 歌曲文件 添加
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public async Task<ObservableCollection<Song_Info>> Start_Drop_Song_Of_SelectFiles(ObservableCollection<Song_Info> Select_List, int SongList_ID, List<string> audioFiles)
        {
            var tcs = new TaskCompletionSource<ObservableCollection<Song_Info>>();

            await Task.Run(async () =>
            {
                ObservableCollection<Song_Info> list_Song_Info = SongInfo_Take(audioFiles);

                Application.Current.Dispatcher.Invoke(() =>
                {
                    #region 数据处理
                    //3.去重
                    HashSet<string> uniqueSongUrls = new HashSet<string>();
                    List<Song_Info> updatedSelectList = new List<Song_Info>();
                    // 第一次遍历，将Select_List中的歌曲添加到新的updatedSelectList中，并同时记录已经添加的歌曲的URL
                    foreach (var songInfo in Select_List)
                    {
                        updatedSelectList.Add(songInfo);
                        uniqueSongUrls.Add(songInfo.Song_Url);
                    }
                    // 第二次遍历，将list_Song_Info中的歌曲添加到updatedSelectList中，但需要检查是否已经存在相同的URL
                    foreach (var songInfo in list_Song_Info)
                    {
                        if (!uniqueSongUrls.Contains(songInfo.Song_Url))
                        {
                            updatedSelectList.Add(songInfo);
                            uniqueSongUrls.Add(songInfo.Song_Url);
                        }
                    }
                    list_Song_Info.Clear(); list_Song_Info = null;

                    //去重后重新添加
                    Select_List.Clear();
                    for (int i = 0; i < updatedSelectList.Count; i++)
                    {
                        Song_Info song_Info = (Song_Info)updatedSelectList[i];
                        Select_List.Add(song_Info);
                    }

                    uniqueSongUrls.Clear(); uniqueSongUrls = null;
                    updatedSelectList.Clear(); updatedSelectList = null;


                    //5.确认是否在我的收藏中
                    if (SongList_ID != 0)
                    {
                        for (int i = 0; i < Select_List.Count; i++)
                        {
                            if (Select_List[i].Song_Like == 0)
                            {
                                Select_List[i].Song_Like_Image = ImageBrush_LoveNormal;//更改为SVG
                            }
                            else
                            {
                                Select_List[i].Song_Like = 1;
                                Select_List[i].Song_Like_Image = ImageBrush_LoveEnter;
                            }
                        }
                    }
                    else
                    {
                        for (int i = 0; i < Select_List.Count; i++)
                        {
                            Select_List[i].Song_Like = 1;
                            Select_List[i].Song_Like_Image = ImageBrush_LoveEnter;
                        }
                    }
                    for (int i = 0; i < Select_List.Count; i++)
                    {
                        if (Select_List[i].Song_Like_Image == ImageBrush_LoveEnter)
                        {
                            Select_List[i].Song_Like = 1;
                        }
                    }

                    //6.确认其它歌单是否存在我的收藏中的歌曲
                    Check_LoveSong_In_LoveSongList_Reset_SongList_Info();
                    #endregion
                });

                //排序（默认 歌手名）   
                Select_List = await songList_Info_Sort.Start_Sort_Song_Of_Select_List(Select_List, 0, true);

                tcs.SetResult(Select_List);
            });
            

            return await tcs.Task;
        }

        /// <summary>
        /// 手动添加（选择文件）
        /// </summary>
        /// <param name="Select_List"></param>
        /// <returns></returns>
        public async Task<ObservableCollection<Song_Info>> Start_Find_Song_Of_SelectFiles(ObservableCollection<Song_Info> Select_List, int SongList_ID)
        {
            var tcs = new TaskCompletionSource<ObservableCollection<Song_Info>>();

            Microsoft.Win32.OpenFileDialog dialog = new Microsoft.Win32.OpenFileDialog();
            dialog.Multiselect = true;
            dialog.Title = "请选择文件夹";
            dialog.Filter = "(*.mp3,*.flac,*.wav)|*.mp3;*.flac;*.wav;";

            if (dialog.ShowDialog() == true)
            {
                await Task.Run(async () =>
                {
                    List<string> song_url = new List<string>(dialog.FileNames);
                    ObservableCollection<Song_Info> list_Song_Info = SongInfo_Take(song_url);
                    song_url.Clear(); song_url = null;

                    Application.Current.Dispatcher.Invoke(() =>
                    {
                        #region 数据处理
                        //3.去重
                        HashSet<string> uniqueSongUrls = new HashSet<string>();
                        List<Song_Info> updatedSelectList = new List<Song_Info>();
                        // 第一次遍历，将Select_List中的歌曲添加到新的updatedSelectList中，并同时记录已经添加的歌曲的URL
                        foreach (var songInfo in Select_List)
                        {
                            updatedSelectList.Add(songInfo);
                            uniqueSongUrls.Add(songInfo.Song_Url);
                        }
                        // 第二次遍历，将list_Song_Info中的歌曲添加到updatedSelectList中，但需要检查是否已经存在相同的URL
                        foreach (var songInfo in list_Song_Info)
                        {
                            if (!uniqueSongUrls.Contains(songInfo.Song_Url))
                            {
                                updatedSelectList.Add(songInfo);
                                uniqueSongUrls.Add(songInfo.Song_Url);
                            }
                        }
                        //去重后重新添加
                        Select_List.Clear();
                        for (int i = 0; i < updatedSelectList.Count; i++)
                        {
                            Song_Info song_Info = (Song_Info)updatedSelectList[i];
                            Select_List.Add(song_Info);
                        }

                        uniqueSongUrls.Clear(); uniqueSongUrls = null;
                        updatedSelectList.Clear(); updatedSelectList = null;

                        //5.确认是否在我的收藏中
                        if (SongList_ID != 0)
                        {
                            for (int i = 0; i < Select_List.Count; i++)
                            {
                                if (Select_List[i].Song_Like == 0)
                                {
                                    Select_List[i].Song_Like_Image = ImageBrush_LoveNormal;//更改为SVG
                                }
                                else
                                {
                                    Select_List[i].Song_Like = 1;
                                    Select_List[i].Song_Like_Image = ImageBrush_LoveEnter;
                                }
                            }
                        }
                        else
                        {
                            for (int i = 0; i < Select_List.Count; i++)
                            {
                                Select_List[i].Song_Like = 1;
                                Select_List[i].Song_Like_Image = ImageBrush_LoveEnter;
                            }
                        }
                        for (int i = 0; i < Select_List.Count; i++)
                        {
                            if (Select_List[i].Song_Like_Image == ImageBrush_LoveEnter)
                            {
                                Select_List[i].Song_Like = 1;
                            }
                        }

                        //6.确认其它歌单是否存在我的收藏中的歌曲
                        Check_LoveSong_In_LoveSongList_Reset_SongList_Info();
                        #endregion
                    });

                    //排序（默认 歌手名）   
                    Select_List = await songList_Info_Sort.Start_Sort_Song_Of_Select_List(Select_List, 0, true);

                    tcs.SetResult(Select_List);
                });
            }
            else
            {
                tcs.SetResult(Select_List);
            }

            return await tcs.Task;
        }

        /// <summary>
        /// 添加本地歌曲文件夹（获取选择的文件夹一级下的所有音频）
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public async Task<ObservableCollection<Song_Info>> Start_Find_Song_Of_SelectFolderBrowser(ObservableCollection<Song_Info> Select_List, int SongList_ID)
        {
            var tcs = new TaskCompletionSource<ObservableCollection<Song_Info>>();
            FolderBrowserDialog folderDialog = new FolderBrowserDialog();

            if (folderDialog.ShowDialog() == DialogResult.OK)
            {
                await Task.Run(async () =>
                {
                    // 使用 Task.Run 在后台线程执行耗时操作
                    List<string> songUrls = SearchAudioFilesInFolder(folderDialog.SelectedPath);
                    ObservableCollection<Song_Info> list_Song_Info = SongInfo_Take(songUrls);
                    songUrls.Clear(); songUrls = null;

                    Application.Current.Dispatcher.Invoke(() =>
                    {
                        #region 数据处理
                        //3.去重
                        HashSet<string> uniqueSongUrls = new HashSet<string>();
                        List<Song_Info> updatedSelectList = new List<Song_Info>();
                        // 第一次遍历，将Select_List中的歌曲添加到新的updatedSelectList中，并同时记录已经添加的歌曲的URL
                        foreach (var songInfo in Select_List)
                        {
                            updatedSelectList.Add(songInfo);
                            uniqueSongUrls.Add(songInfo.Song_Url);
                        }
                        // 第二次遍历，将list_Song_Info中的歌曲添加到updatedSelectList中，但需要检查是否已经存在相同的URL
                        foreach (var songInfo in list_Song_Info)
                        {
                            if (!uniqueSongUrls.Contains(songInfo.Song_Url))
                            {
                                updatedSelectList.Add(songInfo);
                                uniqueSongUrls.Add(songInfo.Song_Url);
                            }
                        }
                        //去重后重新添加
                        Select_List.Clear();
                        for (int i = 0; i < updatedSelectList.Count; i++)
                        {
                            Song_Info song_Info = (Song_Info)updatedSelectList[i];
                            Select_List.Add(song_Info);
                        }

                        uniqueSongUrls.Clear(); uniqueSongUrls = null;
                        updatedSelectList.Clear(); updatedSelectList = null;

                        //5.确认是否在我的收藏中
                        if (SongList_ID != 0)
                        {
                            for (int i = 0; i < Select_List.Count; i++)
                            {
                                if (Select_List[i].Song_Like == 0)
                                {
                                    Select_List[i].Song_Like_Image = ImageBrush_LoveNormal;//更改为SVG
                                }
                                else
                                {
                                    Select_List[i].Song_Like = 1;
                                    Select_List[i].Song_Like_Image = ImageBrush_LoveEnter;
                                }
                            }
                        }
                        else
                        {
                            for (int i = 0; i < Select_List.Count; i++)
                            {
                                Select_List[i].Song_Like = 1;
                                Select_List[i].Song_Like_Image = ImageBrush_LoveEnter;
                            }
                        }
                        for (int i = 0; i < Select_List.Count; i++)
                        {
                            if (Select_List[i].Song_Like_Image == ImageBrush_LoveEnter)
                            {
                                Select_List[i].Song_Like = 1;
                            }
                        }

                        //6.确认其它歌单是否存在我的收藏中的歌曲
                        Check_LoveSong_In_LoveSongList_Reset_SongList_Info();
                        #endregion
                    });

                    //排序（默认 歌手名）   
                    Select_List = await songList_Info_Sort.Start_Sort_Song_Of_Select_List(Select_List, 0, true);

                    tcs.SetResult(Select_List);
                });
            }
            else
            {
                tcs.SetResult(Select_List);
            }
             
            return await tcs.Task;
        }
        public async Task<ObservableCollection<Song_Info>> Start_Find_Song_Of_SelectFolderBrowser_s(
            ObservableCollection<Song_Info> Select_List, 
            int SongList_ID, 
            ArrayList Selects_SongList)
        {
            var tcs = new TaskCompletionSource<ObservableCollection<Song_Info>>();

            //确保在UI线程上
            FolderBrowserDialog folderDialog = new FolderBrowserDialog();

            await Task.Run(async () =>
            {
                List<string> songUrls = new List<string>();
                for (int i = 0; i < Selects_SongList.Count; i++)
                {
                    // 使用 Task.Run 在后台线程执行耗时操作
                    List<string> songUrls_temp = SearchAudioFilesInFolder(Selects_SongList[i].ToString());
                    for (int k = 0; k < songUrls_temp.Count; k++)
                    {
                        songUrls.Add(songUrls_temp[k].ToString());
                    }
                    songUrls_temp.Clear(); songUrls_temp = null;
                }           

                ObservableCollection<Song_Info> list_Song_Info = SongInfo_Take(songUrls);
                songUrls.Clear();songUrls = null;

                Application.Current.Dispatcher.Invoke(() =>
                {
                    #region 数据处理
                    //3.去重
                    HashSet<string> uniqueSongUrls = new HashSet<string>();
                    List<Song_Info> updatedSelectList = new List<Song_Info>();
                    // 第一次遍历，将Select_List中的歌曲添加到新的updatedSelectList中，并同时记录已经添加的歌曲的URL
                    foreach (var songInfo in Select_List)
                    {
                        updatedSelectList.Add(songInfo);
                        uniqueSongUrls.Add(songInfo.Song_Url);
                    }
                    // 第二次遍历，将list_Song_Info中的歌曲添加到updatedSelectList中，但需要检查是否已经存在相同的URL
                    foreach (var songInfo in list_Song_Info)
                    {
                        if (!uniqueSongUrls.Contains(songInfo.Song_Url))
                        {
                            updatedSelectList.Add(songInfo);
                            uniqueSongUrls.Add(songInfo.Song_Url);
                        }
                    }
                    //去重后重新添加
                    Select_List.Clear();
                    for (int i = 0; i < updatedSelectList.Count; i++)
                    {
                        Song_Info song_Info = (Song_Info)updatedSelectList[i];
                        Select_List.Add(song_Info);
                    }

                    uniqueSongUrls.Clear(); uniqueSongUrls = null;
                    updatedSelectList.Clear(); updatedSelectList = null;

                    //5.确认是否在我的收藏中
                    if (SongList_ID != 0)
                    {
                        for (int i = 0; i < Select_List.Count; i++)
                        {
                            if (Select_List[i].Song_Like == 0)
                            {
                                Select_List[i].Song_Like_Image = ImageBrush_LoveNormal;//更改为SVG
                            }
                            else
                            {
                                Select_List[i].Song_Like = 1;
                                Select_List[i].Song_Like_Image = ImageBrush_LoveEnter;
                            }
                        }
                    }
                    else
                    {
                        for (int i = 0; i < Select_List.Count; i++)
                        {
                            Select_List[i].Song_Like = 1;
                            Select_List[i].Song_Like_Image = ImageBrush_LoveEnter;
                        }
                    }
                    for (int i = 0; i < Select_List.Count; i++)
                    {
                        if (Select_List[i].Song_Like_Image == ImageBrush_LoveEnter)
                        {
                            Select_List[i].Song_Like = 1;
                        }
                    }

                    //6.确认其它歌单是否存在我的收藏中的歌曲
                    Check_LoveSong_In_LoveSongList_Reset_SongList_Info();
                    #endregion
                });

                //排序（默认 歌手名）   
                Select_List = await songList_Info_Sort.Start_Sort_Song_Of_Select_List(Select_List, 0, true);

                tcs.SetResult(Select_List);
            });

            return await tcs.Task;
        }
        private List<string> SearchAudioFilesInFolder(string folderPath)
        {
            List<string> song_url = new List<string>();

            DirectoryInfo directory = new DirectoryInfo(folderPath);
            FileInfo[] audioFiles = directory.GetFiles("*.*", SearchOption.AllDirectories)
                .Where(file => IsAudioFile(file.Extension))
                .ToArray();

            foreach (FileInfo audioFile in audioFiles)
            {
                song_url.Add(audioFile.FullName);
            }

            return song_url;
        }
        static bool IsAudioFile(string extension)
        {
            string[] audioExtensions = { ".mp3", ".wav", ".flac" };
            return audioExtensions.Contains(extension, StringComparer.OrdinalIgnoreCase);
        }

        /// <summary>
        /// 收藏按钮
        /// </summary>
        private static Uri ImageBrush_LoveEnter
            = new Uri(@"Resource\\Button_Image_Svg\\已收藏.svg", UriKind.Relative);
        private static Uri ImageBrush_LoveNormal
            = new Uri(@"Resource\\Button_Image_Svg\\收藏.svg", UriKind.Relative);

        Update_Song_List_Infos update_Song_List_Infos = Update_Song_List_Infos.Retuen_This();
        Update_Album_List_Infos update_Album_List_Infos = Update_Album_List_Infos.Retuen_This();
        Update_Singer_List_Infos update_Singer_List_Infos = Update_Singer_List_Infos.Retuen_This();

        private ObservableCollection<ObservableCollection<SongList_Info>> songList_Infos;
        private ObservableCollection<Song_Info> songList_Infos_Current_Playlist;
        private string Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";

        //当前专辑模式——专辑列表
        private ObservableCollection<ObservableCollection<Album_Performer_List_Infos_For_Model_2>> Album_Model_2_DB_List_s = new ObservableCollection<ObservableCollection<Album_Performer_List_Infos_For_Model_2>>();
        //当前歌手_专辑模式——歌手列表
        private ObservableCollection<ObservableCollection<Album_Performer_List_Infos_For_Model_3>> Album_Model_3_DB_List_s = new ObservableCollection<ObservableCollection<Album_Performer_List_Infos_For_Model_3>>();
        //当前专辑模式——专辑列表
        private ObservableCollection<Album_Performer_Infos> Album_Model_2_List_s = new ObservableCollection<Album_Performer_Infos>();
        //当前歌手_专辑模式——歌手列表
        private ObservableCollection<Album_Performer_Infos> Album_Model_3_List_s = new ObservableCollection<Album_Performer_Infos>();


        public static ShellClass sh = new ShellClass();
        /// <summary>
        /// 提取歌曲文件信息
        /// </summary>
        /// <param name="FileNames"></param>
        /// <returns></returns>
        public ObservableCollection<Song_Info> SongInfo_Take(List<string> FileNames)
        {
            ObservableCollection<Song_Info> list_Song_Info = new ObservableCollection<Song_Info>();

            int Song_Ids_Temp = 0;
            Regex regex = new Regex(@"^(.*?)(?:\s+-\s+(.*))?\.(?:mp3|flac|wav)$");

            foreach (string songPath in FileNames)
            {
                if (string.IsNullOrWhiteSpace(songPath))
                    continue;

                string fileName = System.IO.Path.GetFileName(songPath);
                Match match = regex.Match(fileName);

                Song_Info song_info = new Song_Info();

                if (match.Success && match.Groups.Count >= 3)
                {
                    string singerName = match.Groups[1].Value.Trim();
                    string songName = match.Groups[2].Value.Trim();

                    Folder Folderdir = sh.NameSpace(System.IO.Path.GetDirectoryName(songPath));
                    FolderItem FolderItemitem = Folderdir.ParseName(System.IO.Path.GetFileName(songPath));
                    string albumName = Folderdir.GetDetailsOf(FolderItemitem, 14);
                    string song_Duration = Folderdir.GetDetailsOf(FolderItemitem, 27);

                    if (songName.Length > 0)
                    {
                        song_info.Singer_Name = singerName;
                        song_info.Song_Name = songName;
                        song_info.Album_Name = albumName;
                    }
                    else
                    {
                        song_info.Singer_Name = "0_未知歌手";
                        song_info.Song_Name = singerName;
                        
                        if(albumName.Length > 0)
                            song_info.Album_Name = albumName;
                        else
                            song_info.Album_Name = "0_未知专辑";                  
                    }
                    if (song_Duration.Length > 0)
                        song_info.Song_Duration = song_Duration;
                    else
                        song_info.Song_Duration = "00:00";


                    singerName = null; songName = null; albumName = null;
                    Folderdir = null; FolderItemitem = null;
                }
                else
                {
                    song_info.Singer_Name = "0_未知歌手";
                    song_info.Song_Name = System.IO.Path.GetFileNameWithoutExtension(songPath);
                    song_info.Album_Name = "0_未知专辑";
                }

                song_info.Song_Like = 0;
                song_info.Song_Url = songPath;
                song_info.Song_No = Song_Ids_Temp++;
                song_info.MV_Path = "none";

                list_Song_Info.Add(song_info);

                match = null; song_info = null; fileName = null;
            }

            regex = null; Song_Ids_Temp = 0;

            return list_Song_Info;
        }
        public async Task<string> SongInfo_Take_One_async(List<string> FileNames,int SelectFind_Nums)
        {
            var tcs = new TaskCompletionSource<string>();

            List<string> all_temp = new List<string>();

            TagLib.File tagLib = null;

            await Task.Run(async () =>
            {
                try
                {
                    // 查找所有的temp项
                    Folder Folderdir = null;FolderItem FolderItemitem = null;
                    for (int i = 0; i < FileNames.Count; i++)
                    {
                        Folderdir = sh.NameSpace(Path.GetDirectoryName(FileNames[i]));
                        FolderItemitem = Folderdir.ParseName(Path.GetFileName(FileNames[i]));
                        all_temp.Add(Folderdir.GetDetailsOf(FolderItemitem, SelectFind_Nums));
                    }            

                    // 使用 LINQ 查询来计算每个字符串出现的次数，排除空值
                    var query = from item in all_temp
                                where item != null
                                group item by item into g
                                let count = g.Count()
                                orderby count descending
                                select new { Item = g.Key, Count = count };
                    var mostRepeatedItem = query.FirstOrDefault();// 获取重复次数最多的项

                    // 统一为其同步音乐属性
                    if (all_temp.Count > 0) 
                    {
                        for (int i = 0; i < all_temp.Count; i++)
                        {
                            tagLib = TagLib.File.Create(all_temp[i]);

                            if (SelectFind_Nums == 14)// 唱片集
                            {
                                if (tagLib.Tag.Album == null || tagLib.Tag.Album.Length == 0)
                                {
                                    tagLib.Tag.Album = all_temp[i];
                                }
                            }
                            else if (SelectFind_Nums == 15)// 年份
                            {
                                if (tagLib.Tag.Year == null || tagLib.Tag.Year == 0)
                                {
                                    tagLib.Tag.Year = Convert.ToUInt16(all_temp[i]);
                                }
                            }
                            else if (SelectFind_Nums == 16)// 流派
                            {
                                if (tagLib.Tag.Genres == null || tagLib.Tag.Genres.Length == 0)
                                {
                                    //tagLib.Tag.Genres = all_temp[i];
                                }
                            }

                            tagLib.Save();
                        }
                    }

                    Folderdir = null; FolderItemitem = null;
                    all_temp = null; tagLib = null; query = null; mostRepeatedItem = null;

                    tcs.SetResult(mostRepeatedItem.Item);
                }
                catch
                {
                    all_temp = null; tagLib = null;

                    tcs.SetResult(null);
                }
            });

            return await tcs.Task;
        }
        public string SongInfo_Take_One(List<string> FileNames, int SelectFind_Nums)
        {
            List<string> all_temp = new List<string>();

            try
            {
                // 查找所有的temp项
                Folder Folderdir = null; FolderItem FolderItemitem = null;
                for (int i = 0; i < FileNames.Count; i++)
                {
                    if (!File.Exists(FileNames[i]))
                    {
                        FileNames[i] = Path_App + FileNames[i];
                    }

                    Folderdir = sh.NameSpace(Path.GetDirectoryName(FileNames[i]));
                    FolderItemitem = Folderdir.ParseName(Path.GetFileName(FileNames[i]));
                    all_temp.Add(Folderdir.GetDetailsOf(FolderItemitem, SelectFind_Nums));  
                }

                // 使用 LINQ 查询来计算每个字符串出现的次数，排除空值
                // 获取重复次数最多的
                var mostRepeatedItem = all_temp
                    .Where(item => item != null)
                    .GroupBy(item => item)
                    .Select(group => new { Item = group.Key, Count = group.Count() })
                    .OrderByDescending(result => result.Count)
                    .FirstOrDefault();

                Folderdir = null; FolderItemitem = null;

                if (mostRepeatedItem != null && mostRepeatedItem.Item != null)
                {
                    string temp = mostRepeatedItem.Item;
                    mostRepeatedItem = null;

                    return temp;
                }
                else if (all_temp.Count > 0)
                {
                    string temp = all_temp[0];
                    all_temp = null; mostRepeatedItem = null;

                    return temp;
                }
                else
                    return "";       
            }
            catch
            {
                all_temp = null; 
            }

            return "";
        }

        /// <summary>
        /// 确认其它歌单是否存在我的收藏中的歌曲
        /// </summary>
        public void Check_LoveSong_In_LoveSongList_Reset_SongList_Info()
        {
            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();

            //歌单歌曲排序
            Sort_SongListAsync();

            if (songList_Infos != null)
            {
                if (songList_Infos.Count != 0)
                {
                    //分开操作，防止数据遗漏

                    //从下标1开始，跳过我的收藏
                    for (int i = 1; i < songList_Infos.Count; i++)//所有的 歌曲列表 数量
                    {
                        for (int j = 0; j < songList_Infos[i][0].Songs.Count; j++)//遍历到的 歌曲列表 中含有的 歌曲数量
                        {
                            for (int g = 0; g < songList_Infos[0][0].Songs.Count; g++)//我的收藏歌单 中含有的 歌曲数量
                            {
                                if (!songList_Infos[i][0].Songs[j].Song_Url.Equals(songList_Infos[0][0].Songs[g].Song_Url))
                                {
                                    songList_Infos[i][0].Songs[j].Song_Like = 0;
                                    songList_Infos[i][0].Songs[j].Song_Like_Image = ImageBrush_LoveNormal;
                                }
                            }
                        }
                    }

                    //从下标1开始，跳过我的收藏
                    for (int i = 1; i < songList_Infos.Count; i++)//所有的 歌曲列表 数量
                    {
                        for (int j = 0; j < songList_Infos[i][0].Songs.Count; j++)//遍历到的 歌曲列表 中含有的 歌曲数量
                        {
                            for (int g = 0; g < songList_Infos[0][0].Songs.Count; g++)//我的收藏歌单 中含有的 歌曲数量
                            {
                                if (songList_Infos[i][0].Songs[j].Song_Url.Equals(songList_Infos[0][0].Songs[g].Song_Url))
                                {
                                    songList_Infos[i][0].Songs[j].Song_Like = 1;
                                    songList_Infos[i][0].Songs[j].Song_Like_Image = ImageBrush_LoveEnter;
                                }
                            }
                        }
                    }

                    songList_Infos_Current_Playlist = SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist;
                    if (songList_Infos_Current_Playlist != null)
                    {
                        for (int i = 0; i < songList_Infos_Current_Playlist.Count; i++)
                        {
                            for (int g = 0; g < songList_Infos[0][0].Songs.Count; g++)//我的收藏歌单 中含有的 歌曲数量
                            {
                                if (!songList_Infos_Current_Playlist[i].Song_Url.Equals(songList_Infos[0][0].Songs[g].Song_Url))
                                {
                                    songList_Infos_Current_Playlist[i].Song_Like = 0;
                                    songList_Infos_Current_Playlist[i].Song_Like_Image = ImageBrush_LoveNormal;
                                }
                            }
                        }

                        for (int i = 0; i < songList_Infos_Current_Playlist.Count; i++)
                        {
                            for (int g = 0; g < songList_Infos[0][0].Songs.Count; g++)//我的收藏歌单 中含有的 歌曲数量
                            {
                                if (songList_Infos_Current_Playlist[i].Song_Url.Equals(songList_Infos[0][0].Songs[g].Song_Url))
                                {
                                    songList_Infos_Current_Playlist[i].Song_Like = 1;
                                    songList_Infos_Current_Playlist[i].Song_Like_Image = ImageBrush_LoveEnter;
                                }
                            }
                        }
                        SongList_Info_Current_Playlists.Retuen_This().songList_Infos_Current_Playlist = songList_Infos_Current_Playlist;
                    }

                }
            }

            //歌单歌曲排序
            Sort_SongListAsync();
        }
        //歌单歌曲排序
        public async Task Sort_SongListAsync()
        {
            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();
            if (songList_Infos != null)
            {
                if (songList_Infos.Count != 0)
                {
                    for (int i = 0; i < songList_Infos.Count; i++)
                    {
                        for (int j = 0; j < songList_Infos[i][0].Songs.Count; j++)
                        {
                            songList_Infos[i][0].Songs[j].Song_No = j + 1;
                        }
                    }
                }
            }

            //保存歌单信息
            await Task.Run(async () =>
            {
                await update_Song_List_Infos.Save_SongListInfoAsync();
            });
        }
        

    }
}
