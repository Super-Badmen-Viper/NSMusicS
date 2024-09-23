import axios from "axios";
import {store_server_users} from "@/store/server/store_server_users";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {store_view_home_page_info} from "@/store/view/home/store_view_home_page_info";
import {
    Home_Lists_ApiWebService_of_ND
} from "@/features/servers_configs/navidrome_api/services_web/page_lists/home_lists/index_service";
import {store_view_artist_page_info} from "@/store/view/artist/store_view_artist_page_info";
import {store_view_album_page_info} from "@/store/view/album/store_view_album_page_info";
import {
    Media_library_scanning_ApiService_of_ND
} from "@/features/servers_configs/navidrome_api/services_normal/media_library_scanning/index_service";
import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
import {
    Artist_Lists_ApiWebService_of_ND
} from "@/features/servers_configs/navidrome_api/services_web/page_lists/artist_lists/index_service";
import {
    Album_Lists_ApiWebService_of_ND
} from "@/features/servers_configs/navidrome_api/services_web/page_lists/album_lists/index_service";
import {
    Song_Lists_ApiWebService_of_ND
} from "@/features/servers_configs/navidrome_api/services_web/page_lists/song_lists/index_service";
import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";
import {
    Playlists_ApiService_of_ND
} from "@/features/servers_configs/navidrome_api/services_normal/playlists/index_service";

export class Get_Navidrome_Temp_Data_To_LocalSqlite{
    private convertToLRC(lyrics: string): string {
        const lrcLines: string[] = [];

        let lyricsArray;
        try {
            lyricsArray = JSON.parse(lyrics);
        } catch (e) {
            console.error("Failed to parse lyrics JSON:", e);
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

    public async get_count_of_media(
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

    /*
    _order: title,album,artist,playCount,playDate,year,duration,createdAt,rating,starred
     */
    public async get_media_list(
        url: string,
        username: string,token: string,salt: string,
        _end:string, _order:string, _sort:string, _start: string, _search:string, _starred:string,
        playlist_id: string,
        _album_id:string
    ){
        let songlist = []
        if(playlist_id === '') {
            songlist = await this.song_Lists_ApiWebService_of_ND.getSongList_ALL(
                _end, _order, _sort, _start, _search, _starred, _album_id
            )
        }else{
            songlist = await this.song_Lists_ApiWebService_of_ND.getSongList_of_Playlist(
                playlist_id,
                _end, _order, _sort, _start
            )
        }
        if (Array.isArray(songlist) && songlist.length > 0) {
            songlist.map(async (song: any, index: number) => {
                let lyrics = this.convertToLRC(song.lyrics)
                if(playlist_id !== '') {
                    song.id = song.mediaFileId
                }
                store_view_media_page_info.media_Files_temporary.push(
                    {
                        absoluteIndex: index + 1,
                        favorite: song.starred,
                        rating: song.rating,
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
    }
    public async get_album_list(
        url: string,
        username: string,token: string,salt: string,
        _end:string, _order:string, _sort:string, _start: string, _search:string, _starred:string
    ){
        const albumlist = await this.album_Lists_ApiWebService_of_ND.getAlbumList_ALL(
            _end, _order, _sort, _start, _search, _starred
        )
        if (Array.isArray(albumlist) && albumlist.length > 0) {
            albumlist.map(async (album: any, index: number) => {
                store_view_album_page_info.album_Files_temporary.push(
                    {
                        absoluteIndex: index + 1,
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
        const artistlist = await this.artist_Lists_ApiWebService_of_ND.getArtistList_ALL(
            _end, _order, _sort, _start, _search, _starred
        )
        if (Array.isArray(artistlist) && artistlist.length > 0) {
            artistlist.map(async (artist: any, index: number) => {
                store_view_artist_page_info.artist_Files_temporary.push(
                    {
                        absoluteIndex: index + 1,
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
}