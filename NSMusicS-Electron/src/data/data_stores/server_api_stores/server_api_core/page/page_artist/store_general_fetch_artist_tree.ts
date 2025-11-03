import { reactive } from 'vue'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { usePageArtistStore } from '@/data/data_status/app_status/page_status/artist_store/usePageArtistStore'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/server_api/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'

export const store_general_fetch_artist_tree = reactive({
  async fetchData_ArtistTree() {
    const pageArtistStore = usePageArtistStore()
    pageArtistStore.artist_Tree_Artist_info = undefined
    pageArtistStore.artist_Tree_Album_Tree_temporary = []
    if (store_server_user_model.model_server_type_of_local) {
    } else if (store_server_user_model.model_server_type_of_web) {
      await this.fetchData_ArtistTree_of_server_web_start()
    }
  },

  _start: 0,
  _end: 5,
  _artist_id: '',
  async fetchData_ArtistTree_of_server_web_start() {
    const pageArtistStore = usePageArtistStore()
    pageArtistStore.artist_Tree_Artist_info = undefined
    pageArtistStore.artist_Tree_Album_Tree_temporary = []
    this._start = 0
    this._end = 5
    await this.fetchData_ArtistTree_of_server_web()
  },
  async fetchData_ArtistTree_of_server_web_end() {
    this._start += 5
    this._end += 5
    await this.fetchData_ArtistTree_of_server_web()
  },
  async fetchData_ArtistTree_of_server_web() {
    try {
      if (this._artist_id.length > 0) {
        if (store_server_user_model.model_server_type_of_local) {
        } else if (store_server_user_model.model_server_type_of_web) {
          if (store_server_users.server_select_kind === 'ninesong') {
            const get_NineSong_Temp_Data_To_LocalSqlite =
              new Get_NineSong_Temp_Data_To_LocalSqlite()
            await get_NineSong_Temp_Data_To_LocalSqlite.get_artist_tree(
              store_server_login_info.server_url,
              String(this._start),
              String(this._end),
              String(this._artist_id)
            )
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch artist data:', error)
    }
  },
})
