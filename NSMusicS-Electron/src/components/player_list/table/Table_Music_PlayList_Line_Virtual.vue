<script setup lang="ts">
import {
  ChevronLeft16Filled,ChevronRight16Filled
} from '@vicons/fluent'

////// this_view components of navie ui
import { ref, onMounted } from 'vue';
import {store_player_audio_info} from "@/store/player/store_player_audio_info";
import {store_playlist_list_info} from "@/store/view/playlist/store_playlist_list_info";
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";

////// scrollbar of playlist_view
const scrollbar = ref(null as any);
onMounted(() => {
  if (scrollbar !== null) {
    setTimeout(() => {
      scrollbar.value.scrollToItem(store_player_audio_info.this_audio_Index_of_absolute_positioning_in_list);
    }, 100);
  }
});

/////// emits audio_info of artistlist_view_list
const handleItemDbClick = (media_file:any,index:number) => {
  if(store_server_user_model.model_server_type_of_web){
    /// Data synchronization
    store_playlist_list_fetchData.fetchData_PlayList_of_data_synchronization_to_Media()
  }

  store_player_audio_info.this_audio_play_id = media_file.play_id
  store_player_audio_info.this_audio_file_path = media_file.path
  store_player_audio_info.this_audio_lyrics_string = media_file.lyrics
  store_player_audio_info.this_audio_file_medium_image_url = media_file.medium_image_url
  store_player_audio_info.this_audio_artist_name = media_file.artist
  store_player_audio_info.this_audio_artist_id = media_file.artist_id
  store_player_audio_info.this_audio_song_name = media_file.title
  store_player_audio_info.this_audio_song_id = media_file.id
  store_player_audio_info.this_audio_song_rating = media_file.rating
  store_player_audio_info.this_audio_song_favorite = media_file.favorite
  store_player_audio_info.this_audio_album_id = media_file.album_id
  store_player_audio_info.this_audio_album_name = media_file.album
  //
  store_player_tag_modify.player_current_media_starred = media_file.favorite
  store_player_tag_modify.player_current_media_playCount = media_file.play_count
  store_player_tag_modify.player_current_media_playDate = media_file.play_date
  //
  store_player_audio_info.this_audio_Index_of_absolute_positioning_in_list = index

  store_playlist_list_logic.media_page_handleItemDbClick = false
  store_player_audio_info.this_audio_restart_play = true
}
const handleItemClick_title = (title:string) => {

}
const handleItemClick_artist = (artist:string) => {

}

////// changed_data write to sqlite
const handleItemClick_Favorite = (id: any,favorite: Boolean) => {
  console.log('handleItemClick_Favorite_id：'+id+'  _favorite:'+!favorite)
}
const handleItemClick_Rating = (id: any,rating: number) => {
  console.log('handleItemClick_Rating_id：'+id+'  _rating:'+rating)
}
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

////// i18n auto lang
import { useI18n } from 'vue-i18n'
import {VueDraggable} from "vue-draggable-plus";
import {BrowserUpdatedFilled} from "@vicons/material";
import {store_playlist_list_fetchData} from "@/store/view/playlist/store_playlist_list_fetchData";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {store_view_media_page_fetchData} from "@/store/view/media/store_view_media_page_fetchData";
const { t } = useI18n({
  inheritLocale: true
})

//////
import {
  store_local_data_set_mediaInfo
} from "@/store/local/local_data_synchronization/store_local_data_set_mediaInfo";
import {store_playlist_list_logic} from "@/store/view/playlist/store_playlist_list_logic";
import {NIcon, useMessage} from 'naive-ui'
const message = useMessage()

////// right menu
import { inject } from "vue";
import {store_player_tag_modify} from "@/store/player/store_player_tag_modify";
const contextmenu = inject("playlist_contextmenu", null);
async function update_playlist_addMediaFile(id: any, playlist_id: any){
  try{
    await store_local_data_set_mediaInfo.Set_MediaInfo_Add_Selected_Playlist(id,playlist_id)
    message.success(t('common.add'))
    store_playlist_list_logic.get_playlist_tracks_temporary_update_media_file(true)
  }catch (e) {
    console.error(e)
  }
}
const menu_item_add_to_songlist = computed(() => t('form.addToPlaylist.title'));
function menu_item_remove_to_playlist_current() {
  store_playlist_list_info.playlist_MediaFiles_temporary =
      store_playlist_list_info.playlist_MediaFiles_temporary.filter(
          (mediaFile: Media_File) => mediaFile.id !== store_playlist_list_info.playlist_Menu_Item_Id);

  store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds =
      store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds.filter(
          (mediaId: string) => mediaId !== store_playlist_list_info.playlist_Menu_Item_Id);

  store_playlist_list_info.playlist_MediaFiles_temporary.forEach(
      (item: any, index: number) => {
        item.absoluteIndex = index;});

  store_app_configs_logic_save.save_system_playlist_item_id_config();

  contextmenu.value.hide()
}
function menu_item_move_to_playlist_start() {
  const item: Media_File | undefined = store_playlist_list_info.playlist_MediaFiles_temporary.find((mediaFile: Media_File) => mediaFile.id === store_playlist_list_info.playlist_Menu_Item_Id);
  if (item != undefined && item != 'undefined') {
    const index = store_playlist_list_info.playlist_MediaFiles_temporary.findIndex((mediaFile: Media_File) => mediaFile.id === item.id);
    if (index !== -1) {
      store_playlist_list_info.playlist_MediaFiles_temporary.splice(index, 1);
    }

    const mediaIdIndex = store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds.indexOf(item.id);
    if (mediaIdIndex !== -1) {
      store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds.splice(mediaIdIndex, 1);
    }

    store_playlist_list_info.playlist_MediaFiles_temporary.unshift(item);

    store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds.unshift(item.id);

    store_playlist_list_info.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
      item.absoluteIndex = index;
    });

    store_app_configs_logic_save.save_system_playlist_item_id_config();

    contextmenu.value.hide();
  }
}
function menu_item_move_to_playlist_end() {
  const item: Media_File | undefined = store_playlist_list_info.playlist_MediaFiles_temporary.find((mediaFile: Media_File) => mediaFile.id === store_playlist_list_info.playlist_Menu_Item_Id);
  if (item != undefined && item != 'undefined') {
    const index = store_playlist_list_info.playlist_MediaFiles_temporary.findIndex((mediaFile: Media_File) => mediaFile.id === item.id);
    if (index !== -1) {
      store_playlist_list_info.playlist_MediaFiles_temporary.splice(index, 1);
    }

    const mediaIdIndex = store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds.indexOf(item.id);
    if (mediaIdIndex !== -1) {
      store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds.splice(mediaIdIndex, 1);
    }

    store_playlist_list_info.playlist_MediaFiles_temporary.push(item);

    store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds.push(item.id);

    store_playlist_list_info.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
      item.absoluteIndex = index;
    });

    store_app_configs_logic_save.save_system_playlist_item_id_config();

    contextmenu.value.hide();
  }
}
//////
function onChange(){
  store_playlist_list_info.playlist_MediaFiles_temporary_Sort_Items.forEach((item: any, index: number) => {
    item.absoluteIndex = index + store_playlist_list_info.playlist_Sort_StartIndex;
  });
  store_playlist_list_info.menu_item_reinsert_drag_sort()
}

//////
const isScrolling = ref(false);
const onScrollEnd = async () => {
  if (isScrolling.value) return;
  isScrolling.value = true;
  if (store_server_user_model.model_server_type_of_web) {
    await store_playlist_list_fetchData.fetchData_PlayList_of_server_web_end()
  }
  isScrolling.value = false;
};

onMounted(()=>{
  store_playlist_list_info.playlist_DragSort_Model = false
});
</script>
<template>
  <n-space vertical :size="12">
    <div class="dynamic-scroller-demo">
      <v-contextmenu v-if="!store_playlist_list_info.playlist_DragSort_Model"
                     ref="contextmenu"
                     class="v-contextmenu-item v-contextmenu-item--hover"
                     style="z-index: 9999;">
        <v-contextmenu-submenu :title="menu_item_add_to_songlist">
          <v-contextmenu-item
              v-for="n in store_playlist_list_info.playlist_names_ALLLists"
              :key="n.value"
              @click="update_playlist_addMediaFile(store_playlist_list_info.playlist_Menu_Item_Id,n.value)"
          >
            {{ n.label }}
          </v-contextmenu-item>
        </v-contextmenu-submenu>
        <v-contextmenu-divider />
        <v-contextmenu-item @click="menu_item_remove_to_playlist_current()">
          {{ $t('common.delete') }}
        </v-contextmenu-item>
        <v-contextmenu-divider />
        <v-contextmenu-item @click="menu_item_move_to_playlist_start">
          {{ $t('action.moveToTop') }}
        </v-contextmenu-item>
        <v-contextmenu-item @click="menu_item_move_to_playlist_end">
          {{ $t('action.moveToBottom') }}
        </v-contextmenu-item>
        <v-contextmenu-divider />
        <v-contextmenu-item @click="store_playlist_list_info.menu_item_open_drag_sort">
          {{ $t('nsmusics.view_page.drag_sort') }}
        </v-contextmenu-item>
      </v-contextmenu>
      <DynamicScroller v-if="!store_playlist_list_info.playlist_DragSort_Model"
        class="table" ref="scrollbar"
        style="width: 488px;z-index: 0"
        :items="store_playlist_list_info.playlist_MediaFiles_temporary"
        key-field="play_id"
        :minItemSize="50"
        @scroll-end="onScrollEnd"
      >
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
            :data-active="active"
            class="message"
            v-contextmenu:contextmenu @contextmenu.prevent="store_playlist_list_info.playlist_Menu_Item_Id = item.id"
            @Dblclick="handleItemDbClick(item,index)">
            <div class="media_info">
              <div class="lottie_pkay_inlist" v-show="item.playing"
                style="
                  position: absolute;bottom:14px;right:36px;
                  width:50px;height:50px;
                ">

              </div>
              <div
                style="margin-left: 10px;
                  width: 58px;height: 58px;
                  border-radius: 6px; border: 1.5px solid #FFFFFF20;
                  overflow: hidden;">
                <img
                  :key="item.absoluteIndex"
                  :src="item.medium_image_url"
                  @error="handleImageError"
                  style="width: 100%; height: 100%; object-fit: cover;"/>
              </div>
              <div class="title_playlist" style="width: 240px;">
                <span
                    style="font-size: 16px;font-weight: 600;"
                    @click="handleItemClick_title(item.title)">
                  {{ item.title }}
                </span>
                <br>
                <template v-for="artist in item.artist.split('/')">
                  <span @click="handleItemClick_artist(artist)">{{ artist + '&nbsp' }}</span>
                </template>
              </div>
              <span class="duration_txt" style="text-align: left;font-size: 15px;">{{ item.duration_txt }}</span>
              <span class="index" style="text-align: left;font-size: 15px;">{{ index + 1 }}</span>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
      <n-space v-if="store_playlist_list_info.playlist_DragSort_Model">
        <n-space style="height: calc(100vh - 212px);" vertical justify="space-between">
          <div></div>
          <n-button
            style="border-radius: 8px;"
            @click="store_playlist_list_info.playlist_DragSort_Model = false">
            <n-icon size="26" :depth="2">
              <ChevronLeft16Filled/>
            </n-icon>
          </n-button>
          <div></div>
        </n-space>
        <VueDraggable
          class="table"
          :animation="150"
          style="
            width: 460px;
            position: absolute;
            overflow-y: auto;overflow-x: hidden"
          @update="onChange"
          v-model="store_playlist_list_info.playlist_MediaFiles_temporary_Sort_Items">
          <div
              v-for="(item, index) in store_playlist_list_info.playlist_MediaFiles_temporary_Sort_Items"
              :key="item.id"
              class="message">
            <div class="media_info">
              <div style="margin-left: 10px;
                          width: 58px;height: 58px;
                          border-radius: 6px; border: 1.5px solid #FFFFFF20;
                          overflow: hidden;">
                <img
                    :key="item.absoluteIndex"
                    :src="item.medium_image_url"
                    @error="handleImageError"
                    style="width: 100%; height: 100%; object-fit: cover;"/>
              </div>
              <div class="title_playlist">
                <span @click="handleItemClick_title(item.title)">
                  {{ item.title }}
                </span>
                <br>
                <template v-for="artist in item.artist.split('/')">
                  <span @click="handleItemClick_artist(artist)">{{ artist + '&nbsp' }}</span>
                </template>
              </div>
              <span class="duration_txt" style="text-align: left;font-size: 15px;">{{ item.duration_txt }}</span>
              <span class="index" style="text-align: left;font-size: 15px;">{{ item.absoluteIndex }}</span>
            </div>
          </div>
        </VueDraggable>
      </n-space>
    </div>
  </n-space>
</template>

<style scoped>
.dynamic-scroller-demo {
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.table{
  height: calc(100vh - 212px);
}
.message {
  display: flex;
  align-items: left;
}
.media_info {
  height: 70px;
  display: flex;
  align-items: center;
  border-radius: 6px;

  transition: background-color 0.3s;
}
.media_info:hover {
  background-color: #FFFFFF24;
}
.checkbox{
  width: 20px;
  margin-left: 12px;
}
.index{
  width: 50px;
  margin-left: 12px;
}
.title_playlist{
  margin-left: 10px;
  text-align: left;
  width: 200px;
  font-size: 15px;
  overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
}
.title_playlist :hover{
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}
.love{
  margin-left: 10px;
  text-align: left;
  width: 30px;
}
.love :hover{
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}
.duration_txt{
  margin-left: 20px;
  text-align: left;
  width: 50px;
}

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