<script setup lang="ts">
import { ref } from "vue";
</script>
<template>
  <n-space vertical :size="12">
    <n-table
        style="width: 630px;
          --n-td-color-modal: transparent;--n-border-color-modal: #FFFFFF80;
          --n-td-padding:6px;" :bordered="false" :single-line="false">
      <tr>
        <td style="width: 160px;">{{ $t('filter.title') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('filter.path') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('entity.albumArtist_other') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('entity.artist_other') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('entity.album_other') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('filter.disc') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('common.trackNumber') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('common.year') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('entity.genre_other') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('common.duration') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('filter.isCompilation') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('common.codec') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('common.bitrate') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('common.channel_other') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('common.size') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('common.favorite') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('filter.playCount') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('filter.lastPlayed') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('common.modified') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('common.albumPeak') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('common.trackPeak') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
      <tr>
        <td>{{ $t('filter.comment') }}</td>
        <n-input style="width: 500px;" clearable placeholder=""/>
      </tr>
    </n-table>
    <n-space justify="start">
      <n-button @click="update_server_addUser();">
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