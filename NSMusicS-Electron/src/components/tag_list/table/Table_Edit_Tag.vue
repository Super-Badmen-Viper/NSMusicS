<script setup lang="ts">
import { ref } from "vue";
import {store_player_tag_modify} from "@/store/player/store_player_tag_modify";
const { ipcRenderer } = require('electron');

async function save_edit_tag() {
  const _path = store_player_tag_modify.player_current_media_path;
  const _tag = JSON.parse(JSON.stringify(store_player_tag_modify.player_current_media_tag));
  await ipcRenderer.invoke('node-taglib-sharp-set-media-tag', { _path, _tag });
}
</script>
<template>
  <n-space vertical :size="12">
    <n-table
        style="width: 630px;
          --n-td-color-modal: transparent;--n-border-color-modal: #FFFFFF80;
          --n-td-padding:6px;" :bordered="false" :single-line="false">
      <tr>
        <td style="width: 160px;">{{ $t('filter.title') }}</td>
        <n-input style="width: 500px;" clearable placeholder="" v-model:value="store_player_tag_modify.player_current_media_tag.title"/>
      </tr>
      <tr>
        <td>{{ $t('filter.path') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.path }}</td>
      </tr>
      <tr>
        <td>{{ $t('entity.albumArtist_other') }}</td>
        <n-input style="width: 500px;" clearable placeholder="" v-model:value="store_player_tag_modify.player_current_media_tag.albumArtists"/>
      </tr>
      <tr>
        <td>{{ $t('entity.artist_other') }}</td>
        <n-input style="width: 500px;" clearable placeholder="" v-model:value="store_player_tag_modify.player_current_media_tag.artist"/>
      </tr>
      <tr>
        <td>{{ $t('entity.album_other') }}</td>
        <n-input style="width: 500px;" clearable placeholder="" v-model:value="store_player_tag_modify.player_current_media_tag.album"/>
      </tr>
      <tr>
        <td>{{ $t('filter.disc') }}</td>
        <n-input-number style="width: 500px;" clearable placeholder="" :min="0" v-model:value="store_player_tag_modify.player_current_media_tag.discCount"/>
      </tr>
      <tr>
        <td>{{ $t('common.trackNumber') }}</td>
        <n-input-number style="width: 500px;" clearable placeholder="" :min="0" v-model:value="store_player_tag_modify.player_current_media_tag.trackCount"/>
      </tr>
      <tr>
        <td>{{ $t('common.year') }}</td>
        <n-input-number style="width: 500px;" clearable placeholder="" :min="0" v-model:value="store_player_tag_modify.player_current_media_tag.year"/>
      </tr>
      <tr>
        <td>{{ $t('entity.genre_other') }}</td>
        <n-input style="width: 500px;" clearable placeholder="" v-model:value="store_player_tag_modify.player_current_media_tag.genres"/>
      </tr>
      <tr>
        <td>{{ $t('common.duration') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.duration }}</td>
      </tr>
      <tr>
        <td>{{ $t('filter.isCompilation') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.isCompilation }}</td>
      </tr>
      <tr>
        <td>{{ $t('common.codec') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.codec }}</td>
      </tr>
      <tr>
        <td>{{ $t('common.bitrate') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.audioBitrate }}</td>
      </tr>
      <tr>
        <td>{{ $t('common.channel_other') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.audioChannels }}</td>
      </tr>
      <tr>
        <td>{{ $t('common.size') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.sizeOnDisk }}</td>
      </tr>
      <tr>
        <td>{{ $t('common.favorite') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_starred }}</td>
      </tr>
      <tr>
        <td>{{ $t('filter.playCount') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_playCount }}</td>
      </tr>
      <tr>
        <td>{{ $t('filter.lastPlayed') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_playDate }}</td>
      </tr>
      <tr v-if="false">
        <td>{{ $t('common.modified') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.path }}</td>
      </tr>
      <tr>
        <td>{{ $t('common.albumPeak') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.albumPeak }}</td>
      </tr>
      <tr>
        <td>{{ $t('common.trackPeak') }}</td>
        <td>{{ store_player_tag_modify.player_current_media_tag.trackPeak }}</td>
      </tr>
      <tr>
        <td>{{ $t('filter.comment') }}</td>
        <n-input style="width: 500px;" clearable placeholder="" v-model:value="store_player_tag_modify.player_current_media_tag.comment"/>
      </tr>
      <tr>
        <td>{{ $t('page.fullscreenPlayer.lyrics') }}</td>
        <n-input style="width: 500px;" clearable placeholder="" type="textarea" v-model:value="store_player_tag_modify.player_current_media_tag.lyrics"/>
      </tr>
    </n-table>
    <n-space justify="start">
      <n-button @click="save_edit_tag();">
        {{ $t('common.save') }}
      </n-button>
    </n-space>
  </n-space>
</template>
<style>
::-webkit-scrollbar {
  display: auto;
  width: 6px;
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