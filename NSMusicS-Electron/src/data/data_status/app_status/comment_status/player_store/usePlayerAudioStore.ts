import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// 类型定义
interface Media_File {
  id: string
  path?: string
  playing?: boolean
  favorite?: boolean
  rating?: number
  title?: string
  album?: string
  artist?: string
  play_id?: string
  encoding_format?: string
  suffix?: string
  medium_image_url?: string
  artist_id?: string
  album_id?: string
  lyrics?: string
  play_count?: number
  play_date?: string
  cue_tracks?: any[]
  [key: string]: any
}

// 导入依赖
import { store_view_media_page_info } from '@/views/view_app/page/page_media/store/store_view_media_page_info'
import { store_system_configs_load } from '@/data/data_stores/local_system_stores/store_system_configs_load'
import { store_local_data_set_albumInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_albumInfo'
import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'
import { store_general_fetch_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_fetch_player_list'
import { store_player_tag_modify } from '@/views/view_app/page/page_player/store/store_player_tag_modify'
import error_album from '@/assets/img/error_album.jpg'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { Get_LocalSqlite_AnnotationInfo } from '@/data/data_repository/app_repository/LocalSqlite_Get_AnnotationInfo'
import { store_view_album_page_info } from '@/views/view_app/page/page_album/store/store_view_album_page_info'
import { store_view_album_page_logic } from '@/views/view_app/page/page_album/store/store_view_album_page_logic'
import { store_local_data_set_artistInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_artistInfo'
import { store_view_artist_page_info } from '@/views/view_app/page/page_artist/store/store_view_artist_page_info'
import vinyl from '@/assets/img/vinyl.jpg'
import { Audio_ApiService_of_Je } from '@/data/data_configs/jellyfin_api/services_web/Audio/index_service'
import { Retrieval_ApiService_of_NineSong } from '@/data/data_configs/ninesong_api/services_web/Scene/Music/Retrieval/index_service'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { store_player_view } from '@/views/view_app/page/page_player/store/store_player_view'
import { Audio_node_mpv } from '@/data/data_models/app_models/song_Audio_Out/Audio_node_mpv'
import { Audio_howler } from '@/data/data_models/app_models/song_Audio_Out/Audio_howler'
import { usePlayerAppearanceStore } from './usePlayerAppearanceStore'

export const usePlayerAudioStore = defineStore('player-audio', () => {
  // 音频信息状态
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
  const this_audio_song_favorite = ref(false)
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

  // 音频逻辑状态
  const player = ref(new Audio_howler())
  const player_state_play_click = ref(false)
  const player_state_skip_back_click = ref(false)
  const player_state_skip_forward_click = ref(false)
  const player_init_play = ref(false)
  const player_kind = ref([
    { label: 'mpv', value: 'mpv' },
    { label: 'web', value: 'web' },
  ])
  const player_select = ref('web')
  const player_device_kind = ref([])
  const player_device_select = ref('default')
  const player_model_cue = ref(false)
  const play_order = ref('playback-2')
  const play_volume = ref(100)
  const player_fade_value = ref(2000)
  const player_dolby = ref(false)
  const player_audio_channel = ref('')
  const player_samp_value = ref(48000)
  const player_gaplessAudio = ref('weak')
  const player_audioExclusiveMode = ref(false)
  const player_replayGainMode = ref('no')
  const player_replayGainPreamp = ref(0)
  const player_replayGainClip = ref(false)
  const player_replayGainFallback = ref(0)
  const player_mpvExtraParameters = ref('')
  const player_is_play_ended = ref(false)
  const player_range_duration_isDragging = ref(false)
  const player_click_state_of_order = ref(false)
  const player_click_state_of_play_skip_back = ref(false)
  const player_click_state_of_play = ref(false)
  const player_click_state_of_play_skip_forward = ref(false)
  const total_play_time = ref('04:42')
  const current_play_time = ref('01:36')
  const slider_init_singleValue = ref(0)
  const slider_singleValue = ref(0)
  const marks_slider_singleValue = ref({})
  const player_no_progress_jump = ref(true)
  const player_back_ChevronDouble = ref('')
  const player_slider_click = ref(false)
  const player_slider_currentTime_added_value = ref(0)
  const player_go_lyric_line_index_of_audio_play_progress = ref(0)
  const player_save_new_data = ref(false)
  const this_audio_initial_trigger = ref(false)
  const drawer_order_show = ref(false)
  const drawer_order_height = ref(160)
  const drawer_volume_show = ref(false)
  const drawer_theme_show = ref(false)
  const orderToolShow = ref(true)
  const voiceToolShow = ref(true)
  const langWidths = ref({
    zhHans: '122',
    zhHant: '122',
    en: '202',
    cs: '211',
    es: '233',
    de: '228',
    fr: '202',
    it: '240',
    ja: '166',
    nl: '206',
    fa: '169',
    ptBr: '224',
    pl: '252',
    ru: '330',
    sr: '232',
    sv: '242',
  })
  const orderPanelWidath = ref('202')
  const orderButonWidath = ref('202')
  const boolHandleItemClick_Favorite = ref(false)
  const boolHandleItemClick_Played = ref(false)

  // 计算属性
  const player_lyric_fontSizeComputed = computed(() => {
    const playerAppearanceStore = usePlayerAppearanceStore()
    return playerAppearanceStore.player_lyric_fontSize_Num + 'px'
  })

  // 方法定义
  async function init_player() {
    if (player_select.value === 'mpv') {
      if (isElectron) {
        await ipcRenderer.invoke('mpv-quit')
        await ipcRenderer.invoke('mpv-init')
        player.value = new Audio_node_mpv()
      } else {
        // TODO: 添加非 Electron 环境下的处理逻辑
        console.log('Non-Electron environment logic not implemented yet.')
      }
    } else {
      // 采用web输出，更加稳定
      if (player.value && player.value.howl) {
        player.value.howl.unload()
      }
      player.value = new Audio_howler()
    }
  }

  function formatTime(currentTime: number): string {
    const minutes = Math.floor(currentTime / 60)
    const seconds = Math.floor(currentTime % 60)

    let formattedMinutes = String(minutes)
    let formattedSeconds = String(seconds)

    if (formattedMinutes.length == 1) formattedMinutes = '0' + formattedMinutes

    if (formattedSeconds.length == 1) formattedSeconds = '0' + formattedSeconds

    return `${formattedMinutes}:${formattedSeconds}`
  }

  function formatStrTime(currentStr: string): number {
    // 1. 分割时间字符串为分钟、秒、毫秒三部分
    const parts = currentStr.split(':')

    // 2. 验证格式有效性（必须为三段且全为数字）
    if (parts.length !== 3 || parts.some((part) => isNaN(parseInt(part)))) {
      throw new Error(`Invalid time format: "${currentStr}". Expected "MM:SS:ms"`)
    }

    // 3. 解析时间分量
    const minutes = parseInt(parts[0], 10)
    const seconds = parseInt(parts[1], 10)
    const milliseconds = parseInt(parts[2], 10)

    // 4. 计算总毫秒数（核心转换逻辑）
    return (
      minutes * 60 * 1000 + // 分钟转毫秒
      seconds * 1000 + // 秒转毫秒
      milliseconds // 毫秒直接累加
    )
  }

  function formatTime_RunTimeTicks(timestamp: number): string {
    const divisor = store_server_users.server_select_kind === 'ninesong' ? 100 : 1
    const milliseconds = Math.floor(timestamp / 10000 / divisor)
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(seconds).padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`
  }

  async function play_go_duration(slider_value: number, silder_path: boolean) {
    player_slider_click.value = true
    player_no_progress_jump.value = false
    player_slider_currentTime_added_value.value = 0
    store_player_view.currentScrollIndex = 0

    // 注意，此时currentTime将从0开始，需要计算附加值
    if (silder_path) {
      let newTime = (Number(slider_value) / 100) * (await player.value.getDuration())
      if (Number(slider_value) !== 0 && Number(slider_value) !== 100) {
        player.value.setCurrentTime(newTime)
      } else {
        player.value.setCurrentTime(0)
      }
    } else {
      let newTime = Number(slider_value) / 1000
      if (Number(slider_value) !== 0 && Number(slider_value) !== 100) {
        player.value.setCurrentTime(newTime)
      } else {
        player.value.setCurrentTime(0)
      }
    }

    player.value.isPlaying = true
  }

  async function update_current_media_info(media_file: Media_File, index: any) {
    const cue_page_play = typeof index != 'number'
    let index_num = !cue_page_play ? index : index != undefined ? Number(index.split('-')[1]) : 0
    // cue
    if (cue_page_play) {
      if (index_num === undefined || media_file.cue_tracks === undefined) {
        this_audio_cue_track_current_no.value = 0
        this_audio_cue_track_current_indexes.value = []
        this_audio_cue_tracks.value = []
        player_model_cue.value = false
      } else {
        index_num = index_num <= 0 ? 1 : index_num
        this_audio_cue_track_current_no.value = index_num
        this_audio_cue_track_current_indexes.value = media_file.cue_tracks[index_num - 1].INDEXES
        ///
        player_model_cue.value = true
      }
    } else {
      this_audio_cue_track_current_no.value = 0
      this_audio_cue_track_current_indexes.value = []
      this_audio_cue_tracks.value = []
      player_model_cue.value = false
    }
    // normally
    if (!player_model_cue.value) {
      /// load : normally play info
      this_audio_song_name.value = media_file.title ?? ''
      this_audio_album_name.value = media_file.album ?? ''
      this_audio_artist_name.value = media_file.artist ?? ''
      /// clean : cue play info
      this_audio_cue_track_current_no.value = 0
      this_audio_cue_track_current_indexes.value = []
      this_audio_cue_tracks.value = []
      player_model_cue.value = false
    } else {
      index_num = index_num <= 0 ? 1 : index_num
      /// load : cue play info
      this_audio_song_name.value = media_file.cue_tracks[index_num - 1].Title
      if (this_audio_song_name.value.length === 0) {
        this_audio_song_name.value = index_num + ':' + media_file.title
      }
      this_audio_artist_name.value = media_file.cue_tracks[index_num - 1].Performer
      this_audio_album_name.value = media_file.title
      /// load : cue play init
      this_audio_cue_track_current_no.value = index_num
      this_audio_cue_track_current_indexes.value = media_file.cue_tracks[index_num - 1].INDEXES
      ///
      player_model_cue.value = true
    }
    this_audio_play_id.value = media_file.play_id ?? media_file.id ?? ''
    this_audio_file_path.value = media_file.path ?? ''
    this_audio_song_encoding_format.value = media_file.encoding_format ?? ''
    this_audio_song_suffix.value = media_file.suffix ?? ''
    this_audio_file_medium_image_url.value = media_file.medium_image_url ?? error_album
    this_audio_artist_id.value = media_file.artist_id ?? ''
    this_audio_song_id.value = media_file.id ?? ''
    this_audio_song_rating.value = media_file.rating ?? 0
    this_audio_song_favorite.value = media_file.favorite ?? false
    this_audio_album_id.value = media_file.album_id ?? ''
    this_audio_Index_of_play_list.value = index_num != undefined ? index_num : 0
    //
    store_player_tag_modify.player_current_media_starred = media_file.favorite ?? false
    store_player_tag_modify.player_current_media_playCount = media_file.play_count ?? 0
    store_player_tag_modify.player_current_media_playDate = media_file.play_date ?? ''
    ///
    await update_current_lyrics(media_file)
  }

  async function update_current_lyrics(media_file: Media_File) {
    ///
    if (store_server_user_model.model_server_type_of_web) {
      if (store_server_users.server_select_kind === 'ninesong') {
        const retrieval = new Retrieval_ApiService_of_NineSong(store_server_login_info.server_url)
        if (!player_model_cue.value) {
          const lyrics = await retrieval.getLyrics_id(media_file.id)
          if (lyrics != undefined && lyrics.length > 0) {
            await set_lyric(lyrics)
          } else {
            const lyrics_search = await retrieval.getLyrics_filter(
              media_file.artist,
              media_file.title,
              ''
            )
            if (lyrics_search != undefined && lyrics_search.length > 0) {
              await set_lyric(lyrics_search)
            } else {
              await set_lyric('')
            }
          }
        } else {
          const lyrics_search = await retrieval.getLyrics_filter(
            this_audio_artist_name.value,
            this_audio_song_name.value,
            ''
          )
          if (lyrics_search != undefined && lyrics_search.length > 0) {
            await set_lyric(lyrics_search)
          } else {
            await set_lyric('')
          }
        }
      } else if (
        store_server_users.server_select_kind === 'jellyfin' ||
        store_server_users.server_select_kind === 'emby'
      ) {
        try {
          const audio_ApiService_of_Je = new Audio_ApiService_of_Je(
            store_server_users.server_config_of_current_user_of_sqlite?.url
          )
          let lyrics = []
          try {
            if (store_server_users.server_select_kind === 'jellyfin') {
              const getAudio_lyrics_id_of_Je =
                await audio_ApiService_of_Je.getAudio_lyrics_id_of_Je(media_file.id)
              lyrics = getAudio_lyrics_id_of_Je?.Lyrics
                ? convertToLRC_Array_of_Je(getAudio_lyrics_id_of_Je.Lyrics)
                : ''
            } else if (store_server_users.server_select_kind === 'emby') {
              const getAudio_lyrics_id_of_Em =
                await audio_ApiService_of_Je.getAudio_lyrics_id_of_Em(
                  media_file.id,
                  media_file.lyrics
                )
              lyrics = getAudio_lyrics_id_of_Em?.Lyrics || ''
            }
          } catch (error) {
            console.error('Failed to fetch lyrics:', error)
            lyrics = ''
          }
          await set_lyric(lyrics.length > 0 ? lyrics : '')
        } catch {
          await set_lyric(media_file.lyrics)
        }
      } else if (store_server_users.server_select_kind === 'navidrome') {
        await set_lyric(media_file.lyrics)
      }
    } else if (store_server_user_model.model_server_type_of_local) {
      await set_lyric(media_file.lyrics)
    }
  }

  function convertToLRC_Array_of_Je(
    lyrics: {
      Text: string
      Start: number
    }[]
  ): string {
    const SCALE_FACTOR = 0.0000001
    const lrcLines = lyrics
      .map((item) => {
        const totalSeconds = item.Start * SCALE_FACTOR
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = Math.floor(totalSeconds % 60)
        const centiseconds = Math.floor((totalSeconds * 100) % 100)
        const time = `[${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}]`
        return `${time}${item.Text}`
      })
      .join('\n')
    return `${lrcLines}`
  }

  async function reset_data() {
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
      this_audio_song_favorite.value = false
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

  async function set_lyric(newValue: string) {
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
    ////// split lyrics
    this_audio_lyrics_info_line_font.value = []
    for (let i = 0; i < this_audio_lyrics_info_line_num.value; i++) {
      this_audio_lyrics_info_line_font.value.push('')
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
    //////
    this_audio_lyrics_info_byte_model.value = false
    if (
      this_audio_lyrics_info_line_font.value &&
      this_audio_lyrics_info_line_font.value.length > 0
    ) {
      this_audio_lyrics_info_line_font.value.forEach((element, index) => {
        const timeFontMatches = element.match(/<(\d+,\d+,\d+)>([^<]+)/g)
        if (timeFontMatches) {
          this_audio_lyrics_info_byte_time.value[index] = []
          this_audio_lyrics_info_byte_font.value[index] = []
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

            this_audio_lyrics_info_byte_time.value[index].push(`${startMs},${durationMs}`)
            this_audio_lyrics_info_byte_font.value[index].push(timeFontPairs[i][1])
          }

          this_audio_lyrics_info_byte_model.value = true
          /// temp
          this_audio_lyrics_info_line_font.value[index] =
            this_audio_lyrics_info_byte_font.value[index].join('')
          ///
        }
      })
    }
    ///
    for (let i = 0; i < this_audio_lyrics_info_line_num.value; i++) {
      this_audio_lyrics_info_line_font.value.push('')
    }
    ////// split time of line
    this_audio_lyrics_info_line_time.value = []
    for (let i = 0; i < line_times.length; i++) {
      const [minutes, seconds] = line_times[i].split(':')
      this_audio_lyrics_info_line_time.value[i] =
        (parseInt(minutes) * 60 + parseInt(seconds)) * 1000
    }
    this_audio_lyrics_loaded_complete.value = true
  }

  async function set_carousel_index() {
    const playlistStore = usePlaylistStore()
    const index = playlistStore.playlist_MediaFiles_temporary_carousel.value.findIndex(
      (item) => item.path === this_audio_file_path.value
    )
    this_audio_Index_of_play_list_carousel.value = index != -1 ? index : 0
  }

  // 监听器
  watch(
    () => this_audio_file_path.value,
    (newValue) => {
      if (newValue != undefined && newValue != 'undefined' && newValue.length > 0) {
        console.log('this_audio_file_path：' + newValue)

        store_player_tag_modify.player_current_media_id = this_audio_song_id.value
        store_player_tag_modify.player_current_media_path = this_audio_file_path.value

        if (
          store_view_media_page_info.media_Files_temporary != undefined &&
          store_view_media_page_info.media_Files_temporary.length != 0
        ) {
          if (!store_system_configs_load.app_configs_loading) {
            this_audio_restart_play.value = true
          }
          const playerAppearanceStore = usePlayerAppearanceStore()
          if (!playerAppearanceStore.player_mode_of_lock_playlist) {
            if (!store_system_configs_load.app_configs_loading) {
              const playlistStore = usePlaylistStore()
              if (!playlistStore.playlist_show.value) {
                if (playlistStore.media_page_handleItemDbClick.value) {
                  if (!store_server_user_model.random_play_model) {
                    store_general_fetch_player_list.fetchData_PlayList(false)
                  }
                }
              }
            }
          }
        }
        store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
          item.playing = item.id === this_audio_song_id.value
        })
        const playlistStore = usePlaylistStore()
        playlistStore.playlist_MediaFiles_temporary.value.forEach((item: any, index: number) => {
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

        //
        set_carousel_index()
      }
    }
  )

  watch(
    () => this_audio_file_medium_image_url.value,
    async (newValue) => {
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
    }
  )

  watch(
    () => this_audio_song_id.value,
    (newValue) => {
      console.log('this_audio_song_id：' + newValue)
    }
  )

  watch(
    () => this_audio_song_rating.value,
    (newValue) => {
      console.log('this_audio_song_rating：' + newValue)

      store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
        if (item.id === this_audio_song_id.value) item.rating = this_audio_song_rating.value
      })
    }
  )

  watch(
    () => this_audio_song_favorite.value,
    (newValue) => {
      console.log('this_audio_song_favorite：' + newValue)

      store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
        if (item.id === this_audio_song_id.value) item.favorite = this_audio_song_favorite.value
      })
    }
  )

  watch(
    () => this_audio_album_name.value,
    (newValue) => {
      console.log('this_audio_album_name：' + newValue)

      page_top_album_name.value = newValue
    }
  )

  watch(
    () => this_audio_album_id.value,
    (newValue) => {
      console.log('this_audio_album_id：' + newValue)

      page_top_album_id.value = newValue
      store_local_data_set_albumInfo.Set_AlbumInfo_To_PlayCount_of_Album(newValue)

      if (store_server_user_model.model_server_type_of_local) {
        const get_LocalSqlite_AnnotationInfo = new Get_LocalSqlite_AnnotationInfo()
        store_view_album_page_info.album_recently_count =
          get_LocalSqlite_AnnotationInfo.Get_Annotation_ItemInfo_Play_Count('album')
        store_view_album_page_logic.page_albumlists_statistic.forEach((item: any) => {
          if (item.id === 'album_list_recently') {
            item.song_count = store_view_album_page_info.album_recently_count + ' *'
          }
        })
        boolHandleItemClick_Played.value = true
      } else {
      }
    }
  )

  watch(
    () => this_audio_artist_id.value,
    (newValue) => {
      store_local_data_set_artistInfo.Set_ArtistInfo_To_PlayCount_of_Artist(
        this_audio_artist_id.value
      )
      if (store_server_user_model.model_server_type_of_local) {
        const get_LocalSqlite_AnnotationInfo = new Get_LocalSqlite_AnnotationInfo()
        store_view_artist_page_info.artist_recently_count =
          get_LocalSqlite_AnnotationInfo.Get_Annotation_ItemInfo_Play_Count('artist')
        boolHandleItemClick_Played.value = true
      }
    }
  )

  watch(
    () => this_audio_Index_of_play_list.value,
    () => {
      const playlistStore = usePlaylistStore()
      playlistStore.reset_carousel()
    }
  )

  watch(
    () => player_select.value,
    async () => {
      await reset_data()
      if (isElectron) {
        if (player_select.value === 'mpv') {
          // init
          if (player.value.howl != null) {
            player.value.howl.unload()
          }
          await ipcRenderer.invoke('mpv-init')
          player.value = null as any
          player.value = new Audio_node_mpv()
          // load device
          player_device_kind.value = []
        } else if (player_select.value === 'web') {
          // init
          player.value = null as any
          player.value = new Audio_howler()
          //
          await ipcRenderer.invoke('mpv-quit')
          // load device
          player_device_kind.value = []
          await player.value.getDevices()
        }
      } else {
        // other
      }

      store_system_configs_save.save_system_config_of_App_Configs()
    }
  )

  watch(
    () => player_device_select.value,
    () => {
      if (player_select.value === 'web') {
        if (player_device_select.value != undefined && player_device_select.value.length > 0) {
          if (player.value.howl != null) {
            const audioElement = player.value.howl._sounds[0]._node
            if (typeof audioElement.setSinkId === 'function') {
              audioElement
                .setSinkId(player_device_select.value)
                .then(async () => {
                  await player.value.getDevices()
                  console.log('Audio output successfully redirected.')
                })
                .catch((error) => {
                  console.error('Failed to redirect audio output:', error)
                  player_device_select.value = 'default'
                })
            }
          }
        }
      }
      store_system_configs_save.save_system_config_of_App_Configs()
    }
  )

  watch(
    () => player_fade_value.value,
    () => {
      store_system_configs_save.save_system_config_of_App_Configs()
    }
  )

  watch(
    () => player_dolby.value,
    () => {
      store_system_configs_save.save_system_config_of_App_Configs()
    }
  )

  watch(
    () => player_audio_channel.value,
    () => {
      store_system_configs_save.save_system_config_of_App_Configs()
    }
  )

  watch(
    () => player_samp_value.value,
    () => {
      store_system_configs_save.save_system_config_of_App_Configs()
    }
  )

  watch(
    () => player_gaplessAudio.value,
    () => {
      store_system_configs_save.save_system_config_of_App_Configs()
    }
  )

  watch(
    () => player_audioExclusiveMode.value,
    () => {
      store_system_configs_save.save_system_config_of_App_Configs()
    }
  )

  watch(
    () => player_replayGainMode.value,
    () => {
      store_system_configs_save.save_system_config_of_App_Configs()
    }
  )

  watch(
    () => player_replayGainPreamp.value,
    () => {
      store_system_configs_save.save_system_config_of_App_Configs()
    }
  )

  watch(
    () => player_replayGainClip.value,
    () => {
      store_system_configs_save.save_system_config_of_App_Configs()
    }
  )

  watch(
    () => player_replayGainFallback.value,
    () => {
      store_system_configs_save.save_system_config_of_App_Configs()
    }
  )

  watch(
    () => player_mpvExtraParameters.value,
    () => {
      store_system_configs_save.save_system_config_of_App_Configs()
    }
  )

  watch(
    () => play_order.value,
    (newValue) => {
      if (newValue && newValue.length > 0) {
        store_system_configs_save.save_system_config_of_Player_Configs_of_UI()
      }
    }
  )

  watch(
    () => player_save_new_data.value,
    () => {
      store_system_configs_save.save_system_config_of_Player_Configs_of_Audio_Info()
      player_save_new_data.value = false
    }
  )

  watch(
    () => player_slider_currentTime_added_value.value,
    (newValue) => {
      player_slider_currentTime_added_value.value = newValue
      console.log('player_slider_currentTime_added_value：' + newValue)
    }
  )

  watch(
    () => player_go_lyric_line_index_of_audio_play_progress.value,
    (newValue) => {
      player_go_lyric_line_index_of_audio_play_progress.value = newValue
      console.log('get_play_go_index_time：' + newValue)
    }
  )

  watch(
    () => drawer_order_show.value,
    (newValue) => {
      orderToolShow.value = !drawer_order_show.value
    }
  )

  watch(
    () => drawer_volume_show.value,
    (newValue) => {
      voiceToolShow.value = !drawer_volume_show.value
    }
  )

  // 返回状态和方法
  return {
    // 音频信息状态
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

    // 音频逻辑状态
    player,
    player_state_play_click,
    player_state_skip_back_click,
    player_state_skip_forward_click,
    player_init_play,
    player_kind,
    player_select,
    player_device_kind,
    player_device_select,
    player_model_cue,
    play_order,
    play_volume,
    player_fade_value,
    player_dolby,
    player_audio_channel,
    player_samp_value,
    player_gaplessAudio,
    player_audioExclusiveMode,
    player_replayGainMode,
    player_replayGainPreamp,
    player_replayGainClip,
    player_replayGainFallback,
    player_mpvExtraParameters,
    player_is_play_ended,
    player_range_duration_isDragging,
    player_click_state_of_order,
    player_click_state_of_play_skip_back,
    player_click_state_of_play,
    player_click_state_of_play_skip_forward,
    total_play_time,
    current_play_time,
    slider_init_singleValue,
    slider_singleValue,
    marks_slider_singleValue,
    player_no_progress_jump,
    player_back_ChevronDouble,
    player_slider_click,
    player_slider_currentTime_added_value,
    player_go_lyric_line_index_of_audio_play_progress,
    player_save_new_data,
    this_audio_initial_trigger,
    drawer_order_show,
    drawer_order_height,
    drawer_volume_show,
    drawer_theme_show,
    orderToolShow,
    voiceToolShow,
    langWidths,
    orderPanelWidath,
    orderButonWidath,
    boolHandleItemClick_Favorite,
    boolHandleItemClick_Played,

    // 计算属性
    player_lyric_fontSizeComputed,

    // 方法
    init_player,
    formatTime,
    formatStrTime,
    formatTime_RunTimeTicks,
    play_go_duration,
    update_current_media_info,
    update_current_lyrics,
    convertToLRC_Array_of_Je,
    reset_data,
    set_lyric,
    set_carousel_index,
  }
})
