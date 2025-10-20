import { reactive } from 'vue'
import { store_server_navidrome_userdata_logic } from '@/data/data_stores/server_configs_stores/server_data_select/server_navidrome_user_data/store_server_navidrome_userdata_logic'
import { Set_LocalSqlite_ServerInfo } from '@/data/data_repository/app_repository/LocalSqlite_Set_ServerInfo'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { store_server_jellyfin_userdata_logic } from './server_jellyfin_user_data/store_server_jellyfin_userdata_logic'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { store_server_ninesong_userdata_logic } from './server_ninesong_user_data/store_server_ninesong_userdata_logic'
import { store_view_media_page_logic } from '@/views/view_app/page/page_media/store/store_view_media_page_logic'
import { usePageAlbumStore } from '@/data/data_status/app_status/page_status/album_store/usePageAlbumStore'
import { store_view_artist_page_logic } from '@/views/view_app/page/page_artist/store/store_view_artist_page_logic'

export const store_server_data_select_logic = reactive({
  /// app add
  async update_server_addUser(
    server_set_of_addUser_of_servername: string,
    server_set_of_addUser_of_url: string,
    server_set_of_addUser_of_username: string,
    server_set_of_addUser_of_password: string,
    type: string
  ) {
    if (type === 'ninesong') {
      return store_server_ninesong_userdata_logic.ninesong_update_server_addUser(
        server_set_of_addUser_of_servername,
        server_set_of_addUser_of_url,
        server_set_of_addUser_of_username,
        server_set_of_addUser_of_password,
        type
      )
    } else if (type === 'navidrome') {
      return store_server_navidrome_userdata_logic.navidrome_update_server_addUser(
        server_set_of_addUser_of_servername,
        server_set_of_addUser_of_url,
        server_set_of_addUser_of_username,
        server_set_of_addUser_of_password,
        type
      )
    } else if (type === 'jellyfin' || type === 'emby') {
      return store_server_jellyfin_userdata_logic.jellyfin_update_server_addUser(
        server_set_of_addUser_of_servername,
        server_set_of_addUser_of_url,
        server_set_of_addUser_of_username,
        server_set_of_addUser_of_password,
        type
      )
    }
    return false
  },

  /// app update
  async update_server_setUser(
    id: string,
    server_name: string,
    url: string,
    user_name: string,
    password: string,
    type: string
  ) {
    if (type === 'ninesong') {
      return store_server_ninesong_userdata_logic.ninesong_update_server_setUser(
        id,
        server_name,
        url,
        user_name,
        password,
        type
      )
    } else if (type === 'navidrome') {
      return store_server_navidrome_userdata_logic.navidrome_update_server_setUser(
        id,
        server_name,
        url,
        user_name,
        password,
        type
      )
    } else if (type === 'jellyfin' || type === 'emby') {
      return store_server_jellyfin_userdata_logic.jellyfin_update_server_setUser(
        id,
        server_name,
        url,
        user_name,
        password,
        type
      )
    }
    return false
  },

  /// app login and get token
  async update_server_config_of_current_user_of_sqlite(value: any, type: string) {
    const pageAlbumStore = usePageAlbumStore()
    store_view_media_page_logic.page_songlists_selected = 'song_list_all'
    pageAlbumStore.page_albumlists_selected = 'album_list_all'
    store_view_artist_page_logic.page_artistlists_selected = 'artist_list_all'
    //
    if (type === 'ninesong') {
      return store_server_ninesong_userdata_logic.ninesong_update_server_config_of_current_user_of_sqlite(
        value
      )
    } else if (type === 'navidrome') {
      return store_server_navidrome_userdata_logic.navidrome_update_server_config_of_current_user_of_sqlite(
        value
      )
    } else if (type === 'jellyfin' || type === 'emby') {
      return store_server_jellyfin_userdata_logic.jellyfin_update_server_config_of_current_user_of_sqlite(
        value
      )
    }
    return false
  },

  /// app delete
  async update_server_deleteUser(id: string) {
    try {
      if (isElectron) {
        const set_ServerInfo_To_LocalSqlite = new Set_LocalSqlite_ServerInfo()
        set_ServerInfo_To_LocalSqlite.Set_ServerInfo_To_Update_DeleteUser(id)
      } else {
        const result = await store_server_ninesong_userdata_logic.delete_app_configs_server(id)
        if (!result) {
          return false
        }
      }
      const new_data: Server_Configs_Props[] =
        store_server_users.server_config_of_all_user_of_sqlite
      const index = new_data.findIndex((item) => item.id === id)
      new_data.splice(index, 1)
      store_server_users.get_server_config_of_all_user_of_sqlite(new_data)
      return true
    } catch {}
    return false
  },
})
