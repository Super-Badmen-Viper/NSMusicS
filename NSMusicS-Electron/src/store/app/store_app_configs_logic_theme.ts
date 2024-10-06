import {reactive, watch} from 'vue'
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
import {darkTheme, lightTheme} from "naive-ui";
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
const { ipcRenderer } = require('electron');

export const store_app_configs_logic_theme = reactive({
    update_theme(value:any){
        if(value === 'lightTheme')
            store_app_configs_info.update_theme = true;
        else
            store_app_configs_info.update_theme = false;
        this.theme_mode_change_click()
    },
    theme_normal_mode_click(){
        store_app_configs_info.theme = lightTheme
        store_app_configs_info.theme_name = 'lightTheme'
        store_app_configs_info.theme_app = lightTheme
        store_app_configs_info.update_theme = false
    },
    theme_dark_mode_click(){
        store_app_configs_info.theme = darkTheme
        store_app_configs_info.theme_name = 'darkTheme'
        store_app_configs_info.theme_app = darkTheme
        store_app_configs_info.update_theme = true
    },
    theme_mode_change_click(){
        if (store_app_configs_info.update_theme) {
            this.theme_normal_mode_click()
        } else {
            this.theme_dark_mode_click()
        }
        store_app_configs_logic_save.save_system_config_of_App_Configs()
    },
});
watch(() => store_app_configs_info.theme_auto_system, async (newValue) => {
    let sy_theme = await ipcRenderer.invoke('window-get-system-theme')
    if(sy_theme === 'lightTheme')
        store_app_configs_logic_theme.theme_normal_mode_click()
    else
        store_app_configs_logic_theme.theme_dark_mode_click()
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});