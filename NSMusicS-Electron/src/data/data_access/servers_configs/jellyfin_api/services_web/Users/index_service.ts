import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web";

export class Users_ApiService_of_Je extends Jellyfin_Api_Services_Web {
    /**
     * 获取所有用户信息
     * @returns 响应数据
     */
    public async getUsers_ALL(): Promise<any> {
        return this.sendRequest(
            'GET',
            'Users'
        );
    }

    /**
     * 获取指定用户信息
     * @param userId 用户 ID
     * @returns 响应数据
     */
    public async getUsers_id(userId: string): Promise<any> {
        return this.sendRequest(
            'GET',
            `Users/${userId}`
        );
    }
}