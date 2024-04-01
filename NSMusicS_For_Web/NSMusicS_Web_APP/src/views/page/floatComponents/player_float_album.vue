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
</script>

<template>
  <img style="width: 100vw;height: 100vw;objectFit: cover;objectPosition: center;filter: blur(3px);" 
      :src="getAssetImage(props.this_audio_file_medium_image_url)">
      
  </img>
</template>

<style>
/* filter: blur(10px) grayscale(100%); */

</style>