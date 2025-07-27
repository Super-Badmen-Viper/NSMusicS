import { computed, reactive } from 'vue'
import { store_view_charts_page_info } from './store_view_charts_page_info'
import { store_general_fetch_charts_list } from '../../../../../data/data_stores/server/server_api_abstract/music_scene/page/page_charts/store_general_fetch_charts_list'

export const store_view_charts_page_logic = reactive({
  async fetchData_Charts() {
    try {
      // 2. 并行获取所有数据[2](@ref)
      await store_general_fetch_charts_list.fetchData_Charts()

      // 3. 定义统一处理函数
      const processData = (sourceData: any[], targetIndex: number, maxItems = 10) => {
        const addedIds = new Set()
        const result = []

        // 去重处理[6](@ref)
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
        store_view_charts_page_info.charts_data_temporary[targetIndex].items = result
          .sort((a, b) => b.play_count - a.play_count) // 降序排序
          .slice(0, maxItems)
        store_view_charts_page_info.charts_data_temporary[targetIndex].items.reverse()
      }

      // 4. 并行处理所有数据类型[2](@ref)
      await Promise.all([
        processData(store_view_charts_page_info.charts_media_file_metadata, 0),
        processData(store_view_charts_page_info.charts_album_metadata, 1),
        processData(store_view_charts_page_info.charts_artist_metadata, 2),
        processData(store_view_charts_page_info.charts_media_cue_metadata, 3),
      ])
    } catch (error) {
      console.error('图表数据加载失败:', error)
    }
  },
})
