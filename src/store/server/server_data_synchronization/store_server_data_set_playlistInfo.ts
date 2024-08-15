import {reactive} from 'vue'
import {Playlists_ApiService_of_ND} from "@/features/servers_configs/navidrome_api/services/playlists/index_service";
import {store_server_users} from "@/store/server/store_server_users";
import {store_server_user_model} from "@/store/server/store_server_user_model";

export const store_server_data_set_playlistInfo = reactive({
    async Set_PlaylistInfo_To_Update_CreatePlaylist_of_ND(name: string,comment: string, _public_: number){
        await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
            .createPlaylist_set(
                store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                await getUniqueId(), name,''
            );
    },
    async Set_PlaylistInfo_To_Update_SetPlaylist_of_ND(id: string, name: string,comment: string, _public_: number,){
        await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
            .updatePlaylist_set(
                store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                id, name,comment,String(_public_),'',''
            );
    },
    async Set_PlaylistInfo_To_Update_DeletePlaylist_of_ND(id:string){
        await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
            .deletePlaylist_set(
                store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                id
            );
    },

    async Set_Selected_MediaInfo_Add_Selected_Playlist(ids: string[], playlist_id: string){
        for(const id of ids){
            await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .updatePlaylist_set(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    playlist_id, '', '', '', id, '');
        }
    },
    async Set_Selected_MediaInfo_Delete_Selected_Playlist(ids: string[], playlist_id: string){
        for(const id of ids){
            await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .updatePlaylist_set(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    playlist_id, '', '', '', '', id);
        }
    }
});
async function getUniqueId() {
    const { v4: uuidv4 } = require('uuid');
    let id;
    let exists;
    do {
        id = uuidv4();
        const result = await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
            .getPlaylist_id(
                store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                id
            );
        exists = result["subsonic-response"]["status"] === 'ok';
    } while (exists);

    return id;
}