import { defineStore } from 'pinia'
import { reactive, watch, ref } from 'vue'
import { useSystemConfigsSaveStore } from '@/data/data_pinia_stores/local_system_stores/store_system_configs_save'
import { useRouterDataInfoStore } from '@/router/router_store/store_router_data_info'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { usePlaylistListInfoStore } from '@/views/view_app/components/player_list/store/store_playlist_list_info'
import { usePlayerAudioInfoStore } from '@/views/view_app/page/page_player/store/store_player_audio_info'
import { useRouterDataLogicStore } from '@/router/router_store/store_router_data_logic'
import { usePlaylistListLogicStore } from '@/views/view_app/components/player_list/store/store_playlist_list_logic'
import { useSystemConfigsLoadStore } from '@/data/data_pinia_stores/local_system_stores/store_system_configs_load'
import { User_Authorization_ApiWebService_of_ND } from '@/data/data_configs/navidrome_api/services_web/user_authorization/index_service'
import { usePlayerAudioLogicStore } from '@/views/view_app/page/page_player/store/store_player_audio_logic'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { useViewMediaPageLogicStore } from '@/views/view_app/page/page_media/store/store_view_media_page_logic'
import { useViewAlbumPageLogicStore } from '@/views/view_app/page/page_album/store/store_view_album_page_logic'
import { useViewArtistPageLogicStore } from '@/views/view_app/page/page_artist/store/store_view_artist_page_logic'
import { useServerAuthTokenStore } from '@/data/data_pinia_stores/server_api_stores/server_api_auth/auth_token'
import { Auth_Token_ApiService_of_NineSong } from '@/data/data_configs/ninesong_api/services_web/Auth/Auth_Token/index_service'
import { useServerLoginInfoStore } from '@/views/view_server/page_login/store/store_server_login_info'
import { useSystemConfigsInfoStore } from '@/data/data_pinia_stores/local_system_stores/store_system_configs_info'
import { useServerLoginLogicStore } from '@/views/view_server/page_login/store/store_server_login_logic'
import { Folder_Entity_ApiService_of_NineSong } from '@/data/data_configs/ninesong_api/services_web/Folder_Entity/index_service'
import { useGeneralFetchPlayerListStore } from '@/data/data_pinia_stores/server_api_stores/server_api_core/components/player_list/store_general_fetch_player_list'

export const useServerUserModelStore = defineStore('serverUserModel', () => {
  // 定义状态
  const userModel = reactive({
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
    random_play_model_search: false
  })

  // 获取其他store实例
  const systemConfigsSaveStore = useSystemConfigsSaveStore()
  const routerDataInfoStore = useRouterDataInfoStore()
  const serverUsersStore = useServerUsersStore()
  const playlistListInfoStore = usePlaylistListInfoStore()
  const playerAudioInfoStore = usePlayerAudioInfoStore()
  const routerDataLogicStore = useRouterDataLogicStore()
  const playlistListLogicStore = usePlaylistListLogicStore()
  const systemConfigsLoadStore = useSystemConfigsLoadStore()
  const playerAudioLogicStore = usePlayerAudioLogicStore()
  const viewMediaPageLogicStore = useViewMediaPageLogicStore()
  const viewAlbumPageLogicStore = useViewAlbumPageLogicStore()
  const viewArtistPageLogicStore = useViewArtistPageLogicStore()
  const serverAuthTokenStore = useServerAuthTokenStore()
  const serverLoginInfoStore = useServerLoginInfoStore()
  const systemConfigsInfoStore = useSystemConfigsInfoStore()
  const serverLoginLogicStore = useServerLoginLogicStore()
  const generalFetchPlayerListStore = useGeneralFetchPlayerListStore()

  // 定义方法
  const switchToMode_Local = async () => {
    userModel.album = 'album'
    userModel.annotation = 'annotation'
    userModel.artist = 'artist'
    userModel.media_file = 'media_file'
    userModel.playlist = 'playlist'
    userModel.playlist_tracks = 'playlist_tracks'

    userModel.model_server_type_of_local_server_download = false
    playerAudioLogicStore.drawer_order_height = 160

    userModel.model_select = 'local'
    await switchToMode()
  }

  const switchToMode_Server = async () => {
    userModel.album = 'server_album'
    userModel.annotation = 'server_annotation'
    userModel.artist = 'server_artist'
    userModel.media_file = 'server_media_file'
    userModel.playlist = 'server_playlist'
    userModel.playlist_tracks = 'server_playlist_tracks'

    if (
      serverUsersStore.server_select_kind != 'jellyfin' &&
      serverUsersStore.server_select_kind != 'emby'
    ) {
      playerAudioLogicStore.drawer_order_height = 198
    } else {
      playerAudioLogicStore.drawer_order_height = 160
    }

    userModel.model_select = 'server'
    await switchToMode()
  }

  const switchToMode = async () => {
    if (!systemConfigsLoadStore.app_configs_loading) {
      userModel.random_play_model = false
      // Refresh Current AudioInfo
      await playerAudioInfoStore.reset_data()
      generalFetchPlayerListStore._totalCount = 0
      viewMediaPageLogicStore.page_songlists_keywordFilter = ''
      viewMediaPageLogicStore.page_songlists_selected = 'song_list_all'
      viewAlbumPageLogicStore.page_albumlists_selected = 'album_list_all'
      viewArtistPageLogicStore.page_artistlists_selected = 'artist_list_all'
      if (playerAudioLogicStore.player_select === 'mpv') {
        if (isElectron) {
          await ipcRenderer.invoke('mpv-stopped')
        }
      }
      //
      if (userModel.model_select === 'server') {
        serverUsersStore.percentage_of_nd = 100
        serverUsersStore.percentage_of_local = 0
        // auto model_server_type_of_web
        userModel.model_server_type_of_web = true
        routerDataInfoStore.store_router_history_data_of_local = false
        routerDataInfoStore.store_router_history_data_of_web = true
      } else {
        serverUsersStore.percentage_of_nd = 0
        serverUsersStore.percentage_of_local = 100
        //
        userModel.model_server_type_of_local = true
        userModel.model_server_type_of_web = false
        //
        routerDataInfoStore.store_router_history_data_of_local = true
        routerDataInfoStore.store_router_history_data_of_web = false
      }
      //
      try {
        await playerAudioLogicStore.init_player()
      } catch {}
      // Refresh Playlist(Local / Server)
      await playlistListLogicStore.reset_data()
      playlistListInfoStore.playlist_MediaFiles_temporary = []
      // Refresh Router Data
      routerDataLogicStore.reset_data()
      //
      systemConfigsSaveStore.save_system_config_of_App_Configs()
    }
  }

  const refresh_model_server_type_of_web = async () => {
    if (serverUsersStore.server_select_kind === 'navidrome') {
      const user_Authorization_ApiWebService_of_ND = new User_Authorization_ApiWebService_of_ND(
        serverUsersStore.server_config_of_current_user_of_sqlite?.url
      )
      return await user_Authorization_ApiWebService_of_ND.get_token()
    } else if (serverUsersStore.server_select_kind === 'ninesong') {
      if (
        serverUsersStore.server_config_of_current_user_of_sqlite?.url === undefined ||
        serverUsersStore.server_config_of_current_user_of_sqlite?.url.length === 0
      ) {
        serverUsersStore.server_config_of_current_user_of_sqlite.url = 
          systemConfigsInfoStore.desktop_system_kind === 'docker'
            ? '/api'
            : serverLoginInfoStore.server_url
      }
      serverLoginInfoStore.server_url = 
        serverUsersStore.server_config_of_current_user_of_sqlite?.url
      const auth_Token_ApiService_of_NineSong = new Auth_Token_ApiService_of_NineSong(
        serverLoginInfoStore.server_url
      )
      if (
        userModel.username === undefined ||
        userModel.username.length === 0
      ) {
        userModel.username = String(sessionStorage.getItem('email'))
      }
      if (userModel.password.length > 0) {
        const userData = await auth_Token_ApiService_of_NineSong.getAuth_Token(
          userModel.username,
          userModel.password
        )
        if (userData && userData.accessToken && userData.refreshToken) {
          serverLoginInfoStore.server_accessToken = String(userData.accessToken)
          serverLoginInfoStore.server_refreshToken = String(userData.refreshToken)
          serverAuthTokenStore.test_init_server_token()

          const folder_Entity_ApiService_of_NineSong = new Folder_Entity_ApiService_of_NineSong(serverLoginInfoStore.server_url)
          serverUsersStore.server_all_library = 
            await folder_Entity_ApiService_of_NineSong.getFolder_Entity_All()
        } else {
          if (systemConfigsInfoStore.desktop_system_kind === 'docker') {
            serverLoginLogicStore.server_logout()
          }
          return false
        }
      } else {
        if (systemConfigsInfoStore.desktop_system_kind === 'docker') {
          serverLoginLogicStore.server_logout()
        }
        return false
      }
    }
    systemConfigsSaveStore.save_system_config_of_App_Configs()
    return true
  }

  const init_server_info = async () => {
    // store_server_users.server_config_of_current_user_of_sqlite = {
    //     id: store_server_user_model.username,
    //     server_name: 'nsmusics',
    //     url: '/api',
    //     user_name: store_server_user_model.username,
    //     password: store_server_user_model.password,
    //     last_login_at: new Date().toISOString().split('.')[0] + 'Z',
    //     type: 'ninesong'
    // }
  }

  // 初始化watch监听器
  const setupWatchers = () => {
    watch(
      () => userModel.model_server_type_of_web,
      (newValue) => {
        userModel.model_server_type_of_local = !newValue
        if (newValue) {
          routerDataInfoStore.store_router_history_data_of_local = false
          routerDataInfoStore.store_router_history_data_of_web = true
        } else {
          routerDataInfoStore.store_router_history_data_of_local = true
          routerDataInfoStore.store_router_history_data_of_web = false
        }
        systemConfigsSaveStore.save_system_config_of_App_Configs()
      }
    )

    watch(
      () => userModel.model_server_type_of_local,
      (newValue) => {
        userModel.model_server_type_of_web = !newValue
        systemConfigsSaveStore.save_system_config_of_App_Configs()
      }
    )
  }

  // 初始化watchers
  setupWatchers()

  // 暴露状态和方法
  return {
    ...userModel,
    switchToMode_Local,
    switchToMode_Server,
    switchToMode,
    refresh_model_server_type_of_web,
    init_server_info
  }
})