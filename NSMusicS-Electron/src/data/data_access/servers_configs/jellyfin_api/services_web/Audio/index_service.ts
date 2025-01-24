import {Jellyfin_Api_Services_Web} from "../../Jellyfin_Api_Services_Web"

export class Audio_main_m3u8_ApiService_of_Je extends Jellyfin_Api_Services_Web {
    public async getAudio_main_m3u8_id(uuid: string): Promise<any> {
        return this.sendRequest(`Users/${uuid}`);
    }
}