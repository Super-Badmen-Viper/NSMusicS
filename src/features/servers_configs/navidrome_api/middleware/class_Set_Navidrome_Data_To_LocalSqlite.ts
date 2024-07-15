import {Playlists_ApiService_of_ND} from "@/features/servers_configs/navidrome_api/services/playlists/index_service";
import {Browsing_ApiService_of_ND} from "@/features/servers_configs/navidrome_api/services/browsing/index_service";
import {v4 as uuidv4} from "uuid";
const path = require('path');
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'

export class Set_Navidrome_Data_To_LocalSqlite{
    private getUniqueId(db: any,table: any) {
        const { v4: uuidv4 } = require('uuid');
        let id = uuidv4();
        while (db.prepare(`SELECT COUNT(*) FROM ${table} WHERE id = ?`).pluck().get(id) > 0) {
            id = uuidv4();
        }
        return id;
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
            const result = stmt.run(values);
            console.log(`Inserted ${result.changes} row(s)`);
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }
    private getCommentString(common:any) {
        if (!common) {
            throw new Error("common object is undefined");
        }
        if (!common.comment) {
            common.comment = [];
        } else if (!Array.isArray(common.comment)) {
            common.comment = [common.comment];
        }
        return common.comment.join("");
    }
    private getLyricsString(common:any) {
        if (!common) {
            throw new Error("common object is undefined");
        }
        if (!common.lyrics) {
            common.lyrics = [];
        } else if (!Array.isArray(common.lyrics)) {
            common.lyrics = [common.lyrics];
        }
        return common.lyrics.join("");
    }
    public async Set_Read_Navidrome_Api_BasicInfo_Add_LocalSqlite(
        url: string,
        username: string,token: string,salt: string
    ): Promise<any> {
        const NodeCache = require('node-cache');
        const cache = new NodeCache();

        let browsing_ApiService_of_ND = new Browsing_ApiService_of_ND(url);
        const getArtists_ALL = await browsing_ApiService_of_ND.getArtists_ALL(username, token, salt);
        const list = getArtists_ALL["subsonic-response"]["artists"]["index"];

        const artistsArray: any[]= [];
        const albumsArray: any[]= [];
        const songsArray: any[]= [];

        const artistPromises = list.flatMap((artist_list: any) =>
            artist_list.artist.map(async (artist: any) => {
                const cacheKey = `musicDirectory_${artist.id}`;
                let getMusicDirectory_id = cache.get(cacheKey);
                if (!getMusicDirectory_id) {
                    getMusicDirectory_id = await browsing_ApiService_of_ND.getMusicDirectory_id(username, token, salt, artist.id);
                    cache.set(cacheKey, getMusicDirectory_id, 60 * 60); // 缓存1小时
                }

                const song_list_of_this_album = getMusicDirectory_id["subsonic-response"]["directory"]["child"];
                const artist_song_count = getMusicDirectory_id["subsonic-response"]["directory"]["songCount"]
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

                    const cacheKey = `album_${album.id}`;
                    let getAlbum_id = cache.get(cacheKey);
                    if (!getAlbum_id) {
                        getAlbum_id = await browsing_ApiService_of_ND.getAlbum(username, token, salt, album.id);
                        cache.set(cacheKey, getAlbum_id, 60 * 60); // 缓存1小时
                    }

                    const songs = getAlbum_id["subsonic-response"]["album"]["song"];
                    songs.forEach((song: any) => {
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
                            lyrics: '',
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
                    });
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

        const db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
        db.pragma('journal_mode = WAL');
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
        db.close();

        this.Set_Read_Navidrome_Api_PlayListInfo_Add_LocalSqlite(url, username,token,salt)
    }
    private async Set_Read_Navidrome_Api_PlayListInfo_Add_LocalSqlite(
        url: string,
        username: string,token: string,salt: string
    ): Promise<any>{
        let playlists_ApiService_of_ND = new Playlists_ApiService_of_ND(url);
        const getPlaylists_all = await playlists_ApiService_of_ND.getPlaylists_all(username, token, salt);
        const playlists = getPlaylists_all["subsonic-response"]["playlists"]["playlist"];

        const db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
        db.pragma('journal_mode = WAL');

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

            const playlSongs = Array.isArray(getPlaylist_id["subsonic-response"]["playlist"]["entry"])
                ? getPlaylist_id["subsonic-response"]["playlist"]["entry"]
                : [];

            for (const song of playlSongs) {
                const sqlite_song = {
                    id: this.getUniqueId(db,'server_playlist_tracks'),
                    playlist_id: _playlist.id,
                    media_file_id: song.id
                };
                this.insertData(db, 'server_playlist_tracks', sqlite_song);
            }
        }
        db.close();

        const { t } = useI18n({
            inheritLocale: true
        })
        const message = useMessage()

    }
    public async Set_Read_Navidrome_Api_AnnotationInfo_Add_LocalSqlite(
        url: string,
        username: string,token: string,salt: string
    ): Promise<any>{

    }
}