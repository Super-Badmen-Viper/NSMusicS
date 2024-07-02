import {Browsing_ApiService_of_ND} from "@/features/servers_configs/navidrome_api/services/browsing/index_service";

export class Get_PageInfo_of_Song_of_ND{
    public async get_All_Song_of_ND(username: string,token: string,salt: string): Promise<any> {
        const all_song_list = [];
        try{
            let browsing_ApiService_of_ND = new Browsing_ApiService_of_ND()
            const getArtists_ALL = browsing_ApiService_of_ND.getArtists_ALL(username,token,salt);
            if(getArtists_ALL["subsonic-response"]["status"] === 'ok') {
                const artist_list = getArtists_ALL["subsonic-response"]["artists"]["index"]["artist"]
                artist_list.forEach((artist) => {
                    const song_list_of_this_artist = browsing_ApiService_of_ND.getMusicDirectory_id(username, token, salt, artist.id)
                    song_list_of_this_artist.forEach((song) => {
                        all_song_list.push(song)
                    });
                });
            }
        }catch (e) {

        }
        return all_song_list;
    }
}