import {reactive, watch} from 'vue'
import {store_view_home_page_fetchData} from "@/store/view/home/store_view_home_page_fetchData";
import {store_view_media_page_fetchData} from "@/store/view/media/store_view_media_page_fetchData";
import {store_view_album_page_fetchData} from "@/store/view/album/store_view_album_page_fetchData";
import {store_view_artist_page_fetchData} from "@/store/view/artist/store_view_artist_page_fetchData";

export const store_router_data_info = reactive({
    router: null,
    router_name: '',
    router_select: '',

    MEMORY_THRESHOLD: 240 * 1024 * 1024,
    
    find_music_model: false,
    find_album_model: false,
    find_artist_model: false,

    router_select_model_menu: false,
    router_select_model_home: false,
    router_select_model_updateing: false,
    router_select_model_media: false,
    router_select_model_album: false,
    router_select_model_artist: false,
});
watch(() => store_router_data_info.router_select, (newValue) => {
    if(newValue === 'View_Home_MusicLibrary_Browse'){
        store_router_data_info.router_select_model_home = true
        store_view_home_page_fetchData.fetchData_Home()
    }else if(newValue === 'View_Song_List_ALL'){
        store_router_data_info.router_select_model_media = true
        store_view_media_page_fetchData.fetchData_Media()
    }else if(newValue === 'View_Album_List_ALL'){
        store_router_data_info.router_select_model_album = true
        store_view_album_page_fetchData.fetchData_Album()
    }else if(newValue === 'View_Artist_List_ALL'){
        store_router_data_info.router_select_model_artist = true
        store_view_artist_page_fetchData.fetchData_Artist()
    }
});