import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web"

export class Albums_ApiService_of_Je extends Jellyfin_Api_Services_Web {
    public async getAlbums_instantMix_id(itemId: string): Promise<any> {
        return this.sendRequest(`/Albums/${itemId}/InstantMix`);
    }
    public async getAlbums_similar_id(itemId: string): Promise<any> {
        return this.sendRequest(`/Albums/${itemId}/Similar`);
    }
}