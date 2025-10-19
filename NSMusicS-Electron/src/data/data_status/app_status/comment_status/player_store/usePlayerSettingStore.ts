import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
import { Audio_node_mpv } from '@/data/data_models/app_models/song_Audio_Out/Audio_node_mpv'
import { Audio_howler } from '@/data/data_models/app_models/song_Audio_Out/Audio_howler'
import { usePlayerAudioStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAudioStore'
import { store_player_view } from '@/views/view_app/page/page_player/store/store_player_view'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { store_player_tag_modify } from '@/views/view_app/page/page_player/store/store_player_tag_modify'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import error_album from '@/assets/img/error_album.jpg'
import { Audio_ApiService_of_Je } from '@/data/data_configs/jellyfin_api/services_web/Audio/index_service'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { Retrieval_ApiService_of_NineSong } from '@/data/data_configs/ninesong_api/services_web/Scene/Music/Retrieval/index_service'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'

export const usePlayerSettingStore = defineStore('playerSetting', () => {
  // Player instance and state
  const player = ref(new Audio_howler())
  const player_state_play_click = ref(false)
  const player_state_skip_back_click = ref(false)
  const player_state_skip_forward_click = ref(false)
  const player_init_play = ref(false)
  
  // Player configuration
  const player_kind = ref([
    { label: 'mpv', value: 'mpv' },
    { label: 'web', value: 'web' },
  ])
  const player_select = ref('web')
  const player_device_kind = ref<string[]>([])
  const player_device_select = ref('default')
  const player_model_cue = ref(false)
  
  // Playback settings
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
  
  // Player state flags
  const player_is_play_ended = ref(false)
  const player_range_duration_isDragging = ref(false)
  const player_click_state_of_order = ref(false)
  const player_click_state_of_play_skip_back = ref(false)
  const player_click_state_of_play = ref(false)
  const player_click_state_of_play_skip_forward = ref(false)
  
  // Time tracking
  const total_play_time = ref('04:42')
  const current_play_time = ref('01:36')
  const slider_init_singleValue = ref(0)
  const slider_singleValue = ref(0)
  const marks_slider_singleValue = ref<Record<string, any>>({})
  const player_no_progress_jump = ref(true)
  
  // UI state
  const player_back_ChevronDouble = ref('')
  const player_slider_click = ref(false)
  const player_slider_currentTime_added_value = ref(0)
  const player_go_lyric_line_index_of_audio_play_progress = ref(0)
  const player_save_new_data = ref(false)
  const this_audio_initial_trigger = ref(false)
  
  // Drawer state
  const drawer_order_show = ref(false)
  const drawer_order_height = ref(160)
  const drawer_volume_show = ref(false)
  const drawer_theme_show = ref(false)
  
  // UI dimensions
  const orderToolShow = ref(true)
  const voiceToolShow = ref(true)
  const langWidths = {
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
  }
  const orderPanelWidath = ref('202')
  const orderButonWidath = ref('202')
  
  // Item click states
  const boolHandleItemClick_Favorite = ref(false)
  const boolHandleItemClick_Played = ref(false)

  // Methods
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
      const newTime = (Number(slider_value) / 100) * (await player.value.getDuration())
      if (Number(slider_value) !== 0 && Number(slider_value) !== 100) {
        player.value.setCurrentTime(newTime)
      } else {
        player.value.setCurrentTime(0)
      }
    } else {
      const newTime = Number(slider_value) / 1000
      if (Number(slider_value) !== 0 && Number(slider_value) !== 100) {
        player.value.setCurrentTime(newTime)
      } else {
        player.value.setCurrentTime(0)
      }
    }

    player.value.isPlaying = true
  }

  async function update_current_media_info(media_file: any, index: any) {
    const cue_page_play = typeof index != 'number'
    let index_num = !cue_page_play ? index : index != undefined ? Number(index.split('-')[1]) : 0
    const playerAudioStore = usePlayerAudioStore()
    // cue
    if (cue_page_play) {
      if (index_num === undefined || media_file.cue_tracks === undefined) {
        playerAudioStore.this_audio_cue_track_current_no = 0
        playerAudioStore.this_audio_cue_track_current_indexes = []
        playerAudioStore.this_audio_cue_tracks = []
        player_model_cue.value = false
      } else {
        index_num = index_num <= 0 ? 1 : index_num
        playerAudioStore.this_audio_cue_track_current_no = index_num
        playerAudioStore.this_audio_cue_track_current_indexes = media_file.cue_tracks[index_num - 1].INDEXES
        player_model_cue.value = true
      }
    } else {
      playerAudioStore.this_audio_cue_track_current_no = 0
      playerAudioStore.this_audio_cue_track_current_indexes = []
      playerAudioStore.this_audio_cue_tracks = []
      player_model_cue.value = false
    }
    // normally
    if (!player_model_cue.value) {
      /// load : normally play info
      playerAudioStore.this_audio_song_name = media_file.title ?? ''
      playerAudioStore.this_audio_album_name = media_file.album ?? ''
      playerAudioStore.this_audio_artist_name = media_file.artist ?? ''
      /// clean : cue play info
      playerAudioStore.this_audio_cue_track_current_no = 0
      playerAudioStore.this_audio_cue_track_current_indexes = []
      playerAudioStore.this_audio_cue_tracks = []
      player_model_cue.value = false
    } else {
      index_num = index_num <= 0 ? 1 : index_num
      /// load : cue play info
      playerAudioStore.this_audio_song_name = media_file.cue_tracks[index_num - 1].Title
      if (playerAudioStore.this_audio_song_name.length === 0) {
        playerAudioStore.this_audio_song_name = index_num + ':' + media_file.title
      }
      playerAudioStore.this_audio_artist_name = media_file.cue_tracks[index_num - 1].Performer
      playerAudioStore.this_audio_album_name = media_file.title
      /// load : cue play init
      playerAudioStore.this_audio_cue_track_current_no = index_num
      playerAudioStore.this_audio_cue_track_current_indexes = media_file.cue_tracks[index_num - 1].INDEXES
      player_model_cue.value = true
    }
    playerAudioStore.this_audio_play_id = media_file.play_id ?? media_file.id ?? ''
    playerAudioStore.this_audio_file_path = media_file.path ?? ''
    playerAudioStore.this_audio_song_encoding_format = media_file.encoding_format ?? ''
    playerAudioStore.this_audio_song_suffix = media_file.suffix ?? ''
    playerAudioStore.this_audio_file_medium_image_url = media_file.medium_image_url ?? error_album
    playerAudioStore.this_audio_artist_id = media_file.artist_id ?? ''
    playerAudioStore.this_audio_song_id = media_file.id ?? ''
    playerAudioStore.this_audio_song_rating = media_file.rating ?? 0
    playerAudioStore.this_audio_song_favorite = media_file.favorite ?? false
    playerAudioStore.this_audio_album_id = media_file.album_id ?? ''
    playerAudioStore.this_audio_Index_of_play_list = index_num != undefined ? index_num : 0
    //
    store_player_tag_modify.player_current_media_starred = media_file.favorite ?? false
    store_player_tag_modify.player_current_media_playCount = media_file.play_count ?? 0
    store_player_tag_modify.player_current_media_playDate = media_file.play_date ?? ''
    ///
    await update_current_lyrics(media_file)
  }

  async function update_current_lyrics(media_file: any) {
    const playerAudioStore = usePlayerAudioStore()
    if (store_server_user_model.model_server_type_of_web) {
      if (store_server_users.server_select_kind === 'ninesong') {
        const retrieval = new Retrieval_ApiService_of_NineSong(store_server_login_info.server_url)
        if (!player_model_cue.value) {
          const lyrics = await retrieval.getLyrics_id(media_file.id)
          if (lyrics != undefined && lyrics.length > 0) {
            await playerAudioStore.set_lyric(lyrics)
          } else {
            const lyrics_search = await retrieval.getLyrics_filter(
              media_file.artist,
              media_file.title,
              ''
            )
            if (lyrics_search != undefined && lyrics_search.length > 0) {
              await playerAudioStore.set_lyric(lyrics_search)
            } else {
              await playerAudioStore.set_lyric('')
            }
          }
        } else {
          const lyrics_search = await retrieval.getLyrics_filter(
            playerAudioStore.this_audio_artist_name,
            playerAudioStore.this_audio_song_name,
            ''
          )
          if (lyrics_search != undefined && lyrics_search.length > 0) {
            await playerAudioStore.set_lyric(lyrics_search)
          } else {
            await playerAudioStore.set_lyric('')
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
              const getAudio_lyrics_id_of_Je = await audio_ApiService_of_Je.getAudio_lyrics_id_of_Je(media_file.id)
              lyrics = getAudio_lyrics_id_of_Je?.Lyrics
                ? [convertToLRC_Array_of_Je(getAudio_lyrics_id_of_Je.Lyrics)]
                : []
            } else if (store_server_users.server_select_kind === 'emby') {
              const getAudio_lyrics_id_of_Em = await audio_ApiService_of_Je.getAudio_lyrics_id_of_Em(
                media_file.id,
                media_file.lyrics
              )
              lyrics = getAudio_lyrics_id_of_Em?.Lyrics || []
            }
          } catch (error) {
            console.error('Failed to fetch lyrics:', error)
            lyrics = []
          }
          await playerAudioStore.set_lyric(lyrics.length > 0 ? lyrics : '')
        } catch {
          await playerAudioStore.set_lyric(media_file.lyrics)
        }
      } else if (store_server_users.server_select_kind === 'navidrome') {
        await playerAudioStore.set_lyric(media_file.lyrics)
      }
    } else if (store_server_user_model.model_server_type_of_local) {
      await playerAudioStore.set_lyric(media_file.lyrics)
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

  // Watchers
  watch(player_select, async (newValue) => {
    const playerAudioStore = usePlayerAudioStore()
    await playerAudioStore.reset_data()
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
  })

  watch(player_device_select, (newValue) => {
    if (player_select.value === 'web') {
      if (
        player_device_select.value != undefined &&
        player_device_select.value.length > 0
      ) {
        if (player.value.howl != null) {
          const audioElement = player.value.howl._sounds[0]._node
          if (typeof audioElement.setSinkId === 'function') {
            audioElement
              .setSinkId(player_device_select.value)
              .then(async () => {
                await player.value.getDevices()
                console.log('Audio output successfully redirected.')
              })
              .catch((error: Error) => {
                console.error('Failed to redirect audio output:', error)
                player_device_select.value = 'default'
              })
          }
        }
      }
    }
    store_system_configs_save.save_system_config_of_App_Configs()
  })

  // Config watchers
  const configProperties = [
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
    player_mpvExtraParameters
  ]

  configProperties.forEach(prop => {
    watch(prop, () => {
      store_system_configs_save.save_system_config_of_App_Configs()
    })
  })

  watch(play_order, (newValue) => {
    if (newValue && newValue.length > 0) {
      store_system_configs_save.save_system_config_of_Player_Configs_of_UI()
    }
  })

  watch(player_save_new_data, (newValue) => {
    store_system_configs_save.save_system_config_of_Player_Configs_of_Audio_Info()
    player_save_new_data.value = false
  })

  watch(player_slider_currentTime_added_value, (newValue) => {
    player_slider_currentTime_added_value.value = newValue
    console.log('player_slider_currentTime_added_value：' + newValue)
  })

  watch(player_go_lyric_line_index_of_audio_play_progress, (newValue) => {
    player_go_lyric_line_index_of_audio_play_progress.value = newValue
    console.log('get_play_go_index_time：' + newValue)
  })

  watch(drawer_order_show, (newValue) => {
    orderToolShow.value = !drawer_order_show.value
  })

  watch(drawer_volume_show, (newValue) => {
    voiceToolShow.value = !drawer_volume_show.value
  })

  // Return store properties and methods
  return {
    // Player instance and state
    player,
    player_state_play_click,
    player_state_skip_back_click,
    player_state_skip_forward_click,
    player_init_play,
    
    // Player configuration
    player_kind,
    player_select,
    player_device_kind,
    player_device_select,
    player_model_cue,
    
    // Playback settings
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
    
    // Player state flags
    player_is_play_ended,
    player_range_duration_isDragging,
    player_click_state_of_order,
    player_click_state_of_play_skip_back,
    player_click_state_of_play,
    player_click_state_of_play_skip_forward,
    
    // Time tracking
    total_play_time,
    current_play_time,
    slider_init_singleValue,
    slider_singleValue,
    marks_slider_singleValue,
    player_no_progress_jump,
    
    // UI state
    player_back_ChevronDouble,
    player_slider_click,
    player_slider_currentTime_added_value,
    player_go_lyric_line_index_of_audio_play_progress,
    player_save_new_data,
    this_audio_initial_trigger,
    
    // Drawer state
    drawer_order_show,
    drawer_order_height,
    drawer_volume_show,
    drawer_theme_show,
    
    // UI dimensions
    orderToolShow,
    voiceToolShow,
    langWidths,
    orderPanelWidath,
    orderButonWidath,
    
    // Item click states
    boolHandleItemClick_Favorite,
    boolHandleItemClick_Played,
    
    // Methods
    init_player,
    formatTime,
    formatStrTime,
    formatTime_RunTimeTicks,
    play_go_duration,
    update_current_media_info,
    update_current_lyrics,
    convertToLRC_Array_of_Je
  }
})