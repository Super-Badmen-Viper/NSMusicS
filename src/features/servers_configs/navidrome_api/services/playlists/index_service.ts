import {Navidrome_Api_Services} from "@/features/servers_configs/navidrome_api/services/Navidrome_Api_Services";

export class Playlists_ApiService_of_ND extends Navidrome_Api_Services {
    public async getPlaylists_all(username: string,token: string,salt: string): Promise<any> {
        return this.sendRequest(username,token,salt,'getPlaylists');
    }
    public async getPlaylist_id(username: string,token: string,salt: string,id: string,): Promise<any> {
        return this.sendRequest(username, token, salt, 'getPlaylist', { id });
    }

    public async createPlaylist_set(
        username: string,token: string,salt: string,
        playlistId: string, name: string, songId: string,
    ): Promise<any> {
        return this.sendRequest(username, token, salt, 'createPlaylist', {
            playlistId, name, songId
        });
    }
    public async updatePlaylist_set(
        username: string, token: string, salt: string,
        playlistId: string, name: string, comment: string, isPublic: string,
        songIdToAdd: string, songIndexToRemove: string
    ): Promise<any> {
        return this.sendRequest(username, token, salt, 'updatePlaylist', {
            playlistId, name, comment, public: isPublic,
            songIdToAdd, songIndexToRemove
        });
    }
    public async deletePlaylist_set(username: string,token: string,salt: string,id: string,): Promise<any> {
        return this.sendRequest(username, token, salt, 'deletePlaylist', { id });
    }
}