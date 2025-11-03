import { reactive } from 'vue'
import { Get_LocalSqlite_HomeDataInfos } from '@/data/data_repository/app_repository/LocalSqlite_Get_HomeDataInfos'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { Get_Navidrome_Temp_Data_To_LocalSqlite } from '@/server_api/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { Get_Jellyfin_Temp_Data_To_LocalSqlite } from '@/server_api/jellyfin_api/services_web_instant_access/class_Get_Jellyfin_Temp_Data_To_LocalSqlite'
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/server_api/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
import { usePageChartsStore } from '@/data/data_status/app_status/page_status/charts_store/usePageChartsStore'

export const store_general_fetch_charts_list = reactive({
  async fetchData_Charts() {
    const pageChartsStore = usePageChartsStore()
    try {
      pageChartsStore.charts_media_file_metadata = []
      pageChartsStore.charts_album_metadata = []
      pageChartsStore.charts_artist_metadata = []
      pageChartsStore.charts_media_cue_metadata = []

      if (
        store_server_user_model.model_server_type_of_web &&
        store_server_users.server_select_kind === 'ninesong'
      ) {
        const dataLoader = new Get_NineSong_Temp_Data_To_LocalSqlite()
        const [
          charts_media_file_metadata,
          charts_album_metadata,
          charts_artist_metadata,
          charts_media_cue_metadata,
        ] = await dataLoader.get_home_list_of_maximum_playback(
          store_server_login_info.server_url,
          true
        )

        pageChartsStore.charts_media_file_metadata = charts_media_file_metadata
        pageChartsStore.charts_album_metadata = charts_album_metadata
        pageChartsStore.charts_artist_metadata = charts_artist_metadata
        pageChartsStore.charts_media_cue_metadata = charts_media_cue_metadata
      }
    } catch (error) {
      console.error('Failed to fetch home data:', error)
    }
  },
})
