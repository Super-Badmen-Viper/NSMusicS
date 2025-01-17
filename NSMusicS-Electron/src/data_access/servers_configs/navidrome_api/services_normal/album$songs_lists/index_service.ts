import {Navidrome_Api_Services_Normal} from "@/features/servers_configs/navidrome_api/services_normal/Navidrome_Api_Services_Normal";

export class Album$Songs_Lists_ApiService_of_ND extends Navidrome_Api_Services_Normal {
    public async getStarred2_all(username: string,token: string,salt: string): Promise<any> {
        return this.sendRequest(username,token,salt,'getStarred2');
    }
    public async getNowPlaying_all(username: string,token: string,salt: string): Promise<any> {
        return this.sendRequest(username,token,salt,'getNowPlaying');
    }

}