import { reactive } from 'vue'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import axios from 'axios'
import { store_server_login_info } from './store_server_login_info'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { store_server_user_model } from '@/server/server_management/store_server_user_model'
import { store_server_users } from '@/server/server_management/store_server_users'
import { store_general_fetch_home_list } from '@/server/server_api_store/server_api_core/page/page_home/store_general_fetch_home_list'
import { Auth_Token_ApiService_of_NineSong } from '@/server/server_api/ninesong_api/services_web/Auth/Auth_Token/index_service'
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
import { Folder_Entity_ApiService_of_NineSong } from '@/server/server_api/ninesong_api/services_web/Folder_Entity/index_service'

export const store_server_login_logic = reactive({
  jwt_expire_time: 24 * 60 * 60 * 1000, // 24小时
  async checkLoginStatus() {
    store_router_data_info.store_router_history_data_of_local = false
    store_router_data_info.store_router_history_data_of_web = true
    store_system_configs_info.desktop_system_kind = 'docker'
    if (store_server_users.server_select_kind === '') {
      store_server_users.server_select_kind = 'ninesong'
    }

    const currentTime = new Date().getTime()
    store_server_login_info.server_accessToken = String(localStorage.getItem('jwt_token'))
    const expireTime = localStorage.getItem('jwt_expire_time')

    try {
      if (store_server_login_info.server_accessToken) {
        const response = await axios.get('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${store_server_login_info.server_accessToken}`,
          },
        })
        if (response.data && response.data.name) {
          if (store_server_login_info.server_accessToken && expireTime) {
            const remainingTime = parseInt(expireTime) - currentTime
            if (remainingTime > 0) {
              localStorage.setItem('jwt_expire_time', String(currentTime + this.jwt_expire_time)) // 1 小时

              store_router_data_info.router_select_model_server_login = false
              try {
                await store_system_configs_info.load_app()
              } catch (error) {
                console.log('error load_app 45:', error)
              }
              ///
              const lang = String(localStorage.getItem('jwt_lang'))
              if (store_system_configs_info.lang != 'en')
                store_system_configs_info.lang = lang && lang != 'null' && lang != '' ? lang : 'en'
              console.log('store_system_configs_info.lang | lang: ' + store_system_configs_info.lang + ' | ' + lang)
              ///
              await store_general_fetch_home_list.fetchData_Home()
              console.log('已登录: ' + store_server_login_info.server_accessToken)

              store_server_user_model.token = store_server_login_info.server_accessToken

              if (store_server_users.server_select_kind === 'ninesong') {
                store_server_user_model.username = store_server_login_info.server_input_email
                store_server_user_model.password = store_server_login_info.server_input_password
              }
              await store_system_configs_save.save_system_config_of_App_Configs()

              await store_server_user_model.init_server_info()

              return true
            } else {
              return this.server_logout()
            }
          } else {
            return this.server_logout()
          }
        } else {
          return this.server_logout()
        }
      } else {
        return this.server_logout()
      }
    } catch (error) {
      // 跨页面不给予认证，直接输出
      console.log('状态error:', error)
      return this.server_logout()
    }
  },
  async server_login(email: string, password: string) {
    let userData = null
    try {
      const url =
        store_system_configs_info.desktop_system_kind === 'docker'
          ? '/api'
          : store_server_login_info.server_url
      const response = new Auth_Token_ApiService_of_NineSong(url)
      userData = await response.getAuth_Token(email, password)
      if (userData && userData.accessToken && userData.refreshToken) {
        store_server_login_info.server_accessToken = String(userData.accessToken)
        store_server_login_info.server_refreshToken = String(userData.refreshToken)
        store_server_login_info.server_url = url
        console.log('登录成功:', userData.accessToken)

        const folder_Entity_ApiService_of_NineSong = new Folder_Entity_ApiService_of_NineSong(url)
        store_server_users.server_all_library =
          await folder_Entity_ApiService_of_NineSong.getFolder_Entity_All()

        // 由于Electron初始化调用此方法，检测是否为docker，防止调用load_app陷入无限循环
        if (store_system_configs_info.desktop_system_kind === 'docker') {
          store_router_data_info.router_select_model_server_login = false
          const expireTime = new Date().getTime() + this.jwt_expire_time
          localStorage.setItem('jwt_token', store_server_login_info.server_accessToken)
          localStorage.setItem('jwt_expire_time', expireTime.toString())
          localStorage.setItem('email', email)
          try {
            await store_system_configs_info.load_app()
          } catch (error) {
            console.log('error load_app 103:', error)
          }
          ///
          const lang = String(localStorage.getItem('jwt_lang'))
          if (store_system_configs_info.lang != 'en')
            store_system_configs_info.lang = lang && lang != 'null' && lang != '' ? lang : 'en'
          console.log('store_system_configs_info.lang | lang: ' + store_system_configs_info.lang + ' | ' + lang)
          ///
          const route = String(localStorage.getItem('jwt_route'))
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
  },
  server_logout() {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('jwt_expire_time')

    store_server_login_info.server_accessToken = ''

    store_router_data_info.router.push('/login')

    if (!localStorage.getItem("hasReloaded")) {
      localStorage.setItem("hasReloaded", "true");
      // 快速刷新，修复lang获取缺陷，因为本地缓存第一次获取不到lang
      window.location.reload();
    } else {
      // 可选：清除标记，以便下次进入页面时能再次刷新
      localStorage.removeItem("hasReloaded");
    }

    return false
  },
})
