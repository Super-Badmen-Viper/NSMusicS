using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.Command;
using AduSkin.Controls.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.ObjectModel;
using MoZhiMusic_Ultimate.Models.Song_List_Infos;

namespace MoZhiMusic_Ultimate.ViewModels.Init_DataGrid_Info
{
    public class Init_DataGrid : ViewModelBase
    {
        private ObservableCollection<Song_Info> song_Info;
        /// <summary>
        /// 联系人列表
        /// </summary>
        public ObservableCollection<Song_Info> Song_Info
        {
            get { return song_Info; }
            set { Set(ref song_Info, value); }
        }

        private bool _IsAllChecked;
        /// <summary>
        /// 全选
        /// </summary>
        public bool IsAllChecked
        {
            get { return _IsAllChecked; }
            set
            {
                Set(ref _IsAllChecked, value);
                foreach (var item in Song_Info)
                    item.IsChecked = IsAllChecked;
            }
        }
    }
}
