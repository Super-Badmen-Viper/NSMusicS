import {Navidrome_Api_Services_Normal} from "@/features/servers_configs/navidrome_api/services_normal/Navidrome_Api_Services_Normal";

export class Media_library_scanning_ApiService_of_ND extends Navidrome_Api_Services_Normal {
    public async getScanStatus(username: string,token: string,salt: string): Promise<any> {
        return this.sendRequest(username,token,salt,'getScanStatus');
    }
}