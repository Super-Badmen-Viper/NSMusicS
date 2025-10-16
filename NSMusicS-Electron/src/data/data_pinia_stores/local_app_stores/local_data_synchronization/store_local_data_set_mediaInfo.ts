import { defineStore } from 'pinia'
import { Set_LocalSqlite_MediaInfo } from '@/data/data_repository/app_repository/LocalSqlite_Set_MediaInfo'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
import { useServerDataSetMediaInfoStore } from '@/data/data_pinia_stores/server_api_stores/server_api_core/annotation/store_server_data_set_mediaInfo'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { useServerDataSetMediaCueInfoStore } from '@/data/data_pinia_stores/server_api_stores/server_api_core/annotation/store_server_data_set_media_cueInfo'
import { usePlayerAudioLogicStore } from '@/views/view_app/page/page_player/store/store_player_audio_logic'

export const useLocalDataSetMediaInfoStore = defineStore('localDataSetMediaInfo', () => {
  // 获取其他store的引用
  const serverUserModelStore = useServerUserModelStore()
  const serverDataSetMediaInfoStore = useServerDataSetMediaInfoStore()
  const serverUsersStore = useServerUsersStore()
  const serverDataSetMediaCueInfoStore = useServerDataSetMediaCueInfoStore()
  const playerAudioLogicStore = usePlayerAudioLogicStore()

  // 方法定义
  function Set_MediaInfo_To_Favorite(id: string, value: boolean) {
    const set_MediaInfo_To_LocalSqlite = new Set_LocalSqlite_MediaInfo()
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_Favorite_Local(id, value)
    if (serverUserModelStore.model_select === 'server') {
      serverDataSetMediaInfoStore.Set_MediaInfo_To_Favorite_Server(id, value)
    }
  }

  function Set_MediaInfo_To_Rating(id: any, value: number) {
    const set_MediaInfo_To_LocalSqlite = new Set_LocalSqlite_MediaInfo()
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_Rating_Local(id, value)
    if (serverUserModelStore.model_select === 'server') {
      serverDataSetMediaInfoStore.Set_MediaInfo_To_Rating_Server(id, value)
    }
  }

  function Set_MediaInfo_To_PlayCount_of_Media_File(item_id: any) {
    const set_MediaInfo_To_LocalSqlite = new Set_LocalSqlite_MediaInfo()
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_PlayCount_of_Media_File_Local(item_id)
    if (serverUserModelStore.model_select === 'server') {
      if (
        serverUsersStore.server_select_kind === 'ninesong' &&
        playerAudioLogicStore.player_model_cue
      ) {
        serverDataSetMediaCueInfoStore.Set_MediaInfo_To_PlayCount_of_Media_File_Server(item_id)
      } else {
        serverDataSetMediaInfoStore.Set_MediaInfo_To_PlayCount_of_Media_File_Server(item_id)
      }
    }
  }

  function Set_MediaInfo_Add_Selected_Playlist(media_file_id: any, playlist_id: any) {
    const set_MediaInfo_To_LocalSqlite = new Set_LocalSqlite_MediaInfo()
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_Add_Selected_Playlist_Local(
      media_file_id,
      playlist_id
    )
    if (serverUserModelStore.model_select === 'server') {
      serverDataSetMediaInfoStore.Set_MediaInfo_Add_Selected_Playlist_Server(
        media_file_id,
        playlist_id
      )
    }
  }

  function Set_MediaInfo_Delete_Selected_Playlist(media_file_id: any, playlist_id: any) {
    const set_MediaInfo_To_LocalSqlite = new Set_LocalSqlite_MediaInfo()
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_Delete_Selected_Playlist_Local(
      media_file_id,
      playlist_id
    )
    if (serverUserModelStore.model_select === 'server') {
      serverDataSetMediaInfoStore.Set_MediaInfo_Delete_Selected_Playlist_Server(
        media_file_id,
        playlist_id
      )
    }
  }

  return {
    // 方法暴露
    Set_MediaInfo_To_Favorite,
    Set_MediaInfo_To_Rating,
    Set_MediaInfo_To_PlayCount_of_Media_File,
    Set_MediaInfo_Add_Selected_Playlist,
    Set_MediaInfo_Delete_Selected_Playlist
  }
})