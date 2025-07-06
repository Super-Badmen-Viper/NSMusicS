<script setup lang="ts">
import {
  ChevronLeft16Filled,ChevronRight16Filled
} from '@vicons/fluent'

////// this_view views_components of navie ui
import {ref, onMounted, computed} from 'vue';
import {store_player_audio_info} from "@/views/view_app/music_page/page_player/store/store_player_audio_info";
import {store_playlist_list_info} from "@/views/view_app/music_components/player_list/store/store_playlist_list_info";
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";

////// scrollbar of playlist_view
const scrollbar = ref(null as any);
onMounted(() => {
  try {
    if (scrollbar !== null) {
      setTimeout(() => {
        scrollbar.value.scrollToItem(store_player_audio_info.this_audio_Index_of_play_list);
      }, 100);
    }
  }catch {  }
});

////// changed_data write to sqlite
const handleItemClick_Favorite = (id: any,favorite: Boolean) => {
  console.log('handleItemClick_Favorite_id：'+id+'  _favorite:'+!favorite)
}
const handleItemClick_Rating = (id: any,rating: number) => {
  console.log('handleItemClick_Rating_id：'+id+'  _rating:'+rating)
}
import error_album from '@/assets/img/error_album.jpg'
import {ipcRenderer, isElectron} from '@/utils/electron/isElectron';
const errorHandled = ref(new Map());
const handleImageError = async (item: any) => {
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
    item.medium_image_url = error_album;
  }
};

////// i18n auto lang
import { useI18n } from 'vue-i18n'
import {VueDraggable} from "vue-draggable-plus";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
const { t } = useI18n({
  inheritLocale: true
})

//////
import {
  store_local_data_set_mediaInfo
} from "@/data/data_stores/local/local_data_synchronization/store_local_data_set_mediaInfo";
import {store_playlist_list_logic} from "@/views/view_app/music_components/player_list/store/store_playlist_list_logic";
import {NIcon, useMessage} from 'naive-ui'
const message = useMessage()

////// right menu
import {
  store_general_fetch_media_list
} from "@/data/data_stores/server/server_api_abstract/music_scene/page/page_media_file/store_general_fetch_media_list";
import {store_app_configs_info} from "@/data/data_stores/app/store_app_configs_info";
import {
  store_general_model_player_list
} from "@/data/data_stores/server/server_api_abstract/music_scene/components/player_list/store_general_model_player_list";
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {
  Get_NineSong_Temp_Data_To_LocalSqlite
} from "@/data/data_access/servers_configs/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite";
import {store_server_login_info} from "@/views/view_server/page_login/store/store_server_login_info";
import {
  Get_Navidrome_Temp_Data_To_LocalSqlite
} from "@/data/data_access/servers_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite";
const contextmenu = ref(null)
async function update_playlist_addMediaFile(id: any, playlist_id: any){
  try{
    await store_local_data_set_mediaInfo.Set_MediaInfo_Add_Selected_Playlist(id,playlist_id)
    message.success(t('common.add'))
    store_general_model_player_list.get_playlist_tracks_temporary_update_media_file()
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
  if (store_playlist_list_info.playlist_MediaFiles_temporary.length < 30) return;
  isScrolling.value = true;
  if (store_server_user_model.model_server_type_of_web) {
    if (!store_server_user_model.random_play_model) {
      store_server_user_model.random_play_model_search = false;
      ///
      store_general_fetch_media_list._load_model = 'play'
      await store_general_fetch_media_list.fetchData_Media_of_server_web_end()
      store_general_fetch_media_list._load_model = 'search'
    } else {
      store_server_user_model.random_play_model_search = true;
      ///
      store_server_user_model.random_play_model_add = true;
      if (store_server_users.server_select_kind === 'ninesong') {
        let get_NineSong_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite();
        await get_NineSong_Temp_Data_To_LocalSqlite.get_random_song_list(
            store_server_login_info.server_url,
            '0',
            '30'
        );
      } else if (store_server_users.server_select_kind === 'navidrome') {
        let get_Navidrome_Temp_Data_To_LocalSqlite = new Get_Navidrome_Temp_Data_To_LocalSqlite();
        await get_Navidrome_Temp_Data_To_LocalSqlite.get_random_song_list(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
            store_server_user_model.username,
            store_server_user_model.token,
            store_server_user_model.salt,
            '30',
            '',
            ''
        );
      } else {
        store_general_fetch_media_list._load_model = 'play';
        await store_general_fetch_media_list.fetchData_Media_of_server_web_start();
        store_general_fetch_media_list._load_model = 'search';
      }
    }
  }
  isScrolling.value = false;
};

const handleDoubleTap = (item: any, index: number) => {
  store_playlist_list_logic.handleItemDbClick(item, index);
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
                     style="z-index: 9999;position: absolute;">
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
        :style="{
          width: store_app_configs_info.window_state_miniplayer_playlist ? '280px' : '488px',
        }"
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
            v-contextmenu:contextmenu
            @contextmenu.prevent="store_playlist_list_info.playlist_Menu_Item_Id = item.id"
            @dblclick="store_playlist_list_logic.handleItemDbClick(item, index)"
            >
<!--            v-hammer:doubletap="() => handleDoubleTap(item, index)"-->
            <div
              :style="{
                width: store_app_configs_info.window_state_miniplayer_playlist ? '280px' : '488px',
                height: store_app_configs_info.window_state_miniplayer_playlist ? '46px' : '70px'
              }"
              class="media_info">
              <div class="lottie_pkay_inlist" v-show="item.playing"
                style="
                  position: absolute;bottom:14px;right:36px;
                  width:50px;height:50px;
                ">

              </div>
              <div
                :style="{
                  width: store_app_configs_info.window_state_miniplayer_playlist ? '40px' : '58px',
                  height: store_app_configs_info.window_state_miniplayer_playlist ? '40px' : '58px',
                  marginLeft: store_app_configs_info.window_state_miniplayer_playlist ? '4px' : '10px',
                }"
                style="
                  border-radius: 4px; border: 1.5px solid #FFFFFF20;
                  overflow: hidden;">
                <img
                  :key="item.absoluteIndex"
                  :src="item.medium_image_url"
                  @error="handleImageError(item)"
                  style="width: 100%; height: 100%; object-fit: cover;"/>
              </div>
              <div
                :style="{
                  width: store_app_configs_info.window_state_miniplayer_playlist ? '150px' : '240px',
                  fontSize: store_app_configs_info.window_state_miniplayer_playlist ? '13px' : '15px',
                }"
                class="title_playlist">
                <span
                  :style="{
                    fontSize: store_app_configs_info.window_state_miniplayer_playlist ? '13px' : '16px',
                    fontWeight: store_app_configs_info.window_state_miniplayer_playlist ? '400' : '600',
                  }"
                  @click="handleItemClick_title(item.title)">
                  {{ item.title }}
                </span>
                <br>
                <template v-for="artist in item.artist.split(/[\/|｜、]/)">
                  <span
                    :style="{
                      color: store_app_configs_info.window_state_miniplayer_playlist ? '#A4A4A4' : '#FFFFFF',
                    }"
                    @click="handleItemClick_artist(artist)">
                    {{ artist + '&nbsp' }}
                  </span>
                </template>
              </div>
              <span class="duration_txt"
                    :style="{
                      fontSize: store_app_configs_info.window_state_miniplayer_playlist ? '13px' : '15px',
                      color: store_app_configs_info.window_state_miniplayer_playlist ? '#A4A4A4' : '#FFFFFF',
                    }"
                    style="text-align: left;">
                {{ item.duration_txt }}
              </span>
              <span class="index"
                    v-if="!store_app_configs_info.window_state_miniplayer_playlist"
                    style="text-align: left;font-size: 15px;">
                {{ index + 1 }}
              </span>
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
          :style="{
            width: store_app_configs_info.window_state_miniplayer_playlist ? '250px' : '460px',
          }"
          style="
            position: absolute;
            overflow-y: auto;overflow-x: hidden"
          @update="onChange"
          v-model="store_playlist_list_info.playlist_MediaFiles_temporary_Sort_Items">
          <div
              v-for="(item, index) in store_playlist_list_info.playlist_MediaFiles_temporary_Sort_Items"
              :key="item.id"
              class="message">
            <div
              :style="{
                width: store_app_configs_info.window_state_miniplayer_playlist ? '280px' : '488px',
                height: store_app_configs_info.window_state_miniplayer_playlist ? '46px' : '70px'
              }"
              class="media_info">
              <div
                  :style="{
                    width: store_app_configs_info.window_state_miniplayer_playlist ? '40px' : '58px',
                    height: store_app_configs_info.window_state_miniplayer_playlist ? '40px' : '58px',
                    marginLeft: store_app_configs_info.window_state_miniplayer_playlist ? '4px' : '10px',
                  }"
                  style="
                  border-radius: 4px; border: 1.5px solid #FFFFFF20;
                  overflow: hidden;">
                <img
                    :key="item.absoluteIndex"
                    :src="item.medium_image_url"
                    @error="handleImageError(item)"
                    style="width: 100%; height: 100%; object-fit: cover;"/>
              </div>
              <div
                :style="{
                  width: store_app_configs_info.window_state_miniplayer_playlist ? '100px' : '200px',
                  fontSize: store_app_configs_info.window_state_miniplayer_playlist ? '13px' : '15px',
                }"
                class="title_playlist">
                <span @click="handleItemClick_title(item.title)">
                  {{ item.title }}
                </span>
                <br>
                <template v-for="artist in item.artist.split(/[\/|｜、]/)">
                  <span
                    :style="{
                      color: store_app_configs_info.window_state_miniplayer_playlist ? '#A4A4A4' : '#FFFFFF',
                    }"
                    @click="handleItemClick_artist(artist)">
                    {{ artist + '&nbsp' }}
                  </span>
                </template>
              </div>
              <span class="duration_txt"
                    :style="{
                      fontSize: store_app_configs_info.window_state_miniplayer_playlist ? '13px' : '15px',
                      color: store_app_configs_info.window_state_miniplayer_playlist ? '#A4A4A4' : '#FFFFFF',
                    }"
                    style="text-align: left;">
                {{ item.duration_txt }}
              </span>
              <span class="index"
                    v-if="!store_app_configs_info.window_state_miniplayer_playlist"
                    style="text-align: left;font-size: 15px;">
                {{ index + 1 }}
              </span>
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
  display: flex;
  align-items: center;
  border-radius: 4px;

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