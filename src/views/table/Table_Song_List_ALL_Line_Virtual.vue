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
  Filter20Filled,MoreCircle20Regular,
} from '@vicons/fluent'
import { Icon } from "@vicons/utils";
import { Add, Close, Menu } from "@vicons/carbon";

////// this_view components of navie ui
import { ref, onMounted, h, computed, watch, onBeforeUnmount } from 'vue';
import {type DropdownOption, NIcon, type InputInst, NImage, NButton} from 'naive-ui';

////// i18n auto lang
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true
})

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
  {label:computed(() => t('filter.title')), key: 'title', state_Sort: state_Sort.Default },
  {label:computed(() => t('entity.artist_other')), key: 'artist', state_Sort: state_Sort.Default },
  {label:computed(() => t('entity.album_other')), key: 'album', state_Sort: state_Sort.Default },
  {label:computed(() => t('filter.releaseYear')), key: 'year', state_Sort: state_Sort.Default },
  {label:computed(() => t('filter.duration')), key: 'duration', state_Sort: state_Sort.Default },
  {label:computed(() => t('filter.dateAdded')), key: 'created_at', state_Sort: state_Sort.Default },
  {label:computed(() => t('filter.recentlyUpdated')), key: 'updated_at', state_Sort: state_Sort.Default },
]);
const options_Sort = computed(() => {
  if(store_view_media_page_logic.page_songlists_options_Sort_key != null && store_view_media_page_logic.page_songlists_options_Sort_key.length > 0){
    options_Sort_key.value.forEach(element => {
      if(element.key === store_view_media_page_logic.page_songlists_options_Sort_key[0].columnKey)
        if(store_view_media_page_logic.page_songlists_options_Sort_key[0].order === state_Sort.Ascend)
          element.state_Sort = state_Sort.Ascend
        else if(store_view_media_page_logic.page_songlists_options_Sort_key[0].order === state_Sort.Descend)
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
  store_view_media_page_logic.list_options_Hand_Sort = true
  const sortersArray: { columnKey: string; order: string }[] = [{ columnKey: String(key), order: _state_Sort_ }];
  store_view_media_page_logic.page_songlists_options_Sort_key = sortersArray

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
      store_view_media_page_logic.list_data_StartUpdate = true
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
    store_view_media_page_logic.page_songlists_keyword = page_songlists_keyword
    bool_input_search = true
    options_Sort_key.value.forEach(element => {
      element.state_Sort = state_Sort.Default
    });
  }else{
    store_view_media_page_logic.list_data_StartUpdate = true
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
          store_view_media_page_logic.list_options_Hand_Sort = true
          store_view_media_page_logic.page_songlists_options_Sort_key = null
        } else {
          const sorter = { columnKey: options_Sort_key.value[i].key, order: options_Sort_key.value[i].state_Sort };
          sortersArray.push(sorter);
          store_view_media_page_logic.list_options_Hand_Sort = true
          store_view_media_page_logic.page_songlists_options_Sort_key = sortersArray
        }
        break;
      }
    }
  }
}
onMounted(() => {
  input_search_Value.value = store_view_media_page_logic.page_songlists_keyword
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
    label: t('nsmusics.view_page.loveSong'),
    key: 'filter_favorite',
    icon() {
      return h(NIcon, null, {
        default: () => h(Heart28Filled)
      });
    }
  }
])
const options_Filter_handleSelect = (key: string | number) => {
  store_view_media_page_logic.page_songlists_selected = 'song_list_love'
  console.log('selected_value_for_songlistall：'+'song_list_love');
  breadcrumbItems.value = store_view_media_page_logic.page_songlists_options.find(option => option.value === 'song_list_love')?.label || '';
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
  
  store_router_history_data_of_media.router_history_model_of_Media_scroller_value = viewEndIndex
}
const stopWatching_router_history_model_of_Media_scroll = watch(() => store_router_history_data_of_media.router_history_model_of_Media_scroll,(newValue) => {
      if (newValue === true) {
        scrollTo(store_router_history_data_of_media.router_history_model_of_Media_scroller_value)
        store_router_history_data_of_media.router_history_model_of_Media_scroll = false
      }
    }
)
const scrollTo = (value :number) => {
  if (dynamicScroller !== null) {
    setTimeout(() => {
      const index = value - (12 + Math.floor((window.innerHeight - 765) / 75))
      dynamicScroller.value.scrollToItem(index);// 1000:15，690:11  75
    }, 100);
  }
}
onMounted(() => {
  scrollTo(store_router_history_data_of_media.router_history_model_of_Media_scroller_value)
});

////// select Dtatsource of artistlists
const breadcrumbItems = ref('所有歌曲');
const page_songlists_handleselected_updatevalue = (value: any) => {
  store_view_media_page_logic.set_media_Files_selected_all(false)
  store_view_media_page_logic.list_selected_Hand_click = true
  store_view_media_page_logic.page_songlists_selected = value
  console.log('selected_value_for_songlistall：'+value);
  breadcrumbItems.value = store_view_media_page_logic.page_songlists_options.find(option => option.value === value)?.label || '';
  bool_start_play.value = true
  store_view_media_page_logic.set_media_Files_selected_all(false)
};

////// router history
const get_router_history_model_pervious = () => {
  store_router_history_data_of_media.get_router_history_model_of_Media(-1)
}
const get_router_history_model_next = () =>  {
  store_router_history_data_of_media.get_router_history_model_of_Media(1)
}

/////// emits audio_info of songlist_view_list
const handleItemClick = () => {
  click_count++
}
const handleItemDbClick = (media_file:Media_File,index:number) => {
  if(bool_start_play.value == true){
    if(click_count >= 2){
      click_count = 0

      store_player_audio_info.this_audio_file_path = media_file.path
      store_player_audio_info.this_audio_lyrics_string = media_file.lyrics
      store_player_audio_info.this_audio_file_medium_image_url = media_file.medium_image_url
      store_player_audio_info.this_audio_singer_name = media_file.artist
      store_player_audio_info.this_audio_singer_id = media_file.artist_id
      store_player_audio_info.this_audio_song_name = media_file.title
      store_player_audio_info.this_audio_song_id = media_file.id
      store_player_audio_info.this_audio_song_rating = media_file.rating
      store_player_audio_info.this_audio_song_favorite = media_file.favorite
      store_player_audio_info.this_audio_album_id = media_file.album_id
      store_player_audio_info.this_audio_album_name = media_file.album
      store_player_audio_info.this_audio_Index_of_absolute_positioning_in_list = index

      store_player_appearance.player_mode_of_lock_playlist = false

      store_player_audio_info.this_audio_restart_play = true
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
  input_search_Value.value = artist//+'accurate_search'+'__artist__'//artist不参与精确搜索
  bool_show_search_area.value = false
  show_search_area()
  click_search()
  scrollTo(0)
}
const handleItemClick_album = (album_id:string) => {
  click_count = 0;
  input_search_Value.value = album_id+'accurate_search'+'__album__'
  bool_show_search_area.value = false
  show_search_area()
  click_search()
  scrollTo(0)
}

////// changed_data write to sqlite
import { Set_MediaInfo_To_LocalSqlite } from '@/features/sqlite3_local_configs/class_Set_MediaInfo_To_LocalSqlite'
let set_MediaInfo_To_LocalSqlite = new Set_MediaInfo_To_LocalSqlite()
const handleItemClick_Favorite = (id: any,favorite: Boolean) => {
  click_count = 0;
  store_local_data_set_mediaInfo.Set_MediaInfo_To_Favorite(id, favorite)

  if (id === store_player_audio_info.this_audio_song_id){
    store_player_audio_info.this_audio_song_favorite = !favorite;
  }
}
let before_rating = false
let after_rating = false;
const handleItemClick_Rating = (id_rating: any) => {
  click_count = 0;
  const [id, rating] = id_rating.split('-');
  if(after_rating) {
    store_local_data_set_mediaInfo.Set_MediaInfo_To_Rating(id, 0);
    if (id === store_player_audio_info.this_audio_song_id){
      store_player_audio_info.this_audio_song_rating = 0;
    }
  }else {
    store_local_data_set_mediaInfo.Set_MediaInfo_To_Rating(id, rating);
    if (id === store_player_audio_info.this_audio_song_id){
      store_player_audio_info.this_audio_song_rating = rating;
    }
  }
}

////// playlist
import { useMessage } from 'naive-ui'
const message = useMessage()
/// add playlist
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
import {store_player_audio_info} from "@/store/player/store_player_audio_info";
import {store_playlist_list_info} from  "@/store/playlist/store_playlist_list_info"
import {store_playlist_list_logic} from "@/store/playlist/store_playlist_list_logic";
import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";
import {store_player_appearance} from "@/store/player/store_player_appearance";
import {store_router_history_data_of_media} from "@/store/router/store_router_history_data_of_media";
import {store_local_data_set_mediaInfo} from "@/store/local/local_data_synchronization/store_local_data_set_mediaInfo";
import type {SelectBaseOption} from "naive-ui/es/select/src/interface";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {
  store_server_data_set_playlistInfo
} from "@/store/server/server_data_synchronization/store_server_data_set_playlistInfo";
import {
  Set_Navidrome_Data_To_LocalSqlite
} from "@/features/servers_configs/navidrome_api/middleware/class_Set_Navidrome_Data_To_LocalSqlite";
import {store_server_users} from "@/store/server/store_server_users";
import {
  store_server_data_set_mediaInfo
} from "@/store/server/server_data_synchronization/store_server_data_set_mediaInfo";
function getCurrentDateTime() {
  return new Date().toLocaleString(
      'zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }
  ).replace(/\//g, '-');
}
const Type_Add_Playlist = ref(false)
const playlist_set_of_addPlaylist_of_playlistname = ref('')
const playlist_set_of_addPlaylist_of_comment = ref('')
// const playlist_set_of_addPlaylist_of_duration = ref(0)
// const playlist_set_of_addPlaylist_of_song_count = ref(0)
const playlist_set_of_addPlaylist_of_public = ref(false)
// const playlist_set_of_addPlaylist_of_owner_id = ref('')
async function update_playlist_addPlaylist(){
  try{
    if(store_server_user_model.model_select === 'navidrome'){
      // send json to navidrome
      let getCreatePlaylist_set_id = await store_server_data_set_playlistInfo.Set_PlaylistInfo_To_Update_CreatePlaylist_of_ND(
          playlist_set_of_addPlaylist_of_playlistname.value,
          playlist_set_of_addPlaylist_of_public.value
      )
      console.log('CreatePlaylist_of_ND: ' + store_server_user_model.username + ': ' +
          getCreatePlaylist_set_id
      )
      await store_server_data_set_playlistInfo.Set_PlaylistInfo_To_Update_SetPlaylist_of_ND(
          getCreatePlaylist_set_id,
          playlist_set_of_addPlaylist_of_playlistname.value,
          playlist_set_of_addPlaylist_of_comment.value,
          playlist_set_of_addPlaylist_of_public.value
      )
      console.log('SetPlaylist_of_ND: ' + store_server_user_model.username + ': ' +
          getCreatePlaylist_set_id
      )
      // get server all playlist
      await store_server_user_model.Get_UserData_Synchronize_ToLocal_of_ND()
      //
      console.log('SetPlaylist_of_Local: '+
          getCreatePlaylist_set_id + ': ' +
          playlist_set_of_addPlaylist_of_playlistname.value + ': ' +
          playlist_set_of_addPlaylist_of_comment.value + ': ' +
          playlist_set_of_addPlaylist_of_public.value
      )
    }else {
      store_playlist_list_logic.get_playlist_tracks_temporary_add(playlist_set_of_addPlaylist_of_playlistname.value)
    }
    Type_Add_Playlist.value = !Type_Add_Playlist.value
  }catch (e) {
    console.error(e)
  }
}
/// update playlist
const Type_Update_Playlist = ref(false)
const playlist_update_emit_id = ref<string>()
const playlist_set_of_updatePlaylist_of_playlistcomment = ref('')
const playlist_set_of_updatePlaylist_of_comment = ref('')
const playlist_set_of_updatePlaylist_of_public = ref(false)
function update_playlist_set_of_updatePlaylist_of_playlistname(value: Array | string | number | null, option: SelectBaseOption | null | SelectBaseOption[]){
  playlist_update_emit_id.value = value
  playlist_set_of_updatePlaylist_of_playlistcomment.value = option.label
  // if(store_server_user_model.model_select === 'navidrome'){
  //   playlist_set_of_updatePlaylist_of_comment.value =
  //   playlist_set_of_updatePlaylist_of_public.value =
  // }
}
async function update_playlist_updatePlaylist(){
  try{
    const playlist = {
      id: playlist_update_emit_id.value,
      name: playlist_set_of_updatePlaylist_of_playlistcomment.value
    }
    store_playlist_list_logic.get_playlist_tracks_temporary_update(playlist)
    Type_Update_Playlist.value = !Type_Update_Playlist.value

    if(store_server_user_model.model_select === 'navidrome'){
      await store_server_data_set_playlistInfo.Set_PlaylistInfo_To_Update_SetPlaylist_of_ND(
          playlist_update_emit_id.value,
          playlist_set_of_updatePlaylist_of_playlistcomment.value,
          playlist_set_of_updatePlaylist_of_comment.value,
          playlist_set_of_updatePlaylist_of_public.value
      )
    }
  }catch (e) {
    console.error(e)
  }
}
async function update_playlist_deletePlaylist(){
  try{
    store_playlist_list_logic.get_playlist_tracks_temporary_delete(playlist_update_emit_id.value)
    Type_Update_Playlist.value = !Type_Update_Playlist.value

    if(store_server_user_model.model_select === 'navidrome'){
      await store_server_data_set_playlistInfo.Set_PlaylistInfo_To_Update_DeletePlaylist_of_ND(
          playlist_update_emit_id.value
      )
    }
  }catch (e) {
    console.error(e)
  }
}
/// update media_file
async function update_playlist_addMediaFile(id: any, playlist_id: any){
  try{
    await store_local_data_set_mediaInfo.Set_MediaInfo_Add_Selected_Playlist(id,playlist_id)
    message.success(t('common.add'))
    store_playlist_list_logic.get_playlist_tracks_temporary_update_media_file(true)
  }catch (e) {
    console.error(e)
  }
}
async function update_playlist_deleteMediaFile(id: any){
  try{
    if(store_view_media_page_logic.page_songlists_selected === 'song_list_all'){

    }else if(store_view_media_page_logic.page_songlists_selected === 'song_list_love'){
      await store_local_data_set_mediaInfo.Set_MediaInfo_To_Favorite(id, true)
    }else if(store_view_media_page_logic.page_songlists_selected === 'song_list_recently'){

    }else{
      await store_local_data_set_mediaInfo.Set_MediaInfo_Delete_Selected_Playlist(
          id,
          store_view_media_page_logic.page_songlists_selected
      )
    }
    store_view_media_page_info.media_Files_temporary = store_view_media_page_info.media_Files_temporary.filter((media: any) => media.id !== id);
    message.success(t('common.delete'))
    store_playlist_list_logic.get_playlist_tracks_temporary_update_media_file(true)
  }catch (e) {
    console.error(e)
  }
}
/// update selected media_file
const Type_Selected_Media_File_To_Playlist = ref(false)
async function update_playlist_addMediaFile_selected(playlist_id: any)
{
  await store_view_media_page_logic.get_selected_playlist_add_MediaFile(playlist_id)
  message.success(t('common.add'))
  Type_Selected_Media_File_To_Playlist.value = false;
  click_open_bulk_operation()
}
async function update_lovelist_addMediaFile_selected()
{
  store_view_media_page_logic.get_selected_lovelist_add_MediaFile(true)
  message.success(t('common.add'))
  Type_Selected_Media_File_To_Playlist.value = false;
  click_open_bulk_operation()
}
async function update_button_deleteMediaFile_selected(){
  if(store_view_media_page_logic.page_songlists_selected === 'song_list_all'){
    await update_locallist_deleteMediaFile_selected(store_view_media_page_logic.page_songlists_selected)
  }else if(store_view_media_page_logic.page_songlists_selected === 'song_list_love'){
    await update_lovelist_deleteMediaFile_selected(store_view_media_page_logic.page_songlists_selected)
  }else if(store_view_media_page_logic.page_songlists_selected !== 'song_list_all'){
    await update_playlist_deleteMediaFile_selected(store_view_media_page_logic.page_songlists_selected)
  }
  store_view_media_page_info.media_Files_temporary =
      store_view_media_page_info.media_Files_temporary.filter(
          file => !store_view_media_page_info.media_Files_selected.some(
              selected => selected.id === file.id));
  message.success(t('common.delete'))
}
async function update_playlist_deleteMediaFile_selected(playlist_id: any)
{
  await store_view_media_page_logic.get_selected_playlist_delete_MediaFile(playlist_id)
  Type_Selected_Media_File_To_Playlist.value = false;
  click_open_bulk_operation()
}
async function update_locallist_deleteMediaFile_selected(playlist_id: any)
{
  store_view_media_page_logic.get_selected_locallist_delete_MediaFile(playlist_id)
  Type_Selected_Media_File_To_Playlist.value = false;
  click_open_bulk_operation()
}
async function update_lovelist_deleteMediaFile_selected(playlist_id: any)
{
  store_view_media_page_logic.get_selected_lovelist_delete_MediaFile(playlist_id)
  Type_Selected_Media_File_To_Playlist.value = false;
  click_open_bulk_operation()
}
async function update_recentlist_deletetMediaFile_selected(playlist_id: any)
{
  store_view_media_page_logic.get_selected_recentlist_deletet_MediaFile(playlist_id)
  Type_Selected_Media_File_To_Playlist.value = false;
  click_open_bulk_operation()
}

////// bulk_operation and select_line
const click_select_SongList_ALL_Line = () => {
  if(store_view_media_page_info.media_Files_selected.length == 0){
    store_view_media_page_logic.set_media_Files_selected_all(true)
  }else{
    store_view_media_page_logic.set_media_Files_selected_all(false)
  }
}
const click_open_bulk_operation = () => {
  if(bool_start_play.value == true)
  {
    bool_start_play.value = false
    store_view_media_page_logic.set_media_Files_selected_all(false)
  }
  else{
    bool_start_play.value = true
  }
}
////// Right_click_on_songline show menu
let click_count = 0
const bool_start_play = ref<boolean>(true)

////// view songlist_view Remove data
onBeforeUnmount(() => {
  stopWatching_collapsed_width()
  stopWatching_window_innerWidth()
  stopWatching_router_history_model_of_Media_scroll()
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
          <n-icon size="20" :depth="2"><ChevronLeft16Filled/></n-icon>
        </template>
      </n-button>
      <div style="margin-top: 4px;">
        {{ store_router_history_data_of_media.router_select_history_date_of_Media?.id ?? '' }} / {{ store_router_history_data_of_media.router_history_datas_of_Media?.length ?? '' }}
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

      <n-button
          v-if="store_view_media_page_logic.page_songlists_selected !== 'song_list_recently'"
          quaternary circle size="medium" style="margin-left:4px" @click="click_open_bulk_operation">
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
        <n-button quaternary circle size="medium" style="margin-left:4px" @click="Type_Selected_Media_File_To_Playlist = !Type_Selected_Media_File_To_Playlist">
          <template #icon>
            <n-icon :size="20" :depth="2"><AddCircle32Regular/></n-icon>
          </template>
        </n-button>
        <n-button
          v-if="
            (store_server_user_model.model_select !== 'navidrome') ||
            (store_server_user_model.model_select === 'navidrome' && store_view_media_page_logic.page_songlists_selected !== 'song_list_all')
          "
          quaternary circle size="medium" style="margin-left:4px" @click="update_button_deleteMediaFile_selected">
          <template #icon>
            <n-icon :size="20" :depth="2"><Delete20Regular/></n-icon>
          </template>
        </n-button>
        <n-p style="margin-top: 6px;"> {{ $t('nsmusics.view_page.selectedSong') + ' ' + store_view_media_page_info.media_Files_selected.length }} * </n-p>
      </n-space>
    </n-space>
    <div class="dynamic-scroller-demo">
      <DynamicScroller
          class="table" ref="dynamicScroller" :style="{ width: 'calc(100vw - ' + (collapsed_width - 40) + 'px)'}"
          :items="store_view_media_page_info.media_Files_temporary"
          :minItemSize="50"
          :emit-update="true"
          @resize="onResize"
          @update="onUpdate">
        <template #before>
          <div class="notice">
            <div
              :style="{ width: 'calc(100vw - ' + (collapsed_width - 2) + 'px)'}"
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
                <n-gi v-for="songlist in store_view_media_page_logic.page_songlists_statistic" :key="songlist.id">
                  <n-statistic :label="songlist.label" :value="songlist.song_count" />
                </n-gi>
              </n-grid>
              <template #title>
                <n-space vertical style="margin-top:14px;margin-left: 10px;">
                  <n-breadcrumb separator="|">
                    <n-breadcrumb-item style="font-size: 22px">{{ $t('entity.track_other') }}</n-breadcrumb-item>
                    <n-breadcrumb-item>
                      <n-button text @click="handleItemClick_album(store_player_audio_info.page_top_album_id)">
                        <n-ellipsis
                            style="text-align: left;font-size: 22px;width: 660px;">
                          {{ store_player_audio_info.page_top_album_name }}
                        </n-ellipsis>
                      </n-button>
                    </n-breadcrumb-item>
                  </n-breadcrumb>
                  <n-space>
                    <n-select
                      :value="store_view_media_page_logic.page_songlists_selected"
                      :options="store_view_media_page_logic.page_songlists_options" style="width: 166px;"
                      :on-update:value="page_songlists_handleselected_updatevalue" />
                    <n-button secondary strong @click="Type_Update_Playlist = !Type_Update_Playlist">
                      <template #icon>
                        <n-icon>
                          <Menu />
                        </n-icon>
                      </template>
                    </n-button>
                    <n-button secondary strong @click="Type_Add_Playlist = !Type_Add_Playlist">
                      <template #icon>
                        <n-icon>
                          <Add />
                        </n-icon>
                      </template>
                    </n-button>
                  </n-space>
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
            :data-active="active"
            class="message"
            :style="{ width: 'calc(100vw - ' + (collapsed_width) + 'px)'}"
            @click="handleItemClick"
            @Dblclick="handleItemDbClick(item,index)">
            <div class="media_info" :style="{ width: 'calc(100vw - ' + (collapsed_width) + 'px)'}">
              <input type="checkbox" class="checkbox"
                 v-if="!bool_start_play"
                 v-model="item.selected"
                 @change="(event) => {
                  item.selected = event.target.checked;
                  store_view_media_page_logic.set_media_Files_selected(item)
                }"
              />
              <div
                  style="margin-left: 8px;
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
              <div class="songlist_album">
                <span @click="handleItemClick_album(item.album_id)">{{ item.album }}</span>
              </div>
              <div style="margin-left: auto; margin-right: 0px; width: 240px; display: flex; flex-direction: row;">
                <rate
                  class="viaSlot" style="margin-right: 20px;"
                  :length="5"
                  v-model="item.rating"
                  @before-rate="(value) => {
                    if(item.rating == 1){
                      before_rating = true
                    }
                  }"
                  @after-rate="(value) => {
                    if(item.rating == 1 && before_rating == true){
                      after_rating = true
                      before_rating = false
                    }
                    handleItemClick_Rating(item.id + '-' + value);
                    if (after_rating) {
                      item.rating = 0
                      after_rating = false
                    }
                  }"
                />
                <button
                  @click="handleItemClick_Favorite(item.id, item.favorite); item.favorite = !item.favorite;"
                  style="
                    border: 0px; background-color: transparent;
                    width: 28px; height: 28px;
                    margin-top: 2px;margin-right: 10px;
                    cursor: pointer;
                  "
                >
                  <template v-if="item.favorite">
                    <icon :size="20" color="red" style="margin-left: -2px; margin-top: 3px;"><Heart28Filled/></icon>
                  </template>
                  <template v-else-if="!store_app_configs_info.update_theme">
                    <icon color="#101014" :size="20" style="margin-left: -2px; margin-top: 3px;"><Heart24Regular/></icon>
                  </template>
                  <template v-else-if="store_app_configs_info.update_theme">
                    <icon color="#FAFAFC" :size="20" style="margin-left: -2px; margin-top: 3px;"><Heart24Regular/></icon>
                  </template>
                </button>
                <VDropdown :distance="6" v-if="active">
                  <button
                    style="
                      border: 0px; background-color: transparent;
                      width: 28px; height: 28px;
                      margin-top: 4px;
                      cursor: pointer;
                    "
                    @click="click_count = 0"
                  >
                    <template v-if="!store_app_configs_info.update_theme">
                      <icon :size="20"><MoreCircle20Regular/></icon>
                    </template>
                    <template v-else>
                      <icon :size="20" color="#FFFFFF"><MoreCircle20Regular/></icon>
                    </template>
                  </button>
                  <template #popper>
                    <VMenu
                      key="001"
                      placement="right-start"
                      style="width:100px;"
                      instant-move>
                      <button class="songlist_more" style="width: 100px;height: 24px;border: 0px; background-color: transparent;">
                        {{ $t('form.addToPlaylist.title') }}
                      </button>
                      <template #popper>
                        <button
                          v-for="n in store_playlist_list_info.playlist_names_ALLLists"
                          :key="n.value"
                          class="songlist_more"
                          style="width: 100px;height: 24px;border: 0px; background-color: transparent;display: block;"
                          @click="update_playlist_addMediaFile(item.id,n.value)"
                        >
                          {{ n.label }}
                        </button>
                      </template>
                    </VMenu>
                    <button
                      class="songlist_more"
                      v-if="
                        store_view_media_page_logic.page_songlists_selected !== 'song_list_all' &&
                        store_view_media_page_logic.page_songlists_selected !== 'song_list_love' &&
                        store_view_media_page_logic.page_songlists_selected !== 'song_list_recently'
                      "
                      style="width: 100px;height: 24px;border: 0px; background-color: transparent;"
                      @click="update_playlist_deleteMediaFile(item.id)"
                    >
                      {{ $t('common.delete') }}
                    </button>
                  </template>
                </VDropdown>
              </div>
              <span class="duration_txt" style="margin-left: auto;margin-top: 4px;margin-right: 0px;text-align: left;font-size: 15px;" @click="click_count = 0">
                {{ item.duration_txt }}
              </span>
              <span class="index" style="margin-left: auto; text-align: left;font-size: 15px;margin-top: 4px;" @click="click_count = 0">
                {{ index + 1 }}
              </span>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>

  </n-space>
  <!-- 管理播放列表 -->
  <n-modal
    v-model:show="Type_Update_Playlist">
    <n-card style="width: 450px;border-radius: 6px;">
      <n-space
          vertical size="large" style="width: 400px;">
        <n-space justify="space-between">
          <span style="font-size: 20px;font-weight: 600;">{{ $t('common.manage') + $t('entity.playlist_other') }}</span>
          <n-button tertiary size="small" @click="Type_Update_Playlist = !Type_Update_Playlist;playlist_set_of_updatePlaylist_of_playlistcomment = ''">
            <template #icon>
              <n-icon>
                <Close />
              </n-icon>
            </template>
          </n-button>
        </n-space>
        <n-select
          :options="store_playlist_list_info.playlist_names_ALLLists" style="width: 166px;"
          :on-update:value="update_playlist_set_of_updatePlaylist_of_playlistname" />
        <n-form>
          <n-space vertical style="margin-bottom: 10px;">
            <span>{{ $t('common.name') }}</span>
            <n-input clearable placeholder="" v-model:value="playlist_set_of_updatePlaylist_of_playlistcomment"/>
          </n-space>
<!--          <n-space vertical style="margin-bottom: 10px;" v-if="store_server_user_model.model_select === 'navidrome'">-->
<!--            <span>{{ $t('filter.comment') }}</span>-->
<!--            <n-input clearable placeholder="" v-model:value="playlist_set_of_updatePlaylist_of_comment"/>-->
<!--          </n-space>-->
<!--          <n-space vertical style="margin-bottom: 10px;" v-if="store_server_user_model.model_select === 'navidrome'">-->
<!--            <span>{{ $t('form.createPlaylist.input_public') }}</span>-->
<!--            <n-switch v-model:value="playlist_set_of_updatePlaylist_of_public"/>-->
<!--          </n-space>-->
        </n-form>
        <n-space justify="end">
          <n-button strong secondary type="error" @click="update_playlist_deletePlaylist();Type_Update_Playlist = !Type_Update_Playlist;playlist_set_of_updatePlaylist_of_playlistcomment = ''">
            {{ $t('common.delete') }}
          </n-button>
          <n-button strong secondary type="info" @click="update_playlist_updatePlaylist();">
            {{ $t('common.save') }}
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
  <!-- 添加播放列表 -->
  <n-modal
    v-model:show="Type_Add_Playlist">
    <n-card style="width: 450px;border-radius: 6px;">
      <n-space
          vertical size="large" style="width: 400px;">
        <n-space justify="space-between">
          <span style="font-size: 20px;font-weight: 600;">{{ $t('common.add') + $t('entity.playlist_other') }}</span>
          <n-button tertiary size="small" @click="Type_Add_Playlist = !Type_Add_Playlist">
            <template #icon>
              <n-icon>
                <Close />
              </n-icon>
            </template>
          </n-button>
        </n-space>
        <n-form>
          <n-space vertical style="margin-bottom: 10px;">
            <span>{{ $t('common.name') }}</span>
            <n-input clearable placeholder="" v-model:value="playlist_set_of_addPlaylist_of_playlistname"/>
          </n-space>
<!--          <n-space vertical style="margin-bottom: 10px;" v-if="store_server_user_model.model_select === 'navidrome'">-->
<!--            <span>{{ $t('filter.comment') }}</span>-->
<!--            <n-input clearable placeholder="" v-model:value="playlist_set_of_addPlaylist_of_comment"/>-->
<!--          </n-space>-->
<!--          <n-space vertical style="margin-bottom: 10px;" v-if="store_server_user_model.model_select === 'navidrome'">-->
<!--            <span>{{ $t('form.createPlaylist.input_public') }}</span>-->
<!--            <n-switch v-model:value="playlist_set_of_addPlaylist_of_public" />-->
<!--          </n-space>-->
        </n-form>
        <n-space justify="end">
          <n-button strong secondary type="info" @click="update_playlist_addPlaylist();">
            {{ $t('common.save') }}
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
  <!-- 选中歌曲添加 -->
  <n-modal
    v-model:show="Type_Selected_Media_File_To_Playlist">
    <n-card style="width: 450px;border-radius: 6px;">
      <n-space
        vertical size="large" style="width: 400px;">
        <n-space justify="space-between">
          <span style="font-size: 20px;font-weight: 600;">{{ $t('nsmusics.view_page.selectedSong') + ' ' + store_view_media_page_info.media_Files_selected.length + ' * ' + $t('form.addToPlaylist.title')  }}</span>
          <n-button tertiary size="small" @click="Type_Selected_Media_File_To_Playlist = !Type_Selected_Media_File_To_Playlist;">
            <template #icon>
              <n-icon>
                <Close />
              </n-icon>
            </template>
          </n-button>
        </n-space>
        <n-space>
          <n-button
            key="song_love"
            class="songlist_more"
            style="width: 100px;height: 24px;border: 0px; background-color: transparent;display: block;"
            @click="update_lovelist_addMediaFile_selected"
          >
            {{ $t('nsmusics.view_page.loveSong') }}
          </n-button>
          <n-button
            v-for="n in store_playlist_list_info.playlist_names_ALLLists"
            :key="n.value"
            class="songlist_more"
            style="width: 100px;height: 24px;border: 0px; background-color: transparent;display: block;"
            @click="update_playlist_addMediaFile_selected(n.value)"
          >
            {{ n.label }}
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
  <!--  -->
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
  transform: scale(1.3);
  margin-left: 12px;
}
.index{
  width: 40px;
  margin-left: 12px;
}
.songlist_title{
  margin-left: 10px;
  text-align: left;
  width: 240px;
  font-size: 15px;
  overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
}
.songlist_title :hover{
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}
.songlist_album{
  margin-left: 10px;
  text-align: left;
  width: 180px;
  overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
}
.songlist_album :hover{
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}
.duration_txt{
  margin-left: 10px;
  text-align: left;
  width: 40px;
}
.songlist_more:hover {
  color: #3DC3FF;
}

.scorller_to_SortAZ{
  width: 16px;
  height: calc(100vh - 200px);
  position: absolute;
  top: 106px;right: 24px;
  border-radius: 6px;
}

.RateCustom.viaSlot .icon {
  width: 25px;
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
</style>../../models/data_Change_For_Sqlite/class_Set_MediaInfo_To_LocalSqlite