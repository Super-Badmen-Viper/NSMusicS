import {Navidrome_Api_Services} from "@/features/servers_configs/navidrome_api/services/Navidrome_Api_Services";

export class Album$Songs_Lists_ApiService_of_ND extends Navidrome_Api_Services {
    public async getStarred2_all(username: string,token: string,salt: string): Promise<any> {
        return this.sendRequest(username,token,salt,'getStarred2');
    }
    public async getNowPlaying_all(username: string,token: string,salt: string): Promise<any> {
        return this.sendRequest(username,token,salt,'getNowPlaying');
    }

}