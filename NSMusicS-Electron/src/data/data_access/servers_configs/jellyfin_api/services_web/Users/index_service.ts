import { Jellyfin_Api_Services_Web } from "../Jellyfin_Api_Services_Web";
import { isElectron } from '@/utils/electron/isElectron';
import axios from "axios";

export class Users_ApiService_of_Je extends Jellyfin_Api_Services_Web {
    public async getUsers_ALL(): Promise<any> {
        return this.sendRequest(
            'GET',
            'Users'
        );
    }

    public async getUsers_id(userId: string): Promise<any> {
        return this.sendRequest(
            'GET',
            `Users/${userId}`
        );
    }

    public async authenticateUserByName(
        baseUrl: string,
        username: string,
        password: string
    ): Promise<any> {
        try {
            const method = 'POST';
            const endpoint = 'Users/AuthenticateByName';
            const url = `${baseUrl}/${endpoint}`;
            const AccessToken = '';
            const Version = '1.5.9';
            const Client = isElectron ? 'Electron Desktop' : 'Web';
            const Device = isElectron ? 'NSMusicS' : 'NineSong';
            const DeviceId = isElectron ? 'NSMusicS '+Version : 'NineSong '+Version;
            const headers = {
                'Authorization': `MediaBrowser Token="${AccessToken}", Client="${Client}", Device="${Device}", DeviceId="${DeviceId}-GO", Version="1.5.9"`
            };
            const data = {
                Username: username,
                Pw: password,
            };
            const response = await axios({
                method,
                url,
                headers,
                data,
            });
            return {
                AccessToken: response.data.AccessToken,
                User: response.data.User
            };
        } catch (error) {
            console.error('认证失败:', error);
            return undefined;
        }
    }
}