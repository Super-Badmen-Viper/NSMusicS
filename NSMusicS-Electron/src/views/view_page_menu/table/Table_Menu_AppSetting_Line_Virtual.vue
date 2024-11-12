<script setup lang="ts">
  ////// this_view resource of vicons_svg
  import {
    Delete20Regular
  } from '@vicons/fluent'
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

  ////// this_view components
  import { store_app_configs_info } from '@/store/app/store_app_configs_info'
  import { store_server_users } from '@/store/server/store_server_users'
  import {ref, onMounted, watch, onBeforeUnmount, computed, h, inject} from 'vue';
  import {type MenuOption, NButton, NIcon,} from 'naive-ui'
  import {store_server_user_model} from "@/store/server/store_server_user_model";
  import {store_player_audio_logic} from "@/store/player/store_player_audio_logic";
  import {store_app_configs_logic_theme} from "@/store/app/store_app_configs_logic_theme";
  import {store_local_db_info} from "@/store/local/store_local_db_info";
  import {store_player_appearance} from "@/store/player/store_player_appearance";
  import {store_router_data_logic} from "@/store/router/store_router_data_logic";
  import {store_server_data_select_logic} from "@/store/server/server_data_select/store_server_data_select_logic";
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

  import { useMessage } from 'naive-ui'
  const message = useMessage()
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
    store_server_users.percentage_of_nd = 0
    if(store_server_user_model.model_select === 'local')
      Type_Server_Model_Open_Value.value = Type_Server_Model_Open_Option.value[0].value
    else
      Type_Server_Model_Open_Value.value = Type_Server_Model_Open_Option.value[1].value
  });
  const server_set_of_addUser_of_type = ref('')
  const server_set_of_addUser_of_servername = ref('')
  const server_set_of_addUser_of_url = ref('')
  const server_set_of_addUser_of_username = ref('')
  const server_set_of_addUser_of_password = ref('')
  /// server add
  async function update_server_addUser() {
    server_set_of_addUser_of_type.value = Type_Server_Selected.value;
    try{
      const result = await store_server_data_select_logic.update_server_addUser(
          server_set_of_addUser_of_servername.value,
          server_set_of_addUser_of_url.value,
          server_set_of_addUser_of_username.value,
          server_set_of_addUser_of_password.value,
          server_set_of_addUser_of_type.value
      )
      if(result){
        message.success(t('form.addServer.success'))
      }else{
        message.error(t('error.invalidServer'),{ duration: 3000 })
      }
    }catch (e) {
      message.error(t('error.invalidServer'),{ duration: 3000 })
    }
    Type_Server_Add.value = !Type_Server_Add.value
  }
  /// server delete
  async function update_server_deleteUser(id: string, type: string) {
    try {
      const result = await store_server_data_select_logic.update_server_deleteUser(
          id,
          type
      )
      if(result){
        message.success(t('form.updateServer.success'))
      }else{
        message.error(t('error.invalidServer'),{ duration: 3000 })
      }
    }catch{
      message.error(t('error.invalidServer'),{ duration: 3000 })
    }
  }
  /// server update
  async function update_server_setUser(id:string, server_name:string, url:string, user_name:string, password:string, type: string) {
    try {
      const result = await store_server_data_select_logic.update_server_setUser(
          id,
          server_name, url,
          user_name, password,
          type
      )
      if(result){
        message.success(t('form.updateServer.success'))
      }else{
        message.error(t('error.invalidServer'),{ duration: 3000 })
      }
    }catch{
      message.error(t('error.invalidServer'),{ duration: 3000 })
    }
  }
  /// server select
  async function update_server_config_of_current_user_of_sqlite(value: any, select_change: any){
    if(select_change) {
      try {
        const index = store_server_users.server_config_of_all_user_of_sqlite.findIndex(item => item.id === value);
        const user_config = store_server_users.server_config_of_all_user_of_sqlite[index]
        const result = await store_server_data_select_logic.update_server_config_of_current_user_of_sqlite(
            value,
            user_config?.type
        )
        if (result) {
          message.success(t('form.updateServer.success'))
          if(user_config?.type === 'navidrome'){
            store_server_user_model.server_select_kind = 'navidrome'
          }else if(user_config?.type === 'subsonic'){
            store_server_user_model.server_select_kind = 'subsonic'
          }
        } else {
          message.error(t('error.invalidServer'), {duration: 3000})
        }
      } catch (e) {
        message.error(t('error.invalidServer'), {duration: 3000})
      }
    }
    store_server_users.percentage_of_nd = 0
  }

  ////// local
  const { ipcRenderer } = require('electron');
  const timer_percentage = ref<NodeJS.Timeout | null>(null);
  async function select_Folder() {
    try {
      const folderPath = await ipcRenderer.invoke('library-select-folder');
      if (folderPath) {
        store_server_user_model.library_path = folderPath;
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      store_server_users.percentage_of_local = 0;
    }
  }
  async function begin_import_Folder(cover: boolean) {
    try {
      if (store_server_user_model.library_path) {
        clearInterval(timer_percentage.value);
        console.log('Before invoking node-taglib-sharp-get-directory-filePath');
        store_server_users.percentage_of_local = 10;
        const folderPath = store_server_user_model.library_path
        const file_name_model = true
        const error_log = await ipcRenderer.invoke('node-taglib-sharp-get-directory-filePath',
            {
              folderPath,
              cover,
              file_name_model
            }
        )
          .then(success => {
            console.log('node-taglib-sharp-get-directory-filePath succeeded:', success);
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
        store_server_user_model.switchToMode_Server()
        store_server_user_model.switchToMode_Local()
        //
        await ipcRenderer.send('window-reset-all')
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      clearInterval(timer_percentage.value);
      store_server_users.percentage_of_local = 0;
    }
  }
  async function synchronize_percentage_of_library_path_search(){
    store_server_users.percentage_of_local = await ipcRenderer.invoke('node-taglib-sharp-percentage');
  }

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
  ////// 设置：通用 - 侧边栏
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
      store_player_audio_logic.player_fade_value = 2000
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
  const update_player_samp_value = (value: any) => {
    store_player_audio_logic.player_samp_value = value
  }
  const computed_i18n_Label_mpvExtraParameters = computed(() => t('setting.mpvExtraParameters_help') + ':\n--gapless-audio=weak\n--prefetch-playlist=yes');
  const update_player_mpvExtraParameters = (value: any) => {
    store_player_audio_logic.player_mpvExtraParameters = value
  }
  const player_gaplessAudio_kind = ref([
    { label: computed(() => t('common.no')), value: 'no' },
    { label: computed(() => t('common.yes')), value: 'yes' },
    { label: computed(() => t('setting.gaplessAudio_optionWeak')), value: 'weak' },
  ])
  const player_audio_channel_kind = ref([
    { label: 'empty', value: 'empty' },
    { label: 'mono', value: 'mono' },
    { label: '1.0', value: '1.0' },
    { label: 'stereo', value: 'stereo' },
    { label: '2.0', value: '2.0' },
    { label: '2.1', value: '2.1' },
    { label: '3.0', value: '3.0' },
    { label: '3.0(back)', value: '3.0(back)' },
    { label: '4.0', value: '4.0' },
    { label: 'quad', value: 'quad' },
    { label: 'quad(side)', value: 'quad(side)' },
    { label: '3.1', value: '3.1' },
    { label: '3.1(back)', value: '3.1(back)' },
    { label: '5.0', value: '5.0' },
    { label: '5.0(alsa)', value: '5.0(alsa)' },
    { label: '5.0(side)', value: '5.0(side)' },
    { label: '4.1', value: '4.1' },
    { label: '4.1(alsa)', value: '4.1(alsa)' },
    { label: '5.1', value: '5.1' },
    { label: '5.1(alsa)', value: '5.1(alsa)' },
    { label: '5.1(side)', value: '5.1(side)' },
    { label: '6.0', value: '6.0' },
    { label: '6.0(front)', value: '6.0(front)' },
    { label: 'hexagonal', value: 'hexagonal' },
    { label: '6.1', value: '6.1' },
    { label: '6.1(back)', value: '6.1(back)' },
    { label: '6.1(top)', value: '6.1(top)' },
    { label: '6.1(front)', value: '6.1(front)' },
    { label: '7.0', value: '7.0' },
    { label: '7.0(front)', value: '7.0(front)' },
    { label: '7.0(rear)', value: '7.0(rear)' },
    { label: '7.1', value: '7.1' },
    { label: '7.1(alsa)', value: '7.1(alsa)' },
    { label: '7.1(wide)', value: '7.1(wide)' },
    { label: '7.1(wide-side)', value: '7.1(wide-side)' },
    { label: '7.1(top)', value: '7.1(top)' },
    { label: '7.1(rear)', value: '7.1(rear)' },
    { label: 'octagonal', value: 'octagonal' },
    { label: 'cube', value: 'cube' },
    { label: 'hexadecagonal', value: 'hexadecagonal' },
    { label: 'downmix', value: 'downmix' },
    { label: '22.2', value: '22.2' },
    { label: 'auto', value: 'auto' },
  ]);
  const player_replayGainMode_kind  = ref([
    { label: 'Track', value: 'track' },
    { label: 'Album', value: 'album' },
    { label: computed(() => t('common.none')), value: 'no' },
  ])
  onMounted(() => {
    if(store_player_audio_logic.player_fade_value > 0) {
      player_fade_model_options_selected.value = player_fade_model_options.value[1].value
    }else {
      player_fade_model_options_selected.value = player_fade_model_options.value[0].value
    }
    //
    if(store_player_audio_logic.player_gaplessAudio === 'no'){
      store_player_audio_logic.player_gaplessAudio = player_gaplessAudio_kind.value[0].value
    }else if (store_player_audio_logic.player_gaplessAudio === 'yes'){
      store_player_audio_logic.player_gaplessAudio = player_gaplessAudio_kind.value[1].value
    }else{
      store_player_audio_logic.player_gaplessAudio = player_gaplessAudio_kind.value[2].value
    }
    //
    if(store_player_audio_logic.player_replayGainMode === 'track'){
      store_player_audio_logic.player_replayGainMode = player_replayGainMode_kind.value[0].value
    }else if(store_player_audio_logic.player_replayGainMode === 'album'){
      store_player_audio_logic.player_replayGainMode = player_replayGainMode_kind.value[1].value
    }else{
      store_player_audio_logic.player_replayGainMode = player_replayGainMode_kind.value[2].value
    }
  })

  ////// lineItems Re render
  const collapsed_width = ref<number>(80);

  //////
  import type { StepsProps } from 'naive-ui'
  const current = ref(1)
  const currentStatus = ref<StepsProps['status']>('process')
  const handleButtonClick = () => {
    current.value = (current.value % 3) + 1
  }
  /// server model
  const model_server_step_1 = computed(() => t('nsmusics.view_page.modelSelect'));
  const model_server_step_2 = computed(() => t('page.appMenu.manageServers'));
  const model_server_step_3 = computed(() => t('nsmusics.view_page.modelServer'));
  const model_server_step_4 = computed(() => t('page.appMenu.selectServer'));
  /// local model
  const model_local_step_1 = computed(() => t('nsmusics.view_page.selectedSong')+t('entity.folder_other'));
  const model_local_step_2 = computed(() => t('nsmusics.view_page.selectLibrary'));

  //////
  const { shell } = require('electron');
  const openLink = (url: string) => {
    shell.openExternal(url);
  };
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
              {{ $t('nsmusics.view_page.mediaLibrary') + $t('common.manage')}}
            </template>
            <n-space
                style="max-height: 70vh;overflow-y: auto;"
                :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 160) + 'px)'}">
              <!-- 媒体库管理 -->
              <n-space vertical>
                <n-space vertical>
                  <n-steps vertical
                           style="margin-left: 2px;margin-top: 2px;"
                           :status="currentStatus">
                    <n-step :title="model_server_step_1">
                      <div class="n-step-description" style="font-size:16px;font-weight: 600;">
                        {{ $t('nsmusics.view_page.modelSelect_explain') }}<br>
                        <n-select
                          v-model:value="Type_Server_Model_Open_Value"
                          :options="Type_Server_Model_Open_Option"
                          @update:value="
                            Type_Server_Model_Open_Value === 'server' ?
                            (store_server_user_model.switchToMode_Server(),store_server_user_model.model_select = 'server')
                            :
                            (store_server_user_model.switchToMode_Local(),store_server_user_model.model_select = 'local')
                          "
                          placeholder=""
                          :reset-menu-on-options-change="false"
                          style="width: 207px;margin-top: 6px;"
                        />
                      </div>
                    </n-step>
                    <!-- server model -->
                    <n-step :title="model_server_step_2" v-if="Type_Server_Model_Open_Value === 'server'">
                      <div class="n-step-description">
                        <n-space vertical>
                          <n-button
                              tertiary
                              @click="Type_Server_Add = !Type_Server_Add"
                              style="margin-top: 6px;">
                            <template #icon>
                              <n-icon size="24">
                                <Add />
                              </n-icon>
                            </template>
                            <div style="font-size:15px;font-weight: 600;">
                              {{ $t('form.addServer.title') }}
                            </div>
                          </n-button>
                          <DynamicScroller v-if="Type_Server_Model_Open_Value === 'server'"
                                           class="table" ref="scrollbar"
                                           style="overflow: auto;width: 780px;height: 130px;margin-top: 6px;"
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
                                                    @click="item.show = false;update_server_deleteUser(item.id, item.type);">
                                            {{ $t('common.delete') }}
                                          </n-button>
                                          <n-button strong secondary type="info"
                                                    @click="update_server_setUser(
                                              item.id,
                                              item.server_name,item.url,
                                              item.user_name,item.password,
                                              item.type
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
                      </div>
                    </n-step>
                    <n-step :title="model_server_step_3" v-if="Type_Server_Model_Open_Value === 'server'">
                      <div class="n-step-description">
                        <n-space vertical>
                          <n-space vertical
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
                                store_server_user_model.model_server_type_of_local_server_download = false
                                store_router_data_logic.clear_UserExperience_Model = true;
                                store_router_data_logic.get_clear_UserExperience_Model(true);
                                update_server_config_of_current_user_of_sqlite(
                                  store_server_users.server_config_of_current_user_of_select.value,
                                  false
                                );
                              }"
                            >
                            </n-switch>
                          </n-space>
                          <n-space vertical
                                   :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 260) + 'px)'}">
                            <n-space vertical>
                              <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_page.modelServer_type_2') }}</span>
                              <div style="margin-top: -10px;">
                                <span style="font-size:12px;">{{ $t('nsmusics.view_page.modelServer_type_2_explain') }}</span>
                              </div>
                            </n-space>
                            <n-switch
                                v-model:value="store_server_user_model.model_server_type_of_local"
                                @update:value="() => {
                                  store_server_user_model.model_server_type_of_local_server_download = true
                                }"
                            >
                            </n-switch>
                          </n-space>
                          <n-space vertical
                                   v-if="store_server_user_model.model_server_type_of_local"
                                   :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                            <n-space vertical style="width: 320px;">
                              <span style="font-size:16px;font-weight: 600;">
                                {{ $t('nsmusics.view_page.modelServer_type_2') + " | " + $t('nsmusics.view_page.selectServer')}}
                              </span>
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
                        </n-space>
                      </div>
                    </n-step>
                    <n-step :title="model_server_step_4" v-if="Type_Server_Model_Open_Value === 'server'">
                      <div class="n-step-description">
                        <n-space vertical>
                          <n-select
                              v-model:value="store_server_users.server_config_of_current_user_of_select_servername"
                              :options="store_server_users.server_config_of_all_user_of_select"
                              style="width: 220px;margin-top: 6px;"
                              @update:value="(value: number) => update_server_config_of_current_user_of_sqlite(value, true)"
                          />
                        </n-space>
                      </div>
                    </n-step>
                    <!-- local model -->
                    <n-step :title="model_local_step_1" v-if="Type_Server_Model_Open_Value != 'server'">
                      <div class="n-step-description">
                        <n-space vertical>
                          <n-space justify="space-between" align="center"
                                   :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 260) + 'px)'}">
                            <n-space vertical style="width: 620px;">
                              <div style="margin-top: -2px;">
                              <span style="font-size:16px;font-weight: 600;">
                                {{
                                  $t('nsmusics.view_page.selectLibrary_explain') +
                                  ', ' +
                                  $t('common.restartRequired')
                                }}
                                <br>.mp3, .flac, .aac, .mp1, .mp2, .m4a, .ape, .oga, .ogg, .opus, .wav, .webm
                              </span>
                              </div>
                              <n-space>
                                <n-button tertiary style="height: 36px;" @click="select_Folder">
                                  <template #icon>
                                    <n-icon size="24">
                                      <Add />
                                    </n-icon>
                                  </template>
                                  <div style="font-size:16px;font-weight: 600;">
                                    {{ $t('nsmusics.view_page.selectedSong') + $t('entity.folder_other')}}
                                  </div>
                                </n-button>
                                <n-tag type="success" style="height: 36px;">
                                  <div style="font-size:16px;font-weight: 600;">
                                    {{ store_server_user_model.library_path }}
                                  </div>
                                </n-tag>
                              </n-space>
                              <DynamicScroller v-if="false"
                                               class="table" ref="scrollbar"
                                               style="overflow: auto;width: 780px;height: 130px;margin-top: 6px;"
                                               :items="store_server_user_model.library_path"
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
                                              {{ item }}
                                            </div>
                                          </n-space>
                                          <span style="width: 18px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ (index+1) }}</span>
                                        </n-space>
                                      </div>
                                    </DynamicScrollerItem>
                                  </template>
                                </DynamicScroller>
                            </n-space>
                          </n-space>
                        </n-space>
                      </div>
                    </n-step>
                    <n-step :title="model_local_step_2" v-if="Type_Server_Model_Open_Value != 'server'">
                      <div class="n-step-description">
                        <n-space vertical>
                          <div style="font-size:15px;font-weight: 600;">
                            {{ $t('common.clear') + ' ' + $t('nsmusics.view_page.modelLocal')}}
                          </div>
                          <n-button style="margin-top: 6px;" size="small"
                            @click="
                              store_server_users.percentage_of_local = 0;
                              store_local_db_info.set_clear_all_local_data()
                            "
                          >
                            <template #icon>
                              <n-icon size="16">
                                <Delete20Regular />
                              </n-icon>
                            </template>
                            <div style="font-size:15px;font-weight: 600;">
                              {{ $t('common.clear') + ' ' + $t('nsmusics.view_page.modelLocal')}}
                            </div>
                          </n-button>
                          <n-divider style="margin: 0;"/>
                          <n-space vertical>
                            <div style="font-size:15px;font-weight: 600;">
                              {{ $t('nsmusics.view_page.selectLibrary') + ', ' + $t('nsmusics.view_page.selectLibrary_select_0')}}
                            </div>
                            <n-button size="small" @click="begin_import_Folder(false)">
                              <template #icon>
                                <n-icon size="24">
                                  <Add />
                                </n-icon>
                              </template>
                              <div style="font-size:15px;font-weight: 600;">
                                {{ $t('nsmusics.view_page.mediaLibrary_begin_import') }}
                              </div>
                            </n-button>
                          </n-space>
                          <n-divider style="margin: 0;"/>
                          <n-space vertical style="width: 600px;">
                            <div style="font-size:15px;font-weight: 600;">
                              {{ $t('nsmusics.view_page.selectLibrary') + ', ' + $t('nsmusics.view_page.selectLibrary_select_1')}}
                            </div>
                            <n-button size="small" @click="begin_import_Folder(true)">
                              <template #icon>
                                <n-icon size="24">
                                  <Add />
                                </n-icon>
                              </template>
                              <div style="font-size:15px;font-weight: 600;">
                                {{ $t('nsmusics.view_page.mediaLibrary_begin_import') }}
                              </div>
                            </n-button>
                          </n-space>
                          <n-divider style="margin: 0;"/>
                          <n-progress
                              type="line" style="width: 207px;margin-bottom: 8px;"
                              :percentage="store_server_users.percentage_of_local"
                              :indicator-placement="'inside'"
                          />
                        </n-space>
                      </div>
                    </n-step>
<!--                    ""-->
<!--                    "4MINUTE - Hot Issues"-->
                  </n-steps>
                </n-space>
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
                        <n-input clearable placeholder="any" v-model:value="server_set_of_addUser_of_servername"/>
                      </n-space>
                      <n-space vertical style="width: 250px;margin-bottom: 10px;">
                        <span>{{ $t('form.addServer.input_url') }}</span>
                        <n-input-group>
                          <n-input clearable placeholder="http://localhost:4533" v-model:value="server_set_of_addUser_of_url"/>
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
                      :disabled="store_player_audio_logic.player_select === 'web'"
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
                      :disabled="store_player_audio_logic.player_select === 'web'"
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
                  >
                  </n-switch>
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
                <n-divider style="margin: 0;"/>
                <n-space justify="space-between" align="center"
                         :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.audioPlayer') + ' | mpv' }}</span>
                  </n-space>
                </n-space>
                <n-space
                    justify="space-between" align="center"
                    style="margin-left: 30px;"
                    :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 260) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.mpvExtraParameters') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.mpvExtraParameters') }}</span>
                    </div>
                    <div style="margin-top: -10px;margin-left: -3px;">
                      <a style="font-size: 15px;cursor: pointer;" @click="openLink('https://mpv.io/manual/stable/#audio')">https://mpv.io/manual/stable/#audio</a>
                    </div>
                  </n-space>
                  <n-input
                      style="width: 207px;margin-top: -4px;"
                      :value="store_player_audio_logic.player_mpvExtraParameters"
                      @update:value="update_player_mpvExtraParameters"
                      type="textarea"
                      :placeholder="computed_i18n_Label_mpvExtraParameters"
                  />
                </n-space>
                <n-space
                    justify="space-between" align="center"
                    style="margin-left: 30px;"
                    :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 260) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_page.audio_channel') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('nsmusics.view_page.audio_channel_explain') }}</span>
                    </div>
                  </n-space>
                  <n-select
                      v-model:value="store_player_audio_logic.player_audio_channel"
                      :options="player_audio_channel_kind"
                      :disabled="store_player_audio_logic.player_select != 'mpv'"
                      placeholder="not enabled"
                      :reset-menu-on-options-change="false"
                      style="width: 207px;margin-top: -4px;"
                  />
                </n-space>
                <n-space
                    vertical
                    style="margin-left: 30px;"
                    :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 260) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.sampleRate') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.sampleRate_description') }}</span>
                    </div>
                  </n-space>
                  <n-space justify="space-between" align="center">
                    <div></div>
                    <n-input-group style="width: 207px;margin-top: -4px;">
                      <n-input clearable
                               :disabled="store_player_audio_logic.player_select != 'mpv'"
                               default-value="48000"
                               :value="store_player_audio_logic.player_samp_value"
                               @update:value="update_player_samp_value"
                      />
                      <n-input-group-label>Hz</n-input-group-label>
                    </n-input-group>
                  </n-space>
                </n-space>
                <n-space
                    justify="space-between" align="center"
                    style="margin-left: 30px;"
                    :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 260) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.gaplessAudio') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.gaplessAudio_description') }}</span>
                    </div>
                  </n-space>
                  <n-select
                      v-model:value="store_player_audio_logic.player_gaplessAudio"
                      :options="player_gaplessAudio_kind"
                      :disabled="store_player_audio_logic.player_select != 'mpv'"
                      placeholder="not enabled"
                      :reset-menu-on-options-change="false"
                      style="width: 207px;margin-top: -4px;"
                  />
                </n-space>
                <n-space
                    justify="space-between" align="center"
                    style="margin-left: 30px;"
                    :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 260) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.audioExclusiveMode')}}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.audioExclusiveMode_description') }}</span>
                    </div>
                  </n-space>
                  <n-switch
                      :disabled="store_player_audio_logic.player_select != 'mpv'"
                      v-model:value="store_player_audio_logic.player_audioExclusiveMode"
                  >
                  </n-switch>
                </n-space>
                <n-space
                    justify="space-between" align="center"
                    style="margin-left: 30px;"
                    :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 260) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.replayGainMode') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.replayGainMode_description') }}</span>
                    </div>
                  </n-space>
                  <n-select
                      v-model:value="store_player_audio_logic.player_replayGainMode"
                      :options="player_replayGainMode_kind"
                      :disabled="store_player_audio_logic.player_select != 'mpv'"
                      placeholder="not enabled"
                      :reset-menu-on-options-change="false"
                      style="width: 207px;margin-top: -4px;"
                  />
                </n-space>
                <n-space
                    justify="space-between" align="center"
                    style="margin-left: 30px;"
                    :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 260) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.replayGainPreamp') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.replayGainPreamp_description') }}</span>
                    </div>
                  </n-space>
                  <n-input-group style="width: 207px;margin-top: -4px;">
                    <n-input clearable
                             :disabled="store_player_audio_logic.player_select != 'mpv'"
                             default-value="48000"
                             v-model:value="store_player_audio_logic.player_replayGainPreamp"
                    />
                  </n-input-group>
                </n-space>
                <n-space
                    justify="space-between" align="center"
                    style="margin-left: 30px;"
                    :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 260) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.replayGainClipping')}}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.replayGainClipping_description') }}</span>
                    </div>
                  </n-space>
                  <n-switch
                      :disabled="store_player_audio_logic.player_select != 'mpv'"
                      v-model:value="store_player_audio_logic.player_replayGainClip"
                  >
                  </n-switch>
                </n-space>
                <n-space
                    justify="space-between" align="center"
                    style="margin-left: 30px;"
                    :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 260) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.replayGainFallback') }}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('setting.replayGainFallback_description') }}</span>
                    </div>
                  </n-space>
                  <n-input-group style="width: 207px;margin-top: -4px;">
                    <n-input clearable
                             :disabled="store_player_audio_logic.player_select != 'mpv'"
                             default-value="48000"
                             v-model:value="store_player_audio_logic.player_replayGainFallback"
                    />
                  </n-input-group>
                </n-space>
                <n-divider style="margin: 0;"/>
                <n-space justify="space-between" align="center"
                         :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('setting.audioPlayer') + ' | web' }}</span>
                  </n-space>
                </n-space>
                <n-space
                    justify="space-between" align="center"
                    style="margin-left: 30px;"
                    :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 260) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_page.dolby_switching')}}</span>
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
  overflow-y: auto;
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