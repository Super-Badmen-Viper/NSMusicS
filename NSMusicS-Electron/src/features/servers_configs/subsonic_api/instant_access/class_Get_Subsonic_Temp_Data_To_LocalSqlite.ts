import axios from "axios";
import {store_server_users} from "@/store/server/store_server_users";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {store_view_home_page_info} from "@/store/view/home/store_view_home_page_info";
import {
    Home_Lists_ApiWebService_of_ND
} from "@/features/servers_configs/subsonic_api/services_web/page_lists/home_lists/index_service";
import {store_view_artist_page_info} from "@/store/view/artist/store_view_artist_page_info";
import {store_view_album_page_info} from "@/store/view/album/store_view_album_page_info";
import {
    Media_library_scanning_ApiService_of_ND
} from "@/features/servers_configs/subsonic_api/services_normal/media_library_scanning/index_service";
import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
import {
    Artist_Lists_ApiWebService_of_ND
} from "@/features/servers_configs/subsonic_api/services_web/page_lists/artist_lists/index_service";
import {
    Album_Lists_ApiWebService_of_ND
} from "@/features/servers_configs/subsonic_api/services_web/page_lists/album_lists/index_service";
import {
    Song_Lists_ApiWebService_of_ND
} from "@/features/servers_configs/subsonic_api/services_web/page_lists/song_lists/index_service";
import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";
import {
    Playlists_ApiService_of_ND
} from "@/features/servers_configs/subsonic_api/services_normal/playlists/index_service";
import {
    Album$Songs_Lists_ApiService_of_ND
} from "@/features/servers_configs/subsonic_api/services_normal/album$songs_lists/index_service";
import {
    Browsing_ApiService_of_ND
} from "@/features/servers_configs/subsonic_api/services_normal/browsing/index_service";
import {store_playlist_list_info} from "@/store/view/playlist/store_playlist_list_info";
import {store_player_audio_info} from "@/store/player/store_player_audio_info";
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {store_playlist_list_fetchData} from "@/store/view/playlist/store_playlist_list_fetchData";

export class Get_Subsonic_Temp_Data_To_LocalSqlite{
    private home_Lists_ApiWebService_of_ND = new Home_Lists_ApiWebService_of_ND(
        store_server_users.server_config_of_current_user_of_sqlite?.url + '/api',
    )
    private song_Lists_ApiWebService_of_ND = new Song_Lists_ApiWebService_of_ND(
        store_server_users.server_config_of_current_user_of_sqlite?.url + '/api',
    )
    private album_Lists_ApiWebService_of_ND = new Album_Lists_ApiWebService_of_ND(
        store_server_users.server_config_of_current_user_of_sqlite?.url + '/api',
    )
    private artist_Lists_ApiWebService_of_ND = new Artist_Lists_ApiWebService_of_ND(
        store_server_users.server_config_of_current_user_of_sqlite?.url + '/api',
    )

    /*
    _order: title,album,artist,playCount,playDate,year,duration,createdAt,rating,starred
     */
    public async get_home_list(
        url: string,
        username: string,token: string,salt: string
    ){
        const maximum_playback = await this.home_Lists_ApiWebService_of_ND.getAlbumList_Play_Count()
        maximum_playback.map(async (album: any) => {
            store_view_home_page_info.home_Files_temporary_maximum_playback.push(
                {
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
                }
            )
        });
        const random_search = await this.home_Lists_ApiWebService_of_ND.getAlbumList_Random()
        random_search.map(async (album: any) => {
            store_view_home_page_info.home_Files_temporary_random_search.push(
                {
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
                }
            )
        });
        const recently_added = await this.home_Lists_ApiWebService_of_ND.getAlbumList_Recently_Added()
        recently_added.map(async (album: any) => {
            store_view_home_page_info.home_Files_temporary_recently_added.push(
                {
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
                }
            )
        });
        const recently_played = await this.home_Lists_ApiWebService_of_ND.getAlbumList_Play_Date()
        recently_played.map(async (album: any) => {
            store_view_home_page_info.home_Files_temporary_recently_played.push(
                {
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
                }
            )
        });
    }
    public async get_media_list(
        url: string,
        username: string,token: string,salt: string,
        _end:string, _order:string, _sort:string, _start: string, _search:string, _starred:string,
        playlist_id: string,
        _album_id:string, _artist_id:string,
        year:string
    ){
        let songlist = []
        if(playlist_id === '') {
            const {data,totalCount} = await this.song_Lists_ApiWebService_of_ND.getSongList_ALL(
                _end, _order, _sort, _start,
                _search, _starred, _album_id, _artist_id,
                year
            );
            songlist = data
            store_playlist_list_fetchData._totalCount = totalCount
        }else{
            const {data,totalCount} = await this.song_Lists_ApiWebService_of_ND.getSongList_of_Playlist(
                playlist_id,
                _end, _order, _sort, _start,
                year
            )
            songlist = data
            store_playlist_list_fetchData._totalCount = totalCount
        }
        if (Array.isArray(songlist) && songlist.length > 0) {
            if(_sort === 'playDate'){
                songlist = songlist.filter(song => song.playCount > 0)
            }
            let last_index = store_view_media_page_info.media_Files_temporary.length
            songlist.map(async (song: any, index: number) => {
                let lyrics = this.convertToLRC(song.lyrics)
                if(playlist_id !== '') {
                    song.id = song.mediaFileId
                }
                store_view_media_page_info.media_Files_temporary.push(
                    {
                        absoluteIndex: index + 1 + last_index,
                        favorite: song.starred,
                        rating: song.rating,
                        duration_txt: this.formatTime(song.duration),
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
                    }
                )
            })
        }
        // if (store_view_media_page_info.media_Files_temporary.length > store_playlist_list_info.playlist_MediaFiles_temporary.length) {
        //     this.updatePlaylistMediaFilesTemporary(true);
        // } else {
        //     this.updatePlaylistMediaFilesTemporary(false);
        // }
    }
    public async get_album_list(
        url: string,
        username: string,token: string,salt: string,
        _end:string, _order:string, _sort:string, _start: string, _search:string, _starred:string,
        _artist_id:string
    ){
        let albumlist = await this.album_Lists_ApiWebService_of_ND.getAlbumList_ALL(
            _end, _order, _sort, _start, _search, _starred,
            _artist_id
        )
        if (Array.isArray(albumlist) && albumlist.length > 0) {
            if(_sort === 'playDate'){
                albumlist = albumlist.filter(album => album.playCount > 0)
            }
            let last_index = store_view_album_page_info.album_Files_temporary.length
            albumlist.map(async (album: any, index: number) => {
                store_view_album_page_info.album_Files_temporary.push(
                    {
                        absoluteIndex: index + 1 + last_index,
                        favorite: album.starred,
                        rating: album.rating,
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
                    }
                )
            })
        }
    }
    public async get_artist_list(
        url: string,
        username: string,token: string,salt: string,
        _end:string, _order:string, _sort:string, _start: string, _search:string, _starred:string,
    ){
        let artistlist = await this.artist_Lists_ApiWebService_of_ND.getArtistList_ALL(
            _end, _order, _sort, _start, _search, _starred
        )
        if (Array.isArray(artistlist) && artistlist.length > 0) {
            if(_sort === 'playDate'){
                artistlist = artistlist.filter(artist => artist.playCount > 0)
            }
            let last_index = store_view_artist_page_info.artist_Files_temporary.length
            artistlist.map(async (artist: any, index: number) => {
                store_view_artist_page_info.artist_Files_temporary.push(
                    {
                        absoluteIndex: index + 1 + last_index,
                        favorite: artist.starred,
                        rating: artist.rating,
                        id: artist.id,
                        name: artist.name,
                        album_count: artist.albumCount,
                        full_text: '',
                        order_artist_name: '',
                        sort_artist_name: '',
                        song_count: artist.songCount,
                        size: 0,
                        mbz_artist_id: '',
                        biography: '',
                        small_image_url: '',
                        medium_image_url: url + '/getCoverArt?u=' + username + '&t=' + token + '&s=' + salt + '&v=1.12.0&c=nsmusics&f=json&id=' + artist.id,
                        large_image_url: '',
                        similar_artists: '',
                        external_url: '',
                        external_info_updated_at: '',
                    }
                )
            })
        }
    }
    public async get_play_list(
        url: string,
        username: string,token: string,salt: string,
        _end:string, _order:string, _sort:string, _start: string, _search:string, _starred:string,
        playlist_id: string,
        _album_id:string, _artist_id:string
    ){
        let songlist = []
        if(playlist_id === '') {
            const {data,totalCount} = await this.song_Lists_ApiWebService_of_ND.getSongList_ALL(
                _end, _order, _sort, _start, _search, _starred, _album_id, _artist_id
            );
            songlist = data
            store_playlist_list_fetchData._totalCount = totalCount
        }else{
            const {data,totalCount} = await this.song_Lists_ApiWebService_of_ND.getSongList_of_Playlist(
                playlist_id,
                _end, _order, _sort, _start
            )
            songlist = data
            store_playlist_list_fetchData._totalCount = totalCount
        }
        if (Array.isArray(songlist) && songlist.length > 0) {
            if(_sort === 'playDate'){
                songlist = songlist.filter(song => song.playCount > 0)
            }
            let last_index = store_view_media_page_info.media_Files_temporary.length
            songlist.map(async (song: any, index: number) => {
                let lyrics = this.convertToLRC(song.lyrics)
                if(playlist_id !== '') {
                    song.id = song.mediaFileId
                }
                const new_song = {
                    absoluteIndex: index + 1 + last_index,
                    favorite: song.starred,
                    rating: song.rating,
                    duration_txt: this.formatTime(song.duration),
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
                }
                store_playlist_list_info.playlist_MediaFiles_temporary.push({
                    ...new_song,
                    play_id: new_song.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
                });
            })
            store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds = store_view_media_page_info.media_Files_temporary.map(item => item.id);
            store_app_configs_logic_save.save_system_playlist_item_id_config();
        }
        // if (store_view_media_page_info.media_Files_temporary.length > store_playlist_list_info.playlist_MediaFiles_temporary.length) {
        //     this.updatePlaylistMediaFilesTemporary(true);
        // } else {
        //     this.updatePlaylistMediaFilesTemporary(false);
        // }
    }

    private formatTime(currentTime: number): string {
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);

        let formattedMinutes = String(minutes);
        let formattedSeconds = String(seconds);

        if (formattedMinutes.length == 1)
            formattedMinutes = '0' + formattedMinutes;

        if (formattedSeconds.length == 1)
            formattedSeconds = '0' + formattedSeconds;

        return `${formattedMinutes}:${formattedSeconds}`;
    }
    private convertToLRC(lyrics: string): string {
        let lrcLines: string[] = [];

        let lyricsArray;
        try {
            lyricsArray = JSON.parse(lyrics);
        } catch {
            try {
                return lyrics;
            } catch (e) {
                console.error("Failed to parse lyrics JSON:", e);
            }
            return '';
        }

        if (!Array.isArray(lyricsArray)) {
            return '';
        }

        for (const langBlock of lyricsArray) {
            if (langBlock.synced && Array.isArray(langBlock.line)) {
                for (const line of langBlock.line) {
                    const minutes = Math.floor(line.start / 60000);
                    const seconds = Math.floor((line.start % 60000) / 1000);
                    const milliseconds = (line.start % 1000).toString().padStart(3, '0').slice(0, 2);

                    const timeTag = `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}]`;
                    lrcLines.push(`${timeTag}${line.value}`);
                }
            }
        }

        return lrcLines.join('\n');
    }
    private updatePlaylistMediaFilesTemporary(isAddingNewSongs) {
        const sourceArray = isAddingNewSongs ?
            store_view_media_page_info.media_Files_temporary : store_playlist_list_info.playlist_MediaFiles_temporary;
        const targetArray = isAddingNewSongs ?
            store_playlist_list_info.playlist_MediaFiles_temporary : store_view_media_page_info.media_Files_temporary;
        sourceArray.forEach((song) => {
            const index = targetArray.findIndex((item) => item.id === song.id);
            if (index < 0) {
                const newSongData = { ...song };
                if (isAddingNewSongs) {
                    delete newSongData.play_id;
                }
                targetArray.push(newSongData);
            }
        });
    }

    /// file count
    public async get_count_of_media_file(
        url: string,
        username: string,token: string,salt: string
    ){
        let media_library_scanning_ApiService_of_ND = new Media_library_scanning_ApiService_of_ND(url);
        const getScanStatus = await media_library_scanning_ApiService_of_ND.getScanStatus(username, token, salt);
        store_view_media_page_info.media_item_count = Number(getScanStatus["subsonic-response"]["scanStatus"]["count"]);
    }
    public async get_count_of_artist_album(
        url: string,
        username: string,token: string,salt: string
    ){
        let browsing_ApiService_of_ND = new Browsing_ApiService_of_ND(url);
        const getArtists_ALL = await browsing_ApiService_of_ND.getArtists_ALL(username, token, salt);
        const list = getArtists_ALL["subsonic-response"]["artists"]["index"];
        store_view_artist_page_info.artist_item_count = list.length;
        store_view_album_page_info.album_item_count = list.reduce((sum, index) => {
            return sum + index.artist.reduce((artistSum, artist) => {
                return artistSum + artist.albumCount;
            }, 0);
        }, 0);
    }
    /// starred count
    public async get_count_of_starred(
        url: string,
        username: string,token: string,salt: string
    ){
        let album$Songs_Lists_ApiService_of_ND = new Album$Songs_Lists_ApiService_of_ND(url);
        const getStarred2_all = await album$Songs_Lists_ApiService_of_ND.getStarred2_all(username, token, salt);
        const starred2_artist = getStarred2_all["subsonic-response"]["starred2"]["artist"];
        const starred2_album = getStarred2_all["subsonic-response"]["starred2"]["album"];
        const starred2_song = getStarred2_all["subsonic-response"]["starred2"]["song"];
        store_view_media_page_info.media_starred_count = starred2_song.length ||0
        store_view_album_page_info.album_starred_count = starred2_album.length ||0
        store_view_artist_page_info.artist_starred_count = starred2_artist.length || 0
    }
    /// playlist count
    public async get_count_of_playlist(
        url: string,
        username: string,token: string,salt: string
    ){
        let playlists_ApiService_of_ND = new Playlists_ApiService_of_ND(url);
        const getPlaylists_all = await playlists_ApiService_of_ND.getPlaylists_all(username, token, salt);
        const playlists = getPlaylists_all["subsonic-response"]["playlists"]["playlist"];
        store_view_media_page_info.media_playlist_count = playlists.length || 0;
    }
    /// recently count
    public async get_count_of_recently_media(
        url: string,
        username: string,token: string,salt: string
    ){

        store_view_media_page_info.media_recently_count = 0
    }
    public async get_count_of_recently_album(
        url: string,
        username: string,token: string,salt: string
    ){

        store_view_album_page_info.album_recently_count = 0
    }
    public async get_count_of_recently_artist(
        url: string,
        username: string,token: string,salt: string
    ){

        store_view_artist_page_info.artist_recently_count = 0
    }
}