import {reactive, watch} from 'vue'
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
const path = require('path')

export const store_app_configs_info = reactive({
    logo: path.resolve('resources/img/NSMusicS.png'),

    lang: 'en',

    navidrome_db: 'C:\\Users\\Public\\Documents\\NSMusicS\\navidrome.db',
    nsmusics_db: 'C:\\Users\\Public\\Documents\\NSMusicS\\nsmusics.db',
    
    menuOptions_appBar: [],
    menuOptions_appBar_show: true,

    selectd_props_app_sidebar: ['2', '4', '5', '6', '7', '9', '10', '11', '12', '13', '14'],
    app_left_menu_select_activeKey: '',
    app_left_menu_collapsed: true,

    menu_app_setting_select_tab_name: 'tab_pane_1',

    theme: null,
    theme_name: 'lightTheme',
    theme_app: null,
    update_theme: false,
    theme_auto_system: false,

    window_innerWidth: 0,
    window_innerHeight: 0,

    update_show: false,
    version: '',
    version_updated: 0,
    version_update_address: '',
    version_update_explain: ''
});
watch(() => store_app_configs_info.lang, (newValue) => {
    console.log(newValue)
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_app_configs_info.app_left_menu_select_activeKey, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_app_configs_info.app_left_menu_collapsed, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_app_configs_info.selectd_props_app_sidebar, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});