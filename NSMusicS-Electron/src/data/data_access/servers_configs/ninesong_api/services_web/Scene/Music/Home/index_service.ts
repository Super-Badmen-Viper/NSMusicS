import {NineSong_Api_Services_Web} from "../NineSong_Api_Services_Web";

export class Home_ApiService_of_NineSong extends NineSong_Api_Services_Web {
    public async getRandomArtists(
        start: string, end: string,
    ): Promise<any> {
        try {
            const result = await this.sendRequest(
                'GET',
                'homes/artists/random',
                {
                    start,
                    end,
                }
            );
            return result["ninesong-response"]["artists"];
        }catch (error) {
            console.error("Error fetching album list by play count:", error);
        }
        return []
    }
    public async getRandomAlbums(
        start: string, end: string,
    ): Promise<any> {
        try {
            const result = await this.sendRequest(
                'GET',
                '/homes/albums/random',
                {
                    start,
                    end,
                }
            );
            return result["ninesong-response"]["albums"];
        }catch (error) {
            console.error("Error fetching album list by play count:", error);
        }
        return []
    }
    public async getRandomMedias(
        start: string, end: string,
    ): Promise<any> {
        try {
            const result = await this.sendRequest(
                'GET',
                '/homes/medias/random',
                {
                    start,
                    end,
                }
            );
            return result["ninesong-response"]["medias"];
        }catch (error) {
            console.error("Error fetching album list by play count:", error);
        }
        return []
    }

    public async getAlbumList_Play_Count(): Promise<any> {
        try {
            const result = await this.sendRequest(
                'GET',
                'albums',
                {
                    start: '0',
                    end: '15',
                    sort: 'play_count',
                    order: 'desc',
                }
            );
            return result["ninesong-response"]["albums"];
        }catch (error) {
            console.error("Error fetching album list by play count:", error);
        }
        return []
    }
    public async getAlbumList_Recently_Added(): Promise<any> {
        try {
            const result = await this.sendRequest(
                'GET',
                'albums',
                {
                    start: '0',
                    end: '15',
                    sort: 'recently_added',
                    order: 'desc',
                }
            );
            return result["ninesong-response"]["albums"];
        }catch (error) {
            console.error("Error fetching album list by play count:", error);
        }
        return []
    }
    public async getAlbumList_Play_Date(): Promise<any> {
        try {
            const result = await this.sendRequest(
                'GET',
                'albums',
                {
                    start: '0',
                    end: '15',
                    sort: 'play_date',
                    order: 'desc',
                }
            );
            return result["ninesong-response"]["albums"];
        }catch (error) {
            console.error("Error fetching album list by play count:", error);
        }
        return []
    }
}