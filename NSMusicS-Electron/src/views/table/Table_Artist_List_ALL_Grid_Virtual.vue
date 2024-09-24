<script setup lang="ts">
  ////// this_view resource of vicons_svg
  import {
    MoreCircle32Regular
  } from '@vicons/fluent'
  import {
    ArrowSort24Regular,TextSortAscending20Regular,TextSortDescending20Regular,
    Search20Filled,
    PlayCircle24Regular,
    Heart24Regular,Heart28Filled,
    ChevronLeft16Filled,ChevronRight16Filled,Open28Filled,
    Filter20Filled,
  } from '@vicons/fluent'

  ////// this_view components of navie ui 
  import { computed, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { type InputInst, NIcon } from 'naive-ui';
  import {Icon} from "@vicons/utils";
  import {store_app_configs_info} from "@/store/app/store_app_configs_info";
  import {store_player_audio_info} from "@/store/player/store_player_audio_info";
  import {store_view_artist_page_info} from "@/store/view/artist/store_view_artist_page_info";
  import {store_view_artist_page_logic} from "@/store/view/artist/store_view_artist_page_logic";
  import {store_view_album_page_logic} from "@/store/view/album/store_view_album_page_logic";
  import {store_router_data_logic} from "@/store/router/store_router_data_logic";
  import {store_router_history_data_of_artist} from "@/store/router/store_router_history_data_of_artist";
  import {store_router_history_data_of_album} from "@/store/router/store_router_history_data_of_album";
  import {store_view_artist_page_fetchData} from "@/store/view/artist/store_view_artist_page_fetchData";

  ////// i18n auto lang
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n({
    inheritLocale: true
  })

  ////// artistlist_view page_layout gridItems
  const item_artist = ref<number>(170)
  const item_artist_image = ref<number>(item_artist.value - 20)
  const item_artist_txt = ref<number>(item_artist.value - 20)
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
      item_artist.value = 140;
      item_artist_image.value = item_artist.value - 20;
      item_artist_txt.value = item_artist.value - 20;
      itemSecondarySize.value = 135;
    } else {
      collapsed_width.value = 240;
      item_artist.value = 170;
      item_artist_image.value = item_artist.value - 20;
      item_artist_txt.value = item_artist.value - 20;
      itemSecondarySize.value = 164;
    }
    gridItems.value = Math.floor(window.innerWidth / itemSecondarySize.value) - 1;
  };
  onMounted(() => {
    startTimer();
    updateGridItems();

    input_search_Value.value = store_view_artist_page_logic.page_artistlists_keyword
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
    {label:computed(() => t('entity.artist_other')), key: 'name', state_Sort: state_Sort.Default },
    {label:computed(() => t('entity.album_other')), key: 'album_count', state_Sort: state_Sort.Default },
    {label:computed(() => t('filter.songCount')), key: 'song_count', state_Sort: state_Sort.Default },
    // {label:'更新时间(外部信息)', key: 'external_info_updated_at', state_Sort: state_Sort.Default }
  ]);
  const options_Sort = computed(() => {
    if(store_view_artist_page_logic.page_artistlists_options_Sort_key != null && store_view_artist_page_logic.page_artistlists_options_Sort_key.length > 0){
      options_Sort_key.value.forEach(element => {
        if(element.key === store_view_artist_page_logic.page_artistlists_options_Sort_key[0].columnKey)
          if(store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order === state_Sort.Ascend)
            element.state_Sort = state_Sort.Ascend
          else if(store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order === state_Sort.Descend)
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
    store_view_artist_page_logic.page_artistlists_options_Sort_key = sortersArray

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
        // store_view_artist_page_logic.list_data_StartUpdate = true
        back_search_default()
        bool_input_search = false
        scrollTo(0)
      }
      input_search_InstRef.value?.clear()
      store_view_artist_page_logic.page_artistlists_keyword = ""
      click_search()
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
      store_view_artist_page_logic.page_artistlists_keyword = page_artistlists_keyword;
      bool_input_search = true
      options_Sort_key.value.forEach(element => {
        element.state_Sort = state_Sort.Default
      });
    }else{
      store_view_artist_page_logic.list_data_StartUpdate = true
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
            store_view_artist_page_logic.page_artistlists_options_Sort_key = null
          } else {
            const sorter = { columnKey: options_Sort_key.value[i].key, order: options_Sort_key.value[i].state_Sort };
            sortersArray.push(sorter);
            store_view_artist_page_logic.page_artistlists_options_Sort_key = sortersArray
          }
          break;
        }
      }
    }
  }
  // lineItems Filter To Favorite
  const options_Filter = ref([
    {
      label: t('nsmusics.view_page.loveArtist'),
      key: 'filter_favorite',
      icon() {
        return h(NIcon, null, {
          default: () => h(Heart28Filled)
        });
      }
    }
  ])
  const options_Filter_handleSelect = (key: string | number) => {
    store_view_artist_page_logic.page_artistlists_selected = 'artist_list_love'
    console.log('selected_value_for_artistlistall：'+'artist_list_love');
    breadcrumbItems.value = store_view_artist_page_info.page_artistlists_options.find(option => option.value === 'artist_list_love')?.label || '';
  }

  ////// dynamicScroller of artistlist_view
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
    
    store_router_history_data_of_artist.router_history_model_of_Artist_scroller_value = viewEndIndex
  }
  const stopWatching_router_history_model_of_Artist_scroll = watch(() => store_router_history_data_of_artist.router_history_model_of_Artist_scroll,(newValue) => {
      if (newValue === true) {
        scrollTo(store_router_history_data_of_artist.router_history_model_of_Artist_scroller_value)
        store_router_history_data_of_artist.router_history_model_of_Artist_scroll = false
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
    if (store_server_user_model.model_server_type_of_local) {
      scrollTo(store_router_history_data_of_artist.router_history_model_of_Artist_scroller_value)
    }else if (store_server_user_model.model_server_type_of_web) {

    }
  });

  ////// select Dtatsource of artistlists
  const breadcrumbItems = ref('所有歌手');
  const page_artistlists_handleselected_updatevalue = (value: any) => {
    store_view_artist_page_logic.page_artistlists_selected = value
    console.log('selected_value_for_artistlistall：'+value);
    breadcrumbItems.value = store_view_artist_page_info.page_artistlists_options.find(option => option.value === value)?.label || '';
  };

  ////// router history 
  const get_router_history_model_pervious = () => {
    store_router_history_data_of_artist.get_router_history_model_of_Artist(-1)
  }
  const get_router_history_model_next = () =>  {
    store_router_history_data_of_artist.get_router_history_model_of_Artist(1)
  }

  ////// go to media_view
  const Open_this_artist_all_artist_list_click = (artist_id:string) => {
    if(store_server_user_model.model_server_type_of_web){
      store_view_media_page_fetchData._artist_id = artist_id
      store_view_album_page_fetchData._artist_id = artist_id
    }
    console.log('artist_list_of_artist_id_artist_click：'+artist_id);
    store_router_data_logic.get_album_list_of_artist_id_by_artist_info(artist_id)
  }
  const Play_this_artist_all_media_list_click = async (artist_id: string) => {
    if(store_server_user_model.model_server_type_of_web){
      store_view_media_page_fetchData._artist_id = artist_id
      store_view_album_page_fetchData._artist_id = artist_id
    }
    console.log('play_this_artist_song_list：' + artist_id);
    await store_view_artist_page_fetchData.fetchData_This_Artist_SongList(artist_id)
  }

  ////// changed_data write to sqlite
  import {Set_ArtistInfo_To_LocalSqlite} from '@/features/sqlite3_local_configs/class_Set_ArtistInfo_To_LocalSqlite'
  import {
    store_local_data_set_artistInfo
  } from "@/store/local/local_data_synchronization/store_local_data_set_artistInfo";
  import {store_playlist_list_info} from "@/store/view/playlist/store_playlist_list_info";
  import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";
  import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
  const handleItemClick_Favorite = (id: any,favorite: Boolean) => {
    store_local_data_set_artistInfo.Set_ArtistInfo_To_Favorite(id,favorite)
  }
  let before_rating = false
  let after_rating = false;
  const handleItemClick_Rating = (id_rating: any) => {
    const [id, rating] = id_rating.split('-');
    if(after_rating) {
      store_local_data_set_artistInfo.Set_ArtistInfo_To_Rating(id, 0);
    }else {
      store_local_data_set_artistInfo.Set_ArtistInfo_To_Rating(id, rating);
    }
  }

  ////// right menu
  import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
  import {useMessage} from 'naive-ui'
  import {store_view_media_page_fetchData} from "@/store/view/media/store_view_media_page_fetchData";
  import {
    store_local_data_set_mediaInfo
  } from "@/store/local/local_data_synchronization/store_local_data_set_mediaInfo";
  import {store_playlist_list_logic} from "@/store/view/playlist/store_playlist_list_logic";
  import {store_server_user_model} from "@/store/server/store_server_user_model";
  import {store_router_data_info} from "@/store/router/store_router_data_info";
  import {store_view_album_page_fetchData} from "@/store/view/album/store_view_album_page_fetchData";
  const contextmenu = ref(null as any)
  const menu_item_add_to_songlist = computed(() => t('form.addToPlaylist.title'));
  const message = useMessage()
  async function update_playlist_addArtist(id: any, playlist_id: any){
    try{
      await store_view_media_page_fetchData.fetchData_Media_Find_This_Artist(id)
      const matchingIds: string[] = [];
      store_view_media_page_info.media_Files_temporary.forEach((item: Media_File) => {
        if (item.artist_id === id) {
          matchingIds.push(item.id);
        }
      });
      store_view_media_page_info.media_Files_temporary = []
      for (let item_id of matchingIds) {
        ////
        await store_local_data_set_mediaInfo.Set_MediaInfo_Add_Selected_Playlist(item_id,playlist_id)
      }
      ////
      message.success(t('common.add'))
      store_playlist_list_logic.get_playlist_tracks_temporary_update_media_file(true)
    }catch (e) {
      console.error(e)
    }
  }
  async function menu_item_add_to_playlist_end() {
    await store_view_media_page_fetchData.fetchData_Media_Find_This_Artist(store_playlist_list_info.playlist_Menu_Item_Id);
    const matchingItems = store_view_media_page_info.media_Files_temporary.filter(
        (item: Media_File) => item.artist_id === store_playlist_list_info.playlist_Menu_Item_Id
    );

    store_view_media_page_info.media_Files_temporary = []

    for (let item of matchingItems) {
      const newItem: Media_File = JSON.parse(JSON.stringify(item));
      newItem.play_id = newItem.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000;
      store_playlist_list_info.playlist_MediaFiles_temporary.push(newItem);
      store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds.push(newItem.id);
    }

    store_playlist_list_info.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
      item.absoluteIndex = index;
    });
    store_app_configs_logic_save.save_system_playlist_item_id_config();
    contextmenu.value.hide()
  }
  async function menu_item_add_to_playlist_next() {
    await store_view_media_page_fetchData.fetchData_Media_Find_This_Artist(store_playlist_list_info.playlist_Menu_Item_Id);
    const matchingItems = store_view_media_page_info.media_Files_temporary.filter(
        (item: Media_File) => item.artist_id === store_playlist_list_info.playlist_Menu_Item_Id
    );

    store_view_media_page_info.media_Files_temporary = [];

    const index = store_playlist_list_info.playlist_MediaFiles_temporary.findIndex(
        (item: any) => item.id === store_player_audio_info.this_audio_song_id
    );

    if (index !== -1) {
      matchingItems.forEach((item: Media_File, i: number) => {
        const newItem = JSON.parse(JSON.stringify(item));
        newItem.play_id = newItem.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000;
        store_playlist_list_info.playlist_MediaFiles_temporary.splice(index + 1 + i, 0, newItem);
        store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds.splice(index + 1 + i, 0, newItem.id);
      });

      store_playlist_list_info.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
        item.absoluteIndex = index;
      });
      store_app_configs_logic_save.save_system_playlist_item_id_config();
      contextmenu.value.hide();
    } else {
      console.error('Current audio song not found in playlist');
    }
  }

  //////
  const isScrolling = ref(false);
  const onScrollEnd = async () => {
    if (isScrolling.value) return;
    isScrolling.value = true;
    if (store_server_user_model.model_server_type_of_web) {
      await store_view_artist_page_fetchData.fetchData_Artist_of_server_web_end()
    }
    isScrolling.value = false;
  };

  ////// view artistlist_view Remove data
  onBeforeUnmount(() => {
    stopWatching_collapsed_width()
    stopWatching_window_innerWidth()
    stopWatching_router_history_model_of_Artist_scroll()
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
      <n-space v-if="store_router_data_info.store_router_history_data_of_local">
        <n-button quaternary circle size="medium" style="margin-left:2px" @click="get_router_history_model_pervious">
          <template #icon>
            <n-icon :size="20"><ChevronLeft16Filled/></n-icon>
          </template>
        </n-button>
        <div style="margin-top: 4px;">
          {{ store_router_history_data_of_artist.router_select_history_date_of_Artist?.id ?? '' }} / {{ store_router_history_data_of_artist.router_history_datas_of_Artist?.length ?? '' }}
        </div>
        <n-button quaternary circle size="medium" style="margin-left:4px" @click="get_router_history_model_next">
          <template #icon>
            <n-icon :size="20"><ChevronRight16Filled/></n-icon>
          </template>
        </n-button>
      </n-space>

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

    <div class="artist-wall-container">
      <DynamicScroller
        class="artist-wall" ref="dynamicScroller" :style="{ width: 'calc(100vw - ' + (collapsed_width - 40) + 'px)'}"
        :items="store_view_artist_page_info.artist_Files_temporary"
        :itemSize="itemSize"
        :minItemSize="itemSize"
        :grid-items="gridItems"
        :item-secondary-size="itemSecondarySize"
        :emit-update="true"
        @resize="onResize"
        @update="onUpdate"
        @scroll-end="onScrollEnd"
      >
        <template #before>
          <div class="notice">
            <div
              :style="{ width: 'calc(100vw - ' + (collapsed_width - 17) + 'px)'}"
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
                style="margin-left: 4px;width: 370px;">
                <n-gi v-for="artistlist in store_view_artist_page_info.page_artistlists_statistic" :key="artistlist.id">
                  <n-statistic :label="artistlist.label" :value="artistlist.artist_count" />
                </n-gi>
              </n-grid>
              <template #title>
                <n-space vertical style="margin-top:14px;margin-left: 10px;">
                  <n-breadcrumb separator="|">
                      <n-breadcrumb-item style="font-size: 22px">{{ $t('entity.artist_other') }}</n-breadcrumb-item>
                      <n-breadcrumb-item>
                        <n-button text>
                          <n-ellipsis
                              style="text-align: left;font-size: 22px;max-width: 660px;height: 26px;">
                            {{ store_player_audio_info.page_top_album_name }}
                          </n-ellipsis>
                        </n-button>
                      </n-breadcrumb-item>
                  </n-breadcrumb>
                  <n-select 
                    :value="store_view_artist_page_logic.page_artistlists_selected" 
                    :options="store_view_artist_page_info.page_artistlists_options" style="width: 166px;"
                    @update:value="page_artistlists_handleselected_updatevalue" />
                </n-space>
              </template>
              <template #header>
                
              </template>
              <template #avatar>
                <n-image
                  width="80px" height="80px" object-fit="contain"
                  style="
                    border-radius: 6px;border: 1.5px solid #FFFFFF20;
                    margin-left: 0px;margin-top: 20px;"
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
            :data-active="active"
            v-contextmenu:contextmenu
            @contextmenu.prevent="store_playlist_list_info.playlist_Menu_Item_Id = item.id"
          >
            <div
              :key="item.id"
              class="artist">
              <div
                :style="{ width: item_artist_image + 'px', height: item_artist_image + 'px', position: 'relative' }">
                <img
                  :src="item.medium_image_url"
                  @error="handleImageError"
                  style="objectFit: cover; objectPosition: center;border: 1.5px solid #FFFFFF20;"
                  :style="{ width: item_artist_image + 'px', height: item_artist_image + 'px', borderRadius: '6px' }"/>
                <div class="hover-overlay">
                  <div class="hover-content">
                    <button
                        class="play_this_artist"
                        @click="Play_this_artist_all_media_list_click(item.id)"
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
                          class="viaSlot" style="margin-right: 8px;"
                          :length="5"
                          v-model="item.rating"
                          @before-rate="(value) => { if(item.rating == 1) { before_rating = true; }}"
                          @after-rate="(value) => {
                          if(item.rating == 1 && before_rating == true){ after_rating = true;before_rating = false}
                          handleItemClick_Rating(item.id + '-' + value);
                          if (after_rating) {
                            item.rating = 0
                            after_rating = false
                          }
                        }"
                      />
                    </div>
                    <div class="hover_buttons_bottom">
                      <button
                          class="open_this_artist"
                          @click="Open_this_artist_all_artist_list_click(item.id)"
                          style="
                          border: 0px;background-color: transparent;
                          width: 28px;height: 28px;
                          cursor: pointer;
                        "
                      >
                        <icon :size="20" color="#FFFFFF" style="margin-left: -2px;margin-top: 3px;"><Open28Filled/></icon>
                      </button>
                      <button
                          class="love_this_artist"
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
                    </div>
                  </div>
                </div>
              </div>
              <div class="artist_text" :style="{ width: item_artist_image + 'px' }">
                <div class="artist_left_text_artist_info" :style="{ width: item_artist_txt + 'px' }">
                  <div>
                    <span id="artist_name" :style="{ maxWidth: item_artist_txt + 'px' }">
                      {{ item.name }}
                    </span>
                  </div>
                  <div>
                    <span id="artist_singer_name" :style="{ maxWidth: item_artist_txt + 'px' }">
                       {{ $t('entity.album_other') + ': ' + item.album_count }}
                    </span>
                  </div>
                  <div>
                    <span id="artist_artist_name" :style="{ maxWidth: item_artist_txt + 'px' }">
                      {{ $t('entity.track_other') + ': ' + item.song_count }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
      <v-contextmenu ref="contextmenu" class="v-contextmenu-item v-contextmenu-item--hover" style="z-index: 999">
        <v-contextmenu-submenu :title="menu_item_add_to_songlist">
          <v-contextmenu-item
              v-for="n in store_playlist_list_info.playlist_names_ALLLists"
              :key="n.value"
              @click="update_playlist_addArtist(store_playlist_list_info.playlist_Menu_Item_Id,n.value)"
          >
            {{ n.label }}
          </v-contextmenu-item>
        </v-contextmenu-submenu>
        <v-contextmenu-divider />
        <v-contextmenu-item @click="menu_item_add_to_playlist_end">
          {{ $t('player.addLast') }}
        </v-contextmenu-item>
        <v-contextmenu-item @click="menu_item_add_to_playlist_next">
          {{ $t('player.addNext') }}
        </v-contextmenu-item>
      </v-contextmenu>
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
  height: calc(100vh - 194px);
  display: flex;
  flex-direction: column;
  overflow-x:hidden;
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
  background: #00000090;
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
.artist .hover_buttons_top {
  position: absolute;
  top: 2px;
  left: 0;
}
.artist .hover_buttons_bottom {
  position: absolute;
  bottom: 3px;
  right: 3px;
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
#artist_singer_name{
  font-size: 12px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; 
  overflow: hidden;
  text-overflow: ellipsis;
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

.play_this_artist:hover{
  color: #3DC3FF;
}
.open_this_artist:hover{
  color: #3DC3FF;
}
.love_this_artist:hover{
  color: #3DC3FF;
}
.more_this_artist:hover{
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

.v-contextmenu-item{
  margin-top: 5px;margin-bottom: 5px;
}
.v-contextmenu-item--hover{
  color: #3DC3FF;
  background-color: transparent;
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
</style>