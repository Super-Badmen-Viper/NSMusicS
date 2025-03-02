<script setup lang="ts">
import {store_app_configs_info} from "@/data/data_stores/app/store_app_configs_info";
</script>

<template>
  <n-space vertical>
    <div style="font-weight: 600;font-size: 16px;margin-bottom: 4px;">
      {{ $t('Settings') }} >
    </div>
    <n-space vertical>
      <span style="font-size: 30px;font-weight: 800;">Not open || 未开放</span>
    </n-space>
    <div v-if="false">
    <n-space vertical style="margin-left: 20px;">
      <!---->
      <n-space align="center">
        <span style="font-size: 16px;font-weight: 600;">{{ $t('LabelServerName') }}</span>
        <n-input style="width: 400px;"/>
      </n-space>
      <span style="font-size: 13px;margin-left: 0px;">{{ $t('LabelServerNameHelp') }}</span>
      <!---->
      <n-space align="center">
        <span style="font-size: 16px;font-weight: 600;">{{ $t('LabelPreferredDisplayLanguage') }}</span>
        <n-input style="width: 400px;"/>
      </n-space>
      <span style="font-size: 13px;margin-left: 0px;">{{ $t('LabelDisplayLanguageHelp') }}</span>
    </n-space>
    <div style="font-weight: 600;font-size: 16px;margin-bottom: 4px;">
      {{ $t('LabelPath') }} >
    </div>
    <n-space vertical style="margin-left: 20px;">
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
    <div style="font-weight: 600;font-size: 16px;margin-bottom: 4px;">
      {{ $t('QuickConnect') }} >
    </div>
    <n-space vertical style="margin-left: 20px;">
      <!---->
      <n-space align="center">
        <n-checkbox/>
        <span style="font-size: 16px;font-weight: 600;">{{ $t('EnableQuickConnect') }}</span>
      </n-space>
    </n-space>
    <div style="font-weight: 600;font-size: 16px;margin-bottom: 4px;">
      {{ $t('HeaderBranding') }} >
    </div>
    <n-space vertical style="margin-left: 20px;">
      <!---->
      <n-space align="center">
        <span style="font-size: 16px;font-weight: 600;">{{ $t('LabelLoginDisclaimer') }}</span>
        <n-input style="width: 400px;"/>
      </n-space>
      <span style="font-size: 13px;margin-left: 0px;">{{ $t('LabelLoginDisclaimerHelp') }}</span>
      <!---->
      <n-space align="center">
        <span style="font-size: 16px;font-weight: 600;">{{ $t('LabelCustomCss') }}</span>
        <n-input style="width: 400px;"/>
      </n-space>
      <span style="font-size: 13px;margin-left: 0px;">{{ $t('LabelCustomCssHelp') }}</span>
    </n-space>
    <div style="font-weight: 600;font-size: 16px;margin-bottom: 4px;">
      {{ $t('HeaderPerformance') }} >
    </div>
    <n-space vertical style="margin-left: 20px;">
      <!---->
      <n-space align="center">
        <span style="font-size: 16px;font-weight: 600;">{{ $t('LibraryScanFanoutConcurrency') }}</span>
        <n-input style="width: 400px;"/>
      </n-space>
      <span style="font-size: 13px;margin-left: 0px;">{{ $t('LibraryScanFanoutConcurrencyHelp') }}</span>
      <!---->
      <n-space align="center">
        <span style="font-size: 16px;font-weight: 600;">{{ $t('LabelParallelImageEncodingLimit') }}</span>
        <n-input style="width: 400px;"/>
      </n-space>
      <span style="font-size: 13px;margin-left: 0px;">{{ $t('LabelParallelImageEncodingLimitHelp') }}</span>
    </n-space>
    <br>
    </div>
  </n-space>
</template>
<style>

</style>