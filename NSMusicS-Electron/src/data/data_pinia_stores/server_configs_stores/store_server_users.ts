import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
import { useServerLoginInfoStore } from '@/views/view_server/page_login/store/store_server_login_info'

// 类型定义
interface Library_Folder_Metadata {
  // 这里应该添加实际的字段定义
  [key: string]: any
}

interface Server_Configs_Props {
  id: string
  server_name: string
  url: string
  user_name: string
  password: string
  last_login_at: string
  type: string
}

export const useServerUsersStore = defineStore('serverUsers', () => {
  // 定义状态
  const usersData = reactive({
    percentage_of_local: 0,
    percentage_of_nd: 0,

    server_select_kind: '',

    server_select_library: undefined as Library_Folder_Metadata | undefined,
    server_all_library: [] as Library_Folder_Metadata[],

    server_config_of_current_user_of_sqlite: undefined as Server_Configs_Props | undefined,
    server_config_of_all_user_of_sqlite: [] as Server_Configs_Props[],

    server_config_of_current_user_of_select_servername: '',
    server_config_of_current_user_of_select: undefined as
      | { label: string; value: string }
      | undefined,
    server_config_of_all_user_of_select: [] as { label: string; value: string }[],
  })

  // 获取其他store实例
  const serverUserModelStore = useServerUserModelStore()
  const serverLoginInfoStore = useServerLoginInfoStore()

  // 定义方法
  const get_server_config_of_all_user_of_sqlite = (value: Server_Configs_Props[]) => {
    usersData.server_config_of_all_user_of_sqlite = value
    usersData.server_config_of_all_user_of_select = []
    value.forEach((item: any) => {
      usersData.server_config_of_all_user_of_select.push({
        label: item.type + ' - ' + item.server_name,
        value: item.id,
      })
    })

    const index = usersData.server_config_of_all_user_of_sqlite.findIndex(
      (item) => item.id === usersData.server_config_of_current_user_of_select?.value
    )
    if (index < 0) {
      usersData.server_config_of_current_user_of_sqlite = undefined
      usersData.server_config_of_current_user_of_select = undefined
      usersData.server_config_of_current_user_of_select_servername = ''
    } else {
      usersData.server_config_of_current_user_of_sqlite = 
        usersData.server_config_of_all_user_of_sqlite[index]
      usersData.server_config_of_current_user_of_select = {
        label: 
          usersData.server_config_of_all_user_of_sqlite[index].type +
          ' - ' +
          usersData.server_config_of_all_user_of_sqlite[index].server_name,
        value: usersData.server_config_of_all_user_of_sqlite[index].id,
      }
      usersData.server_config_of_current_user_of_select_servername = 
        usersData.server_config_of_all_user_of_sqlite[index].type +
        ' - ' +
        usersData.server_config_of_all_user_of_sqlite[index].server_name
      serverLoginInfoStore.server_id = 
        usersData.server_config_of_current_user_of_sqlite?.id
      serverLoginInfoStore.server_name = 
        usersData.server_config_of_current_user_of_sqlite?.server_name
      serverUserModelStore.username = 
        usersData.server_config_of_current_user_of_sqlite?.user_name
      serverUserModelStore.password = 
        usersData.server_config_of_current_user_of_sqlite?.password
      serverLoginInfoStore.server_url = 
        usersData.server_config_of_current_user_of_sqlite?.url
    }
  }

  // 暴露状态和方法
  return {
    ...usersData,
    get_server_config_of_all_user_of_sqlite
  }
})