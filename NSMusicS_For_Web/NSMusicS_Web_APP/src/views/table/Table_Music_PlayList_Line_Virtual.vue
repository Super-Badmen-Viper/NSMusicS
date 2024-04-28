<script setup lang="ts">
import { ref, h, onMounted } from 'vue';
import { type DropdownOption, NIcon } from 'naive-ui';
const emits = defineEmits([
  'media_file_path','media_file_path_from_playlist',
  'media_file_medium_image_url',
  'this_audio_singer_name',
  'this_audio_song_name',
  'this_audio_album_name','this_audio_album_id','this_audio_album_favite',
  'this_audio_Index',
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
  this_audio_Index: number;
}>();
//
const scrollbar = ref(null as any);
const this_audio_Index = ref<number>(0)
onMounted(() => {
  this_audio_Index.value = props.this_audio_Index;
  if (scrollbar !== null) {
    setTimeout(() => {
      scrollbar.value.scrollToItem(this_audio_Index.value);
    }, 100);
  }
});
const click_select_ALL_row = () => {
  if(props.data_temporary_selected.length == 0){
    emits('playlist_Files_selected_set_all', true);
  }else{
    emits('playlist_Files_selected_set_all', false);
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
    emits('menu_edit_this_song',this_audio_Index.value);
  } 
  else if (option === 'add') {
    emits('menu_add_this_song',this_audio_Index.value);
  }
  else if (option === 'delete') {
    emits('menu_delete_this_song',this_audio_Index.value);
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
const itemSize = 70;// height
//
const handleItemClick = () => {
  click_count++
}
const handleItemDbClick = (media_file:Media_File) => {
  if(bool_start_play.value == true){
    if(click_count >= 2){
      click_count = 0

      emits('media_file_path_from_playlist',true)
      emits('media_file_path', media_file.path)
      emits('this_audio_lyrics_string', media_file.lyrics)
      emits('media_file_medium_image_url',media_file.medium_image_url)
      emits('this_audio_singer_name',media_file.artist)
      emits('this_audio_song_name',media_file.title)
      emits('this_audio_album_id', media_file.album_id);
      emits('this_audio_album_favite', media_file.favorite);
      emits('this_audio_album_name',media_file.album)
      emits('this_audio_Index', media_file.absoluteIndex); 
    }
  }
}
const handleItemClick_title = (title:string) => {
  click_count = 0;
}
const handleItemClick_artist = (artist:string) => {
  click_count = 0;
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
    <n-space v-if="false">
      <n-button quaternary circle size="medium" style="margin-left:4px" @click="click_bulk_operation">
        <template #icon>
          <n-icon :size="20"><MultiselectLtr20Filled/></n-icon>
        </template>
      </n-button>   
      
      <n-space v-if="!bool_start_play">
        <n-button quaternary circle size="medium" style="margin-left:4px" @click="click_select_ALL_row">
          <template #icon>
            <n-icon :size="20"><SelectAllOn24Regular/></n-icon>
          </template>
        </n-button>
        <n-button quaternary circle size="medium" style="margin-left:4px">
          <template #icon>
            <n-icon :size="20"><AddCircle32Regular/></n-icon>
          </template>
        </n-button>
        <n-button flo quaternary circle size="medium" style="margin-left:4px">
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
        class="table" ref="scrollbar" style="width: 410px;"
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
                  emits('playlist_Files_selected_set', item);
                }"
                />
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