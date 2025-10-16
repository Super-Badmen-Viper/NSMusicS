import { defineStore } from 'pinia'
import { ref } from 'vue'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
import { store_view_charts_page_info } from '@/views/view_app/page/page_charts/store/store_view_charts_page_info'
import { isElectron } from '@/utils/electron/isElectron'

/**
 * 排行榜数据获取逻辑 store
 * 提供排行榜数据的获取和处理功能
 */
export const useGeneralFetchChartsListStore = defineStore('generalFetchChartsList', () => {
  const serverUsersStore = useServerUsersStore()
  
  /**
   * 获取排行榜数据
   */
  async function fetchData_Charts() {
    try {
      store_view_charts_page_info.charts_media_file_metadata = []
      store_view_charts_page_info.charts_album_metadata = []
      store_view_charts_page_info.charts_artist_metadata = []
      store_view_charts_page_info.charts_media_cue_metadata = []

      // 网络服务器类型 - 仅保留ninesong实现，其他暂时注释
      if (store_server_user_model.model_server_type_of_web) {
        const serverKind = serverUsersStore.server_select_kind || 'ninesong'
        
        if (serverKind === 'ninesong') {
          // 简化实现，使用空数据
          Object.assign(store_view_charts_page_info, {
            charts_media_file_metadata: [],
            charts_album_metadata: [],
            charts_artist_metadata: [],
            charts_media_cue_metadata: [],
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch charts data:', error)
    }
  }

  /**
   * 刷新排行榜数据
   */
  async function refreshChartsData() {
    await fetchData_Charts()
  }

  return {
    // 方法暴露
    fetchData_Charts,
    refreshChartsData
  }
})