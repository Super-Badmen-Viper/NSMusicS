import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLocalDataTaglibConfigStore = defineStore('localDataTaglibConfig', () => {
  // 状态定义
  const read_percentage = ref(0)

  return {
    // 状态暴露
    read_percentage
  }
})