<script setup lang="ts">
  import { computed, h, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

  const emit = defineEmits([
    'album_page_num',
    'album_page_size',
    'options_Sort_key','keyword','reset_data'
  ]);
  const props = defineProps<{
    data_temporary: Item_Album[];
    page: number;
    pageSize: number;
    pageCount: number;
    collapsed: Boolean;
    window_innerWidth: number;
    options_Sort_key:{ columnKey: string; order: string }[];
  }>();
  //
  const item_album_margin = ref<number>(12)
  const item_album = ref<number>(170)
  const item_album_image = ref<number>(item_album.value - 20)
  const item_album_txt = ref<number>(item_album.value - 30)
  //
  const scrollbar = ref<HTMLElement | null>(null);
  const scrollToTop = () => {
    if (scrollbar.value) {
      scrollbar.value.scrollTop = 0;
    }
  };
  //
  const handleImageError = (event:any) => {
    event.target.src = '../../../resources/error_album.jpg'; // 设置备用图片路径
  };

  import {
    Play16Filled,
    Heart24Regular,
    MoreCircle32Regular
  } from '@vicons/fluent'
  import {
    AddCircle32Regular,
    MultiselectLtr20Filled,
    Delete20Regular,
    SelectAllOn24Regular,
    PlayCircle20Filled,
    ArrowSort24Regular,TextSortAscending20Regular,TextSortDescending20Regular,
    Search20Filled,
    Filter16Regular,
    SaveEdit24Regular
  } from '@vicons/fluent'
  import { DefineComponent, ComponentOptionsMixin, EmitsOptions, VNodeProps, AllowedComponentProps, ComponentCustomProps, ExtractPropTypes } from 'vue';
  import { InputInst, NIcon } from 'naive-ui';

  //
  const itemSize = 220;
  const gridItems = ref(6);
  const itemSecondarySize = 160;
  // 重新渲染gridItems
  const stopWatching_collapsed_width = watch(() => props.collapsed, (newValue, oldValue) => {
    if (props.collapsed == true) {
      gridItems.value = Math.floor(window.innerWidth / itemSecondarySize) - 1;
    } else {
      gridItems.value = Math.floor(window.innerWidth / itemSecondarySize) - 1;
    }
  });
  let bool_watch = false;
  const timer = ref<NodeJS.Timeout | null>(null);//防止大量的重复渲染，造成界面假死
  const startTimer = () => {
    timer.value = setInterval(() => {
      bool_watch = true;
    }, 1000);
  };
  onMounted(() => {
    startTimer();
  });
  const stopWatching_window_innerWidth = watch(() => props.window_innerWidth, (newValue, oldValue) => {
    bool_watch = false;
    if (props.collapsed == true) {
      gridItems.value = Math.floor(window.innerWidth / itemSecondarySize) - 1;
    } else {
      gridItems.value = Math.floor(window.innerWidth / itemSecondarySize) - 1;
    }
    if (bool_watch) {
      startTimer();
    }
  });
  //
  onBeforeUnmount(() => {
    cleanup();
  });
  const cleanup = () => {
    stopWatching_collapsed_width()
    stopWatching_window_innerWidth()
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
  };
</script>
<template>
  <div class="album-wall-container">
    <DynamicScroller
      class="album-wall" 
      :items="props.data_temporary"
      :itemSize="itemSize"
      :minItemSize="itemSize"
      :grid-items="gridItems"
      :item-secondary-size="itemSecondarySize">
      <template #default="{ item }">
        <div
          :key="item.id"
          class="album"
          :style="{ margin: item_album_margin + 'px' }">
          <div
            :style="{ width: item_album_image + 'px', height: item_album_image + 'px', position: 'relative' }">
            <img
              :src="item.medium_image_url"
              @error="handleImageError"
              :style="{ width: item_album_image + 'px', height: item_album_image + 'px', borderRadius: '6px' }"/>
            <div class="hover-overlay">
              <div class="hover-content">
                <n-float-button :style="{ left: item_album / 3 + 'px' }" color="#FFFFFF" position="absolute">
                  <n-icon><Play16Filled /></n-icon>
                </n-float-button>
                <div class="hover-buttons">
                  <n-button quaternary circle color="#FFFFFF">
                    <template #icon>
                      <n-icon><Heart24Regular /></n-icon>
                    </template>
                  </n-button>
                  <n-button quaternary circle color="#FFFFFF">
                    <template #icon>
                      <n-icon><MoreCircle32Regular /></n-icon>
                    </template>
                  </n-button>
                </div>
              </div>
            </div>
          </div>
          <div class="album_text" :style="{ width: item_album_image + 'px' }">
            <div class="bar_left_text_song_info" :style="{ width: item_album_txt + 'px' }">
              <n-ellipsis id="bar_singer_name" :style="{ maxWidth: item_album_txt + 'px' }">{{ item.name }}</n-ellipsis>
              <n-ellipsis id="bar_song_name" :style="{ maxWidth: item_album_txt + 'px' }">{{ item.artist }}</n-ellipsis>
              <n-ellipsis id="bar_album_name" :style="{ maxWidth: item_album_txt + 'px' }">{{ item.updated_time }}</n-ellipsis>
            </div>
          </div>
        </div>
      </template>
    </DynamicScroller>
  </div>
</template>
<style>
.album-wall-container {
  width: 100%;
  height: 100%;
}
.album-wall {
  overflow-y: auto;
  width: calc(100vw - 200px);
  height: calc(100vh - 230px);
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}
.album {
  float: left;
  flex-direction: column;
  align-items: left;
}
.album .hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background: linear-gradient(to bottom, transparent, black);
  opacity: 0;
  transition: opacity 0.3s;
}
.album:hover .hover-overlay {
  opacity: 1;
}
.album .hover-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.album .hover-buttons {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.album_text .bar_left_text_song_info{
  float: left;
  text-align: left;
}
.album_text .bar_left_text_song_info #bar_singer_name{
  margin-top: 2px;
  font-size: 15px;
  font-weight: 800;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; 
  overflow: hidden;
  text-overflow: ellipsis;
}
.album_text .bar_left_text_song_info #bar_song_name{
  font-size: 12px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; 
  overflow: hidden;
  text-overflow: ellipsis;
}
.album_text .bar_left_text_song_info #bar_album_name{
  font-size: 12px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; 
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>