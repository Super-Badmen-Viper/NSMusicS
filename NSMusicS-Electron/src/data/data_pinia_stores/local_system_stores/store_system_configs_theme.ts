import { defineStore } from 'pinia'
import { watch } from 'vue'
import { useSystemConfigsInfoStore } from '@/data/data_pinia_stores/local_system_stores/store_system_configs_info'
import { darkTheme, lightTheme } from 'naive-ui'
import { useSystemConfigsSaveStore } from '@/data/data_pinia_stores/local_system_stores/store_system_configs_save'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'

export const useSystemConfigsThemeStore = defineStore('systemConfigsTheme', () => {
  // 获取其他store的引用
  const systemConfigsInfoStore = useSystemConfigsInfoStore()
  const systemConfigsSaveStore = useSystemConfigsSaveStore()

  // 方法定义
  function update_theme(value: any) {
    if (value === 'lightTheme') systemConfigsInfoStore.update_theme = true
    else systemConfigsInfoStore.update_theme = false
    theme_mode_change_click()
  }

  function theme_normal_mode_click() {
    systemConfigsInfoStore.theme = lightTheme
    systemConfigsInfoStore.theme_name = 'lightTheme'
    systemConfigsInfoStore.theme_app = lightTheme
    systemConfigsInfoStore.update_theme = false
  }

  function theme_dark_mode_click() {
    systemConfigsInfoStore.theme = darkTheme
    systemConfigsInfoStore.theme_name = 'darkTheme'
    systemConfigsInfoStore.theme_app = darkTheme
    systemConfigsInfoStore.update_theme = true
  }

  function theme_mode_change_click() {
    if (systemConfigsInfoStore.update_theme) {
      theme_normal_mode_click()
    } else {
      theme_dark_mode_click()
    }
    systemConfigsSaveStore.save_system_config_of_App_Configs()
  }

  // 监听器定义
  watch(
    () => systemConfigsInfoStore.theme_auto_system,
    async (newValue) => {
      let sy_theme = 'lightTheme'
      if (isElectron) {
        sy_theme = await ipcRenderer.invoke('window-get-system-theme')
      } else {
        // other
      }
      if (sy_theme === 'lightTheme') theme_normal_mode_click()
      else theme_dark_mode_click()
      systemConfigsSaveStore.save_system_config_of_App_Configs()
    }
  )

  // 暴露方法
  return {
    update_theme,
    theme_normal_mode_click,
    theme_dark_mode_click,
    theme_mode_change_click
  }
})