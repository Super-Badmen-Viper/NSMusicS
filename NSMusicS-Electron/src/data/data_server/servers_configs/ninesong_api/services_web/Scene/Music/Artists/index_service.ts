import { NineSong_Api_Services_Web } from '../NineSong_Api_Services_Web'

export class Artists_ApiService_of_NineSong extends NineSong_Api_Services_Web {
  public async getArtists(
    start: string,
    end: string,
    sort: string,
    order: string,
    starred: string,
    search: string
  ): Promise<any> {
    return this.sendRequest('GET', 'artists', {
      start,
      end,
      sort,
      order,
      starred,
      search,
    })
  }
  public async getArtistMetadatas(
    start: string,
    end: string,
    sort: string,
    order: string,
    starred: string,
    search: string
  ): Promise<any> {
    return this.sendRequest('GET', 'artists/metadatas', {
      start,
      end,
      sort,
      order,
      starred,
      search,
    })
  }
  public async getArtistsSort(
    start: string,
    end: string,
    multi_sorts: string,
    starred: string,
    search: string
  ): Promise<any> {
    const params: Record<string, string | string[]> = {
      start,
      end,
      starred,
      search,
    }
    return this.sendRequest('GET', 'artists/sort', params, undefined, multi_sorts)
  }
  public async getArtistCounts(): Promise<any> {
    return this.sendRequest('GET', 'artists/filter_counts')
  }
}
