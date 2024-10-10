import {
    Subsonic_Api_Services_Web
} from "@/features/servers_configs/subsonic_api/services_web/Subsonic_Api_Services_Web";

export class Artist_Lists_ApiWebService_of_ND extends Subsonic_Api_Services_Web {
    public async getArtistList_ALL(
        _end:string, _order:string, _sort:string, _start: string,
        _search:string, _starred:string
    ): Promise<any> {
        return this.sendRequest('artist', {
            _end: _end,
            _order: _order,
            _sort: _sort,
            _start: _start,
            name: _search,
            starred: _starred
        });
    }
}