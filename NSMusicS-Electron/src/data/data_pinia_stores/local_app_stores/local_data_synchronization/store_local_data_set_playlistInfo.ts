import { defineStore } from 'pinia'
import { Set_LocalSqlite_PlaylistInfo } from '@/data/data_repository/app_repository/LocalSqlite_Set_PlaylistInfo'
const set_PlaylistInfo_To_LocalSqlite = new Set_LocalSqlite_PlaylistInfo()

export const useLocalDataSetPlaylistInfoStore = defineStore('localDataSetPlaylistInfo', () => {
  // 方法定义
  function Set_PlaylistInfo_To_Update_CreatePlaylist(
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
  }

  function Set_PlaylistInfo_To_Update_SetPlaylist(
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
  }

  function Set_PlaylistInfo_To_Update_DeletePlaylist(id: string) {
    set_PlaylistInfo_To_LocalSqlite.Set_PlaylistInfo_To_Update_DeletePlaylist_Local(id)
  }

  function Set_Selected_MediaInfo_Add_Selected_Playlist(ids: string[], playlist_id: string) {
    set_PlaylistInfo_To_LocalSqlite.Set_Selected_MediaInfo_Add_Selected_Playlist_Local(
      ids,
      playlist_id
    )
  }

  function Set_Selected_MediaInfo_Delete_Selected_Playlist(ids: string[], playlist_id: string) {
    set_PlaylistInfo_To_LocalSqlite.Set_Selected_MediaInfo_Delete_Selected_Playlist_Local(
      ids,
      playlist_id
    )
  }

  return {
    // 方法暴露
    Set_PlaylistInfo_To_Update_CreatePlaylist,
    Set_PlaylistInfo_To_Update_SetPlaylist,
    Set_PlaylistInfo_To_Update_DeletePlaylist,
    Set_Selected_MediaInfo_Add_Selected_Playlist,
    Set_Selected_MediaInfo_Delete_Selected_Playlist
  }
})