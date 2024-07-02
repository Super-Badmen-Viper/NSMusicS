import {Navidrome_Api_Services} from "@/features/servers_configs/navidrome_api/services/Navidrome_Api_Services";

export class Searching_ApiService_of_ND extends Navidrome_Api_Services {
    public async getSearch2(
        username: string,token: string,salt: string,
        quary: string,
        artistCount:number,artistOffset:number,
        albumCount:number,albumOffset:number,
        songCount:number,songOffset:number,): Promise<any> {
        return this.sendRequest(
            username, token, salt, 'search2', {
                quary,
                artistCount,artistOffset,
                albumCount,albumOffset,
                songCount,songOffset
            });
    }
    public async getSearch3(
        username: string,token: string,salt: string,
        quary: string,
        artistCount:number,artistOffset:number,
        albumCount:number,albumOffset:number,
        songCount:number,songOffset:number,): Promise<any> {
        return this.sendRequest(
            username, token, salt, 'search3', {
                quary,
                artistCount,artistOffset,
                albumCount,albumOffset,
                songCount,songOffset
            });
    }
}