<script setup lang="ts">
////// this_view resource of vicons_svg
import {
  AddCircle32Regular,
  ArrowReset24Filled,
  MultiselectLtr20Filled,
  Delete20Regular,
  SelectAllOn24Regular,
  ArrowSort24Regular,TextSortAscending20Regular,TextSortDescending20Regular,
  Search20Filled,
  Heart24Regular,Heart28Filled,
  ChevronLeft16Filled,ChevronRight16Filled,
  Filter20Filled,PaddingTop20Filled,PaddingDown20Filled,
  ArrowRepeatAll16Regular,ArrowAutofitDown24Regular,
} from '@vicons/fluent'
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {store_app_configs_info} from "@/data/data_stores/app/store_app_configs_info";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {BareMetalServer, Close} from "@vicons/carbon";
import {NButton, NIcon} from "naive-ui";

import { ref, computed, watch, onMounted } from "vue";

import { useMessage } from 'naive-ui'
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
  // Refresh Playlist(Local / Server)
  store_playlist_list_info.playlist_MediaFiles_temporary = [];
  await store_player_audio_logic.player.pause();
  store_player_audio_info.reset_data()
  // Close navidrome random model
  store_server_user_model.random_play_model = false
  // Refresh play_order(Local / Server)
  store_player_audio_logic.play_order = 'playback-2'
}

// gridItems Re render
////// librarylist_view page_layout gridItems
const item_library = ref<number>(160)
const item_library_image = ref<number>(item_library.value - 20)
const item_library_txt = ref<number>(item_library.value - 20)
const itemSize = ref(180);
const gridItems = ref(5);
const itemSecondarySize = ref(185);
const collapsed_width = ref<number>(1090);
const stopWatching_window_innerWidth = watch(() => store_app_configs_info.window_innerWidth, () => {
  updateGridItems();
});
const updateGridItems = () => {
  collapsed_width.value = 145;
  if(window.innerWidth > 2460){
    const num = window.innerWidth / 7.53
    itemSize.value = Math.floor(num) + 20;
    item_library.value = Math.floor(num);
    item_library_image.value = item_library.value - 20;
    item_library_txt.value = item_library.value - 20;
    gridItems.value = 4;
    itemSecondarySize.value = Math.floor(window.innerWidth - (collapsed_width.value + 320)) / gridItems.value - 2;
  }else if(window.innerWidth > 1660){
    const num = window.innerWidth / 6.53
    itemSize.value = Math.floor(num) + 20;
    item_library.value = Math.floor(num);
    item_library_image.value = item_library.value - 20;
    item_library_txt.value = item_library.value - 20;
    gridItems.value = 3;
    itemSecondarySize.value = Math.floor(window.innerWidth - (collapsed_width.value + 320)) / gridItems.value - 2;
  }else{
    const num = window.innerWidth / 5.53
    itemSize.value = Math.floor(num) + 20;
    item_library.value = Math.floor(num);
    item_library_image.value = item_library.value - 20;
    item_library_txt.value = item_library.value - 20;
    gridItems.value = 2;
    itemSecondarySize.value = Math.floor(window.innerWidth - (collapsed_width.value + 320)) / gridItems.value - 2;
  }
};
onMounted(() => {
  updateGridItems();
});

import error_artist from '@/assets/img/error_artist.jpg'
</script>
<template>
  <n-space vertical>
    <div style="font-weight: 600;font-size: 16px;margin-bottom: 4px;">
      {{ $t('HeaderLibraries') }} >
    </div>
    <n-space vertical>
      <n-space justify="start">
        <n-button icon-placement="left"
                  secondary strong
                  @click="Type_Server_Add = !Type_Server_Add"
        >
          <template #icon>
            <NIcon>
              <AddCircle32Regular />
            </NIcon>
          </template>
          {{ $t('ButtonAddMediaLibrary') }}
        </n-button>
        <n-button icon-placement="left" secondary strong>
          <template #icon>
            <NIcon>
              <ArrowReset24Filled />
            </NIcon>
          </template>
          {{ $t('ButtonScanAllLibraries') }}
        </n-button>
      </n-space>
      <DynamicScroller
         class="table" ref="scrollbar"
         :style="{
            width: 'calc(100vw - ' + (collapsed_width + 320) + 'px)',
         }"
         style="overflow: auto;margin-top: 6px;"
         :items="store_server_users.server_config_of_all_user_of_sqlite"
         :itemSize="itemSize"
         :grid-items="gridItems"
         :item-secondary-size="itemSecondarySize">
        <!-- :minItemSize="6"> -->
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
            :data-active="active"
            style="display: flex;"
          >
            <n-card
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
                  store_server_user_model.server_login_model_of_apikey = false
                }
              }"
              :style="{ width: 'calc(100vw - ' + (collapsed_width + 660) + 'px)'}"
              style="
                height: 200px;
                margin-bottom: 14px;
                border: 1px solid #f0f0f070;border-radius: 5px;
                padding: 0;
                box-shadow: #18181820 0 0 0 1px inset;
              ">
              <n-space vertical>
                <n-space vertical>
                  <img
                    :src="error_artist"
                    style="
                        width: auto;height: 100px;object-fit: cover;
                        border-radius: 8px;border: 1.5px solid #FFFFFF20;
                      " alt="">
                </n-space>
                <n-space justify="space-between">
                  <n-space>
                    <n-icon size="20">
                      <BareMetalServer />
                    </n-icon>
                    <div style="width: 140px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                      {{ item.type+' - '+item.server_name }}</div>
                  </n-space>
                  <span style="width: 18px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ (index+1) }}</span>
                </n-space>
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
            </n-card>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
      LabelContentType
      TabMusic
      Movies
      Books
      HomeVideosPhotos
      MusicVideos

      LabelDisplayName

      UseCustomTagDelimiters

      Folders
      HeaderSelectPath
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
<style>

</style>