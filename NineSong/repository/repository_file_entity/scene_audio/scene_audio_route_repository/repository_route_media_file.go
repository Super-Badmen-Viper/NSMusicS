// scene_audio_route_repository/mediafile_repository.go
package scene_audio_route_repository

import (
	"context"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"strconv"
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

func (r *mediaFileRepository) GetMediaFileItems(
	ctx context.Context,
	end, order, sort, start, search, starred, albumId, artistId, year string,
) ([]scene_audio_route_models.MediaFileMetadata, error) {
	collection := r.db.Collection(r.collection)

	// 构建复合查询条件
	filter := bson.M{}
	if artistId != "" {
		filter["artist_id"] = artistId
	}
	if albumId != "" {
		filter["album_id"] = albumId
	}
	if year != "" {
		if yearInt, err := strconv.Atoi(year); err == nil {
			filter["year"] = yearInt
		}
	}
	if search != "" {
		filter["$or"] = []bson.M{
			{"title": bson.M{"$regex": search, "$options": "i"}},
			{"artist": bson.M{"$regex": search, "$options": "i"}},
			{"album": bson.M{"$regex": search, "$options": "i"}},
		}
	}
	if starred != "" {
		isStarred, err := strconv.ParseBool(starred)
		if err != nil {
			return nil, fmt.Errorf("invalid starred parameter: %w", err)
		}
		filter["starred"] = isStarred
	}

	// 处理分页
	skip, _ := strconv.Atoi(start)
	limit, _ := strconv.Atoi(end)
	if limit == 0 || limit > 100 {
		limit = 50
	}

	// 安全排序字段白名单
	validSortFields := map[string]bool{
		"title": true, "artist": true,
		"year": true, "duration": true,
	}
	if !validSortFields[sort] {
		sort = "title"
	}

	// 构建排序
	sortOrder := 1
	if order == "desc" {
		sortOrder = -1
	}
	opts := options.Find().
		SetSort(bson.D{{Key: sort, Value: sortOrder}}).
		SetSkip(int64(skip)).
		SetLimit(int64(limit))

	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, fmt.Errorf("database query failed: %w", err)
	}
	defer cursor.Close(ctx)

	var results []scene_audio_route_models.MediaFileMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("decode error: %w", err)
	}

	// 后处理逻辑
	for i := range results {
		if !results[i].HasCoverArt {
			results[i].HasCoverArt = checkFallbackCover(results[i].AlbumID)
		}
	}

	return results, nil
}

func checkFallbackCover(albumID string) bool {
	// 实现1: 简单校验专辑ID格式
	if _, err := strconv.Atoi(albumID); err == nil {
		return true // 假设有效ID即有封面
	}
	return false

	// 实现2: 实际数据库查询（需注入collection）
	/*
	   ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	   defer cancel()

	   var result struct{ HasCover bool }
	   err := collection.FindOne(ctx, bson.M{"album_id": albumID}).Decode(&result)
	   return err == nil && result.HasCover
	*/
}
