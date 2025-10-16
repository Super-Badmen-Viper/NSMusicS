import { defineStore } from 'pinia'
import { Set_LocalSqlite_ServerInfo } from '@/data/data_repository/app_repository/LocalSqlite_Set_ServerInfo'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { isElectron } from '@/utils/electron/isElectron'
import { store_view_media_page_logic } from '@/views/view_app/page/page_media/store/store_view_media_page_logic'
import { store_view_album_page_logic } from '@/views/view_app/page/page_album/store/store_view_album_page_logic'
import { store_view_artist_page_logic } from '@/views/view_app/page/page_artist/store/store_view_artist_page_logic'

// 定义接口
export interface Server_Configs_Props {
  show: boolean;
  type: string;
  id: string;
  server_name: string;
  url: string;
  user_name: string;
  password: string;
  last_login_at: string;
}



export const useServerDataSelectLogicStore = defineStore('serverDataSelectLogic', () => {
  // 获取其他store实例
  const serverUsersStore = useServerUsersStore()

  // 定义方法
  const update_server_addUser = async (
    server_name: string,
    url: string,
    user_name: string,
    password: string,
    type: string
  ) => {
    try {
      let result = false
      if (type === 'ninesong') {
        // 动态导入以避免循环依赖
        const { useServerNinesongUserDataLogicStore } = await import(
          '@/data/data_pinia_stores/server_configs_stores/server_data_select/server_ninesong_user_data/store_server_ninesong_userdata_logic'
        )
        const ninesongUserDataLogicStore = useServerNinesongUserDataLogicStore()
        result = await ninesongUserDataLogicStore.ninesong_update_server_addUser(
          server_name,
          url,
          user_name,
          password,
          type
        )
      } else if (type === 'navidrome') {
        // 动态导入以避免循环依赖
        const { useServerNavidromeUserDataLogicStore } = await import(
          '@/data/data_pinia_stores/server_configs_stores/server_data_select/server_navidrome_user_data/store_server_navidrome_userdata_logic'
        )
        const navidromeUserDataLogicStore = useServerNavidromeUserDataLogicStore()
        result = await navidromeUserDataLogicStore.navidrome_update_server_addUser(
          server_name,
          url,
          user_name,
          password,
          type
        )
      } else if (type === 'jellyfin' || type === 'emby') {
        // 动态导入以避免循环依赖
        const { useServerJellyfinUserDataLogicStore } = await import(
          '@/data/data_pinia_stores/server_configs_stores/server_data_select/server_jellyfin_user_data/store_server_jellyfin_userdata_logic'
        )
        const jellyfinUserDataLogicStore = useServerJellyfinUserDataLogicStore()
        result = await jellyfinUserDataLogicStore.jellyfin_update_server_addUser(
          server_name,
          url,
          user_name,
          password,
          type
        )
      }
      return result
    } catch (error) {
      console.error('Failed to add server user:', error)
      return false
    }
  }

  const update_server_setUser = async (
    id: string,
    server_name: string,
    url: string,
    user_name: string,
    password: string,
    type: string
  ) => {
    try {
      let result = false
      if (type === 'ninesong') {
        // 动态导入以避免循环依赖
        const { useServerNinesongUserDataLogicStore } = await import(
          '@/data/data_pinia_stores/server_configs_stores/server_data_select/server_ninesong_user_data/store_server_ninesong_userdata_logic'
        )
        const ninesongUserDataLogicStore = useServerNinesongUserDataLogicStore()
        result = await ninesongUserDataLogicStore.ninesong_update_server_setUser(
          id,
          server_name,
          url,
          user_name,
          password,
          type
        )
      } else if (type === 'navidrome') {
        // 动态导入以避免循环依赖
        const { useServerNavidromeUserDataLogicStore } = await import(
          '@/data/data_pinia_stores/server_configs_stores/server_data_select/server_navidrome_user_data/store_server_navidrome_userdata_logic'
        )
        const navidromeUserDataLogicStore = useServerNavidromeUserDataLogicStore()
        result = await navidromeUserDataLogicStore.navidrome_update_server_setUser(
          id,
          server_name,
          url,
          user_name,
          password,
          type
        )
      } else if (type === 'jellyfin' || type === 'emby') {
        // 动态导入以避免循环依赖
        const { useServerJellyfinUserDataLogicStore } = await import(
          '@/data/data_pinia_stores/server_configs_stores/server_data_select/server_jellyfin_user_data/store_server_jellyfin_userdata_logic'
        )
        const jellyfinUserDataLogicStore = useServerJellyfinUserDataLogicStore()
        result = await jellyfinUserDataLogicStore.jellyfin_update_server_setUser(
          id,
          server_name,
          url,
          user_name,
          password,
          type
        )
      }
      return result
    } catch (error) {
      console.error('Failed to set server user:', error)
      return false
    }
  }

  const update_server_config_of_current_user_of_sqlite = async (value: any) => {
    // 重置相关页面状态
    store_view_media_page_logic.page_songlists_selected = 'song_list_all'
    store_view_album_page_logic.page_albumlists_selected = 'album_list_all'
    store_view_artist_page_logic.page_artistlists_selected = 'artist_list_all'
    
    try {
      const index = serverUsersStore.server_config_of_all_user_of_sqlite.findIndex(
        (item: Server_Configs_Props) => item.id === value
      )
      const currentServer = serverUsersStore.server_config_of_all_user_of_sqlite[index]
      
      if (currentServer.type === 'ninesong') {
        // 动态导入以避免循环依赖
        const { useServerNinesongUserDataLogicStore } = await import(
          '@/data/data_pinia_stores/server_configs_stores/server_data_select/server_ninesong_user_data/store_server_ninesong_userdata_logic'
        )
        const ninesongUserDataLogicStore = useServerNinesongUserDataLogicStore()
        return await ninesongUserDataLogicStore.ninesong_update_server_config_of_current_user_of_sqlite(
          value
        )
      } else if (currentServer.type === 'navidrome') {
        // 动态导入以避免循环依赖
        const { useServerNavidromeUserDataLogicStore } = await import(
          '@/data/data_pinia_stores/server_configs_stores/server_data_select/server_navidrome_user_data/store_server_navidrome_userdata_logic'
        )
        const navidromeUserDataLogicStore = useServerNavidromeUserDataLogicStore()
        return await navidromeUserDataLogicStore.navidrome_update_server_config_of_current_user_of_sqlite(
          value
        )
      } else if (currentServer.type === 'jellyfin' || currentServer.type === 'emby') {
        // 动态导入以避免循环依赖
        const { useServerJellyfinUserDataLogicStore } = await import(
          '@/data/data_pinia_stores/server_configs_stores/server_data_select/server_jellyfin_user_data/store_server_jellyfin_userdata_logic'
        )
        const jellyfinUserDataLogicStore = useServerJellyfinUserDataLogicStore()
        return await jellyfinUserDataLogicStore.jellyfin_update_server_config_of_current_user_of_sqlite(
          value
        )
      }
      return false
    } catch (error) {
      console.error('Failed to update server config:', error)
      return false
    }
  }

  const update_server_deleteUser = async (value: any) => {
    try {
      const new_data = serverUsersStore.server_config_of_all_user_of_sqlite.filter(
        (item: Server_Configs_Props) => item.id !== value
      )
      serverUsersStore.get_server_config_of_all_user_of_sqlite(new_data)
      
      // 清除当前选中的服务器信息
      if (serverUsersStore.server_config_of_current_user_of_sqlite?.id === value) {
        serverUsersStore.server_config_of_current_user_of_sqlite = null as any
        serverUsersStore.server_config_of_current_user_of_select = null as any
        serverUsersStore.server_config_of_current_user_of_select_servername = ''
        
        // 重置相关页面状态
        store_view_media_page_logic.media_info_list = []
        store_view_album_page_logic.album_info_list = []
        store_view_artist_page_logic.artist_info_list = []
      }
      
      // 在SQLite中删除服务器配置
      if (isElectron) {
        const set_ServerInfo_To_LocalSqlite = new Set_LocalSqlite_ServerInfo()
        set_ServerInfo_To_LocalSqlite.Set_ServerInfo_To_Update_DeleteUser(value)
      } else {
        // 动态导入以避免循环依赖
        const { useServerNinesongUserDataLogicStore } = await import(
          '@/data/data_pinia_stores/server_configs_stores/server_data_select/server_ninesong_user_data/store_server_ninesong_userdata_logic'
        )
        const ninesongUserDataLogicStore = useServerNinesongUserDataLogicStore()
        const result = await ninesongUserDataLogicStore.delete_app_configs_server(value)
        if (!result) {
          return false
        }
      }
      
      return true
    } catch (error) {
      console.error('Failed to delete server user:', error)
      return false
    }
  }

  // 暴露方法
  return {
    update_server_addUser,
    update_server_setUser,
    update_server_config_of_current_user_of_sqlite,
    update_server_deleteUser
  }
})