using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MaterialDesignThemes.Wpf.Transitions;
using System.Collections.ObjectModel;
using System.Windows.Media;
using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.Command;
using TransitionEffect = MaterialDesignThemes.Wpf.Transitions.TransitionEffect;
using ImageMagick;
using NSMusicS.Dao_UserControl.SingerImage_Info;
using static NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls.UserControl_Animation.ViewModel.MainViewModel_Animation_1;
using System.Windows.Media.Media3D;
using System.Windows;
using System.Windows.Media.Imaging;
using NSMusicS.Models.Song_List_Of_AlbumList_Infos;
using System.Drawing.Printing;
using System.Runtime.InteropServices;
using NSMusicS.UserControlLibrary.MusicPlayer_Main.MusicPlayer_Model_Control_Albums.ViewModel_Assembly_Album_Show;
using System.Threading;
using static NSMusicS.UserControlLibrary.MusicPlayer_Main.MusicPlayer_Model_Control_Albums.ViewModel_Assembly_Album_Show.ViewModel_Assembly_Album_Class;
using static NSMusicS.UserControlLibrary.MusicPlayer_Main.MusicPlayer_Model_Control_Singers.ViewModel_Assembly_Singer_Show.ViewModel_Assembly_Singer_Class;
using NSMusicS.UserControlLibrary.MusicPlayer_Main.MusicPlayer_Model_Control_Albums.ViewModel_Assembly_Singer_Show;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.MusicPlayer_Model_Control_Albums.ViewModel_Assembly_Album_Show
{
    public class ViewModel_Assembly_Album_Class : ViewModelBase
    {
        public int Num_Album_Infos { get; set; }//检测是否已完成RelayCommand

        public ViewModel_Assembly_Album_Class()
        {
            kinds = new List<TransitionEffectKind>
            {
                TransitionEffectKind.ExpandIn,//渐显和展开
                TransitionEffectKind.FadeIn,//逐渐淡入，从完全透明到完全可见
                TransitionEffectKind.SlideInFromLeft,//沿着水平方向从左边滑入
                TransitionEffectKind.SlideInFromTop,
                TransitionEffectKind.SlideInFromRight,
                TransitionEffectKind.SlideInFromBottom
            };

            Album_Infos = new ObservableCollection<Album_Info>();

            Num_Album_Infos = 0;

            AddToQueue_Complete = false;

            /// 一次性全部刷新（一致性）
            RefCommand = new RelayCommand(async () =>
            {
                Album_Info_Class album_Info_Class = Album_Info_Class.Retuen_This();
                for (int i = 0; i < album_Info_Class.Album_Image_Uris.Count; i++)
                {
                    var existingAlbum = Album_Infos.FirstOrDefault(
                            item => item.Album_Name.Equals(album_Info_Class.Album_Names[i])
                            );
                    if (existingAlbum == null)
                    {
                        var albumName = album_Info_Class.Album_Names[i];
                        var albumImageUri = album_Info_Class.Album_Image_Uris[i];
                        var albumExplain = album_Info_Class.Album_Explain[i];
                        var albumInfo = new Album_Info()
                        {
                            Album_No = i,
                            Album_Name = albumName,
                            Album_Explain = albumExplain,
                            Width = 140,
                            Height = 140,
                            Margin = new Thickness(10, 2, 10, 2),
                            Effact = new TransitionEffect()
                            {
                                Kind = kinds[new Random().Next(2, 6)],
                                Duration = new TimeSpan(0, 0, 0, 0, 200)
                            }
                        };

                        if (albumImageUri != null)
                            albumInfo.Album_Image_Uri = albumImageUri;

                        Album_Infos.Add(albumInfo);
                    }
                    await Task.Delay(1);//单个平滑过渡
                    Num_Album_Infos++;

                    if (i % 100 == 0)
                    {
                        GC.Collect();
                        GC.WaitForPendingFinalizers();
                        if (Environment.OSVersion.Platform == PlatformID.Win32NT)
                        {
                            SetProcessWorkingSetSize(System.Diagnostics.Process.GetCurrentProcess().Handle, -1, -1);
                        }
                    }
                }

                GC.Collect();
                GC.WaitForPendingFinalizers();
                if (Environment.OSVersion.Platform == PlatformID.Win32NT)
                {
                    SetProcessWorkingSetSize(System.Diagnostics.Process.GetCurrentProcess().Handle, -1, -1);
                }
            });
            /// 滚动条多次异步刷新（一致性）
            RefCommand_Async = new RelayCommand(async () =>
            {
                if (AddToQueue_Complete == true)
                {
                    Album_Info_Class album_Info_Class = Album_Info_Class.Retuen_This();

                    for (int i = album_Info_Class.Start_Index; i <= album_Info_Class.End_Index; i++)
                    {
                        if (i >= album_Info_Class.Album_Names.Count || i >= album_Info_Class.Album_Image_Uris.Count)
                            break;

                        if (album_Info_Class.Album_Names[i] != null)
                        {
                            var existingAlbum = Album_Infos.FirstOrDefault(
                                item => item.Album_Name.Equals(album_Info_Class.Album_Names[i])
                                );
                            if (existingAlbum == null)
                            {
                                AddToQueue_Complete = false;
                                lock (Album_Infos)
                                {
                                    var albumName = album_Info_Class.Album_Names[i];
                                    var albumImageUri = album_Info_Class.Album_Image_Uris[i];
                                    var albumExplain = album_Info_Class.Album_Explain[i];
                                    var albumInfo = new Album_Info()
                                    {
                                        Album_No = i,
                                        Album_Name = albumName,
                                        Album_Explain = albumExplain,
                                        Width = 140,
                                        Height = 140,
                                        Margin = new Thickness(10, 2, 10, 2),
                                        Effact = new TransitionEffect()
                                        {
                                            Kind = kinds[new Random().Next(2, 6)],
                                            Duration = new TimeSpan(0, 0, 0, 0, 200)
                                        }
                                    };

                                    if (albumImageUri != null)
                                        albumInfo.Album_Image_Uri = albumImageUri;

                                    // 添加到队列中
                                    AddToQueue(albumInfo);
                                }
                            }
                        }
                    }

                    GC.Collect();
                    GC.WaitForPendingFinalizers();
                    if (Environment.OSVersion.Platform == PlatformID.Win32NT)
                    {
                        SetProcessWorkingSetSize(System.Diagnostics.Process.GetCurrentProcess().Handle, -1, -1);
                    }
                }
            });
        }

        public RelayCommand RefCommand { get; set; }
        public RelayCommand RefCommand_Async { get; set; }

        public List<TransitionEffectKind> kinds;
        private ObservableCollection<Album_Info> album_Infos;
        public ObservableCollection<Album_Info> Album_Infos
        {
            get { return album_Infos; }
            set { album_Infos = value; RaisePropertyChanged(); }
        }
        //保证数据一致性 + 动画过渡
        private readonly Queue<Album_Info> AlbumInfoQueue = new Queue<Album_Info>();
        private readonly SemaphoreSlim semaphore = new SemaphoreSlim(1);
        public void AddToQueue(Album_Info albumInfo)
        {
            AlbumInfoQueue.Enqueue(albumInfo);
            ProcessQueue();
        }
        private async Task ProcessQueue()
        {
            await semaphore.WaitAsync();

            try
            {
                while (AlbumInfoQueue.Count > 0)
                {
                    AddToQueue_Complete = false;

                    var AlbumInfo = AlbumInfoQueue.Dequeue();
                    var existingAlbum = Album_Infos.FirstOrDefault(
                        item => item.Album_Name.Equals(AlbumInfo.Album_Name)
                        );
                    if (existingAlbum == null)
                    {
                        Album_Infos.Add(AlbumInfo);
                        await Task.Delay(40); // 单个平滑过渡
                    }
                }
                AddToQueue_Complete = true;
                await Task.Delay(200);
            }
            finally
            {
                semaphore.Release();
            }
        }
        //代表以上单次事件的数据异步一致性加载完成
        private bool addToQueue_Complete;
        public bool AddToQueue_Complete
        {
            get { return addToQueue_Complete; }
            set { addToQueue_Complete = value; RaisePropertyChanged(); }
        }




        [DllImport("kernel32.dll")]
        private static extern bool SetProcessWorkingSetSize(IntPtr proc, int min, int max);

        public static ViewModel_Assembly_Album_Class temp { get; set; }
        public static ViewModel_Assembly_Album_Class Retuen_This()
        {
            temp = Return_This_Album_Performer_List_Infos();
            return temp;
        }
        private static ViewModel_Assembly_Album_Class Return_This_Album_Performer_List_Infos()
        {
            if (temp == null)
                temp = new ViewModel_Assembly_Album_Class();
            return temp;
        }

    }
}
