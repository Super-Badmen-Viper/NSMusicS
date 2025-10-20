import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { usePageAlbumStore } from '@/data/data_status/app_status/page_status/album_store/usePageAlbumStore'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { usePageMediaStore } from '@/data/data_status/app_status/page_status/media_store/usePageMediaStore'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { Browsing_ApiService_of_ND } from '@/data/data_configs/navidrome_api/services_normal/browsing/index_service'
import { usePageArtistStore } from '@/data/data_status/app_status/page_status/artist_store/usePageArtistStore'
import { isElectron, ipcRenderer } from '@/utils/electron/isElectron'

// 定义类型接口
interface MediaTag {
  title?: any
  path?: any
  albumArtists?: any
  artist?: any
  album?: any
  discCount?: any
  trackCount?: any
  year?: any
  genres?: any
  duration?: any
  isCompilation?: any
  codec?: any
  audioBitrate?: any
  audioChannels?: any
  sizeOnDisk?: any
  albumPeak?: any
  trackPeak?: any
  comment?: any
  lyrics?: any
}

interface AlbumTag {
  title?: any
  albumArtists?: any
  artist?: any
  year?: any
  genres?: any
  duration?: any
  isCompilation?: any
  songCount?: any
}

interface ArtistTag {
  artist?: any
  genres?: any
}

export const usePagePlayerTagModifyStore = defineStore('pagePlayerTagModify', () => {
  const pageMediaStore = usePageMediaStore()
  // 使用 ref 替代 reactive 定义所有状态
  const player_show_tag_modify = ref(false)
  const player_show_tag_kind = ref('media')
  const player_current_media_path = ref('')
  const player_current_media_id = ref('')
  const player_current_media_starred = ref(undefined)
  const player_current_media_playCount = ref(undefined)
  const player_current_media_playDate = ref(undefined)

  // 媒体标签状态
  const player_current_media_tag = ref<MediaTag>({
    title: undefined,
    path: undefined,
    albumArtists: undefined,
    artist: undefined,
    album: undefined,
    discCount: undefined,
    trackCount: undefined,
    year: undefined,
    genres: undefined,
    duration: undefined,
    isCompilation: undefined,
    codec: undefined,
    audioBitrate: undefined,
    audioChannels: undefined,
    sizeOnDisk: undefined,
    albumPeak: undefined,
    trackPeak: undefined,
    comment: undefined,
    lyrics: undefined,
  })

  // 专辑标签状态
  const player_current_album_id = ref('')
  const player_current_album_starred = ref(undefined)
  const player_current_album_tag = ref<AlbumTag>({
    title: undefined,
    albumArtists: undefined,
    artist: undefined,
    year: undefined,
    genres: undefined,
    duration: undefined,
    isCompilation: undefined,
    songCount: undefined,
  })

  // 艺术家标签状态
  const player_current_artist_id = ref('')
  const player_current_artist_tag = ref<ArtistTag>({
    artist: undefined,
    genres: undefined,
  })

  // 时间格式化方法
  const formatTime = (currentTime: number): string => {
    const minutes = Math.floor(currentTime / 60)
    const seconds = Math.floor(currentTime % 60)

    let formattedMinutes = String(minutes)
    let formattedSeconds = String(seconds)

    if (formattedMinutes.length == 1) formattedMinutes = '0' + formattedMinutes
    if (formattedSeconds.length == 1) formattedSeconds = '0' + formattedSeconds

    return `${formattedMinutes}:${formattedSeconds}`
  }

  // 监听标签修改显示状态变化
  watch(player_show_tag_modify, async (newValue) => {
    if (newValue) {
      if (isElectron) {
        if (store_server_user_model.model_server_type_of_local) {
          /// modify 'app media file tag' and 'database $media_file$ info'
          if (player_show_tag_kind.value === 'media') {
            if (
              player_current_media_path.value != undefined &&
              player_current_media_path.value.length > 0
            ) {
              const local_file = await ipcRenderer.invoke(
                'node-taglib-sharp-get-media-path',
                player_current_media_path.value
              )
              /// app model | database media_file
              if (local_file) {
                // read app file tag
                player_current_media_tag.value = await ipcRenderer.invoke(
                  'node-taglib-sharp-get-media-tag',
                  player_current_media_path.value
                )
              }
              /// server_configs_stores model | database server_media_file
              else {
                const item: any = pageMediaStore.media_Files_temporary.find(
                  (mediaFile: any) => mediaFile.path === player_current_media_path.value
                )
                const albumArtistsStr = Array.isArray(item.albumArtists)
                  ? item.albumArtists.join('、')
                  : item.albumArtists || ''
                const artistStr = Array.isArray(item.artist)
                  ? item.artist.join('、')
                  : item.artist || ''
                const genresStr = Array.isArray(item.genres)
                  ? item.genres.join('、')
                  : item.genres || ''
                player_current_media_tag.value = {
                  title: item?.title,
                  path: item?.path,
                  albumArtists: albumArtistsStr,
                  artist: artistStr,
                  album: item?.album,
                  discCount: item?.disc_number,
                  trackCount: item?.track_number,
                  year: item?.year,
                  genres: genresStr,
                  duration: item?.duration_txt,
                  isCompilation: item?.compilation,
                  codec: item?.suffix,
                  audioBitrate: item?.bit_rate,
                  audioChannels: item?.channels,
                  sizeOnDisk: item?.size,
                  albumPeak: item?.rg_album_peak,
                  trackPeak: item?.rg_track_peak,
                  comment: item?.comment,
                  lyrics: item?.lyrics,
                }
                //
                if (item) {
                  player_current_media_path.value = item.path
                  player_current_media_id.value = item.id
                  player_current_media_starred.value = item.starred || false
                  player_current_media_playCount.value = item.playCount
                  player_current_media_playDate.value = item.playDate
                }
              }
            }
          } else if (player_show_tag_kind.value === 'album') {
            const pageAlbumStore = usePageAlbumStore()
            const item: any = pageAlbumStore.album_Files_temporary.find(
              (album: any) => album.id === player_current_album_id.value
            )
            const nameStr = Array.isArray(item.name) ? item.name.join('、') : item.name || ''
            const albumArtistsStr = Array.isArray(item.album_artist)
              ? item.album_artist.join('、')
              : item.album_artist || ''
            const artistStr = Array.isArray(item.artist)
              ? item.artist.join('、')
              : item.artist || ''
            const genresStr = Array.isArray(item.genre)
              ? item.genre.map((genre: any) => genre.name).join('、')
              : item.genre || ''
            player_current_album_tag.value = {
              title: nameStr,
              albumArtists: albumArtistsStr,
              artist: artistStr,
              year: item?.min_year,
              genres: genresStr,
              duration: formatTime(item?.duration),
              isCompilation: item?.compilation,
              songCount: item?.songCount,
            }
            //
            player_current_album_id.value = item.id
            player_current_album_starred.value = item.starred || false
          } else if (player_show_tag_kind.value === 'artist') {
            const pageArtistStore = usePageArtistStore()
            const item: any = pageArtistStore.artist_Files_temporary.find(
              (artist: any) => artist.id === player_current_artist_id.value
            )
            ///
            const artistStr = Array.isArray(item.name) ? item.name.join('、') : item.name || ''
            const genresStr = Array.isArray(item.genres)
              ? item.genres.map((genre: any) => genre.name).join('、')
              : item.genres || ''
            player_current_artist_tag.value = {
              artist: artistStr,
              genres: genresStr,
            }
            //
            player_current_artist_id.value = item.id
          }
        } else if (store_server_user_model.model_server_type_of_web) {
          /// show(no modify) web media_file_metadata
          if (player_show_tag_kind.value === 'media') {
            if (
              pageMediaStore.media_File_metadata != undefined &&
              pageMediaStore.media_File_metadata.length > 0 &&
              player_current_media_id.value.length > 0
            ) {
              let item: any
              if (store_server_users.server_select_kind === 'ninesong') {
                item = pageMediaStore.media_File_metadata.find(
                  (mediaFile: any) => mediaFile.ID === player_current_media_id.value
                )
                player_current_media_tag.value = {
                  title: item?.Title,
                  albumArtists: item?.AlbumArtist,
                  artist: item?.Artist,
                  album: item?.Album,
                  year: item?.Year,
                  genres: item?.Genre,
                  duration: formatTime(item?.Duration),
                  isCompilation: item?.Compilation,
                }
              } else {
                item = pageMediaStore.media_File_metadata.find(
                  (mediaFile: any) => mediaFile.id === player_current_media_id.value
                )
                const albumArtistsStr = Array.isArray(item.albumArtist)
                  ? item.albumArtists.join('、')
                  : item.albumArtists || ''
                const artistStr = Array.isArray(item.artist)
                  ? item.artist.join('、')
                  : item.artist || ''
                const genresStr = Array.isArray(item.genres)
                  ? item.genres.map((genre: any) => genre.name).join('、')
                  : item.genres || ''
                player_current_media_tag.value = {
                  title: item?.title,
                  albumArtists: albumArtistsStr,
                  artist: artistStr,
                  album: item?.album,
                  year: item?.year,
                  genres: genresStr,
                  duration: formatTime(item?.duration),
                  isCompilation: item?.compilation,
                }
              }
              //
              player_current_media_path.value = item.path
              player_current_media_id.value = item.id
              player_current_media_starred.value = item.starred || false
              player_current_media_playCount.value = item.playCount
              player_current_media_playDate.value = item.playDate
            }
          } else if (player_show_tag_kind.value === 'album') {
            try {
              const browsing_ApiService_of_ND = new Browsing_ApiService_of_ND(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest'
              )
              const getAlbum_id = await browsing_ApiService_of_ND.getAlbum(
                store_server_user_model.username,
                store_server_user_model.token,
                store_server_user_model.salt,
                player_current_album_id.value
              )
              const item = getAlbum_id['subsonic-response']['album']
              ///
              const albumArtistsStr = Array.isArray(item.albumArtist)
                ? item.albumArtists.join('、')
                : item.albumArtists || ''
              const artistStr = Array.isArray(item.artist)
                ? item.artist.join('、')
                : item.artist || ''
              const genresStr = Array.isArray(item.genres)
                ? item.genres.map((genre: any) => genre.name).join('、')
                : item.genres || ''
              player_current_album_tag.value = {
                title: item?.name,
                albumArtists: albumArtistsStr,
                artist: artistStr,
                year: item?.year,
                genres: genresStr,
                duration: formatTime(item?.duration),
                isCompilation: item?.compilation,
                songCount: item?.songCount,
              }
              //
              player_current_album_id.value = item.id
              player_current_album_starred.value = item.starred || false
            } catch {}
          } else if (player_show_tag_kind.value === 'artist') {
            try {
              const browsing_ApiService_of_ND = new Browsing_ApiService_of_ND(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest'
              )
              const getArtist_id = await browsing_ApiService_of_ND.getArtist(
                store_server_user_model.username,
                store_server_user_model.token,
                store_server_user_model.salt,
                player_current_artist_id.value
              )
              const item = getArtist_id['subsonic-response']['artist']
              ///
              const artistStr = Array.isArray(item.name) ? item.name.join('、') : item.name || ''
              const genresStr = Array.isArray(item.genres)
                ? item.genres.map((genre: any) => genre.name).join('、')
                : item.genres || ''
              player_current_artist_tag.value = {
                artist: artistStr,
                genres: genresStr,
              }
              //
              player_current_artist_id.value = item.id
            } catch {}
          }
        }
      } else {
        // other
      }
    }
  })

  // 返回所有状态和方法
  return {
    player_show_tag_modify,
    player_show_tag_kind,
    player_current_media_path,
    player_current_media_id,
    player_current_media_starred,
    player_current_media_playCount,
    player_current_media_playDate,
    player_current_media_tag,
    player_current_album_id,
    player_current_album_starred,
    player_current_album_tag,
    player_current_artist_id,
    player_current_artist_tag,
    formatTime,
  }
})
