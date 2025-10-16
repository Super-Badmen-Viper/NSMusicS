import { defineStore } from 'pinia'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
import { store_system_configs_save } from '@/data/data_pinia_stores/local_system_stores/store_system_configs_save'
import { User_Authorization_ApiWebService_of_ND } from '@/data/data_configs/navidrome_api/services_web/user_authorization/index_service'
import { Set_All_To_LocalSqlite } from '@/data/data_configs/navidrome_api/services_normal_middleware/class_Set_Navidrome_ALL_Data_To_LocalSqlite'
import { Get_Navidrome_User_Info } from '@/data/data_configs/navidrome_api/services_normal/user_management/index_service'
import { Set_LocalSqlite_ServerInfo } from '@/data/data_repository/app_repository/LocalSqlite_Set_ServerInfo'
import { isElectron } from '@/utils/electron/isElectron'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'

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

// 类型定义
interface Server_Configs_Props {
  id: string
  server_name: string
  url: string
  user_name: string
  password: string
  last_login_at: string
  type: string
}

export const useServerNavidromeUserDataLogicStore = defineStore('serverNavidromeUserDataLogic', () => {
  // 获取其他store实例
  const serverUsersStore = useServerUsersStore()
  const serverUserModelStore = useServerUserModelStore()
  const systemConfigsSaveStore = useSystemConfigsSaveStore()
  const serverNinesongUserDataLogicStore = useServerNinesongUserDataLogicStore()
  const serverLoginInfoStore = useServerLoginInfoStore()

  // 定义方法
  const navidrome_update_server_addUser = async (
    server_name: string,
    url: string,
    user_name: string,
    password: string,
    type: string
  ) => {
    try {
      const userService = new User_ApiService_of_ND(url + '/rest')
      const { salt, token } = navidrome_get_EncryptedPassword(password)
      const userData = await userService.getUser(user_name, token, salt)

      if (
        userData &&
        userData['subsonic-response'] &&
        userData['subsonic-response']['status'] === 'ok'
      ) {
        let data: Server_Configs_Props | null = null

        if (isElectron) {
          const set_ServerInfo_To_LocalSqlite = new Set_LocalSqlite_ServerInfo()
          data = set_ServerInfo_To_LocalSqlite.Set_ServerInfo_To_Update_CreateUser(
            server_name,
            url,
            user_name,
            password,
            type
          )
        } else {
          // Golang
          data = await serverNinesongUserDataLogicStore.update_app_configs_server(
            systemConfigsSaveStore.generateMockObjectId(),
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
            data,
          ]
          serverUsersStore.get_server_config_of_all_user_of_sqlite(new_data)
          return true
        }
      }
    } catch (error) {
      console.error('Error during navidrome_update_server_addUser:', error)
    }
    return false
  }

  const navidrome_update_server_setUser = async (
    id: string,
    server_name: string,
    url: string,
    user_name: string,
    password: string,
    type: string
  ) => {
    const userService = new User_ApiService_of_ND(url + '/rest')
    const { salt, token } = navidrome_get_EncryptedPassword(password)
    const userData = await userService.getUser(user_name, token, salt)
    if (userData['subsonic-response']['status'] === 'ok') {
      let data: Server_Configs_Props | null = null
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
        const new_data: Server_Configs_Props[] = 
          serverUsersStore.server_config_of_all_user_of_sqlite
        const index = new_data.findIndex((item: Server_Configs_Props) => item.id === data.id)
        if (index !== -1) {
          new_data[index] = data
        }
        serverUsersStore.get_server_config_of_all_user_of_sqlite(new_data)
        return true
      }
    }
    return false
  }

  const navidrome_update_server_config_of_current_user_of_sqlite = async (value: any) => {
    try {
      const index = serverUsersStore.server_config_of_all_user_of_sqlite.findIndex(
        (item) => item.id === value
      )
      await navidrome_update_server_setUser(
        serverUsersStore.server_config_of_all_user_of_sqlite[index].id,
        serverUsersStore.server_config_of_all_user_of_sqlite[index].server_name,
        serverUsersStore.server_config_of_all_user_of_sqlite[index].url,
        serverUsersStore.server_config_of_all_user_of_sqlite[index].user_name,
        serverUsersStore.server_config_of_all_user_of_sqlite[index].password,
        serverUsersStore.server_config_of_all_user_of_sqlite[index].type
      )
      await navidrome_get_server_config(
        serverUsersStore.server_config_of_all_user_of_sqlite[index]
      )
      if (serverUserModelStore.model_server_type_of_web) {
        console.log('store_server_user_model.model_server_type_of_web')
        const user_Authorization_ApiWebService_of_ND = new User_Authorization_ApiWebService_of_ND(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url
        )
        await user_Authorization_ApiWebService_of_ND.get_token()
        systemConfigsSaveStore.save_system_config_of_App_Configs()
        systemConfigsSaveStore.save_system_config_of_Servers_Config()
      }
      return true
    } catch {}
    return false
  }

  const navidrome_get_server_config = async (value: Server_Configs_Props) => {
    serverUsersStore.server_config_of_current_user_of_sqlite = value
    if (value != undefined) {
      serverUsersStore.server_config_of_current_user_of_select = {
        label: value.type + ' - ' + value.server_name,
        value: value.id,
      }
      serverUsersStore.server_config_of_current_user_of_select_servername = 
        value.type + ' - ' + value.server_name
      serverUserModelStore.server_select = value.id
      serverUserModelStore.username = value.user_name
      serverUserModelStore.password = value.password
      serverLoginInfoStore.server_url = value.url
      systemConfigsSaveStore.save_system_config_of_Servers_Config()

      const { salt, token } = navidrome_get_EncryptedPassword(
        serverUsersStore.server_config_of_current_user_of_sqlite?.password
      )
      serverUserModelStore.salt = salt
      serverUserModelStore.token = token

      if (serverUserModelStore.model_server_type_of_local) {
        const set_Navidrome_Data_To_LocalSqlite = new Set_Navidrome_ALL_Data_To_LocalSqlite()
        await set_Navidrome_Data_To_LocalSqlite.Set_Read_Navidrome_Api_BasicInfo_Add_LocalSqlite(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest',
          serverUserModelStore.username,
          serverUserModelStore.token,
          serverUserModelStore.salt
        )
        /// reset app data
        if (isElectron) {
          ipcRenderer.send('window-reset-data')
        }
      }
    }
  }

  const navidrome_get_EncryptedPassword = (password: string): { salt: string; token: string } => {
    const saltLength = 6
    const characters = 'dfeVYUY9iu239iBUYHuji46h39BHUJ8u42nmrfhDD3r4ouj123890fvn48u95h'
    let randomString = ''
    for (let i = 0; i < saltLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      randomString += characters[randomIndex]
    }
    const salt = randomString
    const token = hash(password + salt)
    return { salt, token }
  }

  // 暴露方法
  return {
    navidrome_update_server_addUser,
    navidrome_update_server_setUser,
    navidrome_update_server_config_of_current_user_of_sqlite,
    navidrome_get_server_config,
    navidrome_get_EncryptedPassword
  }
})