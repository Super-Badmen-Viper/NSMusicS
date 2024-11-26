<script setup lang="ts">
////// this_view resource of vicons_svg
import {
  Delete20Regular,Settings48Regular
} from '@vicons/fluent'
import {
  BareMetalServer, Add, Close, UserAvatarFilledAlt, Hearing, MediaCast
} from '@vicons/carbon'

////// i18n auto lang
import {
  DocumentHeart20Regular,
  Flag16Regular,
  Home28Regular, PeopleCommunity16Regular,
  SlideMicrophone32Regular,
  TextIndentIncreaseLtr20Filled as lyric
} from "@vicons/fluent";
import {AlbumFilled, QueueMusicRound, MotionPhotosAutoOutlined, MusicNoteRound} from "@vicons/material";
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true
})
const computed_i18n_Label_SidebarConfiguration_8 = computed(() => t('page.appMenu.manageServers'));
const computed_i18n_Label_SidebarConfiguration_9 = computed(() => t('nsmusics.view_page.mediaLibrary'));
const computed_i18n_Label_SidebarConfiguration_10 = computed(() => t('nsmusics.siderbar_menu.karaoke'));
const computed_i18n_Label_SidebarConfiguration_11 = computed(() => t('nsmusics.siderbar_menu.guessLike'));
const computed_i18n_Label_SidebarConfiguration_12 = computed(() => t('nsmusics.siderbar_menu.identifySong'));
const computed_i18n_Label_SidebarConfiguration_13 = computed(() => t('nsmusics.siderbar_menu.scoreGeneration'));
const computed_i18n_Label_SidebarConfiguration_14 = computed(() => t('nsmusics.siderbar_menu.lyricsProduction'));
const computed_i18n_Label_SidebarConfiguration_15 = computed(() => t('nsmusics.siderbar_menu.musicCommunity'));

//////
/// server model
const model_server_step_1 = computed(() => t('nsmusics.view_page.modelSelect'));
const model_server_step_2 = computed(() => t('page.appMenu.manageServers'));
const model_server_step_3 = computed(() => t('nsmusics.view_page.modelServer'));
const model_server_step_4 = computed(() => t('page.appMenu.selectServer'));
/// local model
const model_local_step_1 = computed(() => t('nsmusics.view_page.selectedSong')+t('entity.folder_other'));
const model_local_step_2 = computed(() => t('nsmusics.view_page.selectLibrary'));

//////
import { store_app_configs_info } from '@/store/app/store_app_configs_info'
import {
  BookOutline as BookIcon,
} from '@vicons/ionicons5'
import {h, watch} from "vue";
import {NIcon} from "naive-ui";
function renderIcon (icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
const menuOptions: MenuOption[] = [
  {label: '服务器', key: 'type-group-1', icon: renderIcon(BookIcon),
    children: [
      {label: '控制台', key: 'type-group-1-1', icon: renderIcon(BookIcon)},
      {label: '常规', key: 'type-group-1-2', icon: renderIcon(BookIcon)},
      {label: '用户', key: 'type-group-1-3', icon: renderIcon(BookIcon)},
      {label: '媒体库', key: 'type-group-1-4', icon: renderIcon(BookIcon),
        children: [
          {label: '媒体库', key: 'type-group-1-4-1', icon: renderIcon(BookIcon)},
          {label: '显示', key: 'type-group-1-4-2', icon: renderIcon(BookIcon)},
          {label: '元数据', key: 'type-group-1-4-3', icon: renderIcon(BookIcon)},
          {label: 'NFO设置', key: 'type-group-1-4-4', icon: renderIcon(BookIcon)},
        ]
      },
      {label: '播放', key: 'type-group-1-5', icon: renderIcon(BookIcon),
        children: [
          {label: '转码', key: 'type-group-1-5-1', icon: renderIcon(BookIcon)},
          {label: '恢复播放', key: 'type-group-1-5-2', icon: renderIcon(BookIcon)},
          {label: '流媒体传输', key: 'type-group-1-5-3', icon: renderIcon(BookIcon)},
          {label: '特技播放', key: 'type-group-1-5-3', icon: renderIcon(BookIcon)},
        ]
      }
    ]
  },
  {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '16px'}}},
  {label: '设备', key: 'type-group-2', icon: renderIcon(BookIcon),
    children: [
      {label: '设备', key: 'type-group-2-1', icon: renderIcon(BookIcon)},
      {label: '活动', key: 'type-group-2-2', icon: renderIcon(BookIcon)},
      {label: 'DLNA', key: 'type-group-2-3', icon: renderIcon(BookIcon)},
    ]
  },
  {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '16px'}}},
  {label: '电视直播', key: 'type-group-3', icon: renderIcon(BookIcon),
    children: [
      {label: '电视直播', key: 'type-group-3-1', icon: renderIcon(BookIcon)},
      {label: '数字录像机', key: 'type-group-3-2', icon: renderIcon(BookIcon)},
    ]
  },
  {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '16px'}}},
  {label: '高级', key: 'type-group-4', icon: renderIcon(BookIcon),
    children: [
      {label: '网络', key: 'type-group-4-1', icon: renderIcon(BookIcon)},
      {label: 'API密钥', key: 'type-group-4-2', icon: renderIcon(BookIcon)},
      {label: '日志', key: 'type-group-4-3', icon: renderIcon(BookIcon)},
      {label: '通知', key: 'type-group-4-4', icon: renderIcon(BookIcon)},
      {label: '插件', key: 'type-group-4-5', icon: renderIcon(BookIcon),
        children: [
          {label: '我的插件', key: 'type-group-4-5-1', icon: renderIcon(BookIcon)},
          {label: '目录', key: 'type-group-4-5-2', icon: renderIcon(BookIcon)},
          {label: '存储库', key: 'type-group-4-5-3', icon: renderIcon(BookIcon)},
        ]
      },
      {label: '计划任务', key: 'type-group-4-6', icon: renderIcon(BookIcon)},
    ]
  }
]
watch(() => store_app_configs_info.server_setting_select_tab_name, async (newValue) => {

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
          :style="{ width: 'calc(100vw - ' + (80 - 9 + 66) + 'px)'}">
        <n-layout has-sider
                  style="
                  margin-left: -24px;margin-top: -10px;
                  height: calc(100vh - 180px);">
          <n-layout-sider >
            <n-menu
              v-model:value="store_app_configs_info.server_setting_select_tab_name"
              :icon-size="18"
              :options="menuOptions"
            />
          </n-layout-sider>
          <n-layout embedded style="overflow-y: auto;">
            <div style="margin-left: 20px;margin-top: 10px;">
              <!--服务器-->
              <n-space vertical
                       v-if="store_app_configs_info.server_setting_select_tab_name === 'type-group-1-1'"
              >
                服务器 >
                <n-card style="width: 540px;height: 120px;">

                </n-card>
                <n-space>
                  <n-button>dd</n-button>
                  <n-button>dd</n-button>
                  <n-button>dd</n-button>
                </n-space>
                活动的设备 >
                <n-card style="width: 200px;height: 160px;">

                </n-card>
                活动 >
                <n-card style="width: 680px;height: 120px;">

                </n-card>
                警告 >
                <n-card style="width: 680px;height: 40px;">

                </n-card>
                路径 >
                <n-card style="width: 680px;height: 120px;">

                </n-card>
                <br>
              </n-space>
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