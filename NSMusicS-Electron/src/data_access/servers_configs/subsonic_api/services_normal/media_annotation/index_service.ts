import {Subsonic_Api_Services_Normal} from "@/features/servers_configs/subsonic_api/services_normal/Subsonic_Api_Services_Normal";

export class Media_Annotation_ApiService_of_ND extends Subsonic_Api_Services_Normal {
    public async set_star(username: string,token: string,salt: string,id: string,albumId: string,artistId :string): Promise<any> {
        return this.sendRequest(username,token,salt,'star', { id, albumId, artistId });
    }
    public async set_unstar(username: string,token: string,salt: string,id: string,albumId: string,artistId :string): Promise<any> {
        return this.sendRequest(username,token,salt,'unstar', { id, albumId, artistId });
    }
    public async set_rating(username: string,token: string,salt: string,id: string, rating: string): Promise<any> {
        return this.sendRequest(username,token,salt,'setRating', {id, rating});
    }
    public async set_scrobble(username: string,token: string,salt: string,id: string, time: string, submission: string): Promise<any> {
        return this.sendRequest(username,token,salt,'scrobble', {id, time, submission});
    }
}