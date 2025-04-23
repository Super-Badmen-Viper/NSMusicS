import axios from 'axios';
import { store_server_user_model } from "@/data/data_stores/server/store_server_user_model";

export class Jellyfin_Api_Services_Web {
    protected readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * 发送请求
     * @param method 请求方法（GET、POST、DELETE 等）
     * @param endpoint API 端点
     * @param params 查询参数
     * @param data
     * @returns 响应数据
     */
    protected async sendRequest(
        method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH',
        endpoint: string,
        params?: Record<string, string>,
        data?: any,
    ): Promise<any> {
        try {
            if(store_server_user_model.authorization_of_Je != undefined &&
                store_server_user_model.authorization_of_Je.length > 0) {
                const headers = {
                    'Authorization': `MediaBrowser Token="${store_server_user_model.authorization_of_Je}", Client="NSMusicS", Device="Desktop Client", DeviceId="NSMusicS-GO", Version="1.5.2"`
                };

                const queryString = params ? new URLSearchParams(params).toString() : '';
                const url = `${this.baseUrl}/${endpoint}${queryString ? `?${queryString}` : ''}`;

                const response = await axios({
                    method,
                    url,
                    headers,
                    data,
                });
                return response.data;
            }
            return undefined;
        } catch (e) {
            console.error('请求失败:', e);
            return undefined;
        }
    }
}