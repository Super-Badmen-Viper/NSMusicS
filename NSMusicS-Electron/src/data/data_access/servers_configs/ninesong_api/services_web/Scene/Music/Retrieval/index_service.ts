import {NineSong_Api_Services_Web} from "../NineSong_Api_Services_Web";

export class Retrieval_ApiService_of_NineSong extends NineSong_Api_Services_Web {
    public async getStream_id(
        media_file_id: string,
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'media/stream',
            {
                media_file_id,
            }
        );
    }
    public async getDownload_id(
        media_file_id: string,
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'media/download',
            {
                media_file_id,
            }
        );
    }
    public async getCoverArt_id(
        cover_art_id: string,
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'media/cover',
            {
                cover_art_id,
            }
        );
    }
    public async getLyrics_id(
        media_file_id: string,
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'media/lyrics',
            {
                media_file_id,
            }
        );
    }
}