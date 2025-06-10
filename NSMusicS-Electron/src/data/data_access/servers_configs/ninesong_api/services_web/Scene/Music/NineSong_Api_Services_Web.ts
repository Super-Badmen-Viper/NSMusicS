import axios from 'axios';
import { store_server_login_info } from "@/views/view_server/page_metadata/page_login/store/store_server_login_info";
import { store_server_user_model } from "@/data/data_stores/server/store_server_user_model";

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
     * @param data 请求体数据
     * @returns 响应数据
     */
    protected async sendRequest(
        method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH',
        endpoint: string,
        params?: Record<string, string>,
        data?: any,
    ): Promise<any> {
        let headers = {
            Authorization: `Bearer ${store_server_login_info.server_accessToken}`
        };
        const queryString = params ? new URLSearchParams(params).toString() : '';
        const url = this.baseUrl.includes('api')
            ? `${this.baseUrl}/${endpoint}${queryString ? `?${queryString}` : ''}`
            : `${this.baseUrl}/api/${endpoint}${queryString ? `?${queryString}` : ''}`;

        try {
            if (
                endpoint === 'user/login' ||
                (store_server_login_info.server_accessToken != undefined && store_server_login_info.server_accessToken.length > 0)
            ) {
                let response;
                if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
                    // 设置 Content-Type 为 application/x-www-form-urlencoded
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    const formData = new URLSearchParams();
                    if (data) {
                        for (const key in data) {
                            formData.append(key, data[key]);
                        }
                    }
                    response = await axios({
                        method,
                        url,
                        headers,
                        data: formData.toString(),
                    });
                } else {
                    response = await axios({
                        method,
                        url,
                        headers,
                        data,
                    });
                }
                if(response.status === 204) {
                    return true
                }
                return response.data;
            }
            return undefined;
        } catch (error: any) {
            if (error.message.indexOf('401') > 0) {
                const result = await store_server_user_model.refresh_model_server_type_of_web();
                if (result) {
                    try {
                        if (
                            endpoint === 'user/login' ||
                            (store_server_login_info.server_accessToken != undefined && store_server_login_info.server_accessToken.length > 0)
                        ) {
                            let response;
                            if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
                                headers['Content-Type'] = 'application/x-www-form-urlencoded';
                                const formData = new URLSearchParams();
                                if (data) {
                                    for (const key in data) {
                                        formData.append(key, data[key]);
                                    }
                                }
                                response = await axios({
                                    method,
                                    url,
                                    headers,
                                    data: formData.toString(),
                                });
                            } else {
                                response = await axios({
                                    method,
                                    url,
                                    headers,
                                    data,
                                });
                            }
                            return response.data;
                        }
                        return undefined;
                    } catch {
                    }
                }
            }
            console.error('请求失败:', error);
            return undefined;
        }
    }
}