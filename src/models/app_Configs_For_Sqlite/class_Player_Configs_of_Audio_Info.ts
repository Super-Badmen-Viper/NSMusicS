import { ref, type Ref } from "vue";

const defaultValues_player_Configs_of_Audio_Info: Record<string, any> = {
    this_audio_file_path: '',
    this_audio_file_medium_image_url: '',
    this_audio_singer_name: '',
    this_audio_song_name: '',
    this_audio_album_name: '',
    this_audio_album_id: '',
    this_audio_album_favite: '',
    this_audio_Index_of_absolute_positioning_in_list: null,

    page_songlists_top_album_image_url: '',
    page_songlists_top_album_id: '',
    page_songlists_top_album_name: '',
    page_albumlists_top_album_image_url: '',
    page_albumlists_top_album_id: '',
    page_albumlists_top_album_name: '',
    page_artistlists_top_artist_image_url: '',
    page_artistlists_top_artist_id: '',
    page_artistlists_top_artist_name: '',

    this_audio_file_path_from_playlist: null,
    fetchData_This_AlbumOrArtist_PlayMedia_Model: null,
};

export class Player_Configs_of_Audio_Info {
    [key: string]: Ref<any>;
    constructor() {
      Object.entries(defaultValues_player_Configs_of_Audio_Info).forEach(([propertyName, defaultValue]) => {
        this[propertyName] = ref(defaultValue);
      });
    }
}