import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web"

export class Items_ApiService_of_Je extends Jellyfin_Api_Services_Web {
    /*
    sortOrder:
        Ascending、Descending
    SortBy: Album,SortName
        "Default"
        "AiredEpisodeOrder" "Album" "AlbumArtist" "Artist"
        "DateCreated" "OfficialRating"
        "DatePlayed" "PremiereDate" "StartDate" "SortName" "Name"
        "Random" "Runtime" "CommunityRating" "ProductionYear" "PlayCount" "CriticRating"
        "IsFolder" "IsUnplayed" "IsPlayed"
        "SeriesSortName" "VideoBitRate" "AirTime" "Studio"
        "IsFavoriteOrLiked" "DateLastContentAdded" "SeriesDatePlayed"
        "ParentIndexNumber" "IndexNumber" "SimilarityScore" "SearchScore"
    filters:
        "IsFolder" "IsNotFolder"
        "IsUnplayed" "IsPlayed"
        "IsFavorite" "IsResumable"
        "Likes" "Dislikes" "IsFavoriteOrLikes"
    IncludeItemTypes:
        "Audio" "Video" "Folder" "MusicGenre" "Genre" "Movie" "Photo" "Playlist"
        "MusicAlbum" "MusicArtist" "MusicVideo"
        "AggregateFolder" "AudioBook" "BasePluginFolder" "Book" "BoxSet" "Channel"
        "ChannelFolderItem" "CollectionFolder" "Episode" "ManualPlaylistsFolder"
        "LiveTvChannel" "LiveTvProgram" "Person" "PhotoAlbum" "PlaylistsFolder"
        "Program" "Recording" "Season" "Series" "Studio" "Trailer" "TvChannel" "TvProgram"
        "UserRootFolder" "UserView" "Year"
     */

    // IncludeItemTypes=Audio
    // SortBy=Album,SortName SortOrder=Ascending
    // Fields=ParentId EnableImageTypes=Primary
    // StartIndex=0 Limit=100
    // ImageTypeLimit=1 Recursive=true
    // ParentId=28e9960207c978c0d9aaefc8ae2d3a79
    /**
     * 获取歌曲列表
     * @param userId 用户 ID
     * @param parentId 父级 ID（如专辑 ID 或文件夹 ID）
     * @param searchTerm 搜索关键词
     * @param sortBy 排序字段
     * @param sortOrder 排序顺序（如 "Ascending" 或 "Descending"）
     * @param limit 返回结果的最大数量
     * @param startIndex 起始索引（用于分页）
     * @param includeItemTypes 包含的项目类型（如 "Audio"）
     * @param fields 返回的字段列表（如 "Name,Artist"）
     * @param enableImageTypes 启用的图片类型（如 "Primary,Backdrop"）
     * @param recursive 是否递归搜索子文件夹（如 "true" 或 "false"）
     * @param imageTypeLimit 图片类型数量限制
     * @returns 响应数据
     */
    public async getItems_SongList(
        userId: string, parentId: string, searchTerm: string,
        sortBy: string, sortOrder: string,
        limit: string, startIndex: string,
        includeItemTypes: string,
        fields: string, enableImageTypes: string, recursive: string, imageTypeLimit: string,
        years: string
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'Items',
            {
                userId,
                parentId,
                searchTerm,
                sortBy,
                sortOrder,
                limit,
                startIndex,
                includeItemTypes,
                fields,
                enableImageTypes,
                recursive,
                imageTypeLimit,
                years
            }
        );
    }

    /**
     * 获取项目的图片信息
     * @param itemId 项目 ID
     * @returns 响应数据
     */
    public async getItems_Image(itemId: string): Promise<any> {
        return this.sendRequest(
            'GET',
            `Items/${itemId}/Images`
        );
    }

    /**
     * 获取专辑列表
     * @param userId 用户 ID
     * @param parentId 父级 ID（如文件夹 ID）
     * @param searchTerm 搜索关键词
     * @param sortBy 排序字段
     * @param sortOrder 排序顺序（如 "Ascending" 或 "Descending"）
     * @param limit 返回结果的最大数量
     * @param startIndex 起始索引（用于分页）
     * @param includeItemTypes 包含的项目类型（如 "Album"）
     * @param fields 返回的字段列表（如 "Name,Artist"）
     * @param enableImageTypes 启用的图片类型（如 "Primary,Backdrop"）
     * @param recursive 是否递归搜索子文件夹（如 "true" 或 "false"）
     * @param imageTypeLimit 图片类型数量限制
     * @returns 响应数据
     */
    public async getItems_AlbumList(
        userId: string, parentId: string, searchTerm: string,
        sortBy: string, sortOrder: string,
        limit: string, startIndex: string,
        includeItemTypes: string,
        fields: string, enableImageTypes: string, recursive: string, imageTypeLimit: string
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'Items',
            {
                userId,
                parentId,
                searchTerm,
                sortBy,
                sortOrder,
                limit,
                startIndex,
                includeItemTypes,
                fields,
                enableImageTypes,
                recursive,
                imageTypeLimit,
            }
        );
    }
    // IncludeItemTypes=MusicAlbum
    // SortBy=SortName SortOrder=Ascending
    // Fields=PrimaryImageAspectRatio,SortName EnableImageTypes=Primary,Backdrop,Banner,Thumb
    // StartIndex=0 Limit=100
    // ImageTypeLimit=1 Recursive=true
    // ParentId=28e9960207c978c0d9aaefc8ae2d3a79


}