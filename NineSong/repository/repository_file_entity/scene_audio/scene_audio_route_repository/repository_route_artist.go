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
	"time"
)

type artistRepository struct {
	db         mongo.Database
	collection string
}

func NewArtistRepository(db mongo.Database, collection string) scene_audio_route_interface.ArtistRepository {
	return &artistRepository{
		db:         db,
		collection: collection,
	}
}

func (a artistRepository) GetArtistItems(
	ctx context.Context,
	end, order, sort, start, search, starred string,
) ([]scene_audio_route_models.ArtistMetadata, error) {
	collection := a.db.Collection(a.collection)

	// 构建查询条件
	filter := bson.M{}

	// 处理搜索条件
	if search != "" {
		filter["name"] = bson.M{"$regex": primitive.Regex{Pattern: search, Options: "i"}}
	}

	// 处理收藏过滤
	if starred != "" {
		isStarred, err := strconv.ParseBool(starred)
		if err != nil {
			return nil, errors.New("invalid starred parameter")
		}
		filter["starred"] = isStarred
	}

	// 处理分页
	skip, limit := getPagination(start, end)

	// 构建排序
	sortOption := getSortOption_Artist(sort, order)

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

	var results []struct {
		scene_audio_db_models.ArtistMetadata `bson:",inline"`
		MergedImageURL                       string `bson:"-"` // 用于接收合并后的值
	}

	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("failed to decode results: %v", err)
	}

	// 转换为目标结构
	routeResults := make([]scene_audio_route_models.ArtistMetadata, len(results))
	for i, item := range results {
		routeResults[i] = scene_audio_route_models.ArtistMetadata{
			ID:         item.ID,
			Name:       item.Name,
			AlbumCount: item.AlbumCount,
			SongCount:  item.SongCount,
			Size:       item.Size,
			ImageFiles: "",          // 待填充Music场景Metadata查找资源逻辑
			PlayCount:  0,           // 待填充Annotation交互逻辑
			Rating:     0,           // 待填充Annotation交互逻辑
			Starred:    false,       // 待填充Annotation交互逻辑
			StarredAt:  time.Time{}, // 待填充Annotation交互逻辑
		}
	}

	// 处理空结果
	if routeResults == nil {
		return []scene_audio_route_models.ArtistMetadata{}, nil
	}

	return routeResults, nil
}

// 分页参数处理
func getPagination(start, end string) (skip int, limit int) {
	skip, _ = strconv.Atoi(start)
	limit, _ = strconv.Atoi(end)

	// 设置默认值
	if limit == 0 {
		limit = 50 // 默认每页20条
	}
	if skip < 0 {
		skip = 0
	}
	return
}

// 排序参数处理
func getSortOption_Artist(sortField, order string) bson.D {
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
