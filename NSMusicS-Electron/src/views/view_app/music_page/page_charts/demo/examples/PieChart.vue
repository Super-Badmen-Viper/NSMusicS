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
import {NSelect} from "naive-ui";
import {useI18n} from "vue-i18n"; // 导入维度数据

use([
  PieChart,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent
]);

// 随机数据生成函数
function random() {
  return Math.round(300 + Math.random() * 700) / 10;
}
const dimensions = [
  {
    type: "media_file",
    name: "乐曲",
    items: [
      { name: "七里香", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-07" },
      { name: "以父之名", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-06" },
      { name: "晴天", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-05" },
      { name: "夜曲", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-04" },
      { name: "青花瓷", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-03" },
      { name: "稻香", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-02" },
      { name: "双截棍", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-01" },
      { name: "简单爱", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-30" },
      { name: "听妈妈的话", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-29" },
      { name: "东风破", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-28" }
    ].sort((a, b) => b.play_count - a.play_count).slice(0, 10)
  },
  {
    type: "album",
    name: "专辑",
    items: [
      { name: "叶惠美", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-04" },
      { name: "范特西", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-03" },
      { name: "十一月的萧邦", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-02" },
      { name: "七里香", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-01" },
      { name: "八度空间", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-30" },
      { name: "我很忙", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-29" },
      { name: "魔杰座", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-28" },
      { name: "跨时代", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-27" },
      { name: "十二新作", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-26" },
      { name: "哎呦，不错哦", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-25" }
    ].sort((a, b) => b.play_count - a.play_count).slice(0, 10)
  },
  {
    type: "artist",
    name: "艺术家",
    items: [
      { name: "周杰伦", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-01" },
      { name: "林俊杰", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-30" },
      { name: "陈奕迅", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-29" },
      { name: "邓紫棋", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-28" },
      { name: "薛之谦", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-27" },
      { name: "李荣浩", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-26" },
      { name: "王力宏", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-25" },
      { name: "张杰", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-24" },
      { name: "华晨宇", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-23" },
      { name: "毛不易", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-22" }
    ].sort((a, b) => b.play_count - a.play_count).slice(0, 10)
  },
  {
    type: "media_cue",
    name: "光盘",
    items: [
      { name: "经典CD-001", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-28" },
      { name: "怀旧CD-002", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-27" },
      { name: "摇滚CD-003", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-26" },
      { name: "流行CD-004", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-25" },
      { name: "电子CD-005", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-24" },
      { name: "爵士CD-006", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-23" },
      { name: "古典CD-007", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-22" },
      { name: "民谣CD-008", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-21" },
      { name: "蓝调CD-009", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-20" },
      { name: "乡村CD-010", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-19" }
    ].sort((a, b) => b.play_count - a.play_count).slice(0, 10)
  }
];

import { store_app_configs_info } from '@/data/data_stores/app/store_app_configs_info'

const selectedCategory = ref("乐曲");

function getData(selectedCategory = "乐曲", theme: 'lightTheme' | 'darkTheme' = 'lightTheme') {
  // 获取选中的维度数据
  const category = dimensions.find(d => d.name === selectedCategory);
  if (!category) return {};

  const items = category.items;

  // 根据主题设置颜色
  const textColor = theme === 'lightTheme' ? '#333333' : '#ffffff';
  const tooltipBgColor = theme === 'lightTheme' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(50, 50, 50, 0.9)';
  const tooltipTextColor = theme === 'lightTheme' ? '#333333' : '#ffffff';
  const borderColor = theme === 'lightTheme' ? '#ffffff' : '#1a1a1a';

  // 准备饼图数据
  const pieData = items.map(item => ({
    value: item.play_count, // 使用play_count作为值
    name: item.name,
    play_date: item.play_date,
    rating: item.rating,
    starred: item.starred,
    play_complete_count: item.play_complete_count,
    completion_rate: Math.round((item.play_complete_count / item.play_count) * 100) // 计算完播率
  }));

  // 根据播放次数生成颜色映射
  const maxPlayCount = Math.max(...items.map(item => item.play_count));
  const minPlayCount = Math.min(...items.map(item => item.play_count));

  return {
    textStyle: {
      fontWeight: 600,
      fontSize: 14,
      color: textColor // 动态文本颜色
    },
    title: {
      text: `${selectedCategory}播放分布`,
      top: "5%",
      left: "center",
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
        const starStatus = data.starred
            ? '<span style="color:#67C23A;">✓ 已收藏</span>'
            : '<span style="color:#F56C6C;">✗ 未收藏</span>';

        // 生成星级评分（1-5星）
        const stars = '★'.repeat(Math.floor(data.rating)) + '☆'.repeat(5 - Math.floor(data.rating));

        return `
          <div style="font-weight:bold;font-size:16px;margin-bottom:8px;">${data.name}</div>
          <div style="display:flex;flex-direction:column;gap:4px;">
            <div>类型: ${selectedCategory}</div>
            <div>播放次数: ${params.value} 次</div>
            <div>完整播放: ${data.play_complete_count} 次 (完播率: ${data.completion_rate}%)</div>
            <div>评分: ${data.rating} ${stars}</div>
            <div>收藏状态: ${starStatus}</div>
            <div>最近播放: ${data.play_date}</div>
          </div>
        `;
      }
    },
    legend: {
      type: 'scroll',
      orient: "vertical",
      top: "20%",
      left: "5%",
      height: '65%',
      data: items.map(item => item.name),
      textStyle: {
        color: textColor // 动态图例文本颜色
      },
      formatter: function(name) {
        // 简略显示名称，避免过长
        return name.length > 6 ? name.substring(0, 6) + '...' : name;
      }
    },
    series: [
      {
        name: "播放次数",
        type: "pie",
        radius: ["30%", "70%"], // 环形饼图
        center: ["65%", "55%"],
        avoidLabelOverlap: true, // 避免标签重叠
        roseType: 'radius', // 南丁格尔玫瑰图
        itemStyle: {
          borderRadius: 10, // 扇形圆角
          borderColor: borderColor, // 动态边框颜色
          borderWidth: 2,
          // 根据播放次数生成颜色
          color: function(params) {
            const ratio = (pieData[params.dataIndex].value - minPlayCount) / (maxPlayCount - minPlayCount);
            return `hsl(${400 * (1 - ratio)}, 70%, 50%)`;
          }
        },
        label: {
          show: false,
          position: "center",
          formatter: '{b}\n{c}次',
          color: textColor // 动态标签颜色
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: "bold",
            color: textColor // 动态强调标签颜色
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: theme === 'lightTheme'
                ? "rgba(0, 0, 0, 0.5)"
                : "rgba(255, 255, 255, 0.5)" // 动态高亮阴影效果
          }
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 20,
          smooth: true,
          lineStyle: {
            color: textColor // 动态标签线颜色
          }
        },
        data: pieData
      }
    ],
    // 添加视觉映射组件
    visualMap: {
      show: false,
      min: minPlayCount,
      max: maxPlayCount,
      inRange: {
        colorLightness: theme === 'lightTheme' ? [0.8, 0.3] : [0.3, 0.8] // 根据主题反转明度映射
      }
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
  return dimensions.map(dim => ({
    label: dim.name,
    value: dim.name
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

// 分类切换处理
function handleCategoryChange(newCategory: string) {
  loading.value = true;
  option.value = getData(newCategory, store_app_configs_info.theme_name);
  loading.value = false;
}

// 刷新数据
function refresh() {
  loading.value = true;
  setTimeout(() => {
    option.value = getData(selectedCategory.value, store_app_configs_info.theme_name);
    loading.value = false;
  }, 300);
}

// 清理监听器
onBeforeUnmount(() => {
  unwatch_theme_name();
});

const { t } = useI18n({
  inheritLocale: true
})
const title = computed(() => t('TabMusic') + t('Play') + t('Browse'));
</script>

<template>
  <v-example id="pie" :title="title" desc="饼图：展示播放占比">
    <template #head>
      <n-space style="width: 100%; justify-content: center; margin: 10px 0;">
        <n-select
            v-model:value="selectedCategory"
            :options="dimensionOptions"
            style="width: 160px;"
            @update:value="handleCategoryChange"
        />
      </n-space>
    </template>
    <v-chart
        ref="pie"
        :option="option"
        autoresize
        :loading="loading"
        :loading-options="loadingOptions"
    />
  </v-example>
</template>

<style scoped>

</style>