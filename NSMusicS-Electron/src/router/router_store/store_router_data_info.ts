import { reactive, watch } from 'vue'
// @ts-ignore - 忽略模块导入类型检查
import { store_general_fetch_home_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_home/store_general_fetch_home_list'
// @ts-ignore - 忽略模块导入类型检查
import { store_general_fetch_media_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_file/store_general_fetch_media_list'
// @ts-ignore - 忽略模块导入类型检查
import { store_general_fetch_album_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_album/store_general_fetch_album_list'
// @ts-ignore - 忽略模块导入类型检查
import { store_general_fetch_artist_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_artist/store_general_fetch_artist_list'
// @ts-ignore - 忽略模块导入类型检查
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
// @ts-ignore - 忽略模块导入类型检查
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
// @ts-ignore - 忽略模块导入类型检查
import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'
// @ts-ignore - 忽略模块导入类型检查
import { store_general_model_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_model_player_list'
// @ts-ignore - 忽略模块导入类型检查
import { store_general_fetch_media_cue_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_cue_file/store_general_fetch_media_cue_list'
// @ts-ignore - 忽略模块导入类型检查
import { usePageMediaStore } from '@/data/data_status/app_status/page_status/media_store/usePageMediaStore'
import { usePageAlbumStore } from '@/data/data_status/app_status/page_status/album_store/usePageAlbumStore'
import { usePageMediaCueStore } from '@/data/data_status/app_status/page_status/media_cue_store/usePageMediaCueStore'

export const store_router_data_info = reactive({
  // @ts-ignore - 忽略router类型检查
  router: null as any,
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
