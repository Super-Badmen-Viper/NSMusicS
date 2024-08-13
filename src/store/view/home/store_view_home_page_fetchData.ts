import { reactive } from 'vue'
import {store_view_home_page_info} from "@/store/view/home/store_view_home_page_info";
import {
    Get_HomeDataInfos_From_LocalSqlite
} from "@/features/sqlite3_local_configs/class_Get_HomeDataInfos_From_LocalSqlite";

export const store_view_home_page_fetchData = reactive({
    fetchData_Home(){
        store_view_home_page_info.home_Files_temporary_maximum_playback = []
        store_view_home_page_info.home_Files_temporary_random_search = []
        store_view_home_page_info.home_Files_temporary_recently_added = []
        store_view_home_page_info.home_Files_temporary_recently_played = []
        store_view_home_page_info.home_selected_top_album = undefined;
        let get_HomeDataInfos_From_LocalSqlite = new Get_HomeDataInfos_From_LocalSqlite()
        store_view_home_page_info.home_Files_temporary_maximum_playback = get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Maximum_Playback()
        store_view_home_page_info.home_Files_temporary_random_search = get_HomeDataInfos_From_LocalSqlite.Get_AlbumFiles_Random_Search()
        store_view_home_page_info.home_Files_temporary_recently_added = get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Recently_Added()
        store_view_home_page_info.home_Files_temporary_recently_played = get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Recently_Played()
        store_view_home_page_info.home_selected_top_album =
            (store_view_home_page_info.home_Files_temporary_random_search
                && store_view_home_page_info.home_Files_temporary_random_search.length > 0)
                ? store_view_home_page_info.home_Files_temporary_random_search[0] : undefined;
    },
});