// scene_audio_route_repository/playlist_track_repository.go
package scene_audio_route_repository

import (
	"context"
	"errors"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"strconv"
	"strings"
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

func (r *playlistTrackRepository) GetPlaylistTrackItems(
	ctx context.Context,
	end, order, sort, start, search, starred, albumId, artistId, year, playlistId string,
) ([]scene_audio_route_models.MediaFileMetadata, error) {
	// 1. 获取播放列表关联的媒体文件ID
	mediaFileIDs, err := r.getPlaylistMediaFileIDs(ctx, playlistId)
	if err != nil {
		return nil, err
	}

	// 2. 直接查询媒体文件表
	return r.queryMediaFilesWithFilters(
		ctx,
		mediaFileIDs,
		end, order, sort, start,
		search, starred, albumId, artistId, year,
	)
}
func (r *playlistTrackRepository) getPlaylistMediaFileIDs(
	ctx context.Context,
	playlistId string,
) ([]primitive.ObjectID, error) {
	// 转换PlaylistID
	objID, err := primitive.ObjectIDFromHex(playlistId)
	if err != nil {
		return nil, fmt.Errorf("invalid playlist id: %w", err)
	}

	// 简单查询获取所有关联的媒体文件ID
	filter := bson.M{"playlist_id": objID}
	opts := options.Find().SetProjection(bson.M{"media_file_id": 1})

	cursor, err := r.db.Collection(r.collection).Find(ctx, filter, opts)
	if err != nil {
		return nil, fmt.Errorf("database query failed: %w", err)
	}
	defer cursor.Close(ctx)

	var results []struct {
		MediaFileID primitive.ObjectID `bson:"media_file_id"`
	}
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("decode error: %w", err)
	}

	// 提取ID列表
	ids := make([]primitive.ObjectID, 0, len(results))
	for _, item := range results {
		ids = append(ids, item.MediaFileID)
	}

	return ids, nil
}
func (r *playlistTrackRepository) queryMediaFilesWithFilters(
	ctx context.Context,
	mediaFileIDs []primitive.ObjectID,
	end, order, sort, start, search, starred, albumId, artistId, year string,
) ([]scene_audio_route_models.MediaFileMetadata, error) {
	collection := r.db.Collection(domain.CollectionFileEntityAudioMediaFile)

	filter := bson.M{
		"_id": bson.M{"$in": mediaFileIDs},
	}
	if albumId != "" {
		filter["album_id"] = albumId
	}
	if artistId != "" {
		filter["artist_id"] = artistId
	}
	if search != "" {
		filter["$or"] = []bson.M{
			{"title": bson.M{"$regex": search, "$options": "i"}},
			{"artist": bson.M{"$regex": search, "$options": "i"}},
			{"album": bson.M{"$regex": search, "$options": "i"}},
		}
	}
	if starred != "" {
		if isStarred, err := strconv.ParseBool(starred); err == nil {
			filter["starred"] = isStarred
		}
	}
	if year != "" {
		if yearInt, err := strconv.Atoi(year); err == nil {
			filter["year"] = yearInt
		}
	}

	// 处理分页
	skip, _ := strconv.Atoi(start)
	limit, _ := strconv.Atoi(end)

	validSortFields := map[string]bool{
		// 播放相关
		"play_count": true, "play_date": true,
		// 用户互动
		"rating": true, "starred": true, "starred_at": true,
		// 核心元数据
		"title": true, "artist": true, "album": true, "year": true, "genre": true,
		// 技术属性
		"duration": true, "bit_rate": true, "size": true, "channels": true, "suffix": true,
		// 时间戳
		"created_at": true, "updated_at": true,
		// 关联ID
		"artist_id": true, "album_id": true, "album_artist_id": true,
		// 扩展属性
		"has_cover_art": true, "path": true,
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

	// 执行查询
	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, fmt.Errorf("media files query failed: %w", err)
	}
	defer cursor.Close(ctx)

	var results []scene_audio_route_models.MediaFileMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("media files decode error: %w", err)
	}

	return results, nil
}

func (r *playlistTrackRepository) AddPlaylistTrackItems(
	ctx context.Context,
	playlistId string,
	mediaFileIds string,
) (bool, error) {
	// 参数校验
	pID, err := primitive.ObjectIDFromHex(playlistId)
	if err != nil {
		return false, errors.New("invalid playlist id format")
	}

	// 分割并验证媒体文件ID
	ids, err := splitMediaFileIds(mediaFileIds)
	if err != nil {
		return false, fmt.Errorf("invalid media file ids: %w", err)
	}

	// 构造插入文档
	docs := make([]interface{}, len(ids))
	for i, id := range ids {
		docs[i] = scene_audio_route_models.PlaylistTrackMetadata{
			ID:          i,
			PlaylistID:  pID,
			MediaFileID: id,
		}
	}

	// 使用封装的InsertMany方法
	coll := r.db.Collection(r.collection)
	_, err = coll.InsertMany(ctx, docs)
	if err != nil {
		if isDuplicateError(err) {
			return true, nil // 部分插入成功
		}
		return false, fmt.Errorf("insert failed: %w", err)
	}

	return true, nil
}

func (r *playlistTrackRepository) RemovePlaylistTrackItems(
	ctx context.Context,
	playlistId string,
	mediaFileIds string,
) (bool, error) {
	pID, err := primitive.ObjectIDFromHex(playlistId)
	if err != nil {
		return false, errors.New("invalid playlist id format")
	}

	ids, err := splitMediaFileIds(mediaFileIds)
	if err != nil {
		return false, fmt.Errorf("invalid media file ids: %w", err)
	}

	// 使用封装的DeleteMany方法
	filter := bson.M{
		"playlist_id":   pID,
		"media_file_id": bson.M{"$in": ids},
	}

	coll := r.db.Collection(r.collection)
	_, err = coll.DeleteMany(ctx, filter)
	if err != nil {
		return false, fmt.Errorf("delete failed: %w", err)
	}

	return true, nil
}

func (r *playlistTrackRepository) SortPlaylistTrackItems(
	ctx context.Context,
	playlistId string,
	mediaFileIds string,
) (bool, error) {
	pID, err := primitive.ObjectIDFromHex(playlistId)
	if err != nil {
		return false, errors.New("invalid playlist id format")
	}

	ids, err := splitMediaFileIds(mediaFileIds)
	if err != nil {
		return false, fmt.Errorf("invalid media file ids: %w", err)
	}

	// 使用封装的UpdateOne方法
	coll := r.db.Collection(r.collection)
	for index, id := range ids {
		filter := bson.M{
			"playlist_id":   pID,
			"media_file_id": id,
		}
		update := bson.M{"$set": bson.M{"position": index + 1}}

		_, err := coll.UpdateOne(ctx, filter, update)
		if err != nil {
			return false, fmt.Errorf("update failed at index %d: %w", index, err)
		}
	}

	return true, nil
}

// 辅助函数
func splitMediaFileIds(ids string) ([]primitive.ObjectID, error) {
	var objectIDs []primitive.ObjectID
	for _, idStr := range strings.Split(ids, ",") {
		idStr = strings.TrimSpace(idStr)
		if idStr == "" {
			continue
		}
		objID, err := primitive.ObjectIDFromHex(idStr)
		if err != nil {
			return nil, err
		}
		objectIDs = append(objectIDs, objID)
	}
	return objectIDs, nil
}

func isDuplicateError(err error) bool {
	return strings.Contains(err.Error(), "E11000")
}
