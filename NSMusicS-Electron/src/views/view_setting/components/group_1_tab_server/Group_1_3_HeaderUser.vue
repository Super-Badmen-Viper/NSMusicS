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
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true
})
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";

////// this_view views_components
import { store_server_users } from '@/data/data_stores/server/store_server_users'
import {ref, onMounted, computed} from 'vue';
import {NButton, NIcon} from 'naive-ui'
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {store_player_audio_logic} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_audio_logic";
import {store_server_data_select_logic} from "@/data/data_stores/server/server_data_select/store_server_data_select_logic";
import {
  Users_ApiService_of_Je
} from "@/data/data_access/servers_configs/jellyfin_api/services_web/Users/index_service";

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

//////
import {
  Library_ApiService_of_Je
} from "@/data/data_access/servers_configs/jellyfin_api/services_web/Library/index_service";
import {
  store_playlist_list_info
} from "@/views/view_app/page_metadata/page_folder/page_music/music_components/player_list/store/store_playlist_list_info";
import {store_player_audio_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_audio_info";

//////
const user_setting_select_tab_name = ref('tab_pane_1')
</script>

<template>
  <n-space vertical>
    <div style="font-weight: 600;font-size: 16px;margin-bottom: 4px;">
      {{ $t('HeaderUser') }} >
    </div>

    <!-- 媒体库管理 -->
    <n-space vertical>
      <n-space class="n-step-description">
        <n-space vertical>
          <n-button
              tertiary
              @click="Type_Server_Add = !Type_Server_Add">
            <template #icon>
              <n-icon size="24">
                <Add />
              </n-icon>
            </template>
            <div style="font-size:15px;font-weight: 600;">
              {{ $t('ButtonAddUser') }}
            </div>
          </n-button>
          <DynamicScroller
              class="table" ref="scrollbar"
              :style="{ width: 'calc(100vw - ' + (460) + 'px)'}"
              style="overflow: auto;margin-top: 6px;"
              :items="store_server_users.server_config_of_all_user_of_sqlite"
              :itemSize="70"
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
                  @click="() => {
                    item.show = !item.show;
                  }"
                  :style="{ width: 'calc(100vw - ' + (460) + 'px)'}"
                  style="
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
                      <div style="width: 160px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                        {{ item.server_name }}
                      </div>
                      <div style="width: 370px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                        {{ $t('LastSeen') }}
                      </div>
                    </n-space>
                    <span style="width: 18px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ (index+1) }}</span>
                  </n-space>
                  <n-modal
                      v-model:show="item.show">
                    <n-card style="width: 800px;border-radius: 4px;">
                      <n-tabs
                          style="margin-top: -6px;"
                          v-model:value="user_setting_select_tab_name"
                          size="large" animated justify-content="space-evenly"
                          type="line">
                        <!-- Profile -->
                        <n-tab-pane name="tab_pane_1">
                          <template #tab>
                            {{ $t('Profile') }}
                          </template>
                          <n-space
                              vertical
                              style="overflow-y: auto;overflow-x:hidden;margin-top: 9px;">

                          </n-space>
                        </n-tab-pane>
                        <!-- TabAccess -->
                        <n-tab-pane name="tab_pane_2">
                          <template #tab>
                            {{ $t('TabAccess') }}
                          </template>
                          <n-scrollbar style="overflow-y: auto;margin-top: 9px;">

                          </n-scrollbar>
                        </n-tab-pane>
                        <!-- TabParentalControl -->
                        <n-tab-pane name="tab_pane_3">
                          <template #tab>
                            {{ $t('TabParentalControl') }}
                          </template>
                          <n-scrollbar style="overflow-y: auto;margin-top: 9px;" >

                          </n-scrollbar>
                        </n-tab-pane>
                        <!-- HeaderPassword -->
                        <n-tab-pane name="tab_pane_4">
                          <template #tab>
                            {{ $t('HeaderPassword') }}
                          </template>
                          <n-scrollbar style="overflow-y: auto;margin-top: 9px;">

                          </n-scrollbar>
                        </n-tab-pane>
                      </n-tabs>
                    </n-card>
                  </n-modal>
                </div>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
        </n-space>
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
</template>
<style>

</style>