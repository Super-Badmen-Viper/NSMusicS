import {reactive} from 'vue'
import {Set_AlbumInfo_To_LocalSqlite} from "@/features/sqlite3_local_configs/class_Set_AlbumInfo_To_LocalSqlite";
import {
    store_server_data_set_albumInfo
} from "@/store/server/server_data_synchronization/store_server_data_set_albumInfo";
import {store_server_user_model} from "@/store/server/store_server_user_model";
const set_AlbumInfo_To_LocalSqlite = new Set_AlbumInfo_To_LocalSqlite()
export const store_local_data_set_albumInfo = reactive({
    Set_AlbumInfo_To_Favorite(id: string, value: Boolean) {
        set_AlbumInfo_To_LocalSqlite.Set_AlbumInfo_To_Favorite(id, value)
        if(store_server_user_model.model_select === 'server') {
            store_server_data_set_albumInfo.Set_AlbumInfo_To_Favorite(id, value)
        }
    },
    Set_AlbumInfo_To_Rating(id: any, value: number) {
        set_AlbumInfo_To_LocalSqlite.Set_AlbumInfo_To_Rating(id, value)
        if(store_server_user_model.model_select === 'server') {
            store_server_data_set_albumInfo.Set_AlbumInfo_To_Rating(id, value)
        }
    },
    Set_AlbumInfo_To_PlayCount_of_Album(item_id: any) {
        set_AlbumInfo_To_LocalSqlite.Set_AlbumInfo_To_PlayCount_of_Album(item_id)
        if(store_server_user_model.model_select === 'server') {
            store_server_data_set_albumInfo.Set_AlbumInfo_To_PlayCount_of_Album(item_id)
        }
    }
});