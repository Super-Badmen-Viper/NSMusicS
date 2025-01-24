import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web";

export class Artists_ApiService_of_Je extends Jellyfin_Api_Services_Web {
    public async getArtists_ALL(uuid: string): Promise<any> {
        return this.sendRequest(uuid,'Artists');
    }
    public async getMusicDirectory_id(username: string,token: string,salt: string,id: string): Promise<any> {
        return this.sendRequest(username,token,salt,'getMusicDirectory', { id });
    }
    public async getMedia(username: string,token: string,salt: string,id: string): Promise<any> {
        return this.sendRequest(username,token,salt,'getMedia', { id });
    }
    public async getAlbum(username: string,token: string,salt: string,id: string): Promise<any> {
        return this.sendRequest(username,token,salt,'getAlbum', { id });
    }
    public async getArtist(username: string,token: string,salt: string,id: string): Promise<any> {
        return this.sendRequest(username,token,salt,'getArtist', { id });
    }

    public async getRandomMedias(
        username: string,token: string,salt: string,
        size: string,
        fromYear: string, toYear: string
    ): Promise<any> {
        return this.sendRequest(username,token,salt,'getRandomMedias', {
            size,
            fromYear, toYear
        });
    }

}