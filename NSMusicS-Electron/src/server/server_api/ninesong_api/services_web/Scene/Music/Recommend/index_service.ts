import { NineSong_Api_Services_Web } from '../NineSong_Api_Services_Web'
import { usePageRecommendStore } from '@/data/data_status/page_status/recommend_store/usePageRecommendStore';

export class Recommend_ApiService_of_NineSong extends NineSong_Api_Services_Web {
  public async getWordCloudTag(): Promise<any> {
    return this.sendRequest('GET', 'word_cloud')
  }
  public async getWordCloudGenre(): Promise<any> {
    return this.sendRequest('GET', 'word_cloud/genre')
  }
  public async getHighFrequency(limit: string): Promise<any> {
    return this.sendRequest('GET', 'word_cloud/high', {
      limit,
    })
  }
  public async getWordCloudRecommended(keywords: string): Promise<any> {
    return this.sendRequest('POST', 'word_cloud/recommend', undefined, {
      keywords,
    })
  }

  public async GetGeneralRecommendations(
    recommend_type: string,
    limit: string,
    random_seed: string,
    recommend_offset: string
  ): Promise<any> {
    const pageRecommendStore = usePageRecommendStore()
    let refresh = pageRecommendStore.recommend_MediaFiles_RefreshRecommendations
    return this.sendRequest('GET', 'recommend/general', {
      recommend_type,
      limit,
      random_seed,
      recommend_offset,
      refresh,
    })
  }
  public async getPersonalizedRecommendations(
    recommend_type: string,
    limit: string,
    user_id: string
  ): Promise<any> {
    const pageRecommendStore = usePageRecommendStore()
    let refresh = pageRecommendStore.recommend_MediaFiles_RefreshRecommendations
    return this.sendRequest('GET', 'recommend/personalized', {
      recommend_type,
      limit,
      user_id,
      refresh,
    })
  }
  public async getPopularRecommendations(recommend_type: string, limit: string): Promise<any> {
    const pageRecommendStore = usePageRecommendStore()
    let refresh = pageRecommendStore.recommend_MediaFiles_RefreshRecommendations
    return this.sendRequest('GET', 'recommend/popular', {
      recommend_type,
      limit,
      refresh,
    })
  }
}
