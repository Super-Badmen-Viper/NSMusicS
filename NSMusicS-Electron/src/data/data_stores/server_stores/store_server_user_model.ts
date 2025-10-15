import { reactive, watch } from 'vue'
import { store_app_configs_logic_save } from '@/data/data_stores/app_stores/store_app_configs_logic_save'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_server_users } from '@/data/data_stores/server_stores/store_server_users'
import { store_playlist_list_info } from '@/views/view_app/components/player_list/store/store_playlist_list_info'
import { store_player_audio_info } from '@/views/view_app/page/page_player/store/store_player_audio_info'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { store_playlist_list_logic } from '@/views/view_app/components/player_list/store/store_playlist_list_logic'
import { store_app_configs_logic_load } from '@/data/data_stores/app_stores/store_app_configs_logic_load'
import { User_Authorization_ApiWebService_of_ND } from '@/data/data_configs/servers_configs/navidrome_api/services_web/user_authorization/index_service'
import { store_player_audio_logic } from '@/views/view_app/page/page_player/store/store_player_audio_logic'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { store_view_media_page_logic } from '@/views/view_app/page/page_media/store/store_view_media_page_logic'
import { store_view_album_page_logic } from '@/views/view_app/page/page_album/store/store_view_album_page_logic'
import { store_view_artist_page_logic } from '@/views/view_app/page/page_artist/store/store_view_artist_page_logic'
import { store_server_auth_token } from './server_api_abstract/auth/auth_token'
import { Auth_Token_ApiService_of_NineSong } from '@/data/data_configs/servers_configs/ninesong_api/services_web/Auth/Auth_Token/index_service'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
import { store_app_configs_info } from '@/data/data_stores/app_stores/store_app_configs_info'
import { store_server_login_logic } from '@/views/view_server/page_login/store/store_server_login_logic'
import { Folder_Entity_ApiService_of_NineSong } from '@/data/data_configs/servers_configs/ninesong_api/services_web/Folder_Entity/index_service'
import { store_general_fetch_player_list } from './server_api_abstract/music_scene/components/player_list/store_general_fetch_player_list'

export const store_server_user_model = reactive({
  model_select: 'server',
  server_select: '',
  server_select_kind: '',

  username: '',
  salt: '',
  token: '',
  password: '',
  authorization_of_nd: '',

  server_login_model_of_apikey: false,
  userid_of_Je: '',
  authorization_of_Je: '',
  parentid_of_Je: [],
  parentid_of_Je_Music: '',

  model_server_type_of_web: true,
  model_server_type_of_local: false,
  model_server_type_of_local_server_download: false,
  client_unique_id: '',
  server_get_count: 15,

  album: 'album',
  annotation: 'annotation',
  artist: 'artist',
  media_file: 'media_file',
  playlist: 'playlist',
  playlist_tracks: 'playlist_tracks',

  library_path: '',

  random_play_model: false,
  random_play_model_add: false,
  random_play_model_search: false,

  async switchToMode_Local() {
    this.album = 'album'
    this.annotation = 'annotation'
    this.artist = 'artist'
    this.media_file = 'media_file'
    this.playlist = 'playlist'
    this.playlist_tracks = 'playlist_tracks'

    store_server_user_model.model_server_type_of_local_server_download = false
    store_player_audio_logic.drawer_order_height = 160

    store_server_user_model.model_select = 'local'
    await this.switchToMode()
  },
  async switchToMode_Server() {
    this.album = 'server_album'
    this.annotation = 'server_annotation'
    this.artist = 'server_artist'
    this.media_file = 'server_media_file'
    this.playlist = 'server_playlist'
    this.playlist_tracks = 'server_playlist_tracks'

    if (
      store_server_users.server_select_kind != 'jellyfin' &&
      store_server_users.server_select_kind != 'emby'
    ) {
      store_player_audio_logic.drawer_order_height = 198
    } else {
      store_player_audio_logic.drawer_order_height = 160
    }

    store_server_user_model.model_select = 'server'
    await this.switchToMode()
  },
  async switchToMode() {
    if (!store_app_configs_logic_load.app_configs_loading) {
      store_server_user_model.random_play_model = false
      // Refresh Current AudioInfo
      await store_player_audio_info.reset_data()
      store_general_fetch_player_list._totalCount = 0
      store_view_media_page_logic.page_songlists_keywordFilter = ''
      store_view_media_page_logic.page_songlists_selected = 'song_list_all'
      store_view_album_page_logic.page_albumlists_selected = 'album_list_all'
      store_view_artist_page_logic.page_artistlists_selected = 'artist_list_all'
      if (store_player_audio_logic.player_select === 'mpv') {
        if (isElectron) {
          await ipcRenderer.invoke('mpv-stopped')
        } else {
          // other
        }
      }
      //
      if (store_server_user_model.model_select === 'server') {
        store_server_users.percentage_of_nd = 100
        store_server_users.percentage_of_local = 0
        // auto model_server_type_of_web
        store_server_user_model.model_server_type_of_web = true
        store_router_data_info.store_router_history_data_of_local = false
        store_router_data_info.store_router_history_data_of_web = true
      } else {
        store_server_users.percentage_of_nd = 0
        store_server_users.percentage_of_local = 100
        //
        store_server_user_model.model_server_type_of_local = true
        store_server_user_model.model_server_type_of_web = false
        //
        store_router_data_info.store_router_history_data_of_local = true
        store_router_data_info.store_router_history_data_of_web = false
      }
      //
      try {
        await store_player_audio_logic.init_player()
      } catch {}
      // Refresh Playlist(Local / Server)
      await store_playlist_list_logic.reset_data()
      store_playlist_list_info.playlist_MediaFiles_temporary = []
      // Refresh Router Data
      store_router_data_logic.reset_data()
      //
      store_app_configs_logic_save.save_system_config_of_App_Configs()
    }
  },

  async refresh_model_server_type_of_web() {
    if (store_server_users.server_select_kind === 'navidrome') {
      const user_Authorization_ApiWebService_of_ND = new User_Authorization_ApiWebService_of_ND(
        store_server_users.server_config_of_current_user_of_sqlite?.url
      )
      return await user_Authorization_ApiWebService_of_ND.get_token()
    } else if (store_server_users.server_select_kind === 'ninesong') {
      if (
        store_server_users.server_config_of_current_user_of_sqlite?.url === undefined ||
        store_server_users.server_config_of_current_user_of_sqlite?.url.length === 0
      ) {
        store_server_users.server_config_of_current_user_of_sqlite.url =
          store_app_configs_info.desktop_system_kind === 'docker'
            ? '/api'
            : store_server_login_info.server_url
      }
      store_server_login_info.server_url =
        store_server_users.server_config_of_current_user_of_sqlite?.url
      const auth_Token_ApiService_of_NineSong = new Auth_Token_ApiService_of_NineSong(
        store_server_login_info.server_url
      )
      if (
        store_server_user_model.username === undefined ||
        store_server_user_model.username.length === 0
      ) {
        store_server_user_model.username = String(sessionStorage.getItem('email'))
      }
      if (store_server_user_model.password.length > 0) {
        const userData = await auth_Token_ApiService_of_NineSong.getAuth_Token(
          store_server_user_model.username,
          store_server_user_model.password
        )
        if (userData && userData.accessToken && userData.refreshToken) {
          store_server_login_info.server_accessToken = String(userData.accessToken)
          store_server_login_info.server_refreshToken = String(userData.refreshToken)
          store_server_auth_token.test_init_server_token()

          const folder_Entity_ApiService_of_NineSong = new Folder_Entity_ApiService_of_NineSong(url)
          store_server_users.server_all_library =
            await folder_Entity_ApiService_of_NineSong.getFolder_Entity_All()
        } else {
          if (store_app_configs_info.desktop_system_kind === 'docker') {
            store_server_login_logic.server_logout()
          }
          return false
        }
      } else {
        if (store_app_configs_info.desktop_system_kind === 'docker') {
          store_server_login_logic.server_logout()
        }
        return false
      }
    }
    store_app_configs_logic_save.save_system_config_of_App_Configs()

    return true
  },

  async init_server_info() {
    // store_server_users.server_config_of_current_user_of_sqlite = {
    //     id: store_server_user_model.username,
    //     server_name: 'nsmusics',
    //     url: '/api',
    //     user_name: store_server_user_model.username,
    //     password: store_server_user_model.password,
    //     last_login_at: new Date().toISOString().split('.')[0] + 'Z',
    //     type: 'ninesong'
    // }
  },
})
watch(
  () => store_server_user_model.model_server_type_of_web,
  (newValue) => {
    store_server_user_model.model_server_type_of_local = !newValue
    if (newValue) {
      store_router_data_info.store_router_history_data_of_local = false
      store_router_data_info.store_router_history_data_of_web = true
    } else {
      store_router_data_info.store_router_history_data_of_local = true
      store_router_data_info.store_router_history_data_of_web = false
    }
    store_app_configs_logic_save.save_system_config_of_App_Configs()
  }
)
watch(
  () => store_server_user_model.model_server_type_of_local,
  (newValue) => {
    store_server_user_model.model_server_type_of_web = !newValue
    store_app_configs_logic_save.save_system_config_of_App_Configs()
  }
)
