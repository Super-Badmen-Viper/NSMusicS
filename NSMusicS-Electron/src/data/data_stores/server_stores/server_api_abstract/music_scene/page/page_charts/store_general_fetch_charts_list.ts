import { reactive } from 'vue'
import { Get_HomeDataInfos_From_LocalSqlite } from '@/data/data_config_app/app_repository/class_Get_HomeDataInfos_From_LocalSqlite'
import { store_server_user_model } from '@/data/data_stores/server_stores/store_server_user_model'
import { Get_Navidrome_Temp_Data_To_LocalSqlite } from '@/data/data_config_server/servers_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite'
import { store_server_users } from '@/data/data_stores/server_stores/store_server_users'
import { Get_Jellyfin_Temp_Data_To_LocalSqlite } from '@/data/data_config_server/servers_configs/jellyfin_api/services_web_instant_access/class_Get_Jellyfin_Temp_Data_To_LocalSqlite'
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/data/data_config_server/servers_configs/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
import { store_view_charts_page_info } from '@/views/view_app/page/page_charts/store/store_view_charts_page_info'

export const store_general_fetch_charts_list = reactive({
  async fetchData_Charts() {
    try {
      store_view_charts_page_info.charts_media_file_metadata = []
      store_view_charts_page_info.charts_album_metadata = []
      store_view_charts_page_info.charts_artist_metadata = []
      store_view_charts_page_info.charts_media_cue_metadata = []

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

        Object.assign(store_view_charts_page_info, {
          charts_media_file_metadata,
          charts_album_metadata,
          charts_artist_metadata,
          charts_media_cue_metadata,
        })
      }
    } catch (error) {
      console.error('Failed to fetch home data:', error)
    }
  },
})
