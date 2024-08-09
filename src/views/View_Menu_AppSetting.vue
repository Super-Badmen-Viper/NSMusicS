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
function get_player_fade_value(value:any){
  emits('player_fade_value',value)
}
function get_player_use_lottie_animation(value: any){
  emits('player_use_lottie_animation',value)
}
function get_server_config_of_current_user_of_sqlite(value: any){
  emits('server_config_of_current_user_of_sqlite',value)
}
function get_server_config_of_all_user_of_sqlite(value: any){
  emits('server_config_of_all_user_of_sqlite',value)
}

onMounted(async () => {
  emits('router_select','View_Menu_AppSetting')
});
const emits = defineEmits([
  'router_select',
  'server_config_of_current_user_of_sqlite',
  'update_lang','update_theme',
  'player_fade_value','player_use_lottie_animation',
]);
const {
  player_fade_value,player_use_lottie_animation
} = defineProps<{
  player_fade_value:number,player_use_lottie_animation:Boolean,
}>();
</script>
<template>
  <div class="view_show">
    <Table_Menu_AppSetting
      @server_config_of_current_user_of_sqlite="get_server_config_of_current_user_of_sqlite"
      @server_config_of_all_user_of_sqlite="get_server_config_of_all_user_of_sqlite"
      @update_lang="get_update_lang"
      @update_theme="get_update_theme"
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