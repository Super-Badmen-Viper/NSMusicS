using Shell32;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Xml;
using System.Xml.Linq;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text.Json.Nodes;

namespace NSMusicS.Models.Song_List_Infos
{
    public class SongList_Info_Reader
    {

        private static Uri ImageBrush_LoveEnter
            = new Uri(@"Resource\\Button_Image_Svg\\已收藏.svg", UriKind.Relative);
        private static Uri ImageBrush_LoveNormal
            = new Uri(@"Resource\\Button_Image_Svg\\收藏.svg", UriKind.Relative);

        public static ObservableCollection<Song_Info> song_Infos_Love { get; set; }

        public static ObservableCollection<SongList_Info> ReadSongList_Infos_To_XML(string filePath)
        {
            var playlists = new ObservableCollection<SongList_Info>();

            XDocument doc = XDocument.Load(filePath);
            var playlistNodes = doc.Descendants("Song_Info");

            foreach (var playlistNode in playlistNodes)
            {
                var playlist = new SongList_Info();
                playlist.ID = int.Parse(playlistNode.Attribute("ID").Value);
                playlist.Name = playlistNode.Attribute("Name").Value;
                playlist.Songs = new ObservableCollection<Song_Info>();

                var songNodes = playlistNode.Descendants("Song");
                foreach (var songNode in songNodes)
                {
                    var song = new Song_Info();
                    song.Song_Name = songNode.Element("Song_Name").Value;
                    song.Singer_Name = songNode.Element("Singer_Name").Value;

                    song.Album_Name = songNode.Element("Album_Name").Value;
                    if (song.Album_Name.Length == 0)
                        song.Album_Name = "未知专辑";

                    song.Song_Url = songNode.Element("Song_Url").Value;
                    song.Song_Duration = GetMediaDuration(song.Song_Url);

                    song.Song_No = Convert.ToInt16(songNode.Element("Song_No").Value);
                    song.Song_Like = Convert.ToInt16(songNode.Element("Song_Like").Value);
                    song.MV_Path = songNode.Element("MV_Path").Value;

                    song.Visibility_Playing = System.Windows.Visibility.Collapsed;

                    if (song.Song_Like == 1)
                        song.Song_Like_Image = ImageBrush_LoveEnter;
                    else
                        song.Song_Like_Image = ImageBrush_LoveNormal;

                    if (song_Infos_Love != null && song_Infos_Love.Any(s => s.Song_Url.Equals(song.Song_Url)))
                    {
                        song.Song_Like = 1;
                        song.Song_Like_Image = ImageBrush_LoveEnter;
                    }

                    song.Song_MV_Image = null;
                    playlist.Songs.Add(song);
                }

                playlists.Add(playlist);
            }

            return playlists;
        }
        public static string GetMediaDuration(string songPath)
        {
            if (File.Exists(songPath))
            {
                try
                {
                    string albumTemp = string.Empty;
                    ShellClass sh = new ShellClass();
                    Folder dir = sh.NameSpace(Path.GetDirectoryName(songPath));
                    FolderItem item = dir.ParseName(Path.GetFileName(songPath));
                    String durationStr = dir.GetDetailsOf(item, 27);    //获取时长字符串(00:00:01)
                    if (!durationStr.Equals(""))
                    {
                        try
                        {
                            String[] durationArray = durationStr.Split(':');    //获取长度  iColumn:27
                            int duration = 0;    //时长(毫秒)
                            duration += int.Parse(durationArray[0]) * 60 * 60 * 1000;
                            duration += int.Parse(durationArray[1]) * 60 * 1000;
                            duration += int.Parse(durationArray[2]) * 1000;
                        }
                        catch (Exception ex)
                        {
                            //log
                        }
                    }
                    durationStr = durationStr.Substring(3);

                    return durationStr;
                }
                catch (Exception ex)
                {

                    return null;
                }
            }
            else
                return null;
        }

        public static ObservableCollection<SongList_Info> ReadSongList_Infos_To_Json(string filePath)
        {
            filePath = filePath.Replace("xml", "json");

            var jsonString = File.ReadAllText(filePath);
            JArray recordsArray = (JArray)JObject.Parse(jsonString)["Song_Infos"];

            var playlists = new ObservableCollection<SongList_Info>();
            foreach (JObject record in recordsArray)
            {
                var playlist = new SongList_Info();
                playlist.ID = (int)record["ID"];
                playlist.Name = (string)record["Name"];
                playlist.Songs = new ObservableCollection<Song_Info>();

                JArray jArray = (JArray)record["Songs"];
                foreach (var item in jArray)
                {
                    var song = new Song_Info();
                    song.Song_Name = item["Song_Name"].ToString();
                    song.Singer_Name = item["Singer_Name"].ToString();

                    song.Album_Name = item["Album_Name"].ToString();
                    if (song.Album_Name.Length == 0)
                        song.Album_Name = "未知专辑";

                    song.Song_Url = item["Song_Url"].ToString();
                    song.Song_Duration = GetMediaDuration(song.Song_Url);

                    song.Song_No = Convert.ToInt16(item["Song_No"]);
                    song.Song_Like = Convert.ToInt16(item["Song_Like"]);
                    song.MV_Path = item["MV_Path"].ToString();

                    song.Visibility_Playing = System.Windows.Visibility.Collapsed;

                    if (song.Song_Like == 1)
                        song.Song_Like_Image = ImageBrush_LoveEnter;
                    else
                        song.Song_Like_Image = ImageBrush_LoveNormal;

                    if (song_Infos_Love != null && song_Infos_Love.Any(s => s.Song_Url.Equals(song.Song_Url)))
                    {
                        song.Song_Like = 1;
                        song.Song_Like_Image = ImageBrush_LoveEnter;
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
