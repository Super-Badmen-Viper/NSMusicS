using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Xml;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_List_Infos
{
    public class SongList_Info_Reader
    {

        private static ImageBrush ImageBrush_LoveEnter
            = new ImageBrush(new BitmapImage(
                new Uri(@"Resource\\Button_Image_Ico\\爱心 - 副本.png", UriKind.Relative)));
        private static ImageBrush ImageBrush_LoveNormal
            = new ImageBrush(new BitmapImage(
                new Uri(@"Resource\\Button_Image_Ico\\爱心 (1).png", UriKind.Relative)));

        public static ObservableCollection<Song_Info> song_Infos_Love { get; set; }

        public static ObservableCollection<SongList_Info> ReadSongList_Infos(string filePath)
        {
            var playlists = new ObservableCollection<SongList_Info>();

            XmlDocument doc = new XmlDocument();
            doc.Load(filePath);
            XmlNodeList playlistNodes = doc.SelectNodes("/Song_Infos/Song_Info");

            foreach (XmlNode playlistNode in playlistNodes)
            {
                var playlist = new SongList_Info();
                playlist.ID = int.Parse(playlistNode.Attributes["ID"].Value);
                playlist.Name = playlistNode.Attributes["Name"].Value;
                playlist.Songs = new ObservableCollection<Song_Info>();

                XmlNodeList songNodes = playlistNode.SelectNodes("Song");
                foreach (XmlNode songNode in songNodes)
                {
                    var song = new Song_Info();
                    song.Song_Name = songNode.SelectSingleNode("Song_Name").InnerText;
                    song.Singer_Name = songNode.SelectSingleNode("Singer_Name").InnerText;
                    song.Album_Name = songNode.SelectSingleNode("Album_Name").InnerText;
                    song.Song_Url = songNode.SelectSingleNode("Song_Url").InnerText;
                    song.Song_Duration = songNode.SelectSingleNode("Song_Duration").InnerText;
                    song.Song_No = Convert.ToInt16(songNode.SelectSingleNode("Song_No").InnerText);
                    song.Song_Like = Convert.ToInt16(songNode.SelectSingleNode("Song_Like").InnerText);
                    song.MV_Path = songNode.SelectSingleNode("MV_Path").InnerText;

                    if (song.Song_Like == 1)
                        song.Song_Like_Image = ImageBrush_LoveEnter;
                    else
                        song.Song_Like_Image = ImageBrush_LoveNormal;

                    if (song_Infos_Love != null)
                        for (int i = 0; i < song_Infos_Love.Count; i++)
                            if (song.Song_Url.Equals(song_Infos_Love[i].Song_Url))
                            {
                                song.Song_Like = 1;
                                song.Song_Like_Image = ImageBrush_LoveEnter;
                                break;
                            }

                    song.Song_MV_Image = null;
                    playlist.Songs.Add(song);
                }

                playlists.Add(playlist);
            }

            return playlists;
        }

        


    }
}
