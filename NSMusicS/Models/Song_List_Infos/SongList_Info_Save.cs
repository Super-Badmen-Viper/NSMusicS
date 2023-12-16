using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.StartPanel;
using System.Xml;
using System.Collections.ObjectModel;
using static NSMusicS.Models.Servies_For_API_Info.API_Song_Info;
using System.Text.Json;
using System.IO;

namespace NSMusicS.Models.Song_List_Infos
{
    public class SongList_Info_Save
    {
        public static void SaveSongList_Infos_To_XML(string filePath, ObservableCollection<SongList_Info> songList_Infos)
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

        public static void SaveSongList_Infos_To_Json(string filePath, ObservableCollection<SongList_Info> songList_Infos)
        {
            filePath = filePath.Replace("xml","json");

            var songInfos = new SongInfos();
            songInfos.Song_Infos = new ObservableCollection<Song_Info>();

            foreach (var songList_Info in songList_Infos)
            {
                var songInfo = new Song_Info();
                songInfo.ID = songList_Info.ID;
                songInfo.Name = songList_Info.Name;
                songInfo.Songs = new ObservableCollection<Song>();

                foreach (var song in songList_Info.Songs)
                {
                    var songElement = new Song();
                    songElement.Song_Name = song.Song_Name;
                    songElement.Singer_Name = song.Singer_Name;
                    songElement.Album_Name = song.Album_Name;
                    songElement.Song_Url = song.Song_Url;
                    songElement.Song_Duration = song.Song_Duration;
                    songElement.Song_No = song.Song_No;

                    if (filePath.IndexOf("Love") > 0)
                        songElement.Song_Like = 1;
                    else
                        songElement.Song_Like = 0;

                    songElement.MV_Path = song.MV_Path;

                    songInfo.Songs.Add(songElement);
                }

                songInfos.Song_Infos.Add(songInfo);
            }

            var options = new JsonSerializerOptions
            {
                WriteIndented = true
            };

            var json = JsonSerializer.Serialize(songInfos, options);

            File.WriteAllText(filePath, json);
        }
        public class SongInfos
        {
            public ObservableCollection<Song_Info> Song_Infos { get; set; }
        }
        public class Song_Info
        {
            public int ID { get; set; }
            public string Name { get; set; }
            public ObservableCollection<Song> Songs { get; set; }
        }
        public class Song
        {
            public string Song_Name { get; set; }
            public string Singer_Name { get; set; }
            public string Album_Name { get; set; }
            public string Song_Url { get; set; }
            public string Song_Duration { get; set; }
            public int Song_No { get; set; }
            public int Song_Like { get; set; }
            public string MV_Path { get; set; }
        }


    }
}
