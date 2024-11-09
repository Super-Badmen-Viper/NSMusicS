<script setup lang="ts">
import { ref } from "vue";
const item = ref({
  title: "坏空空"
})
</script>
<template>
  <n-space vertical :size="12">
    <n-table
        style="width: 630px;
          --n-td-color-modal: transparent;--n-border-color-modal: #FFFFFF80;
          --n-td-padding:6px;" :bordered="false" :single-line="false">
      <tr>
        <td style="width: 160px;">{{ $t('filter.title') }}</td>
        <td>反常的</td>
      </tr>
      <tr>
        <td>{{ $t('filter.path') }}</td>
        <td>反常的</td>
      </tr>
      <tr>
        <td>{{ $t('entity.albumArtist_other') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('entity.artist_other') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('entity.album_other') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('filter.disc') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('common.trackNumber') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('common.year') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('entity.genre_other') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('common.duration') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('filter.isCompilation') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('common.codec') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('common.bitrate') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('common.channel_other') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('common.size') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('common.favorite') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('filter.playCount') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('filter.lastPlayed') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('common.modified') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('common.albumPeak') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('common.trackPeak') }}</td>
        
      </tr>
      <tr>
        <td>{{ $t('filter.comment') }}</td>
        
      </tr>
    </n-table>
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