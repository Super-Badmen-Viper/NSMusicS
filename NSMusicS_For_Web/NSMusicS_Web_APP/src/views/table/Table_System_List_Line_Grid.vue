<script setup lang="ts">
import { ref, h } from 'vue';
const emits = defineEmits([
  'media_file_path',
  'media_file_medium_image_url',
  'this_audio_singer_name',
  'this_audio_song_name',
  'this_audio_album_name',
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
  'page_songlists_selected'
]);
const props = defineProps<{
  data_temporary: Media_File[];data_temporary_selected: Media_File[];
}>();

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
</script>

<template>
  <n-space vertical :size="12">
    <n-space>
      <n-button tertiary circle>
        <template #icon>
          <n-icon :size="20"><MultiselectLtr20Filled/></n-icon>
        </template>
      </n-button>   
    </n-space>

    <div class="dynamic-scroller-demo">
      
    </div>
  </n-space>
</template>

<style>
.dynamic-scroller-demo {
  overflow: auto;
  display: flex;
  flex-direction: column;
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