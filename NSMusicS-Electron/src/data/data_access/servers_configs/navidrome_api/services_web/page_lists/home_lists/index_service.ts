import { Navidrome_Api_Services_Web } from '../../Navidrome_Api_Services_Web'

export class Home_Lists_ApiWebService_of_ND extends Navidrome_Api_Services_Web {
  public async getAlbumList_Play_Count(): Promise<any> {
    return this.sendRequest('album', {
      _end: '15',
      _order: 'desc',
      _sort: 'play_count',
      _start: '0',
    })
  }
  public async getAlbumList_Random(): Promise<any> {
    return this.sendRequest('album', {
      _end: '18',
      _order: 'ASC',
      _sort: 'random',
      _start: '0',
    })
  }
  public async getAlbumList_Recently_Added(): Promise<any> {
    return this.sendRequest('album', {
      _end: '15',
      _order: 'desc',
      _sort: 'recently_added',
      _start: '0',
    })
  }
  public async getAlbumList_Play_Date(): Promise<any> {
    return this.sendRequest('album', {
      _end: '15',
      _order: 'desc',
      _sort: 'play_date',
      _start: '0',
      recently_played: 'true',
    })
  }
}
