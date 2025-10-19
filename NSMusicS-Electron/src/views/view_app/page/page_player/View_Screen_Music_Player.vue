<script setup lang="ts">
////// this_view resource
import {
  FullScreenMaximize24Filled,
  FullScreenMinimize24Filled,
  WindowNew16Regular,
} from '@vicons/fluent'
import { MotionPhotosAutoOutlined, MinusRound } from '@vicons/material'
import { Close } from '@vicons/carbon'
function getAssetImage(firstImage: string) {
  return new URL(firstImage, import.meta.url).href
}

////// navie ui views_components
// app theme
import { darkTheme, NCarousel, NCarouselItem, NIcon, NSlider } from 'naive-ui'
// vue3 function
import { ref, watch, watchEffect, onMounted, computed } from 'vue'
import { onBeforeUnmount } from 'vue'

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
//
const computed_i18n_Label_ViewSetConfig_Cover_5 = computed(() => t('Albums') + t('List'))
const computed_i18n_Label_ViewSetConfig_Cover_6 = computed(() =>
  t('nsmusics.view_player.view_seting.coverBase_6')
)

// audio_class & player_bar & player_view
import { store_player_view } from '@/views/view_app/page/page_player/store/store_player_view'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { usePlayerSettingStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerSettingStore'
import { usePlayerAudioStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAudioStore'

const playerSettingStore = usePlayerSettingStore()

// 在setup上下文中获取Store实例
const playerAppearanceStore = usePlayerAppearanceStore()
const playlistStore = usePlaylistStore()
const playerAudioStore = usePlayerAudioStore()
// 使用 storeToRefs 解构出所需的响应式属性
const {
  player_show,
  player_show_complete,
  player_show_hight_animation_value,
  player_show_of_control_info,
  player_collapsed_action_bar_of_Immersion_model,
  player_show_click,
  player_collapsed_album,
  player_collapsed_skin,
  player_lyric_fontSize,
  player_lyric_fontSize_Num,
  player_lyric_fontWeight,
  player_lyric_color,
  player_lyric_colorHover,
  player_lyric_color_hidden_value,
  player_lyric_color_hidden_coefficient,
  player_theme_Styles_Selected,
  player_background_model_num,
  player_use_lottie_animation,
  player_use_lyric_skip_forward,
  player_use_background_filter_blur,
  player_use_background_automatic_rotation,
  player_use_background_repeat_fill,
  player_use_playbar_auto_hide,
  player_mode_of_medialist_from_external_import,
  player_mode_of_lock_playlist,
} = storeToRefs(playerAppearanceStore)

const { playlist_MediaFiles_temporary_carousel } = storeToRefs(playlistStore)

const {
  this_audio_song_name,
  this_audio_artist_name,
  this_audio_album_name,
  page_top_album_image_url,
  this_audio_lyrics_info_line_font,
  this_audio_Index_of_play_list_carousel,
  play_list_carousel_model,
  this_audio_lyrics_loaded_complete,
  this_audio_lyrics_string,
  this_audio_lyrics_null,
  this_audio_lyrics_info_line_time,
  this_audio_cue_track_current_indexes,
  this_audio_lyrics_info_byte_time,
  page_top_vinyl_image_url,
  this_audio_lyrics_info_line_num,
  this_audio_lyrics_info_byte_model,
  this_audio_lyrics_info_byte_font,
} = storeToRefs(playerAudioStore)

////// lyircs load
let unwatch = watch(
  () => this_audio_lyrics_loaded_complete.value,
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
  if (this_audio_lyrics_string.value.length > 0) {
    if (this_audio_lyrics_null.value) {
      this_audio_lyrics_info_line_font.value.forEach(
        (item: any, index: number) => {
          if ((item != null || item != 'undefined' || item != '') && item === '未找到可用歌词') {
            this_audio_lyrics_info_line_font.value[index] =
              computed_i18n_Label_Lyric_Not_Find.value
          }
        }
      )
    }
    handleAuto_fontSize(player_lyric_fontSize_Num.value)
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
  try {
    setTimeout(() => {
      clearInterval(lyrics_animation)
      lyrics_animation = setInterval(async () => {
        for (let i = 0; i < this_audio_lyrics_info_line_time.value.length; i++) {
          if (
            playerSettingStore.player !== null &&
            (await playerSettingStore.player.getCurrentTime()) !== undefined &&
            (await playerSettingStore.player.getCurrentTime()) !== null
          ) {
            let currentTime = (await playerSettingStore.player.getCurrentTime()) * 1000
            ///
            if (playerSettingStore.player_model_cue) {
              if (this_audio_cue_track_current_indexes.value.length > 0) {
                const track_str =
                  this_audio_cue_track_current_indexes.value[0].TIME
                if (track_str.length > 0) {
                  currentTime = currentTime - playerSettingStore.formatStrTime(track_str)
                }
              }
            }
            ///
            if (currentTime <= this_audio_lyrics_info_line_time.value[0]) {
              if (
                !lyrics_list_whell.value &&
                (isFirstRun || store_player_view.currentScrollIndex !== 0)
              ) {
                store_player_view.currentScrollIndex = 0
                scrollToItem(this_audio_lyrics_info_line_num.value)
              }
              break
            } else if (currentTime >= this_audio_lyrics_info_line_time.value[i]) {
              if (i === playerAudioStore.this_audio_lyrics_info_line_time.length - 1) {
                if (
                  !lyrics_list_whell.value &&
                  (isFirstRun || store_player_view.currentScrollIndex !== i)
                ) {
                  store_player_view.currentScrollIndex = i
                  scrollToItem(i + this_audio_lyrics_info_line_num.value)
                }
                break
              } else if (
                currentTime < this_audio_lyrics_info_line_time.value[i + 1]
              ) {
                if (
                  !lyrics_list_whell.value &&
                  (isFirstRun || store_player_view.currentScrollIndex !== i)
                ) {
                  store_player_view.currentScrollIndex = i
                  scrollToItem(i + this_audio_lyrics_info_line_num.value)
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
          if (scrollbar.value) {
            const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info')
            const itemElements_active = scrollbar.value.$el.querySelectorAll('.lyrics_text_active')
            let color_hidden = player_lyric_color.value.slice(0, -2)
            const index =
              store_player_view.currentScrollIndex +
              this_audio_lyrics_info_line_num.value
            scrollToItem(index)
            for (let i = index - 16; i <= index + 16; i++) {
              const colorValue = Math.max(
                player_lyric_color_hidden_value.value -
                  (index - i) * player_lyric_color_hidden_coefficient.value,
                0
              )
              if (i < index) {
                if (player_use_lyric_skip_forward.value) {
                  itemElements[i].style.color = 'transparent'
                } else {
                  itemElements[i].style.color =
                    colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`
                }
                itemElements[i].style.transform = 'scale(1)'
                itemElements[i].style.textShadow = '0 0 0px transparent'
                itemElements[i].style.width = 'calc(40vw)'
              } else if (i !== index) {
                itemElements[i].style.color =
                  colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`
                itemElements[i].style.transform = 'scale(1)'
                itemElements[i].style.textShadow = '0 0 0px transparent'
                itemElements[i].style.width = 'calc(40vw)'
                itemElements_active[i].style.fontWeight = 400
              }
            }
          }
        }
      }, 50)
    }, 500) // 防止在歌词列表数据未刷新显示完全而执行歌词项跳转，而导致的面板上移
  } catch {}
}
let lyrics_animation: string | number | NodeJS.Timeout | undefined
const handleItemDbClick = async (index: any) => {
  if (index < this_audio_lyrics_info_line_num.value) return
  if (
    index >
    this_audio_lyrics_info_line_font.value.length -
      this_audio_lyrics_info_line_num.value -
      1
  )
    return
  const time =
    this_audio_lyrics_info_line_time.value[
      index - this_audio_lyrics_info_line_num.value
    ]
  if (time >= (await playerSettingStore.player.getDuration()) * 1000) return
  if (time < 0) return
  if (!playerSettingStore.player_model_cue) {
    playerSettingStore.player_go_lyric_line_index_of_audio_play_progress = time
  } else {
    if (this_audio_cue_track_current_indexes.value.length > 0) {
      const track_str = this_audio_cue_track_current_indexes.value[0].TIME
      if (track_str.length > 0) {
        let track_time = playerSettingStore.formatStrTime(track_str)
        track_time = time + track_time
        playerSettingStore.player.setCurrentTime(track_time / 1000)
      }
    }
  }
  store_player_view.currentScrollIndex = index

  handleLeave_Refresh_Lyric_Color()
}
const scrollbar = ref<any>(null)
const perviousIndex = ref(0)
const scrollToItem = (index: number) => {
  try {
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
    itemElements_active[index].style.fontSize = player_lyric_fontSize.value
    itemElements_active[index].style.fontWeight = player_lyric_fontWeight.value

    const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info')
    itemElements[index].style.color = player_lyric_colorHover.value
    itemElements[index].style.filter = 'blur(0px)'
    itemElements[index].style.textShadow = '0 0 1px White'
    itemElements[index].style.transition = 'color 0.5s, transform 0.5s'
    if (!player_collapsed_album.value) {
      itemElements[index].style.transform = 'scale(1.1) translateY(0px)'
      itemElements[index].style.transformOrigin = 'left center'
      itemElements[index].style.width = 'calc(36.3vw)'
    } else {
      itemElements[index].style.transform = 'scale(1.1) translateX(0px)'
      itemElements[index].style.transformOrigin = 'center'
      itemElements[index].style.width = 'calc(40vw)'
    }
    if (store_player_view.currentScrollIndex === 0)
      itemElements[index].scrollIntoView({ block: 'center', behavior: 'instant' })
    else itemElements[index].scrollIntoView({ block: 'center', behavior: 'smooth' })
    // 设置前后16列的颜色
    handleLeave_Refresh_Lyric_Color()
    // 设置perviousIndex.value列的颜色
    let color_hidden = player_lyric_color.value.slice(0, -2)
    for (let i = index - 16; i <= index + 16; i++) {
      if (i < index) {
        if (player_use_lyric_skip_forward.value) {
          itemElements[i].style.color = 'transparent'
        } else if (i != index) {
          const colorValue = Math.max(
            player_lyric_color_hidden_value.value -
              (index - i) * player_lyric_color_hidden_coefficient.value,
            0
          )
          itemElements[i].style.color =
            colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`
        }
        itemElements[i].style.transform = 'scale(1)'
        itemElements[i].style.textShadow = '0 0 0px transparent'
        itemElements[i].style.width = 'calc(40vw)'
        itemElements_active[i].style.fontWeight = 400
      } else if (i != index) {
        const colorValue = Math.max(
          player_lyric_color_hidden_value.value -
            (index - i) * player_lyric_color_hidden_coefficient.value,
          0
        )
        itemElements[i].style.color =
          colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`
        itemElements[i].style.transform = 'scale(1)'
        itemElements[i].style.textShadow = '0 0 0px transparent'
        itemElements[i].style.width = 'calc(40vw)'
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
  } catch {}
}

const lastIndex = ref(-1)
const startByteAnimations = (index: number, num: number) => {
  try {
    if (!scrollbar.value) return
    const itemElements_active = scrollbar.value.$el.querySelectorAll('.lyrics_text_active')
    let position_i_length = this_audio_lyrics_info_byte_time.value.reduce(
      (acc: any, curr: any) => {
        return acc + curr.length
      },
      0
    )
    let position_i_start = this_audio_lyrics_info_byte_time.value
      .slice(0, index)
      .reduce((acc: any, curr: any) => {
        return acc + curr.length
      }, 0)
    let position_i_end = this_audio_lyrics_info_byte_time.value
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

      itemElements_active[i].style.fontSize = player_lyric_fontSize.value
      itemElements_active[i].style.fontWeight = 400

      itemElements_active[i].style.filter = 'blur(0px)'
      itemElements_active[i].style.transition = 'color 0.5s, transform 0.5s'
      if (!player_collapsed_album.value) {
        itemElements_active[i].style.transform = 'scale(1.1) translateY(0px)'
        itemElements_active[i].style.transformOrigin = 'left center'
        itemElements_active[i].style.width = 'calc(36.3vw)'
      } else {
        itemElements_active[i].style.transform = 'scale(1.1) translateX(0px)'
        itemElements_active[i].style.transformOrigin = 'center'
        itemElements_active[i].style.width = 'calc(40vw)'
      }

      let tempwidth = parseFloat(window.getComputedStyle(itemElements_active[i]).width)
      itemElements_active[i].style.marginRight = `${tempwidth / 10}px`
    }

    for (let i = position_i_start; i < position_i_end; i++) {
      const byteTime =
        playerAudioStore.this_audio_lyrics_info_byte_time[index][i - position_i_start]
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
      let color_hidden = player_lyric_color.value.slice(0, -2)
      for (let i = 0; i < position_i_start; i++) {
        const colorValue = Math.max(
          player_lyric_color_hidden_value.value -
            (index - i) * player_lyric_color_hidden_coefficient.value,
          0
        )
        itemElements_active[i].style.color =
          colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`
        itemElements_active[i].style.transform = 'scale(1)'
        itemElements_active[i].style.background =
          `linear-gradient(90deg, #FFFFFF 0px, #FAFAFB60 0px) 0 0`
        itemElements_active[i].style.backgroundClip = `text`
        itemElements_active[i].style.textShadow = `0 0 2px transparent`

        itemElements_active[i].style.marginRight = `0px`
        itemElements_active[i].style.width = 'calc(40vw)'
      }
      for (let i = position_i_end; i <= position_i_length; i++) {
        const colorValue = Math.max(
          player_lyric_color_hidden_value.value -
            (i - index) * player_lyric_color_hidden_coefficient.value,
          0
        )
        itemElements_active[i].style.color =
          colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`
        itemElements_active[i].style.transform = 'scale(1)'
        itemElements_active[i].style.background =
          `linear-gradient(90deg, #FFFFFF 0px, #FAFAFB60 0px) 0 0`
        itemElements_active[i].style.backgroundClip = `text`
        itemElements_active[i].style.textShadow = `0 0 2px transparent`

        itemElements_active[i].style.marginRight = `0px`
        itemElements_active[i].style.width = 'calc(40vw)'
      }
    } catch (e) {}
  } catch (e) {}
}
let intervals: any[] = []
const lyrics_list_whell = ref(false)
const handleWheel = (event: any) => {
  handleClear_Lyric_Color()
}
function handleClear_Lyric_Color() {
  try {
    lyrics_list_whell.value = true
    if (!scrollbar.value) return
    const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info')
    for (let i = 0; i < itemElements.length; i++) {
      itemElements[i].style.color = '#FFFFFF99'
      itemElements[i].style.transform = 'scale(1)'
      itemElements[i].style.filter = 'blur(0px)'
      itemElements[i].style.width = 'calc(40vw)'
    }
  } catch {}
}
const handleLeave_Refresh_Lyric_Color = () => {
  try {
    lyrics_list_whell.value = false
    if (!scrollbar.value) return
    const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info')
    let lyric_bottom_hidden_num = player_use_lyric_skip_forward.value ? 0 : 10
    let color_hidden = player_lyric_color.value.slice(0, -2)
    for (let i = perviousIndex.value - 16; i <= perviousIndex.value + 16; i++) {
      if (i < perviousIndex.value) {
        const colorValue = Math.max(
          player_lyric_color_hidden_value.value +
            lyric_bottom_hidden_num -
            (perviousIndex.value - i) * player_lyric_color_hidden_coefficient.value,
          0
        )
        try {
          if (player_use_lyric_skip_forward.value) {
            itemElements[i].style.color = 'transparent'
          } else {
            itemElements[i].style.color =
              colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`
          }
        } catch {}
      } else {
        const colorValue = Math.max(
          player_lyric_color_hidden_value.value +
            lyric_bottom_hidden_num -
            (i - perviousIndex.value) * player_lyric_color_hidden_coefficient.value,
          0
        )
        try {
          itemElements[i].style.color =
            colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`
        } catch {}
      }
    }
  } catch {}
}
const handleAuto_fontSize = (value: number) => {
  try {
    player_lyric_fontSize_Num.value = value
    player_lyric_fontSize.value = value + 'px'
    if (!scrollbar.value) return
    const itemElements_active = scrollbar.value.$el.querySelectorAll('.lyrics_text_active')
    itemElements_active.forEach((itemElement: any) => {
      itemElement.style.fontSize = player_lyric_fontSize.value
      itemElement.style.fontWeight = 400
    })
    let marginTop = 6 + Math.floor((window.innerHeight - 880) / 200) * 0.5
    const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info')
    itemElements.forEach((itemElement: any) => {
      itemElement.style.marginTop = marginTop
      itemElement.style.lineHeight = marginTop * 2 * 0.1
    })
  } catch {}
}
watch(
  () => player_lyric_fontSize_Num,
  (newValue) => {
    handleLeave_Refresh_Lyric_Color()
    handleAuto_fontSize(newValue)
  }
)

////// player_configs theme BasicInfo
type PlayerTheme_Style = {
  image_url: any

  textAlign: any

  player_collapsed_album: any
  player_collapsed_skin: any
}
type PlayerTheme_LyricItem = {
  id: any
  name: any
  normalStyle: PlayerTheme_Style
}
import player_theme_1_png from '@/assets/img/player_theme_1.png'
import player_theme_2_png from '@/assets/img/player_theme_2.png'
import player_theme_3_png from '@/assets/img/player_theme_3.png'
import player_theme_4_png from '@/assets/img/player_theme_4.png'
import player_theme_5_png from '@/assets/img/player_theme_5.png'
import player_theme_6_png from '@/assets/img/player_theme_6.png'
import Animation_1715591164841 from '@/assets/lottie_json/Animation - 1715591164841.json'
import Animation_1715392202806 from '@/assets/lottie_json/Animation - 1715392202806.json'
import Animation_1715417974362 from '@/assets/lottie_json/Animation - 1715417974362.json'
const player_theme_1 = ref<PlayerTheme_LyricItem>({
  id: 0,
  name: computed_i18n_Label_ViewSetConfig_Cover_1.value,
  normalStyle: {
    image_url: player_theme_1_png,

    textAlign: true,

    player_collapsed_album: false,
    player_collapsed_skin: true,
  },
})
const player_theme_2 = ref<PlayerTheme_LyricItem>({
  id: 1,
  name: computed_i18n_Label_ViewSetConfig_Cover_2.value,
  normalStyle: {
    image_url: player_theme_2_png,

    textAlign: false,

    player_collapsed_album: false,
    player_collapsed_skin: true,
  },
})
const player_theme_3 = ref<PlayerTheme_LyricItem>({
  id: 2,
  name: computed_i18n_Label_ViewSetConfig_Cover_3.value,
  normalStyle: {
    image_url: player_theme_3_png,

    textAlign: true,

    player_collapsed_album: false,
    player_collapsed_skin: true,
  },
})
const player_theme_4 = ref<PlayerTheme_LyricItem>({
  id: 3,
  name: computed_i18n_Label_ViewSetConfig_Cover_4.value,
  normalStyle: {
    image_url: player_theme_4_png,

    textAlign: false,

    player_collapsed_album: true,
    player_collapsed_skin: true,
  },
})
const player_theme_5 = ref<PlayerTheme_LyricItem>({
  id: 4,
  name: computed_i18n_Label_ViewSetConfig_Cover_5.value,
  normalStyle: {
    image_url: player_theme_5_png,

    textAlign: false,

    player_collapsed_album: true,
    player_collapsed_skin: true,
  },
})
const player_theme_6 = ref<PlayerTheme_LyricItem>({
  id: 5,
  name: computed_i18n_Label_ViewSetConfig_Cover_6.value,
  normalStyle: {
    image_url: player_theme_6_png,

    textAlign: false,

    player_collapsed_album: true,
    player_collapsed_skin: true,
  },
})
const player_theme_Styles = ref<PlayerTheme_LyricItem[]>([
  player_theme_1.value, // play model 1 ：方形封面
  player_theme_2.value, // play model 2 ：旋转封面
  player_theme_3.value, // play model 3 ：炫胶唱片
  player_theme_4.value, // play model 4 ：专辑底图
  player_theme_5.value, // play model 5 ：皮肤底图  :disabled
  // player_theme_6.value, // play model 5 ：皮肤底图  :disabled
])

////// player_configs bind theme_all
const player_theme_0_bind_style = ref<PlayerTheme_LyricItem>(
  player_theme_Styles.value[player_theme_Styles_Selected.value]
)
const player_theme_set_theme = (index: number) => {
  try {
    if (index < 0 || index >= player_theme_Styles.value.length) {
      return
    }
    // set theme
    player_theme_0_bind_style.value = player_theme_Styles.value[index]

    player_theme_Styles_Selected.value = index
    player_background_model_num.value = player_theme_0_bind_style.value.id
    player_collapsed_album.value =
      player_theme_0_bind_style.value.normalStyle.player_collapsed_album
    player_collapsed_skin.value = player_theme_0_bind_style.value.normalStyle.player_collapsed_skin

    const index_lyric =
      store_player_view.currentScrollIndex + playerAudioStore.this_audio_lyrics_info_line_num
    const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info')
    if (!player_collapsed_album.value) {
      itemElements[index_lyric].style.transformOrigin = 'left center'
    } else {
      itemElements[index_lyric].style.transformOrigin = 'center'
    }

    init_player_theme()

    store_system_configs_save.save_system_config_of_Player_Configs_of_UI()
  } catch {}
}
function init_player_theme() {
  player_show_of_control_info.value = player_background_model_num.value !== 0
  player_lyric_fontSize_Num.value = player_use_lyric_skip_forward
    ? 36 + Math.floor((window.innerHeight - 880) / 200) * 6
    : 33 + Math.floor((window.innerHeight - 880) / 200) * 6
  player_lyric_fontSize.value = `${player_lyric_fontSize_Num.value}px`
}

////// player_configs page_ui set
enum LyricAnimation {
  linebyLine,
  linebyWord,
  linebyJump,
}
const player_lyric_panel_checked_animation = ref<LyricAnimation>(LyricAnimation.linebyLine)

////// player_configs this_audio(play_info , other_info) model check
const checkStrategy = ref<'player' | 'related'>('player')

////// player_bar auto hidden
let timer_auto_hidden: string | number | NodeJS.Timeout | undefined
const handleMouseMove = () => {
  player_collapsed_action_bar_of_Immersion_model.value = false
  clearInterval(timer_auto_hidden)
  timer_auto_hidden = setInterval(() => {
    if (player_show.value) {
      if (player_use_playbar_auto_hide.value) {
        player_collapsed_action_bar_of_Immersion_model.value = true
      }
    }
  }, 1000)
}
const unwatch_player_collapsed = watchEffect(() => {
  if (!playerAppearanceStore.player_collapsed_action_bar_of_Immersion_model) {
    clearInterval(timer_auto_hidden)
  }
})

////// Animation lottie Load // lottie-web will cause memory leaks，so replace lottie-player_configs
import '@lottiefiles/lottie-player'
import { usePlayerAppearanceStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAppearanceStore'
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import Table_Album_Model_1_AlbumScroll from '@/views/view_app/page/page_player/components/Table_Album_Model_1_AlbumScroll.vue'
import { ArrowsMaximize, ArrowsMinimize } from '@vicons/tabler'

import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'
import { storeToRefs } from 'pinia'

const clear_lottie_animationInstance = ref(false)

const animationInstance_model_1_spectrum = ref<any>(null)
const animationInstance_model_1_spectrum_copy = ref<any>(null)
const animationInstance_model_1_wave = ref<any>(null)
const animationInstance_model_2_wave = ref<any>(null)
const animationInstance_model_5_wave = ref<any>(null)
let unwatch_animationInstance = watch(
  () => playerSettingStore.player.isPlaying,
  (newValue) => {
    if (playerAppearanceStore.player_use_lottie_animation) {
      if (newValue) {
        if (playerAppearanceStore.player_background_model_num === 1) {
          animationInstance_model_1_spectrum.value.play()
          animationInstance_model_1_wave.value.play()
        }
        if (playerAppearanceStore.player_background_model_num === 2) {
          animationInstance_model_2_wave.value.play()
        }
        if (playerAppearanceStore.player_background_model_num === 4) {
          animationInstance_model_1_spectrum_copy.value.play()
        }
        if (playerAppearanceStore.player_background_model_num === 5) {
          animationInstance_model_5_wave.value.play()
        }
      } else {
        if (playerAppearanceStore.player_background_model_num === 1) {
          animationInstance_model_1_spectrum.value.pause()
          animationInstance_model_1_wave.value.pause()
        }
        if (playerAppearanceStore.player_background_model_num === 2) {
          animationInstance_model_2_wave.value.pause()
        }
        if (playerAppearanceStore.player_background_model_num === 4) {
          animationInstance_model_1_spectrum_copy.value.pause()
        }
        if (playerAppearanceStore.player_background_model_num === 5) {
          animationInstance_model_5_wave.value.pause()
        }
      }
    }
  }
)
let unwatch_player_background_model_num = watch(
  () => player_background_model_num.value,
  (newValue) => {
    if (playerAppearanceStore.player_use_lottie_animation) {
      if (playerAppearanceStore.player_background_model_num === 0) {
        animationInstance_model_1_spectrum.value.pause()
        animationInstance_model_1_wave.value.pause()
        animationInstance_model_2_wave.value.pause()
      }
      if (playerAppearanceStore.player_background_model_num === 1) {
        animationInstance_model_2_wave.value.pause()
      }
      if (playerAppearanceStore.player_background_model_num === 2) {
        animationInstance_model_1_spectrum.value.pause()
        animationInstance_model_1_wave.value.pause()
      }
      if (playerAppearanceStore.player_background_model_num === 4) {
        animationInstance_model_1_spectrum_copy.value.pause()
      }
      if (playerAppearanceStore.player_background_model_num === 5) {
        animationInstance_model_5_wave.value.pause()
      }
    }
  }
)

////// player_configs Remove data
onBeforeUnmount(() => {
  clearInterval(lyrics_animation)
  clearInterval(timer_auto_hidden)
  unwatch()

  unwatch_animationInstance()
  unwatch_player_background_model_num()
  if (playerAppearanceStore.player_use_lottie_animation) {
    animationInstance_model_1_spectrum.value.destroy()
    animationInstance_model_1_spectrum_copy.value.destroy()
    animationInstance_model_1_wave.value.destroy()
    animationInstance_model_2_wave.value.destroy()
    animationInstance_model_5_wave.value.destroy()
  }
  clear_lottie_animationInstance.value = true

  unwatch_player_collapsed()
  playerAppearanceStore.player_collapsed_action_bar_of_Immersion_model = false
})
</script>

<template>
  <div style="overflow: hidden" @mousemove="handleMouseMove" @click="handleMouseMove">
    <!-- background area -->
    <div>
      <!--Album-->
      <div
        v-if="player_collapsed_skin"
        id="player_bg_zindex_0"
        :style="{
          backgroundImage: `url(${getAssetImage(page_top_album_image_url)})`,
          filter: player_use_background_filter_blur
            ? 'brightness(46%) blur(40px)'
            : 'brightness(46%) blur(0px)',
          backgroundSize: player_use_background_repeat_fill ? '20vw auto' : 'cover',
          backgroundRepeat: player_use_background_repeat_fill ? 'repeat' : 'no-repeat',
          backgroundPosition: 'center',
        }"
        :class="{
          player_bg_zindex_0_auto_rotateDefault:
            player_use_background_automatic_rotation && !player_use_background_repeat_fill,
          player_bg_zindex_0_auto_rotateRepeat:
            player_use_background_automatic_rotation && player_use_background_repeat_fill,
        }"
      ></div>
      <!--Skin-->
      <img
        v-else
        id="player_bg_zindex_0"
        style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vw;

          margin-top: -20vw;
          object-fit: cover;
          object-position: center;
          filter: brightness(46%) blur(0px);
        "
        :src="getAssetImage(page_top_album_image_url)"
        alt=""
      />
      <div
        style="
          background-color: #000000;
          z-index: -3;
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vw;
        "
      ></div>
    </div>
    <!-- drwaer right area -->
    <n-config-provider :theme="darkTheme">
      <!-- right drwaer of Player_theme -->
      <n-drawer
        v-model:show="playerSettingStore.drawer_theme_show"
        :width="420"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #ffffff20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: calc(50vh - 340px);
          height: 680px;
        "
      >
        <n-drawer-content v-if="playerSettingStore.drawer_theme_show">
          <template #default>
            <n-space vertical align="center">
              <n-space vertical style="width: 380px">
                <n-radio-group
                  v-model:value="player_theme_Styles_Selected"
                  @update:value="player_theme_set_theme"
                  name="radiogroup"
                  :width="430"
                  style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                    align-items: center;
                    grid-gap: 0;
                    margin-left: 9px;
                    margin-top: 12px;
                  "
                >
                  <n-radio
                    v-for="item in player_theme_Styles"
                    :key="item.id"
                    v-model:value="item.id"
                    style="height: 100%; z-index: 9"
                  >
                    <n-space
                      vertical
                      justify="center"
                      style="position: relative; left: -27px; z-index: -1"
                    >
                      <img
                        :src="item.normalStyle.image_url"
                        style="
                          width: auto;
                          height: 100px;
                          object-fit: cover;
                          border-radius: 8px;
                          border: 1.5px solid #ffffff20;
                        "
                        alt=""
                      />
                      <span style="font-size: 16px; position: relative; top: -10px; left: 6px">
                        {{ item.name }}
                      </span>
                    </n-space>
                  </n-radio>
                </n-radio-group>
              </n-space>
              <n-space vertical align="start" style="width: 320px; margin-left: -26px">
                <n-space v-if="false" style="margin-top: 20px" justify="space-between">
                  <span style="font-size: 16px">{{
                    $t('nsmusics.view_player.view_seting.lyricSize')
                  }}</span>
                  <n-space style="margin-right: 32px">
                    <n-button
                      text
                      style="font-size: 24px; margin-top: 2px; margin-left: 7px"
                      @click="
                        () => {
                          handleAuto_fontSize(player_lyric_fontSize_Num)
                        }
                      "
                    >
                      <n-icon>
                        <MotionPhotosAutoOutlined />
                      </n-icon>
                    </n-button>
                    <n-input-number
                      v-model:value="player_lyric_fontSize_Num"
                      @update:value="handleAuto_fontSize"
                      clearable
                      :min="6"
                      :max="200"
                      style="width: 109px; margin-top: -4px; margin-left: 12px"
                    />
                  </n-space>
                </n-space>
                <n-space style="margin-top: 20px" v-if="false" justify="space-between">
                  <span style="font-size: 16px">{{
                    $t('nsmusics.view_player.view_seting.lyricWright')
                  }}</span>
                  <n-space style="margin-right: 32px">
                    <n-button
                      text
                      style="font-size: 24px; margin-top: 2px"
                      @click="handleAuto_fontSize(24)"
                    >
                      <n-icon>
                        <MotionPhotosAutoOutlined />
                      </n-icon>
                    </n-button>
                    <n-input-number
                      v-model:value="player_lyric_fontSize_Num"
                      @update:value="handleAuto_fontSize"
                      clearable
                      style="width: 109px; margin-top: -4px"
                    />
                  </n-space>
                </n-space>
                <n-space style="margin-top: 24px" v-if="false" justify="space-between">
                  <span style="font-size: 16px">歌词颜色</span>
                  <n-space style="margin-right: 32px">
                    <n-button text style="font-size: 24px">
                      <n-icon>
                        <MotionPhotosAutoOutlined />
                      </n-icon>
                    </n-button>
                    <n-color-picker style="width: 177px; margin-top: -4px" />
                  </n-space>
                </n-space>
                <n-space style="margin-top: 20px" v-if="false" justify="space-between">
                  <span style="font-size: 16px">{{
                    $t('nsmusics.view_player.view_seting.lyricSpeed')
                  }}</span>
                  <n-space style="margin-right: 32px">
                    <n-button text style="font-size: 24px; margin-top: 2px">
                      <n-icon>
                        <MotionPhotosAutoOutlined />
                      </n-icon>
                    </n-button>
                    <n-input-number
                      v-model:value="player_lyric_fontSize"
                      clearable
                      style="width: 109px; margin-top: -4px"
                    />
                  </n-space>
                </n-space>
                <n-space style="margin-top: 20px" v-if="false" justify="space-between">
                  <span style="font-size: 16px">歌词行距</span>
                  <n-space style="margin-right: 32px">
                    <n-button text style="font-size: 24px; margin-top: 2px">
                      <n-icon>
                        <MotionPhotosAutoOutlined />
                      </n-icon>
                    </n-button>
                    <n-input-number
                      v-model:value="player_lyric_fontSize"
                      clearable
                      style="width: 109px; margin-top: -4px"
                    />
                  </n-space>
                </n-space>
                <n-space style="margin-top: 20px" v-if="false" justify="space-between">
                  <span style="font-size: 16px">{{
                    $t('nsmusics.view_player.view_seting.lyricsAnimation')
                  }}</span>
                  <n-space style="width: 260px; margin-top: 2px">
                    <n-radio
                      :checked="player_lyric_panel_checked_animation === LyricAnimation.linebyLine"
                      @click="player_lyric_panel_checked_animation = LyricAnimation.linebyLine"
                    >
                      {{ $t('nsmusics.view_player.view_seting.lyricsAnimation_line_1') }}
                    </n-radio>
                    <n-radio
                      :checked="player_lyric_panel_checked_animation === LyricAnimation.linebyWord"
                      @click="player_lyric_panel_checked_animation = LyricAnimation.linebyWord"
                    >
                      {{ $t('nsmusics.view_player.view_seting.lyricsAnimation_byte_2') }}
                    </n-radio>
                    <n-radio
                      :checked="player_lyric_panel_checked_animation === LyricAnimation.linebyJump"
                      @click="player_lyric_panel_checked_animation = LyricAnimation.linebyJump"
                    >
                      {{ $t('nsmusics.view_player.view_seting.lyricsAnimation_jump_3') }}
                    </n-radio>
                  </n-space>
                </n-space>
                <n-space style="margin-top: 20px" justify="space-between">
                  <span style="font-size: 16px">{{
                    $t('nsmusics.view_player.view_seting.player_use_lottie')
                  }}</span>
                  <n-space style="margin-right: 32px">
                    <n-switch
                      v-model:value="player_use_lottie_animation"
                      @update:value="player_theme_set_theme(player_theme_Styles_Selected)"
                    >
                    </n-switch>
                  </n-space>
                </n-space>
                <n-divider style="margin: 8px 0; width: 336px" />
                <n-space justify="space-between">
                  <span style="font-size: 16px">{{ $t('nsmusics.view_page.hideHalfLyric') }}</span>
                  <n-space style="margin-right: 32px">
                    <n-switch
                      v-model:value="player_use_lyric_skip_forward"
                      @update:value="
                        () => {
                          playerSettingStore.player_slider_click = true
                          const index =
                            store_player_view.currentScrollIndex +
                            playerAudioStore.this_audio_lyrics_info_line_num
                          scrollToItem(index - 3)
                          scrollToItem(index)
                        }
                      "
                    >
                    </n-switch>
                  </n-space>
                </n-space>
                <n-divider style="margin: 8px 0; width: 336px" />
                <n-space justify="space-between">
                  <span style="font-size: 16px">{{
                    $t('nsmusics.view_player.view_seting.coverBaseVague') +
                    ' ' +
                    $t('setting.albumBackground')
                  }}</span>
                  <n-space style="margin-right: 32px">
                    <n-switch v-model:value="player_use_background_repeat_fill" />
                    <n-switch v-model:value="player_use_background_filter_blur" />
                  </n-space>
                </n-space>
                <n-space style="margin-top: 20px" justify="space-between">
                  <span style="font-size: 16px">{{
                    $t('Auto') + $t('MediaInfoRotation') + ' ' + $t('setting.albumBackground')
                  }}</span>
                  <n-space style="margin-right: 32px">
                    <n-switch v-model:value="player_use_background_automatic_rotation" />
                  </n-space>
                </n-space>
                <n-space style="margin-top: 20px" justify="space-between">
                  <span style="font-size: 16px">{{
                    $t('Horizontal') +
                    $t('Vertical') +
                    $t('AspectRatioFill') +
                    ' ' +
                    $t('setting.albumBackground')
                  }}</span>
                  <n-space style="margin-right: 32px">
                    <n-switch v-model:value="player_use_background_repeat_fill" />
                  </n-space>
                </n-space>
                <n-divider style="margin: 8px 0; width: 336px" />
                <n-space style="margin-top: 20px" v-if="false" justify="space-between">
                  <span style="font-size: 16px">{{
                    $t('nsmusics.view_player.view_seting.coverBaseVague')
                  }}</span>
                  <n-space style="margin-right: 32px">
                    <n-button text style="font-size: 24px; margin-top: 2px">
                      <n-icon>
                        <MotionPhotosAutoOutlined />
                      </n-icon>
                    </n-button>
                    <n-input-number
                      v-model:value="player_lyric_fontSize"
                      clearable
                      style="width: 109px; margin-top: -4px"
                    />
                  </n-space>
                </n-space>
                <n-space justify="space-between">
                  <span style="font-size: 16px">{{
                    $t('nsmusics.view_player.view_seting.player_use_playbar_auto_hide')
                  }}</span>
                  <n-space style="margin-right: 32px">
                    <n-switch v-model:value="player_use_playbar_auto_hide" />
                  </n-space>
                </n-space>
              </n-space>
            </n-space>
          </template>
        </n-drawer-content>
      </n-drawer>
    </n-config-provider>
    <!-- body -->
    <n-space vertical :size="12" style="z-index: 99; overflow: hidden">
      <!-- top bar -->
      <n-flex
        justify="space-between"
        :style="{
          opacity: player_collapsed_action_bar_of_Immersion_model ? 0 : 1,
          transition: 'opacity 0.4s',
        }"
        style="width: 100vw; z-index: 10; position: absolute"
      >
        <n-space style="-webkit-app-region: no-drag; margin-top: 35px; width: 200px">
          <div style="width: 200px"></div>
        </n-space>
        <!-- -->
        <n-flex justify="end" style="width: 400px; height: 70px">
          <div style="-webkit-app-region: no-drag; margin-top: 30px; margin-right: -8px">
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
                        ipcRenderer.send('window-fullscreen')
                      }
                      store_system_configs_info.window_full = !store_system_configs_info.window_full
                      store_system_configs_info.window_max = store_system_configs_info.window_full
                    }
                  "
                >
                  <template #icon>
                    <n-icon size="19" :depth="3" v-if="store_system_configs_info.window_full">
                      <ArrowsMinimize />
                    </n-icon>
                    <n-icon size="19" :depth="3" v-else>
                      <ArrowsMaximize />
                    </n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('ButtonFullscreen') }}
            </n-tooltip>
            <n-tooltip trigger="hover" placement="top" v-if="isElectron">
              <template #trigger>
                <n-button
                  quaternary
                  circle
                  :style="{
                    marginRight:
                      store_system_configs_info.desktop_system_kind != 'darwin' ? '4px' : '36px',
                  }"
                  @click="
                    async () => {
                      if (isElectron) {
                        // 请不要更改这段诡异的代码，它依靠Electron的BUG运行，呵呵
                        store_system_configs_info.window_state_miniplayer_card = false
                        store_system_configs_info.window_state_miniplayer_desktop_lyric = false
                        store_system_configs_info.window_state_miniplayer_album = false
                        ipcRenderer.send('window-state-miniplayer-open')
                        ipcRenderer.send('window-state-miniplayer-open')
                        //
                        store_system_configs_info.window_state_miniplayer =
                          !store_system_configs_info.window_state_miniplayer
                        //await ipcRenderer.invoke('get-window-state-miniplayer');
                      }
                    }
                  "
                >
                  <template #icon>
                    <n-icon size="24" :depth="3"><WindowNew16Regular /></n-icon>
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
                    <n-icon size="24" :depth="3"><MinusRound /></n-icon>
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
                  style="margin-right: 4px"
                  @click="
                    () => {
                      if (isElectron) {
                        ipcRenderer.send('window-max')
                      }
                      store_system_configs_info.window_max = !store_system_configs_info.window_max
                      store_system_configs_info.window_full = false
                    }
                  "
                >
                  <template #icon>
                    <n-icon size="20" :depth="3" v-if="store_system_configs_info.window_max"
                      ><FullScreenMinimize24Filled
                    /></n-icon>
                    <n-icon size="20" :depth="3" v-else><FullScreenMaximize24Filled /></n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('common.maximize') }}
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
                  style="margin-right: 30px"
                  @click="
                    () => {
                      if (isElectron) {
                        ipcRenderer.send('window-close')
                      }
                    }
                  "
                >
                  <template #icon>
                    <n-icon size="28" :depth="3"><Close /></n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('Off') }}
            </n-tooltip>
          </div>
        </n-flex>
      </n-flex>
      <!-- middle area -->
      <n-space vertical justify="center">
        <n-config-provider :theme="darkTheme">
          <n-flex
            justify="center"
            style="transition: margin 0.4s; overflow: hidden"
            :style="{
              marginTop: player_use_lyric_skip_forward ? '70px' : '50px',
              marginLeft: player_background_model_num === 2 ? '36px' : '0px',
            }"
          >
            <!-- 1,2,3,4  -->
            <n-layout
              has-sider
              v-show="player_background_model_num != 4 && player_background_model_num != 5"
              style="overflow: hidden; background-color: transparent"
            >
              <!-- left area -->
              <n-layout-sider
                :collapsed="player_collapsed_album"
                @collapse="player_collapsed_album = true"
                @expand="player_collapsed_album = false"
                :show-collapsed-content="false"
                position="static"
                collapsed-width="30vw"
                width="54vw"
                style="background-color: transparent; overflow-y: hidden"
              >
                <n-space
                  vertical
                  align="end"
                  :class="{
                    'scroll-enabled': playerSettingStore.player.isPlaying,
                  }"
                  :style="{
                    marginTop: player_use_lyric_skip_forward ? '0px' : '40px',
                    transition: 'margin 0.4s',
                  }"
                  style="margin-right: 8vw"
                >
                  <!-- 1 方形封面-->
                  <Table_Album_Model_1_AlbumScroll
                    @mouseover="
                      () => {
                        play_list_carousel_model.value = true
                      }
                    "
                    @mouseleave="
                      () => {
                        play_list_carousel_model.value = false
                      }
                    "
                  />
                  <!-- 2 旋转封面-->
                  <n-flex
                    vertical
                    align="center"
                    justify="center"
                    style="margin-right: calc(-2vw); overflow: hidden"
                    :style="{
                      marginTop: player_background_model_num === 1 ? '0px' : '100px',
                      opacity: player_background_model_num === 1 ? 1 : 0,
                      position: player_background_model_num === 1 ? 'relative' : 'absolute',
                      left: player_background_model_num === 1 ? '0' : '-100%',
                      transition: 'margin 0.4s, opacity 0.8s',
                    }"
                  >
                    <lottie-player
                      ref="animationInstance_model_1_wave"
                      class="animate__rotate_slower"
                      :class="{
                        animate__rotate_slower_paused:
                          player_background_model_num !== 1 ||
                          !playerSettingStore.player.isPlaying,
                      }"
                      v-if="!clear_lottie_animationInstance && player_use_lottie_animation"
                      autoplay
                      loop
                      mode="normal"
                      :src="JSON.parse(JSON.stringify(Animation_1715591164841))"
                      :style="{
                        '--background-image': `url(${getAssetImage(page_top_album_image_url)})`,
                      }"
                      style="width: 66vh; height: 66vh; margin-top: calc(22vh - 186px)"
                    >
                    </lottie-player>
                    <div
                      style="
                        width: 32vh;
                        margin-top: -13vh;
                        color: #e7e5e5;
                        font-weight: 900;
                        font-size: calc(2.2vh + 4px);
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        text-align: center;
                      "
                    >
                      {{ this_audio_song_name }}
                    </div>
                    <div
                      style="
                        width: 26vh;
                        margin-left: 0.2vh;
                        margin-top: -0.8vh;
                        color: #989292;
                        font-weight: 550;
                        font-size: calc(1.4vh + 4px);
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        text-align: center;
                      "
                    >
                      {{ this_audio_artist_name }} -
                      {{ this_audio_album_name }}
                    </div>
                    <lottie-player
                      ref="animationInstance_model_1_spectrum"
                      v-if="!clear_lottie_animationInstance && player_use_lottie_animation"
                      autoplay
                      loop
                      mode="normal"
                      :src="JSON.parse(JSON.stringify(Animation_1715392202806))"
                      style="width: 54vh; height: calc(4.7vh)"
                    />
                    <n-space align="center" justify="center" v-if="!player_collapsed_album">
                      <n-space style="width: 46px; margin-right: -10px">
                        {{ playerSettingStore.current_play_time }}
                      </n-space>
                      <n-slider
                        style="
                          width: 36vh;
                          --n-fill-color: #ffffff;
                          --n-fill-color-hover: #ffffff;
                          --n-rail-height: 4px;
                          --n-handle-size: 20px;
                          --n-dot-border: 0px;
                          --n-dot-border-active: 0px;
                          --n-dot-border-radius: 4px;
                          --n-dot-color: #ffffff;
                          --n-dot-color-modal: #ffffff;
                          --n-dot-color-popover: #ffffff;
                          --n-dot-height: 8px;
                          --n-dot-width: 8px;
                          border-radius: 10px;
                        "
                        v-model:value="playerSettingStore.slider_singleValue"
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
                            if (
                              playerSettingStore.slider_singleValue >= 99.5 ||
                              playerSettingStore.slider_singleValue == 0
                            ) {
                              playerSettingStore.player_is_play_ended = true
                              playerSettingStore.play_go_duration(
                                playerSettingStore.slider_singleValue,
                                true
                              )
                            }
                            playerSettingStore.player_range_duration_isDragging = false
                          }
                        "
                        @click="
                          () => {
                            playerSettingStore.play_go_duration(
                              playerSettingStore.slider_singleValue,
                              true
                            )
                          }
                        "
                        @mousedown="
                          playerSettingStore.player_range_duration_isDragging = true
                        "
                        @mouseup="playerSettingStore.player_range_duration_isDragging = false"
                      >
                        <template #thumb>
                          <n-icon-wrapper color="white" :size="12" />
                        </template>
                      </n-slider>
                      <n-space style="width: 46px">
                        {{ playerSettingStore.total_play_time }}
                      </n-space>
                    </n-space>
                  </n-flex>
                  <!-- 3 炫胶唱片-->
                  <n-space
                    vertical
                    align="end"
                    justify="center"
                    style="min-width: calc(54vw); position: absolute; overflow: hidden"
                    :style="{
                      marginTop:
                        player_background_model_num === 2
                          ? player_use_lyric_skip_forward
                            ? 'calc(-6vh - 30px)'
                            : 'calc(-6vh - 30px)'
                          : '0px',
                      opacity: player_background_model_num === 2 ? 1 : 0,
                      left:
                        player_background_model_num === 2
                          ? playerSettingStore.player.isPlaying
                            ? '0'
                            : '10%'
                          : '-100%',
                      transition: 'margin 0.4s, left 0.4s, opacity 0.8s',
                    }"
                  >
                    <lottie-player
                      ref="animationInstance_model_2_wave"
                      class="animate__rotate_fast"
                      :class="{
                        animate__rotate_fast_paused:
                          player_background_model_num !== 2 ||
                          !playerSettingStore.player.isPlaying,
                      }"
                      v-if="!clear_lottie_animationInstance && player_use_lottie_animation"
                      speed="0.8"
                      autoplay
                      loop
                      mode="normal"
                      :src="JSON.parse(JSON.stringify(Animation_1715417974362))"
                      style="
                        width: calc(56vh);
                        height: calc(56vh);
                        margin-top: calc(32vh - 154px);
                        position: absolute;
                        transition:
                          margin 0.4s,
                          opacity 0.4s;
                      "
                      :style="{
                        '--background-image': `url(${getAssetImage(page_top_album_image_url)})`,
                        marginLeft: playerSettingStore.player.isPlaying
                          ? 'calc(-56vh)'
                          : 'calc(-70vh)',
                        opacity: playerSettingStore.player.isPlaying ? 1 : 0,
                      }"
                    />
                    <div
                      style="
                        width: calc(38vh);
                        height: calc(38vh);
                        margin-top: calc(41vh - 162px);
                        border-radius: 27vh;
                        object-fit: cover;
                        object-position: center;
                        filter: blur(0px);
                        position: absolute;
                        border: 1.5px solid #ffffff20;
                        box-shadow:
                          0 0 32px rgba(0, 0, 0, 0.2),
                          0 0 32px rgba(0, 0, 0, 0.2);
                        background-color: #dcdbdd10;
                        transition: margin 0.4s;
                      "
                      :style="{
                        marginLeft: playerSettingStore.player.isPlaying
                          ? 'calc(-47vh)'
                          : 'calc(-61vh)',
                      }"
                    ></div>
                    <div
                      style="
                        position: relative;
                        margin-top: calc(36vh - 162px);
                        margin-left: calc(-74vh);
                        width: calc(46vh);
                        height: calc(46vh);
                      "
                    >
                      <!-- 图片 -->
                      <img
                        style="
                          width: 100%;
                          height: 100%;
                          border: 4px solid #ffffff20;
                          border-radius: 10px;
                          object-fit: cover;
                          object-position: center;
                          filter: blur(0);
                          box-shadow:
                            0 0 32px rgba(0, 0, 0, 0.2),
                            0 0 32px rgba(0, 0, 0, 0.2);
                          -webkit-mask-image: radial-gradient(
                            circle at 100% 50%,
                            /* 圆形洞的位置（右侧居中） */ transparent 3%,
                            /* 圆形洞的大小 */ black 3.2% /* 遮罩其余部分 */
                          );
                          mask-image: radial-gradient(
                            circle at 100% 50%,
                            /* 圆形洞的位置（右侧居中） */ transparent 3%,
                            /* 圆形洞的大小 */ black 3.2% /* 遮罩其余部分 */
                          );
                        "
                        :src="getAssetImage(page_top_album_image_url)"
                        alt=""
                      />
                      <div
                        style="
                          width: 3vh;
                          height: 3vh;
                          border-radius: 6vh;
                          border: 2px solid #ffffff40;
                          position: absolute;
                          top: calc(50% - 1.5vh);
                          background-color: #dcdbdd20;
                          transition:
                            right 0.4s,
                            opacity 0.4s;
                        "
                        :style="{
                          right: playerSettingStore.player.isPlaying
                            ? 'calc(-1.5vh)'
                            : 'calc(12vh)',
                          opacity: playerSettingStore.player.isPlaying ? 1 : 0,
                        }"
                      ></div>
                      <div
                        style="
                          width: 2vh;
                          height: 2vh;
                          border-radius: 2vh;
                          border: 1.5px solid #ffffff40;
                          position: absolute;
                          top: calc(50% - 1vh);
                          background-color: #181818;
                          transition:
                            right 0.4s,
                            opacity 0.4s;
                        "
                        :style="{
                          right: playerSettingStore.player.isPlaying
                            ? 'calc(-1vh)'
                            : 'calc(13vh)',
                          opacity: playerSettingStore.player.isPlaying ? 1 : 0,
                        }"
                      ></div>
                    </div>
                    <div
                      style="
                        width: 46vh;
                        margin-top: 0;
                        margin-left: calc(-74vh);
                        color: #e7e5e5;
                        font-weight: 900;
                        font-size: calc(2.2vh + 4px);
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        text-align: left;
                      "
                    >
                      {{ this_audio_song_name }}
                    </div>
                    <div
                      style="
                        width: 46vh;
                        margin-top: -1vh;
                        margin-left: calc(-74vh);
                        color: #989292;
                        font-weight: 550;
                        font-size: calc(1.4vh + 4px);
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        text-align: left;
                      "
                    >
                      {{ this_audio_artist_name }} -
                      {{ this_audio_album_name }}
                    </div>
                    <n-slider
                      style="
                        width: 46vh;
                        --n-fill-color: #ffffff;
                        --n-fill-color-hover: #ffffff;
                        --n-rail-height: 4px;
                        --n-handle-size: 20px;
                        margin-top: -6px;
                        margin-left: calc(-74vh);
                        border-radius: 10px;
                      "
                      v-model:value="playerSettingStore.slider_singleValue"
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
                          if (
                            playerSettingStore.slider_singleValue >= 99.5 ||
                            playerSettingStore.slider_singleValue === 0
                          ) {
                            playerSettingStore.player_is_play_ended = true
                            playerSettingStore.play_go_duration(
                              playerSettingStore.slider_singleValue,
                              true
                            )
                          }
                          playerSettingStore.player_range_duration_isDragging = false
                        }
                      "
                      @click="
                        () => {
                          playerSettingStore.play_go_duration(
                            playerSettingStore.slider_singleValue,
                            true
                          )
                        }
                      "
                      @mousedown="playerSettingStore.player_range_duration_isDragging = true"
                      @mouseup="playerSettingStore.player_range_duration_isDragging = false"
                    >
                      <template #thumb>
                        <n-icon-wrapper color="white" :size="12" />
                      </template>
                    </n-slider>
                    <div
                      style="
                        width: 46vh;
                        text-align: left;
                        margin-top: -4px;
                        margin-left: calc(-74vh);
                      "
                    >
                      {{ playerSettingStore.current_play_time }} &nbsp;:&nbsp;
                      {{ playerSettingStore.total_play_time }}
                    </div>
                  </n-space>
                </n-space>
              </n-layout-sider>
              <!-- right area -->
              <n-layout-content
                style="background-color: transparent; overflow: hidden"
                :style="{
                  marginLeft: player_background_model_num !== 3 ? '-1.5vw' : '2vw',
                }"
              >
                <div
                  :style="{
                    height: player_use_lyric_skip_forward
                      ? 'calc(100vh - 100px)'
                      : 'calc(100vh - 50px)',
                  }"
                  style="
                    width: 40vw;
                    margin-top: -80px;
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
                    style="
                      width: calc(40vw);
                      max-height: calc(90vh);
                      margin-top: 120px;
                      overflow: auto;
                      background-color: #00000000;
                    "
                  >
                    <template #default>
                      <n-list-item
                        class="lyrics_info"
                        :style="{
                          textAlign: player_collapsed_album ? 'center' : 'left',
                        }"
                        v-for="(
                          item, index
                        ) in this_audio_lyrics_info_line_font"
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
              </n-layout-content>
            </n-layout>
          </n-flex>
          <!-- 5 专辑列表-->
          <n-space
            v-show="player_background_model_num === 4"
            style="
              position: absolute;
              left: 0;
              width: 100vw;
              height: 90vh;
              overflow: hidden;
              background-color: transparent;
            "
          >
            <n-space
              vertical
              align="center"
              @mouseover="
                () => {
                  play_list_carousel_model.value = true
                }
              "
              @mouseleave="
                () => {
                  play_list_carousel_model.value = false
                }
              "
            >
              <n-carousel
                effect="card"
                :show-arrow="false"
                :show-dots="false"
                :current-index="this_audio_Index_of_play_list_carousel"
                direction="horizontal"
                dot-placement="bottom"
                :prev-slide-style="{
                  transform: 'translateX(-160%) translateZ(-140px) rotateY(40deg) scale(0.8)',
                  filter: 'brightness(99%) blur(0px)',
                }"
                :next-slide-style="{
                  transform: 'translateX(60%) translateZ(-140px) rotateY(-40deg) scale(0.8)',
                  filter: 'brightness(99%) blur(0px)',
                }"
                style="transform-style: preserve-3d; width: 100vw; height: 50vh"
                :style="{
                  marginTop: 'calc(28vh - 182px)',
                  transition: 'margin 0.4s, height 0.4s',
                }"
              >
                <n-carousel-item
                  v-for="(item, index) in playlist_MediaFiles_temporary_carousel"
                  :key="item.id"
                  style="width: 50vh; height: 50vh"
                >
                  <div class="image-wrapper">
                    <img
                      class="carousel-img"
                      :src="getAssetImage(item.medium_image_url)"
                      :alt="`Carousel Image ${index + 1}`"
                    />
                  </div>
                </n-carousel-item>
              </n-carousel>
              <n-space vertical style="width: 50vh">
                <div
                  style="
                    width: 50vh;
                    margin-top: 5px;
                    color: #e7e5e5;
                    font-weight: 900;
                    font-size: calc(2.2vh + 4px);
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    text-align: center;
                  "
                >
                  {{ this_audio_song_name }}
                </div>
                <div
                  style="
                    width: 50vh;
                    margin-top: -6px;
                    color: #989292;
                    font-weight: 550;
                    font-size: calc(1.4vh + 4px);
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    text-align: center;
                  "
                >
                  {{ this_audio_artist_name }} -
                  {{ this_audio_album_name }}
                </div>
              </n-space>
              <!--  -->
              <lottie-player
                ref="animationInstance_model_1_spectrum_copy"
                v-if="!clear_lottie_animationInstance && player_use_lottie_animation"
                autoplay
                loop
                mode="normal"
                :src="JSON.parse(JSON.stringify(Animation_1715392202806))"
                style="width: 54vh; height: calc(4.7vh)"
              />
              <!-- player_collapsed_album -->
              <n-space
                align="center"
                justify="center"
                style="width: 100vh; margin-left: 0.3vw"
                v-if="false"
              >
                <n-space style="width: 46px; margin-right: -10px; color: #ffffff99">
                  {{ playerSettingStore.current_play_time }}
                </n-space>
                <n-slider
                  style="
                    width: calc(50vh - 46px * 2);
                    --n-fill-color: #ffffff;
                    --n-fill-color-hover: #ffffff;
                    --n-rail-height: 4px;
                    --n-handle-size: 20px;
                    border-radius: 10px;
                  "
                  v-model:value="playerSettingStore.slider_singleValue"
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
                      if (
                        playerSettingStore.slider_singleValue >= 99.5 ||
                        playerSettingStore.slider_singleValue == 0
                      ) {
                        playerSettingStore.player_is_play_ended = true
                        playerSettingStore.play_go_duration(
                          playerSettingStore.slider_singleValue,
                          true
                        )
                      }
                      playerSettingStore.player_range_duration_isDragging = false
                    }
                  "
                  @click="
                    () => {
                      playerSettingStore.play_go_duration(
                        playerSettingStore.slider_singleValue,
                        true
                      )
                    }
                  "
                  @mousedown="playerSettingStore.player_range_duration_isDragging = true"
                  @mouseup="playerSettingStore.player_range_duration_isDragging = false"
                >
                  <template #thumb>
                    <n-icon-wrapper color="white" :size="12" />
                  </template>
                </n-slider>
                <n-space style="width: 46px; color: #ffffff99">
                  {{ playerSettingStore.total_play_time }}
                </n-space>
              </n-space>
              <!--  -->
              <n-carousel
                effect="card"
                :show-arrow="false"
                :show-dots="false"
                v-model:current-index="perviousIndex"
                direction="horizontal"
                dot-placement="bottom"
                :prev-slide-style="{
                  transform: 'translateX(-160%) translateZ(-140px) rotateY(40deg)',
                }"
                :next-slide-style="{
                  transform: 'translateX(60%) translateZ(-140px) rotateY(-40deg)',
                }"
                style="transform-style: preserve-3d; width: 100vw; height: 10vh"
                :style="{
                  transition: 'margin 0.4s, height 0.4s',
                }"
              >
                <n-carousel-item
                  v-for="(item, index) in this_audio_lyrics_info_line_font"
                  @click="handleItemDbClick(index)"
                  style="width: 50vh; height: 10vh"
                >
                  <div
                    style="
                      color: #e7e5e5;
                      overflow: hidden;
                      text-align: center;
                      font-weight: 900;
                      font-size: calc(2.2vh + 4px);
                      display: -webkit-box;
                      -webkit-line-clamp: 2;
                      -webkit-box-orient: vertical;
                      text-overflow: ellipsis;
                    "
                  >
                    {{ item }}
                  </div>
                </n-carousel-item>
              </n-carousel>
            </n-space>
          </n-space>
          <!-- 6 黑胶唱片-->
          <n-space
            v-show="player_background_model_num === 5"
            vertical
            align="end"
            justify="center"
            style="
              width: calc(100vw);
              height: calc(100vh);
              position: absolute;
              top: 0;
              overflow: hidden;
            "
            :style="{
              opacity: player_background_model_num === 5 ? 0.8 : 0,
              transition: 'margin 0.4s, left 0.4s, opacity 0.8s',
            }"
          >
            <lottie-player
              ref="animationInstance_model_5_wave"
              class="animate__rotate_fast_model_6"
              :class="{
                animate__rotate_fast_model_6_paused:
                  player_background_model_num !== 5 || !playerSettingStore.player.isPlaying,
              }"
              v-if="!clear_lottie_animationInstance && player_use_lottie_animation"
              speed="0.8"
              autoplay
              loop
              mode="normal"
              :src="JSON.parse(JSON.stringify(Animation_1715417974362))"
              style="
                width: calc(54vw);
                height: calc(54vw);
                position: absolute;
                z-index: 4;
                margin-top: -7vw;
              "
              :style="{
                '--background-image': `url(${getAssetImage(page_top_album_image_url)})`,
                opacity: playerSettingStore.player.isPlaying ? 0.8 : 0.2,
                right: '23vw',
                transition: 'right 0.6s, top 0.6s, zIndex 0.6s, transform 0.6s, opacity 0.4s',
              }"
            />
            <div
              class="animate__rotate_fast_model_6"
              :class="{
                animate__rotate_fast_model_6_paused:
                  player_background_model_num !== 5 || !playerSettingStore.player.isPlaying,
              }"
              style="
                width: calc(40vw);
                height: calc(40vw);
                border-radius: 50vw;
                object-fit: cover;
                object-position: center;
                z-index: 3;
                border: 1.5px solid #ffffff20;
                box-shadow:
                  0 0 100vh rgba(255, 255, 255, 0.3),
                  0 0 100vh rgba(255, 255, 255, 0.3);
                transition: margin 0.4s;
              "
              :style="{
                backgroundImage: `url(${getAssetImage(page_top_vinyl_image_url.value)})`,
                backgroundSize: '105%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'brightness(16%) blur(0px)',
                marginTop: '-10px',
                marginRight: '30vw',
                transition: 'right 0.6s, top 0.6s, zIndex 0.6s, transform 0.6s',
              }"
            ></div>
          </n-space>
        </n-config-provider>
        <n-flex justify="end"> </n-flex>
      </n-space>
    </n-space>
  </div>
</template>

<style scoped>
#player_bg_zindex_0 {
  position: absolute;
  top: -20vw;
  width: 100vw;
  height: 100vw;
  object-fit: cover;
  object-position: center;
  z-index: -2;
  transition: filter 0.5s ease;
}
.player_bg_zindex_0_auto_rotateDefault {
  animation: moveInCircleDefault 60s linear infinite;
  transform-origin: center center;
}
.player_bg_zindex_0_auto_rotateRepeat {
  animation: moveInCircleRepeat 60s linear infinite;
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
  width: calc(40vw);
  margin-top: 6px;
  line-height: 1.2;
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
  font-size: v-bind(player_lyric_fontSize);
  /* display: inline-block;
  white-space: pre; */
  max-width: calc(36vw);
  padding-left: 20px;
  padding-top: 0;
  padding-bottom: 0;
  transition: color 0.2s;
}

.animate__rotate_slower::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 34vh;
  height: 34vh;
  border-radius: 17vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform: translate(-50%, -50%);
  z-index: 2;
  background-image: var(--background-image);
}
.animate__rotate_slower {
  animation: rotate 60s linear infinite;
  animation-play-state: running;
}
.animate__rotate_slower_paused {
  animation-play-state: paused;
}

.animate__rotate_fast::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24vh;
  height: 24vh;
  border-radius: 20vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow:
    0 0 32px rgba(0, 0, 0, 0.2),
    0 0 32px rgba(0, 0, 0, 0.2);
  transform: translate(-50%, -50%);
  z-index: 2;
  background-image: var(--background-image);
}
.animate__rotate_fast {
  animation: rotate 26s linear infinite;
  animation-play-state: running;
}
.animate__rotate_fast_paused {
  animation-play-state: paused;
}

.animate__rotate_fast_model_6::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 21.4vw;
  height: 21.4vw;
  border-radius: 20vw;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow:
    0 0 32px rgba(0, 0, 0, 0.2),
    0 0 32px rgba(0, 0, 0, 0.2);
  transform: translate(-50%, -50%);
  z-index: 2;
  background-image: var(--background-image);
}
.animate__rotate_fast_model_6 {
  animation: rotate 26s linear infinite;
  animation-play-state: running;
}
.animate__rotate_fast_model_6_paused {
  animation-play-state: paused;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.image-wrapper {
  position: relative;
  display: inline-block;
  width: 50vh;
  height: 50vh;
}
.carousel-img {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  border: 4px solid #ffffff20;
  position: relative;
  z-index: 1;
}
.image-wrapper::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 15vh;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
  border-radius: 10px;
  z-index: 2;
}

::-webkit-scrollbar {
  display: none;
}
</style>
