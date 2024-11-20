import {reactive, watch} from 'vue'
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
const path = require('path')

export const store_app_configs_info = reactive({
    logo: path.resolve('resources/img/NSMusicS.png'),

    lang: 'en',

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
    version_update_explain: '',

    navidrome_db: 'C:\\Users\\Public\\Documents\\NSMusicS\\navidrome.db',
    nsmusics_db: 'C:\\Users\\Public\\Documents\\NSMusicS\\nsmusics.db',

    menu_view_menuOptions: [],
    menu_view_bar_show: false,
    menu_view_left_menu_select_activeKey: '',

    player_view_menuOptions: [],
    player_view_bar_show: true,
    player_view_left_menu_collapsed: true,
    player_view_left_menu_select_activeKey: '',

    menu_app_setting_select_tab_name: 'tab_pane_1',
});
watch(() => store_app_configs_info.lang, (newValue) => {
    console.log(newValue)
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_app_configs_info.player_view_left_menu_select_activeKey, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_app_configs_info.player_view_left_menu_collapsed, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});