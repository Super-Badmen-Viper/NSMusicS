import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web";
import axios from "axios";
import {store_server_user_model} from "../../../../../data_stores/server/store_server_user_model";
import {store_server_users} from "@/data/data_stores/server/store_server_users";

export class UserFavoriteItems_ApiService_of_Je extends Jellyfin_Api_Services_Web {
    public async getUserFavoriteItems_Quick(
        userId: string, itemId: string,
    ): Promise<any> {
        if(store_server_users.server_select_kind === 'jellyfin') {
            return this.sendRequest(
                'POST',
                `UserFavoriteItems/${itemId}`,
                {
                    userId
                }
            );
        }else{
            const response = await axios.post(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/emby/Users/' +
                store_server_user_model.userid_of_Je + '/FavoriteItems/' + itemId +
                '?api_key=' + store_server_user_model.authorization_of_Je
            );
            return response.data;
        }
    }
    public async delUserFavoriteItems_Quick(
        userId: string, itemId: string,
    ): Promise<any> {
        if(store_server_users.server_select_kind === 'jellyfin') {
            return this.sendRequest(
                'DELETE',
                `UserFavoriteItems/${itemId}`,
                {
                    userId
                }
            );
        }else{
            const response = await axios.post(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/emby/Users/' +
                store_server_user_model.userid_of_Je + '/FavoriteItems/' + itemId +
                '/Delete?api_key=' + store_server_user_model.authorization_of_Je
            );
            return response.data;
        }
    }
}