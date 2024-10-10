import {
    Navidrome_Api_Services_Web
} from "@/features/servers_configs/navidrome_api/services_web/Navidrome_Api_Services_Web";

export class Song_Lists_ApiWebService_of_ND extends Navidrome_Api_Services_Web {
    public async getSongList_ALL(
        _end:string, _order:string, _sort:string, _start: string,
        _search:string, _starred:string,
        _album_id:string, _artist_id:string,
        year:string
    ): Promise<any> {
        return this.sendRequest('song', {
            _end: _end,
            _order: _order,
            _sort: _sort,
            _start: _start,
            title: _search,
            starred: _starred,
            album_id: _album_id,
            artist_id: _artist_id,
            year: year
        });
    }
    public async getSongList_of_Playlist(
        playlist_id: string,
        _end:string, _order:string, _sort:string, _start: string,
        year:string
    ): Promise<any> {
        return this.sendRequest('playlist/'+playlist_id+'/tracks', {
            _end: _end,
            _order: _order,
            _sort: _sort,
            _start: _start,
            playlist_id: playlist_id,
            year: year
        });
    }
}