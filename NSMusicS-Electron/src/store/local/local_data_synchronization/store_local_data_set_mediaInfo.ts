import {reactive} from 'vue'
import {Set_MediaInfo_To_LocalSqlite} from "@/features/sqlite3_local_configs/class_Set_MediaInfo_To_LocalSqlite";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {
    store_server_data_set_artistInfo
} from "@/store/server/server_data_synchronization/store_server_data_set_artistInfo";
import {
    store_server_data_set_mediaInfo
} from "@/store/server/server_data_synchronization/store_server_data_set_mediaInfo";
export const store_local_data_set_mediaInfo = reactive({
    Set_MediaInfo_To_Favorite(id: string, value: Boolean){
        const set_MediaInfo_To_LocalSqlite = new Set_MediaInfo_To_LocalSqlite()
        set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_Favorite(id, value)
        if(store_server_user_model.model_select === 'server') {
            store_server_data_set_mediaInfo.Set_MediaInfo_To_Favorite(id, value)
        }
    },
    Set_MediaInfo_To_Rating(id: any, value: number){
        const set_MediaInfo_To_LocalSqlite = new Set_MediaInfo_To_LocalSqlite()
        set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_Rating(id, value)
        if(store_server_user_model.model_select === 'server') {
            store_server_data_set_mediaInfo.Set_MediaInfo_To_Rating(id, value)
        }
    },
    Set_MediaInfo_To_PlayCount_of_Media_File(item_id: any){
        const set_MediaInfo_To_LocalSqlite = new Set_MediaInfo_To_LocalSqlite()
        set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_PlayCount_of_Media_File(item_id)
        if(store_server_user_model.model_select === 'server') {
            store_server_data_set_mediaInfo.Set_MediaInfo_To_PlayCount_of_Media_File(item_id)
        }
    },
    Set_MediaInfo_Add_Selected_Playlist(media_file_id: any, playlist_id: any){
        const set_MediaInfo_To_LocalSqlite = new Set_MediaInfo_To_LocalSqlite()
        set_MediaInfo_To_LocalSqlite.Set_MediaInfo_Add_Selected_Playlist(media_file_id, playlist_id)
        if(store_server_user_model.model_select === 'server') {
            store_server_data_set_mediaInfo.Set_MediaInfo_Add_Selected_Playlist(media_file_id, playlist_id)
        }
    },
    Set_MediaInfo_Delete_Selected_Playlist(media_file_id: any, playlist_id: any){
        const set_MediaInfo_To_LocalSqlite = new Set_MediaInfo_To_LocalSqlite()
        set_MediaInfo_To_LocalSqlite.Set_MediaInfo_Delete_Selected_Playlist(media_file_id, playlist_id)
        if(store_server_user_model.model_select === 'server') {
            store_server_data_set_mediaInfo.Set_MediaInfo_Delete_Selected_Playlist(media_file_id, playlist_id)
        }
    }
});