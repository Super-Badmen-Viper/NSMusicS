import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web";
import {store_server_users} from "../../../../../data_stores/server/store_server_users";
import {store_server_user_model} from "../../../../../data_stores/server/store_server_user_model";

export class UserPlayedItems_ApiService_of_Je extends Jellyfin_Api_Services_Web {
    public async getUserPlayedItems_Quick(
        userId: string, itemId: string, datePlayed: string
    ): Promise<any> {
        if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'jellyfin') {
            return this.sendRequest(
                'POST',
                `UserPlayedItems/${itemId}`,
                {
                    userId,
                    datePlayed
                }
            );
        }else{
            return this.sendRequest(
                'POST',
                `Users/${store_server_user_model.userid_of_Je}/PlayedItems/${itemId}`
            );
        }
    }
}