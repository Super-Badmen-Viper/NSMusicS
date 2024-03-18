<script setup lang="ts">
  import { computed, h, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

  const emit = defineEmits([
    'artist_page_num',
    'options_Sort_key','page_artistlists_keyword','page_artistlists_reset_data',
    'page_artistlists_selected'
  ]);
  const props = defineProps<{
    data_temporary: Artist[];

    change_page_header_color:boolean,page_artistlists_top_artist_image_url:string,page_artistlists_top_artist_name:string,
    page_artistlists:Play_List[],page_artistlists_options:{label: string;value: string}[],page_artistlists_statistic:{label: string;artist_count: number;id: string;}[],
    page_artistlists_selected:string;

    page: number;
    pageSize: number;
    pageCount: number;
    collapsed: Boolean;
    window_innerWidth: number;
    options_Sort_key:{ columnKey: string; order: string }[];
  }>();
  //
  const bool_start_play = ref<boolean>(true)
  const click_bulk_operation = () => {
    // if(bool_start_play.value == true)
    // {
    //   bool_start_play.value = false
    //   columns.value?.unshift(createColumns_select()[0])
    // }
    // else{
    //   bool_start_play.value = true
    //   columns.value?.splice(0, 1)
    // }
  }
  //
  enum state_Sort {
    Ascend = 'ascend',
    Descend = 'descend',
    Default = 'default'
  }
  type SortItem = {
    label:string;
    key: string;
    state_Sort: state_Sort;
  };
  const options_Sort_key = ref<SortItem[]>([
    {label:'歌手名', key: 'name', state_Sort: state_Sort.Default },
    {label:'专辑数', key: 'album_count', state_Sort: state_Sort.Default },
    {label:'歌曲数', key: 'song_count', state_Sort: state_Sort.Default },
    {label:'更新时间(外部信息)', key: 'external_info_updated_at', state_Sort: state_Sort.Default }
  ]);
  const options_Sort = computed(() => {
    if(props.options_Sort_key != null && props.options_Sort_key.length > 0){
      options_Sort_key.value.forEach(element => {
        if(element.key === props.options_Sort_key[0].columnKey)
          if(props.options_Sort_key[0].order === state_Sort.Ascend)
            element.state_Sort = state_Sort.Ascend
          else if(props.options_Sort_key[0].order === state_Sort.Descend)
            element.state_Sort = state_Sort.Descend
      });
    }
    return options_Sort_key.value.map(item => {
      let icon: DefineComponent<{}, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, EmitsOptions, string, VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<ExtractPropTypes<{}>>, {}, {}>;
      switch (item.state_Sort) {
        case state_Sort.Ascend:
          icon = TextSortAscending20Regular;
          break;
        case state_Sort.Descend:
          icon = TextSortDescending20Regular;
          break;
        case state_Sort.Default:
          icon = ArrowSort24Regular;
          break;
      }
      return {
        label: item.label,
        key: item.key,
        icon() {
          return h(NIcon, null, {
            default: () => h(icon)
          });
        }
      };
    });
  });
  const handleSelect_Sort = (key: string | number) => {
    let _state_Sort_: state_Sort = state_Sort.Default;
    let idx: number = -1;
    // 查找当前 key 对应的状态及索引
    for (let i = 0; i < options_Sort_key.value.length; i++) {
      if (options_Sort_key.value[i].key === key) {
        _state_Sort_ = options_Sort_key.value[i].state_Sort;
        idx = i;
      } else {
        // 将其他 key 对应的状态设置为 Default
        options_Sort_key.value[i].state_Sort = state_Sort.Default;
      }
    }
    // 切换当前 key 对应的状态
    switch (_state_Sort_) {
      case state_Sort.Ascend:
        options_Sort_key.value[idx].state_Sort = state_Sort.Descend;
        _state_Sort_ = state_Sort.Descend;
        break;
      case state_Sort.Descend:
        options_Sort_key.value[idx].state_Sort = state_Sort.Default;
        _state_Sort_ = state_Sort.Default;
        break;
      case state_Sort.Default:
        options_Sort_key.value[idx].state_Sort = state_Sort.Ascend;
        _state_Sort_ = state_Sort.Ascend;
        break;
    }
    // emit('options_Sort_key',options_Sort_key.value)
    // 更新排序参数数组并执行排序操作
    const sortersArray: { columnKey: string; order: string }[] = [{ columnKey: String(key), order: _state_Sort_ }];
    emit('options_Sort_key',sortersArray)
    // sortByColumnKeys(sortersArray);

    scrollToTop()
  }
  const options_Sort_key_Default_key = ref<string>()
  const options_Sort_key_Default = ref<SortItem[]>()
  //
  const bool_show_search_area = ref<boolean>(false)
  const show_search_area = () => {
    if(bool_show_search_area.value === true)
    {
      bool_show_search_area.value = false
      input_search_InstRef.value?.clear()
      if(bool_input_search == true){
        emit('page_artistlists_reset_data',true)
        back_search_default()
        bool_input_search = false
        scrollToTop()
      }
    }
    else
    {
      bool_show_search_area.value = true
      options_Sort_key_Default.value = options_Sort_key.value.slice()
      options_Sort_key.value.forEach(element => {//保存 sort key
        if(element.state_Sort != state_Sort.Default)
          options_Sort_key_Default_key.value = element.key
      });
    }
    // input_search_InstRef.value?.clear()
  }
  const input_search_InstRef = ref<InputInst>()
  const input_search_Value = ref<string>()
  let bool_input_search = false
  const click_search = () => {
    if (input_search_Value.value){
      const page_artistlists_keyword = input_search_Value.value.toLowerCase();
      emit('page_artistlists_keyword',page_artistlists_keyword)
      bool_input_search = true
      options_Sort_key.value.forEach(element => {
        element.state_Sort = state_Sort.Default
      });
    }else{
      emit('page_artistlists_reset_data',true)
      bool_input_search = false
      back_search_default()
    }
  };
  const back_search_default = () => {
    if(options_Sort_key_Default.value != null){
      options_Sort_key.value = options_Sort_key_Default.value.slice()
      for (let i = 0; i < options_Sort_key.value.length; i++) {
        if (options_Sort_key.value[i].key === options_Sort_key_Default_key.value) {
          const sortersArray: { columnKey: string; order: string }[] = [];
          if (options_Sort_key.value[i].state_Sort === 'default') {
            emit('options_Sort_key', null);
          } else {
            const sorter = { columnKey: options_Sort_key.value[i].key, order: options_Sort_key.value[i].state_Sort };
            sortersArray.push(sorter);
            emit('options_Sort_key', sortersArray);
          }
          break;
        }
      }
    }
  }

  


  //
  const item_artist_margin = ref<number>(12)
  const item_artist = ref<number>(170)
  const item_artist_image = ref<number>(item_artist.value - 20)
  const item_artist_txt = ref<number>(item_artist.value - 20)
  //
  const scrollbar = ref<HTMLElement | null>(null);
  const scrollToTop = () => {
    if (scrollbar.value) {
      scrollbar.value.scrollTop = 0;
    }
  };
  //
  const handleImageError = (event:any) => {
    event.target.src = '../../../resources/error_artist.jpg'; // 设置备用图片路径
  };

  import {
    Play16Filled,
    MoreCircle32Regular
  } from '@vicons/fluent'
  import {
    AddCircle32Regular,
    MultiselectLtr20Filled,
    Delete20Regular,
    SelectAllOn24Regular,
    PlayCircle20Filled,
    ArrowSort24Regular,TextSortAscending20Regular,TextSortDescending20Regular,
    Search20Filled,
    Filter16Regular,
    SaveEdit24Regular,
    PlayCircle24Regular,
    Heart24Regular,Heart28Filled,
    ChevronLeft16Filled,ChevronRight16Filled,
  } from '@vicons/fluent'
  import { DefineComponent, ComponentOptionsMixin, EmitsOptions, VNodeProps, AllowedComponentProps, ComponentCustomProps, ExtractPropTypes } from 'vue';
  import { InputInst, NIcon } from 'naive-ui';

  //
  const itemSize = 220;
  const gridItems = ref(5);
  const itemSecondarySize = 190;
  //
  const handleSelected_value_for_artistlistall = (value: any) => {
    emit('page_artistlists_selected',value)
    console.log('selected_value_for_artistlistall：'+value);
    breadcrumbItems.value = props.page_artistlists_options.find(option => option.value === value)?.label || '';
  };
  const breadcrumbItems = ref('所有歌手');
  // go to media page
  const handleItemClick_artist = (artist:string) => {
    // router.push({ path: '/media' });
    input_search_Value.value = artist+'accurate_search'+'__artist__'
    bool_show_search_area.value = false
    show_search_area()
    click_search()
    scrollToTop()
  }
  // 重新渲染gridItems
  const stopWatching_collapsed_width = watch(() => props.collapsed, (newValue, oldValue) => {
    if (props.collapsed == true) {
      gridItems.value = Math.floor(window.innerWidth / itemSecondarySize) - 1;
    } else {
      gridItems.value = Math.floor(window.innerWidth / itemSecondarySize) - 1;
    }
  });
  let bool_watch = false;
  const timer = ref<NodeJS.Timeout | null>(null);//防止大量的重复渲染，造成界面假死
  const startTimer = () => {
    timer.value = setInterval(() => {
      bool_watch = true;
    }, 1000);
  };
  onMounted(() => {
    startTimer();
    gridItems.value = Math.floor(window.innerWidth / itemSecondarySize) - 1;
  });
  const stopWatching_window_innerWidth = watch(() => props.window_innerWidth, (newValue, oldValue) => {
    bool_watch = false;
    if (props.collapsed == true) {
      gridItems.value = Math.floor(window.innerWidth / itemSecondarySize) - 1;
    } else {
      gridItems.value = Math.floor(window.innerWidth / itemSecondarySize) - 1;
    }
    if (bool_watch) {
      startTimer();
    }
  });
  
  //
  onBeforeUnmount(() => {
    cleanup();
  });
  const cleanup = () => {
    stopWatching_collapsed_width()
    stopWatching_window_innerWidth()
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
  };

  function getAssetImage(firstImage: string) {
    return new URL(firstImage, import.meta.url).href;
  }
</script>
<template>
  <n-space vertical :size="12">
    <n-space>
      <n-button tertiary circle>
        <template #icon>
          <n-icon :size="20"><ChevronLeft16Filled/></n-icon>
        </template>
      </n-button>
      <n-button tertiary circle>
        <template #icon>
          <n-icon :size="20"><ChevronRight16Filled/></n-icon>
        </template>
      </n-button>
      <n-button tertiary circle @click="show_search_area">
        <template #icon>
          <n-icon :size="20"><Search20Filled/></n-icon>
        </template>
      </n-button>
      <n-input-group 
        v-if="bool_show_search_area"
        :style="{ width: '200px' }">
        <n-input 
          :style="{ width: '160px' }" 
          ref="input_search_InstRef" 
          v-model:value="input_search_Value"
          @keydown.enter="click_search"/>
        <n-button type="primary" ghost @click="click_search">
          <template #icon>
            <n-icon :size="20"><Search20Filled/></n-icon>
          </template>
        </n-button>
      </n-input-group>

      <n-dropdown 
        trigger="click" :show-arrow="true" 
        :options="options_Sort" @select="handleSelect_Sort">
        <n-button tertiary circle>
          <template #icon>
            <n-icon :size="20"><ArrowSort24Regular/></n-icon>
          </template>
        </n-button>
      </n-dropdown>
    </n-space>

    <div class="artist-wall-container">
      <DynamicScroller
        class="artist-wall" 
        :items="props.data_temporary"
        :itemSize="itemSize"
        :minItemSize="itemSize"
        :grid-items="gridItems"
        :item-secondary-size="itemSecondarySize">
        <template #before>
          <div class="notice">
            <div
              style="
                position: absolute;
                z-index: 0;
                width: calc(100vw - 220px);height: 298px;
                border-radius: 20px;
                overflow: hidden;
                background-size: cover;
                background-position: center;
                filter: blur(0px);
                background-color: transparent;
              ">
              <img 
                :style="`
                  margin-left: 200px; margin-top: -300px; 
                  width: auto; height: calc(100vw - 400px);
                `"
                :src="getAssetImage(props.page_artistlists_top_artist_image_url)"
              />
            </div>
            <div style="
              position: absolute;
              z-index: 0;
              width: calc(100vw - 220px);height: 300px;
              border-radius: 20px;
              overflow: hidden;">
              <svg 
                style="
                  position: absolute; top: -2; left: 0; 
                  width: 100%; height: 100%;">
                <defs>
                  <linearGradient v-if="!props.change_page_header_color" id="gradient" gradientTransform="rotate(30)">
                    <stop offset="0%" stop-color="#fdfbfb"></stop>
                    <stop offset="100%" stop-color="#ebedee"></stop>
                  </linearGradient>
                  <linearGradient v-if="props.change_page_header_color" id="gradient" gradientTransform="rotate(30)">
                    <stop offset="0%" stop-color="#323232"></stop>
                    <stop offset="40%" stop-color="#3F3F3F"></stop>
                    <stop offset="150%" stop-color="#1C1C1C"></stop>
                  </linearGradient>
                </defs>
                <!-- fill="url(#gradient)" -->
                <path fill-rule="evenodd" clip-rule="evenodd" d="M462 61.401L281 300L0 300V0H413.923L462 61.401ZM426.805 61.407L394.831 102.26C394.337 102.886 394.783 103.814 395.59 103.814H404.903C405.493 103.814 406.059 103.537 406.421 103.079L437.178 63.7803C437.71 63.1016 438 62.2638 438 61.401C438 60.5382 437.71 59.7004 437.178 59.0216L406.421 19.7349C406.059 19.265 405.493 19 404.903 19H395.59C394.783 19 394.337 19.9276 394.831 20.5541L426.805 61.407ZM358.207 102.26L390.181 61.407L358.207 20.5541C357.713 19.9276 358.159 19 358.966 19H368.278C368.869 19 369.435 19.265 369.796 19.7349L400.554 59.0216C401.086 59.7004 401.376 60.5382 401.376 61.401C401.376 62.2638 401.086 63.1016 400.554 63.7803L369.796 103.079C369.435 103.537 368.869 103.814 368.278 103.814H358.966C358.159 103.814 357.713 102.886 358.207 102.26Z" fill="url(#gradient)"/>
                <path d="M692.435 277.978C691.723 277.07 691.723 275.801 692.435 274.885L711.917 250H413.673L392.983 276.435L411.427 300H709.671L692.435 277.978Z" fill="url(#gradient)"/>
                <path d="M386.241 277.978C385.529 277.07 385.529 275.801 386.241 274.885L413.723 242H397.868L350.7 300H403.477L386.241 277.978Z" fill="url(#gradient)"/>
                <path d="M716.241 277.978C715.528 277.07 715.528 275.801 716.241 274.885L749.723 233H733.868L719.868 250L699.178 276.435L717.621 300H733.477L716.241 277.978Z" fill="url(#gradient)"/>

              </svg>
              
            </div>
            <n-page-header 
              style="
                position: relative;
                z-index: 1;
                width: calc(100vw - 220px);height: 300px;
                border-radius: 20px;
                margin-bottom: 10px;">
              <n-grid 
                :cols="2" :x-gap="0" :y-gap="10" layout-shift-disabled
                style="margin-left: 30px;width: 370px;">
                <n-gi v-for="artistlist in props.page_artistlists_statistic" :key="artistlist.id">
                  <n-statistic :label="artistlist.label" :value="artistlist.artist_count" />
                </n-gi>
              </n-grid>
              <template #title>
                <n-space vertical style="margin-top:2px;margin-left: 10px;">
                  <n-breadcrumb separator=">">
                      <n-breadcrumb-item style="font-size: 22px">歌手</n-breadcrumb-item>
                      <n-breadcrumb-item> 
                        <n-ellipsis 
                          style="
                            max-width: 120px;height: 40px;position: relative;top: 14px;
                            text-align: left;font-size: 22px;">
                          {{ breadcrumbItems }}
                        </n-ellipsis>
                      </n-breadcrumb-item>
                  </n-breadcrumb>
                  <n-select 
                    :value="props.page_artistlists_selected" 
                    :options="props.page_artistlists_options" style="width: 192px;"
                    :on-update:value="handleSelected_value_for_artistlistall" />
                </n-space>
              </template>
              <template #header>
                
              </template>
              <template #avatar>
                <n-image
                  width="80px" height="80px" object-fit="contain"
                  style="border-radius: 8px;margin-left: 20px;margin-top: 20px;"
                  :src="getAssetImage(props.page_artistlists_top_artist_image_url)"
                  :show-toolbar="false"
                />
              </template>
              <template #extra>
                
              </template>
              <template #footer>
                <div style="
                  margin-left: 430px;margin-top: -20px;
                  text-align: left;
                  height: 40px;font-weight: 900;">
                  <n-button text @click="handleItemClick_artist(props.page_artistlists_top_artist_name)">
                    <n-ellipsis 
                      style="
                        max-width: 256px;height: 40px;
                        text-align: left;font-size: 24px;
                        font-weight: 900;">
                      {{ props.page_artistlists_top_artist_name }}
                    </n-ellipsis>
                  </n-button>
                </div>
              </template>
            </n-page-header>
          </div>
        </template>
        <template #after>
          
        </template>
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
            :data-active="active">
            <div
              :key="item.id"
              class="artist"
              :style="{ margin: item_artist_margin + 'px' }">
              <div
                :style="{ width: item_artist_image + 'px', height: item_artist_image + 'px', position: 'relative' }">
                <img
                  :src="item.medium_image_url"
                  @error="handleImageError"
                  :style="{ width: item_artist_image + 'px', height: item_artist_image + 'px', borderRadius: '6px' }"/>
                <div class="hover-overlay">
                  <div class="hover-content">
                    <n-button 
                      class="play_this_artist"
                      quaternary circle size="large" color="#FFFFFF" style="transform: scale(1.3);">
                      <template #icon>
                        <n-icon size="30"><PlayCircle24Regular/></n-icon>
                      </template>
                    </n-button>
                    <div class="hover-buttons">
                      <n-button 
                        class="love_this_artist"
                        quaternary circle color="#FFFFFF">
                        <template #icon>
                          <n-icon v-if="item.favorite" :size="20" color="red"><Heart28Filled/></n-icon>
                          <n-icon v-else :size="20"><Heart24Regular/></n-icon>
                        </template>
                      </n-button>
                      <n-button 
                        class="more_this_artist"
                        quaternary circle color="#FFFFFF">
                        <template #icon>
                          <n-icon><MoreCircle32Regular /></n-icon>
                        </template>
                      </n-button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="artist_text" :style="{ width: item_artist_image + 'px' }">
                <div class="artist_left_text_artist_info" :style="{ width: item_artist_txt + 'px' }">
                  <div><span id="artist_name" :style="{ maxWidth: item_artist_txt + 'px' }">{{ item.name }}</span></div>
                  <div><span id="artist_singer_name" :style="{ maxWidth: item_artist_txt + 'px' }"> 专辑数：{{ item.album_count }}</span></div>
                  <div><span id="artist_artist_name" :style="{ maxWidth: item_artist_txt + 'px' }"> 歌曲数：{{ item.song_count }}</span></div>
                </div>
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>
  </n-space>
</template> 
<style>
.artist-wall-container {
  width: 100%;
  height: 100%;
}
.artist-wall {
  overflow-y: auto;
  width: calc(100vw - 200px);
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}
.artist {
  float: left;
  flex-direction: column;
  align-items: left;
}
.artist .hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background: linear-gradient(to bottom, transparent, black);
  opacity: 0;
  transition: opacity 0.3s;
}
.artist:hover .hover-overlay {
  opacity: 1;
}
.artist .hover-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.artist .hover-buttons {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.artist_left_text_artist_info{
  float: left;
  text-align: left;
}
#artist_name{
  margin-top: 2px;
  font-size: 15px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; 
  overflow: hidden;
  text-overflow: ellipsis;
}
#artist_name:hover {
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}
#artist_singer_name{
  font-size: 12px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; 
  overflow: hidden;
  text-overflow: ellipsis;
}
#artist_singer_name:hover{
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}
#artist_artist_name{
  font-size: 12px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; 
  overflow: hidden;
  text-overflow: ellipsis;
}
#artist_artist_name:hover{
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}

.play_this_artist:hover{
  color: #3DC3FF;
}
.love_this_artist:hover{
  color: #3DC3FF;
}
.more_this_artist:hover{
  color: #3DC3FF;
}

::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 6px;
}
::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 6px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #555;
  border-radius: 6px;
}
</style>