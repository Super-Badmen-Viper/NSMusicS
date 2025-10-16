import { defineStore } from 'pinia'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
import axios from 'axios'
import { Auth_Token_ApiService_of_NineSong } from '@/data/data_configs/ninesong_api/services_web/Auth/Auth_Token/index_service'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
import { store_system_configs_save } from '@/data/data_pinia_stores/local_system_stores/store_system_configs_save'
import { Set_LocalSqlite_ServerInfo } from '@/data/data_repository/app_repository/LocalSqlite_Set_ServerInfo'
import { isElectron } from '@/utils/electron/isElectron'
import { Folder_Entity_ApiService_of_NineSong } from '@/data/data_configs/ninesong_api/services_web/Folder_Entity/index_service'

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

export const useServerNinesongUserDataLogicStore = defineStore('serverNinesongUserDataLogic', {
  actions: {
    /// docker server_configs_stores manage
    async update_app_configs_server(
      id: string,
      server_name: string,
      url: string,
      user_name: string,
      password: string,
      type: string
    ): Promise<Server_Configs_Props | null> {
      if (
        !store_router_data_info.router_select_model_server_login &&
        store_server_login_info.server_accessToken.length > 0
      ) {
        try {
          const new_date = new Date().toISOString().split('.')[0] + 'Z'
          await axios.put(
            '/api/app/server',
            JSON.stringify({
              ID: id,
              ServerName: server_name,
              URL: url,
              UserName: user_name,
              Password: password,
              LastLoginAt: new_date,
              Type: type,
            }),
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${store_server_login_info.server_accessToken}`,
              },
            }
          )

          return {
            show: false,
            type: type,
            id: id,
            server_name: server_name,
            url: url,
            user_name: user_name,
            password: password,
            last_login_at: new_date,
          }
        } catch (error) {
          console.error('Request failed:', (error as any).response ? (error as any).response.data : (error as any).message)
        }
      }
      return null
    },

    async delete_app_configs_server(id: string) {
      if (
        !store_router_data_info.router_select_model_server_login &&
        store_server_login_info.server_accessToken.length > 0
      ) {
        try {
          await axios.delete('/api/app/server', {
            params: { id },
            headers: {
              Authorization: `Bearer ${store_server_login_info.server_accessToken}`,
            },
          })
        } catch (error) {
          console.error('请求失败:', (error as any).response?.data ?? (error as any).message)
        if ((error as any).response?.status === 404) {
            console.warn('指定的配置项不存在')
          }
        }
      }
      return true
    },

    /// app server_configs_stores manage
    /// server_configs_stores add
    async ninesong_update_server_addUser(
      server_name: string,
      url: string,
      user_name: string,
      password: string,
      type: string
    ) {
      try {
        const auth = new Auth_Token_ApiService_of_NineSong(url)
        const userData = await auth.getAuth_Token(user_name, password)
        if (userData && userData.accessToken && userData.refreshToken) {
          store_server_login_info.server_accessToken = String(userData.accessToken)
          store_server_login_info.server_refreshToken = String(userData.refreshToken)

          const folder_Entity_ApiService_of_NineSong = new Folder_Entity_ApiService_of_NineSong(url)
          const serverUsersStore = useServerUsersStore()
          serverUsersStore.server_all_library = 
            await folder_Entity_ApiService_of_NineSong.getFolder_Entity_All()

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
            data = await this.update_app_configs_server(
              store_system_configs_save.generateMockObjectId(),
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
        console.error('Error during ninesong_update_server_addUser:', error)
      }
      return false
    },

    /// server_configs_stores update
    async ninesong_update_server_setUser(
      id: string,
      server_name: string,
      url: string,
      user_name: string,
      password: string,
      type: string
    ) {
      const auth = new Auth_Token_ApiService_of_NineSong(url)
      const userData = await auth.getAuth_Token(user_name, password)
      if (userData && userData.accessToken && userData.refreshToken) {
        store_server_login_info.server_accessToken = String(userData.accessToken)
        store_server_login_info.server_refreshToken = String(userData.refreshToken)
        store_server_login_info.server_url = url

        const folder_Entity_ApiService_of_NineSong = new Folder_Entity_ApiService_of_NineSong(url)
        const serverUsersStore = useServerUsersStore()
        serverUsersStore.server_all_library = 
          await folder_Entity_ApiService_of_NineSong.getFolder_Entity_All()

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
          data = await this.update_app_configs_server(
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
    },

    /// server_configs_stores select login
    async ninesong_update_server_config_of_current_user_of_sqlite(value: any) {
      try {
        const serverUsersStore = useServerUsersStore()
        const index = serverUsersStore.server_config_of_all_user_of_sqlite.findIndex(
          (item: Server_Configs_Props) => item.id === value
        )
        await this.ninesong_update_server_setUser(
          serverUsersStore.server_config_of_all_user_of_sqlite[index].id,
          serverUsersStore.server_config_of_all_user_of_sqlite[index].server_name,
          serverUsersStore.server_config_of_all_user_of_sqlite[index].url,
          serverUsersStore.server_config_of_all_user_of_sqlite[index].user_name,
          serverUsersStore.server_config_of_all_user_of_sqlite[index].password,
          serverUsersStore.server_config_of_all_user_of_sqlite[index].type
        )
        await this.ninesong_get_server_config(
          serverUsersStore.server_config_of_all_user_of_sqlite[index]
        )
        store_system_configs_save.save_system_config_of_App_Configs()
        store_system_configs_save.save_system_config_of_Servers_Config()
        return true
      } catch (error) {}
      return false
    },

    /// server_configs_stores start login
    async ninesong_get_server_config(value: Server_Configs_Props) {
      const serverUsersStore = useServerUsersStore()
      const serverUserModelStore = useServerUserModelStore()
      
      serverUsersStore.server_config_of_current_user_of_sqlite = value
      serverUsersStore.server_config_of_current_user_of_select = {
        label: value.type + ' - ' + value.server_name,
        value: value.id,
      }
      serverUsersStore.server_config_of_current_user_of_select_servername = 
        value.type + ' - ' + value.server_name
      serverUserModelStore.server_select = value.id
      store_server_login_info.server_id = value.id
      store_server_login_info.server_name = value.server_name
      serverUserModelStore.username = value.user_name
      serverUserModelStore.password = value.password
      store_server_login_info.server_url = value.url
      store_system_configs_save.save_system_config_of_Servers_Config()
    },
  },
})