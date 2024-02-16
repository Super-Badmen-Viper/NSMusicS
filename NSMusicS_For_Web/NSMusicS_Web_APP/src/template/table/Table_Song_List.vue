<script setup lang="ts">
import { ref, onMounted, nextTick, h, reactive, computed } from 'vue';
import { useMessage,DropdownOption, type DataTableColumns, type DataTableInst, type DataTableRowKey } from 'naive-ui';
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
    width: '400px',
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
  },
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
    width: '400px',
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
const { data } = defineProps<{ data: Media_File[]}>();
const data_temporary = ref<Media_File[]>(data);
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
function handleUpdateSorter (sorters: ConcatArray<never>) {
  sortStatesRef.value = [].concat(sorters)
}
const sortBycolumnKey = (sorters: ConcatArray<never>) => {
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
  
  sortByColumnKeys(sortersArray)
};
function sortByColumnKeys(sortersArray: { columnKey: string; order: string }[] = []) {
  for (let i = 0; i < sortersArray.length; i++) {
    data.sort((a, b) => {
      const columnKey = sortersArray[i].columnKey;
      const order = sortersArray[i].order;
      const valueA = (a as any)[columnKey];
      const valueB = (b as any)[columnKey];

      if (valueA !== valueB) {
        if (order === 'ascend') {
          return valueA < valueB ? -1 : 1;
        } else {
          return valueA > valueB ? -1 : 1;
        }
      }
      return 0; // 如果所有排序条件都相同，则返回0
    });
  }
}

const checkedRowKeysRef = ref<DataTableRowKey[]>([]);
const data_select_Index = ref<number>(0)
const checkedRowhandleCheck = (rowKeys: DataTableRowKey[]) => {
  checkedRowKeysRef.value = rowKeys;
};
const click_bulk_operation = () => {
  if(bool_start_play.value == true)
  {
    bool_start_play.value = false
    columns.value = createColumns_select()
  }
  else{
    bool_start_play.value = true
    columns.value = createColumns_normal()
  }
}

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
const loading = ref<boolean>(false)
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
    data_page.value.push(data[index]);
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

onMounted(() => {
  // 默认排序
  // let sortersArray: { columnKey: string; order: string }[] = [];
  // let element: { columnKey: string; order: string } = {columnKey:'artist',order:'ascend'}
  // sortersArray.push(element)
  // sortByColumnKeys(sortersArray)

  columns.value = createColumns_normal()
});

</script>

<template>
  <!-- <n-p> 选中 {{ checkedRowKeysRef.length }} 行 </n-p> -->

  <n-space vertical :size="12">
    <n-space>
      <!-- <n-button @click="sortName">Sort By Name (Ascend)</n-button>
      <n-button @click="filterAddress">Filter Duration (London)</n-button>
      <n-button @click="clearFilters">Clear Filters</n-button>
      <n-button @click="clearSorter">Clear Sorter</n-button> -->
      <n-button @click="click_bulk_operation">批量操作</n-button>
    </n-space>

    <!-- :pagination="paginationReactive" || virtual-scroll :max-height="1000" -->
    <!-- :row-key唯一标识，防止数据混乱  -->
    <n-data-table
      class="table"
      :columns="columns" :loading="loading"
      @update:sorter="handleUpdateSorter"
      :data="data_temporary"
      :bordered="false"
      flex-height
      :on-update-page-size="update_page_size"
      :on-update-page="update_page"
      :row-key="(row: RowData) => row.id"
      @update:checked-row-keys="checkedRowhandleCheck"
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
