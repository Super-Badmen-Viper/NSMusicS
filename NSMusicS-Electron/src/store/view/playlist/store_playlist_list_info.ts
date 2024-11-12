import {reactive, watch} from 'vue'
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";

export const store_playlist_list_info = reactive({
    playlist_names_ALLLists: [],
    playlist_datas_CurrentPlayList_ALLMediaIds: [],
    playlist_tracks_temporary_of_ALLLists: [],

    playlist_MediaFiles_metadata: [],
    playlist_MediaFiles_temporary: [],

    playlist_DragSort_Model: false,
    playlist_Menu_Item_Id: '',
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
});
watch(() => store_playlist_list_info.playlist_MediaFiles_temporary, async (newValue) => {
    store_app_configs_logic_save.save_system_playlist_item_id_config();
});
watch(() => store_playlist_list_info.playlist_MediaFiles_temporary_Sort_Items, async (newValue) => {
    store_app_configs_logic_save.save_system_playlist_item_id_config();
});
