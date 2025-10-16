import { defineStore } from 'pinia'
import { Set_LocalSqlite_AlbumInfo } from '@/data/data_repository/app_repository/LocalSqlite_Set_AlbumInfo'
import { useServerDataSetAlbumInfoStore } from '@/data/data_pinia_stores/server_api_stores/server_api_core/annotation/store_server_data_set_albumInfo'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
const set_AlbumInfo_To_LocalSqlite = new Set_LocalSqlite_AlbumInfo()

export const useLocalDataSetAlbumInfoStore = defineStore('localDataSetAlbumInfo', () => {
  // 获取其他store的引用
  const serverDataSetAlbumInfoStore = useServerDataSetAlbumInfoStore()
  const serverUserModelStore = useServerUserModelStore()

  // 方法定义
  function Set_AlbumInfo_To_Favorite(id: string, value: boolean) {
    set_AlbumInfo_To_LocalSqlite.Set_AlbumInfo_To_Favorite_Local(id, value)
    if (serverUserModelStore.model_select === 'server') {
      serverDataSetAlbumInfoStore.Set_AlbumInfo_To_Favorite_Server(id, value)
    }
  }

  function Set_AlbumInfo_To_Rating(id: any, value: number) {
    set_AlbumInfo_To_LocalSqlite.Set_AlbumInfo_To_Rating_Local(id, value)
    if (serverUserModelStore.model_select === 'server') {
      serverDataSetAlbumInfoStore.Set_AlbumInfo_To_Rating_Server(id, value)
    }
  }

  function Set_AlbumInfo_To_PlayCount_of_Album(item_id: any) {
    set_AlbumInfo_To_LocalSqlite.Set_AlbumInfo_To_PlayCount_of_Album_Local(item_id)
    if (serverUserModelStore.model_select === 'server') {
      serverDataSetAlbumInfoStore.Set_AlbumInfo_To_PlayCount_of_Album_Server(item_id)
    }
  }

  return {
    // 方法暴露
    Set_AlbumInfo_To_Favorite,
    Set_AlbumInfo_To_Rating,
    Set_AlbumInfo_To_PlayCount_of_Album
  }
})