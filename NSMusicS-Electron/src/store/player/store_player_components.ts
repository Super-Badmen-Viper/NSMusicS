import {ref} from "vue";
import path from "path";
import {store_app_configs_info} from "../app/store_app_configs_info";
import { reactive } from 'vue'



export const store_player_sound_more = reactive({
    player_theme_1 = ref<PlayerTheme_LyricItem>(
        {
            id: 0,
            name: computed_i18n_Label_ViewSetConfig_Cover_1.value,
            normalStyle: {
                image_url: 'file:///' + path.join(store_app_configs_info.cDriveDbDir, 'player_theme_1.png'),

                textAlign: true,

                player_collapsed_album: false,
                player_collapsed_skin: true,
            }
        }
    ),
    player_theme_2 = ref<PlayerTheme_LyricItem>(
        {
            id: 1,
            name: computed_i18n_Label_ViewSetConfig_Cover_2.value,
            normalStyle: {
                image_url: 'file:///' + path.join(store_app_configs_info.cDriveDbDir, 'player_theme_2.png'),

                textAlign: false,

                player_collapsed_album: false,
                player_collapsed_skin: true,
            }
        }
    ),
    player_theme_3 = ref<PlayerTheme_LyricItem>(
        {
            id: 2,
            name: computed_i18n_Label_ViewSetConfig_Cover_3.value,
            normalStyle: {
                image_url: 'file:///' + path.join(store_app_configs_info.cDriveDbDir, 'player_theme_3.png'),

                textAlign: true,

                player_collapsed_album: false,
                player_collapsed_skin: true,
            }
        }
    ),
    player_theme_4 = ref<PlayerTheme_LyricItem>(
        {
            id: 3,
            name: computed_i18n_Label_ViewSetConfig_Cover_4.value,
            normalStyle: {
                image_url: 'file:///' + path.join(store_app_configs_info.cDriveDbDir, 'player_theme_4.png'),

                textAlign: false,

                player_collapsed_album: true,
                player_collapsed_skin: true,
            }
        }
    ),
    player_theme_5 = ref<PlayerTheme_LyricItem>(
        {
            id: 4,
            name: '皮肤底图',
            normalStyle: {
                image_url: 'file:///' + path.join(store_app_configs_info.cDriveDbDir, 'player_theme_3.png'),

                textAlign: false,

                player_collapsed_album: true,
                player_collapsed_skin: false,
            }
        }
    ),
});