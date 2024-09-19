import axios from 'axios';
import { store_server_user_model } from "@/store/server/store_server_user_model";

export class Navidrome_Api_Services_Web {
    protected readonly baseUrl: string;
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }
    protected async sendRequest(
        endpoint: string,
        params?: Record<string, string>
    ): Promise<any> {
        const headers = {
            'x-nd-authorization': `Bearer ${store_server_user_model.authorization}`,
            'x-nd-client-unique-id': store_server_user_model.client_unique_id,
        };
        const queryString = new URLSearchParams(params).toString();
        const url = `${this.baseUrl}/${endpoint}?${queryString}`;
        try {
            const response = await axios.get(url, { headers });
            return response.data;
        } catch (error: any) {
            return error.message;
        }
    }
}