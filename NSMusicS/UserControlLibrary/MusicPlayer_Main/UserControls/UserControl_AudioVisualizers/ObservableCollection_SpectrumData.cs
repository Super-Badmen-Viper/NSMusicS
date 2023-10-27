using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSMusicS.UserControlLibrary.MusicPlayer_Main.UserControls.UserControl_AudioVisualizers
{
    public class ObservableCollection_SpectrumData<T> : ObservableCollection<T>
    {
        private object lockobj = new object();

        public new void Add(T item)
        {
            // 添加自定义逻辑
            // ...
            lock (lockobj)
            {
                base.Add(item); // 调用基类的 Add 方法
            }
        }

        public new T this[int index]
        {
            get
            {
                // 添加自定义逻辑
                // ...

                lock (lockobj)
                {
                    return base[index]; // 调用基类的索引访问方法
                }
            }
            set
            {
                // 添加自定义逻辑
                // ...
                lock (lockobj)
                {
                    base[index] = value; // 调用基类的索引设置方法
                }
            }
        }
    }
}
