import { defineStore } from 'pinia'
import { store_view_home_page_info } from '@/views/view_app/page/page_home/store/store_view_home_page_info'
import { Get_LocalSqlite_HomeDataInfos } from '@/data/data_repository/app_repository/LocalSqlite_Get_HomeDataInfos'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
import { Get_Navidrome_Temp_Data_To_LocalSqlite } from '@/data/data_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { Get_Jellyfin_Temp_Data_To_LocalSqlite } from '@/data/data_configs/jellyfin_api/services_web_instant_access/class_Get_Jellyfin_Temp_Data_To_LocalSqlite'
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/data/data_configs/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'

/**
 * 首页数据获取逻辑 store
 * 提供首页数据的获取和处理功能
 */
export const useGeneralFetchHomeListStore = defineStore('generalFetchHomeList', () => {
  // 获取其他store的引用
  const serverUserModelStore = useServerUserModelStore()
  const serverUsersStore = useServerUsersStore()

  /**
   * 获取首页数据
   */
  async function fetchData_Home() {
    try {
      store_view_home_page_info.home_Files_temporary_maximum_playback = []
      store_view_home_page_info.home_Files_temporary_random_search = []
      store_view_home_page_info.home_Files_temporary_recently_added = []
      store_view_home_page_info.home_Files_temporary_recently_played = []
      store_view_home_page_info.home_selected_top_album = undefined

      if (serverUserModelStore.model_server_type_of_local) {
        const get_HomeDataInfos_From_LocalSqlite = new Get_LocalSqlite_HomeDataInfos()
        store_view_home_page_info.home_Files_temporary_maximum_playback =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Maximum_Playback()
        store_view_home_page_info.home_Files_temporary_random_search =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Random_Search()
        store_view_home_page_info.home_Files_temporary_recently_added =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Recently_Added()
        store_view_home_page_info.home_Files_temporary_recently_played =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Recently_Played()
      } else if (serverUserModelStore.model_server_type_of_web) {
        if (serverUsersStore.server_select_kind === 'ninesong') {
          const get_Navidrome_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list(
            store_server_login_info.server_url
          )
        } else if (serverUsersStore.server_select_kind === 'navidrome') {
          const get_Navidrome_Temp_Data_To_LocalSqlite =
            new Get_Navidrome_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list(
            serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest',
            serverUserModelStore.username,
            serverUserModelStore.token,
            serverUserModelStore.salt
          )
        } else if (
          serverUsersStore.server_select_kind === 'jellyfin' ||
          serverUsersStore.server_select_kind === 'emby'
        ) {
          await new Get_Jellyfin_Temp_Data_To_LocalSqlite().get_home_list(
            serverUserModelStore.parentid_of_Je_Music
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
  }

  /**
   * 获取播放最多的首页数据
   */
  async function fetchData_Home_of_maximum_playback() {
    try {
      store_view_home_page_info.home_Files_temporary_maximum_playback = []
      if (serverUserModelStore.model_server_type_of_local) {
        const get_HomeDataInfos_From_LocalSqlite = new Get_LocalSqlite_HomeDataInfos()
        store_view_home_page_info.home_Files_temporary_maximum_playback =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Maximum_Playback()
      } else if (serverUserModelStore.model_server_type_of_web) {
        if (serverUsersStore.server_select_kind === 'ninesong') {
          const get_NineSong_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_NineSong_Temp_Data_To_LocalSqlite.get_home_list_of_maximum_playback(
            store_server_login_info.server_url,
            false
          )
        } else if (serverUsersStore.server_select_kind === 'navidrome') {
          const get_Navidrome_Temp_Data_To_LocalSqlite =
            new Get_Navidrome_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_maximum_playback(
            serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest',
            serverUserModelStore.username,
            serverUserModelStore.token,
            serverUserModelStore.salt
          )
        } else if (
          serverUsersStore.server_select_kind === 'jellyfin' ||
          serverUsersStore.server_select_kind === 'emby'
        ) {
          await new Get_Jellyfin_Temp_Data_To_LocalSqlite().get_home_list_of_maximum_playback(
            serverUserModelStore.parentid_of_Je_Music
          )
        }
      }
    } catch (error) {
      console.error('Failed to fetch maximum playback data:', error)
    }
  }

  /**
   * 获取随机搜索的首页数据
   */
  async function fetchData_Home_of_random_search() {
    try {
      store_view_home_page_info.home_selected_top_album_subscript = 0
      store_view_home_page_info.home_Files_temporary_random_search = []
      store_view_home_page_info.home_selected_top_album = undefined
      if (serverUserModelStore.model_server_type_of_local) {
        const get_HomeDataInfos_From_LocalSqlite = new Get_LocalSqlite_HomeDataInfos()
        store_view_home_page_info.home_Files_temporary_random_search =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Random_Search()
      } else if (serverUserModelStore.model_server_type_of_web) {
        if (serverUsersStore.server_select_kind === 'ninesong') {
          const get_Navidrome_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_random_search(
            store_server_login_info.server_url
          )
        } else if (serverUsersStore.server_select_kind === 'navidrome') {
          const get_Navidrome_Temp_Data_To_LocalSqlite =
            new Get_Navidrome_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_random_search(
            serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest',
            serverUserModelStore.username,
            serverUserModelStore.token,
            serverUserModelStore.salt
          )
        } else if (
          serverUsersStore.server_select_kind === 'jellyfin' ||
          serverUsersStore.server_select_kind === 'emby'
        ) {
          await new Get_Jellyfin_Temp_Data_To_LocalSqlite().get_home_list_of_random_search(
            serverUserModelStore.parentid_of_Je_Music
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
  }

  /**
   * 获取最近添加的首页数据
   */
  async function fetchData_Home_of_recently_added() {
    try {
      store_view_home_page_info.home_Files_temporary_recently_added = []
      if (serverUserModelStore.model_server_type_of_local) {
        const get_HomeDataInfos_From_LocalSqlite = new Get_LocalSqlite_HomeDataInfos()
        store_view_home_page_info.home_Files_temporary_recently_added =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Recently_Added()
      } else if (serverUserModelStore.model_server_type_of_web) {
        if (serverUsersStore.server_select_kind === 'ninesong') {
          const get_Navidrome_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_recently_added(
            store_server_login_info.server_url
          )
        } else if (serverUsersStore.server_select_kind === 'navidrome') {
          const get_Navidrome_Temp_Data_To_LocalSqlite =
            new Get_Navidrome_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_recently_added(
            serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest',
            serverUserModelStore.username,
            serverUserModelStore.token,
            serverUserModelStore.salt
          )
        } else if (
          serverUsersStore.server_select_kind === 'jellyfin' ||
          serverUsersStore.server_select_kind === 'emby'
        ) {
          await new Get_Jellyfin_Temp_Data_To_LocalSqlite().get_home_list_of_recently_added(
            serverUserModelStore.parentid_of_Je_Music
          )
        }
      }
    } catch (error) {
      console.error('Failed to fetch recently added data:', error)
    }
  }

  /**
   * 获取最近播放的首页数据
   */
  async function fetchData_Home_of_recently_played() {
    try {
      store_view_home_page_info.home_Files_temporary_recently_played = []
      if (serverUserModelStore.model_server_type_of_local) {
        const get_HomeDataInfos_From_LocalSqlite = new Get_LocalSqlite_HomeDataInfos()
        store_view_home_page_info.home_Files_temporary_recently_played =
          get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Album_Recently_Played()
      } else if (serverUserModelStore.model_server_type_of_web) {
        if (serverUsersStore.server_select_kind === 'ninesong') {
          const get_Navidrome_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_recently_played(
            store_server_login_info.server_url
          )
        } else if (serverUsersStore.server_select_kind === 'navidrome') {
          const get_Navidrome_Temp_Data_To_LocalSqlite =
            new Get_Navidrome_Temp_Data_To_LocalSqlite()
          await get_Navidrome_Temp_Data_To_LocalSqlite.get_home_list_of_recently_played(
            serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest',
            serverUserModelStore.username,
            serverUserModelStore.token,
            serverUserModelStore.salt
          )
        } else if (
          serverUsersStore.server_select_kind === 'jellyfin' ||
          serverUsersStore.server_select_kind === 'emby'
        ) {
          await new Get_Jellyfin_Temp_Data_To_LocalSqlite().get_home_list_of_recently_played(
            serverUserModelStore.parentid_of_Je_Music
          )
        }
      }
    } catch (error) {
      console.error('Failed to fetch recently played data:', error)
    }
  }

  return {
    // 方法暴露
    fetchData_Home,
    fetchData_Home_of_maximum_playback,
    fetchData_Home_of_random_search,
    fetchData_Home_of_recently_added,
    fetchData_Home_of_recently_played
  }
})