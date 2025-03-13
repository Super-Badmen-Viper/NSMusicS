import {reactive, watch} from 'vue'
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";
import {store_playlist_list_fetchData} from "@/views/view_app/music_components/player_list/store/store_playlist_list_fetchData";
import {store_player_audio_info} from "../../../music_page/page_player/store/store_player_audio_info";

export const store_playlist_list_info = reactive({
    playlist_names_ALLLists: [],
    playlist_datas_CurrentPlayList_ALLMediaIds: [],
    playlist_tracks_temporary_of_ALLLists: [],

    playlist_MediaFiles_metadata: [],
    playlist_MediaFiles_temporary: [],
    playlist_MediaFiles_temporary_carousel: [],

    playlist_DragSort_Model: false,
    playlist_Menu_Item_Id: '',
    playlist_Menu_Item_Rating: 0,
    playlist_Menu_Item_IndexId: '',
    playlist_Menu_Item: null,

    playlist_MediaFiles_temporary_Sort_Items: [],
    playlist_Sort_StartIndex: 0,
    playlist_Sort_EndIndex: 0,
    menu_item_open_drag_sort() {
        store_playlist_list_info.playlist_DragSort_Model = true;
        store_playlist_list_info.playlist_MediaFiles_temporary_Sort_Items = []

        const item: Media_File | undefined = store_playlist_list_info.playlist_MediaFiles_temporary.find((mediaFile: Media_File) => mediaFile.id === store_playlist_list_info.playlist_Menu_Item_Id);
        if (item != undefined && item != 'undefined') {
            const index = store_playlist_list_info.playlist_MediaFiles_temporary.findIndex((mediaFile: Media_File) => mediaFile.id === item.id);

            const startIndex = Math.max(0, index - 4);
            const endIndex = Math.min(store_playlist_list_info.playlist_MediaFiles_temporary.length - 1, index + 45);

            store_playlist_list_info.playlist_MediaFiles_temporary_Sort_Items =
                store_playlist_list_info.playlist_MediaFiles_temporary.slice(
                    startIndex,
                    endIndex + 1
                );

            store_playlist_list_info.playlist_Sort_StartIndex = startIndex;
            store_playlist_list_info.playlist_Sort_EndIndex = endIndex;
        }
    },
    menu_item_reinsert_drag_sort() {
        const originalList = store_playlist_list_info.playlist_MediaFiles_temporary;
        const sortedList = store_playlist_list_info.playlist_MediaFiles_temporary_Sort_Items;

        for (let i = sortedList.length - 1; i >= 0; i--) {
            const item = sortedList[i];
            const index = originalList.findIndex(mediaFile => mediaFile.id === item.id);
            if (index !== -1) {
                originalList.splice(index, 1);
            }
        }

        for (let i = 0; i < sortedList.length; i++) {
            const item = sortedList[i];
            const originalIndex = store_playlist_list_info.playlist_Sort_StartIndex + i;
            originalList.splice(originalIndex, 0, item);
        }

        originalList.forEach((item, index) => {
            item.absoluteIndex = index;
        });

        store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds = store_playlist_list_info.playlist_MediaFiles_temporary.map(item => item.id);

        store_app_configs_logic_save.save_system_playlist_item_id_config();
    },

    reset_carousel(){
        const hasSameAbsoluteIndex = store_playlist_list_info.playlist_MediaFiles_temporary_carousel.some(
            (item) => item.path === store_player_audio_info.this_audio_file_path
        );
        if (hasSameAbsoluteIndex) {
            return;
        }
        const startIndex = Math.max(
            store_player_audio_info.this_audio_Index_of_play_list - 2,
            0
        );
        const endIndex = Math.min(
            startIndex + 5,
            store_playlist_list_info.playlist_MediaFiles_temporary.length
        );
        store_playlist_list_info.playlist_MediaFiles_temporary_carousel =
            store_playlist_list_info.playlist_MediaFiles_temporary.slice(startIndex, endIndex);
        ///
        // const index = store_playlist_list_info.playlist_MediaFiles_temporary_carousel.findIndex(
        //     (item) => item.path === store_player_audio_info.this_audio_file_path
        // );
        // store_player_audio_info.this_audio_Index_of_play_list_carousel = index !== -1 ? index : 0
        // store_player_audio_info.play_list_carousel_model = true
    }
});
watch(() => store_playlist_list_info.playlist_MediaFiles_temporary.length, async (newValue) => {
    store_playlist_list_info.reset_carousel()
    ///
    store_app_configs_logic_save.save_system_playlist_item_id_config();
});
watch(() => store_playlist_list_info.playlist_MediaFiles_temporary_Sort_Items, async (newValue) => {
    store_app_configs_logic_save.save_system_playlist_item_id_config();
});
