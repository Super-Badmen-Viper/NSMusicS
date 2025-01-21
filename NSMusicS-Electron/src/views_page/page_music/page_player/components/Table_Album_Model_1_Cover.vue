<script setup lang="ts">
import {store_player_audio_info} from "@/views_page/page_music/page_player/store/store_player_audio_info";
import {store_player_appearance} from "@/views_page/page_music/page_player/store/store_player_appearance";
import {store_player_audio_logic} from "@/views_page/page_music/page_player/store/store_player_audio_logic";
import {RepeatOneRound} from "@vicons/material";
import {Random} from "@vicons/fa";
import {Pause, Play, PlayBack, PlayForward, VolumeMedium, VolumeOff, ChevronDown} from "@vicons/ionicons5";
import {ArrowRepeatAll16Regular} from "@vicons/fluent";
import {NIcon, NSlider} from "naive-ui";
function getAssetImage(firstImage: string) {
  return new URL(firstImage, import.meta.url).href;
}
</script>

<template>
  <n-space vertical
           align="center"
           :style="{
              marginTop: store_player_appearance.player_background_model_num === 0 ? '0px' : '100px',
              opacity: store_player_appearance.player_background_model_num === 0 ? 1 : 0,
              position: store_player_appearance.player_background_model_num === 0 ? 'relative' : 'absolute',
              left: store_player_appearance.player_background_model_num === 0 ? '0' : '-100%',
              transition: 'margin 0.4s, opacity 0.8s'
           }"
           style="margin-right: 1vw;"
  >
    <img
      :style="{
        marginTop: store_player_appearance.player_collapsed_action_bar_of_Immersion_model ? 'calc(28vh - 182px)' : 'calc(28vh - 182px)',
        transition: 'margin 0.4s, height 0.4s'
      }"
      style="
        width: 55vh;height: 55vh;
        border-radius: 12px;
        object-fit: cover;object-position: center;
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.20), 0 0 12px rgba(0, 0, 0, 0.20);
      "
      :src="getAssetImage(store_player_audio_info.page_top_album_image_url)"
      alt=""/>
    <n-space vertical align="center"
             style="width: 44vh;">
      <div
          style="
            width: 44vh;margin-top: -2px;
            color: #E7E5E5;
            font-weight: 900;font-size: calc(2.2vh + 4px);
            overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
            text-align: center;">
        {{ store_player_audio_info.this_audio_song_name }}
      </div>
      <div
          style="
            width: 36vh;
            margin-top: -6px;
            color: #989292;font-weight: 550;font-size: calc(1.4vh + 4px);
            overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
            text-align: center;">
        {{ store_player_audio_info.this_audio_artist_name }} -  {{ store_player_audio_info.this_audio_album_name }}
      </div>
    </n-space>
    <!--  -->
    <n-space
      vertical
      v-if="!store_player_appearance.player_collapsed_album">
      <n-space justify="space-between" style="width: 55vh;margin-top: -20px;">
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
          margin-top: -12px;
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
        @mouseup="store_player_audio_logic.player_range_duration_isDragging = false">
        <template #thumb>
          <n-icon-wrapper :size="0" />
        </template>
      </n-slider>
    </n-space>
    <!--  -->
    <n-space v-if="false" justify="center" align="center"
             style="margin-top: -2px;">
      <n-button quaternary round
                @click="()=>{
                if(store_player_appearance.player_show_complete){
                  store_player_appearance.player_show_click = true
                }
              }">
        <template #icon>
          <n-icon size="26" :depth="3"><ChevronDown/></n-icon>
        </template>
      </n-button>
      <n-button quaternary round size="small"
                @click="()=>{
                  if (store_player_audio_logic.play_order != 'playback-4') {
                    store_player_audio_logic.play_order = 'playback-4';
                  }else{
                    store_player_audio_logic.play_order = 'playback-1';
                  }
                }"
                @mouseover="store_player_audio_logic.drawer_order_show = true;">
        <template #icon>
          <n-icon :size="20">
            <Random color="#42d883" v-if="store_player_audio_logic.play_order === 'playback-4'"/>
            <Random v-else/>
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
        <n-button quaternary round @click="store_player_audio_logic.player_click_state_of_play = true">
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
                  const play_order = store_player_audio_logic.play_order;
                  if (play_order === 'playback-4') {
                    store_player_audio_logic.play_order = 'playback-1';
                  } else if (play_order === 'playback-1') {
                    store_player_audio_logic.play_order = 'playback-2';
                  } else if (play_order === 'playback-2') {
                    store_player_audio_logic.play_order = 'playback-3';
                  } else if (play_order === 'playback-3') {
                    store_player_audio_logic.play_order = 'playback-1';
                  }
                }"
                @mouseover="store_player_audio_logic.drawer_order_show = true;">
        <template #icon>
          <n-icon :size="26">
            <ArrowRepeatAll16Regular v-if="store_player_audio_logic.play_order !== 'playback-2' && store_player_audio_logic.play_order !== 'playback-3'"/>
            <ArrowRepeatAll16Regular color="#42d883" v-else-if="store_player_audio_logic.play_order === 'playback-2'"/>
            <RepeatOneRound color="#42d883" v-else-if="store_player_audio_logic.play_order === 'playback-3'"/>
          </n-icon>
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
    </n-space>
    <n-space v-if="false" justify="end"
             style="width: 55vh;">
      <n-slider
        style="
          width: calc(55vh / 2 - 6px);
          border-radius: 10px;
          --n-fill-color: #ffffff60;--n-fill-color-hover: #ffffff60;
          --n-rail-height: 4px;
          --n-handle-size: 8px;
        "
          v-model:value="store_player_audio_logic.play_volume"
          :min="0" :max="100" :keyboard="true"
      />
    </n-space>
  </n-space>
</template>

<style scoped>

</style>