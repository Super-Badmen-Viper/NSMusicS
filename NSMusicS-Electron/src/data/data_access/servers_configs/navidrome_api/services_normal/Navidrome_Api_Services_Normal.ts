import axios from 'axios';

export class Navidrome_Api_Services_Normal {
    protected readonly baseUrl: string;
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }
    protected getCommonParams(username: string, token: string, salt:string): Record<string, string> {
        return {
            u: username,
            t: token,
            s: salt,
            v: '1.12.0',
            c: 'nsmusics',
            f: 'json',
        };
    }
    protected async sendRequest(
        username: string, token: string, salt: string,
        endpoint: string, params?: Record<string, string>): Promise<any> {
        const queryString = new URLSearchParams({
            ...this.getCommonParams(username, token, salt),
            ...params,
        }).toString();
        const url = `${this.baseUrl}/${endpoint}?${queryString}`;
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error: any) {
            return error.message;
        }
    }
}