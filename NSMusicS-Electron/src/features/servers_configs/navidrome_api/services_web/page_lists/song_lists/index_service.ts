import {
    Navidrome_Api_Services_Web
} from "@/features/servers_configs/navidrome_api/services_web/Navidrome_Api_Services_Web";

export class Song_Lists_ApiWebService_of_ND extends Navidrome_Api_Services_Web {
    public async getSongList_ALL(_end:number, _order:string, _sort:string, _start: number): Promise<any> {
        return this.sendRequest('song', {
            _end: _end,
            _order: _order,
            _sort: _sort,
            _start: _start,
        });
    }
    public async getSongList_of_Playlist(
        playlist_id: string,
        _end:number, _order:string, _sort:string, _start: number
    ): Promise<any> {
        return this.sendRequest('playlist/'+playlist_id, {
            _end: _end,
            _order: _order,
            _sort: _sort,
            _start: _start,
            playlist_id: playlist_id,
        });
    }
}