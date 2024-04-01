<script setup lang="ts">
import { ref, onMounted, nextTick, h, reactive, computed, watch, onBeforeUnmount, createVNode } from 'vue';
import { useMessage,DropdownOption, type DataTableColumns, type DataTableRowKey, NIcon, InputInst, NImage, PaginationProps } from 'naive-ui';
import { RowData } from 'naive-ui/es/data-table/src/interface';
const emit = defineEmits([
  'media_file_path','media_file_path_from_playlist',
  'media_file_medium_image_url',
  'this_audio_singer_name',
  'this_audio_song_name',
  'this_audio_album_name','this_audio_album_id',
  'data_select_Index',
  'page_song_index',
  'menu_edit_this_song',
  'menu_add_this_song',
  'menu_delete_this_song',
  'options_Sort_key',
  'page_songlists_keyword',
  'page_songlists_reset_data',
  'playlist_Files_selected_set',
  'playlist_Files_selected_set_all',
  'page_songlists_selected',
  'this_audio_lyrics_string'
]);
const props = defineProps<{
  data_temporary: Media_File[];data_temporary_selected: Media_File[];
}>();
const data_select_Index = ref<number>(0)
const click_select_ALL_row = () => {
  if(props.data_temporary_selected.length == 0){
    emit('playlist_Files_selected_set_all', true);
  }else{
    emit('playlist_Files_selected_set_all', false);
  }
}
const click_bulk_operation = () => {
  if(bool_start_play.value == true)
  {
    bool_start_play.value = false
  }
  else{
    bool_start_play.value = true
  }
}
//
const options_data_dropmenu: DropdownOption[] = [
  {
    label: '搜索此歌手',
    key: 'search_this_singer',
    icon () {
      return h(NIcon, null, {
        default: () => h(Search20Filled)
      })
    },
  },
  {
    label: '搜索此专辑',
    key: 'search_this_album',
    icon () {
      return h(NIcon, null, {
        default: () => h(Search20Filled)
      })
    },
  },
  {
    label: '编辑歌曲信息',
    key: 'edit',
    icon () {
      return h(NIcon, null, {
        default: () => h(SaveEdit24Regular)
      })
    },
  },
  {
    label: '添加到歌单',
    key: 'add',
    icon () {
      return h(NIcon, null, {
        default: () => h(AddCircle32Regular)
      })
    },
  },
  {
    label: () => h('span', { style: { color: 'red' } }, '删除'),
    key: 'delete',
    icon () {
      return h(NIcon, null, {
        default: () => h(Delete20Regular)
      })
    },
  }
]
const handleSelect_data_dropmenu = (option: string) => {
  if (option === 'edit') {
    emit('menu_edit_this_song',data_select_Index.value);
  } 
  else if (option === 'add') {
    emit('menu_add_this_song',data_select_Index.value);
  }
  else if (option === 'delete') {
    emit('menu_delete_this_song',data_select_Index.value);
  }
  showDropdownRef.value = false;
}
const onClickoutside = () => {
  showDropdownRef.value = false
}
const showDropdownRef = ref(false)
const xRef = ref(0)
const yRef = ref(0)
let click_count = 0
const bool_start_play = ref<boolean>(true)
//
const scrollbar = ref(null as any);
const scrollToTop = () => {
  if (scrollbar.value !== null) {
    scrollbar.value.scrollToItem(0);
  }
};
//
const itemSize = 70;// height
//
const handleItemClick = () => {
  click_count++
}
const handleItemDbClick = (media_file:Media_File) => {
  if(bool_start_play.value == true){
    if(click_count >= 2){
      click_count = 0

      emit('media_file_path_from_playlist',true)
      emit('media_file_path', media_file.path)
      emit('this_audio_lyrics_string', media_file.lyrics)
      emit('media_file_medium_image_url',media_file.medium_image_url)
      emit('this_audio_singer_name',media_file.artist)
      emit('this_audio_song_name',media_file.title)
      emit('this_audio_album_id', media_file.album_id);
      emit('this_audio_album_name',media_file.album)
      // emit('page_song_index', page_index); 

      // data_select_Index.value = (current_page_num.value-1)*props.media_page_size + page_index;

      // emit('data_select_Index', data_select_Index.value); 
      emit('data_select_Index', media_file.absoluteIndex); 
    }
  }
}
const handleItemClick_title = (title:string) => {
  click_count = 0;
  
  scrollToTop()
}
const handleItemClick_artist = (artist:string) => {
  click_count = 0;
 
  scrollToTop()
}
//
import {
  AddCircle32Regular,
  MultiselectLtr20Filled,
  Delete20Regular,
  SelectAllOn24Regular,
  PlayCircle20Filled,
  ArrowSort24Regular,TextSortAscending20Regular,TextSortDescending20Regular,
  Search20Filled,
  Filter16Regular,
  SaveEdit24Regular,
  Heart24Regular,Heart28Filled,
  ChevronLeft16Filled,ChevronRight16Filled,
} from '@vicons/fluent'
import { DefineComponent, ComponentOptionsMixin, EmitsOptions, VNodeProps, AllowedComponentProps, ComponentCustomProps, ExtractPropTypes } from 'vue';
import { RouterLink } from 'vue-router';

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
  <n-space vertical :size="12">
    <n-space>
      <n-button tertiary circle @click="click_bulk_operation">
        <template #icon>
          <n-icon :size="20"><MultiselectLtr20Filled/></n-icon>
        </template>
      </n-button>   
      
      <n-space v-if="!bool_start_play">
        <n-button tertiary circle @click="click_select_ALL_row">
          <template #icon>
            <n-icon :size="20"><SelectAllOn24Regular/></n-icon>
          </template>
        </n-button>
        <n-button tertiary circle>
          <template #icon>
            <n-icon :size="20"><AddCircle32Regular/></n-icon>
          </template>
        </n-button>
        <n-button flo tertiary circle>
          <template #icon>
            <n-icon :size="20"><Delete20Regular/></n-icon>
          </template>
        </n-button>
        <n-p style="margin-top: 6px;"> 你选中了 {{ props.data_temporary_selected.length }} 行。 </n-p>
      </n-space>
    </n-space>

    <!-- 
      :grid-items="gridItems"
      :item-secondary-size="itemSecondarySize"
    -->
    <div class="dynamic-scroller-demo">
      <DynamicScroller 
        class="table" ref="scrollbar" style="width: 440px;"
        :items="props.data_temporary"
        :minItemSize="itemSize - 20">
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
            :data-active="active"
            class="message" 
            @click="handleItemClick"
            @Dblclick="handleItemDbClick(item)">
            <div class="media_info">
              <n-checkbox class="checkbox" 
                v-if="!bool_start_play"
                v-model:checked="item.selected"
                @update:checked="(checked: any) => { 
                  item.selected = checked;
                  emit('playlist_Files_selected_set', item);
                }"
                />
              <div 
                style="margin-left: 10px;
                  width: 58px;height: 58px; 
                  border-radius: 6px; overflow: hidden;">
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
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="xRef"
    :y="yRef"
    :options="options_data_dropmenu"
    :show="showDropdownRef"
    :on-clickoutside="onClickoutside"
    @select="handleSelect_data_dropmenu"
  />
</template>

<style>
.dynamic-scroller-demo {
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.table_playlist {
  width: 430px;
  overflow-x:hidden;
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
  background-color: #f0f0f080;
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
  width: 10px;
}
::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 6px;
}
::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 6px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #555;
  border-radius: 6px;
}
</style>