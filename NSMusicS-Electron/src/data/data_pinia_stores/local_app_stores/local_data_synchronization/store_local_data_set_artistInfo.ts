import { defineStore } from 'pinia'
import { Set_LocalSqlite_ArtistInfo } from '@/data/data_repository/app_repository/LocalSqlite_Set_ArtistInfo'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
import { useServerDataSetArtistInfoStore } from '@/data/data_pinia_stores/server_api_stores/server_api_core/annotation/store_server_data_set_artistInfo'
const set_ArtistInfo_To_LocalSqlite = new Set_LocalSqlite_ArtistInfo()

export const useLocalDataSetArtistInfoStore = defineStore('localDataSetArtistInfo', () => {
  // 获取其他store的引用
  const serverUserModelStore = useServerUserModelStore()
  const serverDataSetArtistInfoStore = useServerDataSetArtistInfoStore()

  // 方法定义
  function Set_ArtistInfo_To_Favorite(id: string, value: boolean) {
    set_ArtistInfo_To_LocalSqlite.Set_ArtistInfo_To_Favorite_Local(id, value)
    if (serverUserModelStore.model_select === 'server') {
      serverDataSetArtistInfoStore.Set_ArtistInfo_To_Favorite_Server(id, value)
    }
  }

  function Set_ArtistInfo_To_Rating(id: any, value: number) {
    set_ArtistInfo_To_LocalSqlite.Set_ArtistInfo_To_Rating_Local(id, value)
    if (serverUserModelStore.model_select === 'server') {
      serverDataSetArtistInfoStore.Set_ArtistInfo_To_Rating_Server(id, value)
    }
  }

  function Set_ArtistInfo_To_PlayCount_of_Artist(item_id: any) {
    set_ArtistInfo_To_LocalSqlite.Set_ArtistInfo_To_PlayCount_of_Artist_Local(item_id)
    if (serverUserModelStore.model_select === 'server') {
      serverDataSetArtistInfoStore.Set_ArtistInfo_To_PlayCount_of_Artist_Server(item_id)
    }
  }

  return {
    // 方法暴露
    Set_ArtistInfo_To_Favorite,
    Set_ArtistInfo_To_Rating,
    Set_ArtistInfo_To_PlayCount_of_Artist
  }
})