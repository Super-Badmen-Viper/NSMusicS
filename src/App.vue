<script setup lang="ts">
  ////// this_app resource of vicons_svg
  import {
    ArrowMinimize16Regular,
    DarkTheme24Filled,
    DocumentHeart20Regular,
    Flag16Regular,
    Home28Regular,
    Maximize16Regular,
    PeopleCommunity16Regular,
    SlideMicrophone32Regular,
    TextIndentIncreaseLtr20Filled as lyric,
    FullScreenMaximize16Regular,
  } from '@vicons/fluent'
  import {AlbumFilled, LibraryMusicOutlined, MusicNoteRound} from '@vicons/material'
  import {Close, Hearing, Menu as MenuIcon, UserAvatarFilledAlt,Clean} from '@vicons/carbon'

  ////// i18n auto lang
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n({
    inheritLocale: true
  })
  watch(() => store_app_setting_configs.update_lang, (newValue) => {
    store_app_setting_configs.update_lang = newValue;
    console.log(newValue)
    save_system_config_of_App_Configs()
  });

  ////// this_app components
  import {darkTheme, lightTheme, NConfigProvider, NIcon} from 'naive-ui'
  import {h, onMounted, ref, computed, watch} from 'vue';
  import routers from './router'
  import {RouterLink, RouterView, useRouter} from 'vue-router';
  const path = require('path');
  // audio_class & player_bar class
  import Bar_Music_Player from '@/components/Bar_Music_Player.vue'
  // current_audioList class
  import Bar_Music_PlayList from '@/components/Bar_Music_PlayList.vue'
  // player_configs class
  import View_Screen_Music_Player from '@/views/View_Screen_Music_Player.vue'
  import {System_Configs_Read} from '@/features/system_configs/System_Configs_Read'
  import {App_Configs} from '@/models/app_Configs/class_App_Configs';
  import {Player_Configs_of_Audio_Info} from '@/models/app_Configs/class_Player_Configs_of_Audio_Info';
  import {Player_Configs_of_UI} from '@/models/app_Configs/class_Player_Configs_of_UI';
  import {System_Configs_Write} from "@/features/system_configs/System_Configs_Write";

  ////// this_app sqlite db
  let navidrome_db = path.resolve('resources/navidrome.db');
  let nsmusics_db = path.resolve('resources/nsmusics.db');

  ////// this_app BrowserWindow
  const { ipcRenderer } = require('electron');
  function minimize() {
    ipcRenderer.send('window-min');
  }
  function maximize() {
    ipcRenderer.send('window-max');
  }
  function maximize_screen() {
    ipcRenderer.send('window-fullscreen');
  }
  function closeWindow() {
    ipcRenderer.send('window-close');
  }
  window.addEventListener('resize', () => {
    store_app_setting_configs.window_innerWidth = window.innerWidth;
  });

  ////// app_setting
  import { store_app_setting_configs } from '@/store/app/store_app_setting_configs'
  function renderIcon (icon: any) {
    return () => h(NIcon, null, { default: () => h(icon) })
  }
  function renderRouterLink (nameValue: any,defaultValue: any){
    return () => h(RouterLink, {to: { name: nameValue }}, { default: () => defaultValue })
  }
  store_app_setting_configs.menuOptions_appBar = [
    {label: computed(() => renderRouterLink('View_Menu_AppSetting',t('common.menu'))),key: 'go_back_menu',icon: renderIcon(MenuIcon),},
    {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
    {label: computed(() => renderRouterLink('View_Home_MusicLibrary_Browse',t('common.home'))),key: 'go_back_home',icon: renderIcon(Home28Regular),},
    {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
    {label: computed(() => renderRouterLink('View_Album_List_ALL',t('entity.album_other'))),key: 'go_albums_list',icon: renderIcon(AlbumFilled)},
    {label: computed(() => renderRouterLink('View_Song_List_ALL',t('entity.track_other'))),key: 'go_songs_list',icon: renderIcon(MusicNoteRound)},
    {label: computed(() => renderRouterLink('View_Artist_List_ALL',t('entity.artist_other'))),key: 'go_artist_list',icon: renderIcon(UserAvatarFilledAlt)},
    {label: computed(() => renderRouterLink('View_Updateing',t('entity.genre_other'))),key: 'go_other',icon: renderIcon(Flag16Regular)},
    {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
    {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.guessLike'))),key: 'go_other',icon: renderIcon(DocumentHeart20Regular)},
    {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.karaoke'))),key: 'go_other',icon: renderIcon(SlideMicrophone32Regular)},
    {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.identifySong'))),key: 'go_other',icon: renderIcon(Hearing)},
    {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.scoreGeneration'))),key: 'go_other',icon: renderIcon(LibraryMusicOutlined)},
    {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.lyricsProduction'))),key: 'go_other',icon: renderIcon(lyric)},
    {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.musicCommunity'))),key: 'go_other',icon: renderIcon(PeopleCommunity16Regular)},
  ]
  watch(() => store_app_setting_configs.app_left_menu_select_activeKey, (newValue) => {
    save_system_config_of_App_Configs()
  });
  watch(() => store_app_setting_configs.app_left_menu_collapsed, (newValue) => {
    save_system_config_of_App_Configs()
  });

  ////// server of user_selected
  import { store_server_users } from '@/store/server/store_server_users'
  async function get_server_config_of_current_user_of_sqlite(value: Server_Configs_Props) {
    store_server_users.server_config_of_current_user_of_sqlite = value
    store_server_users.server_config_of_current_user_of_select = { label: value.server_name, value: value.id };
    store_server_users.server_config_of_current_user_of_select_servername = value.server_name
    console.log(value)

    const {salt, token} = store_server_users.get_generateEncryptedPassword(
        store_server_users.server_config_of_current_user_of_sqlite?.password
    );
    let set_Navidrome_Data_To_LocalSqlite = new Set_Navidrome_Data_To_LocalSqlite()
    await set_Navidrome_Data_To_LocalSqlite.Set_Read_Navidrome_Api_BasicInfo_Add_LocalSqlite(
        store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
        store_server_users.server_config_of_current_user_of_sqlite?.user_name, token, salt,
    )

    /// reset app data
    ipcRenderer.send('window-reset-data');
  }
  ////// server of check_model
  import { store_server_user_model } from '@/store/server/store_server_user_model'
  watch(() => store_server_user_model.library_path, (newValue) => {
    store_server_user_model.library_path = newValue
    save_system_library_config()
    router_name.value = 'View_Song_List_ALL';
    store_app_setting_configs.app_left_menu_select_activeKey = 'go_songs_list';
    save_system_config_of_View_Router_History()
  });

  ////// theme
  function get_update_theme (value:any){
    if(value === 'lightTheme')
      store_app_setting_configs.update_theme = true;
    else
      store_app_setting_configs.update_theme = false;
    theme_mode_change_click()
  }
  const theme_normal_mode_click = () => {
    store_app_setting_configs.theme = lightTheme
    store_app_setting_configs.theme_name = 'lightTheme'
    store_app_setting_configs.theme_app = lightTheme
    store_app_setting_configs.update_theme = false
  }
  const theme_dark_mode_click = () => {
    store_app_setting_configs.theme = darkTheme
    store_app_setting_configs.theme_name = 'darkTheme'
    store_app_setting_configs.theme_app = darkTheme
    store_app_setting_configs.update_theme = true
  }
  const theme_mode_change_click = async () => {
    if (store_app_setting_configs.update_theme) {
      theme_normal_mode_click()
    } else {
      theme_dark_mode_click()
    }
    save_system_config_of_App_Configs()
  }

  ////// player view
  const get_playerbar_to_Switch_playerview = (value:any) => {
    store_player_appearance.player_show_complete = false
    clear_Files_temporary()

    if(value === 0)
      store_player_appearance.player_show = true
    setTimeout(() => {
      store_player_appearance.player_show_hight_animation_value = value
      setTimeout(() => {
        if(value === 0){
          store_app_setting_configs.theme_app = darkTheme
        }else{
          store_app_setting_configs.theme_app = store_app_setting_configs.theme
          store_player_appearance.player_show = false
        }
      }, 200);
    }, 30);

    // Vue UI WYSIWYG
    router_select_model_menu.value = false
    router_select_model_home.value = false
    router_select_model_updateing.value = false;
    router_select_model_media.value = false
    router_select_model_album.value = false
    router_select_model_artist.value = false
    setTimeout(() => {
      if(value != 0){
        if(store_app_setting_configs.app_left_menu_select_activeKey === 'go_back_menu'){
          router_select_model_menu.value = true;
        }else if(store_app_setting_configs.app_left_menu_select_activeKey === 'go_back_home') {
          router_select_model_home.value = true;
        }else if(store_app_setting_configs.app_left_menu_select_activeKey === 'go_other'){
          router_select_model_updateing.value = true;
        }else if(store_app_setting_configs.app_left_menu_select_activeKey === 'go_albums_list'){
          router_select_model_album.value = true;
        }else if(store_app_setting_configs.app_left_menu_select_activeKey === 'go_songs_list'){
          router_select_model_media.value = true;
        }else if(store_app_setting_configs.app_left_menu_select_activeKey === 'go_artist_list'){
          router_select_model_artist.value = true;
        }
      }
      store_player_appearance.player_show_complete = true

      clear_session_clearCache()
    }, 600);
  }
  ////// player ui theme
  watch(() => store_player_appearance.player_UI_Theme_State, (newValue) => {
    store_player_audio_logic.player_use_lottie_animation = store_player_appearance.player_UI_Theme_State.player_use_lottie_animation
    save_system_config_of_Player_Configs_of_UI()
  });
  ////// player audio_info
  import { store_player_audio_info } from "@/store/player/store_player_audio_info";
  import { Set_MediaInfo_To_LocalSqlite } from "@/features/sqlite3_local_configs/class_Set_MediaInfo_To_LocalSqlite";
  watch(() => store_player_audio_info.this_audio_file_path, (newValue) => {
    if(store_view_media_page_info.media_Files_temporary != undefined && store_view_media_page_info.media_Files_temporary.length != 0) {
      store_player_audio_info.this_audio_file_path = newValue
      store_player_audio_info.this_audio_restart_play = true
      console.log('this_audio_file_path：'+newValue)
      //
      if (store_player_appearance.player_mode_of_audio_path_from_playlist === false) {
        store_playlist_list_info.playlist_MediaFiles_temporary = [...store_view_media_page_info.media_Files_temporary];
        store_playlist_list_info.playlist_datas_CurrentPlayListMediaIds = store_view_media_page_info.media_Files_temporary.map(item => item.id);
        save_system_playlist_item_id_config();
      }
    }
  });
  watch(() => store_player_audio_info.this_audio_file_path, (newValue) => {
    store_player_audio_info.this_audio_file_path = newValue
    console.log('this_audio_file_path：'+newValue)

    store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
      item.playing = item.id === store_player_audio_info.this_audio_song_id;
    });
    store_playlist_list_info.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
      item.playing = item.id === store_player_audio_info.this_audio_song_id;
    });
  });
  watch(() => store_player_audio_info.this_audio_file_medium_image_url, (newValue) => {
    store_player_audio_info.this_audio_file_medium_image_url = newValue
    store_player_audio_info.this_audio_restart_play = true
    console.log('this_audio_file_medium_image_url'+newValue)

    store_player_audio_info.page_top_album_image_url = '';
    store_player_audio_info.page_top_album_image_url = newValue;
  });
  watch(() => store_player_audio_info.this_audio_song_id, (newValue) => {
    store_player_audio_info.this_audio_song_id = newValue
    console.log('this_audio_song_id：'+newValue)
    let set_MediaInfo_To_LocalSqlite = new Set_MediaInfo_To_LocalSqlite()
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_PlayCount_of_Media_File(newValue)
  });
  watch(() => store_player_audio_info.this_audio_song_rating, (newValue) => {
    store_player_audio_info.this_audio_song_rating = newValue
    console.log('this_audio_song_rating：'+newValue)

    store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
      if(item.id === store_player_audio_info.this_audio_song_id)
        item.rating = store_player_audio_info.this_audio_song_rating
    });
  });
  watch(() => store_player_audio_info.this_audio_song_favorite, (newValue) => {
    store_player_audio_info.this_audio_song_favorite = newValue
    console.log('this_audio_song_favorite：'+newValue)

    store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
      if(item.id === store_player_audio_info.this_audio_song_id)
        item.favorite = store_player_audio_info.this_audio_song_favorite
    });
  });
  watch(() => store_player_audio_info.this_audio_album_name, (newValue) => {
    store_player_audio_info.this_audio_album_name = newValue
    console.log('this_audio_album_name：'+newValue)
    store_player_audio_info.page_top_album_name = newValue;
  });
  watch(() => store_player_audio_info.this_audio_album_id, (newValue) => {
    store_player_audio_info.this_audio_album_id = newValue
    console.log('this_audio_album_id：'+newValue)
    store_player_audio_info.page_top_album_id = newValue;
  });
  watch(() => store_player_audio_info.this_audio_lyrics_string, (newValue) => {
    store_player_audio_info.this_audio_lyrics_string = newValue
    // split lyrics
    store_player_audio_info.this_audio_lyrics_info_line = []
    for (let i = 0; i < store_player_audio_info.this_audio_lyrics_info_line_num; i++) {
      store_player_audio_info.this_audio_lyrics_info_line.push('')
    }
    store_player_audio_info.this_audio_lyrics_info_time = []
    //
    let line_all = newValue.split('\n')
    let line_times = []
    for (let i = 0; i < line_all.length; i++) {
      let line = line_all[i].split(']')
      if (line.length > 1) {
        line_times.push(line[0].replace('[', ''))
        store_player_audio_info.this_audio_lyrics_info_line.push(line[1])
      }
    }
    for (let i = 0; i < store_player_audio_info.this_audio_lyrics_info_line_num; i++) {
      store_player_audio_info.this_audio_lyrics_info_line.push('')
    }
    //
    for (let i = 0; i < line_times.length; i++) {
      const [minutes, seconds] = line_times[i].split(':');
      store_player_audio_info.this_audio_lyrics_info_time[i] = (parseInt(minutes) * 60 + parseInt(seconds)) * 1000;
    }
  });

  ////// playlist view
  import { store_playlist_appearance } from '@/store/playlist/store_playlist_appearance'
  import { store_playlist_list_info } from "@/store/playlist/store_playlist_list_info"
  import { store_playlist_list_logic } from "@/store/playlist/store_playlist_list_logic"
  import { Get_PlaylistInfo_From_LocalSqlite } from "@/features/sqlite3_local_configs/class_Get_PlaylistInfo_From_LocalSqlite";

  ////// this_app audio(Media) Class
  watch(() => store_player_audio_logic.player_use_lottie_animation, (newValue) => {
    store_player_audio_logic.player_use_lottie_animation = newValue
    store_player_appearance.player_UI_Theme_State.player_use_lottie_animation = newValue
    console.log('实验性lottie动画状态：'+newValue)
    save_system_config_of_Player_Configs_of_UI()
  });
  watch(() => store_player_audio_logic.player_save_new_data, (newValue) => {
    if(newValue)
      save_system_config_of_Player_Configs_of_Audio_Info()
  });
  watch(() => store_player_audio_logic.player_silder_currentTime_added_value, (newValue) => {
    store_player_audio_logic.player_silder_currentTime_added_value = newValue
    console.log('player_silder_currentTime_added_value：'+newValue)
  });
  watch(() => store_player_audio_logic.player_go_lyricline_index_of_audio_play_progress, (newValue) => {
    store_player_audio_logic.player_go_lyricline_index_of_audio_play_progress = newValue
    console.log('get_play_go_index_time：'+newValue)
  });

  import {store_player_appearance} from "@/store/player/store_player_appearance";
  import {store_player_audio_info} from "@/store/player/store_player_audio_info";
  import {store_player_audio_logic} from "@/store/player/store_player_audio_logic";
  import {store_player_sound_effects} from "@/store/player/store_player_sound_effects";
  import {store_player_sound_speed} from "@/store/player/store_player_sound_speed";
  import {store_player_sound_more} from "@/store/player/store_player_sound_more";
  import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";
  import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
  import {store_view_home_page_info} from "@/store/view/home/store_view_home_page_info"
  import {store_view_home_page_logic} from "@/store/view/home/store_view_home_page_logic"
  import {Get_HomeDataInfos_From_LocalSqlite} from '@/features/sqlite3_local_configs/class_Get_HomeDataInfos_From_LocalSqlite'
  import {Library_Configs} from "@/models/app_Configs/class_Library_Configs";
  import {Set_AlbumInfo_To_LocalSqlite} from "@/features/sqlite3_local_configs/class_Set_AlbumInfo_To_LocalSqlite";
  import {Set_ArtistInfo_To_LocalSqlite} from "@/features/sqlite3_local_configs/class_Set_ArtistInfo_To_LocalSqlite";
  import {Set_Navidrome_Data_To_LocalSqlite} from "@/features/servers_configs/navidrome_api/middleware/class_Set_Navidrome_Data_To_LocalSqlite";

  ///// view of home
  watch(() => store_view_home_page_logic.list_data_StartUpdate, (newValue) => {
    if(newValue) {
      fetchData_Home()
      store_view_home_page_logic.list_data_StartUpdate = false
      console.log("store_view_home_page_logic.list_data_StartUpdate")
    }
  });
  const fetchData_Home = () => {
    store_view_home_page_info.home_Files_temporary_maximum_playback = []
    store_view_home_page_info.home_Files_temporary_random_search = []
    store_view_home_page_info.home_Files_temporary_recently_added = []
    store_view_home_page_info.home_Files_temporary_recently_played = []
    store_view_home_page_info.home_selected_top_album = undefined;
    let get_HomeDataInfos_From_LocalSqlite = new Get_HomeDataInfos_From_LocalSqlite()
    store_view_home_page_info.home_Files_temporary_maximum_playback = get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Maximum_Playback()
    store_view_home_page_info.home_Files_temporary_random_search = get_HomeDataInfos_From_LocalSqlite.Get_AlbumFiles_Random_Search()
    store_view_home_page_info.home_Files_temporary_recently_added = get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Recently_Added()
    store_view_home_page_info.home_Files_temporary_recently_played = get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Recently_Played()
    store_view_home_page_info.home_selected_top_album =
        (store_view_home_page_info.home_Files_temporary_random_search
            && store_view_home_page_info.home_Files_temporary_random_search.length > 0)
            ? store_view_home_page_info.home_Files_temporary_random_search[0] : undefined;
  };

  ///// view of media
  const page_songlists_options_Sort_key = ref<{ columnKey: string; order: string }[]>([]);
  function get_page_songlists_options_Sort_key(value: { columnKey: string; order: string }[] = []) {
    if (value != null) {
      page_songlists_options_Sort_key.value = value;
      store_view_media_page_logic.page_songlists_keyword = '';
      fix_router_history_of_Media_scroller_value(router_history_model_of_Media_scroller_value.value) // 保留此滚轮值(上次浏览位置)
      fetchData_Media()
    }
  }
  watch(() => store_view_media_page_logic.page_songlists_keyword, (newValue) => {
    if (newValue.indexOf('accurate_search') > 0) {
      newValue = newValue.replace('accurate_search', '');
      if (newValue.indexOf('__title__') > 0) {
        newValue = newValue.replace('__title__', '');
        store_view_media_page_logic.page_songlists_keywordFilter = `WHERE title LIKE '${newValue}'`
      } else if (newValue.indexOf('__artist__') > 0) {
        newValue = newValue.replace('__artist__', '');
        store_view_media_page_logic.page_songlists_keywordFilter = `WHERE artist LIKE '${newValue}'`
      } else if (newValue.indexOf('__album__') > 0) {
        newValue = newValue.replace('__album__', '');
        store_view_media_page_logic.page_songlists_keywordFilter = `WHERE album_id = '${newValue}'`
      }
    }else{
      store_view_media_page_logic.page_songlists_keywordFilter = newValue.length > 0 ?
      `WHERE title LIKE '%${newValue}%' OR artist LIKE '%${newValue}%' OR album LIKE '%${newValue}%'` :
      '';
    }
    store_view_media_page_logic.page_songlists_keyword_reset = true;
    console.log('page_songlists_keyword:' + newValue)

    store_app_setting_configs.app_left_menu_select_activeKey = 'go_songs_list'
    router.push('View_Song_List_ALL')
    fetchData_Media()
  });
  function page_songlists_get_reset_data(value: any) {
    store_view_media_page_logic.page_songlists_keyword = '';
    find_music_model.value = false;
    console.log('page_songlists_reset_data?:' + value)
    fetchData_Media()

    router_history_datas_of_Media.value = [];
    if(router_select_history_date_of_Media.value){
      router_select_history_date_of_Media.value.id = 1;
      router_history_datas_of_Media.value.push(router_select_history_date_of_Media.value);
    }
  }
  watch(() => store_view_media_page_logic.page_songlists_selected, (newValue) => {
    store_view_media_page_logic.page_songlists_selected = newValue
    console.log('page_songlists_selected：'+newValue)
    fetchData_Media()
    save_system_config_of_Player_Configs_of_Audio_Info()
    save_system_config_of_View_Router_History()
  });
  ///
  watch(() => store_playlist_list_logic.playlist_names_StartUpdate, (newValue) => {
    if(newValue) {
      let db = require('better-sqlite3')(navidrome_db);
      db.pragma('journal_mode = WAL');
      Init_page_songlists_statistic_Data(db);
      db.close();
      store_playlist_list_logic.playlist_names_StartUpdate = false
      console.log("store_playlist_list_logic.playlist_names_StartUpdate")
    }
  });
  const Init_page_songlists_statistic_Data = (db: any) => {
    store_view_media_page_logic.page_songlists_options = [];
    store_view_media_page_logic.page_songlists_statistic = [];
    store_view_media_page_logic.page_songlists = []
    //////
    const stmt_media_file_count = db.prepare(`SELECT COUNT(*) AS count FROM ${store_server_user_model.media_file}`);
    const temp_Play_List_ALL: Play_List = {
      label: computed(() => t('nsmusics.view_page.allSong')),
      value: 'song_list_all',
      id: 'song_list_all',
      name: computed(() => t('nsmusics.view_page.allSong')),
      comment: computed(() => t('nsmusics.view_page.allSong')),
      duration: 0,
      song_count: stmt_media_file_count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
      owner_id: ''
    }
    store_view_media_page_logic.page_songlists_options.push(temp_Play_List_ALL);
    store_view_media_page_logic.page_songlists_statistic.push({
      label: temp_Play_List_ALL.label,
      song_count: temp_Play_List_ALL.song_count.toString(),
      id: temp_Play_List_ALL.id
    });
    store_view_media_page_logic.page_songlists.push(temp_Play_List_ALL)
    //////
    const stmt_media_Annotation_Starred_Count = db.prepare(`
      SELECT COUNT(*) AS count FROM ${store_server_user_model.annotation}
      WHERE starred = 1 AND item_type='media_file'
    `);
    const temp_Play_List_Love: Play_List = {
      label: computed(() => t('nsmusics.view_page.loveSong')),
      value: 'song_list_love',
      id: 'song_list_love',
      name: computed(() => t('nsmusics.view_page.loveSong')),
      comment: computed(() => t('nsmusics.view_page.loveSong')),
      duration: 0,
      song_count: stmt_media_Annotation_Starred_Count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
      owner_id: ''
    }
    store_view_media_page_logic.page_songlists_options.push(temp_Play_List_Love);
    store_view_media_page_logic.page_songlists_statistic.push({
      label: temp_Play_List_Love.label,
      song_count: temp_Play_List_Love.song_count.toString(),
      id: temp_Play_List_Love.id
    });
    store_view_media_page_logic.page_songlists.push(temp_Play_List_Love)
    //////
    const stmt_media_Annotation_Recently_Count = db.prepare(`
      SELECT COUNT(*) AS count FROM ${store_server_user_model.annotation}
      WHERE item_type='media_file'
    `);
    const temp_Play_List_Recently: Play_List = {
      label: computed(() => t('nsmusics.view_page.recentPlay')),
      value: 'song_list_recently',
      id: 'song_list_recently',
      name: computed(() => t('nsmusics.view_page.recentPlay')),
      comment: computed(() => t('nsmusics.view_page.recentPlay')),
      duration: 0,
      song_count: stmt_media_Annotation_Recently_Count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
      owner_id: ''
    }
    store_view_media_page_logic.page_songlists_options.push(temp_Play_List_Recently);
    store_view_media_page_logic.page_songlists_statistic.push({
      label: temp_Play_List_Recently.label,
      song_count: temp_Play_List_Recently.song_count.toString(),
      id: temp_Play_List_Recently.id
    });
    store_view_media_page_logic.page_songlists.push(temp_Play_List_Recently)
    //////
    const stmt_media_Annotation_PlayList_Count = db.prepare(`
      SELECT COUNT(*) AS count FROM ${store_server_user_model.playlist}
    `);
    store_view_media_page_logic.page_songlists_statistic.push({
      label: computed(() => t('entity.playlist_other')),
      song_count: stmt_media_Annotation_PlayList_Count.get().count + ' *',
      id: 'song_list_all_PlayList'
    });
    //////
    store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.forEach((item: any) =>{
      const temp_playlist: Play_List = {
        label: item.playlist.name,
        value: item.playlist.id,
        id: item.playlist.id,
        name: item.playlist.name,
        comment: item.playlist.comment,
        duration: item.playlist.duration,
        song_count: item.playlist.song_count + ' *',
        public: item.playlist.public,
        created_at: item.playlist.created_at,
        updated_at: item.playlist.updated_at,
        path: item.playlist.path,
        sync: item.playlist.sync,
        size: item.playlist.size,
        rules: item.playlist.rules,
        evaluated_at: item.playlist.evaluated_at,
        owner_id: item.playlist.owner_id
      }
      store_view_media_page_logic.page_songlists_options.push(temp_playlist);
      // store_view_media_page_logic.page_songlists_statistic.push({
      //   label: temp_playlist.label,
      //   song_count: temp_playlist.song_count.toString(),
      //   id: temp_playlist.id
      // });
      store_view_media_page_logic.page_songlists.push(temp_playlist)
    });
  }
  ///
  watch(() => store_view_media_page_logic.list_data_StartUpdate, (newValue) => {
    if(newValue) {
      fetchData_Media()
      store_view_media_page_logic.list_data_StartUpdate = false
      console.log("store_view_media_page_logic.list_data_StartUpdate")
    }
  });
  ///
  const fetchData_Media = async () => {
    let db:any = null;
    // clear RouterView of vue-virtual-scroller data
    if(store_player_appearance.player_mode_of_medialist_from_external_import === true){
      store_player_appearance.player_mode_of_medialist_from_external_import = false;
    }else{
      clear_Files_temporary()
      router_select_model_media.value = true;
    }
    try {
      db = require('better-sqlite3')(navidrome_db);
      db.pragma('journal_mode = WAL');
      let stmt_media_file = null;
      let stmt_media_file_string = '';

      // Init media_model data
      store_playlist_list_logic.playlist_names_StartUpdate = true

      // load media_Files_temporary data
      if (router_history_model_of_Media.value === 0) {
        const sortKey = page_songlists_options_Sort_key.value.length > 0 && page_songlists_options_Sort_key.value[0].order !== 'default' ?
            page_songlists_options_Sort_key.value[0].columnKey : 'id';
        const sortOrder = page_songlists_options_Sort_key.value.length > 0 && page_songlists_options_Sort_key.value[0].order !== 'default' ?
            page_songlists_options_Sort_key.value[0].order.replace('end', '') : '';
        try {
          stmt_media_file_string =
            `SELECT * FROM
            ${store_server_user_model.media_file}
            ${store_view_media_page_logic.page_songlists_keywordFilter}
            ORDER BY ${sortKey} ${sortOrder}`;
          stmt_media_file = db.prepare(stmt_media_file_string);
        } catch (err: any) {
          console.error(err);
        }
        //////
        if (router_select_history_date_of_Media.value && store_view_media_page_logic.page_songlists_keyword_reset === true) {
          remove_router_history_of_Media(router_select_history_date_of_Media.value.id);// 若存在新操作，则覆盖后续的路由
          store_view_media_page_logic.page_songlists_keyword_reset = false;
        }
        const routerDate: Interface_View_Router_Date = {
          id: router_history_datas_of_Media.value ? router_history_datas_of_Media.value.length + 1 : 1,
          menu_select_active_key: 'go_songs_list',
          router_name: 'View_Song_List_ALL',
          router_select_model_media: true,
          router_select_model_album: false,
          router_select_model_artist: false,
          page_lists_keyword: store_view_media_page_logic.page_songlists_keyword,
          stmt_string: stmt_media_file_string,
          page_lists_selected: store_view_media_page_logic.page_songlists_selected,
          columnKey: page_songlists_options_Sort_key.value.length > 0 && page_songlists_options_Sort_key.value[0].order !== 'default' ?
              page_songlists_options_Sort_key.value[0].columnKey : 'id',
          order: page_songlists_options_Sort_key.value.length > 0 && page_songlists_options_Sort_key.value[0].order !== 'default' ?
              page_songlists_options_Sort_key.value[0].order.replace('end', '') : '',
          page_lists_scrollindex: router_history_model_of_Media_scroller_value.value,
        };
        add_router_history_of_Media(routerDate);// 重复路由不添加
        //////
      }
      else {
        if (router_select_history_date_of_Media.value) {
          router.push('View_Song_List_ALL')
          store_app_setting_configs.app_left_menu_select_activeKey = 'go_songs_list'
          router_select_model_media.value = true;
          store_view_media_page_logic.page_songlists_keyword = router_select_history_date_of_Media.value.page_lists_keyword;
          store_view_media_page_logic.page_songlists_selected = router_select_history_date_of_Media.value.page_lists_selected;
          page_songlists_options_Sort_key.value = [
            {
              columnKey: router_select_history_date_of_Media.value.columnKey,
              order: router_select_history_date_of_Media.value.order
            }
          ];
          router_history_model_of_Media_scroller_value.value = router_select_history_date_of_Media.value.page_lists_scrollindex;
          stmt_media_file = db.prepare(router_select_history_date_of_Media.value.stmt_string);
        }
        router_history_model_of_Media.value = 0;
      }
      const rows = stmt_media_file.all();
      rows.forEach((row: Media_File, index: number) => {
        row.absoluteIndex = index;
        row.selected = false;
        row.duration_txt = formatTime(row.duration);
        if(row.medium_image_url == null || row.medium_image_url == undefined || row.medium_image_url.length == 0) {
          if (row.path.indexOf('mp3') > 0)
            row.medium_image_url = row.path.replace('mp3', 'jpg');
          else if (row.path.indexOf('flac') > 0)
            row.medium_image_url = row.path.replace('flac', 'jpg');
          else
            row.medium_image_url = '../../../resources/img/error_album.jpg';
        }
        store_view_media_page_info.media_Files_temporary.push(row);
      });
      ////// find favorite for media_Files_temporary
      const stmt_media_Annotation_Starred_Items = db.prepare(`
        SELECT item_id FROM ${store_server_user_model.annotation}
        WHERE starred = 1 AND item_type='media_file'
      `);
      const annotations = stmt_media_Annotation_Starred_Items.all();
      for (let i = 0; i < store_view_media_page_info.media_Files_temporary.length; i++) {
        store_view_media_page_info.media_Files_temporary[i].favorite = !!annotations.some((annotation: {
          item_id: string
        }) => annotation.item_id === store_view_media_page_info.media_Files_temporary[i].id);
      }
      ////// find rating for media_Files_temporary
      const stmt_media_Annotation_Rating_Items = db.prepare(`
        SELECT item_id, rating FROM ${store_server_user_model.annotation}
        WHERE rating > 0 AND item_type='media_file'
      `);
      const annotations_rating = stmt_media_Annotation_Rating_Items.all();
      for (let i = 0; i < store_view_media_page_info.media_Files_temporary.length; i++) {
        const mediaFile = store_view_media_page_info.media_Files_temporary[i];
        const matchingAnnotation = annotations_rating.find((annotation: {
          item_id: string,
          rating: number
        }) => annotation.item_id === mediaFile.id);
        if (matchingAnnotation)
          mediaFile.rating = matchingAnnotation.rating;
        else
          mediaFile.rating = 0;
      }
      ////// filter selected_list for media_Files_temporary
      let order_play_date:any[] = [];
      store_view_media_page_info.media_Files_temporary = store_view_media_page_info.media_Files_temporary.filter((item: any) => {
        if (store_view_media_page_logic.page_songlists_selected === 'song_list_all') {
          return true;
        } else if (store_view_media_page_logic.page_songlists_selected === 'song_list_love') {
          return annotations.some((annotation: any) => annotation.item_id === item.id);
        } else if (store_view_media_page_logic.page_songlists_selected === 'song_list_recently') {
          const stmt_media_Annotation_Recently_Items = db.prepare(`
          SELECT item_id FROM ${store_server_user_model.annotation}
          WHERE item_type='media_file'
          ORDER BY play_date DESC
        `);
          const annotations = stmt_media_Annotation_Recently_Items.all().map((annotation: any) => annotation.item_id);
          order_play_date = annotations;
          return annotations.includes(item.id);
        } else {
          const index = store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.findIndex((list: any) => list.playlist.id === store_view_media_page_logic.page_songlists_selected);
          if (index >= 0) {
            const result = store_playlist_list_info.playlist_tracks_temporary_of_ALLLists[index].playlist_tracks.map(track => track.media_file_id);
            return result.includes(item.id);
          } else {
            return true;
          }
        }
      });
      if (store_view_media_page_logic.page_songlists_selected === 'song_list_recently') {
        let new_sort: Media_File[] = store_view_media_page_info.media_Files_temporary.slice();
        store_view_media_page_info.media_Files_temporary = [];
        order_play_date.forEach((id) => {
          const index = new_sort.findIndex(item => item.id === id);
          if (index !== -1) {
            store_view_media_page_info.media_Files_temporary.push(new_sort[index]);
            new_sort.splice(index, 1);
          }
        });
      }
      store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
        item.absoluteIndex = index + 1;
      });
    } catch (err: any) {
      console.error(err);
    } finally {
      db.close();
      console.log('db.close().......');
      db = null;
    }
  };
  function formatTime(currentTime: number): string {
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);

    let formattedMinutes = String(minutes);
    let formattedSeconds = String(seconds);

    if (formattedMinutes.length == 1)
      formattedMinutes = '0' + formattedMinutes;

    if (formattedSeconds.length == 1)
      formattedSeconds = '0' + formattedSeconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  ////// view of album
  const album_Files_temporary = ref<Album[]>([]);
  const page_albumlists_options = ref<{label: string;value: string}[]>([])
  const page_albumlists_statistic = ref<{label: string;album_count: string;id: string;}[]>([])
  const page_albumlists = ref<Play_List[]>([])
  const page_albumlists_selected = ref<string>('album_list_all')
  const page_albumlists_keyword_reset = ref<boolean>(false)
  const page_albumlists_keyword = ref<string>('');
  const page_albumlists_get_keyword_model_num = ref<number>(0);
  const page_albumlists_options_Sort_key = ref<{ columnKey: string; order: string }[]>([]);
  function get_page_albumlists_options_Sort_key(value: { columnKey: string; order: string }[] = []) {
    if (value != null) {
      page_albumlists_options_Sort_key.value = value;
      page_albumlists_keyword.value = '';
      fix_router_history_of_Album_scroller_value(router_history_model_of_Album_scroller_value.value) // 保留此滚轮值(上次浏览位置)
      fetchData_Album()
    }
  }
  function page_albumlists_get_keyword(value: string) {
    if(value.indexOf('accurate_search') > 0){
      value = value.replace('accurate_search','');
      if(value.indexOf('__title__') > 0){
        value = value.replace('__title__','');
        page_albumlists_get_keyword_model_num.value = 1;
      }else if(value.indexOf('__artist__') > 0){
        value = value.replace('__artist__','');
        page_albumlists_get_keyword_model_num.value = 2;
      }else if(value.indexOf('__album__') > 0){
        value = value.replace('__album__','');
        page_albumlists_get_keyword_model_num.value = 3;
      }
      find_album_model.value = true;
    }else{
      page_albumlists_get_keyword_model_num.value = 0;
    }
    page_albumlists_keyword.value = value;
    page_albumlists_keyword_reset.value = true;
    console.log('page_albumlists_keyword:' + value)

    fetchData_Album()
  }
  function page_albumlists_get_reset_data(value: any) {
    page_albumlists_keyword.value = '';
    console.log('page_albumlists_reset_data?:' + value)
    fetchData_Album()

    router_history_datas_of_Album.value = [];
    if(router_select_history_date_of_Album.value){
      router_select_history_date_of_Album.value.id = 1;
      router_history_datas_of_Album.value.push(router_select_history_date_of_Album.value);
    }
  }
  const get_page_albumlists_selected = (value: any) => {
    page_albumlists_selected.value = value
    console.log('page_albumlists_selected：'+value)
    fetchData_Album()
  }
  const Init_page_albumlists_statistic_Data = (db: any) => {
    const stmt_album_count = db.prepare(`SELECT COUNT(*) AS count FROM ${store_server_user_model.album}`);
    //
    page_albumlists_options.value = [];
    page_albumlists_statistic.value = [];
    page_albumlists.value = []
    //////
    const temp_Play_List_ALL: Play_List = {
      label: computed(() => t('nsmusics.view_page.allAlbum')),
      value: 'album_list_all',
      id: 'album_list_all',
      name: computed(() => t('nsmusics.view_page.allAlbum')),
      comment: computed(() => t('nsmusics.view_page.allAlbum')),
      duration: 0,
      song_count: stmt_album_count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
      owner_id: ''
    }
    page_albumlists_options.value.push(temp_Play_List_ALL);
    page_albumlists_statistic.value.push({
      label: temp_Play_List_ALL.label,
      album_count: temp_Play_List_ALL.song_count.toString(),
      id: temp_Play_List_ALL.id
    });
    page_albumlists.value.push(temp_Play_List_ALL)
    //////
    const stmt_album_Annotation_Starred_Count = db.prepare(`
      SELECT COUNT(*) AS count FROM ${store_server_user_model.annotation}
      WHERE starred = 1 AND item_type='album'
    `);
    const temp_Play_List_Love: Play_List = {
      label: computed(() => t('nsmusics.view_page.loveAlbum')),
      value: 'album_list_love',
      id: 'album_list_love',
      name: computed(() => t('nsmusics.view_page.loveAlbum')),
      comment: computed(() => t('nsmusics.view_page.loveAlbum')),
      duration: 0,
      song_count: stmt_album_Annotation_Starred_Count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
      owner_id: ''
    }
    page_albumlists_options.value.push(temp_Play_List_Love);
    page_albumlists_statistic.value.push({
      label: temp_Play_List_Love.label,
      album_count: temp_Play_List_Love.song_count.toString(),
      id: temp_Play_List_Love.id
    });
    page_albumlists.value.push(temp_Play_List_Love)
    //////
    const stmt_album_Annotation_Recently_Count = db.prepare(`
      SELECT COUNT(*) AS count FROM ${store_server_user_model.annotation}
      WHERE item_type='album'
    `);
    const temp_Play_List_Recently: Play_List = {
      label: computed(() => t('nsmusics.view_page.recentPlay')),
      value: 'album_list_recently',
      id: 'album_list_recently',
      name: computed(() => t('nsmusics.view_page.recentPlay')),
      comment: computed(() => t('nsmusics.view_page.recentPlay')),
      duration: 0,
      song_count: stmt_album_Annotation_Recently_Count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
      owner_id: ''
    }
    page_albumlists_options.value.push(temp_Play_List_Recently);
    page_albumlists_statistic.value.push({
      label: temp_Play_List_Recently.label,
      album_count: temp_Play_List_Recently.song_count.toString(),
      id: temp_Play_List_Recently.id
    });
    page_albumlists.value.push(temp_Play_List_Recently)
    //////
    const stmt_album_Annotation_PlayList_Count = db.prepare(`
      SELECT COUNT(*) AS count FROM ${store_server_user_model.playlist}
    `);
    page_albumlists_statistic.value.push({
      label: computed(() => t('entity.playlist_other')),
      album_count: stmt_album_Annotation_PlayList_Count.get().count + ' *',
      id: 'album_list_all_PlayList'
    });
  }
  const fetchData_Album = async () => {
    let db: any = null;
    let moment = require('moment');
    // clear RouterView of vue-virtual-scroller data
    clear_Files_temporary()
    router_select_model_album.value = true;

    try {
      db = require('better-sqlite3')(navidrome_db);
      db.pragma('journal_mode = WAL');
      let stmt_album = null;
      let stmt_album_string = '';

      // Init album_model data
      Init_page_albumlists_statistic_Data(db)

      // load album_Files_temporary data
      if (router_history_model_of_Album.value === 0) {
        const sortKey = page_albumlists_options_Sort_key.value.length > 0 && page_albumlists_options_Sort_key.value[0].order !== 'default' ?
            page_albumlists_options_Sort_key.value[0].columnKey : 'id';
        const sortOrder = page_albumlists_options_Sort_key.value.length > 0 && page_albumlists_options_Sort_key.value[0].order !== 'default' ?
            page_albumlists_options_Sort_key.value[0].order.replace('end', '') : '';
        let keywordFilter = page_albumlists_keyword.value.length > 0 ?
            `WHERE id LIKE '%${page_albumlists_keyword.value}%' OR name LIKE '%${page_albumlists_keyword.value}%' OR artist LIKE '%${page_albumlists_keyword.value}%' OR created_at LIKE '%${page_albumlists_keyword.value}%'` :
            '';
        if (find_album_model.value === true) {
          if (page_albumlists_get_keyword_model_num.value != 1)
            keywordFilter = `WHERE artist_id = '${page_albumlists_keyword.value}'`
          else
            keywordFilter = `WHERE created_at LIKE '${page_albumlists_keyword.value}'`
          find_album_model.value = false;
        } else {
          if (page_albumlists_get_keyword_model_num.value != 0) {
            if (keywordFilter.length > 0) {
              keywordFilter = keywordFilter.replace('LIKE', '=').replace(/%/g, '').replace('artist', 'artist_id');
            }
          }
        }
        stmt_album_string = `SELECT * FROM ${store_server_user_model.album} ${keywordFilter} ORDER BY ${sortKey} ${sortOrder}`;
        stmt_album = db.prepare(stmt_album_string);
        //////
        if (router_select_history_date_of_Album.value && page_albumlists_keyword_reset.value === true) {
          remove_router_history_of_Album(router_select_history_date_of_Album.value.id);// 若存在新操作，则覆盖后续的路由
          page_albumlists_keyword_reset.value = false;
        }
        const routerDate: Interface_View_Router_Date = {
          id: router_history_datas_of_Album.value ? router_history_datas_of_Album.value.length + 1 : 1,
          menu_select_active_key: 'go_albums_list',
          router_name: 'View_Album_List_ALL',
          router_select_model_media: false,
          router_select_model_album: true,
          router_select_model_artist: false,
          page_lists_keyword: page_albumlists_keyword.value,
          stmt_string: stmt_album_string,
          page_lists_selected: page_albumlists_selected.value,
          columnKey: page_albumlists_options_Sort_key.value.length > 0 && page_albumlists_options_Sort_key.value[0].order !== 'default' ?
              page_albumlists_options_Sort_key.value[0].columnKey : 'id',
          order: page_albumlists_options_Sort_key.value.length > 0 && page_albumlists_options_Sort_key.value[0].order !== 'default' ?
              page_albumlists_options_Sort_key.value[0].order.replace('end', '') : '',
          page_lists_scrollindex: router_history_model_of_Album_scroller_value.value,
        };
        add_router_history_of_Album(routerDate);// 重复路由不添加
        //////
      } else {
        if (router_select_history_date_of_Album.value) {
          router.push('View_Album_List_ALL')
          store_app_setting_configs.app_left_menu_select_activeKey = 'go_albums_list'
          router_select_model_album.value = true;
          page_albumlists_keyword.value = router_select_history_date_of_Album.value.page_lists_keyword;
          page_albumlists_selected.value = router_select_history_date_of_Album.value.page_lists_selected;
          page_albumlists_options_Sort_key.value = [
            {
              columnKey: router_select_history_date_of_Album.value.columnKey,
              order: router_select_history_date_of_Album.value.order
            }
          ];
          router_history_model_of_Album_scroller_value.value = router_select_history_date_of_Album.value.page_lists_scrollindex;
          stmt_album = db.prepare(router_select_history_date_of_Album.value.stmt_string);
        }
        router_history_model_of_Album.value = 0;
      }
      let rows = stmt_album.all();
      rows.forEach((row: Album) => {
        if(row.medium_image_url == null || row.medium_image_url == undefined || row.medium_image_url.length == 0) {
          if (row.embed_art_path.indexOf('mp3') > 0)
            row.medium_image_url = row.embed_art_path.replace('mp3', 'jpg');
          else if (row.embed_art_path.indexOf('flac') > 0)
            row.medium_image_url = row.embed_art_path.replace('flac', 'jpg');
          else
            row.medium_image_url = '../../../resources/img/error_album.jpg';
        }
        const fileNameMatch = row.embed_art_path.match(/[^\\\/]+$/);
        const fileNameWithExtension = fileNameMatch ? fileNameMatch[0] : null;
        const fileNameWithoutExtension = fileNameWithExtension ? fileNameWithExtension.replace(/\.[^.]+$/, '') : null;
        const fileNameWithoutPrefix = fileNameWithoutExtension ? fileNameWithoutExtension.replace(/.*?-\s*/, '') : null;
        if (fileNameWithoutPrefix !== null) {
          row.title = fileNameWithoutPrefix;
        }
        row.album_title = row.title + "<br>" + row.artist;
        row.updated_time = row.updated_at ? moment(row.updated_at, moment.ISO_8601).format('YYYY-MM-DD') : '';
        row.created_time = row.created_at ? moment(row.created_at, moment.ISO_8601).format('YYYY-MM-DD') : '';
        album_Files_temporary.value.push(row);
      });
      rows.length = 0
      moment = null;
      ////// find favorite for album_Files_temporary
      const stmt_album_Annotation_Starred_Items = db.prepare(`
      SELECT item_id FROM ${store_server_user_model.annotation}
      WHERE starred = 1 AND item_type='album'
    `);
      const annotations = stmt_album_Annotation_Starred_Items.all();
      for (let i = 0; i < album_Files_temporary.value.length; i++) {
        album_Files_temporary.value[i].favorite = !!annotations.some((annotation: {
          item_id: string
        }) => annotation.item_id === album_Files_temporary.value[i].id);
      }
      ////// find rating for album_Files_temporary
      const stmt_album_Annotation_Rating_Items = db.prepare(`
        SELECT item_id, rating FROM ${store_server_user_model.annotation}
        WHERE rating > 0 AND item_type='album'
    `);
      const annotations_rating = stmt_album_Annotation_Rating_Items.all();
      for (let i = 0; i < album_Files_temporary.value.length; i++) {
        const albumFile = album_Files_temporary.value[i];
        const matchingAnnotation = annotations_rating.find((annotation: {
          item_id: string,
          rating: number
        }) => annotation.item_id === albumFile.id);
        if (matchingAnnotation)
          albumFile.rating = matchingAnnotation.rating;
        else
          albumFile.rating = 0;
      }
      ////// filter selected_list for album_Files_temporary
      let order_play_date:any[] = [];
      album_Files_temporary.value = album_Files_temporary.value.filter((item: any) => {
        if (page_albumlists_selected.value === 'album_list_all') {
          return true;
        } else if (page_albumlists_selected.value === 'album_list_love') {
          return annotations.some((annotation: { item_id: string }) => annotation.item_id === item.id);
        } else if (page_albumlists_selected.value === 'album_list_recently') {
          const stmt_album_Annotation_Recently_Items = db.prepare(`
          SELECT item_id FROM ${store_server_user_model.annotation}
          WHERE item_type='album'
          ORDER BY play_date DESC
        `);
          const annotations = stmt_album_Annotation_Recently_Items.all().map((annotation: any) => annotation.item_id);
          order_play_date = annotations;
          return annotations.includes(item.id);
        } else if (page_albumlists_selected.value === 'album_list_all_PlayList') {
          return true;
        }
      });
      if (page_albumlists_selected.value === 'album_list_recently') {
        let new_sort: Album[] = album_Files_temporary.value.slice();
        album_Files_temporary.value = [];
        order_play_date.forEach((id) => {
          const index = new_sort.findIndex(item => item.id === id);
          if (index !== -1) {
            album_Files_temporary.value.push(new_sort[index]);
            new_sort.splice(index, 1);
          }
        });
      }
      album_Files_temporary.value.forEach((item: any, index: number) => {
        item.absoluteIndex = index + 1;
      });
    } catch (err: any) {
      console.error(err);
    } finally {
      db.close();
      console.log('db.close().......');
      db = null;
    }
  }
  const fetchData_This_Album_SongList = (album_id:any) => {
    store_player_appearance.player_mode_of_medialist_from_external_import = true;

    store_view_media_page_logic.page_songlists_keywordFilter = `WHERE album_id = '${album_id}'`
    store_view_media_page_logic.page_songlists_selected = 'song_list_all'
    store_view_media_page_info.media_Files_temporary = [];

    find_music_model.value = true;
    find_album_model.value = false;
    find_artist_model.value = false;
    fetchData_Media()
    find_music_model.value = false;

    store_playlist_list_info.playlist_MediaFiles_temporary = [...store_view_media_page_info.media_Files_temporary];
    store_playlist_list_info.playlist_datas_CurrentPlayListMediaIds = store_view_media_page_info.media_Files_temporary.map(item => item.id);
    save_system_playlist_item_id_config();

    router_select_model_album.value = true

    if(store_playlist_list_info.playlist_MediaFiles_temporary.length > 0){
      store_player_appearance.player_mode_of_audio_path_from_playlist = false
      store_player_audio_info.this_audio_file_path = store_playlist_list_info.playlist_MediaFiles_temporary[0].path
      store_player_audio_info.this_audio_lyrics_string = store_playlist_list_info.playlist_MediaFiles_temporary[0].lyrics
      store_player_audio_info.this_audio_file_medium_image_url = store_playlist_list_info.playlist_MediaFiles_temporary[0].medium_image_url
      store_player_audio_info.this_audio_singer_name = store_playlist_list_info.playlist_MediaFiles_temporary[0].artist
      store_player_audio_info.this_audio_song_name = store_playlist_list_info.playlist_MediaFiles_temporary[0].title
      store_player_audio_info.this_audio_album_id = store_playlist_list_info.playlist_MediaFiles_temporary[0].album_id
      store_player_audio_info.this_audio_album_favorite = store_playlist_list_info.playlist_MediaFiles_temporary[0].favorite
      store_player_audio_info.this_audio_album_name = store_playlist_list_info.playlist_MediaFiles_temporary[0].album
      store_player_audio_info.this_audio_Index_of_absolute_positioning_in_list = store_playlist_list_info.playlist_MediaFiles_temporary[0].absoluteIndex
      ///
      store_player_audio_info.this_audio_song_id = store_playlist_list_info.playlist_MediaFiles_temporary[0].id
      store_player_audio_info.this_audio_song_rating = store_playlist_list_info.playlist_MediaFiles_temporary[0].rating
      store_player_audio_info.this_audio_song_favorite = store_playlist_list_info.playlist_MediaFiles_temporary[0].favorite
    }

    let set_AlbumInfo_To_LocalSqlite = new Set_AlbumInfo_To_LocalSqlite()
    set_AlbumInfo_To_LocalSqlite.Set_AlbumInfo_To_PlayCount_of_Album(album_id)
  }

  ////// view of artist
  const artist_Files_temporary = ref<Artist[]>([]);
  const page_artistlists_options = ref<{label: string;value: string}[]>([])
  const page_artistlists_statistic = ref<{label: string;artist_count: string;id: string;}[]>([])
  const page_artistlists = ref<Play_List[]>([])
  const page_artistlists_selected = ref<string>('artist_list_all')
  const page_artistlists_keyword_reset = ref<boolean>(false)
  const page_artistlists_keyword = ref<string>('');
  const page_artistlists_get_keyword_model_num = ref<number>(0);
  const page_artistlists_options_Sort_key = ref<{ columnKey: string; order: string }[]>([]);
  function get_page_artistlists_options_Sort_key(value: { columnKey: string; order: string }[] = []) {
    if (value != null) {
      page_artistlists_options_Sort_key.value = value;
      page_artistlists_keyword.value = '';
      fix_router_history_of_Artist_scroller_value(router_history_model_of_Artist_scroller_value.value) // 保留此滚轮值(上次浏览位置)
      fetchData_Artist()
    }
  }
  function page_artistlists_get_keyword(value: any) {
    if(value.indexOf('accurate_search') > 0){
      value = value.replace('accurate_search','');
      if(value.indexOf('__title__') > 0){
        value = value.replace('__title__','');
        page_artistlists_get_keyword_model_num.value = 1;
      }else if(value.indexOf('__artist__') > 0){
        value = value.replace('__artist__','');
        page_artistlists_get_keyword_model_num.value = 2;
      }else if(value.indexOf('__album__') > 0){
        value = value.replace('__album__','');
        page_artistlists_get_keyword_model_num.value = 3;
      }
    }else{
      page_artistlists_get_keyword_model_num.value = 0;
    }
    page_artistlists_keyword.value = value;
    page_artistlists_keyword_reset.value = true;
    console.log('page_artistlists_keyword:' + value)

    fetchData_Artist()
  }
  function page_artistlists_get_reset_data(value: any) {
    page_artistlists_keyword.value = '';
    console.log('page_artistlists_reset_data?:' + value)
    fetchData_Artist()

    router_history_datas_of_Artist.value = [];
    if(router_select_history_date_of_Artist.value){
      router_select_history_date_of_Artist.value.id = 1;
      router_history_datas_of_Artist.value.push(router_select_history_date_of_Artist.value);
    }
  }
  const get_page_artistlists_selected = (value: any) => {
    page_artistlists_selected.value = value
    console.log('page_artistlists_selected：'+value)
    fetchData_Artist()
  }
  const Init_page_artistlists_statistic_Data = (db: any) => {
    const stmt_artist_count = db.prepare(`SELECT COUNT(*) AS count FROM ${store_server_user_model.artist}`);
    //
    page_artistlists_options.value = [];
    page_artistlists_statistic.value = [];
    page_artistlists.value = []
    //////
    const temp_Play_List_ALL: Play_List = {
      label: computed(() => t('nsmusics.view_page.allArtist')),
      value: 'artist_list_all',
      id: 'artist_list_all',
      name: computed(() => t('nsmusics.view_page.allArtist')),
      comment: computed(() => t('nsmusics.view_page.allArtist')),
      duration: 0,
      song_count: stmt_artist_count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
      owner_id: ''
    }
    page_artistlists_options.value.push(temp_Play_List_ALL);
    page_artistlists_statistic.value.push({
      label: temp_Play_List_ALL.label,
      artist_count: temp_Play_List_ALL.song_count.toString(),
      id: temp_Play_List_ALL.id
    });
    page_artistlists.value.push(temp_Play_List_ALL)
    //////
    const stmt_artist_Annotation_Starred_Count = db.prepare(`
      SELECT COUNT(*) AS count FROM ${store_server_user_model.annotation}
      WHERE starred = 1 AND item_type='artist'
    `);
    const temp_Play_List_Love: Play_List = {
      label: computed(() => t('nsmusics.view_page.loveArtist')),
      value: 'artist_list_love',
      id: 'artist_list_love',
      name: computed(() => t('nsmusics.view_page.loveArtist')),
      comment: computed(() => t('nsmusics.view_page.loveArtist')),
      duration: 0,
      song_count: stmt_artist_Annotation_Starred_Count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
      owner_id: ''
    }
    page_artistlists_options.value.push(temp_Play_List_Love);
    page_artistlists_statistic.value.push({
      label: temp_Play_List_Love.label,
      artist_count: temp_Play_List_Love.song_count.toString(),
      id: temp_Play_List_Love.id
    });
    page_artistlists.value.push(temp_Play_List_Love)
    //////
    const stmt_artist_Annotation_Recently_Count = db.prepare(`
      SELECT COUNT(*) AS count FROM ${store_server_user_model.annotation}
      WHERE item_type='artist'
    `);
    const temp_Play_List_Recently: Play_List = {
      label: computed(() => t('nsmusics.view_page.recentPlay')),
      value: 'artist_list_recently',
      id: 'artist_list_recently',
      name: computed(() => t('nsmusics.view_page.recentPlay')),
      comment: computed(() => t('nsmusics.view_page.recentPlay')),
      duration: 0,
      song_count: stmt_artist_Annotation_Recently_Count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
      owner_id: ''
    }
    page_artistlists_options.value.push(temp_Play_List_Recently);
    page_artistlists_statistic.value.push({
      label: temp_Play_List_Recently.label,
      artist_count: temp_Play_List_Recently.song_count.toString(),
      id: temp_Play_List_Recently.id
    });
    page_artistlists.value.push(temp_Play_List_Recently)
    //////
    const stmt_artist_Annotation_PlayList_Count = db.prepare(`
      SELECT COUNT(*) AS count FROM ${store_server_user_model.playlist}
    `);
    page_artistlists_statistic.value.push({
      label: computed(() => t('entity.playlist_other')),
      artist_count: stmt_artist_Annotation_PlayList_Count.get().count + ' *',
      id: 'artist_list_all_PlayList'
    });
  }
  const fetchData_Artist = async () => {
    let db: any = null;
    // clear RouterView of vue-virtual-scroller data
    clear_Files_temporary()
    router_select_model_artist.value = true;

    try {
      db = require('better-sqlite3')(navidrome_db);
      db.pragma('journal_mode = WAL');
      let stmt_artist = null;
      let stmt_artist_string = '';

      // Init artist_model data
      Init_page_artistlists_statistic_Data(db)

      // load artist_Files_temporary data
      if (router_history_model_of_Artist.value === 0) {
        const sortKey = page_artistlists_options_Sort_key.value.length > 0 && page_artistlists_options_Sort_key.value[0].order !== 'default' ?
            page_artistlists_options_Sort_key.value[0].columnKey : 'id';
        const sortOrder = page_artistlists_options_Sort_key.value.length > 0 && page_artistlists_options_Sort_key.value[0].order !== 'default' ?
            page_artistlists_options_Sort_key.value[0].order.replace('end', '') : '';
        let keywordFilter = page_artistlists_keyword.value.length > 0 ?
            `WHERE name LIKE '%${page_artistlists_keyword.value}%' OR external_info_updated_at LIKE '%${page_artistlists_keyword.value}%'` :
            '';
        stmt_artist_string = `SELECT * FROM ${store_server_user_model.artist} ${keywordFilter} ORDER BY ${sortKey} ${sortOrder}`;
        stmt_artist = db.prepare(stmt_artist_string);
        //////
        if (router_select_history_date_of_Artist.value && page_artistlists_keyword_reset.value === true) {
          remove_router_history_of_Artist(router_select_history_date_of_Artist.value.id);// 若存在新操作，则覆盖后续的路由
          page_artistlists_keyword_reset.value = false;
        }
        const routerDate: Interface_View_Router_Date = {
          id: router_history_datas_of_Artist.value ? router_history_datas_of_Artist.value.length + 1 : 1,
          menu_select_active_key: 'go_artist_list',
          router_name: 'View_Artist_List_ALL',
          router_select_model_media: false,
          router_select_model_album: false,
          router_select_model_artist: true,
          page_lists_keyword: page_artistlists_keyword.value,
          stmt_string: stmt_artist_string,
          page_lists_selected: page_artistlists_selected.value,
          columnKey: page_artistlists_options_Sort_key.value.length > 0 && page_artistlists_options_Sort_key.value[0].order !== 'default' ?
              page_artistlists_options_Sort_key.value[0].columnKey : 'id',
          order: page_artistlists_options_Sort_key.value.length > 0 && page_artistlists_options_Sort_key.value[0].order !== 'default' ?
              page_artistlists_options_Sort_key.value[0].order.replace('end', '') : '',
          page_lists_scrollindex: router_history_model_of_Artist_scroller_value.value,
        };
        add_router_history_of_Artist(routerDate);// 重复路由不添加
        //////
      } else {
        if (router_select_history_date_of_Artist.value) {
          router.push('View_Artist_List_ALL')
          store_app_setting_configs.app_left_menu_select_activeKey = 'go_artist_list'
          router_select_model_artist.value = true;
          page_artistlists_keyword.value = router_select_history_date_of_Artist.value.page_lists_keyword;
          page_artistlists_selected.value = router_select_history_date_of_Artist.value.page_lists_selected;
          page_artistlists_options_Sort_key.value = [
            {
              columnKey: router_select_history_date_of_Artist.value.columnKey,
              order: router_select_history_date_of_Artist.value.order
            }
          ];
          router_history_model_of_Artist_scroller_value.value = router_select_history_date_of_Artist.value.page_lists_scrollindex;
          stmt_artist = db.prepare(router_select_history_date_of_Artist.value.stmt_string);
        }
        router_history_model_of_Artist.value = 0;
      }
      const stmt_media_file = db.prepare(`SELECT * FROM ${store_server_user_model.media_file}`);
      const pathfiles = stmt_media_file.all();
      let rows = stmt_artist.all();
      rows.forEach((row: Artist) => {
        for (let j = 0; j < pathfiles.length; j++) {
          if (pathfiles[j].artist_id === row.id) {
            if(row.medium_image_url == null || row.medium_image_url == undefined || row.medium_image_url.length == 0) {
              if (pathfiles[j].path.indexOf('mp3') > 0)
                row.medium_image_url = pathfiles[j].path.replace('mp3', 'jpg');
              else if (pathfiles[j].path.indexOf('flac') > 0)
                row.medium_image_url = pathfiles[j].path.replace('flac', 'jpg');
              else
                row.medium_image_url = '../../../resources/img/error_album.jpg';
            }
            break;
          }
          if (j === pathfiles.length - 1) {
            row.medium_image_url = '../../../resources/img/error_album.jpg';
          }
        }
        artist_Files_temporary.value.push(row);
      });
      rows.length = 0
      ////// find favorite for artist_Files_temporary
      const stmt_artist_Annotation_Starred_Items = db.prepare(`
      SELECT item_id FROM ${store_server_user_model.annotation}
      WHERE starred = 1 AND item_type='artist'
    `);
      const annotations = stmt_artist_Annotation_Starred_Items.all();
      for (let i = 0; i < artist_Files_temporary.value.length; i++) {
        artist_Files_temporary.value[i].favorite = !!annotations.some((annotation: {
          item_id: string
        }) => annotation.item_id === artist_Files_temporary.value[i].id);
      }
      ////// find rating for artist_Files_temporary
      const stmt_artist_Annotation_Rating_Items = db.prepare(`
        SELECT item_id, rating FROM ${store_server_user_model.annotation}
        WHERE rating > 0 AND item_type='artist'
    `);
      const annotations_rating = stmt_artist_Annotation_Rating_Items.all();
      for (let i = 0; i < artist_Files_temporary.value.length; i++) {
        const artistFile = artist_Files_temporary.value[i];
        const matchingAnnotation = annotations_rating.find((annotation: {
          item_id: string,
          rating: number
        }) => annotation.item_id === artistFile.id);
        if (matchingAnnotation)
          artistFile.rating = matchingAnnotation.rating;
        else
          artistFile.rating = 0;
      }
      ////// filter selected_list for artist_Files_temporary
      let order_play_date:any[] = [];
      artist_Files_temporary.value = artist_Files_temporary.value.filter((item: any) => {
        if (page_artistlists_selected.value === 'artist_list_all') {
          return true;
        } else if (page_artistlists_selected.value === 'artist_list_love') {
          return annotations.some((annotation: { item_id: string }) => annotation.item_id === item.id);
        } else if (page_artistlists_selected.value === 'artist_list_recently') {
          const stmt_artist_Annotation_Recently_Items = db.prepare(`
          SELECT item_id FROM ${store_server_user_model.annotation}
          WHERE item_type='artist'
          ORDER BY play_date DESC
        `);
          const annotations = stmt_artist_Annotation_Recently_Items.all().map((annotation: any) => annotation.item_id);
          order_play_date = annotations;
          return annotations.includes(item.id);
        } else if (page_artistlists_selected.value === 'artist_list_all_PlayList') {
          return true;
        }
      });
      if (page_artistlists_selected.value === 'artist_list_recently') {
        let new_sort: Artist[] = artist_Files_temporary.value.slice();
        artist_Files_temporary.value = [];
        order_play_date.forEach((id) => {
          const index = new_sort.findIndex(item => item.id === id);
          if (index !== -1) {
            artist_Files_temporary.value.push(new_sort[index]);
            new_sort.splice(index, 1);
          }
        });
      }
      // artist_Files_temporary.value.forEach((item: any, index: number) => {
      //   item.absoluteIndex = index + 1;
      // });
    } catch (err: any) {
      console.error(err);
    } finally {
      db.close();
      console.log('db.close().......');
      db = null;
    }
  }
  const fetchData_This_Artist_SongList = (artist_id:any) => {
    store_player_appearance.player_mode_of_medialist_from_external_import = true;

    store_view_media_page_logic.page_songlists_keywordFilter = `WHERE artist_id = '${artist_id}'`
    store_view_media_page_logic.page_songlists_selected = 'song_list_all'
    store_view_media_page_info.media_Files_temporary = [];

    find_music_model.value = false;
    find_album_model.value = false;
    find_artist_model.value = true;
    fetchData_Media()
    find_artist_model.value = false;

    store_playlist_list_info.playlist_MediaFiles_temporary = [...store_view_media_page_info.media_Files_temporary];
    store_playlist_list_info.playlist_datas_CurrentPlayListMediaIds = store_view_media_page_info.media_Files_temporary.map(item => item.id);
    save_system_playlist_item_id_config();
    
    router_select_model_artist.value = true
    
    if(store_playlist_list_info.playlist_MediaFiles_temporary.length > 0){
      store_player_appearance.player_mode_of_audio_path_from_playlist = false
      store_player_audio_info.this_audio_file_path = store_playlist_list_info.playlist_MediaFiles_temporary[0].path
      store_player_audio_info.this_audio_lyrics_string = store_playlist_list_info.playlist_MediaFiles_temporary[0].lyrics
      store_player_audio_info.this_audio_file_medium_image_url = store_playlist_list_info.playlist_MediaFiles_temporary[0].medium_image_url
      store_player_audio_info.this_audio_singer_name = store_playlist_list_info.playlist_MediaFiles_temporary[0].artist
      store_player_audio_info.this_audio_song_name = store_playlist_list_info.playlist_MediaFiles_temporary[0].title
      store_player_audio_info.this_audio_album_id = store_playlist_list_info.playlist_MediaFiles_temporary[0].album_id
      store_player_audio_info.this_audio_album_favorite = store_playlist_list_info.playlist_MediaFiles_temporary[0].favorite
      store_player_audio_info.this_audio_album_name = store_playlist_list_info.playlist_MediaFiles_temporary[0].album
      store_player_audio_info.this_audio_Index_of_absolute_positioning_in_list = store_playlist_list_info.playlist_MediaFiles_temporary[0].absoluteIndex
      ///
      store_player_audio_info.this_audio_song_id = store_playlist_list_info.playlist_MediaFiles_temporary[0].id
      store_player_audio_info.this_audio_song_rating = store_playlist_list_info.playlist_MediaFiles_temporary[0].rating
      store_player_audio_info.this_audio_song_favorite = store_playlist_list_info.playlist_MediaFiles_temporary[0].favorite
    }

    let set_ArtistInfo_To_LocalSqlite = new Set_ArtistInfo_To_LocalSqlite()
    set_ArtistInfo_To_LocalSqlite.Set_ArtistInfo_To_PlayCount_of_Artist(store_playlist_list_info.playlist_MediaFiles_temporary[0].artist_id)
  }

  ////// router custom for history_search 
  // history_search model basic info
  const find_music_model = ref<Boolean>(false)
  const find_album_model = ref<Boolean>(false)
  const find_artist_model = ref<Boolean>(false)
  function get_media_list_of_album_id_by_album_info(value: any) {
    console.log('get_media_list_of_album_model：'+value)
    // open media_files model，keywords set
    store_view_media_page_logic.page_songlists_keywordFilter = `WHERE album_id = '${value}'`

    store_view_media_page_logic.page_songlists_get_keyword_model_num = 3
    find_music_model.value = true

    router.push('View_Song_List_ALL')
    store_app_setting_configs.app_left_menu_select_activeKey = 'go_songs_list'
  }
  function get_album_list_of_artist_id_by_album_info(value: any) {
    console.log('get_album_list_of_artist_model：'+value)
    // open album_files model，keywords set
    page_albumlists_keyword.value = value
    page_albumlists_get_keyword_model_num.value = 2
    find_album_model.value = true
  }
  function get_album_list_of_artist_id_by_artist_info(value: any) {
    console.log('get_album_list_of_artist_model：'+value)
    // open album_files model，keywords set
    page_albumlists_keyword.value = value
    page_albumlists_get_keyword_model_num.value = 2
    find_artist_model.value = false

    router.push('View_Album_List_ALL')
    store_app_setting_configs.app_left_menu_select_activeKey = 'go_albums_list'
  }
  /// router Data_sources and rendering
  const router_select_model_menu = ref<Boolean>(false)
  const router_select_model_home = ref<Boolean>(false)
  const router_select_model_updateing = ref<Boolean>(false)
  const router_select_model_media = ref<Boolean>(false)
  const router_select_model_album = ref<Boolean>(false)
  const router_select_model_artist = ref<Boolean>(false)
  function clear_Files_temporary() {
    router_select_model_menu.value = false
    router_select_model_home.value = false
    router_select_model_updateing.value = false
    router_select_model_media.value = false
    router_select_model_album.value = false
    router_select_model_artist.value = false
    store_view_home_page_info.home_Files_temporary_maximum_playback = []
    store_view_home_page_info.home_Files_temporary_random_search = []
    store_view_home_page_info.home_Files_temporary_recently_added = []
    store_view_home_page_info.home_Files_temporary_recently_played = []
    store_view_media_page_info.media_Files_temporary = [];
    album_Files_temporary.value = [];
    artist_Files_temporary.value = [];
    /// gc
    clear_session_clearCache()
  }
  function clear_session_clearCache() {
    ipcRenderer.send('window-gc');
  }
  /// router custom class
  const router = useRouter();
  const router_name = ref('')
  routers.beforeEach((to, from, next) => {
    if(to.name !== from.name){
      clear_Files_temporary()
      next();
    }
  });
  routers.afterEach(async (to, from) => {
    if(to.name !== from.name){
      clear_Files_temporary()
      if(to.name === 'View_Menu_AppSetting'){
        router_select_model_menu.value = true
        router_name.value = to.name
      }else if(to.name === 'View_Home_MusicLibrary_Browse'){
        router_select_model_home.value = true
        router_name.value = to.name
      }else if(to.name === 'View_Updateing'){
        router_select_model_updateing.value = true
        router_name.value = to.name
      }else if(to.name === 'View_Song_List_ALL'){
        router_select_model_media.value = true
        router_name.value = to.name
      }else if(to.name === 'View_Album_List_ALL'){
        router_select_model_album.value = true
        router_name.value = to.name
      }else if(to.name === 'View_Artist_List_ALL'){
        router_select_model_artist.value = true
        router_name.value = to.name
      }
      save_system_config_of_View_Router_History()
      ///
      try {
        const memoryUsage = await ipcRenderer.invoke('window-get-memory')
        if (memoryUsage.rss > MEMORY_THRESHOLD) {
          ipcRenderer.send('window-reset-data')
        }
      }catch{}
    }
  });
  const MEMORY_THRESHOLD = 240 * 1024 * 1024; // 240MB
  const get_router_select = (value: any) => {
    ////// 
    if(value === 'View_Home_MusicLibrary_Browse'){
      router_select_model_home.value = true
      fetchData_Home()
    }else if(value === 'View_Song_List_ALL'){
      router_select_model_media.value = true
      fetchData_Media()
    }else if(value === 'View_Album_List_ALL'){
      router_select_model_album.value = true
      fetchData_Album()
    }else if(value === 'View_Artist_List_ALL'){
      router_select_model_artist.value = true
      fetchData_Artist()
    }
  }
  // history router of media
  const router_history_model_of_Media_scroll = ref<Boolean>(false)
  const get_router_history_model_of_Media_scroll = (value: any) => {
    router_history_model_of_Media_scroll.value = value
    // console.log('router_history_model_of_Media_scroll：'+value)
  }
  const router_history_model_of_Media_scroller_value = ref<number>(0)
  function get_router_history_model_of_Media_scroller_value (value: any) {
    if(value !== 0){
      router_history_model_of_Media_scroller_value.value = value
      // console.log('router_history_model_of_Media_scroller_value：'+value)
    }
  }
  const router_history_model_of_Media = ref<number>(0)
  function get_router_history_model_of_Media(value: any) {
    if (value !== 0) {
      router_history_model_of_Media.value = value;
      const currentIndex = router_history_datas_of_Media.value.findIndex(item => item.id === (router_select_history_date_of_Media.value?.id ?? ''));
      if (currentIndex !== -1) {
        const newIndex = currentIndex + value;
        if (newIndex >= 0 && newIndex < router_history_datas_of_Media.value.length) {      
          fix_router_history_of_Media_scroller_value(router_history_model_of_Media_scroller_value.value) // 保留此滚轮值(上次浏览位置)
          router_select_history_date_of_Media.value = router_history_datas_of_Media.value[newIndex];
          clear_Files_temporary();
          const selectedRouterName = router_select_history_date_of_Media.value.router_name;
          if (selectedRouterName === 'View_Song_List_ALL') {
            router_select_model_media.value = true;
            fetchData_Media();
            router_history_model_of_Media_scroll.value = true;
          }
        }
      }
    }
  }
  const router_history_datas_of_Media = ref<Interface_View_Router_Date[]>([])
  const router_select_history_date_of_Media = ref<Interface_View_Router_Date>()
  const add_router_history_of_Media = (new_Router_date: Interface_View_Router_Date) => {
    for (let i = 0; i < router_history_datas_of_Media.value.length; i++) {
      if (router_history_datas_of_Media.value[i].stmt_string === new_Router_date.stmt_string) {
        if (router_history_datas_of_Media.value[i].page_lists_keyword === new_Router_date.page_lists_keyword) {
          if (router_history_datas_of_Media.value[i].page_lists_selected === new_Router_date.page_lists_selected) {
            if(router_history_datas_of_Media.value[i].columnKey === new_Router_date.columnKey) {
              if(router_history_datas_of_Media.value[i].order === new_Router_date.order) {
                new_Router_date.id = router_history_datas_of_Media.value[i].id;
                router_history_datas_of_Media.value[i] = new_Router_date;
                router_select_history_date_of_Media.value = new_Router_date;
                return;
              }
            }
          }
        }
      }
    }
    if (router_history_datas_of_Media.value.length >= 36)
      router_history_datas_of_Media.value.shift();
    router_history_datas_of_Media.value.push(new_Router_date);  
    router_select_history_date_of_Media.value = new_Router_date;
  };
  const remove_router_history_of_Media = (id: number) => {
    const index = router_history_datas_of_Media.value.findIndex(item => item.id === id);  
    if (index !== -1) {
      router_history_datas_of_Media.value.splice(index + 1);  
    }  
  };
  const fix_router_history_of_Media_scroller_value = (value: number) => {
    const index = router_history_datas_of_Media.value.findIndex(item => item.id === (router_select_history_date_of_Media.value?.id ?? ''));
    if (index !== -1) {
      router_history_datas_of_Media.value[index].page_lists_scrollindex = value;
    }  
  }
  // history router of album
  const router_history_model_of_Album_scroll = ref<Boolean>(false)
  const get_router_history_model_of_Album_scroll = (value: any) => {
    router_history_model_of_Album_scroll.value = value
    // console.log('router_history_model_of_Album_scroll：'+value)
  }
  const router_history_model_of_Album_scroller_value = ref<number>(0)
  function get_router_history_model_of_Album_scroller_value (value: any) {
    if(value !== 0){
      router_history_model_of_Album_scroller_value.value = value
      // console.log('router_history_model_of_Album_scroller_value：'+value)
    }
  }
  const router_history_model_of_Album = ref<number>(0)
  function get_router_history_model_of_Album(value: any) {
    if (value !== 0) {
      router_history_model_of_Album.value = value;
      const currentIndex = router_history_datas_of_Album.value.findIndex(item => item.id === (router_select_history_date_of_Album.value?.id ?? ''));
      if (currentIndex !== -1) {
        const newIndex = currentIndex + value;
        if (newIndex >= 0 && newIndex < router_history_datas_of_Album.value.length) {
          fix_router_history_of_Album_scroller_value(router_history_model_of_Album_scroller_value.value) // 保留此滚轮值(上次浏览位置)
          router_select_history_date_of_Album.value = router_history_datas_of_Album.value[newIndex];
          clear_Files_temporary();
          const selectedRouterName = router_select_history_date_of_Album.value.router_name;
          if (selectedRouterName === 'View_Album_List_ALL') {
            router_select_model_album.value = true;
            fetchData_Album();
            router_history_model_of_Album_scroll.value = true;
          }
        }
      }
    }
  }
  const router_history_datas_of_Album = ref<Interface_View_Router_Date[]>([])
  const router_select_history_date_of_Album = ref<Interface_View_Router_Date>()
  const add_router_history_of_Album = (new_Router_date: Interface_View_Router_Date) => {
    for (let i = 0; i < router_history_datas_of_Album.value.length; i++) {
      if (router_history_datas_of_Album.value[i].stmt_string === new_Router_date.stmt_string) {
        if (router_history_datas_of_Album.value[i].page_lists_keyword === new_Router_date.page_lists_keyword) {
          if (router_history_datas_of_Album.value[i].page_lists_selected === new_Router_date.page_lists_selected) {
            if(router_history_datas_of_Album.value[i].columnKey === new_Router_date.columnKey) {
              if(router_history_datas_of_Album.value[i].order === new_Router_date.order) {
                new_Router_date.id = router_history_datas_of_Album.value[i].id;
                router_history_datas_of_Album.value[i] = new_Router_date;
                router_select_history_date_of_Album.value = new_Router_date;
                return;
              }
            }
          }
        }
      }
    }
    if (router_history_datas_of_Album.value.length >= 36)
      router_history_datas_of_Album.value.shift();
    router_history_datas_of_Album.value.push(new_Router_date);  
    router_select_history_date_of_Album.value = new_Router_date;
  };
  const remove_router_history_of_Album = (id: number) => {
    const index = router_history_datas_of_Album.value.findIndex(item => item.id === id);  
    if (index !== -1) {
      router_history_datas_of_Album.value.splice(index + 1);  
    }  
  };
  const fix_router_history_of_Album_scroller_value = (value: number) => {
    const index = router_history_datas_of_Album.value.findIndex(item => item.id === (router_select_history_date_of_Album.value?.id ?? ''));
    if (index !== -1) {
      router_history_datas_of_Album.value[index].page_lists_scrollindex = value;
    }  
  }
  // history router of artist
  const router_history_model_of_Artist_scroll = ref<Boolean>(false)
  const get_router_history_model_of_Artist_scroll = (value: any) => {
    router_history_model_of_Artist_scroll.value = value
    // console.log('router_history_model_of_Artist_scroll：'+value)
  }
  const router_history_model_of_Artist_scroller_value = ref<number>(0)
  function get_router_history_model_of_Artist_scroller_value (value: any) {
    if(value !== 0){
      router_history_model_of_Artist_scroller_value.value = value
      // console.log('router_history_model_of_Artist_scroller_value：'+value)
    }
  }
  const router_history_model_of_Artist = ref<number>(0)
  function get_router_history_model_of_Artist(value: any) {
    if (value !== 0) {
      router_history_model_of_Artist.value = value;
      const currentIndex = router_history_datas_of_Artist.value.findIndex(item => item.id === (router_select_history_date_of_Artist.value?.id ?? ''));
      if (currentIndex !== -1) {
        const newIndex = currentIndex + value;
        if (newIndex >= 0 && newIndex < router_history_datas_of_Artist.value.length) {
          fix_router_history_of_Artist_scroller_value(router_history_model_of_Artist_scroller_value.value) // 保留此滚轮值(上次浏览位置)
          router_select_history_date_of_Artist.value = router_history_datas_of_Artist.value[newIndex];
          clear_Files_temporary();
          const selectedRouterName = router_select_history_date_of_Artist.value.router_name;
          if (selectedRouterName === 'View_Artist_List_ALL') {
            router_select_model_artist.value = true;
            fetchData_Artist();
            router_history_model_of_Artist_scroll.value = true;
          }
        }
      }
    }
  }
  const router_history_datas_of_Artist = ref<Interface_View_Router_Date[]>([])
  const router_select_history_date_of_Artist = ref<Interface_View_Router_Date>()
  const add_router_history_of_Artist = (new_Router_date: Interface_View_Router_Date) => {
    for (let i = 0; i < router_history_datas_of_Artist.value.length; i++) {
      if (router_history_datas_of_Artist.value[i].stmt_string === new_Router_date.stmt_string) {
        if (router_history_datas_of_Artist.value[i].page_lists_keyword === new_Router_date.page_lists_keyword) {
          if (router_history_datas_of_Artist.value[i].page_lists_selected === new_Router_date.page_lists_selected) {
            if(router_history_datas_of_Artist.value[i].columnKey === new_Router_date.columnKey) {
              if(router_history_datas_of_Artist.value[i].order === new_Router_date.order) {
                new_Router_date.id = router_history_datas_of_Artist.value[i].id;
                router_history_datas_of_Artist.value[i] = new_Router_date;
                router_select_history_date_of_Artist.value = new_Router_date;
                return;
              }
            }
          }
        }
      }
    }
    if (router_history_datas_of_Artist.value.length >= 36)
      router_history_datas_of_Artist.value.shift();
    router_history_datas_of_Artist.value.push(new_Router_date);  
    router_select_history_date_of_Artist.value = new_Router_date;
  };
  const remove_router_history_of_Artist = (id: number) => {
    const index = router_history_datas_of_Artist.value.findIndex(item => item.id === id);  
    if (index !== -1) {
      router_history_datas_of_Artist.value.splice(index + 1);  
    }  
  };
  const fix_router_history_of_Artist_scroller_value = (value: number) => {
    const index = router_history_datas_of_Artist.value.findIndex(item => item.id === (router_select_history_date_of_Artist.value?.id ?? ''));
    if (index !== -1) {
      router_history_datas_of_Artist.value[index].page_lists_scrollindex = value;
    }  
  }

  ////// Load this_app Configs
  onMounted(() => {
    /// system configs
    try {
      let system_Configs_Read = new System_Configs_Read();
      /// App_Configs load
      store_server_user_model.model_select = '' + system_Configs_Read.app_Configs.value['model_select']
      store_server_user_model.model_select === 'navidrome' ?
        store_server_user_model.switchToMode_Navidrome_Api()
        :
        store_server_user_model.switchToMode_Local()
      if (('' + system_Configs_Read.app_Configs.value['theme']) === 'lightTheme') {
        store_app_setting_configs.update_theme = false;
        store_app_setting_configs.theme = lightTheme;
        store_app_setting_configs.theme_app = lightTheme;
      } else {
        store_app_setting_configs.update_theme = true;
        store_app_setting_configs.theme = darkTheme;
        store_app_setting_configs.theme_app = darkTheme;
      }
      store_app_setting_configs.theme_name = '' + system_Configs_Read.app_Configs.value['theme']
      store_app_setting_configs.update_lang = '' + system_Configs_Read.app_Configs.value['lang']
      store_app_setting_configs.app_left_menu_select_activeKey = '' + system_Configs_Read.app_Configs.value['app_left_menu_select_activeKey']
      store_app_setting_configs.app_left_menu_collapsed = '' + system_Configs_Read.app_Configs.value['app_left_menu_collapsed'] === 'true'
      router_name.value = '' + system_Configs_Read.app_Configs.value['router_name']
      /// library_Config
      store_server_user_model.library_path = '' + system_Configs_Read.library_Configs.value['library']
      console.log(store_server_user_model.library_path)
      /// player_Configs_For_UI
      store_player_appearance.player_UI_Theme_State.player_collapsed_album = '' + system_Configs_Read.player_Configs_of_UI.value['player_collapsed_album'] === 'true'
      store_player_appearance.player_UI_Theme_State.player_collapsed_skin = '' + system_Configs_Read.player_Configs_of_UI.value['player_collapsed_skin'] === 'true'
      store_player_appearance.player_UI_Theme_State.player_lyric_fontSize = '' + system_Configs_Read.player_Configs_of_UI.value['player_lyric_fontSize']
      store_player_appearance.player_UI_Theme_State.player_lyric_fontWeight = '' + system_Configs_Read.player_Configs_of_UI.value['player_lyric_fontWeight']
      store_player_appearance.player_UI_Theme_State.player_lyric_color = '' + system_Configs_Read.player_Configs_of_UI.value['player_lyric_color']
      store_player_appearance.player_UI_Theme_State.player_theme_Styles_Selected = Number('' + system_Configs_Read.player_Configs_of_UI.value['player_theme_Styles_Selected'])
      store_player_appearance.player_UI_Theme_State.player_background_model_num = Number('' + system_Configs_Read.player_Configs_of_UI.value['player_background_model_num'])
      store_player_appearance.player_UI_Theme_State.player_use_lottie_animation = '' + system_Configs_Read.player_Configs_of_UI.value['player_use_lottie_animation'] === 'true'
      store_player_audio_logic.player_use_lottie_animation = '' + system_Configs_Read.player_Configs_of_UI.value['player_use_lottie_animation'] === 'true'
      /// player_Configs_of_Audio_Info
      store_player_audio_info.this_audio_file_path = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_path']
      store_player_audio_info.this_audio_file_medium_image_url = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_medium_image_url']
      store_player_audio_info.this_audio_lyrics_string = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_lyric']
      store_player_audio_info.this_audio_singer_name = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_singer_name']
      store_player_audio_info.this_audio_song_name = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_song_name']
      store_player_audio_info.this_audio_album_name = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_name']
      store_player_audio_info.this_audio_album_id = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_id']
      store_player_audio_info.this_audio_album_favorite = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_favorite']
      store_player_audio_info.this_audio_Index_of_absolute_positioning_in_list = Number('' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_Index_of_absolute_positioning_in_list'])
      store_view_media_page_logic.page_songlists_selected = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_songlists_selected']
      //
      store_player_audio_info.page_top_album_image_url = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_image_url']
      store_player_audio_info.page_top_album_id = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_id']
      store_player_audio_info.page_top_album_name = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_name']
      //
      store_player_appearance.player_mode_of_audio_path_from_playlist = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['player_mode_of_audio_path_from_playlist'] === 'true'
      store_player_appearance.player_mode_of_medialist_from_external_import = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['player_mode_of_medialist_from_external_import'] === 'true'
      //
      store_player_audio_logic.play_order = '' + system_Configs_Read.app_Configs.value['play_order']

      /// view_router_history
      // router_history_datas_of_Media.value = system_Configs_Read.view_Media_History_Configs.value
      // router_history_datas_of_Album.value = system_Configs_Read.view_Album_History_Configs.value
      // router_history_datas_of_Artist.value = system_Configs_Read.view_Artist_History_Configs.value
      router_select_history_date_of_Media.value = system_Configs_Read.view_Media_History_select_Configs.value
      router_select_history_date_of_Album.value = system_Configs_Read.view_Media_History_select_Configs.value
      router_select_history_date_of_Artist.value = system_Configs_Read.view_Media_History_select_Configs.value

      /// server
      store_server_users.server_config_of_all_user_of_sqlite = system_Configs_Read.server_Configs.value
      store_server_users.server_config_of_current_user_of_sqlite = system_Configs_Read.server_Configs_Current.value
      if (store_server_users.server_config_of_current_user_of_sqlite) {
        store_server_users.server_config_of_all_user_of_sqlite.forEach((item: any) => {
          store_server_users.server_config_of_all_user_of_select.push(
              {
                label: item.server_name,
                value: item.id
              });
        });
        store_server_users.server_config_of_current_user_of_select = store_server_users.server_config_of_current_user_of_sqlite
        store_server_users.server_config_of_current_user_of_select_servername = store_server_users.server_config_of_current_user_of_sqlite?.server_name
      }
      save_system_config_of_Servers_Config()

      /// playlist media_file_id_of_list
      store_playlist_list_info.playlist_datas_CurrentPlayListMediaIds = system_Configs_Read.playlist_File_Configs.value
      let get_PlaylistInfo_From_LocalSqlite = new Get_PlaylistInfo_From_LocalSqlite()
      store_playlist_list_info.playlist_MediaFiles_temporary = get_PlaylistInfo_From_LocalSqlite.Get_Playlist_Media_File_Id_of_list(store_playlist_list_info.playlist_datas_CurrentPlayListMediaIds)
    }catch (e) { console.error(e) }

    /// playlist configs
    try{
      let get_PlaylistInfo_From_LocalSqlite = new Get_PlaylistInfo_From_LocalSqlite()
      const playlist_temporary = get_PlaylistInfo_From_LocalSqlite.Get_Playlist()
      playlist_temporary.forEach((item:Play_List) =>{
        store_playlist_list_info.playlist_names_ALLLists.push({
          label: item.name,
          value: item.id
        })
        store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.push({
          playlist: item,
          playlist_tracks: get_PlaylistInfo_From_LocalSqlite.Get_Playlist_Tracks(item.id)
        })
      });
    }catch (e) { console.error(e) }

    /// close
    router.push(router_name.value)
  });
  ////// Save this_app Configs
  function save_system_config_of_App_Configs(){
    let db:any = null;
    db = require('better-sqlite3')(nsmusics_db);
    db.pragma('journal_mode = WAL');
    const app_Configs = ref(
        new App_Configs({
          theme: store_app_setting_configs.theme_name,
          lang: store_app_setting_configs.update_lang,
          router_name: String(router_name.value),
          app_left_menu_select_activeKey: String(store_app_setting_configs.app_left_menu_select_activeKey),
          app_left_menu_collapsed: String(store_app_setting_configs.app_left_menu_collapsed),
          model_select: String(store_server_user_model.model_select),
          play_order: String(store_player_audio_logic.play_order)
        }));
    let system_Configs_Write = new System_Configs_Write()
    system_Configs_Write.system_app_config(
        db,
        app_Configs.value)
    console.log('save config succuessful')
    db.close();db = null;
  }
  function save_system_library_config(){
    let db:any = null;
    db = require('better-sqlite3')(nsmusics_db);
    db.pragma('journal_mode = WAL');
    const library_Configs = ref(
        new Library_Configs({
          library: String(store_server_user_model.library_path)
        }))
    let system_Configs_Write = new System_Configs_Write()
    system_Configs_Write.system_library_config(
        db,
        library_Configs.value)
    save_system_config_of_App_Configs()
    db.close();db = null;
  }
  function save_system_config_of_Player_Configs_of_UI(){
    let db:any = null;
    db = require('better-sqlite3')(nsmusics_db);
    db.pragma('journal_mode = WAL');
    const player_Configs_of_UI = ref(
        new Player_Configs_of_UI({
          player_collapsed_album: String(store_player_appearance.player_UI_Theme_State.player_collapsed_album),
          player_collapsed_skin: String(store_player_appearance.player_UI_Theme_State.player_collapsed_skin),
          player_lyric_fontSize: String(store_player_appearance.player_UI_Theme_State.player_lyric_fontSize),
          player_lyric_fontWeight: String(store_player_appearance.player_UI_Theme_State.player_lyric_fontWeight),
          player_lyric_color: String(store_player_appearance.player_UI_Theme_State.player_lyric_color),
          player_theme_Styles_Selected: String(store_player_appearance.player_UI_Theme_State.player_theme_Styles_Selected),
          player_background_model_num: String(store_player_appearance.player_UI_Theme_State.player_background_model_num),
          player_use_lottie_animation: String(store_player_appearance.player_UI_Theme_State.player_use_lottie_animation),
        }))
    let system_Configs_Write = new System_Configs_Write()
    system_Configs_Write.system_player_config_of_ui(
        db,
        player_Configs_of_UI.value)
    save_system_config_of_App_Configs()
    db.close();db = null;
  }
  function save_system_config_of_Player_Configs_of_Audio_Info(){
    let db:any = null;
    db = require('better-sqlite3')(nsmusics_db);
    db.pragma('journal_mode = WAL');
    const player_Configs_of_Audio_Info = ref(
        new Player_Configs_of_Audio_Info({
          this_audio_file_path: String(store_player_audio_info.this_audio_file_path),
          this_audio_file_medium_image_url: String(store_player_audio_info.this_audio_file_medium_image_url),
          this_audio_file_lyric: String(store_player_audio_info.this_audio_lyrics_string),
          this_audio_singer_name: String(store_player_audio_info.this_audio_singer_name),
          this_audio_singer_id: String(store_player_audio_info.this_audio_singer_id),
          this_audio_song_name: String(store_player_audio_info.this_audio_song_name),
          this_audio_song_id: String(store_player_audio_info.this_audio_song_id),
          this_audio_song_rating: String(store_player_audio_info.this_audio_song_rating),
          this_audio_song_favorite: String(store_player_audio_info.this_audio_song_favorite),
          this_audio_album_name: String(store_player_audio_info.this_audio_album_name),
          this_audio_album_id: String(store_player_audio_info.this_audio_album_id),
          this_audio_Index_of_absolute_positioning_in_list: String(store_player_audio_info.this_audio_Index_of_absolute_positioning_in_list),

          page_top_album_image_url: String(store_player_audio_info.page_top_album_image_url),
          page_top_album_id: String(store_player_audio_info.page_top_album_id),
          page_top_album_name: String(store_player_audio_info.page_top_album_name),

          page_songlists_selected: String(store_view_media_page_logic.page_songlists_selected),

          player_mode_of_audio_path_from_playlist: String(store_player_appearance.player_mode_of_audio_path_from_playlist),
          player_mode_of_medialist_from_external_import: String(store_player_appearance.player_mode_of_medialist_from_external_import),
        }));
    let system_Configs_Write = new System_Configs_Write()
    system_Configs_Write.system_player_config_of_audio(
        db,
        player_Configs_of_Audio_Info.value)
    save_system_config_of_App_Configs()
    db.close();db = null;
  }
  function save_system_playlist_item_id_config(){
    let db:any = null;
    db = require('better-sqlite3')(nsmusics_db);
    db.pragma('journal_mode = WAL');
    let system_Configs_Write = new System_Configs_Write();
    system_Configs_Write.system_playlist_item_id_config(
      db,
      store_playlist_list_info.playlist_datas_CurrentPlayListMediaIds
    )
    save_system_config_of_App_Configs()
    db.close();db = null;
  }
  function save_system_config_of_View_Router_History(){
    let db:any = null;
    db = require('better-sqlite3')(nsmusics_db);
    db.pragma('journal_mode = WAL');
    let system_Configs_Write = new System_Configs_Write();
    system_Configs_Write.system_view_history(
        db,
        router_select_history_date_of_Media.value,
        [],
        undefined,
        // router_select_history_date_of_Album.value,
        [],
        undefined,
        // router_select_history_date_of_Artist.value,
        [],
    )
    save_system_config_of_App_Configs()
    db.close();db = null;
  }
  function save_system_config_of_Servers_Config(){
    let db:any = null;
    db = require('better-sqlite3')(nsmusics_db);
    db.pragma('journal_mode = WAL');
    let system_Configs_Write = new System_Configs_Write()
    system_Configs_Write.system_servers_config(
        db,
        store_server_users.server_config_of_all_user_of_sqlite)
    save_system_config_of_App_Configs()
    db.close();db = null;
  }
</script>
<template>
  <n-message-provider>
    <!-- App Bady View-->
    <n-config-provider class="this_App" :theme="store_app_setting_configs.theme">
      <n-global-style />
      <n-message-provider class="this_App">
        <n-layout has-sider class="this_App" embedded>
          <!--Left Router_Menu-->
          <n-layout-sider
            class="n_layout_sider"
            show-trigger="bar"
            collapse-mode="width"
            :collapsed-width="64"
            :width="160"
            :collapsed="store_app_setting_configs.app_left_menu_collapsed"
            @collapse="store_app_setting_configs.app_left_menu_collapsed = true"
            @expand="store_app_setting_configs.app_left_menu_collapsed = false">
            <n-menu
              v-if="!store_player_appearance.player_show"
              v-model:value="store_app_setting_configs.app_left_menu_select_activeKey"
              :collapsed="store_app_setting_configs.app_left_menu_collapsed"
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="store_app_setting_configs.menuOptions_appBar"/>
          </n-layout-sider>
          <!--Right Router_View-->
          <n-layout embedded style="height: calc(100vh - 150px);margin-top: 70px;">
            <!--Menu View -->
            <RouterView
              class="view_show_data"
              v-if="router_select_model_menu"
              @router_select="get_router_select"
              @server_config_of_current_user_of_sqlite="get_server_config_of_current_user_of_sqlite"
              @update_theme="get_update_theme">

            </RouterView>
            <!--Home View -->
            <RouterView
              class="view_show_data"
              v-else-if="router_select_model_home"
              @router_select="get_router_select"
              @media_list_of_album_id="get_media_list_of_album_id_by_album_info"
              @play_this_album_song_list="fetchData_This_Album_SongList"
            >

            </RouterView>
            <!--Updateing View-->
            <RouterView
              class="view_show_data"
              v-else-if="router_select_model_updateing"
              @router_select="get_router_select"
            >
            </RouterView>
            <!--Media View-->
            <RouterView
              class="view_show_table"
              v-else-if="router_select_model_media"
              @router_select="get_router_select"

              @router_history_model="get_router_history_model_of_Media"
              :router_select_history_date="router_select_history_date_of_Media"
              :router_history_datas="router_history_datas_of_Media"
              :router_history_model_of_Media_scroller_value="router_history_model_of_Media_scroller_value"
              @router_history_model_of_Media_scroller_value="get_router_history_model_of_Media_scroller_value"
              :router_history_model_of_Media_scroll="router_history_model_of_Media_scroll"
              @router_history_model_of_Media_scroll="get_router_history_model_of_Media_scroll"

              :page_songlists_options_Sort_key="page_songlists_options_Sort_key"
              @page_songlists_options_Sort_key="get_page_songlists_options_Sort_key"

              @page_songlists_reset_data="page_songlists_get_reset_data"
            >

            </RouterView>
            <!--Album View-->
            <RouterView
              class="view_show_table"
              v-else-if="router_select_model_album"
              @router_select="get_router_select"

              @router_history_model="get_router_history_model_of_Album"
              :router_select_history_date="router_select_history_date_of_Album"
              :router_history_datas="router_history_datas_of_Album"
              :router_history_model_of_Album_scroller_value="router_history_model_of_Album_scroller_value"
              @router_history_model_of_Album_scroller_value="get_router_history_model_of_Album_scroller_value"
              :router_history_model_of_Album_scroll="router_history_model_of_Album_scroll"
              @router_history_model_of_Album_scroll="get_router_history_model_of_Album_scroll"

              :album_Files_temporary="album_Files_temporary"
              :page_albumlists_options_Sort_key="page_albumlists_options_Sort_key"
              @page_albumlists_options_Sort_key="get_page_albumlists_options_Sort_key"
              :page_albumlists_keyword="page_albumlists_keyword"
              @page_albumlists_keyword="page_albumlists_get_keyword"
              @page_albumlists_reset_data="page_albumlists_get_reset_data"
              :page_albumlists_options="page_albumlists_options"
              :page_albumlists_statistic="page_albumlists_statistic"
              :page_albumlists="page_albumlists"
              :page_albumlists_selected="page_albumlists_selected"
              @page_albumlists_selected="get_page_albumlists_selected"

              @media_list_of_album_id="get_media_list_of_album_id_by_album_info"
              @media_list_of_artist_id="get_album_list_of_artist_id_by_album_info"
              @play_this_album_song_list="fetchData_This_Album_SongList"
            >

            </RouterView>
            <!--Artist View-->
            <RouterView
              class="view_show_table"
              v-else-if="router_select_model_artist"
              @router_select="get_router_select"

              @router_history_model="get_router_history_model_of_Artist"
              :router_select_history_date="router_select_history_date_of_Artist"
              :router_history_datas="router_history_datas_of_Artist"
              :router_history_model_of_Artist_scroller_value="router_history_model_of_Artist_scroller_value"
              @router_history_model_of_Artist_scroller_value="get_router_history_model_of_Artist_scroller_value"
              :router_history_model_of_Artist_scroll="router_history_model_of_Artist_scroll"
              @router_history_model_of_Artist_scroll="get_router_history_model_of_Artist_scroll"

              :artist_Files_temporary="artist_Files_temporary"
              :page_artistlists_options_Sort_key="page_artistlists_options_Sort_key"
              @page_artistlists_options_Sort_key="get_page_artistlists_options_Sort_key"
              :page_artistlists_keyword="page_artistlists_keyword"
              @page_artistlists_keyword="page_artistlists_get_keyword"
              @page_artistlists_reset_data="page_artistlists_get_reset_data"
              :page_artistlists_options="page_artistlists_options"
              :page_artistlists_statistic="page_artistlists_statistic"
              :page_artistlists="page_artistlists"
              :page_artistlists_selected="page_artistlists_selected"
              @page_artistlists_selected="get_page_artistlists_selected"

              @album_list_of_artist_id_artist="get_album_list_of_artist_id_by_artist_info"
              @play_this_artist_song_list="fetchData_This_Artist_SongList"
            >

            </RouterView>
            <!--Top Bar-->
            <div class="bar_top_setapp" style="background-color: transparent">
              <section
                style="
                  -webkit-app-region: no-drag;
                  width: auto;
                  position: absolute;right: 0;top:30px;
                  text-align:center;
                  z-index: 99;
                ">
                <n-button quaternary circle style="margin-right:4px;" @click="ipcRenderer.send('window-reset-data');">
                  <template #icon>
                    <n-icon size="20" :depth="2"><clean/></n-icon>
                  </template>
                  <!--<span style="font-weight: 500;">{{ $t('setting.clearQueryCache') }}</span>-->
                </n-button>
                <n-button quaternary circle size="medium" style="margin-right:4px" @click="theme_mode_change_click">
                  <template #icon>
                    <n-icon size="20" :depth="2"><DarkTheme24Filled/></n-icon>
                  </template>
                </n-button>
                <n-button quaternary circle size="medium" style="margin-right:4px;" @click="maximize_screen">
                  <template #icon>
                    <n-icon size="20" :depth="2" style="margin-top: 1px;"><FullScreenMaximize16Regular/></n-icon>
                  </template>
                </n-button>
                <n-button quaternary circle size="medium" style="margin-right:4px" @click="minimize">
                  <template #icon>
                    <n-icon size="18" :depth="2"><ArrowMinimize16Regular/></n-icon>
                  </template>
                </n-button>
                <n-button quaternary circle size="medium" style="margin-right:4px" @click="maximize">
                  <template #icon>
                    <n-icon size="24" :depth="2"><Maximize16Regular/></n-icon>
                  </template>
                </n-button>
                <n-button quaternary circle size="medium" style="margin-right:30px" @click="closeWindow">
                  <template #icon>
                    <n-icon size="28" :depth="2"><Close/></n-icon>
                  </template>
                </n-button>
              </section>
            </div>
          </n-layout>
        </n-layout>
      </n-message-provider>
    </n-config-provider>
    <!-- bottom PlayerBar and PlayerView -->
    <n-config-provider :theme="store_app_setting_configs.theme_app">
      <!-- n-card can change Bar_Music_Player(text color) -->
      <n-card
        style="
          position: fixed;left: 0;bottom: 0;
          width: 100vw;height: 80px;
          background-color: #00000000;
          z-index: 100;
          border-radius: 12px 12px 0 0;border: 0 #00000000">
        <Bar_Music_Player
          @player_show_height="get_playerbar_to_Switch_playerview"/>
      </n-card>
      <View_Screen_Music_Player
        class="view_music_player"
        v-if="store_player_appearance.player_show"
        :style="{ height: `calc(100vh - ${store_player_appearance.player_show_hight_animation_value}vh)` }">

      </View_Screen_Music_Player>
    </n-config-provider>
    <!-- right drwaer of music_playlist -->
    <n-config-provider :theme="darkTheme">
      <n-drawer
        v-model:show="store_playlist_appearance.playlist_show"
        :width="440"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #FFFFFF20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: 88px;margin-bottom:88px;
        ">
        <n-drawer-content v-if="store_playlist_appearance.playlist_show">
          <template #default>
            <Bar_Music_PlayList
              v-if="store_playlist_appearance.playlist_show"
              >
            </Bar_Music_PlayList>
          </template>
        </n-drawer-content>
      </n-drawer>
    </n-config-provider>
    <!-- bottom drwaer of player_bar(more,sound speed,sound effect) -->
    <n-config-provider :theme="darkTheme">
      <n-drawer
        v-model:show="store_player_sound_more.player_show_sound_more"
        :width="440"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #FFFFFF20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: calc(50vh - 280px);height: 560px;
        ">
        <n-drawer-content v-if="store_player_sound_more.player_show_sound_more">
          <template #default>
            更多设置：开发中
          </template>
        </n-drawer-content>
      </n-drawer>
      <n-drawer
        v-model:show="store_player_sound_speed.player_show_sound_speed"
        :width="440"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #FFFFFF20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: calc(50vh - 280px);height: 560px;
        ">
        <n-drawer-content v-if="store_player_sound_speed.player_show_sound_speed">
          <template #default>
            播放设置：开发中
          </template>
        </n-drawer-content>
      </n-drawer>
      <n-drawer
        v-model:show="store_player_sound_effects.player_show_sound_effects"
        :width="440"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #FFFFFF20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: calc(50vh - 280px);height: 560px;
        ">
        <n-drawer-content v-if="store_player_sound_effects.player_show_sound_effects">
          <template #default>
            <n-tabs type="line" animated>
              <n-tab-pane name="001" tab="九歌音效">
                九歌音效
              </n-tab-pane>
              <n-tab-pane name="004" tab="多音轨">
                多音轨
              </n-tab-pane>
              <n-tab-pane name="002" tab="均衡器(简易)">
                均衡器(简易)
              </n-tab-pane>
              <n-tab-pane name="003" tab="均衡器(专业)">
                均衡器(专业)
              </n-tab-pane>
            </n-tabs>
          </template>
        </n-drawer-content>
      </n-drawer>
    </n-config-provider>
  </n-message-provider>
</template>
<style scoped>
.this_App {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}
.n_layout_sider {
  padding-top: 64px;
  border: 0;
}
.view_show_table {
  width: calc(100vw - 100px);
  height: calc(100vh - 200px);

  margin-left: 30px;
}
.view_show_data {
  width: calc(100vw - 100px);
  height: calc(100vh - 150px);

  margin-left: 30px;
}
.view_music_player{
  width: 100vw;
  z-index: 10;
  position: fixed;bottom: 0;left: 0;
  transition: height 0.2s;
}
.bar_top_setapp{
  width: 100vw;
  height: 60px;
  margin-left: 7px;

  z-index: 1;

  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);

  -webkit-app-region: drag;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  background-color: #00000000;
}
nav {
  text-align: center;
  margin-left: -1rem;
  font-size: 1rem;

  padding: 1rem 0;
  margin-top: 1rem;
}
::-webkit-scrollbar {
  display: none;
}
</style>