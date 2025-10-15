import { reactive } from 'vue'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_view_home_page_info } from '@/views/view_app/page/page_home/store/store_view_home_page_info'
import { store_view_media_page_info } from '@/views/view_app/page/page_media/store/store_view_media_page_info'
import { store_view_album_page_info } from '@/views/view_app/page/page_album/store/store_view_album_page_info'
import { store_view_artist_page_info } from '@/views/view_app/page/page_artist/store/store_view_artist_page_info'
import { store_view_media_page_logic } from '@/views/view_app/page/page_media/store/store_view_media_page_logic'
import { store_view_album_page_logic } from '@/views/view_app/page/page_album/store/store_view_album_page_logic'
import { store_view_artist_page_logic } from '@/views/view_app/page/page_artist/store/store_view_artist_page_logic'
import { store_router_history_data_of_media } from '@/router/router_store/store_router_history_data_of_media'
import { store_router_history_data_of_album } from '@/router/router_store/store_router_history_data_of_album'
import { store_router_history_data_of_artist } from '@/router/router_store/store_router_history_data_of_artist'
import { store_app_configs_logic_save } from '@/data/data_stores/app_stores/store_app_configs_logic_save'
import { store_server_user_model } from '@/data/data_stores/server_stores/store_server_user_model'

export const store_router_data_logic = reactive({
  reset_data() {
    store_view_media_page_logic.page_songlists_keywordFilter = ''
    store_view_media_page_logic.page_songlists_multi_sort = ''
    store_view_media_page_logic.page_songlists_selected = 'song_list_all'
    store_view_album_page_logic.page_albumlists_keyword = ''
    store_view_album_page_logic.page_albumlists_selected = 'album_list_all'
    store_view_artist_page_logic.page_artistlists_keyword = ''
    store_view_artist_page_logic.page_artistlists_selected = 'artist_list_all'
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
    store_app_configs_logic_save.save_system_config_of_App_Configs()
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
    store_app_configs_logic_save.save_system_config_of_App_Configs()
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
    store_app_configs_logic_save.save_system_config_of_App_Configs()
  },

  clear_Files_temporary() {
    store_view_home_page_info.home_Files_temporary_maximum_playback = []
    store_view_home_page_info.home_Files_temporary_random_search = []
    store_view_home_page_info.home_Files_temporary_recently_added = []
    store_view_home_page_info.home_Files_temporary_recently_played = []
    store_view_media_page_info.media_Files_temporary = []
    store_view_album_page_info.album_Files_temporary = []
    store_view_artist_page_info.artist_Files_temporary = []
  },
  clear_Files_temporary_except_home() {
    store_router_data_info.router_select = 'home'
    store_view_media_page_info.media_Files_temporary = []
    store_view_album_page_info.album_Files_temporary = []
    store_view_artist_page_info.artist_Files_temporary = []
  },
  clear_Files_temporary_except_categories() {
    store_router_data_info.router_select = 'categories'
    store_view_media_page_info.media_Files_temporary = []
    store_view_album_page_info.album_Files_temporary = []
    store_view_artist_page_info.artist_Files_temporary = []
  },
  clear_Files_temporary_except_charts() {
    store_router_data_info.router_select = 'charts'
    store_view_home_page_info.home_Files_temporary_maximum_playback = []
    store_view_home_page_info.home_Files_temporary_random_search = []
    store_view_home_page_info.home_Files_temporary_recently_added = []
    store_view_home_page_info.home_Files_temporary_recently_played = []
    store_view_album_page_info.album_Files_temporary = []
    store_view_artist_page_info.artist_Files_temporary = []
  },
  clear_Files_temporary_except_recommend() {
    store_router_data_info.router_select = 'recommend'
    store_view_home_page_info.home_Files_temporary_maximum_playback = []
    store_view_home_page_info.home_Files_temporary_random_search = []
    store_view_home_page_info.home_Files_temporary_recently_added = []
    store_view_home_page_info.home_Files_temporary_recently_played = []
    store_view_album_page_info.album_Files_temporary = []
    store_view_artist_page_info.artist_Files_temporary = []
  },
  clear_Files_temporary_except_tag() {
    store_router_data_info.router_select = 'tag'
    store_view_home_page_info.home_Files_temporary_maximum_playback = []
    store_view_home_page_info.home_Files_temporary_random_search = []
    store_view_home_page_info.home_Files_temporary_recently_added = []
    store_view_home_page_info.home_Files_temporary_recently_played = []
    store_view_album_page_info.album_Files_temporary = []
    store_view_artist_page_info.artist_Files_temporary = []
  },
  clear_Files_temporary_except_media_cue() {
    store_router_data_info.router_select = 'media_cue'
    store_view_media_page_info.media_Files_temporary = []
    store_view_album_page_info.album_Files_temporary = []
    store_view_artist_page_info.artist_Files_temporary = []
  },
  clear_Files_temporary_except_album() {
    store_router_data_info.router_select = 'album'
    store_view_home_page_info.home_Files_temporary_maximum_playback = []
    store_view_home_page_info.home_Files_temporary_random_search = []
    store_view_home_page_info.home_Files_temporary_recently_added = []
    store_view_home_page_info.home_Files_temporary_recently_played = []
    store_view_media_page_info.media_Files_temporary = []
    store_view_artist_page_info.artist_Files_temporary = []
  },
  clear_Files_temporary_except_media() {
    store_router_data_info.router_select = 'media'
    store_view_home_page_info.home_Files_temporary_maximum_playback = []
    store_view_home_page_info.home_Files_temporary_random_search = []
    store_view_home_page_info.home_Files_temporary_recently_added = []
    store_view_home_page_info.home_Files_temporary_recently_played = []
    store_view_album_page_info.album_Files_temporary = []
    store_view_artist_page_info.artist_Files_temporary = []
  },
  clear_Files_temporary_except_artist() {
    store_router_data_info.router_select = 'artist'
    store_view_home_page_info.home_Files_temporary_maximum_playback = []
    store_view_home_page_info.home_Files_temporary_random_search = []
    store_view_home_page_info.home_Files_temporary_recently_added = []
    store_view_home_page_info.home_Files_temporary_recently_played = []
    store_view_media_page_info.media_Files_temporary = []
    store_view_album_page_info.album_Files_temporary = []
  },

  get_media_list_of_album_id_by_album_info(value: any) {
    store_router_data_info.router.push('media')
    if (store_server_user_model.model_server_type_of_local) {
      store_view_media_page_logic.list_data_Hand_Search = true
      store_view_media_page_logic.list_selected_Hand_click = false
      // open media_files model，keywords set
      store_view_media_page_logic.page_songlists_keywordFilter = `WHERE album_id = '${value}'`
      store_view_media_page_logic.page_songlists_get_keyword_model_num = 3
      store_router_data_info.find_music_model = true
      console.log('get_media_list_of_album_model：' + value)
      store_view_media_page_logic.page_songlists_input_search_Value = value
    }
    store_view_media_page_logic.page_songlists_selected = 'song_list_all'
  },
  get_album_list_of_artist_id_by_artist_info(value: any) {
    store_router_data_info.router.push('album')
    // open album_files model，keywords set
    store_router_data_info.find_album_model = true
    if (store_server_user_model.model_server_type_of_local) {
      store_view_album_page_logic.page_albumlists_keyword = value
    } else if (store_server_user_model.model_server_type_of_web) {
      store_view_album_page_logic.page_albumlists_keyword = ''
    }
    store_view_album_page_logic.page_albumlists_get_keyword_model_num = 2
    store_router_data_info.find_artist_model = false
    console.log('get_album_list_of_artist_model：' + value)
    store_view_album_page_logic.page_albumlists_input_search_Value = value
  },
})
