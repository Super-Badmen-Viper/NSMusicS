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
    <div style="font-weight: 600;font-size: 16px;margin-bottom: 4px;">
      {{ $t('page.setting.hotkeysTab') }} >
    </div>
      <n-space vertical>
        <span style="font-weight: bold;font-size: 24px;">
          {{ $t('common.comingSoon') }}
        </span>
      </n-space>
      <br>
    </n-space>
  </n-scrollbar>
</template>

<style scoped>

</style>