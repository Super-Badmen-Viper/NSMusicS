import {NineSong_Api_Services_Web} from "../NineSong_Api_Services_Web";

export class Albums_ApiService_of_NineSong extends NineSong_Api_Services_Web {
    public async getAlbums(
        start: string, end: string,
        sort: string, order: string,
        starred: string, search: string,
        min_year: string, max_year: string,
        artist_id: string,
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'albums',
            {
                start,
                end,
                sort,
                order,
                starred,
                search,
                min_year,
                max_year,
                artist_id,
            }
        );
    }
    public async getAlbumCounts(
        starred: string, search: string,
        min_year: string, max_year: string,
        artist_id: string,
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'albums/filter_counts',
            {
                starred,
                search,
                min_year,
                max_year,
                artist_id,
            }
        );
    }
}