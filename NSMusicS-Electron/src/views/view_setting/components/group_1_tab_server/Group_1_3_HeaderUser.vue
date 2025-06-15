<script setup lang="ts">
import {NButton} from "naive-ui";

import {ref} from "vue";

import {store_server_login_info} from "@/views/view_server/page_metadata/page_login/store/store_server_login_info";
import {
  Auth_Info_ApiService_of_NineSong
} from "@/data/data_access/servers_configs/ninesong_api/services_web/Auth/Auth_Info/index_service";
import {store_server_login_logic} from "@/views/view_server/page_metadata/page_login/store/store_server_login_logic";

const current_server_email = ref('')
const new_server_email = ref('')
const current_password = ref('')
const new_password = ref('')

let auth_Info_ApiService_of_NineSong = new Auth_Info_ApiService_of_NineSong(store_server_login_info.server_url)
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {store_app_configs_info} from "@/data/data_stores/app/store_app_configs_info";

import {useI18n} from "vue-i18n";
const { t } = useI18n({
  inheritLocale: true
})

import { useMessage } from 'naive-ui'
import {
  store_server_ninesong_userdata_logic
} from "@/data/data_stores/server/server_data_select/server_ninesong_user_data/store_server_ninesong_userdata_logic";
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";
const message = useMessage()

async function change_email(current_server_email: string, new_server_email: string){
  if(current_server_email !== store_server_login_info.server_input_email && current_server_email !== store_server_user_model.username)
  {
    message.error(t('nsmusics.server_page.server_email') + t('LogLevel.Error'))
    return;
  }
  if(store_server_login_info.server_input_email === new_server_email || store_server_user_model.username === new_server_email || new_server_email.length === 0){
    message.error(t('nsmusics.server_page.server_email') + t('LogLevel.Error'))
    return;
  }

  const result = auth_Info_ApiService_of_NineSong.setAuth_Email(new_server_email)
  if (result) {
    message.success(t('form.editPlaylist.success'))
    store_server_login_info.server_input_email = new_server_email
    store_server_user_model.username = new_server_email
    ///
    const login_result = store_server_ninesong_userdata_logic.ninesong_update_server_setUser(
        store_server_login_info.server_id,
        store_server_login_info.server_name, store_server_login_info.server_url,
        store_server_user_model.username, store_server_user_model.password,
        'ninesong'
    )
    if(login_result){
      message.success(t('Refresh') + t('ButtonSignIn'))
      store_app_configs_logic_save.save_system_config_of_App_Configs()
      const index = store_server_users.server_config_of_all_user_of_sqlite.findIndex(item => item.id === store_server_login_info.server_id);
      if (index >= 0) {
        store_server_users.server_config_of_all_user_of_sqlite[index].server_name = store_server_login_info.server_name
        store_server_users.server_config_of_all_user_of_sqlite[index].user_name = store_server_user_model.username
        store_server_users.server_config_of_all_user_of_sqlite[index].password = store_server_user_model.password
      }else{
        message.error(t('nsmusics.server_page.server_email') + t('LogLevel.Error'))
      }
      store_app_configs_logic_save.save_system_config_of_Servers_Config()
    }else{
      message.error(t('nsmusics.server_page.server_email') + t('LogLevel.Error'))
    }
  }else{
    message.error(t('nsmusics.server_page.server_email') + t('LogLevel.Error'))
  }
}
async function change_password(old_password: string, new_password: string) {
  if(new_password.length === 0){
    message.error(t('PasswordMatchError'))
    return;
  }
  if(!store_server_login_info.server_input_password === old_password || !store_server_user_model.password === old_password){
    message.error(t('PasswordMatchError'))
    return;
  }else{
    if(old_password === new_password){
      message.error(t('PasswordMatchError'))
      return;
    }
  }

  const result = auth_Info_ApiService_of_NineSong.setAuth_Password(old_password, new_password)
  if (result) {
    message.success(t('form.editPlaylist.success'))
    store_server_login_info.server_input_password = new_password
    store_server_user_model.password = new_password
    ///
    const login_result = store_server_ninesong_userdata_logic.ninesong_update_server_setUser(
        store_server_login_info.server_id,
        store_server_login_info.server_name, store_server_login_info.server_url,
        store_server_user_model.username, store_server_user_model.password,
        'ninesong'
    )
    if(login_result){
      message.success(t('Refresh') + t('ButtonSignIn'))
      store_app_configs_logic_save.save_system_config_of_App_Configs()
      const index = store_server_users.server_config_of_all_user_of_sqlite.findIndex(item => item.id === store_server_login_info.server_id);
      if (index >= 0) {
        store_server_users.server_config_of_all_user_of_sqlite[index].server_name = store_server_login_info.server_name
        store_server_users.server_config_of_all_user_of_sqlite[index].user_name = store_server_user_model.username
        store_server_users.server_config_of_all_user_of_sqlite[index].password = store_server_user_model.password
      }else{
        message.error(t('PasswordMatchError'))
      }
      store_app_configs_logic_save.save_system_config_of_Servers_Config()
    }else{
      message.error(t('PasswordMatchError'))
    }
  }else{
    message.error(t('PasswordMatchError'))
  }
}
</script>

<template>
  <n-space vertical>
    <div style="font-weight: 600;font-size: 16px;margin-bottom: 4px;">
      {{ $t('HeaderUser') }} >
    </div>
    <n-space vertical>
      <n-space vertical justify="start" style="margin-bottom: 22px;">
        <div style="font-weight: 600;font-size: 14px;margin-bottom: 12px;">
          {{ $t('Reset') + $t('nsmusics.server_page.server_email') }}
        </div>
        <n-form style="margin-top: -12px;">
          <n-space vertical style="margin-bottom: 10px;">
            <span>{{ $t('nsmusics.view_page.current') + $t('nsmusics.server_page.server_email') }}</span>
            <n-input clearable v-model:value="current_server_email" placeholder=""/>
          </n-space>
          <n-space vertical style="margin-bottom: 10px;">
            <span>{{ $t('ButtonOk') + $t('nsmusics.server_page.server_email') }}</span>
            <n-input clearable v-model:value="new_server_email" placeholder=""/>
          </n-space>
        </n-form>
        <n-button icon-placement="left"
                  secondary strong
                  @click="async () => {
                    await change_email(current_server_email, new_server_email)
                  }">
          {{ $t('ButtonOk') + $t('Reset') }}
        </n-button>
      </n-space>
      <n-space vertical justify="start">
        <div style="font-weight: 600;font-size: 14px;margin-bottom: 12px;">
          {{ $t('ResetPassword') }}
        </div>
        <n-form style="margin-top: -12px;">
          <n-space vertical style="margin-bottom: 10px;">
            <span>{{ $t('LabelCurrentPassword') }}</span>
            <n-input clearable v-model:value="current_password" placeholder=""/>
          </n-space>
          <n-space vertical style="margin-bottom: 10px;">
            <span>{{ $t('LabelNewPassword')}}</span>
            <n-input clearable v-model:value="new_password" placeholder=""/>
          </n-space>
          <n-button icon-placement="left"
                    secondary strong
                    @click="async () => {
                      await change_password(current_password, new_password)
                    }">
            {{ $t('ButtonOk') + $t('Reset') }}
          </n-button>
        </n-form>
      </n-space>
    </n-space>
  </n-space>
</template>
<style>

</style>