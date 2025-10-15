import { reactive, watch } from 'vue'
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_system_configs_load } from './store_system_configs_load'
import { store_system_configs_update } from './store_system_configs_update'

export const store_system_configs_info = reactive({
  // Electron Desktop Kind
  desktop_system_kind: 'win32',

  // app language
  lang: 'en',

  // app theme
  theme: null,
  theme_name: 'lightTheme',
  theme_app: null,
  update_theme: false,
  theme_auto_system: false,

  // Electron Windows Size
  window_innerWidth: 1220,
  window_innerHeight: 765,
  window_max: false,
  window_full: false,

  // Electron MiniPlayer
  window_state_miniplayer: false,
  window_state_miniplayer_card: false,
  window_state_miniplayer_desktop_lyric: false,
  window_state_miniplayer_album: false,
  window_state_miniplayer_playlist: false,

  // app update
  update_show: false,
  version: '',
  version_updated: 0,
  version_update_address: '',
  version_update_explain: '',

  // app sqlite data
  driveDbPath: '',
  driveTempPath: '',
  resourcesPath: '',
  navidrome_db: null, // path.resolve('resources/navidrome.db'),
  nsmusics_db: null, // path.resolve('resources/nsmusics.db'),

  // app left menu
  menuOptions_selectd_model_1: true,
  menuOptions_selectd_model_2: true,
  menuOptions_selectd_model_3: true,
  menuOptions_selectd_model_4: true,

  // app
  app_view_menuOptions: [],
  app_view_bar_show: true,
  app_view_left_menu_collapsed: true,
  app_view_left_menu_show: false,
  app_view_left_menu_select_activeKey: '',
  // local_client
  app_view_local_client_menuOptions: [],
  app_view_local_client_menuOptions_select_activeKey: '',
  app_view_local_client_setting_select_tab_name: 'type-group-0-1',
  // server_client
  app_view_server_client_menuOptions: [],
  app_view_server_client_menuOptions_select_activeKey: '',
  app_view_server_client_setting_select_tab_name: 'type-group-0-1',

  async load_app() {
    //// init db data
    try {
      if (isElectron) {
        // 等待数据库初始化进程结束
        if (await ipcRenderer.invoke('window-init-db')) {
          store_system_configs_info.desktop_system_kind = process.platform
          //
          store_system_configs_info.navidrome_db = await ipcRenderer.invoke('window-get-navidrome-db')
          store_system_configs_info.nsmusics_db = await ipcRenderer.invoke('window-get-nsmusics-db')
          console.log(store_system_configs_info.navidrome_db)
          console.log(store_system_configs_info.nsmusics_db)
          // noLogin
          store_router_data_info.router_select_model_server_login = false
          // init read
          await store_system_configs_load.load_app_config()
        }
      } else {
        // init read
        await store_system_configs_load.load_app_config()
      }
    } catch {}
    if (isElectron) {
      /// update_info
      try {
        store_system_configs_info.version = '2.0.2'
        console.log('Current Version:', store_system_configs_info.version)
        const xmlUrl =
          'https://github.com/Super-Badmen-Viper/NSMusicS/releases/download/NSMusicS-Win-Update/NSMusicS.xml'
        await store_system_configs_update.fetchAndParseXML(xmlUrl)
        console.log('Last Version:', store_system_configs_update.getVersion())
        store_system_configs_info.version_update_explain =
          store_system_configs_update.changelog_explain.replace(/;/g, '<br>')
        store_system_configs_info.version_update_address = store_system_configs_update.url
        if (store_system_configs_info.version < store_system_configs_update.getVersion()) {
          store_system_configs_info.version_updated = 1
        }
      } catch {
        store_system_configs_info.version_updated = 0
      }
    }
  },
})
watch(
  () => store_system_configs_info.lang,
  (newValue) => {
    console.log(newValue)
    sessionStorage.setItem('jwt_lang', String(newValue))
    store_system_configs_save.save_system_config_of_App_Configs()
  }
)
watch(
  () => store_system_configs_info.app_view_left_menu_select_activeKey,
  (newValue) => {
    store_system_configs_save.save_system_config_of_App_Configs()
  }
)
watch(
  () => store_system_configs_info.app_view_left_menu_collapsed,
  (newValue) => {
    store_system_configs_info.app_view_left_menu_show =
      !store_system_configs_info.app_view_left_menu_collapsed
    store_system_configs_save.save_system_config_of_App_Configs()
  }
)
watch(
  () => store_system_configs_info.app_view_left_menu_show,
  (newValue) => {
    store_system_configs_info.app_view_left_menu_collapsed =
      !store_system_configs_info.app_view_left_menu_show
    store_system_configs_save.save_system_config_of_App_Configs()
  }
)
