import {Navidrome_Api_Services_Normal} from "@/features/servers_configs/navidrome_api/services_normal/Navidrome_Api_Services_Normal";

export class Playlists_ApiService_of_ND extends Navidrome_Api_Services_Normal {
    public async getPlaylists_all(username: string,token: string,salt: string): Promise<any> {
        return this.sendRequest(username,token,salt,'getPlaylists');
    }
    public async getPlaylist_id(username: string,token: string,salt: string,id: string,): Promise<any> {
        return this.sendRequest(username, token, salt, 'getPlaylist', { id });
    }

    public async createPlaylist_set(
        username: string,token: string,salt: string,
        name: string
    ): Promise<any> {
        return this.sendRequest(username, token, salt, 'createPlaylist', {
            name
        });
    }
    public async updatePlaylist_infoUpdate(
        username: string, token: string, salt: string,
        playlistId: string, name: string, comment: string, isPublic: string,
    ): Promise<any> {
        return this.sendRequest(username, token, salt, 'updatePlaylist', {
            playlistId, name, comment, public: isPublic,
        });
    }
    public async updatePlaylist_songIdToAdd(
        username: string, token: string, salt: string,
        playlistId: string,
        songIdToAdd: string,
    ): Promise<any> {
        return this.sendRequest(username, token, salt, 'updatePlaylist', {
            playlistId,
            songIdToAdd,
        });
    }
    public async updatePlaylist_songIndexToRemove(
        username: string, token: string, salt: string,
        playlistId: string,
        songIndexToRemove: string
    ): Promise<any> {
        return this.sendRequest(username, token, salt, 'updatePlaylist', {
            playlistId,
            songIndexToRemove
        });
    }
    public async deletePlaylist_set(username: string,token: string,salt: string,id: string,): Promise<any> {
        return this.sendRequest(username, token, salt, 'deletePlaylist', { id });
    }
}