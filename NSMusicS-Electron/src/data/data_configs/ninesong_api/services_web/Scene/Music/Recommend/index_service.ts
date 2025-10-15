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
  public async getRecommended(keywords: string): Promise<any> {
    return this.sendRequest('POST', 'word_cloud/recommend', undefined, {
      keywords,
    })
  }
}
