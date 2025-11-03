import { reactive } from 'vue'
import { store_server_user_model } from '@/server/server_management/store_server_user_model'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'

export const store_server_users = reactive({
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

  get_server_config_of_all_user_of_sqlite(value: Server_Configs_Props[]) {
    store_server_users.server_config_of_all_user_of_sqlite = value
    store_server_users.server_config_of_all_user_of_select = []
    value.forEach((item: any) => {
      store_server_users.server_config_of_all_user_of_select.push({
        label: item.type + ' - ' + item.server_name,
        value: item.id,
      })
    })

    const index = store_server_users.server_config_of_all_user_of_sqlite.findIndex(
      (item) => item.id === store_server_users.server_config_of_current_user_of_select?.value
    )
    if (index < 0) {
      store_server_users.server_config_of_current_user_of_sqlite = undefined
      store_server_users.server_config_of_current_user_of_select = undefined
      store_server_users.server_config_of_current_user_of_select_servername = ''
    } else {
      store_server_users.server_config_of_current_user_of_sqlite =
        store_server_users.server_config_of_all_user_of_sqlite[index]
      store_server_users.server_config_of_current_user_of_select = {
        label:
          store_server_users.server_config_of_all_user_of_sqlite[index].type +
          ' - ' +
          store_server_users.server_config_of_all_user_of_sqlite[index].server_name,
        value: store_server_users.server_config_of_all_user_of_sqlite[index].id,
      }
      store_server_users.server_config_of_current_user_of_select_servername =
        store_server_users.server_config_of_all_user_of_sqlite[index].type +
        ' - ' +
        store_server_users.server_config_of_all_user_of_sqlite[index].server_name
      store_server_login_info.server_id =
        store_server_users.server_config_of_current_user_of_sqlite?.id
      store_server_login_info.server_name =
        store_server_users.server_config_of_current_user_of_sqlite?.server_name
      store_server_user_model.username =
        store_server_users.server_config_of_current_user_of_sqlite?.user_name
      store_server_user_model.password =
        store_server_users.server_config_of_current_user_of_sqlite?.password
      store_server_login_info.server_url =
        store_server_users.server_config_of_current_user_of_sqlite?.url
    }
  },
})
