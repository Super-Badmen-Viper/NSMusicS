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
function get_player_fade_value(value:any){
  emits('player_fade_value',value)
}
function get_player_use_lottie_animation(value: any){
  emits('player_use_lottie_animation',value)
}
function get_menu_appsetting_select_tab_name(value: any){
  emits('menu_appsetting_select_tab_name',value)
}
function get_server_config_of_current_user_of_sqlite(value: any){
  emits('server_config_of_current_user_of_sqlite',value)
}
function get_server_config_of_all_user_of_sqlite(value: any){
  emits('server_config_of_all_user_of_sqlite',value)
}
function get_library_path(value: any){
  emits('library_path',value)
}
function get_model_select(value: any){
  emits('model_select',value)
}

onMounted(async () => {
  emits('router_select','View_Menu_AppSetting')
});
const emits = defineEmits([
  'router_select',
  'menu_appsetting_select_tab_name','server_config_of_current_user_of_sqlite','server_config_of_all_user_of_sqlite',
  'update_lang','model_select','update_theme','library_path','menuOptions_appBar','selectd_props_app_sidebar',
  'player_fade_value','player_use_lottie_animation',
]);
const { 
  app_left_menu_collapsed,window_innerWidth,
  menu_appsetting_select_tab_name,

  server_config_of_current_user_of_sqlite_of_select_servername,
  server_config_of_current_user_of_sqlite_of_select,
  server_config_of_all_user_of_select,
  server_config_of_current_user_of_sqlite,server_config_of_all_user_of_sqlite,

  model_select,
  update_theme,library_path,menuOptions_appBar,
  player_fade_value,player_use_lottie_animation
} = defineProps<{
  app_left_menu_collapsed:Boolean,window_innerWidth:number,
  menu_appsetting_select_tab_name: any,

  server_config_of_current_user_of_sqlite_of_select_servername: string,
  server_config_of_current_user_of_sqlite_of_select: {label: string;value: string},
  server_config_of_all_user_of_select: {label: string;value: string}[],
  server_config_of_current_user_of_sqlite:Server_Configs_Props,server_config_of_all_user_of_sqlite:Server_Configs_Props[],

  model_select: any,
  update_theme:Boolean,library_path: any,menuOptions_appBar:MenuOption[],selectd_props_app_sidebar:(string | number)[],
  player_fade_value:number,player_use_lottie_animation:Boolean,
}>();
</script>
<template>
  <div class="view_show">
    <Table_Menu_AppSetting
      :app_left_menu_collapsed="app_left_menu_collapsed"
      :window_innerWidth="window_innerWidth"
      :menu_appsetting_select_tab_name="menu_appsetting_select_tab_name"
      @menu_appsetting_select_tab_name="get_menu_appsetting_select_tab_name"
      :server_config_of_current_user_of_sqlite_of_select_servername="server_config_of_current_user_of_sqlite_of_select_servername"
      :server_config_of_current_user_of_sqlite_of_select="server_config_of_current_user_of_sqlite_of_select"
      :server_config_of_all_user_of_select="server_config_of_all_user_of_select"
      :server_config_of_current_user_of_sqlite="server_config_of_current_user_of_sqlite"
      @server_config_of_current_user_of_sqlite="get_server_config_of_current_user_of_sqlite"
      :server_config_of_all_user_of_sqlite="server_config_of_all_user_of_sqlite"
      @server_config_of_all_user_of_sqlite="get_server_config_of_all_user_of_sqlite"
      @update_lang="get_update_lang"
      :update_theme="update_theme"
      @update_theme="get_update_theme"
      :model_select="model_select"
      @model_select="get_model_select"
      :library_path="library_path"
      @library_path="get_library_path"
      :menuOptions_appBar="menuOptions_appBar"
      @menuOptions_appBar="get_menuOptions_appBar"
      :selectd_props_app_sidebar="selectd_props_app_sidebar"
      @selectd_props_app_sidebar="get_selectd_props_app_sidebar"
      :player_fade_value="player_fade_value"
      @player_fade_value="get_player_fade_value"
      :player_use_lottie_animation="player_use_lottie_animation"
      @player_use_lottie_animation="get_player_use_lottie_animation"
    />
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>