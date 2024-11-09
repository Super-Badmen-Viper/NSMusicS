<script setup lang="ts">
  import Table_Edit_Tag from './table/Table_Edit_Tag.vue'
</script>

<template>
  <n-space class="this_Bar_Music_PlayList">
    <div class="layout_distribution_4">
      <Table_Edit_Tag/>
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