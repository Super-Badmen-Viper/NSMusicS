import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePageRecommendStore = defineStore('pageRecommend', () => {
  // 使用ref替代reactive管理状态
  const recommend_WordCloudTag_metadata = ref<any[]>([])
  const recommend_WordCloudGenre_metadata = ref<any[]>([])
  const recommend_MediaSearch_metadata = ref<any[]>([])
  const recommend_MediaFiles_metadata = ref<any[]>([])
  const recommend_MediaFiles_temporary = ref<any[]>([])

  return {
    recommend_WordCloudTag_metadata,
    recommend_WordCloudGenre_metadata,
    recommend_MediaSearch_metadata,
    recommend_MediaFiles_metadata,
    recommend_MediaFiles_temporary,
  }
})
