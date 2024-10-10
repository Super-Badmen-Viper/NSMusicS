<script setup lang="ts">
  ////// this_view resource of vicons_svg
  import {
    BareMetalServer, Add, Close, Menu as MenuIcon, UserAvatarFilledAlt, Hearing
  } from '@vicons/carbon'

  ////// i18n auto lang
  import {
    DocumentHeart20Regular,
    Flag16Regular,
    Home28Regular, PeopleCommunity16Regular,
    SlideMicrophone32Regular,
    TextIndentIncreaseLtr20Filled as lyric
  } from "@vicons/fluent";
  import {AlbumFilled, LibraryMusicOutlined, MotionPhotosAutoOutlined, MusicNoteRound} from "@vicons/material";
  import {RouterLink} from "vue-router";
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n({
    inheritLocale: true
  })
  const computed_i18n_Label_HomePageConfiguration_1 = computed(() => t('page.home.mostPlayed'));
  const computed_i18n_Label_HomePageConfiguration_2 = computed(() => t('page.home.explore'));
  const computed_i18n_Label_HomePageConfiguration_3 = computed(() => t('page.home.newlyAdded'));
  const computed_i18n_Label_HomePageConfiguration_4 = computed(() => t('page.home.recentlyPlayed'));
  const computed_i18n_Label_SidebarConfiguration_3 = computed(() => t('common.home'));
  const computed_i18n_Label_SidebarConfiguration_5 = computed(() => t('entity.album_other'));
  const computed_i18n_Label_SidebarConfiguration_6 = computed(() => t('entity.track_other'));
  const computed_i18n_Label_SidebarConfiguration_7 = computed(() => t('entity.artist_other'));
  const computed_i18n_Label_SidebarConfiguration_8 = computed(() => t('entity.genre_other'));
  const computed_i18n_Label_SidebarConfiguration_10 = computed(() => t('nsmusics.siderbar_menu.guessLike'));
  const computed_i18n_Label_SidebarConfiguration_11 = computed(() => t('nsmusics.siderbar_menu.karaoke'));
  const computed_i18n_Label_SidebarConfiguration_12 = computed(() => t('nsmusics.siderbar_menu.identifySong'));
  const computed_i18n_Label_SidebarConfiguration_13 = computed(() => t('nsmusics.siderbar_menu.scoreGeneration'));
  const computed_i18n_Label_SidebarConfiguration_14 = computed(() => t('nsmusics.siderbar_menu.lyricsProduction'));
  const computed_i18n_Label_SidebarConfiguration_15 = computed(() => t('nsmusics.siderbar_menu.musicCommunity'));

  import { store_app_configs_info } from '@/store/app/store_app_configs_info'
  import { store_server_users } from '@/store/server/store_server_users'
  const get_server_config_of_current_user_of_sqlite = inject('get_server_config_of_current_user_of_sqlite');

  ////// server
  const Type_Server_Kinds = [
    {
      value: "NSMusicS",
      label: "NSMusicS"
    },
    {
      value: "subsonic",
      label: "subsonic"
    },
    {
      value: 'navidrome',
      label: 'navidrome'
    },
    {
      value: "Jellyfin",
      label: "Jellyfin"
    },
    {
      value: "emby",
      label: "emby"
    },
    {
      value: "webdev",
      label: "webdev"
    },
    {
      value: "onedrive",
      label: "onedrive"
    }
  ].map((s) => {
    s.value = s.value.toLowerCase()
    return s
  })
  const Type_Server_Selected = ref(Type_Server_Kinds[2].value)
  const Type_Server_Add = ref(false)
  const Type_Server_Model_Open = ref(true)
  const Type_Server_Model_Open_Value = ref('local')
  const Type_Server_Model_Open_Option = ref([
    {
      label: computed(() => t('nsmusics.view_page.modelLocal')),
      value: 'local',
    },
    {
      label: computed(() => t('nsmusics.view_page.modelServer')),
      value: 'server',
    },
  ])
  onMounted(() => {
    if(store_server_user_model.model_select === 'local')
      Type_Server_Model_Open_Value.value = Type_Server_Model_Open_Option.value[0].value
    else
      Type_Server_Model_Open_Value.value = Type_Server_Model_Open_Option.value[1].value
  });
  import { useMessage } from 'naive-ui'
  const message = useMessage()
  /// server select
  async function update_server_config_of_current_user_of_sqlite(value: any){
    try {
      const index = store_server_users.server_config_of_all_user_of_sqlite.findIndex(item => item.id === value);
      await update_server_setUser(
          store_server_users.server_config_of_all_user_of_sqlite[index].id,
          store_server_users.server_config_of_all_user_of_sqlite[index].server_name,
          store_server_users.server_config_of_all_user_of_sqlite[index].url,
          store_server_users.server_config_of_all_user_of_sqlite[index].user_name,
          store_server_users.server_config_of_all_user_of_sqlite[index].password
      )
      get_server_config_of_current_user_of_sqlite(store_server_users.server_config_of_all_user_of_sqlite[index])
      if(store_server_user_model.model_server_type_of_web){
        console.log('store_server_user_model.model_server_type_of_web')
        let user_Authorization_ApiWebService_of_ND = new User_Authorization_ApiWebService_of_ND(
            store_server_users.server_config_of_current_user_of_sqlite?.url
        )
        await user_Authorization_ApiWebService_of_ND.get_token()
        store_app_configs_logic_save.save_system_config_of_App_Configs()
        store_app_configs_logic_save.save_system_config_of_Servers_Config()
        /// reset app data
        // ipcRenderer.send('window-reset-data');
      }
    }catch {
      console.error('error: update_server_setUser + get_server_config_of_current_user_of_sqlite')
    }
  }
  /// server add
  import { Set_ServerInfo_To_LocalSqlite } from "@/features/sqlite3_local_configs/class_Set_ServerInfo_To_LocalSqlite";
  const server_set_of_addUser_of_type = ref('')
  const server_set_of_addUser_of_servername = ref('')
  const server_set_of_addUser_of_url = ref('')
  const server_set_of_addUser_of_username = ref('')
  const server_set_of_addUser_of_password = ref('')
  async function update_server_setUser(id:string,server_name:string,url:string, user_name:string,password:string) {
    const userService = new User_ApiService_of_ND(url+'/rest');
    const {salt, token} = generateEncryptedPassword(password);
    const userData = await userService.getUser(user_name, token, salt);
    if (userData["subsonic-response"]["status"] === 'ok'){
      let set_ServerInfo_To_LocalSqlite = new Set_ServerInfo_To_LocalSqlite();
      const data:Server_Configs_Props = set_ServerInfo_To_LocalSqlite.Set_ServerInfo_To_Update_SetUser_of_ND(id, server_name, url, user_name, password)
      const new_data: Server_Configs_Props[] = store_server_users.server_config_of_all_user_of_sqlite;
      const index = new_data.findIndex(item => item.id === data.id);
      if (index !== -1) {
        new_data[index] = data;
      } else {
        new_data.push(data);
      }
      store_server_users.get_server_config_of_all_user_of_sqlite(new_data)
      message.success(t('form.updateServer.success'))
    }else{
      message.error(t('error.invalidServer'))
    }
  }
  async function update_server_deleteUser(id: string) {
    let set_ServerInfo_To_LocalSqlite = new Set_ServerInfo_To_LocalSqlite();
    set_ServerInfo_To_LocalSqlite.Set_ServerInfo_To_Update_DeleteUser_of_ND(id);
    const new_data: Server_Configs_Props[] = store_server_users.server_config_of_all_user_of_sqlite;
    const index = new_data.findIndex(item => item.id === id);
    new_data.splice(index, 1);
    store_server_users.get_server_config_of_all_user_of_sqlite(new_data)
  }
  async function update_server_addUser() {
    try{
      server_set_of_addUser_of_type.value = Type_Server_Selected.value;
      const userService = new User_ApiService_of_ND(server_set_of_addUser_of_url.value+'/rest');
      const {salt, token} = generateEncryptedPassword(server_set_of_addUser_of_password.value);
      const userData = await userService.getUser(server_set_of_addUser_of_username.value, token, salt);
      if (userData["subsonic-response"]["status"] === 'ok'){
        let set_ServerInfo_To_LocalSqlite = new Set_ServerInfo_To_LocalSqlite();
        const data:Server_Configs_Props = set_ServerInfo_To_LocalSqlite.Set_ServerInfo_To_Update_CreateUser_of_ND(
          server_set_of_addUser_of_servername.value,
          server_set_of_addUser_of_url.value,
          server_set_of_addUser_of_username.value,
          server_set_of_addUser_of_password.value
        );
        const new_data: Server_Configs_Props[] = store_server_users.server_config_of_all_user_of_sqlite;
        new_data.push(data)
        store_server_users.get_server_config_of_all_user_of_sqlite(new_data)
        message.success(t('form.addServer.success'))
        Type_Server_Add.value = !Type_Server_Add.value
      }
    }catch (e) {
      message.error(t('error.invalidServer'),{ duration: 3000 })
    }
  }
  ///
  const crypto = require('crypto');
  import { User_ApiService_of_ND } from "@/features/servers_configs/navidrome_api/services_normal/user_management/index_service";
  function generateEncryptedPassword(password: string): { salt: string, token: string } {
    const saltLength = 6;
    const salt = generateRandomString(saltLength);
    const token = crypto.createHash('md5').update(password + salt, 'utf8').digest('hex');
    return { salt, token };
  }
  function generateRandomString(length: number): string {
    const characters = 'dfeVYUY9iu239iBUYHuji46h39BHUJ8u42nmrfhDD3r4ouj123890fvn48u95h';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return randomString;
  }

  ////// this_view components of navie ui
  import {ref, onMounted, watch, onBeforeUnmount, computed, h, inject} from 'vue';
  import {type MenuOption, NButton, NIcon,} from 'naive-ui'
  import {store_server_user_model} from "@/store/server/store_server_user_model";
  import {store_player_audio_logic} from "@/store/player/store_player_audio_logic";
  import {store_app_configs_logic_theme} from "@/store/app/store_app_configs_logic_theme";
  import {store_local_db_info} from "@/store/local/store_local_db_info";
  import {store_player_appearance} from "@/store/player/store_player_appearance";
  import {
    Class_Get_MediaTag_Configs_Read
  } from "@/features/sqlite3_taglib_configs/class_Get_MediaTag_Configs_Read";
  import {
    User_Authorization_ApiWebService_of_ND
  } from "@/features/servers_configs/navidrome_api/services_web/user_authorization/index_service";
  import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
  import {store_router_data_logic} from "@/store/router/store_router_data_logic";
  import {store_player_audio_info} from "@/store/player/store_player_audio_info";
  const theme_value = ref('lightTheme')
  const theme_options = ref([
    {
      label: computed(() => t('setting.themeLight')),
      value: 'lightTheme',
    },
    {
      label: computed(() => t('setting.themeDark')),
      value: 'darkTheme',
    },
  ])
  onMounted(() => {
    if(store_app_configs_info.update_theme)
      theme_value.value = theme_options.value[1].value
    else
      theme_value.value = theme_options.value[0].value
  });

  ////// local
  const { ipcRenderer } = require('electron');
  const timer_percentage = ref<NodeJS.Timeout | null>(null);
  const show_selectFolder = ref(false)
  async function selectFolder() {
    if (!library_path_search.value) {
      try {
        library_path_search.value = true;
        const folderPath = await ipcRenderer.invoke('library-select-folder');
        if (folderPath) {
          store_server_user_model.library_path = folderPath;
          clearInterval(timer_percentage.value);
          console.log('Before invoking node-taglib-sharp-get-directory-filePath');
          store_server_users.percentage_of_local = 10;
          const error_log = await ipcRenderer.invoke('node-taglib-sharp-get-directory-filePath', [folderPath])
            .then(success => {
              console.log('node-taglib-sharp-get-directory-filePath succeeded:', success);
              library_path_search.value = success;
              clearInterval(timer_percentage.value);
            })
            .catch(error => {
              console.error('node-taglib-sharp-get-directory-filePath failed:', error);
              store_local_db_info.result_local = false;
            });
          console.error(error_log)
          timer_percentage.value = setInterval(synchronize_percentage_of_library_path_search, 200);
          console.log('Folder path selected:', folderPath);
          // reset data
          store_server_user_model.switchToMode_Navidrome_Api()
          store_server_user_model.switchToMode_Local()
        } else {
          library_path_search.value = false;
          show_selectFolder.value = false;
        }
      } catch (error) {
        console.error('Error selecting folder:', error);
        clearInterval(timer_percentage.value);
        store_server_users.percentage_of_local = 0;
      }
    }
  }
  const library_path_search = ref(false)
  async function synchronize_percentage_of_library_path_search(){
    store_server_users.percentage_of_local = await ipcRenderer.invoke('node-taglib-sharp-percentage');
  }

  //////
  const selectd_props_home_page = ref<(string | number)[] | null>(null)
  const handleUpdate_selectd_props_home_page_Value = (value: (string | number)[]) => {
    selectd_props_home_page.value = value
    console.log(JSON.stringify(value))
  }
  const handleUpdate_selectd_props_app_sidebar_Value = (value: number[]) => {
    store_app_configs_info.selectd_props_app_sidebar = value
    console.log(value)
    let allMenuOptions = create_menuOptions_appBar();
    let removeFlags = new Array(allMenuOptions.length).fill(true);
    value.forEach(index => {
      if (index < allMenuOptions.length) {
        removeFlags[index] = false;
      }
    });
    removeFlags[0] = false;
    removeFlags[1] = false;
    removeFlags[3] = removeFlags[2];
    if(removeFlags[4] && removeFlags[5] && removeFlags[6] && removeFlags[7])
      removeFlags[8] = true;
    else
      removeFlags[8] = false;
    let menuOptions_appBar = allMenuOptions.filter((option, index) => {
      return !removeFlags[index];
    });
    store_app_configs_info.menuOptions_appBar = menuOptions_appBar
  }
  function renderIcon (icon: any) {
    return () => h(NIcon, null, { default: () => h(icon) })
  }
  function renderRouterLink (nameValue: any,defaultValue: any){
    return () => h(RouterLink, {to: { name: nameValue }}, { default: () => defaultValue })
  }
  const create_menuOptions_appBar = (): MenuOption[] => {
    return [
      {label: computed(() => renderRouterLink('View_Menu_AppSetting',t('common.menu'))),key: 'View_Menu_AppSetting',icon: renderIcon(MenuIcon),},
      {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
      {label: computed(() => renderRouterLink('View_Home_MusicLibrary_Browse',t('common.home'))),key: 'View_Home_MusicLibrary_Browse',icon: renderIcon(Home28Regular),},
      {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
      {label: computed(() => renderRouterLink('View_Album_List_ALL',t('entity.album_other'))),key: 'View_Album_List_ALL',icon: renderIcon(AlbumFilled)},
      {label: computed(() => renderRouterLink('View_Song_List_ALL',t('entity.track_other'))),key: 'View_Song_List_ALL',icon: renderIcon(MusicNoteRound)},
      {label: computed(() => renderRouterLink('View_Artist_List_ALL',t('entity.artist_other'))),key: 'View_Artist_List_ALL',icon: renderIcon(UserAvatarFilledAlt)},
      {label: computed(() => renderRouterLink('View_Updateing',t('entity.genre_other'))),key: 'View_Updateing',icon: renderIcon(Flag16Regular)},
      {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
      {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.guessLike'))),key: 'View_Updateing',icon: renderIcon(DocumentHeart20Regular)},
      {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.karaoke'))),key: 'View_Updateing',icon: renderIcon(SlideMicrophone32Regular)},
      {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.identifySong'))),key: 'View_Updateing',icon: renderIcon(Hearing)},
      {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.scoreGeneration'))),key: 'View_Updateing',icon: renderIcon(LibraryMusicOutlined)},
      {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.lyricsProduction'))),key: 'View_Updateing',icon: renderIcon(lyric)},
      {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.musicCommunity'))),key: 'View_Updateing',icon: renderIcon(PeopleCommunity16Regular)},
    ]
  };

  ////// 设置：通用
  const languages = [
    {
      label: '简体中文',
      value: 'zhHans',
    },
    {
      label: '繁體中文',
      value: 'zhHant',
    },
    {
      label: 'English',
      value: 'en',
    },
    {
      label: 'Čeština',
      value: 'cs',
    },
    {
      label: 'Español',
      value: 'es',
    },
    {
      label: 'Deutsch',
      value: 'de',
    },
    {
      label: 'Français',
      value: 'fr',
    },
    {
      label: 'Italiano',
      value: 'it',
    },
    {
      label: '日本語',
      value: 'ja',
    },
    {
      label: 'Nederlands',
      value: 'nl',
    },
    {
      label: 'فارسی',
      value: 'fa',
    },
    {
      label: 'Português (Brasil)',
      value: 'ptBr',
    },
    {
      label: 'Polski',
      value: 'pl',
    },
    {
      label: 'Русский',
      value: 'ru',
    },
    {
      label: 'Srpski',
      value: 'sr',
    },
    {
      label: 'Svenska',
      value: 'sv',
    },
  ];
  const player_lyric_panel_fontfamily_options_selected = ref<{label:any,value:any}>();
  const player_lyric_panel_fontfamily_options = ref([
    {
      label: 'Drive My Car',
      value: 'song1'
    }])

  /////// 设置：播放
  const player_fade_model_options_selected = ref<{label:any,value:any}>();
  const player_fade_model_options = ref([
    {
      label: computed(() => t('setting.playbackStyle_optionNormal')),
      value: 'playbackStyle_optionNormal',
    },
    {
      label: computed(() => t('setting.playbackStyle_optionCrossFade')),
      value: 'playbackStyle_optionCrossFade',
    },
  ])
  const update_player_fade_model_options_selected = () => {
    if(player_fade_model_options_selected.value === 'playbackStyle_optionNormal'){
      store_player_audio_logic.player_fade_value = 0
    }else if(player_fade_model_options_selected.value === 'playbackStyle_optionCrossFade'){
      store_player_audio_logic.player_fade_value = 1000
    }
  }
  const update_player_fade_value = () => {
    if(store_player_audio_logic.player_fade_value != 0){
      player_fade_model_options_selected.value = 'playbackStyle_optionCrossFade'
    }else{
      player_fade_model_options_selected.value = 'playbackStyle_optionNormal'
    }
  }
  const update_player_dolby = () => {
    if(store_player_audio_logic.player_dolby){
      store_player_audio_logic.player_select = 'web'
    }
  }
  const update_player_samp_value = () => {
    if(store_player_audio_logic.player_samp_value < 8000){
      store_player_audio_logic.player_samp_value = 48000
    }
  }
  onMounted(() => {
    if(store_player_audio_logic.player_fade_value > 0)
      player_fade_model_options_selected.value = player_fade_model_options.value[1].value
    else
      player_fade_model_options_selected.value = player_fade_model_options.value[0].value
  })

  ////// lineItems Re render
  let bool_watch = false;
  let timer = ref<NodeJS.Timeout | null>(null);
  const startTimer = () => {
    timer.value = setInterval(() => {
      bool_watch = true;
    }, 1000);
  };
  const stopWatching_collapsed_width = watch(() => store_app_configs_info.app_left_menu_collapsed, (newValue, oldValue) => {
    updateGridItems();
  });
  const stopWatching_window_innerWidth = watch(() => store_app_configs_info.window_innerWidth, (newValue, oldValue) => {
    bool_watch = false;
    updateGridItems();
    if (bool_watch) {
      startTimer();
    }
  });
  const collapsed_width = ref<number>(1090);
  const updateGridItems = () => {
    if (store_app_configs_info.app_left_menu_collapsed == true) {
      collapsed_width.value = 145;
    } else {
      collapsed_width.value = 240;
    }
  };
  onMounted(() => {
    startTimer();
    updateGridItems();
  });

  ////// view songlist_view Remove data
  onBeforeUnmount(() => {
    stopWatching_collapsed_width()
    stopWatching_window_innerWidth()
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
  });
</script>
<template>
  <div class="view">
    <n-layout
      embedded
      content-style="margin-left: 9px;"
      vertical
      :size="12" >
      <n-card
        class="table"
        style="overflow: hidden;border-radius: 6px;"
        :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 160) + 'px)'}">
        <n-tabs
          style="margin-top: -20px;"
          v-model:value="store_app_configs_info.menu_app_setting_select_tab_name"
          size="large"
          animated
          pane-wrapper-style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
          <!-- 服务器 -->
          <n-tab-pane name="tab_pane_1">
            <template #tab>
              {{ $t('page.appMenu.manageServers') }}
            </template>
            <n-space style="height: calc(100vh - 230px);" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 160) + 'px)'}">
              <!-- 服务器管理 -->
              <n-space vertical size="large">
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical style="width: 320px;">
                    <span style="font-size:16px;font-weight: 600;">{{ $t('page.appMenu.manageServers') }}</span>
                  </n-space>
                  <n-space align="end">
                    <n-button tertiary @click="Type_Server_Add = !Type_Server_Add">
                      <template #icon>
                        <n-icon>
                          <Add />
                        </n-icon>
                      </template>
                      {{ $t('form.addServer.title') }}
                    </n-button>
                  </n-space>
                </n-space>
                <DynamicScroller
                  class="table" ref="scrollbar"
                  style="overflow: auto;width: 785px;max-height: 62vh;"
                  :items="store_server_users.server_config_of_all_user_of_sqlite"
                  :itemSize="70"
                  :grid-items="3"
                  :item-secondary-size="260">
                  <!-- :minItemSize="6"> -->
                  <template #default="{ item, index, active }">
                    <DynamicScrollerItem
                      :item="item"
                      :active="active"
                      :data-index="index"
                      :data-active="active"
                      style="display: flex;"
                      >
                      <div
                        class="server_item_info"
                        @click="item.show = !item.show"
                        style="
                          width: 230px;
                          height: 54px;
                          margin-bottom: 14px;
                          border: 1px solid #f0f0f070;border-radius: 5px;
                          padding-top: 14px;padding-left: 14px;padding-right: 14px;
                          box-shadow: #18181820 0 0 0 1px inset;
                        ">
                        <n-space justify="space-between" style="margin-top: 2.5px;">
                          <n-space>
                            <n-icon size="20">
                              <BareMetalServer />
                            </n-icon>
                            <div style="width: 140px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                              {{ item.type+' - '+item.server_name }}</div>
                          </n-space>
                          <span style="width: 18px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ (index+1) }}</span>
                        </n-space>
                        <n-modal
                          v-model:show="item.show">
                          <n-card style="width: 450px;border-radius: 6px;">
                            <n-space
                              vertical size="large" style="width: 400px;">
                              <n-space justify="space-between" style="margin-bottom: 12px;">
                                <span style="font-size: 20px;font-weight: 600;">{{ $t('page.appMenu.manageServers') }}</span>
                                <n-button tertiary size="small" @click="item.show = false">
                                  <template #icon>
                                    <n-icon>
                                      <Close />
                                    </n-icon>
                                  </template>
                                </n-button>
                              </n-space>
                              <n-form style="margin-top: -12px;">
                                <n-space vertical size="small" style="margin-bottom: 10px;">
                                  <span>{{ $t('form.addServer.input_name') }}</span>
                                  <n-input clearable size="small" v-model:value="item.server_name" placeholder=""/>
                                </n-space>
                                <n-space vertical size="small" style="margin-bottom: 10px;">
                                  <span>{{ $t('form.addServer.input_url') }}</span>
                                  <n-input-group>
                                    <n-input clearable size="small" v-model:value="item.url" placeholder=""/>
                                  </n-input-group>
                                </n-space>
                                <n-space vertical size="small" style="margin-bottom: 10px;">
                                  <span>{{ $t('form.addServer.input_username') }}</span>
                                  <n-input clearable size="small" v-model:value="item.user_name" placeholder=""/>
                                </n-space>
                                  <n-space vertical size="small" style="margin-bottom: 10px;">
                                  <span>{{ $t('form.addServer.input_password') }}</span>
                                  <n-input clearable type="password" show-password-on="click" size="small"
                                           v-model:value="item.password"
                                           placeholder=""/>
                                </n-space>
                              </n-form>
                              <n-space justify="end">
                                <n-button strong secondary type="error"
                                          @click="item.show = false;update_server_deleteUser(item.id);">
                                  {{ $t('common.delete') }}
                                </n-button>
                                <n-button strong secondary type="info"
                                          @click="update_server_setUser(
                                              item.id,
                                              item.server_name,item.url,
                                              item.user_name,item.password
                                          )">
                                  {{ $t('common.save') }}
                                </n-button>
                              </n-space>
                            </n-space>
                          </n-card>
                        </n-modal>
                      </div>
                    </DynamicScrollerItem>
                  </template>
                </DynamicScroller>
              </n-space>
              <!-- 服务器添加 -->
              <n-modal
                v-model:show="Type_Server_Add">
                <n-card style="width: 450px;border-radius: 6px;">
                  <n-space
                    vertical size="large" style="width: 400px;">
                    <n-space justify="space-between">
                      <span style="font-size: 20px;font-weight: 600;">{{ $t('form.addServer.title') }}</span>
                      <n-button tertiary size="small" @click="Type_Server_Add = !Type_Server_Add">
                        <template #icon>
                          <n-icon>
                            <Close />
                          </n-icon>
                        </template>
                      </n-button>
                    </n-space>
                    <n-radio-group v-model:value="Type_Server_Selected">
                      <n-radio-button
                          style="text-align: center;width: 133px;"
                          disabled
                          :key="Type_Server_Kinds[0].value"
                          :value="Type_Server_Kinds[0].value"
                          :label="Type_Server_Kinds[0].label"
                      />
                      <n-radio-button
                          style="text-align: center;width: 132px;"
                          disabled
                          :key="Type_Server_Kinds[1].value"
                          :value="Type_Server_Kinds[1].value"
                          :label="Type_Server_Kinds[1].label"
                      />
                      <n-radio-button
                          style="text-align: center;width: 133px;"
                          :key="Type_Server_Kinds[2].value"
                          :value="Type_Server_Kinds[2].value"
                          :label="Type_Server_Kinds[2].label"
                      />
                    </n-radio-group>
                    <n-radio-group v-model:value="Type_Server_Selected">
                      <n-radio-button
                          style="text-align: center;width: 133px;"
                          disabled
                          :key="Type_Server_Kinds[3].value"
                          :value="Type_Server_Kinds[3].value"
                          :label="Type_Server_Kinds[3].label"
                      />
                      <n-radio-button
                          style="text-align: center;width: 133px;"
                          disabled
                          :key="Type_Server_Kinds[4].value"
                          :value="Type_Server_Kinds[4].value"
                          :label="Type_Server_Kinds[4].label"
                      />
                    </n-radio-group>
                    <n-radio-group v-model:value="Type_Server_Selected">
                      <n-radio-button
                          style="text-align: center;width: 133px;"
                          disabled
                          :key="Type_Server_Kinds[5].value"
                          :value="Type_Server_Kinds[5].value"
                          :label="Type_Server_Kinds[5].label"
                      />
                      <n-radio-button
                          style="text-align: center;width: 133px;"
                          disabled
                          :key="Type_Server_Kinds[6].value"
                          :value="Type_Server_Kinds[6].value"
                          :label="Type_Server_Kinds[6].label"
                      />
                    </n-radio-group>
                    <n-form inline>
                      <n-space vertical style="width: 150px;margin-bottom: 10px;">
                        <span>{{ $t('form.addServer.input_name') }}</span>
                        <n-input clearable placeholder="" v-model:value="server_set_of_addUser_of_servername"/>
                      </n-space>
                      <n-space vertical style="width: 250px;margin-bottom: 10px;">
                        <span>{{ $t('form.addServer.input_url') }}</span>
                        <n-input-group>
                          <n-input clearable placeholder="" v-model:value="server_set_of_addUser_of_url"/>
                        </n-input-group>
                      </n-space>
                    </n-form>
                    <n-form style="margin-top: -12px;">
                      <n-space vertical style="margin-bottom: 10px;">
                        <span>{{ $t('form.addServer.input_username') }}</span>
                        <n-input clearable placeholder="" v-model:value="server_set_of_addUser_of_username"/>
                      </n-space>
                      <n-space vertical style="margin-bottom: 10px;">
                        <span>{{ $t('form.addServer.input_password') }}</span>
                        <n-input clearable type="password" show-password-on="click" placeholder="" v-model:value="server_set_of_addUser_of_password"/>
                      </n-space>
                    </n-form>
                    <n-space justify="end">
                      <n-button strong secondary type="error" @click="Type_Server_Add = !Type_Server_Add">
                        {{ $t('common.delete') }}
                      </n-button>
                      <n-button strong secondary type="info" @click="update_server_addUser();">
                        {{ $t('common.save') }}
                      </n-button>
                    </n-space>
                  </n-space>
                </n-card>
              </n-modal>
            </n-space>
          </n-tab-pane>
          <!-- 通用 -->
          <n-tab-pane name="tab_pane_2">
            <template #tab>
              {{ $t('page.setting.generalTab') }}
            </template>
            <n-scrollbar style="max-height: 70vh;" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 203) + 'px)'}">
              <n-space vertical>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.language') + ' | Language' }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.language_description') }}</span>
                    </div>
                  </n-space>
                  <n-select
                    v-model:value="$i18n.locale"
                    :options="languages"
                    style="width: 207px;margin-top: -4px;"
                    @update:value="() => {
                      store_app_configs_info.lang = $i18n.locale;
                      ipcRenderer.invoke('i18n-tray-label-menu',
                        [
                            t('player.play'),
                            t('player.pause'),
                            t('player.previous'),
                            t('player.next'),
                            t('nsmusics.view_page.desktop_lyrics'),
                            t('common.quit'),
                            t('nsmusics.siderbar_player.playback_1'),
                            t('nsmusics.siderbar_player.playback_2'),
                            t('nsmusics.siderbar_player.playback_3'),
                            t('nsmusics.siderbar_player.playback_4')
                        ]
                      );
                    }"
                  />
                </n-space>
                <n-divider style="margin: 0;"/>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.theme') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.theme_description') }}</span>
                    </div>
                  </n-space>
                  <n-select
                    v-model:value="theme_value"
                    :options="theme_options"
                    @update:value="store_app_configs_logic_theme.update_theme(theme_value)"
                    placeholder=""
                    :reset-menu-on-options-change="false"
                    style="width: 207px;margin-top: -4px;"
                  />
                </n-space>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_page.theme_automatic_switching') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('nsmusics.view_page.theme_automatic_switching_explain') }}</span>
                    </div>
                  </n-space>
                  <n-switch
                      v-model:value="store_app_configs_info.theme_auto_system">
                  </n-switch>
                </n-space>
                <n-divider style="margin: 0;"/>
                <n-space justify="space-between" align="center"
                         :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_page.routerModel') }}</span>
                  </n-space>
                </n-space>
                <n-space justify="space-between" align="center"
                         style="margin-left: 30px;"
                         :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 260) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_page.routerModel_type_1') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('nsmusics.view_page.routerModel_type_1_explain') }}</span>
                    </div>
                  </n-space>
                  <n-switch
                      v-model:value="store_router_data_logic.clear_Memory_Model"
                      @update:value="store_router_data_logic.get_clear_Memory_Model"
                      :disabled="store_server_user_model.model_server_type_of_web || store_player_audio_logic.player_select === 'web'"
                  >
                  </n-switch>
                </n-space>
                <n-space justify="space-between" align="center"
                         style="margin-left: 30px;"
                         :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 260) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_page.routerModel_type_2') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('nsmusics.view_page.routerModel_type_2_explain') }}</span>
                    </div>
                  </n-space>
                  <n-switch
                      v-model:value="store_router_data_logic.clear_Equilibrium_Model"
                      @update:value="store_router_data_logic.get_clear_Equilibrium_Model"
                      :disabled="store_server_user_model.model_server_type_of_web || store_player_audio_logic.player_select === 'web'"
                  >
                  </n-switch>
                </n-space>
                <n-space justify="space-between" align="center"
                         style="margin-left: 30px;"
                         :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 260) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_page.routerModel_type_3') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('nsmusics.view_page.routerModel_type_3_explain') }}</span>
                    </div>
                  </n-space>
                  <n-switch
                      v-model:value="store_router_data_logic.clear_UserExperience_Model"
                      @update:value="store_router_data_logic.get_clear_UserExperience_Model"
                      :disabled="store_server_user_model.model_server_type_of_web || store_player_audio_logic.player_select === 'web'"
                  >
                  </n-switch>
                </n-space>
                <n-divider style="margin: 0;"/>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_page.modelSelect') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('nsmusics.view_page.modelSelect_explain') }}</span>
                    </div>
                  </n-space>
                  <n-select
                    v-model:value="Type_Server_Model_Open_Value"
                    :options="Type_Server_Model_Open_Option"
                    @update:value="
                      Type_Server_Model_Open_Value === 'server' ?
                      (store_server_user_model.switchToMode_Navidrome_Api(),store_server_user_model.model_select = 'server')
                      :
                      (store_server_user_model.switchToMode_Local(),store_server_user_model.model_select = 'local')
                    "
                    placeholder=""
                    :reset-menu-on-options-change="false"
                    style="width: 207px;margin-top: -4px;"
                  />
                </n-space>
                <n-divider style="margin: 0;" v-if="Type_Server_Model_Open_Value === 'server'"/>
                <n-space vertical v-if="Type_Server_Model_Open_Value === 'server'">
                  <n-space justify="space-between" align="center"
                           :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                    <n-space vertical>
                      <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_page.modelServer') }}</span>
                    </n-space>
                  </n-space>
                  <n-space justify="space-between" align="center"
                           style="margin-left: 30px;"
                           :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 260) + 'px)'}">
                    <n-space vertical>
                      <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_page.modelServer_type_1') + ' - ' + $t('nsmusics.view_page.routerModel_type_3') }}</span>
                      <div style="margin-top: -10px;">
                        <span style="font-size:12px;">{{ $t('nsmusics.view_page.modelServer_type_1_explain') }}</span>
                      </div>
                    </n-space>
                    <n-switch
                        v-model:value="store_server_user_model.model_server_type_of_web"
                        @update:value="() => {
                          store_router_data_logic.clear_UserExperience_Model = true;
                          store_router_data_logic.get_clear_UserExperience_Model(true);
                          update_server_config_of_current_user_of_sqlite(
                            store_server_users.server_config_of_current_user_of_select_servername
                          );
                        }"
                    >
                    </n-switch>
                  </n-space>
                  <n-space justify="space-between" align="center"
                           style="margin-left: 30px;"
                           :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 260) + 'px)'}">
                    <n-space vertical>
                      <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_page.modelServer_type_2') }}</span>
                      <div style="margin-top: -10px;">
                        <span style="font-size:12px;">{{ $t('nsmusics.view_page.modelServer_type_2_explain') }}</span>
                      </div>
                    </n-space>
                    <n-switch
                        v-model:value="store_server_user_model.model_server_type_of_local">
                    </n-switch>
                  </n-space>
                  <n-space justify="space-between" align="center"
                           v-if="store_server_user_model.model_server_type_of_local"
                           :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                    <n-space vertical style="width: 320px;">
                      <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_page.selectServer')}}</span>
                      <div style="margin-top: -10px;">
                        <span style="font-size:12px;">
                          {{ $t('nsmusics.view_page.selectServer_explain') }}
                        </span>
                      </div>
                    </n-space>
                    <n-space align="end">
                      <n-progress
                          type="line" style="width: 207px;margin-bottom: 8px;"
                          :percentage="store_server_users.percentage_of_nd"
                          :indicator-placement="'inside'"
                      />
                    </n-space>
                  </n-space>
                  <n-space justify="space-between" align="center"
                           :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                    <n-space vertical>
                      <span style="font-size:16px;font-weight: 600;">{{ $t('page.appMenu.selectServer') }}</span>
                      <div style="margin-top: -10px;">
                        <span style="font-size:12px;">{{ $t('page.appMenu.selectServer') }}</span>
                      </div>
                    </n-space>
                    <n-select
                        v-model:value="store_server_users.server_config_of_current_user_of_select_servername"
                        :options="store_server_users.server_config_of_all_user_of_select"
                        style="width: 207px;margin-top: -4px;"
                        @update:value="(value: number) => update_server_config_of_current_user_of_sqlite(value)"
                    />
                  </n-space>
                </n-space>
                <n-divider style="margin: 0;" v-if="Type_Server_Model_Open_Value != 'server'"/>
                <n-space vertical v-if="Type_Server_Model_Open_Value != 'server'">
                  <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical style="width: 320px;">
                    <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_page.selectLibrary')}}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">
                        {{ $t('nsmusics.view_page.selectLibrary_explain') + ', ' + $t('common.restartRequired')}}
                      </span>
                    </div>
                  </n-space>
                  <n-space align="end">
                    <n-tag type="success" v-if="false">
                      {{ store_server_user_model.library_path }}
                    </n-tag>
                    <n-popconfirm v-model:show="show_selectFolder">
                      <template #trigger>
                        <n-button tertiary style="width: 150px;">
                          <template #icon>
                            <n-icon>
                              <Add />
                            </n-icon>
                          </template>
                          {{ $t('nsmusics.view_page.selectedSong') + $t('entity.folder_other')}}
                        </n-button>
                      </template>
                      {{ $t('nsmusics.view_page.selectLibrary') + '?' }}
                      <template #action>
                        <n-space vertical>
                          <n-space>
                            <n-button size="small" @click="show_selectFolder = false">
                              {{ $t('common.cancel') }}
                            </n-button>
                            <n-button size="small" @click="selectFolder">
                              {{ $t('common.confirm') }}
                            </n-button>
                          </n-space>
                          <n-button size="small"
                                    @click="
                                      show_selectFolder = false;
                                      store_server_users.percentage_of_local = 0;
                                      store_local_db_info.set_clear_all_local_data()
                                    "
                          >
                            {{ $t('common.clear') + ' ' + $t('nsmusics.view_page.modelLocal')}}
                          </n-button>
                        </n-space>
                      </template>
                    </n-popconfirm>
                    <n-progress
                      type="line" style="width: 207px;margin-bottom: 8px;"
                      :percentage="store_server_users.percentage_of_local"
                      :indicator-placement="'inside'"
                    />
                  </n-space>
                </n-space>
                </n-space>
                <n-divider v-if="false" style="margin: 0;"/>
                <n-space v-if="false" vertical :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space justify="space-between" align="center">
                    <n-space vertical>
                      <span style="font-size:16px;font-weight: 600;">{{ $t('setting.homeConfiguration') }}</span>
                      <div style="margin-top: -10px;">
                        <span style="font-size:12px;">{{ $t('setting.homeConfiguration_description') }}</span>
                      </div>
                    </n-space>
                  </n-space>
                  <n-checkbox-group :value="selectd_props_home_page" @update:value="handleUpdate_selectd_props_home_page_Value">
                    <n-grid :y-gap="8" :cols="4">
                      <n-gi>
                        <n-checkbox value="HomePageConfiguration_1" :label="computed_i18n_Label_HomePageConfiguration_1" />
                      </n-gi>
                      <n-gi>
                        <n-checkbox value="HomePageConfiguration_2" :label="computed_i18n_Label_HomePageConfiguration_2" />
                      </n-gi>
                      <n-gi>
                        <n-checkbox value="HomePageConfiguration_3" :label="computed_i18n_Label_HomePageConfiguration_3" />
                      </n-gi>
                      <n-gi>
                        <n-checkbox value="HomePageConfiguration_4" :label="computed_i18n_Label_HomePageConfiguration_4" />
                      </n-gi>
                    </n-grid>
                  </n-checkbox-group>
                </n-space>
                <n-divider style="margin: 0;"/>
                <n-space vertical :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space justify="space-between" align="center">
                    <n-space vertical>
                      <span style="font-size:16px;font-weight: 600;">{{ $t('setting.sidebarConfiguration') }}</span>
                      <div style="margin-top: -10px;">
                        <span style="font-size:12px;">{{ $t('setting.sidebarCollapsedNavigation_description') }}</span>
                      </div>
                    </n-space>
                  </n-space>
                  <n-checkbox-group :value="store_app_configs_info.selectd_props_app_sidebar"
                                    @update:value="handleUpdate_selectd_props_app_sidebar_Value">
                    <n-grid :y-gap="8" :cols="5">
                      <n-gi><n-checkbox value="2" :label="computed_i18n_Label_SidebarConfiguration_3" /></n-gi>
                      <n-gi><n-checkbox value="4" :label="computed_i18n_Label_SidebarConfiguration_5" /></n-gi>
                      <n-gi><n-checkbox value="5" :label="computed_i18n_Label_SidebarConfiguration_6" /></n-gi>
                      <n-gi><n-checkbox value="6" :label="computed_i18n_Label_SidebarConfiguration_7" /></n-gi>
                      <n-gi><n-checkbox value="7" :label="computed_i18n_Label_SidebarConfiguration_8" /></n-gi>
                      <n-gi><n-checkbox value="9" :label="computed_i18n_Label_SidebarConfiguration_10" /></n-gi>
                      <n-gi><n-checkbox value="10" :label="computed_i18n_Label_SidebarConfiguration_11" /></n-gi>
                      <n-gi><n-checkbox value="11" :label="computed_i18n_Label_SidebarConfiguration_12" /></n-gi>
                      <n-gi><n-checkbox value="12" :label="computed_i18n_Label_SidebarConfiguration_13" /></n-gi>
                      <n-gi><n-checkbox value="13" :label="computed_i18n_Label_SidebarConfiguration_14" /></n-gi>
                      <n-gi><n-checkbox value="14" :label="computed_i18n_Label_SidebarConfiguration_15" /></n-gi>
                    </n-grid>
                  </n-checkbox-group>
                </n-space>
                <n-divider v-if="false" style="margin: 0;"/>
                <n-space v-if="false" justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.clearQueryCache') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.clearQueryCache_description') }}</span>
                    </div>
                  </n-space>
                  <n-button>
                    {{ $t('common.clear') }}
                  </n-button>
                </n-space>
                <n-space v-if="false" justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.clearCache') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.clearCache_description') }}</span>
                    </div>
                  </n-space>
                  <n-button>
                    {{ $t('common.clear') }}
                  </n-button>
                </n-space>
              </n-space>
            </n-scrollbar>
          </n-tab-pane>
          <!-- 播放 -->
          <n-tab-pane name="tab_pane_3">
            <template #tab>
              {{ $t('page.setting.playbackTab') }}
            </template>
            <n-scrollbar style="max-height: 70vh;" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 203) + 'px)'}">
              <n-space vertical>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.audioPlayer') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.audioPlayer_description') + " | " + $t('nsmusics.view_page.audio_player_web_explain') }}</span>
                    </div>
                  </n-space>
                  <n-select
                      v-model:value="store_player_audio_logic.player_select"
                      :options="store_player_audio_logic.player_kind"
                      @update:value="() => {
                        store_router_data_logic.clear_Memory_Model = false;
                        store_router_data_logic.clear_Equilibrium_Model = false;
                        store_router_data_logic.clear_UserExperience_Model = true; }"
                      placeholder="not enabled"
                      :reset-menu-on-options-change="false"
                      style="width: 207px;margin-top: -4px;"
                  />
                </n-space>
                <n-space v-if="false" justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.audioDevice') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.audioDevice_description') }}</span>
                    </div>
                  </n-space>
                  <n-select
                      v-model:value="player_lyric_panel_fontfamily_options_selected"
                      :options="player_lyric_panel_fontfamily_options"
                      placeholder="not enabled"
                      :reset-menu-on-options-change="false"
                      style="width: 207px;margin-top: -4px;"
                  />
                </n-space>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.playbackStyle_description') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.playbackStyle_description') }}</span>
                    </div>
                  </n-space>
                  <n-select
                      v-model:value="player_fade_model_options_selected"
                      :options="player_fade_model_options"
                      @update:value="update_player_fade_model_options_selected"
                      placeholder="not enabled"
                      :reset-menu-on-options-change="false"
                      style="width: 207px;margin-top: -4px;"
                  />
                </n-space>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.crossfadeStyle') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.crossfadeStyle_description') }}</span>
                    </div>
                  </n-space>
                  <n-input-group style="width: 207px;margin-top: -4px;">
                    <n-input clearable
                             v-model:value="store_player_audio_logic.player_fade_value"
                             @update:value="update_player_fade_value"
                    />
                    <n-input-group-label>ms</n-input-group-label>
                  </n-input-group>
                </n-space>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_page.dolby_switching') + ' | ' + $t('setting.webAudio')}}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('nsmusics.view_page.dolby_switching_explain') }}</span>
                    </div>
                  </n-space>
                  <n-switch
                      :disabled="store_player_audio_logic.player_select != 'web'"
                      v-model:value="store_player_audio_logic.player_dolby"
                      @update:value="update_player_dolby"
                  >
                  </n-switch>
                </n-space>
                <n-space
                    justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.sampleRate') + ' | ' + $t('setting.mpvExtraParameters')}}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.sampleRate_description') }}</span>
                    </div>
                  </n-space>
                  <n-space
                      justify="end" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                    <n-input-group style="width: 207px;margin-top: -4px;">
                      <n-input clearable
                               :disabled="store_player_audio_logic.player_select != 'mpv'"
                               default-value="48000"
                               v-model:value="store_player_audio_logic.player_samp_value"
                               @update:value="update_player_samp_value"
                      />
                      <n-input-group-label>Hz</n-input-group-label>
                    </n-input-group>
                  </n-space>
                </n-space>
                <n-divider v-if="false" style="margin: 0;"/>
                <n-space v-if="false" justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.lyricOffset') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.lyricOffset_description') }}</span>
                    </div>
                  </n-space>
                  <n-input-group
                      style="width: 207px;margin-top: -4px;">
                    <n-input clearable default-value="100"/>
                    <n-input-group-label>ms</n-input-group-label>
                  </n-input-group>
                </n-space>
                <n-divider style="margin: 0;"/>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_player.view_seting.player_use_lottie') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('nsmusics.view_player.view_seting.player_use_lottie_explain') }}</span>
                    </div>
                  </n-space>
                  <n-switch
                      v-model:value="store_player_appearance.player_use_lottie_animation">
                  </n-switch>
                </n-space>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_player.view_seting.coverBaseVague') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('nsmusics.view_player.view_seting.coverBaseVague') }}</span>
                    </div>
                  </n-space>
                  <n-switch v-model:value="store_player_appearance.player_use_background_filter_blur">
                  </n-switch>
                </n-space>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_player.view_seting.player_use_playbar_auto_hide') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('nsmusics.view_player.view_seting.player_use_playbar_auto_hide_explain') }}</span>
                    </div>
                  </n-space>
                  <n-switch v-model:value="store_player_appearance.player_use_playbar_auto_hide">
                  </n-switch>
                </n-space>
              </n-space>
            </n-scrollbar>
          </n-tab-pane>
          <!-- 快捷键 -->
          <n-tab-pane name="tab_pane_4">
            <template #tab>
              {{ $t('page.setting.hotkeysTab') }}
            </template>
            <n-scrollbar style="max-height: 70vh;" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 203) + 'px)'}">
              <n-space vertical>
                <n-space v-if="false" justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.globalMediaHotkeys') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.globalMediaHotkeys_description') }}</span>
                    </div>
                  </n-space>
                  <n-switch
                      v-model:value="disabled">
                  </n-switch>
                </n-space>
                <n-divider style="margin: 0;"/>
                <n-space v-if="false" justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.applicationHotkeys') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.applicationHotkeys_description') }}</span>
                    </div>
                  </n-space>
                </n-space>
              </n-space>
            </n-scrollbar>
          </n-tab-pane>
          <!-- 窗口 -->
          <n-tab-pane name="tab_pane_5">
            <template #tab>
              {{ $t('page.setting.windowTab') }}
            </template>
            <n-scrollbar style="max-height: 70vh;" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 203) + 'px)'}">
              <n-space vertical>
                <n-space v-if="false" justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.windowBarStyle') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.windowBarStyle_description') }}</span>
                    </div>
                  </n-space>
                  <n-select
                      v-model:value="player_lyric_panel_fontfamily_options_selected"
                      :options="player_lyric_panel_fontfamily_options"
                      placeholder="not enabled"
                      :reset-menu-on-options-change="false"
                      style="width: 207px;margin-top: -4px;"
                  />
                </n-space>
                <n-space v-if="false" justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.minimizeToTray') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.minimizeToTray_description') }}</span>
                    </div>
                  </n-space>
                  <n-switch
                      v-model:value="disabled">
                  </n-switch>
                </n-space>
                <n-space v-if="false" justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.exitToTray') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.exitToTray_description') }}</span>
                    </div>
                  </n-space>
                  <n-switch
                      v-model:value="disabled">
                  </n-switch>
                </n-space>
                <n-space v-if="false" justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.startMinimized') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.startMinimized_description') }}</span>
                    </div>
                  </n-space>
                  <n-switch
                      v-model:value="disabled">
                  </n-switch>
                </n-space>
                <n-divider style="margin: 0;"/>
                <n-space v-if="false" justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.disableAutomaticUpdates') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.disableAutomaticUpdates') }}</span>
                    </div>
                  </n-space>
                  <n-switch
                      v-model:value="disabled">
                  </n-switch>
                </n-space>
              </n-space>
            </n-scrollbar>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </n-layout>
  </div>
</template>
<style scoped>
.view{
  height: calc(100vh - 160px);
  overflow: auto;
  overflow-x:hidden;
  display: flex;
  flex-direction: column;
}
.table{
  height: calc(100vh - 160px);
  overflow: auto;
}

.server_item_info {
  transition: outline-color 0.3s ease, background-color 0.3s ease;
}
.server_item_info:hover {
  outline: 0.5px solid #f0f0f090;
  background-color: #f0f0f090;
}

::-webkit-scrollbar {
  display: auto;
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #88888850;
  border-radius: 6px;
}
::-webkit-scrollbar-track {
  background-color: #f1f1f105;
  border-radius: 6px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #88888850;
  border-radius: 6px;
}
</style>