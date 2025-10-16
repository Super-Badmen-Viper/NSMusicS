import { defineStore } from 'pinia'
import { Set_LocalSqlite_AnnotationInfo } from '@/data/data_repository/app_repository/LocalSqlite_Set_AnnotationInfo'
import { useServerDataSetAnnotionInfoStore } from '@/data/data_pinia_stores/server_api_stores/server_api_core/annotation/store_server_data_set_annotionInfo'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
const set_LocalSqlite_AnnotationInfo = new Set_LocalSqlite_AnnotationInfo()

export const useLocalDataSetAnnotionInfoStore = defineStore('localDataSetAnnotionInfo', () => {
  // 获取其他store的引用
  const serverDataSetAnnotionInfoStore = useServerDataSetAnnotionInfoStore()
  const serverUserModelStore = useServerUserModelStore()

  // 方法定义
  function Set_MediaInfo_Add_Selected_Favorite(ids: string[], value: boolean) {
    set_LocalSqlite_AnnotationInfo.Set_MediaInfo_Add_Selected_Favorite_Local(ids, value)
    if (serverUserModelStore.model_select === 'server') {
      serverDataSetAnnotionInfoStore.Set_MediaInfo_Add_Selected_Favorite_Server(ids, value)
    }
  }

  function Set_MediaInfo_Delete_Selected_Favorite(ids: string[], value: boolean) {
    set_LocalSqlite_AnnotationInfo.Set_MediaInfo_Delete_Selected_Favorite_Local(ids, value)
    if (serverUserModelStore.model_select === 'server') {
      serverDataSetAnnotionInfoStore.Set_MediaInfo_Delete_Selected_Favorite_Server(ids, value)
    }
  }

  function Set_MediaInfo_To_Selected_PlayCount_of_Delete(ids: string[], value: boolean) {
    set_LocalSqlite_AnnotationInfo.Set_MediaInfo_To_Selected_PlayCount_of_Delete_Local(ids, value)
  }

  return {
    // 方法暴露
    Set_MediaInfo_Add_Selected_Favorite,
    Set_MediaInfo_Delete_Selected_Favorite,
    Set_MediaInfo_To_Selected_PlayCount_of_Delete
  }
})