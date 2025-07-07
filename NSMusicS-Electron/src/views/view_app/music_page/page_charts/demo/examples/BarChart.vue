<script setup lang="ts">
import { use, registerTheme } from "echarts/core";
import { BarChart } from "echarts/charts";
import { GridComponent, DatasetComponent } from "echarts/components";
import { shallowRef, ref, computed } from "vue";
import VChart from 'vue-echarts';
import VExample from "./Example.vue";
import getData, { dimensions } from "../data/bar";
import theme from "../theme.json";
import { NSelect } from 'naive-ui';

use([BarChart, DatasetComponent, GridComponent]);
registerTheme("ovilia-green", theme);

const loading = shallowRef(false);
const selectedCategory = ref("单曲");
const loadingOptions = {
  text: "加载中…",
  color: "#4ea397",
  maskColor: "rgba(255, 255, 255, 0.4)"
};
const option = shallowRef(getData(selectedCategory.value));

const dimensionOptions = computed(() => {
  return dimensions.map(dim => ({
    label: dim.name,
    value: dim.name
  }));
});

function handleCategoryChange(newCategory: string) {
  loading.value = true;

  setTimeout(() => {
    option.value = getData(newCategory);
    loading.value = false;
  }, 300);
}

function refresh() {
  loading.value = true;

  setTimeout(() => {
    option.value = getData(selectedCategory.value);
    loading.value = false;
  }, 300);
}
</script>

<template>
  <v-example
    id="bar"
    title="音乐播放数据"
    desc="（按维度分类展示播放次数）"
  >
    <template #head>
      <n-space style="width: 100%; justify-content: center; margin: 10px 0;">
        <n-select
            v-model:value="selectedCategory"
            :options="dimensionOptions"
            style="width: 220px;"
            @update:value="handleCategoryChange"
        />
      </n-space>
    </template>
    <v-chart
      :option="option"
      autoresize
      :loading="loading"
      :loadingOptions="loadingOptions"
    />
    <template #extra>

    </template>
  </v-example>
</template>

<style scoped>

</style>