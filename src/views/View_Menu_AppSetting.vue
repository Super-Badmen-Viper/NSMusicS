<script setup lang="ts">
import { defineEmits, onMounted } from 'vue';
import Table_Menu_AppSetting from '../views/table/Table_Menu_AppSetting_Line_Virtual.vue'

function get_update_theme(value:any){
  emits('update_theme',value)
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
  'update_theme',
]);
</script>
<template>
  <div class="view_show">
    <Table_Menu_AppSetting
      @server_config_of_current_user_of_sqlite="get_server_config_of_current_user_of_sqlite"
      @server_config_of_all_user_of_sqlite="get_server_config_of_all_user_of_sqlite"
      @update_theme="get_update_theme"
    />
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>