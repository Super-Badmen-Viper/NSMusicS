<script setup lang="ts">
import { ref, onMounted } from 'vue'

const avatars = [
  'https://avatars.githubusercontent.com/u/20943608?s=60&v=4',
  'https://avatars.githubusercontent.com/u/46394163?s=60&v=4',
  'https://avatars.githubusercontent.com/u/39197136?s=60&v=4',
  'https://avatars.githubusercontent.com/u/19239641?s=60&v=4'
]

const items = ref<{ key: string; value: number; avatar: string; }[]>([])
const albumSize = ref(20) // 初始专辑尺寸

onMounted(() => {
  items.value = Array.from({ length: 10000 }, (_, i) => ({
    key: `${i}`,
    value: i,
    avatar: avatars[i % avatars.length]
  }))
})
</script>
<template>
  <div class="album-wall-container">
    <n-virtual-list class="album-wall" 
      :item-size="albumSize" 
      :items="items"
      ignore-item-resize>
      <template #default="{ item }">
        <div class="album" :key="item.key">
          <img class="album-cover" :src="item.avatar" alt="">
          <br>
          <span class="album-title">{{ item.value }}</span>
        </div>
      </template>
    </n-virtual-list>
  </div>
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
  padding: 10px;
}
.album {
  margin: 10px;
  float: left;
  flex-direction: column;
  align-items: center;
}
.album-cover {
  width: 150px;
  height: 150px;
  border-radius: 8px;
}
.album-title {
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
}
</style>
