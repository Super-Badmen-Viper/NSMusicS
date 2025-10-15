<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true,
})
const computed_i18n_Label_SidebarConfiguration_8 = computed(() => t('page.appMenu.manageServers'))
const computed_i18n_Label_SidebarConfiguration_9 = computed(() => t('HeaderLibraries'))
const computed_i18n_Label_SidebarConfiguration_10 = computed(() =>
  t('nsmusics.siderbar_menu.karaoke')
)
const computed_i18n_Label_SidebarConfiguration_11 = computed(() =>
  t('nsmusics.siderbar_menu.guessLike')
)
const computed_i18n_Label_SidebarConfiguration_12 = computed(() =>
  t('nsmusics.siderbar_menu.identifyMedia')
)
const computed_i18n_Label_SidebarConfiguration_13 = computed(() =>
  t('nsmusics.siderbar_menu.scoreGeneration')
)
const computed_i18n_Label_SidebarConfiguration_14 = computed(() =>
  t('nsmusics.siderbar_menu.lyricsProduction')
)
const computed_i18n_Label_SidebarConfiguration_15 = computed(() =>
  t('nsmusics.siderbar_menu.musicCommunity')
)

////// this_view views_components
import { store_app_configs_info } from '@/data/data_stores/app/store_app_configs_info'
import { ref, onMounted, computed } from 'vue'
import { NButton } from 'naive-ui'
import { store_player_audio_logic } from '@/views/view_app/page/page_player/store/store_player_audio_logic'
import { store_app_configs_logic_theme } from '@/data/data_stores/app/store_app_configs_logic_theme'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
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
  if (store_app_configs_info.update_theme) theme_value.value = theme_options.value[1].value
  else theme_value.value = theme_options.value[0].value
})

import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'

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
]

/////// 设置：播放
const player_fade_model_options_selected = ref<{ label: any; value: any }>()
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
const player_gaplessAudio_kind = ref([
  { label: computed(() => t('common.no')), value: 'no' },
  { label: computed(() => t('common.yes')), value: 'yes' },
  { label: computed(() => t('setting.gaplessAudio_optionWeak')), value: 'weak' },
])
const player_replayGainMode_kind = ref([
  { label: 'Track', value: 'track' },
  { label: 'Album', value: 'album' },
  { label: computed(() => t('common.none')), value: 'no' },
])
onMounted(() => {
  if (store_player_audio_logic.player_fade_value > 0) {
    player_fade_model_options_selected.value = player_fade_model_options.value[1].value
  } else {
    player_fade_model_options_selected.value = player_fade_model_options.value[0].value
  }
  //
  if (store_player_audio_logic.player_gaplessAudio === 'no') {
    store_player_audio_logic.player_gaplessAudio = player_gaplessAudio_kind.value[0].value
  } else if (store_player_audio_logic.player_gaplessAudio === 'yes') {
    store_player_audio_logic.player_gaplessAudio = player_gaplessAudio_kind.value[1].value
  } else {
    store_player_audio_logic.player_gaplessAudio = player_gaplessAudio_kind.value[2].value
  }
  //
  if (store_player_audio_logic.player_replayGainMode === 'track') {
    store_player_audio_logic.player_replayGainMode = player_replayGainMode_kind.value[0].value
  } else if (store_player_audio_logic.player_replayGainMode === 'album') {
    store_player_audio_logic.player_replayGainMode = player_replayGainMode_kind.value[1].value
  } else {
    store_player_audio_logic.player_replayGainMode = player_replayGainMode_kind.value[2].value
  }
})
</script>

<template>
  <n-scrollbar style="overflow-y: auto; margin-top: 9px">
    <n-space vertical>
      <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px">
        {{ $t('page.setting.generalTab') }} >
      </div>
      <n-space justify="space-between" align="center">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{
            $t('setting.language') + ' | 语言'
          }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{
              $t('setting.language_description') + ' | 设置应用的语言'
            }}</span>
          </div>
        </n-space>
        <n-select
          v-model:value="$i18n.locale"
          :options="languages"
          style="width: 207px; margin-top: -4px"
          @update:value="
            () => {
              store_app_configs_info.lang = $i18n.locale
              store_player_audio_logic.orderPanelWidath =
                store_player_audio_logic.langWidths[store_app_configs_info.lang.toString()]
              store_player_audio_logic.orderButonWidath =
                store_player_audio_logic.orderPanelWidath - 14
              if (isElectron) {
                ipcRenderer.invoke('i18n-tray-label-menu', [
                  t('player.play'),
                  t('player.pause'),
                  t('player.previous'),
                  t('player.next'),
                  t('nsmusics.view_page.desktop_lyrics'),
                  t('common.quit'),
                  t('nsmusics.siderbar_player.playback_1'),
                  t('nsmusics.siderbar_player.playback_2'),
                  t('nsmusics.siderbar_player.playback_3'),
                  t('nsmusics.siderbar_player.playback_4'),
                ])
              }
            }
          "
        />
      </n-space>
      <n-divider style="margin: 0" />
      <n-space justify="space-between" align="center">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{ $t('setting.theme') }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{ $t('setting.theme_description') }}</span>
          </div>
        </n-space>
        <n-select
          v-model:value="theme_value"
          :options="theme_options"
          @update:value="store_app_configs_logic_theme.update_theme(theme_value)"
          placeholder=""
          :reset-menu-on-options-change="false"
          style="width: 207px; margin-top: -4px"
        />
      </n-space>
      <n-space justify="space-between" align="center">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{
            $t('nsmusics.view_page.theme_automatic_switching')
          }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{
              $t('nsmusics.view_page.theme_automatic_switching_explain')
            }}</span>
          </div>
        </n-space>
        <n-switch v-model:value="store_app_configs_info.theme_auto_system"> </n-switch>
      </n-space>
      <n-divider style="margin: 0" />
      <n-space v-if="false" justify="space-between" align="center">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{
            $t('nsmusics.view_page.routerModel')
          }}</span>
        </n-space>
      </n-space>
      <n-space v-if="false" justify="space-between" align="center" style="margin-left: 30px">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{
            $t('nsmusics.view_page.routerModel_type_1')
          }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{
              $t('nsmusics.view_page.routerModel_type_1_explain')
            }}</span>
          </div>
        </n-space>
        <n-switch
          v-model:value="store_router_data_logic.clear_Memory_Model"
          @update:value="store_router_data_logic.get_clear_Memory_Model"
          :disabled="store_player_audio_logic.player_select === 'web'"
        >
        </n-switch>
      </n-space>
      <n-space v-if="false" justify="space-between" align="center" style="margin-left: 30px">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{
            $t('nsmusics.view_page.routerModel_type_2')
          }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{
              $t('nsmusics.view_page.routerModel_type_2_explain')
            }}</span>
          </div>
        </n-space>
        <n-switch
          v-model:value="store_router_data_logic.clear_Equilibrium_Model"
          @update:value="store_router_data_logic.get_clear_Equilibrium_Model"
          :disabled="store_player_audio_logic.player_select === 'web'"
        >
        </n-switch>
      </n-space>
      <n-space v-if="false" justify="space-between" align="center" style="margin-left: 30px">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{
            $t('nsmusics.view_page.routerModel_type_3')
          }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{
              $t('nsmusics.view_page.routerModel_type_3_explain')
            }}</span>
          </div>
        </n-space>
        <n-switch
          v-model:value="store_router_data_logic.clear_UserExperience_Model"
          @update:value="store_router_data_logic.get_clear_UserExperience_Model"
        >
        </n-switch>
      </n-space>
      <n-divider v-if="false" style="margin: 0" />
      <n-space
        v-if="false"
        vertical
        :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)' }"
      >
        <n-space justify="space-between" align="center">
          <n-space vertical>
            <span style="font-size: 16px; font-weight: 600">{{
              $t('setting.sidebarConfiguration')
            }}</span>
            <div style="margin-top: -10px">
              <span style="font-size: 12px">{{
                $t('setting.sidebarCollapsedNavigation_description')
              }}</span>
            </div>
          </n-space>
        </n-space>
        <n-grid :y-gap="8" :cols="4" style="margin-left: 2px">
          <n-gi v-if="false"
            ><n-checkbox
              v-model:checked="store_app_configs_info.menuOptions_selectd_model_1"
              :label="computed_i18n_Label_SidebarConfiguration_8"
          /></n-gi>
          <n-gi v-if="false"
            ><n-checkbox
              v-model:checked="store_app_configs_info.menuOptions_selectd_model_1"
              :label="computed_i18n_Label_SidebarConfiguration_9"
          /></n-gi>
          <n-gi v-if="false"></n-gi>
          <n-gi v-if="false"></n-gi>
          <n-gi
            ><n-checkbox
              v-model:checked="store_app_configs_info.menuOptions_selectd_model_2"
              :label="computed_i18n_Label_SidebarConfiguration_10"
          /></n-gi>
          <n-gi></n-gi>
          <n-gi></n-gi>
          <n-gi></n-gi>
          <n-gi
            ><n-checkbox
              v-model:checked="store_app_configs_info.menuOptions_selectd_model_3"
              :label="computed_i18n_Label_SidebarConfiguration_11"
          /></n-gi>
          <n-gi
            ><n-checkbox
              v-model:checked="store_app_configs_info.menuOptions_selectd_model_3"
              :label="computed_i18n_Label_SidebarConfiguration_12"
          /></n-gi>
          <n-gi
            ><n-checkbox
              v-model:checked="store_app_configs_info.menuOptions_selectd_model_3"
              :label="computed_i18n_Label_SidebarConfiguration_13"
          /></n-gi>
          <n-gi
            ><n-checkbox
              v-model:checked="store_app_configs_info.menuOptions_selectd_model_3"
              :label="computed_i18n_Label_SidebarConfiguration_14"
          /></n-gi>
          <n-gi
            ><n-checkbox
              v-model:checked="store_app_configs_info.menuOptions_selectd_model_4"
              :label="computed_i18n_Label_SidebarConfiguration_15"
          /></n-gi>
        </n-grid>
      </n-space>
      <n-divider v-if="false" style="margin: 0" />
      <n-space v-if="false" justify="space-between" align="center">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{ $t('setting.clearQueryCache') }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{ $t('setting.clearQueryCache_description') }}</span>
          </div>
        </n-space>
        <n-button>
          {{ $t('common.clear') }}
        </n-button>
      </n-space>
      <n-space v-if="false" justify="space-between" align="center">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{ $t('setting.clearCache') }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{ $t('setting.clearCache_description') }}</span>
          </div>
        </n-space>
        <n-button>
          {{ $t('common.clear') }}
        </n-button>
      </n-space>
    </n-space>
  </n-scrollbar>
</template>

<style scoped></style>
