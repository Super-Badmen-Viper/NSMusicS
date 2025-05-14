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
import {
    Users_ApiService_of_Je
} from "@/data/data_access/servers_configs/jellyfin_api/services_web/Users/index_service";
import {
    Library_ApiService_of_Je
} from "@/data/data_access/servers_configs/jellyfin_api/services_web/Library/index_service";
import {
    store_server_navidrome_userdata_logic
} from "../../server_data_select/server_navidrome_user_data/store_server_navidrome_userdata_logic";
import {store_router_data_logic} from "@/router/router_store/store_router_data_logic";
import {store_server_model_statistics} from "../music_scene/model/model_statistics";
import {
    store_server_login_logic
} from "../../../../../views/view_server/page_metadata/page_login/store/store_server_login_logic";
import {
    store_server_login_info
} from "../../../../../views/view_server/page_metadata/page_login/store/store_server_login_info";

export const store_server_auth_token = reactive({
    async init_login_server(){
        if(store_server_users.server_select_kind === 'ninesong'){
            store_server_user_model.username =
                store_server_users.server_config_of_current_user_of_sqlite?.user_name
            store_server_user_model.password =
                store_server_users.server_config_of_current_user_of_sqlite?.password
            await store_server_login_logic.server_login(
                store_server_user_model.username,
                store_server_user_model.password
            )
        }else if(store_server_users.server_select_kind === 'navidrome') {
            const {salt, token} = store_server_navidrome_userdata_logic.navidrome_get_EncryptedPassword(
                store_server_user_model.password
            );
            store_server_user_model.salt = salt
            store_server_user_model.token = token
        }else if(
            store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby'
        ) {
            if(store_server_user_model.server_login_model_of_apikey) {
                store_server_user_model.authorization_of_Je =
                    store_server_users.server_config_of_current_user_of_sqlite?.user_name
                // load User
                const userService = new Users_ApiService_of_Je(
                    store_server_users.server_config_of_current_user_of_sqlite?.url
                )
                const result = await userService.getUsers_ALL()
                let server_set_of_addUser_of_apikey_user_option = []
                store_server_user_model.userid_of_Je = ''
                if (result) {
                    if (Array.isArray(result) && result.length > 0) {
                        result.forEach((row: any, index: number) => {
                            server_set_of_addUser_of_apikey_user_option.push({
                                label: row.Name,
                                value: row.Id
                            });
                        });
                        store_server_user_model.userid_of_Je = server_set_of_addUser_of_apikey_user_option[0].value
                        // load Library parentid_of_Je
                        const library_ApiService_of_Je = new Library_ApiService_of_Je(
                            store_server_users.server_config_of_current_user_of_sqlite?.url
                        )
                        const result_parentIds = await library_ApiService_of_Je.getLibrary_MediaFolders_ALL()
                        store_server_user_model.parentid_of_Je = []
                        if (result_parentIds.Items) {
                            if (Array.isArray(result_parentIds.Items) && result_parentIds.Items.length > 0) {
                                result_parentIds.Items.forEach((row: any, index: number) => {
                                    store_server_user_model.parentid_of_Je.push({
                                        label: row.Name,
                                        value: row.Id
                                    });
                                    if (row.CollectionType === 'music') {
                                        store_server_user_model.parentid_of_Je_Music = row.Id
                                    }
                                });
                            }
                        }
                    }
                }
            }
            else {
                store_server_user_model.username =
                    store_server_users.server_config_of_current_user_of_sqlite?.user_name
                store_server_user_model.password =
                    store_server_users.server_config_of_current_user_of_sqlite?.password
                const data = await new Users_ApiService_of_Je(
                    store_server_users.server_config_of_current_user_of_sqlite?.url
                ).authenticateUserByName(
                    store_server_users.server_config_of_current_user_of_sqlite?.url,
                    store_server_user_model.username,
                    store_server_user_model.password
                )
                store_server_user_model.authorization_of_Je = data.AccessToken
                store_server_user_model.userid_of_Je = data.User.Id
                await store_server_model_statistics.get_page_top_info()
                // load Library parentid_of_Je
                const library_ApiService_of_Je = new Library_ApiService_of_Je(
                    store_server_users.server_config_of_current_user_of_sqlite?.url
                )
                const result_parentIds = await library_ApiService_of_Je.getLibrary_MediaFolders_ALL()
                store_server_user_model.parentid_of_Je = []
                if(result_parentIds.Items){
                    if(Array.isArray(result_parentIds.Items) && result_parentIds.Items.length > 0) {
                        result_parentIds.Items.forEach((row: any, index: number) => {
                            store_server_user_model.parentid_of_Je.push({
                                label: row.Name,
                                value: row.Id
                            });
                            if(row.CollectionType === 'music'){
                                store_server_user_model.parentid_of_Je_Music = row.Id
                            }
                        });
                    }
                }
            }
        }
    },
    test_init_server_token(){
        if (store_server_user_model.model_server_type_of_web) {
            if (store_server_users.server_select_kind === 'ninesong') {
                if (store_server_login_info.server_accessToken != undefined && store_server_login_info.server_accessToken.length > 0) {
                    const regex = /access_token=([^&]+)/;
                    store_player_audio_info.this_audio_file_path =
                        store_player_audio_info.this_audio_file_path.replace(
                            regex,
                            'access_token=' + store_server_user_model.authorization_of_Je
                        );
                    store_player_audio_info.this_audio_file_medium_image_url =
                        store_player_audio_info.this_audio_file_medium_image_url.replace(
                            regex,
                            'access_token=' + store_server_user_model.authorization_of_Je
                        );
                    store_playlist_list_info.playlist_MediaFiles_temporary.forEach((item: any) => {
                        if (item.medium_image_url) {
                            item.medium_image_url = item.medium_image_url
                                .replace(regex, 'access_token=' + store_server_user_model.authorization_of_Je);
                        }
                        if (item.path) {
                            item.path = item.path
                                .replace(regex, 'access_token=' + store_server_user_model.authorization_of_Je);
                        }
                        if (item.duration) {
                            item.duration_txt = store_player_audio_logic.formatTime_RunTimeTicks(item.duration);
                        }
                    });
                }
            }else if(store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby') {
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
    }
});