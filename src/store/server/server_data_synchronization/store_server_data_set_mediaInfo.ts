import {reactive} from 'vue'
import {store_server_users} from "@/store/server/store_server_users";
import {
    Media_Annotation_ApiService_of_ND
} from "@/features/servers_configs/navidrome_api/services/media_annotation/index_service";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {Playlists_ApiService_of_ND} from "@/features/servers_configs/navidrome_api/services/playlists/index_service";

export const store_server_data_set_mediaInfo = reactive({
    async Set_MediaInfo_To_Favorite(id: string, value: Boolean){
        if(!value) {
            await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .set_star(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    id,'','');
        }else{
            await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .set_unstar(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    id,'','');
        }
    },
    async Set_MediaInfo_To_Rating(id: any, value: number){
        await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
            .set_rating(
                store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                id,
                String(value));
    },
    async Set_MediaInfo_To_PlayCount_of_Media_File(item_id: any){
        await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
            .set_scrobble(
                store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                item_id, '', '');
    },
    async Set_MediaInfo_Add_Selected_Playlist(media_file_id: any, playlist_id: any){
        await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
            .updatePlaylist_set(
                store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                playlist_id, '', '', '', media_file_id, '');
    },
    async Set_MediaInfo_Delete_Selected_Playlist(media_file_id: any, playlist_id: any){
        await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
            .updatePlaylist_set(
                store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                playlist_id, '', '', '', '', media_file_id);
    }
});