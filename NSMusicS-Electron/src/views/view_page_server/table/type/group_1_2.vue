<script setup lang="ts">
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
</script>

<template>
  <n-space vertical>
    <span style="font-weight: 600;font-size: 16px;">
      {{ $t('Settings') }} >
    </span>
    <n-space vertical>
      Not open || 未开放
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
    <span style="font-weight: 600;font-size: 16px;">
      {{ $t('LabelPath') }} >
    </span>
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
    <span style="font-weight: 600;font-size: 16px;">
      {{ $t('QuickConnect') }} >
    </span>
    <n-space vertical style="margin-left: 20px;">
      <!---->
      <n-space align="center">
        <n-checkbox/>
        <span style="font-size: 16px;font-weight: 600;">{{ $t('EnableQuickConnect') }}</span>
      </n-space>
    </n-space>
    <span style="font-weight: 600;font-size: 16px;">
      {{ $t('HeaderBranding') }} >
    </span>
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
    <span style="font-weight: 600;font-size: 16px;">
      {{ $t('HeaderPerformance') }} >
    </span>
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