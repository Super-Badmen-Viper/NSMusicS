using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS_For_Knowledge_Graph.Models
{
    public class MusicData_Singer_Info : INotifyPropertyChanged
    {
        /// <summary>
        /// 该歌手基本信息
        /// 该歌手详情
        /// </summary>
        public int ar_id { get; set; }
        public string ar_name { get; set; }
        public string ar_picUrl { get; set; }
        public string ar_img1v1Url { get; set; }
        public JArray ar_alias { get; set; }
        public int ar_musicSize { get; set; }
        public int ar_albumSize { get; set; }
        public int ar_mvSize { get; set; }

        /// <summary>
        /// 该歌手详情信息
        /// </summary>
        public List<MusicData_Singer_Details> musicData_Singer_Details { get; set; }

        /// <summary>
        /// 该歌手热歌
        /// </summary>
        public List<MusicData_Singer_HotSongs> musicData_Singer_HotSongs { get; set; }
        /// <summary>
        /// 该歌手所有专辑
        /// </summary>
        public List<MusicData_Singer_ALL_Album> musicData_Singer_ALL_Albums { get; set; }
        /// <summary>
        /// 该歌手所有MV
        /// </summary>
        public List<MusicData_Singer_ALL_MV> musicData_Singer_ALL_MVs { get; set; }



        /*private int _id;
        public int id
        {
            get
            {
                return _id;
            }
            set
            {
                if (_id != value)
                {
                    _id = value;
                    RaisePropertyChanged("id");
                }
            }
        }*/
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
    }
}
