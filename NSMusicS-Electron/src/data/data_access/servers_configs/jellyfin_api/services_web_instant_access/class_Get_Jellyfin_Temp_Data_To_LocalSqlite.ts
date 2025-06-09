import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {
    store_view_home_page_info
} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_home/store/store_view_home_page_info";
import {
    store_view_artist_page_info
} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_artist/store/store_view_artist_page_info"
import {
    store_view_album_page_info
} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_album/store/store_view_album_page_info";
import {
    store_view_media_page_info
} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_media/store/store_view_media_page_info";
import {
    store_playlist_list_info
} from "@/views/view_app/page_metadata/page_folder/page_music/music_components/player_list/store/store_playlist_list_info"
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";
import {
    store_player_audio_logic
} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_audio_logic";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {Items_ApiService_of_Je} from "../services_web/Items/index_service";
import {Artists_ApiService_of_Je} from "../services_web/Artists/index_service";
import axios from "axios";
import {
    store_view_media_page_logic
} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_media/store/store_view_media_page_logic";
import {
    store_general_fetch_player_list
} from "@/data/data_stores/server/server_api_abstract/music_scene/components/player_list/store_general_fetch_player_list";
import {
    store_general_fetch_media_list
} from "@/data/data_stores/server/server_api_abstract/music_scene/page/page_media_file/store_general_fetch_media_list";

export class Get_Jellyfin_Temp_Data_To_LocalSqlite{
    private items_ApiService_of_Je = new Items_ApiService_of_Je(
        store_server_users.server_config_of_current_user_of_sqlite?.url
    )
    private artists_ApiService_of_Je = new Artists_ApiService_of_Je(
        store_server_users.server_config_of_current_user_of_sqlite?.url
    )

    public async get_home_list(parentId: string){
        await this.get_home_list_of_maximum_playback(parentId)
        await this.get_home_list_of_random_search(parentId)
        await this.get_home_list_of_recently_added(parentId)
        await this.get_home_list_of_recently_played(parentId)
    }
    public async get_home_list_of_maximum_playback(parentId: string){
        if(store_server_user_model.authorization_of_Je != undefined &&
            store_server_user_model.authorization_of_Je.length > 0) {
            let maximum_playback = []
            const response_list_of_maximum_playback = await axios(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/Users/' +
                store_server_user_model.userid_of_Je + '/Items?SortBy=PlayCount&SortOrder=Descending&' +
                'IncludeItemTypes=Audio&Limit=16&Recursive=true&Fields=PrimaryImageAspectRatio' +
                '&Filters=IsPlayed' +
                '&ParentId=' + parentId + '&ImageTypeLimit=1&EnableImageTypes=Primary%2CBackdrop%2CBanner%2CThumb' +
                '&api_key=' + store_server_user_model.authorization_of_Je
            );
            if (response_list_of_maximum_playback != undefined) {
                maximum_playback = response_list_of_maximum_playback.data.Items;
            }
            if (maximum_playback != undefined && Array.isArray(maximum_playback)) {
                maximum_playback.map(async (album: any) => {
                    const medium_image_url =
                        album.Id != undefined ? (
                            store_server_users.server_select_kind === 'jellyfin'
                            ?
                            store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                            album.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                            :
                            store_server_users.server_config_of_current_user_of_sqlite?.url + '/emby/Items/' +
                            (album.ImageTags?.Primary ? album.Id : album.ParentBackdropItemId) +
                            (album.ImageTags?.Primary ? '/Images/Primary?fillWidth=122&fillHeight=122&tag=' : '/Images/Backdrop?fillWidth=122&fillHeight=122&tag=') +
                            (album.ImageTags?.Primary ?? album.ParentBackdropImageTags?.[0] ?? 'default') +
                            '&api_key=' + store_server_user_model.authorization_of_Je
                        ) : undefined
                    store_view_home_page_info.home_Files_temporary_maximum_playback.push({
                        favorite: album.UserData.IsFavorite,
                        rating: 0,
                        id: album.Id,
                        name: album.Name,
                        artist_id: album.ArtistItems.length > 0 ? album.ArtistItems[0].Id : '',
                        embed_art_path: '',
                        artist: album.Artists.length > 0 ? album.Artists[0] : '',
                        album_artist: '',
                        min_year: album.ProductionYear,
                        max_year: album.ProductionYear,
                        compilation: 0,
                        song_count: '',
                        duration: album.RunTimeTicks,
                        genre: '',
                        created_at: album.PremiereDate,
                        updated_at: '',
                        full_text: '',
                        album_artist_id: album.AlbumId,
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
                        medium_image_url: medium_image_url,
                        large_image_url: '',
                        external_url: '',
                        external_info_updated_at: ''
                    })
                });
            }
        }
    }
    public async get_home_list_of_random_search(parentId: string,){
        if(store_server_user_model.authorization_of_Je != undefined &&
            store_server_user_model.authorization_of_Je.length > 0) {
            let list = []
            let random_search = []
            if (store_server_users.server_select_kind === 'jellyfin') {
                list = await this.items_ApiService_of_Je.getItems_List(
                    store_server_user_model.userid_of_Je, parentId, '',
                    'Random', 'Descending',
                    '18', '0',
                    'Audio',
                    'PrimaryImageAspectRatio', 'Primary%2CBackdrop%2CBanner%2CThumb', 'true', '1',
                    '', 'IsPlayed'
                );
            } else {
                const data = await axios(
                    store_server_users.server_config_of_current_user_of_sqlite?.url + '/emby/Users/' +
                    store_server_user_model.userid_of_Je + '/Items?SortBy=Random&SortOrder=Descending&' +
                    'IncludeItemTypes=Audio&Limit=16&Recursive=true&Fields=BasicSyncInfo%2CCanDelete%2CPrimaryImageAspectRatio%2CProductionYear%2CStatus%2CEndDate%2CCommunityRating%2COfficialRating%2CCriticRating' +
                    '&ParentId=' + parentId + '&ImageTypeLimit=1&EnableImageTypes=Primary%2CBackdrop%2CThumb' +
                    '&startIndex=0&RandomSeed=7916807' +
                    '&api_key=' + store_server_user_model.authorization_of_Je
                );
                list = data.data;
            }
            if (list != undefined) {
                random_search = list.Items;
            }
            if (random_search != undefined && Array.isArray(random_search)) {
                random_search.map(async (album: any) => {
                    const medium_image_url =
                        album.Id != undefined ? (
                            store_server_users.server_select_kind === 'jellyfin'
                            ?
                            store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                            album.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                            :
                            store_server_users.server_config_of_current_user_of_sqlite?.url + '/emby/Items/' +
                            (album.ImageTags?.Primary ? album.Id : album.ParentBackdropItemId) +
                            (album.ImageTags?.Primary ? '/Images/Primary?fillWidth=122&fillHeight=122&tag=' : '/Images/Backdrop?fillWidth=122&fillHeight=122&tag=') +
                            (album.ImageTags?.Primary ?? album.ParentBackdropImageTags?.[0] ?? 'default') +
                            '&api_key=' + store_server_user_model.authorization_of_Je
                        ) : undefined
                    store_view_home_page_info.home_Files_temporary_random_search.push({
                        favorite: album.UserData.IsFavorite,
                        rating: 0,
                        id: album.Id,
                        name: album.Name,
                        artist_id: album.ArtistItems.length > 0 ? album.ArtistItems[0].Id : '',
                        embed_art_path: '',
                        artist: album.Artists.length > 0 ? album.Artists[0] : '',
                        album_artist: '',
                        min_year: album.ProductionYear,
                        max_year: album.ProductionYear,
                        compilation: 0,
                        song_count: '',
                        duration: album.RunTimeTicks,
                        genre: '',
                        created_at: album.PremiereDate,
                        updated_at: '',
                        full_text: '',
                        album_artist_id: album.AlbumId,
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
                        medium_image_url: medium_image_url,
                        large_image_url: '',
                        external_url: '',
                        external_info_updated_at: ''
                    })
                });
            }
        }
    }
    public async get_home_list_of_recently_added(parentId: string){
        if(store_server_user_model.authorization_of_Je != undefined &&
            store_server_user_model.authorization_of_Je.length > 0) {
            const response_list_of_recently_added = await axios(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/Users/' +
                store_server_user_model.userid_of_Je + '/Items/Latest?IncludeItemTypes=Audio&Limit=16&Fields=PrimaryImageAspectRatio' +
                '&ParentId=' + parentId + '&ImageTypeLimit=1&EnableImageTypes=Primary%2CBackdrop%2CBanner%2CThumb' +
                '&api_key=' + store_server_user_model.authorization_of_Je
            );
            const recently_added = response_list_of_recently_added.data;
            if (recently_added != undefined && Array.isArray(recently_added)) {
                recently_added.map(async (album: any) => {
                    const medium_image_url =
                        album.Id != undefined ? (
                            store_server_users.server_select_kind === 'jellyfin'
                                ?
                                store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                                album.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                                :
                                store_server_users.server_config_of_current_user_of_sqlite?.url + '/emby/Items/' +
                                (album.PrimaryImageItemId ? album.PrimaryImageItemId : album.ParentBackdropItemId) +
                                (album.PrimaryImageItemId ? '/Images/Primary?fillWidth=122&fillHeight=122&tag=' : '/Images/Backdrop?fillWidth=122&fillHeight=122&tag=') +
                                (album.PrimaryImageTag ?? album.ParentBackdropImageTags?.[0] ?? 'default') +
                                '&api_key=' + store_server_user_model.authorization_of_Je
                        ) : undefined
                    store_view_home_page_info.home_Files_temporary_recently_added.push({
                        favorite: album.UserData.IsFavorite,
                        rating: 0,
                        id: album.Id,
                        name: album.Name,
                        artist_id: album.ArtistItems.length > 0 ? album.ArtistItems[0].Id : '',
                        embed_art_path: '',
                        artist: album.Artists.length > 0 ? album.Artists[0] : '',
                        album_artist: '',
                        min_year: album.ProductionYear,
                        max_year: album.ProductionYear,
                        compilation: 0,
                        song_count: '',
                        duration: album.RunTimeTicks,
                        genre: '',
                        created_at: album.PremiereDate,
                        updated_at: '',
                        full_text: '',
                        album_artist_id: album.AlbumId,
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
                        medium_image_url: medium_image_url,
                        large_image_url: '',
                        external_url: '',
                        external_info_updated_at: ''
                    })
                });
            }
        }
    }
    public async get_home_list_of_recently_played(parentId: string,){
        if(store_server_user_model.authorization_of_Je != undefined &&
            store_server_user_model.authorization_of_Je.length > 0) {
            let recently_played = []
            const response_list_of_recently_played = await axios(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/Users/' +
                store_server_user_model.userid_of_Je + '/Items?SortBy=DatePlayed&SortOrder=Descending&IncludeItemTypes=Audio&Limit=16&Recursive=true&Fields=PrimaryImageAspectRatio' +
                '&Filters=IsPlayed' +
                '&ParentId=' + parentId + '&ImageTypeLimit=1&EnableImageTypes=Primary%2CBackdrop%2CBanner%2CThumb' +
                '&api_key=' + store_server_user_model.authorization_of_Je
            );
            if (response_list_of_recently_played != undefined) {
                recently_played = response_list_of_recently_played.data.Items;
            }
            if (recently_played != undefined && Array.isArray(recently_played)) {
                recently_played.map(async (album: any) => {
                    const medium_image_url =
                        album.Id != undefined ? (
                            store_server_users.server_select_kind === 'jellyfin'
                            ?
                            store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                            album.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                            :
                            store_server_users.server_config_of_current_user_of_sqlite?.url + '/emby/Items/' +
                            (album.ImageTags?.Primary ? album.Id : album.ParentBackdropItemId) +
                            (album.ImageTags?.Primary ? '/Images/Primary?fillWidth=122&fillHeight=122&tag=' : '/Images/Backdrop?fillWidth=122&fillHeight=122&tag=') +
                            (album.ImageTags?.Primary ?? album.ParentBackdropImageTags?.[0] ?? 'default') +
                            '&api_key=' + store_server_user_model.authorization_of_Je
                        ) : undefined
                    store_view_home_page_info.home_Files_temporary_recently_played.push({
                        favorite: album.UserData.IsFavorite,
                        rating: 0,
                        id: album.Id,
                        name: album.Name,
                        artist_id: album.ArtistItems.length > 0 ? album.ArtistItems[0].Id : '',
                        embed_art_path: '',
                        artist: album.Artists.length > 0 ? album.Artists[0] : '',
                        album_artist: '',
                        min_year: album.ProductionYear,
                        max_year: album.ProductionYear,
                        compilation: 0,
                        song_count: '',
                        duration: album.RunTimeTicks,
                        genre: '',
                        created_at: album.PremiereDate,
                        updated_at: '',
                        full_text: '',
                        album_artist_id: album.AlbumId,
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
                        medium_image_url: medium_image_url,
                        large_image_url: '',
                        external_url: '',
                        external_info_updated_at: ''
                    })
                });
            }
        }
    }

    public async get_media_list_of_artist(
        _artist_id: string,
        limit: string, startIndex: string,
    ){
        if(store_server_user_model.authorization_of_Je != undefined &&
            store_server_user_model.authorization_of_Je.length > 0) {
            let songlist = []
            const response_media_list = await axios(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/Users/' +
                store_server_user_model.userid_of_Je + '/Items?ArtistIds=' +
                _artist_id + '&Filters=IsNotFolder&Recursive=true&SortBy=SortName&' +
                'Limit=' + limit + '&StartIndex=' + startIndex + '&' +
                'MediaTypes=Audio&SortOrder=Ascending&' +
                'Fields=Chapters%2CTrickplay&ExcludeLocationTypes=Virtual&' +
                'CollapseBoxSetItems=false&' +
                'api_key=' + store_server_user_model.authorization_of_Je
            );
            if (response_media_list != undefined) {
                songlist = response_media_list.data.Items;
                ///
                if (Array.isArray(songlist) && songlist.length > 0) {
                    if (store_general_fetch_media_list._load_model === 'search') {
                        const existingSong = store_view_media_page_info.media_Files_temporary.find(item => item.id === songlist[0].id);
                        if (existingSong) {
                            console.error("警告，获取的Media项存在重复，服务端的查询业务存在问题")
                        }
                    } else {
                        const existingSong = store_playlist_list_info.playlist_MediaFiles_temporary.find(item => item.id === songlist[0].id);
                        if (existingSong) {
                            console.error("警告，获取的Media项存在重复，服务端的查询业务存在问题")
                        }
                    }
                }else{
                    return;
                }
                ///
                store_general_fetch_player_list._totalCount = response_media_list.data.TotalRecordCount
            }
            if (Array.isArray(songlist) && songlist.length > 0) {
                let last_index = store_general_fetch_media_list._load_model === 'search' ?
                    store_view_media_page_info.media_Files_temporary.length :
                    store_playlist_list_info.playlist_MediaFiles_temporary.length
                store_view_media_page_info.media_File_metadata = [];
                await Promise.all(songlist.map(async (song: any, index: number) => {
                    const medium_image_url =
                        song.Id != undefined ? (
                            store_server_users.server_select_kind === 'jellyfin'
                            ?
                            store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                            song.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                            :
                            store_server_users.server_config_of_current_user_of_sqlite?.url + '/emby/Items/' +
                            (song.ImageTags?.Primary ? song.Id : song.ParentBackdropItemId) +
                            (song.ImageTags?.Primary ? '/Images/Primary?fillWidth=122&fillHeight=122&tag=' : '/Images/Backdrop?fillWidth=122&fillHeight=122&tag=') +
                            (song.ImageTags?.Primary ?? song.ParentBackdropImageTags?.[0] ?? 'default') +
                            '&api_key=' + store_server_user_model.authorization_of_Je
                        ) : undefined
                    const blobUrl =
                        store_server_users.server_config_of_current_user_of_sqlite?.url + '/Audio/' +
                        song.Id + '/universal?UserId=' +
                        store_server_user_model.userid_of_Je + '&MaxStreamingBitrate=1145761093&Container=opus%2Cwebm%7Copus%2Cts%7Cmp3%2Cmp3%2Caac%2Cm4a%7Caac%2Cm4b%7Caac%2Cflac%2Cwebma%2Cwebm%7Cwebma%2Cwav%2Cogg&TranscodingContainer=mp4&TranscodingProtocol=hls&AudioCodec=aac&api_key=' +
                        store_server_user_model.authorization_of_Je + '&StartTimeTicks=0&EnableRedirection=true&EnableRemoteMedia=false&EnableAudioVbrEncoding=true';
                    const newsong = {
                        absoluteIndex: index + 1 + last_index,
                        favorite: song.UserData.IsFavorite,
                        rating: 0,
                        duration_txt: store_player_audio_logic.formatTime_RunTimeTicks(song.RunTimeTicks),
                        id: song.Id,
                        title: song.Name,
                        path: blobUrl,
                        artist: song.Artists.length > 0 ? song.Artists[0] : '',
                        album: song.Album,
                        artist_id: song.ArtistItems.length > 0 ? song.ArtistItems[0].Id : '',
                        album_id: song.AlbumId,
                        album_artist: '',
                        has_cover_art: 0,
                        track_number: 0,
                        disc_number: 0,
                        year: song.ProductionYear,
                        size: '',
                        suffix: '',
                        duration: song.RunTimeTicks,
                        bit_rate: '',
                        genre: '',
                        compilation: 0,
                        created_at: song.PremiereDate,
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
                        order_title: song.PlaylistItemId,
                        mbz_release_track_id: '',
                        rg_album_gain: 0,
                        rg_album_peak: 0,
                        rg_track_gain: 0,
                        rg_track_peak: 0,
                        medium_image_url: medium_image_url
                    };
                    if (store_general_fetch_media_list._load_model === 'search') {
                        store_view_media_page_info.media_File_metadata.push(song);
                        store_view_media_page_info.media_Files_temporary.push(newsong);
                    } else {
                        store_playlist_list_info.playlist_MediaFiles_temporary.push({
                            ...newsong,
                            play_id: newsong.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
                        });
                    }
                }));
                if (store_general_fetch_media_list._load_model === 'play') {
                    store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds =
                        store_view_media_page_info.media_Files_temporary.map(item => item.id);
                    store_app_configs_logic_save.save_system_playlist_item_id_config();
                }
            }
        }
    }


    /// jellyfin - home -> media_id -> media
    public async get_media_list_of_home$media_of_Je(
        media_id: string,
        limit: string, startIndex: string,
    ){
        if(store_server_user_model.authorization_of_Je != undefined &&
            store_server_user_model.authorization_of_Je.length > 0) {
            const data = await axios(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/Users/' +
                store_server_user_model.userid_of_Je + '/Items/' + media_id + '?' +
                '&Limit=' + limit + '&StartIndex=' + startIndex +
                '&api_key=' + store_server_user_model.authorization_of_Je
            );
            let songlist = [];
            songlist.push(data.data);
            store_general_fetch_player_list._totalCount = songlist.length // 1个
            if (Array.isArray(songlist) && songlist.length > 0) {
                let last_index = store_general_fetch_media_list._load_model === 'search' ?
                    store_view_media_page_info.media_Files_temporary.length :
                    store_playlist_list_info.playlist_MediaFiles_temporary.length
                store_view_media_page_info.media_File_metadata = [];
                await Promise.all(songlist.map(async (song: any, index: number) => {
                    const medium_image_url =
                        song.Id != undefined ? (
                            store_server_users.server_select_kind === 'jellyfin'
                            ?
                            store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                            song.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                            :
                            store_server_users.server_config_of_current_user_of_sqlite?.url + '/emby/Items/' +
                            (song.ImageTags?.Primary ? song.Id : song.ParentBackdropItemId) +
                            (song.ImageTags?.Primary ? '/Images/Primary?fillWidth=122&fillHeight=122&tag=' : '/Images/Backdrop?fillWidth=122&fillHeight=122&tag=') +
                            (song.ImageTags?.Primary ?? song.ParentBackdropImageTags?.[0] ?? 'default') +
                            '&api_key=' + store_server_user_model.authorization_of_Je
                        ) : undefined
                    const blobUrl =
                        store_server_users.server_config_of_current_user_of_sqlite?.url + '/Audio/' +
                        song.Id + '/universal?UserId=' +
                        store_server_user_model.userid_of_Je + '&MaxStreamingBitrate=1145761093&Container=opus%2Cwebm%7Copus%2Cts%7Cmp3%2Cmp3%2Caac%2Cm4a%7Caac%2Cm4b%7Caac%2Cflac%2Cwebma%2Cwebm%7Cwebma%2Cwav%2Cogg&TranscodingContainer=mp4&TranscodingProtocol=hls&AudioCodec=aac&api_key=' +
                        store_server_user_model.authorization_of_Je + '&StartTimeTicks=0&EnableRedirection=true&EnableRemoteMedia=false&EnableAudioVbrEncoding=true';
                    const newsong = {
                        absoluteIndex: index + 1 + last_index,
                        favorite: song.UserData.IsFavorite,
                        rating: 0,
                        duration_txt: store_player_audio_logic.formatTime_RunTimeTicks(song.RunTimeTicks),
                        id: song.Id,
                        title: song.Name,
                        path: blobUrl,
                        artist: song.Artists.length > 0 ? song.Artists[0] : '',
                        album: song.Album,
                        artist_id: song.ArtistItems.length > 0 ? song.ArtistItems[0].Id : '',
                        album_id: song.AlbumId,
                        album_artist: '',
                        has_cover_art: 0,
                        track_number: 0,
                        disc_number: 0,
                        year: song.ProductionYear,
                        size: '',
                        suffix: '',
                        duration: song.RunTimeTicks,
                        bit_rate: '',
                        genre: '',
                        compilation: 0,
                        created_at: song.PremiereDate,
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
                        order_title: song.PlaylistItemId,
                        mbz_release_track_id: '',
                        rg_album_gain: 0,
                        rg_album_peak: 0,
                        rg_track_gain: 0,
                        rg_track_peak: 0,
                        medium_image_url: medium_image_url
                    };
                    if (store_general_fetch_media_list._load_model === 'search') {
                        store_view_media_page_info.media_File_metadata.push(song);
                        store_view_media_page_info.media_Files_temporary.push(newsong);
                    } else {
                        store_playlist_list_info.playlist_MediaFiles_temporary.push({
                            ...newsong,
                            play_id: newsong.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
                        });
                    }
                }));
                if (store_general_fetch_media_list._load_model === 'play') {
                    store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds =
                        store_view_media_page_info.media_Files_temporary.map(item => item.id);
                    store_app_configs_logic_save.save_system_playlist_item_id_config();
                }
            }
        }
    }
    /// emby - home -> album_id -> media
    public async get_media_list_of_home$album_of_Em(
        album_artist_id: string,
        limit: string, startIndex: string,
    ){
        if(store_server_user_model.authorization_of_Je != undefined &&
            store_server_user_model.authorization_of_Je.length > 0) {
            let songlist = []
            const data = await axios(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/emby/Users/' +
                store_server_user_model.userid_of_Je + '/Items?' +
                'Fields=BasicSyncInfo%2CCanDelete%2CPrimaryImageAspectRatio%2CSyncStatus' +
                '&Limit=' + limit + '&StartIndex=' + startIndex +
                '&ParentId=' + album_artist_id + '&ImageTypeLimit=1&EnableImageTypes=Primary%2CBackdrop%2CThumb' +
                '&api_key=' + store_server_user_model.authorization_of_Je
            );
            if (data != undefined) {
                let list = data.data;
                songlist = list.Items;
                ///
                if (Array.isArray(songlist) && songlist.length > 0) {
                    if (store_general_fetch_media_list._load_model === 'search') {
                        const existingSong = store_view_media_page_info.media_Files_temporary.find(item => item.id === songlist[0].id);
                        if (existingSong) {
                            console.error("警告，获取的Media项存在重复，服务端的查询业务存在问题")
                        }
                    } else {
                        const existingSong = store_playlist_list_info.playlist_MediaFiles_temporary.find(item => item.id === songlist[0].id);
                        if (existingSong) {
                            console.error("警告，获取的Media项存在重复，服务端的查询业务存在问题")
                        }
                    }
                }else{
                    return;
                }
                ///
                store_general_fetch_player_list._totalCount =
                    (typeof list.TotalRecordCount !== 'undefined' && list.TotalRecordCount != 0) ? list.TotalRecordCount : list.Items.length;
            }
            if (Array.isArray(songlist) && songlist.length > 0) {
                let last_index = store_general_fetch_media_list._load_model === 'search' ?
                    store_view_media_page_info.media_Files_temporary.length :
                    store_playlist_list_info.playlist_MediaFiles_temporary.length
                store_view_media_page_info.media_File_metadata = [];
                await Promise.all(songlist.map(async (song: any, index: number) => {
                    const medium_image_url =
                        song.Id != undefined ? (
                            store_server_users.server_select_kind === 'jellyfin'
                            ?
                            store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                            song.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                            :
                            store_server_users.server_config_of_current_user_of_sqlite?.url + '/emby/Items/' +
                            (song.ImageTags?.Primary ? song.Id : song.ParentBackdropItemId) +
                            (song.ImageTags?.Primary ? '/Images/Primary?fillWidth=122&fillHeight=122&tag=' : '/Images/Backdrop?fillWidth=122&fillHeight=122&tag=') +
                            (song.ImageTags?.Primary ?? song.ParentBackdropImageTags?.[0] ?? 'default') +
                            '&api_key=' + store_server_user_model.authorization_of_Je
                        ) : undefined
                    const blobUrl =
                        store_server_users.server_config_of_current_user_of_sqlite?.url + '/Audio/' +
                        song.Id + '/universal?UserId=' +
                        store_server_user_model.userid_of_Je + '&MaxStreamingBitrate=1145761093&Container=opus%2Cwebm%7Copus%2Cts%7Cmp3%2Cmp3%2Caac%2Cm4a%7Caac%2Cm4b%7Caac%2Cflac%2Cwebma%2Cwebm%7Cwebma%2Cwav%2Cogg&TranscodingContainer=mp4&TranscodingProtocol=hls&AudioCodec=aac&api_key=' +
                        store_server_user_model.authorization_of_Je + '&StartTimeTicks=0&EnableRedirection=true&EnableRemoteMedia=false&EnableAudioVbrEncoding=true';
                    const newsong = {
                        absoluteIndex: index + 1 + last_index,
                        favorite: song.UserData.IsFavorite,
                        rating: 0,
                        duration_txt: store_player_audio_logic.formatTime_RunTimeTicks(song.RunTimeTicks),
                        id: song.Id,
                        title: song.Name,
                        path: blobUrl,
                        artist: song.Artists.length > 0 ? song.Artists[0] : '',
                        album: song.Album,
                        artist_id: song.ArtistItems.length > 0 ? song.ArtistItems[0].Id : '',
                        album_id: song.AlbumId,
                        album_artist: '',
                        has_cover_art: 0,
                        track_number: 0,
                        disc_number: 0,
                        year: song.ProductionYear,
                        size: '',
                        suffix: '',
                        duration: song.RunTimeTicks,
                        bit_rate: '',
                        genre: '',
                        compilation: 0,
                        created_at: song.PremiereDate,
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
                        order_title: song.PlaylistItemId,
                        mbz_release_track_id: '',
                        rg_album_gain: 0,
                        rg_album_peak: 0,
                        rg_track_gain: 0,
                        rg_track_peak: 0,
                        medium_image_url: medium_image_url
                    };
                    if (store_general_fetch_media_list._load_model === 'search') {
                        store_view_media_page_info.media_File_metadata.push(song);
                        store_view_media_page_info.media_Files_temporary.push(newsong);
                    } else {
                        store_playlist_list_info.playlist_MediaFiles_temporary.push({
                            ...newsong,
                            play_id: newsong.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
                        });
                    }
                }));
                if (store_general_fetch_media_list._load_model === 'play') {
                    store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds =
                        store_view_media_page_info.media_Files_temporary.map(item => item.id);
                    store_app_configs_logic_save.save_system_playlist_item_id_config();
                }
            }
        }
    }

    public async get_media_list(
        playlist_id: string,
        userId: string, parentId: string, searchTerm: string,
        sortBy: string, sortOrder: string,
        limit: string, startIndex: string,
        includeItemTypes: string,
        fields: string, enableImageTypes: string, recursive: string, imageTypeLimit: string,
        years: string, filters: string
    ){
        if(store_server_user_model.authorization_of_Je != undefined &&
            store_server_user_model.authorization_of_Je.length > 0) {
            let songlist = []
            if (playlist_id === '') { // find_model
                const list = await this.items_ApiService_of_Je.getItems_List(
                    userId, parentId, searchTerm,
                    sortBy, sortOrder,
                    limit, startIndex,
                    includeItemTypes,
                    fields, enableImageTypes, recursive, imageTypeLimit,
                    years, filters
                )
                if (list != undefined) {
                    songlist = list.Items;
                    store_general_fetch_player_list._totalCount = list.TotalRecordCount
                }
            } else {
                const response_playlMedias = await axios(
                    store_server_users.server_config_of_current_user_of_sqlite?.url + '/Playlists/' +
                    playlist_id + '/Items?Fields=PrimaryImageAspectRatio&EnableImageTypes=Primary%2CBackdrop%2CBanner%2CThumb&UserId=' +
                    store_server_user_model.userid_of_Je + '&api_key=' +
                    store_server_user_model.authorization_of_Je
                );
                if (response_playlMedias != undefined) {
                    songlist = Array.isArray(response_playlMedias.data.Items)
                        ? response_playlMedias.data.Items
                        : [];
                    if (store_view_media_page_info.media_Files_temporary.length > 0 && songlist.length > 0) {
                        if (store_view_media_page_info.media_Files_temporary[0].id === songlist[0].Id) {
                            songlist = []
                        }
                    }
                    ///
                    if (Array.isArray(songlist) && songlist.length > 0) {
                        if (store_general_fetch_media_list._load_model === 'search') {
                            const existingSong = store_view_media_page_info.media_Files_temporary.find(item => item.id === songlist[0].id);
                            if (existingSong) {
                                console.error("警告，获取的Media项存在重复，服务端的查询业务存在问题")
                            }
                        } else {
                            const existingSong = store_playlist_list_info.playlist_MediaFiles_temporary.find(item => item.id === songlist[0].id);
                            if (existingSong) {
                                console.error("警告，获取的Media项存在重复，服务端的查询业务存在问题")
                            }
                        }
                    }else{
                        return;
                    }
                    ///
                    store_general_fetch_player_list._totalCount = response_playlMedias.data.TotalRecordCount
                }
            }
            if (Array.isArray(songlist) && songlist.length > 0) {
                if (sortBy === 'DatePlayed') {
                    songlist = songlist.filter(song => song.UserData.PlayCount > 0)
                }
                let last_index = store_general_fetch_media_list._load_model === 'search' ?
                    store_view_media_page_info.media_Files_temporary.length :
                    store_playlist_list_info.playlist_MediaFiles_temporary.length
                store_view_media_page_info.media_File_metadata = [];
                await Promise.all(songlist.map(async (song: any, index: number) => {
                    const medium_image_url =
                        song.Id != undefined ? (
                            store_server_users.server_select_kind === 'jellyfin'
                            ?
                            store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                            song.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                            :
                            store_server_users.server_config_of_current_user_of_sqlite?.url + '/emby/Items/' +
                            (song.ImageTags?.Primary ? song.Id : song.ParentBackdropItemId) +
                            (song.ImageTags?.Primary ? '/Images/Primary?fillWidth=122&fillHeight=122&tag=' : '/Images/Backdrop?fillWidth=122&fillHeight=122&tag=') +
                            (song.ImageTags?.Primary ?? song.ParentBackdropImageTags?.[0] ?? 'default') +
                            '&api_key=' + store_server_user_model.authorization_of_Je
                        ) : undefined
                    const blobUrl =
                        store_server_users.server_config_of_current_user_of_sqlite?.url + '/Audio/' +
                        song.Id + '/universal?UserId=' +
                        store_server_user_model.userid_of_Je + '&MaxStreamingBitrate=1145761093&Container=opus%2Cwebm%7Copus%2Cts%7Cmp3%2Cmp3%2Caac%2Cm4a%7Caac%2Cm4b%7Caac%2Cflac%2Cwebma%2Cwebm%7Cwebma%2Cwav%2Cogg&TranscodingContainer=mp4&TranscodingProtocol=hls&AudioCodec=aac&api_key=' +
                        store_server_user_model.authorization_of_Je + '&StartTimeTicks=0&EnableRedirection=true&EnableRemoteMedia=false&EnableAudioVbrEncoding=true';
                    const newsong = {
                        absoluteIndex: index + 1 + last_index,
                        favorite: song.UserData.IsFavorite,
                        rating: 0,
                        duration_txt: store_player_audio_logic.formatTime_RunTimeTicks(song.RunTimeTicks),
                        id: song.Id,
                        title: song.Name,
                        path: blobUrl,
                        artist: song.Artists.length > 0 ? song.Artists[0] : '',
                        album: song.Album,
                        artist_id: song.ArtistItems.length > 0 ? song.ArtistItems[0].Id : '',
                        album_id: song.AlbumId,
                        album_artist: '',
                        has_cover_art: 0,
                        track_number: 0,
                        disc_number: 0,
                        year: song.ProductionYear,
                        size: '',
                        suffix: '',
                        duration: song.RunTimeTicks,
                        bit_rate: '',
                        genre: '',
                        compilation: 0,
                        created_at: song.PremiereDate,
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
                        order_title: song.PlaylistItemId,
                        mbz_release_track_id: '',
                        rg_album_gain: 0,
                        rg_album_peak: 0,
                        rg_track_gain: 0,
                        rg_track_peak: 0,
                        medium_image_url: medium_image_url
                    };
                    if (store_general_fetch_media_list._load_model === 'search') {
                        store_view_media_page_info.media_File_metadata.push(song);
                        store_view_media_page_info.media_Files_temporary.push(newsong);
                    } else {
                        store_playlist_list_info.playlist_MediaFiles_temporary.push({
                            ...newsong,
                            play_id: newsong.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
                        });
                    }
                }));
                if (store_general_fetch_media_list._load_model === 'play') {
                    store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds =
                        store_view_media_page_info.media_Files_temporary.map(item => item.id);
                    store_app_configs_logic_save.save_system_playlist_item_id_config();
                }
            }
        }
    }
    public async get_album_list(
        userId: string, parentId: string, searchTerm: string,
        sortBy: string, sortOrder: string,
        limit: string, startIndex: string,
        includeItemTypes: string,
        fields: string, enableImageTypes: string, recursive: string, imageTypeLimit: string,
        years: string, filters: string
    ){
        if(store_server_user_model.authorization_of_Je != undefined &&
            store_server_user_model.authorization_of_Je.length > 0) {
            let albumlist = []
            const list = await this.items_ApiService_of_Je.getItems_List(
                userId, parentId, searchTerm,
                sortBy, sortOrder,
                limit, startIndex,
                includeItemTypes,
                fields, enableImageTypes, recursive, imageTypeLimit,
                years, filters
            )
            if (list != undefined) {
                albumlist = list.Items;
                store_view_album_page_info.album_item_count = list.TotalRecordCount
            }
            if (Array.isArray(albumlist) && albumlist.length > 0) {
                if (sortBy === 'DatePlayed') {
                    albumlist = albumlist.filter(album => album.UserData.PlayCount > 0)
                }
                let last_index = store_view_album_page_info.album_Files_temporary.length
                store_view_album_page_info.album_File_metadata = []
                albumlist.map(async (album: any, index: number) => {
                    const medium_image_url =
                        album.Id != undefined ? (
                            store_server_users.server_select_kind === 'jellyfin'
                            ?
                            store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                            album.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                            :
                            store_server_users.server_config_of_current_user_of_sqlite?.url + '/emby/Items/' +
                            (album.PrimaryImageItemId ? album.PrimaryImageItemId : album.ParentBackdropItemId) +
                            (album.PrimaryImageItemId ? '/Images/Primary?fillWidth=122&fillHeight=122&tag=' : '/Images/Backdrop?fillWidth=122&fillHeight=122&tag=') +
                            (album.PrimaryImageTag ?? album.ParentBackdropImageTags?.[0] ?? 'default') +
                            '&api_key=' + store_server_user_model.authorization_of_Je
                        ) : undefined
                    store_view_album_page_info.album_File_metadata.push(album)
                    store_view_album_page_info.album_Files_temporary.push({
                        absoluteIndex: index + 1 + last_index,
                        favorite: album.UserData.IsFavorite,
                        rating: 0,
                        id: album.Id,
                        name: album.Name,
                        artist_id: album.ArtistItems.length > 0 ? album.ArtistItems[0].Id : '',
                        embed_art_path: '',
                        artist: album.Artists.length > 0 ? album.Artists[0] : '',
                        album_artist: '',
                        min_year: album.ProductionYear,
                        max_year: album.ProductionYear,
                        compilation: 0,
                        song_count: '',
                        duration: album.RunTimeTicks,
                        genre: '',
                        created_at: album.PremiereDate,
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
                        medium_image_url: medium_image_url,
                        large_image_url: '',
                        external_url: '',
                        external_info_updated_at: ''
                    })
                })
            }
        }
    }
    public async get_album_list_find_artist_id(
        userId: string, albumArtistIds: string,
        sortBy: string, sortOrder: string,
        limit: string, startIndex: string,
        includeItemTypes: string,
        fields: string, recursive: string,
        collapseBoxSetItems: string
    ){
        if(store_server_user_model.authorization_of_Je != undefined &&
            store_server_user_model.authorization_of_Je.length > 0) {
            let albumlist = []
            let list = await this.items_ApiService_of_Je.getItems_List_Find_Artist_ALL_Album(
                userId, albumArtistIds,
                sortBy, sortOrder,
                limit, startIndex,
                includeItemTypes,
                fields, recursive,
                collapseBoxSetItems
            )
            if (list != undefined) {
                albumlist = list.Items;
                store_view_album_page_info.album_item_count = list.TotalRecordCount
            }
            if (Array.isArray(albumlist) && albumlist.length > 0) {
                if (sortBy === 'DatePlayed') {
                    albumlist = albumlist.filter(album => album.UserData.PlayCount > 0)
                }
                let last_index = store_view_album_page_info.album_Files_temporary.length
                store_view_album_page_info.album_File_metadata = []
                albumlist.map(async (album: any, index: number) => {
                    const medium_image_url =
                        album.Id != undefined ? (
                            store_server_users.server_select_kind === 'jellyfin'
                                ?
                                store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                                album.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                                :
                                store_server_users.server_config_of_current_user_of_sqlite?.url + '/emby/Items/' +
                                (album.PrimaryImageItemId ? album.PrimaryImageItemId : album.ParentBackdropItemId) +
                                (album.PrimaryImageItemId ? '/Images/Primary?fillWidth=122&fillHeight=122&tag=' : '/Images/Backdrop?fillWidth=122&fillHeight=122&tag=') +
                                (album.PrimaryImageTag ?? album.ParentBackdropImageTags?.[0] ?? 'default') +
                                '&api_key=' + store_server_user_model.authorization_of_Je
                        ) : undefined
                    store_view_album_page_info.album_File_metadata.push(album)
                    store_view_album_page_info.album_Files_temporary.push({
                        absoluteIndex: index + 1 + last_index,
                        favorite: album.UserData.IsFavorite,
                        rating: 0,
                        id: album.Id,
                        name: album.Name,
                        artist_id: album.ArtistItems.length > 0 ? album.ArtistItems[0].Id : '',
                        embed_art_path: '',
                        artist: album.Artists.length > 0 ? album.Artists[0] : '',
                        album_artist: '',
                        min_year: album.ProductionYear,
                        max_year: album.ProductionYear,
                        compilation: 0,
                        song_count: '',
                        duration: album.RunTimeTicks,
                        genre: '',
                        created_at: album.PremiereDate,
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
                        medium_image_url: medium_image_url,
                        large_image_url: '',
                        external_url: '',
                        external_info_updated_at: ''
                    })
                })
            }
        }
    }
    public async get_artist_list(
        userId: string, parentId: string, searchTerm: string,
        sortBy: string, sortOrder: string,
        limit: string, startIndex: string,
        includeItemTypes: string,
        fields: string, enableImageTypes: string, recursive: string, imageTypeLimit: string,
        years: string, filters: string
    ){
        if(store_server_user_model.authorization_of_Je != undefined &&
            store_server_user_model.authorization_of_Je.length > 0) {
        let artistlist = []
        const list = await this.artists_ApiService_of_Je.getAlbumArtists_ALL(
            userId, parentId, searchTerm,
            sortBy, sortOrder,
            limit, startIndex,
            includeItemTypes,
            fields, enableImageTypes, recursive, imageTypeLimit,
            years, filters
        )
        if(list != undefined) {
            artistlist = list.Items;
            store_view_artist_page_info.artist_item_count = list.TotalRecordCount
        }
        if (Array.isArray(artistlist) && artistlist.length > 0) {
            if(sortBy === 'DatePlayed'){
                artistlist = artistlist.filter(artist => artist.UserData.PlayCount > 0)
            }
            let last_index = store_view_artist_page_info.artist_Files_temporary.length
            store_view_artist_page_info.artist_File_metadata = [];
            artistlist.map(async (artist: any, index: number) => {
                const medium_image_url =
                    artist.Id != undefined ? (
                        store_server_users.server_select_kind === 'jellyfin'
                        ?
                        store_server_users.server_config_of_current_user_of_sqlite?.url + '/Items/' +
                        artist.Id + '/Images/Primary?api_key=' + store_server_user_model.authorization_of_Je
                        :
                        store_server_users.server_config_of_current_user_of_sqlite?.url + '/emby/Items/' +
                        (artist.ImageTags?.Primary ? artist.Id : artist.ParentBackdropItemId) +
                        (artist.ImageTags?.Primary ? '/Images/Primary?fillWidth=122&fillHeight=122&tag=' : '/Images/Backdrop?fillWidth=122&fillHeight=122&tag=') +
                        (artist.ImageTags?.Primary ?? artist.ParentBackdropImageTags?.[0] ?? 'default') +
                        '&api_key=' + store_server_user_model.authorization_of_Je
                    ) : undefined
                store_view_artist_page_info.artist_File_metadata.push(artist)
                store_view_artist_page_info.artist_Files_temporary.push({
                    absoluteIndex: index + 1 + last_index,
                    favorite: artist.UserData.IsFavorite,
                    rating: 0,
                    id: artist.Id,
                    name: artist.Name,
                    album_count: '',
                    full_text: '',
                    order_artist_name: '',
                    sort_artist_name: '',
                    song_count: '',
                    size: 0,
                    mbz_artist_id: '',
                    biography: '',
                    small_image_url: '',
                    medium_image_url: medium_image_url,
                    large_image_url: '',
                    similar_artists: '',
                    external_url: '',
                    external_info_updated_at: '',
                })
            })
        }
        }
    }

    /// file count
    public async get_count_of_media_file(){
        try{
            const list_audio = await this.items_ApiService_of_Je.getItems_List(
                store_server_user_model.userid_of_Je, store_server_user_model.parentid_of_Je_Music, '',
                'SortName', 'Descending',
                '1', '0',
                'Audio',
                'PrimaryImageAspectRatio', 'Primary,Backdrop,Thumb', 'true', '1',
                '', ''
            )
            store_view_media_page_info.media_starred_count = list_audio.TotalRecordCount
            store_view_media_page_info.media_item_count = list_audio.TotalRecordCount
        }catch{}
    }
    public async get_count_of_artist_album(){
        try{
            //
            const list_album = await this.items_ApiService_of_Je.getItems_List(
                store_server_user_model.userid_of_Je, store_server_user_model.parentid_of_Je_Music, '',
                'SortName', 'Descending',
                '1', '0',
                'MusicAlbum',
                'PrimaryImageAspectRatio', 'Primary,Backdrop,Thumb', 'true', '1',
                '', ''
            )
            store_view_album_page_info.album_item_count = list_album.TotalRecordCount
            //
            const list_artist = await this.artists_ApiService_of_Je.getArtists_List_Quick(
                store_server_user_model.userid_of_Je, store_server_user_model.parentid_of_Je_Music,
                'Artist', 'true'
            )
            store_view_artist_page_info.artist_item_count = list_artist.TotalRecordCount
        }catch{}
    }
    /// starred count
    public async get_count_of_starred(){
        try{
            const list_audio = await this.items_ApiService_of_Je.getItems_List(
                store_server_user_model.userid_of_Je, store_server_user_model.parentid_of_Je_Music, '',
                'SortName', 'Descending',
                '1', '0',
                'Audio',
                'PrimaryImageAspectRatio', 'Primary,Backdrop,Thumb', 'true', '1',
                '', 'IsFavorite'
            )
            store_view_media_page_info.media_starred_count = list_audio.TotalRecordCount
            //
            const list_album = await this.items_ApiService_of_Je.getItems_List(
                store_server_user_model.userid_of_Je, store_server_user_model.parentid_of_Je_Music, '',
                'SortName', 'Descending',
                '1', '0',
                'MusicAlbum',
                'PrimaryImageAspectRatio', 'Primary,Backdrop,Thumb', 'true', '1',
                '', 'IsFavorite'
            )
            store_view_album_page_info.album_starred_count = list_album.TotalRecordCount
            //
            const list_artist = await this.artists_ApiService_of_Je.getArtists_List_Quick_Filters(
                store_server_user_model.userid_of_Je, store_server_user_model.parentid_of_Je_Music,
                'IsFavorite'
            )
            store_view_artist_page_info.artist_starred_count = list_artist.TotalRecordCount
        }catch{}
    }
    /// playlist count
    public async get_count_of_playlist(){
        try{
            const response = await axios(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/Users/' +
                store_server_user_model.userid_of_Je + '/Items?IncludeItemTypes=Playlist&Recursive=true&api_key=' +
                store_server_user_model.authorization_of_Je
            );
            store_view_media_page_info.media_playlist_count = response.data.TotalRecordCount
        }catch{}
    }

    public async get_playlist_je(){
        let playlists = []
        const response_playlists = await axios(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/Users/' +
            store_server_user_model.userid_of_Je + '/Items?IncludeItemTypes=Playlist&Recursive=true&api_key=' +
            store_server_user_model.authorization_of_Je
        );
        if(response_playlists != undefined) {
            playlists = response_playlists.data.Items;
            store_playlist_list_info.playlist_names_ALLLists = [];
            store_playlist_list_info.playlist_tracks_temporary_of_ALLLists = [];
        }
        if (playlists != null) {
            for (const playlist of playlists) {
                let playlist_tracks = []
                const response_playlMedias = await axios(
                    store_server_users.server_config_of_current_user_of_sqlite?.url + '/Playlists/' +
                    playlist.Id + '/Items?Fields=PrimaryImageAspectRatio&EnableImageTypes=Primary%2CBackdrop%2CBanner%2CThumb&UserId=' +
                    store_server_user_model.userid_of_Je + '&api_key=' +
                    store_server_user_model.authorization_of_Je
                );
                const playlMedias = Array.isArray(response_playlMedias.data.Items)
                    ? response_playlMedias.data.Items
                    : [];
                for (const song of playlMedias) {
                    const sqlite_song = {
                        id: playlist.Id,
                        playlist_id: playlist.Id,
                        media_file_id: song.Id
                    };
                    playlist_tracks.push(sqlite_song);
                }
                store_playlist_list_info.playlist_names_ALLLists.push({
                    label: playlist.Name,
                    value: playlist.Id
                })
                store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.push({
                    playlist: {
                        label: playlist.Name,
                        value: playlist.Id,
                        id: playlist.Id,
                        name: playlist.Name,
                        comment: '',
                        duration: playlist.RunTimeTicks || 0,
                        song_count: playlist.ChildCount || 0,
                        public: 0,
                        created_at: '',
                        updated_at: '',
                        path: '',
                        sync: 0,
                        size: 0,
                        rules: null,
                        evaluated_at: '',
                        owner_id: store_server_user_model.username,
                    },
                    playlist_tracks: playlist_tracks
                });
                const isDuplicate = store_view_media_page_logic.page_songlists.some(
                    (item: Play_List) => item.id === playlist.Id
                );
                if (!isDuplicate) {
                    const temp_playlist: Play_List = {
                        label: playlist.Name,
                        value: playlist.Id,
                        id: playlist.Id,
                        name: playlist.Name,
                        comment: '',
                        duration: playlist.RunTimeTicks,
                        song_count: playlist.ChildCount + ' *',
                        public: '',
                        created_at: '',
                        updated_at: '',
                        path: '',
                        sync: '',
                        size: '',
                        rules: '',
                        evaluated_at: '',
                        owner_id: store_server_user_model.userid_of_Je,
                    };
                    store_view_media_page_logic.page_songlists_options.push(temp_playlist);
                    store_view_media_page_logic.page_songlists.push(temp_playlist);
                }
            }
        }
    }

    /// recently count
    public async get_count_of_recently_media(){
        store_view_media_page_info.media_recently_count = 0
    }
    public async get_count_of_recently_album(){
        store_view_album_page_info.album_recently_count = 0
    }
    public async get_count_of_recently_artist(){
        store_view_artist_page_info.artist_recently_count = 0
    }
}