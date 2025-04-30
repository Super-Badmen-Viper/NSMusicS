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

	// 1. 获取播放列表轨迹元数据
	tracks, err := r.getRawPlaylistTracks(ctx, end, order, sort, start, search, starred, albumId, artistId, year, playlistId)
	if err != nil {
		return nil, err
	}

	// 2. 获取关联的媒体文件
	return r.getMediaFilesByTrackIDs(ctx, tracks)
}
func (r *playlistTrackRepository) getRawPlaylistTracks(
	ctx context.Context,
	end, order, sort, start, search, starred, albumId, artistId, year, playlistId string,
) ([]scene_audio_route_models.PlaylistTrackMetadata, error) {
	collection := r.db.Collection(r.collection)

	// 转换PlaylistID
	objID, err := primitive.ObjectIDFromHex(playlistId)
	if err != nil {
		return nil, fmt.Errorf("invalid playlist id: %w", err)
	}

	// 构建基础过滤条件
	filter := bson.M{"playlist_id": objID}

	// 添加可选过滤条件
	if albumId != "" {
		if albumObjID, err := primitive.ObjectIDFromHex(albumId); err == nil {
			filter["album_id"] = albumObjID
		}
	}
	if artistId != "" {
		if artistObjID, err := primitive.ObjectIDFromHex(artistId); err == nil {
			filter["artist_id"] = artistObjID
		}
	}
	if search != "" {
		filter["$or"] = []bson.M{
			{"title": bson.M{"$regex": search, "$options": "i"}},
			{"artist": bson.M{"$regex": search, "$options": "i"}},
		}
	}

	// 处理分页参数
	skip := 0
	if start != "" {
		s, err := strconv.Atoi(start)
		if err == nil && s >= 0 {
			skip = s
		}
	}

	limit := 50
	if end != "" {
		l, err := strconv.Atoi(end)
		if err == nil && l > 0 && l <= 1000 {
			limit = l
		}
	}

	// 构建排序选项
	sortField := "_id"
	validSortFields := map[string]bool{
		"_id":        true,
		"created_at": true,
		"updated_at": true,
		"duration":   true,
		"size":       true,
		"path":       true,
		"title":      true,
		"album":      true,
		"artist":     true,
		"play_count": true,
		"play_date":  true,
	}
	if sort == "id" {
		sort = "_id"
	}
	if validSortFields[sort] {
		sortField = sort
	}

	sortOrder := 1
	if order == "desc" {
		sortOrder = -1
	}

	opts := options.Find().
		SetSort(bson.D{{Key: sortField, Value: sortOrder}}).
		SetSkip(int64(skip)).
		SetLimit(int64(limit))

	// 处理时间类型字段的特殊排序需求
	if sortField == "play_date" || sortField == "created_at" || sortField == "updated_at" {
		opts.SetSort(bson.D{
			{Key: sortField, Value: sortOrder},
			{Key: "_id", Value: 1}, // 添加二级排序确保稳定性
		})
	} else {
		opts.SetSort(bson.D{{Key: sortField, Value: sortOrder}})
	}

	// 执行查询
	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, fmt.Errorf("database query failed: %w", err)
	}
	defer cursor.Close(ctx)

	var results []scene_audio_route_models.PlaylistTrackMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("decode error: %w", err)
	}

	return results, nil
}
func (r *playlistTrackRepository) getMediaFilesByTrackIDs(
	ctx context.Context,
	tracks []scene_audio_route_models.PlaylistTrackMetadata,
) ([]scene_audio_route_models.MediaFileMetadata, error) {

	// 1. 提取所有媒体文件ID
	mediaFileIDs := make([]primitive.ObjectID, 0, len(tracks))
	for _, track := range tracks {
		mediaFileIDs = append(mediaFileIDs, track.MediaFileID)
	}

	// 2. 查询媒体文件集合
	mediaFileColl := r.db.Collection(domain.CollectionFileEntityAudioMediaFile)
	filter := bson.M{"_id": bson.M{"$in": mediaFileIDs}}

	cursor, err := mediaFileColl.Find(ctx, filter)
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
