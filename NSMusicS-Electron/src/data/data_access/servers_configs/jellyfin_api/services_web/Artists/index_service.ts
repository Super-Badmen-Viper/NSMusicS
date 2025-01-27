import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web";

export class Artists_ApiService_of_Je extends Jellyfin_Api_Services_Web {
    /*
    sortOrder:
        Ascending、Descending
    sortBy:
        "Default" "AiredEpisodeOrder"
        "Album" "AlbumArtist" "Artist"
        "DateCreated" "OfficialRating" "DatePlayed" "PremiereDate" "StartDate"
        "SortName" "Name" "Random" "Runtime"
        "CommunityRating" "ProductionYear" "PlayCount" "CriticRating"
        "IsFolder" "IsUnplayed" "IsPlayed"
        "SeriesSortName" "VideoBitRate" "AirTime" "Studio"
        "IsFavoriteOrLiked" "DateLastContentAdded" "SeriesDatePlayed"
        "ParentIndexNumber" "IndexNumber" "SimilarityScore" "SearchScore"
    filters:
        "IsFolder" "IsNotFolder"
        "IsUnplayed" "IsPlayed"
        "IsFavorite" "IsResumable"
        "Likes" "Dislikes" "IsFavoriteOrLikes"
     */
    /**
     * 获取所有艺术家信息
     * @param userId 用户 ID
     * @param searchTerm 搜索关键词
     * @param sortBy 排序字段
     * @param sortOrder 排序顺序（如 "Ascending" 或 "Descending"）
     * @param filters 过滤条件
     * @param isFavorite 是否收藏（如 "true" 或 "false"）
     * @param years 年份过滤（如 "2020,2021"）
     * @param officialRatings 官方评级过滤
     * @param genres 流派过滤（如 "Rock,Pop"）
     * @param genreIds 流派 ID 过滤（如 "123,456"）
     * @param tags 标签过滤
     * @returns 响应数据
     */
    public async getArtists_ALL(
        userId: string,
        searchTerm: string,
        sortBy: string, sortOrder: string,
        filters: string, isFavorite: string, years: string, officialRatings: string,
        genres: string, genreIds: string,
        tags: string,
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'Artists',
            {
                userId,
                searchTerm,
                sortBy,
                sortOrder,
                filters,
                isFavorite,
                years,
                officialRatings,
                genres,
                genreIds,
                tags,
            }
        );
    }

    /**
     * 获取所有专辑艺术家信息
     * @param userId 用户 ID
     * @param searchTerm 搜索关键词
     * @param sortBy 排序字段
     * @param sortOrder 排序顺序（如 "Ascending" 或 "Descending"）
     * @param filters 过滤条件
     * @param isFavorite 是否收藏（如 "true" 或 "false"）
     * @param years 年份过滤（如 "2020,2021"）
     * @param officialRatings 官方评级过滤
     * @param genres 流派过滤（如 "Rock,Pop"）
     * @param genreIds 流派 ID 过滤（如 "123,456"）
     * @param tags 标签过滤
     * @returns 响应数据
     */
    public async getAlbumArtists_ALL(
        userId: string,
        searchTerm: string,
        sortBy: string, sortOrder: string,
        filters: string, isFavorite: string, years: string, officialRatings: string,
        genres: string, genreIds: string,
        tags: string,
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'Artists/AlbumArtists',
            {
                userId,
                searchTerm,
                sortBy,
                sortOrder,
                filters,
                isFavorite,
                years,
                officialRatings,
                genres,
                genreIds,
                tags,
            }
        );
    }

    public async getArtists_List_Quick_Filters(
        userId: string, parentId: string,
        filters: string
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'Artists',
            {
                userId,
                parentId,
                filters
            }
        );
    }
    public async getArtists_List_Quick(
        userId: string, parentId: string,
        includeItemTypes: string,
        Recursive: string
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'Artists',
            {
                userId,
                parentId,
                includeItemTypes,
                Recursive
            }
        );
    }

    // 获取所有歌手
    // 获取选中 - 歌手 - 所有专辑：AlbumArtistIds(歌手id)
    // Items?SortOrder=Descending%2CDescending%2CAscending&IncludeItemTypes=MusicAlbum&Recursive=true&Fields=ParentId%2CPrimaryImageAspectRatio%2CParentId%2CPrimaryImageAspectRatio&Limit=100&StartIndex=0&CollapseBoxSetItems=false
    //      &AlbumArtistIds=eb360b088fd1f36947216e221315e9fe
    //          &SortBy=PremiereDate%2CProductionYear%2CSortname
    // 获取选中 - 专辑 - 所有乐曲：ParentId(专辑id)
    // Items?ParentId=c64c056eb40fa96434ab774ff14c03be&Fields=ItemCounts%2CPrimaryImageAspectRatio%2CCanDelete%2CMediaSourceCount&SortBy=ParentIndexNumber%2CIndexNumber%2CSortName
}