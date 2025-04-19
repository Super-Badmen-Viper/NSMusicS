// scene_audio_route_repository/mediafile_repository.go
package scene_audio_route_repository

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type mediaFileRepository struct {
	db         mongo.Database
	collection string
}

func NewMediaFileRepository(db mongo.Database, collection string) scene_audio_route_interface.MediaFileRepository {
	return &mediaFileRepository{
		db:         db,
		collection: collection,
	}
}

func (m mediaFileRepository) GetMediaFileItems(
	ctx context.Context,
	end, order, sort, start, search, starred, albumId, artistId, year string,
) ([]scene_audio_route_models.MediaFileMetadata, error) {
	collection := m.db.Collection(m.collection)

	// 构建复合查询条件
	filter := bson.M{}

	// 处理艺术家ID过滤
	if artistId != "" {
		filter["artist_id"] = artistId
	}

	// 处理专辑ID过滤
	if albumId != "" {
		filter["album_id"] = albumId
	}

	// 处理年份过滤
	if year != "" {
		yearInt, err := strconv.Atoi(year)
		if err != nil {
			return nil, errors.New("invalid year format")
		}
		filter["year"] = yearInt
	}

	// 处理多字段搜索（标题、艺术家、专辑）
	if search != "" {
		filter["$or"] = []bson.M{
			{"title": bson.M{"$regex": primitive.Regex{Pattern: search, Options: "i"}}},
			{"artist": bson.M{"$regex": primitive.Regex{Pattern: search, Options: "i"}}},
			{"album": bson.M{"$regex": primitive.Regex{Pattern: search, Options: "i"}}},
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

	// 排序处理（支持nocase排序规则）
	sortOption := getSortOption_MediaFile(sort, order)

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

	// 使用组合结构体解码数据库模型
	var results []struct {
		scene_audio_db_models.MediaFileMetadata `bson:",inline"`
		MergedImageURL                          string `bson:"-"`
	}

	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("failed to decode results: %v", err)
	}

	// 转换为路由模型
	routeResults := make([]scene_audio_route_models.MediaFileMetadata, len(results))
	for i, item := range results {
		routeResults[i] = scene_audio_route_models.MediaFileMetadata{
			ID:            item.ID,
			Path:          item.Path,
			Title:         item.Title,
			Album:         item.Album,
			Artist:        item.Artist,
			ArtistID:      item.ArtistID,
			AlbumArtist:   item.AlbumArtist,
			AlbumID:       item.AlbumID,
			HasCoverArt:   item.HasCoverArt,
			Year:          item.Year,
			Size:          item.Size,
			Suffix:        item.Suffix,
			Duration:      item.Duration,
			BitRate:       item.BitRate,
			Genre:         item.Genre,
			CreatedAt:     item.CreatedAt,
			UpdatedAt:     item.UpdatedAt,
			AlbumArtistID: item.AlbumArtistID,
			Channels:      item.Channels,
			PlayCount:     0,           // 待填充Annotation交互逻辑
			Rating:        0,           // 待填充Annotation交互逻辑
			Starred:       false,       // 待填充Annotation交互逻辑
			StarredAt:     time.Time{}, // 待填充Annotation交互逻辑
		}
	}

	if routeResults == nil {
		return []scene_audio_route_models.MediaFileMetadata{}, nil
	}

	return routeResults, nil
}

// 常规排序处理（仅字段顺序）
func getSortOption_MediaFile(sortField, order string) bson.D {
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
