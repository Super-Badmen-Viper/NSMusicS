import axios from 'axios';
import { store_server_user_model } from "@/data/data_stores/server/store_server_user_model";
import {Users_ApiService_of_Je} from "./Users/index_service";
import {Library_ApiService_of_Je} from "./Library/index_service";

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
     * @returns 响应数据
     */
    protected async sendRequest(
        method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH',
        endpoint: string,
        params?: Record<string, string>
    ): Promise<any> {
        const headers = {
            'Authorization': `MediaBrowser Token="${store_server_user_model.authorization_of_Je}", Client="Electron Desktop", Device="NSMusicS", DeviceId="NSMusicS-GO", Version="1.2.2"`
        };
        const queryString = params ? new URLSearchParams(params).toString() : '';
        const url = `${this.baseUrl}/${endpoint}${queryString ? `?${queryString}` : ''}`;
        try {
            const response = await axios({
                method,
                url,
                headers,
            });
            return response.data;
        } catch (error: any) {
            console.error('请求失败:', error);
            return undefined;
        }
    }
}