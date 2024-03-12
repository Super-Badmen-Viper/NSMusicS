<template>
  <n-page-header 
    style="
      background-image: url(../../../resources/error_album.jpg);
      background-size: cover;
      background-position: center;
      border-radius: 16px;">
    <n-grid :cols="6">
      <n-gi><n-statistic label="歌曲数" value="1222 首" /></n-gi>
      <n-gi><n-statistic label="收藏数" value="22 首" /></n-gi>
    </n-grid>
    <template #title>
      <n-space>
        <n-breadcrumb separator=">">
            <n-breadcrumb-item 
              v-for="item in breadcrumbItems" 
              :key="item" 
              style="font-size: 22px">
              {{ item }}
            </n-breadcrumb-item>
        </n-breadcrumb>
      </n-space>  
    </template>
    <template #header>
      
    </template>
    <template #avatar>
      <n-image
        width="80px"
        src="../../../resources/00album.png"
      />
    </template>
    <template #extra>
      
    </template>
    <template #footer>
      
    </template>
  </n-page-header>
</template>
<script setup lang="ts">
  import { ref } from 'vue';

  const songs = ref([
    {value: "Rock'n'Roll Star",label: "所有歌曲"},
    {value: 'Shakermaker',label: '收藏歌曲'},
    {value: 'Live Forever',label: '播放列表'}
  ].map((s) => {
    s.value = s.value.toLowerCase();
    return s;
  }));

  const value = ref(null);

  const breadcrumbItems = ref(['乐库','全部歌曲']);

  import {
    AddCircle32Regular,
    MultiselectLtr20Filled,
    Delete20Regular,
    SelectAllOn24Regular,
    PlayCircle20Filled,
    ArrowSort24Regular,TextSortAscending20Regular,TextSortDescending20Regular,
    Search20Filled,
    Filter16Regular,
    SaveEdit24Regular
  } from '@vicons/fluent'
</script>