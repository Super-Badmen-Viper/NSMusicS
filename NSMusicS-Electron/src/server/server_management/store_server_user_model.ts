import { reactive, watch } from 'vue'
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_server_users } from '@/server/server_management/store_server_users'

import { usePageMediaStore } from '@/data/data_status/page_status/media_store/usePageMediaStore'
import { usePlaylistStore } from '@/data/data_status/comment_status/playlist_store/usePlaylistStore'
import { usePlayerAudioStore } from '@/data/data_status/comment_status/player_store/usePlayerAudioStore'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'

import { store_system_configs_load } from '@/data/data_stores/local_system_stores/store_system_configs_load'
import { User_Authorization_ApiWebService_of_ND } from '@/server/server_api/navidrome_api/services_web/user_authorization/index_service'
import { usePlayerSettingStore } from '@/data/data_status/comment_status/player_store/usePlayerSettingStore'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { usePageAlbumStore } from '@/data/data_status/page_status/album_store/usePageAlbumStore'
import { usePageArtistStore } from '@/data/data_status/page_status/artist_store/usePageArtistStore'
import { usePageHomeStore } from '@/data/data_status/page_status/home_store/usePageHomeStore'
import { usePageMediaCueStore } from '@/data/data_status/page_status/media_cue_store/usePageMediaCueStore'
import { usePageRecommendStore } from '@/data/data_status/page_status/recommend_store/usePageRecommendStore'
import { store_server_auth_token } from '@/server/server_api_store/server_api_auth/auth_token'
import { Auth_Token_ApiService_of_NineSong } from '@/server/server_api/ninesong_api/services_web/Auth/Auth_Token/index_service'
import { store_server_login_info } from '@/data/data_status/comment_status/login_store/store_server_login_info'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { store_server_login_logic } from '@/data/data_status/comment_status/login_store/store_server_login_logic'
import { Folder_Entity_ApiService_of_NineSong } from '@/server/server_api/ninesong_api/services_web/Folder_Entity/index_service'
import { store_general_fetch_player_list } from '@/server/server_api_store/server_api_core/components/player_list/store_general_fetch_player_list'

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
    const playerSettingStore = usePlayerSettingStore()
    playerSettingStore.drawer_order_height = 160

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

    const playerSettingStore = usePlayerSettingStore()
    if (
      store_server_users.server_select_kind != 'jellyfin' &&
      store_server_users.server_select_kind != 'emby'
    ) {
      playerSettingStore.drawer_order_height = 198
    } else {
      playerSettingStore.drawer_order_height = 160
    }

    store_server_user_model.model_select = 'server'
    await this.switchToMode()
  },
  async switchToMode() {
    if (!store_system_configs_load.app_configs_loading) {
      store_server_user_model.random_play_model = false
      const playerAudioStore = usePlayerAudioStore()
      await playerAudioStore.reset_data()
      store_general_fetch_player_list._totalCount = 0
      const pageMediaStore = usePageMediaStore()
      pageMediaStore.page_songlists_keywordFilter = ''
      pageMediaStore.page_songlists_selected = 'song_list_all'
      const pageAlbumStore = usePageAlbumStore()
      pageAlbumStore.page_albumlists_selected = 'album_list_all'
      const pageArtistStore = usePageArtistStore()
      pageArtistStore.page_artistlists_selected = 'artist_list_all'
      const playerSettingStore = usePlayerSettingStore()
      if (playerSettingStore.player_select === 'mpv') {
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
        //
        const pageMediaStore = usePageMediaStore()
        pageMediaStore.page_songlists_options_Sort_key = [
          {
            columnKey: String('id'),
            order: String('ascend'),
          },
        ]
      }
      const playlistStore = usePlaylistStore()
      try {
        await playerSettingStore.init_player()
      } catch {}
      // Refresh Playlist(Local / Server)
      await playlistStore.reset_data()
      playlistStore.playlist_MediaFiles_temporary = []
      // Refresh Router Data
      store_router_data_logic.reset_data()
      //
      store_system_configs_save.save_system_config_of_App_Configs()
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
          store_system_configs_info.desktop_system_kind === 'docker'
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
          ///
          const folder_Entity_ApiService_of_NineSong = new Folder_Entity_ApiService_of_NineSong(url)
          store_server_users.server_all_library =
            await folder_Entity_ApiService_of_NineSong.getFolder_Entity_All()
          ///
          const pageArtistStore = usePageArtistStore()
          pageArtistStore.page_view_model = 'tree'
          ///
          this.refresh_all_server_item_token()
        } else {
          if (store_system_configs_info.desktop_system_kind === 'docker') {
            store_server_login_logic.server_logout()
          }
          return false
        }
      } else {
        if (store_system_configs_info.desktop_system_kind === 'docker') {
          store_server_login_logic.server_logout()
        }
        return false
      }
    }
    store_system_configs_save.save_system_config_of_App_Configs()

    return true
  },

  async refresh_all_server_item_token() {
    // 引入所有包含 URL 字段的 Pinia store 模块
    const pageHomeStore = usePageHomeStore()
    const pageMediaStore = usePageMediaStore()
    const pageAlbumStore = usePageAlbumStore()
    const pageArtistStore = usePageArtistStore()
    const pageMediaCueStore = usePageMediaCueStore()
    const pageRecommendStore = usePageRecommendStore()
    const playlistStore = usePlaylistStore()

    // 定义更新 access_token 的辅助函数
    const updateAccessTokenInUrl = (url: string): string => {
      if (!url || typeof url !== 'string') return url
      // 只更新包含 access_token 的 URL
      if (url.includes('access_token=')) {
        // 使用正则表达式匹配并替换 access_token 参数的值
        return url.replace(
          /(access_token=)[^&]*/,
          '$1' + store_server_login_info.server_accessToken
        )
      }
      return url
    }

    // 遍历并更新 pageHomeStore 中的 URL 字段
    pageHomeStore.home_Files_temporary_maximum_playback = 
      pageHomeStore.home_Files_temporary_maximum_playback.map((item: any) => ({
        ...item,
        path: updateAccessTokenInUrl(item.path),
        medium_image_url: updateAccessTokenInUrl(item.medium_image_url)
      }))

    pageHomeStore.home_Files_temporary_random_search = 
      pageHomeStore.home_Files_temporary_random_search.map((item: any) => ({
        ...item,
        path: updateAccessTokenInUrl(item.path),
        medium_image_url: updateAccessTokenInUrl(item.medium_image_url)
      }))

    pageHomeStore.home_Files_temporary_recently_added = 
      pageHomeStore.home_Files_temporary_recently_added.map((item: any) => ({
        ...item,
        path: updateAccessTokenInUrl(item.path),
        medium_image_url: updateAccessTokenInUrl(item.medium_image_url)
      }))

    pageHomeStore.home_Files_temporary_recently_played = 
      pageHomeStore.home_Files_temporary_recently_played.map((item: any) => ({
        ...item,
        path: updateAccessTokenInUrl(item.path),
        medium_image_url: updateAccessTokenInUrl(item.medium_image_url)
      }))

    // 更新 home_selected_top_album_medium_image_url
    pageHomeStore.home_selected_top_album_medium_image_url = 
      updateAccessTokenInUrl(pageHomeStore.home_selected_top_album_medium_image_url)

    // 遍历并更新 pageMediaStore 中的 URL 字段
    pageMediaStore.media_Files_temporary = 
      pageMediaStore.media_Files_temporary.map((item: any) => ({
        ...item,
        path: updateAccessTokenInUrl(item.path),
        medium_image_url: updateAccessTokenInUrl(item.medium_image_url)
      }))

    pageMediaStore.media_File_metadata = 
      pageMediaStore.media_File_metadata.map((item: any) => ({
        ...item,
        path: updateAccessTokenInUrl(item.path),
        medium_image_url: updateAccessTokenInUrl(item.medium_image_url)
      }))

    // 遍历并更新 pageAlbumStore 中的 URL 字段
    pageAlbumStore.album_Files_temporary = 
      pageAlbumStore.album_Files_temporary.map((item: any) => ({
        ...item,
        path: updateAccessTokenInUrl(item.path),
        medium_image_url: updateAccessTokenInUrl(item.medium_image_url)
      }))

    pageAlbumStore.album_File_metadata = 
      pageAlbumStore.album_File_metadata.map((item: any) => ({
        ...item,
        path: updateAccessTokenInUrl(item.path),
        medium_image_url: updateAccessTokenInUrl(item.medium_image_url)
      }))

    // 遍历并更新 pageArtistStore 中的 URL 字段
    pageArtistStore.artist_Files_temporary = 
      pageArtistStore.artist_Files_temporary.map((item: any) => ({
        ...item,
        path: updateAccessTokenInUrl(item.path),
        medium_image_url: updateAccessTokenInUrl(item.medium_image_url)
      }))

    pageArtistStore.artist_File_metadata = 
      pageArtistStore.artist_File_metadata.map((item: any) => ({
        ...item,
        path: updateAccessTokenInUrl(item.path),
        medium_image_url: updateAccessTokenInUrl(item.medium_image_url)
      }))

    // 更新 artist_Tree_Artist_info 对象中的 URL 字段
    if (pageArtistStore.artist_Tree_Artist_info) {
      pageArtistStore.artist_Tree_Artist_info = {
        ...pageArtistStore.artist_Tree_Artist_info,
        medium_image_url: updateAccessTokenInUrl(pageArtistStore.artist_Tree_Artist_info.medium_image_url)
      }
    }

    // 更新 artist_Tree_Album_Tree_temporary 数组中的 URL 字段
    pageArtistStore.artist_Tree_Album_Tree_temporary = 
      pageArtistStore.artist_Tree_Album_Tree_temporary.map((albumData: any) => ({
        album: {
          ...albumData.album,
          medium_image_url: updateAccessTokenInUrl(albumData.album.medium_image_url)
        },
        mediaFiles: albumData.mediaFiles.map((mediaFile: any) => ({
          ...mediaFile,
          path: updateAccessTokenInUrl(mediaFile.path),
          medium_image_url: updateAccessTokenInUrl(mediaFile.medium_image_url)
        }))
      }))

    // 遍历并更新 pageMediaCueStore 中的 URL 字段
    pageMediaCueStore.media_Files_temporary = 
      pageMediaCueStore.media_Files_temporary.map((item: any) => ({
        ...item,
        path: updateAccessTokenInUrl(item.path),
        medium_image_url: updateAccessTokenInUrl(item.medium_image_url)
      }))

    pageMediaCueStore.media_File_metadata = 
      pageMediaCueStore.media_File_metadata.map((item: any) => ({
        ...item,
        path: updateAccessTokenInUrl(item.path),
        medium_image_url: updateAccessTokenInUrl(item.medium_image_url)
      }))

    // 遍历并更新 pageRecommendStore 中的 URL 字段
    pageRecommendStore.recommend_MediaFiles_temporary = 
      pageRecommendStore.recommend_MediaFiles_temporary.map((item: any) => ({
        ...item,
        path: updateAccessTokenInUrl(item.path),
        medium_image_url: updateAccessTokenInUrl(item.medium_image_url)
      }))

    pageRecommendStore.recommend_MediaFiles_GeneralRecommendations = 
      pageRecommendStore.recommend_MediaFiles_GeneralRecommendations.map((item: any) => ({
        ...item,
        path: updateAccessTokenInUrl(item.path),
        medium_image_url: updateAccessTokenInUrl(item.medium_image_url)
      }))

    pageRecommendStore.recommend_MediaFiles_PersonalizedRecommendations = 
      pageRecommendStore.recommend_MediaFiles_PersonalizedRecommendations.map((item: any) => ({
        ...item,
        path: updateAccessTokenInUrl(item.path),
        medium_image_url: updateAccessTokenInUrl(item.medium_image_url)
      }))

    pageRecommendStore.recommend_MediaFiles_PopularRecommendations = 
      pageRecommendStore.recommend_MediaFiles_PopularRecommendations.map((item: any) => ({
        ...item,
        path: updateAccessTokenInUrl(item.path),
        medium_image_url: updateAccessTokenInUrl(item.medium_image_url)
      }))

    // 遍历并更新 playlistStore 中的 URL 字段
    playlistStore.playlist_MediaFiles_temporary = 
      playlistStore.playlist_MediaFiles_temporary.map((item: any) => ({
        ...item,
        path: updateAccessTokenInUrl(item.path),
        medium_image_url: updateAccessTokenInUrl(item.medium_image_url)
      }))

    // 更新 playerAudioStore 中的 URL 字段
    const playerAudioStore = usePlayerAudioStore()
    playerAudioStore.this_audio_file_path = 
      updateAccessTokenInUrl(playerAudioStore.this_audio_file_path)
    playerAudioStore.this_audio_file_medium_image_url = 
      updateAccessTokenInUrl(playerAudioStore.this_audio_file_medium_image_url)
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
    store_system_configs_save.save_system_config_of_App_Configs()
  }
)
watch(
  () => store_server_user_model.model_server_type_of_local,
  (newValue) => {
    store_server_user_model.model_server_type_of_web = !newValue
    store_system_configs_save.save_system_config_of_App_Configs()
  }
)
