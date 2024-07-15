import {Navidrome_Api_Services} from "@/features/servers_configs/navidrome_api/services/Navidrome_Api_Services";

export class Playlists_ApiService_of_ND extends Navidrome_Api_Services {
    public async getPlaylists_all(username: string,token: string,salt: string): Promise<any> {
        return this.sendRequest(username,token,salt,'getPlaylists');
    }
    public async getPlaylist_id(username: string,token: string,salt: string,id: string,): Promise<any> {
        return this.sendRequest(username, token, salt, 'getPlaylist', { id });
    }
}