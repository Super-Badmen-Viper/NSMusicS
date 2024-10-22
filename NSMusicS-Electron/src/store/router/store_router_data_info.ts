import {reactive, watch} from 'vue'
import {store_view_home_page_fetchData} from "@/store/view/home/store_view_home_page_fetchData";
import {store_view_media_page_fetchData} from "@/store/view/media/store_view_media_page_fetchData";
import {store_view_album_page_fetchData} from "@/store/view/album/store_view_album_page_fetchData";
import {store_view_artist_page_fetchData} from "@/store/view/artist/store_view_artist_page_fetchData";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {
    store_server_data_set_playlistInfo
} from "@/store/server/server_data_synchronization/store_server_data_set_playlistInfo";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
import {store_playlist_appearance} from "@/store/view/playlist/store_playlist_appearance";
import {store_router_history_data_of_album} from "@/store/router/store_router_history_data_of_album";

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
});
watch(() => store_router_data_info.router_select, async (newValue) => {
    if(!store_playlist_appearance.playlist_show) {
        if (newValue === 'View_Home_MusicLibrary_Browse') {
            store_router_data_info.router_select_model_home = true
            store_view_home_page_fetchData.fetchData_Home()
        } else if (newValue === 'View_Song_List_ALL') {
            store_router_data_info.router_select_model_media = true
            await store_view_media_page_fetchData.fetchData_Media()
            /// Synchronize API data
            if (store_server_user_model.model_select === 'server') {
                // get server all playlist
                await store_server_user_model.Get_UserData_Synchronize_PlayList()
            }
        } else if (newValue === 'View_Album_List_ALL') {
            store_router_data_info.router_select_model_album = true
            store_view_album_page_fetchData.fetchData_Album()
        } else if (newValue === 'View_Artist_List_ALL') {
            store_router_data_info.router_select_model_artist = true
            store_view_artist_page_fetchData.fetchData_Artist()
        }
    }
});
watch(() => store_router_data_info.router_name, async (newValue) => {
    store_app_configs_info.app_left_menu_select_activeKey = newValue
});

