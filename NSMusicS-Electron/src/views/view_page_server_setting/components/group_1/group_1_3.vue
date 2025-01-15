<script setup lang="ts">
//////
import {
  MoreCircle32Regular
} from '@vicons/fluent'
//////
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
import {store_player_audio_info} from "@/store/player/store_player_audio_info";
import {NButton, NIcon} from "naive-ui";

//////
function getAssetImage(firstImage: string) {
  return new URL(firstImage, import.meta.url).href;
}
</script>

<template>
  <n-space vertical>
    <span style="font-weight: 600;font-size: 16px;">
      {{ $t('HeaderUser') }} >
    </span>
    <n-space vertical>
      <span style="font-size: 30px;font-weight: 800;">Not open || 未开放</span>
    </n-space>
    <div v-if="false">
    <n-space vertical>
      <!---->
      <n-button>
        {{ $t('ButtonAddUser') }}
      </n-button>
      <!---->
      <div style="width: 180px;height: 250px;">
        <n-space vertical style="margin-left: 10px;">
          <img
            style="width: 160px;border-radius: 8px;margin-top: 10px;margin-bottom: -14px;"
            :src="getAssetImage(store_player_audio_info.page_top_album_image_url)">
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
    </n-space>
    <br>
    </div>
  </n-space>
</template>
<style>

</style>