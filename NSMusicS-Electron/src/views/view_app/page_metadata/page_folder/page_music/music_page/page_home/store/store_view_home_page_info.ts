import {reactive, watch} from 'vue'
import error_album from "@/assets/img/error_album.jpg";

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
