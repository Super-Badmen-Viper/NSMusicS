import { reactive } from 'vue'

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
