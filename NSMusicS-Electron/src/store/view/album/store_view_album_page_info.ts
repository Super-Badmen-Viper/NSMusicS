import { reactive } from 'vue'

export const store_view_album_page_info = reactive({
    album_File_metadata: [],

    album_Files_temporary: [],

    album_page_sizes: 15,

    album_item_count: 0,
    album_starred_count: 0,
    album_recently_count: 0
});