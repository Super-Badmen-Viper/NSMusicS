import axios from 'axios'
import { store_server_user_model } from '@/data/data_stores/server/store_server_user_model'

export class Navidrome_Api_Services_Web {
  protected readonly baseUrl: string
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }
  protected async sendRequest(endpoint: string, params?: Record<string, string>): Promise<any> {
    const queryString = new URLSearchParams(params).toString()
    const url = `${this.baseUrl}/${endpoint}?${queryString}`

    try {
      const response = await axios.get(url, {
        headers: {
          'x-nd-authorization': `Bearer ${store_server_user_model.authorization_of_nd}`,
          'x-nd-client-unique-id': store_server_user_model.client_unique_id,
        },
      })
      if (endpoint === 'song' || endpoint.indexOf('playlist/') >= 0) {
        return {
          data: response.data,
          count: Number(response.headers['x-total-count']),
        }
      } else {
        return response.data
      }
    } catch (error: any) {
      console.log('检测到x-nd-authorization失效，正在重新获取')
      if (error.message.indexOf('401') > 0) {
        const result = await store_server_user_model.refresh_model_server_type_of_web()
        if (result) {
          try {
            const response = await axios.get(url, {
              headers: {
                'x-nd-authorization': `Bearer ${store_server_user_model.authorization_of_nd}`,
                'x-nd-client-unique-id': store_server_user_model.client_unique_id,
              },
            })
            console.log('已成功获取最新x-nd-authorization，请忽略往上一位的api的401错误码')
            if (endpoint === 'song' || endpoint.indexOf('playlist/') >= 0) {
              return {
                data: response.data,
                count: Number(response.headers['x-total-count']),
              }
            } else {
              return response.data
            }
          } catch (error: any) {
            console.error(error)
            return undefined
          }
        }
      } else {
        console.error(error)
        return undefined
      }
    }
  }
}
