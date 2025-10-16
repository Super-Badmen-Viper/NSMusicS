import { defineStore } from 'pinia'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
import { Playlists_ApiService_of_ND } from '@/data/data_configs/navidrome_api/services_normal/playlists/index_service'
import { Playlists_ApiService_of_Je } from '@/data/data_configs/jellyfin_api/services_web/Playlists/index_service'
import { Items_ApiService_of_Je } from '@/data/data_configs/jellyfin_api/services_web/Items/index_service'
import { Playlist_ApiService_of_NineSong } from '@/data/data_configs/ninesong_api/services_web/Scene/Music/Playlist/index_service'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'

export const useServerDataSetPlaylistInfoStore = defineStore('serverDataSetPlaylistInfo', () => {
  // 获取其他store
  const serverUsersStore = useServerUsersStore()
  const serverUserModelStore = useServerUserModelStore()

  /**
   * 创建播放列表
   */
  async function Set_PlaylistInfo_To_Update_CreatePlaylist_Server(name: string, _public_: boolean) {
    if (
      serverUserModelStore.model_server_type_of_local ||
      (serverUsersStore.server_select_kind === 'navidrome' &&
        serverUserModelStore.model_server_type_of_web)
    ) {
      const getCreatePlaylist_set_id = await new Playlists_ApiService_of_ND(
        serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest'
      ).createPlaylist_set(
        serverUserModelStore.username,
        serverUserModelStore.token,
        serverUserModelStore.salt,
        name
      )
      try {
        return getCreatePlaylist_set_id['subsonic-response']['playlist']['id']
      } catch {
        return ''
      }
    } else if (serverUserModelStore.model_server_type_of_web) {
      if (
        serverUsersStore.server_select_kind === 'jellyfin' ||
        serverUsersStore.server_select_kind === 'emby'
      ) {
        return await new Playlists_ApiService_of_Je(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url
        ).postPlaylists_Create(name, '', 'Audio', serverUserModelStore.userid_of_Je)
      } else if (serverUsersStore.server_select_kind === 'ninesong') {
        const getCreatePlaylist_set_id = await new Playlist_ApiService_of_NineSong(
          store_server_login_info.server_url
        ).createPlaylist(name, '')
        try {
          return getCreatePlaylist_set_id['ninesong-response']['playlist']['ID']
        } catch {
          return ''
        }
      }
    }
  }

  /**
   * 更新播放列表信息
   */
  async function Set_PlaylistInfo_To_Update_SetPlaylist(
    item_id: string,
    name: string,
    comment: string,
    _public_: boolean
  ) {
    if (
      serverUserModelStore.model_server_type_of_local ||
      (serverUsersStore.server_select_kind === 'navidrome' &&
        serverUserModelStore.model_server_type_of_web)
    ) {
      await new Playlists_ApiService_of_ND(
        serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest'
      ).updatePlaylist_infoUpdate(
        serverUserModelStore.username,
        serverUserModelStore.token,
        serverUserModelStore.salt,
        item_id,
        name,
        comment,
        String(_public_)
      )
    } else if (
      serverUserModelStore.model_server_type_of_web &&
      serverUsersStore.server_select_kind === 'ninesong'
    ) {
      await new Playlist_ApiService_of_NineSong(
        store_server_login_info.server_url
      ).updatePlaylist_Id(item_id, name, comment)
    }
  }

  /**
   * 删除播放列表
   */
  async function Set_PlaylistInfo_To_Update_DeletePlaylist(item_id: string) {
    if (
      serverUserModelStore.model_server_type_of_local ||
      (serverUsersStore.server_select_kind === 'navidrome' &&
        serverUserModelStore.model_server_type_of_web)
    ) {
      return await new Playlists_ApiService_of_ND(
        serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest'
      ).deletePlaylist_set(
        serverUserModelStore.username,
        serverUserModelStore.token,
        serverUserModelStore.salt,
        item_id
      )
    } else if (serverUserModelStore.model_server_type_of_web) {
      if (
        serverUsersStore.server_select_kind === 'jellyfin' ||
        serverUsersStore.server_select_kind === 'emby'
      ) {
        return await new Items_ApiService_of_Je(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url
        ).delItems_List_Quick(item_id)
      } else if (serverUsersStore.server_select_kind === 'ninesong') {
        return await new Playlist_ApiService_of_NineSong(
          store_server_login_info.server_url
        ).deletePlaylist_Id(item_id)
      }
    }
  }

  /**
   * 批量添加媒体文件到播放列表
   */
  async function Set_Selected_MediaInfo_Add_Selected_Playlist(ids: string[], playlist_id: string) {
    if (
      serverUserModelStore.model_server_type_of_local ||
      (serverUsersStore.server_select_kind === 'navidrome' &&
        serverUserModelStore.model_server_type_of_web)
    ) {
      for (const id of ids) {
        await new Playlists_ApiService_of_ND(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest'
        ).updatePlaylist_songIdToAdd(
          serverUserModelStore.username,
          serverUserModelStore.token,
          serverUserModelStore.salt,
          playlist_id,
          id
        )
      }
    } else if (serverUserModelStore.model_server_type_of_web) {
      if (
        serverUsersStore.server_select_kind === 'jellyfin' ||
        serverUsersStore.server_select_kind === 'emby'
      ) {
        await new Playlists_ApiService_of_Je(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url
        ).postPlaylists_Add(playlist_id, ids.join(','), serverUserModelStore.userid_of_Je)
      } else if (serverUsersStore.server_select_kind === 'ninesong') {
        await new Playlist_ApiService_of_NineSong(
          store_server_login_info.server_url
        ).addMediaFiles_Playlist(playlist_id, ids.join(','))
      }
    }
  }

  /**
   * 批量从播放列表中删除媒体文件
   */
  async function Set_Selected_MediaInfo_Delete_Selected_Playlist(ids: string[], playlist_id: string) {
    if (
      serverUserModelStore.model_server_type_of_local ||
      (serverUsersStore.server_select_kind === 'navidrome' &&
        serverUserModelStore.model_server_type_of_web)
    ) {
      const indexs = await Set_PlaylistInfo_To_Update_GetPlaylist_MediaIndex(playlist_id, ids)
      for (let i = 0; i < indexs.length; i++) {
        const index = indexs[i]
        await new Playlists_ApiService_of_ND(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest'
        ).updatePlaylist_songIndexToRemove(
          serverUserModelStore.username,
          serverUserModelStore.token,
          serverUserModelStore.salt,
          playlist_id,
          index
        )
        /// navidrome delete logic bug, Delete based on song number, but cannot support simultaneous deletion of multiple numbers
        for (let j = i + 1; j < indexs.length; j++) {
          indexs[j] -= 1
        }
      }
    } else if (serverUserModelStore.model_server_type_of_web) {
      if (
        serverUsersStore.server_select_kind === 'jellyfin' ||
        serverUsersStore.server_select_kind === 'emby'
      ) {
        await new Playlists_ApiService_of_Je(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url
        ).delPlaylists_Remove(playlist_id, ids.join(','))
      } else if (serverUsersStore.server_select_kind === 'ninesong') {
        await new Playlist_ApiService_of_NineSong(
          store_server_login_info.server_url
        ).removeMediaFiles_Playlist(playlist_id, ids.join(','))
      }
    }
  }

  /**
   * 获取播放列表中媒体文件的索引
   */
  async function Set_PlaylistInfo_To_Update_GetPlaylist_MediaIndex(playlist_id: string, ids: string[]) {
    if (
      serverUserModelStore.model_server_type_of_local ||
      (serverUsersStore.server_select_kind === 'navidrome' &&
        serverUserModelStore.model_server_type_of_web)
    ) {
      const getPlaylist_id = await new Playlists_ApiService_of_ND(
        serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest'
      ).getPlaylist_id(
        serverUserModelStore.username,
        serverUserModelStore.token,
        serverUserModelStore.salt,
        playlist_id
      )
      try {
        const songlist = getPlaylist_id['subsonic-response']['playlist']['entry']
        const result = []
        for (const id of ids) {
          const index = songlist.findIndex((song: any) => song.id === id)
          if (index !== -1) {
            result.push(index)
          }
        }
        return result
      } catch {
        return []
      }
    } else if (
      serverUserModelStore.model_server_type_of_web &&
      serverUsersStore.server_select_kind === 'ninesong'
    ) {
      // Ninesong服务器暂不实现此功能
      return []
    }
  }

  // 暴露方法
  return {
    Set_PlaylistInfo_To_Update_CreatePlaylist_Server,
    Set_PlaylistInfo_To_Update_SetPlaylist,
    Set_PlaylistInfo_To_Update_DeletePlaylist,
    Set_Selected_MediaInfo_Add_Selected_Playlist,
    Set_Selected_MediaInfo_Delete_Selected_Playlist,
    Set_PlaylistInfo_To_Update_GetPlaylist_MediaIndex
  }
})