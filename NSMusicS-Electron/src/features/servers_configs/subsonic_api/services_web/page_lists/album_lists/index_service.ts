import {
    Subsonic_Api_Services_Web
} from "@/features/servers_configs/subsonic_api/services_web/Subsonic_Api_Services_Web";

export class Album_Lists_ApiWebService_of_ND extends Subsonic_Api_Services_Web {
    public async getAlbumList_ALL(
        _end:string, _order:string, _sort:string, _start: string,
        _search:string, _starred:string,
        _artist_id:string
    ): Promise<any> {
        return this.sendRequest('album', {
            _end: _end,
            _order: _order,
            _sort: _sort,
            _start: _start,
            name: _search,
            starred: _starred,
            artist_id: _artist_id
        });
    }
}