<script setup lang="ts">
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import { shallowRef, ref, watch, computed, onBeforeUnmount } from 'vue'
import VChart from 'vue-echarts'
import VExample from './Example.vue'
import { NSelect, NSpace } from 'naive-ui'

use([PieChart, TitleComponent, LegendComponent, TooltipComponent, VisualMapComponent])

import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { store_view_charts_page_info } from '@/views/view_app/page/page_charts/store/store_view_charts_page_info'

const selectedCategory = ref('media_file')

function getData(
  selectedCategory = 'media_file',
  theme: 'lightTheme' | 'darkTheme' = 'lightTheme'
) {
  // 获取选中的维度数据
  const category = store_view_charts_page_info.charts_data_temporary.find(
    (d) => d.type === selectedCategory
  )
  if (!category) return {}

  const items = category.items

  // 根据主题设置颜色
  const textColor = theme === 'lightTheme' ? '#333333' : '#ffffff'
  const tooltipBgColor =
    theme === 'lightTheme' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(50, 50, 50, 0.9)'
  const tooltipTextColor = theme === 'lightTheme' ? '#333333' : '#ffffff'
  const borderColor = theme === 'lightTheme' ? '#ffffff' : '#1a1a1a'

  // 准备饼图数据
  const pieData = items.map((item) => ({
    value: item.play_count, // 使用play_count作为值
    name: item.name,
    play_date: item.play_date,
    rating: item.rating,
    starred: item.starred,
    play_complete_count: item.play_complete_count,
    completion_rate: Math.round((item.play_complete_count / item.play_count) * 100), // 计算完播率
  }))

  // 根据播放次数生成颜色映射
  const maxPlayCount = Math.max(...items.map((item) => item.play_count))
  const minPlayCount = Math.min(...items.map((item) => item.play_count))

  return {
    textStyle: {
      fontWeight: 600,
      fontSize: 14,
      color: textColor, // 动态文本颜色
    },
    title: {
      text: `${category.name}` + t('Play') + t('Sort'),
      top: '5%',
      left: 'center',
      textStyle: {
        color: textColor, // 动态标题颜色
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: tooltipBgColor, // 动态提示框背景
      textStyle: {
        color: tooltipTextColor, // 动态提示框文本
        fontSize: 14,
      },
      extraCssText: 'border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);',
      formatter: function (params) {
        const data = params.data
        const starStatus = data.starred
          ? '<span style="color:#67C23A;">✓ 已收藏</span>'
          : '<span style="color:#F56C6C;">✗ 未收藏</span>'

        // 生成星级评分（1-5星）
        const stars = '★'.repeat(Math.floor(data.rating)) + '☆'.repeat(5 - Math.floor(data.rating))

        return `
          <div style="font-weight:bold;font-size:16px;margin-bottom:8px;">${data.name}</div>
          <div style="display:flex;flex-direction:column;gap:4px;">
            <div>类型: ${category.name}</div>
            <div>播放次数: ${params.value} 次</div>
            <div>完整播放: ${data.play_complete_count} 次 (完播率: ${data.completion_rate}%)</div>
            <div>评分: ${data.rating} ${stars}</div>
            <div>收藏状态: ${starStatus}</div>
            <div>最近播放: ${data.play_date}</div>
          </div>
        `
      },
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      top: '20%',
      left: '5%',
      height: '65%',
      data: items.map((item) => item.name),
      textStyle: {
        color: textColor, // 动态图例文本颜色
      },
      formatter: function (name) {
        // 简略显示名称，避免过长
        return name.length > 6 ? name.substring(0, 6) + '...' : name
      },
    },
    series: [
      {
        name: '播放次数',
        type: 'pie',
        radius: ['30%', '70%'], // 环形饼图
        center: ['65%', '55%'],
        avoidLabelOverlap: true, // 避免标签重叠
        roseType: 'radius', // 南丁格尔玫瑰图
        itemStyle: {
          borderRadius: 10, // 扇形圆角
          borderColor: borderColor, // 动态边框颜色
          borderWidth: 2,
          color: function (params) {
            // 生成自然柔和的随机颜色（HSL模型）
            const h = Math.floor(Math.random() * 360) // 色相 0-360
            const s = Math.floor(Math.random() * 30) + 70 // 饱和度 70%-100%
            const l = Math.floor(Math.random() * 20) + 60 // 亮度 60%-80%
            return `hsl(${h}, ${s}%, ${l}%)`
          },
        },
        label: {
          show: false,
          position: 'center',
          formatter: '{b}\n{c}次',
          color: textColor, // 动态标签颜色
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold',
            color: textColor, // 动态强调标签颜色
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: theme === 'lightTheme' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)', // 动态高亮阴影效果
          },
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 20,
          smooth: true,
          lineStyle: {
            color: textColor, // 动态标签线颜色
          },
        },
        data: pieData,
      },
    ],
    // 添加视觉映射组件
    visualMap: {
      show: false,
      min: minPlayCount,
      max: maxPlayCount,
      inRange: {
        colorLightness: theme === 'lightTheme' ? [0.8, 0.3] : [0.3, 0.8], // 根据主题反转明度映射
      },
    },
  }
}

const loading = shallowRef(false)
const loadingOptions = {
  text: '加载中…',
  color: '#4ea397',
  maskColor: 'rgba(255, 255, 255, 0.4)',
}

// 使用响应式图表配置
const option = shallowRef(getData(selectedCategory.value, store_system_configs_info.theme_name))

const dimensionOptions = computed(() => {
  return store_view_charts_page_info.charts_data_temporary.map((dim) => ({
    label: dim.name,
    value: dim.type,
  }))
})

// 主题变化监听器
let unwatch_theme_name = watch(
  () => store_system_configs_info.theme_name,
  (newTheme) => {
    loading.value = true
    option.value = getData(selectedCategory.value, newTheme)
    loading.value = false
  }
)

// 新增：图表数据变化监听器
let unwatch_charts_data = watch(
  () => store_view_charts_page_info.charts_data_temporary,
  (newData) => {
    // 检查当前选中的分类是否在新数据中存在
    const currentCategory = selectedCategory.value
    const categoryExists = newData.some((d) => d.type === currentCategory)

    if (!categoryExists && newData.length > 0) {
      // 如果当前选中的分类不存在，则选择第一个分类
      selectedCategory.value = newData[0].type
    }

    // 更新图表
    loading.value = true
    option.value = getData(selectedCategory.value, store_system_configs_info.theme_name)
    loading.value = false
  },
  { deep: true } // 深度监听，确保数组内部变化也能触发更新[2](@ref)
)

// 分类切换处理
function handleCategoryChange(newCategory: string) {
  loading.value = true
  option.value = getData(newCategory, store_system_configs_info.theme_name)
  loading.value = false
}

// 刷新数据
async function refresh() {
  loading.value = true
  await store_view_charts_page_logic.fetchData_Charts()
  option.value = getData(selectedCategory.value, store_system_configs_info.theme_name)
  loading.value = false
}

// 清理监听器
onBeforeUnmount(() => {
  unwatch_theme_name()
  unwatch_charts_data() // 清理图表数据监听器[6](@ref)
})

////// i18n auto lang
import { useI18n } from 'vue-i18n'
import { store_view_charts_page_logic } from '@/views/view_app/page/page_charts/store/store_view_charts_page_logic'
const { t } = useI18n({
  inheritLocale: true,
})
const title = computed(() => t('TabMusic') + t('Play') + t('Browse'))
</script>

<template>
  <v-example id="pie" :title="title" desc="饼图：展示播放占比">
    <template #head>
      <n-space style="width: 100%; justify-content: center; margin: 10px 0">
        <n-select
          v-model:value="selectedCategory"
          :options="dimensionOptions"
          style="width: 160px"
          @update:value="handleCategoryChange"
        />
        <n-button @click="refresh" type="primary">刷新数据</n-button>
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
/* 响应式容器设计 */
.responsive-chart {
  width: 100%;
  min-height: 300px;
  position: relative;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .responsive-chart {
    min-height: 250px;
  }
}
</style>
