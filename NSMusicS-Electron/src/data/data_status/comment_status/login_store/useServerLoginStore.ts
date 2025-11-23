import { defineStore } from 'pinia'
import { ref } from 'vue'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import axios from 'axios'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { store_server_user_model } from '@/server/server_management/store_server_user_model'
import { store_server_users } from '@/server/server_management/store_server_users'
import { store_general_fetch_home_list } from '@/server/server_api_store/server_api_core/page/page_home/store_general_fetch_home_list'
import { Auth_Token_ApiService_of_NineSong } from '@/server/server_api/ninesong_api/services_web/Auth/Auth_Token/index_service'
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
import { Folder_Entity_ApiService_of_NineSong } from '@/server/server_api/ninesong_api/services_web/Folder_Entity/index_service'

export const useServerLoginStore = defineStore('serverLogin', () => {
  // State using refs (from store_server_login_info.ts)
  const server_url = ref('')
  const server_id = ref('')
  const server_name = ref('')
  const server_input_email = ref('')
  const server_input_username = ref('')
  const server_input_password = ref('')
  const server_accessToken = ref('')
  const server_refreshToken = ref('')
  const scanning_paths = ref([])
  const scanningAll = ref(false)
  
  // Additional state
  const jwt_expire_time = 24 * 60 * 60 * 1000 // 24小时

  // Actions (from store_server_login_logic.ts)
  const checkLoginStatus = async () => {
    store_router_data_info.store_router_history_data_of_local = false
    store_router_data_info.store_router_history_data_of_web = true
    store_system_configs_info.desktop_system_kind = 'docker'
    if (store_server_users.server_select_kind === '') {
      store_server_users.server_select_kind = 'ninesong'
    }

    const lang = String(sessionStorage.getItem('jwt_lang'))
    store_system_configs_info.lang = lang && lang != 'null' ? lang : 'en'

    const currentTime = new Date().getTime()
    server_accessToken.value = String(sessionStorage.getItem('jwt_token'))
    const expireTime = sessionStorage.getItem('jwt_expire_time')

    try {
      if (server_accessToken.value) {
        const response = await axios.get('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${server_accessToken.value}`,
          },
        })
        if (response.data && response.data.name) {
          if (server_accessToken.value && expireTime) {
            const remainingTime = parseInt(expireTime) - currentTime
            if (remainingTime > 0) {
              sessionStorage.setItem('jwt_expire_time', String(currentTime + jwt_expire_time)) // 1 小时

              store_router_data_info.router_select_model_server_login = false
              try {
                await store_system_configs_info.load_app()
              } catch (error) {
                console.log('error load_app 60:', error)
              }
              await store_general_fetch_home_list.fetchData_Home()
              console.log('已登录: ' + server_accessToken.value)

              store_server_user_model.token = server_accessToken.value

              if (store_server_users.server_select_kind === 'ninesong') {
                store_server_user_model.username = server_input_email.value
                store_server_user_model.password = server_input_password.value
              }
              await store_system_configs_save.save_system_config_of_App_Configs()

              await store_server_user_model.init_server_info()

              return true
            } else {
              return server_logout()
            }
          } else {
            return server_logout()
          }
        } else {
          return server_logout()
        }
      } else {
        return server_logout()
      }
    } catch (error) {
      console.error('验证登录状态失败:', error)
      return server_logout()
    }
  }

  const server_login = async (email: string, password: string) => {
    let userData = null
    try {
      const url = 
        store_system_configs_info.desktop_system_kind === 'docker'
          ? '/api'
          : server_url.value
      const response = new Auth_Token_ApiService_of_NineSong(url)
      userData = await response.getAuth_Token(email, password)
      if (userData && userData.accessToken && userData.refreshToken) {
        server_accessToken.value = String(userData.accessToken)
        server_refreshToken.value = String(userData.refreshToken)
        server_url.value = url
        console.log('登录成功:', userData.accessToken)

        const folder_Entity_ApiService_of_NineSong = new Folder_Entity_ApiService_of_NineSong(url)
        store_server_users.server_all_library = 
          await folder_Entity_ApiService_of_NineSong.getFolder_Entity_All()

        // 由于Electron初始化调用此方法，检测是否为docker，防止调用load_app陷入无限循环
        if (store_system_configs_info.desktop_system_kind === 'docker') {
          store_router_data_info.router_select_model_server_login = false
          const expireTime = new Date().getTime() + jwt_expire_time
          sessionStorage.setItem('jwt_token', server_accessToken.value)
          sessionStorage.setItem('jwt_expire_time', expireTime.toString())
          sessionStorage.setItem('email', email)
          try {
            await store_system_configs_info.load_app()
          } catch (error) {
            console.log('error load_app 119:', error)
          }
          ///
          const lang = String(sessionStorage.getItem('jwt_lang'))
          store_system_configs_info.lang = lang && lang != 'null' ? lang : 'en'
          console.log('store_system_configs_info.lang | lang: ' + store_system_configs_info.lang + ' | ' + lang)
          ///
          const route = String(sessionStorage.getItem('jwt_route'))
          let route_path = 
            route && route != '/login' && route != '/null' && route !== 'null' ? route : '/setting'

          // 修复：检查 router 是否为 null，如果为 null 则设置为 '/setting'
          if (store_router_data_info.router === null) {
            route_path = '/setting'
          }
          // 确保 route_path 不为 null 或 'null'
          if (!route_path || route_path === 'null') {
            route_path = '/setting'
          }
          // 特别处理 route_path 为 '/null' 的情况
          if (route_path === '/null') {
            route_path = '/setting'
          }
          store_router_data_info.router.push(route_path)
        }
        return true
      }
    } catch (error) {
      console.error('登录失败，邮箱或密码错误:', error)
      return false
    }
    console.error('未连接到服务器，请检查服务是否部署成功')
    return undefined
  }

  const server_logout = () => {
    sessionStorage.removeItem('jwt_token')
    sessionStorage.removeItem('jwt_expire_time')

    server_accessToken.value = ''

    store_router_data_info.router.push('/login')

    return false
  }

  // Expose state and actions
  return {
    // State
    server_url,
    server_id,
    server_name,
    server_input_email,
    server_input_username,
    server_input_password,
    server_accessToken,
    server_refreshToken,
    scanning_paths,
    scanningAll,
    jwt_expire_time,

    // Actions
    checkLoginStatus,
    server_login,
    server_logout,
  }
})