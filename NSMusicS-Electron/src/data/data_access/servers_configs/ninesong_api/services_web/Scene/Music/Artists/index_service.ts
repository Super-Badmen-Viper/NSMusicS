import {NineSong_Api_Services_Web} from "../NineSong_Api_Services_Web";

export class Artists_ApiService_of_NineSong extends NineSong_Api_Services_Web {
    public async getArtists(
        start: string, end: string,
        sort: string, order: string,
        starred: string, search: string
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'artists',
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
    public async getArtistCounts(
        starred: string, search: string
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'artists/filter_counts',
            {
                starred,
                search,
            }
        );
    }
}