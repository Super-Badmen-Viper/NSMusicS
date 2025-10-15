import { reactive } from 'vue'
import { Playlists_ApiService_of_ND } from '@/data/servers_configs/navidrome_api/services_normal/playlists/index_service'
import { store_server_users } from '@/data/data_stores/server_stores/store_server_users'
import { store_server_user_model } from '@/data/data_stores/server_stores/store_server_user_model'
import { Playlists_ApiService_of_Je } from '@/data/servers_configs/jellyfin_api/services_web/Playlists/index_service'
import { Items_ApiService_of_Je } from '@/data/servers_configs/jellyfin_api/services_web/Items/index_service'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
import { Playlist_ApiService_of_NineSong } from '@/data/servers_configs/ninesong_api/services_web/Scene/Music/Playlist/index_service'

export const store_server_data_set_playlistInfo = reactive({
  async Set_PlaylistInfo_To_Update_CreatePlaylist_Server(name: string, _public_: boolean) {
    if (
      store_server_user_model.model_server_type_of_local ||
      (store_server_users.server_select_kind === 'navidrome' &&
        store_server_user_model.model_server_type_of_web)
    ) {
      const getCreatePlaylist_set_id = await new Playlists_ApiService_of_ND(
        store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest'
      ).createPlaylist_set(
        store_server_user_model.username,
        store_server_user_model.token,
        store_server_user_model.salt,
        name
      )
      try {
        return getCreatePlaylist_set_id['subsonic-response']['playlist']['id']
      } catch {
        return ''
      }
    } else if (store_server_user_model.model_server_type_of_web) {
      if (
        store_server_users.server_select_kind === 'jellyfin' ||
        store_server_users.server_select_kind === 'emby'
      ) {
        return await new Playlists_ApiService_of_Je(
          store_server_users.server_config_of_current_user_of_sqlite?.url
        ).postPlaylists_Create(name, '', 'Audio', store_server_user_model.userid_of_Je)
      } else if (store_server_users.server_select_kind === 'ninesong') {
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
  },
  async Set_PlaylistInfo_To_Update_SetPlaylist(
    item_id: string,
    name: string,
    comment: string,
    _public_: boolean
  ) {
    if (
      store_server_user_model.model_server_type_of_local ||
      (store_server_users.server_select_kind === 'navidrome' &&
        store_server_user_model.model_server_type_of_web)
    ) {
      await new Playlists_ApiService_of_ND(
        store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest'
      ).updatePlaylist_infoUpdate(
        store_server_user_model.username,
        store_server_user_model.token,
        store_server_user_model.salt,
        item_id,
        name,
        comment,
        String(_public_)
      )
    } else if (
      store_server_user_model.model_server_type_of_web &&
      store_server_users.server_select_kind === 'ninesong'
    ) {
      await new Playlist_ApiService_of_NineSong(
        store_server_login_info.server_url
      ).updatePlaylist_Id(item_id, name, comment)
    }
  },
  async Set_PlaylistInfo_To_Update_DeletePlaylist(item_id: string) {
    if (
      store_server_user_model.model_server_type_of_local ||
      (store_server_users.server_select_kind === 'navidrome' &&
        store_server_user_model.model_server_type_of_web)
    ) {
      return await new Playlists_ApiService_of_ND(
        store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest'
      ).deletePlaylist_set(
        store_server_user_model.username,
        store_server_user_model.token,
        store_server_user_model.salt,
        item_id
      )
    } else if (store_server_user_model.model_server_type_of_web) {
      if (
        store_server_users.server_select_kind === 'jellyfin' ||
        store_server_users.server_select_kind === 'emby'
      ) {
        return await new Items_ApiService_of_Je(
          store_server_users.server_config_of_current_user_of_sqlite?.url
        ).delItems_List_Quick(item_id)
      } else if (store_server_users.server_select_kind === 'ninesong') {
        return await new Playlist_ApiService_of_NineSong(
          store_server_login_info.server_url
        ).deletePlaylist_Id(item_id)
      }
    }
  },

  async Set_Selected_MediaInfo_Add_Selected_Playlist(ids: string[], playlist_id: string) {
    if (
      store_server_user_model.model_server_type_of_local ||
      (store_server_users.server_select_kind === 'navidrome' &&
        store_server_user_model.model_server_type_of_web)
    ) {
      for (const id of ids) {
        await new Playlists_ApiService_of_ND(
          store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest'
        ).updatePlaylist_songIdToAdd(
          store_server_user_model.username,
          store_server_user_model.token,
          store_server_user_model.salt,
          playlist_id,
          id
        )
      }
    } else if (store_server_user_model.model_server_type_of_web) {
      if (
        store_server_users.server_select_kind === 'jellyfin' ||
        store_server_users.server_select_kind === 'emby'
      ) {
        await new Playlists_ApiService_of_Je(
          store_server_users.server_config_of_current_user_of_sqlite?.url
        ).postPlaylists_Add(playlist_id, ids.join(','), store_server_user_model.userid_of_Je)
      } else if (store_server_users.server_select_kind === 'ninesong') {
        await new Playlist_ApiService_of_NineSong(
          store_server_login_info.server_url
        ).addMediaFiles_Playlist(playlist_id, ids.join(','))
      }
    }
  },
  async Set_Selected_MediaInfo_Delete_Selected_Playlist(ids: string[], playlist_id: string) {
    if (
      store_server_user_model.model_server_type_of_local ||
      (store_server_users.server_select_kind === 'navidrome' &&
        store_server_user_model.model_server_type_of_web)
    ) {
      const indexs = await this.Set_PlaylistInfo_To_Update_GetPlaylist_MediaIndex(playlist_id, ids)
      for (let i = 0; i < indexs.length; i++) {
        const index = indexs[i]
        await new Playlists_ApiService_of_ND(
          store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest'
        ).updatePlaylist_songIndexToRemove(
          store_server_user_model.username,
          store_server_user_model.token,
          store_server_user_model.salt,
          playlist_id,
          index
        )
        /// navidrome delete logic bug, Delete based on song number, but cannot support simultaneous deletion of multiple numbers
        for (let j = i + 1; j < indexs.length; j++) {
          indexs[j] -= 1
        }
      }
    } else if (store_server_user_model.model_server_type_of_web) {
      if (
        store_server_users.server_select_kind === 'jellyfin' ||
        store_server_users.server_select_kind === 'emby'
      ) {
        await new Playlists_ApiService_of_Je(
          store_server_users.server_config_of_current_user_of_sqlite?.url
        ).delPlaylists_Remove(playlist_id, ids.join(','))
      } else if (store_server_users.server_select_kind === 'ninesong') {
        await new Playlist_ApiService_of_NineSong(
          store_server_login_info.server_url
        ).removeMediaFiles_Playlist(playlist_id, ids.join(','))
      }
    }
  },

  async Set_PlaylistInfo_To_Update_GetPlaylist_MediaIndex(playlist_id: string, ids: string[]) {
    if (
      store_server_user_model.model_server_type_of_local ||
      (store_server_users.server_select_kind === 'navidrome' &&
        store_server_user_model.model_server_type_of_web)
    ) {
      const getPlaylist_id = await new Playlists_ApiService_of_ND(
        store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest'
      ).getPlaylist_id(
        store_server_user_model.username,
        store_server_user_model.token,
        store_server_user_model.salt,
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
      store_server_user_model.model_server_type_of_web &&
      store_server_users.server_select_kind === 'ninesong'
    ) {
    }
  },
})
