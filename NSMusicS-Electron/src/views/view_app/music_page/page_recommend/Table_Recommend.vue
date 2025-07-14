<script setup lang="ts">
import { ref, computed, reactive, watch, nextTick, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
import {
  NMessageProvider,
  NSpace,
  NCard,
  NButton,
  NTag,
  NDataTable,
  NH3,
  NH4,
  NDivider,
  NEmpty,
  NSelect,
  NInput,
  useMessage,
  useThemeVars,
} from 'naive-ui'
import * as echarts from 'echarts/core'
import { TooltipComponent, VisualMapComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import 'echarts-wordcloud'
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/data/data_access/servers_configs/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
import { store_view_recommend_page_info } from '@/views/view_app/music_page/page_recommend/store/store_view_recommend_page_info'
import { store_playlist_list_info } from '@/views/view_app/music_components/player_list/store/store_playlist_list_info'
import { store_app_configs_info } from '@/data/data_stores/app/store_app_configs_info'
import { store_playlist_list_logic } from '@/views/view_app/music_components/player_list/store/store_playlist_list_logic'

echarts.use([TooltipComponent, VisualMapComponent, CanvasRenderer])

const get_NineSong_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
const message = useMessage()
const themeVars = useThemeVars()

// --- Reactive State ---
const loading = reactive({ tags: false, genres: false, recs: false, details: false })
const selectedWords = ref<any[]>([])
const displayMode = ref('chart')
const displayModeOptions = [
  { label: '词云视图', value: 'chart' },
  { label: '标签视图', value: 'tags' },
]
let recommendationDebounceTimer: any = null

// --- ECharts State ---
const wordCloudChartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// --- Proportional Scaling Logic ---
// Reactive property for word size range based on window width
const proportionalSizeRange = computed(() => {
  const width = store_app_configs_info.window_innerWidth
  // Normalize width to a 0-1 range based on typical screen sizes
  const t = Math.max(0, Math.min(1, (width - 500) / 1100))
  const minFontSize = lerp(10, 14, t)
  const maxFontSize = lerp(25, 45, t)
  return [minFontSize, maxFontSize]
})

// Reactive property for word grid size based on window width
const proportionalGridSize = computed(() => {
  const width = store_app_configs_info.window_innerWidth
  const t = Math.max(0, Math.min(1, (width - 500) / 1100))
  // Inverse scaling: larger screen -> smaller grid size for denser packing
  return Math.round(lerp(8, 3, t))
})

// --- Computed EChart Properties for Proportional Scaling ---
const lerp = (start: number, end: number, t: number) => {
  return start * (1 - t) + end * t
}

// --- Computed Properties ---
const wordCloudTags = computed(() => store_view_recommend_page_info.recommend_WordCloudTag_metadata)
const wordCloudGenres = computed(
  () => store_view_recommend_page_info.recommend_WordCloudGenre_metadata
)
const finalSongList = computed(() => store_view_recommend_page_info.recommend_MediaFiles_temporary)

const combinedWordCloudData = computed(() => {
  const tags = wordCloudTags.value.map((tag) => ({ ...tag, type: 'tag' }))
  const genres = wordCloudGenres.value.map((genre) => ({ ...genre, type: 'genre' }))
  return [...tags, ...genres].sort((a, b) => b.count - a.count)
})

// --- Data Table Columns ---
const columns = [
  { title: '标题', key: 'title', resizable: true },
  { title: '歌手', key: 'artist', resizable: true },
  { title: '专辑', key: 'album', resizable: true },
]

// --- Methods ---
const isSelectedWord = (word: any) => selectedWords.value.some((sw) => sw.id === word.id)

const clearSelections = () => {
  selectedWords.value = []
  if (displayMode.value === 'chart') {
    syncChartSelectionState()
  }
  message.info('已清空所有选择')
  store_view_recommend_page_info.recommend_MediaSearch_metadata = []
  store_view_recommend_page_info.recommend_MediaFiles_metadata = []
  store_view_recommend_page_info.recommend_MediaFiles_temporary = []
}

const removeWordSelection = (word: any) => {
  const index = selectedWords.value.findIndex((w) => w.id === word.id)
  if (index > -1) {
    selectedWords.value.splice(index, 1)
    if (displayMode.value === 'chart') {
      syncChartSelectionState()
    }
  }
}

const toggleWordSelection = (word: any) => {
  const index = selectedWords.value.findIndex((w) => w.id === word.id)
  if (index > -1) {
    selectedWords.value.splice(index, 1)
  } else {
    selectedWords.value.push(word)
  }
  if (displayMode.value === 'chart') {
    syncChartSelectionState()
  }
}

const newTagInput = ref('')

const handleManualAddTag = () => {
  const label = newTagInput.value.trim()
  if (!label) {
    newTagInput.value = ''
    return
  }

  if (selectedWords.value.some((w) => w.name.toLowerCase() === label.toLowerCase())) {
    message.warning(`标签 '${label}' 已选择`)
    newTagInput.value = ''
    return
  }

  const existingWord = combinedWordCloudData.value.find(
    (w) => w.name.toLowerCase() === label.toLowerCase()
  )
  if (existingWord) {
    toggleWordSelection(existingWord)
  } else {
    const newWord = {
      id: `custom-${Date.now()}-${label}`,
      name: label,
      type: 'custom',
      count: 1,
    }
    toggleWordSelection(newWord)
  }
  newTagInput.value = ''
}

// --- API Fetching Methods ---
const fetchWordCloudTags = async () => {
  loading.tags = true
  try {
    await get_NineSong_Temp_Data_To_LocalSqlite.get_recommend_word_cloud()
  } catch (e) {
    message.error('获取高频标签失败')
  } finally {
    loading.tags = false
  }
}

const fetchWordCloudGenres = async () => {
  loading.genres = true
  try {
    await get_NineSong_Temp_Data_To_LocalSqlite.get_recommend_word_cloud_genre()
  } catch (e) {
    message.error('获取高频流派失败')
  } finally {
    loading.genres = false
  }
}

const fetchRecommendationsAndDetails = async () => {
  if (selectedWords.value.length === 0) {
    store_view_recommend_page_info.recommend_MediaFiles_temporary = []
    return
  }

  loading.recs = true
  loading.details = true
  store_view_recommend_page_info.recommend_MediaSearch_metadata = []
  store_view_recommend_page_info.recommend_MediaFiles_temporary = []

  try {
    const keywords = selectedWords.value.map((w) => w.name).join(',')
    await get_NineSong_Temp_Data_To_LocalSqlite.get_recommend_result(keywords)

    const recommendedSongs = store_view_recommend_page_info.recommend_MediaSearch_metadata
    if (recommendedSongs.length > 0) {
      const ids = recommendedSongs.map((s: any) => s.id).join(',')
      await get_NineSong_Temp_Data_To_LocalSqlite.get_recommend_medias(ids)
      message.success(`成功获取 ${finalSongList.value.length} 首推荐歌曲`)
    } else {
      message.info('没有找到匹配的歌曲')
    }
  } catch (e) {
    message.error('获取推荐歌曲失败')
  } finally {
    loading.recs = false
    loading.details = false
  }
}

// --- ECharts Logic ---
let resizeObserver: ResizeObserver | null = null

let resizeDebounceTimer: any = null
const resizeCharts = () => {
  clearTimeout(resizeDebounceTimer)
  resizeDebounceTimer = setTimeout(() => {
    // Re-run the init/update logic to recalculate dynamic parameters
    initOrUpdateChart()
  }, 150) // 150ms debounce
}

onMounted(async () => {
  // 1. 先加载数据
  await Promise.all([fetchWordCloudTags(), fetchWordCloudGenres()])

  // 2. 延迟初始化图表（等待DOM更新）
  nextTick(() => {
    if (displayMode.value === 'chart') {
      initOrUpdateChart()
    }

    // Setup ResizeObserver to handle chart resizing
    if (wordCloudChartRef.value) {
      resizeObserver = new ResizeObserver(resizeCharts)
      resizeObserver.observe(wordCloudChartRef.value)
    }
  })
})

onBeforeUnmount(() => {
  // Stop watching for window width changes
  stopWatching_window_innerWidth()
  stopWatching_displayMode()
  stopWatching_combinedWordCloudData()
  stopWatching_selectedWords()

  // Clean up timers
  clearTimeout(resizeDebounceTimer)
  clearTimeout(recommendationDebounceTimer)

  // Disconnect the resize observer
  if (resizeObserver) {
    resizeObserver.disconnect()
  }

  // Dispose of the chart instance
  chartInstance?.dispose()

  // Clear temporary data
  store_view_recommend_page_info.recommend_MediaFiles_temporary = []
})

onUnmounted(() => {
  if (store_view_recommend_page_info.recommend_MediaFiles_temporary.length > 0) {
    store_view_recommend_page_info.recommend_MediaFiles_temporary = []
    console.log('Table_Recommend unmounted, temporary data cleared')
  }
})

const initOrUpdateChart = () => {
  if (!wordCloudChartRef.value) return

  const container = wordCloudChartRef.value

  // Initialize chart only if it doesn't exist
  if (!chartInstance || chartInstance.isDisposed()) {
    chartInstance = echarts.init(container)

    // Add event listeners only once
    chartInstance.on('click', (params: any) => {
      toggleWordSelection(params.data.originalData)
    })
  }

  const words = combinedWordCloudData.value

  if (words.length === 0) {
    chartInstance.clear()
    return
  }

  const counts = words.map((w) => w.count).filter((c) => c > 0)
  const maxCount = counts.length > 0 ? Math.max(...counts) : 100

  const chartData = words.map((word) => ({
    name: word.name,
    value: Number(word.count) || 0,
    originalData: word,
  }))

  const vibrantColors = [
    '#FF6B6B',
    '#FFD166',
    '#06D6A0',
    '#118AB2',
    '#073B4C',
    '#EF476F',
    '#FFD166',
    '#06D6A0',
    '#118AB2',
    '#073B4C',
    '#9C89B8',
    '#F0A6CA',
    '#B8E0D2',
    '#95B8D1',
    '#EAC435',
  ]

  const option = {
    tooltip: {
      show: true,
      formatter: (params: any) => {
        const data = params.data
        const type = data.originalData.type
        return `
          <div style="font-weight:bold">${data.name}</div>
          <div>出现次数: ${data.value}</div>
          <div>类型: ${type === 'tag' ? '标签' : '流派'}</div>
        `
      },
    },
    visualMap: {
      show: true,
      min: 1,
      max: maxCount,
      orient: 'vertical',
      left: 0,
      top: 'center',
      inRange: {
        color: vibrantColors,
      },
      calculable: true,
    },
    series: [
      {
        type: 'wordCloud',
        shape: 'circle',
        sizeRange: proportionalSizeRange.value, // Use reactive computed value
        rotationRange: [-45, 45],
        gridSize: proportionalGridSize.value, // Use reactive computed value
        drawOutOfBound: false,
        data: chartData,
        selectedMode: 'multiple',
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: function (params: any) {
            const hue = Math.floor(params.data.value % 360)
            return `hsl(${hue}, 70%, 60%)`
          },
        },
        emphasis: {
          scale: 1.2,
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)',
            borderColor: '#FFD700',
            borderWidth: 2,
          },
        },
        select: {
          itemStyle: {
            color: '#FFD700',
            shadowBlur: 15,
            shadowColor: 'rgba(255,215,0,0.8)',
          },
        },
      },
    ],
  }

  chartInstance.setOption(option, true)
  syncChartSelectionState()

  // The initial resize call can be made here or in onMounted
  chartInstance.resize()
}

const syncChartSelectionState = () => {
  if (chartInstance && wordCloudChartRef.value) {
    const selectedIndices = combinedWordCloudData.value
      .map((word, index) => (isSelectedWord(word) ? index : -1))
      .filter((index) => index !== -1)

    chartInstance.dispatchAction({ type: 'unselect', seriesIndex: 0 })
    if (selectedIndices.length > 0) {
      chartInstance.dispatchAction({ type: 'select', seriesIndex: 0, dataIndex: selectedIndices })
    }
  }
}

// --- Watchers ---
const stopWatching_window_innerWidth = watch(
  () => store_app_configs_info.window_innerWidth,
  () => {
    // Debounce the chart update when window width changes, which triggers a full recalculation
    resizeCharts()
    initOrUpdateChart()
  }
)

const stopWatching_displayMode = watch(displayMode, (newMode) => {
  if (newMode === 'chart') {
    nextTick(() => {
      initOrUpdateChart()
      syncChartSelectionState()
    })
  }
})

const stopWatching_combinedWordCloudData = watch(
  combinedWordCloudData,
  () => {
    if (displayMode.value === 'chart') {
      nextTick(() => {
        initOrUpdateChart()
        syncChartSelectionState()
      })
    }
  },
  { deep: true }
)

const stopWatching_selectedWords = watch(
  selectedWords,
  () => {
    clearTimeout(recommendationDebounceTimer)
    recommendationDebounceTimer = setTimeout(() => {
      fetchRecommendationsAndDetails()
    }, 500) // 500ms debounce
  },
  { deep: true }
)

////// changed_data write to sqlite
import error_album from '@/assets/img/error_album.jpg'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
const errorHandled = ref(new Map())
const handleImageError = async (item: any) => {
  let result_src = error_album
  if (errorHandled.value.has(item.id)) {
    item.medium_image_url = result_src
    return
  }
  errorHandled.value.set(item.id, true)
  ///
  if (isElectron) {
    const originalSrc = item.medium_image_url
    try {
      const newImagePath = await ipcRenderer.invoke('window-get-imagePath', originalSrc)
      if (newImagePath.length > 0) {
        item.medium_image_url = newImagePath
      } else {
        item.medium_image_url = result_src
      }
    } catch (error) {
      console.error('Error handling image error:', error)
      item.medium_image_url = result_src
    }
  } else {
    item.medium_image_url = error_album
  }
}

////// i18n auto lang
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true,
})
</script>

<template>
  <n-message-provider>
    <div class="recommend-container">
      <!-- Left Panel: Tag Selection -->
      <div class="left-panel">
        <n-card class="selection-card" :bordered="false">
          <template #header>
            <n-space align="center" justify="space-between">
              <n-h3 style="margin: 0">
                {{ $t('Select') + $t('nsmusics.view_page.recommend') + $t('Tags') }}
              </n-h3>
              <n-space align="center" justify="end">
                <n-button
                  @click="clearSelections"
                  type="error"
                  ghost
                  :disabled="selectedWords.length === 0"
                >
                  {{ $t('common.clear') + $t('nsmusics.view_page.current') + $t('Select') }}
                </n-button>
                <n-select
                  v-model:value="displayMode"
                  :options="displayModeOptions"
                  style="width: 150px"
                />
              </n-space>
            </n-space>
          </template>

          <!-- Current Selections Summary -->
          <n-space align="center">
            <n-tag
              v-for="word in selectedWords"
              :key="word.id"
              :type="
                word.type === 'genre' ? 'success' : word.type === 'tag' ? 'primary' : 'default'
              "
              closable
              @close="removeWordSelection(word)"
              round
            >
              {{ word.name }}
            </n-tag>
            <n-input
              v-model:value="newTagInput"
              size="small"
              placeholder="输入并按 Enter 确认"
              style="width: 180px"
              @keyup.enter="handleManualAddTag"
              @blur="handleManualAddTag"
            />
          </n-space>

          <!-- View Mode: Tags -->
          <div v-show="displayMode === 'tags'" class="tag-view-container">
            <n-h4 style="margin-bottom: 10px">
              {{ $t('Tags') }}
            </n-h4>
            <n-empty
              v-if="wordCloudTags.length === 0"
              description="正在加载高频标签..."
              style="margin-top: 20px"
            ></n-empty>
            <n-space v-else>
              <n-tag
                v-for="word in wordCloudTags"
                :key="word.id"
                :type="isSelectedWord(word) ? 'primary' : 'default'"
                :bordered="!isSelectedWord(word)"
                @click="toggleWordSelection(word)"
                class="custom-tag"
                round
              >
                {{ word.name }} ({{ word.count }})
              </n-tag>
            </n-space>

            <n-h4 style="margin-top: 20px; margin-bottom: 10px">
              {{ $t('entity.genre_other') }}
            </n-h4>
            <n-empty
              v-if="wordCloudGenres.length === 0"
              description="正在加载高频流派..."
              style="margin-top: 20px"
            ></n-empty>
            <n-space v-else>
              <n-tag
                v-for="word in wordCloudGenres"
                :key="word.id"
                :type="isSelectedWord(word) ? 'success' : 'default'"
                :bordered="!isSelectedWord(word)"
                @click="toggleWordSelection(word)"
                class="custom-tag"
                round
              >
                {{ word.name }} ({{ word.count }})
              </n-tag>
            </n-space>
          </div>

          <!-- View Mode: Chart -->
          <div v-show="displayMode === 'chart'" class="chart-view-container">
            <n-empty
              v-if="wordCloudTags.length === 0 && wordCloudGenres.length === 0"
              description="正在加载标签和流派数据..."
            ></n-empty>
            <div v-else class="word-cloud-wrapper">
              <div ref="wordCloudChartRef" style="width: 100%; height: 100%"></div>
            </div>
          </div>
        </n-card>
      </div>

      <!-- Right Panel: Recommended Songs -->
      <div class="right-panel">
        <n-card class="results-card" :bordered="false">
          <template #header>
            <n-h3 style="margin: 0">
              {{ $t('nsmusics.view_page.recommend') + $t('Songs') }}
            </n-h3>
          </template>
          <n-data-table
            v-if="false"
            :columns="columns"
            :data="finalSongList"
            :loading="loading.recs || loading.details"
          />
          <DynamicScroller
            class="table"
            :items="store_view_recommend_page_info.recommend_MediaFiles_temporary"
            key-field="play_id"
            :minItemSize="50"
          >
            <template #default="{ item, index, active }">
              <DynamicScrollerItem
                :item="item"
                :active="active"
                :data-index="index"
                :data-active="active"
                class="message"
                @dblclick="
                  () => {
                    store_playlist_list_logic.handleItemDbClick(item, index)
                    store_playlist_list_info.playlist_MediaFiles_temporary =
                      store_view_recommend_page_info.recommend_MediaFiles_temporary
                  }
                "
              >
                <!--            v-hammer:doubletap="() => handleDoubleTap(item, index)"-->
                <div class="media_info">
                  <!-- Album Art -->
                  <div
                    style="
                      width: 58px;
                      height: 58px;
                      border-radius: 4px;
                      overflow: hidden;
                      flex-shrink: 0;
                    "
                  >
                    <img
                      :key="item.absoluteIndex"
                      :src="item.medium_image_url"
                      @error="handleImageError(item)"
                      style="width: 100%; height: 100%; object-fit: cover"
                    />
                  </div>
                  <!-- Title and Artist (Flexible) -->
                  <div class="title_playlist" style="flex: 1; min-width: 0">
                    <span style="font-size: 16px; font-weight: 600">
                      {{ item.title }}
                    </span>
                    <br />
                    <template v-for="artist in item.artist.split(/[\/|｜、]/)">
                      <span>
                        {{ artist + '&nbsp;' }}
                      </span>
                    </template>
                  </div>
                  <!-- Index -->
                  <span class="index">
                    {{ index + 1 }}
                  </span>
                </div>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
        </n-card>
      </div>
    </div>
  </n-message-provider>
</template>

<style scoped>
.recommend-container {
  --card-color: v-bind('themeVars.cardColor');
  --border-color: v-bind('themeVars.borderColor');
  --primary-color-hover: v-bind('themeVars.primaryColorHover');
  --primary-color-suppl: v-bind('themeVars.primaryColorSuppl');
  --text-color-1: v-bind('themeVars.textColor1');
  --text-color-2: v-bind('themeVars.textColor2');
  --text-color-3: v-bind('themeVars.textColor3');
  --hover-color: v-bind('themeVars.hoverColor');
  --scrollbar-color: v-bind('themeVars.scrollbarColor');
  --scrollbar-color-hover: v-bind('themeVars.scrollbarColorHover');

  display: flex;
  padding: 10px;
  gap: 1.5rem;
  height: calc(100vh - 144px);
  box-sizing: border-box;
}

.left-panel,
.right-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex-shrink: 0;
  width: 55%;
}

.right-panel {
  width: 45%;
}

.selection-card,
.results-card {
  background-color: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition:
    box-shadow 0.3s ease-in-out,
    border-color 0.3s ease-in-out;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.selection-card:hover,
.results-card:hover {
  border-color: var(--primary-color-hover);
  box-shadow: 0 0 7px 0 var(--primary-color-suppl);
}

.selection-card :deep(.n-card__content),
.results-card :deep(.n-card__content) {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 0 1.5rem; /* Add padding back to content */
}

:deep(.n-card-header) {
  padding: 1rem 1.5rem;
}

.n-h3,
.n-h4 {
  color: var(--text-color-1);
}

.tag-view-container {
  padding: 1rem 0; /* Adjust padding */
}

.custom-tag {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.custom-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px var(--primary-color-suppl);
}

.chart-view-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.word-cloud-wrapper {
  width: 100%;
  height: 100%;
}

.table {
  width: 100%;
  height: 100%;
}

.message {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.message:hover {
  background-color: var(--hover-color);
}

.media_info {
  display: flex;
  align-items: center;
  width: 100%;
}

.media_info img {
  border-radius: 4px;
  border: 1.5px solid var(--border-color);
}

.title_playlist {
  margin-left: 1rem;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--text-color-1);
}

.title_playlist span:first-child {
  font-weight: 600;
  font-size: 1rem;
}

.title_playlist span:not(:first-child) {
  font-size: 0.875rem;
  color: var(--text-color-2);
}

.title_playlist:hover {
  color: var(--primary-color-hover);
}

.index {
  width: 50px;
  margin-left: 12px;
  color: var(--text-color-3);
  text-align: center;
}

.n-empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-color);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-color-hover);
}
</style>
