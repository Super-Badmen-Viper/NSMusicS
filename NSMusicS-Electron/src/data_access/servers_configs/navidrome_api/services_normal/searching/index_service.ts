import {Navidrome_Api_Services_Normal} from "@/features/servers_configs/navidrome_api/services_normal/Navidrome_Api_Services_Normal";

export class Searching_ApiService_of_ND extends Navidrome_Api_Services_Normal {
    // artistCount: artistCount.toString(),
    // artistOffset: artistOffset.toString(),
    // albumCount: albumCount.toString(),
    // albumOffset: albumOffset.toString(),
    // songCount: songCount.toString(),
    // songOffset: songOffset.toString()
    public async getSearch2(
        username: string, token: string, salt: string,
        query: string,
        artistCount: number, artistOffset: number,
        albumCount: number, albumOffset: number,
        songCount: number, songOffset: number): Promise<any> {
        return this.sendRequest(
            username, token, salt, 'search2', {
                query,
            }
        );
    }
    public async getSearch3(
        username: string,token: string,salt: string,
        query: string,): Promise<any> {
        return this.sendRequest(
            username, token, salt, 'search3', {
                query,
            });
    }
}