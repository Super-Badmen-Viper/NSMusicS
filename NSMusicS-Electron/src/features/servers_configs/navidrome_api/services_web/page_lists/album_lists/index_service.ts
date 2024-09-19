import {
    Navidrome_Api_Services_Web
} from "@/features/servers_configs/navidrome_api/services_web/Navidrome_Api_Services_Web";

export class Album_Lists_ApiWebService_of_ND extends Navidrome_Api_Services_Web {
    public async getAlbumList_ALL(_end:number, _order:string, _sort:string, _start: number): Promise<any> {
        return this.sendRequest('album', {
            _end: _end,
            _order: _order,
            _sort: _sort,
            _start: _start,
        });
    }
}