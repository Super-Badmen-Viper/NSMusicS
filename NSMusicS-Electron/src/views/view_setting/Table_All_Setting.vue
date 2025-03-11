<script setup lang="ts">
////// this_view resource of vicons_svg
import { store_app_configs_info } from '@/data/data_stores/app/store_app_configs_info'
import {
  NotificationsOutline
} from '@vicons/ionicons5'
import {
  BareMetalServer, BlockStorageAlt, Settings, UserMultiple, MediaLibrary, Devices,
  Activity, SendBackward, Video,
  ContentDeliveryNetwork, Catalog, Timer, Close
} from '@vicons/carbon'
import {
  PlayCircle16Regular, LauncherSettings24Regular, Key24Regular, PlugConnected20Regular, Settings48Regular
} from '@vicons/fluent'
import {
  LiveTvRound
} from '@vicons/material'
import {
  AppWindow, Keyboard
} from '@vicons/tabler'
import {h, computed, reactive, ref, onMounted} from "vue";
import {NButton, NIcon} from "naive-ui";

//////
import Group01ClientSettingsLibraries from "@/views/view_setting/components/group_0_client_settings/Group_0_1_ClientSettings_Libraries.vue"
import Group02ClientSettingsGeneralTab from "@/views/view_setting/components/group_0_client_settings/Group_0_2_ClientSettings_GeneralTab.vue"
import Group03ClientSettingsPlaybackTab from "@/views/view_setting/components/group_0_client_settings/Group_0_3_ClientSettings_PlaybackTab.vue"
import Group04ClientSettingsHotkeysTab from "@/views/view_setting/components/group_0_client_settings/Group_0_4_ClientSettings_HotkeysTab.vue"
import Group05ClientSettingsWindowTab from "@/views/view_setting/components/group_0_client_settings/Group_0_5_ClientSettings_WindowTab.vue"
import Group11TabDashboard from "@/views/view_setting/components/group_1_tab_server/Group_1_1_TabDashboard.vue";
import Group12General from "@/views/view_setting/components/group_1_tab_server/Group_1_2_General.vue";
import Group13HeaderUser from "@/views/view_setting/components/group_1_tab_server/Group_1_3_HeaderUser.vue";
import Group141HeaderLibraries from "@/views/view_setting/components/group_1_tab_server/Group_1_4_1_HeaderLibraries.vue";
import Group142Display from "@/views/view_setting/components/group_1_tab_server/Group_1_4_2_Display.vue";
import Group143LabelMetadata from "@/views/view_setting/components/group_1_tab_server/Group_1_4_3_LabelMetadata.vue";
import Group144TabNfoSettings from "@/views/view_setting/components/group_1_tab_server/Group_1_4_4_TabNfoSettings.vue";
import Group151LabelTranscodes from "@/views/view_setting/components/group_1_tab_server/Group_1_5_1_LabelTranscodes.vue";
import Group152ButtonResume from "@/views/view_setting/components/group_1_tab_server/Group_1_5_2_ButtonResume.vue";
import Group153TabStreaming from "@/views/view_setting/components/group_1_tab_server/Group_1_5_3_TabStreaming.vue";
import Group_1_5_4 from "@/views/view_setting/components/group_1_tab_server/group_1_5_4.vue";
import Group21HeaderDevices from "@/views/view_setting/components/group_2_header_devices/Group_2_1_HeaderDevices.vue";
import Group22HeaderActivity from "@/views/view_setting/components/group_2_header_devices/Group_2_2_HeaderActivity.vue";
import Group23Dlna from "@/views/view_setting/components/group_2_header_devices/Group_2_3_DLNA.vue";
import Group31LiveTv from "@/views/view_setting/components/group_3_live_TV/Group_3_1_LiveTV.vue";
import Group32HeaderDvr from "@/views/view_setting/components/group_3_live_TV/Group_3_2_HeaderDVR.vue";
import Group41TabNetworking from "@/views/view_setting/components/group_4_tab_advanced/Group_4_1_TabNetworking.vue";
import Group42HeaderApiKey from "@/views/view_setting/components/group_4_tab_advanced/Group_4_2_HeaderApiKey.vue";
import Group43TabLogs from "@/views/view_setting/components/group_4_tab_advanced/Group_4_3_TabLogs.vue";
import Group44HeaderAlert from "@/views/view_setting/components/group_4_tab_advanced/Group_4_4_HeaderAlert.vue";
import Group451TabMyPlugins from "@/views/view_setting/components/group_4_tab_advanced/Group_4_5_1_TabMyPlugins.vue";
import Group452TabCatalog from "@/views/view_setting/components/group_4_tab_advanced/Group_4_5_2_TabCatalog.vue";
import Group453TabRepositories from "@/views/view_setting/components/group_4_tab_advanced/Group_4_5_3_TabRepositories.vue";
import Group46TabScheduledTasks from "@/views/view_setting/components/group_4_tab_advanced/Group_4_6_TabScheduledTasks.vue";
function renderIcon (icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
import { useI18n } from 'vue-i18n'
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {store_local_db_info} from "@/data/data_stores/local/store_local_db_info";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
const { t } = useI18n({
  inheritLocale: true
})
const menuOptions: any[] = reactive([
  {label: computed(() => t('ClientSettings')), key: 'type-group-0', icon: renderIcon(Settings48Regular),
    children: [
      {label: computed(() => t('page.setting.generalTab')), key: 'type-group-0-1', icon: renderIcon(Settings)},
      {label: computed(() => t('HeaderLibraries')), key: 'type-group-0-2', icon: renderIcon(MediaLibrary)},
      {label: computed(() => t('page.setting.playbackTab')), key: 'type-group-0-3', icon: renderIcon(PlayCircle16Regular)},
      {label: computed(() => t('page.setting.hotkeysTab')), key: 'type-group-0-4', icon: renderIcon(Keyboard)},
      {label: computed(() => t('page.setting.windowTab')), key: 'type-group-0-5', icon: renderIcon(AppWindow)},
    ]
  },
  {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '16px'}}},
  {label: computed(() => t('TabServer') + t('Settings')), key: 'type-group-1', icon: renderIcon(BareMetalServer),
    children: [
      {label: computed(() => t('TabDashboard')), key: 'type-group-1-1', icon: renderIcon(BlockStorageAlt)},
      {label: computed(() => t('General')), key: 'type-group-1-2', icon: renderIcon(Settings)},
      {label: computed(() => t('HeaderUser')), key: 'type-group-1-3', icon: renderIcon(UserMultiple)},
      {label: computed(() => t('HeaderLibraries')), key: 'type-group-1-4', icon: renderIcon(MediaLibrary),
        children: [
          {label: computed(() => t('HeaderLibraries')), key: 'type-group-1-4-1'},
          {label: computed(() => t('Display')), key: 'type-group-1-4-2'},
          {label: computed(() => t('LabelMetadata')), key: 'type-group-1-4-3'},
          {label: computed(() => t('TabNfoSettings')), key: 'type-group-1-4-4'},
        ]
      },
      {label: computed(() => t('Play')), key: 'type-group-1-5', icon: renderIcon(PlayCircle16Regular),
        children: [
          {label: computed(() => t('LabelTranscodes')), key: 'type-group-1-5-1'},
          {label: computed(() => t('ButtonResume')), key: 'type-group-1-5-2'},
          {label: computed(() => t('TabStreaming')), key: 'type-group-1-5-3'},
          {label: '特技播放', key: 'type-group-1-5-4'},
        ]
      }
    ]
  },
  {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '16px'}}},
  {label: computed(() => t('HeaderDevices')), key: 'type-group-2', icon: renderIcon(Devices),
    children: [
      {label: computed(() => t('HeaderDevices')), key: 'type-group-2-1', icon: renderIcon(Devices)},
      {label: computed(() => t('HeaderActivity')), key: 'type-group-2-2', icon: renderIcon(Activity)},
      {label: 'DLNA', key: 'type-group-2-3', icon: renderIcon(SendBackward)},
    ]
  },
  {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '16px'}}},
  {label: computed(() => t('LiveTV')), key: 'type-group-3', icon: renderIcon(LiveTvRound),
    children: [
      {label: computed(() => t('LiveTV')), key: 'type-group-3-1', icon: renderIcon(LiveTvRound)},
      {label: computed(() => t('HeaderDVR')), key: 'type-group-3-2', icon: renderIcon(Video)},
    ]
  },
  {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '16px'}}},
  {label: computed(() => t('TabAdvanced')), key: 'type-group-4', icon: renderIcon(LauncherSettings24Regular),
    children: [
      {label: computed(() => t('TabNetworking')), key: 'type-group-4-1', icon: renderIcon(ContentDeliveryNetwork)},
      {label: computed(() => t('HeaderApiKey')), key: 'type-group-4-2', icon: renderIcon(Key24Regular)},
      {label: computed(() => t('TabLogs')), key: 'type-group-4-3', icon: renderIcon(Catalog)},
      {label: computed(() => t('HeaderAlert')), key: 'type-group-4-4', icon: renderIcon(NotificationsOutline)},
      {label: computed(() => t('TabPlugins')), key: 'type-group-4-5', icon: renderIcon(PlugConnected20Regular),
        children: [
          {label: computed(() => t('TabMyPlugins')), key: 'type-group-4-5-1'},
          {label: computed(() => t('TabCatalog')), key: 'type-group-4-5-2'},
          {label: computed(() => t('TabRepositories')), key: 'type-group-4-5-3'},
        ]
      },
      {label: computed(() => t('TabScheduledTasks')), key: 'type-group-4-6', icon: renderIcon(Timer)},
    ]
  }
]);
const defaultExpandedKeys = ['type-group-0', 'type-group-1', 'type-group-2', 'type-group-3', 'type-group-4']

///
const init_config_model = ref(false)
onMounted(()=>{
  if(
      store_server_users.server_config_of_all_user_of_sqlite.length === 0 &&
      store_local_db_info.local_config_of_all_user_of_sqlite.length === 0
  ){
    init_config_model.value = true;
  }
})
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
          style="overflow: hidden;border-radius: 4px;"
          :style="{ width: 'calc(100vw - ' + (137) + 'px)'}">
        <n-layout has-sider
                  :style="{ width: 'calc(100vw - ' + (155) + 'px)'}"
                  style="
                  margin-left: -18px;margin-top: -10px;
                  height: calc(100vh - 180px);">
          <n-layout-sider >
            <n-menu
              v-model:value="store_app_configs_info.app_view_server_client_setting_select_tab_name"
              :icon-size="18"
              :options="menuOptions"
              :default-expanded-keys="defaultExpandedKeys"
            />
          </n-layout-sider>
          <n-layout embedded style="overflow-y: auto;border-radius: 4px;">
            <div style="margin-left: 14px;margin-top: 10px;margin-right: 14px;">
              <!--客户端-->
              <Group02ClientSettingsGeneralTab
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-0-1'"
              />
              <Group01ClientSettingsLibraries
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-0-2'"
              />
              <Group03ClientSettingsPlaybackTab
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-0-3'"
              />
              <Group04ClientSettingsHotkeysTab
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-0-4'"
              />
              <Group05ClientSettingsWindowTab
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-0-5'"
              />
              <!--服务器-->
              <Group11TabDashboard
                v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-1-1'"
              />
              <Group12General
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-1-2'"
              />
              <Group13HeaderUser
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-1-3'"
              />
              <Group141HeaderLibraries
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-1-4-1'"
              />
              <Group142Display
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-1-4-2'"
              />
              <Group143LabelMetadata
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-1-4-3'"
              />
              <Group144TabNfoSettings
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-1-4-4'"
              />
              <Group151LabelTranscodes
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-1-5-1'"
              />
              <Group152ButtonResume
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-1-5-2'"
              />
              <Group153TabStreaming
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-1-5-3'"
              />
              <Group_1_5_4
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-1-5-4'"
              />
              <Group21HeaderDevices
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-2-1'"
              />
              <Group22HeaderActivity
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-2-2'"
              />
              <Group23Dlna
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-2-3'"
              />
              <Group31LiveTv
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-3-1'"
              />
              <Group32HeaderDvr
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-3-2'"
              />
              <Group41TabNetworking
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-4-1'"
              />
              <Group42HeaderApiKey
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-4-2'"
              />
              <Group43TabLogs
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-4-3'"
              />
              <Group44HeaderAlert
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-4-4'"
              />
              <Group451TabMyPlugins
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-4-5-1'"
              />
              <Group452TabCatalog
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-4-5-2'"
              />
              <Group453TabRepositories
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-4-5-3'"
              />
              <Group46TabScheduledTasks
                  v-if="store_app_configs_info.app_view_server_client_setting_select_tab_name === 'type-group-4-6'"
              />
            </div>
          </n-layout>
        </n-layout>
      </n-card>
    </n-layout>
    <!-- 初始化配置 -->
    <n-modal
        v-model:show="init_config_model">
      <n-card style="width: 752px;border-radius: 4px;">
        <n-scrollbar vertical style="height: 76vh;overflow-y: auto;margin-top: 9px;padding-right: 32px;">
          <n-space align="center" justify="space-between">
            <span style="font-size:16px;font-weight: 600;">{{ '1. ' + $t('ThisWizardWillGuideYou') }}</span>
          </n-space>
          <Group02ClientSettingsGeneralTab style="padding-left: 20px;"/>
          <n-space vertical>
            <span style="font-size:16px;font-weight: 600;">{{ '2. ' + $t('HeaderSetupLibrary') }}</span>
          </n-space>
          <Group01ClientSettingsLibraries style="padding-left: 20px;"/>
          <n-space align="center" justify="space-between">
            <span style="font-size:16px;font-weight: 600;">{{ '3. ' + $t('LabelYoureDone') }}</span>
            <n-button
                strong secondary type="success"
                @click="init_config_model = false;">
              {{ $t('ButtonOk') }}
            </n-button>
          </n-space>
        </n-scrollbar>
      </n-card>
    </n-modal>
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

::-webkit-scrollbar {
  display: auto;
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #88888850;
  border-radius: 4px;
}
::-webkit-scrollbar-track {
  background-color: #f1f1f105;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #88888850;
  border-radius: 4px;
}
</style>