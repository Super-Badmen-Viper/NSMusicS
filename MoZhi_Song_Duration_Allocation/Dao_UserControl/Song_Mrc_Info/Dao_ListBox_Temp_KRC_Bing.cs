using System;
using System.ComponentModel;
using System.Windows;

namespace NSMusicS.Dao_UserControl.Song_Mrc_Info
{
    class Dao_ListBox_Temp_MRC_Bing : INotifyPropertyChanged
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

        private string _Song_MRC_Line;
        public string Song_MRC_Line
        {
            get
            {
                return _Song_MRC_Line;
            }
            set
            {
                if (_Song_MRC_Line != value)
                {
                    _Song_MRC_Line = value;
                    RaisePropertyChanged("Song_MRC_Line");
                }
            }
        }
        private string _Song_CRC_Line;
        public string Song_CRC_Line
        {
            get
            {
                return _Song_CRC_Line;
            }
            set
            {
                if (_Song_CRC_Line != value)
                {
                    _Song_CRC_Line = value;
                    RaisePropertyChanged("Song_CRC_Line");
                }
            }
        }
        private Uri _Singer_Head_Image;
        public Uri Singer_Head_Image
        {
            get
            {
                return _Singer_Head_Image;
            }
            set
            {
                if (_Singer_Head_Image != value)
                {
                    _Singer_Head_Image = value;
                    RaisePropertyChanged("Singer_Head_Image");
                }
            }
        }
        private Visibility _Singer_Head_Image_Show;
        public Visibility Singer_Head_Image_Show
        {
            get
            {
                return _Singer_Head_Image_Show;
            }
            set
            {
                if (_Singer_Head_Image_Show != value)
                {
                    _Singer_Head_Image_Show = value;
                    RaisePropertyChanged("Singer_Head_Image_Show");
                }
            }
        }


    }
}
