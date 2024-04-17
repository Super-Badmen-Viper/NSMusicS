<script setup lang="ts">
  import { defineEmits, ref, watch, onMounted } from 'vue';
  const emits = defineEmits(['player_show_click','play_go_index_time']);

  const props = defineProps([
    'this_audio_file_path','playlist_Files_temporary',
    'this_audio_file_medium_image_url','this_audio_refresh',
    'this_audio_singer_name','this_audio_song_name','this_audio_album_name',
    'this_audio_lyrics_string','this_audio_lyrics_info_line','this_audio_lyrics_info_time',
    'player','currentTime_added_value',
    'view_music_player_show_complete',
  ]);
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

  ////// lyircs load
  let unwatch = watch(() => props.this_audio_lyrics_string, (value) => {
    load_lyrics()
  });
  onMounted(() => {
    load_lyrics()// v-if为false，则 watch(() => props.this_audio_lyrics_string 无法检测
  });
  function load_lyrics() {
    if(props.this_audio_lyrics_string.length > 0) {
      scrollToTop()
      begin_lyrics_animation()
    }
  }
  function begin_lyrics_animation() {
    clearInterval(lyrics_animation);
    lyrics_animation = setInterval(() => {
      for (let i = 0; i < props.this_audio_lyrics_info_time.length; i++) {
          if(props.player !== null && props.player.getCurrentTime() !== undefined && props.player.getCurrentTime() !== null){
            let currentTime = (Math.floor(props.currentTime_added_value) + props.player.getCurrentTime())*1000;
            if(currentTime <= props.this_audio_lyrics_info_time[0]){  
              if(lyrics_list_whell.value === false){
                scrollToItem(7);
              }
              break;
            }else if(currentTime >= props.this_audio_lyrics_info_time[i]){
              if(i === props.this_audio_lyrics_info_time.length - 1){
                if(lyrics_list_whell.value === false){
                  scrollToItem(i + 7);
                }
                break;
              }else if(currentTime < props.this_audio_lyrics_info_time[i+1]){
                if(lyrics_list_whell.value === false){
                  scrollToItem(i + 7);
                }
                break;
              }
            }
          }
        }
    }, 100);
  }
  let lyrics_animation: string | number | NodeJS.Timeout | undefined;
  const handleItemDbClick = (index: any) => {
    if(index < 7) return;
    if(index > props.this_audio_lyrics_info_line.length - 7 - 1) return;
    const time = props.this_audio_lyrics_info_time[index - 7];
    if(time >= props.player.getTotalTime()*1000) return;
    if(time < 0) return;
    emits('play_go_index_time', time);
  };
  const scrollbar = ref(null as any);
  const virtualListInst = ref<VirtualListInst>()
  const perviousIndex = ref(0);
  const scrollToItem_nList = (index: number) => {
    virtualListInst.value?.scrollTo({ index: index })
  };
  const scrollToItem = (index: number) => {
    if (!scrollbar.value) {
      return;
    }
    const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info');
    itemElements[index].style.color = '#FFFFFF';
    itemElements[index].style.transition = 'color 0.5s, transform 0.5s';
    if(collapsed_slider.value === false){
      itemElements[index].style.transform = 'scale(1.05) translateY(0px)';
      itemElements[index].style.transformOrigin = 'left center';
    }else{
      itemElements[index].style.transform = 'scale(1.1)  translateX(8px)';
      itemElements[index].style.transformOrigin = 'center';
    }
    if(perviousIndex.value === index - 1){
      itemElements[index].scrollIntoView({ block: 'center', behavior: 'smooth' });
    } else {
      itemElements[index].scrollIntoView({ block: 'center', behavior: 'instant' });
    }
    if(perviousIndex.value !== index){
      if(perviousIndex.value < props.this_audio_lyrics_info_line.length - 7){
        if(perviousIndex.value >= 7){
          itemElements[perviousIndex.value].style.color = '#FAFAFB50';
          itemElements[perviousIndex.value].style.transform = 'scale(1)';
        }
      }
    }
    perviousIndex.value = index;
  };
  const scrollToItem_vue = (index:any) => {
    if (!scrollbar.value) {
      return;
    }
    scrollbar.value.scrollToItem(index);
    const itemElement = scrollbar.value.$el.querySelector(`[data-index="${index}"]`);
    if (itemElement) {
      itemElement.style.color = '#FFFFFF';
      itemElement.style.transition = 'color 0.5s, transform 0.5s';
      itemElement.style.transform = 'scale(1.05) translateX(0px)';
      itemElement.style.transformOrigin = 'left center';
      if(perviousIndex.value === index - 1){
        itemElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
      } else {
        itemElement.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    }
    if(perviousIndex.value !== index){
      if(perviousIndex.value < props.this_audio_lyrics_info_line.length - 7){
        if(perviousIndex.value >= 7){
          const itemElements_pervious = scrollbar.value.$el.querySelector(`[data-index="${perviousIndex.value}"]`);
          itemElements_pervious.style.color = '#FAFAFB50';
          itemElements_pervious.style.transform = 'scale(1)';
        }
      }
    }
    perviousIndex.value = index;
  };
  const scrollToTop = () => {
    if (scrollbar.value !== null) {
      scrollToItem(0);
    }
  };
  const lyrics_list_whell = ref(false);
  const handleWheel = (event: any) => {
    lyrics_list_whell.value = true;
  };
  const handleLeave = () => {
    lyrics_list_whell.value = false;
  };
  //////
  const collapsed_slider = ref(false);
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
    if(props.view_music_player_show_complete)
      emits('player_show_click', true);
  }
  //////
  const checkStrategy = ref<'player' | 'related'>('player')
  //////
  import { onBeforeUnmount } from 'vue';
  onBeforeUnmount(() => {
    clearInterval(lyrics_animation);
  });
  onBeforeUnmount(() => {
    unwatch();
  });
  import {
    Home28Regular,
    Flag16Regular,
    SlideMicrophone32Regular,
    DocumentHeart20Regular,
    TextIndentIncreaseLtr20Filled as lyric,
    PeopleCommunity16Regular,
    ArrowMinimize16Regular,Maximize16Regular,ColorBackground20Regular,
    ChevronDown12Filled,Settings24Regular
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
  import type { VirtualListInst } from 'naive-ui';
</script>

<template>
  <div style="overflow: hidden;">
    <div>
      <img
        id="player_bg_zindex_0"
        style="
          position: absolute;top: -20vw;left: -10vw;width: 120vw;height: 120vw;
          object-fit: cover;object-position: center;
          filter: brightness(46%) blur(50px);"
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
    <div style="
      position: absolute;top: 6px;left: calc(50vw - 88px);
      -webkit-app-region: no-drag;margin-top: 30px;margin-left:30px;">
      <n-radio-group size="small" v-model:value="checkStrategy">
        <n-radio-button size="small" value="player">
          播放
        </n-radio-button>
        <n-radio-button size="small" value="related">
          相关
        </n-radio-button>
      </n-radio-group>
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
            <div style="-webkit-app-region: no-drag;margin-top: 30px;">
              <n-button quaternary 
                style="margin-right:2px" >
                <template #icon>
                  <n-icon :depth="3"><ChevronDown12Filled /></n-icon>
                </template>
                <span style="font-weight: 500;">背景模式</span>
              </n-button>
              <n-button quaternary 
                style="margin-right:10px" >
                <template #icon>
                  <n-icon :depth="3"><Settings24Regular /></n-icon>
                </template>
                <span style="font-weight: 500;">界面设置</span>
              </n-button>
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
          <n-layout has-sider style="background-color: transparent;">
            <!-- Album 
              show-trigger="bar" calc(50vw + 27vh + 8vw) :show-collapsed-content="false"-->
            <n-layout-sider 
              :collapsed="collapsed_slider" @collapse="collapsed_slider = true" @expand="collapsed_slider = false"
              :show-collapsed-content="false" collapse-mode="transform"
              position="static"
              collapsed-width="calc(30.5vw)" width="54vw"
              show-trigger="bar"
              style="background-color: transparent;">
              <n-space vertical align="end" style="margin-right:8vw;">
                <n-space vertical style="width: 54vh;">
                  <img
                    style="
                      width: 54vh;height: 54vh;
                      margin-top: calc(28vh - 180px);
                      object-fit: cover;object-position: center;
                      filter: blur(0px);
                      border-radius: 10px;
                    "
                    :src="getAssetImage(props.this_audio_file_medium_image_url)"
                    @error="handleImageError">
                  <div
                    style="
                      margin-left: 2px;
                      max-width: 54vh;
                      color: #E7E5E5;
                      font-weight: 900;font-size: 26px;
                      overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                    ">
                    {{ props.this_audio_song_name }}
                  </div>
                  <div
                    style="
                      margin-left: 2px;margin-top: -10px;
                      max-width: 54vh;
                      color: #989292;
                      font-weight: 550;font-size: 18px;
                      overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                    ">
                    {{ props.this_audio_singer_name }} -  {{ props.this_audio_album_name }}
                  </div>
                </n-space>
              </n-space>
            </n-layout-sider>
            <!-- Lyic -->
            <n-layout-content
              style="background-color: transparent;">
              <div 
                style="
                  width: 40vw;height: calc(100vh - 180px);
                  border-radius: 20px;
                ">
                <n-list
                  clickable :show-divider="false"
                  class="table" ref="scrollbar"
                  @wheel="handleWheel"
                  @mouseleave="handleLeave"
                  style="
                    width: calc(40vw);
                    margin-top:16px;margin-left:12px;
                    overflow: auto;
                    background-color: #00000000;
                  ">
                  <template #default>
                    <n-list-item 
                      class="lyrics_info" 
                      :style="{
                        border: '0px solid #00000000',
                        textAlign: collapsed_slider ? 'center' : 'left'
                      }"
                      v-for="(item, index) in props.this_audio_lyrics_info_line" 
                      @click="handleItemDbClick(index)">
                      <div class="lyrics_text_active">
                        {{ item }}
                      </div>
                    </n-list-item>
                  </template>
                </n-list>
                <!-- <DynamicScroller 
                  class="table" ref="scrollbar"
                  :items="props.this_audio_lyrics_info_line"
                  :minItemSize="76">
                  <template #default="{ item, index, active }">
                    <n-list-item 
                      :item="item"
                      :active="active"
                      :data-index="index"
                      :data-active="active"
                      :size-dependencies="[
                        item,
                      ]"
                      class="lyrics_info" 
                      style="border: 0px solid #00000000;"
                      @click="handleItemDbClick(index)">
                      <div class="lyrics_text">
                        {{ item }}
                      </div>
                    </n-list-item>
                  </template>
                </DynamicScroller> -->
              </div>
            </n-layout-content>
          </n-layout>
          
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
.lyrics_info {
  width: calc(40vw);min-height: 50px;
  margin-top: 6px;
  color: #FAFAFB60;
  cursor: pointer;
  border-radius: 10px;
  line-height: 1.2;
  transition: color 0.5s, background-color 0.5s;
}
.lyrics_info:hover {
  color: #FAFAFB;
  background-color: #FFFFFF16;
}
.lyrics_text {
  max-width: calc(36vw);
  font-size: 28px;
  font-weight: 800;
  padding-left: 20px;padding-top: 12px;padding-bottom: 16px;
}
.lyrics_text_active {
  max-width: calc(36vw);
  font-size: 24px;
  font-weight: 800;
  padding-left: 20px;padding-top: 0px;padding-bottom: 4px;
}
::-webkit-scrollbar {
  display: none;
}
</style>