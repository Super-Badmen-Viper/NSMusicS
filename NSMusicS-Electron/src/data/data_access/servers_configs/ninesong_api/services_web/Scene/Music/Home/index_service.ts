import {NineSong_Api_Services_Web} from "../NineSong_Api_Services_Web";

export class Home_ApiService_of_NineSong extends NineSong_Api_Services_Web {
    public async getRandomArtists(
        start: string, end: string,
        sort: string, order: string,
        starred: string, search: string
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'homes/artists/random',
            {
                start,
                end,
                sort,
                order,
                starred,
                search,
            }
        );
    }
    public async getRandomAlbums(
        start: string, end: string,
        sort: string, order: string,
        starred: string, search: string
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            '/homes/albums/random',
            {
                start,
                end,
                sort,
                order,
                starred,
                search,
            }
        );
    }
    public async getRandomMedias(
        start: string, end: string,
        sort: string, order: string,
        starred: string, search: string
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            '/homes/medias/random',
            {
                start,
                end,
                sort,
                order,
                starred,
                search,
            }
        );
    }
}