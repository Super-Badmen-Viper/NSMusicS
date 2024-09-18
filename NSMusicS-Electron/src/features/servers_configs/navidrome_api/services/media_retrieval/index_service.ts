import {Navidrome_Api_Services} from "@/features/servers_configs/navidrome_api/services/Navidrome_Api_Services";

export class Media_Retrieval_ApiService_of_ND extends Navidrome_Api_Services {
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