<script setup lang="ts">
import { usePlayerAudioStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAudioStore'
import { usePlayerAppearanceStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAppearanceStore'
import { usePlayerSettingStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerSettingStore'
import { RepeatOneRound } from '@vicons/material'

const playerSettingStore = usePlayerSettingStore()
import { Random } from '@vicons/fa'
import {
  Pause,
  Play,
  PlayBack,
  PlayForward,
  VolumeMedium,
  VolumeOff,
  ChevronDown,
} from '@vicons/ionicons5'
import { ArrowRepeatAll16Regular } from '@vicons/fluent'
import { NIcon, NSlider } from 'naive-ui'
import { storeToRefs } from 'pinia'

// 在setup上下文中获取Store实例
const playerAppearanceStore = usePlayerAppearanceStore()
const playerAudioStore = usePlayerAudioStore()
// 使用 storeToRefs 解构出所需的响应式属性
const {
  player_background_model_num,
  player_collapsed_action_bar_of_Immersion_model,
  player_collapsed_album,
  player_show_complete,
  player_show_click,
} = storeToRefs(playerAppearanceStore)

const {
  page_top_album_image_url,
  this_audio_song_name,
  this_audio_artist_name,
  this_audio_album_name,
} = storeToRefs(playerAudioStore)

function getAssetImage(firstImage: string) {
  return new URL(firstImage, import.meta.url).href
}
</script>

<template>
  <n-space
    vertical
    align="center"
    :style="{
      marginTop: player_background_model_num === 0 ? '0px' : '100px',
      opacity: player_background_model_num === 0 ? 1 : 0,
      position: player_background_model_num === 0 ? 'relative' : 'absolute',
      left: player_background_model_num === 0 ? '0' : '-100%',
      transition: 'margin 0.4s, opacity 0.8s',
    }"
    style="margin-right: 1vw"
  >
    <img
      :style="{
        marginTop: player_collapsed_action_bar_of_Immersion_model
          ? 'calc(28vh - 182px)'
          : 'calc(28vh - 182px)',
        transition: 'margin 0.4s, height 0.4s',
      }"
      style="
        width: 55vh;
        height: 55vh;
        border-radius: 12px;
        object-fit: cover;
        object-position: center;
        box-shadow:
          0 0 12px rgba(0, 0, 0, 0.2),
          0 0 12px rgba(0, 0, 0, 0.2);
      "
      :src="getAssetImage(page_top_album_image_url)"
      alt=""
    />
    <n-space vertical style="width: 55vh">
      <div
        style="
          width: 55vh;
          margin-top: -2px;
          color: #e7e5e5;
          font-weight: 900;
          font-size: calc(2.2vh + 4px);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: left;
        "
      >
        {{ this_audio_song_name }}
      </div>
      <div
        style="
          width: 40vh;
          margin-top: -6px;
          color: #989292;
          font-weight: 550;
          font-size: calc(1.4vh + 4px);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: left;
        "
      >
        {{ this_audio_artist_name }} -
        {{ this_audio_album_name }}
      </div>
    </n-space>
    <!--  -->
    <n-space vertical v-if="!player_collapsed_album">
      <n-space justify="end" style="width: 55vh; margin-top: -29px">
        <n-space>
          {{ playerSettingStore.current_play_time }}
        </n-space>
        :
        <n-space>
          {{ playerSettingStore.total_play_time }}
        </n-space>
      </n-space>
      <n-slider
        style="
          width: 55vh;
          --n-fill-color: #ffffff;
          --n-fill-color-hover: #ffffff;
          --n-rail-height: 4px;
          --n-handle-size: 20px;
          margin-top: -12px;
          border-radius: 10px;
        "
        v-model:value="playerSettingStore.slider_singleValue"
        :min="0"
        :max="100"
        :format-tooltip="
          (value) => {
            return playerSettingStore.formatTime(
              (value / 100) * playerSettingStore.player.isDuration
            )
          }
        "
        :on-dragend="
          () => {
            if (
              playerSettingStore.slider_singleValue >= 99.5 ||
              playerSettingStore.slider_singleValue == 0
            ) {
              playerSettingStore.player_is_play_ended = true
              playerSettingStore.play_go_duration(playerSettingStore.slider_singleValue, true)
            }
            playerSettingStore.player_range_duration_isDragging = false
          }
        "
        @click="
          () => {
            playerSettingStore.play_go_duration(playerSettingStore.slider_singleValue, true)
          }
        "
        @mousedown="playerSettingStore.player_range_duration_isDragging = true"
        @mouseup="playerSettingStore.player_range_duration_isDragging = false"
      >
        <template #thumb>
          <n-icon-wrapper color="white" :size="12" />
        </template>
      </n-slider>
    </n-space>
    <!--  -->
    <n-space v-if="false" justify="center" align="center" style="margin-top: -2px">
      <n-button
        quaternary
        round
        @click="
          () => {
            if (player_show_complete) {
              player_show_click = true
            }
          }
        "
      >
        <template #icon>
          <n-icon size="26" :depth="3"><ChevronDown /></n-icon>
        </template>
      </n-button>
      <n-button
        quaternary
        round
        size="small"
        @click="
          () => {
            if (playerSettingStore.play_order != 'playback-4') {
              playerSettingStore.play_order = 'playback-4'
            } else {
              playerSettingStore.play_order = 'playback-1'
            }
          }
        "
        @mouseover="playerSettingStore.drawer_order_show = true"
      >
        <template #icon>
          <n-icon :size="20">
            <Random color="#42d883" v-if="playerSettingStore.play_order === 'playback-4'" />
            <Random v-else />
          </n-icon>
        </template>
      </n-button>
      <n-button
        quaternary
        round
        size="small"
        @click="playerSettingStore.player_click_state_of_play_skip_back = true"
      >
        <template #icon>
          <n-icon :size="26"><PlayBack /></n-icon>
        </template>
      </n-button>
      <n-dropdown
        trigger="hover"
        placement="top"
        :options="[
          {
            label: '播放 / 暂停',
            key: 'marina bay sands',
          },
        ]"
      >
        <n-button quaternary round @click="playerSettingStore.player_click_state_of_play = true">
          <template #icon>
            <n-icon v-if="playerSettingStore.player.isPlaying" :size="36"><Pause /></n-icon>
            <n-icon v-else :size="36"><Play /></n-icon>
          </template>
        </n-button>
      </n-dropdown>
      <n-button
        quaternary
        round
        size="small"
        @click="playerSettingStore.player_click_state_of_play_skip_forward = true"
      >
        <template #icon>
          <n-icon :size="26"><PlayForward /></n-icon>
        </template>
      </n-button>
      <n-button
        quaternary
        round
        size="small"
        @click="
          () => {
            const play_order = playerSettingStore.play_order
            if (play_order === 'playback-4') {
              playerSettingStore.play_order = 'playback-1'
            } else if (play_order === 'playback-1') {
              playerSettingStore.play_order = 'playback-2'
            } else if (play_order === 'playback-2') {
              playerSettingStore.play_order = 'playback-3'
            } else if (play_order === 'playback-3') {
              playerSettingStore.play_order = 'playback-1'
            }
          }
        "
        @mouseover="playerSettingStore.drawer_order_show = true"
      >
        <template #icon>
          <n-icon :size="26">
            <ArrowRepeatAll16Regular
              v-if="
                playerSettingStore.play_order !== 'playback-2' &&
                playerSettingStore.play_order !== 'playback-3'
              "
            />
            <ArrowRepeatAll16Regular
              color="#42d883"
              v-else-if="playerSettingStore.play_order === 'playback-2'"
            />
            <RepeatOneRound
              color="#42d883"
              v-else-if="playerSettingStore.play_order === 'playback-3'"
            />
          </n-icon>
        </template>
      </n-button>
      <n-button
        quaternary
        round
        size="small"
        @click="
          () => {
            if (playerSettingStore.play_volume === 0) {
              playerSettingStore.play_volume = 100
            } else {
              playerSettingStore.play_volume = 0
            }
          }
        "
      >
        <template #icon>
          <n-icon :size="26" v-if="playerSettingStore.play_volume != 0"><VolumeMedium /></n-icon>
          <n-icon :size="26" v-else><VolumeOff /></n-icon>
        </template>
      </n-button>
    </n-space>
    <n-space v-if="false" justify="end" style="width: 55vh">
      <n-slider
        style="
          width: calc(55vh / 2 - 6px);
          border-radius: 10px;
          --n-fill-color: #ffffff60;
          --n-fill-color-hover: #ffffff60;
          --n-rail-height: 4px;
          --n-handle-size: 8px;
        "
        v-model:value="playerSettingStore.play_volume"
        :min="0"
        :max="100"
        :keyboard="true"
      />
    </n-space>
  </n-space>
</template>

<style scoped></style>
