import { c } from 'naive-ui'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePageRecommendStore = defineStore('pageRecommend', () => {
  const recommend_WordCloudTag_metadata = ref<any[]>([])
  const recommend_WordCloudGenre_metadata = ref<any[]>([])

  const recommend_MediaSearch_metadata = ref<any[]>([])
  const recommend_MediaFiles_temporary = ref<any[]>([])

  const recommend_MediaFiles_RefreshRecommendations = ref(false)
  const recommend_MediaFiles_GeneralRecommendations = ref<any[]>([])
  const recommend_MediaFiles_PersonalizedRecommendations = ref<any[]>([])
  const recommend_MediaFiles_PopularRecommendations = ref<any[]>([])

  return {
    recommend_WordCloudTag_metadata,
    recommend_WordCloudGenre_metadata,

    recommend_MediaSearch_metadata,
    recommend_MediaFiles_temporary,

    recommend_MediaFiles_RefreshRecommendations,
    recommend_MediaFiles_GeneralRecommendations,
    recommend_MediaFiles_PersonalizedRecommendations,
    recommend_MediaFiles_PopularRecommendations,
  }
})
