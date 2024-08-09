<script setup lang="ts">
  import type {MenuOption} from "naive-ui";
  import {onMounted, ref, watch, onBeforeUnmount} from "vue";
  import { store_app_setting_configs } from '@/store/app/store_app_setting_configs'

  ////// lineItems Re render
  let bool_watch = false;
  let timer = ref<NodeJS.Timeout | null>(null);
  const startTimer = () => {
    timer.value = setInterval(() => {
      bool_watch = true;
    }, 1000);
  };
  const stopWatching_collapsed_width = watch(() => store_app_setting_configs.app_left_menu_collapsed, (newValue, oldValue) => {
    updateGridItems();
  });
  const stopWatching_window_innerWidth = watch(() => store_app_setting_configs.window_innerWidth, (newValue, oldValue) => {
    bool_watch = false;
    updateGridItems();
    if (bool_watch) {
      startTimer();
    }
  });
  const collapsed_width = ref<number>(1090);
  const updateGridItems = () => {
    if (store_app_setting_configs.app_left_menu_collapsed == true) {
      collapsed_width.value = 145;
    } else {
      collapsed_width.value = 240;
    }
  };
  onMounted(() => {
    startTimer();
    updateGridItems();
  });

  ////// view songlist_view Remove data
  onBeforeUnmount(() => {
    stopWatching_collapsed_width()
    stopWatching_window_innerWidth()
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
  });
</script>
<template>
  <div class="view">
    <n-layout
        embedded
        content-style="margin-left: 9px;"
        vertical
        :size="12" >
      <n-card
          class="table"
          style="overflow: hidden;border-radius: 6px;"
          :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 160) + 'px)'}">
        开发中，敬请期待
      </n-card>
    </n-layout>
  </div>
</template>
<style scoped>
.view{
  height: calc(100vh - 160px);
  overflow: auto;
  overflow-x:hidden;
  display: flex;
  flex-direction: column;
}
.table{
  height: calc(100vh - 160px);
  overflow: auto;
}

::-webkit-scrollbar {
  display: auto;
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #88888850;
  border-radius: 6px;
}
::-webkit-scrollbar-track {
  background-color: #f1f1f105;
  border-radius: 6px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #88888850;
  border-radius: 6px;
}
</style>