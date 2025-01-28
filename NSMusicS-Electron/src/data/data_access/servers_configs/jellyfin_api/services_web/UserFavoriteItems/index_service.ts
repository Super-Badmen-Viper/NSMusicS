import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web";

export class UserFavoriteItems_ApiService_of_Je extends Jellyfin_Api_Services_Web {
    public async getUserFavoriteItems_Quick(
        userId: string, itemId: string,
    ): Promise<any> {
        return this.sendRequest(
            'POST',
            `UserFavoriteItems/${itemId}`,
            {
                userId
            }
        );
    }
}