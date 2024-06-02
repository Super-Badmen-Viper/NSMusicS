<script setup lang="ts">
  ////// this_view resource of vicons_svg
  import {
    AddCircle32Regular,
    MultiselectLtr20Filled,
    Delete20Regular,
    SelectAllOn24Regular,
    ArrowSort24Regular,TextSortAscending20Regular,TextSortDescending20Regular,
    Search20Filled,
    SaveEdit24Regular,
    Heart24Regular,Heart28Filled,
    ChevronLeft16Filled,ChevronRight16Filled,
    Filter20Filled,
  } from '@vicons/fluent'

  ////// this_view components of navie ui 
  import { ref, onMounted, h, computed, watch, onBeforeUnmount } from 'vue';
  import { type DropdownOption, NIcon,type InputInst,NImage } from 'naive-ui';

  ////// passed as argument
  const emits = defineEmits([
    'media_file_path','media_file_path_from_playlist',
    'media_file_medium_image_url',
    'this_audio_singer_name','this_audio_singer_id',
    'this_audio_song_name','this_audio_song_id','this_audio_song_rating','this_audio_song_favorite',
    'this_audio_album_name','this_audio_album_id',
    'this_audio_Index_of_absolute_positioning_in_list',
    'menu_edit_this_song',
    'menu_add_this_song',
    'menu_delete_this_song',
    'options_Sort_key',
    'page_songlists_keyword',
    'page_songlists_reset_data',
    'media_Files_selected',
    'media_Files_selected_set',
    'media_Files_selected_set_all',
    'page_songlists_selected',
    'this_audio_lyrics_string',
    'router_history_model','router_history_model_of_Media_scroller_value','router_history_model_of_Media_scroll',
  ]);
  const props = defineProps<{
    data_temporary: Media_File[];data_temporary_selected: Media_File[];

    change_page_header_color: boolean;page_top_album_image_url:string;page_top_album_name:string;page_top_album_id:string;
    page_songlists:Play_List[];page_songlists_options:{label: string;value: string}[];page_songlists_statistic:{label: string;song_count: number;id: string;}[];
    page_songlists_selected:string;

    page_songlists_keyword:string;
    
    app_left_menu_collapsed: Boolean;
    window_innerWidth: number;
    options_Sort_key:{ columnKey: string; order: string }[];

    router_select_history_date: Router_date;router_history_datas: Router_date[];router_history_model_of_Media_scroller_value: number;router_history_model_of_Media_scroll: Boolean;
  }>();

  ////// songlist_view page_layout lineItems
  const collapsed_width = ref<number>(1090);
  const handleImageError = (event:any) => {
    event.target.src = '../../../resources/img/error_album.jpg'; // 设置备用图片路径
  };
  const os = require('os');
  function getAssetImage(firstImage: string) {
    if(os.type() || process.platform === 'win32')
      return new URL(firstImage, import.meta.url).href;
    else if(os.type() || process.platform === 'darwin')
      return new URL(firstImage, import.meta.url).href;
    else if(os.type() || process.platform === 'linux')
      return new URL(firstImage, import.meta.url).href;
  }
  // lineItems Re render
  let bool_watch = false;
  const timer = ref<NodeJS.Timeout | null>(null);
  const startTimer = () => {
    timer.value = setInterval(() => {
      bool_watch = true;
    }, 1000);
  };
  const stopWatching_collapsed_width = watch(() => props.app_left_menu_collapsed, (newValue, oldValue) => {
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
    if (props.app_left_menu_collapsed == true) {
      collapsed_width.value = 145;
    } else {
      collapsed_width.value = 240;
    }
  };
  onMounted(() => {
    startTimer();
    updateGridItems();
  });
  // lineItems Sort
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
      let icon: any;
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
    // emits('options_Sort_key',options_Sort_key.value)
    // 更新排序参数数组并执行排序操作
    const sortersArray: { columnKey: string; order: string }[] = [{ columnKey: String(key), order: _state_Sort_ }];
    emits('options_Sort_key',sortersArray)
    // sortByColumnKeys(sortersArray);

    scrollTo(0)
  }
  const options_Sort_key_Default_key = ref<string>()
  const options_Sort_key_Default = ref<SortItem[]>()
  // lineItems Search(filter)
  const bool_show_search_area = ref<boolean>(false)
  const show_search_area = () => {
    if(bool_show_search_area.value === true)
    {
      bool_show_search_area.value = false
      input_search_InstRef.value?.clear()
      if(bool_input_search == true){
        emits('page_songlists_reset_data',true)
        back_search_default()
        bool_input_search = false
        scrollTo(0)
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
      emits('page_songlists_keyword',page_songlists_keyword)
      bool_input_search = true
      options_Sort_key.value.forEach(element => {
        element.state_Sort = state_Sort.Default
      });
    }else{
      emits('page_songlists_reset_data',true)
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
            emits('options_Sort_key', null);
          } else {
            const sorter = { columnKey: options_Sort_key.value[i].key, order: options_Sort_key.value[i].state_Sort };
            sortersArray.push(sorter);
            emits('options_Sort_key', sortersArray);
          }
          break;
        }
      }
    }
  }
  onMounted(() => {
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
  // lineItems Filter To Favorite
  const options_Filter = ref([
    {
      label: '收藏歌曲',
      key: 'filter_favorite',
      icon() {
        return h(NIcon, null, {
          default: () => h(Heart28Filled)
        });
      }
    }
  ])
  const options_Filter_handleSelect = (key: string | number) => {
    emits('page_songlists_selected','song_list_love')
    console.log('selected_value_for_songlistall：'+'song_list_love');
    breadcrumbItems.value = props.page_songlists_options.find(option => option.value === 'song_list_love')?.label || '';
  }

  ////// scrollbar of artistlist_view
  const scrollbar = ref(null as any);
  const onResize = () => {
    console.log('resize');
  }
  const updateParts = { viewStartIdx: 0, viewEndIdx: 0, visibleStartIdx: 0, visibleEndIdx: 0 } // 输出渲染范围updateParts
  const onUpdate = (viewStartIndex: any, viewEndIndex: any, visibleStartIndex: any, visibleEndIndex: any) => {
    updateParts.viewStartIdx = viewStartIndex
    updateParts.viewEndIdx = viewEndIndex
    updateParts.visibleStartIdx = visibleStartIndex
    updateParts.visibleEndIdx = visibleEndIndex

    emits('router_history_model_of_Media_scroller_value',viewEndIndex)
  }
  const stopWatching_router_history_model_of_Media_scroll = watch(() => props.router_history_model_of_Media_scroll,(newValue) => {
      if (newValue === true) {
        scrollTo(props.router_history_model_of_Media_scroller_value)
        emits('router_history_model_of_Media_scroll',false)
      }
    }
  )
  const this_audio_Index_of_absolute_positioning_in_list = ref<number>(0)
  const scrollTo = (value :number) => {
    if (scrollbar !== null) {
      setTimeout(() => {
        scrollbar.value.scrollToItem(value - (12 + Math.floor((window.innerHeight - 765) / 75)));// 1000:15，690:11  75 
      }, 100);
    }
  }
  onMounted(() => {
    scrollTo(props.router_history_model_of_Media_scroller_value)
  });

  ////// select Dtatsource of artistlists
  const breadcrumbItems = ref('所有歌曲');
  const page_songlists_handleselected_updatevalue = (value: any) => {
    emits('page_songlists_selected',value)
    console.log('selected_value_for_songlistall：'+value);
    breadcrumbItems.value = props.page_songlists_options.find(option => option.value === value)?.label || '';
  };

  ////// router history 
  const get_router_history_model_pervious = () => {
    emits('router_history_model',-1)
  }
  const get_router_history_model_next = () =>  {
    emits('router_history_model',1)
  }

  /////// emits audio_info of songlist_view_list
  const handleItemClick = () => {
    click_count++
  }
  const handleItemDbClick = (media_file:Media_File,index:number) => {
    if(bool_start_play.value == true){
      if(click_count >= 2){
        click_count = 0

        emits('media_file_path_from_playlist',false)
        emits('media_file_path', media_file.path)
        emits('this_audio_lyrics_string', media_file.lyrics)
        emits('media_file_medium_image_url',media_file.medium_image_url)
        emits('this_audio_singer_name',media_file.artist)
        emits('this_audio_singer_id',media_file.artist_id)
        emits('this_audio_song_name',media_file.title)
        emits('this_audio_song_id',media_file.id)
        emits('this_audio_song_rating',media_file.rating)
        emits('this_audio_song_favorite',media_file.favorite)
        emits('this_audio_album_id', media_file.album_id);
        emits('this_audio_album_name',media_file.album)
        emits('this_audio_Index_of_absolute_positioning_in_list', index);
      }
    }
  }
  const handleItemClick_title = (title:string) => {
    click_count = 0;
    input_search_Value.value = title//+'accurate_search'+'__title__'
    bool_show_search_area.value = false
    show_search_area()
    click_search()
    scrollTo(0)
  }
  const handleItemClick_artist = (artist:string) => {
    click_count = 0;
    input_search_Value.value = artist+'accurate_search'+'__artist__'//artist不参与精确搜索
    bool_show_search_area.value = false
    show_search_area()
    click_search()
    scrollTo(0)
  }
  const handleItemClick_album = (album:string) => {
    click_count = 0;
    input_search_Value.value = album+'accurate_search'+'__album__'
    bool_show_search_area.value = false
    show_search_area()
    click_search()
    scrollTo(0)
  }
  
  ////// changed_data write to sqlite
  import {Set_MediaInfo_To_LocalSqlite} from '../../../src/models/data_Change_For_Sqlite/class_Set_MediaInfo_To_LocalSqlite'
  let set_MediaInfo_To_LocalSqlite = new Set_MediaInfo_To_LocalSqlite()
  const handleItemClick_Favorite = (id: any,favorite: Boolean) => {
    click_count = 0;
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_Favorite(id,favorite)
  }
  const handleItemClick_Rating = (id: any,rating: number) => {
    click_count = 0;
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_Rating(id,rating)
  }

  ////// bulk_operation and select_line
  const click_select_SongList_ALL_Line = () => {
    if(props.data_temporary_selected.length == 0){
      emits('media_Files_selected_set_all', true);
    }else{
      emits('media_Files_selected_set_all', false);
    }
  }
  const click_open_bulk_operation = () => {
    if(bool_start_play.value == true)
    {
      bool_start_play.value = false
    }
    else{
      bool_start_play.value = true
    }
  }
  ////// Right_click_on_songline show menu
  let click_count = 0
  const bool_start_play = ref<boolean>(true)
  const xRef = ref(0)
  const yRef = ref(0)
  const showDropdownRef = ref(false)
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
      emits('menu_edit_this_song',this_audio_Index_of_absolute_positioning_in_list.value);
    } 
    else if (option === 'add') {
      emits('menu_add_this_song',this_audio_Index_of_absolute_positioning_in_list.value);
    }
    else if (option === 'delete') {
      emits('menu_delete_this_song',this_audio_Index_of_absolute_positioning_in_list.value);
    }
    showDropdownRef.value = false;
  }
  const onClickoutside = () => {
    showDropdownRef.value = false
  }

  ////// view songlist_view Remove data
  onBeforeUnmount(() => {
    this_audio_Index_of_absolute_positioning_in_list.value = -1;
    stopWatching_collapsed_width()
    stopWatching_window_innerWidth()
    stopWatching_router_history_model_of_Media_scroll()
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
  });
</script>

<template>
  <n-space vertical :size="12">
    <n-space>
      <n-button quaternary circle size="medium" style="margin-left:4px" @click="get_router_history_model_pervious">
        <template #icon>
          <n-icon size="20" :depth="2"><ChevronLeft16Filled/></n-icon>
        </template>
      </n-button>
      <div style="margin-top: 4px;">
        {{ props.router_select_history_date?.id ?? '' }} / {{ props.router_history_datas?.length ?? '' }}
      </div>
      <n-button quaternary circle size="medium" style="margin-left:4px" @click="get_router_history_model_next">
        <template #icon>
          <n-icon size="20" :depth="2"><ChevronRight16Filled/></n-icon>
        </template>
      </n-button>

      <n-button quaternary circle size="medium" style="margin-left:4px" @click="show_search_area">
        <template #icon>
          <n-icon :size="20" :depth="2"><Search20Filled/></n-icon>
        </template>
      </n-button>
      <n-input-group 
        v-if="bool_show_search_area"
        style="width: 160px;">
        <n-input 
          style="width: 160px;"
          ref="input_search_InstRef" 
          v-model:value="input_search_Value"
          @keydown.enter="click_search"/>
      </n-input-group>
      
      <n-dropdown 
        trigger="click" :show-arrow="true" 
        :options="options_Sort" @select="handleSelect_Sort">
        <n-button quaternary circle size="medium" style="margin-left:4px">
          <template #icon>
            <n-icon :size="20" :depth="2"><ArrowSort24Regular/></n-icon>
          </template>
        </n-button>
      </n-dropdown>

      <n-dropdown 
        trigger="click" :show-arrow="true" 
        :options="options_Filter" @select="options_Filter_handleSelect">
        <n-button quaternary circle size="medium" style="margin-left:4px">
          <template #icon>
            <n-icon :size="20"><Filter20Filled/></n-icon>
          </template>
        </n-button>
      </n-dropdown>

      <n-button quaternary circle size="medium" style="margin-left:4px" @click="click_open_bulk_operation">
        <template #icon>
          <n-icon :size="20" :depth="2"><MultiselectLtr20Filled/></n-icon>
        </template>
      </n-button>   
      
      <n-space v-if="!bool_start_play">
        <n-button quaternary circle size="medium" style="margin-left:4px" @click="click_select_SongList_ALL_Line">
          <template #icon>
            <n-icon :size="20" :depth="2"><SelectAllOn24Regular/></n-icon>
          </template>
        </n-button>
        <n-button quaternary circle size="medium" style="margin-left:4px">
          <template #icon>
            <n-icon :size="20" :depth="2"><AddCircle32Regular/></n-icon>
          </template>
        </n-button>
        <n-button flo quaternary circle size="medium" style="margin-left:4px"
            v-if="props.page_songlists_selected !== 'song_list_all' && props.page_songlists_selected !== 'song_list_recently'">
          <template #icon>
            <n-icon :size="20" :depth="2"><Delete20Regular/></n-icon>
          </template>
        </n-button>
        <n-p style="margin-top: 6px;"> 你选中了 {{ props.data_temporary_selected.length }} 行。 </n-p>
      </n-space>

    </n-space>
    <div class="dynamic-scroller-demo">
      <DynamicScroller 
        class="table" ref="scrollbar" :style="{ width: 'calc(100vw - ' + (collapsed_width - 40) + 'px)'}"
        :items="props.data_temporary"
        :minItemSize="50"
        :emit-update="true"
        @resize="onResize"
        @update="onUpdate">
        <template #before>
          <div class="notice">
            <div
              :style="{ width: 'calc(100vw - ' + (collapsed_width) + 'px)'}"
              style="
                position: absolute;
                z-index: 0;
                height: 298px;
                border-radius: 10px;
                border: 1.5px solid #FFFFFF20;
                overflow: hidden;
                background-size: cover;
                background-position: center;
                filter: blur(0px);
                background-color: transparent;
              ">
              <img 
                :style="{ 
                  width: 'calc(100vw - ' + (collapsed_width + 200) + 'px)',
                  height: 'calc(100vw - ' + (collapsed_width + 200) + 'px)',
                  WebkitMaskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 25%)'
                }"
                style="
                  margin-left: 200px; margin-top: -300px;
                  object-fit: cover;object-position: center;
                "
                :src="getAssetImage(props.page_top_album_image_url)"
                @error="handleImageError"
              />
            </div>
            <div 
              :style="{ width: 'calc(100vw - ' + (collapsed_width) + 'px)'}"
              style="
                position: absolute;
                z-index: 0;
                height: 300px;
                border-radius: 10px;
                overflow: hidden;">
              <svg 
                style="
                  position: absolute; top: -2; left: 0; 
                  width: 100%; height: 100%;
                  ">
                <defs>
                  <linearGradient v-if="!props.change_page_header_color" id="gradient" gradientTransform="rotate(30)">
                    <stop offset="0%" stop-color="#FAFAFC"></stop>
                    <stop offset="100%" stop-color="rgba(255, 255, 255, 0.4)"></stop>
                  </linearGradient>
                  <linearGradient v-if="props.change_page_header_color" id="gradient" gradientTransform="rotate(30)">
                    <stop offset="0%" stop-color="#101014"></stop>
                    <stop offset="150%" stop-color="rgba(0, 0, 0, 0.4)"></stop>
                  </linearGradient>
                </defs>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M462 61.401L281 300L0 300V0H413.923L462 61.401ZM426.805 61.407L394.831 102.26C394.337 102.886 394.783 103.814 395.59 103.814H404.903C405.493 103.814 406.059 103.537 406.421 103.079L437.178 63.7803C437.71 63.1016 438 62.2638 438 61.401C438 60.5382 437.71 59.7004 437.178 59.0216L406.421 19.7349C406.059 19.265 405.493 19 404.903 19H395.59C394.783 19 394.337 19.9276 394.831 20.5541L426.805 61.407ZM358.207 102.26L390.181 61.407L358.207 20.5541C357.713 19.9276 358.159 19 358.966 19H368.278C368.869 19 369.435 19.265 369.796 19.7349L400.554 59.0216C401.086 59.7004 401.376 60.5382 401.376 61.401C401.376 62.2638 401.086 63.1016 400.554 63.7803L369.796 103.079C369.435 103.537 368.869 103.814 368.278 103.814H358.966C358.159 103.814 357.713 102.886 358.207 102.26Z" fill="url(#gradient)"/>
                <path d="M692.435 277.978C691.723 277.07 691.723 275.801 692.435 274.885L711.917 250H413.673L392.983 276.435L411.427 300H709.671L692.435 277.978Z" fill="url(#gradient)"/>
                <path d="M386.241 277.978C385.529 277.07 385.529 275.801 386.241 274.885L413.723 242H397.868L350.7 300H403.477L386.241 277.978Z" fill="url(#gradient)"/>
                <path d="M716.241 277.978C715.528 277.07 715.528 275.801 716.241 274.885L742.5 242H726.5L719.868 250L699.178 276.435L717.5 300L733.5 300L716.241 277.978Z" fill="url(#gradient)"/>
              </svg>
            </div>
            <n-page-header 
              style="
                position: relative;
                z-index: 1;
                width: calc(100vw - 220px);height: 300px;
                border-radius: 10px;
                margin-bottom: 10px;">
              <n-grid 
                :cols="2" :x-gap="0" :y-gap="10" layout-shift-disabled
                style="margin-left: 14px;width: 370px;">
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
                    :on-update:value="page_songlists_handleselected_updatevalue" />
                </n-space>
              </template>
              <template #header>
                
              </template>
              <template #avatar>
                <n-image
                  width="80px" height="80px" object-fit="contain"
                  style="
                    border-radius: 6px;border: 1.5px solid #FFFFFF20;
                    margin-left: 12px;margin-top: 20px;"
                  :src="getAssetImage(props.page_top_album_image_url)"
                  fallback-src="../../../resources/img/error_album.jpg"
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
                  <n-button text @click="handleItemClick_album(props.page_top_album_id)">
                    <n-ellipsis 
                      style="
                        max-width: 256px;height: 40px;
                        text-align: left;font-size: 24px;
                        font-weight: 900;">
                      {{ props.page_top_album_name }}
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
            :style="{ width: 'calc(100vw - ' + (collapsed_width) + 'px)'}"
            @click="handleItemClick"
            @Dblclick="handleItemDbClick(item,index)">
            <div class="media_info" :style="{ width: 'calc(100vw - ' + (collapsed_width) + 'px)'}">
              <n-checkbox class="checkbox" 
                v-if="!bool_start_play"
                v-model:checked="item.selected"
                @update:checked="(checked: any) => { 
                  item.selected = checked;
                  emits('media_Files_selected_set', item);
                }"
                />
              <div 
                style="margin-left: 10px;
                  width: 60px;height: 60px; 
                  border-radius: 6px;border: 1.5px solid #FFFFFF20;
                  overflow: hidden;">
                <img
                  :key="item.id"
                  :src="item.medium_image_url"
                  @error="handleImageError"
                  style="width: 60px; height: 60px; object-fit: cover;"/>
              </div>
              <div class="songlist_title">
                <span @click="handleItemClick_title(item.title)">{{ item.title }}</span>
                <br>
                <template v-for="artist in item.artist.split(/[\/|｜]/)">
                  <span @click="handleItemClick_artist(artist)">{{ artist + '&nbsp' }}</span>
                </template>
              </div>
              <div class="songlist_album" style="margin-right: 20px;">
                <span @click="handleItemClick_album(item.album_id)">{{ item.album }}</span>
              </div>
              <div class="love" style="margin-left: auto;margin-right: 80px;">
                <n-rate clearable size="small" v-model:value="item.rating" @update:value="(value: number) => handleItemClick_Rating(item.id, value)"/>
              </div>
              <div class="love" style="margin-left: auto;">
                <n-button circle text size="small" style="display: block;" 
                  @click="handleItemClick_Favorite(item.id,item.favorite);item.favorite = !item.favorite;">
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
  height: calc(100vh - 194px);
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
  width: 260px;
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
  width: 200px;
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
  width: 260px;
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
  display: auto;
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #88888850;
  border-radius: 6px;
}
::-webkit-scrollbar-track {
  background-color: #f1f1f105;
  border-radius: 6px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #88888850;
  border-radius: 6px;
}
</style>../../models/data_Change_For_Sqlite/class_Set_MediaInfo_To_LocalSqlite