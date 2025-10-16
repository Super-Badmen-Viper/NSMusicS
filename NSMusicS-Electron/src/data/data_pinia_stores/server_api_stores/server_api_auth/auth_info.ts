import { defineStore } from 'pinia'

export const useServerAuthInfoStore = defineStore('serverAuthInfo', () => {
  // 这里可以添加状态、getters和actions
  
  // 目前这个store很简单，只需要一个空对象
  const auth_info = {}
  
  return {
    auth_info
  }
})