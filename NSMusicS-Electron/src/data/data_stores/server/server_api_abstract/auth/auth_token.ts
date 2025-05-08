import {reactive} from "vue";
import {
    store_server_user_model
} from "@/data/data_stores/server/store_server_user_model";
import {
    store_server_users
} from "@/data/data_stores/server/store_server_users";
import {
    store_player_audio_info
} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_audio_info";
import {
    store_playlist_list_info
} from "@/views/view_app/page_metadata/page_folder/page_music/music_components/player_list/store/store_playlist_list_info";
import {
    store_player_audio_logic
} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_audio_logic";

export const store_server_auth_token = reactive({
    app_load_init_server_token(){
        if (
            store_server_user_model.model_server_type_of_web && (store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby')
        ) {
            if (store_server_user_model.authorization_of_Je != undefined) {
                const regex = /api_key=([^&]+)/;
                store_player_audio_info.this_audio_file_path =
                    store_player_audio_info.this_audio_file_path.replace(
                        regex,
                        'api_key=' + store_server_user_model.authorization_of_Je
                    );
                store_player_audio_info.this_audio_file_medium_image_url =
                    store_player_audio_info.this_audio_file_medium_image_url.replace(
                        regex,
                        'api_key=' + store_server_user_model.authorization_of_Je
                    );
                store_playlist_list_info.playlist_MediaFiles_temporary.forEach((item: any) => {
                    if (item.medium_image_url) {
                        item.medium_image_url = item.medium_image_url
                            .replace(regex, 'api_key=' + store_server_user_model.authorization_of_Je);
                    }
                    if (item.path) {
                        item.path = item.path
                            .replace(regex, 'api_key=' + store_server_user_model.authorization_of_Je);
                    }
                    if (item.duration) {
                        item.duration_txt = store_player_audio_logic.formatTime_RunTimeTicks(item.duration);
                    }
                });
            }
        }
    }
});