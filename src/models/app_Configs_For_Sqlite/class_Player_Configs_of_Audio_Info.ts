import { ref, type Ref } from "vue";

interface Player_Configs_of_Audio_Info_Props {
  this_audio_file_path: string,
  this_audio_file_medium_image_url: string,
  this_audio_singer_name: string,
  this_audio_singer_id: string,
  this_audio_song_name: string,
  this_audio_song_id: string,
  this_audio_song_rating: string,
  this_audio_song_favorite: string,
  this_audio_album_name: string,
  this_audio_album_id: string,
  this_audio_Index_of_absolute_positioning_in_list: any,

  page_top_album_image_url: string,
  page_top_album_id: string,
  page_top_album_name: string,

  this_audio_file_path_from_playlist: any,
  fetchData_This_AlbumOrArtist_PlayMedia_Model: any,
};

export class Player_Configs_of_Audio_Info {
  [key: string]: Ref<any>;
  constructor(props: Player_Configs_of_Audio_Info_Props) {
    const defaultValues: Record<string, any> = props;
    Object.entries(defaultValues).forEach(([propertyName, defaultValue]) => {
      this[propertyName] = ref(defaultValue);
    });
  }
}