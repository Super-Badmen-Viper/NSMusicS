import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web"

export class Audio_ApiService_of_Je extends Jellyfin_Api_Services_Web {
    public async getAudio_steam_id(itemId: string): Promise<any> {
        return this.sendRequest(`/Audio/${itemId}/stream`);
    }
    public async getAudio_steam_container_id(itemId: string, container: string): Promise<any> {
        return this.sendRequest(`/Audio/${itemId}/stream.${container}`);
    }

    public async getAudio_main_m3u8_id(itemId: string): Promise<any> {
        return this.sendRequest(`/Audio/${itemId}/main.m3u8`);
    }
    public async getAudio_master_m3u8_id(itemId: string): Promise<any> {
        return this.sendRequest(`/Audio/${itemId}/master.m3u8`);
    }

    public async getAudio_hsl_acc_id(itemId: string, segmentId: string): Promise<any> {
        return this.sendRequest(`/Audio/${itemId}/hls/${segmentId}/stream.aac`);
    }
    public async getAudio_hsl_mp3_id(itemId: string, segmentId: string): Promise<any> {
        return this.sendRequest(`/Audio/${itemId}/hls/${segmentId}/stream.mp3`);
    }
    public async getAudio_hsl1_id(
        itemId: string, playlistId: string, segmentId: string,
        container: string
    ): Promise<any> {
        return this.sendRequest(`/Audio/${itemId}/hls1/${playlistId}/${segmentId}.${container}`);
    }

    public async getAudio_lyrics_id(itemId: string): Promise<any> {
        return this.sendRequest(`/Audio/${itemId}/Lyrics`);
    }
    public async postAudio_lyrics_id(itemId: string, fileName: string): Promise<any> {
        return this.sendRequest(`/Audio/${itemId}/Lyrics`, { fileName });
    }
    public async deleteAudio_lyrics_id(itemId: string): Promise<any> {
        return this.sendRequest(`/Audio/${itemId}/Lyrics`);
    }

    public async getAudio_remote_search_lyrics_id(itemId: string): Promise<any> {
        return this.sendRequest(`/Audio/${itemId}/RemoteSearch/Lyrics`);
    }
    public async postAudio_remote_search_lyrics_id(itemId: string, lyricId: string): Promise<any> {
        return this.sendRequest(`/Audio/${itemId}/RemoteSearch/Lyrics/${lyricId}`);
    }

    public async getAudio_universal_id(itemId: string): Promise<any> {
        return this.sendRequest(`/Audio/${itemId}/universal`);
    }
}