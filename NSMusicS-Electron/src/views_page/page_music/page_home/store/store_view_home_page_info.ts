import { reactive } from 'vue'

export const store_view_home_page_info = reactive({
    home_Files_temporary_maximum_playback: [],
    home_Files_temporary_random_search: [],
    home_Files_temporary_recently_added: [],
    home_Files_temporary_recently_played: [],

    home_selected_top_album_subscript: 0,
    home_selected_top_album: null,
});