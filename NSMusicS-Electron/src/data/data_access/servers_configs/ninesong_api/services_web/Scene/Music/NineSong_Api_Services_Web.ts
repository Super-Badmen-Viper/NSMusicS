import axios from 'axios';
import {
    store_server_login_info
} from "@/views/view_server/page_metadata/page_login/store/store_server_login_info";

export class NineSong_Api_Services_Web {
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
            if(
                endpoint === 'user/login' ||
                (store_server_login_info.server_accessToken != undefined && store_server_login_info.server_accessToken.length > 0)
            ) {
                const headers = {
                    Authorization: `Bearer ${store_server_login_info.server_accessToken}`
                };

                const queryString = params ? new URLSearchParams(params).toString() : '';
                const url = this.baseUrl.includes('api')
                    ? `${this.baseUrl}/${endpoint}${queryString ? `?${queryString}` : ''}`
                    : `${this.baseUrl}/api/${endpoint}${queryString ? `?${queryString}` : ''}`;

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