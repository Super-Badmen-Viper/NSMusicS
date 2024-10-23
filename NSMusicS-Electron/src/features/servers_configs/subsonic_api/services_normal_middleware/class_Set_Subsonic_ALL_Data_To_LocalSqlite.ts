import {Playlists_ApiService_of_ND} from "@/features/servers_configs/subsonic_api/services_normal/playlists/index_service";
import {Browsing_ApiService_of_ND} from "@/features/servers_configs/subsonic_api/services_normal/browsing/index_service";
import {
    Media_Retrieval_ApiService_of_ND
} from "@/features/servers_configs/subsonic_api/services_normal/media_retrieval/index_service";
import {store_server_users} from "@/store/server/store_server_users";
import {
    Album$Songs_Lists_ApiService_of_ND
} from "@/features/servers_configs/subsonic_api/services_normal/album$songs_lists/index_service";
import {Set_ArtistInfo_To_LocalSqlite} from "@/features/sqlite3_local_configs/class_Set_ArtistInfo_To_LocalSqlite";
import {Set_AlbumInfo_To_LocalSqlite} from "@/features/sqlite3_local_configs/class_Set_AlbumInfo_To_LocalSqlite";
import {Set_MediaInfo_To_LocalSqlite} from "@/features/sqlite3_local_configs/class_Set_MediaInfo_To_LocalSqlite";
import {store_local_data_set_albumInfo} from "@/store/local/local_data_synchronization/store_local_data_set_albumInfo";
import {
    store_local_data_set_artistInfo
} from "@/store/local/local_data_synchronization/store_local_data_set_artistInfo";
import {store_local_data_set_mediaInfo} from "@/store/local/local_data_synchronization/store_local_data_set_mediaInfo";
import {store_playlist_list_info} from "@/store/view/playlist/store_playlist_list_info";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {store_playlist_list_logic} from "@/store/view/playlist/store_playlist_list_logic";
import {
    store_local_data_set_annotionInfo
} from "@/store/local/local_data_synchronization/store_local_data_set_annotionInfo";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
import moment from "moment/moment";
const path = require('path');

export class Set_Subsonic_ALL_Data_To_LocalSqlite{
    private getUniqueId(db: any,table: any,id_name: any) {
        const { v4: uuidv4 } = require('uuid');
        let id = uuidv4();
        while (db.prepare(`SELECT COUNT(*) FROM ${table} WHERE ${id_name} = ?`).pluck().get(id) > 0) {
            id = uuidv4();
        }
        return id;
    }
    private convertToLRC(lyrics: {start: number;value: string}[]): string {
        let lrcContent = '';
        for (const line of lyrics) {
            const minutes = Math.floor(line.start / 60000);
            const seconds = Math.floor((line.start % 60000) / 1000);
            const milliseconds = (line.start % 1000).toString().padStart(3, '0').slice(0, 2);
            const timeTag = `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}]`;
            lrcContent += `${timeTag}${line.value}\n`;
        }
        return lrcContent;
    }
    private insertData(db:any, table:any, data_old:any) {
        if (Object.keys(data_old).length === 0) return;
        let data = { ...data_old };
        if (table === 'server_artist' && data.hasOwnProperty('albums'))
            delete data.albums;
        if (table === 'server_album' && data.hasOwnProperty('media'))
            delete data.media;
        const columns = Object.keys(data).join(', ');
        const values = Object.values(data).map(value => {
            if (typeof value === 'object' && value !== null && 'id' in value) {
                return value.id;
            }
            return String(value);
        });
        const sql = `INSERT INTO ${table} (${columns}) VALUES (${columns.split(', ').map(() => '?').join(', ')})`;
        const stmt = db.prepare(sql);
        try {
            stmt.run(values);
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }
    public async Set_Read_Subsonic_Api_BasicInfo_Add_LocalSqlite(
        url: string,
        username: string,token: string,salt: string
    ): Promise<any> {
        const NodeCache = require('node-cache');
        const cache = new NodeCache();

        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');

        db.exec("DELETE FROM server_album");
        db.exec("DELETE FROM server_annotation");
        db.exec("DELETE FROM server_artist");
        db.exec("DELETE FROM server_media_file");
        db.exec("DELETE FROM server_playlist");
        db.exec("DELETE FROM server_playlist_tracks");

        store_server_users.percentage_of_nd = 0;

        let browsing_ApiService_of_ND = new Browsing_ApiService_of_ND(url);
        const getArtists_ALL = await browsing_ApiService_of_ND.getArtists_ALL(username, token, salt);
        const list = getArtists_ALL["subsonic-response"]["artists"]["index"];

        let moment = require('moment');

        let media_Retrieval_ApiService_of_ND = new Media_Retrieval_ApiService_of_ND(url);

        const artistsArray: any[]= [];
        const albumsArray: any[]= [];
        const songsArray: any[]= [];

        const artistsAnnotionArray: any[]= [];
        const albumsAnnotionArray: any[]= [];
        const songsAnnotionArray: any[]= [];

        const artistPromises = list.flatMap((artist_list: any) =>
            artist_list.artist.map(async (artist: any) => {
                const cacheKey = `musicDirectory_${artist.id}`;
                let getAlbum_id = cache.get(cacheKey);
                if (!getAlbum_id) {
                    getAlbum_id = await browsing_ApiService_of_ND.getAlbum(username, token, salt, artist.id);
                    cache.set(cacheKey, getAlbum_id, 60 * 60); // 缓存1小时
                }

                const song_list_of_this_album = getAlbum_id["subsonic-response"]["directory"]["child"];
                const artist_song_count = getAlbum_id["subsonic-response"]["directory"]["songCount"]
                const albumPromises = song_list_of_this_album.map(async (album: any) => {
                    const sqlite_album = {
                        id: album.id,
                        name: album.name,
                        artist_id: album.artistId,
                        embed_art_path: '',
                        artist: album.artist,
                        album_artist: '',
                        min_year: album.year,
                        max_year: album.year,
                        compilation: 0,
                        song_count: album.songCount,
                        duration: album.duration,
                        genre: '',
                        created_at: album.created,
                        updated_at: '',
                        full_text: '',
                        album_artist_id: '',
                        order_album_name: '',
                        order_album_artist_name: '',
                        sort_album_name: '',
                        sort_artist_name: '',
                        sort_album_artist_name: '',
                        size: 0,
                        mbz_album_id: '',
                        mbz_album_artist_id: '',
                        mbz_album_type: '',
                        mbz_album_comment: '',
                        catalog_num: '',
                        comment: '',
                        all_artist_ids: '',
                        image_files: '',
                        paths: '',
                        description: '',
                        small_image_url: '',
                        medium_image_url: url + '/getCoverArt?u=' + username + '&t=' + token + '&s=' + salt + '&v=1.12.0&c=nsmusics&f=json&id=' + album.id,
                        large_image_url: '',
                        external_url: '',
                        external_info_updated_at: ''
                    };
                    albumsArray.push(sqlite_album);
                    if(album.playCount !== undefined && album.playCount != null) {
                        if(album.playCount > 0) {
                            albumsAnnotionArray.push({
                                id: album.id,
                                played: album.played,
                                playCount: album.playCount,
                            });
                        }
                    }

                    try {
                        if (db.prepare(`SELECT COUNT(*) FROM ${store_server_user_model.annotation} WHERE item_id = ?`).pluck().get(album.id) === 0) {
                            db.prepare(`INSERT INTO ${store_server_user_model.annotation} 
                                (ann_id, item_id, item_type, play_count, play_date) VALUES (?, ?, ?, ?, ?)`)
                                .run(
                                    this.getUniqueId(db, 'server_annotation', 'item_id'),
                                    album.id, 'album',
                                    album.playCount,
                                    moment(album.played).format('YYYY-MM-DD HH:mm:ss') || '');
                        }
                    } catch (error) {
                        console.error("Error fetching starred data:", error);
                    }

                    const cacheKey = `album_${album.id}`;
                    let getAlbum_id = cache.get(cacheKey);
                    if (!getAlbum_id) {
                        getAlbum_id = await browsing_ApiService_of_ND.getAlbum(username, token, salt, album.id);
                        cache.set(cacheKey, getAlbum_id, 60 * 60); // 缓存1小时
                    }

                    const songs = getAlbum_id["subsonic-response"]["album"]["song"];
                    const num = 80 / songs.length / 1000
                    for (const song of songs) {
                        const getLyrics_all = await media_Retrieval_ApiService_of_ND.getLyrics_all(username, token, salt, song.id);
                        let lyrics = undefined;
                        try {
                            lyrics = this.convertToLRC(getLyrics_all["subsonic-response"]["lyricsList"]["structuredLyrics"][0]["line"]);
                        }catch{ }

                        const sqlite_song= {
                            id: song.id,
                            title: song.title,
                            path: url + '/stream?u=' + username + '&t=' + token + '&s=' + salt + '&v=1.12.0&c=nsmusics&f=json&id=' + song.id,
                            artist: song.artist,
                            album: song.album,
                            artist_id: song.artistId,
                            album_id: song.albumId,
                            album_artist: '',
                            has_cover_art: 0,
                            track_number: song.track,
                            disc_number: 0,
                            year: song.year,
                            size: song.size,
                            suffix: song.suffix,
                            duration: song.duration,
                            bit_rate: song.bitRate,
                            genre: '',
                            compilation: 0,
                            created_at: song.created,
                            updated_at: '',
                            full_text: '',
                            album_artist_id: '',
                            order_album_name: '',
                            order_album_artist_name: '',
                            order_artist_name: '',
                            sort_album_name: '',
                            sort_artist_name: '',
                            sort_album_artist_name: '',
                            sort_title: '',
                            disc_subtitle: '',
                            mbz_track_id: '',
                            mbz_album_id: '',
                            mbz_artist_id: '',
                            mbz_album_artist_id: '',
                            mbz_album_type: '',
                            mbz_album_comment: '',
                            catalog_num: '',
                            comment: '',
                            lyrics: lyrics,
                            bpm: 0,
                            channels: 0,
                            order_title: '',
                            mbz_release_track_id: '',
                            rg_album_gain: 0,
                            rg_album_peak: 0,
                            rg_track_gain: 0,
                            rg_track_peak: 0,
                            medium_image_url: url + '/getCoverArt?u=' + username + '&t=' + token + '&s=' + salt + '&v=1.12.0&c=nsmusics&f=json&id=' + song.id
                        };
                        songsArray.push(sqlite_song);
                        if(song.playCount !== undefined && song.playCount != null) {
                            if(song.playCount > 0) {
                                songsAnnotionArray.push({
                                    id: song.id,
                                    played: song.played,
                                    playCount: song.playCount,
                                });
                            }
                        }

                        store_server_users.percentage_of_nd += num
                    }
                    return songs;
                });
                const sqlite_artist = {
                    id: artist.id,
                    name: artist.name,
                    album_count: artist.albumCount,
                    full_text: '',
                    order_artist_name: '',
                    sort_artist_name: '',
                    song_count: artist_song_count,
                    size: 0,
                    mbz_artist_id: '',
                    biography: '',
                    small_image_url: '',
                    medium_image_url: url + '/getCoverArt?u=' + username + '&t=' + token + '&s=' + salt + '&v=1.12.0&c=nsmusics&f=json&id=' + artist.id,
                    large_image_url: '',
                    similar_artists: '',
                    external_url: '',
                    external_info_updated_at: '',
                };
                artistsArray.push(sqlite_artist);

                const albumSongs = await Promise.all(albumPromises);
                return albumSongs.flat();
            })
        );

        await Promise.all(artistPromises);

        const artistMap = new Map();
        artistsArray.forEach(artist => {
            artistMap.set(artist.id, {
                ...artist,
                albums: []
            });
        });
        const albumMap = new Map();
        albumsArray.forEach(album => {
            albumMap.set(album.id, {
                ...album,
                media: []
            });
        });
        songsArray.forEach(song => {
            const album = albumMap.get(song.album_id);
            if (album) {
                album.media.push(song);
            }
        });
        albumsArray.forEach(album => {
            const artist = artistMap.get(album.artist_id);
            if (artist) {
                artist.albums.push(albumMap.get(album.id));
            }
        });
        const resultArray = Array.from(artistMap.values()).map(artist => {
            return {
                artist: {
                    ...artist,
                    albums: artist.albums.map((album: any) => ({
                        ...album,
                        media: album.media
                    }))
                }
            };
        });

        resultArray.forEach(music => {
            this.insertData(db, 'server_artist', music.artist);
        });
        resultArray.forEach(music => {
            music.artist.albums.forEach((album: any) => {
                this.insertData(db, 'server_album', album);
                album.media.forEach((media: any) => {
                    this.insertData(db, 'server_media_file', media);
                })
            });
        });

        /// starred2 / userRating
        try {
            let album$Songs_Lists_ApiService_of_ND = new Album$Songs_Lists_ApiService_of_ND(url);
            const getStarred2_all = await album$Songs_Lists_ApiService_of_ND.getStarred2_all(username, token, salt);
            const starred2_artist = getStarred2_all["subsonic-response"]["starred2"]["artist"];
            const starred2_album = getStarred2_all["subsonic-response"]["starred2"]["album"];
            const starred2_song = getStarred2_all["subsonic-response"]["starred2"]["song"];

            // Create maps for quick lookup
            const artistMap = new Map(starred2_artist.map((artist: any) => [artist.id, artist]));
            const albumMap = new Map(starred2_album.map((album: any) => [album.id, album]));
            const songMap = new Map(starred2_song.map((song: any) => [song.id, song]));

            // Update resultArray with starred and userRating
            resultArray.forEach(music => {
                const artist: any = artistMap.get(music.artist.id);
                if (artist) {
                    // music.artist.starred = artist.starred || null;
                    // music.artist.userRating = artist.userRating || 0;
                    music.artist.album_count = artist.albumCount || 0;
                    store_local_data_set_artistInfo.Set_ArtistInfo_To_Favorite(artist.id, !artist.starred);
                    store_local_data_set_artistInfo.Set_ArtistInfo_To_Rating(artist.id, artist.userRating || 0);
                }

                music.artist.albums.forEach((album: any) => {
                    const albumData: any = albumMap.get(album.id);
                    if (albumData) {
                        // album.starred = albumData.starred || null;
                        // album.userRating = albumData.userRating || 0;
                        // album.song_count = albumData.songCount || 0
                        store_local_data_set_albumInfo.Set_AlbumInfo_To_Favorite(albumData.id, !albumData.starred);
                        store_local_data_set_albumInfo.Set_AlbumInfo_To_Rating(albumData.id, albumData.userRating || 0);

                        // annotion - album
                        try {
                            let existingRecord = db.prepare(`SELECT item_id FROM ${store_server_user_model.annotation} WHERE item_id = ?`).get(albumData.id);
                            if (existingRecord) {
                                db.prepare(`UPDATE ${store_server_user_model.annotation} 
                                    SET rating = ?, starred = ?, starred_at = ? WHERE item_id = ? AND item_type = 'album'`)
                                    .run(
                                        albumData.userRating || 0,
                                        !albumData.starred ? 0 : 1,
                                        albumData.starred || '',
                                        albumData.id
                                    );
                            }
                        } catch (error) {
                            console.error("Error fetching starred data:", error);
                        }
                    }

                    album.media.forEach((song: any) => {
                        const songData: any = songMap.get(song.id);
                        if (songData) {
                            // song.starred = songData.starred || null;
                            // song.userRating = songData.userRating || 0;
                            store_local_data_set_mediaInfo.Set_MediaInfo_To_Favorite(songData.id, !songData.starred);
                            store_local_data_set_mediaInfo.Set_MediaInfo_To_Rating(songData.id, songData.userRating || 0);
                        }
                    });
                });
            });
        } catch (error) {
            console.error("Error fetching starred data:", error);
        }

        /// play_count / play_history_time
        try {
            let set_MediaInfo_To_LocalSqlite = new Set_MediaInfo_To_LocalSqlite();
            let set_AlbumInfo_To_LocalSqlite = new Set_AlbumInfo_To_LocalSqlite();
            // let set_ArtistInfo_To_LocalSqlite = new Set_ArtistInfo_To_LocalSqlite();

            songsAnnotionArray.forEach(annotion => {
                set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_PlayCount_of_Media_File_ND(
                    annotion.id,
                    annotion.playCount,
                    moment(annotion.played).format('YYYY-MM-DD HH:mm:ss') || ''
                )
            });
            albumsAnnotionArray.forEach(annotion => {
                set_AlbumInfo_To_LocalSqlite.Set_AlbumInfo_To_PlayCount_of_Album_ND(
                    annotion.id,
                    annotion.playCount,
                    moment(annotion.played).format('YYYY-MM-DD HH:mm:ss') || ''
                )
            });
        } catch (error) {
            // 处理错误
            console.error(error);
        }

        db.close();

        await this.Set_Read_Subsonic_Api_PlayListInfo_Add_LocalSqlite(url, username, token, salt)
    }
    public async Set_Read_Subsonic_Api_PlayListInfo_Add_LocalSqlite(
        url: string,
        username: string,token: string,salt: string
    ): Promise<any>{
        let playlists_ApiService_of_ND = new Playlists_ApiService_of_ND(url);
        const getPlaylists_all = await playlists_ApiService_of_ND.getPlaylists_all(username, token, salt);
        const playlists = getPlaylists_all["subsonic-response"]["playlists"]["playlist"];
        let playlSongs = []

        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');


        db.exec("DELETE FROM server_playlist");
        db.exec("DELETE FROM server_playlist_tracks");
        store_playlist_list_info.playlist_tracks_temporary_of_ALLLists = [];
        if(playlists != null) {
            for (const playlist of playlists) {
                const sqlite_playlists = {
                    id: playlist.id,
                    name: playlist.name,
                    comment: '',
                    duration: playlist.duration,
                    song_count: playlist.songCount,
                    public: playlist.public,
                    created_at: playlist.created,
                    updated_at: '',
                    path: '',
                    sync: '',
                    size: '',
                    rules: '',
                    evaluated_at: '',
                    owner_id: playlist.owner
                };
                const getPlaylist_id = await playlists_ApiService_of_ND.getPlaylist_id(username, token, salt, playlist.id);
                const _playlist = getPlaylist_id["subsonic-response"]["playlist"];
                sqlite_playlists.updated_at = _playlist.changed;
                this.insertData(db, 'server_playlist', sqlite_playlists);

                let playlist_tracks = []
                playlSongs = Array.isArray(getPlaylist_id["subsonic-response"]["playlist"]["entry"])
                    ? getPlaylist_id["subsonic-response"]["playlist"]["entry"]
                    : [];
                for (const song of playlSongs) {
                    const sqlite_song = {
                        id: this.getUniqueId(db, 'server_playlist_tracks', 'id'),
                        playlist_id: _playlist.id,
                        media_file_id: song.id
                    };
                    playlist_tracks.push(sqlite_song)
                    this.insertData(db, 'server_playlist_tracks', sqlite_song);
                }
                store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.push({
                    playlist: {
                        label: playlist.name,
                        value: playlist.id,
                        id: playlist.id,
                        name: playlist.name,
                        comment: playlist.comment || '',
                        duration: playlist.duration || 0,
                        song_count: playlist.song_count || 0,
                        public: 0,
                        created_at: playlist.created_at,
                        updated_at: playlist.updated_at,
                        path: '',
                        sync: 0,
                        size: 0,
                        rules: null,
                        evaluated_at: '',
                        owner_id: store_server_user_model.username,
                    },
                    playlist_tracks: playlist_tracks
                });
            }
        }
        db.close();
        store_playlist_list_logic.playlist_names_StartUpdate = true;
        store_playlist_list_info.playlist_names_ALLLists = [];
        store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.forEach((item: any) => {
            if (item.playlist && item.playlist.name && item.playlist.id) {
                store_playlist_list_info.playlist_names_ALLLists.push({
                    label: item.playlist.name,
                    value: item.playlist.id
                });
            }
        });

        try {
            let album$Songs_Lists_ApiService_of_ND = new Album$Songs_Lists_ApiService_of_ND(url);
            const getStarred2_all = await album$Songs_Lists_ApiService_of_ND.getStarred2_all(username, token, salt);
            const starred2_artist = getStarred2_all["subsonic-response"]["starred2"]["artist"];
            const starred2_album = getStarred2_all["subsonic-response"]["starred2"]["album"];
            const starred2_song = getStarred2_all["subsonic-response"]["starred2"]["song"];
            starred2_artist.forEach((artist: any) => {
                store_local_data_set_artistInfo.Set_ArtistInfo_To_Favorite(artist.id, !artist.starred);
                store_local_data_set_artistInfo.Set_ArtistInfo_To_Rating(artist.id, artist.userRating || 0);
            });
            starred2_album.forEach((albumData: any) => {
                store_local_data_set_albumInfo.Set_AlbumInfo_To_Favorite(albumData.id, !albumData.starred);
                store_local_data_set_albumInfo.Set_AlbumInfo_To_Rating(albumData.id, albumData.userRating || 0);
            });
            starred2_song.forEach((songData: any) => {
                store_local_data_set_mediaInfo.Set_MediaInfo_To_Favorite(songData.id, !songData.starred);
                store_local_data_set_mediaInfo.Set_MediaInfo_To_Rating(songData.id, songData.userRating || 0);
            });
        }catch { }

        store_server_users.percentage_of_nd = 100;
    }
}