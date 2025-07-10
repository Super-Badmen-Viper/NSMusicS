import { reactive } from 'vue'
import { Set_PlaylistInfo_To_LocalSqlite } from '@/data/data_access/local_configs/class_Set_PlaylistInfo_To_LocalSqlite'
const set_PlaylistInfo_To_LocalSqlite = new Set_PlaylistInfo_To_LocalSqlite()
export const store_local_data_set_playlistInfo = reactive({
  Set_PlaylistInfo_To_Update_CreatePlaylist(
    name: string,
    comment: string,
    duration: number,
    song_count: number,
    _public_: number,
    owner_id: string
  ) {
    return set_PlaylistInfo_To_LocalSqlite.Set_PlaylistInfo_To_Update_CreatePlaylist_Local(
      name,
      comment,
      duration,
      song_count,
      _public_,
      owner_id
    )
  },
  Set_PlaylistInfo_To_Update_SetPlaylist(
    id: string,
    name: string,
    comment: string,
    duration: number,
    song_count: number,
    _public_: number,
    owner_id: string
  ) {
    return set_PlaylistInfo_To_LocalSqlite.Set_PlaylistInfo_To_Update_SetPlaylist_Local(
      id,
      name,
      comment,
      duration,
      song_count,
      _public_,
      owner_id
    )
  },
  Set_PlaylistInfo_To_Update_DeletePlaylist(id: string) {
    set_PlaylistInfo_To_LocalSqlite.Set_PlaylistInfo_To_Update_DeletePlaylist_Local(id)
  },
  Set_Selected_MediaInfo_Add_Selected_Playlist(ids: string[], playlist_id: string) {
    set_PlaylistInfo_To_LocalSqlite.Set_Selected_MediaInfo_Add_Selected_Playlist_Local(
      ids,
      playlist_id
    )
  },
  Set_Selected_MediaInfo_Delete_Selected_Playlist(ids: string[], playlist_id: string) {
    set_PlaylistInfo_To_LocalSqlite.Set_Selected_MediaInfo_Delete_Selected_Playlist_Local(
      ids,
      playlist_id
    )
  },
})
