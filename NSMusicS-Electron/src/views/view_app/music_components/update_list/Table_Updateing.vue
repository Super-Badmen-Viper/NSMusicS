<script setup lang="ts">
import { ref } from 'vue'

////// lineItems Re render
const collapsed_width = ref(80)
</script>
<template>
  <div class="view">
    <n-layout embedded content-style="margin-left: 9px;" vertical :size="12">
      <n-card
        class="table"
        style="overflow: hidden; border-radius: 4px"
        :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 160) + 'px)' }"
      >
        <span style="font-size: 24px; font-weight: 800">Not open || 未开放</span>
      </n-card>
    </n-layout>
  </div>
</template>
<style scoped>
.view {
  height: calc(100vh - 160px);
  overflow: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}
.table {
  height: calc(100vh - 160px);
  overflow: auto;
}

::-webkit-scrollbar {
  display: auto;
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #88888850;
  border-radius: 4px;
}
::-webkit-scrollbar-track {
  background-color: #f1f1f105;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #88888850;
  border-radius: 4px;
}
</style>
