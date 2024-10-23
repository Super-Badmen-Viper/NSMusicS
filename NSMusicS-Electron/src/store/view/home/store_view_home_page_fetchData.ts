import { reactive } from 'vue'
import {store_view_home_page_info} from "@/store/view/home/store_view_home_page_info";
import {
    Get_HomeDataInfos_From_LocalSqlite
} from "@/features/sqlite3_local_configs/class_Get_HomeDataInfos_From_LocalSqlite";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {
    Get_Navidrome_Temp_Data_To_LocalSqlite
} from "@/features/servers_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite";
import {store_server_users} from "@/store/server/store_server_users";

export const store_view_home_page_fetchData = reactive({
    async fetchData_Home(){
        store_view_home_page_info.home_Files_temporary_maximum_playback = []
        store_view_home_page_info.home_Files_temporary_random_search = []
        store_view_home_page_info.home_Files_temporary_recently_added = []
        store_view_home_page_info.home_Files_temporary_recently_played = []
        store_view_home_page_info.home_selected_top_album = undefined;
        if(store_server_user_model.model_server_type_of_local) {
            let get_HomeDataInfos_From_LocalSqlite = new Get_HomeDataInfos_From_LocalSqlite()
            store_view_home_page_info.home_Files_temporary_maximum_playback = get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Maximum_Playback()
            store_view_home_page_info.home_Files_temporary_random_search = get_HomeDataInfos_From_LocalSqlite.Get_AlbumFiles_Random_Search()
            store_view_home_page_info.home_Files_temporary_recently_added = get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Recently_Added()
            store_view_home_page_info.home_Files_temporary_recently_played = get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Recently_Played()
        }else if(store_server_user_model.model_server_type_of_web){
            let get_Navidrome_Temp_Data_To_LocalSqlite = new Get_Navidrome_Temp_Data_To_LocalSqlite()
            await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                store_server_users.server_config_of_current_user_of_sqlite?.user_name,
                store_server_user_model.token,
                store_server_user_model.salt,
            )
        }
        store_view_home_page_info.home_selected_top_album =
            (store_view_home_page_info.home_Files_temporary_random_search
                && store_view_home_page_info.home_Files_temporary_random_search.length > 0)
                ? store_view_home_page_info.home_Files_temporary_random_search[0] : undefined;
    },
});