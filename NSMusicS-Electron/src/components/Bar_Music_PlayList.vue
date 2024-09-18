<script setup lang="ts">
import Table_Song_List from '../views/table/Table_Music_PlayList_Line_Virtual.vue'
</script>

<template>
  <n-space class="this_Bar_Music_PlayList">
    <div class="layout_distribution_4">
      <Table_Song_List/>
    </div>
  </n-space>
</template>

<style>
.this_Bar_Music_PlayList {
  margin-top: 0;
  z-index: 100;
  border-radius: 12px 12px 0 12px;
}
.layout_distribution_4 {
  display: flex;
  justify-content: space-between;
  z-index: 99;
}
</style>