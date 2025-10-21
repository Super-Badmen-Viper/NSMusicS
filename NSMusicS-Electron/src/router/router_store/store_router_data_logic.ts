import { reactive } from 'vue'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
// @ts-ignore - 忽略模块导入类型检查
import { usePageHomeStore } from '@/data/data_status/app_status/page_status/home_store/usePageHomeStore'
// @ts-ignore - 忽略模块导入类型检查
import { usePageMediaStore } from '@/data/data_status/app_status/page_status/media_store/usePageMediaStore'
// @ts-ignore - 忽略模块导入类型检查
import { usePageAlbumStore } from '@/data/data_status/app_status/page_status/album_store/usePageAlbumStore'
// @ts-ignore - 忽略模块导入类型检查
import { usePageArtistStore } from '@/data/data_status/app_status/page_status/artist_store/usePageArtistStore'
import { store_router_history_data_of_media } from '@/router/router_store/store_router_history_data_of_media'
import { store_router_history_data_of_album } from '@/router/router_store/store_router_history_data_of_album'
import { store_router_history_data_of_artist } from '@/router/router_store/store_router_history_data_of_artist'
// @ts-ignore - 忽略模块导入类型检查
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
// @ts-ignore - 忽略模块导入类型检查
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'

export const store_router_data_logic = reactive({
  reset_data() {
    const pageMediaStore = usePageMediaStore()
    const pageAlbumStore = usePageAlbumStore()
    const pageArtistStore = usePageArtistStore()
    pageMediaStore.page_songlists_keywordFilter = ''
    pageMediaStore.page_songlists_multi_sort = ''
    pageMediaStore.page_songlists_selected = 'song_list_all'
    pageAlbumStore.page_albumlists_keyword = ''
    pageAlbumStore.page_albumlists_selected = 'album_list_all'
    pageArtistStore.page_artistlists_keyword = ''
    pageArtistStore.page_artistlists_selected = 'artist_list_all'
    store_router_history_data_of_media.router_history_datas_of_Media = []
    store_router_history_data_of_album.router_history_datas_of_Album = []
    store_router_history_data_of_artist.router_history_datas_of_Artist = []
    store_router_history_data_of_media.router_select_history_date_of_Media = 'song_list_all'
    store_router_history_data_of_album.router_select_history_date_of_Album = 'album_list_all'
    store_router_history_data_of_artist.router_select_history_date_of_Artist = 'artist_list_all'
  },

  clear_Memory_Model: false,
  get_clear_Memory_Model(value: any) {
    if (value) {
      store_router_data_logic.clear_Equilibrium_Model = false
      store_router_data_logic.clear_UserExperience_Model = false
    } else {
      store_router_data_logic.clear_Equilibrium_Model = false
      store_router_data_logic.clear_UserExperience_Model = true
    }
    store_system_configs_save.save_system_config_of_App_Configs()
  },
  clear_Equilibrium_Model: false,
  get_clear_Equilibrium_Model(value: any) {
    if (value) {
      store_router_data_logic.clear_Memory_Model = false
      store_router_data_logic.clear_UserExperience_Model = false
    } else {
      store_router_data_logic.clear_Memory_Model = true
      store_router_data_logic.clear_UserExperience_Model = false
    }
    store_system_configs_save.save_system_config_of_App_Configs()
  },
  clear_UserExperience_Model: true,
  get_clear_UserExperience_Model(value: any) {
    if (value) {
      store_router_data_logic.clear_Memory_Model = false
      store_router_data_logic.clear_Equilibrium_Model = false
    } else {
      store_router_data_logic.clear_Memory_Model = true
      store_router_data_logic.clear_Equilibrium_Model = false
    }
    store_system_configs_save.save_system_config_of_App_Configs()
  },

  clear_Files_temporary() {
    const pageHomeStore = usePageHomeStore()
    const pageMediaStore = usePageMediaStore()
    const pageAlbumStore = usePageAlbumStore()
    const pageArtistStore = usePageArtistStore()
    pageHomeStore.home_Files_temporary_maximum_playback = []
    pageHomeStore.home_Files_temporary_random_search = []
    pageHomeStore.home_Files_temporary_recently_added = []
    pageHomeStore.home_Files_temporary_recently_played = []
    pageMediaStore.media_Files_temporary = []
    pageAlbumStore.album_Files_temporary = []
    pageArtistStore.artist_Files_temporary = []
  },
  clear_Files_temporary_except_home() {
    store_router_data_info.router_select = 'home'
    const pageMediaStore = usePageMediaStore()
    const pageAlbumStore = usePageAlbumStore()
    const pageArtistStore = usePageArtistStore()
    pageMediaStore.media_Files_temporary = []
    pageAlbumStore.album_Files_temporary = []
    pageArtistStore.artist_Files_temporary = []
  },
  clear_Files_temporary_except_categories() {
    store_router_data_info.router_select = 'categories'
    const pageMediaStore = usePageMediaStore()
    const pageAlbumStore = usePageAlbumStore()
    const pageArtistStore = usePageArtistStore()
    pageMediaStore.media_Files_temporary = []
    pageAlbumStore.album_Files_temporary = []
    pageArtistStore.artist_Files_temporary = []
  },
  clear_Files_temporary_except_charts() {
    store_router_data_info.router_select = 'charts'
    const pageHomeStore = usePageHomeStore()
    const pageAlbumStore = usePageAlbumStore()
    const pageArtistStore = usePageArtistStore()
    pageHomeStore.home_Files_temporary_maximum_playback = []
    pageHomeStore.home_Files_temporary_random_search = []
    pageHomeStore.home_Files_temporary_recently_added = []
    pageHomeStore.home_Files_temporary_recently_played = []
    pageAlbumStore.album_Files_temporary = []
    pageArtistStore.artist_Files_temporary = []
  },
  clear_Files_temporary_except_recommend() {
    store_router_data_info.router_select = 'recommend'
    const pageHomeStore = usePageHomeStore()
    const pageAlbumStore = usePageAlbumStore()
    const pageArtistStore = usePageArtistStore()
    pageHomeStore.home_Files_temporary_maximum_playback = []
    pageHomeStore.home_Files_temporary_random_search = []
    pageHomeStore.home_Files_temporary_recently_added = []
    pageHomeStore.home_Files_temporary_recently_played = []
    pageAlbumStore.album_Files_temporary = []
    pageArtistStore.artist_Files_temporary = []
  },
  clear_Files_temporary_except_tag() {
    store_router_data_info.router_select = 'tag'
    const pageHomeStore = usePageHomeStore()
    const pageAlbumStore = usePageAlbumStore()
    const pageArtistStore = usePageArtistStore()
    pageHomeStore.home_Files_temporary_maximum_playback = []
    pageHomeStore.home_Files_temporary_random_search = []
    pageHomeStore.home_Files_temporary_recently_added = []
    pageHomeStore.home_Files_temporary_recently_played = []
    pageAlbumStore.album_Files_temporary = []
    pageArtistStore.artist_Files_temporary = []
  },
  clear_Files_temporary_except_media_cue() {
    store_router_data_info.router_select = 'media_cue'
    const pageMediaStore = usePageMediaStore()
    const pageAlbumStore = usePageAlbumStore()
    const pageArtistStore = usePageArtistStore()
    pageMediaStore.media_Files_temporary = []
    pageAlbumStore.album_Files_temporary = []
    pageArtistStore.artist_Files_temporary = []
  },
  clear_Files_temporary_except_album() {
    store_router_data_info.router_select = 'album'
    const pageHomeStore = usePageHomeStore()
    const pageMediaStore = usePageMediaStore()
    const pageArtistStore = usePageArtistStore()
    pageHomeStore.home_Files_temporary_maximum_playback = []
    pageHomeStore.home_Files_temporary_random_search = []
    pageHomeStore.home_Files_temporary_recently_added = []
    pageHomeStore.home_Files_temporary_recently_played = []
    pageMediaStore.media_Files_temporary = []
    pageArtistStore.artist_Files_temporary = []
  },
  clear_Files_temporary_except_media() {
    store_router_data_info.router_select = 'media'
    const pageHomeStore = usePageHomeStore()
    const pageAlbumStore = usePageAlbumStore()
    const pageArtistStore = usePageArtistStore()
    pageHomeStore.home_Files_temporary_maximum_playback = []
    pageHomeStore.home_Files_temporary_random_search = []
    pageHomeStore.home_Files_temporary_recently_added = []
    pageHomeStore.home_Files_temporary_recently_played = []
    pageAlbumStore.album_Files_temporary = []
    pageArtistStore.artist_Files_temporary = []
  },
  clear_Files_temporary_except_artist() {
    store_router_data_info.router_select = 'artist'
    const pageHomeStore = usePageHomeStore()
    const pageMediaStore = usePageMediaStore()
    const pageAlbumStore = usePageAlbumStore()
    pageHomeStore.home_Files_temporary_maximum_playback = []
    pageHomeStore.home_Files_temporary_random_search = []
    pageHomeStore.home_Files_temporary_recently_added = []
    pageHomeStore.home_Files_temporary_recently_played = []
    pageMediaStore.media_Files_temporary = []
    pageAlbumStore.album_Files_temporary = []
  },

  get_media_list_of_album_id_by_album_info(value: any) {
    // @ts-ignore - 忽略router类型检查
    if (store_router_data_info.router && typeof store_router_data_info.router.push === 'function') {
      store_router_data_info.router.push('media')
    }
    const pageMediaStore = usePageMediaStore()
    if (store_server_user_model.model_server_type_of_local) {
      pageMediaStore.list_data_Hand_Search = true
      pageMediaStore.list_selected_Hand_click = false
      // open media_files model，keywords set
      pageMediaStore.page_songlists_keywordFilter = `WHERE album_id = '${value}'`
      pageMediaStore.page_songlists_get_keyword_model_num = 3
      store_router_data_info.find_music_model = true
      console.log('get_media_list_of_album_model：' + value)
      pageMediaStore.page_songlists_input_search_Value = value
    }
    pageMediaStore.page_songlists_selected = 'song_list_all'
  },
  get_album_list_of_artist_id_by_artist_info(value: any) {
    // @ts-ignore - 忽略router类型检查
    if (store_router_data_info.router && typeof store_router_data_info.router.push === 'function') {
      store_router_data_info.router.push('album')
    }
    store_router_data_info.find_album_model = true
    const pageAlbumStore = usePageAlbumStore()
    if (store_server_user_model.model_server_type_of_local) {
      pageAlbumStore.page_albumlists_keyword = value
    } else if (store_server_user_model.model_server_type_of_web) {
      pageAlbumStore.page_albumlists_keyword = ''
    }
    pageAlbumStore.page_albumlists_get_keyword_model_num = 2
    store_router_data_info.find_artist_model = false
    console.log('get_album_list_of_artist_model：' + value)
    pageAlbumStore.page_albumlists_input_search_Value = value
  },
})
