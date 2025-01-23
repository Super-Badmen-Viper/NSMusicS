<script setup lang="ts">
import Table_Music_Effect from '@/views/view_music/components_music/player_effect/Table_Music_Effect.vue'
</script>

<template>
  <n-space class="this_Bar_Music_Effect">
    <div class="layout_distribution_4">
      <Table_Music_Effect/>
    </div>
  </n-space>
</template>

<style>
.this_Bar_Music_Effect {
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