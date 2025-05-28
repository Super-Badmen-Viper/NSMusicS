<script setup lang="ts">
////// this_view resource of vicons_svg
import {
  PlayCircle24Regular,
  Heart24Regular,Heart28Filled,
  ChevronLeft16Filled,ChevronRight16Filled,Open28Filled,
  ArrowReset24Filled
} from '@vicons/fluent'
import {
  Play,
  RefreshSharp,
} from '@vicons/ionicons5'

////// this_view views_components of navie ui
import {onBeforeUnmount, onMounted, ref, watch, computed } from 'vue'
import {NButton, NIcon, NImage} from 'naive-ui';
import {Icon} from "@vicons/utils";
import {store_app_configs_info} from "@/data/data_stores/app/store_app_configs_info";
import {store_view_home_page_logic} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_home/store/store_view_home_page_logic";
import {store_router_data_logic} from "@/router/router_store/store_router_data_logic";
import {store_general_fetch_album_list} from "@/data/data_stores/server/server_api_abstract/music_scene/page/page_album/store_general_fetch_album_list";

////// i18n auto lang
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true
})

////// passed as argument
import {store_view_home_page_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_home/store/store_view_home_page_info"
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {store_server_users} from "@/data/data_stores/server/store_server_users";

////// albumlist_view page_layout gridItems
const item_album = ref<number>(160)
const item_album_image = ref<number>(item_album.value - 20)
const item_album_txt = ref<number>(item_album.value - 20)
const itemSize = ref(180);
const collapsed_width = ref<number>(1090);
import error_album from '@/assets/img/error_album.jpg'
import {ipcRenderer, isElectron} from '@/utils/electron/isElectron';
const errorHandled = ref(new Map());
const handleImageError = async (item: any) => {
  if(item == undefined)
    return;
  let result_src = error_album
  if (errorHandled.value.has(item.id)) {
    item.medium_image_url = result_src;
    return;
  }
  errorHandled.value.set(item.id, true);
  ///
  if(isElectron) {
    const originalSrc = item.medium_image_url;
    try {
      const newImagePath = await ipcRenderer.invoke('window-get-imagePath', originalSrc);
      if (newImagePath.length > 0) {
        item.medium_image_url = newImagePath;
      } else {
        item.medium_image_url = result_src;
      }
    } catch (error) {
      console.error('Error handling image error:', error);
      item.medium_image_url = result_src;
    }
  } else {
    item.medium_image_url = error_album
  }
};
function getAssetImage(firstImage: string) {
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
const stopWatching_collapsed_width = watch(() => store_app_configs_info.app_view_left_menu_collapsed, (newValue, oldValue) => {
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
  collapsed_width.value = 145;
  if(window.innerWidth > 2460){
    const num = window.innerWidth / 7.53
    itemSize.value = Math.floor(num) + 40;
    item_album.value = Math.floor(num);
    item_album_image.value = item_album.value - 20;
    item_album_txt.value = item_album.value - 20;
  }else if(window.innerWidth > 1660){
    const num = window.innerWidth / 6.53
    itemSize.value = Math.floor(num) + 20;
    item_album.value = Math.floor(num);
    item_album_image.value = item_album.value - 20;
    item_album_txt.value = item_album.value - 20;
  }else{
    const num = window.innerWidth / 5.53
    itemSize.value = Math.floor(num) + 10;
    item_album.value = Math.floor(num);
    item_album_image.value = item_album.value - 20;
    item_album_txt.value = item_album.value - 20;
  }
};
onMounted(() => {
  startTimer();
  updateGridItems();
});

////// dynamicScroller of albumlist_view
import {store_general_fetch_home_list} from "@/data/data_stores/server/server_api_abstract/music_scene/page/page_home/store_general_fetch_home_list";
const dynamicScroller_maximum_playback = ref(null as any);
let offset_maximum_playback = 0;
const scrollTo_maximum_playback = (value :number) => {
  if (dynamicScroller_maximum_playback !== null) {
    if(value === -1){
      offset_maximum_playback - 220 * 2 > 0 ? offset_maximum_playback -= 220 * 2 : offset_maximum_playback = 0;
      dynamicScroller_maximum_playback.value.$el.scrollLeft = offset_maximum_playback;
    }else if(value === 1){
      if(offset_maximum_playback + 220 * 2 <= store_view_home_page_info.home_Files_temporary_maximum_playback.length * 224){
        offset_maximum_playback += 220 * 2
        dynamicScroller_maximum_playback.value.$el.scrollLeft = offset_maximum_playback
      }else{
        offset_maximum_playback = 0;
      }
    }
  }
}
const dynamicScroller_random_search = ref(null as any);
let offset_random_search = 0;
const scrollTo_random_search = (value :number) => {
  if (dynamicScroller_random_search !== null) {
    if(value === -1){
      offset_random_search - 220 * 2 > 0 ? offset_random_search -= 220 * 2 : offset_random_search = 0;
      dynamicScroller_random_search.value.$el.scrollLeft = offset_random_search;
    }else if(value === 1){
      if(offset_random_search + 220 * 2 <= store_view_home_page_info.home_Files_temporary_random_search.length * 224){
        offset_random_search += 220 * 2
        dynamicScroller_random_search.value.$el.scrollLeft = offset_random_search
      }else{
        offset_random_search = 0;
      }
    }
  }
}
const dynamicScroller_recently_added = ref(null as any);
let offset_recently_added = 0;
const scrollTo_recently_added = (value :number) => {
  if (dynamicScroller_recently_added !== null) {
    if(value === -1){
      offset_recently_added - 220 * 2 > 0 ? offset_recently_added -= 220 * 2 : offset_recently_added = 0;
      dynamicScroller_recently_added.value.$el.scrollLeft = offset_recently_added;
    }else if(value === 1){
      if(offset_recently_added + 220 * 2 <= store_view_home_page_info.home_Files_temporary_recently_added.length * 224){
        offset_recently_added += 220 * 2
        dynamicScroller_recently_added.value.$el.scrollLeft = offset_recently_added
      }else{
        offset_recently_added = 0;
      }
    }
  }
}
const dynamicScroller_recently_played = ref(null as any);
let offset_recently_played = 0;
const scrollTo_recently_played = (value :number) => {
  if (dynamicScroller_recently_played !== null) {
    if(value === -1){
      offset_recently_played - 220 * 2 > 0 ? offset_recently_played -= 220 * 2 : offset_recently_played = 0;
      dynamicScroller_recently_played.value.$el.scrollLeft = offset_recently_played;
    }else if(value === 1){
      if(offset_recently_played + 220 * 2 <= store_view_home_page_info.home_Files_temporary_recently_played.length * 224){
        offset_recently_played += 220 * 2
        dynamicScroller_recently_played.value.$el.scrollLeft = offset_recently_played
      }else{
        offset_recently_played = 0;
      }
    }
  }
}

////// go to media_view
const Open_this_album_MediaList_click = (item: any, list_name: string) => {
  if (store_server_user_model.model_server_type_of_web) {
    store_player_appearance.player_mode_of_medialist_from_external_import = false;
    if (store_server_users.server_select_kind === 'emby') {
      if (list_name != 'recently_added') {
        return;
      }
    }
  }
  const temp_id = Get_this_album_info(item, list_name);
  console.log('media_list_of_album_id：' + temp_id);
  store_router_data_logic.get_media_list_of_album_id_by_album_info(temp_id);
};
const Play_this_album_MediaList_click = async (item: any, list_name: string) => {
  const temp_id = Get_this_album_info(item, list_name);
  if (store_server_user_model.model_server_type_of_web) {
    store_general_fetch_media_list.set_album_id(item.id)
    store_view_media_page_logic.page_songlists_selected = 'song_list_all';
    store_server_user_model.random_play_model = false;
  }
  console.log('play_this_album_click：' + temp_id);
  await store_general_fetch_album_list.fetchData_This_Album_MediaList(temp_id);
  store_playlist_list_info.reset_carousel()
};
const Get_this_album_info = (item: any, list_name: string): string => {
  let temp_id = item.id;
  if (store_server_user_model.model_server_type_of_web) {
    if (store_server_users.server_select_kind === 'jellyfin') {
      // Jellyfin 使用 media_id
      store_general_fetch_media_list._media_id = item.id;
    } else if (store_server_users.server_select_kind === 'emby') {
      // Emby 根据列表类型设置 album_artist_id
      store_general_fetch_media_list.set_album_artist_id(
          list_name === 'recently_added' ? item.id : item.album_artist_id
      );
      if(list_name === 'recently_added'){
        store_general_fetch_player_list._album_artist_id = item.album_artist_id;
        temp_id = item.album_artist_id;
      }else{
        store_general_fetch_media_list._media_id = item.id;
        temp_id = item.id;
      }
    } else {
      // 其他服务器使用 album_id
      store_general_fetch_media_list._album_id = item.id;
    }
  }
  return temp_id;
};
const Play_Next_album_MediaList_click = (value: number) => {
  if(value === 1){
    if(store_view_home_page_info.home_selected_top_album_subscript >= 17){
      store_view_home_page_info.home_selected_top_album_subscript = 0;
      store_view_home_page_logic.list_data_StartUpdate = true
    }else{
      store_view_home_page_info.home_selected_top_album_subscript += 1;
    }
  }else{
    if(store_view_home_page_info.home_selected_top_album_subscript === 0){
      store_view_home_page_info.home_selected_top_album_subscript = 0;
      store_view_home_page_logic.list_data_StartUpdate = true
    }else{
      store_view_home_page_info.home_selected_top_album_subscript -= 1;
    }
  }
}
watch(() => store_view_home_page_info.home_selected_top_album_subscript, (newValue) => {
  store_view_home_page_info.home_selected_top_album =
      (store_view_home_page_info.home_Files_temporary_random_search && store_view_home_page_info.home_Files_temporary_random_search.length > 0)
          ? store_view_home_page_info.home_Files_temporary_random_search[newValue] : undefined;
});

////// changed_data write to sqlite
import {store_local_data_set_albumInfo} from "@/data/data_stores/local/local_data_synchronization/store_local_data_set_albumInfo";
const handleItemClick_Favorite = (id: any,favorite: Boolean) => {
  store_local_data_set_albumInfo.Set_AlbumInfo_To_Favorite(id,favorite)
}
let before_rating = false
let after_rating = false;
const handleItemClick_Rating = (id_rating: any) => {
  const [id, rating] = id_rating.split('-');
  if(after_rating) {
    store_local_data_set_albumInfo.Set_AlbumInfo_To_Rating(id, 0);
  }else {
    store_local_data_set_albumInfo.Set_AlbumInfo_To_Rating(id, rating);
  }
}

////// right menu
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";
import {useMessage} from 'naive-ui'
import {store_playlist_list_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_components/player_list/store/store_playlist_list_info";
import {store_general_fetch_media_list} from "@/data/data_stores/server/server_api_abstract/music_scene/page/page_media_file/store_general_fetch_media_list";
import {store_view_media_page_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_media/store/store_view_media_page_info";
import {store_local_data_set_mediaInfo} from "@/data/data_stores/local/local_data_synchronization/store_local_data_set_mediaInfo";
import {store_player_audio_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_audio_info";
import {store_player_appearance} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_appearance";
import {store_view_media_page_logic} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_media/store/store_view_media_page_logic";
import {store_general_fetch_player_list} from "@/data/data_stores/server/server_api_abstract/music_scene/components/player_list/store_general_fetch_player_list";
import {
  store_general_model_player_list
} from "@/data/data_stores/server/server_api_abstract/music_scene/components/player_list/store_general_model_player_list";
const contextmenu = ref(null as any)
const menu_item_add_to_songlist = computed(() => t('form.addToPlaylist.title'));
const message = useMessage()
const recently_added_contextmenu_of_emby = ref(false)
async function update_playlist_addAlbum(id: any, playlist_id: any){
  try{
    let result_album = false
    if((store_server_users.server_select_kind != 'jellyfin' &&store_server_users.server_select_kind != 'emby') || store_server_user_model.model_server_type_of_local
    ) {
      result_album = true;
    }else{
      if(store_server_users.server_select_kind === 'jellyfin'){
        result_album = false
      }else if(store_server_users.server_select_kind === 'emby'){
        result_album = recently_added_contextmenu_of_emby.value
      }
    }
    recently_added_contextmenu_of_emby.value = false
    if(result_album) {
      await store_general_fetch_media_list.fetchData_Media_Find_This_Album(id)
      const matchingIds: string[] = [];
      store_view_media_page_info.media_Files_temporary.forEach((item: Media_File) => {
        if (item.album_id === id) {
          matchingIds.push(item.id);
        }
      });
      store_view_media_page_info.media_Files_temporary = []
      for (let item_id of matchingIds) {
        ////
        await store_local_data_set_mediaInfo.Set_MediaInfo_Add_Selected_Playlist(
            item_id,
            playlist_id
        )
      }
    }else{
      await store_local_data_set_mediaInfo.Set_MediaInfo_Add_Selected_Playlist(
          id,
          playlist_id
      )
    }
    ////
    message.success(t('common.add'))
    store_general_model_player_list.get_playlist_tracks_temporary_update_media_file()
  }catch (e) {
    console.error(e)
  }
}
async function menu_item_add_to_playlist_end() {
  let result_album = false
  if((store_server_users.server_select_kind != 'jellyfin' &&store_server_users.server_select_kind != 'emby') || store_server_user_model.model_server_type_of_local
  ) {
    result_album = true;
  }else{
    if(store_server_users.server_select_kind === 'jellyfin'){
      result_album = false
    }else if(store_server_users.server_select_kind === 'emby'){
      result_album = recently_added_contextmenu_of_emby.value
    }
  }
  recently_added_contextmenu_of_emby.value = false
  let matchingItems = []
  if(result_album) {
    await store_general_fetch_media_list.fetchData_Media_Find_This_Album(
        store_playlist_list_info.playlist_Menu_Item_Id
    );
    matchingItems = store_view_media_page_info.media_Files_temporary.filter(
        (item: Media_File) => item.album_id === store_playlist_list_info.playlist_Menu_Item_Id
    );
  }else{
    store_general_fetch_media_list._media_id = store_playlist_list_info.playlist_Menu_Item_Id
    await store_general_fetch_media_list.fetchData_Media();
    matchingItems = store_view_media_page_info.media_Files_temporary.filter(
        (item: Media_File) => item.id === store_playlist_list_info.playlist_Menu_Item_Id
    );
  }
  ///
  store_view_media_page_info.media_Files_temporary = []
  for (let item of matchingItems) {
    const newItem: any = JSON.parse(JSON.stringify(item));
    newItem.play_id = newItem.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000;
    store_playlist_list_info.playlist_MediaFiles_temporary.push(newItem);
    store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds.push(newItem.id);
  }
  ///
  store_playlist_list_info.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
    item.absoluteIndex = index;
  });
  store_app_configs_logic_save.save_system_playlist_item_id_config();
  contextmenu.value.hide()
}
async function menu_item_add_to_playlist_next() {
  let result_album = false
  if((store_server_users.server_select_kind != 'jellyfin' &&store_server_users.server_select_kind != 'emby') || store_server_user_model.model_server_type_of_local
  ) {
    result_album = true;
  }else{
    if(store_server_users.server_select_kind === 'jellyfin'){
      result_album = false
    }else if(store_server_users.server_select_kind === 'emby'){
      result_album = recently_added_contextmenu_of_emby.value
    }
  }
  recently_added_contextmenu_of_emby.value = false
  let matchingItems = []
  if(result_album) {
    await store_general_fetch_media_list.fetchData_Media_Find_This_Album(store_playlist_list_info.playlist_Menu_Item_Id);
    matchingItems = store_view_media_page_info.media_Files_temporary.filter(
        (item: Media_File) => item.album_id === store_playlist_list_info.playlist_Menu_Item_Id
    );
  }else{
    store_general_fetch_media_list._media_id = store_playlist_list_info.playlist_Menu_Item_Id
    await store_general_fetch_media_list.fetchData_Media();
    matchingItems = store_view_media_page_info.media_Files_temporary.filter(
        (item: Media_File) => item.id === store_playlist_list_info.playlist_Menu_Item_Id
    );
  }
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
  } else {
    console.error('Current audio song not found in playlist');
  }
  store_playlist_list_info.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
    item.absoluteIndex = index;
  });
  store_app_configs_logic_save.save_system_playlist_item_id_config();
  contextmenu.value.hide();
}

////// view albumlist_view Remove data
onBeforeUnmount(() => {
  stopWatching_collapsed_width()
  stopWatching_window_innerWidth()
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
  dynamicScroller_maximum_playback.value = null
  dynamicScroller_random_search.value = null
  dynamicScroller_recently_added.value = null
  dynamicScroller_recently_played.value = null
});
</script>
<template>
  <div class="home-wall-container">
    <n-space vertical
             style="margin-top: 20px;margin-left: 8px;">
      <div
         v-contextmenu:contextmenu
         @contextmenu.prevent="() => {
           store_playlist_list_info.playlist_Menu_Item = store_view_home_page_info.home_selected_top_album;
           store_playlist_list_info.playlist_Menu_Item_Id =store_view_home_page_info.home_selected_top_album?.id
         }">
        <div
          :style="{
            width: 'calc(100vw - ' + (collapsed_width - 20) + 'px)',
          }"
          style="
            height: calc(41vh);
            border-radius: 7px;
            overflow: hidden;
            background-size: cover;
            background-position: center;
            background-color: transparent;
          "
          >
          <div style="filter: blur(0px);">
            <img
              :style="{
                width: 'calc(100vw - ' + (collapsed_width - 20) + 'px)',
                height: 'calc(100vw - ' + (collapsed_width - 20) + 'px)',
                WebkitMaskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)',
              }"
              style="
                position: absolute;transform: translateY(-25%);
                object-fit: cover;object-position: center;
                border: 1.5px solid #FFFFFF20;
              "
              :src="getAssetImage(store_view_home_page_info.home_selected_top_album_medium_image_url)"
              @error="handleImageError(store_view_home_page_info.home_selected_top_album)"
              alt=""/>
          </div>
        </div>
      </div>
      <n-space
        :style="{
        transform: `scale(${store_app_configs_info.window_innerHeight / 760})`,
        transformOrigin: 'left bottom',
        marginTop: `calc(-20vh - 50px)`,
        }"
        style="margin-left: calc(3.5vh);margin-top: -202px;">
        <img
          :src="getAssetImage(store_view_home_page_info.home_selected_top_album_medium_image_url)"
          @error="handleImageError(store_view_home_page_info.home_selected_top_album)"
          style="
            object-fit: cover; object-position: center;
            box-shadow: 0 0 32px rgba(0, 0, 0, 0.20), 0 0 32px rgba(0, 0, 0, 0.20);
            width: 170px;height: 170px;
            border-radius: 6px;border: 1.5px solid #FFFFFF20;" alt=""/>
        <n-space vertical
          style="margin-top: -2px;margin-left: 12px;"
          :style="{
            width: 'calc(' + (store_app_configs_info.window_innerWidth - (collapsed_width + 300)) / (store_app_configs_info.window_innerHeight / 500) + 'px)',
          }">
          <div style="font-size: 16px;font-weight: 600;">
            {{
              $t('page.home.explore') + ' : ' +
              (store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby'
                  ? $t('entity.track_other')
                  : $t('entity.album_other'))
            }}
          </div>
          <div
            style="
              margin-top: -3px;
              font-weight: 900;font-size: 44px;
              overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
          ">
            {{ store_view_home_page_info.home_selected_top_album?.name ?? ($t('None') + $t('Play') + $t('Data')) }}
          </div>
          <div
            style="
              margin-top: -2px;
              font-weight: 550;font-size: 18px;
              overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
          ">
            {{ store_view_home_page_info.home_selected_top_album?.artist ?? ($t('None') + $t('Play') + $t('Data')) }}
          </div>
          <n-space style="margin-top: 6px;">
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-button quaternary @click="Play_Next_album_MediaList_click(-1)" style="margin-right: -6px;">
                  <n-icon size="20" :depth="2">
                    <ChevronLeft16Filled />
                  </n-icon>
                </n-button>
              </template>
              {{ $t('player.previous') }}
            </n-tooltip>
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-button quaternary
                          @click="async ()=>{
                            await Play_this_album_MediaList_click(store_view_home_page_info.home_selected_top_album, 'random');
                          }"
                          style="margin-right: -6px;">
                  <template #icon>
                    <n-icon :size="20" :depth="2"><Play/></n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('Play') }}
            </n-tooltip>
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-button quaternary @click="Play_Next_album_MediaList_click(1)" style="margin-right: -6px;">
                  <n-icon size="20" :depth="2">
                    <ChevronRight16Filled />
                  </n-icon>
                </n-button>
              </template>
              {{ $t('player.next') }}
            </n-tooltip>
          </n-space>
        </n-space>
      </n-space>
    </n-space>

    <n-space vertical
             style="margin-left: 8px;">
      <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}">
        <n-space align="center">
          <span style="font-size: 16px;font-weight: 600;">
            {{
              $t('page.home.mostPlayed') + ' : ' +
              (store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby'
                  ? $t('entity.track_other')
                  : $t('entity.album_other'))
            }}
          </span>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary @click="()=>{
                store_general_fetch_home_list.fetchData_Home_of_maximum_playback();
                dynamicScroller_maximum_playback.$el.scrollLeft = 0;
                offset_maximum_playback = 0;
              }">
                <template #icon>
                  <n-icon :size="20"><ArrowReset24Filled/></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('common.refresh') }}
          </n-tooltip>
          <n-space v-if="store_view_home_page_info.home_Files_temporary_maximum_playback.length === 0" style="margin-top: 2px;">
            {{ $t('None') + $t('Play') + $t('Data') }}
          </n-space>
        </n-space>
        <n-space>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary
                        @click="scrollTo_maximum_playback(-1)"
                        >
                <n-icon size="20" :depth="2">
                  <ChevronLeft16Filled />
                </n-icon>
              </n-button>
            </template>
            {{ $t('common.backward') }}
          </n-tooltip>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary
                        @click="scrollTo_maximum_playback(1)"
                        >
                <n-icon size="20" :depth="2">
                  <ChevronRight16Filled />
                </n-icon>
              </n-button>
            </template>
            {{ $t('common.forward') }}
          </n-tooltip>
        </n-space>
      </n-space>
      <DynamicScroller
          class="home-wall" ref="dynamicScroller_maximum_playback"
          v-if="store_view_home_page_info.home_Files_temporary_maximum_playback.length != 0"
          :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)', height: item_album_image + 60 + 'px'}"
          :items="store_view_home_page_info.home_Files_temporary_maximum_playback"
          :itemSize="itemSize"
          :minItemSize="itemSize"
          :emit-update="true"
          direction="horizontal">
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
            :data-active="active"
            v-contextmenu:contextmenu
            @contextmenu.prevent="()=>{
              store_playlist_list_info.playlist_Menu_Item = item;
              store_playlist_list_info.playlist_Menu_Item_Id =item.id
            }"
          >
            <div
                :key="item.id"
                class="album">
              <div
                  :style="{ width: item_album_image + 'px', height: item_album_image + 'px', position: 'relative' }">
                <img
                    :src="item.medium_image_url"
                    @error="handleImageError(item)"
                    style="objectFit: cover; objectPosition: center;border: 1.5px solid #FFFFFF20;"
                    :style="{ width: item_album_image + 'px', height: item_album_image + 'px', borderRadius: '6px' }" alt=""/>
                <div class="hover-overlay"
                     @dblclick="Open_this_album_MediaList_click(item, 'maximum')">
                  <div class="hover-content">
                    <button
                        class="play_this_album"
                        @click="async ()=>{
                          await Play_this_album_MediaList_click(item, 'maximum');
                        }"
                        style="
                        border: 0;background-color: transparent;
                        width: 50px;height: 50px;
                        cursor: pointer;
                      "
                    >
                      <icon :size="42" color="#FFFFFF" style="margin-left: -2px;margin-top: 3px;"><PlayCircle24Regular/></icon>
                    </button>
                    <div class="hover_buttons_top"
                         v-if="(store_server_users.server_select_kind != 'jellyfin' &&store_server_users.server_select_kind != 'emby') || store_server_user_model.model_server_type_of_local
                               ">
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
                          v-if="store_server_user_model.model_server_type_of_local || (store_server_users.server_select_kind != 'jellyfin' && store_server_users.server_select_kind != 'emby')"
                          class="open_this_artist"
                          @click="Open_this_album_MediaList_click(item, 'maximum')"
                          style="
                          border: 0;background-color: transparent;
                          width: 28px;height: 28px;
                          cursor: pointer;
                        "
                      >
                        <icon :size="20" color="#FFFFFF" style="margin-left: -2px;margin-top: 3px;"><Open28Filled/></icon>
                      </button>
                      <button
                          class="love_this_album"
                          @click="()=>{
                            handleItemClick_Favorite(item.id, item.favorite);
                            item.favorite = !item.favorite;
                          }"
                          style="
                          border: 0;background-color: transparent;
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
              <div :style="{ width: item_album_image + 'px' }">
                <div class="album_left_text_album_info" :style="{ width: item_album_txt + 'px' }">
                  <div>
                    <span id="home_item_img_album_name" :style="{ maxWidth: item_album_txt + 'px' }" style="font-weight: 600;">
                      {{ item.name }}
                    </span>
                  </div>
                  <div>
                    <span id="home_item_img_artist_name" :style="{ maxWidth: item_album_txt + 'px' }">
                      {{ item.artist }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </n-space>

    <n-space vertical
             style="margin-left: 8px;">
      <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}">
        <n-space align="center">
          <span style="font-size: 16px;font-weight: 600;">
            {{
              $t('page.home.explore') + ' : ' +
              (store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby'
                  ? $t('entity.track_other')
                  : $t('entity.album_other'))
            }}
          </span>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary @click="()=>{
                store_general_fetch_home_list.fetchData_Home_of_random_search();
                dynamicScroller_random_search.$el.scrollLeft = 0;
                offset_random_search = 0;
              }">
                <template #icon>
                  <n-icon :size="20"><ArrowReset24Filled/></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('common.refresh') }}
          </n-tooltip>
          <n-space v-if="store_view_home_page_info.home_Files_temporary_random_search.length === 0" style="margin-top: 2px;">
            {{ $t('None') + $t('Play') + $t('Data') }}
          </n-space>
        </n-space>
        <n-space>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary
                        @click="scrollTo_random_search(-1)"
                        >
                <n-icon size="20" :depth="2">
                  <ChevronLeft16Filled />
                </n-icon>
              </n-button>
            </template>
            {{ $t('common.backward') }}
          </n-tooltip>
          <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <n-button quaternary
                      @click="scrollTo_random_search(1)"
                      >
              <n-icon size="20" :depth="2">
                <ChevronRight16Filled />
              </n-icon>
            </n-button>
          </template>
          {{ $t('common.forward') }}
        </n-tooltip>
        </n-space>
      </n-space>
      <DynamicScroller
        class="home-wall" ref="dynamicScroller_random_search"
        v-if="store_view_home_page_info.home_Files_temporary_random_search.length != 0"
        :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)', height: item_album_image + 60 + 'px'}"
        :items="store_view_home_page_info.home_Files_temporary_random_search"
        :itemSize="itemSize"
        :minItemSize="itemSize"
        :emit-update="true"
        direction="horizontal">
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
              :item="item"
              :active="active"
              :data-index="index"
              :data-active="active"
              v-contextmenu:contextmenu
              @contextmenu.prevent="()=>{
                store_playlist_list_info.playlist_Menu_Item = item;
                store_playlist_list_info.playlist_Menu_Item_Id =item.id
              }"
          >
            <div
                :key="item.id"
                class="album">
              <div
                  :style="{ width: item_album_image + 'px', height: item_album_image + 'px', position: 'relative' }">
                <img
                    :src="item.medium_image_url"
                    @error="handleImageError(item)"
                    style="objectFit: cover; objectPosition: center;border: 1.5px solid #FFFFFF20;"
                    :style="{ width: item_album_image + 'px', height: item_album_image + 'px', borderRadius: '6px' }" alt=""/>
                <div class="hover-overlay"
                     @dblclick="Open_this_album_MediaList_click(item, 'random')">
                  <div class="hover-content">
                    <button
                        class="play_this_album"
                        @click="async ()=>{
                          await Play_this_album_MediaList_click(item, 'random');
                        }"
                        style="
                      border: 0;background-color: transparent;
                      width: 50px;height: 50px;
                      cursor: pointer;
                    "
                    >
                      <icon :size="42" color="#FFFFFF" style="margin-left: -2px;margin-top: 3px;"><PlayCircle24Regular/></icon>
                    </button>
                    <div class="hover_buttons_top"
                         v-if="(store_server_users.server_select_kind != 'jellyfin' &&store_server_users.server_select_kind != 'emby') || store_server_user_model.model_server_type_of_local
                               ">
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
                          v-if="store_server_user_model.model_server_type_of_local || (store_server_users.server_select_kind != 'jellyfin' && store_server_users.server_select_kind != 'emby')"
                          class="open_this_artist"
                          @click="Open_this_album_MediaList_click(item, 'random')"
                          style="
                        border: 0;background-color: transparent;
                        width: 28px;height: 28px;
                        cursor: pointer;
                      "
                      >
                        <icon :size="20" color="#FFFFFF" style="margin-left: -2px;margin-top: 3px;"><Open28Filled/></icon>
                      </button>
                      <button
                        class="love_this_album"
                        @click="()=>{
                          handleItemClick_Favorite(item.id, item.favorite);
                          item.favorite = !item.favorite;
                        }"
                        style="
                          border: 0;background-color: transparent;
                          width: 28px;height: 28px;
                          cursor: pointer;
                        ">
                        <icon v-if="item.favorite" :size="20" color="red" style="margin-left: -2px;margin-top: 3px;"><Heart28Filled/></icon>
                        <icon v-else :size="20" color="#FFFFFF" style="margin-left: -2px;margin-top: 3px;"><Heart24Regular/></icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div :style="{ width: item_album_image + 'px' }">
                <div class="album_left_text_album_info" :style="{ width: item_album_txt + 'px' }">
                  <div>
                  <span id="home_item_img_album_name" :style="{ maxWidth: item_album_txt + 'px' }" style="font-weight: 600;">
                    {{ item.name }}
                  </span>
                  </div>
                  <div>
                  <span id="home_item_img_artist_name" :style="{ maxWidth: item_album_txt + 'px' }">
                    {{ item.artist }}
                  </span>
                  </div>
                </div>
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </n-space>

    <n-space vertical
             style="margin-left: 8px;">
      <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}">
        <n-space align="center">
          <span style="font-size: 16px;font-weight: 600;">
            {{
              $t('page.home.newlyAdded') + ' : ' +
              (store_server_users.server_select_kind === 'jellyfin'
                  ? $t('entity.track_other')
                  : $t('entity.album_other'))
            }}
          </span>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary @click="()=>{
                store_general_fetch_home_list.fetchData_Home_of_recently_added();
                dynamicScroller_recently_added.$el.scrollLeft = 0;
                offset_recently_added = 0;
              }">
                <template #icon>
                  <n-icon :size="20"><ArrowReset24Filled/></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('common.refresh') }}
          </n-tooltip>
          <n-space v-if="store_view_home_page_info.home_Files_temporary_recently_added.length === 0" style="margin-top: 2px;">
            {{ $t('None') + $t('Play') + $t('Data') }}
          </n-space>
        </n-space>
        <n-space>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary
                        @click="scrollTo_recently_added(-1)"
                        >
                <n-icon size="20" :depth="2">
                  <ChevronLeft16Filled />
                </n-icon>
              </n-button>
            </template>
            {{ $t('common.backward') }}
          </n-tooltip>
          <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <n-button quaternary
                      @click="scrollTo_recently_added(1)"
                      >
              <n-icon size="20" :depth="2">
                <ChevronRight16Filled />
              </n-icon>
            </n-button>
          </template>
          {{ $t('common.forward') }}
        </n-tooltip>
        </n-space>
      </n-space>
      <DynamicScroller
        class="home-wall" ref="dynamicScroller_recently_added"
        v-if="store_view_home_page_info.home_Files_temporary_recently_added.length != 0"
        :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)', height: item_album_image + 60 + 'px'}"
        :items="store_view_home_page_info.home_Files_temporary_recently_added"
        :itemSize="itemSize"
        :minItemSize="itemSize"
        :emit-update="true"
        direction="horizontal">
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
              :item="item"
              :active="active"
              :data-index="index"
              :data-active="active"
              v-contextmenu:contextmenu
              @contextmenu.prevent="()=>{
                store_playlist_list_info.playlist_Menu_Item = item;
                store_playlist_list_info.playlist_Menu_Item_Id =item.id
                recently_added_contextmenu_of_emby = true
              }">
            <div
                :key="item.id"
                class="album">
              <div
                  :style="{ width: item_album_image + 'px', height: item_album_image + 'px', position: 'relative' }">
                <img
                    :src="item.medium_image_url"
                    @error="handleImageError(item)"
                    style="objectFit: cover; objectPosition: center;border: 1.5px solid #FFFFFF20;"
                    :style="{ width: item_album_image + 'px', height: item_album_image + 'px', borderRadius: '6px' }" alt=""/>
                <div class="hover-overlay"
                     @dblclick="Open_this_album_MediaList_click(item, 'recently_added')">
                  <div class="hover-content">
                    <button
                        class="play_this_album"
                        @click="async ()=>{
                          await Play_this_album_MediaList_click(item, 'recently_added');
                        }"
                        style="
                        border: 0;background-color: transparent;
                        width: 50px;height: 50px;
                        cursor: pointer;
                      "
                    >
                      <icon :size="42" color="#FFFFFF" style="margin-left: -2px;margin-top: 3px;"><PlayCircle24Regular/></icon>
                    </button>
                    <div class="hover_buttons_top"
                         v-if="(store_server_users.server_select_kind != 'jellyfin' &&store_server_users.server_select_kind != 'emby') || store_server_user_model.model_server_type_of_local
                               ">
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
                          v-if="store_server_user_model.model_server_type_of_local || (store_server_users.server_select_kind != 'jellyfin')"
                          class="open_this_artist"
                          @click="Open_this_album_MediaList_click(item, 'recently_added')"
                          style="
                          border: 0;background-color: transparent;
                          width: 28px;height: 28px;
                          cursor: pointer;
                        "
                      >
                        <icon :size="20" color="#FFFFFF" style="margin-left: -2px;margin-top: 3px;"><Open28Filled/></icon>
                      </button>
                      <button
                        class="love_this_album"
                        @click="()=>{
                            handleItemClick_Favorite(item.id, item.favorite);
                            item.favorite = !item.favorite;
                          }"
                        style="
                          border: 0;background-color: transparent;
                          width: 28px;height: 28px;
                          cursor: pointer;
                        ">
                        <icon v-if="item.favorite" :size="20" color="red" style="margin-left: -2px;margin-top: 3px;"><Heart28Filled/></icon>
                        <icon v-else :size="20" color="#FFFFFF" style="margin-left: -2px;margin-top: 3px;"><Heart24Regular/></icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div :style="{ width: item_album_image + 'px' }">
                <div class="album_left_text_album_info" :style="{ width: item_album_txt + 'px' }">
                  <div>
                  <span id="home_item_img_album_name" :style="{ maxWidth: item_album_txt + 'px' }" style="font-weight: 600;">
                    {{ item.name }}
                  </span>
                  </div>
                  <div>
                  <span id="home_item_img_artist_name" :style="{ maxWidth: item_album_txt + 'px' }">
                    {{ item.artist }}
                  </span>
                  </div>
                </div>
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </n-space>

    <n-space vertical
             style="margin-left: 8px;">
      <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}">
        <n-space align="center">
          <span style="font-size: 16px;font-weight: 600;">
            {{
              $t('page.home.recentlyPlayed') + ' : ' +
              (store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby'
                  ? $t('entity.track_other')
                  : $t('entity.album_other'))
            }}
          </span>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary @click="()=>{
                store_general_fetch_home_list.fetchData_Home_of_recently_played();
                dynamicScroller_recently_played.$el.scrollLeft = 0;
                offset_recently_played = 0;
              }">
                <template #icon>
                  <n-icon :size="20"><ArrowReset24Filled/></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('common.refresh') }}
          </n-tooltip>
          <n-space v-if="store_view_home_page_info.home_Files_temporary_recently_played.length === 0" style="margin-top: 2px;">
            {{ $t('None') + $t('Play') + $t('Data') }}
          </n-space>
        </n-space>
        <n-space>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary
                        @click="scrollTo_recently_played(-1)"
                        >
                <n-icon size="20" :depth="2">
                  <ChevronLeft16Filled />
                </n-icon>
              </n-button>
            </template>
            {{ $t('common.backward') }}
          </n-tooltip>
          <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <n-button quaternary
                      @click="scrollTo_recently_played(1)"
                      >
              <n-icon size="20" :depth="2">
                <ChevronRight16Filled />
              </n-icon>
            </n-button>
          </template>
          {{ $t('common.forward') }}
        </n-tooltip>
        </n-space>
      </n-space>
      <DynamicScroller
        class="home-wall" ref="dynamicScroller_recently_played"
        v-if="store_view_home_page_info.home_Files_temporary_recently_played.length != 0"
        :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)', height: item_album_image + 60 + 'px'}"
        :items="store_view_home_page_info.home_Files_temporary_recently_played"
        :itemSize="itemSize"
        :minItemSize="itemSize"
        :emit-update="true"
        direction="horizontal">
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
              :item="item"
              :active="active"
              :data-index="index"
              :data-active="active"
              v-contextmenu:contextmenu
              @contextmenu.prevent="()=>{
                store_playlist_list_info.playlist_Menu_Item = item;
                store_playlist_list_info.playlist_Menu_Item_Id =item.id
              }"
          >
            <div
                :key="item.id"
                class="album">
              <div
                  :style="{ width: item_album_image + 'px', height: item_album_image + 'px', position: 'relative' }">
                <img
                    :src="item.medium_image_url"
                    @error="handleImageError(item)"
                    style="objectFit: cover; objectPosition: center;border: 1.5px solid #FFFFFF20;"
                    :style="{ width: item_album_image + 'px', height: item_album_image + 'px', borderRadius: '6px' }" alt=""/>
                <div class="hover-overlay"
                     @dblclick="Open_this_album_MediaList_click(item, 'recently_played')">
                  <div class="hover-content">
                    <button
                        class="play_this_album"
                        @click="async ()=>{
                          await Play_this_album_MediaList_click(item, 'recently_played');
                        }"
                        style="
                      border: 0;background-color: transparent;
                      width: 50px;height: 50px;
                      cursor: pointer;
                    "
                    >
                      <icon :size="42" color="#FFFFFF" style="margin-left: -2px;margin-top: 3px;"><PlayCircle24Regular/></icon>
                    </button>
                    <div class="hover_buttons_top"
                         v-if="(store_server_users.server_select_kind != 'jellyfin' &&store_server_users.server_select_kind != 'emby') || store_server_user_model.model_server_type_of_local
                               ">
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
                          v-if="store_server_user_model.model_server_type_of_local || (store_server_users.server_select_kind != 'jellyfin' && store_server_users.server_select_kind != 'emby')"
                          class="open_this_artist"
                          @click="Open_this_album_MediaList_click(item, 'recently_played')"
                          style="
                        border: 0;background-color: transparent;
                        width: 28px;height: 28px;
                        cursor: pointer;
                      "
                      >
                        <icon :size="20" color="#FFFFFF" style="margin-left: -2px;margin-top: 3px;"><Open28Filled/></icon>
                      </button>
                      <button
                        class="love_this_album"
                        @click="()=>{
                            handleItemClick_Favorite(item.id, item.favorite);
                            item.favorite = !item.favorite;
                          }"
                        style="
                          border: 0;background-color: transparent;
                          width: 28px;height: 28px;
                          cursor: pointer;
                        ">
                        <icon v-if="item.favorite" :size="20" color="red" style="margin-left: -2px;margin-top: 3px;"><Heart28Filled/></icon>
                        <icon v-else :size="20" color="#FFFFFF" style="margin-left: -2px;margin-top: 3px;"><Heart24Regular/></icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div :style="{ width: item_album_image + 'px' }">
                <div class="album_left_text_album_info" :style="{ width: item_album_txt + 'px' }">
                  <div>
                  <span id="home_item_img_album_name" :style="{ maxWidth: item_album_txt + 'px' }" style="font-weight: 600;">
                    {{ item.name }}
                  </span>
                  </div>
                  <div>
                  <span id="home_item_img_artist_name" :style="{ maxWidth: item_album_txt + 'px' }">
                    {{ item.artist }}
                  </span>
                  </div>
                </div>
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </n-space>

    <v-contextmenu ref="contextmenu" class="v-contextmenu-item v-contextmenu-item--hover" style="z-index: 999">
      <v-contextmenu-submenu :title="menu_item_add_to_songlist">
        <v-contextmenu-item
          v-for="n in store_playlist_list_info.playlist_names_ALLLists"
          :key="n.value"
          @click="update_playlist_addAlbum(
              store_playlist_list_info.playlist_Menu_Item_Id,
              n.value
          )"
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
</template>
<style>
.home-wall-container {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}
.home-wall {
  width: calc(100vw - 200px);
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  scrollbar-width: none;
  overflow-x: hidden;
}
.album {
  float: left;
  flex-direction: column;
}
.album .hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
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
  width: 140px;
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
#home_item_img_album_name{
  margin-top: 2px;
  font-size: 13px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
#home_item_img_artist_name{
  font-size: 13px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
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

.RateCustom.viaSlot .icon {
  width: 15px;
  height: 25px;
  margin: 0;
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
  width: 6px;
  height: 12px;
}
::-webkit-scrollbar-thumb {
  background-color: #88888850;
  border-radius: 4px;
}
::-webkit-scrollbar-track {
  background-color: #f1f1f105;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #88888850;
  border-radius: 4px;
}
</style>