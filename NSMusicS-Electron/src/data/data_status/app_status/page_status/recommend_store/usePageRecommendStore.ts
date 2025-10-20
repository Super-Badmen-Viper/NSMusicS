import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePageRecommendStore = defineStore('pageRecommend', () => {
  // 使用ref替代reactive管理状态
  const recommend_WordCloudTag_metadata = ref<any[]>([])
  const recommend_WordCloudGenre_metadata = ref<any[]>([])
  const recommend_MediaSearch_metadata = ref<any[]>([])
  const recommend_MediaFiles_metadata = ref<any[]>([])
  const recommend_MediaFiles_temporary = ref<any[]>([])

  // 返回状态和方法
  return {
    // 状态
    recommend_WordCloudTag_metadata,
    recommend_WordCloudGenre_metadata,
    recommend_MediaSearch_metadata,
    recommend_MediaFiles_metadata,
    recommend_MediaFiles_temporary,
    
    // 可以在这里添加相关的方法
    // 例如：
    // clearRecommendData() {
    //   recommend_MediaFiles_metadata.value = []
    //   // 清空其他数据
    // }
  }
})