import {Navidrome_Api_Services_Normal} from "@/features/servers_configs/navidrome_api/services_normal/Navidrome_Api_Services_Normal";

export class Media_Retrieval_ApiService_of_ND extends Navidrome_Api_Services_Normal {
    public async getStream_id(
        username: string,token: string,salt: string,
        id: string,
    ){
        return this.sendRequest(
            username, token, salt, 'stream', {
                id,
            });
    }
    public async getDownload_id(
        username: string,token: string,salt: string,
        id: string,
    ){
        return this.sendRequest(
            username, token, salt, 'download', {
                id,
            });
    }
    public async getCoverArt_id(
        username: string,token: string,salt: string,
        id: string,
    ){
        return this.sendRequest(
            username, token, salt, 'getCoverArt', {
                id,
            });
    }
    public async getLyrics_filter(
        username: string,token: string,salt: string,
        artist: string,title: string,
    ){
        return this.sendRequest(
            username, token, salt, 'getLyrics', {
                artist,title,
            });
    }
    public async getLyrics_all(
        username: string,token: string,salt: string,
        id: string
    ){
        return this.sendRequest(
            username, token, salt, 'getLyricsBySongId.view', {
                id
            });
    }
    public async getAvatar_username(){

    }
}