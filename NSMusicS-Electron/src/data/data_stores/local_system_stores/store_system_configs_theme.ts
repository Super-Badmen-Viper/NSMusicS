import { reactive, watch } from 'vue'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { darkTheme, lightTheme } from 'naive-ui'
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'

export const store_system_configs_theme = reactive({
  update_theme(value: any) {
    if (value === 'lightTheme') store_system_configs_info.update_theme = true
    else store_system_configs_info.update_theme = false
    this.theme_mode_change_click()
  },
  theme_normal_mode_click() {
    store_system_configs_info.theme = lightTheme
    store_system_configs_info.theme_name = 'lightTheme'
    store_system_configs_info.theme_app = lightTheme
    store_system_configs_info.update_theme = false
  },
  theme_dark_mode_click() {
    store_system_configs_info.theme = darkTheme
    store_system_configs_info.theme_name = 'darkTheme'
    store_system_configs_info.theme_app = darkTheme
    store_system_configs_info.update_theme = true
  },
  theme_mode_change_click() {
    if (store_system_configs_info.update_theme) {
      this.theme_normal_mode_click()
    } else {
      this.theme_dark_mode_click()
    }
    store_system_configs_save.save_system_config_of_App_Configs()
  },
})
watch(
  () => store_system_configs_info.theme_auto_system,
  async (newValue) => {
    let sy_theme = 'lightTheme'
    if (isElectron) {
      sy_theme = await ipcRenderer.invoke('window-get-system-theme')
    } else {
      // other
    }
    if (sy_theme === 'lightTheme') store_system_configs_theme.theme_normal_mode_click()
    else store_system_configs_theme.theme_dark_mode_click()
    store_system_configs_save.save_system_config_of_App_Configs()
  }
)
