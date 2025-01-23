import {reactive, watch} from 'vue'
import {store_view_home_page_fetchData} from "../../views/view_music/music_page/page_home/store/store_view_home_page_fetchData";
import {store_view_media_page_fetchData} from "../../views/view_music/music_page/page_media/store/store_view_media_page_fetchData";
import {store_view_album_page_fetchData} from "../../views/view_music/music_page/page_album/store/store_view_album_page_fetchData";
import {store_view_artist_page_fetchData} from "../../views/view_music/music_page/page_artist/store/store_view_artist_page_fetchData";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
import {store_playlist_appearance} from "../../views/view_music/music_components/player_list/store/store_playlist_appearance";

export const store_router_data_info = reactive({
    router: null,
    router_name: '',
    router_select: '',

    MEMORY_THRESHOLD: 360 * 1024 * 1024,
    
    find_music_model: false,
    find_album_model: false,
    find_artist_model: false,

    store_router_history_data_of_local: true,
    store_router_history_data_of_web: false,

    router_select_model_menu: false,
    router_select_model_home: false,
    router_select_model_updateing: false,
    router_select_model_media: false,
    router_select_model_album: false,
    router_select_model_artist: false,
    router_select_model_genre: false,
    router_select_model_server_setting: false,
    router_select_model_server_library: false
});
watch(() => store_router_data_info.router_select, async (newValue) => {
    if(!store_playlist_appearance.playlist_show) {
        if (newValue === 'home') {
            store_router_data_info.router_select_model_home = true
            store_view_home_page_fetchData.fetchData_Home()
        } else if (newValue === 'song') {
            store_router_data_info.router_select_model_media = true
            await store_view_media_page_fetchData.fetchData_Media()
            /// Synchronize API data
            if (store_server_user_model.model_select === 'server') {
                // get server all playlist
                await store_server_user_model.Get_UserData_Synchronize_PlayList()
            }
        } else if (newValue === 'album') {
            store_router_data_info.router_select_model_album = true
            store_view_album_page_fetchData.fetchData_Album()
        } else if (newValue === 'artist') {
            store_router_data_info.router_select_model_artist = true
            store_view_artist_page_fetchData.fetchData_Artist()
        }
    }
});
watch(() => store_router_data_info.router_name, async (newValue) => {
    store_app_configs_info.app_view_left_menu_select_activeKey = newValue
});

