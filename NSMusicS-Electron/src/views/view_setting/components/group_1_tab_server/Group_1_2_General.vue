<script setup lang="ts">
import {store_app_configs_info} from "@/data/data_stores/app/store_app_configs_info";
</script>

<template>
  <n-space vertical>
    <div style="font-weight: 600;font-size: 16px;margin-bottom: 4px;">
      {{ $t('Settings') }} >
    </div>
    
    <n-space vertical>
      <!---->
      <n-space align="center">
        <span style="font-size: 16px;font-weight: 600;">{{ $t('LabelServerName') }}</span>
        <n-input style="width: 400px;"/>
      </n-space>
      <span style="font-size: 13px;margin-left: 0px;">{{ $t('LabelServerNameHelp') }}</span>
    </n-space>

    <n-space vertical style="margin-bottom: 20px;">
      <div style="font-weight: 600;font-size: 16px;margin-bottom: 4px;">
        {{ $t('LabelPath') }} >
      </div>
      <n-space vertical>
        <!---->
        <n-space align="center">
          <span style="font-size: 16px;font-weight: 600;">{{ $t('LabelCachePath') }}</span>
          <n-input style="width: 400px;"/>
        </n-space>
        <span style="font-size: 13px;margin-left: 0px;">{{ $t('LabelCachePathHelp') }}</span>
        <!---->
        <n-space align="center">
          <span style="font-size: 16px;font-weight: 600;">{{ $t('LabelMetadataPath') }}</span>
          <n-input style="width: 400px;"/>
        </n-space>
        <span style="font-size: 13px;margin-left: 0px;">{{ $t('LabelMetadataPathHelp') }}</span>
      </n-space>
    </n-space>
  </n-space>
</template>
<style>

</style>