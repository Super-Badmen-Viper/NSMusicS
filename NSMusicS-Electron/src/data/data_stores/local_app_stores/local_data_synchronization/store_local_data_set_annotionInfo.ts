import { reactive } from 'vue'
import { Set_LocalSqlite_AnnotationInfo } from '@/data/data_repository/app_repository/LocalSqlite_Set_AnnotationInfo'
import { store_server_data_set_annotionInfo } from '@/server/server_api_store/server_api_core/annotation/store_server_data_set_annotionInfo'
import { store_server_user_model } from '@/server/server_management/store_server_user_model'
const set_LocalSqlite_AnnotationInfo = new Set_LocalSqlite_AnnotationInfo()
export const store_local_data_set_annotionInfo = reactive({
  Set_MediaInfo_Add_Selected_Favorite(ids: string[], value: boolean) {
    set_LocalSqlite_AnnotationInfo.Set_MediaInfo_Add_Selected_Favorite_Local(ids, value)
    if (store_server_user_model.model_select === 'server') {
      store_server_data_set_annotionInfo.Set_MediaInfo_Add_Selected_Favorite_Server(ids, value)
    }
  },
  Set_MediaInfo_Delete_Selected_Favorite(ids: string[], value: boolean) {
    set_LocalSqlite_AnnotationInfo.Set_MediaInfo_Delete_Selected_Favorite_Local(ids, value)
    if (store_server_user_model.model_select === 'server') {
      store_server_data_set_annotionInfo.Set_MediaInfo_Delete_Selected_Favorite_Server(ids, value)
    }
  },
  Set_MediaInfo_To_Selected_PlayCount_of_Delete(ids: string[], value: boolean) {
    set_LocalSqlite_AnnotationInfo.Set_MediaInfo_To_Selected_PlayCount_of_Delete_Local(ids, value)
  },
})
