<template>
  <div ref="wordCloudChart" style="width: 100%; height: 400px;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts/core';
import 'echarts-wordcloud';
import { TooltipComponent } from 'echarts/components';

echarts.use([TooltipComponent]);

const wordCloudChart = ref<HTMLElement | null>(null);

// 模拟音乐Tag数据
const musicTags = [
  { name: '摇滚', value: 120 },
  { name: '流行', value: 150 },
  { name: '电子', value: 100 },
  { name: '民谣', value: 90 },
  { name: '古典', value: 80 },
  { name: '爵士', value: 70 },
  { name: '嘻哈', value: 110 },
  { name: '轻音乐', value: 60 },
  { name: 'R&B', value: 85 },
  { name: '乡村', value: 50 },
  { name: '金属', value: 75 },
  { name: '独立', value: 95 },
  { name: '后摇', value: 65 },
  { name: 'ACG', value: 130 },
  { name: '怀旧', value: 88 },
  { name: '经典', value: 140 },
  { name: '纯音乐', value: 78 },
  { name: '蓝调', value: 55 },
];

const initChart = () => {
  if (wordCloudChart.value) {
    const chart = echarts.init(wordCloudChart.value);
    const option = {
      tooltip: {
        show: true,
        formatter: function (params: any) {
          return params.name + ': ' + params.value;
        }
      },
      series: [{
        type: 'wordCloud',
        shape: 'circle',
        left: 'center',
        top: 'center',
        width: '90%',
        height: '90%',
        right: null,
        bottom: null,
        sizeRange: [12, 60],
        rotationRange: [-90, 90],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: function () {
            return 'rgb(' + [
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160)
            ].join(',') + ')';
          }
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        data: musicTags
      }]
    };
    chart.setOption(option);
  }
};

onMounted(() => {
  initChart();
});
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>
