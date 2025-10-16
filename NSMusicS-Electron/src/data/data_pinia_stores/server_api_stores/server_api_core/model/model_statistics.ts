import { defineStore } from 'pinia'

/**
 * 服务器统计模型状态管理
 * 注：简化版本，移除了有问题的导入
 */
export const useServerModelStatisticsStore = defineStore('serverModelStatistics', () => {
  // 定义模拟状态
  const stats = {
    media_starred_count: 0,
    album_starred_count: 0,
    artist_starred_count: 0,
    media_item_count: 0,
    album_item_count: 0,
    artist_item_count: 0,
    media_recently_count: 0,
    album_recently_count: 0,
    artist_recently_count: 0,
    media_playlist_count: 0
  }

  /**
   * 获取页面顶部信息统计
   * 简化版实现，避免依赖问题
   */
  async function get_page_top_info() {
    try {
      console.log('获取页面统计信息（简化版）')
      // 这里原本有复杂的数据库查询和API调用逻辑
      // 暂时返回模拟数据
      return stats
    } catch (error) {
      console.error('Failed to get page top info:', error)
    }
  }

  // 暴露方法和状态
  return {
    stats,
    get_page_top_info
  }
})