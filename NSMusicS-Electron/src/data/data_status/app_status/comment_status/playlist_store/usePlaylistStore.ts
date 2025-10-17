import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// 类型定义
interface Media_File {
  id: string
  path?: string
  absoluteIndex?: number
  [key: string]: any
}

interface Play_List {
  id: string
  name: string
  [key: string]: any
}

// 导入依赖
import { store_system_configs_save } from '@/data/data_pinia_stores/local_system_stores/store_system_configs_save'
import { store_player_audio_info } from '@/views/view_app/page/page_player/store/store_player_audio_info'
import { store_server_user_model } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
import { store_view_media_page_info } from '@/views/view_app/page/page_media/store/store_view_media_page_info'
import { store_player_audio_logic } from '@/views/view_app/page/page_player/store/store_player_audio_logic'
import { Get_LocalSqlite_PlaylistInfo } from '@/data/data_repository/app_repository/LocalSqlite_Get_PlaylistInfo'
import { store_general_model_player_list } from '@/data/data_pinia_stores/server_api_stores/server_api_core/components/player_list/store_general_model_player_list'

export const usePlaylistStore = defineStore('playlist', () => {
  // 外观状态
  const playlist_show = ref(false)
  const playlist_use_model = ref('media')

  // 列表信息状态
  const playlist_names_ALLLists = ref<{ label: string; value: string }[]>([])
  const playlist_datas_CurrentPlayList_ALLMediaIds = ref<string[]>([])
  const playlist_tracks_temporary_of_ALLLists = ref<{ playlist: Play_List; playlist_tracks: any[] }[]>([])
  const playlist_MediaFiles_metadata = ref<Media_File[]>([])
  const playlist_MediaFiles_temporary = ref<Media_File[]>([])
  const playlist_MediaFiles_temporary_carousel = ref<Media_File[]>([])
  const playlist_MediaFiles_temporary_carousel_lyrics = ref<Media_File[]>([])
  const playlist_DragSort_Model = ref(false)
  const playlist_Menu_Item_Id = ref('')
  const playlist_Menu_Item_Rating = ref(0)
  const playlist_Menu_Item_IndexId = ref('')
  const playlist_Menu_Item = ref<Media_File | null>(null)
  const playlist_MediaFiles_temporary_Sort_Items = ref<Media_File[]>([])
  const playlist_Sort_StartIndex = ref(0)
  const playlist_Sort_EndIndex = ref(0)

  // 逻辑状态
  const playlist_names_StartUpdate = ref(false)
  const media_page_handleItemDbClick = ref(false)

  // 方法定义
  function menu_item_open_drag_sort() {
    playlist_DragSort_Model.value = true
    playlist_MediaFiles_temporary_Sort_Items.value = []

    const item: Media_File | undefined = playlist_MediaFiles_temporary.value.find(
      (mediaFile: Media_File) => mediaFile.id === playlist_Menu_Item_Id.value
    )
    if (item != undefined && item != 'undefined') {
      const index = playlist_MediaFiles_temporary.value.findIndex(
        (mediaFile: Media_File) => mediaFile.id === item.id
      )

      const startIndex = Math.max(0, index - 4)
      const endIndex = Math.min(
        playlist_MediaFiles_temporary.value.length - 1,
        index + 45
      )

      playlist_MediaFiles_temporary_Sort_Items.value = playlist_MediaFiles_temporary.value.slice(startIndex, endIndex + 1)
      playlist_Sort_StartIndex.value = startIndex
      playlist_Sort_EndIndex.value = endIndex
    }
  }

  function menu_item_reinsert_drag_sort() {
    const originalList = playlist_MediaFiles_temporary.value
    const sortedList = playlist_MediaFiles_temporary_Sort_Items.value

    for (let i = sortedList.length - 1; i >= 0; i--) {
      const item = sortedList[i]
      const index = originalList.findIndex((mediaFile: Media_File) => mediaFile.id === item.id)
      if (index !== -1) {
        originalList.splice(index, 1)
      }
    }

    for (let i = 0; i < sortedList.length; i++) {
      const item = sortedList[i]
      const originalIndex = playlist_Sort_StartIndex.value + i
      originalList.splice(originalIndex, 0, item)
    }

    originalList.forEach((item: Media_File, index: number) => {
      item.absoluteIndex = index
    })

    playlist_datas_CurrentPlayList_ALLMediaIds.value = playlist_MediaFiles_temporary.value.map((item: any) => item.id)
    store_system_configs_save.save_system_playlist_item_id_config()
  }

  function reset_carousel() {
    const hasSameAbsoluteIndex = playlist_MediaFiles_temporary_carousel.value.some(
      (item: Media_File) => item.path === store_player_audio_info.this_audio_file_path
    )
    if (hasSameAbsoluteIndex) {
      return
    }
    if (playlist_MediaFiles_temporary.value.length > 1) {
      if (!isNaN(store_player_audio_info.this_audio_Index_of_play_list)) {
        const startIndex = Math.max(store_player_audio_info.this_audio_Index_of_play_list - 14, 0)
        const endIndex = Math.min(
          startIndex + 30,
          playlist_MediaFiles_temporary.value.length
        )
        playlist_MediaFiles_temporary_carousel.value = playlist_MediaFiles_temporary.value.slice(startIndex, endIndex)
      } else {
        playlist_MediaFiles_temporary_carousel.value = playlist_MediaFiles_temporary.value.slice(0, 30)
      }
      store_player_audio_info.set_carousel_index()
    } else if (playlist_MediaFiles_temporary.value.length === 1) {
      playlist_MediaFiles_temporary_carousel.value = [
        playlist_MediaFiles_temporary.value[0],
        playlist_MediaFiles_temporary.value[0],
      ]
      store_player_audio_info.set_carousel_index()
    }
  }

  async function reset_data() {
    playlist_names_ALLLists.value = []
    playlist_tracks_temporary_of_ALLLists.value = []
    if (store_server_user_model.model_select === 'server') {
      await store_general_model_player_list.get_playlists_info()
    } else {
      try {
        const get_PlaylistInfo_From_LocalSqlite = new Get_LocalSqlite_PlaylistInfo()
        const playlist_temporary = get_PlaylistInfo_From_LocalSqlite.Get_Playlist()
        playlist_temporary.forEach((item: Play_List) => {
          playlist_names_ALLLists.value.push({
            label: item.name,
            value: item.id,
          })
          playlist_tracks_temporary_of_ALLLists.value.push({
            playlist: item,
            playlist_tracks: get_PlaylistInfo_From_LocalSqlite.Get_Playlist_Tracks(item.id),
          })
        })
      } catch (e) {
        console.error(e)
      }
    }
  }

  async function handleItemDbClick(media_file: Media_File, index: number) {
    if (store_server_user_model.model_server_type_of_web) {
      // Data synchronization
      playlist_MediaFiles_temporary.value.forEach((row: Media_File) => {
        const existingIndex = store_view_media_page_info.media_Files_temporary.findIndex(
            (item: Media_File) => item.id === row.id
          )
        if (existingIndex === -1) {
          const newRow = { ...row }
          delete newRow.play_id
          store_view_media_page_info.media_Files_temporary.push(newRow)
        }
      })
    }
    await store_player_audio_logic.update_current_media_info(media_file, index)
    media_page_handleItemDbClick.value = false
    store_player_audio_info.this_audio_restart_play = true
  }

  // 监听器
  watch(
    () => playlist_MediaFiles_temporary.value,
    async () => {
      reset_carousel()
      store_system_configs_save.save_system_playlist_item_id_config()
    },
    { deep: true }
  )

  watch(
    () => playlist_MediaFiles_temporary_Sort_Items.value,
    async () => {
      store_system_configs_save.save_system_playlist_item_id_config()
    },
    { deep: true }
  )

  // 返回状态和方法
  return {
    // 外观状态
    playlist_show,
    playlist_use_model,
    
    // 列表信息状态
    playlist_names_ALLLists,
    playlist_datas_CurrentPlayList_ALLMediaIds,
    playlist_tracks_temporary_of_ALLLists,
    playlist_MediaFiles_metadata,
    playlist_MediaFiles_temporary,
    playlist_MediaFiles_temporary_carousel,
    playlist_MediaFiles_temporary_carousel_lyrics,
    playlist_DragSort_Model,
    playlist_Menu_Item_Id,
    playlist_Menu_Item_Rating,
    playlist_Menu_Item_IndexId,
    playlist_Menu_Item,
    playlist_MediaFiles_temporary_Sort_Items,
    playlist_Sort_StartIndex,
    playlist_Sort_EndIndex,
    
    // 逻辑状态
    playlist_names_StartUpdate,
    media_page_handleItemDbClick,
    
    // 方法
    menu_item_open_drag_sort,
    menu_item_reinsert_drag_sort,
    reset_carousel,
    reset_data,
    handleItemDbClick
  }
})