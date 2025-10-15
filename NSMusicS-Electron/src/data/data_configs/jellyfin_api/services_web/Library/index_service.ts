import { Jellyfin_Api_Services_Web } from '../Jellyfin_Api_Services_Web'
import { store_server_users } from '@/data/data_stores/server_stores/store_server_users'

export class Library_ApiService_of_Je extends Jellyfin_Api_Services_Web {
  public async getLibrary_MediaFolders_ALL(): Promise<any> {
    return this.sendRequest('GET', 'Library/MediaFolders')
  }
  public async getLibrary_MediaFolders_ALL_Other(userId: string): Promise<any> {
    if (store_server_users.server_select_kind === 'jellyfin') {
      return this.sendRequest('GET', 'UserViews', {
        userId,
      })
    } else {
      return this.sendRequest('GET', `emby/Users/${userId}/Views`)
    }
  }
}
