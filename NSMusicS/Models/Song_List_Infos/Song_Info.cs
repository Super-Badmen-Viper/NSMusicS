using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.Command;
using MaterialDesignThemes.Wpf.Transitions;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace NSMusicS.Models.Song_List_Infos
{
    public class Song_Info : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;
        protected internal virtual void OnPropertyChanged(string propertyName)
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
        }
        protected void RaisePropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        private string _song_Name;
        public string Song_Name
        {
            get
            {
                return _song_Name;
            }
            set
            {
                if (_song_Name != value)
                {
                    _song_Name = value;
                    RaisePropertyChanged("Song_Name");
                }
            }
        }

        private string _singer_Name;
        public string Singer_Name
        {
            get
            {
                return _singer_Name;
            }
            set
            {
                if (_singer_Name != value)
                {
                    _singer_Name = value;
                    RaisePropertyChanged("Singer_Name");
                }
            }
        }

        private string _album_Name;
        public string Album_Name
        {
            get
            {
                return _album_Name;
            }
            set
            {
                if (_album_Name != value)
                {
                    _album_Name = value;
                    RaisePropertyChanged("Album_Name");
                }
            }
        }

        private string _song_Url;
        public string Song_Url
        {
            get
            {
                return _song_Url;
            }
            set
            {
                if (_song_Url != value)
                {
                    _song_Url = value;
                    RaisePropertyChanged("Song_Url");
                }
            }
        }

        private string _song_Duration;
        public string Song_Duration
        {
            get
            {
                return _song_Duration;
            }
            set
            {
                if (_song_Duration != value)
                {
                    _song_Duration = value;
                    RaisePropertyChanged("Song_Duration");
                }
            }
        }

        private int _song_No;
        public int Song_No
        {
            get
            {
                return _song_No;
            }
            set
            {
                if (_song_No != value)
                {
                    _song_No = value;
                    RaisePropertyChanged("Song_No");
                }
            }
        }

        private int _song_Like;
        public int Song_Like
        {
            get
            {
                return _song_Like;
            }
            set
            {
                if (_song_Like != value)
                {
                    _song_Like = value;
                    RaisePropertyChanged("Song_Like");
                }
            }
        }

        private string _MV_Path;
        public string MV_Path
        {
            get
            {
                return _MV_Path;
            }
            set
            {
                if (_MV_Path != value)
                {
                    _MV_Path = value;
                    RaisePropertyChanged("MV_Path");
                }
            }
        }


        // 依此类推，实现其他属性...

        private bool _isChecked;
        public bool IsChecked
        {
            get
            {
                return _isChecked;
            }
            set
            {
                if (_isChecked != value)
                {
                    _isChecked = value;
                    RaisePropertyChanged("IsChecked");
                }
            }
        }

        private Uri _song_Like_Image;
        public Uri Song_Like_Image
        {
            get
            {
                return _song_Like_Image;
            }
            set
            {
                if (_song_Like_Image != value)
                {
                    _song_Like_Image = value;
                    RaisePropertyChanged("Song_Like_Image");
                }
            }
        }

        private Uri _song_MV_Image;
        public Uri Song_MV_Image
        {
            get
            {
                return _song_MV_Image;
            }
            set
            {
                if (_song_MV_Image != value)
                {
                    _song_MV_Image = value;
                    RaisePropertyChanged("Song_MV_Image");
                }
            }
        }

        private bool _bool_Playing = false;
        public bool Bool_Playing
        {
            get
            {
                return _bool_Playing;
            }
            set
            {
                if (_bool_Playing != value)
                {
                    _bool_Playing = value;
                    RaisePropertyChanged("Bool_Playing");
                }
            }
        }
        private Visibility _visibility_Playing = Visibility.Collapsed;
        public Visibility Visibility_Playing
        {
            get
            {
                return _visibility_Playing;
            }
            set
            {
                if (_visibility_Playing != value)
                {
                    _visibility_Playing = value;
                    RaisePropertyChanged("Visibility_Playing");
                }
            }
        }



        /// <summary>
        /// Web 音乐文件路径（普通）
        /// </summary>
        private string _song_Web_Url;
        public string Song_Web_Url
        {
            get
            {
                return _song_Web_Url;
            }
            set
            {
                if (_song_Web_Url != value)
                {
                    _song_Web_Url = value;
                    RaisePropertyChanged("Song_Web_Url");
                }
            }
        }
        /// <summary>
        /// Web 专辑图片路径（普通）
        /// </summary>
        private Uri _song_Web_Album_Image;
        public Uri Song_Web_Album_Image
        {
            get
            {
                return _song_Web_Album_Image;
            }
            set
            {
                if (_song_Web_Album_Image != value)
                {
                    _song_Web_Album_Image = value;
                    RaisePropertyChanged("Song_Web_Album_Image");
                }
            }
        }
        /// <summary>
        /// Web 歌词文本 路径（普通）
        /// </summary>
        private string _song_Web_Lyic;
        public string Song_Web_Lyic
        {
            get
            {
                return _song_Web_Lyic;
            }
            set
            {
                if (_song_Web_Lyic != value)
                {
                    _song_Web_Lyic = value;
                    RaisePropertyChanged("Song_Web_Lyic");
                }
            }
        }
    }

}
