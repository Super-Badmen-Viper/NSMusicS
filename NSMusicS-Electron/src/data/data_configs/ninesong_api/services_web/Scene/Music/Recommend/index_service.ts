import { NineSong_Api_Services_Web } from '../NineSong_Api_Services_Web'

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

  public async getRecommendAnnotationWordCloudItems(start, end, recommend_type, random_seed, offset: string): Promise<any> {
    return this.sendRequest('POST', 'recommend/annotation_wordcloud', undefined, {
      start, end, recommend_type, random_seed, offset
    })
  }
  public async getPersonalizedRecommendations(recommend_type, limit, user_id: string): Promise<any> {
    return this.sendRequest('POST', 'recommend/personalized', undefined, {
      recommend_type, limit, user_id
    })
  }
  public async getPopularRecommendations(recommend_type, limit: string): Promise<any> {
    return this.sendRequest('POST', 'recommend/popular', undefined, {
      recommend_type, limit
    })
  }
}
