import {reactive} from 'vue'
import type {GlobalTheme} from "naive-ui";
import path from "path";
export const store_app_setting_configs = reactive({
    update_lang: 'en',

    navidrome_db: path.resolve('resources/navidrome.db'),
    nsmusics_db: path.resolve('resources/nsmusics.db'),
    
    menuOptions_appBar: [],
    selectd_props_app_sidebar: ['2', '4', '5', '6', '7', '9', '10', '11', '12', '13', '14'],
    app_left_menu_select_activeKey: '',
    app_left_menu_collapsed: false,
    menu_app_setting_select_tab_name: 'tab_pane_1',

    theme: null,
    theme_name: 'lightTheme',
    theme_app: null,
    update_theme: false,
    window_innerWidth: window.innerWidth
});