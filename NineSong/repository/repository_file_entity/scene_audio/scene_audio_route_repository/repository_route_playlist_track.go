// scene_audio_route_repository/playlist_track_repository.go
package scene_audio_route_repository

import (
	"context"
	"errors"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"strconv"
)

type playlistTrackRepository struct {
	db         mongo.Database
	collection string
}

func NewPlaylistTrackRepository(db mongo.Database, collection string) scene_audio_route_interface.PlaylistTrackRepository {
	return &playlistTrackRepository{
		db:         db,
		collection: collection,
	}
}

func (p playlistTrackRepository) GetPlaylistTrackItems(
	ctx context.Context,
	end, order, sort, start, search, starred, albumId, artistId, year, playlistId string,
) ([]scene_audio_route_models.PlaylistTrackMetadata, error) {
	collection := p.db.Collection(p.collection)

	// 构建基础查询条件
	filter := bson.M{"playlist_id": playlistId} // 强制关联播放列表ID

	// 处理关联实体过滤
	if albumId != "" {
		if _, err := primitive.ObjectIDFromHex(albumId); err == nil {
			filter["album_id"] = albumId
		}
	}
	if artistId != "" {
		if _, err := primitive.ObjectIDFromHex(artistId); err == nil {
			filter["artist_id"] = artistId
		}
	}

	// 处理播放类型过滤
	if search != "" {
		filter["$or"] = []bson.M{
			{"play_type": bson.M{"$regex": primitive.Regex{Pattern: search, Options: "i"}}},
		}
	}

	// 处理收藏状态
	if starred != "" {
		isStarred, err := strconv.ParseBool(starred)
		if err != nil {
			return nil, errors.New("invalid starred parameter")
		}
		filter["starred"] = isStarred
	}

	// 分页处理
	skip, limit := getPagination(start, end)

	// 排序处理（默认按ID升序）
	sortOption := getSortOption_PlaylistTrack(sort, order)

	// 执行查询
	findOptions := options.Find().
		SetSort(sortOption).
		SetSkip(int64(skip)).
		SetLimit(int64(limit))

	cursor, err := collection.Find(ctx, filter, findOptions)
	if err != nil {
		return nil, fmt.Errorf("database query failed: %v", err)
	}
	defer cursor.Close(ctx)

	// 使用组合结构体解码
	var results []struct {
		scene_audio_db_models.PlaylistTrackMetadata `bson:",inline"`
	}

	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("failed to decode results: %v", err)
	}

	// 转换为路由模型
	routeResults := make([]scene_audio_route_models.PlaylistTrackMetadata, len(results))
	for i, item := range results {
		routeResults[i] = scene_audio_route_models.PlaylistTrackMetadata{
			ID:          item.ID,
			PlaylistID:  item.PlaylistID,
			PlayType:    item.PlayType,
			MediaFileID: item.MediaFileID,
			AlbumID:     item.AlbumID,
			ArtistID:    item.ArtistID,
		}
	}

	return routeResults, nil
}

// 常规排序处理（仅字段顺序）
func getSortOption_PlaylistTrack(sortField, order string) bson.D {
	sortOrder := 1
	if order == "desc" {
		sortOrder = -1
	}

	// 设置默认排序字段
	if sortField == "" {
		sortField = "title" // 保持原默认字段
	}

	// 简化后的排序条件
	return bson.D{
		{Key: sortField, Value: sortOrder},
	}
}
