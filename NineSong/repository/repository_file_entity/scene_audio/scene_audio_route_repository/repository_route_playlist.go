package scene_audio_route_repository

import (
	"context"
	"errors"
	"fmt"
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
	// 构造新的唯一性校验条件
	filter := bson.D{
		{"name", playlist.Name}, // 仅保留name字段校验[3,4](@ref)
	}

	// 查询重复项
	count, err := p.db.Collection(p.collection).CountDocuments(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("query failed: %w", err)
	}
	if count > 0 {
		return nil, errors.New("playlist name already exists")
	}

	if playlist.ID.IsZero() {
		playlist.ID = primitive.NewObjectID()
	}

	now := time.Now().UTC()
	playlist.CreatedAt = now
	playlist.UpdatedAt = now

	dbModel := convertToDBModel(playlist)

	coll := p.db.Collection(p.collection)
	insertResult, err := coll.InsertOne(ctx, dbModel)
	if err != nil {
		return nil, fmt.Errorf("insert failed: %w", err)
	}

	// 获取生成的ObjectID
	if oid, ok := insertResult.(primitive.ObjectID); ok {
		playlist.ID = oid
	} else {
		return nil, errors.New("invalid objectid generated")
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
func (p *playlistRepository) UpdatePlaylistInfo(ctx context.Context, playlistId string, playlist scene_audio_route_models.PlaylistMetadata) (*scene_audio_route_models.PlaylistMetadata, error) {
	objID, err := primitive.ObjectIDFromHex(playlistId)
	if err != nil {
		return nil, errors.New("invalid playlist id format")
	}

	// 添加名称唯一性检查
	filter := bson.M{
		"name": playlist.Name,
		"_id":  bson.M{"$ne": objID},
	}
	count, err := p.db.Collection(p.collection).CountDocuments(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("name check failed: %w", err)
	}
	if count > 0 {
		return nil, errors.New("playlist name already exists")
	}

	update := bson.M{
		"$set": bson.M{
			"name":       playlist.Name,
			"comment":    playlist.Comment,
			"updated_at": time.Now().UTC(),
		},
	}

	coll := p.db.Collection(p.collection)
	// 执行更新操作
	result, err := coll.UpdateByID(ctx, objID, update)
	if err != nil {
		return nil, fmt.Errorf("update failed: %w", err)
	}
	if result.MatchedCount == 0 {
		return nil, errors.New("document not found")
	}

	// 新增：查询更新后的文档
	var updatedDoc scene_audio_db_models.PlaylistMetadata
	err = coll.FindOne(ctx, bson.M{"_id": objID}).Decode(&updatedDoc)
	if err != nil {
		return nil, fmt.Errorf("fetch updated document failed: %w", err)
	}

	return convertToRouteModel(updatedDoc), nil
}

// 数据库模型转换
func convertToDBModel(routeModel scene_audio_route_models.PlaylistMetadata) scene_audio_db_models.PlaylistMetadata {
	return scene_audio_db_models.PlaylistMetadata{
		ID:        routeModel.ID,
		Name:      routeModel.Name,
		Comment:   routeModel.Comment,
		CreatedAt: routeModel.CreatedAt,
		UpdatedAt: routeModel.UpdatedAt,
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
