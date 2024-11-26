<script setup lang="ts">
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
</script>

<template>
  <n-space vertical>
    <span style="font-weight: 600;font-size: 16px;">
      {{ $t('TabServer') }} >
    </span>
    <n-card vertical style="width: 410px;margin-left: 20px;">
      <n-grid :y-gap="8" :cols="2" style="margin-left: 2px;">
        <!---->
        <n-gi>
          <span style="font-size: 16px;font-weight: 600;">
            {{ $t('LabelServerName') }}
          </span>
        </n-gi>
        <n-gi>
          <span style="font-size: 16px;font-weight: 600;">
            1.1.0
          </span>
        </n-gi>
        <!---->
        <n-gi>
          <span style="font-size: 16px;font-weight: 600;">
            {{ $t('LabelServerVersion') }}
          </span>
        </n-gi>
        <n-gi>
          <span style="font-size: 16px;font-weight: 600;">
            1.1.0
          </span>
        </n-gi>
        <!---->
        <n-gi>
          <span style="font-size: 16px;font-weight: 600;">
            {{ $t('LabelWebVersion') }}
          </span>
        </n-gi>
        <n-gi>
          <span style="font-size: 16px;font-weight: 600;">
            1.1.0
          </span>
        </n-gi>
        <!---->
        <n-gi>
          <span style="font-size: 16px;font-weight: 600;">
            {{ $t('LabelBuildVersion') }}
          </span>
        </n-gi>
        <n-gi>
          <span style="font-size: 16px;font-weight: 600;">
            1.1.0
          </span>
        </n-gi>
      </n-grid>
    </n-card>
    <n-space style="margin-left: 20px;">
      <n-button>
        {{ $t('ButtonScanAllLibraries') }}
      </n-button>
      <n-button>
        {{ $t('Restart') }}
      </n-button>
      <n-button>
        {{ $t('ButtonShutdown') }}
      </n-button>
    </n-space>
    <span style="font-weight: 600;font-size: 16px;">
      {{ $t('HeaderActiveDevices') }} >
    </span>
    <n-card style="width: 200px;height: 160px;margin-left: 20px;">

    </n-card>
    <span style="font-weight: 600;font-size: 16px;">
      {{ $t('HeaderActivity') }} >
    </span>
    <n-card style="width: 680px;height: 120px;margin-left: 20px;">

    </n-card>
    <span style="font-weight: 600;font-size: 16px;">
      {{ $t('Alerts') }} >
    </span>
    <n-card style="width: 680px;height: 40px;margin-left: 20px;">

    </n-card>
    <span style="font-weight: 600;font-size: 16px;">
      {{ $t('HeaderPaths') }} >
    </span>
    <n-card style="width: 680px;height: 120px;margin-left: 20px;">

    </n-card>
    <br>
  </n-space>
</template>
<style>

</style>