import {ipcRenderer} from "electron";
import {store_model_check_of_sqlite_tablename} from "@/store/model_check_of_sqlite_tablename";
export class Set_ReadLocalMusic_To_LocalSqlite {
    private getUniqueId_Media(db: any) {
        const { v4: uuidv4 } = require('uuid');
        let id = uuidv4();
        while (db.prepare(`SELECT COUNT(*) FROM ${store_model_check_of_sqlite_tablename.media_file} WHERE id = ?`).pluck().get(id) > 0) {
            id = uuidv4().replace(/-/g, '');
        }
        return id;
    }
    private getUniqueId_Album(db: any) {
        const { v4: uuidv4 } = require('uuid');
        let id = uuidv4();
        while (db.prepare(`SELECT COUNT(*) FROM ${store_model_check_of_sqlite_tablename.album} WHERE id = ?`).pluck().get(id) > 0) {
            id = uuidv4().replace(/-/g, '');
        }
        return id;
    }
    private getUniqueId_Artist(db: any) {
        const { v4: uuidv4 } = require('uuid');
        let id = uuidv4();
        while (db.prepare(`SELECT COUNT(*) FROM ${store_model_check_of_sqlite_tablename.artist} WHERE id = ?`).pluck().get(id) > 0) {
            id = uuidv4().replace(/-/g, '');
        }
        return id;
    }
    private getCurrentDateTime() {
        return new Date().toLocaleString(
            'zh-CN', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            }
        ).replace(/\//g, '-');
    }

    public async Set_ReadLocalMusicInfo_Add_LocalSqlite(directoryPath: string[]) {
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
        db.pragma('journal_mode = WAL');

        try {
            let directorys: any[] = []
            for (const path1 of directoryPath) {
                const files = await ipcRenderer.invoke('metadata-get-directory-filePath', path1)
                directorys.push(files)
            }
            let resultArray: {
                artist: {
                    id: string;
                    name: string;
                    album_count: number;
                    full_text?: string;
                    order_artist_name?: string;
                    sort_artist_name?: string;
                    song_count: number;
                    size: number;
                    mbz_artist_id?: string;
                    biography: string;
                    small_image_url: string;
                    medium_image_url: string;
                    large_image_url: string;
                    similar_artists: string;
                    external_url: string;
                    external_info_updated_at?: string;
                },
                albums: {
                    id: string;
                    name: string;
                    artist_id: string;
                    embed_art_path: string;
                    artist: string;
                    album_artist: string;
                    min_year: number;
                    max_year: number;
                    compilation: boolean;
                    song_count: number;
                    duration: number;
                    genre: string;
                    created_at?: Date;
                    updated_at?: Date;
                    full_text?: string;
                    album_artist_id?: string;
                    order_album_name?: string;
                    order_album_artist_name?: string;
                    sort_album_name?: string;
                    sort_artist_name?: string;
                    sort_album_artist_name?: string;
                    size: number;
                    mbz_album_id?: string;
                    mbz_album_artist_id?: string;
                    mbz_album_type?: string;
                    mbz_album_comment?: string;
                    catalog_num?: string;
                    comment?: string;
                    all_artist_ids?: string;
                    image_files: string;
                    paths?: string;
                    description: string;
                    small_image_url: string;
                    medium_image_url: string;
                    large_image_url: string;
                    external_url: string;
                    external_info_updated_at?: Date;
                    media: {
                        id: string;
                        path: string;
                        title: string;
                        album: string;
                        artist: string;
                        artist_id: string;
                        album_artist: string;
                        album_id: string;
                        has_cover_art: number;
                        track_number: number;
                        disc_number: number;
                        year: number;
                        size: number;
                        suffix: string;
                        duration: number;
                        bit_rate: number;
                        genre: string;
                        compilation: number;
                        created_at?: string;
                        updated_at?: string;
                        full_text: string;
                        album_artist_id?: string;
                        order_album_name: string;
                        order_album_artist_name: string;
                        order_artist_name: string;
                        sort_album_name: string;
                        sort_artist_name: string;
                        sort_album_artist_name: string;
                        sort_title: string;
                        disc_subtitle: string;
                        mbz_track_id: string;
                        mbz_album_id: string;
                        mbz_artist_id: string;
                        mbz_album_artist_id: string;
                        mbz_album_type: string;
                        mbz_album_comment: string;
                        catalog_num: string;
                        comment: string;
                        lyrics: string;
                        bpm: number;
                        channels: number;
                        order_title: string;
                        mbz_release_track_id: string;
                        rg_album_gain: number;
                        rg_album_peak: number;
                        rg_track_gain: number;
                        rg_track_peak: number;
                    }[]
                }[]
            }[] = [];
            let media_s: any[] = []
            let album_s: any[] = []
            let artist_s: any[] = []
            let common_s: { common: any, _path: any }[] = []
            for (const paths of directorys) {
                for (const _path of paths) {
                    const common = await ipcRenderer.invoke('metadata-get-all');
                    common_s.push(common, _path)

                    if (artist_s.findIndex(item => item.name === common.artist) < 0) {
                        let artist = {
                            id: this.getUniqueId_Artist(db),
                            name: common.artist,
                            album_count: 0,
                            full_text: '',
                            order_artist_name: '',
                            sort_artist_name: common.artistsort,
                            song_count: 0,
                            size: 0,
                            mbz_artist_id: '',
                            biography: '',
                            small_image_url: '',
                            medium_image_url: '',
                            large_image_url: '',
                            similar_artists: '',
                            external_url: '',
                            external_info_updated_at: '',
                        }
                        artist_s.push(artist)
                    }
                    if (album_s.findIndex(item => item.name === common.album) < 0) {
                        let album = {
                            id: this.getUniqueId_Album(db),
                            name: common.album,
                            artist_id: '',
                            embed_art_path: '',
                            artist: common.artist,
                            album_artist: common.albumartist,
                            min_year: common.year,
                            max_year: common.year,
                            compilation: 0,
                            song_count: 0,
                            duration: 0,
                            genre: '',
                            created_at: this.getCurrentDateTime(),
                            updated_at: this.getCurrentDateTime(),
                            full_text: '',
                            album_artist_id: '',
                            order_album_name: '',
                            order_album_artist_name: '',
                            sort_album_name: common.albumsort,
                            sort_artist_name: common.artistsort,
                            sort_album_artist_name: common.albumartistsort,
                            size: 0,
                            mbz_album_id: '',
                            mbz_album_artist_id: '',
                            mbz_album_type: '',
                            mbz_album_comment: '',
                            catalog_num: common.catalognumber,
                            comment: common.comment,
                            all_artist_ids: '',
                            image_files: '',
                            paths: '',
                            description: common.description,
                            small_image_url: '',
                            medium_image_url: '',
                            large_image_url: '',
                            external_url: '',
                            external_info_updated_at: ''
                        }
                        album_s.push(album)
                    }
                    let media = {
                        id: this.getUniqueId_Media(db),
                        path: _path,
                        title: common.title,
                        album: common.album,
                        artist: common.artist,
                        artist_id: '',
                        album_artist: common.artist,
                        album_id: '',
                        has_cover_art: 0,
                        track_number: 0,
                        disc_number: 0,
                        year: common.year,
                        size: 0,
                        suffix: '',
                        duration: 0,
                        bit_rate: 0,
                        genre: '',
                        compilation: 0,
                        created_at: this.getCurrentDateTime(),
                        updated_at: this.getCurrentDateTime(),
                        full_text: common.title,
                        album_artist_id: '',
                        order_album_name: '',
                        order_album_artist_name: '',
                        order_artist_name: '',
                        sort_album_name: common.albumsort,
                        sort_artist_name: common.artistsort,
                        sort_album_artist_name: common.albumartistsort,
                        sort_title: common.titlesort,
                        disc_subtitle: common.discsubtitle,
                        mbz_track_id: '',
                        mbz_album_id: '',
                        mbz_artist_id: '',
                        mbz_album_artist_id: '',
                        mbz_album_type: '',
                        mbz_album_comment: '',
                        catalog_num: common.catalognumber,
                        comment: common.comment,
                        lyrics: common.lyrics,
                        bpm: 0,
                        channels: 0,
                        order_title: '',
                        mbz_release_track_id: '',
                        rg_album_gain: 0,
                        rg_album_peak: 0,
                        rg_track_gain: 0,
                        rg_track_peak: 0,
                    };
                    media_s.push(media)
                }
            }
            artist_s.forEach((artist) => {
                common_s.forEach((value) => {
                    if (value.common.artist === artist) {
                        album_s.forEach((album) => {
                            if (value.common.album === album) {

                            }
                        })
                    }
                })
            })
        }catch (e) {
            console.error(e)
        }
    }

    // public async Set_ReadLocalMusicInfo_Add_LocalSqlite_(directoryPath: string[]) {
    //     const path = require('path');
    //     const db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
    //     db.pragma('journal_mode = WAL');
    //
    //     let directorys: any[] = []
    //     directoryPath.forEach((path) => {
    //         directorys.push(
    //             this.walkDirectory(path)
    //         )
    //     })
    //     let resultArray = [];
    //     let allCommons: any[] = [];
    //     for (const _path of directorys) {
    //         const { common } = await ipcRenderer.invoke('metadata-get-all');
    //         allCommons.push(common, _path)
    //     }
    //     const artistMap = new Map();
    //     const albumMap = new Map();
    //     for (const { common, _path } of allCommons) {
    //         // 使用 Map 来避免重复并保持顺序
    //         const artistId = common.artist;
    //         const albumId = `${common.artist}-${common.album}`;
    //
    //         if (!artistMap.has(artistId)) {
    //             const artist = {
    //                 id: this.getUniqueId_Artist(db),
    //                 name: common.artist,
    //                 album_count: 0,
    //                 full_text: '',
    //                 order_artist_name: '',
    //                 sort_artist_name: common.artistsort,
    //                 song_count: 0,
    //                 size: 0,
    //                 mbz_artist_id: '',
    //                 biography: '',
    //                 small_image_url: '',
    //                 medium_image_url: '',
    //                 large_image_url: '',
    //                 similar_artists: '',
    //                 external_url: '',
    //                 external_info_updated_at: '',
    //             };
    //             artistMap.set(artistId, artist);
    //         }
    //
    //         if (!albumMap.has(albumId)) {
    //             const artistObj = artistMap.get(artistId);
    //             const album = {
    //                 id: this.getUniqueId_Album(db),
    //                 name: common.album,
    //                 artist_id: artistObj.id,
    //                 embed_art_path: '',
    //                 artist: common.artist,
    //                 album_artist: common.albumartist,
    //                 min_year: common.year,
    //                 max_year: common.year,
    //                 compilation: 0,
    //                 song_count: 0,
    //                 duration: 0,
    //                 genre: '',
    //                 created_at: this.getCurrentDateTime(),
    //                 updated_at: this.getCurrentDateTime(),
    //                 full_text: '',
    //                 album_artist_id: '',
    //                 order_album_name: '',
    //                 order_album_artist_name: '',
    //                 sort_album_name: common.albumsort,
    //                 sort_artist_name: common.artistsort,
    //                 sort_album_artist_name: common.albumartistsort,
    //                 size: 0,
    //                 mbz_album_id: '',
    //                 mbz_album_artist_id: '',
    //                 mbz_album_type: '',
    //                 mbz_album_comment: '',
    //                 catalog_num: common.catalognumber,
    //                 comment: common.comment,
    //                 all_artist_ids: '',
    //                 image_files: '',
    //                 paths: '',
    //                 description: common.description,
    //                 small_image_url: '',
    //                 medium_image_url: '',
    //                 large_image_url: '',
    //                 external_url: '',
    //                 external_info_updated_at: ''
    //             };
    //             albumMap.set(albumId, album);
    //             artistObj.album_count++;
    //         }
    //
    //         const albumObj = albumMap.get(albumId);
    //         const media = {
    //             id: this.getUniqueId_Media(db),
    //             path: _path,
    //             title: common.title,
    //             artist: common.artist,
    //             album: common.album,
    //             artist_id: albumObj.artist_id,
    //             album_id: albumObj.id,
    //             album_artist: common.artist,
    //             has_cover_art: 0,
    //             track_number: 0,
    //             disc_number: 0,
    //             year: common.year,
    //             size: 0,
    //             suffix: '',
    //             duration: 0,
    //             bit_rate: 0,
    //             genre: '',
    //             compilation: 0,
    //             created_at: this.getCurrentDateTime(),
    //             updated_at: this.getCurrentDateTime(),
    //             full_text: common.title,
    //             album_artist_id: '',
    //             order_album_name: '',
    //             order_album_artist_name: '',
    //             order_artist_name: '',
    //             sort_album_name: common.albumsort,
    //             sort_artist_name: common.artistsort,
    //             sort_album_artist_name: common.albumartistsort,
    //             sort_title: common.titlesort,
    //             disc_subtitle: common.discsubtitle,
    //             mbz_track_id: '',
    //             mbz_album_id: '',
    //             mbz_artist_id: '',
    //             mbz_album_artist_id: '',
    //             mbz_album_type: '',
    //             mbz_album_comment: '',
    //             catalog_num: common.catalognumber,
    //             comment: common.comment,
    //             lyrics: common.lyrics,
    //             bpm: 0,
    //             channels: 0,
    //             order_title: '',
    //             mbz_release_track_id: '',
    //             rg_album_gain: 0,
    //             rg_album_peak: 0,
    //             rg_track_gain: 0,
    //             rg_track_peak: 0,
    //         };
    //
    //         albumObj.media = albumObj.media || [];
    //         albumObj.media.push(media);
    //         albumObj.song_count++;
    //         albumObj.duration += common.duration; // 假设 common.duration 存在
    //     }
    //     resultArray = Array.from(artistMap.values()).map(artist => {
    //         return {
    //             artist: {
    //                 ...artist,
    //                 albums: Array.from(albumMap.values())
    //                     .filter(album => album.artist_id === artist.id)
    //                     .map(album => ({
    //                         ...album,
    //                         media: album.media
    //                     }))
    //             }
    //         };
    //     });
    // }
}