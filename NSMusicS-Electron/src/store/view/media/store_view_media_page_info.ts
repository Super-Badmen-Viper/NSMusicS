import { reactive } from 'vue'

export const store_view_media_page_info = reactive({
    media_File_metadata: [],

    media_Files_temporary: [],
    media_Files_selected: [],

    media_page_sizes: 15,

    media_item_count: 0,
    media_starred_count: 0,
    media_recently_count: 0,
    media_playlist_count: 0,
});