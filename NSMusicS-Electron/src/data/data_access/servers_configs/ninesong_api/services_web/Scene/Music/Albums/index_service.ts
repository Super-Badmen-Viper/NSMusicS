import { NineSong_Api_Services_Web } from '../NineSong_Api_Services_Web'

export class Albums_ApiService_of_NineSong extends NineSong_Api_Services_Web {
  public async getAlbums(
    start: string,
    end: string,
    sort: string,
    order: string,
    starred: string,
    search: string,
    min_year: string,
    max_year: string,
    artist_id: string
  ): Promise<any> {
    return this.sendRequest('GET', 'albums', {
      start,
      end,
      sort,
      order,
      starred,
      search,
      min_year,
      max_year,
      artist_id,
    })
  }
  public async getAlbumsSort(
    start: string,
    end: string,
    multi_sorts: string,
    starred: string,
    search: string,
    min_year: string,
    max_year: string,
    artist_id: string
  ): Promise<any> {
    const params: Record<string, string | string[]> = {
      start,
      end,
      starred,
      search,
      min_year,
      max_year,
      artist_id,
    }
    return this.sendRequest('GET', 'albums/sort', params, undefined, multi_sorts)
  }
  public async getAlbumCounts(
    starred: string,
    search: string,
    min_year: string,
    max_year: string,
    artist_id: string
  ): Promise<any> {
    return this.sendRequest('GET', 'albums/filter_counts', {
      starred,
      search,
      min_year,
      max_year,
      artist_id,
    })
  }
}
