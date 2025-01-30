import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web";

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
}