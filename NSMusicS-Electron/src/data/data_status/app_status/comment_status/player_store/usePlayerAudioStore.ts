import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { usePageMediaStore } from '@/data/data_status/app_status/page_status/media_store/usePageMediaStore'
import { usePlayerAppearanceStore } from './usePlayerAppearanceStore'
import { store_system_configs_load } from '@/data/data_stores/local_system_stores/store_system_configs_load'
import { store_local_data_set_albumInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_albumInfo'
import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'
import { store_general_fetch_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_fetch_player_list'
import { store_player_tag_modify } from '@/views/view_app/page/page_player/store/store_player_tag_modify'
// 图片导入使用类型断言
import error_album from '@/assets/img/error_album.jpg'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { Get_LocalSqlite_AnnotationInfo } from '@/data/data_repository/app_repository/LocalSqlite_Get_AnnotationInfo'
import { usePlayerSettingStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerSettingStore'
import { usePageAlbumStore } from '@/data/data_status/app_status/page_status/album_store/usePageAlbumStore'
import { store_local_data_set_artistInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_artistInfo'
import { usePageArtistStore } from '@/data/data_status/app_status/page_status/artist_store/usePageArtistStore'
import vinyl from '@/assets/img/vinyl.jpg'

export const usePlayerAudioStore = defineStore('playerAudio', () => {
  const pageMediaStore = usePageMediaStore()
  // State using refs
  const this_audio_file_path = ref('')
  const this_audio_file_medium_image_url = ref('')
  const this_audio_restart_play = ref(false)

  const this_audio_cue_track_current_no = ref(0)
  const this_audio_cue_track_current_indexes = ref([])
  const this_audio_cue_track_current_title = ref('')
  const this_audio_cue_track_current_album = ref('')
  const this_audio_cue_track_current_artist = ref('')
  const this_audio_cue_tracks = ref([])

  const this_audio_artist_name = ref('')
  const this_audio_artist_id = ref('')
  const this_audio_song_name = ref('')
  const this_audio_song_id = ref('')
  const this_audio_album_name = ref('')
  const this_audio_album_id = ref('')

  const this_audio_play_id = ref('')

  const this_audio_Index_of_play_list = ref(-1)
  const this_audio_Index_of_play_list_carousel = ref(-1)
  const play_list_carousel_model = ref(false)

  const this_audio_song_rating = ref(0)
  const this_audio_song_favorite = ref(0)
  const this_audio_album_rating = ref('')
  const this_audio_album_favorite = ref('')
  const this_audio_artist_rating = ref(0)
  const this_audio_artist_favorite = ref(0)

  const this_audio_song_encoding_format = ref('')
  const this_audio_song_suffix = ref('')

  const page_top_vinyl_image_url = ref(vinyl)
  const page_top_album_image_url = ref(error_album)
  const page_top_album_id = ref('')
  const page_top_album_name = ref('')

  const this_audio_lyrics_string = ref('')
  const this_audio_lyrics_null = ref(false)
  const this_audio_lyrics_loaded_complete = ref(false)
  const this_audio_lyrics_info_line_font = ref([] as any[])
  const this_audio_lyrics_info_line_time = ref([] as any[])

  const this_audio_lyrics_info_byte_model = ref(false)
  const this_audio_lyrics_info_byte_font = ref([] as any[])
  const this_audio_lyrics_info_byte_time = ref([] as any[])

  const this_audio_lyrics_info_line_num = ref(28)

  // Actions
  const reset_data = async () => {
    if (!store_system_configs_load.app_configs_loading) {
      this_audio_file_path.value = ''
      this_audio_file_medium_image_url.value = error_album
      page_top_album_image_url.value = error_album
      this_audio_restart_play.value = false

      this_audio_song_encoding_format.value = ''
      this_audio_song_suffix.value = ''

      this_audio_artist_name.value = ''
      this_audio_artist_id.value = ''
      this_audio_song_name.value = ''
      this_audio_song_id.value = ''
      this_audio_album_name.value = ''
      this_audio_album_id.value = ''

      this_audio_Index_of_play_list.value = -1

      this_audio_song_rating.value = 0
      this_audio_song_favorite.value = 0
      this_audio_album_rating.value = ''
      this_audio_album_favorite.value = ''
      this_audio_artist_rating.value = 0
      this_audio_artist_favorite.value = 0

      page_top_album_image_url.value = error_album
      page_top_album_id.value = ''
      page_top_album_name.value = ''

      this_audio_lyrics_string.value = ''
      this_audio_lyrics_info_line_font.value = [] as any[]
      this_audio_lyrics_info_line_time.value = [] as any[]

      this_audio_lyrics_info_byte_model.value = false
      this_audio_lyrics_info_byte_font.value = [] as any[]
      this_audio_lyrics_info_byte_time.value = [] as any[]

      this_audio_lyrics_info_line_num.value = 28
    }
  }

  const set_lyric = async (newValue: string) => {
    if (newValue === undefined || newValue === 'undefined' || newValue.length === 0) {
      if (isElectron && store_server_user_model.model_server_type_of_local) {
        this_audio_lyrics_string.value = await ipcRenderer.invoke(
          'window-get-LyricPath',
          this_audio_file_path.value
        )
        if (this_audio_lyrics_string.value.length === 0) {
          this_audio_lyrics_null.value = true
          this_audio_lyrics_string.value = '[00:01.00]未找到可用歌词\n'
        } else {
          this_audio_lyrics_null.value = false
        }
      } else {
        this_audio_lyrics_null.value = true
        this_audio_lyrics_string.value = '[00:01.00]未找到可用歌词\n'
      }
    } else {
      this_audio_lyrics_string.value = newValue
    }
    this_audio_lyrics_loaded_complete.value = false

    // Split lyrics
    this_audio_lyrics_info_line_font.value = []
    for (let i = 0; i < this_audio_lyrics_info_line_num.value; i++) {
      this_audio_lyrics_info_line_font.value.push('')
    }

    const line_all = newValue.split('\n')
    const line_times: string[] = []
    line_all.forEach((line) => {
      try {
        const timestampMatch = line.match(/^\[(\d+,\d+)\]/)
        if (timestampMatch) {
          const [startMs, durationMs] = timestampMatch[1].split(',').map(Number)
          const minutes = Math.floor(startMs / 60000)
          const seconds = Math.floor((startMs % 60000) / 1000)
          const milliseconds = Math.floor((startMs % 1000) / 10)
          const timestamp = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`
          line_times.push(timestamp)
          const lyricsContent = line.replace(timestampMatch[0], '')
          this_audio_lyrics_info_line_font.value.push(lyricsContent)
        } else {
          const temp = line.split(']')
          if (temp.length > 1) {
            line_times.push(temp[0].replace('[', ''))
            this_audio_lyrics_info_line_font.value.push(temp[1])
          }
        }
      } catch {}
    })

    this_audio_lyrics_info_byte_model.value = false

    if (
      this_audio_lyrics_info_line_font.value &&
      this_audio_lyrics_info_line_font.value.length > 0
    ) {
      this_audio_lyrics_info_line_font.value.forEach((element: any, index: number) => {
        const timeFontMatches = element.match(/<(\d+,\d+,\d+)>([^<]+)/g)
        if (timeFontMatches) {
          this_audio_lyrics_info_byte_time.value[index] = []
          this_audio_lyrics_info_byte_font.value[index] = []
          const timeFontPairs = timeFontMatches.map((match: string) => {
            let [time, font] = match.split('>')
            time = time.replace('<', '')
            return [time.split(',').map(Number), font]
          })
          for (let i = 0; i < timeFontPairs.length; i++) {
            let [startMs, durationMs, unknown] = timeFontPairs[i][0] as number[]
            const nextStartMs =
              i < timeFontPairs.length - 1 ? (timeFontPairs[i + 1][0] as number[])[0] : Infinity

            if (nextStartMs < startMs + durationMs) {
              durationMs = 100
            }

            this_audio_lyrics_info_byte_time.value[index].push(`${startMs},${durationMs}`)
            this_audio_lyrics_info_byte_font.value[index].push(timeFontPairs[i][1])
          }

          this_audio_lyrics_info_byte_model.value = true
          this_audio_lyrics_info_line_font.value[index] =
            this_audio_lyrics_info_byte_font.value[index].join('')
        }
      })
    }

    for (let i = 0; i < this_audio_lyrics_info_line_num.value; i++) {
      this_audio_lyrics_info_line_font.value.push('')
    }

    // Split time of line
    this_audio_lyrics_info_line_time.value = []
    for (let i = 0; i < line_times.length; i++) {
      const [minutes, seconds] = line_times[i].split(':')
      this_audio_lyrics_info_line_time.value[i] =
        (parseInt(minutes) * 60 + parseInt(seconds)) * 1000
    }
    this_audio_lyrics_loaded_complete.value = true
  }

  const set_carousel_index = async () => {
    const playlistStore = usePlaylistStore()
    const index = playlistStore.playlist_MediaFiles_temporary_carousel.findIndex(
      (item: any) => item.path === this_audio_file_path.value
    )
    this_audio_Index_of_play_list_carousel.value = index != -1 ? index : 0
  }

  // Watchers
  watch(this_audio_file_path, (newValue) => {
    if (newValue != undefined && newValue != 'undefined' && newValue.length > 0) {
      console.log('this_audio_file_path：' + newValue)

      store_player_tag_modify.player_current_media_id = this_audio_song_id.value
      store_player_tag_modify.player_current_media_path = this_audio_file_path.value

      const playlistStore = usePlaylistStore()

      if (
        pageMediaStore.media_Files_temporary != undefined &&
        pageMediaStore.media_Files_temporary.length != 0
      ) {
        if (!store_system_configs_load.app_configs_loading) {
          this_audio_restart_play.value = true
        }
        const playerAppearanceStore = usePlayerAppearanceStore()
        if (!playerAppearanceStore.player_mode_of_lock_playlist) {
          if (!store_system_configs_load.app_configs_loading) {
            if (!playlistStore.playlist_show) {
              if (playlistStore.media_page_handleItemDbClick) {
                if (!store_server_user_model.random_play_model) {
                  store_general_fetch_player_list.fetchData_PlayList(false)
                }
              }
            }
          }
        }
      }
      pageMediaStore.media_Files_temporary.forEach((item: any) => {
        item.playing = item.id === this_audio_song_id.value
      })
      playlistStore.playlist_MediaFiles_temporary.forEach((item: any) => {
        item.playing = item.id === this_audio_song_id.value
      })

      try {
        if (isElectron) {
          ipcRenderer.invoke(
            'i18n-tray-label-musicIcon',
            String(this_audio_song_name.value) + ' - ' + this_audio_artist_name.value
          )
        }
      } catch (e) {
        console.log(e)
      }

      set_carousel_index()
    }
  })

  watch(this_audio_file_medium_image_url, async (newValue) => {
    console.log('this_audio_file_medium_image_url', newValue)

    if (newValue) {
      try {
        const response = await fetch(newValue)
        const blob = await response.blob()
        page_top_album_image_url.value = URL.createObjectURL(blob) // 使用 Object URL
        if (!store_system_configs_load.app_configs_loading) {
          this_audio_restart_play.value = true
        }
      } catch (error) {
        console.error('Failed to load image:', error)
        page_top_album_image_url.value = error_album
      }
    } else {
      page_top_album_image_url.value = error_album
    }
  })

  watch(this_audio_song_id, (newValue) => {
    console.log('this_audio_song_id：' + newValue)
  })

  watch(this_audio_song_rating, (newValue) => {
    console.log('this_audio_song_rating：' + newValue)

    pageMediaStore.media_Files_temporary.forEach((item: any) => {
      if (item.id === this_audio_song_id.value) item.rating = this_audio_song_rating.value
    })
  })

  watch(this_audio_song_favorite, (newValue) => {
    console.log('this_audio_song_favorite：' + newValue)

    pageMediaStore.media_Files_temporary.forEach((item: any) => {
      if (item.id === this_audio_song_id.value) item.favorite = this_audio_song_favorite.value
    })
  })

  watch(this_audio_album_name, (newValue) => {
    console.log('this_audio_album_name：' + newValue)

    page_top_album_name.value = newValue
  })

  watch(this_audio_album_id, (newValue) => {
    console.log('this_audio_album_id：' + newValue)

    page_top_album_id.value = newValue
    store_local_data_set_albumInfo.Set_AlbumInfo_To_PlayCount_of_Album(newValue)

    if (store_server_user_model.model_server_type_of_local) {
      const pageAlbumStore = usePageAlbumStore()
      const get_LocalSqlite_AnnotationInfo = new Get_LocalSqlite_AnnotationInfo()
      pageAlbumStore.album_recently_count =
        get_LocalSqlite_AnnotationInfo.Get_Annotation_ItemInfo_Play_Count('album')
      pageAlbumStore.page_albumlists_statistic.forEach((item: any) => {
        if (item.id === 'album_list_recently') {
          item.song_count = pageAlbumStore.album_recently_count + ' *'
        }
      })
      const playerSettingStore = usePlayerSettingStore()
      playerSettingStore.boolHandleItemClick_Played = true
    }
  })

  watch(this_audio_artist_id, (newValue) => {
    store_local_data_set_artistInfo.Set_ArtistInfo_To_PlayCount_of_Artist(
      this_audio_artist_id.value
    )
    if (store_server_user_model.model_server_type_of_local) {
      const get_LocalSqlite_AnnotationInfo = new Get_LocalSqlite_AnnotationInfo()
      const pageArtistStore = usePageArtistStore()
      pageArtistStore.artist_recently_count =
        get_LocalSqlite_AnnotationInfo.Get_Annotation_ItemInfo_Play_Count('artist')
      const playerSettingStore = usePlayerSettingStore()
      playerSettingStore.boolHandleItemClick_Played = true
    }
  })

  watch(this_audio_Index_of_play_list, (newValue) => {
    const playlistStore = usePlaylistStore()
    playlistStore.reset_carousel()
  })

  // Expose state and actions
  return {
    // State
    this_audio_file_path,
    this_audio_file_medium_image_url,
    this_audio_restart_play,
    this_audio_cue_track_current_no,
    this_audio_cue_track_current_indexes,
    this_audio_cue_track_current_title,
    this_audio_cue_track_current_album,
    this_audio_cue_track_current_artist,
    this_audio_cue_tracks,
    this_audio_artist_name,
    this_audio_artist_id,
    this_audio_song_name,
    this_audio_song_id,
    this_audio_album_name,
    this_audio_album_id,
    this_audio_play_id,
    this_audio_Index_of_play_list,
    this_audio_Index_of_play_list_carousel,
    play_list_carousel_model,
    this_audio_song_rating,
    this_audio_song_favorite,
    this_audio_album_rating,
    this_audio_album_favorite,
    this_audio_artist_rating,
    this_audio_artist_favorite,
    this_audio_song_encoding_format,
    this_audio_song_suffix,
    page_top_vinyl_image_url,
    page_top_album_image_url,
    page_top_album_id,
    page_top_album_name,
    this_audio_lyrics_string,
    this_audio_lyrics_null,
    this_audio_lyrics_loaded_complete,
    this_audio_lyrics_info_line_font,
    this_audio_lyrics_info_line_time,
    this_audio_lyrics_info_byte_model,
    this_audio_lyrics_info_byte_font,
    this_audio_lyrics_info_byte_time,
    this_audio_lyrics_info_line_num,

    // Actions
    reset_data,
    set_lyric,
    set_carousel_index,
  }
})
