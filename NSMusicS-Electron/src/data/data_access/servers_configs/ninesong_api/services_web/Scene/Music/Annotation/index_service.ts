import {NineSong_Api_Services_Web} from "../NineSong_Api_Services_Web";

export class Annotation_ApiService_of_NineSong extends NineSong_Api_Services_Web {
    public async setStar(
        item_id: string, item_type: string,
    ): Promise<any> {
        return this.sendRequest(
            'POST',
            'annotations/star',
            {
                item_id,
                item_type,
            }
        );
    }
    public async setUnStar(
        item_id: string, item_type: string,
    ): Promise<any> {
        return this.sendRequest(
            'POST',
            'annotations/unstar',
            {
                item_id,
                item_type,
            }
        );
    }
    public async setRating(
        item_id: string, item_type: string,
        rating: string
    ): Promise<any> {
        return this.sendRequest(
            'POST',
            'annotations/rating',
            {
                item_id,
                item_type,
                rating,
            }
        );
    }
    public async setScrobble(
        item_id: string, item_type: string,
    ): Promise<any> {
        return this.sendRequest(
            'POST',
            'annotations/scrobble',
            {
                item_id,
                item_type,
            }
        );
    }
    public async setScrobbleComplete(
        item_id: string, item_type: string,
    ): Promise<any> {
        return this.sendRequest(
            'POST',
            'annotations/scrobble/complete',
            {
                item_id,
                item_type,
            }
        );
    }
}