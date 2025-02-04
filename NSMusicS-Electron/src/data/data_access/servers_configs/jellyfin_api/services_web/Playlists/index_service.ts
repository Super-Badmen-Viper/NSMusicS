import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web"
import {store_server_users} from "../../../../../data_stores/server/store_server_users";

export class Playlists_ApiService_of_Je extends Jellyfin_Api_Services_Web {
    public async postPlaylists_Create(
        name: string, ids: string, mediaType: string,
        userId: string
    ): Promise<any> {
        return this.sendRequest(
            'POST',
            'Playlists',
            {
                Name: name,
                Ids: ids,
                MediaType: mediaType,
                userId
            }
        );
    }
    public async postPlaylists_Update(playlistId: string, isPublic: boolean, name: string): Promise<any> {
        return this.sendRequest(
            'POST',
            `Playlists/${playlistId}`,
            {
                Name: name, IsPublic: isPublic
            }
        );
    }
    public async postPlaylists_Add(playlistId: string, ids: string, userId: string): Promise<any> {
        return this.sendRequest(
            'POST',
            `Playlists/${playlistId}/Items`,
            { ids,userId }
        );
    }
    public async delPlaylists_Remove(playlistId: string, entryIds: string): Promise<any> {
        if(store_server_users.server_select_kind === 'jellyfin') {
            return this.sendRequest(
                'DELETE',
                `Playlists/${playlistId}/Items`,
                {entryIds}
            );
        }else{
            return this.sendRequest(
                'POST',
                `emby/Playlists/${playlistId}/Items/Delete`,
                {entryIds}
            );
        }
    }
}