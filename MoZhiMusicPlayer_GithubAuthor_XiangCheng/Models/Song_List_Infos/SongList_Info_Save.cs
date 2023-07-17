using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.StartPanel;
using System.Xml;
using System.Collections.ObjectModel;

namespace MoZhiMusicPlayer_GithubAuthor_XiangCheng.Models.Song_List_Infos
{
    public class SongList_Info_Save
    {
        public static void SaveSongList_Infos(string filePath, ObservableCollection<SongList_Info> songList_Infos)
        {
            var doc = new XmlDocument();
            var declaration = doc.CreateXmlDeclaration("1.0", "utf-8", null);
            doc.AppendChild(declaration);

            var root = doc.CreateElement("Song_Infos");
            doc.AppendChild(root);

            foreach (var songList_Info in songList_Infos)
            {
                var songList_InfoElement = doc.CreateElement("Song_Info");
                songList_InfoElement.SetAttribute("ID", songList_Info.ID.ToString());
                songList_InfoElement.SetAttribute("Name", songList_Info.Name);

                foreach (var song in songList_Info.Songs)
                {
                    var songElement = doc.CreateElement("Song");

                    var song_NameElement = doc.CreateElement("Song_Name");
                    song_NameElement.InnerText = song.Song_Name;
                    songElement.AppendChild(song_NameElement);

                    var singer_NameElement = doc.CreateElement("Singer_Name");
                    singer_NameElement.InnerText = song.Singer_Name;
                    songElement.AppendChild(singer_NameElement);

                    var album_NameElement = doc.CreateElement("Album_Name");
                    album_NameElement.InnerText = song.Album_Name;
                    songElement.AppendChild(album_NameElement);

                    var song_UrlElement = doc.CreateElement("Song_Url");
                    song_UrlElement.InnerText = song.Song_Url;
                    songElement.AppendChild(song_UrlElement);

                    var song_DurationElement = doc.CreateElement("Song_Duration");
                    song_DurationElement.InnerText = song.Song_Duration;
                    songElement.AppendChild(song_DurationElement);

                    var song_NoElement = doc.CreateElement("Song_No");
                    song_NoElement.InnerText = song.Song_No.ToString();
                    songElement.AppendChild(song_NoElement);

                    var song_LikeElement = doc.CreateElement("Song_Like");
                    if (filePath.IndexOf("Love") > 0)
                        song.Song_Like = 1;
                    else 
                        song.Song_Like = 0;
                    song_LikeElement.InnerText = song.Song_Like.ToString();
                    songElement.AppendChild(song_LikeElement);

                    var mv_PathElement = doc.CreateElement("MV_Path");
                    mv_PathElement.InnerText = song.MV_Path;
                    songElement.AppendChild(mv_PathElement);

                    songList_InfoElement.AppendChild(songElement);
                }

                root.AppendChild(songList_InfoElement);
            }

            doc.Save(filePath);
        }
    }
}
