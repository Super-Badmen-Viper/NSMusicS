import { NineSong_Api_Services_Web } from '../NineSong_Api_Services_Web'

export class MediaCues_ApiService_of_NineSong extends NineSong_Api_Services_Web {
  public async getMediaCues(
    start: string,
    end: string,
    sort: string,
    order: string,
    starred: string,
    search: string,
    year: string,
    artist_id: string
  ): Promise<any> {
    return this.sendRequest('GET', 'cues', {
      start,
      end,
      sort,
      order,
      starred,
      search,
      year,
      artist_id,
    })
  }
  public async getMediaCuesSort(
    start: string,
    end: string,
    multi_sorts: string,
    starred: string,
    search: string,
    year: string,
    artist_id: string
  ): Promise<any> {
    const params: Record<string, string | string[]> = {
      start,
      end,
      starred,
      search,
      year,
      artist_id,
    }
    return this.sendRequest('GET', 'cues/sort', params, undefined, multi_sorts)
  }
  public async getMediaCuesCounts(
    starred: string,
    search: string,
    year: string,
    artist_id: string
  ): Promise<any> {
    return this.sendRequest('GET', 'cues/filter_counts', {
      starred,
      search,
      year,
      artist_id,
    })
  }
  public async getMediaCues_Playlist(
    playlistId: string,
    start: string,
    end: string,
    sort: string,
    order: string,
    starred: string,
    search: string,
    year: string,
    artist_id: string
  ): Promise<any> {
    return this.sendRequest('GET', 'playlists/tracks', {
      playlistId,
      start,
      end,
      sort,
      order,
      starred,
      search,
      year,
      artist_id,
    })
  }
}
