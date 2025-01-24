import axios from 'axios';
import { store_server_user_model } from "@/data/data_stores/server/store_server_user_model";

export class Jellyfin_Api_Services_Web {
    protected readonly baseUrl: string;
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }
    protected async sendRequest(
        endpoint: string,
        params?: Record<string, string>
    ): Promise<any> {
        const headers = {
            'Authorization': `MediaBrowser Token="${store_server_user_model.authorization}", Client="Electron Desktop", Device="NSMusicS", DeviceId="NSMusicS-GO", Version="1.2.2"`
        };
        const queryString = new URLSearchParams(params).toString();
        const url = `${this.baseUrl}/${endpoint}?${queryString}`;
        try {
            const response = await axios.get(url, { headers });
            return response.data;
        } catch (error: any) {
            return undefined;
        }
    }
}