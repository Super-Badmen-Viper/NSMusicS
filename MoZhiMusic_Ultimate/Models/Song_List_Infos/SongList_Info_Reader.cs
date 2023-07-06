using System;
using System.Collections.Generic;
using System.Xml;

namespace MoZhiMusic_Ultimate.Models.Song_List_Infos
{
    public class SongList_Info_Reader
    {
        public static List<SongList_Info> ReadSongList_Infos(string filePath)
        {
            var playlists = new List<SongList_Info>();

            XmlDocument doc = new XmlDocument();
            doc.Load(filePath);
            XmlNodeList playlistNodes = doc.SelectNodes("/Song_Infos/Song_Info");

            foreach (XmlNode playlistNode in playlistNodes)
            {
                var playlist = new SongList_Info();
                playlist.ID = int.Parse(playlistNode.Attributes["ID"].Value);
                playlist.Name = playlistNode.Attributes["Name"].Value;
                playlist.Songs = new List<Song_Info>();

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
                    song.Song_Like_Image = null;
                    song.Song_MV_Image = null;
                    playlist.Songs.Add(song);
                }

                playlists.Add(playlist);
            }

            return playlists;
        }
        public static SongList_Info ReadSong_Infos(string filePath)
        {
            XmlDocument doc = new XmlDocument();
            doc.Load(filePath);
            XmlNodeList playlistNodes = doc.SelectNodes("/Song_Infos/Song_Info");

            foreach (XmlNode playlistNode in playlistNodes)
            {
                var playlist = new SongList_Info();
                playlist.ID = int.Parse(playlistNode.Attributes["ID"].Value);
                playlist.Name = playlistNode.Attributes["Name"].Value;
                playlist.Songs = new List<Song_Info>();

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
                    song.Song_Like_Image = null;
                    song.Song_MV_Image = null;
                    playlist.Songs.Add(song);
                }

                return playlist;
            }

            return null;
        }
    }
}
