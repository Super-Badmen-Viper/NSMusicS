<script setup lang="ts">
import { store_player_audio_info } from '@/views/view_app/music_page/page_player/store/store_player_audio_info'
import { store_player_appearance } from '@/views/view_app/music_page/page_player/store/store_player_appearance'
import { store_player_audio_logic } from '@/views/view_app/music_page/page_player/store/store_player_audio_logic'
import { NSlider } from 'naive-ui'
import { store_playlist_list_info } from '@/views/view_app/music_components/player_list/store/store_playlist_list_info'
function getAssetImage(firstImage: string) {
  return new URL(firstImage, import.meta.url).href
}

import { ref, computed } from 'vue'
import { NCarousel, NCarouselItem } from 'naive-ui'

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
      marginTop: store_player_appearance.player_background_model_num === 5 ? '0px' : '100px',
      opacity: store_player_appearance.player_background_model_num === 5 ? 1 : 0,
      position: store_player_appearance.player_background_model_num === 5 ? 'relative' : 'absolute',
      left: store_player_appearance.player_background_model_num === 5 ? '0' : '-100%',
      transition: 'margin 0.4s, opacity 0.8s',
    }"
    style="margin-right: 1vw"
  >
    <n-carousel
      effect="card"
      :show-dots="false"
      show-arrow
      v-model:current-index="store_player_audio_info.this_audio_Index_of_play_list_carousel"
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
        marginTop: store_player_appearance.player_collapsed_action_bar_of_Immersion_model
          ? 'calc(28vh - 182px)'
          : 'calc(28vh - 182px)',
        transition: 'margin 0.4s, height 0.4s',
      }"
    >
      <n-carousel-item
        v-for="(item, index) in store_playlist_list_info.playlist_MediaFiles_temporary_carousel"
        :key="index"
        style="width: 40vh; height: 40vh"
      >
        <div class="image-wrapper">
          <img
            style="
              margin: 0 auto;
              width: 40vh;
              height: 40vh;
              object-fit: cover;
              border-radius: 12px;
              position: relative;
              z-index: 1;
            "
            :src="
              index === store_player_audio_info.this_audio_Index_of_play_list_carousel
                ? getAssetImage(store_player_audio_info.page_top_album_image_url)
                : getAssetImage(item.medium_image_url)
            "
            :alt="`Carousel Image ${index + 1}`"
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
        {{ store_player_audio_info.this_audio_song_name }}
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
        {{ store_player_audio_info.this_audio_artist_name }} -
        {{ store_player_audio_info.this_audio_album_name }}
      </div>
    </n-space>
    <!--  -->
    <n-space vertical v-if="!store_player_appearance.player_collapsed_album">
      <n-space justify="end" style="width: 55vh; margin-top: -29px">
        <n-space>
          {{ store_player_audio_logic.current_play_time }}
        </n-space>
        :
        <n-space>
          {{ store_player_audio_logic.total_play_time }}
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
        v-model:value="store_player_audio_logic.slider_singleValue"
        :min="0"
        :max="100"
        :format-tooltip="
          (value) => {
            return store_player_audio_logic.formatTime(
              (value / 100) * store_player_audio_logic.player.isDuration
            )
          }
        "
        :on-dragend="
          () => {
            if (
              store_player_audio_logic.slider_singleValue >= 99.5 ||
              store_player_audio_logic.slider_singleValue == 0
            ) {
              store_player_audio_logic.player_is_play_ended = true
              store_player_audio_logic.play_go_duration(
                store_player_audio_logic.slider_singleValue,
                true
              )
            }
            store_player_audio_logic.player_range_duration_isDragging = false
          }
        "
        @click="
          () => {
            store_player_audio_logic.play_go_duration(
              store_player_audio_logic.slider_singleValue,
              true
            )
          }
        "
        @mousedown="store_player_audio_logic.player_range_duration_isDragging = true"
        @mouseup="store_player_audio_logic.player_range_duration_isDragging = false"
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
  height: 55vh;
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
