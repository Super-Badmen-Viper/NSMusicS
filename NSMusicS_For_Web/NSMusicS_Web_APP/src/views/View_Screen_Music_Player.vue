<script setup lang="ts">
  import { defineEmits } from 'vue';
  const emits = defineEmits(['player_show_click']);

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

  ////// System BrowserWindow Set
  const { ipcRenderer } = require('electron');
  function minimize() {
    ipcRenderer.send('window-min');
  }
  function maximize() {
    ipcRenderer.send('window-max');
  }
  function closeWindow() {
    ipcRenderer.send('window-close');
  }
  ////// 
  function close_media_player() {
    emits('player_show_click', true);
  }

  import {
    Home28Regular,
    Flag16Regular,
    SlideMicrophone32Regular,
    DocumentHeart20Regular,
    TextIndentIncreaseLtr20Filled as lyric,
    PeopleCommunity16Regular,
    ArrowMinimize16Regular,Maximize16Regular,ColorBackground20Regular,
    ChevronDown12Filled,
  } from '@vicons/fluent'
  import {
    AlbumFilled,
    MusicNoteRound,
    LibraryMusicOutlined
  } from '@vicons/material'
  import {
    UserAvatarFilledAlt,
    Hearing,
    Close,Settings,Menu as MenuIcon,
  } from '@vicons/carbon'
</script>

<template>
  <div style="overflow: hidden;">
    <div>
      <img
        id="player_bg_zindex_0"
        style="
          position: absolute;top: -10vw;left: -10vw;width: 120vw;height: 120vw;
          margin-top: -20vw;
          object-fit: cover;object-position: center;
            filter: brightness(46%) blur(30px);"
        :src="getAssetImage(props.this_audio_file_medium_image_url)"
        @error="handleImageError">
      <!-- <img
        id="player_bg_zindex_1"
        style="
          position: absolute;top: 0;left: 0;width: 100vw;height: 100vw;
          margin-top: -20vw;
          object-fit: cover;object-position: center;
          filter: blur(0px);"
        :src="getAssetImage(props.this_audio_file_medium_image_url)"
        @error="handleImageError"> -->
    </div>
    <n-space vertical :size="12" style="z-index: 99;">
      <n-space vertical>
        <n-flex justify="space-between">
          <n-flex style="height: 70px;">
            <div style="-webkit-app-region: no-drag;margin-top: 30px;margin-left:30px;">
              <n-button quaternary size="medium" 
                style="margin-right:4px" @click="close_media_player">
                <template #icon>
                  <n-icon size="30" :depth="3"><ChevronDown12Filled/></n-icon>
                </template>
              </n-button>
            </div>
          </n-flex>
          <n-flex justify="end" style="height: 70px;">
            <div style="-webkit-app-region: no-drag;margin-top: 20px;">
              <n-button quaternary circle size="medium" 
                style="margin-right:4px" @click="minimize">
                <template #icon>
                  <n-icon size="18" :depth="3"><ArrowMinimize16Regular/></n-icon>
                </template>
              </n-button>
              <n-button quaternary circle size="medium" 
                style="margin-right:4px" @click="maximize">
                <template #icon>
                  <n-icon size="24" :depth="3"><Maximize16Regular/></n-icon>
                </template>
              </n-button>
              <n-button quaternary circle size="medium" 
                style="margin-right:48px" @click="closeWindow">
                <template #icon>
                  <n-icon size="28" :depth="3"><Close/></n-icon>
                </template>
              </n-button>
            </div>
          </n-flex>
        </n-flex>
        <n-flex justify="center">
          <n-flex justify="center" style="width:70vh">
            <n-space vertical>
              <img
                style="
                  width: 54vh;height: 54vh;
                  margin-top: calc(28vh - 200px);
                  object-fit: cover;object-position: center;
                  filter: blur(0px);
                  border-radius: 10px;
                  box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.1);
                  border: 2px solid rgba(255, 255, 255, 0.05);"
                :src="getAssetImage(props.this_audio_file_medium_image_url)"
                @error="handleImageError">
              <n-ellipsis
                style="
                  margin-left: 2px;
                  color: #E7E5E5;
                  font-weight: 900;font-size: 26px;
                ">
                {{ props.this_audio_song_name }}
              </n-ellipsis>
              <n-ellipsis
                style="
                  margin-left: 2px;
                  max-width: 54vh;
                  color: #A09D9D;
                  font-weight: 550;font-size: 18px;
                ">
                {{ props.this_audio_singer_name }} -  {{ props.this_audio_album_name }}
              </n-ellipsis>
            </n-space>
          </n-flex>
          <n-flex>
            <div style="background-color: #FFFFFF30;width: 40vw;height: calc(100vh - 180px);border-radius: 20px">

            </div>
          </n-flex>
        </n-flex>
        <n-flex justify="end">

        </n-flex>
      </n-space>
    </n-space>
  </div>
</template>

<style>
/* filter: blur(10px) grayscale(100%); */
#player_bg_zindex_0 {
  z-index: -2;
}
#player_bg_zindex_1 {
  z-index: -1;
}
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