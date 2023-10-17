using Shell32;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Xml;

namespace NSMusicS.Models.Song_List_Infos
{
    public class SongList_Info_Reader
    {

        private static Uri ImageBrush_LoveEnter
            = new Uri(@"Resource\\Button_Image_Svg\\已收藏.svg", UriKind.Relative);
        private static Uri ImageBrush_LoveNormal
            = new Uri(@"Resource\\Button_Image_Svg\\收藏.svg", UriKind.Relative);

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
                    if (song.Album_Name.Length == 0)
                        song.Album_Name = "未知专辑";

                    song.Song_Url = songNode.SelectSingleNode("Song_Url").InnerText;

                    //song.Song_Duration = songNode.SelectSingleNode("Song_Duration").InnerText;
                    song.Song_Duration = GetMediaDuration(song.Song_Url);

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
    }
}
