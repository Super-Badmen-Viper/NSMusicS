<script setup lang="ts">
import { ref, onMounted, nextTick, h, reactive, computed, watch } from 'vue';
import { useMessage,DropdownOption, type DataTableColumns, type DataTableInst, type DataTableRowKey, NIcon } from 'naive-ui';
import { RowData, SortOrder } from 'naive-ui/es/data-table/src/interface';
const emit = defineEmits();

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
    title: 'Title',
    key: 'title',
    width: '300px',
    ellipsis: {
      tooltip: true
    },
    sortOrder: sortKeyMapOrderRef.value.title || false,
    sorter: {
      compare: (a, b) => a.title.localeCompare(b.title),
      multiple: 2
    }
  },
  {
    title: 'Artist',
    key: 'artist',
    width: '300px',
    ellipsis: {
      tooltip: true
    },
    sortOrder: sortKeyMapOrderRef.value.artist || false,
    sorter: {
      compare: (a, b) => a.artist.localeCompare(b.artist),
      multiple: 1
    },
  },
  {
    title: 'Album',
    key: 'album',
    width: '300px',
    ellipsis: {
      tooltip: true
    },
    sortOrder: sortKeyMapOrderRef.value.album || false,
    sorter: {
      compare: (a, b) => a.album.localeCompare(b.album),
      multiple: 2
    },
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
const { data } = defineProps<{ data: Media_File[]}>();
const data_temporary = ref<Media_File[]>(data.slice());// data.slice() BUG Error: Because Init
const dataTableInstRef = ref<DataTableInst | null>(null);
const sortStatesRef = ref([])
interface SortKeyMap {
  [key: string]: SortOrder;
}
const sortKeyMapOrderRef = computed<SortKeyMap>(() =>
  sortStatesRef.value.reduce((result, { columnKey, order }) => {
    result[columnKey] = order
    return result
  }, {})
)
let columnKey: string; let order: string;let order_same_count: number = 0;
// 弃用 handleUpdateSorter + sortBycolumnKey
function handleUpdateSorter (sorters: ConcatArray<never>) {
  sortStatesRef.value = [].concat(sorters)

  // 此n-data-table组件 在清除列头时 排序状态会冻结（此组件无解除冻结的API，无隐藏列头的API）
  // 以下为修复此组件排序功能的替代
  // let the_same:number = 0
  // const sorter = sorters[0];
  // sortStatesRef.value = [].concat(sorter)
  // const element = sortStatesRef.value[0] as { columnKey: string; order: string };
  // if(columnKey == element.columnKey)
  //   if(order == element.order)
  //   {
  //     the_same = 0
  //     order_same_count++;
  //     if(order_same_count === 2){
  //       the_same = 1
  //     }else if(order_same_count === 3){
  //       the_same = 2
  //       order_same_count = 0
  //     }
  //   }

  // columnKey = element.columnKey
  // order = element.order

  // sortBycolumnKey(sorters,the_same)
}
const sortBycolumnKey = (sorters: ConcatArray<never>,bool: number) => {
  let sortersArray: { columnKey: string; order: string }[] = [];
  for (let i = 0; i < sorters.length; i++) {
    const sorter = sorters[i];
    sortStatesRef.value = [].concat(sorter)
    sortStatesRef.value.forEach((element: { columnKey: string; order: string }) => {
      const columnKey = element.columnKey;
      const order = element.order;
      console.log('columnKey:', columnKey);
      console.log('order:', order);

      sortersArray.push(element)
    });
  }

  if(bool === 0){
    if(sortersArray[0].order === 'ascend')
      sortersArray[0].order = 'descend'
    else
      sortersArray[0].order = 'ascend'
  }else if(bool === 1){
    sortersArray.splice(0, 1)
  }
  
  sortByColumnKeys(sortersArray)
};
//
function sortByColumnKeys(sortersArray: { columnKey: string; order: string }[] = []) {
  let bool_default = false
  for (let i = 0; i < sortersArray.length; i++) {
    data_temporary.value.sort((a, b) => {
      const columnKey = sortersArray[i].columnKey;
      const order = sortersArray[i].order;
      const valueA = (a as any)[columnKey];
      const valueB = (b as any)[columnKey];

      if (valueA !== valueB) {
        if (order === 'ascend') {
          return valueA < valueB ? -1 : 1;
        } else if (order === 'descend') {
          return valueA > valueB ? -1 : 1;
        } else {
          bool_default = true
        }
      }
      return 0; // 如果所有排序条件都相同，则返回0
    });
  }

  if(sortersArray.length === 0)
    data_temporary.value = data.slice();

  if(bool_default)
    data_temporary.value = data.slice();
}
//
const checkedRowKeysRef = ref<DataTableRowKey[]>([]);
const data_select_Index = ref<number>(0)
const checkedRowhandleCheck = (rowKeys: DataTableRowKey[]) => {
  checkedRowKeysRef.value = rowKeys;
};
const click_select_ALL_row = () => {
  if(checkedRowKeysRef.value.length != 0)
  {
    checkedRowKeysRef.value.length = 0
  }else{
    checkedRowKeysRef.value = data_temporary.value.map((row: { id: any; }) => row.id);
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
const options: DropdownOption[] = [
  {
    label: '搜索此歌手',
    key: 'search_this_singer'
  },
  {
    label: '搜索此专辑',
    key: 'search_this_album'
  },
  {
    label: '编辑歌曲信息',
    key: 'edit'
  },
  {
    label: '添加到歌单',
    key: 'add'
  },
  {
    label: () => h('span', { style: { color: 'red' } }, '删除'),
    key: 'delete'
  }
]
const handleSelect = (option: string) => {
  if (option === 'edit') {
    console.log('编辑')
    emit('menu_edit_this_song',data_select_Index.value);
  } 
  else if (option === 'add') {
    console.log('添加到')
    emit('menu_add_this_song',data_select_Index.value);// data.splice(data_select_Index.value,1)
  }
  else if (option === 'delete') {
    console.log('删除')
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
const bool_start_play = ref<boolean>(true)
const forceUpdate = ref(false); // 创建一个响应式引用
const click_play_this_medialist = () => {
  if(bool_start_play.value == true){
    let media_file:Media_File = data_temporary.value[0]
    message.info(media_file.artist + " - " + media_file.title);
    emit('media_file_path', media_file.path)
    emit('this_audio_singer_name',media_file.artist)
    emit('this_audio_song_name',media_file.title)
    emit('this_audio_album_name',media_file.album)
    emit('data_select_Index', data_select_Index.value); 
  }else{
    message.info('请退出 批量操作 模式');
  }
}
const rowProps = (row:RowData,page_index: number) => ({//此处page代表相对分页的项的下标:0~(pageSize-1)
  onDblclick: (_e: MouseEvent) => {
    if(bool_start_play.value == true){
      let media_file:Media_File =JSON.parse(JSON.stringify(row, null, 2))
      message.info(media_file.artist + " - " + media_file.title);
      emit('media_file_path', media_file.path)
      emit('this_audio_singer_name',media_file.artist)
      emit('this_audio_song_name',media_file.title)
      emit('this_audio_album_name',media_file.album)
      emit('page_song_index', page_index); 

      data_select_Index.value = (current_page_num.value-1)*page_Size.value + page_index;
      emit('data_select_Index', data_select_Index.value); 
    }else{
      message.info('请退出 批量操作 模式');
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
const data_page = ref<Media_File[]>([]);
const update_page = (page: number) => {//当前页数Update
  data_page.value.length = 0;
  const startIndex = (page - 1) * page_Size.value;
  const endIndex = startIndex + page_Size.value;
  for (let index = startIndex; index < endIndex; index++) {
    data_page.value.push(data_temporary.value[index]);
  }

  emit('media_PageFiles',data_page)

  current_page_num.value = page
};
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
  // 更新排序参数数组并执行排序操作
  const sortersArray: { columnKey: string; order: string }[] = [{ columnKey: String(key), order: _state_Sort_ }];
  sortByColumnKeys(sortersArray);
}
//
onMounted(() => {
  columns.value = createColumns_normal()
  // data_temporary.value = data.slice(); //BUG Error

  // 默认排序
  // let sortersArray: { columnKey: string; order: string }[] = [];
  // let element: { columnKey: string; order: string } = {columnKey:'artist',order:'ascend'}
  // sortersArray.push(element)
  // sortByColumnKeys(sortersArray)
});
let bool_init = false
watch(data, () => {
  if (data.length != 0 && bool_init === false) {
    // 数据已经初始化完成，可以执行你想要的操作
    data_temporary.value = data.slice()
    bool_init = true
  }
  // const data_temporary = ref<Media_File[]>(data.slice());// data.slice() BUG Error: Because Init
  // data_temporary.value = data.slice(); //BUG Error
  // 会导致初始化data数据为空时被赋值，后续无法为其同步数据
  // 使用 watch(data, () => { if (data.length != 0 && bool_init === false){。。。。。}
  // 实现类似WPF 控件的 Loaded 触发事件
});
//

import {
  AddCircleOutline
} from '@vicons/ionicons5'
import {
  AddCircle32Regular,
  MultiselectLtr20Filled,
  Delete20Regular,
  SelectAllOn24Regular,
  PlayCircle20Filled,
  ArrowSort24Regular,TextSortAscending20Regular,TextSortDescending20Regular,
  Search20Filled,
  Filter16Regular
} from '@vicons/fluent'
import { DefineComponent, ComponentOptionsMixin, EmitsOptions, VNodeProps, AllowedComponentProps, ComponentCustomProps, ExtractPropTypes } from 'vue';
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
      
      <n-button tertiary circle>
        <template #icon>
          <n-icon :size="20"><Filter16Regular/></n-icon>
        </template>
      </n-button>

      <n-button tertiary circle>
        <template #icon>
          <n-icon :size="20"><Search20Filled/></n-icon>
        </template>
      </n-button>

      <n-dropdown 
        trigger="hover" :show-arrow="true" 
        :options="options_Sort" @select="handleSelect_Sort">
        <n-button tertiary circle>
          <template #icon>
            <n-icon :size="20"><ArrowSort24Regular/></n-icon>
          </template>
        </n-button>
      </n-dropdown>

      <n-popover trigger="hover">
        <template #trigger>
          <n-button tertiary circle @click="click_bulk_operation">
            <template #icon>
              <n-icon :size="20"><MultiselectLtr20Filled/></n-icon>
            </template>
          </n-button>
        </template>
        <span>批量操作</span>
      </n-popover>
      
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
      :columns="columns"
      @update:sorter="handleUpdateSorter"
      :data="data_temporary"
      :bordered="false"
      flex-height
      :on-update-page-size="update_page_size"
      :on-update-page="update_page"
      :row-key="(row: RowData) => row.id"
      @update:checked-row-keys="checkedRowhandleCheck"
      :checked-row-keys="checkedRowKeysRef"
      @select="handleSelect"
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
    :options="options"
    :show="showDropdownRef"
    :on-clickoutside="onClickoutside"
    @select="handleSelect"
  />
</template>

<style>
.table {
  width: calc(100% - 220px);
  height: calc(100vh - 240px);
}
</style>
