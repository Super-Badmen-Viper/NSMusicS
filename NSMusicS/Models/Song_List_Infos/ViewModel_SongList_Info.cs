using CommunityToolkit.Mvvm.Input;
using GalaSoft.MvvmLight;
using NSMusicS.Models.Servies_For_API_Info;
using NSMusicS.Models.Song_List_Infos;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using static NSMusicS.Models.Servies_For_API_Info.API_Song_Info;
using static NSMusicS.Models.Servies_For_API_Info.API_Song_Info_Get_Url;

namespace NSMusicS.Models.Song_List_Infos
{
    public class ViewModel_SongList_Info : ViewModelBase
    {
        public static ViewModel_SongList_Info viewModel_SongList_Info { get; set; }
        public static ViewModel_SongList_Info Retuen_This()
        {
            viewModel_SongList_Info = Return_This_ViewModel_SongList_Info();
            return viewModel_SongList_Info;
        }
        private static ViewModel_SongList_Info Return_This_ViewModel_SongList_Info()
        {
            if (viewModel_SongList_Info == null)
                viewModel_SongList_Info = new ViewModel_SongList_Info();
            return viewModel_SongList_Info;
        }

        public ViewModel_SongList_Info()
        {
            //绑定的数据源属性
            SongList_Infos = new ObservableCollection<ObservableCollection<SongList_Info>>();
            SongList_Infos_Current_Playlist = new ObservableCollection<Song_Info>();
            This_Song_Info = new Song_Info();
            string Path_App = System.IO.Path.GetFullPath(AppDomain.CurrentDomain.BaseDirectory) + @"Resource";

            //搜索关键词，适合搜索
            RefCommand_SongList_Info = new RelayCommand(async () =>
            {
                try
                {
                    //更改绑定在控价的数据源，仅在 RefCommand = new RelayCommand(async () =>内有效
                    Application.Current.Dispatcher.Invoke(() =>
                    {
                        /*ShowSelect_Search_Songs.Clear();
                        Show_API_HttpClient_Complete = Visibility.Visible;//显示动画*/
                    });
                    // 异步等待,UI刷新Show_API_HttpClient_Complete
                    await Task.Delay(50);


                    //异步更改数据同步至UI
                    await Task.Run(() =>
                    {



                        //更改绑定在控价的数据源
                        Application.Current.Dispatcher.Invoke(() =>
                        {

                        });
                    });
                }
                catch (HttpRequestException e)
                {
                    MessageBox.Show("Error: " + e.Message);
                }
                finally
                {
                    // 在 UI 线程上更新 Show_API_HttpClient_Complete 属性
                    Application.Current.Dispatcher.Invoke(() =>
                    {
                        /*Show_API_HttpClient_Complete = Visibility.Collapsed;*/
                    });
                    // 异步等待,UI刷新Show_API_HttpClient_Complete
                    await Task.Delay(50);
                }
            });
        }

        /// <summary>
        /// 触发事件 搜索200条数据
        /// </summary>
        public RelayCommand RefCommand_SongList_Info { get; set; }

        //所有的歌单列表集合
        private ObservableCollection<ObservableCollection<Models.Song_List_Infos.SongList_Info>> songList_Infos;
        public ObservableCollection<ObservableCollection<Models.Song_List_Infos.SongList_Info>> SongList_Infos
        {
            get { return songList_Infos; }
            set { songList_Infos = value; RaisePropertyChanged(); }
        }
        //当前的播放列表
        private ObservableCollection<Song_Info> songList_Infos_Current_Playlist;
        public ObservableCollection<Song_Info> SongList_Infos_Current_Playlist
        {
            get { return songList_Infos_Current_Playlist; }
            set { songList_Infos_Current_Playlist = value; RaisePropertyChanged(); }
        }

        //当前正在播放的歌曲
        private Song_Info this_Song_Info;
        public Song_Info This_Song_Info
        {
            get { return this_Song_Info; }
            set { this_Song_Info = value; RaisePropertyChanged(); }
        }

    }
}
