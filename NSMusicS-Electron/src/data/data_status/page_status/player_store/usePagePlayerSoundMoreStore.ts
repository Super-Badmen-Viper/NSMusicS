import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePagePlayerSoundMoreStore = defineStore('pagePlayerSoundMore', () => {
  // 使用 ref 替代 reactive
  const player_show_sound_more = ref(false)

  // 返回状态
  return {
    player_show_sound_more,
  }
})
