import { defineStore } from 'pinia'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
import { useSystemConfigsSaveStore } from '@/data/data_pinia_stores/local_system_stores/store_system_configs_save'
import { Set_LocalSqlite_ServerInfo } from '@/data/data_repository/app_repository/LocalSqlite_Set_ServerInfo'
import { isElectron } from '@/utils/electron/isElectron'
import { Users_ApiService_of_Je } from '@/data/data_configs/jellyfin_api/services_web/Users/index_service'
import { Library_ApiService_of_Je } from '@/data/data_configs/jellyfin_api/services_web/Library/index_service'
import { useServerLoginInfoStore } from '@/views/view_server/page_login/store/store_server_login_info'

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

export const useServerJellyfinUserDataLogicStore = defineStore('serverJellyfinUserDataLogic', () => {
  // 获取其他store实例
  const serverUsersStore = useServerUsersStore()
  const serverUserModelStore = useServerUserModelStore()
  const systemConfigsSaveStore = useSystemConfigsSaveStore()
  const serverNinesongUserDataLogicStore = useServerNinesongUserDataLogicStore()
  const serverModelStatisticsStore = useServerModelStatisticsStore()
  const serverLoginInfoStore = useServerLoginInfoStore()

  // 定义方法
  const jellyfin_update_server_addUser = async (
    server_name: string,
    url: string,
    username: string,
    password: string,
    type: string
  ) => {
    try {
      let data = null
      if (isElectron) {
        const set_ServerInfo_To_LocalSqlite = new Set_LocalSqlite_ServerInfo()
        data = set_ServerInfo_To_LocalSqlite.Set_ServerInfo_To_Update_CreateUser(
          server_name,
          url,
          username,
          password,
          type
        )
      } else {
        // Golang
        data = await serverNinesongUserDataLogicStore.update_app_configs_server(
          systemConfigsSaveStore.generateMockObjectId(),
          server_name,
          url,
          username,
          password,
          type
        )
      }
      if (data != null) {
        const new_data: Server_Configs_Props[] = [
          ...serverUsersStore.server_config_of_all_user_of_sqlite,
          {
            show: false,
            id: data.id,
            server_name: data.server_name,
            url: data.url,
            user_name: data.user_name,
            password: data.password,
            type: data.type,
            last_login_at: new Date().toISOString().split('.')[0] + 'Z'
          },
        ]
        serverUsersStore.get_server_config_of_all_user_of_sqlite(new_data)
        await systemConfigsSaveStore.save_system_config_of_Servers_Config()
        return true
      }
    } catch (error) {
      console.error(error)
    }
    return false
  }

  const jellyfin_update_server_setUser = async (
    id: string,
    server_name: string,
    url: string,
    user_name: string,
    password: string,
    type: string
  ) => {
    try {
      await jellyfin_get_server_config_of_current_user_of_sqlite({
        id,
        server_name,
        url,
        user_name,
        password,
        type,
      })
      const userService = new Users_ApiService_of_Je(url)
      const result = await userService.getUsers_id(serverUserModelStore.userid_of_Je)
      if (result.status !== undefined && result.status === '400') {
        return false
      }
      let data = null
      if (isElectron) {
        const set_ServerInfo_To_LocalSqlite = new Set_LocalSqlite_ServerInfo()
        data = set_ServerInfo_To_LocalSqlite.Set_ServerInfo_To_Update_SetUser(
          id,
          server_name,
          url,
          user_name,
          password,
          type
        )
      } else {
        // Golang
        data = await serverNinesongUserDataLogicStore.update_app_configs_server(
          id,
          server_name,
          url,
          user_name,
          password,
          type
        )
      }
      if (data != null) {
        const new_data: Server_Configs_Props[] = [
          ...serverUsersStore.server_config_of_all_user_of_sqlite,
        ]
        const index = new_data.findIndex((item: Server_Configs_Props) => item.id === data.id)
        if (index !== -1) {
          new_data[index] = data
        }
        serverUsersStore.get_server_config_of_all_user_of_sqlite(new_data)
        await systemConfigsSaveStore.save_system_config_of_Servers_Config()
        return true
      }
    } catch (error) {
      console.error(error)
    }
    return false
  }

  const jellyfin_update_server_config_of_current_user_of_sqlite = async (value: any) => {
    try {
      const index = serverUsersStore.server_config_of_all_user_of_sqlite.findIndex(
        (item) => item.id === value
      )
      if (index !== -1) {
        await jellyfin_update_server_setUser(
          serverUsersStore.server_config_of_all_user_of_sqlite[index].id,
          serverUsersStore.server_config_of_all_user_of_sqlite[index].server_name,
          serverUsersStore.server_config_of_all_user_of_sqlite[index].url,
          serverUsersStore.server_config_of_all_user_of_sqlite[index].user_name,
          serverUsersStore.server_config_of_all_user_of_sqlite[index].password,
          serverUsersStore.server_config_of_all_user_of_sqlite[index].type
        )
        await jellyfin_get_server_config_of_current_user_of_sqlite(
          serverUsersStore.server_config_of_all_user_of_sqlite[index]
        )
        const userService = new Users_ApiService_of_Je(
          serverUsersStore.server_config_of_all_user_of_sqlite[index].url
        )
        const result = await userService.getUsers_id(serverUserModelStore.userid_of_Je)
        return !(result.status !== undefined && result.status === '400')
      }
    } catch (error) {
      console.error(error)
    }
    return false
  }

  const jellyfin_get_server_config_of_current_user_of_sqlite = async (value: Server_Configs_Props) => {
    serverUsersStore.server_config_of_current_user_of_sqlite = value
    serverUsersStore.server_config_of_current_user_of_select = {
      label: value.type + ' - ' + value.server_name,
      value: value.id,
    }
    serverUsersStore.server_config_of_current_user_of_select_servername = 
      value.type + ' - ' + value.server_name
    serverUserModelStore.server_select = value.id
    if (serverUserModelStore.server_login_model_of_apikey) {
      serverUserModelStore.authorization_of_Je = value.user_name
      serverUserModelStore.userid_of_Je = value.password
    } else {
      serverUserModelStore.username = value.user_name
      serverUserModelStore.password = value.password
      serverLoginInfoStore.server_url = value.url
      const data = await new Users_ApiService_of_Je(value.url).authenticateUserByName(
        value.url,
        value.user_name,
        value.password
      )
      serverUserModelStore.authorization_of_Je = data.AccessToken
      serverUserModelStore.userid_of_Je = data.User.Id
      await serverModelStatisticsStore.get_page_top_info()
    }
    const library_ApiService = new Library_ApiService_of_Je(value.url)
    let result_parentIds = await library_ApiService.getLibrary_MediaFolders_ALL()
    serverUserModelStore.parentid_of_Je = []
    let Library_Find = false
    if (result_parentIds && result_parentIds.Items) {
      Library_Find = true
    } else {
      if (serverUserModelStore.userid_of_Je !== undefined) {
        result_parentIds = await library_ApiService.getLibrary_MediaFolders_ALL_Other(
          serverUserModelStore.userid_of_Je
        )
        if (result_parentIds && result_parentIds.Items) {
          Library_Find = true
        }
      } else {
        Library_Find = false
      }
    }
    if (Library_Find) {
      if (Array.isArray(result_parentIds.Items) && result_parentIds.Items.length > 0) {
        result_parentIds.Items.forEach((row: any, index: number) => {
          serverUserModelStore.parentid_of_Je.push({
            label: row.Name,
            value: row.Id,
          })
          if (row.CollectionType === 'music') {
            serverUserModelStore.parentid_of_Je_Music = row.Id
          }
        })
      }
    } else {
      serverUserModelStore.parentid_of_Je_Music = undefined
    }
    await systemConfigsSaveStore.save_system_config_of_Servers_Config()
  }

  // 暴露方法
  return {
    jellyfin_update_server_addUser,
    jellyfin_update_server_setUser,
    jellyfin_update_server_config_of_current_user_of_sqlite,
    jellyfin_get_server_config_of_current_user_of_sqlite
  }
})