<script setup lang="ts">
import { ref, onMounted, nextTick, h, reactive, computed, watch, onBeforeUnmount, createVNode } from 'vue';
import { useMessage,DropdownOption, type DataTableColumns, type DataTableRowKey, NIcon, InputInst, NImage, PaginationProps } from 'naive-ui';
import { RowData } from 'naive-ui/es/data-table/src/interface';
const emit = defineEmits([
  'media_file_path','media_file_path_from_playlist',
  'media_file_medium_image_url',
  'this_audio_singer_name',
  'this_audio_song_name',
  'this_audio_album_name','this_audio_album_id',
  'data_select_Index',
  'page_song_index',
  'menu_edit_this_song',
  'menu_add_this_song',
  'menu_delete_this_song',
  'options_Sort_key',
  'page_songlists_keyword',
  'page_songlists_reset_data',
  'media_Files_selected',
  'media_Files_selected_set',
  'media_Files_selected_set_all',
  'page_songlists_selected'
]);
const columns = ref<DataTableColumns<RowData>>();
const createColumns_normal = (): DataTableColumns<RowData> => [
  {
    title: 'Song_ID',
    key: 'id',
    width: '0px',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '#',
    key: 'absoluteIndex',
    width: '60px',
    fixed: 'left',
  },
  {
    title: 'Title',
    key: 'medium_image_url',
    width: '76px',
    ellipsis: {
      tooltip: true
    },
    render(row) {
      return createVNode('img', {
        style: {
          height: '50px',
          objectFit: 'cover',
          borderRadius: '6px',
        },
        src: row.medium_image_url,
      });
    }
  },
  {
    title: '',
    key: 'artist',
    width: '500px',
    ellipsis: {
      tooltip: true
    },
    render(row) {
      const artists = row.artist.split('/'); 
      const routerLinks_artists = artists.map((artist: any, index: any) => {
        return h(
          RouterLink,
          {
            to: { name: 'home' },
            params: { artist },
            style: {
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 0.3s'
            },
            onMouseenter: (event: { target: { style: { textDecoration: string; color: string; }; }; }) => {
              event.target.style.textDecoration = 'underline';
              // event.target.style.color = 'blue';
            },
            onMouseleave: (event: { target: { style: { textDecoration: string; color: string; }; }; }) => {
              event.target.style.textDecoration = 'none';
              event.target.style.color = 'inherit';
            },
            key: index //唯一的key属性,识别每个RouterLink
          },
          { default: () => artist }
        );
      });
      const routerLink_title = h(
        RouterLink,
        {
          to: { name: 'home' },
          params: { artist: row.title },
          style: { color: 'inherit', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.3s' },
          onMouseenter: (event: { target: { style: { textDecoration: string; color: string; }; }; }) => {
            event.target.style.textDecoration = 'underline';
            // event.target.style.color = 'blue';
          },
          onMouseleave: (event: { target: { style: { textDecoration: string; color: string; }; }; }) => {
            event.target.style.textDecoration = 'none';
            event.target.style.color = 'inherit';
          },
        },
        { default: () => row.title }
      );
      routerLinks_artists.unshift(h('br'));
      routerLinks_artists.unshift(routerLink_title);
      return h('div', {}, routerLinks_artists);
    }
  },
  {
    title: 'Album',
    key: 'album',
    width: '460px',
    ellipsis: {
      tooltip: true
    },
    render(row) {
      return h(
        RouterLink,
        {
          to: {name: 'home',},
          params: {artist: row.album},
          style: {color: 'inherit',textDecoration: 'none',cursor: 'pointer',transition: 'color 0.3s',},
          onMouseenter: (event: { target: { style: { textDecoration: string; color: string; }; }; }) => {
            event.target.style.textDecoration = 'underline';
            // event.target.style.color = 'blue';
          },
          onMouseleave: (event: { target: { style: { textDecoration: string; color: string; }; }; }) => {
            event.target.style.textDecoration = 'none';
            event.target.style.color = 'inherit';
          }
        },
        { default: () => row.album }
      );
    }
  },
  {
    title: 'Path',
    key: 'path',
  },
  {
    title: 'Duration',
    key: 'duration_txt',
    width: '100px',
    fixed: 'right',
    ellipsis: {
      tooltip: true
    }
  },
];
const createColumns_select = (): DataTableColumns<RowData> => [
  {
    type: 'selection',
    width: '40px',
  }
];
const props = defineProps<{
  data_temporary: Media_File[];data_temporary_selected: Media_File[];

  change_page_header_color: boolean;page_songlists_top_album_image_url:string;page_songlists_top_album_name:string;page_songlists_top_album_id:string;
  page_songlists:Play_List[];page_songlists_options:{label: string;value: string}[];page_songlists_statistic:{label: string;song_count: number;id: string;}[];
  page_songlists_selected:string;

  page_songlists_keyword:string;
  
  collapsed: Boolean;
  window_innerWidth: number;
  options_Sort_key:{ columnKey: string; order: string }[];
}>();
onBeforeUnmount(() => {
  
});
const data_select_Index = ref<number>(0)
const click_select_ALL_row = () => {
  if(props.data_temporary_selected.length == 0){
    emit('media_Files_selected_set_all', true);
  }else{
    emit('media_Files_selected_set_all', false);
  }
}
const click_bulk_operation = () => {
  if(bool_start_play.value == true)
  {
    bool_start_play.value = false
    columns.value?.unshift(createColumns_select()[0])
  }
  else{
    bool_start_play.value = true
    columns.value?.splice(0, 1)
  }
}
//
const options_data_dropmenu: DropdownOption[] = [
  {
    label: '搜索此歌手',
    key: 'search_this_singer',
    icon () {
      return h(NIcon, null, {
        default: () => h(Search20Filled)
      })
    },
  },
  {
    label: '搜索此专辑',
    key: 'search_this_album',
    icon () {
      return h(NIcon, null, {
        default: () => h(Search20Filled)
      })
    },
  },
  {
    label: '编辑歌曲信息',
    key: 'edit',
    icon () {
      return h(NIcon, null, {
        default: () => h(SaveEdit24Regular)
      })
    },
  },
  {
    label: '添加到歌单',
    key: 'add',
    icon () {
      return h(NIcon, null, {
        default: () => h(AddCircle32Regular)
      })
    },
  },
  {
    label: () => h('span', { style: { color: 'red' } }, '删除'),
    key: 'delete',
    icon () {
      return h(NIcon, null, {
        default: () => h(Delete20Regular)
      })
    },
  }
]
const handleSelect_data_dropmenu = (option: string) => {
  if (option === 'edit') {
    emit('menu_edit_this_song',data_select_Index.value);
  } 
  else if (option === 'add') {
    emit('menu_add_this_song',data_select_Index.value);
  }
  else if (option === 'delete') {
    emit('menu_delete_this_song',data_select_Index.value);
  }
  showDropdownRef.value = false;
}
const onClickoutside = () => {
  showDropdownRef.value = false
}
const showDropdownRef = ref(false)
const xRef = ref(0)
const yRef = ref(0)
let click_count = 0
const bool_start_play = ref<boolean>(true)
//
const scrollbar = ref(null as any);
const scrollToTop = () => {
  if (scrollbar.value !== null) {
    scrollbar.value.scrollToItem(0);
  }
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
  {label:'专辑名', key: 'album', state_Sort: state_Sort.Default },
  {label:'年份', key: 'year', state_Sort: state_Sort.Default },
  {label:'播放时长', key: 'duration', state_Sort: state_Sort.Default },
  {label:'创建时间', key: 'created_at', state_Sort: state_Sort.Default },
  {label:'更新时间', key: 'updated_at', state_Sort: state_Sort.Default },
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
      emit('page_songlists_reset_data',true)
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
    const page_songlists_keyword = input_search_Value.value.toLowerCase();
    emit('page_songlists_keyword',page_songlists_keyword)
    bool_input_search = true
    options_Sort_key.value.forEach(element => {
      element.state_Sort = state_Sort.Default
    });
  }else{
    emit('page_songlists_reset_data',true)
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
// 重新渲染gridItems
const collapsed_width = ref<number>(1090);
const stopWatching_collapsed_width = watch(() => props.collapsed, (newValue, oldValue) => {
  updateGridItems();
});
let bool_watch = false;
const timer = ref<NodeJS.Timeout | null>(null);
const startTimer = () => {
  timer.value = setInterval(() => {
    bool_watch = true;
  }, 1000);
};
onMounted(() => {
  startTimer();
  updateGridItems();
});
const stopWatching_window_innerWidth = watch(() => props.window_innerWidth, (newValue, oldValue) => {
  bool_watch = false;
  updateGridItems();
  if (bool_watch) {
    startTimer();
  }
});
const updateGridItems = () => {
  if (props.collapsed == true) {
    collapsed_width.value = 145;
  } else {
    collapsed_width.value = 240;
  }
};
//
let bool_loading = false
onMounted(() => {
  columns.value = createColumns_normal()

  input_search_Value.value = props.page_songlists_keyword
  if(input_search_Value.value.length > 0){
    bool_show_search_area.value = true
    bool_input_search = true
  }
  else{
    bool_show_search_area.value = false
    bool_input_search = false
  }

});
//
onBeforeUnmount(() => {
  cleanup();
});
const cleanup = () => {
  columns.value = [];
  data_select_Index.value = -1;
  stopWatching_collapsed_width()
  stopWatching_window_innerWidth()
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

const itemSize = 70;// height
const gridItems = 5;
const itemSecondarySize = 180;// width
//
const handleItemClick = () => {
  click_count++
}
const handleItemDbClick = (media_file:Media_File) => {
  if(bool_start_play.value == true){
    if(click_count >= 2){
      click_count = 0

      emit('media_file_path_from_playlist',false)
      emit('media_file_path', media_file.path)
      emit('media_file_medium_image_url',media_file.medium_image_url)
      emit('this_audio_singer_name',media_file.artist)
      emit('this_audio_song_name',media_file.title)
      emit('this_audio_album_id', media_file.album_id);
      emit('this_audio_album_name',media_file.album)
      // emit('page_song_index', page_index); 

      // data_select_Index.value = (current_page_num.value-1)*props.media_page_size + page_index;

      // emit('data_select_Index', data_select_Index.value); 
      emit('data_select_Index', media_file.absoluteIndex); 
    }
  }
}
const handleItemClick_title = (title:string) => {
  click_count = 0;
  input_search_Value.value = title//+'accurate_search'+'__title__'
  bool_show_search_area.value = false
  show_search_area()
  click_search()
  scrollToTop()
}
const handleItemClick_artist = (artist:string) => {
  click_count = 0;
  input_search_Value.value = artist//+'accurate_search'+'__artist__'//artist不参与精确搜索
  bool_show_search_area.value = false
  show_search_area()
  click_search()
  scrollToTop()
}
const handleItemClick_album = (album:string) => {
  click_count = 0;
  input_search_Value.value = album+'accurate_search'+'__album__'
  bool_show_search_area.value = false
  show_search_area()
  click_search()
  scrollToTop()
}
//
const handleSelected_value_for_songlistall = (value: any) => {
  emit('page_songlists_selected',value)
  console.log('selected_value_for_songlistall：'+value);
  breadcrumbItems.value = props.page_songlists_options.find(option => option.value === value)?.label || '';
};
const breadcrumbItems = ref('所有歌曲');
//
const scroller = ref(null);
const onResize = () => {
  // console.log('resize')
}
const updateParts = { viewStartIdx: 0, viewEndIdx: 0, visibleStartIdx: 0, visibleEndIdx: 0 } // 输出渲染范围updateParts
const onUpdate = (viewStartIndex: any, viewEndIndex: any, visibleStartIndex: any, visibleEndIndex: any) => {
  console.log('update')
  updateParts.viewStartIdx = viewStartIndex
  updateParts.viewEndIdx = viewEndIndex
  updateParts.visibleStartIdx = visibleStartIndex
  updateParts.visibleEndIdx = visibleEndIndex
}

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
  Heart24Regular,Heart28Filled,
  ChevronLeft16Filled,ChevronRight16Filled,
} from '@vicons/fluent'
import { DefineComponent, ComponentOptionsMixin, EmitsOptions, VNodeProps, AllowedComponentProps, ComponentCustomProps, ExtractPropTypes } from 'vue';
import { RouterLink } from 'vue-router';

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

      <n-button tertiary circle @click="click_bulk_operation">
        <template #icon>
          <n-icon :size="20"><MultiselectLtr20Filled/></n-icon>
        </template>
      </n-button>   
      
      <n-space v-if="!bool_start_play">
        <n-button tertiary circle @click="click_select_ALL_row">
          <template #icon>
            <n-icon :size="20"><SelectAllOn24Regular/></n-icon>
          </template>
        </n-button>
        <n-button tertiary circle>
          <template #icon>
            <n-icon :size="20"><AddCircle32Regular/></n-icon>
          </template>
        </n-button>
        <n-button flo tertiary circle>
          <template #icon>
            <n-icon :size="20"><Delete20Regular/></n-icon>
          </template>
        </n-button>
        <n-p style="margin-top: 6px;"> 你选中了 {{ props.data_temporary_selected.length }} 行。 </n-p>
      </n-space>
    </n-space>

    <!-- 
      :grid-items="gridItems"
      :item-secondary-size="itemSecondarySize"
    -->
    <div class="dynamic-scroller-demo">
      <DynamicScroller 
        class="table" ref="scrollbar" :style="{ width: 'calc(100vw - ' + (collapsed_width - 40) + 'px)'}"
        :items="props.data_temporary"
        :minItemSize="itemSize - 20">
        <template #before>
          <div class="notice">
            <div
              :style="{ width: 'calc(100vw - ' + (collapsed_width) + 'px)'}"
              style="
                position: absolute;
                z-index: 0;
                height: 298px;
                border-radius: 20px;
                overflow: hidden;
                background-size: cover;
                background-position: center;
                filter: blur(0px);
                background-color: transparent;
              ">
              <img 
                :style="{ 
                  width: 'calc(100vw - ' + (collapsed_width + 200) + 'px)',
                  height: 'calc(100vw - ' + (collapsed_width + 200) + 'px)'
                }"
                style="
                  margin-left: 200px; margin-top: -300px;
                "
                :src="getAssetImage(props.page_songlists_top_album_image_url)"
              />
            </div>
            <div 
              :style="{ width: 'calc(100vw - ' + (collapsed_width) + 'px)'}"
              style="
                position: absolute;
                z-index: 0;
                height: 300px;
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
                <n-gi v-for="songlist in props.page_songlists_statistic" :key="songlist.id">
                  <n-statistic :label="songlist.label" :value="songlist.song_count" />
                </n-gi>
              </n-grid>
              <template #title>
                <n-space vertical style="margin-top:2px;margin-left: 10px;">
                  <n-breadcrumb separator=">">
                      <n-breadcrumb-item style="font-size: 22px">乐曲</n-breadcrumb-item>
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
                    :value="props.page_songlists_selected" 
                    :options="props.page_songlists_options" style="width: 192px;"
                    :on-update:value="handleSelected_value_for_songlistall" />
                </n-space>
              </template>
              <template #header>
                
              </template>
              <template #avatar>
                <n-image
                  width="80px" height="80px" object-fit="contain"
                  style="border-radius: 8px;margin-left: 20px;margin-top: 20px;"
                  :src="getAssetImage(props.page_songlists_top_album_image_url)"
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
                  <n-button text @click="handleItemClick_album(props.page_songlists_top_album_id)">
                    <n-ellipsis 
                      style="
                        max-width: 256px;height: 40px;
                        text-align: left;font-size: 24px;
                        font-weight: 900;">
                      {{ props.page_songlists_top_album_name }}
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
            :data-active="active"
            class="message"
            @click="handleItemClick"
            @Dblclick="handleItemDbClick(item)">
            <div class="media_info" :style="{ width: 'calc(100vw - ' + (collapsed_width) + 'px)'}">
              <n-checkbox class="checkbox" 
                v-if="!bool_start_play"
                v-model:checked="item.selected"
                @update:checked="(checked: any) => { 
                  item.selected = checked;
                  emit('media_Files_selected_set', item);
                }"
                />
              <div 
                style="margin-left: 10px;
                  width: 58px;height: 58px; 
                  border-radius: 6px; overflow: hidden;">
                <img
                  :key="item.id"
                  :src="item.medium_image_url"
                  style="width: 100%; height: 100%; object-fit: cover;"/>
              </div>
              <div class="songlist_title">
                <span @click="handleItemClick_title(item.title)">{{ item.title }}</span>
                <br>
                <template v-for="artist in item.artist.split('/')">
                  <span @click="handleItemClick_artist(artist)">{{ artist + '&nbsp' }}</span>
                </template>
              </div>
              <div class="songlist_album">
                <span @click="handleItemClick_album(item.album_id)">{{ item.album }}</span>
              </div>
              <div class="love" style="margin-left: auto;">
                <n-button circle text size="small" style="display: block;">
                  <template #icon>
                    <n-icon v-if="item.favorite" :size="20" color="red"><Heart28Filled/></n-icon>
                    <n-icon v-else :size="20"><Heart24Regular/></n-icon>
                  </template>
                </n-button>
              </div>
              <span class="duration_txt" style="margin-left: auto; text-align: left;font-size: 15px;">{{ item.duration_txt }}</span>
              <span class="index" style="margin-left: auto; text-align: left;font-size: 15px;">{{ index + 1 }}</span>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>
  </n-space>
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="xRef"
    :y="yRef"
    :options="options_data_dropmenu"
    :show="showDropdownRef"
    :on-clickoutside="onClickoutside"
    @select="handleSelect_data_dropmenu"
  />
  <div class="scorller_to_SortAZ" v-if="false">
    <n-space>
      <n-button 
        v-for="charCode in Array.from({length: 26}, (_, i) => i + 65)" 
        :key="charCode" 
        text 
        style="display: block;">
        {{ String.fromCharCode(charCode) }}
      </n-button>
    </n-space>
  </div>
</template>

<style>
.dynamic-scroller-demo {
  height: 100%;
  overflow: auto;
  overflow-x:hidden;
  display: flex;
  flex-direction: column;
}
.table {
  width: calc(100vw - 200px);
  height: calc(100vh - 200px);
}
.message {
  width: calc(100vw - 230px);
}
.media_info {
  width: calc(100vw - 230px);
  height: 70px;
  display: flex;
  align-items: center;
  border-radius: 6px;

  transition: background-color 0.3s;
}
.media_info:hover {
  background-color: #f0f0f090;
}
.checkbox{
  width: 20px;
  margin-left: 12px;
}
.index{
  width: 50px;
  margin-left: 12px;
}
.songlist_title{
  margin-left: 10px;
  text-align: left;
  width: 300px;
  font-size: 15px;
  overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
}
.songlist_title :hover{
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}
.songlist_artist{
  margin-left: 10px;
  text-align: left;
  width: 240px;
  overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
}
.songlist_artist :hover{
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}
.songlist_album{
  margin-left: 10px;
  text-align: left;
  width: 340px;
  overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
}
.songlist_album :hover{
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}
.love{
  margin-left: 10px;
  text-align: left;
  width: 50px;
}
.love :hover{
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}
.duration_txt{
  margin-left: 10px;
  text-align: left;
  width: 50px;
}

.scorller_to_SortAZ{
  width: 16px;
  height: calc(100vh - 200px);
  position: absolute;
  top: 106px;right: 24px;
  border-radius: 6px;
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