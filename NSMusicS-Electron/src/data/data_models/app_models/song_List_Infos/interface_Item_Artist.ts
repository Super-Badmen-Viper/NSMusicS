interface Artist {
    favorite:boolean;
    rating:number;

    id: string;
    name: string;
    album_count: number;
    full_text?: string;
    order_artist_name?: string;
    sort_artist_name?: string;
    song_count: number;
    size: number;
    mbz_artist_id?: string;
    biography: string;
    small_image_url: string;
    medium_image_url: string;
    large_image_url: string;
    similar_artists: string;
    external_url: string;
    external_info_updated_at?: string;
}