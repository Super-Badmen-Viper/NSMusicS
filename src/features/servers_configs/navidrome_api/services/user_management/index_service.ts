import {Api_Services} from "@/features/servers_configs/navidrome_api/Api_Services";

export class UserApiService extends Api_Services {
    public async getUser(username: string,password: string): Promise<any> {
        return this.sendRequest(username,password,'getUser');
    }
}