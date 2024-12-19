<script setup lang="ts">
import {store_player_audio_info} from "@/store/player/store_player_audio_info";
import {store_player_appearance} from "@/store/player/store_player_appearance";
import {store_player_audio_logic} from "@/store/player/store_player_audio_logic";
import {RepeatOneRound} from "@vicons/material";
import {Random} from "@vicons/fa";
import {Pause, Play, PlayBack, PlayForward, VolumeMedium, VolumeOff} from "@vicons/ionicons5";
import {ArrowAutofitDown24Regular, ArrowRepeatAll16Regular, ChevronDown12Filled} from "@vicons/fluent";
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
           align="center" style="margin-right: 2vw;"
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
          width: 44vh;
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
      <n-space justify="space-between" style="width: 55vh;">
        <n-space>
          {{ store_player_audio_logic.current_play_time }}
        </n-space>
        <n-space>
          {{ store_player_audio_logic.total_play_time }}
        </n-space>
      </n-space>
      <n-slider
          style="
            width: 55vh;
            --n-fill-color: #ffffff;--n-fill-color-hover: #ffffff;
            --n-rail-height: 4px;
            --n-handle-size: 20px;
            margin-top: -14px;
            border-radius: 10px;"
          v-model:value="store_player_audio_logic.slider_singleValue"
          :min="0" :max="100"
          :format-tooltip="(value) => {
            return store_player_audio_logic.formatTime(
              (value / 100) * store_player_audio_logic.player.isDuration
            );
          }"
          :on-dragend="()=>{
            if(store_player_audio_logic.slider_singleValue >= 99.5 || store_player_audio_logic.slider_singleValue == 0){
              store_player_audio_logic.player_is_play_ended = true;
              store_player_audio_logic.play_go_duration(store_player_audio_logic.slider_singleValue,true);
            }
            store_player_audio_logic.player_range_duration_isDragging = false;
          }"
          @click="()=>{
            store_player_audio_logic.play_go_duration(store_player_audio_logic.slider_singleValue,true);
          }"
          @mousedown="store_player_audio_logic.player_range_duration_isDragging = true"
          @mouseup="store_player_audio_logic.player_range_duration_isDragging = false"
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
      <n-space style="width: calc((55vh - 310px) / 2);">
        <n-button quaternary size="medium"
                  style="margin-left: -12px;"
                  @click="()=>{
                  if(store_player_appearance.player_show_complete){
                    store_player_appearance.player_show_click = true
                  }
                }">
          <template #icon>
            <n-icon size="30" :depth="3" style="margin-bottom: 6px;"><ChevronDown12Filled/></n-icon>
          </template>
        </n-button>
      </n-space>
      <n-button quaternary round size="small"
                @click="store_player_audio_logic.player_click_state_of_order = true"
                @mouseover="store_player_audio_logic.drawer_order_show = true;">
        <template #icon>
          <n-icon :size="26" v-if="store_player_audio_logic.play_order === 'playback-1'">
            <ArrowAutofitDown24Regular/>
          </n-icon>
          <n-icon :size="26" v-else-if="store_player_audio_logic.play_order === 'playback-2'">
            <ArrowRepeatAll16Regular/>
          </n-icon>
          <n-icon :size="26" v-else-if="store_player_audio_logic.play_order === 'playback-3'">
            <RepeatOneRound/>
          </n-icon>
          <n-icon :size="20" v-else-if="store_player_audio_logic.play_order === 'playback-4'">
            <Random/>
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
      <n-button quaternary round size="small"
                @click="()=>{
                  if(store_player_audio_logic.play_volume === 0){
                    store_player_audio_logic.play_volume = 100;
                  }else{
                    store_player_audio_logic.play_volume = 0;
                  }
                }">
        <template #icon>
          <n-icon :size="26" v-if="store_player_audio_logic.play_volume != 0"><VolumeMedium/></n-icon>
          <n-icon :size="26" v-else><VolumeOff/></n-icon>
        </template>
      </n-button>
      <n-slider
          style="
          width: calc((55vh - 310px) / 2);
          border-radius: 10px;
          --n-fill-color: #ffffff20;--n-fill-color-hover: #ffffff20;
          --n-rail-height: 6px;
          --n-handle-size: 10px;
          margin-top: -1px;
        "
          v-model:value="store_player_audio_logic.play_volume"
          :min="0" :max="100" :keyboard="true"
      />
    </n-space>
  </n-space>
</template>

<style scoped>

</style>