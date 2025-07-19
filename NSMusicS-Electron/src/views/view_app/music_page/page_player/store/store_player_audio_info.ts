import { reactive, watch } from 'vue'
import { store_view_media_page_info } from '@/views/view_app/music_page/page_media/store/store_view_media_page_info'
import { store_player_appearance } from './store_player_appearance'
import { store_playlist_list_info } from '@/views/view_app/music_components/player_list/store/store_playlist_list_info'
import { store_app_configs_logic_load } from '@/data/data_stores/app/store_app_configs_logic_load'
import { store_local_data_set_albumInfo } from '@/data/data_stores/local/local_data_synchronization/store_local_data_set_albumInfo'
import { store_playlist_appearance } from '@/views/view_app/music_components/player_list/store/store_playlist_appearance'
import { store_playlist_list_logic } from '@/views/view_app/music_components/player_list/store/store_playlist_list_logic'
import { store_general_fetch_player_list } from '@/data/data_stores/server/server_api_abstract/music_scene/components/player_list/store_general_fetch_player_list'
import { store_player_tag_modify } from './store_player_tag_modify'
import error_album from '@/assets/img/error_album.jpg'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { store_server_user_model } from '@/data/data_stores/server/store_server_user_model'
import { Get_AnnotationInfo_To_LocalSqlite } from '@/data/data_access/local_configs/class_Get_AnnotationInfo_To_LocalSqlite'
import { store_view_album_page_info } from '@/views/view_app/music_page/page_album/store/store_view_album_page_info'
import { store_player_audio_logic } from './store_player_audio_logic'
import { store_view_album_page_logic } from '@/views/view_app/music_page/page_album/store/store_view_album_page_logic'
import { store_local_data_set_artistInfo } from '@/data/data_stores/local/local_data_synchronization/store_local_data_set_artistInfo'
import { store_view_artist_page_info } from '@/views/view_app/music_page/page_artist/store/store_view_artist_page_info'
import vinyl from '@/assets/img/vinyl.jpg'

export const store_player_audio_info = reactive({
  this_audio_file_path: '',
  this_audio_file_medium_image_url: '',
  this_audio_restart_play: false,

  this_audio_cue_track_current_no: 0,
  this_audio_cue_track_current_indexes: [],
  this_audio_cue_track_current_title: '',
  this_audio_cue_track_current_album: '',
  this_audio_cue_track_current_artist: '',
  this_audio_cue_tracks: [],

  this_audio_artist_name: '',
  this_audio_artist_id: '',
  this_audio_song_name: '',
  this_audio_song_id: '',
  this_audio_album_name: '',
  this_audio_album_id: '',

  this_audio_play_id: '',

  this_audio_Index_of_play_list: -1,
  this_audio_Index_of_play_list_carousel: -1,
  play_list_carousel_model: false,

  this_audio_song_rating: 0,
  this_audio_song_favorite: false,
  this_audio_album_rating: '',
  this_audio_album_favorite: '',
  this_audio_artist_rating: 0,
  this_audio_artist_favorite: 0,

  this_audio_song_encoding_format: '',
  this_audio_song_suffix: '',

  page_top_vinyl_image_url: vinyl,
  page_top_album_image_url: error_album,
  page_top_album_id: '',
  page_top_album_name: '',

  this_audio_lyrics_string: '',
  this_audio_lyrics_null: false,
  this_audio_lyrics_loaded_complete: false,
  this_audio_lyrics_info_line_font: [] as any[],
  this_audio_lyrics_info_line_time: [] as any[],

  this_audio_lyrics_info_byte_model: false,
  this_audio_lyrics_info_byte_font: [] as any[],
  this_audio_lyrics_info_byte_time: [] as any[],

  this_audio_lyrics_info_line_num: 28,

  async reset_data() {
    if (!store_app_configs_logic_load.app_configs_loading) {
      this.this_audio_file_path = ''
      this.this_audio_file_medium_image_url = error_album
      this.page_top_album_image_url = error_album
      this.this_audio_restart_play = false

      this.this_audio_song_encoding_format = ''
      this.this_audio_song_suffix = ''

      this.this_audio_artist_name = ''
      this.this_audio_artist_id = ''
      this.this_audio_song_name = ''
      this.this_audio_song_id = ''
      this.this_audio_album_name = ''
      this.this_audio_album_id = ''

      this.this_audio_Index_of_play_list = -1

      this.this_audio_song_rating = 0
      this.this_audio_song_favorite = 0
      this.this_audio_album_rating = ''
      this.this_audio_album_favorite = ''
      this.this_audio_artist_rating = 0
      this.this_audio_artist_favorite = 0

      this.page_top_album_image_url = error_album
      this.page_top_album_id = ''
      this.page_top_album_name = ''

      this.this_audio_lyrics_string = ''
      this.this_audio_lyrics_info_line_font = [] as any[]
      this.this_audio_lyrics_info_line_time = [] as any[]

      this.this_audio_lyrics_info_byte_model = false
      this.this_audio_lyrics_info_byte_font = [] as any[]
      this.this_audio_lyrics_info_byte_time = [] as any[]

      this.this_audio_lyrics_info_line_num = 28
    }
  },
  async set_lyric(newValue: string) {
    store_player_audio_info.this_audio_lyrics_string = newValue
    store_player_audio_info.this_audio_lyrics_loaded_complete = false
    if (newValue === undefined || newValue === 'undefined' || newValue.length === 0) {
      if (isElectron && store_server_user_model.model_server_type_of_local) {
        store_player_audio_info.this_audio_lyrics_string = await ipcRenderer.invoke(
          'window-get-LyricPath',
          store_player_audio_info.this_audio_file_path
        )
        if (store_player_audio_info.this_audio_lyrics_string.length === 0) {
          store_player_audio_info.this_audio_lyrics_null = true
          store_player_audio_info.this_audio_lyrics_string = '[00:01.00]未找到可用歌词\n'
        } else {
          store_player_audio_info.this_audio_lyrics_null = false
        }
      } else {
        store_player_audio_info.this_audio_lyrics_null = true
        store_player_audio_info.this_audio_lyrics_string = '[00:01.00]未找到可用歌词\n'
      }
    }
    if (newValue === undefined || newValue === 'undefined' || newValue.length === 0) {
      return
    }
    ////// split lyrics
    store_player_audio_info.this_audio_lyrics_info_line_font = []
    for (let i = 0; i < store_player_audio_info.this_audio_lyrics_info_line_num; i++) {
      store_player_audio_info.this_audio_lyrics_info_line_font.push('')
    }
    //
    const line_all = newValue.split('\n')
    const line_times = []
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
          store_player_audio_info.this_audio_lyrics_info_line_font.push(lyricsContent)
        } else {
          const temp = line.split(']')
          if (temp.length > 1) {
            line_times.push(temp[0].replace('[', ''))
            store_player_audio_info.this_audio_lyrics_info_line_font.push(temp[1])
          }
        }
      } catch {}
    })
    //////
    store_player_audio_info.this_audio_lyrics_info_byte_model = false
    if (
      store_player_audio_info.this_audio_lyrics_info_line_font &&
      store_player_audio_info.this_audio_lyrics_info_line_font.length > 0
    ) {
      store_player_audio_info.this_audio_lyrics_info_line_font.forEach((element, index) => {
        const timeFontMatches = element.match(/<(\d+,\d+,\d+)>([^<]+)/g)
        if (timeFontMatches) {
          store_player_audio_info.this_audio_lyrics_info_byte_time[index] = []
          store_player_audio_info.this_audio_lyrics_info_byte_font[index] = []
          const timeFontPairs = timeFontMatches.map((match) => {
            let [time, font] = match.split('>')
            time = time.replace('<', '')
            return [time.split(',').map(Number), font]
          })
          for (let i = 0; i < timeFontPairs.length; i++) {
            let [startMs, durationMs, unknown] = timeFontPairs[i][0]
            const nextStartMs = i < timeFontPairs.length - 1 ? timeFontPairs[i + 1][0][0] : Infinity

            if (nextStartMs < startMs + durationMs) {
              // durationMs = nextStartMs - startMs - 100;
              durationMs = 100
            }

            store_player_audio_info.this_audio_lyrics_info_byte_time[index].push(
              `${startMs},${durationMs}`
            )
            store_player_audio_info.this_audio_lyrics_info_byte_font[index].push(
              timeFontPairs[i][1]
            )
          }

          store_player_audio_info.this_audio_lyrics_info_byte_model = true
          /// temp
          store_player_audio_info.this_audio_lyrics_info_line_font[index] =
            store_player_audio_info.this_audio_lyrics_info_byte_font[index].join('')
          ///
        }
      })
    }
    ///
    for (let i = 0; i < store_player_audio_info.this_audio_lyrics_info_line_num; i++) {
      store_player_audio_info.this_audio_lyrics_info_line_font.push('')
    }
    ////// split time of line
    store_player_audio_info.this_audio_lyrics_info_line_time = []
    for (let i = 0; i < line_times.length; i++) {
      const [minutes, seconds] = line_times[i].split(':')
      store_player_audio_info.this_audio_lyrics_info_line_time[i] =
        (parseInt(minutes) * 60 + parseInt(seconds)) * 1000
    }
    store_player_audio_info.this_audio_lyrics_loaded_complete = true
  },
  set_carousel_index() {
    const index = store_playlist_list_info.playlist_MediaFiles_temporary_carousel.findIndex(
      (item) => item.path === store_player_audio_info.this_audio_file_path
    )
    store_player_audio_info.this_audio_Index_of_play_list_carousel = index != -1 ? index : 0
  },
})
watch(
  () => store_player_audio_info.this_audio_file_path,
  (newValue) => {
    if (newValue != undefined && newValue != 'undefined' && newValue.length > 0) {
      console.log('this_audio_file_path：' + newValue)

      store_player_tag_modify.player_current_media_id = store_player_audio_info.this_audio_song_id
      store_player_tag_modify.player_current_media_path =
        store_player_audio_info.this_audio_file_path

      if (
        store_view_media_page_info.media_Files_temporary != undefined &&
        store_view_media_page_info.media_Files_temporary.length != 0
      ) {
        if (!store_app_configs_logic_load.app_configs_loading) {
          store_player_audio_info.this_audio_restart_play = true
        }
        if (!store_player_appearance.player_mode_of_lock_playlist) {
          if (!store_app_configs_logic_load.app_configs_loading) {
            if (!store_playlist_appearance.playlist_show) {
              if (store_playlist_list_logic.media_page_handleItemDbClick) {
                if (!store_server_user_model.random_play_model) {
                  store_general_fetch_player_list.fetchData_PlayList(false)
                }
              }
            }
          }
        }
      }
      store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
        item.playing = item.id === store_player_audio_info.this_audio_song_id
      })
      store_playlist_list_info.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
        item.playing = item.id === store_player_audio_info.this_audio_song_id
      })

      try {
        if (isElectron) {
          ipcRenderer.invoke(
            'i18n-tray-label-musicIcon',
            String(store_player_audio_info.this_audio_song_name) +
              ' - ' +
              store_player_audio_info.this_audio_artist_name
          )
        }
      } catch (e) {
        console.log(e)
      }

      //
      store_player_audio_info.set_carousel_index()
    }
  }
)
watch(
  () => store_player_audio_info.this_audio_file_medium_image_url,
  async (newValue) => {
    console.log('this_audio_file_medium_image_url', newValue)

    if (newValue) {
      try {
        const response = await fetch(newValue)
        const blob = await response.blob()
        store_player_audio_info.page_top_album_image_url = URL.createObjectURL(blob) // 使用 Object URL
        if (!store_app_configs_logic_load.app_configs_loading) {
          store_player_audio_info.this_audio_restart_play = true
        }
      } catch (error) {
        console.error('Failed to load image:', error)
        store_player_audio_info.page_top_album_image_url = error_album
      }
    } else {
      store_player_audio_info.page_top_album_image_url = error_album
    }
  }
)
watch(
  () => store_player_audio_info.this_audio_song_id,
  (newValue) => {
    console.log('this_audio_song_id：' + newValue)
  }
)
watch(
  () => store_player_audio_info.this_audio_song_rating,
  (newValue) => {
    console.log('this_audio_song_rating：' + newValue)

    store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
      if (item.id === store_player_audio_info.this_audio_song_id)
        item.rating = store_player_audio_info.this_audio_song_rating
    })
  }
)
watch(
  () => store_player_audio_info.this_audio_song_favorite,
  (newValue) => {
    console.log('this_audio_song_favorite：' + newValue)

    store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
      if (item.id === store_player_audio_info.this_audio_song_id)
        item.favorite = store_player_audio_info.this_audio_song_favorite
    })
  }
)
watch(
  () => store_player_audio_info.this_audio_album_name,
  (newValue) => {
    console.log('this_audio_album_name：' + newValue)

    store_player_audio_info.page_top_album_name = newValue
  }
)
watch(
  () => store_player_audio_info.this_audio_album_id,
  (newValue) => {
    console.log('this_audio_album_id：' + newValue)

    store_player_audio_info.page_top_album_id = newValue
    store_local_data_set_albumInfo.Set_AlbumInfo_To_PlayCount_of_Album(newValue)

    if (store_server_user_model.model_server_type_of_local) {
      const get_AnnotationInfo_To_LocalSqlite = new Get_AnnotationInfo_To_LocalSqlite()
      store_view_album_page_info.album_recently_count =
        get_AnnotationInfo_To_LocalSqlite.Get_Annotation_ItemInfo_Play_Count('album')
      store_view_album_page_logic.page_albumlists_statistic.forEach((item: any) => {
        if (item.id === 'album_list_recently') {
          item.song_count = store_view_album_page_info.album_recently_count + ' *'
        }
      })
      store_player_audio_logic.boolHandleItemClick_Played = true
    } else {
    }
  }
)
watch(
  () => store_player_audio_info.this_audio_artist_id,
  (newValue) => {
    store_local_data_set_artistInfo.Set_ArtistInfo_To_PlayCount_of_Artist(
      store_player_audio_info.this_audio_artist_id
    )
    if (store_server_user_model.model_server_type_of_local) {
      const get_AnnotationInfo_To_LocalSqlite = new Get_AnnotationInfo_To_LocalSqlite()
      store_view_artist_page_info.artist_recently_count =
        get_AnnotationInfo_To_LocalSqlite.Get_Annotation_ItemInfo_Play_Count('artist')
      store_player_audio_logic.boolHandleItemClick_Played = true
    }
  }
)
watch(
  () => store_player_audio_info.this_audio_Index_of_play_list,
  (newValue) => {
    store_playlist_list_info.reset_carousel()
  }
)
