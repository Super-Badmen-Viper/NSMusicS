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
  private artists_ApiService_of_NineSong = new Artists_ApiService_of_NineSong(
    store_server_login_info.server_url
  )
  private albums_ApiService_of_NineSong = new Albums_ApiService_of_NineSong(
    store_server_login_info.server_url
  )
  private medias_ApiService_of_NineSong = new Medias_ApiService_of_NineSong(
    store_server_login_info.server_url
  )
  private mediaCues_ApiService_of_NineSong = new MediaCues_ApiService_of_NineSong(
    store_server_login_info.server_url
  )
  private annotation_ApiService_of_NineSong = new Annotation_ApiService_of_NineSong(
    store_server_login_info.server_url
  )
  private home_ApiService_of_NineSong = new Home_ApiService_of_NineSong(
    store_server_login_info.server_url
  )
  private playlist_ApiService_of_NineSong = new Playlist_ApiService_of_NineSong(
    store_server_login_info.server_url
  )
  private retrieval_ApiService_of_NineSong = new Retrieval_ApiService_of_NineSong(
    store_server_login_info.server_url
  )
  private recommend_ApiService_of_NineSong = new Recommend_ApiService_of_NineSong(
    store_server_login_info.server_url
  )

  public async get_home_list(url: string) {
    await this.get_home_list_of_maximum_playback(url)
    await this.get_home_list_of_random_search(url)
    await this.get_home_list_of_recently_added(url)
    await this.get_home_list_of_recently_played(url)
  }
  public async get_home_list_of_maximum_playback(url: string) {
    url = url.includes('api') ? url : url + '/api'
    const maximum_playback = await this.home_ApiService_of_NineSong.getAlbumList_Play_Count()
    if (maximum_playback != undefined && Array.isArray(maximum_playback)) {
      maximum_playback.map(async (album: any) => {
        store_view_home_page_info.home_Files_temporary_maximum_playback.push({
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
        })
      })
    }
  }
  public async get_home_list_of_random_search(url: string) {
    url = url.includes('api') ? url : url + '/api'
    const random_search = await this.home_ApiService_of_NineSong.getRandomAlbums('0', '18')
    if (random_search != undefined && Array.isArray(random_search)) {
      random_search.map(async (album: any) => {
        store_view_home_page_info.home_Files_temporary_random_search.push({
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
        })
      })
    }
  }
  public async get_home_list_of_recently_added(url: string) {
    url = url.includes('api') ? url : url + '/api'
    const recently_added = await this.home_ApiService_of_NineSong.getAlbumList_Recently_Added()
    if (recently_added != undefined && Array.isArray(recently_added)) {
      recently_added.map(async (album: any) => {
        store_view_home_page_info.home_Files_temporary_recently_added.push({
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
        })
      })
    }
  }
  public async get_home_list_of_recently_played(url: string) {
    url = url.includes('api') ? url : url + '/api'
    const recently_played = await this.home_ApiService_of_NineSong.getAlbumList_Play_Date()
    if (recently_played != undefined && Array.isArray(recently_played)) {
      recently_played.map(async (album: any) => {
        store_view_home_page_info.home_Files_temporary_recently_played.push({
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
        })
      })
    }
  }
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
    min_bitrate: int,
    max_bitrate: int,
    folder_path: string
  ) {
    url = url.includes('api') ? url : url + '/api'
    folder_path = folder_path.replace(/\//g, '\\')
    let song_list = []
    let totalCount = 0
    if (playlist_id === '') {
      if (multi_sorts.length === 0) {
        const data = await this.medias_ApiService_of_NineSong.getMedias(
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
          folder_path
        )
        song_list = data['ninesong-response']['mediaFiles']
        totalCount = data['ninesong-response']['count']
      } else {
        const data = await this.medias_ApiService_of_NineSong.getMediasSort(
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
          folder_path
        )
        song_list = data['ninesong-response']['mediaFiles']
        totalCount = data['ninesong-response']['count']
      }
    } else {
      if (multi_sorts.length === 0) {
        const data = await this.medias_ApiService_of_NineSong.getMedias_Playlist(
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
          folder_path
        )
        song_list = data['ninesong-response']['mediaFiles']
        totalCount = data['ninesong-response']['count']
      } else {
        const data = await this.medias_ApiService_of_NineSong.getMedias_PlaylistSort(
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
          folder_path
        )
        song_list = data['ninesong-response']['mediaFiles']
        totalCount = data['ninesong-response']['count']
      }
    }
    ///
    if (Array.isArray(song_list) && song_list.length > 0) {
      if (store_general_fetch_media_list._load_model === 'search') {
        const existing = store_view_media_page_info.media_Files_temporary.find(
          (item) => item.id === song_list[0].ID
        )
        if (existing) {
          console.error('警告，获取的Media项存在重复，服务端的查询业务存在问题')
        }
      } else {
        const existing = store_playlist_list_info.playlist_MediaFiles_temporary.find(
          (item) => item.id === song_list[0].ID
        )
        if (existing) {
          console.error('警告，获取的Media项存在重复，服务端的查询业务存在问题')
        }
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
        const newsong = {
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
        if (store_general_fetch_media_list._load_model === 'search') {
          store_view_media_page_info.media_File_metadata.push(song)
          store_view_media_page_info.media_Files_temporary.push(newsong)
        } else {
          store_playlist_list_info.playlist_MediaFiles_temporary.push({
            ...newsong,
            play_id: newsong.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000,
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
        const data = await this.mediaCues_ApiService_of_NineSong.getMediaCues(
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
        const data = await this.mediaCues_ApiService_of_NineSong.getMediaCuesSort(
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
        const data = await this.mediaCues_ApiService_of_NineSong.getMediaCues_Playlist(
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
      if (store_general_fetch_media_list._load_model === 'search') {
        const existing = store_view_media_page_info.media_Files_temporary.find(
          (item) => item.id === song_list[0].ID
        )
        if (existing) {
          console.error('警告，获取的Media项存在重复，服务端的查询业务存在问题')
        }
      } else {
        const existing = store_playlist_list_info.playlist_MediaFiles_temporary.find(
          (item) => item.id === song_list[0].ID
        )
        if (existing) {
          console.error('警告，获取的Media项存在重复，服务端的查询业务存在问题')
        }
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
        const newsong = {
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
        if (store_general_fetch_media_list._load_model === 'search') {
          store_view_media_cue_page_info.media_File_metadata.push(song)
          store_view_media_cue_page_info.media_Files_temporary.push(newsong)
        } else {
          store_playlist_list_info.playlist_MediaFiles_temporary.push({
            ...newsong,
            play_id: newsong.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000,
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
      const data = await this.albums_ApiService_of_NineSong.getAlbums(
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
      const data = await this.albums_ApiService_of_NineSong.getAlbumsSort(
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
      const existing = store_view_album_page_info.album_Files_temporary.find(
        (item) => item.id === album_list[0].ID
      )
      if (existing) {
        console.error('警告，获取的Album项存在重复，服务端的查询业务存在问题')
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
        store_view_album_page_info.album_Files_temporary.push({
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
        })
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
      const data = await this.artists_ApiService_of_NineSong.getArtists(
        _start,
        _end,
        _sort,
        _order,
        _starred,
        _search
      )
      artist_list = data['ninesong-response']['artists']
    } else {
      const data = await this.artists_ApiService_of_NineSong.getArtistsSort(
        _start,
        _end,
        multi_sorts,
        _starred,
        _search
      )
      artist_list = data['ninesong-response']['artists']
    }
    if (Array.isArray(artist_list) && artist_list.length > 0) {
      const existing = store_view_artist_page_info.artist_Files_temporary.find(
        (item) => item.id === artist_list[0].ID
      )
      if (existing) {
        console.error('警告，获取的Artist项存在重复，服务端的查询业务存在问题')
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
        store_view_artist_page_info.artist_Files_temporary.push({
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
        })
      })
    }
  }
  public async get_random_song_list(url: string, _start: string, _end: string) {
    url = url.includes('api') ? url : url + '/api'
    const song_list = await this.home_ApiService_of_NineSong.getRandomMedias(_start, _end)
    if (Array.isArray(song_list) && song_list.length > 0) {
      const last_index = 0
      song_list.map(async (song: any, index: number) => {
        const new_song = {
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

  private formatTime(currentTime: number): string {
    const minutes = Math.floor(currentTime / 60)
    const seconds = Math.floor(currentTime % 60)

    let formattedMinutes = String(minutes)
    let formattedSeconds = String(seconds)

    if (formattedMinutes.length == 1) formattedMinutes = '0' + formattedMinutes

    if (formattedSeconds.length == 1) formattedSeconds = '0' + formattedSeconds

    return `${formattedMinutes}:${formattedSeconds}`
  }

  /// file count
  public async get_count_of_media_file(
    starred: string,
    search: string,
    year: string,
    album_id: string,
    artist_id: string
  ) {
    try {
      const counts = await this.medias_ApiService_of_NineSong.getMediaCounts(
        starred,
        search,
        year,
        album_id,
        artist_id
      )
      const response = counts['ninesong-response']['mediaFiles']
      store_view_media_page_info.media_item_count = response.total
      store_view_media_page_info.media_starred_count = response.starred
      store_view_media_page_info.media_recently_count = response.recent_play
    } catch {}
  }
  public async get_count_of_media_cue_file(
    starred: string,
    search: string,
    year: string,
    artist_id: string
  ) {
    try {
      const counts = await this.mediaCues_ApiService_of_NineSong.getMediaCuesCounts(
        starred,
        search,
        year,
        artist_id
      )
      const response = counts['ninesong-response']['mediaFiles']
      store_view_media_cue_page_info.media_item_count = response.total
      store_view_media_cue_page_info.media_starred_count = response.starred
      store_view_media_cue_page_info.media_recently_count = response.recent_play
    } catch {}
  }
  public async get_count_of_album(
    starred: string,
    search: string,
    min_year: string,
    max_year: string,
    artist_id: string
  ) {
    try {
      const counts = await this.albums_ApiService_of_NineSong.getAlbumCounts(
        starred,
        search,
        min_year,
        max_year,
        artist_id
      )
      const response = counts['ninesong-response']['albums']
      store_view_album_page_info.album_item_count = response.total
      store_view_album_page_info.album_starred_count = response.starred
      store_view_album_page_info.album_recently_count = response.recent_play
    } catch {}
  }
  public async get_count_of_artist(starred: string, search: string) {
    try {
      const counts = await this.artists_ApiService_of_NineSong.getArtistCounts(starred, search)
      const response = counts['ninesong-response']['artists']
      store_view_artist_page_info.artist_item_count = response.total
      store_view_artist_page_info.artist_starred_count = response.starred
      store_view_artist_page_info.artist_recently_count = response.recent_play
    } catch {}
  }
  /// playlist count
  public async get_count_of_playlist() {
    try {
      const getPlaylists_all = await this.playlist_ApiService_of_NineSong.getPlaylists()
      const playlists = getPlaylists_all['ninesong-response']['playlists']
      if (playlists != undefined)
        store_view_media_page_info.media_playlist_count = playlists.length || 0
    } catch {}
  }

  public async get_playlist_ninesong() {
    let playlists = []
    const getPlaylists_all = await this.playlist_ApiService_of_NineSong.getPlaylists()
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
    const result = await this.recommend_ApiService_of_NineSong.getWordCloudTag()
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
    const result = await this.recommend_ApiService_of_NineSong.getWordCloudGenre()
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
    const result = await this.recommend_ApiService_of_NineSong.getHighFrequency(100)
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
    const result = await this.recommend_ApiService_of_NineSong.getRecommended(keywords)
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
    const result = await this.medias_ApiService_of_NineSong.getMedia_Ids(ids)
    if (result != undefined) {
      song_list = result['ninesong-response']['mediaFiles']
    }
    if (song_list != undefined && song_list.length > 0) {
      store_view_recommend_page_info.recommend_MediaFiles_metadata = []
      store_view_recommend_page_info.recommend_MediaFiles_temporary = []
      song_list.map(async (song: any, index: number) => {
        const newsong = {
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
        store_view_recommend_page_info.recommend_MediaFiles_metadata.push(song)
        store_view_recommend_page_info.recommend_MediaFiles_temporary.push({
          ...newsong,
          play_id: newsong.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000,
        })
      })
    }
  }
}
