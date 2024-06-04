<script setup lang="ts">
import { defineEmits, onMounted } from 'vue';
import Table_Menu_AppSetting from '../views/table/Table_Menu_AppSetting_Line_Virtual.vue'

function get_update_lang(value:any){
  emits('update_lang',value)
}

onMounted(async () => {
  emits('router_select','View_Menu_AppSetting')
});
const emits = defineEmits([
  'router_select','update_lang',
]);
const { 
  app_left_menu_collapsed,window_innerWidth,
} = defineProps<{
  app_left_menu_collapsed:Boolean,window_innerWidth:number,
}>();
</script>

<template>
  <div class="view_show">
    <Table_Menu_AppSetting
      :app_left_menu_collapsed="app_left_menu_collapsed"
      :window_innerWidth="window_innerWidth"
      @update_lang="get_update_lang"
    />
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>