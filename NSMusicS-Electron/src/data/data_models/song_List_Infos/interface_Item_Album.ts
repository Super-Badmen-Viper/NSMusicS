interface Album {
    favorite:boolean;
    rating:number;
    
    absoluteIndex: number;
    title:string;
    album_title:string;
    created_time:string;
    updated_time:string;

    id: string;
    name: string;
    artist_id: string;
    embed_art_path: string;
    artist: string;
    album_artist: string;
    min_year: number;
    max_year: number;
    compilation: boolean;
    song_count: number;
    duration: number;
    genre: string;
    created_at?: Date;
    updated_at?: Date;
    full_text?: string;
    album_artist_id?: string;
    order_album_name?: string;
    order_album_artist_name?: string;
    sort_album_name?: string;
    sort_artist_name?: string;
    sort_album_artist_name?: string;
    size: number;
    mbz_album_id?: string;
    mbz_album_artist_id?: string;
    mbz_album_type?: string;
    mbz_album_comment?: string;
    catalog_num?: string;
    comment?: string;
    all_artist_ids?: string;
    image_files: string;
    paths?: string;
    description: string;
    small_image_url: string;
    medium_image_url: string;
    large_image_url: string;
    external_url: string;
    external_info_updated_at?: Date;
}
