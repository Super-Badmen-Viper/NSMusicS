import {reactive} from 'vue'
import {Set_ArtistInfo_To_LocalSqlite} from "@/features/sqlite3_local_configs/class_Set_ArtistInfo_To_LocalSqlite";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {
    store_server_data_set_artistInfo
} from "@/store/server/server_data_synchronization/store_server_data_set_artistInfo";
const set_ArtistInfo_To_LocalSqlite = new Set_ArtistInfo_To_LocalSqlite()
export const store_local_data_set_artistInfo = reactive({
    Set_ArtistInfo_To_Favorite(id: string, value: Boolean) {
        set_ArtistInfo_To_LocalSqlite.Set_ArtistInfo_To_Favorite(id, value)
        if(store_server_user_model.model_select === 'server') {
            store_server_data_set_artistInfo.Set_ArtistInfo_To_Favorite(id, value)
        }
    },
    Set_ArtistInfo_To_Rating(id: any, value: number) {
        set_ArtistInfo_To_LocalSqlite.Set_ArtistInfo_To_Rating(id, value)
        if(store_server_user_model.model_select === 'server') {
            store_server_data_set_artistInfo.Set_ArtistInfo_To_Rating(id, value)
        }
    },
    Set_ArtistInfo_To_PlayCount_of_Artist(item_id: any) {
        set_ArtistInfo_To_LocalSqlite.Set_ArtistInfo_To_PlayCount_of_Artist(item_id)
        if(store_server_user_model.model_select === 'server') {
            store_server_data_set_artistInfo.Set_ArtistInfo_To_PlayCount_of_Artist(item_id)
        }
    }
});