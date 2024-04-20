<script setup lang="ts">
import { ref, onMounted,defineEmits } from 'vue';
import Table_System_List_Line_Grid from '../views/table/Table_System_List_Line_Grid.vue'

const emits = defineEmits([
  'router_select',
  'artist_page_num',
  'artist_page_size',
  'page_artistlists_options_Sort_key','page_artistlists_keyword',
  'page_artistlists_selected','page_artistlists_reset_data',
  'album_list_of_artist_id_artist'
]);

onMounted(async () => {
  emits('router_select','View_System_List_ALL')
});

const { } = defineProps<{}>();
</script>

<template>
  <div class="view_show">
    <Table_System_List_Line_Grid
      />
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>