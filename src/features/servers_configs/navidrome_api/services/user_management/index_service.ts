import {Navidrome_Api_Services} from "@/features/servers_configs/navidrome_api/services/Navidrome_Api_Services";

export class User_ApiService_of_ND extends Navidrome_Api_Services {
    public async getUser(username: string,token: string,salt: string): Promise<any> {
        return this.sendRequest(username, token, salt, 'getUser');
    }
}