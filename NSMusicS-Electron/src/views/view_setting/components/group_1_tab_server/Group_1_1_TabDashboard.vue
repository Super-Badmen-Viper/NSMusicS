<script setup lang="ts">
import { NButton } from 'naive-ui'
</script>

<template>
  <n-space vertical>
    <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px">{{ $t('TabServer') }} ></div>

    <n-space vertical style="margin-bottom: 20px">
      <n-card vertical style="width: 410px">
        <n-grid :y-gap="8" :cols="2" style="margin-left: 2px">
          <!---->
          <n-gi>
            <span style="font-size: 16px; font-weight: 600">
              {{ $t('LabelServerName') }}
            </span>
          </n-gi>
          <n-gi>
            <span style="font-size: 16px; font-weight: 600"> 1.1.0 </span>
          </n-gi>
          <!---->
          <n-gi>
            <span style="font-size: 16px; font-weight: 600">
              {{ $t('LabelServerVersion') }}
            </span>
          </n-gi>
          <n-gi>
            <span style="font-size: 16px; font-weight: 600"> 1.1.0 </span>
          </n-gi>
          <!---->
          <n-gi>
            <span style="font-size: 16px; font-weight: 600">
              {{ $t('LabelWebVersion') }}
            </span>
          </n-gi>
          <n-gi>
            <span style="font-size: 16px; font-weight: 600"> 1.1.0 </span>
          </n-gi>
          <!---->
          <n-gi>
            <span style="font-size: 16px; font-weight: 600">
              {{ $t('LabelBuildVersion') }}
            </span>
          </n-gi>
          <n-gi>
            <span style="font-size: 16px; font-weight: 600"> 1.1.0 </span>
          </n-gi>
        </n-grid>
      </n-card>
      <n-space>
        <n-button>
          {{ $t('ButtonScanAllLibraries') }}
        </n-button>
        <n-button>
          {{ $t('Restart') }}
        </n-button>
      </n-space>
    </n-space>

    <n-space vertical style="margin-bottom: 20px">
      <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px">
        {{ $t('HeaderActivity') }} >
      </div>
      <n-card style="width: 680px; height: 120px"> </n-card>
    </n-space>

    <n-space v-if="false" vertical style="margin-bottom: 20px">
      <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px">
        {{ $t('HeaderPaths') }} >
      </div>
      <n-card style="width: 680px">
        <n-space vertical>
          <span> {{ $t('LabelCache') }} > </span>
          <span> {{ $t('LabelLogs') }} > </span>
          <span> {{ $t('LabelMetadata') }} > </span>
          <span> {{ $t('LabelTranscodes') }} > </span>
          <span> {{ $t('LabelWeb') }} > </span>
        </n-space>
      </n-card>
    </n-space>
  </n-space>
</template>
<style></style>
