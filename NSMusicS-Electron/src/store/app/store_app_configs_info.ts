import {reactive, watch} from 'vue'
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";

export const store_app_configs_info = reactive({
    desktop_system_kind: 'win32',

    lang: 'en',

    theme: null,
    theme_name: 'lightTheme',
    theme_app: null,
    update_theme: false,
    theme_auto_system: false,

    window_innerWidth: 1220,
    window_innerHeight: 765,

    update_show: false,
    version: '',
    version_updated: 0,
    version_update_address: '',
    version_update_explain: '',

    driveDbPath: '',
    driveTempPath: '',
    resourcesPath: '',
    navidrome_db: null,// path.resolve('resources/navidrome.db'),
    nsmusics_db: null,// path.resolve('resources/nsmusics.db'),

    menuOptions_selectd_model_1: true,
    menuOptions_selectd_model_2: true,
    menuOptions_selectd_model_3: true,
    menuOptions_selectd_model_4: true,

    app_view_menuOptions: [],
    app_view_bar_show: true,
    app_view_left_menu_collapsed: true,
    app_view_left_menu_show: false,
    app_view_left_menu_select_activeKey: '',

    menu_app_setting_select_tab_name: 'tab_pane_1',
    server_setting_select_tab_name: 'tab_pane_1',
});
watch(() => store_app_configs_info.lang, (newValue) => {
    console.log(newValue)
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_app_configs_info.app_view_left_menu_select_activeKey, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_app_configs_info.app_view_left_menu_collapsed, (newValue) => {
    store_app_configs_info.app_view_left_menu_show = !store_app_configs_info.app_view_left_menu_collapsed
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_app_configs_info.app_view_left_menu_show, (newValue) => {
    store_app_configs_info.app_view_left_menu_collapsed = !store_app_configs_info.app_view_left_menu_show
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
