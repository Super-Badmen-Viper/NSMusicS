<script setup lang="ts">
  import { computed, h, nextTick, onMounted, reactive, ref, watch } from 'vue';

  const emit = defineEmits([
    'album_page_num',
    'album_page_size',
    'options_Sort_key','keyword','reset_data'
  ]);
  const props = defineProps<{
    data: Item_Album[];
    data_temporary: Item_Album[];
    page: number;
    pageSize: number;
    pageCount: number;
    collapsed: Boolean;
    window_innerWidth: number;
    options_Sort_key:{ columnKey: string; order: string }[];
  }>();
  // 重新渲染列表 width

  //
  const item_album_margin = ref<number>(12)
  const item_album = ref<number>(170)
  const item_album_image = ref<number>(item_album.value - 20)
  const item_album_txt = ref<number>(item_album.value - 30)
  //
  const paginationReactive = reactive({
    page: 1,
    pageCount: props.pageCount,
    pageSize: props.pageSize,
    showSizePicker: true,
    showQuickJumper: true,
    pageSizes: [10, 30, 50],
  })
  const pagination_onChange = (page: number) => {
    paginationReactive.page = page
    emit('album_page_num',page)
    scrollToTop()
  }
  const pagination_onUpdatePageSize = (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
    emit('album_page_size',pageSize)
  }
  //
  const scrollbar = ref<HTMLElement | null>(null);
  const scrollToTop = () => {
    if (scrollbar.value) {
      scrollbar.value.scrollTop = 0;
    }
  };
  //
  const handleImageError = (event:any) => {
    event.target.src = '../../../resources/error_album.jpg'; // 设置备用图片路径
  };
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
    {label:'标题名', key: 'title', state_Sort: state_Sort.Default },
    {label:'歌手名', key: 'artist', state_Sort: state_Sort.Default },
    {label:'专辑名', key: 'album', state_Sort: state_Sort.Default }
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
  }
  const options_Sort_key_Default_key = ref<string>()
  const options_Sort_key_Default = ref<SortItem[]>()
  //
  const bool_show_search_area = ref<boolean>(false)
  const show_search_area = () => {
    if(bool_show_search_area.value === true)
    {
      bool_show_search_area.value = false
      if(bool_input_search == true){
        emit('reset_data',true)
        back_search_default()
        bool_input_search = false
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
    input_search_InstRef.value?.clear()
  }
  const input_search_InstRef = ref<InputInst>()
  const input_search_Value = ref<string>()
  let bool_input_search = false
  const click_search = () => {
    if (input_search_Value.value){
      const keyword = input_search_Value.value.toLowerCase();
      emit('keyword',keyword)
      bool_input_search = true
      options_Sort_key.value.forEach(element => {
        element.state_Sort = state_Sort.Default
      });
    }else{
      emit('reset_data',true)
      bool_input_search = false
      back_search_default()
    }
  };
  const back_search_default = () => {
    if(options_Sort_key_Default.value != null){
      options_Sort_key.value = options_Sort_key_Default.value.slice()
      options_Sort_key.value.forEach(element => {
        if(element.key != options_Sort_key_Default_key.value){
          handleSelect_Sort(element.key)
        }
      });
      for(let i = 0;i < options_Sort_key.value.length;i++)
      {
        if(options_Sort_key.value[i].key === options_Sort_key_Default_key.value){   
          handleSelect_Sort(options_Sort_key.value[i].key)
        }
      }
    }
  }
  //
  const click_play_this_medialist = () => {
    
  }
  //

  import {
    Play16Filled,
    Heart24Regular,
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
    SaveEdit24Regular
  } from '@vicons/fluent'
  import { DefineComponent, ComponentOptionsMixin, EmitsOptions, VNodeProps, AllowedComponentProps, ComponentCustomProps, ExtractPropTypes } from 'vue';
  import { InputInst, NIcon } from 'naive-ui';
</script>
<template>
  <n-space  :size="12">
    <n-space>
      <n-button type="primary" secondary strong tertiary round @click="click_play_this_medialist">
        <template #icon>
          <n-icon :size="26">
            <PlayCircle20Filled/>
          </n-icon>
        </template>
        播放
      </n-button>
    </n-space>
    
    <n-dropdown 
      trigger="click" :show-arrow="true" 
      :options="options_Sort" @select="handleSelect_Sort">
      <n-button tertiary circle>
        <template #icon>
          <n-icon :size="20"><Filter16Regular/></n-icon>
        </template>
      </n-button>
    </n-dropdown>

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
  <n-space class="album-wall-container" vertical>
    <div class="album-wall" ref="scrollbar" style="overflow-y: scroll;">
      <!-- @contextmenu="onContextmenu" -->
      <div v-for="item in props.data_temporary" :key="item.id" class="album" 
        :style="{ margin: item_album_margin + 'px' }"
        @mouseover="item.isHovered = true"
        @mouseleave="item.isHovered = false">
        <div 
          :style="{ 
            width: item_album_image + 'px', 
            height: item_album_image + 'px', 
            position: 'relative' }">
          <img 
            v-bind:src="item.medium_image_url"
            @error="handleImageError"
            :style="{ 
              width: item_album_image + 'px', 
              height: item_album_image + 'px', 
              borderRadius: '6px' }"/>
          <n-space 
            v-if="item.isHovered"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 6px;
            background: linear-gradient(to bottom, transparent, black);">
            <div style="
              display: flex; justify-content: center; align-items: center; 
              height: 100%;">
              <n-float-button 
                :style="{ left: item_album / 3 + 'px'}"
                color="#FFFFFF" position="absolute">
                <n-icon><Play16Filled /></n-icon>
              </n-float-button>
              <div style="position: absolute; bottom: 10px; right: 10px;">
                <n-button quaternary circle color="#FFFFFF">
                  <template #icon>
                    <n-icon><Heart24Regular /></n-icon>
                  </template>
                </n-button>
                <n-button quaternary circle color="#FFFFFF">
                  <template #icon>
                    <n-icon><MoreCircle32Regular /></n-icon>
                  </template>
                </n-button>
              </div>
            </div>
          </n-space>
        </div>
        <n-space class="album_text"
          :style="{ width: + 'px'}">
          <div class="bar_left_text_song_info" 
            :style="{ width:item_album_image + 'px'}">
            <n-ellipsis id="bar_singer_name"
              :style="{ maxWidth:item_album_txt + 'px'}">{{ item.name }}</n-ellipsis>
            <n-ellipsis id="bar_song_name"
              :style="{ maxWidth:item_album_txt + 'px'}">{{ item.artist }}</n-ellipsis>
            <n-ellipsis id="bar_album_name"
              :style="{ maxWidth:item_album_txt + 'px'}">{{ item.updated_time }}</n-ellipsis>
          </div>
        </n-space>
      </div>
    </div>
  </n-space>
  <n-pagination
    style="position: absolute;right: 10px;bottom: 10px;"
    :display-order="['quick-jumper', 'pages', 'size-picker']"
    :page-sizes="[10, 30, 50]"
    :pageSize="props.pageSize"
    :on-update-page="pagination_onChange"
    :on-update-page-size="pagination_onUpdatePageSize"
    :page="props.page"
    :page-count="props.pageCount"
    show-quick-jumper
    show-size-picker/>
</template>
<style>
.album-wall-container {
  width: 100%;
  height: 100%;
}
.album-wall {
  width: calc(100vw - 200px);
  height: calc(100vh - 230px);
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;  
  align-items: flex-start;
}
.album {
  float: left;
  flex-direction: column;
  align-items: left;
}

.album_text .bar_left_text_song_info{
  float: left;
  text-align: left;
}
.album_text .bar_left_text_song_info #bar_singer_name{
  font-size: 14px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; 
  overflow: hidden;
  text-overflow: ellipsis;
}
.album_text .bar_left_text_song_info #bar_song_name{
  font-size: 12px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; 
  overflow: hidden;
  text-overflow: ellipsis;
}
.album_text .bar_left_text_song_info #bar_album_name{
  font-size: 12px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; 
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>