using MaterialDesignThemes.Wpf.Transitions;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;
using System.Windows;
using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.Command;
using TransitionEffect = MaterialDesignThemes.Wpf.Transitions.TransitionEffect;
using System.Windows.Media.Imaging;
using System.Threading;
using NSMusicS.UserControlLibrary.MusicPlayer_Main.MusicPlayer_Model_Control_Albums.ViewModel_Assembly_Singer_Show;


namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.MusicPlayer_Model_Control_Singers.ViewModel_Assembly_Singer_Show
{
    public class ViewModel_Assembly_Singer_ConvertTo_Album_Class : ViewModelBase
    {
        
        public int Num_Singer_Infos { get; set; }//检测是否已完成RelayCommand

        public ViewModel_Assembly_Singer_ConvertTo_Album_Class()
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

            Singer_Infos = new ObservableCollection<Singer_Info>();

            Num_Singer_Infos = 0;

            AddToQueue_Complete = false;

            /// 一次性全部刷新（一致性）
            RefCommand = new RelayCommand(async () =>
            {
                Singer_Info_Class Singer_Info_Class = Singer_Info_Class.Retuen_This();
                for (int i = 0; i < Singer_Info_Class.Singer_Image_Uris.Count; i++)
                {
                    var existingSinger = Singer_Infos.FirstOrDefault(
                            item => item.Singer_Name.Equals(Singer_Info_Class.Singer_Names[i])
                            );
                    if (existingSinger == null)
                    {
                        var singerName = Singer_Info_Class.Singer_Names[i];
                        var singerImageUri = Singer_Info_Class.Singer_Image_Uris[i];
                        var singerExplain = Singer_Info_Class.Singer_Explain[i];
                        var singerInfo = new Singer_Info()
                        {
                            Singer_No = i,
                            Singer_Name = singerName,
                            Singer_Explain = singerExplain,
                            Width = 140,
                            Height = 140,
                            Margin = new Thickness(10, 2, 10, 2),
                            Effact = new TransitionEffect()
                            {
                                Kind = kinds[new Random().Next(2, 6)],
                                Duration = new TimeSpan(0, 0, 0, 0, 200)
                            }
                        };

                        if (singerImageUri != null)
                            singerInfo.Singer_Image_Uri = singerImageUri;

                        Singer_Infos.Add(singerInfo);
                    }
                    await Task.Delay(1);//单个平滑过渡
                    Num_Singer_Infos++;

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
                    Singer_ConvertTo_Album_Info_Class singer_Info_Class = Singer_ConvertTo_Album_Info_Class.Retuen_This();

                    for (int i = singer_Info_Class.Start_Index; i <= singer_Info_Class.End_Index; i++)
                    {
                        if (i >= singer_Info_Class.Album_Names.Count || i >= singer_Info_Class.Singer_Image_Uris.Count)
                            break;

                        if (singer_Info_Class.Album_Names[i] != null)
                        {
                            var existingSinger = Singer_Infos.FirstOrDefault(
                                item => item.Album_Name.Equals(singer_Info_Class.Album_Names[i])
                                );
                            if (existingSinger == null)
                            {
                                AddToQueue_Complete = false;
                                lock (Singer_Infos)
                                {
                                    var singerName = singer_Info_Class.Singer_Names[i];
                                    var singerImageUri = singer_Info_Class.Singer_Image_Uris[i];
                                    var singerExplain = singer_Info_Class.Singer_Explain[i];
                                    var singerInfo = new Singer_Info()
                                    {
                                        Singer_No = i,
                                        Singer_Name = singerName,
                                        Album_Name = singer_Info_Class.Album_Names[i],
                                        Singer_Explain = singerExplain,
                                        Width = 140,
                                        Height = 140,
                                        Margin = new Thickness(10, 2, 10, 2),
                                        Effact = new TransitionEffect()
                                        {
                                            Kind = kinds[new Random().Next(2, 6)],
                                            Duration = new TimeSpan(0, 0, 0, 0, 200)
                                        }
                                    };

                                    if (singerImageUri != null)
                                        singerInfo.Singer_Image_Uri = singerImageUri;

                                    // 添加到队列中
                                    AddToQueue(singerInfo);
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
        private ObservableCollection<Singer_Info> singer_Infos;
        public ObservableCollection<Singer_Info> Singer_Infos
        {
            get { return singer_Infos; }
            set { singer_Infos = value; RaisePropertyChanged(); }
        }
        //保证数据一致性 + 动画过渡
        private readonly Queue<Singer_Info> SingerInfoQueue = new Queue<Singer_Info>();
        private readonly SemaphoreSlim semaphore = new SemaphoreSlim(1);
        public void AddToQueue(Singer_Info SingerInfo)
        {
            SingerInfoQueue.Enqueue(SingerInfo);
            ProcessQueue();
        }
        private async Task ProcessQueue()
        {
            await semaphore.WaitAsync();

            try
            {
                while (SingerInfoQueue.Count > 0)
                {
                    AddToQueue_Complete = false;

                    var SingerInfo = SingerInfoQueue.Dequeue();
                    var existingSinger = Singer_Infos.FirstOrDefault(
                        item => item.Album_Name.Equals(SingerInfo.Album_Name)
                        );
                    if (existingSinger == null)
                    {
                        Singer_Infos.Add(SingerInfo);
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

        public static ViewModel_Assembly_Singer_ConvertTo_Album_Class temp { get; set; }
        public static ViewModel_Assembly_Singer_ConvertTo_Album_Class Retuen_This()
        {
            temp = Return_This_Singer_Performer_List_Infos();
            return temp;
        }
        private static ViewModel_Assembly_Singer_ConvertTo_Album_Class Return_This_Singer_Performer_List_Infos()
        {
            if (temp == null)
                temp = new ViewModel_Assembly_Singer_ConvertTo_Album_Class();
            return temp;
        }
    }
}
