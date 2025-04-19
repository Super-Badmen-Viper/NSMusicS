package scene_audio_route_repository

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type playlistRepository struct {
	db         mongo.Database
	collection string
}

func NewPlaylistRepository(db mongo.Database, collection string) scene_audio_route_interface.PlaylistRepository {
	return &playlistRepository{
		db:         db,
		collection: collection,
	}
}

// 获取所有播放列表
func (p *playlistRepository) GetPlaylistsAll(ctx context.Context) ([]scene_audio_route_models.PlaylistMetadata, error) {
	coll := p.db.Collection(p.collection)
	cursor, err := coll.Find(ctx, bson.M{}, options.Find().SetSort(bson.D{{"created_at", -1}}))
	if err != nil {
		return nil, fmt.Errorf("find operation failed: %w", err)
	}
	defer cursor.Close(ctx)

	var dbModels []scene_audio_db_models.PlaylistMetadata
	if err := cursor.All(ctx, &dbModels); err != nil {
		return nil, fmt.Errorf("decode error: %w", err)
	}

	return convertToRouteModels(dbModels), nil
}

// 获取单个播放列表
func (p *playlistRepository) GetPlaylist(ctx context.Context, playlistId string) (*scene_audio_route_models.PlaylistMetadata, error) {
	objID, err := primitive.ObjectIDFromHex(playlistId)
	if err != nil {
		return nil, errors.New("invalid playlist id format")
	}

	coll := p.db.Collection(p.collection)
	var dbModel scene_audio_db_models.PlaylistMetadata
	err = coll.FindOne(ctx, bson.M{"_id": objID}).Decode(&dbModel)
	if err != nil {
		return nil, fmt.Errorf("find one error: %w", err)
	}

	return convertToRouteModel(dbModel), nil
}

// 创建播放列表
func (p *playlistRepository) CreatePlaylist(ctx context.Context, playlist scene_audio_route_models.PlaylistMetadata) (*scene_audio_route_models.PlaylistMetadata, error) {
	if playlist.ID.IsZero() {
		playlist.ID = primitive.NewObjectID()
	}

	now := time.Now().UTC()
	playlist.CreatedAt = now
	playlist.UpdatedAt = now

	dbModel := convertToDBModel(playlist)

	coll := p.db.Collection(p.collection)
	if _, err := coll.InsertOne(ctx, dbModel); err != nil {
		return nil, fmt.Errorf("insert failed: %w", err)
	}

	return &playlist, nil
}

// 删除播放列表
func (p *playlistRepository) DeletePlaylist(ctx context.Context, playlistId string) (bool, error) {
	objID, err := primitive.ObjectIDFromHex(playlistId)
	if err != nil {
		return false, errors.New("invalid playlist id format")
	}

	coll := p.db.Collection(p.collection)
	_, err = coll.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		return false, fmt.Errorf("delete failed: %w", err)
	}

	return true, nil
}

// 更新播放列表基本信息
func (p *playlistRepository) UpdatePlaylistInfo(ctx context.Context, playlistId string, playlist scene_audio_route_models.PlaylistMetadata) (bool, error) {
	objID, err := primitive.ObjectIDFromHex(playlistId)
	if err != nil {
		return false, errors.New("invalid playlist id format")
	}

	update := bson.M{
		"$set": bson.M{
			"name":       playlist.Name,
			"comment":    playlist.Comment,
			"public":     playlist.Public,
			"updated_at": time.Now().UTC(),
		},
	}

	coll := p.db.Collection(p.collection)
	result, err := coll.UpdateByID(ctx, objID, update)
	if err != nil {
		return false, fmt.Errorf("update failed: %w", err)
	}

	if result.MatchedCount == 0 {
		return false, errors.New("document not found")
	}

	return true, nil
}

// 添加媒体文件到播放列表
func (p *playlistRepository) UpdatePlaylistMediaFileIdToAdd(ctx context.Context, playlistId string, mediaFileIds string) (bool, error) {
	objID, err := primitive.ObjectIDFromHex(playlistId)
	if err != nil {
		return false, errors.New("invalid playlist id format")
	}

	ids, err := splitMediaFileIds(mediaFileIds)
	if err != nil {
		return false, fmt.Errorf("invalid media file ids: %w", err)
	}

	update := bson.M{
		"$addToSet": bson.M{"media_file_ids": bson.M{"$each": ids}},
		"$set":      bson.M{"updated_at": time.Now().UTC()},
	}

	coll := p.db.Collection(p.collection)
	result, err := coll.UpdateByID(ctx, objID, update)
	if err != nil {
		return false, fmt.Errorf("update failed: %w", err)
	}

	if result.MatchedCount == 0 {
		return false, errors.New("document not found")
	}

	return true, nil
}

// 从播放列表移除媒体文件
func (p *playlistRepository) UpdatePlaylistMediaFileIndexToRemove(ctx context.Context, playlistId string, mediaFileIds string) (bool, error) {
	objID, err := primitive.ObjectIDFromHex(playlistId)
	if err != nil {
		return false, errors.New("invalid playlist id format")
	}

	ids, err := splitMediaFileIds(mediaFileIds)
	if err != nil {
		return false, fmt.Errorf("invalid media file ids: %w", err)
	}

	update := bson.M{
		"$pull": bson.M{"media_file_ids": bson.M{"$in": ids}},
		"$set":  bson.M{"updated_at": time.Now().UTC()},
	}

	coll := p.db.Collection(p.collection)
	result, err := coll.UpdateByID(ctx, objID, update)
	if err != nil {
		return false, fmt.Errorf("update failed: %w", err)
	}

	if result.MatchedCount == 0 {
		return false, errors.New("document not found")
	}

	return true, nil
}

// 辅助函数：分割媒体文件ID
func splitMediaFileIds(ids string) ([]primitive.ObjectID, error) {
	var objectIDs []primitive.ObjectID
	for _, idStr := range strings.Split(ids, ",") {
		objID, err := primitive.ObjectIDFromHex(strings.TrimSpace(idStr))
		if err != nil {
			return nil, err
		}
		objectIDs = append(objectIDs, objID)
	}
	return objectIDs, nil
}

// 数据库模型转换
func convertToDBModel(routeModel scene_audio_route_models.PlaylistMetadata) scene_audio_db_models.PlaylistMetadata {
	return scene_audio_db_models.PlaylistMetadata{
		ID:        routeModel.ID,
		Name:      routeModel.Name,
		Comment:   routeModel.Comment,
		Duration:  routeModel.Duration,
		SongCount: routeModel.SongCount,
		CreatedAt: routeModel.CreatedAt,
		UpdatedAt: routeModel.UpdatedAt,
		Path:      routeModel.Path,
		Size:      routeModel.Size,
		OwnerID:   routeModel.OwnerID,
		Public:    routeModel.Public,
	}
}

// 路由模型转换
func convertToRouteModel(dbModel scene_audio_db_models.PlaylistMetadata) *scene_audio_route_models.PlaylistMetadata {
	return &scene_audio_route_models.PlaylistMetadata{
		ID:        dbModel.ID,
		Name:      dbModel.Name,
		Comment:   dbModel.Comment,
		Duration:  dbModel.Duration,
		SongCount: dbModel.SongCount,
		CreatedAt: dbModel.CreatedAt,
		UpdatedAt: dbModel.UpdatedAt,
		Path:      dbModel.Path,
		Size:      dbModel.Size,
		OwnerID:   dbModel.OwnerID,
		Public:    dbModel.Public,
	}
}

// 批量转换路由模型
func convertToRouteModels(dbModels []scene_audio_db_models.PlaylistMetadata) []scene_audio_route_models.PlaylistMetadata {
	routeModels := make([]scene_audio_route_models.PlaylistMetadata, 0, len(dbModels))
	for _, m := range dbModels {
		routeModels = append(routeModels, *convertToRouteModel(m))
	}
	return routeModels
}
