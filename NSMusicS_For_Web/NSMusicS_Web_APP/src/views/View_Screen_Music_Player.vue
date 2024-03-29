<script setup lang="ts">
  const props = defineProps([
    'this_audio_file_path','playlist_Files_temporary',
    'this_audio_file_medium_image_url','this_audio_refresh',
    'this_audio_singer_name','this_audio_song_name','this_audio_album_name']);
  const os = require('os');
  function getAssetImage(firstImage: string) {
    if(os.type() || process.platform === 'win32')
        return new URL(firstImage, import.meta.url).href;
    else if(os.type() || process.platform === 'darwin')
        return new URL(firstImage, import.meta.url).href;
    else if(os.type() || process.platform === 'linux')
        return new URL(firstImage, import.meta.url).href;
  }
  const handleImageError = (event:any) => {
    event.target.src = '../../resources/error_album.jpg'; // 设置备用图片路径
  };
</script>

<template>
  <!-- 
    z-index:0 
    background animation：Album，Artist 

    style="
      width: 100vw;height: 100vw;
      background-size: cover;background-position: center;
      filter: blur(3px);"
    :style="{ backgroundImage: 'url(' + getAssetImage(props.this_audio_file_medium_image_url) + ')'}"
  -->
  <div style="overflow: hidden;">
    <img
      style="
        width: 100vw;height: 100vw;
        margin-top: -20vw;
        objectFit: cover;objectPosition: center;
        filter: blur(3px);" 
      :src="getAssetImage(props.this_audio_file_medium_image_url)"
      @error="handleImageError">
    <n-space vertical :size="12">

    </n-space>
  </div>
</template>

<style>
/* filter: blur(10px) grayscale(100%); */

</style>


<!-- <script setup lang="ts">
import { ref,defineEmits, onBeforeUnmount, onMounted } from 'vue';
import Table_Song_List from '../views/page/page_media_player.vue'

const { 
  this_audio_file_path,
  this_audio_file_medium_image_url,
  this_audio_refresh,
  this_audio_singer_name,this_audio_song_name,this_audio_album_id,this_audio_album_name
  } = defineProps<{
  this_audio_file_path:string,
  this_audio_file_medium_image_url:string,
  this_audio_refresh:boolean,
  this_audio_singer_name:string,this_audio_song_name:string,this_audio_album_id:string,this_audio_album_name:string
  }>();
</script>

<template>
  <div>
    <Table_Song_List
        :this_audio_file_path="this_audio_file_path"
        :this_audio_file_medium_image_url="this_audio_file_medium_image_url"
        :this_audio_refresh="this_audio_refresh"
        :this_audio_singer_name="this_audio_singer_name"
        :this_audio_song_name="this_audio_song_name"
        :this_audio_album_id="this_audio_album_id"
        :this_audio_album_name="this_audio_album_name"
      />
  </div>
</template>

<style>

</style> -->