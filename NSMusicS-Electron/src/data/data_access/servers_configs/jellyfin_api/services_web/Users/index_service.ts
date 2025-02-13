import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web";
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
        baseUrl: string, username: string,password: string
    ): Promise<any> {
        try {
            const method = 'POST'
            const endpoint = 'Users/AuthenticateByName'
            const url = `${baseUrl}/${endpoint}`;
            const AccessToken = '27ec731cc56344159d05822f13bfef75';
            const headers = {
                'Authorization': `MediaBrowser Token="${AccessToken}", Client="Electron Desktop", Device="NSMusicS", DeviceId="NSMusicS-GO", Version="1.3.4"`
            };
            const data = {
                Username: username,
                Pw: password,
            };
            const test = await axios({
                method,
                url,
                headers,
                data,
            });
            return {
                AccessToken: test.data.AccessToken,
                User: test.data.User
            };
        }catch{
            return undefined
        }
    }
}