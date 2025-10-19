import { reactive } from 'vue'
import { Set_LocalSqlite_MediaInfo } from '@/data/data_repository/app_repository/LocalSqlite_Set_MediaInfo'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { store_server_data_set_mediaInfo } from '@/data/data_stores/server_api_stores/server_api_core/annotation/store_server_data_set_mediaInfo'
import { store_server_users } from '../../server_configs_stores/store_server_users'
import { store_server_data_set_media_cueInfo } from '@/data/data_stores/server_api_stores/server_api_core/annotation/store_server_data_set_media_cueInfo'
import { usePlayerSettingStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerSettingStore'

export const store_local_data_set_mediaInfo = reactive({
  Set_MediaInfo_To_Favorite(id: string, value: boolean) {
    const set_MediaInfo_To_LocalSqlite = new Set_LocalSqlite_MediaInfo()
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_Favorite_Local(id, value)
    if (store_server_user_model.model_select === 'server') {
      store_server_data_set_mediaInfo.Set_MediaInfo_To_Favorite_Server(id, value)
    }
  },
  Set_MediaInfo_To_Rating(id: any, value: number) {
    const set_MediaInfo_To_LocalSqlite = new Set_LocalSqlite_MediaInfo()
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_Rating_Local(id, value)
    if (store_server_user_model.model_select === 'server') {
      store_server_data_set_mediaInfo.Set_MediaInfo_To_Rating_Server(id, value)
    }
  },
  Set_MediaInfo_To_PlayCount_of_Media_File(item_id: any) {
    const set_MediaInfo_To_LocalSqlite = new Set_LocalSqlite_MediaInfo()
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_PlayCount_of_Media_File_Local(item_id)
    if (store_server_user_model.model_select === 'server') {
      const playerSettingStore = usePlayerSettingStore()
      if (
        store_server_users.server_select_kind === 'ninesong' &&
        playerSettingStore.player_model_cue
      ) {
        store_server_data_set_media_cueInfo.Set_MediaInfo_To_PlayCount_of_Media_File_Server(item_id)
      } else {
        store_server_data_set_mediaInfo.Set_MediaInfo_To_PlayCount_of_Media_File_Server(item_id)
      }
    }
  },
  Set_MediaInfo_Add_Selected_Playlist(media_file_id: any, playlist_id: any) {
    const set_MediaInfo_To_LocalSqlite = new Set_LocalSqlite_MediaInfo()
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_Add_Selected_Playlist_Local(
      media_file_id,
      playlist_id
    )
    if (store_server_user_model.model_select === 'server') {
      store_server_data_set_mediaInfo.Set_MediaInfo_Add_Selected_Playlist_Server(
        media_file_id,
        playlist_id
      )
    }
  },
  Set_MediaInfo_Delete_Selected_Playlist(media_file_id: any, playlist_id: any) {
    const set_MediaInfo_To_LocalSqlite = new Set_LocalSqlite_MediaInfo()
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_Delete_Selected_Playlist_Local(
      media_file_id,
      playlist_id
    )
    if (store_server_user_model.model_select === 'server') {
      store_server_data_set_mediaInfo.Set_MediaInfo_Delete_Selected_Playlist_Server(
        media_file_id,
        playlist_id
      )
    }
  },
})
