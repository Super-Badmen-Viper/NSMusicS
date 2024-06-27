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
import {
  RefreshCircleOutline,
} from '@vicons/ionicons5'

////// this_view components of navie ui
import { computed, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {type InputInst, NIcon, NImage} from 'naive-ui';

////// i18n auto lang
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true
})

////// passed as argument
const emits = defineEmits([
  'media_list_of_album_id','play_this_album_song_list',
  'home_selected_top_album','refresh_home_temporary'
]);
const props = defineProps<{
  update_theme:boolean,

  home_Files_temporary_maximum_playback: Album[];
  home_Files_temporary_random_search: Album[];
  home_Files_temporary_recently_added: Album[];
  home_Files_temporary_recently_played: Album[];
  home_selected_top_album:Album;

  app_left_menu_collapsed: Boolean;
  window_innerWidth: number;
}>();
const home_selected_top_album_subscript = ref(0)

////// albumlist_view page_layout gridItems
const item_album = ref<number>(160)
const item_album_image = ref<number>(item_album.value - 20)
const item_album_txt = ref<number>(item_album.value - 20)
const itemSize = ref(180);
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
// dynamicScroller.value.scrollToItem(value - (12 + Math.floor((window.innerHeight - 765) / 75)));// 1000:15，690:11  75
const dynamicScroller_random_search = ref(null as any);
const dynamicScroller_recently_added = ref(null as any);
const dynamicScroller_recently_played = ref(null as any);

////// go to media_view
const Open_this_album_SongList_click = (album_id:string) => {
  console.log('media_list_of_album_id：'+album_id);
  emits('media_list_of_album_id',album_id)
}

//////
const Play_this_album_SongList_click = (album_id:string) => {
  console.log('play_this_album_click：'+album_id);
  emits('play_this_album_song_list',album_id)
}
const Play_Next_album_SongList_click = (value: number) => {
  if(value === 1){
    if(home_selected_top_album_subscript.value >= 17){
      home_selected_top_album_subscript.value = 0;
      emits('refresh_home_temporary',true)
    }else{
      home_selected_top_album_subscript.value += 1;
      emits('home_selected_top_album',home_selected_top_album_subscript.value)
    }
  }else{
    if(home_selected_top_album_subscript.value === 0){
      home_selected_top_album_subscript.value = 0;
      emits('refresh_home_temporary',true)
    }else{
      home_selected_top_album_subscript.value -= 1;
      emits('home_selected_top_album',home_selected_top_album_subscript.value)
    }
  }
}

////// changed_data write to sqlite
import {Set_AlbumInfo_To_LocalSqlite} from '@/features/sqlite3_local_configs/class_Set_AlbumInfo_To_LocalSqlite'
import {QueueMusicRound} from "@vicons/material";
import {Icon} from "@vicons/utils";
let set_AlbumInfo_To_LocalSqlite = new Set_AlbumInfo_To_LocalSqlite()
const handleItemClick_Favorite = (id: any,favorite: Boolean) => {
  set_AlbumInfo_To_LocalSqlite.Set_MediaInfo_To_Favorite(id,favorite)
}
const handleItemClick_Rating = (id_rating: any) => {
  const [id, rating] = id_rating.split('-');
  set_AlbumInfo_To_LocalSqlite.Set_MediaInfo_To_Rating(id, rating);
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
  <div class="album-wall-container">
    <n-space vertical style="margin-top: 20px;">
      <div class="notice">
        <div
          :style="{ width: 'calc(100vw - ' + (collapsed_width - 20) + 'px)'}"
          style="
            height: 320px;
            border-radius: 10px;
            border: 1.5px solid #FFFFFF20;
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
                WebkitMaskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)'
              }"
                style="
                margin-top: -300px;position: absolute;
                object-fit: cover;object-position: center;
              "
                :src="getAssetImage(props.home_selected_top_album?.medium_image_url)"
                @error="handleImageError"
            />
          </div>
        </div>
      </div>
      <n-space style="margin-left: 22px;margin-top: calc(126px - 340px);">
        <n-image
          width="180px" height="180px" object-fit="contain"
          style="border-radius: 6px;border: 1.5px solid #FFFFFF20;"
          :src="getAssetImage(props.home_selected_top_album?.medium_image_url)"
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
            {{ props.home_selected_top_album?.name }}
          </div>
          <div
            style="
              margin-top: -2px;
              font-weight: 550;font-size: 18px;
              overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
          ">
            {{ props.home_selected_top_album?.artist }}
          </div>
          <n-space style="margin-top: 6px;">
            <n-button @click="Play_Next_album_SongList_click(-1)" style="border-radius: 6px;border: 1.5px solid #FFFFFF20;">
              <n-icon>
                <ChevronLeft16Filled />
              </n-icon>
            </n-button>
            <n-button @click="Play_this_album_SongList_click(props.home_selected_top_album?.id)" style="border-radius: 6px;border: 1.5px solid #FFFFFF20;">
              {{ $t('player.play') }}
            </n-button>
            <n-button @click="Play_Next_album_SongList_click(1)" style="border-radius: 6px;border: 1.5px solid #FFFFFF20;">
              <n-icon>
                <ChevronRight16Filled />
              </n-icon>
            </n-button>
          </n-space>
        </n-space>
      </n-space>
    </n-space>
    <n-space vertical style="margin-top: 10px;">
      <n-space align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}">
        <span style="font-size: 20px;font-weight: 600;">
          {{ $t('page.home.mostPlayed') }}
        </span>
        <n-button text style="margin-top: 5px;" @click="emits('refresh_home_temporary',true)">
          <template #icon>
            <n-icon :size="26"><RefreshCircleOutline/></n-icon>
          </template>
        </n-button>
      </n-space>
      <DynamicScroller
          class="album-wall" ref="dynamicScroller_maximum_playback"
          :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}"
          :items="props.home_Files_temporary_maximum_playback"
          :itemSize="itemSize"
          :minItemSize="itemSize"
          :emit-update="true"
          direction="horizontal">
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
                          :length="5"
                          v-model="item.rating"
                          @after-rate="(value: number) => handleItemClick_Rating(item.id+'-'+value)"
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
                    <span id="album_name" :style="{ maxWidth: item_album_txt + 'px' }">
                      {{ item.name }}
                    </span>
                  </div>
                  <div>
                    <span id="album_singer_name" :style="{ maxWidth: item_album_txt + 'px' }">
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
    <n-space vertical style="margin-top: 36px;">
      <n-space align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}">
        <span style="font-size: 20px;font-weight: 600;">
          {{ $t('page.home.explore') }}
        </span>
        <n-button text style="margin-top: 5px;" @click="emits('refresh_home_temporary',true)">
          <template #icon>
            <n-icon :size="26"><RefreshCircleOutline/></n-icon>
          </template>
        </n-button>
      </n-space>
      <DynamicScroller
        class="album-wall" ref="dynamicScroller_random_search"
        :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}"
        :items="props.home_Files_temporary_random_search"
        :itemSize="itemSize"
        :minItemSize="itemSize"
        :emit-update="true"
        direction="horizontal">
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
                        :length="5"
                        v-model="item.rating"
                        @after-rate="(value: number) => handleItemClick_Rating(item.id+'-'+value)"
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
                  <span id="album_name" :style="{ maxWidth: item_album_txt + 'px' }">
                    {{ item.name }}
                  </span>
                  </div>
                  <div>
                  <span id="album_singer_name" :style="{ maxWidth: item_album_txt + 'px' }">
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
    <n-space vertical style="margin-top: 36px;">
      <n-space align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}">
        <span style="font-size: 20px;font-weight: 600;">
          {{ $t('page.home.newlyAdded') }}
        </span>
        <n-button text style="margin-top: 5px;" @click="emits('refresh_home_temporary',true)">
          <template #icon>
            <n-icon :size="26"><RefreshCircleOutline/></n-icon>
          </template>
        </n-button>
      </n-space>
      <DynamicScroller
        class="album-wall" ref="dynamicScroller_recently_added"
        :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}"
        :items="props.home_Files_temporary_recently_added"
        :itemSize="itemSize"
        :minItemSize="itemSize"
        :emit-update="true"
        direction="horizontal">
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
                          :length="5"
                          v-model="item.rating"
                          @after-rate="(value: number) => handleItemClick_Rating(item.id+'-'+value)"
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
                  <span id="album_name" :style="{ maxWidth: item_album_txt + 'px' }">
                    {{ item.name }}
                  </span>
                  </div>
                  <div>
                  <span id="album_singer_name" :style="{ maxWidth: item_album_txt + 'px' }">
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
    <n-space vertical style="margin-top: 36px;">
      <n-space align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}">
        <span style="font-size: 20px;font-weight: 600;">
          {{ $t('page.home.recentlyPlayed') }}
        </span>
        <n-button text style="margin-top: 5px;" @click="emits('refresh_home_temporary',true)">
          <template #icon>
            <n-icon :size="26"><RefreshCircleOutline/></n-icon>
          </template>
        </n-button>
      </n-space>
      <DynamicScroller
        class="album-wall" ref="dynamicScroller_recently_played"
        :style="{ width: 'calc(100vw - ' + (collapsed_width - 18) + 'px)'}"
        :items="props.home_Files_temporary_recently_played"
        :itemSize="itemSize"
        :minItemSize="itemSize"
        :emit-update="true"
        direction="horizontal">
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
                        :length="5"
                        v-model="item.rating"
                        @after-rate="(value: number) => handleItemClick_Rating(item.id+'-'+value)"
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
                  <span id="album_name" :style="{ maxWidth: item_album_txt + 'px' }">
                    {{ item.name }}
                  </span>
                  </div>
                  <div>
                  <span id="album_singer_name" :style="{ maxWidth: item_album_txt + 'px' }">
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
  </div>
</template>
<style>
.album-wall-container {
  width: 100%;
  height: 100%;
}
.album-wall {
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
#album_singer_name{
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
//.Rate.viaSlot .Rate__star.filled{color: #813d1a;}
//.Rate.viaSlot .Rate__star.hover{color: #E67136;}

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