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

type albumRepository struct {
	db         mongo.Database
	collection string
}

func NewAlbumRepository(db mongo.Database, collection string) scene_audio_route_interface.AlbumRepository {
	return &albumRepository{
		db:         db,
		collection: collection,
	}
}

func (a albumRepository) GetAlbumItems(
	ctx context.Context,
	end, order, sort, start, search, starred, artistId string,
) ([]scene_audio_route_models.AlbumMetadata, error) {
	collection := a.db.Collection(a.collection)

	// 构建复合查询条件
	filter := bson.M{}

	// 处理艺术家ID过滤
	if artistId != "" {
		filter["artist_id"] = artistId
	}

	// 处理搜索条件
	if search != "" {
		filter["$or"] = []bson.M{
			{"name": bson.M{"$regex": primitive.Regex{Pattern: search, Options: "i"}}},
			{"artist": bson.M{"$regex": primitive.Regex{Pattern: search, Options: "i"}}},
		}
	}

	// 处理收藏过滤
	if starred != "" {
		isStarred, err := strconv.ParseBool(starred)
		if err != nil {
			return nil, errors.New("invalid starred parameter")
		}
		filter["starred"] = isStarred
	}

	// 分页处理
	skip, limit := getPagination(start, end)

	// 排序处理
	sortOption := getSortOption_Album(sort, order)

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
		scene_audio_db_models.AlbumMetadata `bson:",inline"`
		MergedImageURL                      string `bson:"-"`
	}

	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("failed to decode results: %v", err)
	}

	// 转换为路由模型
	routeResults := make([]scene_audio_route_models.AlbumMetadata, len(results))
	for i, item := range results {
		routeResults[i] = scene_audio_route_models.AlbumMetadata{
			ID:            item.ID,
			Name:          item.Name,
			ArtistID:      item.ArtistID,
			Artist:        item.Artist,
			AlbumArtist:   item.AlbumArtist,
			MinYear:       item.MinYear,
			MaxYear:       item.MaxYear,
			SongCount:     item.SongCount,
			Duration:      item.Duration,
			Genre:         item.Genre,
			CreatedAt:     item.CreatedAt,
			UpdatedAt:     item.UpdatedAt,
			AlbumArtistID: item.AlbumArtistID,
			Comment:       item.Comment,
			AllArtistIDs:  item.AllArtistIDs,
			ImageFiles:    "",          // 待填充Music场景Metadata查找资源逻辑
			PlayCount:     0,           // 待填充Annotation交互逻辑
			Rating:        0,           // 待填充Annotation交互逻辑
			Starred:       false,       // 待填充Annotation交互逻辑
			StarredAt:     time.Time{}, // 待填充Annotation交互逻辑
		}
	}

	if routeResults == nil {
		return []scene_audio_route_models.AlbumMetadata{}, nil
	}

	return routeResults, nil
}

// 排序参数处理
func getSortOption_Album(sortField, order string) bson.D {
	sortOrder := 1 // 默认升序
	if order == "desc" {
		sortOrder = -1
	}

	// 设置默认排序字段
	if sortField == "" {
		sortField = "name"
	}

	return bson.D{{Key: sortField, Value: sortOrder}}
}
