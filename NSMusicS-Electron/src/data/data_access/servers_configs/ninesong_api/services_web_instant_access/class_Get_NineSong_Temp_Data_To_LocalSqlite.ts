import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {store_view_home_page_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_home/store/store_view_home_page_info";
import {Home_Lists_ApiWebService_of_ND} from "../services_web/page_lists/home_lists/index_service";
import {store_view_artist_page_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_artist/store/store_view_artist_page_info"
import {store_view_album_page_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_album/store/store_view_album_page_info";
import {Media_library_scanning_ApiService_of_ND} from "../services_normal/media_library_scanning/index_service";
import {store_view_media_page_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_media/store/store_view_media_page_info";
import {Artist_Lists_ApiWebService_of_ND} from "../services_web/page_lists/artist_lists/index_service";
import {Album_Lists_ApiWebService_of_ND} from "../services_web/page_lists/album_lists/index_service";
import {Media_Lists_ApiWebService_of_ND} from "../services_web/page_lists/song_lists/index_service";
import {Playlists_ApiService_of_ND} from "../services_normal/playlists/index_service";
import {Album$Medias_Lists_ApiService_of_ND} from "../services_normal/album$songs_lists/index_service";
import {Browsing_ApiService_of_ND} from "../services_normal/browsing/index_service";
import {store_playlist_list_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_components/player_list/store/store_playlist_list_info"
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";
import {store_general_fetch_player_list} from "@/data/data_stores/server/server_api_abstract/music_scene/components/player_list/store_general_fetch_player_list";
import {
    Media_Retrieval_ApiService_of_ND
} from "../services_normal/media_retrieval/index_service";
import {store_player_audio_logic} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_audio_logic";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {
    store_playlist_list_logic
} from "@/views/view_app/page_metadata/page_folder/page_music/music_components/player_list/store/store_playlist_list_logic";
import {store_player_audio_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_audio_info";
import {
    store_general_fetch_media_list
} from "@/data/data_stores/server/server_api_abstract/music_scene/page/page_media_file/store_general_fetch_media_list";


import {Artists_ApiService_of_NineSong} from "../services_web/Scene/Music/Artists/index_service";
import {Albums_ApiService_of_NineSong} from "../services_web/Scene/Music/Albums/index_service";
import {Medias_ApiService_of_NineSong} from "../services_web/Scene/Music/Media_Files/index_service";
import {Annotation_ApiService_of_NineSong} from "../services_web/Scene/Music/Annotation/index_service";
import {Playlist_ApiService_of_NineSong} from "../services_web/Scene/Music/Playlist/index_service";
import {Retrieval_ApiService_of_NineSong} from "../services_web/Scene/Music/Retrieval/index_service";
import {
    store_server_login_info
} from "@/views/view_server/page_metadata/page_login/store/store_server_login_info";

export class class_Get_NineSong_Temp_Data_To_LocalSqlite{
    private artists_ApiService_of_NineSong = new Artists_ApiService_of_NineSong(
        store_server_login_info.server_url
    )
    private albums_ApiService_of_NineSong = new Albums_ApiService_of_NineSong(
        store_server_login_info.server_url
    )
    private medias_ApiService_of_NineSong = new Medias_ApiService_of_NineSong(
        store_server_login_info.server_url
    )
    private annotation_ApiService_of_NineSong = new Annotation_ApiService_of_NineSong(
        store_server_login_info.server_url
    )
    private playlist_ApiService_of_NineSong = new Playlist_ApiService_of_NineSong(
        store_server_login_info.server_url
    )
    private retrieval_ApiService_of_NineSong = new Retrieval_ApiService_of_NineSong(
        store_server_login_info.server_url
    )


    private home_Lists_ApiWebService_of_ND = new Home_Lists_ApiWebService_of_ND(
        store_server_users.server_config_of_current_user_of_sqlite?.url + '/api',
    )
    private song_Lists_ApiWebService_of_ND = new Media_Lists_ApiWebService_of_ND(
        store_server_users.server_config_of_current_user_of_sqlite?.url + '/api',
    )
    private album_Lists_ApiWebService_of_ND = new Album_Lists_ApiWebService_of_ND(
        store_server_users.server_config_of_current_user_of_sqlite?.url + '/api',
    )
    private artist_Lists_ApiWebService_of_ND = new Artist_Lists_ApiWebService_of_ND(
        store_server_users.server_config_of_current_user_of_sqlite?.url + '/api',
    )

    public async get_home_list(
        url: string,
        username: string,token: string,salt: string
    ){
        await this.get_home_list_of_maximum_playback(url, username, token, salt)
        await this.get_home_list_of_random_search(url, username, token, salt)
        await this.get_home_list_of_recently_added(url, username, token, salt)
        await this.get_home_list_of_recently_played(url, username, token, salt)
    }
    public async get_home_list_of_maximum_playback(
        url: string,
        username: string,token: string,salt: string
    ){
        const maximum_playback = await this.home_Lists_ApiWebService_of_ND.getAlbumList_Play_Count()
        if(maximum_playback != undefined && Array.isArray(maximum_playback)) {
            maximum_playback.map(async (album: any) => {
                store_view_home_page_info.home_Files_temporary_maximum_playback.push(
                    {
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
            });
        }
    }
    public async get_home_list_of_random_search(
        url: string,
        username: string,token: string,salt: string
    ){
        const random_search = await this.home_Lists_ApiWebService_of_ND.getAlbumList_Random()
        if(random_search != undefined && Array.isArray(random_search)) {
            random_search.map(async (album: any) => {
                store_view_home_page_info.home_Files_temporary_random_search.push(
                    {
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
            });
        }
    }
    public async get_home_list_of_recently_added(
        url: string,
        username: string,token: string,salt: string
    ){
        const recently_added = await this.home_Lists_ApiWebService_of_ND.getAlbumList_Recently_Added()
        if(recently_added != undefined && Array.isArray(recently_added)) {
            recently_added.map(async (album: any) => {
                store_view_home_page_info.home_Files_temporary_recently_added.push(
                    {
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
            });
        }
    }
    public async get_home_list_of_recently_played(
        url: string,
        username: string,token: string,salt: string
    ){
        const recently_played = await this.home_Lists_ApiWebService_of_ND.getAlbumList_Play_Date()
        if(recently_played != undefined && Array.isArray(recently_played)) {
            recently_played.map(async (album: any) => {
                store_view_home_page_info.home_Files_temporary_recently_played.push(
                    {
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
            });
        }
    }
    public async get_media_list(
        url: string,
        _start: string, _end:string,
        _sort:string, _order:string, _starred:string, _search:string,
        year:string,
        playlist_id: string,
        _album_id:string, _artist_id:string,
    ){
        let songlist = [];
        let totalCount = 0;
        if (playlist_id === '') {
            const { data, count } = await this.medias_ApiService_of_NineSong.getMedias(
                _start, _end, _sort, _order,
                _starred, _search,
                year,
                _album_id, _artist_id,
            );
            songlist = data;
            totalCount = count;
        } else {
            const { data, count } = await this.medias_ApiService_of_NineSong.getMedias_Playlist(
                playlist_id,
                _start, _end, _sort, _order,
                _starred, _search,
                year,
                _album_id, _artist_id,
            );
            songlist = data;
            totalCount = count;
        }
        ///
        if (Array.isArray(songlist) && songlist.length > 0) {
            if (store_general_fetch_media_list._load_model === 'search') {
                const existingSong = store_view_media_page_info.media_Files_temporary.find(item => item.id === songlist[0].id);
                if (existingSong) {
                    return;
                }
            } else {
                const existingSong = store_playlist_list_info.playlist_MediaFiles_temporary.find(item => item.id === songlist[0].id);
                if (existingSong) {
                    return;
                }
            }
        }else{
            return;
        }
        ///
        if (Array.isArray(songlist) && songlist.length > 0) {
            if(_sort === 'playDate'){
                songlist = songlist.filter(song => song.playCount > 0)
            }
            store_general_fetch_player_list._totalCount = totalCount
            let last_index = store_general_fetch_media_list._load_model === 'search' ?
                store_view_media_page_info.media_Files_temporary.length :
                store_playlist_list_info.playlist_MediaFiles_temporary.length
            store_view_media_page_info.media_File_metadata = [];
            songlist.map(async (song: any, index: number) => {
                let lyrics = this.convertToLRC(song.lyrics)
                if(playlist_id !== '') {
                    song.id = song.mediaFileId
                }
                const newsong = {
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
                if(store_general_fetch_media_list._load_model === 'search') {
                    store_view_media_page_info.media_File_metadata.push(song)
                    store_view_media_page_info.media_Files_temporary.push(newsong)
                }else{
                    store_playlist_list_info.playlist_MediaFiles_temporary.push({
                        ...newsong,
                        play_id: newsong.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
                    });
                }
            });
            if(store_general_fetch_media_list._load_model === 'play') {
                store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds =
                    store_view_media_page_info.media_Files_temporary.map(item => item.id);
                store_app_configs_logic_save.save_system_playlist_item_id_config();
            }
        }
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
            store_view_album_page_info.album_File_metadata = []
            albumlist.map(async (album: any, index: number) => {
                store_view_album_page_info.album_File_metadata.push(
                    album
                )
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
            store_view_artist_page_info.artist_File_metadata = [];
            artistlist.map(async (artist: any, index: number) => {
                store_view_artist_page_info.artist_File_metadata.push(
                    artist
                )
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
            const {data,totalCount} = await this.song_Lists_ApiWebService_of_ND.getMediaList_ALL(
                _end, _order, _sort, _start, _search, _starred, _album_id, _artist_id, ''
            );
            songlist = data
        }else{
            const {data,totalCount} = await this.song_Lists_ApiWebService_of_ND.getMediaList_of_Playlist(
                playlist_id,
                _end, _order, _sort, _start, ''
            )
            songlist = data
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
    }
    public async get_random_song_list(
        url: string,
        username: string,token: string,salt: string,
        size: string,
        fromYear: string, toYear: string
    ){
        let browsing_ApiService_of_ND = new Browsing_ApiService_of_ND(url);
        const getRandomSongs = await browsing_ApiService_of_ND.getRandomSongs(
            username, token, salt,
            size,
            fromYear, toYear
        );
        let media_Retrieval_ApiService_of_ND = new Media_Retrieval_ApiService_of_ND(url);
        let songlist = getRandomSongs["subsonic-response"]["randomSongs"]["song"];
        if (Array.isArray(songlist) && songlist.length > 0) {
            let last_index = 0;
            songlist.map(async (song: any, index: number) => {
                const getLyrics_id = await media_Retrieval_ApiService_of_ND.getLyrics_id(username, token, salt, song.id);
                let lyrics = undefined;
                try {
                    lyrics = this.convertToLRC_Array(getLyrics_id["subsonic-response"]["lyricsList"]["structuredLyrics"][0]["line"]);
                } catch {
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
                if(index === songlist.length - 1){
                    const index = store_server_user_model.random_play_model_add
                        ? store_playlist_list_info.playlist_MediaFiles_temporary.length - 10: 0
                    const media_file = store_playlist_list_info.playlist_MediaFiles_temporary[index]
                    await store_player_audio_logic.update_current_media_info(media_file, index)
                    store_playlist_list_logic.media_page_handleItemDbClick = false
                    store_player_audio_info.this_audio_restart_play = true
                    //
                    store_server_user_model.random_play_model_add = false
                }
            })
            store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds =
                store_playlist_list_info.playlist_MediaFiles_temporary.map(item => item.id);
            store_app_configs_logic_save.save_system_playlist_item_id_config();
        }
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
    private convertToLRC_Array(lyrics: {
        start: number;
        value: string;
    }[]): string {
        return lyrics
            .map((item) => {
                // 将毫秒转换为 [mm:ss.xx] 格式
                const minutes = Math.floor(item.start / 60000);
                const seconds = Math.floor((item.start % 60000) / 1000);
                const milliseconds = Math.floor((item.start % 1000) / 10);
                const time = `[${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}]`;

                // 返回 LRC 格式的行
                return `${time}${item.value}`;
            })
            .join('\n'); // 每行用换行符分隔
    }

    /// file count
    public async get_count_of_media_file(
        url: string,
        username: string,token: string,salt: string
    ){
        try{
            let media_library_scanning_ApiService_of_ND = new Media_library_scanning_ApiService_of_ND(url);
            const getScanStatus = await media_library_scanning_ApiService_of_ND.getScanStatus(username, token, salt);
            store_view_media_page_info.media_item_count = Number(getScanStatus["subsonic-response"]["scanStatus"]["count"]);
        }catch{}
    }
    public async get_count_of_artist_album(
        url: string,
        username: string,token: string,salt: string
    ){
        try{
            let browsing_ApiService_of_ND = new Browsing_ApiService_of_ND(url);
            const getArtists_ALL = await browsing_ApiService_of_ND.getArtists_ALL(username, token, salt);
            const list = getArtists_ALL["subsonic-response"]["artists"]["index"];
            if(list != undefined && Array.isArray(list)) {
                store_view_artist_page_info.artist_item_count = list.reduce((total, item) => total + item.artist.length, 0);
                store_view_album_page_info.album_item_count = list.reduce((sum, index) => {
                    return sum + index.artist.reduce((artistSum, artist) => {
                        return artistSum + artist.albumCount;
                    }, 0);
                }, 0);
            }
        }catch{}
    }
    /// starred count
    public async get_count_of_starred(
        url: string,
        username: string,token: string,salt: string
    ){
        try{
            let album$Medias_Lists_ApiService_of_ND = new Album$Medias_Lists_ApiService_of_ND(url);
            const getStarred2_all = await album$Medias_Lists_ApiService_of_ND.getStarred2_all(username, token, salt);
            const starred2_artist = getStarred2_all["subsonic-response"]["starred2"]["artist"];
            const starred2_album = getStarred2_all["subsonic-response"]["starred2"]["album"];
            const starred2_song = getStarred2_all["subsonic-response"]["starred2"]["song"];
            if(starred2_song != undefined)
                store_view_media_page_info.media_starred_count = starred2_song.length ||0
            if(starred2_album != undefined)
                store_view_album_page_info.album_starred_count = starred2_album.length ||0
            if(starred2_artist != undefined)
                store_view_artist_page_info.artist_starred_count = starred2_artist.length || 0
        }catch{}
    }
    /// playlist count
    public async get_count_of_playlist(
        url: string,
        username: string,token: string,salt: string
    ){
        try{
            let playlists_ApiService_of_ND = new Playlists_ApiService_of_ND(url);
            const getPlaylists_all = await playlists_ApiService_of_ND.getPlaylists_all(username, token, salt);
            const playlists = getPlaylists_all["subsonic-response"]["playlists"]["playlist"];
            if(playlists != undefined)
                store_view_media_page_info.media_playlist_count = playlists.length || 0;
        }catch{}
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