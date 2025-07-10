import { NineSong_Api_Services_Web } from '../NineSong_Api_Services_Web'

export class Playlist_ApiService_of_NineSong extends NineSong_Api_Services_Web {
  public async getPlaylists(): Promise<any> {
    return this.sendRequest('GET', 'playlists')
  }
  public async createPlaylist(name: string, comment: string): Promise<any> {
    return this.sendRequest(
      'POST',
      'playlists',
      {},
      {
        name,
        comment,
      }
    )
  }
  public async getPlaylist_Id(id: string): Promise<any> {
    return this.sendRequest('GET', 'playlists/detail', {
      id,
    })
  }
  public async updatePlaylist_Id(id: string, name: string, comment: string): Promise<any> {
    return this.sendRequest(
      'PUT',
      'playlists',
      {},
      {
        id,
        name,
        comment,
      }
    )
  }
  public async deletePlaylist_Id(id: string): Promise<any> {
    return this.sendRequest('DELETE', 'playlists', {
      id,
    })
  }
  public async addMediaFiles_Playlist(playlist_id: string, media_file_ids: string): Promise<any> {
    return this.sendRequest(
      'POST',
      'playlists/tracks/add',
      {},
      {
        playlist_id,
        media_file_ids,
      }
    )
  }
  public async removeMediaFiles_Playlist(
    playlist_id: string,
    media_file_ids: string
  ): Promise<any> {
    return this.sendRequest(
      'POST',
      'playlists/tracks/remove',
      {},
      {
        playlist_id,
        media_file_ids,
      }
    )
  }
}
