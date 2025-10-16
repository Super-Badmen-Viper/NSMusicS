import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useSystemConfigsSaveStore } from '@/data/data_pinia_stores/local_system_stores/store_system_configs_save'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { useRouterDataInfoStore } from '@/router/router_store/store_router_data_info'
import { useSystemConfigsLoadStore } from '@/data/data_pinia_stores/local_system_stores/store_system_configs_load'
import { useSystemConfigsUpdateStore } from '@/data/data_pinia_stores/local_system_stores/store_system_configs_update'

export const useSystemConfigsInfoStore = defineStore('systemConfigsInfo', () => {
  // 状态定义
  const desktop_system_kind = ref('win32')
  const lang = ref('en')
  const theme = ref(null)
  const theme_name = ref('lightTheme')
  const theme_app = ref(null)
  const update_theme = ref(false)
  const theme_auto_system = ref(false)
  const window_innerWidth = ref(1220)
  const window_innerHeight = ref(765)
  const window_max = ref(false)
  const window_full = ref(false)
  const window_state_miniplayer = ref(false)
  const window_state_miniplayer_card = ref(false)
  const window_state_miniplayer_desktop_lyric = ref(false)
  const window_state_miniplayer_album = ref(false)
  const window_state_miniplayer_playlist = ref(false)
  const update_show = ref(false)
  const version = ref('')
  const version_updated = ref(0)
  const version_update_address = ref('')
  const version_update_explain = ref('')
  const driveDbPath = ref('')
  const driveTempPath = ref('')
  const resourcesPath = ref('')
  const navidrome_db = ref(null)
  const nsmusics_db = ref(null)
  const menuOptions_selectd_model_1 = ref(true)
  const menuOptions_selectd_model_2 = ref(true)
  const menuOptions_selectd_model_3 = ref(true)
  const menuOptions_selectd_model_4 = ref(true)
  const app_view_menuOptions = ref([])
  const app_view_bar_show = ref(true)
  const app_view_left_menu_collapsed = ref(true)
  const app_view_left_menu_show = ref(false)
  const app_view_left_menu_select_activeKey = ref('')
  const app_view_local_client_menuOptions = ref([])
  const app_view_local_client_menuOptions_select_activeKey = ref('')
  const app_view_local_client_setting_select_tab_name = ref('type-group-0-1')
  const app_view_server_client_menuOptions = ref([])
  const app_view_server_client_menuOptions_select_activeKey = ref('')
  const app_view_server_client_setting_select_tab_name = ref('type-group-0-1')

  // 获取其他store的引用
  const systemConfigsSaveStore = useSystemConfigsSaveStore()
  const routerDataInfoStore = useRouterDataInfoStore()
  const systemConfigsLoadStore = useSystemConfigsLoadStore()
  const systemConfigsUpdateStore = useSystemConfigsUpdateStore()

  // 方法定义
  async function load_app() {
    //// init db data
    try {
      if (isElectron) {
        // 等待数据库初始化进程结束
        if (await ipcRenderer.invoke('window-init-db')) {
          desktop_system_kind.value = process.platform
          //
          navidrome_db.value = await ipcRenderer.invoke('window-get-navidrome-db')
          nsmusics_db.value = await ipcRenderer.invoke('window-get-nsmusics-db')
          console.log(navidrome_db.value)
          console.log(nsmusics_db.value)
          // noLogin
          routerDataInfoStore.router_select_model_server_login = false
          // init read
          await systemConfigsLoadStore.load_app_config()
        }
      } else {
        // init read
        await systemConfigsLoadStore.load_app_config()
      }
    } catch {}
    if (isElectron) {
      /// update_info
      try {
        version.value = '2.0.2'
        console.log('Current Version:', version.value)
        const xmlUrl = 
          'https://github.com/Super-Badmen-Viper/NSMusicS/releases/download/NSMusicS-Win-Update/NSMusicS.xml'
        await systemConfigsUpdateStore.fetchAndParseXML(xmlUrl)
        console.log('Last Version:', systemConfigsUpdateStore.getVersion())
        version_update_explain.value = 
          systemConfigsUpdateStore.changelog_explain.replace(/;/g, '<br>')
        version_update_address.value = systemConfigsUpdateStore.url
        if (version.value < systemConfigsUpdateStore.getVersion()) {
          version_updated.value = 1
        }
      } catch {
        version_updated.value = 0
      }
    }
  }

  // 监听器定义（这些监听器会在store创建时自动设置）
  watch(
    lang,
    (newValue) => {
      console.log(newValue)
      sessionStorage.setItem('jwt_lang', String(newValue))
      systemConfigsSaveStore.save_system_config_of_App_Configs()
    }
  )
  
  watch(
    app_view_left_menu_select_activeKey,
    () => {
      systemConfigsSaveStore.save_system_config_of_App_Configs()
    }
  )
  
  watch(
    app_view_left_menu_collapsed,
    (newValue) => {
      app_view_left_menu_show.value = !newValue
      systemConfigsSaveStore.save_system_config_of_App_Configs()
    }
  )
  
  watch(
    app_view_left_menu_show,
    (newValue) => {
      app_view_left_menu_collapsed.value = !newValue
      systemConfigsSaveStore.save_system_config_of_App_Configs()
    }
  )

  return {
    // 状态暴露
    desktop_system_kind,
    lang,
    theme,
    theme_name,
    theme_app,
    update_theme,
    theme_auto_system,
    window_innerWidth,
    window_innerHeight,
    window_max,
    window_full,
    window_state_miniplayer,
    window_state_miniplayer_card,
    window_state_miniplayer_desktop_lyric,
    window_state_miniplayer_album,
    window_state_miniplayer_playlist,
    update_show,
    version,
    version_updated,
    version_update_address,
    version_update_explain,
    driveDbPath,
    driveTempPath,
    resourcesPath,
    navidrome_db,
    nsmusics_db,
    menuOptions_selectd_model_1,
    menuOptions_selectd_model_2,
    menuOptions_selectd_model_3,
    menuOptions_selectd_model_4,
    app_view_menuOptions,
    app_view_bar_show,
    app_view_left_menu_collapsed,
    app_view_left_menu_show,
    app_view_left_menu_select_activeKey,
    app_view_local_client_menuOptions,
    app_view_local_client_menuOptions_select_activeKey,
    app_view_local_client_setting_select_tab_name,
    app_view_server_client_menuOptions,
    app_view_server_client_menuOptions_select_activeKey,
    app_view_server_client_setting_select_tab_name,
    // 方法暴露
    load_app
  }
})