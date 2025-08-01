import { Navidrome_Api_Services_Normal } from '../Navidrome_Api_Services_Normal'

export class Browsing_ApiService_of_ND extends Navidrome_Api_Services_Normal {
  public async getMusicFolders(username: string, token: string, salt: string): Promise<any> {
    return this.sendRequest(username, token, salt, 'getMusicFolders')
  }
  public async getIndexes_all(username: string, token: string, salt: string): Promise<any> {
    return this.sendRequest(username, token, salt, 'getIndexes')
  }
  public async getArtists_ALL(username: string, token: string, salt: string): Promise<any> {
    return this.sendRequest(username, token, salt, 'getArtists')
  }
  public async getGenres(username: string, token: string, salt: string): Promise<any> {
    return this.sendRequest(username, token, salt, 'getGenres')
  }
  public async getMusicDirectory_id(
    username: string,
    token: string,
    salt: string,
    id: string
  ): Promise<any> {
    return this.sendRequest(username, token, salt, 'getMusicDirectory', { id })
  }
  public async getSong(username: string, token: string, salt: string, id: string): Promise<any> {
    return this.sendRequest(username, token, salt, 'getSong', { id })
  }
  public async getAlbum(username: string, token: string, salt: string, id: string): Promise<any> {
    return this.sendRequest(username, token, salt, 'getAlbum', { id })
  }
  public async getArtist(username: string, token: string, salt: string, id: string): Promise<any> {
    return this.sendRequest(username, token, salt, 'getArtist', { id })
  }

  public async getRandomSongs(
    username: string,
    token: string,
    salt: string,
    size: string,
    fromYear: string,
    toYear: string
  ): Promise<any> {
    return this.sendRequest(username, token, salt, 'getRandomSongs', {
      size,
      fromYear,
      toYear,
    })
  }
}
