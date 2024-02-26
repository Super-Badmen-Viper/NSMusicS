<script setup lang="ts">
import { ref, onMounted, nextTick, h, reactive, computed, watch, onBeforeUnmount } from 'vue';
import { useMessage,DropdownOption, type DataTableColumns, type DataTableRowKey, NIcon, InputInst, NImage } from 'naive-ui';
import { RowData } from 'naive-ui/es/data-table/src/interface';
const emit = defineEmits([
  'media_file_path',
  'media_file_medium_image_url',
  'this_audio_singer_name',
  'this_audio_song_name',
  'this_audio_album_name',
  'data_select_Index',
  'page_song_index',
  'page_num',
  'page_Size',
  'media_PageFiles',
  'menu_edit_this_song',
  'menu_add_this_song',
  'menu_delete_this_song',
  'options_Sort_key',
  'keyword',
  'reset_data'
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
  // {
  //   type: 'expand',
  //   expandable: (rowData) => rowData.name !== 'Jim Green',
  //   renderExpand: (rowData) => {
  //     return `${rowData.name} is a good guy.`
  //   },
  //   width: '30px',
  // },
  {
    title: '#',
    key: 'absoluteIndex',
    width: '60px',
  },
  {
    title: 'Title',
    key: 'medium_image_url',
    width: '96px',
    ellipsis: {
        tooltip: true
    },
    render(row) {
        return h(
        NImage,
        {
            width:'60px',height:'60px',
            size: 'small',
            objectFit:'cover',
            lazy:true,
            style: {
              margin: '0px',
              padding: '0px',
              borderRadius:'6px'
            },
            src: row.medium_image_url,
            fallbackSrc:'../../../resources/00album.jpg'
        },
        { default: () => '' })
    }
  },
  {
    title: '',
    key: 'album_title',
    width: '320px',
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
    title: 'Artist',
    key: 'artist',
    width: '300px',
    ellipsis: {
      tooltip: true
    },
    render(row) {
      const artists = row.artist.split('/'); // 将艺术家名称分割成一个字符串数组
      // 创建一个包含所有艺术家名称的RouterLink数组
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
            key: index // 添加一个唯一的key属性以帮助Vue识别每个RouterLink
          },
          { default: () => artist }
        );
      });
      // 将routerLinks数组转换为一个div元素并返回
      return h('div', {}, routerLinks_artists);
    }
  },
  {
    title: 'Album',
    key: 'album',
    width: '300px',
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
    title: 'Duration',
    key: 'duration_txt',
    width: '140px',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Path',
    key: 'path',
  }
];
const createColumns_select = (): DataTableColumns<RowData> => [
  {
    type: 'selection',
    width: '40px',
  }
];
const props = defineProps<{
  data: Media_File[];
  data_temporary: Media_File[];
  collapsed: Boolean;
  window_innerWidth: number;
  options_Sort_key:{ columnKey: string; order: string }[];
}>();
const checkedRowKeysRef = ref<DataTableRowKey[]>([]);
const data_select_Index = ref<number>(0)
const checkedRowhandleCheck = (rowKeys: DataTableRowKey[]) => {
  checkedRowKeysRef.value = rowKeys;
  click_count = 0
};
const click_select_ALL_row = () => {
  if(checkedRowKeysRef.value.length != 0)
  {
    checkedRowKeysRef.value.length = 0
  }else{
    checkedRowKeysRef.value = props.data_temporary.map((row: { id: any; }) => row.id);
  }
  // 强制更新组件
  forceUpdate.value = !forceUpdate.value;
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
    emit('menu_add_this_song',data_select_Index.value);// data.splice(data_select_Index.value,1)
  }
  else if (option === 'delete') {
    emit('menu_delete_this_song',data_select_Index.value);// data.splice(data_select_Index.value,1)
  }
  showDropdownRef.value = false;
}
const onClickoutside = () => {
  showDropdownRef.value = false
}
const message = useMessage()
const showDropdownRef = ref(false)
const xRef = ref(0)
const yRef = ref(0)
let click_count = 0
const bool_start_play = ref<boolean>(true)
const forceUpdate = ref(false); // 创建一个响应式引用
const click_play_this_medialist = () => {
  if(bool_start_play.value == true){
    if(props.data_temporary != null && props.data_temporary.length > 0){
      let media_file:Media_File = props.data_temporary[0]
      message.info(media_file.artist + " - " + media_file.title);
      emit('media_file_path', media_file.path)
      emit('media_file_medium_image_url',media_file.medium_image_url)
      emit('this_audio_singer_name',media_file.artist)
      emit('this_audio_song_name',media_file.title)
      emit('this_audio_album_name',media_file.album)
      emit('data_select_Index', data_select_Index.value); 
    }
  }else{
    message.info('请退出 批量操作 模式');
  }
}
const rowProps = (row:RowData,page_index: number) => ({//此处page代表相对分页的项的下标:0~(pageSize-1)
  onclick: (_e: MouseEvent) => {
    click_count++
  },
  onDblclick: (_e: MouseEvent) => {
    if(click_count >= 2){
      let media_file:Media_File =JSON.parse(JSON.stringify(row, null, 2))
      message.info(media_file.artist + " - " + media_file.title);
      emit('media_file_path', media_file.path)
      emit('media_file_medium_image_url',media_file.medium_image_url)
      emit('this_audio_singer_name',media_file.artist)
      emit('this_audio_song_name',media_file.title)
      emit('this_audio_album_name',media_file.album)
      emit('page_song_index', page_index); 

      data_select_Index.value = (current_page_num.value-1)*page_Size.value + page_index;
      emit('data_select_Index', data_select_Index.value); 

      click_count = 0
    }
  },
  onContextmenu: (e: MouseEvent) => {
    e.preventDefault()
    showDropdownRef.value = false
    nextTick().then(() => {
      showDropdownRef.value = true
      xRef.value = e.clientX
      yRef.value = e.clientY
    })

    data_select_Index.value = (current_page_num.value-1)*page_Size.value + page_index;
  }
});
const current_page_num = ref<number>(1)
const page_Size = ref(10)
const update_page_size = (pageSize: number) => {//当前页内的数据范围：10,20,30
  page_Size.value = pageSize;
  emit('page_Size',page_Size)
};
const paginationReactive = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 30,
  showSizePicker: true,
  pageSizes: [10, 30, 50, 100],
  onChange: (page: number) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  }
})
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
// 重新渲染列表 width
const collapsed_width = ref<number>(1090)
const stopWatching_collapsed_width = watch(() => props.collapsed, (newValue, oldValue) => {
  if (props.collapsed == true) {
    collapsed_width.value = window.innerWidth - 110;
  } else {
    collapsed_width.value = window.innerWidth - 220;
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
});
const stopWatching_window_innerWidth = watch(() => props.window_innerWidth, (newValue, oldValue) => {
  bool_watch = false;
  if (props.collapsed == true) {
    collapsed_width.value = props.window_innerWidth - 110;
  } else {
    collapsed_width.value = props.window_innerWidth - 220;
  }
  if (bool_watch) {
    startTimer();
  }
});
//
onMounted(() => {
  columns.value = createColumns_normal()
  // props.data_temporary = data.slice(); //BUG Error\
});
let bool_init = false
let bool_loading = false
// 数据初始化完成操作
/*const stopWatching_Init = watch(props.data, () => {
  if (props.data.length != 0 && bool_init === false) {
    props.data_temporary = props.data.slice()
    for(let i = 0;i < props.data_temporary.length;i++)
      props.data_temporary[i].absoluteIndex = i+1

    bool_init = true
    bool_loading = false

    if (props.collapsed == true) {
      collapsed_width.value = window.innerWidth - 110;
    } else {
      collapsed_width.value = window.innerWidth - 220;
    }
  }
  // const props.data_temporary = ref<Media_File[]>(data.slice());// data.slice() BUG Error: Because Init
  // props.data_temporary = data.slice(); //BUG Error
  // 会导致初始化data数据为空时被赋值，后续无法为其同步数据
  // 使用 watch(data, () => { if (data.length != 0 && bool_init === false){。。。。。}
  // 实现类似WPF 控件的 Loaded 触发事件
});
*/

//
onBeforeUnmount(() => {
  cleanup();
});
const cleanup = () => {
  columns.value = [];
  // props.data_temporary = [];
  data_select_Index.value = -1;
  page_Size.value = 10;
  
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
  
  stopWatching_collapsed_width()
  stopWatching_window_innerWidth()
  // stopWatching_Init()
};


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
import { RouterLink } from 'vue-router';
</script>

<template>
  <n-space vertical :size="12">
    <n-space>
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
        <n-p style="margin-top: 6px;"> 你选中了 {{ checkedRowKeysRef.length }} 行。 </n-p>
      </n-space>
    </n-space>

    <!-- :pagination="paginationReactive" || virtual-scroll :max-height="1000" -->
    <!-- :row-key唯一标识，防止数据混乱  -->
    <n-data-table
      class="table"
      :style="{ width:collapsed_width + 'px'}"
      :columns="columns" :loading="bool_loading" 
      :data="props.data_temporary"
      :bordered="false"
      flex-height
      striped
      default-expand-all
      :on-update-page-size="update_page_size"
      :row-key="(row: RowData) => row.id"
      @update:checked-row-keys="checkedRowhandleCheck"
      @update-expanded-row-keys="checkedRowhandleCheck"
      :checked-row-keys="checkedRowKeysRef"
      @select="handleSelect_data_dropmenu"
      :row-props="rowProps"

      :pagination="paginationReactive"

      :scroll-x="1800"
    />
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
</template>

<style>
.table {
  height: calc(100vh - 200px);
}
</style>
