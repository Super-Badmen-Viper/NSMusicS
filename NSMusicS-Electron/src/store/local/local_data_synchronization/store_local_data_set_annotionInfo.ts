import {reactive} from 'vue'
import {Set_AnnotationInfo_To_LocalSqlite} from "@/features/sqlite3_local_configs/class_Set_AnnotationInfo_To_LocalSqlite";
import {
    store_server_data_set_annotionInfo
} from "@/store/server/server_data_synchronization/store_server_data_set_annotionInfo";
import {store_server_user_model} from "@/store/server/store_server_user_model";
const set_AnnotationInfo_To_LocalSqlite = new Set_AnnotationInfo_To_LocalSqlite()
export const store_local_data_set_annotionInfo = reactive({
    Set_MediaInfo_Add_Selected_Favorite(ids: string[], value: Boolean) {
        set_AnnotationInfo_To_LocalSqlite.Set_MediaInfo_Add_Selected_Favorite(ids, value)
        if(store_server_user_model.model_select === 'server') {
            store_server_data_set_annotionInfo.Set_MediaInfo_Add_Selected_Favorite(ids, value)
        }
    },
    Set_MediaInfo_Delete_Selected_Favorite(ids: string[], value: Boolean) {
        set_AnnotationInfo_To_LocalSqlite.Set_MediaInfo_Delete_Selected_Favorite(ids, value)
        if(store_server_user_model.model_select === 'server') {
            store_server_data_set_annotionInfo.Set_MediaInfo_Delete_Selected_Favorite(ids, value)
        }
    },
    Set_MediaInfo_To_Selected_PlayCount_of_Delete(ids: string[], value: Boolean) {
        set_AnnotationInfo_To_LocalSqlite.Set_MediaInfo_To_Selected_PlayCount_of_Delete(ids, value)
    }
});