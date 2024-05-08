<script setup lang="ts">
  ////// this_view resource of vicons_svg
  import {
    Heart24Regular,Heart28Filled,
  } from '@vicons/fluent'

  ////// this_view components of navie ui 
  import { ref, onMounted } from 'vue';
  import { NIcon } from 'naive-ui';

  ////// passed as argument
  const emits = defineEmits([
    'media_file_path','media_file_path_from_playlist',
    'media_file_medium_image_url',
    'this_audio_singer_name',
    'this_audio_song_name',
    'this_audio_album_name','this_audio_album_id','this_audio_album_favite',
    'this_audio_Index_of_absolute_positioning_in_list',
    'menu_edit_this_song',
    'menu_add_this_song',
    'menu_delete_this_song',
    'options_Sort_key',
    'page_songlists_keyword',
    'page_songlists_reset_data',
    'page_songlists_selected',
    'this_audio_lyrics_string'
  ]);
  const props = defineProps<{
    data_temporary: Media_File[];
    this_audio_Index_of_absolute_positioning_in_list: number;
  }>();

  ////// scrollbar of playlist_view
  const scrollbar = ref(null as any);
  const this_audio_Index_of_absolute_positioning_in_list = ref<number>(0)
  onMounted(() => {
    this_audio_Index_of_absolute_positioning_in_list.value = props.this_audio_Index_of_absolute_positioning_in_list;
    if (scrollbar !== null) {
      setTimeout(() => {
        scrollbar.value.scrollToItem(this_audio_Index_of_absolute_positioning_in_list.value);
      }, 100);
    }
  });

  /////// emits audio_info of artistlist_view_list
  const handleItemDbClick = (media_file:Media_File,index:number) => {
    emits('media_file_path_from_playlist',true)
    emits('media_file_path', media_file.path)
    emits('this_audio_lyrics_string', media_file.lyrics)
    emits('media_file_medium_image_url',media_file.medium_image_url)
    emits('this_audio_singer_name',media_file.artist)
    emits('this_audio_song_name',media_file.title)
    emits('this_audio_album_id', media_file.album_id);
    emits('this_audio_album_favite', media_file.favorite);
    emits('this_audio_album_name',media_file.album)
    emits('this_audio_Index_of_absolute_positioning_in_list', index); 
  }
  const handleItemClick_title = (title:string) => {
    
  }
  const handleItemClick_artist = (artist:string) => {
    
  }
</script>
<template>
  <n-space vertical :size="12">
    <div class="dynamic-scroller-demo">
      <DynamicScroller 
        class="table" ref="scrollbar" style="width: 410px;"
        :items="props.data_temporary"
        :minItemSize="50">
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
            :data-active="active"
            class="message"
            @Dblclick="handleItemDbClick(item,index)">
            <div class="media_info">
              <div 
                style="margin-left: 10px;
                  width: 58px;height: 58px; 
                  border-radius: 6px; border: 1.5px solid #FFFFFF20;
                  overflow: hidden;">
                <img
                  :key="item.id"
                  :src="item.medium_image_url"
                  style="width: 100%; height: 100%; object-fit: cover;"/>
              </div>
              <div class="title_playlist">
                <span @click="handleItemClick_title(item.title)">{{ item.title }}</span>
                <br>
                <template v-for="artist in item.artist.split('/')">
                  <span @click="handleItemClick_artist(artist)">{{ artist + '&nbsp' }}</span>
                </template>
              </div>
              <div class="love">
                <n-button circle text size="small" style="display: block;">
                  <template #icon>
                    <n-icon v-if="item.favorite" :size="20" color="red"><Heart28Filled/></n-icon>
                    <n-icon v-else :size="20"><Heart24Regular/></n-icon>
                  </template>
                </n-button>
              </div>
              <span class="duration_txt" style="text-align: left;font-size: 15px;">{{ item.duration_txt }}</span>
              <span class="index" style="text-align: left;font-size: 15px;">{{ index + 1 }}</span>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>
  </n-space>
</template>

<style scoped>
.dynamic-scroller-demo {
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.table{
  height: calc(100vh - 212px);
}
.message {
  display: flex;
  align-items: left;
}
.media_info {
  height: 70px;
  display: flex;
  align-items: center;
  border-radius: 6px;

  transition: background-color 0.3s;
}
.media_info:hover {
  background-color: #FFFFFF24;
}
.checkbox{
  width: 20px;
  margin-left: 12px;
}
.index{
  width: 50px;
  margin-left: 12px;
}
.title_playlist{
  margin-left: 10px;
  text-align: left;
  width: 160px;
  font-size: 15px;
  overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
}
.title_playlist :hover{
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}
.love{
  margin-left: 10px;
  text-align: left;
  width: 30px;
}
.love :hover{
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}
.duration_txt{
  margin-left: 10px;
  text-align: left;
  width: 50px;
}

::-webkit-scrollbar {
  display: auto;
  width: 10px;
}
::-webkit-scrollbar-thumb {
  background-color: #88888850;
  border-radius: 6px;
}
::-webkit-scrollbar-track {
  background-color: #f1f1f105;
  border-radius: 6px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #88888850;
  border-radius: 6px;
}
</style>