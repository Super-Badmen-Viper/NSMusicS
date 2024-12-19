<script setup lang="ts">
import {store_player_audio_info} from "@/store/player/store_player_audio_info";
import {store_player_appearance} from "@/store/player/store_player_appearance";
import {store_player_audio_logic} from "@/store/player/store_player_audio_logic";
import {RepeatOneRound} from "@vicons/material";
import {Random} from "@vicons/fa";
import {Pause, Play, PlayBack, PlayForward, VolumeMedium} from "@vicons/ionicons5";
import {ArrowAutofitDown24Regular, ArrowRepeatAll16Regular} from "@vicons/fluent";
import {NIcon, NSlider} from "naive-ui";
function getAssetImage(firstImage: string) {
  if(process.platform === 'win32')
    return new URL(firstImage, import.meta.url).href;
  else if(process.platform === 'darwin')
    return new URL(firstImage, import.meta.url).href;
  else if(process.platform === 'linux')
    return new URL(firstImage, import.meta.url).href;
}
</script>

<template>
  <n-space vertical
           align="center" style="margin-right: 2vw;margin-top: 30px;"
  >
    <img
        style="
          width: 55vh;height: 55vh;
          margin-top: calc(28vh - 182px);
          border-radius: 10px;
          object-fit: cover;object-position: center;
        "
        :src="getAssetImage(store_player_audio_info.page_top_album_image_url)"
        alt="">
    <div
        style="
          width: 50vh;
          color: #E7E5E5;
          font-weight: 900;font-size: 22px;
          overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
          text-align: center;">
      {{ store_player_audio_info.this_audio_song_name }}
    </div>
    <div
        style="
          width: 36vh;margin-top: -6px;margin-bottom: -6px;
          color: #989292;font-weight: 550;font-size: 18px;
          overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
          text-align: center;">
      {{ store_player_audio_info.this_audio_artist_name }} -  {{ store_player_audio_info.this_audio_album_name }}
    </div>
    <!--  -->
    <n-space
        vertical
        v-if="!store_player_appearance.player_collapsed_album"
        style="margin-top: -12px;">
      <n-space justify="space-between" style="width: 50vh;">
        <n-space>
          {{ store_player_audio_logic.current_play_time }}
        </n-space>
        <n-space>
          {{ store_player_audio_logic.total_play_time }}
        </n-space>
      </n-space>
      <n-slider
          style="
                          width: 50vh;
                          --n-fill-color: #ffffff;--n-fill-color-hover: #ffffff;
                          --n-rail-height: 4px;
                          margin-top: -14px;
                          border-radius: 10px;"
          :value="store_player_audio_logic.slider_singleValue"
          :min="0" :max="100" :tooltip="false"
      >
        <template #thumb>
          <n-icon-wrapper :size="0" />
        </template>
      </n-slider>
    </n-space>
    <!--  -->
    <n-space justify="center"
             align="center"
             style="margin-top: 0px;">
      <n-button quaternary round size="small"
                @click="store_player_audio_logic.player_click_state_of_order = true"
                @mouseover="store_player_audio_logic.drawer_order_show = true;">
        <template #icon>
          <n-icon :size="26" v-if="store_player_audio_logic.play_order === 'playback-1'">
            <ArrowAutofitDown24Regular color="#989292" />
          </n-icon>
          <n-icon :size="26" v-else-if="store_player_audio_logic.play_order === 'playback-2'">
            <ArrowRepeatAll16Regular color="#989292" />
          </n-icon>
          <n-icon :size="26" v-else-if="store_player_audio_logic.play_order === 'playback-3'">
            <RepeatOneRound color="#989292" />
          </n-icon>
          <n-icon :size="20" v-else-if="store_player_audio_logic.play_order === 'playback-4'">
            <Random color="#989292" />
          </n-icon>
        </template>
      </n-button>
      <n-button quaternary round size="small" @click="store_player_audio_logic.player_click_state_of_play_skip_back = true">
        <template #icon>
          <n-icon :size="26"><PlayBack/></n-icon>
        </template>
      </n-button>
      <n-dropdown
        trigger="hover"
        placement="top-center"
        :options="[{
          label: '播放 / 暂停',
          key: 'marina bay sands'}]">
        <n-button quaternary round size="medium" @click="store_player_audio_logic.player_click_state_of_play = true">
          <template #icon>
            <n-icon v-if="store_player_audio_logic.player.isPlaying" :size="36"><Pause/></n-icon>
            <n-icon v-else :size="36"><Play/></n-icon>
          </template>
        </n-button>
      </n-dropdown>
      <n-button quaternary round size="small" @click="store_player_audio_logic.player_click_state_of_play_skip_forward = true">
        <template #icon>
          <n-icon :size="26"><PlayForward/></n-icon>
        </template>
      </n-button>
      <n-button quaternary round size="small" @click="backpanel_voice_click">
        <template #icon>
          <n-icon :size="26"><VolumeMedium color="#989292" /></n-icon>
        </template>
      </n-button>
    </n-space>
  </n-space>
</template>

<style scoped>

</style>