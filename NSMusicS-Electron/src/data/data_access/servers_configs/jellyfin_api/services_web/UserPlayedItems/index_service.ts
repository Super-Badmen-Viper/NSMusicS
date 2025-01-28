import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web";

export class UserPlayedItems_ApiService_of_Je extends Jellyfin_Api_Services_Web {
    public async getUserPlayedItems_Quick(
        userId: string, itemId: string, datePlayed: string
    ): Promise<any> {
        return this.sendRequest(
            'POST',
            `UserPlayedItems/${itemId}`,
            {
                userId,
                datePlayed
            }
        );
    }
}