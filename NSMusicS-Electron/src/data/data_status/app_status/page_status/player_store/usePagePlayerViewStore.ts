import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePagePlayerViewStore = defineStore('pagePlayerView', () => {
  // 使用 ref 替代 reactive
  const currentScrollIndex = ref(0)

  // 返回状态
  return {
    currentScrollIndex,
  }
})
