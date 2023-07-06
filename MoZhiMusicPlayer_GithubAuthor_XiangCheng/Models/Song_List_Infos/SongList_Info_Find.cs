using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_List_Infos
{
    public class SongList_Info_Find
    {
        private async void ImportSongs_Click(List<Song_Info> List_SongInfo)
        {
            // 获取待导入的歌曲文件列表
            var openFileDialog = new OpenFileDialog();
            openFileDialog.Multiselect = true;
            openFileDialog.Filter = "MP3 Files (*.mp3)|*.mp3";
            if (openFileDialog.ShowDialog() == true)
            {
                // 使用多线程导入歌曲
                var tasks = new List<Task>();
                foreach (var file in openFileDialog.FileNames)
                {
                    tasks.Add(Task.Run(() => ImportSong(file)));
                }
                await Task.WhenAll(tasks);
            }
        }

        private void ImportSong(string filePath)
        {
            // 导入歌曲的代码
        }
    }
}
