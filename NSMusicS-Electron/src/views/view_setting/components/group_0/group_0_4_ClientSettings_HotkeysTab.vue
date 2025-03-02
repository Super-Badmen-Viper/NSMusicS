<script setup lang="ts">
////// this_view resource of vicons_svg

////// i18n auto lang
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true
})
</script>

<template>
  <n-scrollbar style="overflow-y: auto;margin-top: 9px;" >
    <n-space vertical>
      <n-space v-if="false" justify="space-between" align="center">
        <n-space vertical>
          <span style="font-size:16px;font-weight: 600;">{{ $t('setting.globalMediaHotkeys') }}</span>
          <div style="margin-top: -10px;">
            <span style="font-size:12px;">{{ $t('setting.globalMediaHotkeys_description') }}</span>
          </div>
        </n-space>
        <n-switch
            v-model:value="disabled">
        </n-switch>
      </n-space>
      <n-divider style="margin: 0;"/>
      <n-space v-if="false" justify="space-between" align="center">
        <n-space vertical>
          <span style="font-size:16px;font-weight: 600;">{{ $t('setting.applicationHotkeys') }}</span>
          <div style="margin-top: -10px;">
            <span style="font-size:12px;">{{ $t('setting.applicationHotkeys_description') }}</span>
          </div>
        </n-space>
      </n-space>
    </n-space>
  </n-scrollbar>
</template>

<style scoped>

</style>