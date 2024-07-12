<script setup lang="ts">
  import {onMounted} from "vue";
  import Table_Updateing from '../views/table/Table_Updateing.vue'

  const emits = defineEmits([
    'router_select'
  ]);
  const {
    app_left_menu_collapsed,window_innerWidth
  } = defineProps<{
    app_left_menu_collapsed:Boolean,window_innerWidth:number
  }>();
  onMounted(async () => {
    emits('router_select','View_Updateing')
  });
</script>
<template>
  <div class="view_show">
    <Table_Updateing
      :app_left_menu_collapsed="app_left_menu_collapsed"
      :window_innerWidth="window_innerWidth"
    />
  </div>
</template>
<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>