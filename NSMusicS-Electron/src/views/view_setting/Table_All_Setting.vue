<script setup lang="ts">
////// this_view resource of vicons_svg
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { NotificationsOutline } from '@vicons/ionicons5'
import {
  BareMetalServer,
  BlockStorageAlt,
  Settings,
  UserMultiple,
  MediaLibrary,
  Devices,
  Activity,
  SendBackward,
  Video,
  ContentDeliveryNetwork,
  Catalog,
  Timer,
  Close,
} from '@vicons/carbon'
import {
  PlayCircle16Regular,
  LauncherSettings24Regular,
  Key24Regular,
  PlugConnected20Regular,
  Settings20Regular,
} from '@vicons/fluent'
import { LiveTvRound } from '@vicons/material'
import { AppWindow, Keyboard } from '@vicons/tabler'
import { h, computed, reactive, ref, onMounted } from 'vue'
import { NButton, NIcon } from 'naive-ui'

//////
import Group01ClientSettingsLibraries from '@/views/view_setting/components/group_0_client_settings/Group_0_1_ClientSettings_Libraries.vue'
import Group02ClientSettingsGeneralTab from '@/views/view_setting/components/group_0_client_settings/Group_0_2_ClientSettings_GeneralTab.vue'
import Group03ClientSettingsPlaybackTab from '@/views/view_setting/components/group_0_client_settings/Group_0_3_ClientSettings_PlaybackTab.vue'
import Group04ClientSettingsHotkeysTab from '@/views/view_setting/components/group_0_client_settings/Group_0_4_ClientSettings_HotkeysTab.vue'

import Group13HeaderUser from '@/views/view_setting/components/group_1_tab_server/Group_1_3_HeaderUser.vue'
import Group141HeaderLibraries from '@/views/view_setting/components/group_1_tab_server/Group_1_4_1_HeaderLibraries.vue'
import Group151LabelTranscodes from '@/views/view_setting/components/group_1_tab_server/Group_1_5_1_LabelTranscodes.vue'




function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
import { useI18n } from 'vue-i18n'
import { store_server_users } from '@/server/server_management/store_server_users'
import { store_local_db_info } from '@/data/data_stores/local_app_stores/store_local_db_info'
import { store_server_user_model } from '@/server/server_management/store_server_user_model'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { store_server_login_info } from '@/data/data_status/comment_status/login_store/store_server_login_info'
const { t } = useI18n({
  inheritLocale: true,
})
const menuOptions: any[] = reactive([
  {
    label: computed(() => t('ClientSettings')),
    key: 'type-group-0',
    icon: renderIcon(Settings20Regular),
    children: [
      {
        label: computed(() => t('page.setting.generalTab')),
        key: 'type-group-0-1',
        icon: renderIcon(Settings),
      },
      {
        label: computed(() => t('HeaderLibraries')),
        key: 'type-group-0-2',
        icon: renderIcon(MediaLibrary),
      },
      {
        label: computed(() => t('page.setting.playbackTab')),
        key: 'type-group-0-3',
        icon: renderIcon(PlayCircle16Regular),
      },
      {
        label: computed(() => t('page.setting.hotkeysTab')),
        key: 'type-group-0-4',
        icon: renderIcon(Keyboard),
      },

    ],
  },
  { key: 'divider-1', type: 'divider', props: { style: { marginLeft: '16px' } } },
  {
    label: computed(() => t('TabServer') + t('Settings')),
    key: 'type-group-1',
    icon: renderIcon(BareMetalServer),
    children: [


      {
        label: computed(() => t('HeaderUser')),
        key: 'type-group-1-3',
        icon: renderIcon(UserMultiple),
      },
      {
        label: computed(() => t('HeaderLibraries')),
        key: 'type-group-1-4-1',
        icon: renderIcon(MediaLibrary),
      },
      {
        label: computed(() => t('LabelTranscodes')),
        key: 'type-group-1-5-1',
        icon: renderIcon(SendBackward),
      },

    ],
  },
])
const defaultExpandedKeys = [
  'type-group-0',
  'type-group-1',
]

///
const init_config_model = ref(false)
onMounted(() => {
  if (isElectron) {
    if (
      store_server_users.server_config_of_all_user_of_sqlite.length === 0 &&
      store_local_db_info.local_config_of_all_user_of_sqlite.length === 0
    ) {
      init_config_model.value = true
    }
  }
})
</script>
<template>
  <div class="view">
    <n-layout embedded content-style="margin-left: 9px;" vertical :size="12">
      <n-card
        class="table"
        style="overflow: hidden; border-radius: 4px"
        :style="{ width: 'calc(100vw - ' + 137 + 'px)' }"
      >
        <n-layout
          has-sider
          :style="{ width: 'calc(100vw - ' + 155 + 'px)' }"
          style="margin-left: -18px; margin-top: -10px; height: calc(100vh - 180px)"
        >
          <n-layout-sider>
            <n-menu
              v-model:value="
                store_system_configs_info.app_view_server_client_setting_select_tab_name
              "
              :icon-size="18"
              :options="menuOptions"
              :default-expanded-keys="defaultExpandedKeys"
            />
          </n-layout-sider>
          <n-layout embedded style="overflow-y: auto; border-radius: 4px">
            <div style="margin-left: 14px; margin-top: 10px; margin-right: 14px">
              <!--客户端-->
              <Group02ClientSettingsGeneralTab
                v-if="
                  store_system_configs_info.app_view_server_client_setting_select_tab_name ===
                  'type-group-0-1'
                "
              />
              <Group01ClientSettingsLibraries
                v-if="
                  store_system_configs_info.app_view_server_client_setting_select_tab_name ===
                  'type-group-0-2'
                "
              />
              <Group03ClientSettingsPlaybackTab
                v-if="
                  store_system_configs_info.app_view_server_client_setting_select_tab_name ===
                  'type-group-0-3'
                "
              />
              <Group04ClientSettingsHotkeysTab
                v-if="
                  store_system_configs_info.app_view_server_client_setting_select_tab_name ===
                  'type-group-0-4'
                "
              />

              <!--服务器-->


              <Group13HeaderUser
                v-if="
                  store_system_configs_info.app_view_server_client_setting_select_tab_name ===
                  'type-group-1-3'
                "
              />
              <Group141HeaderLibraries
                v-if="
                  store_system_configs_info.app_view_server_client_setting_select_tab_name ===
                  'type-group-1-4-1'
                "
              />
              <Group151LabelTranscodes
                v-if="
                  store_system_configs_info.app_view_server_client_setting_select_tab_name ===
                  'type-group-1-5-1'
                "
              />

















            </div>
          </n-layout>
        </n-layout>
      </n-card>
    </n-layout>
    <!-- 初始化配置 -->
    <n-modal v-model:show="init_config_model">
      <n-card style="width: 752px; border-radius: 4px">
        <n-scrollbar
          vertical
          style="height: 76vh; overflow-y: auto; margin-top: 9px; padding-right: 32px"
        >
          <n-space align="center" justify="space-between">
            <span style="font-size: 16px; font-weight: 600">{{
              '1. ' + $t('ThisWizardWillGuideYou')
            }}</span>
          </n-space>
          <Group02ClientSettingsGeneralTab style="padding-left: 20px" />
          <n-space vertical>
            <span style="font-size: 16px; font-weight: 600">{{
              '2. ' + $t('HeaderSetupLibrary')
            }}</span>
          </n-space>
          <Group01ClientSettingsLibraries style="padding-left: 20px" />
          <n-space align="center" justify="space-between">
            <span style="font-size: 16px; font-weight: 600">{{
              '3. ' + $t('LabelYoureDone')
            }}</span>
            <n-button strong secondary type="success" @click="init_config_model = false">
              {{ $t('ButtonOk') }}
            </n-button>
          </n-space>
        </n-scrollbar>
      </n-card>
    </n-modal>
  </div>
</template>
<style>
.view {
  height: calc(100vh - 160px);
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}
.table {
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
