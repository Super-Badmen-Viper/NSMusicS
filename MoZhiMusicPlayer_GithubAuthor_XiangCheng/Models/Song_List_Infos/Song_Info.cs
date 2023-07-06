using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.Command;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;
using System.Windows.Media;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_List_Infos
{
    public class Song_Info: ViewModelBase
    {
        public string Song_Name { get; set; }
        public string Singer_Name { get; set; }
        public string Album_Name { get; set; }
        public string Song_Url { get; set; }
        public string Song_Duration { get; set; }
        public int Song_No { get; set; }
        public int Song_Like { get; set; }      
        public string MV_Path { get; set; }

        public ImageBrush Song_Like_Image { get; set; }
        public ImageBrush Song_MV_Image { get; set; }

        private bool m_IsChecked;
        public bool IsChecked
        {
            get
            {
                return m_IsChecked;
            }
            set
            {
                m_IsChecked = value;
                RaisePropertyChanged("IsChecked");
            }
        }
    }
}
