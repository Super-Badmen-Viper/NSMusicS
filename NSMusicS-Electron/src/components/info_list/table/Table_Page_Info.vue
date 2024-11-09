<script setup lang="ts">
import { ref } from "vue";
</script>
<template>
  <n-space vertical :size="12">
    <n-form>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('filter.title') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('filter.path') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('entity.albumArtist_other') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('entity.artist_other') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('entity.album_other') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('filter.disc') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('common.trackNumber') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('common.year') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('entity.genre_other') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('common.duration') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('filter.isCompilation') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('common.codec') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('common.bitrate') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('common.channel_other') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('common.size') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('common.favorite') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('filter.playCount') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('filter.lastPlayed') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('common.modified') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('common.albumPeak') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('common.trackPeak') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
      <n-space align="center" style="margin-bottom: 10px;">
        <div style="width: 100px;">{{ $t('filter.comment') }}</div>
        <n-input style="width: 400px;" clearable />
      </n-space>
    </n-form>
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