import {NineSong_Api_Services_Web} from "../NineSong_Api_Services_Web";

export class Home_ApiService_of_NineSong extends NineSong_Api_Services_Web {
    public async getRandomArtists(
        start: string, end: string,
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'homes/artists/random',
            {
                start,
                end,
            }
        );
    }
    public async getRandomAlbums(
        start: string, end: string,
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            '/homes/albums/random',
            {
                start,
                end,
            }
        );
    }
    public async getRandomMedias(
        start: string, end: string,
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            '/homes/medias/random',
            {
                start,
                end,
            }
        );
    }

    public async getAlbumList_Play_Count(): Promise<any> {
        return this.sendRequest(
            'GET',
            'albums',
            {
                start: '0',
                end: '15',
                sort: 'play_count',
                order: 'desc',
            }
        );
    }
    public async getAlbumList_Recently_Added(): Promise<any> {
        return this.sendRequest(
            'GET',
            'albums',
            {
                start: '0',
                end: '15',
                sort: 'recently_added',
                order: 'desc',
            }
        );
    }
    public async getAlbumList_Play_Date(): Promise<any> {
        return this.sendRequest(
            'GET',
            'albums',
            {
                start: '0',
                end: '15',
                sort: 'play_date',
                order: 'desc',
            }
        );
    }
}