import { NineSong_Api_Services_Web } from '../NineSong_Api_Services_Web'
import { usePageHomeStore } from '@/data/data_status/app_status/page_status/home_store/usePageHomeStore'

export class Home_ApiService_of_NineSong extends NineSong_Api_Services_Web {
  public async getRandomArtists(start: string, end: string): Promise<any> {
    try {
      const result = await this.sendRequest('GET', 'homes/artists/random', {
        start,
        end,
      })
      return result['ninesong-response']['artists']
    } catch (error) {
      console.error('Error fetching album list by play count:', error)
    }
    return []
  }
  public async getRandomAlbums(start: string, end: string): Promise<any> {
    try {
      const result = await this.sendRequest('GET', '/homes/albums/random', {
        start,
        end,
      })
      return result['ninesong-response']['albums']
    } catch (error) {
      console.error('Error fetching album list by play count:', error)
    }
    return []
  }
  public async getRandomMedias(start: string, end: string): Promise<any> {
    try {
      const result = await this.sendRequest('GET', '/homes/medias/random', {
        start,
        end,
      })
      return result['ninesong-response']['mediaFiles']
    } catch (error) {
      console.error('Error fetching album list by play count:', error)
    }
    return []
  }
  public async getRandomMediaCues(start: string, end: string): Promise<any> {
    try {
      const result = await this.sendRequest('GET', '/homes/cues/random', {
        start,
        end,
      })
      return result['ninesong-response']['cueFiles']
    } catch (error) {
      console.error('Error fetching album list by play count:', error)
    }
    return []
  }

  public async getMediaList_Play_Count(): Promise<any> {
    try {
      const result = await this.sendRequest('GET', 'medias', {
        start: '0',
        end: '15',
        sort: 'play_count',
        order: 'desc',
      })
      return result['ninesong-response']['mediaFiles']
    } catch (error) {
      console.error('Error fetching album list by play count:', error)
    }
    return []
  }
  public async getMediaList_Recently_Added(): Promise<any> {
    try {
      const pageHomeStore = usePageHomeStore()
      if (pageHomeStore.home_Files_temporary_recently_added_search != undefined) {
        const result = await this.sendRequest('GET', 'medias', {
          start: pageHomeStore.home_Files_temporary_recently_added_search.start,
          end: pageHomeStore.home_Files_temporary_recently_added_search.end,
          sort: 'recently_added',
          order: 'desc',
        })
        return result['ninesong-response']['mediaFiles']
      }
      const result = await this.sendRequest('GET', 'medias', {
        start: '0',
        end: '15',
        sort: 'recently_added',
        order: 'desc',
      })
      return result['ninesong-response']['mediaFiles']
    } catch (error) {
      console.error('Error fetching album list by play count:', error)
    }
    return []
  }
  public async getMediaList_Play_Date(): Promise<any> {
    try {
      const result = await this.sendRequest('GET', 'medias', {
        start: '0',
        end: '15',
        sort: 'play_date',
        order: 'desc',
      })
      return result['ninesong-response']['mediaFiles']
    } catch (error) {
      console.error('Error fetching album list by play count:', error)
    }
    return []
  }

  public async getMediaCue_Play_Count(): Promise<any> {
    try {
      const result = await this.sendRequest('GET', 'cues', {
        start: '0',
        end: '15',
        sort: 'play_count',
        order: 'desc',
      })
      return result['ninesong-response']['cueFiles']
    } catch (error) {
      console.error('Error fetching album list by play count:', error)
    }
    return []
  }
  public async getMediaCue_Recently_Added(): Promise<any> {
    try {
      const pageHomeStore = usePageHomeStore()
      if (pageHomeStore.home_Files_temporary_recently_added_search != undefined) {
        const result = await this.sendRequest('GET', 'cues', {
          start: pageHomeStore.home_Files_temporary_recently_added_search.start,
          end: pageHomeStore.home_Files_temporary_recently_added_search.end,
          sort: 'recently_added',
          order: 'desc',
        })
        return result['ninesong-response']['cueFiles']
      }
      const result = await this.sendRequest('GET', 'cues', {
        start: '0',
        end: '15',
        sort: 'recently_added',
        order: 'desc',
      })
      return result['ninesong-response']['cueFiles']
    } catch (error) {
      console.error('Error fetching album list by play count:', error)
    }
    return []
  }
  public async getMediaCue_Play_Date(): Promise<any> {
    try {
      const result = await this.sendRequest('GET', 'cues', {
        start: '0',
        end: '15',
        sort: 'play_date',
        order: 'desc',
      })
      return result['ninesong-response']['cueFiles']
    } catch (error) {
      console.error('Error fetching album list by play count:', error)
    }
    return []
  }

  public async getAlbumList_Play_Count(): Promise<any> {
    try {
      const result = await this.sendRequest('GET', 'albums', {
        start: '0',
        end: '15',
        sort: 'play_count',
        order: 'desc',
      })
      return result['ninesong-response']['albums']
    } catch (error) {
      console.error('Error fetching album list by play count:', error)
    }
    return []
  }
  public async getAlbumList_Recently_Added(): Promise<any> {
    try {
      const pageHomeStore = usePageHomeStore()
      if (pageHomeStore.home_Files_temporary_recently_added_search != undefined) {
        const result = await this.sendRequest('GET', 'albums', {
          start: pageHomeStore.home_Files_temporary_recently_added_search.start,
          end: pageHomeStore.home_Files_temporary_recently_added_search.end,
          sort: 'recently_added',
          order: 'desc',
        })
        return result['ninesong-response']['albums']
      }
      const result = await this.sendRequest('GET', 'albums', {
        start: '0',
        end: '15',
        sort: 'recently_added',
        order: 'desc',
      })
      return result['ninesong-response']['albums']
    } catch (error) {
      console.error('Error fetching album list by play count:', error)
    }
    return []
  }
  public async getAlbumList_Play_Date(): Promise<any> {
    try {
      const result = await this.sendRequest('GET', 'albums', {
        start: '0',
        end: '15',
        sort: 'play_date',
        order: 'desc',
      })
      return result['ninesong-response']['albums']
    } catch (error) {
      console.error('Error fetching album list by play count:', error)
    }
    return []
  }

  public async getArtistList_Play_Count(): Promise<any> {
    try {
      const result = await this.sendRequest('GET', 'artists', {
        start: '0',
        end: '15',
        sort: 'play_count',
        order: 'desc',
      })
      return result['ninesong-response']['artists']
    } catch (error) {
      console.error('Error fetching album list by play count:', error)
    }
    return []
  }
  public async getArtistList_Recently_Added(): Promise<any> {
    try {
      const pageHomeStore = usePageHomeStore()
      if (pageHomeStore.home_Files_temporary_recently_added_search != undefined) {
        const result = await this.sendRequest('GET', 'artists', {
          start: pageHomeStore.home_Files_temporary_recently_added_search.start,
          end: pageHomeStore.home_Files_temporary_recently_added_search.end,
          sort: 'recently_added',
          order: 'desc',
        })
        return result['ninesong-response']['artists']
      }
      const result = await this.sendRequest('GET', 'artists', {
        start: '0',
        end: '15',
        sort: 'recently_added',
        order: 'desc',
      })
      return result['ninesong-response']['artists']
    } catch (error) {
      console.error('Error fetching album list by play count:', error)
    }
    return []
  }
  public async getArtistList_Play_Date(): Promise<any> {
    try {
      const result = await this.sendRequest('GET', 'artists', {
        start: '0',
        end: '15',
        sort: 'play_date',
        order: 'desc',
      })
      return result['ninesong-response']['artists']
    } catch (error) {
      console.error('Error fetching album list by play count:', error)
    }
    return []
  }
}
