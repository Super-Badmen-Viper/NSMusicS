group_1_5_1.vue<script setup lang="ts">
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
</script>

<template>
  <n-space vertical>
    <span style="font-weight: 600;font-size: 16px;">
      {{ $t('TabServer') }} >
    </span>
    <n-card style="width: 540px;height: 120px;">

    </n-card>
    <n-space>
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
    <n-card style="width: 200px;height: 160px;">

    </n-card>
    <span style="font-weight: 600;font-size: 16px;">
      {{ $t('HeaderActivity') }} >
    </span>
    <n-card style="width: 680px;height: 120px;">

    </n-card>
    <span style="font-weight: 600;font-size: 16px;">
      {{ $t('Alerts') }} >
    </span>
    <n-card style="width: 680px;height: 40px;">

    </n-card>
    <span style="font-weight: 600;font-size: 16px;">
      {{ $t('HeaderPaths') }} >
    </span>
    <n-card style="width: 680px;height: 120px;">

    </n-card>
    <br>
  </n-space>
</template>
<style>

</style>