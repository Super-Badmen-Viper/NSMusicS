import { reactive } from 'vue'
import { Set_MediaInfo_To_LocalSqlite } from '@/data/data_access/local_configs/class_Set_MediaInfo_To_LocalSqlite'
import { store_server_user_model } from '@/data/data_stores/server/store_server_user_model'
import { store_server_data_set_mediaInfo } from '@/data/data_stores/server/server_api_synchronization/store_server_data_set_mediaInfo'
export const store_local_data_set_mediaInfo = reactive({
  Set_MediaInfo_To_Favorite(id: string, value: boolean) {
    const set_MediaInfo_To_LocalSqlite = new Set_MediaInfo_To_LocalSqlite()
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_Favorite_Local(id, value)
    if (store_server_user_model.model_select === 'server') {
      store_server_data_set_mediaInfo.Set_MediaInfo_To_Favorite_Server(id, value)
    }
  },
  Set_MediaInfo_To_Rating(id: any, value: number) {
    const set_MediaInfo_To_LocalSqlite = new Set_MediaInfo_To_LocalSqlite()
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_Rating_Local(id, value)
    if (store_server_user_model.model_select === 'server') {
      store_server_data_set_mediaInfo.Set_MediaInfo_To_Rating_Server(id, value)
    }
  },
  Set_MediaInfo_To_PlayCount_of_Media_File(item_id: any) {
    const set_MediaInfo_To_LocalSqlite = new Set_MediaInfo_To_LocalSqlite()
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_PlayCount_of_Media_File_Local(item_id)
    if (store_server_user_model.model_select === 'server') {
      store_server_data_set_mediaInfo.Set_MediaInfo_To_PlayCount_of_Media_File_Server(item_id)
    }
  },
  Set_MediaInfo_Add_Selected_Playlist(media_file_id: any, playlist_id: any) {
    const set_MediaInfo_To_LocalSqlite = new Set_MediaInfo_To_LocalSqlite()
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
    const set_MediaInfo_To_LocalSqlite = new Set_MediaInfo_To_LocalSqlite()
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
