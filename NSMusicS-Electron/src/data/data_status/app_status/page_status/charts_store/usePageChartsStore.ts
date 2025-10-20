import { defineStore } from 'pinia'
import { ref } from 'vue'
import { store_general_fetch_charts_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_charts/store_general_fetch_charts_list'

export const usePageChartsStore = defineStore('pageCharts', () => {
  // 从 store_view_charts_page_info.ts 合并的状态
  const charts_media_file_metadata = ref<any[]>([])
  const charts_album_metadata = ref<any[]>([])
  const charts_artist_metadata = ref<any[]>([])
  const charts_media_cue_metadata = ref<any[]>([])
  const charts_data_temporary = ref<any[]>([])

  // 从 store_view_charts_page_logic.ts 合并的方法
  async function fetchData_Charts() {
    try {
      // 并行获取所有数据
      await store_general_fetch_charts_list.fetchData_Charts()

      // 定义统一处理函数
      const processData = (sourceData: any[], targetIndex: number, maxItems = 10) => {
        const addedIds = new Set()
        const result = []

        // 去重处理
        for (const row of sourceData.slice(0, 18)) {
          if (!row.id || addedIds.has(row.id)) continue
          addedIds.add(row.id)
          result.push({
            id: row.id,
            name: row.name ?? row.title,
            play_count: row.play_count,
            rating: row.rating,
            starred: row.favorite,
            play_complete_count: row.play_complete_count,
            play_date: row.play_date,
          })
        }

        // 排序并截取
        charts_data_temporary.value[targetIndex].items = result
          .sort((a, b) => b.play_count - a.play_count) // 降序排序
          .slice(0, maxItems)
        charts_data_temporary.value[targetIndex].items.reverse()
      }

      // 并行处理所有数据类型
      await Promise.all([
        processData(charts_media_file_metadata.value, 0),
        processData(charts_album_metadata.value, 1),
        processData(charts_artist_metadata.value, 2),
        processData(charts_media_cue_metadata.value, 3),
      ])
    } catch (error) {
      console.error('图表数据加载失败:', error)
    }
  }

  // 导出所有状态和方法
  return {
    // 从 store_view_charts_page_info.ts 导出的状态
    charts_media_file_metadata,
    charts_album_metadata,
    charts_artist_metadata,
    charts_media_cue_metadata,
    charts_data_temporary,
    
    // 从 store_view_charts_page_logic.ts 导出的方法
    fetchData_Charts
  }
})