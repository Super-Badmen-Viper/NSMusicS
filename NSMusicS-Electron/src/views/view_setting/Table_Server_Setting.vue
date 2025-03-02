<script setup lang="ts">
////// this_view resource of vicons_svg
import { store_app_configs_info } from '@/data/data_stores/app/store_app_configs_info'
import {
  NotificationsOutline
} from '@vicons/ionicons5'
import {
  BareMetalServer,BlockStorageAlt,Settings,UserMultiple,MediaLibrary,Devices,
  Activity,SendBackward,Video,
  ContentDeliveryNetwork,Catalog,Timer
} from '@vicons/carbon'
import {
  PlayCircle16Regular, LauncherSettings24Regular, Key24Regular, PlugConnected20Regular, Settings48Regular
} from '@vicons/fluent'
import {
  LiveTvRound
} from '@vicons/material'
import {h, watch} from "vue";
import {NIcon} from "naive-ui";

//////
import Group_0_1 from "@/views/view_setting/components/group_0/group_0_1_ClientSettings_Libraries.vue"
import Group_0_2 from "@/views/view_setting/components/group_0/group_0_2_ClientSettings_GeneralTab.vue"
import Group_0_3 from "@/views/view_setting/components/group_0/group_0_3_ClientSettings_PlaybackTab.vue"
import Group_0_4 from "@/views/view_setting/components/group_0/group_0_4_ClientSettings_HotkeysTab.vue"
import Group_0_5 from "@/views/view_setting/components/group_0/group_0_5_ClientSettings_WindowTab.vue"
import Group_1_1 from "@/views/view_setting/components/group_1/group_1_1.vue";
import Group_1_2 from "@/views/view_setting/components/group_1/group_1_2.vue";
import Group_1_3 from "@/views/view_setting/components/group_1/group_1_3.vue";
import Group_1_4_1 from "@/views/view_setting/components/group_1/group_1_4_1.vue";
import Group_1_4_2 from "@/views/view_setting/components/group_1/group_1_4_2.vue";
import Group_1_4_3 from "@/views/view_setting/components/group_1/group_1_4_3.vue";
import Group_1_4_4 from "@/views/view_setting/components/group_1/group_1_4_4.vue";
import Group_1_5_1 from "@/views/view_setting/components/group_1/group_1_5_1.vue";
import Group_1_5_2 from "@/views/view_setting/components/group_1/group_1_5_2.vue";
import Group_1_5_3 from "@/views/view_setting/components/group_1/group_1_5_3.vue";
import Group_1_5_4 from "@/views/view_setting/components/group_1/group_1_5_4.vue";
import Group_2_1 from "@/views/view_setting/components/group_2/group_2_1.vue";
import Group_2_2 from "@/views/view_setting/components/group_2/group_2_2.vue";
import Group_2_3 from "@/views/view_setting/components/group_2/group_2_3.vue";
import Group_3_1 from "@/views/view_setting/components/group_3/group_3_1.vue";
import Group_3_2 from "@/views/view_setting/components/group_3/group_3_2.vue";
import Group_4_1 from "@/views/view_setting/components/group_4/group_4_1.vue";
import Group_4_2 from "@/views/view_setting/components/group_4/group_4_2.vue";
import Group_4_3 from "@/views/view_setting/components/group_4/group_4_3.vue";
import Group_4_4 from "@/views/view_setting/components/group_4/group_4_4.vue";
import Group_4_5_1 from "@/views/view_setting/components/group_4/group_4_5_1.vue";
import Group_4_5_2 from "@/views/view_setting/components/group_4/group_4_5_2.vue";
import Group_4_5_3 from "@/views/view_setting/components/group_4/group_4_5_3.vue";
import Group_4_6 from "@/views/view_setting/components/group_4/group_4_6.vue";
function renderIcon (icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true
})
const menuOptions: any[] = [
  {label: t('ClientSettings'), key: 'type-group-0', icon: renderIcon(Settings48Regular),
    children: [
      {label: t('HeaderLibraries'), key: 'type-group-0-1', icon: renderIcon(BlockStorageAlt)},
      {label: t('page.setting.generalTab'), key: 'type-group-0-2', icon: renderIcon(Settings)},
      {label: t('page.setting.playbackTab'), key: 'type-group-0-3', icon: renderIcon(UserMultiple)},
      {label: t('page.setting.hotkeysTab'), key: 'type-group-0-4', icon: renderIcon(UserMultiple)},
      {label: t('page.setting.windowTab'), key: 'type-group-0-5', icon: renderIcon(UserMultiple)},
    ]
  },
  {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '16px'}}},
  {label: t('TabServer') + t('Settings'), key: 'type-group-1', icon: renderIcon(BareMetalServer),
    children: [
      {label: t('TabDashboard'), key: 'type-group-1-1', icon: renderIcon(BlockStorageAlt)},
      {label: t('General'), key: 'type-group-1-2', icon: renderIcon(Settings)},
      {label: t('HeaderUser'), key: 'type-group-1-3', icon: renderIcon(UserMultiple)},
      {label: t('HeaderLibraries'), key: 'type-group-1-4', icon: renderIcon(MediaLibrary),
        children: [
          {label: t('HeaderLibraries'), key: 'type-group-1-4-1'},
          {label: t('Display'), key: 'type-group-1-4-2'},
          {label: t('LabelMetadata'), key: 'type-group-1-4-3'},
          {label: t('TabNfoSettings'), key: 'type-group-1-4-4'},
        ]
      },
      {label: t('Play'), key: 'type-group-1-5', icon: renderIcon(PlayCircle16Regular),
        children: [
          {label: t('LabelTranscodes'), key: 'type-group-1-5-1'},
          {label: t('ButtonResume'), key: 'type-group-1-5-2'},
          {label: t('TabStreaming'), key: 'type-group-1-5-3'},
          {label: '特技播放', key: 'type-group-1-5-4'},
        ]
      }
    ]
  },
  {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '16px'}}},
  {label: t('HeaderDevices'), key: 'type-group-2', icon: renderIcon(Devices),
    children: [
      {label: t('HeaderDevices'), key: 'type-group-2-1', icon: renderIcon(Devices)},
      {label: t('HeaderActivity'), key: 'type-group-2-2', icon: renderIcon(Activity)},
      {label: 'DLNA', key: 'type-group-2-3', icon: renderIcon(SendBackward)},
    ]
  },
  {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '16px'}}},
  {label: t('LiveTV'), key: 'type-group-3', icon: renderIcon(LiveTvRound),
    children: [
      {label: t('LiveTV'), key: 'type-group-3-1', icon: renderIcon(LiveTvRound)},
      {label: t('HeaderDVR'), key: 'type-group-3-2', icon: renderIcon(Video)},
    ]
  },
  {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '16px'}}},
  {label: t('TabAdvanced'), key: 'type-group-4', icon: renderIcon(LauncherSettings24Regular),
    children: [
      {label: t('TabNetworking'), key: 'type-group-4-1', icon: renderIcon(ContentDeliveryNetwork)},
      {label: t('HeaderApiKey'), key: 'type-group-4-2', icon: renderIcon(Key24Regular)},
      {label: t('TabLogs'), key: 'type-group-4-3', icon: renderIcon(Catalog)},
      {label: t('HeaderAlert'), key: 'type-group-4-4', icon: renderIcon(NotificationsOutline)},
      {label: t('TabPlugins'), key: 'type-group-4-5', icon: renderIcon(PlugConnected20Regular),
        children: [
          {label: t('TabMyPlugins'), key: 'type-group-4-5-1'},
          {label: t('TabCatalog'), key: 'type-group-4-5-2'},
          {label: t('TabRepositories'), key: 'type-group-4-5-3'},
        ]
      },
      {label: t('TabScheduledTasks'), key: 'type-group-4-6', icon: renderIcon(Timer)},
    ]
  }
]
const defaultExpandedKeys = ['type-group-0', 'type-group-1', 'type-group-2', 'type-group-3', 'type-group-4']
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
              v-model:value="store_app_configs_info.app_view_page_server_setting_select_tab_name"
              :icon-size="18"
              :options="menuOptions"
              :default-expanded-keys="defaultExpandedKeys"
            />
          </n-layout-sider>
          <n-layout embedded style="overflow-y: auto;border-radius: 4px;">
            <div style="margin-left: 14px;margin-top: 10px;margin-right: 14px;">
              <!--客户端-->
              <Group_0_1
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-0-1'"
              />
              <Group_0_2
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-0-2'"
              />
              <Group_0_3
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-0-3'"
              />
              <Group_0_4
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-0-4'"
              />
              <Group_0_5
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-0-5'"
              />
              <!--服务器-->
              <Group_1_1
                v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-1-1'"
              />
              <Group_1_2
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-1-2'"
              />
              <Group_1_3
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-1-3'"
              />
              <Group_1_4_1
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-1-4-1'"
              />
              <Group_1_4_2
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-1-4-2'"
              />
              <Group_1_4_3
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-1-4-3'"
              />
              <Group_1_4_4
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-1-4-4'"
              />
              <Group_1_5_1
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-1-5-1'"
              />
              <Group_1_5_2
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-1-5-2'"
              />
              <Group_1_5_3
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-1-5-3'"
              />
              <Group_1_5_4
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-1-5-4'"
              />
              <Group_2_1
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-2-1'"
              />
              <Group_2_2
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-2-2'"
              />
              <Group_2_3
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-2-3'"
              />
              <Group_3_1
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-3-1'"
              />
              <Group_3_2
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-3-2'"
              />
              <Group_4_1
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-4-1'"
              />
              <Group_4_2
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-4-2'"
              />
              <Group_4_3
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-4-3'"
              />
              <Group_4_4
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-4-4'"
              />
              <Group_4_5_1
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-4-5-1'"
              />
              <Group_4_5_2
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-4-5-2'"
              />
              <Group_4_5_3
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-4-5-3'"
              />
              <Group_4_6
                  v-if="store_app_configs_info.app_view_page_server_setting_select_tab_name === 'type-group-4-6'"
              />
            </div>
          </n-layout>
        </n-layout>
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