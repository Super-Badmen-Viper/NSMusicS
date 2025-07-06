import {reactive, watch} from 'vue'
import {store_general_fetch_home_list} from "@/data/data_stores/server/server_api_abstract/music_scene/page/page_home/store_general_fetch_home_list";
import {store_general_fetch_media_list} from "@/data/data_stores/server/server_api_abstract/music_scene/page/page_media_file/store_general_fetch_media_list";
import {store_general_fetch_album_list} from "@/data/data_stores/server/server_api_abstract/music_scene/page/page_album/store_general_fetch_album_list";
import {store_general_fetch_artist_list} from "@/data/data_stores/server/server_api_abstract/music_scene/page/page_artist/store_general_fetch_artist_list";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {store_app_configs_info} from "@/data/data_stores/app/store_app_configs_info";
import {store_playlist_appearance} from "@/views/view_app/music_components/player_list/store/store_playlist_appearance";
import {
    store_general_model_player_list
} from "@/data/data_stores/server/server_api_abstract/music_scene/components/player_list/store_general_model_player_list";
import {
    store_general_fetch_media_cue_list
} from "../../data/data_stores/server/server_api_abstract/music_scene/page/page_media_cue_file/store_general_fetch_media_cue_list";

export const store_router_data_info = reactive({
    router: null,
    router_name: '',
    router_select: '',
    router_click: false,

    MEMORY_THRESHOLD: 360 * 1024 * 1024,
    
    find_music_model: false,
    find_album_model: false,
    find_artist_model: false,

    store_router_history_data_of_local: true,
    store_router_history_data_of_web: false,

    router_select_model_menu: false,
    router_select_model_home: false,
    router_select_model_categories: false,
    router_select_model_charts: false,
    router_select_model_tag: false,
    router_select_model_media_cue: false,
    router_select_model_update: false,
    router_select_model_media: false,
    router_select_model_album: false,
    router_select_model_artist: false,
    router_select_model_genre: false,
    router_select_model_server_login: false,
    router_select_model_server_setting: false,
    router_select_model_server_library: false
});
watch(() => store_router_data_info.router_select, async (newValue) => {
    if(!store_playlist_appearance.playlist_show) {
        if (newValue === 'home') {
            store_router_data_info.router_select_model_home = true
            store_general_fetch_home_list.fetchData_Home()
        } else if (newValue === 'categories') {
            store_router_data_info.router_select_model_categories = true
            store_general_fetch_home_list.fetchData_Home()
        } else if (newValue === 'charts') {
            store_router_data_info.router_select_model_charts = true
            store_general_fetch_home_list.fetchData_Home()
        } else if (newValue === 'tag') {
            store_router_data_info.router_select_model_tag = true
            store_general_fetch_home_list.fetchData_Home()
        } else if (newValue === 'media_cue') {
            store_router_data_info.router_select_model_media_cue = true
            await store_general_fetch_media_cue_list.fetchData_Media();
        } else if (newValue === 'song') {
            store_router_data_info.router_select_model_media = true
            await store_general_fetch_media_list.fetchData_Media()
            /// Synchronize API data
            if (store_server_user_model.model_select === 'server') {
                // get server all playlist
                await store_general_model_player_list.get_playlists_info()
            }
        } else if (newValue === 'album') {
            store_router_data_info.router_select_model_album = true
            store_general_fetch_album_list.fetchData_Album()
        } else if (newValue === 'artist') {
            store_router_data_info.router_select_model_artist = true
            store_general_fetch_artist_list.fetchData_Artist()
        }
    }
});
watch(() => store_router_data_info.router_name, async (newValue) => {
    store_app_configs_info.app_view_left_menu_select_activeKey = newValue
});

