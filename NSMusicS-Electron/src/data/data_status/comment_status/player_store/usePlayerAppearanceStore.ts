import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// 导入依赖
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'

export const usePlayerAppearanceStore = defineStore('player-appearance', () => {
  // 外观状态
  const player_show = ref(false)
  const player_show_complete = ref(true)
  const player_show_hight_animation_value = ref(100)
  const player_show_of_control_info = ref(true)
  const player_collapsed_action_bar_of_Immersion_model = ref(false)
  const player_show_click = ref(false)
  const player_collapsed_album = ref(false)
  const player_collapsed_skin = ref(true)
  const player_lyric_fontSize = ref('28px')
  const player_lyric_fontSize_Num = ref(28)
  const player_lyric_fontWeight = ref('600')
  const player_lyric_color = ref('#FAFAFB60')
  const player_lyric_colorHover = ref('#FFFFFF')
  const player_lyric_color_hidden_value = ref(90)
  const player_lyric_color_hidden_coefficient = ref(15)
  const player_theme_Styles_Selected = ref(0)
  const player_background_model_num = ref(0)
  const player_use_lottie_animation = ref(true)
  const player_use_lyric_skip_forward = ref(false)
  const player_use_background_filter_blur = ref(true)
  const player_use_background_automatic_rotation = ref(true)
  const player_use_background_repeat_fill = ref(false)
  const player_use_playbar_auto_hide = ref(true)
  const player_mode_of_medialist_from_external_import = ref(false)
  const player_mode_of_lock_playlist = ref(false)

  // 监听器
  watch(
    () => player_show,
    (newValue) => {
      if (!newValue) {
        player_show_of_control_info.value = true
      }
    }
  )

  watch(
    () => player_collapsed_album,
    () => {
      store_system_configs_save.save_system_config_of_Player_Configs_of_UI()
    }
  )

  watch(
    () => player_collapsed_skin,
    () => {
      store_system_configs_save.save_system_config_of_Player_Configs_of_UI()
    }
  )

  watch(
    () => player_lyric_fontSize,
    () => {
      store_system_configs_save.save_system_config_of_Player_Configs_of_UI()
    }
  )

  watch(
    () => player_lyric_fontSize_Num,
    (newValue) => {
      player_lyric_fontSize.value = newValue + 'px'
    }
  )

  watch(
    () => player_lyric_fontWeight,
    () => {
      store_system_configs_save.save_system_config_of_Player_Configs_of_UI()
    }
  )

  watch(
    () => player_lyric_color,
    () => {
      store_system_configs_save.save_system_config_of_Player_Configs_of_UI()
    }
  )

  watch(
    () => player_theme_Styles_Selected,
    () => {
      store_system_configs_save.save_system_config_of_Player_Configs_of_UI()
    }
  )

  watch(
    () => player_background_model_num,
    () => {
      store_system_configs_save.save_system_config_of_Player_Configs_of_UI()
    }
  )

  watch(
    () => player_use_lottie_animation,
    () => {
      store_system_configs_save.save_system_config_of_Player_Configs_of_UI()
    }
  )

  watch(
    () => player_use_lyric_skip_forward,
    () => {
      player_lyric_fontSize_Num.value = player_use_lyric_skip_forward.value
        ? 36 + Math.floor((window.innerHeight - 880) / 200) * 6
        : 33 + Math.floor((window.innerHeight - 880) / 200) * 6
      store_system_configs_save.save_system_config_of_Player_Configs_of_UI()
    }
  )

  watch(
    () => player_use_background_filter_blur,
    () => {
      store_system_configs_save.save_system_config_of_Player_Configs_of_UI()
    }
  )

  watch(
    () => player_use_background_automatic_rotation,
    () => {
      store_system_configs_save.save_system_config_of_Player_Configs_of_UI()
    }
  )

  watch(
    () => player_use_background_repeat_fill,
    () => {
      store_system_configs_save.save_system_config_of_Player_Configs_of_UI()
    }
  )

  watch(
    () => player_use_playbar_auto_hide,
    (newValue) => {
      player_collapsed_action_bar_of_Immersion_model.value = newValue
      store_system_configs_save.save_system_config_of_Player_Configs_of_UI()
    }
  )

  // 返回状态
  return {
    // 外观状态
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
  }
})
