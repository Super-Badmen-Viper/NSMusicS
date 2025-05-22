import {NineSong_Api_Services_Web} from "../NineSong_Api_Services_Web";

export class Medias_ApiService_of_NineSong extends NineSong_Api_Services_Web {
    public async getMedias(
        start: string, end: string,
        sort: string, order: string,
        starred: string, search: string,
        year: string,
        album_id: string, artist_id: string,
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'medias',
            {
                start,
                end,
                sort,
                order,
                starred,
                search,
                year,
                album_id,
                artist_id,
            }
        );
    }
    public async getMediaCounts(
        starred: string, search: string,
        year: string,
        album_id: string, artist_id: string,
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'medias/filter_counts',
            {
                starred,
                search,
                year,
                album_id,
                artist_id,
            }
        );
    }
    public async getMedias_Playlist(
        playlistId: string,
        start: string, end: string,
        sort: string, order: string,
        starred: string, search: string,
        year: string,
        album_id: string, artist_id: string,
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'playlists/tracks',
            {
                playlistId,
                start,
                end,
                sort,
                order,
                starred,
                search,
                year,
                album_id,
                artist_id,
            }
        );
    }
}