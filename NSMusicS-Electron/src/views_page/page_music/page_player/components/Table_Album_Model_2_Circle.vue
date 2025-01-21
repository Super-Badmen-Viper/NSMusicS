<script setup lang="ts">
import {store_player_appearance} from "@/views_page/page_music/page_player/store/store_player_appearance";
import {store_player_audio_info} from "@/views_page/page_music/page_player/store/store_player_audio_info";
import {store_player_audio_logic} from "@/views_page/page_music/page_player/store/store_player_audio_logic"
function getAssetImage(firstImage: string) {
  return new URL(firstImage, import.meta.url).href;
}
</script>

<template>
  <n-space vertical
           align="center" justify="center"
           style="margin-right: calc(-2vh);overflow: hidden">
    <div style="
      width: calc(50vh);
      height: calc(20vh);
      background: #ffffff;
    ">

    </div>
    <lottie-player
      ref="animationInstance_model_1_wave"
      class="animate__rotate_slower"
      :class="{ 'animate__rotate_slower_paused': !store_player_audio_logic.player.isPlaying }"
      v-if="!clear_lottie_animationInstance && store_player_appearance.player_use_lottie_animation"
      autoplay
      loop
      mode="normal"
      :src="animationInstance_model_1_wave_json"
      :style="{
        '--background-image': `url(${getAssetImage(store_player_audio_info.page_top_album_image_url)})`
      }"
      style="
        width: calc(78vh);
        height: calc(78vh);
      "
    >
    </lottie-player>
    <div
      style="
        width: 88vh;margin-top: calc(-15vh);color: #E7E5E5;
        font-weight: 900;font-size: 26px;
        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
        text-align: center;">
      {{ store_player_audio_info.this_audio_song_name }}
    </div>
    <div
      style="
        width: 88vh;margin-left: 2px;margin-top: calc(-15vh + 40px);
        color: #989292;font-weight: 550;font-size: 18px;
        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
        text-align: center;">
      {{ store_player_audio_info.this_audio_artist_name }} -  {{ store_player_audio_info.this_audio_album_name }}
    </div>
    <lottie-player
      ref="animationInstance_model_1_spectrum"
      v-if="!clear_lottie_animationInstance && store_player_appearance.player_use_lottie_animation"
      autoplay
      loop
      mode="normal"
      :src="animationInstance_model_1_spectrum_json"
      style="width: 54vh;height:40px;margin-top: calc(-15vh + 70px);"
    />
  </n-space>
</template>

<style scoped>

</style>