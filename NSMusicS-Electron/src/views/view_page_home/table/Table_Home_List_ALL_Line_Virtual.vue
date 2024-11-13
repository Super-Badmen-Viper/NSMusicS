<script setup lang="ts">
////// this_view resource of vicons_svg
import {
  PlayCircle24Regular,
  Heart24Regular,Heart28Filled,
  ChevronLeft16Filled,ChevronRight16Filled,Open28Filled,
} from '@vicons/fluent'
import {
  Play,
  RefreshSharp,
} from '@vicons/ionicons5'

////// this_view components of navie ui
import {onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {NButton, NIcon, NImage} from 'naive-ui';
import {Icon} from "@vicons/utils";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
import {store_view_home_page_logic} from "@/store/view/home/store_view_home_page_logic";
import {store_router_data_logic} from "@/store/router/store_router_data_logic";
import {store_view_album_page_fetchData} from "@/store/view/album/store_view_album_page_fetchData";

////// i18n auto lang
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true
})

////// passed as argument
import {store_view_home_page_info} from "@/store/view/home/store_view_home_page_info"
import {store_server_user_model} from "@/store/server/store_server_user_model";

////// albumlist_view page_layout gridItems
const item_album = ref<number>(160)
const item_album_image = ref<number>(item_album.value - 20)
const item_album_txt = ref<number>(item_album.value - 20)
const itemSize = ref(180);
const gridItems = ref(5);
const itemSecondarySize = ref(185);
const collapsed_width = ref<number>(1090);
const path = require('path')
const handleImageError = (event: any) => {
  const originalSrc = event.target.src;
  const pngSrc = originalSrc.replace(/\.[^/.]+$/, '.png');
  const img = new Image();
  img.onload = null;
  img.onerror = null;
  img.onload = () => {
    event.target.src = pngSrc;
  };
  img.onerror = () => {
    event.target.src = path.resolve('resources/img/error_album.jpg');
  };
  img.src = pngSrc;
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
    item_album.value = 190;
    item_album_image.value = item_album.value - 20;
    item_album_txt.value = item_album.value - 20;
    itemSecondarySize.value = 135;
    itemSize.value = 184;
  } else {
    collapsed_width.value = 240;
    item_album.value = 180;
    item_album_image.value = item_album.value - 20;
    item_album_txt.value = item_album.value - 20;
    itemSecondarySize.value = 170;
    itemSize.value = 168;
  }
  gridItems.value = Math.floor(window.innerWidth / itemSecondarySize.value) - 1;
};
onMounted(() => {
  startTimer();
  updateGridItems();
});

////// dynamicScroller of albumlist_view
const dynamicScroller_maximum_playback = ref(null as any);
const dynamicScroller_random_search = ref(null as any);
const dynamicScroller_recently_added = ref(null as any);
const dynamicScroller_recently_played = ref(null as any);

////// go to media_view
const Open_this_album_SongList_click = (album_id:string) => {
  if(store_server_user_model.model_server_type_of_web){
    store_view_media_page_fetchData._album_id = album_id
    store_view_media_page_logic.page_songlists_selected = 'song_list_all'
    store_playlist_list_fetchData._album_id = album_id
  }
  console.log('media_list_of_album_id：'+album_id);
  store_router_data_logic.get_media_list_of_album_id_by_album_info(album_id)
}

//////
const Play_this_album_SongList_click = async (album_id: string) => {
  if(store_server_user_model.model_server_type_of_web){
    store_view_media_page_fetchData._album_id = album_id
    store_view_media_page_logic.page_songlists_selected = 'song_list_all'
    store_playlist_list_fetchData._album_id = album_id
  }
  console.log('play_this_album_click：' + album_id);
  await store_view_album_page_fetchData.fetchData_This_Album_SongList(album_id)
}
const Play_Next_album_SongList_click = (value: number) => {
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
import {Set_AlbumInfo_To_LocalSqlite} from '@/features/sqlite3_local_configs/class_Set_AlbumInfo_To_LocalSqlite'
import {store_local_data_set_albumInfo} from "@/store/local/local_data_synchronization/store_local_data_set_albumInfo";
import {store_view_album_page_info} from "@/store/view/album/store_view_album_page_info";
let set_AlbumInfo_To_LocalSqlite = new Set_AlbumInfo_To_LocalSqlite()
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
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {useMessage} from 'naive-ui'
import {store_playlist_list_info} from "@/store/view/playlist/store_playlist_list_info";
import {store_view_media_page_fetchData} from "@/store/view/media/store_view_media_page_fetchData";
import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
import {store_local_data_set_mediaInfo} from "@/store/local/local_data_synchronization/store_local_data_set_mediaInfo";
import {store_playlist_list_logic} from "@/store/view/playlist/store_playlist_list_logic";
import {store_player_audio_info} from "@/store/player/store_player_audio_info";
import {store_player_appearance} from "@/store/player/store_player_appearance";
import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";
import {store_playlist_list_fetchData} from "@/store/view/playlist/store_playlist_list_fetchData";
const contextmenu = ref(null as any)
const menu_item_add_to_songlist = computed(() => t('form.addToPlaylist.title'));
const message = useMessage()
async function update_playlist_addAlbum(id: any, playlist_id: any){
  try{
    await store_view_media_page_fetchData.fetchData_Media_Find_This_Album(id)
    const matchingIds: string[] = [];
    store_view_media_page_info.media_Files_temporary.forEach((item: Media_File) => {
      if (item.album_id === id) {
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
  await store_view_media_page_fetchData.fetchData_Media_Find_This_Album(store_playlist_list_info.playlist_Menu_Item_Id);
  const matchingItems = store_view_media_page_info.media_Files_temporary.filter(
      (item: Media_File) => item.album_id === store_playlist_list_info.playlist_Menu_Item_Id
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
  await store_view_media_page_fetchData.fetchData_Media_Find_This_Album(store_playlist_list_info.playlist_Menu_Item_Id);
  const matchingItems = store_view_media_page_info.media_Files_temporary.filter(
      (item: Media_File) => item.album_id === store_playlist_list_info.playlist_Menu_Item_Id
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
    <n-space vertical style="margin-top: 20px;margin-left: 8px;">
      <div class="notice"
           v-contextmenu:contextmenu
           @contextmenu.prevent="store_playlist_list_info.playlist_Menu_Item_Id = store_view_home_page_info.home_selected_top_album?.id">
        <div
          :style="{
            width: 'calc(100vw - ' + (collapsed_width - 20) + 'px)',
            height: 'calc(44vh)',
          }"
          style="
            min-height: 320px;
            border-radius: 10px;
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
                WebkitMaskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)',
                marginTop: 'calc(-500px)'
              }"
              style="
                position: absolute;
                object-fit: cover;object-position: center;
              "
              :src="getAssetImage(store_view_home_page_info.home_selected_top_album?.medium_image_url)"
              @error="handleImageError"
            />
          </div>
        </div>
      </div>
      <n-space style="margin-left: 0px;margin-top: calc(126px - 340px);">
        <n-image
          width="180px" height="180px" object-fit="contain"
          style="border-radius: 6px;border: 1.5px solid #FFFFFF20;"
          :src="getAssetImage(store_view_home_page_info.home_selected_top_album?.medium_image_url)"
          fallback-src="../../../resources/img/error_album.jpg"
          :show-toolbar="false"
        />
        <n-space vertical
          style="margin-top: -2px;margin-left: 12px;"
          :style="{
            width: 'calc(100vw - ' + (collapsed_width + 300) + 'px)',
          }">
          <div style="font-size: 16px;font-weight: 600;">
            {{ $t('page.home.explore') }}
          </div>
          <div
            style="
              margin-top: -3px;
              font-weight: 900;font-size: 44px;
              overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
          ">
            {{ store_view_home_page_info.home_selected_top_album?.name }}
          </div>
          <div
            style="
              margin-top: -2px;
              font-weight: 550;font-size: 18px;
              overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
          ">
            {{ store_view_home_page_info.home_selected_top_album?.artist }}
          </div>
          <n-space style="margin-top: 6px;">
            <n-button quaternary @click="Play_Next_album_SongList_click(-1)" style="margin-right: -6px;">
              <n-icon size="20" :depth="2">
                <ChevronLeft16Filled />
              </n-icon>
            </n-button>
            <n-button quaternary @click="Play_this_album_SongList_click(store_view_home_page_info.home_selected_top_album?.id)" style="margin-right: -6px;">
              <template #icon>
                <n-icon :size="20" :depth="2"><Play/></n-icon>
              </template>
            </n-button>
            <n-button quaternary @click="Play_Next_album_SongList_click(1)" style="margin-right: -6px;">
              <n-icon size="20" :depth="2">
                <ChevronRight16Filled />
              </n-icon>
            </n-button>
          </n-space>
        </n-space>
      </n-space>
    </n-space>

    <n-space vertical style="margin-top: 10px;margin-left: 8px;">
      <n-space align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}">
        <span style="font-size: 20px;font-weight: 600;">
          {{ $t('page.home.mostPlayed') }}
        </span>
        <n-button quaternary circle size="medium" @click="store_view_home_page_logic.list_data_StartUpdate = true">
          <template #icon>
            <n-icon :size="20"><RefreshSharp/></n-icon>
          </template>
        </n-button>
      </n-space>
      <DynamicScroller
          class="home-wall" ref="dynamicScroller_maximum_playback"
          :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}"
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
            @contextmenu.prevent="store_playlist_list_info.playlist_Menu_Item_Id = item.id"
          >
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
                <div class="hover-overlay" @dblclick="Open_this_album_SongList_click(item.id)">
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
                    </div>
                  </div>
                </div>
              </div>
              <div class="album_text" :style="{ width: item_album_image + 'px' }">
                <div class="album_left_text_album_info" :style="{ width: item_album_txt + 'px' }">
                  <div>
                    <span id="album_name" :style="{ maxWidth: item_album_txt + 'px' }" style="font-size: 14px;font-weight: 600;">
                      {{ item.name }}
                    </span>
                  </div>
                  <div>
                    <span id="album_artist_name" :style="{ maxWidth: item_album_txt + 'px' }">
                      {{ item.artist }}
                    </span>
                  </div>
                  <div>
                    <span id="album_time" :style="{ maxWidth: item_album_txt + 'px' }">
                      {{ item.created_time }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </n-space>
    <n-space vertical style="margin-top: 36px;margin-left: 8px;">
      <n-space align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}">
        <span style="font-size: 20px;font-weight: 600;">
          {{ $t('page.home.explore') }}
        </span>
        <n-button quaternary circle size="medium" @click="store_view_home_page_logic.list_data_StartUpdate = true">
          <template #icon>
            <n-icon :size="20"><RefreshSharp/></n-icon>
          </template>
        </n-button>
      </n-space>
      <DynamicScroller
        class="home-wall" ref="dynamicScroller_random_search"
        :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}"
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
              @contextmenu.prevent="store_playlist_list_info.playlist_Menu_Item_Id = item.id"
          >
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
                <div class="hover-overlay" @dblclick="Open_this_album_SongList_click(item.id)">
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
                    </div>
                  </div>
                </div>
              </div>
              <div class="album_text" :style="{ width: item_album_image + 'px' }">
                <div class="album_left_text_album_info" :style="{ width: item_album_txt + 'px' }">
                  <div>
                  <span id="album_name" :style="{ maxWidth: item_album_txt + 'px' }" style="font-size: 14px;font-weight: 600;">
                    {{ item.name }}
                  </span>
                  </div>
                  <div>
                  <span id="album_artist_name" :style="{ maxWidth: item_album_txt + 'px' }">
                    {{ item.artist }}
                  </span>
                  </div>
                  <div>
                  <span id="album_time" :style="{ maxWidth: item_album_txt + 'px' }">
                    {{ item.created_time }}
                  </span>
                  </div>
                </div>
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </n-space>
    <n-space vertical style="margin-top: 36px;margin-left: 8px;">
      <n-space align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}">
        <span style="font-size: 20px;font-weight: 600;">
          {{ $t('page.home.newlyAdded') }}
        </span>
        <n-button quaternary circle size="medium" @click="store_view_home_page_logic.list_data_StartUpdate = true">
          <template #icon>
            <n-icon :size="20"><RefreshSharp/></n-icon>
          </template>
        </n-button>
      </n-space>
      <DynamicScroller
        class="home-wall" ref="dynamicScroller_recently_added"
        :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}"
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
              @contextmenu.prevent="store_playlist_list_info.playlist_Menu_Item_Id = item.id"
          >
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
                <div class="hover-overlay" @dblclick="Open_this_album_SongList_click(item.id)">
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
                    </div>
                  </div>
                </div>
              </div>
              <div class="album_text" :style="{ width: item_album_image + 'px' }">
                <div class="album_left_text_album_info" :style="{ width: item_album_txt + 'px' }">
                  <div>
                  <span id="album_name" :style="{ maxWidth: item_album_txt + 'px' }" style="font-size: 14px;font-weight: 600;">
                    {{ item.name }}
                  </span>
                  </div>
                  <div>
                  <span id="album_artist_name" :style="{ maxWidth: item_album_txt + 'px' }">
                    {{ item.artist }}
                  </span>
                  </div>
                  <div>
                  <span id="album_time" :style="{ maxWidth: item_album_txt + 'px' }">
                    {{ item.created_time }}
                  </span>
                  </div>
                </div>
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </n-space>
    <n-space vertical style="margin-top: 36px;margin-left: 8px;">
      <n-space align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}">
        <span style="font-size: 20px;font-weight: 600;">
          {{ $t('page.home.recentlyPlayed') }}
        </span>
        <n-button quaternary circle size="medium" @click="store_view_home_page_logic.list_data_StartUpdate = true">
          <template #icon>
            <n-icon :size="20"><RefreshSharp/></n-icon>
          </template>
        </n-button>
      </n-space>
      <DynamicScroller
        class="home-wall" ref="dynamicScroller_recently_played"
        :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}"
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
              @contextmenu.prevent="store_playlist_list_info.playlist_Menu_Item_Id = item.id"
          >
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
                <div class="hover-overlay" @dblclick="Open_this_album_SongList_click(item.id)">
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
                    </div>
                  </div>
                </div>
              </div>
              <div class="album_text" :style="{ width: item_album_image + 'px' }">
                <div class="album_left_text_album_info" :style="{ width: item_album_txt + 'px' }">
                  <div>
                  <span id="album_name" :style="{ maxWidth: item_album_txt + 'px' }" style="font-size: 14px;font-weight: 600;">
                    {{ item.name }}
                  </span>
                  </div>
                  <div>
                  <span id="album_artist_name" :style="{ maxWidth: item_album_txt + 'px' }">
                    {{ item.artist }}
                  </span>
                  </div>
                  <div>
                  <span id="album_time" :style="{ maxWidth: item_album_txt + 'px' }">
                    {{ item.created_time }}
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
            @click="update_playlist_addAlbum(store_playlist_list_info.playlist_Menu_Item_Id,n.value)"
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
}
.home-wall {
  overflow-y: auto;
  width: calc(100vw - 200px);
  height: 246px;
  display: flex;
  flex-direction: column;
  overflow-x:hidden;
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
#album_artist_name{
  font-size: 12px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
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
  width: 6px;
  height: 12px;
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