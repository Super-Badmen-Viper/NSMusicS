<script setup lang="ts">
import { use } from "echarts/core";
import { ScatterChart } from "echarts/charts";
import {
  PolarComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent
} from "echarts/components";
import { computed, shallowRef, ref, watch, onBeforeUnmount } from "vue";
import VChart from 'vue-echarts';
import VExample from "./Example.vue";
import { NSelect, NSpace, NButton } from "naive-ui";
import { useI18n } from "vue-i18n";

use([
  ScatterChart,
  PolarComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent
]);

import { store_app_configs_info } from '@/data/data_stores/app/store_app_configs_info'
import { store_view_charts_page_info } from "@/views/view_app/music_page/page_charts/store/store_view_charts_page_info";

const selectedCategory = ref("media_file");

function getData(selectedCategory = "media_file", theme: 'lightTheme' | 'darkTheme' = 'lightTheme') {
  const category = store_view_charts_page_info.charts_data_temporary.find(d => d.type === selectedCategory);
  if (!category) return {};

  const items = category.items;

  // 根据主题设置颜色
  const textColor = theme === 'lightTheme' ? '#333333' : '#ffffff';
  const axisLineColor = theme === 'lightTheme' ? '#81C784' : '#ffffff';
  const tooltipBgColor = theme === 'lightTheme' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(50, 50, 50, 0.9)';
  const tooltipTextColor = theme === 'lightTheme' ? '#333333' : '#ffffff';
  const splitLineColor = theme === 'lightTheme' ? 'rgba(129, 199, 132, 0.5)' : 'rgba(255, 255, 255, 0.3)';

  // 准备极坐标数据 - 三种分组类型
  const groups = {
    group1: { name: "高完播率", color: "#FF6B88" }, // 粉色
    group2: { name: "中完播率", color: "#36A2EB" }, // 蓝色
    group3: { name: "低完播率", color: "#FFCE56" }  // 黄色
  };

  const groupData = {
    group1: [],
    group2: [],
    group3: []
  };

  const maxPlayCount = Math.max(...items.map(item => item.play_count));
  const angleUpperBound = maxPlayCount + 30;

  // 准备散点数据
  items.forEach((item, index) => {
    // 计算完播率百分比
    const completionRate = item.play_count > 0
        ? Math.min(100, Math.round((item.play_complete_count / item.play_count) * 100))
        : 0;

    // 根据完播率分组
    let groupKey = "group3"; // 低完播率: <50%
    if (completionRate >= 80) groupKey = "group1"; // 高完播率: ≥80%
    else if (completionRate >= 50) groupKey = "group2"; // 中完播率: 50-79%

    // 优化角度分布：按数据点均匀分布在360度圆周上
    const angle = Math.min(360, (item.play_count / angleUpperBound) * 360)

    const scatterData = {
      value: [completionRate, angle],
      name: item.name,
      play_count: item.play_count,
      rating: item.rating,
      starred: item.starred,
      play_complete_count: item.play_complete_count,
      play_date: item.play_date,
      completion_rate: completionRate,
      symbolSize: Math.min(40, Math.max(10, Math.floor(item.play_count) / 4)), // 点大小与播放次数相关
      symbol: "circle"
    };

    // 添加到对应分组
    groupData[groupKey].push(scatterData);
  });

  return {
    textStyle: {
      fontWeight: 600,
      fontSize: 8,
      color: textColor // 动态文本颜色
    },
    title: {
      text: `${category.name}播放分布`,
      left: "5%",
      top: "5%",
      textStyle: {
        color: textColor // 动态标题颜色
      }
    },
    tooltip: {
      trigger: "item",
      backgroundColor: tooltipBgColor, // 动态提示框背景
      textStyle: {
        color: tooltipTextColor, // 动态提示框文本
        fontSize: 14
      },
      extraCssText: 'border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);',
      formatter: function(params) {
        const data = params.data;
        if (data.name.includes("无数据")) {
          return `${data.name}`;
        }

        const starStatus = data.starred
            ? '<span style="color:#67C23A;">✓ 已收藏</span>'
            : '<span style="color:#F56C6C;">✗ 未收藏</span>';

        // 生成星级评分（1-5星）
        const ratingValue = parseFloat(data.rating);
        const fullStars = '★'.repeat(Math.floor(ratingValue));
        const emptyStars = '☆'.repeat(5 - Math.ceil(ratingValue));

        // 标题颜色根据主题变化
        const titleColor = theme === 'lightTheme' ? '#E53935' : '#FF6B88';

        return `
          <div style="font-weight:bold;font-size:16px;color:${titleColor};margin-bottom:8px;">${data.name}</div>
          <div style="display:flex;flex-direction:column;gap:4px;">
            <div>类型: ${category.name}</div>
            <div>播放次数: <b>${data.play_count}</b> 次</div>
            <div>完整播放: ${data.play_complete_count} 次 (完播率: ${data.completion_rate}%)</div>
            <div>评分: ${data.rating} ${fullStars}${emptyStars}</div>
            <div>收藏状态: ${starStatus}</div>
            <div>最近播放: ${data.play_date}</div>
          </div>
        `;
      }
    },
    legend: {
      show: true,
      right: "5%",
      top: "10%",
      orient: "vertical",
      data: [groups.group1.name, groups.group2.name, groups.group3.name],
      textStyle: {
        fontSize: 12,
        color: textColor // 动态图例文本颜色
      },
      itemGap: 10
    },
    polar: {
      id: 'mainPolar',
      center: ["50%", "50%"],
    },
    angleAxis: {
      polarId: 'mainPolar',
      clockwise: true,
      startAngle: 0,
      min: 0,
      max: 360, // 角度范围0-360度[5](@ref)
      axisLine: {
        show: true,
        lineStyle: { color: axisLineColor }
      },
      axisLabel: {
        show: true,
        formatter: function(val) { // 显示实际播放次数
          return Math.round((val / 360) * angleUpperBound);
        },
        textStyle: { color: textColor, fontSize: 12 }
      },
      splitLine: { lineStyle: { color: splitLineColor } }
    },
    radiusAxis: {
      polarId: 'mainPolar',
      min: 0,
      max: 100, // 完播率范围0-100%[6](@ref)
      splitNumber: 5, // 将半径轴分为5段
      axisLine: {
        show: true,
        lineStyle: { color: axisLineColor }
      },
      axisLabel: {
        formatter: "{value}%", // 正确显示百分比
        textStyle: { color: textColor, fontSize: 12 }
      },
      splitLine: { lineStyle: { color: splitLineColor } }
    },
    series: [
      // 类型1 - 高完播率
      {
        name: groups.group1.name,
        type: "scatter",
        coordinateSystem: "polar",
        polarId: 'mainPolar',
        symbolSize: function(val) {
          return val.symbolSize || 20;
        },
        data: groupData.group1,
        itemStyle: {
          color: groups.group1.color
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowColor: groups.group1.color,
            borderColor: textColor, // 动态边框颜色
            borderWidth: 2
          }
        },
        label: {
          show: true,
          formatter: '{b}',
          position: 'right',
          fontSize: 12,
          color: textColor // 动态标签颜色
        }
      },
      // 类型2 - 中完播率
      {
        name: groups.group2.name,
        type: "scatter",
        coordinateSystem: "polar",
        polarId: 'mainPolar',
        symbolSize: function(val) {
          return val.symbolSize || 20;
        },
        data: groupData.group2,
        itemStyle: {
          color: groups.group2.color
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowColor: groups.group2.color,
            borderColor: textColor, // 动态边框颜色
            borderWidth: 2
          }
        },
        label: {
          show: true,
          formatter: '{b}',
          position: 'right',
          fontSize: 12,
          color: textColor // 动态标签颜色
        }
      },
      // 类型3 - 低完播率
      {
        name: groups.group3.name,
        type: "scatter",
        coordinateSystem: "polar",
        polarId: 'mainPolar',
        symbolSize: function(val) {
          return val.symbolSize || 20;
        },
        data: groupData.group3,
        itemStyle: {
          color: groups.group3.color
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowColor: groups.group3.color,
            borderColor: textColor, // 动态边框颜色
            borderWidth: 2
          }
        },
        label: {
          show: true,
          formatter: '{b}',
          position: 'right',
          fontSize: 12,
          color: textColor // 动态标签颜色
        }
      }
    ],
    animationDuration: 1000,
    grid: {
      top: "10%",
      bottom: "0%",
      containLabel: true
    }
  };
}

const loading = shallowRef(false);
const loadingOptions = {
  text: "加载中…",
  color: "#4ea397",
  maskColor: "rgba(255, 255, 255, 0.4)"
};

// 使用响应式图表配置
const option = shallowRef(getData(selectedCategory.value, store_app_configs_info.theme_name));

const dimensionOptions = computed(() => {
  return store_view_charts_page_info.charts_data_temporary.map(dim => ({
    label: dim.name,
    value: dim.type
  }));
});

// 主题变化监听器
let unwatch_theme_name = watch(
    () => store_app_configs_info.theme_name,
    (newTheme) => {
      loading.value = true;
      option.value = getData(selectedCategory.value, newTheme);
      loading.value = false;
    }
);

// 新增：图表数据变化监听器
let unwatch_charts_data = watch(
    () => store_view_charts_page_info.charts_data_temporary,
    (newData) => {
      // 检查当前选中的分类是否在新数据中存在
      const currentCategory = selectedCategory.value;
      const categoryExists = newData.some(d => d.type === currentCategory);

      if (!categoryExists && newData.length > 0) {
        // 如果当前选中的分类不存在，则选择第一个分类
        selectedCategory.value = newData[0].type;
      }

      // 更新图表
      loading.value = true;
      option.value = getData(selectedCategory.value, store_app_configs_info.theme_name);
      loading.value = false;
    },
    { deep: true } // 深度监听，确保数组内部变化也能触发更新
);

// 分类切换处理
function handleCategoryChange(newCategory: string) {
  loading.value = true;
  option.value = getData(newCategory, store_app_configs_info.theme_name);
  loading.value = false;
}

// 刷新数据
function refresh() {
  loading.value = true;
  option.value = getData(selectedCategory.value, store_app_configs_info.theme_name);
  loading.value = false;
}

// 清理监听器
onBeforeUnmount(() => {
  unwatch_theme_name();
  unwatch_charts_data(); // 清理图表数据监听器
});

const { t } = useI18n({
  inheritLocale: true
})
const title = computed(() => t('TabMusic') + t('Play') + t('Browse'));
</script>

<template>
  <v-example id="polar" :title="title" desc="极坐标散点图：[角度, 半径] ：[均匀分布角度, 完播率]">
    <template #head>
      <n-space style="width: 100%; justify-content: center; margin: 10px 0;">
        <n-select
            v-model:value="selectedCategory"
            :options="dimensionOptions"
            style="width: 160px;"
            @update:value="handleCategoryChange"
        />
        <n-button @click="refresh" type="primary">刷新数据</n-button>
      </n-space>
    </template>
    <v-chart
        :option="option"
        autoresize
        :loading="loading"
        :loading-options="loadingOptions"
    />
  </v-example>
</template>

<style scoped>

</style>