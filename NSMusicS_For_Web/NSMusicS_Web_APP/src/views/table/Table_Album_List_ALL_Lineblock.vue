<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';

  const emit = defineEmits([
    'media_Files',
    'media_file_path',
    'media_file_medium_image_url',
    'this_audio_singer_name',
    'this_audio_song_name',
    'this_audio_album_name',
    'data_select_Index',
    'page_song_index',
    'page_num',
    'page_Size',
    'media_PageFiles',
    'menu_edit_this_song',
    'menu_add_this_song',
    'menu_delete_this_song',
    'options_Sort_key',
    'keyword',
    'reset_data'
  ]);

  const props = defineProps(['data','data_temporary','collapsed','window_innerWidth']);
  // 重新渲染列表 width

  //
  const item_album_margin = ref<number>(12)
  const item_album = ref<number>(180)
  const item_album_image = ref<number>(item_album.value - 20)
  const item_album_txt = ref<number>(item_album.value - 30)
  //
  const page = ref<number>(1)
</script>
<template>
  <n-space class="album-wall-container" vertical>
    <n-virtual-list class="album-wall" 
      :padding-bottom="100"
      item-resizable
      :item-size="item_album" 
      :items="props.data_temporary">
      <template #default="{ item }">
        <div class="album" :key="item.key" :style="{ margin:item_album_margin + 'px'}">
          <img 
            :src="item.medium_image_url" 
            :style="{ 
              width: item_album_image + 'px', 
              height: item_album_image + 'px', 
              borderRadius: '6px'}" />
          <n-space class="album_text"
            :style="{ width:item_album_image + 'px'}">
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
      </template>
    </n-virtual-list>
  </n-space>
  <n-pagination
      style="position: absolute;right: 10px;bottom: 10px;"
      :display-order="['quick-jumper', 'pages', 'size-picker']"
      :page-sizes="[10, 30, 50, 100]"
      :pageSize="30"
      v-model:page="page"
      :page-count="100"
      show-quick-jumper
      show-size-picker/>
</template>
<style>
.album-wall-container {
  width: 100%;
  height: 100%;
}
.album-wall {
  max-width: calc(100vw - 200px);
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  align-items: flex-start;
  padding: 40px;
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