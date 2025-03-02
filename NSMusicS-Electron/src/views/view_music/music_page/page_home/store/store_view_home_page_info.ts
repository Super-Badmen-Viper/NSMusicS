import {reactive, watch} from 'vue'
import error_album from "@/assets/img/error_album.jpg";
import {store_view_home_page_fetchData} from "./store_view_home_page_fetchData";
import {store_view_media_page_logic} from "../../page_media/store/store_view_media_page_logic";
import {store_view_home_page_logic} from "./store_view_home_page_logic";

export const store_view_home_page_info = reactive({
    home_Files_temporary_maximum_playback: [],
    home_Files_temporary_random_search: [],
    home_Files_temporary_recently_added: [],
    home_Files_temporary_recently_played: [],

    home_selected_top_album_subscript: 0,
    home_selected_top_album: null,
    home_selected_top_album_medium_image_url: error_album
});
watch(() => store_view_home_page_info.home_selected_top_album, (newValue) => {
    if(newValue && newValue.medium_image_url) {
        store_view_home_page_info.home_selected_top_album_medium_image_url = newValue.medium_image_url;
    }else{
        store_view_home_page_info.home_selected_top_album_medium_image_url = error_album;
    }
});
