<script setup lang="ts">
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
import {store_player_audio_info} from "@/views/view_music/music_page/page_player/store/store_player_audio_info";
import {NButton, NIcon} from "naive-ui";
import {MoreCircle32Regular} from "@vicons/fluent";
</script>

<template>
  <n-space vertical>
    <span style="font-weight: 600;font-size: 16px;">
      {{ $t('TabServer') }} >
    </span>
    <n-space vertical>
      <span style="font-size: 30px;font-weight: 800;">Not open || 未开放</span>
    </n-space>
    <div v-if="false">
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
      <div style="width: 180px;height: 250px;">
        <n-space vertical style="margin-left: 10px;">
          <n-space vertical
                   style="border-radius: 8px;margin-right: 10px;background: #3DC3FF;height: 60px;">
            <n-space align="center" justify="space-between"
                     style="margin-left: 10px;margin-right: 4px;margin-bottom: -10px;">
              <span>xiang</span>
              <n-button quaternary circle>
                <template #icon>
                  <n-icon :size="20"><MoreCircle32Regular/></n-icon>
                </template>
              </n-button>
            </n-space>
            <span style="margin-left: 10px;">{{ $t('LastSeen') }}</span>
          </n-space>
        </n-space>
      </div>
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
    <n-card style="width: 680px;margin-left: 20px;">
      <n-space vertical>
        <span>
          {{ $t('LabelCache') }} >
        </span>
        <span>
          {{ $t('LabelLogs') }} >
        </span>
        <span>
          {{ $t('LabelMetadata') }} >
        </span>
        <span>
          {{ $t('LabelTranscodes') }} >
        </span>
        <span>
          {{ $t('LabelWeb') }} >
        </span>
      </n-space>
    </n-card>
    <br>
    </div>
  </n-space>
</template>
<style>

</style>