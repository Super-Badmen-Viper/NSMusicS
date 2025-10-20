import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePagePlayerSoundSpeedStore = defineStore('pagePlayerSoundSpeed', () => {
  // 使用 ref 替代 reactive
  const player_show_sound_speed = ref(false)

  // 返回状态
  return {
    player_show_sound_speed
  }
})