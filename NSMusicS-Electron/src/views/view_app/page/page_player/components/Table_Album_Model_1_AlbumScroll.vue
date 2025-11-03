<script setup lang="ts">
import { usePlayerAppearanceStore } from '@/data/data_status/comment_status/player_store/usePlayerAppearanceStore'
import { usePlayerAudioStore } from '@/data/data_status/comment_status/player_store/usePlayerAudioStore'
import { usePlayerSettingStore } from '@/data/data_status/comment_status/player_store/usePlayerSettingStore'
import { NSlider } from 'naive-ui'

const playerSettingStore = usePlayerSettingStore()

import { usePlaylistStore } from '@/data/data_status/comment_status/playlist_store/usePlaylistStore'
import { storeToRefs } from 'pinia'

function getAssetImage(firstImage: string) {
  return new URL(firstImage, import.meta.url).href
}
import error_album from '@/assets/img/error_album.jpg'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
const handleImageError = async (event) => {
  const originalSrc = event.target.src
  let result_src = error_album
  if (isElectron) {
    try {
      const newImagePath = await ipcRenderer.invoke('window-get-imagePath', originalSrc)
      if (newImagePath.length > 0) {
        event.target.src = newImagePath
      } else {
        event.target.src = result_src
      }
    } catch (error) {
      console.error('Error handling image error:', error)
      event.target.src = result_src
    }
    ///
    const scroll_item: Media_File | undefined = playlistStore.playlist_MediaFiles_temporary.find(
      (mediaFile: Media_File) => mediaFile.id === playerAudioStore.this_audio_song_id
    )
    if (scroll_item != undefined && scroll_item != 'undefined') {
      scroll_item.medium_image_url = result_src
    }
    ///
    playerAudioStore.page_top_album_image_url = result_src
  } else {
    playerAudioStore.page_top_album_image_url = error_album
  }
}

import { ref, computed } from 'vue'

import { NCarousel, NCarouselItem } from 'naive-ui'

// 在setup上下文中获取Store实例
const playerAppearanceStore = usePlayerAppearanceStore()
const playlistStore = usePlaylistStore()
const playerAudioStore = usePlayerAudioStore()
// 使用 storeToRefs 解构出所需的响应式属性
const {
  player_background_model_num,
  player_collapsed_action_bar_of_Immersion_model,
  player_collapsed_album,
} = storeToRefs(playerAppearanceStore)

const { playlist_MediaFiles_temporary_carousel } = storeToRefs(playlistStore)

const {
  this_audio_Index_of_play_list_carousel,
  page_top_album_image_url,
  this_audio_song_name,
  this_audio_artist_name,
  this_audio_album_name,
} = storeToRefs(playerAudioStore)

const directionRef = ref('vertical')
const placementRef = ref('right')

const prevSlideStyle = computed(() => {
  return directionRef.value === 'horizontal'
    ? { transform: 'translateX(-160%) translateZ(-200px) rotateY(50deg)' }
    : { transform: 'translateY(-160%) translateZ(-200px) rotateX(50deg)' }
})
const nextSlideStyle = computed(() => {
  return directionRef.value === 'horizontal'
    ? { transform: 'translateX(60%) translateZ(-200px) rotateY(-50deg)' }
    : { transform: 'translateY(60%) translateZ(-200px) rotateX(-50deg)' }
})
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
    <n-carousel
      effect="card"
      :show-dots="false"
      :show-arrow="false"
      :current-index="this_audio_Index_of_play_list_carousel"
      :direction="directionRef"
      :dot-placement="placementRef"
      centered-slides
      :prev-slide-style="prevSlideStyle"
      :next-slide-style="nextSlideStyle"
      style="
        transform-style: preserve-3d;
        width: 55vh;
        height: 55vh;
        border-radius: 12px;
        object-fit: cover;
        object-position: center;
        box-shadow:
          0 0 12px rgba(0, 0, 0, 0.2),
          0 0 12px rgba(0, 0, 0, 0.2);
      "
      :style="{
        marginTop: player_collapsed_action_bar_of_Immersion_model
          ? 'calc(28vh - 182px)'
          : 'calc(28vh - 182px)',
        transition: 'margin 0.4s, height 0.4s',
        backgroundImage:
          !playlist_MediaFiles_temporary_carousel ||
          playlist_MediaFiles_temporary_carousel.length === 0
            ? `url(${error_album})`
            : 'none',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }"
    >
      <n-carousel-item
        v-for="(item, index) in playlist_MediaFiles_temporary_carousel"
        :key="index"
        style="width: 55vh; height: 55vh"
      >
        <div class="image-wrapper">
          <img
            class="carousel-img"
            :src="
              index === this_audio_Index_of_play_list_carousel
                ? getAssetImage(page_top_album_image_url)
                : getAssetImage(item.medium_image_url)
            "
            :alt="`Carousel Image ${index + 1}`"
            @error="handleImageError"
          />
        </div>
      </n-carousel-item>
    </n-carousel>
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
  </n-space>
</template>

<style scoped>
.image-wrapper {
  position: relative;
  display: inline-block;
  width: 55vh;
  height: 56vh;
}

.carousel-img {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  position: relative;
  z-index: 1;
}

.image-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  right: -5px;
  width: 20vh;
  height: 100%;
  background: linear-gradient(to left, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
  border-radius: 12px;
  z-index: 2;
}
</style>
