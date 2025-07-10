import { reactive } from 'vue'
import { store_view_home_page_info } from '@/views/view_app/music_page/page_home/store/store_view_home_page_info'
import { Get_HomeDataInfos_From_LocalSqlite } from '@/data/data_access/local_configs/class_Get_HomeDataInfos_From_LocalSqlite'
import { store_server_user_model } from '@/data/data_stores/server/store_server_user_model'
import { Get_Navidrome_Temp_Data_To_LocalSqlite } from '@/data/data_access/servers_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite'
import { store_server_users } from '@/data/data_stores/server/store_server_users'
import { Get_Jellyfin_Temp_Data_To_LocalSqlite } from '@/data/data_access/servers_configs/jellyfin_api/services_web_instant_access/class_Get_Jellyfin_Temp_Data_To_LocalSqlite'
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/data/data_access/servers_configs/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'

export const store_general_fetch_home_list = reactive({
  async fetchData_Home() {
    try {
      store_view_home_page_info.home_Files_temporary_maximum_playback = []
      store_view_home_page_info.home_Files_temporary_random_search = []
      store_view_home_page_info.home_Files_temporary_recently_added = []
      store_view_home_page_info.home_Files_temporary_recently_played = []
      store_view_home_page_info.home_selected_top_album = undefined

      if (store_server_user_model.model_server_type_of_local) {
        const get_HomeDataInfos_From_LocalSqlite = new Get_HomeDataInfos_From_LocalSqlite()
        store_view_home_page_info.home_Files_temporary_maximum_playback =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Maximum_Playback()
        store_view_home_page_info.home_Files_temporary_random_search =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Random_Search()
        store_view_home_page_info.home_Files_temporary_recently_added =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Recently_Added()
        store_view_home_page_info.home_Files_temporary_recently_played =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Recently_Played()
      } else if (store_server_user_model.model_server_type_of_web) {
        if (store_server_users.server_select_kind === 'ninesong') {
          const get_Navidrome_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list(
            store_server_login_info.server_url
          )
        } else if (store_server_users.server_select_kind === 'navidrome') {
          const get_Navidrome_Temp_Data_To_LocalSqlite =
            new Get_Navidrome_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
            store_server_user_model.username,
            store_server_user_model.token,
            store_server_user_model.salt
          )
        } else if (
          store_server_users.server_select_kind === 'jellyfin' ||
          store_server_users.server_select_kind === 'emby'
        ) {
          await new Get_Jellyfin_Temp_Data_To_LocalSqlite().get_home_list(
            store_server_user_model.parentid_of_Je_Music
          )
        }
      }

      store_view_home_page_info.home_selected_top_album =
        store_view_home_page_info.home_Files_temporary_random_search.length > 0
          ? store_view_home_page_info.home_Files_temporary_random_search[0]
          : undefined
    } catch (error) {
      console.error('Failed to fetch home data:', error)
    }
  },

  async fetchData_Home_of_maximum_playback() {
    try {
      store_view_home_page_info.home_Files_temporary_maximum_playback = []
      if (store_server_user_model.model_server_type_of_local) {
        const get_HomeDataInfos_From_LocalSqlite = new Get_HomeDataInfos_From_LocalSqlite()
        store_view_home_page_info.home_Files_temporary_maximum_playback =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Maximum_Playback()
      } else if (store_server_user_model.model_server_type_of_web) {
        if (store_server_users.server_select_kind === 'ninesong') {
          const get_NineSong_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_NineSong_Temp_Data_To_LocalSqlite.get_home_list_of_maximum_playback(
            store_server_login_info.server_url
          )
        } else if (store_server_users.server_select_kind === 'navidrome') {
          const get_Navidrome_Temp_Data_To_LocalSqlite =
            new Get_Navidrome_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_maximum_playback(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
            store_server_user_model.username,
            store_server_user_model.token,
            store_server_user_model.salt
          )
        } else if (
          store_server_users.server_select_kind === 'jellyfin' ||
          store_server_users.server_select_kind === 'emby'
        ) {
          await new Get_Jellyfin_Temp_Data_To_LocalSqlite().get_home_list_of_maximum_playback(
            store_server_user_model.parentid_of_Je_Music
          )
        }
      }
    } catch (error) {
      console.error('Failed to fetch maximum playback data:', error)
    }
  },

  async fetchData_Home_of_random_search() {
    try {
      store_view_home_page_info.home_selected_top_album_subscript = 0
      store_view_home_page_info.home_Files_temporary_random_search = []
      store_view_home_page_info.home_selected_top_album = undefined
      if (store_server_user_model.model_server_type_of_local) {
        const get_HomeDataInfos_From_LocalSqlite = new Get_HomeDataInfos_From_LocalSqlite()
        store_view_home_page_info.home_Files_temporary_random_search =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Random_Search()
      } else if (store_server_user_model.model_server_type_of_web) {
        if (store_server_users.server_select_kind === 'ninesong') {
          const get_Navidrome_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_random_search(
            store_server_login_info.server_url
          )
        } else if (store_server_users.server_select_kind === 'navidrome') {
          const get_Navidrome_Temp_Data_To_LocalSqlite =
            new Get_Navidrome_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_random_search(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
            store_server_user_model.username,
            store_server_user_model.token,
            store_server_user_model.salt
          )
        } else if (
          store_server_users.server_select_kind === 'jellyfin' ||
          store_server_users.server_select_kind === 'emby'
        ) {
          await new Get_Jellyfin_Temp_Data_To_LocalSqlite().get_home_list_of_random_search(
            store_server_user_model.parentid_of_Je_Music
          )
        }
      }
      store_view_home_page_info.home_selected_top_album =
        store_view_home_page_info.home_Files_temporary_random_search.length > 0
          ? store_view_home_page_info.home_Files_temporary_random_search[0]
          : undefined
    } catch (error) {
      console.error('Failed to fetch random search data:', error)
    }
  },

  async fetchData_Home_of_recently_added() {
    try {
      store_view_home_page_info.home_Files_temporary_recently_added = []
      if (store_server_user_model.model_server_type_of_local) {
        const get_HomeDataInfos_From_LocalSqlite = new Get_HomeDataInfos_From_LocalSqlite()
        store_view_home_page_info.home_Files_temporary_recently_added =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Recently_Added()
      } else if (store_server_user_model.model_server_type_of_web) {
        if (store_server_users.server_select_kind === 'ninesong') {
          const get_Navidrome_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_recently_added(
            store_server_login_info.server_url
          )
        } else if (store_server_users.server_select_kind === 'navidrome') {
          const get_Navidrome_Temp_Data_To_LocalSqlite =
            new Get_Navidrome_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_recently_added(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
            store_server_user_model.username,
            store_server_user_model.token,
            store_server_user_model.salt
          )
        } else if (
          store_server_users.server_select_kind === 'jellyfin' ||
          store_server_users.server_select_kind === 'emby'
        ) {
          await new Get_Jellyfin_Temp_Data_To_LocalSqlite().get_home_list_of_recently_added(
            store_server_user_model.parentid_of_Je_Music
          )
        }
      }
    } catch (error) {
      console.error('Failed to fetch recently added data:', error)
    }
  },

  async fetchData_Home_of_recently_played() {
    try {
      store_view_home_page_info.home_Files_temporary_recently_played = []
      if (store_server_user_model.model_server_type_of_local) {
        const get_HomeDataInfos_From_LocalSqlite = new Get_HomeDataInfos_From_LocalSqlite()
        store_view_home_page_info.home_Files_temporary_recently_played =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Recently_Played()
      } else if (store_server_user_model.model_server_type_of_web) {
        if (store_server_users.server_select_kind === 'ninesong') {
          const get_Navidrome_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_recently_played(
            store_server_login_info.server_url
          )
        } else if (store_server_users.server_select_kind === 'navidrome') {
          const get_Navidrome_Temp_Data_To_LocalSqlite =
            new Get_Navidrome_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_recently_played(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
            store_server_user_model.username,
            store_server_user_model.token,
            store_server_user_model.salt
          )
        } else if (
          store_server_users.server_select_kind === 'jellyfin' ||
          store_server_users.server_select_kind === 'emby'
        ) {
          await new Get_Jellyfin_Temp_Data_To_LocalSqlite().get_home_list_of_recently_played(
            store_server_user_model.parentid_of_Je_Music
          )
        }
      }
    } catch (error) {
      console.error('Failed to fetch recently played data:', error)
    }
  },
})
