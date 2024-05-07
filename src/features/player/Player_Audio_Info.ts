import path from "path";
import { ref } from "vue";

export class Player_Audio_Info {
    ////// player basic audio_info
    this_audio_file_path = ref('');
    media_file_path(value: any) {
        this.this_audio_file_path.value = value
        this.get_this_audio_restart_play(true)
        console.log('this_audio_file_path：'+value)

        if(this.this_audio_file_path_from_playlist.value === false){
            this.playlist_Files_temporary.value = [];
            this.playlist_Files_temporary.value = [...this.media_Files_temporary.value];
        }
    }
    get_this_audio_file_path(value: any) {
        this.this_audio_file_path.value = value
        console.log('this_audio_file_path：'+value)
    }
    this_audio_file_medium_image_url = ref(path.resolve('resources/img/error_album.jpg'));
    get_media_file_medium_image_url(value: any) {
        this.this_audio_file_medium_image_url.value = value
        this.get_this_audio_restart_play(true)
        console.log('this_audio_file_medium_image_url'+value)

        this.page_songlists_top_album_image_url.value = '';
        this.page_songlists_top_album_image_url.value = value;
        this.page_albumlists_top_album_image_url.value = '';
        this.page_albumlists_top_album_image_url.value = value;
        this.page_artistlists_top_artist_image_url.value = '';
        this.page_artistlists_top_artist_image_url.value = value;
    }
    this_audio_restart_play = ref<boolean>(false)
    get_this_audio_restart_play(value: any) {
        this.this_audio_restart_play.value = value;
        console.log('this_audio_restart_play：'+value)
    }
    this_audio_singer_name = ref<string>('Xiang Cheng')
    get_this_audio_singer_name(value: any) {
        this.this_audio_singer_name.value = value
        console.log('this_audio_singer_name：'+value)
    }
    this_audio_song_name = ref<string>('NSMusicS')
    get_this_audio_song_name(value: any) {
        this.this_audio_song_name.value = value
        console.log('this_audio_song_name：'+value)
    }
    this_audio_album_name = ref<string>('A local music software that is expected to support multiple platforms with AI capabilities and multimodal features.')
    get_this_audio_album_name(value: any) {
        this.this_audio_album_name.value = value
        console.log('this_audio_album_name：'+value)

        this.page_songlists_top_album_name.value = value;
        this.page_albumlists_top_album_name.value = value;
        this.page_artistlists_top_artist_name.value = value;
    }
    this_audio_album_id = ref<string>('')
    get_this_audio_album_id(value: any) {
        this.this_audio_album_id.value = value
        console.log('this_audio_album_id：'+value)

        this.page_songlists_top_album_id.value = value;
        this.page_albumlists_top_album_id.value = value;
        this.page_artistlists_top_artist_id.value = value;
    }
    this_audio_album_favite = ref<string>('')
    get_this_audio_album_favite(value: any) {
        this.this_audio_album_favite.value = value
        console.log('this_audio_album_favite：'+value)
    }
    this_audio_Index_of_absolute_positioning_in_list = ref<number>(-1)
    get_this_audio_Index_of_absolute_positioning_in_list(value: any) {
        this.this_audio_Index_of_absolute_positioning_in_list.value = value
        console.log('this_audio_Index_of_absolute_positioning_in_list：'+value)
    }

    ////// player audio_info of router_page_init_data
    page_songlists_top_album_image_url = ref<string>(path.resolve('resources/img/error_album.jpg'))
    page_songlists_top_album_id = ref<string>('')
    page_songlists_top_album_name = ref<string>('')
    page_albumlists_top_album_image_url = ref<string>(path.resolve('resources/img/error_album.jpg'))
    page_albumlists_top_album_id = ref<string>('')
    page_albumlists_top_album_name = ref<string>('')
    page_artistlists_top_artist_image_url = ref<string>(path.resolve('resources/img/error_album.jpg'))
    page_artistlists_top_artist_id = ref<string>('')
    page_artistlists_top_artist_name = ref<string>('')

    ////// player audio_infos of playlist
    playlist_Files_temporary = ref<Media_File[]>([]);
    playlist_Files_selected = ref<Media_File[]>([])
    set_playlist_Files_selected(value: Media_File) {
        if (value.selected === true) {
            this.playlist_Files_temporary.value.forEach((item, index) => {
                if (item.id === value.id) {
                    this.playlist_Files_temporary.value[index].selected = true;
                }
            });
            this.playlist_Files_selected.value.push(value)
            console.log('playlist_Files_selected：'+value.path+'  '+value.selected)
        } else {
            this.playlist_Files_temporary.value.forEach((item, index) => {
                if (item.id === value.id) {
                    this.playlist_Files_temporary.value[index].selected = false;
                }
            });
            this.playlist_Files_selected.value = this.playlist_Files_selected.value.filter(item => item.id !== value.id);
            console.log('playlist_Files_selected：'+value.path+'  '+value.selected)
        }
    }
    set_playlist_Files_selected_all(value: boolean) {
        this.playlist_Files_temporary.value.forEach((item, index) => {
            this.playlist_Files_temporary.value[index].selected = value;
        });
        if (value === true) {
            this.playlist_Files_selected.value = this.playlist_Files_temporary.value.slice();
        } else {
            this.playlist_Files_selected.value = [];
        }
        console.log('playlist_Files_selected：'+value)
    }
    this_audio_file_path_from_playlist = ref(false);
    fetchData_This_AlbumOrArtist_PlayMedia_Model = ref<boolean>(false);
    get_this_audio_file_path_from_playlist (value: any) {
        this.this_audio_file_path_from_playlist.value = value
        console.log('this_audio_file_path_from_playlist：'+value)
    }

    ////// player audio_infos of view(audio(Media))
    media_Files_temporary = ref<Media_File[]>([])
    media_Files_selected = ref<Media_File[]>([])
    set_media_Files_selected(value: Media_File) {
        if (value.selected === true) {
            this.media_Files_temporary.value.forEach((item, index) => {
            if (item.id === value.id) {
                this.media_Files_temporary.value[index].selected = true;
            }
        });
        this.media_Files_selected.value.push(value)
        console.log('media_Files_selected：'+value.path+'  '+value.selected)
        } else {
            this.media_Files_temporary.value.forEach((item, index) => {
            if (item.id === value.id) {
                this.media_Files_temporary.value[index].selected = false;
            }
        });
        this.media_Files_selected.value = this.media_Files_selected.value.filter(item => item.id !== value.id);
        console.log('media_Files_selected：'+value.path+'  '+value.selected)
        }
    }
    set_media_Files_selected_all(value: boolean) {
        this.media_Files_temporary.value.forEach((item, index) => {
            this.media_Files_temporary.value[index].selected = value;
        });
        if (value === true) {
            this.media_Files_selected.value = this.media_Files_temporary.value.slice();
        } else {
            this.media_Files_selected.value = [];
        }
        console.log('media_Files_selected：'+value)
    }

}