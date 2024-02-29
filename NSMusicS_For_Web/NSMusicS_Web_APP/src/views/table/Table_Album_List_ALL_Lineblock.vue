<script setup lang="ts">
  import { nextTick, onMounted, reactive, ref, watch } from 'vue';

  const emit = defineEmits([
    'album_Page',
    'album_PageSize',
  ]);

  const props = defineProps<{
    data: Item_Album[];
    data_temporary: Item_Album[];
    page: number;
    pageSize: number;
    pageCount: number;
    collapsed: Boolean;
    window_innerWidth: number;
  }>();
  // 重新渲染列表 width

  //
  const item_album_margin = ref<number>(12)
  const item_album = ref<number>(180)
  const item_album_image = ref<number>(item_album.value - 20)
  const item_album_txt = ref<number>(item_album.value - 30)
  //
  const paginationReactive = reactive({
    page: 1,
    pageCount: props.pageCount,
    pageSize: props.pageSize,
    showSizePicker: true,
    showQuickJumper: true,
    pageSizes: [10, 30, 50],
  })
  const pagination_onChange = (page: number) => {
    paginationReactive.page = page
    emit('album_Page',page)
  }
  const pagination_onUpdatePageSize = (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
    emit('album_PageSize',pageSize)
  }
  //

  import {
    Play16Filled,
    Heart24Regular,
    MoreCircle32Regular
  } from '@vicons/fluent'

</script>
<template>
  <n-space class="album-wall-container" vertical>
    <div class="album-wall" ref="scrollbar" style="overflow-y: scroll;">
      <!-- @contextmenu="onContextmenu" -->
      <div v-for="item in props.data_temporary" :key="item.id" class="album" 
        :style="{ margin: item_album_margin + 'px' }"
        @mouseover="item.isHovered = true"
        @mouseleave="item.isHovered = false">
        <div 
          :style="{ 
            width: item_album_image + 'px', 
            height: item_album_image + 'px', 
            position: 'relative' }">
          <img 
            :src="item.medium_image_url"
            :style="{ 
              width: item_album_image + 'px', 
              height: item_album_image + 'px', 
              borderRadius: '6px' }"/>
          <n-space 
            v-if="item.isHovered"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 6px;
            background: linear-gradient(to bottom, transparent, black);">
            <div style="
              display: flex; justify-content: center; align-items: center; 
              height: 100%;">
              <n-float-button 
                :style="{ left: item_album / 3 + 'px'}"
                color="#FFFFFF" position="absolute">
                <n-icon><Play16Filled /></n-icon>
              </n-float-button>
              <div style="position: absolute; bottom: 10px; right: 10px;">
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
          </n-space>
        </div>
        <n-space class="album_text"
          :style="{ width: + 'px'}">
          <div class="bar_left_text_song_info" 
            :style="{ width:item_album_image + 'px'}">
            <n-ellipsis id="bar_singer_name"
              :style="{ maxWidth:item_album_txt + 'px'}">{{ item.name }}</n-ellipsis>
            <n-ellipsis id="bar_song_name"
              :style="{ maxWidth:item_album_txt + 'px'}">{{ item.artist }}</n-ellipsis>
            <n-ellipsis id="bar_album_name"
              :style="{ maxWidth:item_album_txt + 'px'}">{{ item.updated_time }}</n-ellipsis>
          </div>
        </n-space>
      </div>
    </div>
  </n-space>
  <n-pagination
    style="position: absolute;right: 10px;bottom: 10px;"
    :display-order="['quick-jumper', 'pages', 'size-picker']"
    :page-sizes="[10, 30, 50]"
    :pageSize="props.pageSize"
    :on-update-page="pagination_onChange"
    :on-update-page-size="pagination_onUpdatePageSize"
    v-model:page="props.page"
    :page-count="props.pageCount"
    show-quick-jumper
    show-size-picker/>
</template>
<style>
.album-wall-container {
  width: 100%;
  height: 100%;
}
.album-wall {
  width: calc(100vw - 200px);
  height: calc(100vh - 190px);
  display: flex;
  flex-wrap: wrap;
  justify-content: start;  
  align-items: flex-start;
}
.album {
  float: left;
  flex-direction: column;
  align-items: left;
}

.album_text .bar_left_text_song_info{
  float: left;
  text-align: left;
}
.album_text .bar_left_text_song_info #bar_singer_name{
  font-size: 14px;
  font-weight: 500;
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