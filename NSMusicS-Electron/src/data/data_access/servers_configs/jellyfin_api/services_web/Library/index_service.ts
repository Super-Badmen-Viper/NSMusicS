import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web"

export class Library_ApiService_of_Je extends Jellyfin_Api_Services_Web {
    public async getLibrary_MediaFolders_ALL(): Promise<any> {
        return this.sendRequest(
            'GET',
            'Library/MediaFolders'
        );
    }
}