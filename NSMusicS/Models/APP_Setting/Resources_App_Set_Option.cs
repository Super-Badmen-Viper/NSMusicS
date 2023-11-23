using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace NSMusicS.Models.APP_Setting
{
    public class Resources_App_Set_Option : INotifyPropertyChanged
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

        public Resources_App_Set_Option() 
        {
            _color_Desktop_Lyic_Color = (Color)ColorConverter.ConvertFromString("#FF00FFA2");
            _font_size_Desktop_Lyic = 22;
            _color_Window_Lyic_Color = (Color)ColorConverter.ConvertFromString("#FF00FFA2");
            _font_size_Window_Lyic = 36;


        }

        #region 歌词属性
        private Color _color_Desktop_Lyic_Color;
        /// <summary>
        /// 播放歌词
        /// </summary>
        public Color Color_Desktop_Lyic_Color
        {
            get
            {
                return _color_Desktop_Lyic_Color;
            }
            set
            {
                if (_color_Desktop_Lyic_Color != value)
                {
                    _color_Desktop_Lyic_Color = value;
                    RaisePropertyChanged("Color_Desktop_Lyic_Color");
                }
            }
        }
        private int _font_size_Desktop_Lyic;
        /// <summary>
        /// 播放歌词
        /// </summary>
        public int Font_size_Desktop_Lyic
        {
            get
            {
                return _font_size_Desktop_Lyic;
            }
            set
            {
                if (_font_size_Desktop_Lyic != value)
                {
                    _font_size_Desktop_Lyic = value;
                    RaisePropertyChanged("Font_size_Desktop_Lyic");
                }
            }
        }

        private Color _color_Window_Lyic_Color;
        /// <summary>
        /// 桌面歌词
        /// </summary>
        public Color Color_Window_Lyic_Color
        {
            get
            {
                return _color_Window_Lyic_Color;
            }
            set
            {
                if (_color_Window_Lyic_Color != value)
                {
                    _color_Window_Lyic_Color = value;
                    RaisePropertyChanged("Color_Window_Lyic_Color");
                }
            }
        }
        private int _font_size_Window_Lyic;
        /// <summary>
        /// 桌面歌词
        /// </summary>
        public int Font_size_Window_Lyic
        {
            get
            {
                return _font_size_Window_Lyic;
            }
            set
            {
                if (_font_size_Window_Lyic != value)
                {
                    _font_size_Window_Lyic = value;
                    RaisePropertyChanged("Font_size_Window_Lyic");
                }
            }
        }


        #endregion
    }
}
