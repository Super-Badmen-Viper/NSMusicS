<script setup lang="ts">
////// this_view resource
import {
  Heart24Regular,
  Heart28Filled,
  SlideText24Regular,
  TextAddSpaceAfter24Filled,
  MoreHorizontal24Filled,
  ShareCloseTray24Regular,
  ShareScreenStart24Regular,
  WindowNew16Regular,
  ArrowRepeatAll16Regular,
  ArrowAutofitDown24Regular,
  Tag16Regular,
  DeviceEq24Filled,
  MoreCircle32Regular,
  TopSpeed20Regular,
  Settings24Regular,
} from '@vicons/fluent'
import { MotionPhotosAutoOutlined, MinusRound, QueueMusicRound } from '@vicons/material'
import { Close } from '@vicons/carbon'
function getAssetImage(firstImage: string) {
  return new URL(firstImage, import.meta.url).href
}

////// navie ui views_components
import { darkTheme, NAvatar, NConfigProvider, NIcon, NSlider, NSpace, NText } from 'naive-ui'
import { ref, watch, watchEffect, onMounted, computed, h } from 'vue'
import { onBeforeUnmount } from 'vue'

import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'
import { storeToRefs } from 'pinia'
import { usePlayerAppearanceStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAppearanceStore'
import { usePlayerSettingStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerSettingStore'
import { usePlayerAudioStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAudioStore'
import { usePageMediaStore } from '@/data/data_status/app_status/page_status/media_store/usePageMediaStore'

import { store_player_view } from '@/views/view_app/page/page_player/store/store_player_view'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { Pause, Play, PlayBack, PlayForward, VolumeMedium } from '@vicons/ionicons5'
import Bar_Music_PlayList from '@/views/view_app/drawer/View_Player_PlayList.vue'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { store_player_tag_modify } from '@/views/view_app/page/page_player/store/store_player_tag_modify'
import { store_local_data_set_mediaInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_mediaInfo'
import { store_player_sound_effects } from '@/views/view_app/page/page_player/store/store_player_sound_effects'
import { store_player_sound_speed } from '@/views/view_app/page/page_player/store/store_player_sound_speed'
import { store_player_sound_more } from '@/views/view_app/page/page_player/store/store_player_sound_more'

////// i18n auto lang
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true,
})

const computed_i18n_Label_ViewSetConfig_Cover_1 = computed(() =>
  t('nsmusics.view_player.view_seting.coverSquare_1')
)
const computed_i18n_Label_ViewSetConfig_Cover_2 = computed(() =>
  t('nsmusics.view_player.view_seting.coverRotate_2')
)
const computed_i18n_Label_ViewSetConfig_Cover_3 = computed(() =>
  t('nsmusics.view_player.view_seting.coverBeaut_3')
)
const computed_i18n_Label_ViewSetConfig_Cover_4 = computed(() =>
  t('nsmusics.view_player.view_seting.coverBase_4')
)
const computed_i18n_Label_Lyric_Not_Find = computed(() => t('HeaderNoLyrics'))

const playerSettingStore = usePlayerSettingStore()
const playerAppearanceStore = usePlayerAppearanceStore()
const playerAudioStore = usePlayerAudioStore()
const playlistStore = usePlaylistStore()
const pageMediaStore = usePageMediaStore()

const {
  player_lyric_fontSize_Num,
  player_lyric_fontWeight,
  player_lyric_color,
  player_lyric_colorHover,
  player_lyric_color_hidden_value,
  player_lyric_color_hidden_coefficient,
  player_background_model_num,
  player_show_of_control_info,
  player_collapsed_action_bar_of_Immersion_model,
} = storeToRefs(playerAppearanceStore)

const {
  this_audio_song_name,
  this_audio_artist_name,
  this_audio_album_name,
  this_audio_song_rating,
  page_top_album_image_url,
  this_audio_lyrics_info_line_font,
  this_audio_song_id,
  this_audio_song_favorite,
  this_audio_lyrics_info_byte_model,
  this_audio_lyrics_info_byte_font,
} = storeToRefs(playerAudioStore)

const { slider_singleValue, current_play_time, total_play_time } = storeToRefs(playerSettingStore)

let unwatch = watch(
  () => playerAudioStore.this_audio_lyrics_loaded_complete,
  (newValue) => {
    if (newValue) {
      load_lyrics()
      playerSettingStore.player_slider_click = true
      scrollToItem(0)
    }
  }
)
onMounted(() => {
  load_lyrics()
  init_player_theme()
})
function load_lyrics() {
  if (playerAudioStore.this_audio_lyrics_string.length > 0) {
    if (playerAudioStore.this_audio_lyrics_null) {
      playerAudioStore.this_audio_lyrics_info_line_font.forEach((item: any, index: number) => {
        if ((item != null || item != 'undefined' || item != '') && item === '未找到可用歌词') {
          playerAudioStore.this_audio_lyrics_info_line_font[index] =
            computed_i18n_Label_Lyric_Not_Find.value
        }
      })
    }
    handleAuto_fontSize(player_lyric_fontSize_Num)
    begin_lyrics_animation()
    try {
      setTimeout(() => {
        handleLeave_Refresh_Lyric_Color()
      }, 200)
    } catch (e) {
      console.log(e)
    }
  }
}
let isFirstRun = true
function begin_lyrics_animation() {
  setTimeout(() => {
    clearInterval(lyrics_animation)
    lyrics_animation = setInterval(async () => {
      for (let i = 0; i < playerAudioStore.this_audio_lyrics_info_line_time.length; i++) {
        if (
          playerSettingStore.player !== null &&
          (await playerSettingStore.player.getCurrentTime()) !== undefined &&
          (await playerSettingStore.player.getCurrentTime()) !== null
        ) {
          let currentTime = (await playerSettingStore.player.getCurrentTime()) * 1000
          if (currentTime <= playerAudioStore.this_audio_lyrics_info_line_time[0]) {
            if (
              !lyrics_list_whell.value &&
              (isFirstRun || store_player_view.currentScrollIndex !== 0)
            ) {
              store_player_view.currentScrollIndex = 0
              scrollToItem(playerAudioStore.this_audio_lyrics_info_line_num)
            }
            break
          } else if (currentTime >= playerAudioStore.this_audio_lyrics_info_line_time[i]) {
            if (i === playerAudioStore.this_audio_lyrics_info_line_time.length - 1) {
              if (
                !lyrics_list_whell.value &&
                (isFirstRun || store_player_view.currentScrollIndex !== i)
              ) {
                store_player_view.currentScrollIndex = i
                scrollToItem(i + playerAudioStore.this_audio_lyrics_info_line_num)
              }
              break
            } else if (currentTime < playerAudioStore.this_audio_lyrics_info_line_time[i + 1]) {
              if (
                !lyrics_list_whell.value &&
                (isFirstRun || store_player_view.currentScrollIndex !== i)
              ) {
                store_player_view.currentScrollIndex = i
                scrollToItem(i + playerAudioStore.this_audio_lyrics_info_line_num)
              }
              break
            }
          }
        }
      }
      if (isFirstRun) {
        isFirstRun = false
      }
      if (playerSettingStore.player_slider_click) {
        handleClear_Lyric_Color()
        lyrics_list_whell.value = false
        playerSettingStore.player_slider_click = false
        const itemElements = scrollbar.value?.$el.querySelectorAll('.lyrics_info') || []
        const itemElements_active =
          scrollbar.value?.$el.querySelectorAll('.lyrics_text_active') || []
        let color_hidden = playerAppearanceStore.player_lyric_color.slice(0, -2)
        const index =
          store_player_view.currentScrollIndex + playerAudioStore.this_audio_lyrics_info_line_num
        scrollToItem(index)
        for (let i = index - 16; i <= index + 16; i++) {
          const colorValue = Math.max(
            playerAppearanceStore.player_lyric_color_hidden_value -
              (index - i) * playerAppearanceStore.player_lyric_color_hidden_coefficient,
            0
          )
          if (i < index) {
            itemElements[i].style.color =
              colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`
            itemElements[i].style.transform = 'scale(1)'
            itemElements[i].style.textShadow = '0 0 0px transparent'
            itemElements[i].style.width = 'calc(90vw)'
          } else if (i !== index) {
            itemElements[i].style.color =
              colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`
            itemElements[i].style.transform = 'scale(1)'
            itemElements[i].style.textShadow = '0 0 0px transparent'
            itemElements[i].style.width = 'calc(90vw)'
            itemElements_active[i].style.fontWeight = 400
          }
        }
      }
    }, 50)
  }, 500) // 防止在歌词列表数据未刷新显示完全而执行歌词项跳转，而导致的面板上移
}
let lyrics_animation: string | number | NodeJS.Timeout | undefined
const handleItemDbClick = async (index: any) => {
  if (index < playerAudioStore.this_audio_lyrics_info_line_num) return
  if (
    index >
    playerAudioStore.this_audio_lyrics_info_line_font.length -
      playerAudioStore.this_audio_lyrics_info_line_num -
      1
  )
    return
  const time =
    playerAudioStore.this_audio_lyrics_info_line_time[
      index - playerAudioStore.this_audio_lyrics_info_line_num
    ]
  if (time >= (await playerSettingStore.player.getDuration()) * 1000) return
  if (time < 0) return
  playerSettingStore.player_go_lyric_line_index_of_audio_play_progress = time
  store_player_view.currentScrollIndex = index

  handleLeave_Refresh_Lyric_Color()
}
const scrollbar = ref<any>(null)
const perviousIndex = ref(0)
const scrollToItem = (index: number) => {
  if (!scrollbar.value) {
    return
  }
  if (lyrics_list_whell.value) {
    return
  }
  if (index === 0) {
    return
  }

  const itemElements_active = scrollbar.value.$el.querySelectorAll('.lyrics_text_active')
  itemElements_active[index].style.fontSize =
    !store_system_configs_info.window_state_miniplayer_desktop_lyric ? '20px' : '26px'
  itemElements_active[index].style.fontWeight = playerAppearanceStore.player_lyric_fontWeight

  const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info')
  itemElements[index].style.color = playerAppearanceStore.player_lyric_colorHover
  itemElements[index].style.filter = 'blur(0px)'
  itemElements[index].style.textShadow = '0 0 1px White'
  itemElements[index].style.transition = 'color 0.5s, transform 0.5s'
  if (!store_system_configs_info.window_state_miniplayer_desktop_lyric) {
    itemElements[index].style.transform = 'scale(1.1) translateY(0px)'
    itemElements[index].style.transformOrigin = 'left center'
    itemElements[index].style.width = 'calc(82vw)'
  } else {
    itemElements[index].style.transform = 'scale(1.1) translateX(0px)'
    itemElements[index].style.transformOrigin = 'center'
    itemElements[index].style.width = 'calc(90vw)'
  }
  if (store_player_view.currentScrollIndex === 0)
    itemElements[index].scrollIntoView({ block: 'center', behavior: 'instant' })
  else itemElements[index].scrollIntoView({ block: 'center', behavior: 'smooth' })
  // 设置前后16列的颜色
  handleLeave_Refresh_Lyric_Color()
  let color_hidden = playerAppearanceStore.player_lyric_color.slice(0, -2)
  for (let i = index - 16; i <= index + 16; i++) {
    if (i < index) {
      const colorValue = Math.max(
        playerAppearanceStore.player_lyric_color_hidden_value -
          (index - i) * playerAppearanceStore.player_lyric_color_hidden_coefficient,
        0
      )
      itemElements[i].style.color =
        colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`
      itemElements[i].style.transform = 'scale(1)'
      itemElements[i].style.textShadow = '0 0 0px transparent'
      itemElements[i].style.width = 'calc(90vw)'
      itemElements_active[i].style.fontWeight = 400
    } else if (i != index) {
      const colorValue = Math.max(
        playerAppearanceStore.player_lyric_color_hidden_value -
          (index - i) * playerAppearanceStore.player_lyric_color_hidden_coefficient,
        0
      )
      itemElements[i].style.color =
        colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`
      itemElements[i].style.transform = 'scale(1)'
      itemElements[i].style.textShadow = '0 0 0px transparent'
      itemElements[i].style.width = 'calc(90vw)'
      itemElements_active[i].style.fontWeight = 400
    }
  }
  perviousIndex.value = index

  if (isFirstRun) {
    playerSettingStore.player_slider_click = true
  }

  // if(playerAudioStore.this_audio_lyrics_info_byte_model) {
  //   if(playerSettingStore.player.isPlaying) {
  //     startByteAnimations(index, 0)
  //   }
  // }
}

const lastIndex = ref(-1)
const startByteAnimations = (index: number, num: number) => {
  if (!scrollbar.value) return

  const itemElements_active = scrollbar.value.$el.querySelectorAll('.lyrics_text_active')
  let position_i_length = playerAudioStore.this_audio_lyrics_info_byte_time.reduce(
    (acc: any, curr: any) => {
      return acc + curr.length
    },
    0
  )
  let position_i_start = playerAudioStore.this_audio_lyrics_info_byte_time
    .slice(0, index)
    .reduce((acc: any, curr: any) => {
      return acc + curr.length
    }, 0)
  let position_i_end = playerAudioStore.this_audio_lyrics_info_byte_time
    .slice(0, index + 1)
    .reduce((acc: any, curr: any) => {
      return acc + curr.length
    }, 0)

  if (index === lastIndex.value) {
    return
  }
  lastIndex.value = index

  // Clear previous intervals
  if (intervals.length > 0) {
    intervals.forEach(clearInterval)
    intervals = []
  }

  // lyric width length
  let elementWidth = 0
  for (let i = position_i_start; i < position_i_end; i++) {
    const element = itemElements_active[i]
    const computedStyle = window.getComputedStyle(element)
    elementWidth += parseFloat(computedStyle.width)

    itemElements_active[i].style.fontSize =
      !store_system_configs_info.window_state_miniplayer_desktop_lyric ? '20px' : '26px'
    itemElements_active[i].style.fontWeight = 400

    itemElements_active[i].style.filter = 'blur(0px)'
    itemElements_active[i].style.transition = 'color 0.5s, transform 0.5s'
    if (!store_system_configs_info.window_state_miniplayer_desktop_lyric) {
      itemElements_active[i].style.transform = 'scale(1.1) translateY(0px)'
      itemElements_active[i].style.transformOrigin = 'left center'
      itemElements_active[i].style.width = 'calc(82vw)'
    } else {
      itemElements_active[i].style.transform = 'scale(1.1) translateX(0px)'
      itemElements_active[i].style.transformOrigin = 'center'
      itemElements_active[i].style.width = 'calc(90vw)'
    }
  }

  for (let i = position_i_start; i < position_i_end; i++) {
    const byteTime = playerAudioStore.this_audio_lyrics_info_byte_time[index][i - position_i_start]
    const [startMs, durationMs] = byteTime.split(',').map(Number)
    const start = startMs / 1000
    const duration = durationMs / 1000
    ;``

    setTimeout(() => {
      itemElements_active[i].style.animationDuration = `${duration}s`
      let leftPx = 0
      const interval = setInterval(
        () => {
          if (leftPx <= elementWidth) {
            leftPx += 1
            itemElements_active[i].style.background =
              `linear-gradient(90deg, #FFFFFF ${leftPx}px, #FAFAFB60 0px) 0 0`
            itemElements_active[i].style.backgroundClip = `text`
            itemElements_active[i].style.color = `transparent`
            itemElements_active[i].style.textShadow = `0 0 2px rgba(255, 255, 255, 0.4)`
          } else {
            clearInterval(interval)
          }
        },
        (duration * 1000) / 30
      )

      intervals.push(interval)
    }, start * 1000)
  }

  try {
    let color_hidden = playerAppearanceStore.player_lyric_color.slice(0, -2)
    for (let i = 0; i < position_i_start; i++) {
      const colorValue = Math.max(
        playerAppearanceStore.player_lyric_color_hidden_value -
          (index - i) * playerAppearanceStore.player_lyric_color_hidden_coefficient,
        0
      )
      itemElements_active[i].style.color =
        colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`
      itemElements_active[i].style.transform = 'scale(1)'
      itemElements_active[i].style.background =
        `linear-gradient(90deg, #FFFFFF 0px, #FAFAFB60 0px) 0 0`
      itemElements_active[i].style.backgroundClip = `text`
      itemElements_active[i].style.textShadow = `0 0 2px transparent`

      itemElements_active[i].style.width = 'calc(90vw)'
    }
    for (let i = position_i_end; i <= position_i_length; i++) {
      const colorValue = Math.max(
        playerAppearanceStore.player_lyric_color_hidden_value -
          (i - index) * playerAppearanceStore.player_lyric_color_hidden_coefficient,
        0
      )
      itemElements_active[i].style.color =
        colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`
      itemElements_active[i].style.transform = 'scale(1)'
      itemElements_active[i].style.background =
        `linear-gradient(90deg, #FFFFFF 0px, #FAFAFB60 0px) 0 0`
      itemElements_active[i].style.backgroundClip = `text`
      itemElements_active[i].style.textShadow = `0 0 2px transparent`

      itemElements_active[i].style.width = 'calc(90vw)'
    }
  } catch {}
}
let intervals: any[] = []
const lyrics_list_whell = ref(false)
const handleWheel = (event: any) => {
  handleClear_Lyric_Color()
}
function handleClear_Lyric_Color() {
  lyrics_list_whell.value = true
  if (!scrollbar.value) return
  const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info')
  for (let i = 0; i < itemElements.length; i++) {
    itemElements[i].style.color = '#FFFFFF99'
    itemElements[i].style.transform = 'scale(1)'
    itemElements[i].style.filter = 'blur(0px)'
    itemElements[i].style.width = 'calc(90vw)'
  }
}
const handleLeave_Refresh_Lyric_Color = () => {
  lyrics_list_whell.value = false
  if (!scrollbar.value) return
  const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info')
  let lyric_bottom_hidden_num = 10
  let color_hidden = playerAppearanceStore.player_lyric_color.slice(0, -2)
  for (let i = perviousIndex.value - 16; i <= perviousIndex.value + 16; i++) {
    if (i < perviousIndex.value) {
      const colorValue = Math.max(
        playerAppearanceStore.player_lyric_color_hidden_value +
          lyric_bottom_hidden_num -
          (perviousIndex.value - i) * playerAppearanceStore.player_lyric_color_hidden_coefficient,
        0
      )
      try {
        itemElements[i].style.color =
          colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`
      } catch {}
    } else {
      const colorValue = Math.max(
        playerAppearanceStore.player_lyric_color_hidden_value +
          lyric_bottom_hidden_num -
          (i - perviousIndex.value) * playerAppearanceStore.player_lyric_color_hidden_coefficient,
        0
      )
      try {
        itemElements[i].style.color =
          colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`
      } catch {}
    }
  }
}
const handleAuto_fontSize = (value: number) => {
  if (!scrollbar.value) return
  const itemElements_active = scrollbar.value.$el.querySelectorAll('.lyrics_text_active')
  itemElements_active.forEach((itemElement: any) => {
    itemElement.style.fontSize = !store_system_configs_info.window_state_miniplayer_desktop_lyric
      ? '20px'
      : '26px'
    itemElement.style.fontWeight = 400
  })
  let marginTop = 6 + Math.floor((window.innerHeight - 880) / 200) * 0.5
  const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info')
  itemElements.forEach((itemElement: any) => {
    itemElement.style.marginTop = marginTop
    itemElement.style.lineHeight = marginTop * 2 * 0.1
  })
}
watch(
  () => playerAppearanceStore.player_lyric_fontSize_Num,
  (newValue) => {
    handleLeave_Refresh_Lyric_Color()
    handleAuto_fontSize(newValue)
  }
)

////// player_configs bind theme_all
function init_player_theme() {
  if (playerAppearanceStore.player_background_model_num === 0) {
    playerAppearanceStore.player_show_of_control_info = false
  } else {
    playerAppearanceStore.player_show_of_control_info = true
  }
}

let timer_auto_hidden: string | number | NodeJS.Timeout | undefined
const collapsed_action_bar = ref(false)
const collapsed_action_bar_hover = ref(false)
const handleMouseMove = () => {
  collapsed_action_bar.value = false
  clearInterval(timer_auto_hidden)
  timer_auto_hidden = setInterval(() => {
    if (!collapsed_action_bar_hover.value) {
      collapsed_action_bar.value = true
    }
  }, 1000)
}
const unwatch_player_collapsed = watchEffect(() => {
  if (!collapsed_action_bar.value) {
    clearInterval(timer_auto_hidden)
  }
})

///
const show_mini_album_model = ref(false)
const hover_back_img = () => {
  show_mini_album_model.value = true
}
const leave_back_svg = () => {
  show_mini_album_model.value = false
}
///
const show_more_options = ref(false)
const handleItemClick_Favorite = (id: any, favorite: boolean) => {
  if (id != null && id.length > 0 && id != 'undefined') {
    store_local_data_set_mediaInfo.Set_MediaInfo_To_Favorite(id, favorite)
    playerAudioStore.this_audio_song_favorite = !favorite

    pageMediaStore.page_songlists_statistic.forEach((item: any) => {
      if (item.id === 'song_list_love') {
        pageMediaStore.media_starred_count += !favorite ? 1 : -1
        item.song_count = pageMediaStore.media_starred_count + ' *'
      }
    })
    playerSettingStore.boolHandleItemClick_Favorite = true

    const item_file: Media_File | undefined = pageMediaStore.media_Files_temporary.find(
      (mediaFile: Media_File) => mediaFile.id === playerAudioStore.this_audio_song_id
    )
    const item_playlist: Media_File | undefined = playlistStore.playlist_MediaFiles_temporary.find(
      (mediaFile: Media_File) => mediaFile.id === playerAudioStore.this_audio_song_id
    )
    if (item_file !== undefined) item_file.favorite = !favorite
    if (item_playlist !== undefined) item_playlist.favorite = !favorite
  }
}
const handleItemClick_Rating = (id: any, rating: any) => {
  store_local_data_set_mediaInfo.Set_MediaInfo_To_Rating(id, rating)
  playerAudioStore.this_audio_song_rating = rating

  const item_file: Media_File | undefined = pageMediaStore.media_Files_temporary.find(
    (mediaFile: Media_File) => mediaFile.id === playerAudioStore.this_audio_song_id
  )
  const item_playlist: Media_File | undefined = playlistStore.playlist_MediaFiles_temporary.find(
    (mediaFile: Media_File) => mediaFile.id === playerAudioStore.this_audio_song_id
  )
  if (item_file !== undefined) item_file.rating = rating
  if (item_playlist !== undefined) item_playlist.rating = rating
}

const Set_Player_Show_Sound_effects = () => {
  store_player_sound_effects.player_show_sound_effects =
    !store_player_sound_effects.player_show_sound_effects
}

const Set_Player_Show_Sound_speed = () => {
  store_player_sound_speed.player_show_sound_speed =
    store_player_sound_speed.player_show_sound_speed === false
}

const Set_Player_Show_Sound_more = () => {
  store_player_sound_more.player_show_sound_more =
    store_player_sound_more.player_show_sound_more === false
}

////// player_configs Remove data
onBeforeUnmount(() => {
  clearInterval(lyrics_animation)
  clearInterval(timer_auto_hidden)
  unwatch()

  unwatch_player_collapsed()
  collapsed_action_bar.value = false
})
</script>

<template>
  <div
    style="overflow: hidden"
    @mouseover="collapsed_action_bar_hover = true"
    @mouseleave="collapsed_action_bar_hover = false"
    @mousemove="handleMouseMove"
    @click="handleMouseMove"
  >
    <!-- background area -->
    <div>
      <!--Album-->
      <div
        id="player_bg_zindex_0"
        :style="{
          width: !store_system_configs_info.window_state_miniplayer_album ? '200vh' : '100vw',
          height: !store_system_configs_info.window_state_miniplayer_album ? '200vh' : '100vh',
          backgroundImage: `url(${getAssetImage(page_top_album_image_url)})`,
          filter: !store_system_configs_info.window_state_miniplayer_album
            ? 'brightness(46%) blur(40px)'
            : collapsed_action_bar
              ? 'brightness(100%) blur(0px)'
              : 'brightness(46%) blur(5px)',
          backgroundSize: !store_system_configs_info.window_state_miniplayer_album
            ? '20vw auto'
            : 'cover',
          backgroundRepeat: !store_system_configs_info.window_state_miniplayer_album
            ? 'repeat'
            : 'no-repeat',
          backgroundPosition: 'center',
        }"
        :class="{
          player_bg_zindex_0_auto_rotateDefault:
            !store_system_configs_info.window_state_miniplayer_album,
        }"
      ></div>
      <div
        style="
          background-color: #000000;
          z-index: -3;
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
        "
      ></div>
    </div>
    <!-- body -->
    <n-space vertical :size="12" style="z-index: 99; overflow: hidden">
      <!-- top bar -->
      <n-flex justify="space-between" style="width: 100vw; z-index: 10; position: absolute">
        <n-config-provider :theme="darkTheme">
          <n-flex justify="end" style="width: 110px; height: 70px; position: absolute; right: 10px">
            <div
              :style="{
                marginRight: collapsed_action_bar ? '-150px' : 0,
                opacity: collapsed_action_bar ? 0 : 1,
                transition: 'opacity 0.4s, margin 0.4s',
              }"
              style="-webkit-app-region: no-drag; margin-top: 10px"
            >
              <n-tooltip trigger="hover" placement="top" v-if="isElectron">
                <template #trigger>
                  <n-button
                    quaternary
                    circle
                    style="margin-right: 4px"
                    @click="
                      async () => {
                        if (isElectron) {
                          // 请不要更改这段诡异的代码，它依靠Electron的BUG运行，呵呵
                          store_system_configs_info.window_state_miniplayer_card = false
                          store_system_configs_info.window_state_miniplayer_desktop_lyric = false
                          store_system_configs_info.window_state_miniplayer_album = false
                          show_mini_album_model = false
                          collapsed_action_bar = true
                          ipcRenderer.send('window-state-miniplayer-hidden')
                          ipcRenderer.send('window-state-miniplayer-hidden')
                          //
                          store_system_configs_info.window_state_miniplayer =
                            !store_system_configs_info.window_state_miniplayer
                          //await ipcRenderer.invoke('get-window-state-miniplayer');
                        }
                      }
                    "
                  >
                    <template #icon>
                      <n-icon size="24" :depth="2"><WindowNew16Regular /></n-icon>
                    </template>
                  </n-button>
                </template>
                {{ $t('nsmusics.view_player.view_player_mini') }}
              </n-tooltip>
              <n-tooltip
                trigger="hover"
                placement="top"
                v-if="isElectron && store_system_configs_info.desktop_system_kind != 'darwin'"
              >
                <template #trigger>
                  <n-button
                    quaternary
                    circle
                    style="margin-right: 4px"
                    @click="
                      () => {
                        if (isElectron) {
                          ipcRenderer.send('window-min')
                        }
                      }
                    "
                  >
                    <template #icon>
                      <n-icon size="24" :depth="2"><MinusRound /></n-icon>
                    </template>
                  </n-button>
                </template>
                {{ $t('common.minimize') }}
              </n-tooltip>
              <n-tooltip
                trigger="hover"
                placement="top"
                v-if="isElectron && store_system_configs_info.desktop_system_kind != 'darwin'"
              >
                <template #trigger>
                  <n-button
                    quaternary
                    circle
                    @click="
                      () => {
                        if (isElectron) {
                          ipcRenderer.send('window-close')
                        }
                      }
                    "
                  >
                    <template #icon>
                      <n-icon size="28" :depth="2"><Close /></n-icon>
                    </template>
                  </n-button>
                </template>
                {{ $t('Off') }}
              </n-tooltip>
            </div>
          </n-flex>
          <n-flex justify="start" style="width: 400px; height: 70px">
            <div
              class="gird_Left"
              v-if="!store_system_configs_info.window_state_miniplayer_desktop_lyric"
            >
              <n-tooltip
                v-if="!store_system_configs_info.window_state_miniplayer_album"
                trigger="hover"
                placement="top"
              >
                <template #trigger>
                  <div class="button_open_player_view">
                    <n-button
                      class="mini_album"
                      quaternary
                      :style="{
                        opacity: show_mini_album_model ? 1 : 0,
                        transition: 'opacity 0.4s',
                      }"
                      @mouseover="hover_back_img"
                      @mouseout="leave_back_svg"
                      @click="
                        async () => {
                          store_system_configs_info.window_state_miniplayer_card = true
                          store_system_configs_info.window_state_miniplayer_desktop_lyric = false
                          store_system_configs_info.window_state_miniplayer_album = true
                          show_mini_album_model = false
                          collapsed_action_bar = true
                          await ipcRenderer.invoke('window-state-miniplayer-album-show')
                          await ipcRenderer.invoke('window-state-miniplayer-album-show')
                        }
                      "
                    >
                      <template #icon>
                        <n-icon size="24" :depth="2"><ShareScreenStart24Regular /></n-icon>
                      </template>
                    </n-button>
                    <img
                      class="back_img"
                      style="object-fit: cover"
                      :src="getAssetImage(page_top_album_image_url)"
                      @mouseover="hover_back_img"
                      @mouseout="leave_back_svg"
                    />
                  </div>
                </template>
                {{ $t('common.expand') + $t('LabelAlbum') }}
              </n-tooltip>
              <div
                v-if="!store_system_configs_info.window_state_miniplayer_album"
                class="bar_left_text_info"
              >
                <n-space>
                  <n-ellipsis
                    :style="{
                      width: collapsed_action_bar ? '250px' : '130px',
                      transition: 'width 0.4s, margin 0.4s',
                    }"
                    style="color: white"
                  >
                    <span id="bar_so_name">{{ this_audio_song_name }}</span>
                  </n-ellipsis>
                </n-space>
                <n-space style="margin-top: -2px">
                  <n-ellipsis style="width: 250px; color: #929292">
                    <template v-for="artist in this_audio_artist_name.split(/[\/|｜、]/)">
                      <span id="bar_ar_name_part">{{ artist + '&nbsp' }}</span>
                    </template>
                    <span id="bar_al_name">{{ '—&nbsp' + this_audio_album_name }}</span>
                  </n-ellipsis>
                </n-space>
              </div>
            </div>
          </n-flex>
        </n-config-provider>
      </n-flex>
      <n-space vertical justify="center">
        <!-- middle area -->
        <n-config-provider :theme="darkTheme">
          <n-flex
            justify="center"
            :style="{
              marginTop: store_system_configs_info.window_state_miniplayer_desktop_lyric
                ? '-30px'
                : '76px',
            }"
            style="transition: margin 0.4s; overflow: hidden"
          >
            <n-space vertical>
              <!-- Lyric -->
              <div
                v-if="
                  store_system_configs_info.window_state_miniplayer_desktop_lyric ||
                  (!store_system_configs_info.window_state_miniplayer_card &&
                    !store_system_configs_info.window_state_miniplayer_album)
                "
                :style="{
                  height: store_system_configs_info.window_state_miniplayer_desktop_lyric
                    ? collapsed_action_bar
                      ? '270px'
                      : '170px'
                    : '620px',
                  marginTop: store_system_configs_info.window_state_miniplayer_desktop_lyric
                    ? '-24px'
                    : '-110px',
                  transition: 'height 0.4s, margin 0.4s',
                }"
                style="
                  border-radius: 20px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  overflow: hidden;
                "
              >
                <n-list
                  clickable
                  :show-divider="false"
                  ref="scrollbar"
                  @wheel="handleWheel"
                  @mouseleave="
                    () => {
                      handleLeave_Refresh_Lyric_Color()
                      store_player_view.currentScrollIndex = 0
                      begin_lyrics_animation()
                    }
                  "
                  :style="{
                    height: store_system_configs_info.window_state_miniplayer_desktop_lyric
                      ? collapsed_action_bar
                        ? '200px'
                        : '170px'
                      : '510px',
                    transition: 'height 0.4s, margin 0.4s',
                  }"
                  style="width: calc(90vw); overflow: auto; background-color: #00000000"
                >
                  <template #default>
                    <n-list-item
                      class="lyrics_info"
                      :style="{
                        textAlign: store_system_configs_info.window_state_miniplayer_desktop_lyric
                          ? 'center'
                          : 'left',
                      }"
                      v-for="(item, index) in this_audio_lyrics_info_line_font"
                      @click="handleItemDbClick(index)"
                    >
                      <div class="lyrics_text_active">
                        {{ item }}
                      </div>
                      <!--                        v-if="!this_audio_lyrics_info_byte_model"-->
                      <!--                        <div v-else-->
                      <!--                          v-for="(byte, num) in this_audio_lyrics_info_byte_font[index]"-->
                      <!--                          class="lyrics_text_active"-->
                      <!--                          style="padding-left: 0;margin-right: 1px;"-->
                      <!--                        >-->
                      <!--                          {{ byte }}-->
                      <!--                        </div>-->
                    </n-list-item>
                  </template>
                </n-list>
              </div>
              <!-- Album -->
              <n-space
                v-if="store_system_configs_info.window_state_miniplayer_album"
                :style="{
                  opacity: collapsed_action_bar ? 0 : 1,
                  transition: 'opacity 0.4s, margin 0.4s',
                }"
                style="position: absolute; bottom: 80px; z-index: 1"
              >
                <n-tooltip trigger="hover" placement="top">
                  <template #trigger>
                    <div class="button_open_player_view">
                      <n-button
                        class="mini_album"
                        style="margin-top: 4px"
                        quaternary
                        @mouseover="hover_back_img"
                        @mouseout="leave_back_svg"
                        @click="
                          async () => {
                            store_system_configs_info.window_state_miniplayer_card = false
                            store_system_configs_info.window_state_miniplayer_desktop_lyric = false
                            store_system_configs_info.window_state_miniplayer_album = false
                            show_mini_album_model = false
                            collapsed_action_bar = true
                            await ipcRenderer.invoke('window-state-miniplayer-show')
                            await ipcRenderer.invoke('window-state-miniplayer-show')
                            playerAppearanceStore.player_collapsed_action_bar_of_Immersion_model = false
                          }
                        "
                      >
                        <template #icon>
                          <n-icon size="24" :depth="2"><ShareCloseTray24Regular /></n-icon>
                        </template>
                      </n-button>
                    </div>
                  </template>
                  {{ $t('Off') + $t('LabelAlbum') }}
                </n-tooltip>
                <div class="bar_left_text_info" style="margin-left: -6px">
                  <n-space>
                    <n-ellipsis style="color: white; width: 250px">
                      <span id="bar_so_name">{{ this_audio_song_name }}</span>
                    </n-ellipsis>
                  </n-space>
                  <n-space style="margin-top: -2px">
                    <n-ellipsis style="width: 250px; color: #929292">
                      <template v-for="artist in this_audio_artist_name.split(/[\/|｜、]/)">
                        <span id="bar_ar_name_part">{{ artist + '&nbsp' }}</span>
                      </template>
                      <span id="bar_al_name">{{ '—&nbsp' + this_audio_album_name }}</span>
                    </n-ellipsis>
                  </n-space>
                </div>
              </n-space>
              <!-- Slider -->
              <n-space
                align="center"
                justify="center"
                style="z-index: 3"
                :style="{
                  marginTop:
                    !store_system_configs_info.window_state_miniplayer_card &&
                    !store_system_configs_info.window_state_miniplayer_desktop_lyric &&
                    !store_system_configs_info.window_state_miniplayer_album
                      ? '-52px'
                      : store_system_configs_info.window_state_miniplayer_album
                        ? '166px'
                        : '-3px',
                  opacity:
                    store_system_configs_info.window_state_miniplayer_album && collapsed_action_bar
                      ? 0
                      : 1,
                  transition: 'opacity 0.4s, margin 0.4s',
                }"
              >
                <n-space
                  :style="{
                    color: !store_system_configs_info.window_state_miniplayer_album
                      ? '#FFFFFF80'
                      : '#FFFFFF',
                  }"
                  style="width: 32px; font-size: 12px"
                >
                  {{ current_play_time }}
                </n-space>
                <n-slider
                  style="
                    width: 220px;
                    --n-fill-color: #ffffff;
                    --n-fill-color-hover: #ffffff;
                    --n-rail-height: 3px;
                    --n-handle-size: 20px;
                    border-radius: 20px;
                  "
                  v-model:value="slider_singleValue"
                  :min="0"
                  :max="100"
                  :format-tooltip="
                    (value) => {
                      return playerSettingStore.formatTime(
                        (value / 100) * playerSettingStore.player.isDuration
                      )
                    }
                  "
                  :on-dragend="
                    () => {
                      if (slider_singleValue >= 99.5 || slider_singleValue == 0) {
                        playerSettingStore.player_is_play_ended = true
                        playerSettingStore.play_go_duration(slider_singleValue, true)
                      }
                      playerSettingStore.player_range_duration_isDragging = false
                    }
                  "
                  @click="
                    () => {
                      playerSettingStore.play_go_duration(slider_singleValue, true)
                    }
                  "
                  @mousedown="playerSettingStore.player_range_duration_isDragging = true"
                  @mouseup="playerSettingStore.player_range_duration_isDragging = false"
                >
                  <template #thumb>
                    <n-icon-wrapper color="white" :size="12" />
                  </template>
                </n-slider>
                <n-space
                  :style="{
                    color: !store_system_configs_info.window_state_miniplayer_album
                      ? '#FFFFFF80'
                      : '#FFFFFF',
                  }"
                  style="width: 32px; font-size: 12px"
                >
                  {{ total_play_time }}
                </n-space>
              </n-space>
              <!-- Button -->
              <n-space
                justify="center"
                style="z-index: 3"
                :style="{
                  marginTop:
                    !store_system_configs_info.window_state_miniplayer_card &&
                    !store_system_configs_info.window_state_miniplayer_desktop_lyric &&
                    !store_system_configs_info.window_state_miniplayer_album
                      ? '-37px'
                      : '-4px',
                  opacity:
                    store_system_configs_info.window_state_miniplayer_album && collapsed_action_bar
                      ? 0
                      : 1,
                  transition: 'opacity 0.4s, margin 0.4s',
                }"
              >
                <n-space class="grid_Middle_button_area" justify="center">
                  <n-tooltip
                    v-if="!store_system_configs_info.window_state_miniplayer_desktop_lyric"
                    trigger="hover"
                    placement="top"
                  >
                    <template #trigger>
                      <n-button
                        quaternary
                        size="small"
                        style="margin-right: -10px"
                        @click="
                          async () => {
                            store_system_configs_info.window_state_miniplayer_card = true
                            store_system_configs_info.window_state_miniplayer_desktop_lyric = true
                            store_system_configs_info.window_state_miniplayer_album = false
                            show_mini_album_model = false
                            collapsed_action_bar = true
                            await ipcRenderer.invoke('window-state-miniplayer-desktop-lyric-show')
                            await ipcRenderer.invoke('window-state-miniplayer-desktop-lyric-show')
                          }
                        "
                      >
                        <template #icon>
                          <n-icon :size="20"><TextAddSpaceAfter24Filled /></n-icon>
                        </template>
                      </n-button>
                    </template>
                    {{ $t('ButtonOpen') + $t('nsmusics.view_page.desktop_lyrics') }}
                  </n-tooltip>
                  <n-tooltip v-else trigger="hover" placement="top">
                    <template #trigger>
                      <n-button
                        quaternary
                        size="small"
                        style="margin-right: -10px"
                        @click="
                          async () => {
                            store_system_configs_info.window_state_miniplayer_card = false
                            store_system_configs_info.window_state_miniplayer_desktop_lyric = false
                            store_system_configs_info.window_state_miniplayer_album = false
                            show_mini_album_model = false
                            collapsed_action_bar = true
                            await ipcRenderer.invoke('window-state-miniplayer-show')
                            await ipcRenderer.invoke('window-state-miniplayer-show')
                          }
                        "
                      >
                        <template #icon>
                          <n-icon :size="20"><TextAddSpaceAfter24Filled /></n-icon>
                        </template>
                      </n-button>
                    </template>
                    {{ $t('Off') + $t('nsmusics.view_page.desktop_lyrics') }}
                  </n-tooltip>
                  <n-tooltip
                    v-if="!store_system_configs_info.window_state_miniplayer_card"
                    trigger="hover"
                    placement="top"
                  >
                    <template #trigger>
                      <n-button
                        quaternary
                        size="small"
                        style="margin-right: 10px"
                        @click="
                          async () => {
                            store_system_configs_info.window_state_miniplayer_card = true
                            store_system_configs_info.window_state_miniplayer_desktop_lyric = false
                            store_system_configs_info.window_state_miniplayer_album = false
                            show_mini_album_model = false
                            collapsed_action_bar = true
                            await ipcRenderer.invoke('window-state-miniplayer-card-show')
                            await ipcRenderer.invoke('window-state-miniplayer-card-show')
                          }
                        "
                      >
                        <template #icon>
                          <n-icon :size="20"><SlideText24Regular /></n-icon>
                        </template>
                      </n-button>
                    </template>
                    {{ $t('Off') + $t('Lyric') }}
                  </n-tooltip>
                  <n-tooltip v-else trigger="hover" placement="top">
                    <template #trigger>
                      <n-button
                        quaternary
                        size="small"
                        style="margin-right: 10px"
                        @click="
                          async () => {
                            store_system_configs_info.window_state_miniplayer_card = false
                            store_system_configs_info.window_state_miniplayer_desktop_lyric = false
                            store_system_configs_info.window_state_miniplayer_album = false
                            show_mini_album_model = false
                            collapsed_action_bar = true
                            await ipcRenderer.invoke('window-state-miniplayer-show')
                            await ipcRenderer.invoke('window-state-miniplayer-show')
                          }
                        "
                      >
                        <template #icon>
                          <n-icon :size="20"><SlideText24Regular /></n-icon>
                        </template>
                      </n-button>
                    </template>
                    {{ $t('ButtonOpen') + $t('Lyric') }}
                  </n-tooltip>
                  <n-tooltip trigger="hover" placement="top">
                    <template #trigger>
                      <n-button
                        quaternary
                        size="small"
                        @click="
                          playerSettingStore.player_click_state_of_play_skip_back =
                            !playerSettingStore.player_click_state_of_play_skip_back
                        "
                      >
                        <template #icon>
                          <n-icon :size="20"><PlayBack /></n-icon>
                        </template>
                      </n-button>
                    </template>
                    {{ $t('player.previous') }}
                  </n-tooltip>
                  <n-tooltip trigger="hover" placement="top">
                    <template #trigger>
                      <n-button
                        quaternary
                        @click="
                          playerSettingStore.player_state_play_click =
                            !playerSettingStore.player_state_play_click
                        "
                        style="margin-top: -1.5px; margin-left: -10px; margin-right: -10px"
                      >
                        <template #icon>
                          <n-icon v-if="playerSettingStore.player.isPlaying" :size="28"
                            ><Pause
                          /></n-icon>
                          <n-icon v-else :size="28"><Play /></n-icon>
                        </template>
                      </n-button>
                    </template>
                    {{ $t('Play') + ' | ' + $t('ButtonPause') }}
                  </n-tooltip>
                  <n-tooltip trigger="hover" placement="top">
                    <template #trigger>
                      <n-button
                        quaternary
                        size="small"
                        @click="
                          playerSettingStore.player_click_state_of_play_skip_forward =
                            !playerSettingStore.player_click_state_of_play_skip_forward
                        "
                      >
                        <template #icon>
                          <n-icon :size="20"><PlayForward /></n-icon>
                        </template>
                      </n-button>
                    </template>
                    {{ $t('player.next') }}
                  </n-tooltip>
                  <n-tooltip trigger="hover" placement="top">
                    <template #trigger>
                      <n-button
                        quaternary
                        size="small"
                        style="margin-left: 10px"
                        @click="
                          async () => {
                            store_system_configs_info.window_state_miniplayer_card = false
                            store_system_configs_info.window_state_miniplayer_desktop_lyric = false
                            store_system_configs_info.window_state_miniplayer_album = false
                            show_mini_album_model = false
                            collapsed_action_bar = true
                            await ipcRenderer.invoke('window-state-miniplayer-show')
                            await ipcRenderer.invoke('window-state-miniplayer-show')
                            playerAppearanceStore.player_collapsed_action_bar_of_Immersion_model = false
                            ///
                            show_more_options = !show_more_options
                          }
                        "
                      >
                        <template #icon>
                          <n-icon :size="20"><MoreHorizontal24Filled /></n-icon>
                        </template>
                      </n-button>
                    </template>
                    {{ $t('ButtonMore') }}
                  </n-tooltip>
                  <n-tooltip trigger="hover" placement="top">
                    <template #trigger>
                      <n-button
                        quaternary
                        size="small"
                        style="margin-left: -10px"
                        @click="
                          async () => {
                            store_system_configs_info.window_state_miniplayer_card = false
                            store_system_configs_info.window_state_miniplayer_desktop_lyric = false
                            store_system_configs_info.window_state_miniplayer_album = false
                            show_mini_album_model = false
                            collapsed_action_bar = true
                            await ipcRenderer.invoke('window-state-miniplayer-show')
                            await ipcRenderer.invoke('window-state-miniplayer-show')
                            playerAppearanceStore.player_collapsed_action_bar_of_Immersion_model = false
                            ///
                            store_system_configs_info.window_state_miniplayer_playlist =
                              !store_system_configs_info.window_state_miniplayer_playlist
                          }
                        "
                      >
                        <template #icon>
                          <n-icon :size="20"><QueueMusicRound /></n-icon>
                        </template>
                      </n-button>
                    </template>
                    {{ $t('Playlists') }}
                  </n-tooltip>
                </n-space>
              </n-space>
            </n-space>
          </n-flex>
        </n-config-provider>
        <!-- right drwaer of more -->
        <n-config-provider :theme="darkTheme">
          <n-drawer
            v-model:show="show_more_options"
            :width="190"
            style="
              border-radius: 12px 0 0 12px;
              border: 1.5px solid #ffffff20;
              background-color: rgba(127, 127, 127, 0.1);
              backdrop-filter: blur(10px);
              margin-top: 466px;
              margin-bottom: 72px;
            "
          >
            <n-drawer-content>
              <template #default>
                <div class="gird_Right_button_area" style="margin-top: 16px">
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
                    <n-tooltip
                      trigger="hover"
                      placement="top"
                      v-if="
                        (store_server_users.server_select_kind != 'jellyfin' &&
                          store_server_users.server_select_kind != 'emby') ||
                        store_server_user_model.model_server_type_of_local
                      "
                    >
                      <template #trigger>
                        <n-rate
                          clearable
                          size="small"
                          v-model:value="this_audio_song_rating"
                          @update:value="
                            (value: number) => handleItemClick_Rating(this_audio_song_id, value)
                          "
                        />
                      </template>
                      {{ $t('filter.rating') }}
                    </n-tooltip>
                    <n-tooltip trigger="hover" placement="top">
                      <template #trigger>
                        <n-button
                          size="tiny"
                          text
                          @click="
                            handleItemClick_Favorite(this_audio_song_id, this_audio_song_favorite)
                          "
                        >
                          <template #icon>
                            <n-icon
                              v-if="this_audio_song_favorite"
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
                  </n-space>
                </div>
              </template>
            </n-drawer-content>
          </n-drawer>
        </n-config-provider>
      </n-space>
    </n-space>
  </div>
</template>

<style scoped>
#player_bg_zindex_0 {
  position: absolute;
  object-fit: cover;
  object-position: center;
  z-index: -2;
  transition: filter 0.5s ease;
}
.player_bg_zindex_0_auto_rotateDefault {
  animation: moveInCircleDefault 60s linear infinite;
  transform-origin: center center;
}
@keyframes moveInCircleDefault {
  0% {
    transform: translate(calc(50px * cos(0deg)), calc(50px * sin(0deg))) rotate(0deg) scale(120%);
  }
  25% {
    transform: translate(calc(50px * cos(90deg)), calc(50px * sin(90deg))) rotate(90deg) scale(160%);
  }
  50% {
    transform: translate(calc(50px * cos(180deg)), calc(50px * sin(180deg))) rotate(180deg)
      scale(200%);
  }
  75% {
    transform: translate(calc(50px * cos(270deg)), calc(50px * sin(270deg))) rotate(270deg)
      scale(160%);
  }
  100% {
    transform: translate(calc(50px * cos(360deg)), calc(50px * sin(360deg))) rotate(360deg)
      scale(120%);
  }
}
@keyframes moveInCircleRepeat {
  0% {
    transform: translate(calc(50px * cos(0deg)), calc(50px * sin(0deg))) rotate(0deg) scale(120%);
  }
  25% {
    transform: translate(calc(50px * cos(90deg)), calc(50px * sin(90deg))) rotate(90deg) scale(200%);
  }
  50% {
    transform: translate(calc(50px * cos(180deg)), calc(50px * sin(180deg))) rotate(180deg)
      scale(280%);
  }
  75% {
    transform: translate(calc(50px * cos(270deg)), calc(50px * sin(270deg))) rotate(270deg)
      scale(200%);
  }
  100% {
    transform: translate(calc(50px * cos(360deg)), calc(50px * sin(360deg))) rotate(360deg)
      scale(120%);
  }
}

.lyrics_info {
  /* color: v-bind(player_lyric_color); */
  color: transparent;
  margin-top: 6px;
  line-height: 1.2;
  padding-left: 8px;
  min-height: 50px;
  cursor: pointer;
  border-radius: 10px;
  transition:
    color 0.5s,
    background-color 0.5s;
  filter: blur(0.07px);
}
.lyrics_info:hover {
  background-color: #ffffff16;
}
.lyrics_text_active {
  font-size: 20px;
  /* display: inline-block;
  white-space: pre; */
  transition: color 0.2s;
}

.gird_Left {
  width: 350px;
  height: 80px;
  margin-left: -2px;
  margin-top: 6px;

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
.gird_Left .button_open_player_view .mini_album {
  width: 60px;
  height: 60px;
  background-color: #18181890;
  border: 0;
  position: absolute;
  z-index: 1;
}
.gird_Left .button_open_player_view .back_img {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  border: 0;
  z-index: 0;
}
.gird_Left .bar_left_text_info {
  width: 240px;
  height: 50px;
  margin-top: 21px;
  margin-left: 16px;
  float: left;
  text-align: left;
}
.gird_Left .bar_left_text_info #bar_so_name {
  font-size: 14px;
  color: white;
}
.gird_Left .bar_left_text_info #bar_ar_name_part {
  font-size: 14px;
  color: #929292;
}
.gird_Left .bar_left_text_info #bar_al_name {
  font-size: 14px;
  color: #929292;
}

.grid_Middle_button_area {
  display: flex;
  align-items: center;
}

::-webkit-scrollbar {
  display: none;
}
</style>
