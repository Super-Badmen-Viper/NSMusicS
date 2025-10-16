import { defineStore } from 'pinia'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { store_player_audio_info } from '@/views/view_app/page/page_player/store/store_player_audio_info'
import { store_playlist_list_info } from '@/views/view_app/components/player_list/store/store_playlist_list_info'
import { store_player_audio_logic } from '@/views/view_app/page/page_player/store/store_player_audio_logic'
import { Users_ApiService_of_Je } from '@/data/data_configs/jellyfin_api/services_web/Users/index_service'
import { Library_ApiService_of_Je } from '@/data/data_configs/jellyfin_api/services_web/Library/index_service'
import { useServerNavidromeUserDataLogicStore } from '@/data/data_pinia_stores/server_configs_stores/server_data_select/server_ninesong_user_data/store_server_ninesong_userdata_logic'
import { useServerModelStatisticsStore } from '@/data/data_pinia_stores/server_api_stores/server_api_core/model/model_statistics'
import { store_server_login_logic } from '@/views/view_server/page_login/store/store_server_login_logic'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'

export const useServerAuthTokenStore = defineStore('serverAuthToken', () => {
  // 获取其他store的引用
  const serverUserModelStore = useServerUserModelStore()
  const serverUsersStore = useServerUsersStore()
  const serverModelStatisticsStore = useServerModelStatisticsStore()
  const serverNavidromeEncryptedPassword = useServerNavidromeUserDataLogicStore()

  /**
   * 初始化服务器登录
   */
  async function init_login_server() {
    if (serverUsersStore.server_select_kind === 'ninesong') {
      await store_server_login_logic.server_login(
        serverUserModelStore.username,
        serverUserModelStore.password
      )
    } else if (serverUsersStore.server_select_kind === 'navidrome') {
      const { salt, token } = serverNavidromeEncryptedPassword.navidrome_get_EncryptedPassword(
        serverUserModelStore.password
      )
      serverUserModelStore.salt = salt
      serverUserModelStore.token = token
    } else if (
      serverUsersStore.server_select_kind === 'jellyfin' ||
      serverUsersStore.server_select_kind === 'emby'
    ) {
      if (serverUserModelStore.server_login_model_of_apikey) {
        serverUserModelStore.authorization_of_Je =
          serverUsersStore.server_config_of_current_user_of_sqlite?.user_name
        // load User
        const userService = new Users_ApiService_of_Je(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url
        )
        const result = await userService.getUsers_ALL()
        const server_set_of_addUser_of_apikey_user_option = []
        serverUserModelStore.userid_of_Je = ''
        if (result) {
          if (Array.isArray(result) && result.length > 0) {
            result.forEach((row: any, index: number) => {
              server_set_of_addUser_of_apikey_user_option.push({
                label: row.Name,
                value: row.Id,
              })
            })
            serverUserModelStore.userid_of_Je =
              server_set_of_addUser_of_apikey_user_option[0].value
            // load Library parentid_of_Je
            const library_ApiService_of_Je = new Library_ApiService_of_Je(
              serverUsersStore.server_config_of_current_user_of_sqlite?.url
            )
            const result_parentIds = await library_ApiService_of_Je.getLibrary_MediaFolders_ALL()
            serverUserModelStore.parentid_of_Je = []
            if (result_parentIds.Items) {
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
            }
          }
        }
      } else {
        const data = await new Users_ApiService_of_Je(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url
        ).authenticateUserByName(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url,
          serverUserModelStore.username,
          serverUserModelStore.password
        )
        serverUserModelStore.authorization_of_Je = data.AccessToken
        serverUserModelStore.userid_of_Je = data.User.Id
        await serverModelStatisticsStore.get_page_top_info()
        // load Library parentid_of_Je
        const library_ApiService_of_Je = new Library_ApiService_of_Je(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url
        )
        const result_parentIds = await library_ApiService_of_Je.getLibrary_MediaFolders_ALL()
        serverUserModelStore.parentid_of_Je = []
        if (result_parentIds.Items) {
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
        }
      }
    }
  }

  /**
   * 测试初始化服务器token
   */
  function test_init_server_token() {
    if (serverUserModelStore.model_server_type_of_web) {
      if (serverUsersStore.server_select_kind === 'ninesong') {
        replaceTokens(
          /access_token=([^&]*)/,
          'access_token',
          store_server_login_info.server_accessToken
        )
      } else if (
        serverUsersStore.server_select_kind === 'jellyfin' ||
        serverUsersStore.server_select_kind === 'emby'
      ) {
        replaceTokens(
          /api_key=([^&]*)/,
          'api_key',
          serverUserModelStore.authorization_of_Je
        )
      }
    }
  }

  /**
   * 替换URL中的token
   */
  function replaceTokens(regex: RegExp, tokenName: string, newToken: string | undefined) {
    if (!newToken) return

    const updateUrl = (url: string): string => {
      const match = url.match(regex)
      if (match) {
        // 如果匹配到的token值为空或不存在，直接替换为新token
        return url.replace(regex, `${tokenName}=${newToken}`)
      }
      // 如果不存在匹配项，直接追加新token
      const separator = url.includes('?') ? '&' : '?'
      return `${url}${separator}${tokenName}=${newToken}`
    }

    // 更新 this_audio_file_path
    if (store_player_audio_info.this_audio_file_path) {
      store_player_audio_info.this_audio_file_path = updateUrl(
        store_player_audio_info.this_audio_file_path
      )
    }

    // 更新 this_audio_file_medium_image_url
    if (store_player_audio_info.this_audio_file_medium_image_url) {
      store_player_audio_info.this_audio_file_medium_image_url = updateUrl(
        store_player_audio_info.this_audio_file_medium_image_url
      )
    }

    // 更新 playlist_MediaFiles_temporary
    store_playlist_list_info.playlist_MediaFiles_temporary.forEach((item: any) => {
      if (item.medium_image_url) {
        item.medium_image_url = updateUrl(item.medium_image_url)
      }
      if (item.path) {
        item.path = updateUrl(item.path)
      }
      if (item.duration) {
        item.duration_txt = store_player_audio_logic.formatTime_RunTimeTicks(item.duration)
      }
    })
  }

  // 暴露方法
  return {
    init_login_server,
    test_init_server_token,
    replaceTokens
  }
})