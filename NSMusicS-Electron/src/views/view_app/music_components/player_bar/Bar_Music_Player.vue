<script setup lang="ts">
////// this_view resource of icons_svg
import {
  Heart24Regular,
  Heart28Filled,
  MoreCircle32Regular,
  ArrowRepeatAll16Regular,
  ArrowAutofitDown24Regular,
  TopSpeed20Regular,
  DeviceEq24Filled,
  Tag16Regular,
  Settings24Regular,
} from '@vicons/fluent'
import { RepeatOneRound, QueueMusicRound } from '@vicons/material'
import { Play, Pause, PlayBack, PlayForward, VolumeMedium, PlaySkipBack, PlaySkipForward} from '@vicons/ionicons5'
import { Random } from '@vicons/fa'
import { NButton, NIcon, NSlider, NSpace, NText, useThemeVars } from 'naive-ui'

////// this_view views_components of navie_ui
import { onMounted, ref, watch, inject, provide } from 'vue'
import { onBeforeUnmount } from 'vue'
const get_playerbar_to_switch_playerview = inject('get_playerbar_to_switch_playerview')

import { useI18n } from 'vue-i18n'
import { store_server_data_set_mediaInfo } from '@/data/data_stores/server/server_api_synchronization/store_server_data_set_mediaInfo'
import { store_server_data_set_albumInfo } from '@/data/data_stores/server/server_api_synchronization/store_server_data_set_albumInfo'
import { store_server_data_set_artistInfo } from '@/data/data_stores/server/server_api_synchronization/store_server_data_set_artistInfo'
import { store_view_media_page_info } from '@/views/view_app/music_page/page_media/store/store_view_media_page_info'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
const { t } = useI18n({
  inheritLocale: true,
})

import { useMessage } from 'naive-ui'
const message = useMessage()
const themeVars = useThemeVars()

//////
function getAssetImage(firstImage: string) {
  return new URL(firstImage, import.meta.url).href
}
import error_album from '@/assets/img/error_album.jpg'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
const handleImageError = async (event) => {
  const originalSrc = event.target.src
  let result_src = error_album
  if (isElectron) {
    try {
      const newImagePath = await ipcRenderer.invoke('window-get-imagePath', originalSrc)
      if (newImagePath.length > 0) {
        event.target.src = newImagePath
      } else {
        event.target.src = result_src
      }
    } catch (error) {
      console.error('Error handling image error:', error)
      event.target.src = result_src
    }
    ///
    const item: Media_File | undefined = store_view_media_page_info.media_Files_temporary.find(
      (mediaFile: Media_File) => mediaFile.id === store_player_audio_info.this_audio_song_id
    )
    if (item != undefined && item != 'undefined') {
      item.medium_image_url = result_src
    }
    store_player_audio_info.page_top_album_image_url = result_src
  } else {
    store_player_audio_info.page_top_album_image_url = error_album
  }
}
import { debounce } from 'lodash'
import { store_player_audio_logic } from '@/views/view_app/music_page/page_player/store/store_player_audio_logic'

////// open view musicplayer
import shrink_up_arrow from '@/assets/svg/shrink_up_arrow.svg'
import shrink_down_arrow from '@/assets/svg/shrink_down_arrow.svg'
const player_show_hight_animation_value = ref(670)
const back_display = ref('none')
const back_filter_blurValue = ref(0)
const hover_back_img = () => {
  back_display.value = 'block'
  back_filter_blurValue.value = 3
}
const leave_back_svg = () => {
  back_display.value = 'none'
  back_filter_blurValue.value = 0
}
const click_back_svg = () => {
  if (store_player_appearance.player_show_complete) {
    player_show_hight_animation_value.value =
      player_show_hight_animation_value.value === 0 ? 670 : 0
    get_playerbar_to_switch_playerview(player_show_hight_animation_value.value)
    store_player_audio_logic.player_back_ChevronDouble =
      player_show_hight_animation_value.value === 0 ? shrink_down_arrow : shrink_up_arrow
  }
  store_playlist_list_info.reset_carousel()
}
watch(
  () => store_player_appearance.player_show_click,
  (newValue) => {
    if (newValue) {
      player_show_hight_animation_value.value = 670
      get_playerbar_to_switch_playerview(player_show_hight_animation_value.value)
      store_player_audio_logic.player_back_ChevronDouble =
        player_show_hight_animation_value.value === 0 ? shrink_down_arrow : shrink_up_arrow

      store_player_appearance.player_show_click = false
    }
  }
)

////// audio_player
const timer_this_audio_restart_play = ref()
const lastTriggerValue = ref(null) // 延迟触发：接收大量数据时，仅触发最后一个值
watch(
  () => store_player_audio_info.this_audio_restart_play,
  (newValue) => {
    if (newValue) {
      lastTriggerValue.value = newValue // 更新最后一个触发的值
      clearTimeout(timer_this_audio_restart_play.value)
      // 延迟触发
      timer_this_audio_restart_play.value = setTimeout(() => {
        if (newValue === lastTriggerValue.value) {
          // 检查最后一个触发的值是否与当前触发的值相等
          handleAudioFilePathChange()
          store_player_audio_info.this_audio_restart_play = false
        }
      }, 200)
    }
  }
)
const handleAudioFilePathChange = async () => {
  if (store_player_audio_logic.this_audio_initial_trigger) {
    store_player_audio_logic.current_play_time = store_player_audio_logic.formatTime(
      await store_player_audio_logic.player.getDuration()
    )
    store_player_audio_logic.player_slider_currentTime_added_value = 0
    this_audio_buffer_file.value = null
    store_player_audio_logic.player_no_progress_jump = false
    store_player_audio_logic.player.isPlaying = false

    await Init_Audio_Player()
  }
  store_player_audio_logic.this_audio_initial_trigger = true
}
const this_audio_buffer_file = ref()
const timer_this_audio_player = ref() // 延迟触发：接收大量数据时，仅触发最后一个值
import { Howl } from '@/utils/howler/howlerLoader'
import { clearCache } from '@/utils/electron/webFrame'
import { store_playlist_list_info } from '@/views/view_app/music_components/player_list/store/store_playlist_list_info'
watch(
  () => this_audio_buffer_file.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      Play_This_Audio_Path()
    }
    clearCache()
  }
)
const Play_This_Audio_Path = () => {
  clearTimeout(timer_this_audio_player.value)
  timer_this_audio_player.value = setTimeout(async () => {
    if (store_player_audio_info.this_audio_file_path.length > 0) {
      store_player_audio_logic.player_slider_currentTime_added_value = 0
      if (store_player_audio_logic.player_select === 'mpv') {
        if (store_player_audio_logic.player === null) {
          store_player_audio_logic.player = new Audio_node_mpv()
        }
        const audio_url =
          store_player_audio_info.this_audio_file_path.indexOf('play_component_type') >= 0
            ? store_player_audio_info.this_audio_file_path
            : store_server_user_model.model_server_type_of_web &&
                store_server_users.server_select_kind === 'ninesong'
              ? store_player_audio_info.this_audio_file_path +
                '&play_component_type=' +
                store_player_audio_logic.player_select
              : store_player_audio_info.this_audio_file_path
        if (store_server_user_model.model_server_type_of_web) {
          if (store_server_users.server_select_kind === 'ninesong') {
            if (store_player_audio_info.this_audio_song_suffix === 'm4a') {
              if (store_player_audio_info.this_audio_song_encoding_format === 'alac') {
                if (store_player_audio_logic.player_select === 'web') {
                  message.success(t('setting.transcode'), { duration: 10000 })
                }
              }
            }
          }
        }
        await store_player_audio_logic.player.load(audio_url)
      } else if (store_player_audio_logic.player_select === 'web') {
        await init_player_howler()
      }
      store_player_audio_logic.player.isPlaying = true
      store_player_audio_logic.player_save_new_data = true
      store_player_audio_logic.player_is_play_ended = false
      store_player_audio_logic.player_no_progress_jump = true
      //
      clearInterval(timer)
      timer = setInterval(synchronize_playback_time, 200)
      await store_player_audio_logic.player.setVolume(Number(store_player_audio_logic.play_volume))
      await store_player_audio_logic.player.play()
      if (!store_player_audio_logic.player_model_cue) {
        if (
          store_player_audio_logic.slider_init_singleValue != 0 &&
          store_player_audio_logic.player_init_play
        ) {
          if (store_player_audio_logic.player_select === 'mpv') {
            store_player_audio_logic.play_go_duration(
              store_player_audio_logic.slider_init_singleValue,
              true
            )
            store_player_audio_logic.slider_init_singleValue = 0
          }
        } else {
          // init play logic
          store_player_audio_logic.slider_init_singleValue = 0
          store_player_audio_logic.play_go_duration(
            store_player_audio_logic.slider_init_singleValue,
            true
          )
        }
      } else {
        if (store_player_audio_info.this_audio_cue_track_current_indexes.length > 0) {
          const track_str = store_player_audio_info.this_audio_cue_track_current_indexes[0].TIME
          if (track_str.length > 0) {
            const track_time = store_player_audio_logic.formatStrTime(track_str)
            store_player_audio_logic.player.setCurrentTime(track_time / 1000)
          }
        }
      }
      Set_MediaInfo_To_PlayCount()
    }
  }, 400)
}
const init_player_howler = async () => {
  if (store_player_audio_logic.player.howl != null) {
    await store_player_audio_logic.player.howl.unload()
  }
  let media_kind = ''
  if (store_server_user_model.model_server_type_of_local) {
    media_kind = store_player_audio_info.this_audio_file_path.split('.').pop()
  } else if (store_server_user_model.model_server_type_of_web) {
    media_kind = 'mp3'
  }
  store_player_audio_logic.player = new Audio_howler()
  const audio_url =
    store_player_audio_info.this_audio_file_path.indexOf('play_component_type') >= 0
      ? store_player_audio_info.this_audio_file_path
      : store_server_user_model.model_server_type_of_web &&
          store_server_users.server_select_kind === 'ninesong'
        ? store_player_audio_info.this_audio_file_path +
          '&play_component_type=' +
          store_player_audio_logic.player_select
        : store_player_audio_info.this_audio_file_path
  if (store_server_user_model.model_server_type_of_web) {
    if (store_server_users.server_select_kind === 'ninesong') {
      if (store_player_audio_info.this_audio_song_suffix === 'm4a') {
        if (store_player_audio_info.this_audio_song_encoding_format === 'alac') {
          if (store_player_audio_logic.player_select === 'web') {
            message.success(t('setting.transcode'), { duration: 10000 })
          }
        }
      }
    }
  }
  store_player_audio_logic.player.howl = new Howl({
    src: [audio_url],
    format: store_player_audio_logic.player_dolby ? ['dolby', media_kind] : [],
    autoplay: true,
    html5: true,
    loop: false,
    onplay: async () => {
      store_player_audio_logic.player.howl.fade(
        0,
        Number(store_player_audio_logic.play_volume),
        store_player_audio_logic.player_fade_value
      )
      store_player_audio_logic.player.isPlaying = true
      if (isElectron) {
        await ipcRenderer.invoke('i18n-tray-music-pause', true)
      }

      if (
        store_player_audio_logic.player_device_select != undefined &&
        store_player_audio_logic.player_device_select.length > 0
      ) {
        const audioElement = store_player_audio_logic.player.howl._sounds[0]._node
        if (typeof audioElement.setSinkId === 'function') {
          audioElement
            .setSinkId(store_player_audio_logic.player_device_select)
            .then(async () => {
              await store_player_audio_logic.player.getDevices()
              console.log('Audio output successfully redirected.')
            })
            .catch((error) => {
              console.error('Failed to redirect audio output:', error)
              store_player_audio_logic.player_device_select = 'default'
            })
        }
      }

      if (
        store_player_audio_logic.slider_init_singleValue != 0 &&
        store_player_audio_logic.player_init_play
      ) {
        store_player_audio_logic.play_go_duration(
          store_player_audio_logic.slider_init_singleValue,
          true
        )
        store_player_audio_logic.slider_init_singleValue = 0
        store_player_audio_logic.player.pause()
      }
    },
    onpause: async () => {
      store_player_audio_logic.player.isPlaying = false
      if (isElectron) {
        await ipcRenderer.invoke('i18n-tray-music-pause', false)
      }
    },
    onstop: async () => {
      store_player_audio_logic.player.isPlaying = false
      if (isElectron) {
        await ipcRenderer.invoke('i18n-tray-music-pause', false)
      }
    },
    onend: async () => {
      store_player_audio_logic.player.howl.fade(
        Number(store_player_audio_logic.play_volume),
        0,
        store_player_audio_logic.player_fade_value
      )
      setTimeout(async () => {
        store_player_audio_logic.player.isPlaying = false
        if (store_player_audio_logic.player_no_progress_jump) {
          store_player_audio_logic.current_play_time = store_player_audio_logic.formatTime(
            store_player_audio_logic.player.getDuration()
          )
          store_player_audio_logic.player_slider_currentTime_added_value = 0
          this_audio_buffer_file.value = null
          clearInterval(timer)

          store_player_audio_logic.player_no_progress_jump = false

          store_player_audio_logic.player.isPlaying = false
          store_player_audio_logic.player_is_play_ended = true
        }
        Play_Media_Switching()
      }, store_player_audio_logic.player_fade_value)
    },
    onloaderror: (id: any, error: any) => {
      store_player_audio_logic.player.isPlaying = false
    },
  })
}

const Set_MediaInfo_To_PlayCount = debounce(async (event, args) => {
  /// media、media_cue
  store_local_data_set_mediaInfo.Set_MediaInfo_To_PlayCount_of_Media_File(
    store_player_audio_info.this_audio_song_id
  )
  /// album、artist
  if(store_server_user_model.model_server_type_of_web && store_server_users.server_select_kind === 'ninesong') {
    if (
      store_general_fetch_media_list._album_id != undefined &&
      store_general_fetch_media_list._album_id.length > 0 &&
      store_general_fetch_media_list._album_id === store_player_audio_info.this_audio_album_id
    ) {
      if (
        store_player_audio_info.this_audio_song_id ===
        store_playlist_list_info.playlist_MediaFiles_temporary[
        store_playlist_list_info.playlist_MediaFiles_temporary.length - 1]
      ) {
        store_server_data_set_albumInfo.Set_AlbumInfo_To_PlayCompleteCount_of_Album_Server(
          store_player_audio_info.this_audio_album_id
        )
      }
    }
    if (
      store_general_fetch_media_list._artist_id != undefined &&
      store_general_fetch_media_list._artist_id.length > 0 &&
      store_general_fetch_media_list._artist_id === store_player_audio_info.this_audio_artist_id
    ) {
      if (
        store_player_audio_info.this_audio_song_id ===
        store_playlist_list_info.playlist_MediaFiles_temporary[
        store_playlist_list_info.playlist_MediaFiles_temporary.length - 1]
      ) {
        store_server_data_set_artistInfo.Set_ArtistInfo_To_PlayCompleteCount_of_Artist_Server(
          store_player_audio_info.this_audio_artist_id
        )
      }
    }
  }
  ///
  if (store_server_user_model.model_server_type_of_local) {
    let get_AnnotationInfo_To_LocalSqlite = new Get_AnnotationInfo_To_LocalSqlite()
    store_view_media_page_info.media_recently_count =
      get_AnnotationInfo_To_LocalSqlite.Get_Annotation_ItemInfo_Play_Count('media_file')
    store_view_media_page_logic.page_songlists_statistic.forEach((item: any) => {
      if (item.id === 'song_list_recently') {
        item.song_count = store_view_media_page_info.media_recently_count + ' *'
      }
    })
    store_player_audio_logic.boolHandleItemClick_Played = true
  }
}, 1000)

const handleMpvStopped = debounce(async (event, args) => {
  store_player_audio_logic.player_is_play_ended = true
  let index = store_playlist_list_info.playlist_MediaFiles_temporary.findIndex(
    (item: any) => item.play_id === store_player_audio_info.this_audio_play_id
  )
  let last_play = index >= store_playlist_list_info.playlist_MediaFiles_temporary.length - 1
  if (last_play && store_player_audio_logic.play_order === 'playback-1') {
    await store_player_audio_logic.player.pause()
  } else {
    store_player_audio_logic.player.isPlaying = false
    if (store_player_audio_logic.player_no_progress_jump) {
      store_player_audio_logic.current_play_time = store_player_audio_logic.formatTime(
        store_player_audio_logic.player.getDuration()
      )
      store_player_audio_logic.player_slider_currentTime_added_value = 0
      this_audio_buffer_file.value = null
      clearInterval(timer)

      store_player_audio_logic.player_no_progress_jump = false

      store_player_audio_logic.player.isPlaying = false
    }
    Play_Media_Switching()
  }
}, 300)

if (isElectron) {
  ipcRenderer.on('mpv-stopped', handleMpvStopped)
}
///
onMounted(async () => {
  timer = setInterval(synchronize_playback_time, 200)
  await store_player_audio_logic.player.IsPlaying()
  await store_player_audio_logic.player.setVolume(Number(store_player_audio_logic.play_volume))
})
const Init_Audio_Player = async () => {
  if (store_player_audio_info.this_audio_file_path.length > 0) {
    if (store_player_audio_logic.player_init_play) {
      Play_This_Audio_Path()
      store_player_audio_logic.player_init_play = false
    }
    if (!store_player_audio_logic.player.isPlaying) {
      if (this_audio_buffer_file.value === null) {
        this_audio_buffer_file.value = Math.random().toString(36).substring(7)
      } else {
        store_player_audio_logic.player.isPlaying = true
        if (store_player_audio_logic.player_select === 'mpv') {
          if (!store_player_audio_logic.player.isPlaying) Play_This_Audio_Path()
          else {
            // if(isElectron) {
            //   await ipcRenderer.invoke('mpv-startFadeIn', store_player_audio_logic.play_volume)
            // }
            await store_player_audio_logic.player.play()
          }
        } else if (store_player_audio_logic.player_select === 'web') {
          if (store_player_audio_logic.player.howl == null) Play_This_Audio_Path()
          else {
            store_player_audio_logic.player.howl.fade(
              Number(store_player_audio_logic.play_volume),
              0,
              store_player_audio_logic.player_fade_value
            )
            await store_player_audio_logic.player.play()
          }
        }
      }
    } else {
      store_player_audio_logic.player.isPlaying = false
      if (store_player_audio_logic.player_select === 'mpv') {
        // if(isElectron) {
        //   await ipcRenderer.invoke('mpv-startFadeOut', store_player_audio_logic.play_volume)
        // }
        await store_player_audio_logic.player.pause()
      } else if (store_player_audio_logic.player_select === 'web') {
        store_player_audio_logic.player.howl.fade(
          Number(store_player_audio_logic.play_volume),
          0,
          store_player_audio_logic.player_fade_value
        )
        await store_player_audio_logic.player.pause()
      }
    }
  }
}
//////
if (isElectron) {
  ipcRenderer.on('tray-music-pause', Init_Audio_Player)
  ipcRenderer.on('tray-music-order', (event, order) => {
    store_player_audio_logic.play_order = order
  })
}
watch(
  () => store_player_audio_logic.player_state_play_click,
  (newValue) => {
    Init_Audio_Player()
  }
)
watch(
  () => store_player_audio_logic.player_click_state_of_play_skip_back,
  (newValue) => {
    debounce(async (event, args) => {
      ;(await play_skip_back_click(), 300)
    })
  }
)
watch(
  () => store_player_audio_logic.player_click_state_of_play_skip_forward,
  (newValue) => {
    debounce(async (event, args) => {
      ;(await play_skip_forward_click(), 300)
    })
  }
)
////// Naive UI n-carousel 无法执行 prev与next触发事件，用以下代码修复业务逻辑
const cooldownDebounce = (fn, delay) => {
  let isCooling = false
  return (...args) => {
    if (isCooling) return
    fn(...args)
    isCooling = true
    setTimeout(() => (isCooling = false), delay)
  }
}
watch(
  () => store_player_audio_info.this_audio_Index_of_play_list_carousel,
  cooldownDebounce(async (newValue, oldValue) => {
    if (store_player_audio_info.play_list_carousel_model) {
      const index = store_playlist_list_info.playlist_MediaFiles_temporary_carousel.findIndex(
        (item) => item.path === store_player_audio_info.this_audio_file_path
      )
      if (newValue !== index) {
        if (
          newValue === 0 &&
          oldValue === store_playlist_list_info.playlist_MediaFiles_temporary_carousel.length - 1
        ) {
          await play_skip_forward_click()
        } else if (
          newValue === store_playlist_list_info.playlist_MediaFiles_temporary_carousel.length - 1 &&
          oldValue === 0
        ) {
          await play_skip_back_click()
        } else {
          newValue - oldValue < 0 ? await play_skip_back_click() : await play_skip_forward_click()
        }
      } else {
        newValue === store_playlist_list_info.playlist_MediaFiles_temporary_carousel.length
          ? await play_skip_forward_click()
          : await play_skip_back_click()
      }
    }
  }, 300)
)
////// player_configs player_button order area
import { store_server_user_model } from '@/data/data_stores/server/store_server_user_model'
const backpanel_order_leave = () => {
  if (!store_player_appearance.player_show) {
    // store_player_audio_logic.drawer_order_show = false;
  }
}
const backpanel_order_click = () => {
  const orders = ['playback-1', 'playback-2', 'playback-3', 'playback-4']
  if (!store_player_audio_logic.play_order) {
    store_player_audio_logic.play_order = orders[0]
  } else {
    const currentIndex = orders.indexOf(store_player_audio_logic.play_order)
    const nextIndex = (currentIndex + 1) % orders.length
    store_player_audio_logic.play_order = orders[nextIndex]
  }
  if (isElectron) {
    ipcRenderer.invoke('i18n-tray-music-order', store_player_audio_logic.play_order)
  }
  switch (store_player_audio_logic.play_order) {
    case 'playback-1':
      message.success(t('nsmusics.siderbar_player.playback_1'))
      break
    case 'playback-2':
      message.success(t('nsmusics.siderbar_player.playback_2'))
      break
    case 'playback-3':
      message.success(t('nsmusics.siderbar_player.playback_3'))
      break
    case 'playback-4':
      message.success(t('nsmusics.siderbar_player.playback_4'))
      break
    default:
      message.success(t('nsmusics.siderbar_player.playback_3'))
      break
  }
}
async function Play_Media_Order(model_num: string, increased: number) {
  let last_index = store_playlist_list_info.playlist_MediaFiles_temporary.length
  if (last_index > 0) {
    let index = store_playlist_list_info.playlist_MediaFiles_temporary.findIndex(
      (item: any) => item.play_id === store_player_audio_info.this_audio_play_id
    )

    let stop_play = false

    if (store_player_audio_logic.player_is_play_ended) {
      await store_server_data_set_mediaInfo.Set_MediaInfo_To_PlayCompleteCount_of_Media_File_Server(
        store_player_audio_info.this_audio_song_id
      )
    }

    if (index !== -1) {
      if (model_num === 'playback-1') {
        index += increased
        if (index >= last_index) {
          if (store_player_audio_logic.player_is_play_ended) {
            stop_play = true
            store_player_audio_logic.player_is_play_ended = false
          } else {
            index = 0
          }
        } else if (index < 0) {
          index = last_index - 1
        }
      } else if (model_num === 'playback-2') {
        index += increased
        if (index >= last_index) {
          index = 0
        } else if (index < 0) {
          index = last_index - 1
        }
      } else if (model_num === 'playback-3') {
        if (increased !== 0) {
          index += increased
          if (index < 0) {
            index = last_index - 1
          } else if (index >= last_index) {
            index = 0
          }
        }
      } else if (model_num === 'playback-4') {
        if (!store_server_user_model.random_play_model) {
          index = Math.floor(Math.random() * last_index)
        } else {
          index += increased
          if (index >= last_index) {
            store_server_user_model.random_play_model_add = true
            if (store_server_users.server_select_kind === 'ninesong') {
              let get_NineSong_Temp_Data_To_LocalSqlite =
                new Get_NineSong_Temp_Data_To_LocalSqlite()
              await get_NineSong_Temp_Data_To_LocalSqlite.get_random_song_list(
                store_server_login_info.server_url,
                '0',
                '30'
              )
            } else if (store_server_users.server_select_kind === 'navidrome') {
              let get_Navidrome_Temp_Data_To_LocalSqlite =
                new Get_Navidrome_Temp_Data_To_LocalSqlite()
              await get_Navidrome_Temp_Data_To_LocalSqlite.get_random_song_list(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                store_server_user_model.username,
                store_server_user_model.token,
                store_server_user_model.salt,
                '30',
                '',
                ''
              )
            } else {
              store_general_fetch_media_list._load_model = 'play'
              await store_general_fetch_media_list.fetchData_Media_of_server_web_start()
              store_general_fetch_media_list._load_model = 'search'

              const media_file = store_playlist_list_info.playlist_MediaFiles_temporary[index]
              await store_player_audio_logic.update_current_media_info(media_file, index)
              console.log(media_file)

              store_playlist_list_logic.media_page_handleItemDbClick = false
              store_player_audio_info.this_audio_restart_play = true
            }
          } else if (index < 0) {
            index = last_index - 1
          }
        }
      } else {
        stop_play = true
      }

      if (!store_server_user_model.random_play_model || index < last_index) {
        if (!stop_play) {
          if (store_server_user_model.model_server_type_of_web) {
            if (index >= store_playlist_list_info.playlist_MediaFiles_temporary.length) {
              store_general_fetch_media_list._load_model = 'play'
              await store_general_fetch_media_list.fetchData_Media_of_server_web_end()
              store_general_fetch_media_list._load_model = 'search'
            }
          }
          const media_file = store_playlist_list_info.playlist_MediaFiles_temporary[index]
          await store_player_audio_logic.update_current_media_info(media_file, index)
          console.log(media_file)

          store_playlist_list_logic.media_page_handleItemDbClick = false
          store_player_audio_info.this_audio_restart_play = true
        }
      }
    }
  }
}
async function begin_random_play_model() {
  store_playlist_list_info.playlist_MediaFiles_temporary = []
  store_player_audio_logic.play_order = 'playback-4'
  if (store_server_users.server_select_kind === 'ninesong') {
    let get_NineSong_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
    await get_NineSong_Temp_Data_To_LocalSqlite.get_random_song_list(
      store_server_login_info.server_url,
      '0',
      '30'
    )
  } else if (store_server_users.server_select_kind === 'navidrome') {
    let get_Navidrome_Temp_Data_To_LocalSqlite = new Get_Navidrome_Temp_Data_To_LocalSqlite()
    await get_Navidrome_Temp_Data_To_LocalSqlite.get_random_song_list(
      store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
      store_server_user_model.username,
      store_server_user_model.token,
      store_server_user_model.salt,
      '30',
      '',
      ''
    )
  }
  ///
  const media_file = store_playlist_list_info.playlist_MediaFiles_temporary[0]
  await store_player_audio_logic.update_current_media_info(media_file, 0)
  console.log(media_file)
  ///
  store_playlist_list_logic.media_page_handleItemDbClick = false
  store_player_audio_info.this_audio_restart_play = true
}

////// player_configs player_button middle area
const play_skip_back_click = async () => {
  if(store_player_audio_logic.player_model_cue){
    if(play_skip_cue_order(-1, false, undefined, undefined)){
      return
    }
  }
  ///
  store_player_audio_logic.current_play_time = store_player_audio_logic.formatTime(
    await store_player_audio_logic.player.getDuration()
  )
  store_player_audio_logic.player_slider_currentTime_added_value = 0
  this_audio_buffer_file.value = null
  clearInterval(timer)

  store_player_audio_logic.player_no_progress_jump = false

  store_player_audio_logic.player.isPlaying = false
  Play_Media_Order(store_player_audio_logic.play_order, -1)

  store_player_appearance.player_mode_of_lock_playlist = true
}
const play_skip_forward_click = async () => {
  if(store_player_audio_logic.player_model_cue){
    if(play_skip_cue_order(1, false, undefined, undefined)){
      return
    }
  }
  ///
  store_player_audio_logic.current_play_time = store_player_audio_logic.formatTime(
    await store_player_audio_logic.player.getDuration()
  )
  store_player_audio_logic.player_slider_currentTime_added_value = 0
  this_audio_buffer_file.value = null
  clearInterval(timer)

  store_player_audio_logic.player_no_progress_jump = false

  store_player_audio_logic.player.isPlaying = false
  Play_Media_Order(store_player_audio_logic.play_order, 1)

  store_player_appearance.player_mode_of_lock_playlist = true
}
//
watch(
  () => store_player_audio_logic.player_model_cue,
  (newValue) => {
    if (newValue) {
      message.success(t('ButtonStart') + t('nsmusics.view_page.disk') + t('Play'));
    } else {
      message.success(t('ButtonClose') + t('nsmusics.view_page.disk') + t('Play'))
      clearMarks()
    }
  }
)
//
const updateMarks = (newMarks: Record<number, string>) => {
  store_player_audio_logic.marks_slider_singleValue = { ...store_player_audio_logic.marks_slider_singleValue, ...newMarks };
};
const deleteMark = (position: number) => {
  const newMarks = { ...store_player_audio_logic.marks_slider_singleValue };
  delete newMarks[position];
  store_player_audio_logic.marks_slider_singleValue = newMarks;
};
const clearMarks = () => {
  store_player_audio_logic.marks_slider_singleValue = {};
};
let media_cue_temp = undefined
function play_skip_cue_order (
  increased: number, find_model: boolean, currentTime: any, duration: any
) {
  let media_file = undefined;
  let index_num = 0;
  const index = store_player_audio_info.this_audio_cue_track_current_no + increased;
  if(index < 0){
    store_player_audio_info.this_audio_cue_track_current_no = 0
    store_player_audio_info.this_audio_cue_track_current_indexes = []
    store_player_audio_info.this_audio_cue_tracks = []
    return false
  }
  for (let i = 0; i < store_view_media_cue_page_info.media_Files_temporary.length; i++) {
    const media_cue = store_view_media_cue_page_info.media_Files_temporary[i]
    if(
      media_cue != undefined &&
      media_cue.path === store_player_audio_info.this_audio_file_path &&
      media_cue.cue_tracks != undefined
    ){
      if(index <= media_cue.cue_tracks.length){
        media_file = media_cue;
        index_num = index + 1;
        break;
      }
    }
  }
  if (media_file === undefined) {
    store_player_audio_info.this_audio_cue_track_current_no = 0
    store_player_audio_info.this_audio_cue_track_current_indexes = []
    store_player_audio_info.this_audio_cue_tracks = []
    return false
  }
  if(find_model) {
    if(media_file.cue_tracks != undefined && media_file.cue_tracks.length > 0){
      const newMarks: Record<number, string> = {};
      clearMarks()
      /// 尾部遍历寻找
      let find_result = false
      for (let i = media_file.cue_tracks.length - 1; i >= 0; i--) {
        const track = media_file.cue_tracks[i];
        const current_cue_time = store_player_audio_logic.formatStrTime(track.INDEXES[0].TIME) / 1000;
        if(currentTime > current_cue_time && !find_result){
          store_player_audio_info.this_audio_song_name = track.Title
          if (store_player_audio_info.this_audio_song_name.length === 0) {
            store_player_audio_info.this_audio_song_name = index_num + ':' + media_file.title
          }
          store_player_audio_info.this_audio_artist_name = track.Performer
          store_player_audio_info.this_audio_album_name = media_file.title
          //
          store_player_audio_info.this_audio_cue_track_current_no = i
          //
          find_result = true;
          //
          media_cue_temp = track
        }
        //
        const mark_time = current_cue_time / duration * 100;
        if (!isNaN(mark_time) && mark_time >= 0 && mark_time <= 100) {
          newMarks[mark_time] = undefined// track.Title;
        }
      }
      // 批量更新标记
      updateMarks(newMarks);
    }
  }else{
    ///
    if (media_file.cue_tracks === undefined) {
      store_player_audio_info.this_audio_cue_track_current_no = 0
      store_player_audio_info.this_audio_cue_track_current_indexes = []
      store_player_audio_info.this_audio_cue_tracks = []
      store_player_audio_logic.player_model_cue = false
    } else {
      store_player_audio_info.this_audio_cue_track_current_no = index_num
      store_player_audio_info.this_audio_cue_track_current_indexes =
        media_file.cue_tracks[index_num - 1].INDEXES
      ///
      store_player_audio_info.this_audio_song_name = media_file.cue_tracks[index_num - 1].Title
      if (store_player_audio_info.this_audio_song_name.length === 0) {
        store_player_audio_info.this_audio_song_name = index_num + ':' + media_file.title
      }
      store_player_audio_info.this_audio_artist_name = media_file.cue_tracks[index_num - 1].Performer
      store_player_audio_info.this_audio_album_name = media_file.title
      ///
      store_player_audio_logic.player_model_cue = true
    }
    if (store_player_audio_info.this_audio_cue_track_current_indexes.length > 0) {
      const track_str = store_player_audio_info.this_audio_cue_track_current_indexes[0].TIME
      if (track_str.length > 0) {
        const track_time = store_player_audio_logic.formatStrTime(track_str)
        store_player_audio_logic.player.setCurrentTime(track_time / 1000)
      }
    }
  }
  ///
  return true
}
import { Retrieval_ApiService_of_NineSong } from '@/data/data_access/servers_configs/ninesong_api/services_web/Scene/Music/Retrieval/index_service'
watch(
  () => store_player_audio_info.this_audio_cue_track_current_no,
  async (newValue) => {
    const retrieval = new Retrieval_ApiService_of_NineSong(store_server_login_info.server_url)
    if(
      store_server_user_model.model_server_type_of_web &&
      store_server_users.server_select_kind === 'ninesong' &&
      store_player_audio_logic.player_model_cue
    ) {
      if(media_cue_temp != undefined) {
        const lyrics_search = await retrieval.getLyrics_filter(media_cue_temp.Performer, media_cue_temp.Title, '')
        if (lyrics_search != undefined && lyrics_search.length > 0) {
          await store_player_audio_info.set_lyric(lyrics_search)
        } else {
          await store_player_audio_info.set_lyric('')
        }
      }
    }
  }
)
///
if (isElectron) {
  ipcRenderer.on(
    'tray-music-prev',
    debounce(async (event, args) => {
      ;(await play_skip_back_click(), 300)
    })
  )
  ipcRenderer.on(
    'tray-music-next',
    debounce(async (event, args) => {
      ;(await play_skip_forward_click(), 300)
    })
  )
}

const Play_Media_Switching = async () => {
  store_player_audio_logic.current_play_time = store_player_audio_logic.formatTime(
    await store_player_audio_logic.player.getDuration()
  )
  store_player_audio_logic.player_slider_currentTime_added_value = 0
  this_audio_buffer_file.value = null
  clearInterval(timer)

  store_player_audio_logic.player_no_progress_jump = false

  store_player_audio_logic.player.isPlaying = false
  store_player_audio_logic.player_is_play_ended = true

  if (store_player_audio_logic.play_order === 'playback-3') {
    Play_Media_Order(store_player_audio_logic.play_order, 0)
  } else {
    Play_Media_Order(store_player_audio_logic.play_order, 1)
  }
}

////// player_configs slider formatTime area
watch(
  () => store_player_audio_logic.slider_init_singleValue,
  (newValue, oldValue) => {
    if (newValue !== oldValue && newValue > 0) {
      store_player_audio_logic.slider_singleValue = newValue
    }
  }
)
const set_slider_singleValue = async () => {
  if (!store_player_audio_logic.player_range_duration_isDragging) {
    const currentTime = await store_player_audio_logic.player.getCurrentTime()
    const duration = await store_player_audio_logic.player.getDuration()
    const calculatedValue =
      ((currentTime + store_player_audio_logic.player_slider_currentTime_added_value) / duration) *
      100
    store_player_audio_logic.slider_singleValue = Number(calculatedValue.toFixed(2))
    if(store_player_audio_logic.player_model_cue) {
      play_skip_cue_order(0, true, currentTime, duration)
    }
  }
}
const get_current_play_time = async () => {
  if (
    (await store_player_audio_logic.player.getCurrentTime()) +
      store_player_audio_logic.player_slider_currentTime_added_value <=
    (await store_player_audio_logic.player.getDuration())
  ) {
    store_player_audio_logic.current_play_time = store_player_audio_logic.formatTime(
      (await store_player_audio_logic.player.getCurrentTime()) +
        store_player_audio_logic.player_slider_currentTime_added_value
    )
    store_player_audio_logic.total_play_time = store_player_audio_logic.formatTime(
      await store_player_audio_logic.player.getDuration()
    )
  }
}
const synchronize_playback_time = () => {
  try {
    set_slider_singleValue()
    get_current_play_time()
  } catch {}
}
let timer: string | number | NodeJS.Timeout | undefined
watch(
  () => store_player_audio_logic.player_go_lyric_line_index_of_audio_play_progress,
  () => {
    store_player_audio_logic.play_go_duration(
      store_player_audio_logic.player_go_lyric_line_index_of_audio_play_progress,
      false
    )
  }
)

////// open playList
const Set_Playlist_Show = () => {
  store_playlist_appearance.playlist_show = !store_playlist_appearance.playlist_show
}
////// open sound effects
const Set_Player_Show_Sound_effects = () => {
  store_player_sound_effects.player_show_sound_effects =
    !store_player_sound_effects.player_show_sound_effects
}
////// open sound speedPlayer_Show_Sound_more
const Set_Player_Show_Sound_speed = () => {
  store_player_sound_speed.player_show_sound_speed =
    store_player_sound_speed.player_show_sound_speed === false
}
////// open sound more info
const Set_Player_Show_Sound_more = () => {
  store_player_sound_more.player_show_sound_more =
    store_player_sound_more.player_show_sound_more === false
}

////// auto collapse player_configs bar
const handleMouseMove = () => {
  if (store_player_appearance.player_show) {
    if (store_player_appearance.player_use_playbar_auto_hide) {
      store_player_appearance.player_collapsed_action_bar_of_Immersion_model = true
    }
    store_player_audio_logic.drawer_order_show = false
    store_player_audio_logic.drawer_volume_show = false
  }
}

////// changed_data write to sqlite
import { store_player_appearance } from '@/views/view_app/music_page/page_player/store/store_player_appearance'
import { store_player_audio_info } from '@/views/view_app/music_page/page_player/store/store_player_audio_info'
import { store_player_audio_logic } from '@/views/view_app/music_page/page_player/store/store_player_audio_logic'
import { store_player_sound_effects } from '@/views/view_app/music_page/page_player/store/store_player_sound_effects'
import { store_player_sound_speed } from '@/views/view_app/music_page/page_player/store/store_player_sound_speed'
import { store_player_sound_more } from '@/views/view_app/music_page/page_player/store/store_player_sound_more'
import { store_playlist_appearance } from '@/views/view_app/music_components/player_list/store/store_playlist_appearance'
import { store_playlist_list_info } from '@/views/view_app/music_components/player_list/store/store_playlist_list_info'
import { store_view_media_page_logic } from '@/views/view_app/music_page/page_media/store/store_view_media_page_logic'
import { store_local_data_set_mediaInfo } from '@/data/data_stores/local/local_data_synchronization/store_local_data_set_mediaInfo'
import { store_playlist_list_logic } from '@/views/view_app/music_components/player_list/store/store_playlist_list_logic'
import { store_server_user_model } from '@/data/data_stores/server/store_server_user_model'
import { store_general_fetch_player_list } from '@/data/data_stores/server/server_api_abstract/music_scene/components/player_list/store_general_fetch_player_list'
import { Audio_howler } from '@/data/data_models/app_models/song_Audio_Out/Audio_howler'
import { Audio_node_mpv } from '@/data/data_models/app_models/song_Audio_Out/Audio_node_mpv'
import { store_player_tag_modify } from '@/views/view_app/music_page/page_player/store/store_player_tag_modify'
import { Get_AnnotationInfo_To_LocalSqlite } from '@/data/data_access/local_configs/class_Get_AnnotationInfo_To_LocalSqlite'
import { store_local_data_set_artistInfo } from '@/data/data_stores/local/local_data_synchronization/store_local_data_set_artistInfo'
import { Get_Navidrome_Temp_Data_To_LocalSqlite } from '@/data/data_access/servers_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite'
import { store_server_users } from '@/data/data_stores/server/store_server_users'
import { store_general_fetch_media_list } from '@/data/data_stores/server/server_api_abstract/music_scene/page/page_media_file/store_general_fetch_media_list'
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/data/data_access/servers_configs/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import {
  store_general_fetch_media_cue_list
} from '@/data/data_stores/server/server_api_abstract/music_scene/page/page_media_cue_file/store_general_fetch_media_cue_list'
import {
  store_view_media_cue_page_info
} from '@/views/view_app/music_page/page_media_cue/store/store_view_media_cue_page_info'
import {
  store_local_data_set_albumInfo
} from '@/data/data_stores/local/local_data_synchronization/store_local_data_set_albumInfo'

const handleItemClick_Favorite = (id, favorite) => {
  if (id != null && id.length > 0 && id != 'undefined') {
    store_local_data_set_mediaInfo.Set_MediaInfo_To_Favorite(id, favorite)
    store_player_audio_info.this_audio_song_favorite = !favorite

    store_view_media_page_logic.page_songlists_statistic.forEach((item: any) => {
      if (item.id === 'song_list_love') {
        store_view_media_page_info.media_starred_count += !favorite ? 1 : -1
        item.song_count = store_view_media_page_info.media_starred_count + ' *'
      }
    })
    store_player_audio_logic.boolHandleItemClick_Favorite = true

    const item_file: Media_File | undefined = store_view_media_page_info.media_Files_temporary.find(
      (mediaFile: Media_File) => mediaFile.id === store_player_audio_info.this_audio_song_id
    )
    const item_playlist: Media_File | undefined =
      store_playlist_list_info.playlist_MediaFiles_temporary.find(
        (mediaFile: Media_File) => mediaFile.id === store_player_audio_info.this_audio_song_id
      )
    if (item_file !== undefined) item_file.favorite = !favorite
    if (item_playlist !== undefined) item_playlist.favorite = !favorite
  }
}
const handleItemClick_Rating = (id, rating) => {
  store_local_data_set_mediaInfo.Set_MediaInfo_To_Rating(id, rating)
  store_player_audio_info.this_audio_song_rating = rating

  const item_file: Media_File | undefined = store_view_media_page_info.media_Files_temporary.find(
    (mediaFile: Media_File) => mediaFile.id === store_player_audio_info.this_audio_song_id
  )
  const item_playlist: Media_File | undefined =
    store_playlist_list_info.playlist_MediaFiles_temporary.find(
      (mediaFile: Media_File) => mediaFile.id === store_player_audio_info.this_audio_song_id
    )
  if (item_file !== undefined) item_file.rating = rating
  if (item_playlist !== undefined) item_playlist.rating = rating
}

/////// emits audio_info of songlist_view_list
const handleItemClick_title = (title) => {
  if(!store_player_audio_logic.player_model_cue) {
    store_router_data_info.router_click = false
    store_view_media_page_logic.page_songlists_bool_show_search_area = true
    store_view_media_page_logic.page_songlists_input_search_Value = title
    store_view_media_page_logic.get_page_songlists_keyword(title)
    player_show_hight_animation_value.value = 670
    get_playerbar_to_switch_playerview(player_show_hight_animation_value.value)
    store_player_audio_logic.player_back_ChevronDouble =
      player_show_hight_animation_value.value === 0 ? shrink_down_arrow : shrink_up_arrow
  }
}
const handleItemClick_artist = (artist) => {
  if(!store_player_audio_logic.player_model_cue) {
    store_router_data_info.router_click = false
    if (
      store_server_user_model.model_server_type_of_local ||
      (store_server_users.server_select_kind === 'navidrome' &&
        store_server_user_model.model_server_type_of_web) ||
      (store_server_users.server_select_kind === 'ninesong' &&
        store_server_user_model.model_server_type_of_web)
    ) {
      store_view_media_page_logic.page_songlists_bool_show_search_area = true
      store_view_media_page_logic.page_songlists_input_search_Value = artist
      if (store_server_user_model.model_server_type_of_local) {
        store_view_media_page_logic.get_page_songlists_keyword(
          artist + 'accurate_search' + '__artist__'
        )
      } else if (store_server_user_model.model_server_type_of_web) {
        store_view_media_page_logic.get_page_songlists_keyword(artist)
      }
      player_show_hight_animation_value.value = 670
      get_playerbar_to_switch_playerview(player_show_hight_animation_value.value)
      store_player_audio_logic.player_back_ChevronDouble =
        player_show_hight_animation_value.value === 0 ? shrink_down_arrow : shrink_up_arrow
    } else {
      message.warning(
        'Jellyfin / Emby ' + t('ContainerNotSupported') + ' ' + t('setting.hotkey_localSearch')
      )
    }
  }
}
const handleItemClick_album = (album) => {
  if(!store_player_audio_logic.player_model_cue) {
    store_router_data_info.router_click = false
    if (
      store_server_user_model.model_server_type_of_local ||
      (store_server_users.server_select_kind === 'navidrome' &&
        store_server_user_model.model_server_type_of_web) ||
      (store_server_users.server_select_kind === 'ninesong' &&
        store_server_user_model.model_server_type_of_web)
    ) {
      store_view_media_page_logic.page_songlists_bool_show_search_area = true
      store_view_media_page_logic.page_songlists_input_search_Value = album
      if (store_server_user_model.model_server_type_of_local) {
        store_view_media_page_logic.get_page_songlists_keyword(
          album + 'accurate_search' + '__album__'
        )
      } else if (store_server_user_model.model_server_type_of_web) {
        store_view_media_page_logic.get_page_songlists_keyword(album)
      }
      player_show_hight_animation_value.value = 670
      get_playerbar_to_switch_playerview(player_show_hight_animation_value.value)
      store_player_audio_logic.player_back_ChevronDouble =
        player_show_hight_animation_value.value === 0 ? shrink_down_arrow : shrink_up_arrow
    } else {
      message.warning(
        'Jellyfin / Emby ' + t('ContainerNotSupported') + ' ' + t('setting.hotkey_localSearch')
      )
    }
  }
}

////// view albumlist_view Remove data
onBeforeUnmount(() => {
  clearInterval(timer)
})
//
watch(
  () => store_player_audio_logic.player_click_state_of_order,
  (newValue) => {
    if (newValue) {
      backpanel_order_click()
      store_player_audio_logic.player_click_state_of_order = false
    }
  }
)
watch(
  () => store_player_audio_logic.player_click_state_of_play_skip_back,
  (newValue) => {
    if (newValue) {
      play_skip_back_click()
      store_player_audio_logic.player_click_state_of_play_skip_back = false
    }
  }
)
watch(
  () => store_player_audio_logic.player_click_state_of_play,
  (newValue) => {
    if (newValue) {
      Init_Audio_Player()
      store_player_audio_logic.player_click_state_of_play = false
    }
  }
)
watch(
  () => store_player_audio_logic.player_click_state_of_play_skip_forward,
  (newValue) => {
    if (newValue) {
      play_skip_forward_click()
      store_player_audio_logic.player_click_state_of_play_skip_forward = false
    }
  }
)
watch(
  () => store_server_user_model.random_play_model,
  (newValue) => {
    if (newValue) {
      store_player_audio_logic.play_order = 'playback-4'
      message.success(t('ButtonStart') + t('Shuffle'))
    } else {
      store_server_user_model.random_play_model_search = false
      message.success(t('Off') + t('Shuffle'))
    }
  }
)
</script>
<template>
  <n-space
    class="this_Bar_Music_Player"
    style="transition: margin 0.4s"
    :style="{
      marginBottom: store_player_appearance.player_collapsed_action_bar_of_Immersion_model
        ? '-80px'
        : '0px',
    }"
    @mouseleave="
      () => {
        handleMouseMove()
        leave_back_svg()
      }
    "
  >
    <div
      class="layout_distribution_3"
      style="transition: margin 0.4s"
      :style="{
        // marginLeft: store_player_appearance.player_show ? '0px' : (store_app_configs_info.app_view_left_menu_collapsed ? '72px' : '166px'),
        // width: store_player_appearance.player_show ? '100vw' : (store_app_configs_info.app_view_left_menu_collapsed ? 'calc(100vw - 72px)' : 'calc(100vw - 167px)'),
        marginLeft: store_player_appearance.player_show ? '0px' : '72px',
        width: store_player_appearance.player_show ? '100vw' : 'calc(100vw - 72px)',
      }"
    >
      <!--      v-if="store_player_appearance.player_show_of_control_info"-->
      <div
        class="gird_Left"
        @mousemove="
          () => {
            store_player_appearance.player_collapsed_action_bar_of_Immersion_model = false
          }
        "
        @mouseover="
          () => {
            store_player_appearance.player_collapsed_action_bar_of_Immersion_model = false
          }
        "
      >
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <div class="button_open_player_view">
              <img
                class="back_svg"
                :src="getAssetImage(store_player_audio_logic.player_back_ChevronDouble)"
                @click="click_back_svg"
                @mouseover="hover_back_img"
                @mouseout="leave_back_svg"
                alt=""
              />
              <img
                class="back_img"
                style="object-fit: cover"
                :style="{ filter: 'blur(' + back_filter_blurValue + 'px)' }"
                :src="getAssetImage(store_player_audio_info.page_top_album_image_url)"
                @error="handleImageError"
                @click="click_back_svg"
                @mouseover="hover_back_img"
                @mouseout="leave_back_svg"
              />
            </div>
          </template>
          {{ $t('setting.hotkey_toggleFullScreenPlayer') }}
        </n-tooltip>
        <div class="bar_left_text_song_info">
          <n-space>
            <n-ellipsis>
              <span
                id="bar_song_name"
                @click="handleItemClick_title(store_player_audio_info.this_audio_song_name)"
              >
                {{ store_player_audio_info.this_audio_song_name }}
              </span>
              <span style="font-size: 16px"> - </span>
              <template
                v-for="artist in store_player_audio_info.this_audio_artist_name.split(/[\/|｜、]/)"
              >
                <span id="bar_artist_name_part" @click="handleItemClick_artist(artist)">{{
                  artist + '&nbsp'
                }}</span>
              </template>
            </n-ellipsis>
          </n-space>
          <n-space>
            <n-ellipsis>
              <span
                id="bar_album_name"
                @click="
                  () => {
                    if (store_server_user_model.model_server_type_of_local) {
                      handleItemClick_album(store_player_audio_info.this_audio_album_id)
                    } else if (store_server_user_model.model_server_type_of_web) {
                      handleItemClick_album(store_player_audio_info.this_audio_album_name)
                    }
                  }
                "
                >{{ store_player_audio_info.this_audio_album_name }}</span
              >
            </n-ellipsis>
          </n-space>
        </div>
      </div>
      <n-space
        class="gird_Middle"
        vertical
        align="center"
        @mousemove="
          () => {
            store_player_appearance.player_collapsed_action_bar_of_Immersion_model = false
          }
        "
        @mouseover="
          () => {
            store_player_appearance.player_collapsed_action_bar_of_Immersion_model = false
          }
        "
      >
        <!-- grid_Middle_button_area -->
        <n-space
          class="grid_Middle_button_area"
          :style="{
            margin: !store_player_appearance.player_show
              ? '10px auto 0'
              : store_player_appearance.player_background_model_num === 3 ||
                  store_player_appearance.player_background_model_num === 4 ||
                  store_player_appearance.player_background_model_num === 5
                ? '10px auto 0'
                : '22px auto 0',
          }"
          justify="center"
        >
          <n-tooltip v-if="store_player_audio_logic.orderToolShow" trigger="hover" placement="top">
            <template #trigger>
              <n-badge
                v-if="store_server_user_model.random_play_model"
                dot
                :value="store_server_user_model.random_play_model"
                :offset="[-8, 14]"
              >
                <n-button
                  quaternary
                  round
                  size="small"
                  @click="
                    () => {
                      store_player_audio_logic.drawer_order_show =
                        !store_player_audio_logic.drawer_order_show
                    }
                  "
                >
                  <template #icon>
                    <n-icon :size="26" v-if="store_player_audio_logic.play_order === 'playback-1'">
                      <ArrowAutofitDown24Regular />
                    </n-icon>
                    <n-icon
                      :size="26"
                      v-else-if="store_player_audio_logic.play_order === 'playback-2'"
                    >
                      <ArrowRepeatAll16Regular />
                    </n-icon>
                    <n-icon
                      :size="26"
                      v-else-if="store_player_audio_logic.play_order === 'playback-3'"
                    >
                      <RepeatOneRound />
                    </n-icon>
                    <n-icon
                      :size="20"
                      v-else-if="store_player_audio_logic.play_order === 'playback-4'"
                    >
                      <Random />
                    </n-icon>
                  </template>
                </n-button>
              </n-badge>
              <n-button
                v-else
                quaternary
                round
                size="small"
                @click="
                  () => {
                    store_player_audio_logic.drawer_order_show =
                      !store_player_audio_logic.drawer_order_show
                  }
                "
              >
                <template #icon>
                  <n-icon :size="26" v-if="store_player_audio_logic.play_order === 'playback-1'">
                    <ArrowAutofitDown24Regular />
                  </n-icon>
                  <n-icon
                    :size="26"
                    v-else-if="store_player_audio_logic.play_order === 'playback-2'"
                  >
                    <ArrowRepeatAll16Regular />
                  </n-icon>
                  <n-icon
                    :size="26"
                    v-else-if="store_player_audio_logic.play_order === 'playback-3'"
                  >
                    <RepeatOneRound />
                  </n-icon>
                  <n-icon
                    :size="20"
                    v-else-if="store_player_audio_logic.play_order === 'playback-4'"
                  >
                    <Random />
                  </n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('Play') + $t('common.sortOrder') }}
          </n-tooltip>
          <n-badge
            v-if="
              !store_player_audio_logic.orderToolShow && store_server_user_model.random_play_model
            "
            dot
            :value="store_server_user_model.random_play_model"
            :offset="[-8, 14]"
          >
            <n-button
              quaternary
              round
              size="small"
              @click="
                () => {
                  store_player_audio_logic.drawer_order_show =
                    !store_player_audio_logic.drawer_order_show
                }
              "
            >
              <template #icon>
                <n-icon :size="26" v-if="store_player_audio_logic.play_order === 'playback-1'">
                  <ArrowAutofitDown24Regular />
                </n-icon>
                <n-icon :size="26" v-else-if="store_player_audio_logic.play_order === 'playback-2'">
                  <ArrowRepeatAll16Regular />
                </n-icon>
                <n-icon :size="26" v-else-if="store_player_audio_logic.play_order === 'playback-3'">
                  <RepeatOneRound />
                </n-icon>
                <n-icon :size="20" v-else-if="store_player_audio_logic.play_order === 'playback-4'">
                  <Random />
                </n-icon>
              </template>
            </n-button>
          </n-badge>
          <n-button
            v-if="
              !store_player_audio_logic.orderToolShow && !store_server_user_model.random_play_model
            "
            quaternary
            round
            size="small"
            @click="
              () => {
                store_player_audio_logic.drawer_order_show =
                  !store_player_audio_logic.drawer_order_show
              }
            "
          >
            <template #icon>
              <n-icon :size="26" v-if="store_player_audio_logic.play_order === 'playback-1'">
                <ArrowAutofitDown24Regular />
              </n-icon>
              <n-icon :size="26" v-else-if="store_player_audio_logic.play_order === 'playback-2'">
                <ArrowRepeatAll16Regular />
              </n-icon>
              <n-icon :size="26" v-else-if="store_player_audio_logic.play_order === 'playback-3'">
                <RepeatOneRound />
              </n-icon>
              <n-icon :size="20" v-else-if="store_player_audio_logic.play_order === 'playback-4'">
                <Random />
              </n-icon>
            </template>
          </n-button>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary round size="small" @click="play_skip_back_click">
                <template #icon>
                  <n-icon :size="26"><PlayBack /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('player.previous') }}
          </n-tooltip>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary round @click="Init_Audio_Player">
                <template #icon>
                  <n-icon v-if="store_player_audio_logic.player.isPlaying" :size="36"
                    ><Pause
                  /></n-icon>
                  <n-icon v-else :size="36"><Play /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('Play') + ' | ' + $t('ButtonPause') }}
          </n-tooltip>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary round size="small" @click="play_skip_forward_click">
                <template #icon>
                  <n-icon :size="26"><PlayForward /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('player.next') }}
          </n-tooltip>
          <n-tooltip v-if="store_player_audio_logic.voiceToolShow" trigger="hover" placement="top">
            <template #trigger>
              <n-button
                quaternary
                round
                size="small"
                @click="
                  () => {
                    store_player_audio_logic.drawer_volume_show =
                      !store_player_audio_logic.drawer_volume_show
                  }
                "
              >
                <template #icon>
                  <n-icon :size="26"><VolumeMedium /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('HeaderAudioSettings') }}
          </n-tooltip>
          <n-button
            v-if="!store_player_audio_logic.voiceToolShow"
            quaternary
            round
            size="small"
            @click="
              () => {
                store_player_audio_logic.drawer_volume_show =
                  !store_player_audio_logic.drawer_volume_show
              }
            "
          >
            <template #icon>
              <n-icon :size="26"><VolumeMedium /></n-icon>
            </template>
          </n-button>
        </n-space>
        <!-- grid_Middle_slider_area -->
        <n-space
          style="width: 460px"
          :style="{
            marginTop:
              !store_player_appearance.player_show ||
              (store_player_appearance.player_show &&
                (store_player_appearance.player_background_model_num === 3 ||
                  store_player_appearance.player_background_model_num === 4 ||
                  store_player_appearance.player_background_model_num === 5))
                ? '-2px'
                : '30px',
          }"
          align="start"
          justify="center"
        >
          <n-space style="width: 46px" justify="end">
            {{ store_player_audio_logic.current_play_time }}
          </n-space>
          <n-config-provider :theme="null">
            <n-slider
            style="
              width: 320px;
              color: var(--primary-color-hover);
              border-radius: 10px;
              transition: margin 0.4s;
              margin-top: 2px;
            "
            v-model:value="store_player_audio_logic.slider_singleValue"
            :marks="store_player_audio_logic.marks_slider_singleValue"
            :min="0"
            :max="100"
            :keyboard="true"
            :format-tooltip="
              (value) => {
                return store_player_audio_logic.formatTime(
                  (value / 100) * store_player_audio_logic.player.isDuration
                )
              }
            "
            :on-dragend="
              () => {
                if (
                  store_player_audio_logic.slider_singleValue >= 99.5 ||
                  store_player_audio_logic.slider_singleValue == 0
                ) {
                  store_player_audio_logic.player_is_play_ended = true
                  store_player_audio_logic.play_go_duration(
                    store_player_audio_logic.slider_singleValue,
                    true
                  )
                }
                store_player_audio_logic.player_range_duration_isDragging = false
              }
            "
            @click="
              () => {
                store_player_audio_logic.play_go_duration(
                  store_player_audio_logic.slider_singleValue,
                  true
                )
              }
            "
            @mousedown="store_player_audio_logic.player_range_duration_isDragging = true"
            @mouseup="store_player_audio_logic.player_range_duration_isDragging = false"
          />
          </n-config-provider>
          <n-space style="width: 46px">
            {{ store_player_audio_logic.total_play_time }}
          </n-space>
        </n-space>
        <!-- grid_Middle_drwaer_area -->
        <n-config-provider :theme="null">
          <div
            id="backpanel_order"
            :style="{
              minWidth: store_player_audio_logic.orderPanelWidath + 'px',
            }"
            @mouseleave="backpanel_order_leave"
          ></div>
          <n-drawer
            v-model:show="store_player_audio_logic.drawer_order_show"
            placement="bottom"
            to="#backpanel_order"
            v-model:height="store_player_audio_logic.drawer_order_height"
            show-mask="transparent"
            style="border-radius: 10px"
          >
            <n-drawer-content>
              <n-space vertical align="flex-start" style="height: 100px">
                <n-button
                  quaternary
                  @click="
                    () => {
                      store_player_audio_logic.play_order = 'playback-1'
                      store_player_audio_logic.drawer_order_show = false
                      store_server_user_model.random_play_model = false
                    }
                  "
                  :style="{
                    minWidth: store_player_audio_logic.orderButonWidath + 'px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }"
                  style="margin-left: -16px; margin-top: -6px"
                >
                  <template #icon>
                    <n-icon>
                      <ArrowAutofitDown24Regular />
                    </n-icon>
                  </template>
                  {{ $t('nsmusics.siderbar_player.playback_1') }}
                </n-button>
                <n-button
                  quaternary
                  @click="
                    () => {
                      store_player_audio_logic.play_order = 'playback-2'
                      store_player_audio_logic.drawer_order_show = false
                      store_server_user_model.random_play_model = false
                    }
                  "
                  :style="{
                    minWidth: store_player_audio_logic.orderButonWidath + 'px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }"
                  style="margin-left: -16px; margin-top: -6px"
                >
                  <template #icon>
                    <n-icon>
                      <ArrowRepeatAll16Regular />
                    </n-icon>
                  </template>
                  {{ $t('nsmusics.siderbar_player.playback_2') }}
                </n-button>
                <n-button
                  quaternary
                  @click="
                    () => {
                      store_player_audio_logic.play_order = 'playback-3'
                      store_player_audio_logic.drawer_order_show = false
                      store_server_user_model.random_play_model = false
                    }
                  "
                  :style="{
                    minWidth: store_player_audio_logic.orderButonWidath + 'px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }"
                  style="margin-left: -16px; margin-top: -6px"
                >
                  <template #icon>
                    <n-icon>
                      <RepeatOneRound />
                    </n-icon>
                  </template>
                  {{ $t('nsmusics.siderbar_player.playback_3') }}
                </n-button>
                <n-button
                  quaternary
                  @click="
                    () => {
                      store_player_audio_logic.play_order = 'playback-4'
                      store_player_audio_logic.drawer_order_show = false
                      store_server_user_model.random_play_model = false
                    }
                  "
                  :style="{
                    minWidth: store_player_audio_logic.orderButonWidath + 'px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }"
                  style="margin-left: -16px; margin-top: -6px"
                >
                  <template #icon>
                    <n-icon :size="12">
                      <Random />
                    </n-icon>
                  </template>
                  <div
                    v-if="
                      store_server_user_model.model_server_type_of_web &&
                      store_server_users.server_select_kind != 'jellyfin' &&
                      store_server_users.server_select_kind != 'emby'
                    "
                  >
                    {{ $t('Playlists') }}
                  </div>
                  <div v-else>
                    {{ $t('nsmusics.siderbar_player.playback_4') }}
                  </div>
                </n-button>
                <n-button
                  v-if="
                    store_server_user_model.model_server_type_of_web &&
                    store_server_users.server_select_kind != 'jellyfin' &&
                    store_server_users.server_select_kind != 'emby'
                  "
                  quaternary
                  @click="
                    async () => {
                      store_player_audio_logic.play_order = 'playback-2'
                      // 刷新store_player_audio_logic.play_order响应式状态
                      store_player_audio_logic.play_order = 'playback-4'
                      store_player_audio_logic.drawer_order_show = false
                      store_server_user_model.random_play_model = true
                      await begin_random_play_model()
                    }
                  "
                  :style="{
                    minWidth: store_player_audio_logic.orderButonWidath + 'px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }"
                  style="margin-left: -16px; margin-top: -6px"
                >
                  <template #icon>
                    <n-icon :size="12">
                      <Random />
                    </n-icon>
                  </template>
                  {{ $t('HeaderLibraries') }}
                </n-button>
              </n-space>
            </n-drawer-content>
          </n-drawer>
        </n-config-provider>
        <n-config-provider :theme="null">
          <div id="backpanel_voice"></div>
          <n-drawer
            v-model:show="store_player_audio_logic.drawer_volume_show"
            placement="bottom"
            :width="77"
            :height="236"
            to="#backpanel_voice"
            show-mask="transparent"
            style="border-radius: 10px"
          >
            <n-drawer-content>
              <n-space vertical justify="center" align="center">
                <n-slider
                  style="height: 158px; border-radius: 10px; margin-top: 6px"
                  vertical
                  v-model:value="store_player_audio_logic.play_volume"
                  :min="0"
                  :max="100"
                  :keyboard="true"
                  :tooltip="false"
                />
                <n-text>{{ store_player_audio_logic.play_volume }}</n-text>
              </n-space>
            </n-drawer-content>
          </n-drawer>
        </n-config-provider>
      </n-space>
      <div
        class="gird_Right"
        @mousemove="
          () => {
            store_player_appearance.player_collapsed_action_bar_of_Immersion_model = false
          }
        "
        @mouseover="
          () => {
            store_player_appearance.player_collapsed_action_bar_of_Immersion_model = false
          }
        "
      >
        <n-space class="gird_Right_current_playlist_button_area">
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-badge
                :value="store_playlist_list_info.playlist_MediaFiles_temporary.length"
                show-zero
                :max="9999"
                :offset="[-7, 3]"
              >
                <n-button
                  strong
                  secondary
                  class="gird_Right_current_playlist_button_area_of_button"
                  @click="Set_Playlist_Show"
                >
                  <template #icon>
                    <n-icon :size="42"><QueueMusicRound /></n-icon>
                  </template>
                </n-button>
              </n-badge>
            </template>
            {{ $t('Playlists') }}
          </n-tooltip>
        </n-space>
        <div
          class="gird_Right_button_area"
          style="margin-top: 16px"
          :style="{
            width:!store_player_appearance.player_show ?
              (store_server_user_model.model_server_type_of_web ?
                (store_server_users.server_select_kind === 'ninesong' ? '102px' : '132px') : '132px')
              :
              (store_server_user_model.model_server_type_of_web ?
                (store_server_users.server_select_kind === 'ninesong' ? '132px' : '160px') : '160px'),
          }"
        >
          <n-space
            justify="end"
            v-if="
              (store_server_users.server_select_kind != 'jellyfin' &&
                store_server_users.server_select_kind != 'emby') ||
              store_server_user_model.model_server_type_of_local
            "
          >
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-rate
                  clearable
                  size="small"
                  v-model:value="store_player_audio_info.this_audio_song_rating"
                  @update:value="
                    (value: number) =>
                      handleItemClick_Rating(store_player_audio_info.this_audio_song_id, value)
                  "
                />
              </template>
              {{ $t('filter.rating') }}
            </n-tooltip>
          </n-space>
          <n-space
            justify="space-between"
            :style="{
              marginTop:
                (store_server_users.server_select_kind != 'jellyfin' &&
                  store_server_users.server_select_kind != 'emby') ||
                store_server_user_model.model_server_type_of_local
                  ? '6px'
                  : '16px',
            }"
          >
            <n-tooltip trigger="hover" placement="top" v-if="store_player_appearance.player_show">
              <template #trigger>
                <n-button
                  size="tiny"
                  text
                  @click="
                    store_player_audio_logic.drawer_theme_show =
                      !store_player_audio_logic.drawer_theme_show
                  "
                >
                  <template #icon>
                    <n-icon
                      :size="
                        (store_server_users.server_select_kind != 'jellyfin' &&
                          store_server_users.server_select_kind != 'emby') ||
                        store_server_user_model.model_server_type_of_local
                          ? 22
                          : 25
                      "
                    >
                      <Settings24Regular />
                    </n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('Play') + $t('nsmusics.view_player.view_seting.viewSeting') }}
            </n-tooltip>
            <n-tooltip
              trigger="hover"
              placement="top"
              v-if="
                store_server_users.server_select_kind === 'navidrome' ||
                store_server_user_model.model_server_type_of_local
              "
            >
              <template #trigger>
                <n-button
                  size="tiny"
                  text
                  @click="
                    () => {
                      store_player_tag_modify.player_current_media_path =
                        store_player_audio_info.this_audio_file_path
                      store_player_tag_modify.player_current_media_id =
                        store_player_audio_info.this_audio_song_id
                      store_player_tag_modify.player_current_album_id =
                        store_player_audio_info.this_audio_album_id
                      store_player_tag_modify.player_current_artist_id =
                        store_player_audio_info.this_audio_artist_id
                      //
                      store_player_tag_modify.player_show_tag_modify =
                        !store_player_tag_modify.player_show_tag_modify
                    }
                  "
                >
                  <template #icon>
                    <n-icon :size="22">
                      <Tag16Regular />
                    </n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('LabelAudioTagSettings') }}
            </n-tooltip>
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-button
                  size="tiny"
                  text
                  @click="
                    handleItemClick_Favorite(
                      store_player_audio_info.this_audio_song_id,
                      store_player_audio_info.this_audio_song_favorite
                    )
                  "
                >
                  <template #icon>
                    <n-icon
                      v-if="store_player_audio_info.this_audio_song_favorite"
                      :size="
                        (store_server_users.server_select_kind != 'jellyfin' &&
                          store_server_users.server_select_kind != 'emby') ||
                        store_server_user_model.model_server_type_of_local
                          ? 22
                          : 25
                      "
                      color="red"
                    >
                      <Heart28Filled />
                    </n-icon>
                    <n-icon
                      v-else
                      :size="
                        (store_server_users.server_select_kind != 'jellyfin' &&
                          store_server_users.server_select_kind != 'emby') ||
                        store_server_user_model.model_server_type_of_local
                          ? 22
                          : 25
                      "
                    >
                      <Heart24Regular />
                    </n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('common.favorite') }}
            </n-tooltip>
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-button size="tiny" text @click="Set_Player_Show_Sound_effects">
                  <template #icon>
                    <n-icon
                      :size="
                        (store_server_users.server_select_kind != 'jellyfin' &&
                          store_server_users.server_select_kind != 'emby') ||
                        store_server_user_model.model_server_type_of_local
                          ? 22
                          : 25
                      "
                    >
                      <DeviceEq24Filled />
                    </n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('HeaderAudioAdvanced') }}
            </n-tooltip>
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-button size="tiny" text @click="Set_Player_Show_Sound_speed">
                  <template #icon>
                    <n-icon
                      :size="
                        (store_server_users.server_select_kind != 'jellyfin' &&
                          store_server_users.server_select_kind != 'emby') ||
                        store_server_user_model.model_server_type_of_local
                          ? 22
                          : 25
                      "
                    >
                      <TopSpeed20Regular />
                    </n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('PlaybackRate') }}
            </n-tooltip>
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-button size="tiny" text @click="Set_Player_Show_Sound_more">
                  <template #icon>
                    <n-icon
                      :size="
                        (store_server_users.server_select_kind != 'jellyfin' &&
                          store_server_users.server_select_kind != 'emby') ||
                        store_server_user_model.model_server_type_of_local
                          ? 22
                          : 25
                      "
                    >
                      <MoreCircle32Regular />
                    </n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('ButtonMore') }}
            </n-tooltip>
          </n-space>
        </div>
      </div>
    </div>
  </n-space>
</template>
<style scoped>
.this_Bar_Music_Player {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 80px;
  z-index: 100;
  border-radius: 12px 12px 0 0;

  --card-color: v-bind('themeVars.cardColor');
  --border-color: v-bind('themeVars.borderColor');
  --primary-color-hover: v-bind('themeVars.primaryColorHover');
  --primary-color-suppl: v-bind('themeVars.primaryColorSuppl');
  --text-color-1: v-bind('themeVars.textColor1');
  --text-color-2: v-bind('themeVars.textColor2');
  --text-color-3: v-bind('themeVars.textColor3');
  --hover-color: v-bind('themeVars.hoverColor');
  --scrollbar-color: v-bind('themeVars.scrollbarColor');
  --scrollbar-color-hover: v-bind('themeVars.scrollbarColorHover');
}

.layout_distribution_3 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw; /* 设置为 auto 即为单分布，100vw 为多分布(左，中，右) */

  height: 80px;
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  z-index: 99;
}

.gird_Left {
  width: 30vw;
  height: 80px;
  margin-left: 12px;

  cursor: default;
  user-select: none;
}
.gird_Left .button_open_player_view {
  width: 60px;
  height: 60px;
  margin-top: 10px;
  margin-left: 20px;
  float: left;
}
.gird_Left .button_open_player_view .back_svg {
  width: 60px;
  height: 60px;
  padding: 10px;
  border-radius: 10px;
  position: absolute;
  z-index: 1;
  opacity: 0;
  cursor: pointer;
  transition: all 0.2s ease;
}
.gird_Left .button_open_player_view .back_svg:hover {
  opacity: 1;
  transform: scale(1.1);
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.7));
}
.gird_Left .button_open_player_view .back_img {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  border: 1.5px solid #ffffff20;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.25);
  z-index: 0;
}
.gird_Left .bar_left_text_song_info {
  width: 15vw;
  height: 50px;
  margin-top: 15px;
  margin-left: 14px;
  float: left;
  text-align: left;
}
.gird_Left .bar_left_text_song_info #bar_song_name {
  font-size: 16px;
  font-weight: 600;
  max-width: 15vw;
}
.gird_Left .bar_left_text_song_info #bar_song_name:hover {
  text-decoration: underline;
  color: var(--primary-color-hover);
}
.gird_Left .bar_left_text_song_info #bar_artist_name_part {
  font-size: 15px;
  font-weight: 500;
}
.gird_Left .bar_left_text_song_info #bar_artist_name_part:hover {
  text-decoration: underline;
  color: var(--primary-color-hover);
}
.gird_Left .bar_left_text_song_info #bar_album_name {
  font-size: 15px;
  max-width: 15vw;
}
.gird_Left .bar_left_text_song_info #bar_album_name:hover {
  text-decoration: underline;
  color: var(--primary-color-hover);
}

.gird_Middle {
  width: 460px;
  height: 80px;
  align-items: center;
}
.gird_Middle .grid_Middle_button_area {
  display: flex;
  align-items: center;
  width: 300px;
  transition: margin 0.4s;
}
.gird_Middle #backpanel_order {
  position: absolute;
  bottom: 80px;
  width: auto;
  margin-left: -180px;
  border-radius: 10px;
  pointer-events: none;
}
.gird_Middle #backpanel_voice {
  position: fixed;
  bottom: 80px;
  margin-left: 80px;
  width: 77px;
  height: 100px;
  border-radius: 10px;
  pointer-events: none;
}

.gird_Right {
  width: 30vw;
  height: 80px;
  margin-right: 12px;

  cursor: default;
  user-select: none;
}
.gird_Right .gird_Right_button_area {
  height: 80px;
  float: right;
  margin-right: 10px;
}
.gird_Right .gird_Right_current_playlist_button_area {
  width: 60px;
  height: 60px;
  float: right;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 20px;
  border-radius: 10px;
}
.gird_Right .gird_Right_current_playlist_button_area_of_button {
  width: 60px;
  height: 60px;
  border-radius: 10px;
}
.gird_Right .gird_Right_current_playlist_button_area_of_button :hover {
  color: var(--primary-color-hover);
}
</style>
