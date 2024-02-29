<script setup lang="ts">
  import { nextTick, onMounted, reactive, ref, watch } from 'vue';

  const emit = defineEmits([
    'album_page_num',
    'album_page_Size',
  ]);

  const props = defineProps(['data','data_temporary','pageCount','collapsed','window_innerWidth']);
  // 重新渲染列表 width

  //
  const item_album_margin = ref<number>(12)
  const item_album = ref<number>(180)
  const item_album_image = ref<number>(item_album.value - 20)
  const item_album_txt = ref<number>(item_album.value - 30)
  //
  const page = ref<number>(1)
  const paginationReactive = reactive({
    page: 1,
    pageCount: props.pageCount,
    pageSize: 30,
    showSizePicker: true,
    showQuickJumper: true,
    pageSizes: [10, 30, 50],
  })
  const pagination_onChange = (page: number) => {
    paginationReactive.page = page
    emit('album_page_num',page)
  }
  const pagination_onUpdatePageSize = (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
    emit('album_page_Size',pageSize)
  }
  // 右键菜单，已弃用
  import { DropdownOption, NIcon, ScrollbarInst, ScrollbarProps } from 'naive-ui';
  const xRef = ref(0)
  const yRef = ref(0)
  const showDropdownRef = ref(false)
  const data_select_Index = ref<number>(0)
  const options_data_dropmenu: DropdownOption[] = [
    // {
    //   label: '搜索此歌手',
    //   key: 'search_this_singer',
    //   icon () {
    //     return h(NIcon, null, {
    //       default: () => h(Search20Filled)
    //     })
    //   },
    // },
    // {
    //   label: '搜索此专辑',
    //   key: 'search_this_album',
    //   icon () {
    //     return h(NIcon, null, {
    //       default: () => h(Search20Filled)
    //     })
    //   },
    // },
    // {
    //   label: '编辑歌曲信息',
    //   key: 'edit',
    //   icon () {
    //     return h(NIcon, null, {
    //       default: () => h(SaveEdit24Regular)
    //     })
    //   },
    // },
    // {
    //   label: '添加到歌单',
    //   key: 'add',
    //   icon () {
    //     return h(NIcon, null, {
    //       default: () => h(AddCircle32Regular)
    //     })
    //   },
    // },
    // {
    //   label: () => h('span', { style: { color: 'red' } }, '删除'),
    //   key: 'delete',
    //   icon () {
    //     return h(NIcon, null, {
    //       default: () => h(Delete20Regular)
    //     })
    //   },
    // }
  ]
  const onClickoutside = () => {showDropdownRef.value = false}
  const handleSelect_data_dropmenu = (option: string) => {
    // if (option === 'edit') {
    //   emit('menu_edit_this_song',data_select_Index.value);
    // } 
    // else if (option === 'add') {
    //   emit('menu_add_this_song',data_select_Index.value);// data.splice(data_select_Index.value,1)
    // }
    // else if (option === 'delete') {
    //   emit('menu_delete_this_song',data_select_Index.value);// data.splice(data_select_Index.value,1)
    // }
    showDropdownRef.value = false;
  }
  const onContextmenu = (e: MouseEvent) => {
    // e.preventDefault()
    // showDropdownRef.value = false
    // nextTick().then(() => {
    //   showDropdownRef.value = true
    //   xRef.value = 0
    //   yRef.value = 0
    // })
    // data_select_Index.value = (current_page_num.value-1)*page_Size.value + page_index;
  }
  //
  const scrollbar = ref();
  const scroll = (e: Event) =>{
    if(scrollbar.value != null){
      const scrollTop = scrollbar.value.scrollDistance;
      const scrollHeight = scrollbar.value.scrollHeight;
      const scrollContainerHeight = scrollbar.value.height;
      if (scrollTop > scrollContainerHeight * 9 / 2) {
        scrollbar.value.scrollTo(0, scrollContainerHeight * 9 / 2);
      }
    }
  }
  //

  import {
    Play16Filled,
    Heart24Regular,
    MoreCircle32Regular
  } from '@vicons/fluent'

</script>
<template>
  <n-space class="album-wall-container" vertical>
    <n-scrollbar class="scrollbar" 
      trigger="none"
      :on-scroll="scroll">
      <n-virtual-list class="album-wall" 
        ref="scrollbar"
        trigger="none"
        :on-scroll="scroll"
        item-resizable
        :item-size="item_album" 
        :items="props.data_temporary">
        <template #default="{ item }">
          <div class="album" :key="item.key" :style="{ margin: item_album_margin + 'px' }"
              @mouseover="item.isHovered = true"
              @mouseleave="item.isHovered = false"
              @contextmenu="onContextmenu">
            <div 
              :style="{ 
                width: item_album_image + 'px', 
                height: item_album_image + 'px', 
                position: 'relative' }">
              <img 
                :src="item.medium_image_url"
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
                    style="margin: 0px auto;" color="#FFFFFF"
                    :style="{ marginLeft:item_album_image + 'px'}">
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
        </template>
      </n-virtual-list>
    </n-scrollbar>
  </n-space>
  <n-pagination
      style="position: absolute;right: 10px;bottom: 10px;"
      :display-order="['quick-jumper', 'pages', 'size-picker']"
      :page-sizes="[10, 30, 50]"
      :pageSize="paginationReactive.pageSize"
      :on-update-page="pagination_onChange"
      :on-update-page-size="pagination_onUpdatePageSize"
      v-model:page="page"
      :page-count="paginationReactive.pageCount"
      show-quick-jumper
      show-size-picker/>

  <!-- 右键菜单，已弃用 -->
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
.album-wall-container {
  width: 100%;
  height: 100%;
}
.scrollbar{
  max-height: calc(100vh - 190px);
}
.album-wall {
  max-width: calc(100vw - 200px);
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