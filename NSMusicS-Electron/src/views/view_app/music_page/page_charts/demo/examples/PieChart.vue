<script setup lang="ts">
import { use } from "echarts/core";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent // 添加视觉映射组件
} from "echarts/components";
import {shallowRef, ref, watch, computed} from "vue";
import VChart from 'vue-echarts';
import VExample from "./Example.vue";
import getData, { dimensions } from "../data/pie";
import {NSelect} from "naive-ui"; // 导入维度数据

use([
  PieChart,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent
]);

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
  <v-example id="pie" title="音乐播放分布" desc="(饼图展示播放占比)">
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
      ref="pie"
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