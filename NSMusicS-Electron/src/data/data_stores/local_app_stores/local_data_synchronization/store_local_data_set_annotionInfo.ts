import { reactive } from 'vue'
import { Set_AnnotationInfo_To_LocalSqlite } from '@/data/data_repository/app_repository/class_Set_AnnotationInfo_To_LocalSqlite'
import { store_server_data_set_annotionInfo } from '@/data/data_stores/server_api_stores/server_api_core/annotation/store_server_data_set_annotionInfo'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
const set_AnnotationInfo_To_LocalSqlite = new Set_AnnotationInfo_To_LocalSqlite()
export const store_local_data_set_annotionInfo = reactive({
  Set_MediaInfo_Add_Selected_Favorite(ids: string[], value: boolean) {
    set_AnnotationInfo_To_LocalSqlite.Set_MediaInfo_Add_Selected_Favorite_Local(ids, value)
    if (store_server_user_model.model_select === 'server') {
      store_server_data_set_annotionInfo.Set_MediaInfo_Add_Selected_Favorite_Server(ids, value)
    }
  },
  Set_MediaInfo_Delete_Selected_Favorite(ids: string[], value: boolean) {
    set_AnnotationInfo_To_LocalSqlite.Set_MediaInfo_Delete_Selected_Favorite_Local(ids, value)
    if (store_server_user_model.model_select === 'server') {
      store_server_data_set_annotionInfo.Set_MediaInfo_Delete_Selected_Favorite_Server(ids, value)
    }
  },
  Set_MediaInfo_To_Selected_PlayCount_of_Delete(ids: string[], value: boolean) {
    set_AnnotationInfo_To_LocalSqlite.Set_MediaInfo_To_Selected_PlayCount_of_Delete_Local(
      ids,
      value
    )
  },
})
