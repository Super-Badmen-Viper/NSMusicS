<script setup lang="ts">
////// i18n auto lang
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true,
})

////// this_view views_components
import { store_app_configs_info } from '@/data/data_stores/app_stores/store_app_configs_info'
import { ref, onMounted, computed } from 'vue'
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

const player_lyric_panel_fontfamily_options_selected = ref<{ label: any; value: any }>()
const player_lyric_panel_fontfamily_options = ref([
  {
    label: 'Drive My Car',
    value: 'song1',
  },
])
</script>

<template>
  <n-scrollbar style="overflow-y: auto; margin-top: 9px">
    <n-space vertical>
      <n-space vertical>
        <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px">
          {{ $t('page.setting.windowTab') }} >
        </div>
        <n-space vertical>
          <span style="font-size: 24px; font-weight: 800">Not open || 未开放</span>
        </n-space>
        <br />
      </n-space>
      <n-space v-if="false" justify="space-between" align="center">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{ $t('setting.windowBarStyle') }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{ $t('setting.windowBarStyle_description') }}</span>
          </div>
        </n-space>
        <n-select
          v-model:value="player_lyric_panel_fontfamily_options_selected"
          :options="player_lyric_panel_fontfamily_options"
          :disabled="store_app_configs_info.desktop_system_kind === 'docker'"
          placeholder="not enabled"
          :reset-menu-on-options-change="false"
          style="width: 207px; margin-top: -4px"
        />
      </n-space>
      <n-space v-if="false" justify="space-between" align="center">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{ $t('setting.minimizeToTray') }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{ $t('setting.minimizeToTray_description') }}</span>
          </div>
        </n-space>
        <n-switch v-model:value="disabled"> </n-switch>
      </n-space>
      <n-space v-if="false" justify="space-between" align="center">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{ $t('setting.exitToTray') }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{ $t('setting.exitToTray_description') }}</span>
          </div>
        </n-space>
        <n-switch v-model:value="disabled"> </n-switch>
      </n-space>
      <n-space v-if="false" justify="space-between" align="center">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{ $t('setting.startMinimized') }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{ $t('setting.startMinimized_description') }}</span>
          </div>
        </n-space>
        <n-switch v-model:value="disabled"> </n-switch>
      </n-space>
      <n-space v-if="false" justify="space-between" align="center">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{
            $t('setting.disableAutomaticUpdates')
          }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{ $t('setting.disableAutomaticUpdates') }}</span>
          </div>
        </n-space>
        <n-switch v-model:value="disabled"> </n-switch>
      </n-space>
    </n-space>
  </n-scrollbar>
</template>

<style scoped></style>
