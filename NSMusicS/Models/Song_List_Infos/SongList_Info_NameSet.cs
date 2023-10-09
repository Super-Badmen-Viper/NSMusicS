using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace NSMusicS.Models.Song_List_Infos
{
    public class SongList_Info_NameSet
    {
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

                    song.Song_MV_Image = null;
                    playlist.Songs.Add(song);
                }

                playlists.Add(playlist);
            }

            return playlists;
        }

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
