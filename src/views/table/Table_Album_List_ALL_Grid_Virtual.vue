<script setup lang="ts">
  ////// this_view resource of vicons_svg
  import {
    MoreCircle32Regular,
    Filter20Filled
  } from '@vicons/fluent'
  import {
    ArrowSort24Regular,TextSortAscending20Regular,TextSortDescending20Regular,
    Search20Filled,
    PlayCircle24Regular,
    Heart24Regular,Heart28Filled,
    ChevronLeft16Filled,ChevronRight16Filled,Open28Filled,
  } from '@vicons/fluent'
  import { Icon } from '@vicons/utils'

  ////// this_view components of navie ui 
  import { computed, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { type InputInst, NIcon } from 'naive-ui';
  import {store_app_configs_info} from "@/store/app/store_app_configs_info";
  import {store_player_audio_info} from "@/store/player/store_player_audio_info";
  import {store_view_album_page_info} from "@/store/view/album/store_view_album_page_info";
  import {store_view_album_page_logic} from "@/store/view/album/store_view_album_page_logic";
  import {store_router_data_logic} from "@/store/router/store_router_data_logic";
  import {store_router_history_data_of_album} from "@/store/router/store_router_history_data_of_album";
  import {store_view_album_page_fetchData} from "@/store/view/album/store_view_album_page_fetchData";

  ////// i18n auto lang
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n({
    inheritLocale: true
  })

  ////// albumlist_view page_layout gridItems
  const item_album = ref<number>(160)
  const item_album_image = ref<number>(item_album.value - 20)
  const item_album_txt = ref<number>(item_album.value - 20)
  const itemSize = ref(220);
  const gridItems = ref(5);
  const itemSecondarySize = ref(185);
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
  // gridItems Re render
  let bool_watch = false;
  const timer = ref<NodeJS.Timeout | null>(null);
  const startTimer = () => {
    timer.value = setInterval(() => {
      bool_watch = true;
    }, 1000);
  };
  const stopWatching_collapsed_width = watch(() => store_app_configs_info.app_left_menu_collapsed, (newValue, oldValue) => {
    updateGridItems();
  });
  const stopWatching_window_innerWidth = watch(() => store_app_configs_info.window_innerWidth, (newValue, oldValue) => {
    bool_watch = false;
    updateGridItems();
    if (bool_watch) {
      startTimer();
    }
  });
  const updateGridItems = () => {
    if (store_app_configs_info.app_left_menu_collapsed == true) {
      collapsed_width.value = 145;
      item_album.value = 145;
      item_album_image.value = item_album.value - 20;
      item_album_txt.value = item_album.value - 20;
      itemSecondarySize.value = 135;
    } else {
      collapsed_width.value = 240;
      item_album.value = 170;
      item_album_image.value = item_album.value - 20;
      item_album_txt.value = item_album.value - 20;
      itemSecondarySize.value = 164;
    }
    gridItems.value = Math.floor(window.innerWidth / itemSecondarySize.value) - 1;
  };
  onMounted(() => {
    startTimer();
    updateGridItems();

    input_search_Value.value = store_view_album_page_logic.page_albumlists_keyword
    if(input_search_Value.value.length > 0){
      bool_show_search_area.value = true
      bool_input_search = true
    }
    else{
      bool_show_search_area.value = false
      bool_input_search = false
    }
  });
  // gridItems Sort
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
    {label:computed(() => t('entity.album_other')), key: 'name', state_Sort: state_Sort.Default },
    {label:computed(() => t('entity.artist_other')), key: 'artist', state_Sort: state_Sort.Default },
    {label:computed(() => t('filter.toYear')), key: 'min_year', state_Sort: state_Sort.Default },
    // {label:computed(() => t('filter.fromYear')), key: 'max_year', state_Sort: state_Sort.Default },
    {label:computed(() => t('common.duration')), key: 'duration', state_Sort: state_Sort.Default },
    {label:computed(() => t('filter.dateAdded')), key: 'created_at', state_Sort: state_Sort.Default },
    {label:computed(() => t('filter.recentlyUpdated')), key: 'updated_at', state_Sort: state_Sort.Default },
    // {label:'更新时间(外部信息)', key: 'external_info_updated_at', state_Sort: state_Sort.Default }
  ]);
  const options_Sort = computed(() => {
    if(store_view_album_page_logic.page_albumlists_options_Sort_key != null && store_view_album_page_logic.page_albumlists_options_Sort_key.length > 0){
      options_Sort_key.value.forEach(element => {
        if(element.key === store_view_album_page_logic.page_albumlists_options_Sort_key[0].columnKey)
          if(store_view_album_page_logic.page_albumlists_options_Sort_key[0].order === state_Sort.Ascend)
            element.state_Sort = state_Sort.Ascend
          else if(store_view_album_page_logic.page_albumlists_options_Sort_key[0].order === state_Sort.Descend)
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
    for (let i = 0; i < options_Sort_key.value.length; i++) {
      if (options_Sort_key.value[i].key === key) {
        _state_Sort_ = options_Sort_key.value[i].state_Sort;
        idx = i;
      } else {
        options_Sort_key.value[i].state_Sort = state_Sort.Default;
      }
    }
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
    const sortersArray: { columnKey: string; order: string }[] = [{ columnKey: String(key), order: _state_Sort_ }];
    store_view_album_page_logic.page_albumlists_options_Sort_key = sortersArray

    scrollTo(0)
  }
  const options_Sort_key_Default_key = ref<string>()
  const options_Sort_key_Default = ref<SortItem[]>()
  // gridItems Search(filter)
  const bool_show_search_area = ref<boolean>(false)
  const show_search_area = () => {
    if(bool_show_search_area.value === true)
    {
      bool_show_search_area.value = false
      input_search_InstRef.value?.clear()
      if(bool_input_search == true){
        store_view_album_page_logic.list_data_StartUpdate = true
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
      const page_albumlists_keyword = input_search_Value.value.toLowerCase();
      store_view_album_page_logic.page_albumlists_keyword = page_albumlists_keyword
      bool_input_search = true
      options_Sort_key.value.forEach(element => {
        element.state_Sort = state_Sort.Default
      });
    }else{
      store_view_album_page_logic.list_data_StartUpdate = true
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
            store_view_album_page_logic.page_albumlists_options_Sort_key = null
          } else {
            const sorter = { columnKey: options_Sort_key.value[i].key, order: options_Sort_key.value[i].state_Sort };
            sortersArray.push(sorter);
            store_view_album_page_logic.page_albumlists_options_Sort_key = sortersArray
          }
          break;
        }
      }
    }
  }
  // lineItems Filter To Favorite
  const options_Filter = ref([
    {
      label: t('nsmusics.view_page.loveAlbum'),
      key: 'filter_favorite',
      icon() {
        return h(NIcon, null, {
          default: () => h(Heart28Filled)
        });
      }
    }
  ])
  const options_Filter_handleSelect = (key: string | number) => {
    store_view_album_page_logic.page_albumlists_selected = 'album_list_love'
    console.log('selected_value_for_albumlistall：'+'album_list_love');
    breadcrumbItems.value = store_view_album_page_logic.page_albumlists_options.find(option => option.value === 'album_list_love')?.label || '';
  }

  ////// dynamicScroller of albumlist_view
  const dynamicScroller = ref(null as any);
  const onResize = () => {
    console.log('resize');
  }
  const updateParts = { viewStartIdx: 0, viewEndIdx: 0, visibleStartIdx: 0, visibleEndIdx: 0 } // 输出渲染范围updateParts
  const onUpdate = (viewStartIndex: any, viewEndIndex: any, visibleStartIndex: any, visibleEndIndex: any) => {
    updateParts.viewStartIdx = viewStartIndex
    updateParts.viewEndIdx = viewEndIndex
    updateParts.visibleStartIdx = visibleStartIndex
    updateParts.visibleEndIdx = visibleEndIndex
    store_router_history_data_of_album.router_history_model_of_Album_scroller_value = viewEndIndex
  }
  const stopWatching_router_history_model_of_Album_scroll = watch(() => store_router_history_data_of_album.router_history_model_of_Album_scroll,(newValue) => {
      if (newValue === true) {
        scrollTo(store_router_history_data_of_album.router_history_model_of_Album_scroller_value)
        store_router_history_data_of_album.router_history_model_of_Album_scroll = false
      }
    }
  )
  const scrollTo = (value :number) => {
    if (dynamicScroller !== null) {
      setTimeout(() => {
        const index = value - (20 + Math.floor((window.innerHeight - 765) / 220));
        dynamicScroller.value.scrollToItem(index);// 220
      }, 100);
    }
  }
  onMounted(() => {
    scrollTo(store_router_history_data_of_album.router_history_model_of_Album_scroller_value)
  });

  ////// select Dtatsource of albumlists
  const breadcrumbItems = ref('所有专辑');
  const page_albumlists_handleSelected_updateValue = (value: any) => {
    store_view_album_page_logic.page_albumlists_selected = value
    console.log('selected_value_for_albumlistall：'+value);
    breadcrumbItems.value = store_view_album_page_logic.page_albumlists_options.find(option => option.value === value)?.label || '';
  };

  ////// router history 
  const get_router_history_model_pervious = () => {
    store_view_album_page_logic.page_albumlists_keyword = ''
    store_router_history_data_of_album.get_router_history_model_of_Album(-1)
  }
  const get_router_history_model_next = () =>  {
    store_view_album_page_logic.page_albumlists_keyword = ''
    store_router_history_data_of_album.get_router_history_model_of_Album(1)
  }

  ////// go to media_view
  const handleItemClick_album = (album:string) => {
    input_search_Value.value = album
    bool_show_search_area.value = false
    show_search_area()
    click_search()
    scrollTo(0)
  }
  const handleItemClick_artist = (artist_id:string) => {
    input_search_Value.value = artist_id+'accurate_search'+'__artist__'
    bool_show_search_area.value = false
    show_search_area()
    click_search()
    scrollTo(0)
  }
  const handleItemClick_album_timelist = (created_at:string) => {
    input_search_Value.value = created_at+'accurate_search'+'__title__'
    bool_show_search_area.value = false
    show_search_area()
    click_search()
    scrollTo(0)
  }
  const Open_this_album_SongList_click = (album_id:string) => {
    console.log('media_list_of_album_id：'+album_id);
    store_router_data_logic.get_media_list_of_album_id_by_album_info(album_id)
  }
  const Play_this_album_SongList_click = (album_id:string) => {
    console.log('play_this_album_click：'+album_id);
    store_view_album_page_fetchData.fetchData_This_Album_SongList(album_id)
  }

  ////// changed_data write to sqlite
  import {Set_AlbumInfo_To_LocalSqlite} from '@/features/sqlite3_local_configs/class_Set_AlbumInfo_To_LocalSqlite'
  import {
    store_local_data_set_albumInfo
  } from "@/store/local/local_data_synchronization/store_local_data_set_albumInfo";
  const handleItemClick_Favorite = (id: any,favorite: Boolean) => {
    store_local_data_set_albumInfo.Set_AlbumInfo_To_Favorite(id,favorite)
  }
  const handleItemClick_Rating = (id_rating: any) => {
    const [id, rating] = id_rating.split('-');
    if(rating === '6') {
      store_local_data_set_albumInfo.Set_AlbumInfo_To_Rating(id, 0);
    }else
      store_local_data_set_albumInfo.Set_AlbumInfo_To_Rating(id, rating);
  }

  ////// view albumlist_view Remove data
  onBeforeUnmount(() => {
    stopWatching_collapsed_width()
    stopWatching_window_innerWidth()
    stopWatching_router_history_model_of_Album_scroll()
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
    dynamicScroller.value = null;
  });
</script>
<template>
  <n-space vertical :size="12">
    <n-space>
      <n-button quaternary circle size="medium" style="margin-left:4px" @click="get_router_history_model_pervious">
        <template #icon>
          <n-icon :size="20"><ChevronLeft16Filled/></n-icon>
        </template>
      </n-button>
      <div style="margin-top: 4px;">
        {{ store_router_history_data_of_album.router_select_history_date_of_Album?.id ?? '' }} / {{ store_router_history_data_of_album.router_history_datas_of_Album?.length ?? '' }}
      </div>
      <n-button quaternary circle size="medium" style="margin-left:4px" @click="get_router_history_model_next">
        <template #icon>
          <n-icon :size="20"><ChevronRight16Filled/></n-icon>
        </template>
      </n-button>

      <n-button quaternary circle size="medium" style="margin-left:4px" @click="show_search_area">
        <template #icon>
          <n-icon :size="20"><Search20Filled/></n-icon>
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
            <n-icon :size="20"><ArrowSort24Regular/></n-icon>
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
    </n-space>
    <div class="album-wall-container">
      <DynamicScroller
        class="album-wall" ref="dynamicScroller" :style="{ width: 'calc(100vw - ' + (collapsed_width - 40) + 'px)'}"
        :items="store_view_album_page_info.album_Files_temporary"
        :itemSize="itemSize"
        :minItemSize="itemSize"
        :grid-items="gridItems"
        :item-secondary-size="itemSecondarySize"
        :emit-update="true"
        @resize="onResize"
        @update="onUpdate">
        <template #before>
          <div class="notice">
            <div
              :style="{ width: 'calc(100vw - ' + (collapsed_width - 20) + 'px)'}"
              style="
                position: absolute;
                z-index: 0;
                height: 298px;
                border-radius: 10px;
                overflow: hidden;
                background-size: cover;
                background-position: center;
                filter: blur(0px);
                background-color: transparent;
              ">
              <img 
                :style="{ 
                  width: 'calc(100vw - ' + (collapsed_width + 180) + 'px)',
                  height: 'calc(100vw - ' + (collapsed_width + 180) + 'px)',
                  WebkitMaskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)'
                }"
                style="
                  margin-left: 200px; margin-top: -300px;
                  object-fit: cover;object-position: center;
                "
                :src="getAssetImage(store_player_audio_info.page_top_album_image_url)"
                @error="handleImageError"
              />
            </div>
            <n-page-header 
              style="
                position: relative;
                z-index: 1;
                width: calc(100vw - 220px);height: 300px;
                border-radius: 10px;
                margin-left: 10px;
                margin-bottom: 10px;">
              <n-grid 
                :cols="2" :x-gap="0" :y-gap="10" layout-shift-disabled
                style="margin-left: 14px;width: 370px;">
                <n-gi v-for="albumlist in store_view_album_page_logic.page_albumlists_statistic" :key="albumlist.id">
                  <n-statistic :label="albumlist.label" :value="albumlist.album_count" />
                </n-gi>
              </n-grid>
              <template #title>
                <n-space vertical style="margin-top:14px;margin-left: 10px;">
                  <n-breadcrumb separator="|">
                      <n-breadcrumb-item style="font-size: 22px">{{ $t('entity.album_other') }}</n-breadcrumb-item>
                      <n-breadcrumb-item>
                        <n-button text @click="handleItemClick_album(store_player_audio_info.page_top_album_id)">
                          <n-ellipsis
                              style="text-align: left;font-size: 22px;">
                            {{ store_player_audio_info.page_top_album_name }}
                          </n-ellipsis>
                        </n-button>
                      </n-breadcrumb-item>
                  </n-breadcrumb>
                  <n-select 
                    :value="store_view_album_page_logic.page_albumlists_selected" 
                    :options="store_view_album_page_logic.page_albumlists_options" style="width: 166px;"
                    :on-update:value="page_albumlists_handleSelected_updateValue" />
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
                  :src="getAssetImage(store_player_audio_info.page_top_album_image_url)"
                  fallback-src="../../../resources/img/error_album.jpg"
                  :show-toolbar="false"
                />
              </template>
              <template #extra>

              </template>
              <template #footer>

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
              class="album">
              <div
                :style="{ width: item_album_image + 'px', height: item_album_image + 'px', position: 'relative' }">
                <img
                  :src="item.medium_image_url"
                  @error="handleImageError"
                  style="objectFit: cover; objectPosition: center;border: 1.5px solid #FFFFFF20;"
                  :style="{ width: item_album_image + 'px', height: item_album_image + 'px', borderRadius: '6px' }"/>
                <div class="hover-overlay">
                  <div class="hover-content">
                    <button
                      class="play_this_album"
                      @click="Play_this_album_SongList_click(item.id)"
                      style="
                        border: 0px;background-color: transparent;
                        width: 50px;height: 50px;
                        cursor: pointer;
                      "
                    >
                      <icon :size="42" color="#FFFFFF" style="margin-left: -2px;margin-top: 3px;"><PlayCircle24Regular/></icon>
                    </button>
                    <div class="hover_buttons_top">
                      <rate
                        class="viaSlot"
                        :length="6"
                        v-model="item.rating"
                        @after-rate="(value) => { handleItemClick_Rating(item.id + '-' + value); if (item.rating == 6) { item.rating = 0; } }"
                        style="margin-right: 8px;"
                      />
                    </div>
                    <div class="hover_buttons_bottom">
                      <button
                        class="open_this_artist"
                        @click="Open_this_album_SongList_click(item.id)"
                        style="
                          border: 0px;background-color: transparent;
                          width: 28px;height: 28px;
                          cursor: pointer;
                        "
                      >
                        <icon :size="20" color="#FFFFFF" style="margin-left: -2px;margin-top: 3px;"><Open28Filled/></icon>
                      </button>
                      <button
                        class="love_this_album"
                        @click="handleItemClick_Favorite(item.id,item.favorite);item.favorite = !item.favorite;"
                        style="
                          border: 0px;background-color: transparent;
                          width: 28px;height: 28px;
                          cursor: pointer;
                        "
                      >
                        <icon v-if="item.favorite" :size="20" color="red" style="margin-left: -2px;margin-top: 3px;"><Heart28Filled/></icon>
                        <icon v-else :size="20" color="#FFFFFF" style="margin-left: -2px;margin-top: 3px;"><Heart24Regular/></icon>
                      </button>
                      <button
                        class="more_this_album"
                        @click="Open_this_album_SongList_click(item.id)"
                        style="
                          border: 0px;background-color: transparent;
                          width: 28px;height: 28px;
                          cursor: pointer;
                        "
                      >
                        <icon :size="20" color="#FFFFFF" style="margin-left: -2px;margin-top: 3px;"><MoreCircle32Regular/></icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="album_text" :style="{ width: item_album_image + 'px' }">
                <div class="album_left_text_album_info" :style="{ width: item_album_txt + 'px' }">
                  <div>
                    <span id="album_name" 
                      :style="{ maxWidth: item_album_txt + 'px' }" 
                      @click="handleItemClick_album(item.name)">
                      {{ item.name }}
                    </span> 
                  </div>
                  <div>
                    <span id="album_singer_name" 
                      :style="{ maxWidth: item_album_txt + 'px' }" 
                      @click="handleItemClick_artist(item.artist_id)">
                      {{ item.artist }}
                    </span>
                  </div>
                  <div v-if="false">
                    <span id="album_time" 
                      :style="{ maxWidth: item_album_txt + 'px' }"
                      @click="handleItemClick_album_timelist(item.created_at)">
                      {{ item.created_time }}
                    </span> 
                  </div>
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
.album-wall-container {
  width: 100%;
  height: 100%;
}
.album-wall {
  overflow-y: auto;
  width: calc(100vw - 200px);
  height: calc(100vh - 194px);
  display: flex;
  flex-direction: column;
  overflow-x:hidden;
}
.album {
  float: left;
  flex-direction: column;
  align-items: left;
}
.album .hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  background: #00000090;
  opacity: 0;
  transition: opacity 0.3s;
}
.album:hover .hover-overlay {
  opacity: 1;
}
.album .hover-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.album .hover_buttons_top {
  position: absolute;
  top: 2px;
  left: 0;
}
.album .hover_buttons_bottom {
  position: absolute;
  bottom: 3px;
  right: 3px;
}

.album_left_text_album_info{
  float: left;
  text-align: left;
}
#album_name{
  margin-top: 2px;
  font-size: 15px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; 
  overflow: hidden;
  text-overflow: ellipsis;
}
#album_name:hover {
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}
#album_singer_name{
  font-size: 12px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; 
  overflow: hidden;
  text-overflow: ellipsis;
}
#album_singer_name:hover{
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}
#album_time{
  font-size: 12px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; 
  overflow: hidden;
  text-overflow: ellipsis;
}
#album_time:hover{
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}

.play_this_album:hover{
  color: #3DC3FF;
}
.open_this_artist:hover{
  color: #3DC3FF;
}
.love_this_album:hover{
  color: #3DC3FF;
}
.more_this_album:hover{
  color: #3DC3FF;
}

.RateCustom.viaSlot .icon {
  width: 15px;
  height: 25px;
  margin: 0px;
}
.Rate.viaSlot .Rate__star {
  width: 25px;
  height: 25px;
}
.Rate.viaSlot .Rate__star:nth-child(8).filled{color: red;}
.Rate.viaSlot .Rate__star:nth-child(8).hover{color: red;}

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
</style>