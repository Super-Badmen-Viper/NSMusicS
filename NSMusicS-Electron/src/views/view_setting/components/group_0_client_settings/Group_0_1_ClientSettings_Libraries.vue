<script setup lang="ts">
////// this_view resource of vicons_svg
import {
  TagMultiple24Regular,
  Delete20Regular, Settings20Regular
} from '@vicons/fluent'
import {
  BareMetalServer, Add, Close, UserAvatarFilledAlt, MediaCast
} from '@vicons/carbon'

////// i18n auto lang
import {
  DocumentHeart20Regular,
  Home28Regular, PeopleCommunity16Regular,
  SlideMicrophone32Regular
} from "@vicons/fluent";
import {AlbumFilled, MusicNoteRound} from "@vicons/material";
import {RouterLink} from "vue-router";
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true
})
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";
let unwatch_menuOptions_selectd_model_1 = watch(() => store_app_configs_info.menuOptions_selectd_model_1, () => {
  store_app_configs_logic_save.save_system_config_of_App_Configs()
  create_menuOptions_appBar()
});
let unwatch_menuOptions_selectd_model_2 = watch(() => store_app_configs_info.menuOptions_selectd_model_2, () => {
  store_app_configs_logic_save.save_system_config_of_App_Configs()
  create_menuOptions_appBar()
});
let unwatch_menuOptions_selectd_model_3 = watch(() => store_app_configs_info.menuOptions_selectd_model_3, () => {
  store_app_configs_logic_save.save_system_config_of_App_Configs()
  create_menuOptions_appBar()
});
let unwatch_menuOptions_selectd_model_4 = watch(() => store_app_configs_info.menuOptions_selectd_model_4, () => {
  store_app_configs_logic_save.save_system_config_of_App_Configs()
  create_menuOptions_appBar()
});
function renderIcon (icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
function renderRouterLink (nameValue: any, defaultValue: any){
  return () => h(RouterLink, {to: { name: nameValue }}, { default: () => defaultValue })
}
function create_menuOptions_appBar(){

}
onBeforeUnmount(() => {
  unwatch_menuOptions_selectd_model_1()
  unwatch_menuOptions_selectd_model_2()
  unwatch_menuOptions_selectd_model_3()
  unwatch_menuOptions_selectd_model_4()
  unwatch_server_set_of_addUser_of_type()
})

////// this_view views_components
import { store_app_configs_info } from '@/data/data_stores/app/store_app_configs_info'
import { store_server_users } from '@/data/data_stores/server/store_server_users'
import {ref, onMounted, watch, onBeforeUnmount, computed, h} from 'vue';
import {NButton, NIcon} from 'naive-ui'
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {store_player_audio_logic} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_audio_logic";
import {store_local_db_info} from "@/data/data_stores/local/store_local_db_info";
import {store_router_data_logic} from "@/router/router_store/store_router_data_logic";
import {store_server_data_select_logic} from "@/data/data_stores/server/server_data_select/store_server_data_select_logic";
import {
  Users_ApiService_of_Je
} from "@/data/data_access/servers_configs/jellyfin_api/services_web/Users/index_service";
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
import {ipcRenderer, isElectron} from '@/utils/electron/isElectron';
const message = useMessage()
////// server
const Type_Server_Kinds = [
  {
    value: "ninesong",
    label: "NineSong"
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
    value: "jellyfin",
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
const server_set_of_addUser_of_type = ref(Type_Server_Kinds[2].value)
let unwatch_server_set_of_addUser_of_type = watch(() => server_set_of_addUser_of_type.value, (newValue) => {
  // store_server_user_model.server_login_model_of_apikey = newValue === 'jellyfin' || newValue === 'emby';
  // 不再启用apikey登录模式
  // 因为TM Jellyfin和Emby 都有apikey权限无法执行：Jellyfin播放列表项删除/Emby播放列表删除的问题
  store_server_user_model.server_login_model_of_apikey = false;
});
// normal login
const server_set_of_addUser_of_servername = ref('')
const server_set_of_addUser_of_url = ref('')
const server_set_of_addUser_of_username = ref('')
const server_set_of_addUser_of_password = ref('')
// apikey login
const server_set_of_addUser_of_apikey = ref('')
const server_set_of_addUser_of_apikey_user_option = ref([])
const server_set_of_addUser_of_apikey_load_complete = ref(false)
async function update_server_apikey_user_option(data: any) {
  if(store_server_user_model.server_login_model_of_apikey) {
    store_server_user_model.authorization_of_Je =
        data.apikey.length > 0
            ? data.apikey : server_set_of_addUser_of_apikey.value
    // load User
    const userService = new Users_ApiService_of_Je(
        data.url.length > 0
            ? data.url : server_set_of_addUser_of_url.value
    )
    const result = await userService.getUsers_ALL()
    server_set_of_addUser_of_apikey_user_option.value = []
    store_server_user_model.userid_of_Je = ''
    server_set_of_addUser_of_apikey_load_complete.value = false
    if (result) {
      if (Array.isArray(result) && result.length > 0) {
        result.forEach((row: any) => {
          server_set_of_addUser_of_apikey_user_option.value.push({
            label: row.Name,
            value: row.Id
          });
        });
        if (data.init === true || data.init === 'true') {
          store_server_user_model.userid_of_Je =
              server_set_of_addUser_of_apikey_user_option.value[0].value
        } else {
          store_server_user_model.userid_of_Je = data.userid
        }
        // load Library parentid_of_Je
        const library_ApiService_of_Je = new Library_ApiService_of_Je(server_set_of_addUser_of_url.value)
        const result_parentIds = await library_ApiService_of_Je.getLibrary_MediaFolders_ALL()
        store_server_user_model.parentid_of_Je = []
        if (result_parentIds.Items) {
          if (Array.isArray(result_parentIds.Items) && result_parentIds.Items.length > 0) {
            result_parentIds.Items.forEach((row: any) => {
              store_server_user_model.parentid_of_Je.push({
                label: row.Name,
                value: row.Id
              });
              if (row.CollectionType === 'music') {
                store_server_user_model.parentid_of_Je_Music = row.Id
              }
            });
          }
        }
        // complete
        server_set_of_addUser_of_apikey_load_complete.value = true
      }
    }
  }
  else{

  }
}
/// server add
async function update_server_addUser() {
  try {
    server_set_of_addUser_of_url.value = server_set_of_addUser_of_url.value.replace(/\/$/, '');
    const params = {
      servername: server_set_of_addUser_of_servername.value,
      url: server_set_of_addUser_of_url.value,
      type: server_set_of_addUser_of_type.value,
      username: server_set_of_addUser_of_username.value,
      password: server_set_of_addUser_of_password.value,
      apikey: server_set_of_addUser_of_apikey.value,
      userid: store_server_user_model.userid_of_Je,
    };
    let result = null;
    if (store_server_user_model.server_login_model_of_apikey) {
      if (
          (server_set_of_addUser_of_type.value === 'jellyfin' || server_set_of_addUser_of_type.value === 'emby') &&
          params.apikey?.length > 0 &&
          params.userid?.length > 0 &&
          server_set_of_addUser_of_apikey_load_complete.value
      ) {
        result = await store_server_data_select_logic.update_server_addUser(
            params.servername,
            params.url,
            params.apikey,
            params.userid,
            params.type
        );
      }
    } else {
      result = await store_server_data_select_logic.update_server_addUser(
          params.servername,
          params.url,
          params.username,
          params.password,
          params.type
      );
    }
    if (result) {
      message.success(t('form.addServer.success'));
    } else {
      message.error(t('error.invalidServer'), { duration: 3000 });
    }
  } catch (e) {
    message.error(t('error.invalidServer'), { duration: 3000 });
  } finally {
    Type_Server_Add.value = !Type_Server_Add.value;
  }
}
/// server delete
async function update_server_deleteUser(id: string, type: string) {
  try {
    const result = await store_server_data_select_logic.update_server_deleteUser(
        id,
        type
    )
    if (result) {
      message.success(t('form.updateServer.success'))
    } else {
      message.error(t('error.invalidServer'), {duration: 3000})
    }
  }catch{
    message.error(t('error.invalidServer'),{ duration: 3000 })
  }
}
/// server update
async function update_server_setUser(
    id:string, server_name:string, url:string,
    user_name:string, password:string,
    type: string
) {
  try {
    let result = null;
    if(store_server_user_model.server_login_model_of_apikey) {
      if (server_set_of_addUser_of_type.value === 'jellyfin' || server_set_of_addUser_of_type.value === 'emby') {
        if (server_set_of_addUser_of_apikey_load_complete.value) {
          result = await store_server_data_select_logic.update_server_setUser(
              id,
              server_name, url,
              user_name, password,
              type
          )
        }
      }
    }else{
      result = await store_server_data_select_logic.update_server_setUser(
          id,
          server_name, url,
          user_name, password,
          type
      )
    }
    if(result){
      message.success(t('form.updateServer.success'))
    }else{
      message.error(t('error.invalidServer'),{ duration: 3000 })
    }
    if(store_server_user_model.parentid_of_Je_Music === undefined){
      message.error(t('error.invalidServer') + t('TabMusic'),{ duration: 6000 })
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
          store_server_users.server_select_kind = 'navidrome'
        }else if(user_config?.type === 'jellyfin'){
          store_server_users.server_select_kind = 'jellyfin'
        }else if(user_config?.type === 'emby'){
          store_server_users.server_select_kind = 'emby'
        }else if(user_config?.type === 'ninesong'){
          store_server_users.server_select_kind = 'ninesong'
        }
        store_app_configs_logic_save.save_system_config_of_App_Configs()
      } else {
        message.error(t('error.invalidServer'), {duration: 3000})
      }
      if(store_server_user_model.parentid_of_Je_Music === undefined){
        message.error(t('error.invalidServer') + t('TabMusic'),{ duration: 6000 })
      }
    } catch (e) {
      message.error(t('error.invalidServer'), {duration: 3000})
    }
  }
  store_server_users.percentage_of_nd = 0
  // Close navidrome random model
  store_server_user_model.random_play_model = false
  // Refresh Playlist(Local / Server)
  store_playlist_list_info.playlist_MediaFiles_temporary = [];
  await store_player_audio_logic.player.pause();
  store_player_audio_info.reset_data()
  // Refresh play_order(Local / Server)
  store_player_audio_logic.play_order = 'playback-2'
  // Refresh page_songlists_options_Sort_key
  if(store_server_user_model.model_server_type_of_web){
    store_view_media_page_logic.list_options_Hand_Sort = true
    if (store_server_users.server_select_kind === 'ninesong') {
      store_view_media_page_logic.page_songlists_options_Sort_key = [{
        columnKey: String('_id'),
        order: state_Sort.Ascend
      }];
    }else if (store_server_users.server_select_kind === 'navidrome') {
      store_view_media_page_logic.page_songlists_options_Sort_key = [{
        columnKey: String('id'),
        order: state_Sort.Ascend
      }];
    }else {
      store_view_media_page_logic.page_songlists_options_Sort_key = [{
        columnKey: String('SortName'),
        order: state_Sort.Ascend
      }];
    }
  }
}
enum state_Sort {
  Ascend = 'ascend',
  Descend = 'descend',
  Default = 'default'
}

////// local
async function select_Folder() {
  try {
    if(isElectron) {
      const folderPath = await ipcRenderer.invoke('library-select-folder');
      if (folderPath) {
        const folderName = folderPath.split('\\').pop(); // 提取文件夹名
        const rootPath = folderPath; // 根目录路径
        const isConfigExists = store_local_db_info.local_config_of_all_user_of_sqlite.some(
            config => config.config_value === rootPath
        );
        if (!isConfigExists && folderName) {
          const index = store_local_db_info.local_config_of_all_user_of_sqlite.length;
          store_local_db_info.local_config_of_all_user_of_sqlite.push({
            id: index + 1, // 使用索引作为 ID
            config_key: folderName, // 使用提取的文件夹名作为 config_key
            config_value: rootPath, // 根目录路径作为 config_value
          });
          store_local_db_info.local_config_of_all_user_of_select.push({
            label: `${folderName} - ${rootPath}`, // 标签格式：文件夹名 - 根目录路径
            value: rootPath, // 值：根目录路径
          });
          store_app_configs_logic_save.save_system_library_config()
        } else {
          console.error('文件夹名为空或配置已存在，无法添加');
        }
      }
    } else {
      // other
    }
  } catch (error) {
    console.error('Error selecting folder:', error);
    store_server_users.percentage_of_local = 0;
  }
}
async function begin_import_Folder(cover: boolean) {
  try {
    if(isElectron) {
      if (store_local_db_info.local_config_of_all_user_of_sqlite) {
        console.log('Before invoking node-taglib-sharp-get-directory-filePath');
        store_server_users.percentage_of_local = 10;
        const totalTasks = store_local_db_info.local_config_of_all_user_of_sqlite.length;
        const progressIncrement = (100 - store_server_users.percentage_of_local) / totalTasks;
        for (const config of store_local_db_info.local_config_of_all_user_of_sqlite) {
          const folderPath = config.config_value;
          const file_name_model = true;
          try {
            console.log(`Processing folder path: ${folderPath}`);
            const success = await ipcRenderer.invoke('node-taglib-sharp-get-directory-filePath', {
              folderPath,
              cover,
              file_name_model,
            });
            console.log('node-taglib-sharp-get-directory-filePath succeeded:', success);
            store_server_users.percentage_of_local += progressIncrement;
            console.log(`Current progress: ${store_server_users.percentage_of_local}%`);
          } catch (error) {
            console.error('node-taglib-sharp-get-directory-filePath failed:', error);
            store_local_db_info.result_local = false;
            store_server_users.percentage_of_local += progressIncrement;
            console.log(`Current progress: ${store_server_users.percentage_of_local}%`);
          }
        }
        store_server_users.percentage_of_local = 100;
        console.log('All tasks completed. Final progress: 100%');
        console.log('All folder paths processed');
        // reset data
        await store_server_user_model.switchToMode_Local();
        store_server_user_model.model_select = 'local';
        store_app_configs_logic_save.save_system_config_of_App_Configs();
        //
        await ipcRenderer.send('window-reset-all')
      }
    } else {
      // other
    }
  } catch (error) {
    console.error('Error selecting folder:', error);
    store_server_users.percentage_of_local = 0;
  }
}
/// server delete
async function update_local_deleteFolder(id: string) {
  try {
    const result = await store_local_data_select_logic.update_local_deleteFolder(id);
    if (result) {
      message.success(t('form.editPlaylist.success'));
      const deletedConfig = store_local_db_info.local_config_of_all_user_of_sqlite.find(
          (config) => config.id === id
      );
      if (deletedConfig) {
        store_local_db_info.local_config_of_all_user_of_sqlite =
            store_local_db_info.local_config_of_all_user_of_sqlite.filter(
                (config) => config.id !== id
            );
        store_local_db_info.local_config_of_all_user_of_select =
            store_local_db_info.local_config_of_all_user_of_select.filter(
                (item) => item.value !== deletedConfig.config_value
            );
      }
    } else {
      message.error(t('LibraryInvalidItemIdError'), { duration: 3000 });
    }
  } catch {
    message.error(t('LibraryInvalidItemIdError'), { duration: 3000 });
  }
}
/// server update
async function update_local_setFolder(id: string, local_name: string, local_url: string) {
  try {
    const result = await store_local_data_select_logic.update_local_setFolder(
        id,
        local_name,
        local_url
    );
    if (result) {
      message.success(t('form.editPlaylist.success'));
      const sqliteIndex = store_local_db_info.local_config_of_all_user_of_sqlite.findIndex(
          (config) => config.id === id
      );
      if (sqliteIndex !== -1) {
        store_local_db_info.local_config_of_all_user_of_sqlite[sqliteIndex] = {
          ...store_local_db_info.local_config_of_all_user_of_sqlite[sqliteIndex],
          config_key: local_name,
          config_value: local_url,
        };
      }
      const selectIndex = store_local_db_info.local_config_of_all_user_of_select.findIndex(
          (item) => item.value === local_url
      );
      if (selectIndex !== -1) {
        store_local_db_info.local_config_of_all_user_of_select[selectIndex] = {
          ...store_local_db_info.local_config_of_all_user_of_select[selectIndex],
          label: `${local_name} - ${local_url}`,
          value: local_url,
        };
      }
    } else {
      message.error(t('LibraryInvalidItemIdError'), { duration: 3000 });
    }
  } catch {
    message.error(t('LibraryInvalidItemIdError'), { duration: 3000 });
  }
}

//////
import type { StepsProps } from 'naive-ui'
const currentStatus = ref<StepsProps['status']>('process')
/// server model
const model_server_step_1 = computed(() => t('nsmusics.view_page.modelSelect'));
const model_server_step_2 = computed(() => t('page.appMenu.manageServers'));
const model_server_step_3 = computed(() => t('nsmusics.view_page.modelServer'));
const model_server_step_4 = computed(() => t('page.appMenu.selectServer'));
/// local model
const model_local_step_1 = computed(() => t('Add') + t('HeaderMediaFolders'));
const model_local_step_2 = computed(() => t('nsmusics.view_page.selectLibrary'));

//////
import {store_local_data_select_logic} from "@/data/data_stores/local/local_data_select/store_local_data_select_logic";
import {
  Library_ApiService_of_Je
} from "@/data/data_access/servers_configs/jellyfin_api/services_web/Library/index_service";
import {
  store_playlist_list_info
} from "@/views/view_app/page_metadata/page_folder/page_music/music_components/player_list/store/store_playlist_list_info";
import {store_player_audio_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_audio_info";
import {
  store_view_media_page_logic
} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_media/store/store_view_media_page_logic";
</script>

<template>
  <n-space
      style="overflow-y: auto;overflow-x:hidden;margin-top: 9px;">
    <!-- 媒体库管理 -->
    <n-space vertical>
      <div style="font-weight: 600;font-size: 16px;margin-bottom: 4px;">
        {{ $t('HeaderLibraries') }} >
      </div>
      <n-space vertical>
        <n-steps vertical
                 style="margin-left: 2px;margin-top: 2px;"
                 :status="currentStatus">
          <n-step v-if="isElectron"
                  :title="model_server_step_1">
            <div class="n-step-description" style="font-size:16px;font-weight: 600;">
              {{ $t('nsmusics.view_page.modelSelect_explain') }}<br>
              <n-select
                  v-model:value="Type_Server_Model_Open_Value"
                  :options="Type_Server_Model_Open_Option"
                  :disabled="store_app_configs_info.desktop_system_kind != 'win32'"
                  @update:value="
                    async () => {
                      Type_Server_Model_Open_Value === 'server' ?
                      await store_server_user_model.switchToMode_Server()
                      :
                      await store_server_user_model.switchToMode_Local()
                    }
                  "
                  placeholder=""
                  :reset-menu-on-options-change="false"
                  style="width: 207px;margin-top: 6px;"
              />
            </div>
          </n-step>
          <!-- server model -->
          <n-step :title="model_server_step_2"
                  v-if="Type_Server_Model_Open_Value === 'server'">
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
                                 style="overflow: auto;width: 580px;height: 130px;margin-top: 6px;"
                                 :items="store_server_users.server_config_of_all_user_of_sqlite"
                                 :itemSize="70"
                                 :grid-items="2"
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
                          @click="() => {
                            let show = false
                            if(item.type !== 'ninesong'){
                              show = true
                            }else if(store_app_configs_info.desktop_system_kind !== 'docker'){
                              show = true
                            }
                            if(show){
                              item.show = !item.show;
                              // if(item.type === 'jellyfin' || item.type === 'emby'){
                              //   store_server_user_model.server_login_model_of_apikey = true
                              //   server_set_of_addUser_of_apikey = item.user_name
                              //   update_server_apikey_user_option({
                              //     servername: item.server_name,
                              //     url: item.url,
                              //     apikey: item.user_name,
                              //     userid: item.password,
                              //     init: false
                              //   });
                              // }else{
                              //   store_server_user_model.server_login_model_of_apikey = false
                              // }
                              store_server_user_model.server_login_model_of_apikey = false
                            }
                          }"
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
                          <n-card style="width: 450px;border-radius: 4px;">
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
                              </n-form>
                              <n-form v-if="store_server_user_model.server_login_model_of_apikey" style="margin-top: -12px;">
                                <n-space vertical style="margin-bottom: 10px;">
                                  <span>{{ $t('HeaderApiKey') }}</span>
                                  <n-input clearable placeholder="" v-model:value="item.user_name"/>
                                  <n-button
                                      strong secondary type="info"
                                      @click="update_server_apikey_user_option({
                                                    servername: item.server_name,
                                                    url: item.url,
                                                    apikey: item.user_name,
                                                    userid: item.password,
                                                    init: true
                                                  })">
                                    {{ $t('ButtonOk') }}
                                  </n-button>
                                </n-space>
                                <n-space vertical style="margin-bottom: 10px;">
                                  <span>{{ $t('LabelSelectUsers') }}</span>
                                  <n-select
                                      v-model:value="store_server_user_model.userid_of_Je"
                                      :options="server_set_of_addUser_of_apikey_user_option"
                                      style="width: 220px;margin-top: 6px;"
                                  />
                                </n-space>
                              </n-form>
                              <n-form v-else style="margin-top: -12px;">
                                <n-space vertical size="small" style="margin-bottom: 10px;">
                                  <span v-if="item.type != 'ninesong'">{{ $t('form.addServer.input_username') }}</span>
                                  <span v-else>{{ $t('nsmusics.server_page.server_email') }}</span>
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
                                <n-button
                                    strong secondary type="info"
                                    @click="()=>{
                                      if(item.type === 'navidrome'){
                                        server_set_of_addUser_of_type = 'navidrome'
                                      }else if (item.type === 'jellyfin'){
                                        server_set_of_addUser_of_type = 'jellyfin'
                                        if(store_server_user_model.server_login_model_of_apikey) {
                                          item.password = store_server_user_model.userid_of_Je
                                        }
                                      }else if (item.type === 'emby'){
                                        server_set_of_addUser_of_type = 'emby'
                                        if(store_server_user_model.server_login_model_of_apikey) {
                                          item.password = store_server_user_model.userid_of_Je
                                        }
                                      }else if (item.type === 'ninesong'){
                                        server_set_of_addUser_of_type = 'ninesong'
                                      }
                                      update_server_setUser(
                                          item.id,
                                          item.server_name,item.url,
                                          item.user_name,item.password,
                                          item.type
                                      )
                                    }">
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
          <n-step :title="model_server_step_3"
                  v-if="isElectron && Type_Server_Model_Open_Value === 'server'">
            <div class="n-step-description">
              <n-space vertical>
                <n-space vertical>
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_page.modelServer_type_1') + ' - ' + $t('Suggestions')+ $t('ButtonActivate') }}</span>
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
                <n-space vertical>
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">{{ $t('nsmusics.view_page.modelServer_type_2') + ' - ' + $t('Experimental') + ' - ' + $t('DisablePlugin')}}</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">{{ $t('nsmusics.view_page.modelServer_type_2_explain') }}</span>
                    </div>
                  </n-space>
                  <n-switch
                    disabled
                    v-model:value="store_server_user_model.model_server_type_of_local"
                    @update:value="() => {
                      store_server_user_model.model_server_type_of_local_server_download = true
                    }"
                  >
                  </n-switch>
                </n-space>
                <n-space vertical
                         v-if="store_server_user_model.model_server_type_of_local"
                >
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
          <n-step :title="model_server_step_4"
                  v-if="Type_Server_Model_Open_Value === 'server'">
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
          <n-step :title="model_local_step_1"
                  v-if="Type_Server_Model_Open_Value != 'server'">
            <div class="n-step-description">
              <n-space vertical>
                <n-space justify="space-between" align="center">
                  <n-space vertical style="width: 520px;">
                    <div style="margin-top: -2px;">
                      <span style="font-size:16px;font-weight: 600;">
                        .mp3, .flac, .aac, .mp1, .mp2, .m4a, .ape, .oga, .ogg, .opus, .wav, .webm
                      </span>
                    </div>
                    <n-button tertiary style="height: 36px;"
                              @click="() => {
                                            select_Folder()
                                          }">
                      <template #icon>
                        <n-icon size="24">
                          <Add />
                        </n-icon>
                      </template>
                      <div style="font-size:16px;font-weight: 600;">
                        {{ $t('Add') + $t('entity.folder_other')}}
                      </div>
                    </n-button>
                    <DynamicScroller v-if="Type_Server_Model_Open_Value === 'local'"
                                     class="table" ref="scrollbar"
                                     style="overflow: auto;width: 580px;height: 130px;margin-top: 6px;"
                                     :items="store_local_db_info.local_config_of_all_user_of_sqlite"
                                     :itemSize="70"
                                     :grid-items="2"
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
                                  {{ item.config_value }}</div>
                              </n-space>
                              <span style="width: 18px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ (index+1) }}</span>
                            </n-space>
                            <n-modal
                                v-model:show="item.show">
                              <n-card style="width: 450px;border-radius: 4px;">
                                <n-space
                                    vertical size="large" style="width: 400px;">
                                  <n-space justify="space-between" style="margin-bottom: 12px;">
                                    <span style="font-size: 20px;font-weight: 600;">{{ $t('HeaderAdmin') + $t('Folders') }}</span>
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
                                      <span>{{ $t('Folders') + $t('LabelName') }}</span>
                                      <n-input clearable size="small" v-model:value="item.config_key" placeholder=""/>
                                    </n-space>
                                    <n-space vertical size="small" style="margin-bottom: 10px;">
                                      <span>{{ $t('Folders') + $t('HeaderPaths') }}</span>
                                      <n-input-group>
                                        <n-input clearable size="small" v-model:value="item.config_value" placeholder=""/>
                                      </n-input-group>
                                    </n-space>
                                  </n-form>
                                  <n-space justify="end">
                                    <n-button strong secondary type="error"
                                              @click="() => {
                                                            item.show = false;
                                                            update_local_deleteFolder(item.id);
                                                          }">
                                      {{ $t('common.delete') }}
                                    </n-button>
                                    <n-button strong secondary type="info"
                                              @click="update_local_setFolder(
                                                              item.id,
                                                              item.config_key,item.config_value,
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
                </n-space>
              </n-space>
            </div>
          </n-step>
          <n-step :title="model_local_step_2"
                  v-if="Type_Server_Model_Open_Value != 'server'">
            <div class="n-step-description">
              <n-space vertical>
                <n-space vertical>
                  <div style="font-size:15px;font-weight: 600;">
                    {{
                      $t('common.clear')
                      + ' '
                      + $t('nsmusics.view_page.modelLocal')
                      + ', '
                      + $t('DeleteAll')
                      + ' '
                      + $t('HeaderLibraries')
                      + $t('Data')
                    }}
                  </div>
                  <n-button size="small"
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
                </n-space>
                <div style="font-size:15px;font-weight: 600;">
                  {{ $t('setting.clearCache_description')}}
                </div>
                <n-button size="small"
                          @click="async () => {
                                        if(isElectron) {
                                          message.success(t('ButtonStart') + t('setting.clearQueryCache'))
                                          await ipcRenderer.invoke('node-taglib-sharp-clear')
                                        }
                                      }">
                  <template #icon>
                    <n-icon size="16">
                      <Delete20Regular />
                    </n-icon>
                  </template>
                  <div style="font-size:15px;font-weight: 600;">
                    {{ $t('common.clear') + ' ' + $t('LabelCache')}}
                  </div>
                </n-button>
                <n-divider style="margin: 0;"/>
                <n-space vertical>
                  <div style="font-size:15px;font-weight: 600;">
                    {{
                      $t('form.queryEditor.input_optionMatchAll')
                      + $t('HeaderMediaFolders')
                      + ', '
                      + $t('nsmusics.view_page.selectLibrary')
                      + ', '
                      + $t('nsmusics.view_page.selectLibrary_select_0')
                      + ', '
                      + $t('common.restartRequired')
                    }}
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
                <n-divider v-if="false" style="margin: 0;"/>
                <n-space vertical style="width: 600px;">
                  <div style="font-size:15px;font-weight: 600;">
                    {{
                      $t('form.queryEditor.input_optionMatchAll')
                      + $t('HeaderMediaFolders')
                      + ', '
                      + $t('nsmusics.view_page.selectLibrary')
                      + ', '
                      + $t('nsmusics.view_page.selectLibrary_select_1')
                      + ', '
                      + $t('common.restartRequired')
                    }}
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
        </n-steps>
      </n-space>
    </n-space>
    <!-- 服务器添加 -->
    <n-modal
        v-model:show="Type_Server_Add">
      <n-card style="width: 450px;border-radius: 4px;">
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
          <n-radio-group v-model:value="server_set_of_addUser_of_type">
            <n-radio-button
                style="text-align: center;width: 133px;"
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
          <n-radio-group v-model:value="server_set_of_addUser_of_type">
            <n-radio-button
                style="text-align: center;width: 133px;"
                :key="Type_Server_Kinds[3].value"
                :value="Type_Server_Kinds[3].value"
                :label="Type_Server_Kinds[3].label"
            />
            <n-radio-button
                style="text-align: center;width: 133px;"
                :key="Type_Server_Kinds[4].value"
                :value="Type_Server_Kinds[4].value"
                :label="Type_Server_Kinds[4].label"
            />
          </n-radio-group>
          <n-radio-group v-model:value="server_set_of_addUser_of_type">
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
          <n-form v-if="store_server_user_model.server_login_model_of_apikey" style="margin-top: -12px;">
            <n-space vertical style="margin-bottom: 10px;">
              <span>{{ $t('HeaderApiKey') }}</span>
              <n-input clearable placeholder="" v-model:value="server_set_of_addUser_of_apikey"/>
              <n-button strong secondary type="info"
                        @click="update_server_apikey_user_option({
                                          servername: server_set_of_addUser_of_servername,
                                          url: server_set_of_addUser_of_url,
                                          apikey: server_set_of_addUser_of_apikey,
                                          userid: store_server_user_model.userid_of_Je,
                                          init: true
                                        })">
                {{ $t('ButtonOk') }}
              </n-button>
            </n-space>
            <n-space vertical style="margin-bottom: 10px;">
              <span>{{ $t('LabelSelectUsers') }}</span>
              <n-select
                  v-model:value="store_server_user_model.userid_of_Je"
                  :options="server_set_of_addUser_of_apikey_user_option"
                  style="width: 220px;margin-top: 6px;"
              />
            </n-space>
          </n-form>
          <n-form v-else style="margin-top: -12px;">
            <n-space vertical style="margin-bottom: 10px;">
              <span v-if="server_set_of_addUser_of_type != 'ninesong'">{{ $t('form.addServer.input_username') }}</span>
              <span v-else>{{ $t('nsmusics.server_page.server_email') }}</span>
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
</template>

<style scoped>

</style>