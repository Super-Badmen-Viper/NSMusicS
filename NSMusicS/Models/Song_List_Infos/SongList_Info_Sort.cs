using NSMusicS.Models.APP_DB_SqlLite.Update_DB_Async;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using static NSMusicS.Models.Song_List_Infos.SongList_Info_Sort;

namespace NSMusicS.Models.Song_List_Infos
{
    public class SongList_Info_Sort
    {
        Update_Song_List_Infos update_Song_List_Infos = Update_Song_List_Infos.Retuen_This();

        /// <summary>
        /// 歌单歌曲 排序 (内存库)
        /// </summary>
        /// <param name="Select_List"></param>
        /// <param name="SongList_ID"></param>
        /// <param name="Sort_Num"></param>
        /// <returns></returns>
        public async Task<ObservableCollection<Song_Info>>
            Start_Sort_Song_Of_Select_List(
                ObservableCollection<Song_Info> Select_List, 
                int Sort_Num,
                bool Sort_Double
            )
        {
            var tcs = new TaskCompletionSource<ObservableCollection<Song_Info>>();

            await Task.Run(() =>
            {
                List<Song_Info> temp = new List<Song_Info>();
                temp = new List<Song_Info>(Select_List);

                if (Sort_Num == 0)
                    temp = Sort_SingerName(temp, Sort_Double);
                else if (Sort_Num == 1)
                    temp = Sort_SongName(temp, Sort_Double);
                else if (Sort_Num == 2)
                    temp = Sort_AlbumName(temp, Sort_Double);
                else if (Sort_Num == 3)
                    temp = Sort_Duration(temp, Sort_Double);

                Application.Current.Dispatcher.Invoke(() =>
                {
                    Select_List.Clear();
                    for (int i = 0; i < temp.Count; i++)
                    {
                        Song_Info song_Info = temp[i];
                        Select_List.Add(song_Info);
                    }
                });

                tcs.SetResult(Select_List);
            });

            return await tcs.Task;
        }

        /// <summary>
        /// 歌单歌曲 排序 (数据库)
        /// </summary>
        /// <param name="Select_List"></param>
        /// <param name="Sort_Num"></param>
        /// <param name="Sort_Double"></param>
        /// <param name="category_SongList_ID"></param>
        /// <returns></returns>
        public async Task<ObservableCollection<Song_Info>>
            Start_Sort_Song_Of_Select_List_For_DB(
                ObservableCollection<Song_Info> Select_List,
                int Sort_Num,
                bool Sort_Double,
                int category_SongList_ID
            )
        {
            var tcs = new TaskCompletionSource<ObservableCollection<Song_Info>>();

            await Task.Run(async () =>
            {
                List<Song_Info> temp = new List<Song_Info>();
                temp = new List<Song_Info>(Select_List);

                if (Sort_Num == 0)
                {
                    temp = Sort_SingerName(temp, Sort_Double);
                }
                else if (Sort_Num == 1)
                { 
                    temp = Sort_SongName(temp, Sort_Double);
                }
                else if (Sort_Num == 2) 
                { 
                    temp = Sort_AlbumName(temp, Sort_Double);
                }
                else if (Sort_Num == 3) 
                { 
                    temp = Sort_Duration(temp, Sort_Double);
                }

                Application.Current.Dispatcher.Invoke(() =>
                {
                    Select_List.Clear();
                    for (int i = 0; i < temp.Count; i++)
                    {
                        Song_Info song_Info = temp[i];
                        Select_List.Add(song_Info);
                    }
                });

                tcs.SetResult(Select_List);

                /// 不异步至数据库，等待应用程序结束时统一清零保存
                /// 不await，以防影响调度内存库的操作
                /// 懒同步，
                /// update_Song_List_Infos.Sort_SongListInfoAsync(Sort_Num, Sort_Double, Sort_SingerName_Up, category_SongList_ID);
            });

            return await tcs.Task;
        }

        // 自定义比较器类
        private class CustomComparer : IComparer<string>
        {
            [System.Runtime.InteropServices.DllImport("Shlwapi.dll", CharSet = System.Runtime.InteropServices.CharSet.Unicode)]
            private static extern int StrCmpLogicalW(string psz1, string psz2);

            public int Compare(string x, string y)
            {
                return StrCmpLogicalW(x, y);
            }
        }

        

        public bool Sort_SingerName_Up = false;
        /// <summary>
        /// 歌手名 排序
        /// </summary>
        /// <returns></returns>
        public List<Song_Info> Sort_SingerName(List<Song_Info> song_Infos, bool Sort_Double)
        {
            List<Song_Info> songs = new List<Song_Info>();

            var customComparer = new CustomComparer();

            List<Song_Info> sortedList = null;
            if (Sort_Double == true)
            {
                if (!Sort_SingerName_Up)
                {
                    sortedList = song_Infos.OrderBy(song => song.Singer_Name, customComparer).ToList();
                    Sort_SingerName_Up = true;
                }
                else
                {
                    sortedList = song_Infos.OrderByDescending(song => song.Singer_Name, customComparer).ToList();
                    Sort_SingerName_Up = false;
                }
            }
            else
            {
                sortedList = song_Infos.OrderBy(song => song.Singer_Name, customComparer).ToList();
            }

            for (int i = 0; i < sortedList.Count; i++)
            {
                Song_Info song_Info = sortedList[i];
                songs.Add(song_Info);
            }
            for (int i = 0; i < songs.Count; i++)
            {
                songs[i].Song_No = i + 1;
            }

            return songs;
        }

        public bool Sort_SongName_Up = false;
        /// <summary>
        /// 歌曲名 排序
        /// </summary>
        /// <returns></returns>
        public List<Song_Info> Sort_SongName(List<Song_Info> song_Infos, bool Sort_Double)
        {
            List<Song_Info> songs = new List<Song_Info>();

            var customComparer = new CustomComparer();

            List<Song_Info> sortedList = null;
            if (Sort_Double == true)
            {
                if (!Sort_SongName_Up)
                {
                    sortedList = song_Infos.OrderBy(song => song.Song_Name, customComparer).ToList();
                    Sort_SongName_Up = true;
                }
                else
                {
                    sortedList = song_Infos.OrderByDescending(song => song.Song_Name, customComparer).ToList();
                    Sort_SongName_Up = false;
                }
            }
            else
            {
                sortedList = song_Infos.OrderBy(song => song.Song_Name, customComparer).ToList();
            }

            for (int i = 0; i < sortedList.Count; i++)
            {
                Song_Info song_Info = sortedList[i];
                songs.Add(song_Info);
            }
            for (int i = 0; i < songs.Count; i++)
            {
                songs[i].Song_No = i + 1;
            }

            return songs;
        }

        public bool Sort_AlbumName_Up = false;
        /// <summary>
        /// 专辑名 排序
        /// </summary>
        /// <returns></returns>
        public List<Song_Info> Sort_AlbumName(List<Song_Info> song_Infos, bool Sort_Double)
        {
            List<Song_Info> songs = new List<Song_Info>();

            var customComparer = new CustomComparer();

            List<Song_Info> sortedList = null;
            if (Sort_Double == true)
            {
                if (!Sort_AlbumName_Up)
                {
                    sortedList = song_Infos.OrderBy(song => song.Album_Name, customComparer).ToList();
                    Sort_AlbumName_Up = true;
                }
                else
                {
                    sortedList = song_Infos.OrderByDescending(song => song.Album_Name, customComparer).ToList();
                    Sort_AlbumName_Up = false;
                }
            }
            else
            {
                sortedList = song_Infos.OrderBy(song => song.Album_Name, customComparer).ToList();
            }

            for (int i = 0; i < sortedList.Count; i++)
            {
                Song_Info song_Info = sortedList[i];
                songs.Add(song_Info);
            }
            for (int i = 0; i < songs.Count; i++)
            {
                songs[i].Song_No = i + 1;
            }

            return songs;
        }

        public bool Sort_Duration_Up = false;
        /// <summary>
        /// 音频持续时间 排序
        /// </summary>
        /// <returns></returns>
        public List<Song_Info> Sort_Duration(List<Song_Info> song_Infos, bool Sort_Double)
        {
            List<Song_Info> songs = new List<Song_Info>();

            var customComparer = new CustomComparer();

            List<Song_Info> sortedList = null;
            if (Sort_Double == true)
            {
                if (!Sort_Duration_Up)
                {
                    sortedList = song_Infos.OrderBy(song => song.Song_Duration, customComparer).ToList();
                    Sort_Duration_Up = true;
                }
                else
                {
                    sortedList = song_Infos.OrderByDescending(song => song.Song_Duration, customComparer).ToList();
                    Sort_Duration_Up = false;
                }
            }
            else
            {
                sortedList = song_Infos.OrderBy(song => song.Song_Duration, customComparer).ToList();
            }

            for (int i = 0; i < sortedList.Count; i++)
            {
                Song_Info song_Info = sortedList[i];
                songs.Add(song_Info);
            }
            for (int i = 0; i < songs.Count; i++)
            {
                songs[i].Song_No = i + 1;
            }

            return songs;
        }
    }
}
