<script setup lang="ts">
import { defineEmits, onMounted } from 'vue';
import Table_Menu_AppSetting from '../views/table/Table_Menu_AppSetting_Line_Virtual.vue'
import type {MenuOption} from "naive-ui";
import {RouterView} from "vue-router";

function get_update_lang(value:any){
  emits('update_lang',value)
}
function get_update_theme(value:any){
  emits('update_theme',value)
}
function get_menuOptions_appBar(value:any){
  emits('menuOptions_appBar',value)
}
function get_selectd_props_app_sidebar(value:any){
  emits('selectd_props_app_sidebar',value)
}

onMounted(async () => {
  emits('router_select','View_Menu_AppSetting')
});
const emits = defineEmits([
  'router_select','update_lang','update_theme','menuOptions_appBar','selectd_props_app_sidebar',
]);
const { 
  app_left_menu_collapsed,window_innerWidth,update_theme,menuOptions_appBar,
} = defineProps<{
  app_left_menu_collapsed:Boolean,window_innerWidth:number,update_theme:Boolean,
  menuOptions_appBar:MenuOption[],selectd_props_app_sidebar:(string | number)[],
}>();
</script>

<template>
  <div class="view_show">
    <Table_Menu_AppSetting
      :app_left_menu_collapsed="app_left_menu_collapsed"
      :window_innerWidth="window_innerWidth"
      @update_lang="get_update_lang"
      :update_theme="update_theme"
      @update_theme="get_update_theme"
      :menuOptions_appBar="menuOptions_appBar"
      @menuOptions_appBar="get_menuOptions_appBar"
      :selectd_props_app_sidebar="selectd_props_app_sidebar"
      @selectd_props_app_sidebar="get_selectd_props_app_sidebar"
    />
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>