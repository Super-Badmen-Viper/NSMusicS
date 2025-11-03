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
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
import { usePlayerAudioStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAudioStore'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { usePageMediaStore } from '@/data/data_status/app_status/page_status/media_store/usePageMediaStore'
import { usePlayerSettingStore } from '../player_store/usePlayerSettingStore'
import { Get_LocalSqlite_PlaylistInfo } from '@/data/data_repository/app_repository/LocalSqlite_Get_PlaylistInfo'
import { store_general_model_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_model_player_list'
import { store_general_fetch_media_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_file/store_general_fetch_media_list'
import { store_general_fetch_media_cue_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_cue_file/store_general_fetch_media_cue_list'
import { store_general_fetch_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_fetch_player_list'

export const usePlaylistStore = defineStore('playlist', () => {
  // 外观状态
  const playlist_show = ref(false)
  const playlist_use_model = ref('media')

  // 列表信息状态
  const playlist_names_ALLLists = ref<{ label: string; value: string }[]>([])
  const playlist_datas_CurrentPlayList_ALLMediaIds = ref<string[]>([])
  const playlist_tracks_temporary_of_ALLLists = ref<
    { playlist: Play_List; playlist_tracks: any[] }[]
  >([])
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
    if (item !== undefined && item !== null) {
      const index = playlist_MediaFiles_temporary.value.findIndex(
        (mediaFile: Media_File) => mediaFile.id === item.id
      )

      const startIndex = Math.max(0, index - 4)
      const endIndex = Math.min(playlist_MediaFiles_temporary.value.length - 1, index + 45)

      playlist_MediaFiles_temporary_Sort_Items.value = playlist_MediaFiles_temporary.value.slice(
        startIndex,
        endIndex + 1
      )
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

    playlist_datas_CurrentPlayList_ALLMediaIds.value = playlist_MediaFiles_temporary.value.map(
      (item: any) => item.id
    )
    store_system_configs_save.save_system_playlist_item_id_config()
  }

  function reset_carousel() {
    const playerAudioStore = usePlayerAudioStore()
    const hasSameAbsoluteIndex = playlist_MediaFiles_temporary_carousel.value.some(
      (item: Media_File) => item.path === playerAudioStore.this_audio_file_path
    )
    if (hasSameAbsoluteIndex) {
      return
    }
    if (playlist_MediaFiles_temporary.value.length > 1) {
      if (!isNaN(playerAudioStore.this_audio_Index_of_play_list)) {
        const startIndex = Math.max(playerAudioStore.this_audio_Index_of_play_list - 14, 0)
        const endIndex = Math.min(startIndex + 30, playlist_MediaFiles_temporary.value.length)
        playlist_MediaFiles_temporary_carousel.value = playlist_MediaFiles_temporary.value.slice(
          startIndex,
          endIndex
        )
      } else {
        playlist_MediaFiles_temporary_carousel.value = playlist_MediaFiles_temporary.value.slice(
          0,
          30
        )
      }
      playerAudioStore.set_carousel_index()
    } else if (playlist_MediaFiles_temporary.value.length === 1) {
      playlist_MediaFiles_temporary_carousel.value = [
        playlist_MediaFiles_temporary.value[0],
        playlist_MediaFiles_temporary.value[0],
      ]
      playerAudioStore.set_carousel_index()
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
      const pageMediaStore = usePageMediaStore()
      playlist_MediaFiles_temporary.value.forEach((row: Media_File) => {
        const existingIndex = pageMediaStore.media_Files_temporary.findIndex(
          (item: Media_File) => item.id === row.id
        )
        if (existingIndex === -1) {
          const newRow = { ...row }
          delete newRow.play_id
          pageMediaStore.media_Files_temporary.push(newRow)
        }
      })
    }
    const playerSettingStore = usePlayerSettingStore()
    await playerSettingStore.update_current_media_info(media_file, index)
    media_page_handleItemDbClick.value = false
    const playerAudioStore = usePlayerAudioStore()
    playerAudioStore.this_audio_restart_play = true
  }

  // 监听器
  watch(
    () => {
      playlist_show
    },
    (newValue) => {
      if (newValue) {
        store_general_fetch_media_list._load_model = 'play'
        store_general_fetch_media_cue_list._load_model = 'play'
        const index = playlist_MediaFiles_temporary.value.length / 30
        if (index > 0) {
          store_general_fetch_player_list._start = 30 * index - 30
          store_general_fetch_player_list._end = 30 * index
        }
      } else {
        store_general_fetch_media_list._load_model = 'search'
        store_general_fetch_media_cue_list._load_model = 'search'
      }
    }
  )

  watch(
    () => playlist_MediaFiles_temporary,
    async () => {
      reset_carousel()
      store_system_configs_save.save_system_playlist_item_id_config()
    },
    { deep: true }
  )

  watch(
    () => playlist_MediaFiles_temporary_Sort_Items,
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
    handleItemDbClick,
  }
})
