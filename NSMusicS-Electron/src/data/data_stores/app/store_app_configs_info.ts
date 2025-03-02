import {reactive, watch} from 'vue'
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";
import {store_player_appearance} from "../../../views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_appearance";

export const store_app_configs_info = reactive({
    // Electron Desktop Kind
    desktop_system_kind: 'win32',

    // app language
    lang: 'en',

    // app theme
    theme: null,
    theme_name: 'lightTheme',
    theme_app: null,
    update_theme: false,
    theme_auto_system: false,

    // Electron Windows Size
    window_innerWidth: 1220,
    window_innerHeight: 765,
    window_max: false,
    window_full: false,

    // Electron MiniPlayer
    window_state_miniplayer: false,
    window_state_miniplayer_card: false,
    window_state_miniplayer_desktop_lyric: false,
    window_state_miniplayer_album: false,
    window_state_miniplayer_playlist: false,

    // app update
    update_show: false,
    version: '',
    version_updated: 0,
    version_update_address: '',
    version_update_explain: '',

    // app sqlite data
    driveDbPath: '',
    driveTempPath: '',
    resourcesPath: '',
    navidrome_db: null,// path.resolve('resources/navidrome.db'),
    nsmusics_db: null,// path.resolve('resources/nsmusics.db'),

    // app left menu
    menuOptions_selectd_model_1: true,
    menuOptions_selectd_model_2: true,
    menuOptions_selectd_model_3: true,
    menuOptions_selectd_model_4: true,

    // app
    app_view_menuOptions: [],
    app_view_bar_show: true,
    app_view_left_menu_collapsed: true,
    app_view_left_menu_show: false,
    app_view_left_menu_select_activeKey: '',
    // local_client
    app_view_local_client_menuOptions: [],
    app_view_local_client_menuOptions_select_activeKey: '',
    app_view_local_client_setting_select_tab_name: 'type-group-0-1',
    // server_client
    app_view_server_client_menuOptions: [],
    app_view_server_client_menuOptions_select_activeKey: '',
    app_view_server_client_setting_select_tab_name: 'type-group-0-1',
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
