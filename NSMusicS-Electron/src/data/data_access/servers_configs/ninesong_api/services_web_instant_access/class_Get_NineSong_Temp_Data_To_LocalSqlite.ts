import { store_view_home_page_info } from '@/views/view_app/music_page/page_home/store/store_view_home_page_info'
import { store_view_artist_page_info } from '@/views/view_app/music_page/page_artist/store/store_view_artist_page_info'
import { store_view_album_page_info } from '@/views/view_app/music_page/page_album/store/store_view_album_page_info'
import { store_view_media_page_info } from '@/views/view_app/music_page/page_media/store/store_view_media_page_info'
import { store_playlist_list_info } from '@/views/view_app/music_components/player_list/store/store_playlist_list_info'
import { store_app_configs_logic_save } from '@/data/data_stores/app/store_app_configs_logic_save'
import { store_general_fetch_player_list } from '@/data/data_stores/server/server_api_abstract/music_scene/components/player_list/store_general_fetch_player_list'
import { store_player_audio_logic } from '@/views/view_app/music_page/page_player/store/store_player_audio_logic'
import { store_server_user_model } from '@/data/data_stores/server/store_server_user_model'
import { store_playlist_list_logic } from '@/views/view_app/music_components/player_list/store/store_playlist_list_logic'
import { store_player_audio_info } from '@/views/view_app/music_page/page_player/store/store_player_audio_info'
import { store_general_fetch_media_list } from '@/data/data_stores/server/server_api_abstract/music_scene/page/page_media_file/store_general_fetch_media_list'
import { store_view_media_page_logic } from '@/views/view_app/music_page/page_media/store/store_view_media_page_logic'

import { Artists_ApiService_of_NineSong } from '../services_web/Scene/Music/Artists/index_service'
import { Albums_ApiService_of_NineSong } from '../services_web/Scene/Music/Albums/index_service'
import { Medias_ApiService_of_NineSong } from '../services_web/Scene/Music/Media_Files/index_service'
import { Annotation_ApiService_of_NineSong } from '../services_web/Scene/Music/Annotation/index_service'
import { Playlist_ApiService_of_NineSong } from '../services_web/Scene/Music/Playlist/index_service'
import { Retrieval_ApiService_of_NineSong } from '../services_web/Scene/Music/Retrieval/index_service'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
import { Home_ApiService_of_NineSong } from '../services_web/Scene/Music/Home/index_service'
import error_artist from '@/assets/img/error_artist.jpg'
import error_album from '@/assets/img/error_album.jpg'
import { MediaCues_ApiService_of_NineSong } from '../services_web/Scene/Music/Media_Cue_Files/index_service'
import { store_view_media_cue_page_info } from '@/views/view_app/music_page/page_media_cue/store/store_view_media_cue_page_info'
import { Recommend_ApiService_of_NineSong } from '../services_web/Scene/Music/Recommend/index_service'
import { store_view_recommend_page_info } from '../../../../../views/view_app/music_page/page_recommend/store/store_view_recommend_page_info'

export class Get_NineSong_Temp_Data_To_LocalSqlite {
  private artistsApi = new Artists_ApiService_of_NineSong(store_server_login_info.server_url)
  private albumsApi = new Albums_ApiService_of_NineSong(store_server_login_info.server_url)
  private mediasApi = new Medias_ApiService_of_NineSong(store_server_login_info.server_url)
  private cueFilesApi = new MediaCues_ApiService_of_NineSong(store_server_login_info.server_url)
  private homeApi = new Home_ApiService_of_NineSong(store_server_login_info.server_url)
  private playlistApi = new Playlist_ApiService_of_NineSong(store_server_login_info.server_url)
  private recommendApi = new Recommend_ApiService_of_NineSong(store_server_login_info.server_url)

  public async get_home_list(url: string) {
    await this.get_home_list_of_maximum_playback(url, false)
    await this.get_home_list_of_random_search(url)
    await this.get_home_list_of_recently_added(url)
    await this.get_home_list_of_recently_played(url)
  }

  ///
  private mappingStrategies = {
    album: {
      fetch: () => this.homeApi.getAlbumList_Play_Count(),
      map: (item: any, url: string, index: number) => this.mapAlbum_Home(item, url),
    },
    artist: {
      fetch: () => this.homeApi.getArtistList_Play_Count(),
      map: (item: any, url: string, index: number) => this.mapArtist(item, url, index, 0),
    },
    media: {
      fetch: () => this.homeApi.getMediaList_Play_Count(),
      map: (item: any, url: string, index: number) => this.mapMedia(item, url, index, 0),
    },
    media_cue: {
      fetch: () => this.homeApi.getMediaCue_Play_Count(),
      map: (item: any, url: string, index: number) => this.mapMedia_Cue(item, url, index, 0),
    },
  }
  private processData = async (
    data: any[],
    mapper: (item: any, index: number) => Promise<any>,
    targetArray: any[]
  ) => {
    if (!data || !Array.isArray(data)) return []
    const mappedData = await Promise.all(data.map(mapper))
    targetArray.push(...mappedData)
    return mappedData
  }
  public async get_home_list_of_maximum_playback(url: string, find_model: boolean): Promise<any[]> {
    try {
      // 确保URL格式正确
      url = url.includes('api') ? url : `${url}/api`

      if (!find_model) {
        const type = store_view_home_page_info.home_Files_temporary_type_select
        const strategy = this.mappingStrategies[type as keyof typeof this.mappingStrategies]

        if (strategy) {
          const data = await strategy.fetch()
          return this.processData(
            data,
            (item, index) => strategy.map(item, url, index),
            store_view_home_page_info.home_Files_temporary_maximum_playback
          )
        }
        return []
      }

      // 并行执行所有请求 [6](@ref)
      const [albumData, artistData, mediaData, mediaCueData] = await Promise.all([
        this.homeApi.getAlbumList_Play_Count(),
        this.homeApi.getArtistList_Play_Count(),
        this.homeApi.getMediaList_Play_Count(),
        this.homeApi.getMediaCue_Play_Count(),
      ])

      // 并行处理映射 [6](@ref)
      const [mappedAlbums, mappedArtists, mappedMedia, mappedMediaCue] = await Promise.all([
        this.processData(albumData, (item, index) => this.mapAlbum_Home(item, url), []),
        this.processData(artistData, (item, index) => this.mapArtist(item, url, index, 0), []),
        this.processData(mediaData, (item, index) => this.mapMedia(item, url, index, 0), []),
        this.processData(mediaCueData, (item, index) => this.mapMedia_Cue(item, url, index, 0), []),
      ])

      return [mappedMedia, mappedAlbums, mappedArtists, mappedMediaCue]
    } catch (error) {
      console.error('Data processing failed:', error)
      return []
    }
  }
  ///

  private STRATEGY_CONFIG = {
    random_search: {
      album: {
        fetch: () => this.homeApi.getRandomAlbums('0', '18'),
        mapper: (item, url) => this.mapAlbum_Home(item, url),
      },
      artist: {
        fetch: () => this.homeApi.getRandomArtists('0', '18'),
        mapper: (item, url, index) => this.mapArtist(item, url, index, 0),
      },
      media: {
        fetch: () => this.homeApi.getRandomMedias('0', '18'),
        mapper: (item, url, index) => this.mapMedia(item, url, index, 0),
      },
      media_cue: {
        fetch: () => this.homeApi.getRandomMediaCues('0', '18'),
        mapper: (item, url, index) => this.mapMedia_Cue(item, url, index, 0),
      },
    },
    recently_added: {
      album: {
        fetch: () => this.homeApi.getAlbumList_Recently_Added(),
        mapper: (item, url) => this.mapAlbum_Home(item, url),
      },
      artist: {
        fetch: () => this.homeApi.getArtistList_Recently_Added(),
        mapper: (item, url, index) => this.mapArtist(item, url, index, 0),
      },
      media: {
        fetch: () => this.homeApi.getMediaList_Recently_Added(),
        mapper: (item, url, index) => this.mapMedia(item, url, index, 0),
      },
      media_cue: {
        fetch: () => this.homeApi.getMediaCue_Recently_Added(),
        mapper: (item, url, index) => this.mapMedia_Cue(item, url, index, 0),
      },
    },
    recently_played: {
      album: {
        fetch: () => this.homeApi.getAlbumList_Play_Date(),
        mapper: (item, url) => this.mapAlbum_Home(item, url),
      },
      artist: {
        fetch: () => this.homeApi.getArtistList_Play_Date(),
        mapper: (item, url, index) => this.mapArtist(item, url, index, 0),
      },
      media: {
        fetch: () => this.homeApi.getMediaList_Play_Date(),
        mapper: (item, url, index) => this.mapMedia(item, url, index, 0),
      },
      media_cue: {
        fetch: () => this.homeApi.getMediaCue_Play_Date(),
        mapper: (item, url, index) => this.mapMedia_Cue(item, url, index, 0),
      },
    },
  }
  private async processHomeList(
    strategyKey: keyof typeof this.STRATEGY_CONFIG,
    targetArray: any[],
    url: string
  ) {
    // 规范URL格式
    const apiUrl = url.includes('api') ? url : `${url}/api`

    // 获取当前选择类型
    const type = store_view_home_page_info.home_Files_temporary_type_select

    type DataStrategy = {
      fetch: () => Promise<any[]>
      mapper: (item: any, url: string, index: number) => any
    }
    // 获取对应策略
    const strategy = this.STRATEGY_CONFIG[strategyKey][type as keyof DataStrategy]
    if (!strategy) return

    try {
      // 并行获取数据
      const rawData = await strategy.fetch()
      if (!rawData || !Array.isArray(rawData)) return

      // 并行处理数据映射
      const mappedData = await Promise.all(
        rawData.map((item, index) => strategy.mapper(item, apiUrl, index))
      )

      // 批量更新目标数组
      targetArray.push(...mappedData)
    } catch (error) {
      console.error(`处理${strategyKey}数据失败:`, error)
    }
  }
  public async get_home_list_of_random_search(url: string) {
    await this.processHomeList(
      'random_search',
      store_view_home_page_info.home_Files_temporary_random_search,
      url
    )
  }
  public async get_home_list_of_recently_added(url: string) {
    await this.processHomeList(
      'recently_added',
      store_view_home_page_info.home_Files_temporary_recently_added,
      url
    )
  }
  public async get_home_list_of_recently_played(url: string) {
    await this.processHomeList(
      'recently_played',
      store_view_home_page_info.home_Files_temporary_recently_played,
      url
    )
  }

  ///
  public async get_media_list(
    url: string,
    _start: string,
    _end: string,
    _sort: string,
    _order: string,
    multi_sorts: string,
    _starred: string,
    _search: string,
    year: string,
    playlist_id: string,
    _album_id: string,
    _artist_id: string,
    suffix: string,
    min_bitrate: number,
    max_bitrate: number,
    folder_path: string
  ) {
    url = url.includes('api') ? url : url + '/api'
    folder_path = folder_path.replace(/\//g, '\\')
    if(folder_path.length > 0){
      store_view_media_page_logic.page_songlists_library_folder_path =
        store_view_media_page_logic.page_songlists_library_folder_path.replace(/\//g, '\\')
    }
    const folder_path_sub_filter = store_view_media_page_logic.page_songlists_library_folder_path
    let song_list = []
    let totalCount = 0
    if (playlist_id === '') {
      if (multi_sorts.length === 0) {
        const data = await this.mediasApi.getMedias(
          _start,
          _end,
          _sort,
          _order,
          _starred,
          _search,
          year,
          _album_id,
          _artist_id,
          suffix,
          min_bitrate.toString(),
          max_bitrate.toString(),
          folder_path,
          folder_path_sub_filter
        )
        song_list = data['ninesong-response']['mediaFiles']
        totalCount = data['ninesong-response']['count']
      } else {
        const data = await this.mediasApi.getMediasSort(
          _start,
          _end,
          multi_sorts,
          _starred,
          _search,
          year,
          _album_id,
          _artist_id,
          suffix,
          min_bitrate.toString(),
          max_bitrate.toString(),
          folder_path,
          folder_path_sub_filter
        )
        song_list = data['ninesong-response']['mediaFiles']
        totalCount = data['ninesong-response']['count']
      }
    } else {
      if (multi_sorts.length === 0) {
        const data = await this.mediasApi.getMedias_Playlist(
          playlist_id,
          _start,
          _end,
          _sort,
          _order,
          _starred,
          _search,
          year,
          _album_id,
          _artist_id,
          suffix,
          min_bitrate.toString(),
          max_bitrate.toString(),
          folder_path,
          folder_path_sub_filter
        )
        song_list = data['ninesong-response']['mediaFiles']
        totalCount = data['ninesong-response']['count']
      } else {
        const data = await this.mediasApi.getMedias_PlaylistSort(
          playlist_id,
          _start,
          _end,
          multi_sorts,
          _starred,
          _search,
          year,
          _album_id,
          _artist_id,
          suffix,
          min_bitrate.toString(),
          max_bitrate.toString(),
          folder_path,
          folder_path_sub_filter
        )
        song_list = data['ninesong-response']['mediaFiles']
        totalCount = data['ninesong-response']['count']
      }
    }
    ///
    if (Array.isArray(song_list) && song_list.length > 0) {
      if (song_list.length > 0) {
        const targetArray =
          store_general_fetch_media_list._load_model === 'search'
            ? store_view_media_page_info.media_Files_temporary
            : store_playlist_list_info.playlist_MediaFiles_temporary
        const existingIds = new Set(targetArray.map((item) => item.id))
        song_list = song_list.filter((song) => {
          if (existingIds.has(song.ID)) {
            return false
          }
          existingIds.add(song.ID)
          return true
        })
      }
    } else {
      return
    }
    ///
    if (Array.isArray(song_list) && song_list.length > 0) {
      if (_sort === 'play_date') {
        song_list = song_list.filter((song) => song.PlayCount > 0)
      }
      store_general_fetch_player_list._totalCount = totalCount
      const last_index =
        store_general_fetch_media_list._load_model === 'search'
          ? store_view_media_page_info.media_Files_temporary.length
          : store_playlist_list_info.playlist_MediaFiles_temporary.length
      store_view_media_page_info.media_File_metadata = []
      song_list.map(async (song: any, index: number) => {
        const new_song = this.mapMedia(song, url, index, last_index)
        if (store_general_fetch_media_list._load_model === 'search') {
          store_view_media_page_info.media_File_metadata.push(song)
          store_view_media_page_info.media_Files_temporary.push(new_song)
        } else {
          store_playlist_list_info.playlist_MediaFiles_temporary.push({
            ...new_song,
            play_id: new_song.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000,
          })
        }
      })
      if (store_general_fetch_media_list._load_model === 'play') {
        store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds =
          store_view_media_page_info.media_Files_temporary.map((item) => item.id)
        store_app_configs_logic_save.save_system_playlist_item_id_config()
      }
    }
  }
  public async get_media_cue_list(
    url: string,
    _start: string,
    _end: string,
    _sort: string,
    _order: string,
    multi_sorts: string,
    _starred: string,
    _search: string,
    year: string,
    playlist_id: string,
    _artist_id: string
  ) {
    url = url.includes('api') ? url : url + '/api'
    let song_list = []
    let totalCount = 0
    if (playlist_id === '') {
      if (multi_sorts.length === 0) {
        const data = await this.cueFilesApi.getMediaCues(
          _start,
          _end,
          _sort,
          _order,
          _starred,
          _search,
          year,
          _artist_id
        )
        song_list = data['ninesong-response']['cueFiles']
        totalCount = data['ninesong-response']['count']
      } else {
        const data = await this.cueFilesApi.getMediaCuesSort(
          _start,
          _end,
          multi_sorts,
          _starred,
          _search,
          year,
          _artist_id
        )
        song_list = data['ninesong-response']['cueFiles']
        totalCount = data['ninesong-response']['count']
      }
    } else {
      if (multi_sorts.length === 0) {
        const data = await this.cueFilesApi.getMediaCues_Playlist(
          playlist_id,
          _start,
          _end,
          _sort,
          _order,
          _starred,
          _search,
          year,
          _artist_id
        )
        song_list = data['ninesong-response']['cueFiles']
        totalCount = data['ninesong-response']['count']
      } else {
      }
    }
    ///
    if (Array.isArray(song_list) && song_list.length > 0) {
      if (song_list.length > 0) {
        const targetArray =
          store_general_fetch_media_list._load_model === 'search'
            ? store_view_media_page_info.media_Files_temporary
            : store_playlist_list_info.playlist_MediaFiles_temporary
        const existingIds = new Set(targetArray.map((item) => item.id))
        song_list = song_list.filter((song) => {
          if (existingIds.has(song.ID)) {
            return false
          }
          existingIds.add(song.ID)
          return true
        })
      }
    } else {
      return
    }
    ///
    if (Array.isArray(song_list) && song_list.length > 0) {
      if (_sort === 'play_date') {
        song_list = song_list.filter((song) => song.PlayCount > 0)
      }
      store_general_fetch_player_list._totalCount = totalCount
      const last_index =
        store_general_fetch_media_list._load_model === 'search'
          ? store_view_media_page_info.media_Files_temporary.length
          : store_playlist_list_info.playlist_MediaFiles_temporary.length
      store_view_media_page_info.media_File_metadata = []
      song_list.map(async (song: any, index: number) => {
        const new_song = this.mapMedia_Cue(song, url, index, last_index)
        if (store_general_fetch_media_list._load_model === 'search') {
          store_view_media_cue_page_info.media_File_metadata.push(song)
          store_view_media_cue_page_info.media_Files_temporary.push(new_song)
        } else {
          store_playlist_list_info.playlist_MediaFiles_temporary.push({
            ...new_song,
            play_id: new_song.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000,
          })
        }
      })
      if (store_general_fetch_media_list._load_model === 'play') {
        store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds =
          store_view_media_cue_page_info.media_Files_temporary.map((item) => item.id)
      }
    }
  }
  public async get_album_list(
    url: string,
    _start: string,
    _end: string,
    _sort: string,
    _order: string,
    multi_sorts: string,
    _starred: string,
    _search: string,
    min_year: string,
    max_year: string,
    _artist_id: string
  ) {
    url = url.includes('api') ? url : url + '/api'
    let album_list = []
    if (multi_sorts.length === 0) {
      const data = await this.albumsApi.getAlbums(
        _start,
        _end,
        _sort,
        _order,
        _starred,
        _search,
        min_year,
        max_year,
        _artist_id
      )
      album_list = data['ninesong-response']['albums']
    } else {
      const data = await this.albumsApi.getAlbumsSort(
        _start,
        _end,
        multi_sorts,
        _starred,
        _search,
        min_year,
        max_year,
        _artist_id
      )
      album_list = data['ninesong-response']['albums']
    }
    if (Array.isArray(album_list) && album_list.length > 0) {
      if (album_list.length > 0) {
        const targetArray =
          store_general_fetch_media_list._load_model === 'search'
            ? store_view_media_page_info.media_Files_temporary
            : store_playlist_list_info.playlist_MediaFiles_temporary
        const existingIds = new Set(targetArray.map((item) => item.id))
        album_list = album_list.filter((album) => {
          if (existingIds.has(album.ID)) {
            return false
          }
          existingIds.add(album.ID)
          return true
        })
      }
    }
    if (Array.isArray(album_list) && album_list.length > 0) {
      if (_sort === 'play_date') {
        album_list = album_list.filter((album) => album.PlayCount > 0)
      }
      const last_index = store_view_album_page_info.album_Files_temporary.length
      store_view_album_page_info.album_File_metadata = []
      album_list.map(async (album: any, index: number) => {
        store_view_album_page_info.album_File_metadata.push(album)
        store_view_album_page_info.album_Files_temporary.push(
          this.mapAlbum(album, url, index, last_index)
        )
      })
    }
  }
  public async get_artist_list(
    url: string,
    _start: string,
    _end: string,
    _sort: string,
    _order: string,
    multi_sorts: string,
    _starred: string,
    _search: string
  ) {
    url = url.includes('api') ? url : url + '/api'
    let artist_list = []
    if (multi_sorts.length === 0) {
      const data = await this.artistsApi.getArtists(_start, _end, _sort, _order, _starred, _search)
      artist_list = data['ninesong-response']['artists']
    } else {
      const data = await this.artistsApi.getArtistsSort(
        _start,
        _end,
        multi_sorts,
        _starred,
        _search
      )
      artist_list = data['ninesong-response']['artists']
    }
    if (Array.isArray(artist_list) && artist_list.length > 0) {
      if (artist_list.length > 0) {
        const targetArray =
          store_general_fetch_media_list._load_model === 'search'
            ? store_view_media_page_info.media_Files_temporary
            : store_playlist_list_info.playlist_MediaFiles_temporary
        const existingIds = new Set(targetArray.map((item) => item.id))
        artist_list = artist_list.filter((artist) => {
          if (existingIds.has(artist.ID)) {
            return false
          }
          existingIds.add(artist.ID)
          return true
        })
      }
    }
    if (Array.isArray(artist_list) && artist_list.length > 0) {
      if (_sort === 'play_date') {
        artist_list = artist_list.filter((artist) => artist.PlayCount > 0)
      }
      const last_index = store_view_artist_page_info.artist_Files_temporary.length
      store_view_artist_page_info.artist_File_metadata = []
      artist_list.map(async (artist: any, index: number) => {
        store_view_artist_page_info.artist_File_metadata.push(artist)
        store_view_artist_page_info.artist_Files_temporary.push(
          this.mapArtist(artist, url, index, last_index)
        )
      })
    }
  }
  public async get_random_song_list(url: string, _start: string, _end: string) {
    url = url.includes('api') ? url : url + '/api'
    const song_list = await this.homeApi.getRandomMedias(_start, _end)
    if (Array.isArray(song_list) && song_list.length > 0) {
      const last_index = 0
      song_list.map(async (song: any, index: number) => {
        const new_song = this.mapMedia_Random(song, url, index, last_index)
        store_playlist_list_info.playlist_MediaFiles_temporary.push({
          ...new_song,
          play_id: new_song.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000,
        })
        if (!store_server_user_model.random_play_model_search) {
          if (index === song_list.length - 1) {
            const index = store_server_user_model.random_play_model_add
              ? store_playlist_list_info.playlist_MediaFiles_temporary.length - _end
              : 0
            const media_file = store_playlist_list_info.playlist_MediaFiles_temporary[index]
            await store_player_audio_logic.update_current_media_info(media_file, index)
            store_playlist_list_logic.media_page_handleItemDbClick = false
            store_player_audio_info.this_audio_restart_play = true
            //
            store_server_user_model.random_play_model_add = false
          }
        }
      })
      store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds =
        store_playlist_list_info.playlist_MediaFiles_temporary.map((item) => item.id)
      store_app_configs_logic_save.save_system_playlist_item_id_config()
    }
  }

  /// file count
  public async get_count_of_media_file() {
    try {
      const counts = await this.mediasApi.getMediaCounts()
      const response = counts['ninesong-response']['mediaFiles']
      store_view_media_page_info.media_item_count = response.total
      store_view_media_page_info.media_starred_count = response.starred
      store_view_media_page_info.media_recently_count = response.recent_play
    } catch {}
  }
  public async get_count_of_media_cue_file() {
    try {
      const counts = await this.cueFilesApi.getMediaCuesCounts()
      const response = counts['ninesong-response']['cueFiles']
      store_view_media_cue_page_info.media_item_count = response.Total
      store_view_media_cue_page_info.media_starred_count = response.Starred
      store_view_media_cue_page_info.media_recently_count = response.RecentPlay
    } catch {}
  }
  public async get_count_of_album() {
    try {
      const counts = await this.albumsApi.getAlbumCounts()
      const response = counts['ninesong-response']['albums']
      store_view_album_page_info.album_item_count = response.total
      store_view_album_page_info.album_starred_count = response.starred
      store_view_album_page_info.album_recently_count = response.recent_play
    } catch {}
  }
  public async get_count_of_artist() {
    try {
      const counts = await this.artistsApi.getArtistCounts()
      const response = counts['ninesong-response']['artists']
      store_view_artist_page_info.artist_item_count = response.total
      store_view_artist_page_info.artist_starred_count = response.starred
      store_view_artist_page_info.artist_recently_count = response.recent_play
    } catch {}
  }
  /// playlist count
  public async get_count_of_playlist() {
    try {
      const getPlaylists_all = await this.playlistApi.getPlaylists()
      const playlists = getPlaylists_all['ninesong-response']['playlists']
      if (playlists != undefined)
        store_view_media_page_info.media_playlist_count = playlists.length || 0
    } catch {}
  }

  public async get_playlist_ninesong() {
    let playlists = []
    const getPlaylists_all = await this.playlistApi.getPlaylists()
    if (getPlaylists_all != undefined) {
      playlists = getPlaylists_all['ninesong-response']['playlists']
      store_playlist_list_info.playlist_names_ALLLists = []
      store_playlist_list_info.playlist_tracks_temporary_of_ALLLists = []
    }
    if (playlists != null) {
      for (const playlist of playlists) {
        store_playlist_list_info.playlist_names_ALLLists.push({
          label: playlist.Name,
          value: playlist.ID,
        })
        store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.push({
          playlist: {
            label: playlist.Name,
            value: playlist.ID,
            id: playlist.ID,
            name: playlist.Name,
            comment: '',
            duration: playlist.Duration || 0,
            song_count: playlist.SongCount || 0,
            public: 0,
            created_at: playlist.CreatedAt,
            updated_at: playlist.UpdatedAt,
            path: '',
            sync: 0,
            size: playlist.Size,
            rules: null,
            evaluated_at: '',
            owner_id: store_server_user_model.username,
          },
          playlist_tracks: [],
        })
        const isDuplicate = store_view_media_page_logic.page_songlists.some(
          (item: Play_List) => item.id === playlist.ID
        )
        if (!isDuplicate) {
          const temp_playlist: Play_List = {
            label: playlist.Name,
            value: playlist.ID,
            id: playlist.ID,
            name: playlist.Name,
            comment: '',
            duration: playlist.Duration,
            song_count: playlist.SongCount + ' *',
            public: '',
            created_at: playlist.CreatedAt,
            updated_at: playlist.UpdatedAt,
            path: '',
            sync: '',
            size: playlist.Size,
            rules: '',
            evaluated_at: '',
            owner_id: store_server_user_model.userid_of_Je,
          }
          store_view_media_page_logic.page_songlists_options.push(temp_playlist)
          store_view_media_page_logic.page_songlists.push(temp_playlist)
        }
      }
    }
  }

  public async get_recommend_word_cloud() {
    let all_word_clouds = []
    const result = await this.recommendApi.getWordCloudTag()
    if (result != undefined) {
      all_word_clouds = result['ninesong-response']['wordClouds']
    }
    if (all_word_clouds != undefined && all_word_clouds.length > 0) {
      store_view_recommend_page_info.recommend_WordCloudTag_metadata = []
      all_word_clouds.map((word: any) => {
        store_view_recommend_page_info.recommend_WordCloudTag_metadata.push({
          id: word.ID,
          name: word.Name,
          count: word.Count,
          type: word.Type,
          rank: word.Rank,
        })
      })
    } else {
      await this.get_recommend_high_frequency()
    }
  }

  public async get_recommend_word_cloud_genre() {
    let all_word_clouds = []
    const result = await this.recommendApi.getWordCloudGenre()
    if (result != undefined) {
      all_word_clouds = result['ninesong-response']['wordClouds']
    }
    if (all_word_clouds != undefined && all_word_clouds.length > 0) {
      store_view_recommend_page_info.recommend_WordCloudGenre_metadata = []
      all_word_clouds.map((word: any) => {
        store_view_recommend_page_info.recommend_WordCloudGenre_metadata.push({
          id: word.ID,
          name: word.Name,
          count: word.Count,
          type: word.Type,
          rank: word.Rank,
        })
      })
    }
  }

  public async get_recommend_high_frequency() {
    let all_word_clouds = []
    const result = await this.recommendApi.getHighFrequency(100)
    if (result != undefined) {
      all_word_clouds = result['ninesong-response']['wordClouds']
    }
    if (all_word_clouds != undefined && all_word_clouds.length > 0) {
      store_view_recommend_page_info.recommend_WordCloudTag_metadata = []
      all_word_clouds.map((word: any) => {
        store_view_recommend_page_info.recommend_WordCloudTag_metadata.push({
          id: word.ID,
          name: word.Name,
          count: word.Count,
          type: word.Type,
          rank: word.Rank,
        })
      })
    }
  }

  public async get_recommend_result(keywords: string) {
    let all_medias = []
    const result = await this.recommendApi.getRecommended(keywords)
    if (result != undefined) {
      all_medias = result['ninesong-response']['wordClouds']
    }
    if (all_medias != undefined && all_medias.length > 0) {
      store_view_recommend_page_info.recommend_MediaSearch_metadata = []
      all_medias.map((word: any) => {
        store_view_recommend_page_info.recommend_MediaSearch_metadata.push({
          id: word.ID,
          type: word.Type,
          name: word.Name,
          score: word.Score,
        })
      })
    }
  }

  public async get_recommend_medias(ids: string) {
    let url = store_server_login_info.server_url
    url = url.includes('api') ? url : url + '/api'
    let song_list = []
    const result = await this.mediasApi.getMedia_Ids(ids)
    if (result != undefined) {
      song_list = result['ninesong-response']['mediaFiles']
    }
    if (song_list != undefined && song_list.length > 0) {
      store_view_recommend_page_info.recommend_MediaFiles_metadata = []
      store_view_recommend_page_info.recommend_MediaFiles_temporary = []
      song_list.map(async (song: any, index: number) => {
        const new_song = this.mapMedia_Recommend(song, url, index)
        store_view_recommend_page_info.recommend_MediaFiles_metadata.push(song)
        store_view_recommend_page_info.recommend_MediaFiles_temporary.push({
          ...new_song,
          play_id: new_song.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000,
        })
      })
    }
  }

  private mapMedia(song: any, url: string, index: number, last_index: number) {
    return {
      absoluteIndex: index + 1 + last_index,
      favorite: song.Starred,
      play_count: song.PlayCount,
      play_date: song.PlayDate,
      play_complete_count: song.PlayCompleteCount,
      rating: song.Rating,
      duration_txt: store_player_audio_logic.formatTime_RunTimeTicks(song.Duration),
      id: song.ID,
      title: song.Title,
      path:
        url +
        '/media/stream?access_token=' +
        store_server_login_info.server_accessToken +
        '&media_file_id=' +
        song.ID,
      artist: song.Artist,
      album: song.Album,
      artist_id: song.ArtistID,
      album_id: song.AlbumID,
      album_artist: song.AlbumArtist,
      has_cover_art: song.HasCoverArt ? 1 : 0,
      track_number: 0,
      disc_number: 0,
      year: song.Year,
      size: song.Size,
      suffix: song.Suffix,
      duration: song.Duration,
      bit_rate: song.BitRate,
      encoding_format: song.EncodingFormat,
      genre: song.Genre,
      compilation: song.Compilation ? 1 : 0,
      created_at: song.CreatedAt,
      updated_at: song.UpdatedAt,
      all_artist_ids: song.AllArtistIDs,
      all_album_artist_ids: song.AllAlbumArtistIDs,
      full_text: '',
      album_artist_id: song.AlbumArtistID,
      order_album_name: '',
      order_album_artist_name: '',
      order_artist_name: '',
      sort_album_name: '',
      sort_artist_name: '',
      sort_album_artist_name: '',
      sort_title: '',
      disc_subtitle: '',
      mbz_track_id: '',
      mbz_album_id: '',
      mbz_artist_id: '',
      mbz_album_artist_id: '',
      mbz_album_type: '',
      mbz_album_comment: '',
      catalog_num: '',
      comment: '',
      lyrics: '',
      bpm: 0,
      channels: 0,
      order_title: '',
      mbz_release_track_id: '',
      rg_album_gain: 0,
      rg_album_peak: 0,
      rg_track_gain: 0,
      rg_track_peak: 0,
      medium_image_url: song.HasCoverArt
        ? url +
          '/media/cover?access_token=' +
          store_server_login_info.server_accessToken +
          '&type=media&target_id=' +
          song.ID
        : error_album,
    }
  }

  private mapMedia_Random(song: any, url: string, index: number, last_index: number) {
    return {
      absoluteIndex: index + 1 + last_index,
      favorite: song.Starred,
      play_count: song.PlayCount,
      play_date: song.PlayDate,
      play_complete_count: song.PlayCompleteCount,
      rating: song.Rating,
      duration_txt: store_player_audio_logic.formatTime_RunTimeTicks(song.Duration),
      id: song.ID,
      title: song.Title,
      path:
        url +
        '/media/stream?access_token=' +
        store_server_login_info.server_accessToken +
        '&media_file_id=' +
        song.ID,
      artist: song.Artist,
      album: song.Album,
      artist_id: song.ArtistID,
      album_id: song.AlbumID,
      album_artist: song.AlbumArtist,
      has_cover_art: song.HasCoverArt ? 1 : 0,
      track_number: 0,
      disc_number: 0,
      year: song.Year,
      size: song.Size,
      suffix: song.Suffix,
      duration: song.Duration,
      bit_rate: song.BitRate,
      encoding_format: song.EncodingFormat,
      genre: '',
      compilation: song.Compilation ? 1 : 0,
      created_at: song.CreatedAt,
      updated_at: song.UpdatedAt,
      all_artist_ids: song.AllArtistIDs,
      all_album_artist_ids: song.AllAlbumArtistIDs,
      full_text: '',
      album_artist_id: song.AlbumArtistID,
      order_album_name: '',
      order_album_artist_name: '',
      order_artist_name: '',
      sort_album_name: '',
      sort_artist_name: '',
      sort_album_artist_name: '',
      sort_title: '',
      disc_subtitle: '',
      mbz_track_id: '',
      mbz_album_id: '',
      mbz_artist_id: '',
      mbz_album_artist_id: '',
      mbz_album_type: '',
      mbz_album_comment: '',
      catalog_num: '',
      comment: '',
      lyrics: '',
      bpm: 0,
      channels: 0,
      order_title: '',
      mbz_release_track_id: '',
      rg_album_gain: 0,
      rg_album_peak: 0,
      rg_track_gain: 0,
      rg_track_peak: 0,
      medium_image_url: song.HasCoverArt
        ? url +
          '/media/cover?access_token=' +
          store_server_login_info.server_accessToken +
          '&type=media&target_id=' +
          song.ID
        : error_album,
    }
  }

  private mapMedia_Cue(song: any, url: string, index: number, last_index: number) {
    return {
      absoluteIndex: index + 1 + last_index,
      favorite: song.Starred,
      play_count: song.PlayCount,
      play_date: song.PlayDate,
      play_complete_count: song.PlayCompleteCount,
      rating: song.Rating,
      duration_txt: store_player_audio_logic.formatTime_RunTimeTicks(song.CueDuration),
      id: song.ID,
      title: song.Title,
      path:
        url +
        '/media/stream?access_token=' +
        store_server_login_info.server_accessToken +
        '&cue_model=true&media_file_id=' +
        song.ID,
      artist: song.Performer,
      artist_id: song.PerformerID,
      album: song.FileName,
      has_cover_art: song.HasCoverArt ? 1 : 0,
      track_number: 0,
      disc_number: 0,
      year: song.Rem.DATE,
      size: song.Size,
      suffix: song.Suffix,
      duration: song.CueDuration,
      bit_rate: song.CueBitRate,
      encoding_format: song.EncodingFormat,
      genre: song.Rem.GENRE,
      compilation: song.Compilation ? 1 : 0,
      created_at: song.CreatedAt,
      updated_at: song.UpdatedAt,
      all_artist_ids: song.AllArtistIDs,
      full_text: '',
      order_album_name: '',
      order_album_artist_name: '',
      order_artist_name: '',
      sort_album_name: '',
      sort_artist_name: '',
      sort_album_artist_name: '',
      sort_title: '',
      disc_subtitle: '',
      mbz_track_id: '',
      mbz_album_id: '',
      mbz_artist_id: '',
      mbz_album_artist_id: '',
      mbz_album_type: '',
      mbz_album_comment: '',
      catalog_num: '',
      comment: '',
      lyrics: '',
      bpm: 0,
      channels: 0,
      order_title: '',
      mbz_release_track_id: '',
      rg_album_gain: 0,
      rg_album_peak: 0,
      rg_track_gain: 0,
      rg_track_peak: 0,
      medium_image_url: song.HasCoverArt
        ? url +
          '/media/cover/path?access_token=' +
          store_server_login_info.server_accessToken +
          '&type=cover&target_id=' +
          song.ID
        : error_album,
      cue_tracks: song.CueTracks,
      cue_track_count: song.CueTrackCount,
      cue_track_show: false,
    }
  }

  private mapMedia_Recommend(song: any, url: string, index: number) {
    return {
      absoluteIndex: index + 1,
      favorite: song.Starred,
      play_count: song.PlayCount,
      play_date: song.PlayDate,
      play_complete_count: song.PlayCompleteCount,
      rating: song.Rating,
      duration_txt: store_player_audio_logic.formatTime_RunTimeTicks(song.Duration),
      id: song.ID,
      title: song.Title,
      path:
        url +
        '/media/stream?access_token=' +
        store_server_login_info.server_accessToken +
        '&media_file_id=' +
        song.ID,
      artist: song.Artist,
      album: song.Album,
      artist_id: song.ArtistID,
      album_id: song.AlbumID,
      album_artist: song.AlbumArtist,
      has_cover_art: song.HasCoverArt ? 1 : 0,
      track_number: 0,
      disc_number: 0,
      year: song.Year,
      size: song.Size,
      suffix: song.Suffix,
      duration: song.Duration,
      bit_rate: song.BitRate,
      encoding_format: song.EncodingFormat,
      genre: song.Genre,
      compilation: song.Compilation ? 1 : 0,
      created_at: song.CreatedAt,
      updated_at: song.UpdatedAt,
      all_artist_ids: song.AllArtistIDs,
      all_album_artist_ids: song.AllAlbumArtistIDs,
      full_text: '',
      album_artist_id: song.AlbumArtistID,
      order_album_name: '',
      order_album_artist_name: '',
      order_artist_name: '',
      sort_album_name: '',
      sort_artist_name: '',
      sort_album_artist_name: '',
      sort_title: '',
      disc_subtitle: '',
      mbz_track_id: '',
      mbz_album_id: '',
      mbz_artist_id: '',
      mbz_album_artist_id: '',
      mbz_album_type: '',
      mbz_album_comment: '',
      catalog_num: '',
      comment: '',
      lyrics: '',
      bpm: 0,
      channels: 0,
      order_title: '',
      mbz_release_track_id: '',
      rg_album_gain: 0,
      rg_album_peak: 0,
      rg_track_gain: 0,
      rg_track_peak: 0,
      medium_image_url: song.HasCoverArt
        ? url +
          '/media/cover?access_token=' +
          store_server_login_info.server_accessToken +
          '&type=media&target_id=' +
          song.ID
        : error_album,
    }
  }

  private mapAlbum_Home(album: any, url: string) {
    return {
      favorite: album.Starred,
      play_count: album.PlayCount,
      play_date: album.PlayDate,
      play_complete_count: album.PlayCompleteCount,
      rating: album.Rating,
      id: album.ID,
      name: album.Name,
      artist_id: album.ArtistID,
      embed_art_path: '',
      artist: album.Artist,
      album_artist: album.AlbumArtist,
      min_year: album.MinYear,
      max_year: album.MaxYear,
      compilation: album.Compilation ? 1 : 0,
      song_count: album.SongCount,
      duration: album.Duration,
      genre: album.Genre,
      has_cover_art: album.HasCoverArt ? 1 : 0,
      created_at: album.CreatedAt,
      updated_at: album.UpdatedAt,
      all_artist_ids: album.AllArtistIDs,
      all_album_artist_ids: album.AllAlbumArtistIDs,
      full_text: '',
      album_artist_id: album.AlbumArtistID,
      order_album_name: '',
      order_album_artist_name: '',
      sort_album_name: '',
      sort_artist_name: '',
      sort_album_artist_name: '',
      size: album.Size,
      mbz_album_id: '',
      mbz_album_artist_id: '',
      mbz_album_type: '',
      mbz_album_comment: '',
      catalog_num: '',
      comment: '',
      image_files: '',
      paths: '',
      description: '',
      small_image_url: '',
      medium_image_url: album.HasCoverArt
        ? url +
          '/media/cover?access_token=' +
          store_server_login_info.server_accessToken +
          '&type=album&target_id=' +
          album.ID
        : error_album,
      large_image_url: '',
      external_url: '',
      external_info_updated_at: '',
    }
  }

  private mapAlbum(album: any, url: string, index: number, last_index: number) {
    return {
      absoluteIndex: index + 1 + last_index,
      favorite: album.Starred,
      play_count: album.PlayCount,
      play_date: album.PlayDate,
      play_complete_count: album.PlayCompleteCount,
      rating: album.Rating,
      id: album.ID,
      name: album.Name,
      artist_id: album.ArtistID,
      embed_art_path: '',
      artist: album.Artist,
      album_artist: album.AlbumArtist,
      min_year: album.MinYear,
      max_year: album.Year,
      compilation: album.Compilation ? 1 : 0,
      song_count: album.SongCount,
      duration: album.Duration,
      genre: '',
      has_cover_art: album.HasCoverArt ? 1 : 0,
      created_at: album.CreatedAt,
      updated_at: album.UpdatedAt,
      all_artist_ids: album.AllArtistIDs,
      all_album_artist_ids: album.AllAlbumArtistIDs,
      full_text: '',
      album_artist_id: album.AlbumArtistID,
      order_album_name: '',
      order_album_artist_name: '',
      sort_album_name: '',
      sort_artist_name: '',
      sort_album_artist_name: '',
      size: album.Size,
      mbz_album_id: '',
      mbz_album_artist_id: '',
      mbz_album_type: '',
      mbz_album_comment: '',
      catalog_num: '',
      comment: '',
      image_files: '',
      paths: '',
      description: '',
      small_image_url: '',
      medium_image_url: album.HasCoverArt
        ? url +
          '/media/cover?access_token=' +
          store_server_login_info.server_accessToken +
          '&type=album&target_id=' +
          album.ID
        : error_album,
      large_image_url: '',
      external_url: '',
      external_info_updated_at: '',
    }
  }

  private mapArtist(artist: any, url: string, index: number, last_index: number) {
    return {
      absoluteIndex: index + 1 + last_index,
      favorite: artist.Starred,
      play_count: artist.PlayCount,
      play_date: artist.PlayDate,
      play_complete_count: artist.PlayCompleteCount,
      rating: artist.Rating,
      id: artist.ID,
      name: artist.Name,
      album_count: artist.AlbumCount,
      guest_album_count: artist.GuestAlbumCount,
      full_text: '',
      order_artist_name: '',
      sort_artist_name: '',
      song_count: artist.SongCount,
      guest_song_count: artist.GuestSongCount,
      cue_count: artist.CueCount,
      guest_cue_count: artist.GuestCueCount,
      compilation: artist.Compilation ? 1 : 0,
      has_cover_art: artist.HasCoverArt ? 1 : 0,
      size: artist.Size,
      all_artist_ids: artist.AllArtistIDs,
      mbz_artist_id: '',
      biography: '',
      small_image_url: '',
      medium_image_url: artist.HasCoverArt
        ? url +
          '/media/cover?access_token=' +
          store_server_login_info.server_accessToken +
          '&type=artist&target_id=' +
          artist.ID
        : error_artist,
      large_image_url: '',
      similar_artists: '',
      external_url: '',
      external_info_updated_at: '',
    }
  }
}
