import { reactive, watch } from 'vue'
import { store_general_fetch_home_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_home/store_general_fetch_home_list'
import { store_general_fetch_media_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_file/store_general_fetch_media_list'
import { store_general_fetch_album_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_album/store_general_fetch_album_list'
import { store_general_fetch_artist_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_artist/store_general_fetch_artist_list'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'
import { store_general_model_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_model_player_list'
import { store_general_fetch_media_cue_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_cue_file/store_general_fetch_media_cue_list'
import { store_view_media_page_logic } from '../../views/view_app/page/page_media/store/store_view_media_page_logic'
import { store_view_album_page_logic } from '../../views/view_app/page/page_album/store/store_view_album_page_logic'
import { store_view_media_cue_page_logic } from '../../views/view_app/page/page_media_cue/store/store_view_media_cue_page_logic'

export const store_router_data_info = reactive({
  router: null,
  router_name: '',
  router_select: '',
  router_click: false,

  MEMORY_THRESHOLD: 360 * 1024 * 1024,

  find_music_model: false,
  find_album_model: false,
  find_artist_model: false,

  store_router_history_data_of_local: true,
  store_router_history_data_of_web: false,

  router_select_model_server_login: false,
  router_select_model_server_setting: false,
  router_select_model_server_library: false,
})
watch(
  () => store_router_data_info.router_select,
  async (newValue) => {
    const playlistStore = usePlaylistStore()
    if (!playlistStore.playlist_show) {
      store_router_data_info.router_select = newValue
      if (newValue === 'home') {
        await store_general_fetch_home_list.fetchData_Home()
      } else if (newValue === 'categories') {
      } else if (newValue === 'charts') {
      } else if (newValue === 'recommend') {
      } else if (newValue === 'tag') {
      } else if (newValue === 'media_cue') {
        if (store_router_data_info.router_click) {
          store_view_media_cue_page_logic.page_songlists_keyword = ''
          store_view_media_cue_page_logic.page_songlists_keywordFilter = ''
        }
        await store_general_fetch_media_cue_list.fetchData_Media()
      } else if (newValue === 'media') {
        if (store_router_data_info.router_click) {
          store_view_media_page_logic.page_songlists_keyword = ''
          store_view_media_page_logic.page_songlists_keywordFilter = ''
          //
          store_general_fetch_media_list._artist_id = ''
          store_general_fetch_media_list._album_id = ''
          store_general_fetch_media_list._album_artist_id = ''
          store_general_fetch_media_list._media_id = ''
        }
        await store_general_fetch_media_list.fetchData_Media()
        /// Synchronize API data
        if (store_server_user_model.model_select === 'server') {
          // get app all playlist
          await store_general_model_player_list.get_playlists_info()
        }
      } else if (newValue === 'album') {
        if (store_router_data_info.router_click) {
          store_view_album_page_logic.page_albumlists_keyword = ''
        }
        await store_general_fetch_album_list.fetchData_Album()
      } else if (newValue === 'artist') {
        await store_general_fetch_artist_list.fetchData_Artist()
      }
      store_router_data_info.router_click = false
    }
  }
)
watch(
  () => store_router_data_info.router_name,
  async (newValue) => {
    store_system_configs_info.app_view_left_menu_select_activeKey = newValue
  }
)
