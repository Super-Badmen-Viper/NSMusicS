import { Navidrome_Api_Services_Normal } from '../Navidrome_Api_Services_Normal'

export class Media_library_scanning_ApiService_of_ND extends Navidrome_Api_Services_Normal {
  public async getScanStatus(username: string, token: string, salt: string): Promise<any> {
    return this.sendRequest(username, token, salt, 'getScanStatus')
  }
}
