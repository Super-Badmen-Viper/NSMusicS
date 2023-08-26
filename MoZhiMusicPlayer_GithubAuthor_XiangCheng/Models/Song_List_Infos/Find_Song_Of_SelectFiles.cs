using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Forms;
using System.Windows.Media;
using System.Windows.Threading;
using SharpVectors.Dom.Svg;
using Shell32;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.Window;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_List_Infos
{
    public class Find_Song_Of_SelectFiles
    {
        /// <summary>
        /// 手动添加（选择文件）
        /// </summary>
        /// <param name="Select_List"></param>
        /// <returns></returns>
        public ObservableCollection<Song_Info> Start_Find_Song_Of_SelectFiles(ObservableCollection<Song_Info> Select_List, int SongList_ID)
        {
            //1.选取文件
            Microsoft.Win32.OpenFileDialog dialog = new Microsoft.Win32.OpenFileDialog();
            dialog.Multiselect = true;//该值确定是否可以选择多个文件
            dialog.Title = "请选择文件夹";
            dialog.Filter = "(*.mp3,*.flac,*.wav)|*.mp3;*.flac;*.wav;";
            dialog.ShowDialog();

            System.Windows.MessageBox.Show("请等待");

            //2.文件分析
            List<string> song_url = new List<string>(dialog.FileNames);
            ObservableCollection <Song_Info> list_Song_Info = SongInfo_Take(song_url);

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


            //4.排序（默认 歌手名-歌曲名-专辑名排序）
            List<Song_Info> song_Infos = new List<Song_Info>(Select_List);
            Select_List.Clear();

            List<Song_Info> sortedList = song_Infos
                .OrderBy(song => song.Singer_Name)
                .ThenBy(song => song.Song_Name)
                .ThenBy(song => song.Album_Name)
                .ToList();
            for (int i = 0; i < sortedList.Count; i++)
            {
                Song_Info song_Info = sortedList[i];
                Select_List.Add(song_Info);
            }
            for (int i = 0; i < Select_List.Count; i++)
            {
                Select_List[i].Song_No = i + 1;
            }

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
                if(Select_List[i].Song_Like_Image == ImageBrush_LoveEnter)
                {
                    Select_List[i].Song_Like = 1;
                }
            }

            //6.确认其它歌单是否存在我的收藏中的歌曲
            Check_LoveSong_In_LoveSongList_Reset_SongList_Info();
            #endregion

            return Select_List;
        }

        /// <summary>
        /// 添加本地歌曲文件夹（获取选择的文件夹一级下的所有音频）
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public ObservableCollection<Song_Info> Start_Find_Song_Of_SelectFolderBrowser(ObservableCollection<Song_Info> Select_List, int SongList_ID)
        {
            FolderBrowserDialog folderDialog = new FolderBrowserDialog();
            folderDialog.ShowDialog();

            System.Windows.MessageBox.Show("请等待");

            List<string> song_url = SearchAudioFilesInFolder(folderDialog.SelectedPath);

            ObservableCollection<Song_Info> list_Song_Info = SongInfo_Take(song_url);

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


            //4.排序（默认 歌手名-歌曲名-专辑名排序）
            List<Song_Info> song_Infos = new List<Song_Info>(Select_List);
            Select_List.Clear();

            List<Song_Info> sortedList = song_Infos
                .OrderBy(song => song.Singer_Name)
                .ThenBy(song => song.Song_Name)
                .ThenBy(song => song.Album_Name)
                .ToList();
            for (int i = 0; i < sortedList.Count; i++)
            {
                Song_Info song_Info = sortedList[i];
                Select_List.Add(song_Info);
            }
            for (int i = 0; i < Select_List.Count; i++)
            {
                Select_List[i].Song_No = i + 1;
            }

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

            //6.确认其它歌单是否存在我的收藏中的歌曲
            Check_LoveSong_In_LoveSongList_Reset_SongList_Info();
            #endregion

            return Select_List;
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

        /// <summary>
        /// 提取歌曲文件信息
        /// </summary>
        /// <param name="FileNames"></param>
        /// <returns></returns>
        public ObservableCollection<Song_Info> SongInfo_Take(List<string> FileNames)
        {
            ObservableCollection<Song_Info> list_Song_Info = new ObservableCollection<Song_Info>();
            ShellClass sh = new ShellClass();

            int Song_Ids_Temp = 0;
            Regex regex = new Regex(@"^(.+?)\s*-\s*(.*)\.(?:mp3|flac|wav)$");

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

                    song_info.Singer_Name = singerName;
                    song_info.Song_Name = songName;
                    song_info.Album_Name = albumName;
                }
                else
                {
                    song_info.Singer_Name = "未知";
                    song_info.Song_Name = System.IO.Path.GetFileNameWithoutExtension(songPath);
                    song_info.Album_Name = "未知";
                }

                song_info.Song_Like = 0;
                song_info.Song_Url = songPath;
                song_info.Song_No = Song_Ids_Temp++;

                list_Song_Info.Add(song_info);
            }

            return list_Song_Info;
        }

        ObservableCollection<ObservableCollection<Models.Song_List_Infos.SongList_Info>> songList_Infos;
        ObservableCollection<Song_Info> songList_Infos_Current_Playlist;
        string Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";

        /// <summary>
        /// 确认其它歌单是否存在我的收藏中的歌曲
        /// </summary>
        public void Check_LoveSong_In_LoveSongList_Reset_SongList_Info()
        {
            //刷新内存区域的引用
            songList_Infos = SongList_Info.Retuen_This();

            //歌单歌曲排序
            Sort_SongList();

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
            Sort_SongList();
        }
        //歌单歌曲排序
        public void Sort_SongList()
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
            Save_SongListInfo();
        }
        /// <summary>
        /// 保存歌单信息
        /// </summary>
        public void Save_SongListInfo()
        {
            songList_Infos = SongList_Info.Retuen_This();

            var playlists = new ObservableCollection<SongList_Info>();
            playlists = songList_Infos[0];
            SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Love.xml", playlists);
            playlists = new ObservableCollection<SongList_Info>();
            playlists = songList_Infos[1];
            SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_ALL.xml", playlists);
            playlists = new ObservableCollection<SongList_Info>();
            playlists = songList_Infos[2];
            SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_Auto.xml", playlists);
            for (int i = 3; i < 17; i++)
            {
                playlists = new ObservableCollection<SongList_Info>();
                playlists = songList_Infos[i];
                SongList_Info_Save.SaveSongList_Infos(Path_App + @"\SongListInfo_ini\SongList_Ini\Song_List_Info_More_ (" + i + ").xml", playlists);
            }
        }
    }
}
