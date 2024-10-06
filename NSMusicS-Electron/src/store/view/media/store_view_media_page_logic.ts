import {reactive, watch} from 'vue'
import {
    Set_PlaylistInfo_To_LocalSqlite
} from "@/features/sqlite3_local_configs/class_Set_PlaylistInfo_To_LocalSqlite";
import {store_playlist_list_logic} from "@/store/view/playlist/store_playlist_list_logic";
import {
    Set_AnnotationInfo_To_LocalSqlite
} from "@/features/sqlite3_local_configs/class_Set_AnnotationInfo_To_LocalSqlite";
import {
    Set_LibraryInfo_To_LocalSqlite
} from "@/features/sqlite3_local_configs/class_Set_LibraryInfo_To_LocalSqlite";
import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
import {store_router_history_data_of_media} from "@/store/router/store_router_history_data_of_media";
import {store_view_media_page_fetchData} from "@/store/view/media/store_view_media_page_fetchData";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
import {store_router_data_info} from "@/store/router/store_router_data_info";
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {
    store_local_data_set_annotionInfo
} from "@/store/local/local_data_synchronization/store_local_data_set_annotionInfo";
import {
    store_local_data_set_playlistInfo
} from "@/store/local/local_data_synchronization/store_local_data_set_playlistInfo";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {
    store_server_data_set_playlistInfo
} from "@/store/server/server_data_synchronization/store_server_data_set_playlistInfo";
import {
    store_server_data_set_mediaInfo
} from "@/store/server/server_data_synchronization/store_server_data_set_mediaInfo";
import {store_player_appearance} from "@/store/player/store_player_appearance";
import {store_router_data_logic} from "@/store/router/store_router_data_logic";

export const store_view_media_page_logic = reactive({
    list_data_StartUpdate: false,
    list_data_Hand_Search: false,
    list_options_Hand_Sort: false,
    list_selected_Hand_click: false,

    page_songlists_options: [],
    page_songlists_statistic: [],
    page_songlists: [],
    page_songlists_selected: 'song_list_all',
    page_songlists_keyword_reset: false,
    page_songlists_keyword: '',
    page_songlists_keywordFilter: '',
    page_songlists_get_keyword_model_num: 0,
    page_songlists_options_Sort_key: [],

    page_songlists_filter_year: 0,

    page_songlists_bool_show_search_area: false,
    page_songlists_input_search_Value: '',

    get_duration_formatTime(currentTime: number): string {
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);

        let formattedMinutes = String(minutes);
        let formattedSeconds = String(seconds);

        if (formattedMinutes.length == 1)
            formattedMinutes = '0' + formattedMinutes;

        if (formattedSeconds.length == 1)
            formattedSeconds = '0' + formattedSeconds;

        return `${formattedMinutes}:${formattedSeconds}`;
    },

    set_media_Files_selected(value: Media_File) {
        if (value.selected) {
            store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
                if (item.id === value.id) {
                    store_view_media_page_info.media_Files_temporary[index].selected = true;
                }
            });
            store_view_media_page_info.media_Files_selected.push(value)
            console.log('media_Files_selected：'+value.path+'  '+value.selected)
        } else {
            store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
                if (item.id === value.id) {
                    store_view_media_page_info.media_Files_temporary[index].selected = false;
                }
            });
            store_view_media_page_info.media_Files_selected = store_view_media_page_info.media_Files_selected.filter((item: any) => item.id !== value.id);
            console.log('media_Files_selected：'+value.path+'  '+value.selected)
        }
    },
    set_media_Files_selected_all(value: boolean) {
        store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
            store_view_media_page_info.media_Files_temporary[index].selected = value;
        });
        if (value) {
            store_view_media_page_info.media_Files_selected = store_view_media_page_info.media_Files_temporary.slice();
        } else {
            store_view_media_page_info.media_Files_selected = [];
        }
        console.log('media_Files_selected：'+value)
    },

    async get_selected_playlist_add_MediaFile(value: any) {
        console.log('selected_playlist_addMediaFile', value)
        store_local_data_set_playlistInfo.Set_Selected_MediaInfo_Add_Selected_Playlist(
            store_view_media_page_info.media_Files_selected.map((file: any) => file.id),
            value
        )
        store_playlist_list_logic.get_playlist_tracks_temporary_update_media_file(true)

        if (store_server_user_model.model_select === 'server') {
            await store_server_data_set_playlistInfo.Set_Selected_MediaInfo_Add_Selected_Playlist(
                store_view_media_page_info.media_Files_selected.map((file: any) => file.id),
                value
            )
        }
    },
    async get_selected_playlist_delete_MediaFile(value: any) {
        console.log('selected_playlist_deleteMediaFile', value)
        store_local_data_set_playlistInfo.Set_Selected_MediaInfo_Delete_Selected_Playlist(
            store_view_media_page_info.media_Files_selected.map((file: any) => file.id),
            value
        )
        store_playlist_list_logic.get_playlist_tracks_temporary_update_media_file(true)

        if (store_server_user_model.model_select === 'server') {
            await store_server_data_set_playlistInfo.Set_Selected_MediaInfo_Delete_Selected_Playlist(
                store_view_media_page_info.media_Files_selected.map((file: any) => file.id),
                value
            )
        }
    },

    get_selected_lovelist_add_MediaFile(value: any){
        console.log('selected_lovelist_addMediaFile',value)
        store_local_data_set_annotionInfo.Set_MediaInfo_Add_Selected_Favorite(
            store_view_media_page_info.media_Files_selected.map((file: any) => file.id),
            true
        )
        store_playlist_list_logic.get_playlist_tracks_temporary_update_media_file(true)

        if (store_server_user_model.model_select === 'server') {
            store_view_media_page_info.media_Files_selected.forEach((media: any) => {
                store_server_data_set_mediaInfo.Set_MediaInfo_To_Favorite(media.id, false);
            })
        }
    },
    get_selected_lovelist_delete_MediaFile(value: any){
        console.log('selected_lovelist_deleteMediaFile',value)
        store_local_data_set_annotionInfo.Set_MediaInfo_Delete_Selected_Favorite(
            store_view_media_page_info.media_Files_selected.map((file: any) => file.id),
            value
        )
        store_playlist_list_logic.get_playlist_tracks_temporary_update_media_file(true)

        if (store_server_user_model.model_select === 'server') {
            store_view_media_page_info.media_Files_selected.forEach((media: any) => {
                store_server_data_set_mediaInfo.Set_MediaInfo_To_Favorite(media.id, true);
            })
        }
    },

    get_selected_locallist_delete_MediaFile(value: any){
        console.log('selected_locallist_deleteMediaFile',value)
        let set_LibraryInfo_To_LocalSqlite = new Set_LibraryInfo_To_LocalSqlite();
        set_LibraryInfo_To_LocalSqlite.Set_LibraryInfo_Delete_Selected_Playlist(
            store_view_media_page_info.media_Files_selected.map((file: any) => file.id)
        )
        store_playlist_list_logic.get_playlist_tracks_temporary_update_media_file(true)
    },
    get_selected_recentlist_deletet_MediaFile(value: any){
        console.log('selected_recentlist_deletetMediaFile',value)
        store_local_data_set_annotionInfo.Set_MediaInfo_To_Selected_PlayCount_of_Delete(
            store_view_media_page_info.media_Files_selected.map((file: any) => file.id),
            value
        )
        store_playlist_list_logic.get_playlist_tracks_temporary_update_media_file(true)
    },

    async get_page_songlists_keyword(newValue: any){
        this.page_songlists_keyword = newValue
        if (newValue.indexOf('accurate_search') > 0) {
            newValue = newValue.replace('accurate_search', '');
            if (newValue.indexOf('__title__') > 0) {
                newValue = newValue.replace('__title__', '');
                store_view_media_page_logic.page_songlists_keywordFilter = `WHERE title LIKE '${newValue}'`
            } else if (newValue.indexOf('__artist__') > 0) {
                newValue = newValue.replace('__artist__', '');
                    store_view_media_page_logic.page_songlists_keywordFilter = `WHERE artist LIKE '${newValue}'`
            } else if (newValue.indexOf('__album__') > 0) {
                newValue = newValue.replace('__album__', '');
                store_view_media_page_logic.page_songlists_keywordFilter = `WHERE album_id = '${newValue}'`
            }
        }else{
            store_view_media_page_logic.page_songlists_keywordFilter = newValue.length > 0 ?
                `WHERE title LIKE '%${newValue}%' OR artist LIKE '%${newValue}%' OR album LIKE '%${newValue}%'` :
                '';
        }
        store_view_media_page_logic.page_songlists_keyword_reset = true;
        console.log('page_songlists_keyword:' + newValue)

        store_router_data_info.router.push('View_Song_List_ALL')
        store_view_media_page_fetchData.fetchData_Media()
    },
    async get_page_songlists_selected(newValue: any){
        this.page_songlists_selected = newValue
        if(store_player_appearance.player_mode_of_medialist_from_external_import){
            store_player_appearance.player_mode_of_medialist_from_external_import = false
        }else {
            if (store_view_media_page_logic.list_selected_Hand_click) {
                store_view_media_page_logic.page_songlists_keywordFilter = ""
            }
            store_view_media_page_logic.list_selected_Hand_click = false
            console.log('page_songlists_selected：' + newValue)
            store_view_media_page_fetchData.fetchData_Media()
            store_app_configs_logic_save.save_system_config_of_Player_Configs_of_Audio_Info()
            store_app_configs_logic_save.save_system_config_of_View_Router_History()
        }
    }
});
watch(() => store_view_media_page_logic.page_songlists_options_Sort_key, async (newValue) => {
    if (newValue != null && store_view_media_page_logic.list_options_Hand_Sort) {
        store_view_media_page_logic.list_options_Hand_Sort = false
        store_router_history_data_of_media.fix_router_history_of_Media_scroller_value(store_router_history_data_of_media.router_history_model_of_Media_scroller_value) // 保留此滚轮值(上次浏览位置)
        store_view_media_page_fetchData.fetchData_Media()
    }
});
watch(() => store_view_media_page_logic.list_data_StartUpdate, async (newValue) => {
    if(newValue) {
        store_view_media_page_logic.page_songlists_keyword = '';
        if (store_view_media_page_logic.list_selected_Hand_click) {
            store_view_media_page_logic.page_songlists_keywordFilter = ""
        }
        store_router_data_info.find_music_model = false;
        store_view_media_page_fetchData.fetchData_Media()

        store_router_history_data_of_media.router_history_datas_of_Media = [];
        if(store_router_history_data_of_media.router_select_history_date_of_Media){
            store_router_history_data_of_media.router_select_history_date_of_Media.id = 1;
            store_router_history_data_of_media.router_history_datas_of_Media.push(store_router_history_data_of_media.router_select_history_date_of_Media);
        }

        store_view_media_page_logic.list_data_StartUpdate = false
        console.log("store_view_media_page_logic.list_data_StartUpdate")
    }
});
watch(() => store_view_media_page_logic.page_songlists_filter_year, async (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
    await store_view_media_page_fetchData.fetchData_Media()
});
