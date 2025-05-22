package scene_audio_route_repository

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	driver "go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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
	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	coll := r.db.Collection(r.collection)

	// 构建完整聚合管道
	pipeline := []bson.D{
		// 匹配播放列表
		{
			{Key: "$match", Value: bson.D{
				{Key: "playlist_id", Value: mustObjectID(playlistId)},
			}},
		},
		// 关联媒体文件
		{
			{Key: "$lookup", Value: bson.D{
				{Key: "from", Value: domain.CollectionFileEntityAudioMediaFile},
				{Key: "localField", Value: "media_file_id"},
				{Key: "foreignField", Value: "_id"},
				{Key: "as", Value: "media_file"},
			}},
		},
		{
			{Key: "$unwind", Value: bson.D{
				{Key: "path", Value: "$media_file"},
				{Key: "preserveNullAndEmptyArrays", Value: false},
			}},
		},
		// 关联注解数据
		{
			{Key: "$lookup", Value: bson.D{
				{Key: "from", Value: domain.CollectionFileEntityAudioAnnotation},
				{Key: "let", Value: bson.D{{Key: "mediaId", Value: "$media_file._id"}}},
				{Key: "pipeline", Value: []bson.D{
					{
						{Key: "$match", Value: bson.D{
							{Key: "$expr", Value: bson.D{
								{Key: "$and", Value: bson.A{
									bson.D{{Key: "$eq", Value: bson.A{"$item_id", "$$mediaId"}}},
									bson.D{{Key: "$eq", Value: bson.A{"$item_type", "media"}}},
								}},
							}},
						}},
					},
				}},
				{Key: "as", Value: "annotations"},
			}},
		},
		{
			{Key: "$unwind", Value: bson.D{
				{Key: "path", Value: "$annotations"},
				{Key: "preserveNullAndEmptyArrays", Value: true},
			}},
		},
		// 合并字段
		{
			{Key: "$addFields", Value: bson.D{
				{Key: "media_file.play_count", Value: "$annotations.play_count"},
				{Key: "media_file.play_date", Value: "$annotations.play_date"},
				{Key: "media_file.rating", Value: "$annotations.rating"},
				{Key: "media_file.starred", Value: "$annotations.starred"},
				{Key: "media_file.starred_at", Value: "$annotations.starred_at"},
				{Key: "media_file.index", Value: "$index"}, // 关键修改点
			}},
		},
		// 替换根节点
		{
			{Key: "$replaceRoot", Value: bson.D{
				{Key: "newRoot", Value: bson.D{
					{Key: "$mergeObjects", Value: bson.A{
						"$media_file",
						bson.D{
							{Key: "index", Value: "$index"}, // 保持小写字段名
						},
					}},
				}},
			}},
		},
	}

	// 构建过滤条件
	if match := buildMediaMatch(search, starred, albumId, artistId, year); len(match) > 0 {
		pipeline = append(pipeline, bson.D{{Key: "$match", Value: match}})
	}

	// 处理排序
	validatedSort := validateMediaSortField(sort)
	pipeline = append(pipeline, buildMediaSortStage(validatedSort, order))

	// 分页处理
	pipeline = append(pipeline, buildMediaPaginationStage(start, end)...)

	cursor, err := coll.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("database query failed: %w", err)
	}
	defer func(cursor mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			fmt.Printf("error closing cursor: %v\n", err)
		}
	}(cursor, ctx)

	var results []scene_audio_route_models.MediaFileMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("解码错误: %w", err)
	}

	return results, nil
}

func (r *playlistTrackRepository) GetPlaylistTrackFilterItemsCount(
	ctx context.Context,
	search, albumId, artistId, year string,
) (*scene_audio_route_models.MediaFileFilterCounts, error) {
	coll := r.db.Collection(r.collection)

	pipeline := []bson.D{
		{
			{Key: "$lookup", Value: bson.D{
				{Key: "from", Value: domain.CollectionFileEntityAudioMediaFile},
				{Key: "localField", Value: "media_file_id"},
				{Key: "foreignField", Value: "_id"},
				{Key: "as", Value: "media_file"},
			}},
		},
		{
			{Key: "$unwind", Value: bson.D{
				{Key: "path", Value: "$media_file"},
				{Key: "preserveNullAndEmptyArrays", Value: false},
			}},
		},
		{
			{Key: "$lookup", Value: bson.D{
				{Key: "from", Value: domain.CollectionFileEntityAudioAnnotation},
				{Key: "let", Value: bson.D{{Key: "mediaId", Value: "$media_file._id"}}},
				{Key: "pipeline", Value: []bson.D{
					{
						{Key: "$match", Value: bson.D{
							{Key: "$expr", Value: bson.D{
								{Key: "$and", Value: bson.A{
									bson.D{{Key: "$eq", Value: bson.A{"$item_id", "$$mediaId"}}},
									bson.D{{Key: "$eq", Value: bson.A{"$item_type", "media"}}},
								}},
							}},
						}},
					},
				}},
				{Key: "as", Value: "annotations"},
			}},
		},
		{
			{Key: "$match", Value: buildMediaBaseMatch(search, albumId, artistId, year)},
		},
		{
			{Key: "$facet", Value: bson.D{
				{Key: "total", Value: []bson.D{{{Key: "$count", Value: "count"}}}},
				{Key: "starred", Value: []bson.D{
					{{Key: "$match", Value: bson.D{{Key: "annotations.starred", Value: true}}}},
					{{Key: "$count", Value: "count"}},
				}},
				{Key: "recent_play", Value: []bson.D{
					{{Key: "$match", Value: bson.D{{Key: "annotations.play_count", Value: bson.D{{Key: "$gt", Value: 0}}}}}},
					{{Key: "$count", Value: "count"}},
				}},
			}},
		},
	}

	cursor, err := coll.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("count query failed: %w", err)
	}
	defer func(cursor mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			fmt.Printf("error closing cursor: %v\n", err)
		}
	}(cursor, ctx)

	var result []struct {
		Total      []map[string]int `bson:"total"`
		Starred    []map[string]int `bson:"starred"`
		RecentPlay []map[string]int `bson:"recent_play"`
	}

	if err := cursor.All(ctx, &result); err != nil {
		return nil, fmt.Errorf("decode count error: %w", err)
	}

	counts := &scene_audio_route_models.MediaFileFilterCounts{}
	if len(result) > 0 {
		counts.Total = extractCount(result[0].Total)
		counts.Starred = extractCount(result[0].Starred)
		counts.RecentPlay = extractCount(result[0].RecentPlay)
	}

	return counts, nil
}

// Helper functions
func mustObjectID(hex string) primitive.ObjectID {
	objID, err := primitive.ObjectIDFromHex(hex)
	if err != nil {
		return primitive.NilObjectID
	}
	return objID
}

func buildMediaBaseMatch(search, albumId, artistId, year string) bson.D {
	return buildMediaMatch(search, "", albumId, artistId, year)
}

func buildMediaMatch(search, starred, albumId, artistId, year string) bson.D {
	filter := bson.D{}

	// 专辑ID过滤
	if albumId != "" {
		filter = append(filter, bson.E{Key: "album_id", Value: mustObjectID(albumId)})
	}

	// 艺术家ID过滤
	if artistId != "" {
		filter = append(filter, bson.E{Key: "artist_id", Value: mustObjectID(artistId)})
	}

	// 年份过滤
	if year != "" {
		if yearInt, err := strconv.Atoi(year); err == nil {
			filter = append(filter, bson.E{Key: "year", Value: yearInt})
		}
	}

	// 搜索条件
	if search != "" {
		filter = append(filter, bson.E{
			Key: "$or",
			Value: []bson.D{
				{{Key: "title", Value: bson.D{{Key: "$regex", Value: search}, {Key: "$options", Value: "i"}}}},
				{{Key: "artist", Value: bson.D{{Key: "$regex", Value: search}, {Key: "$options", Value: "i"}}}},
				{{Key: "album", Value: bson.D{{Key: "$regex", Value: search}, {Key: "$options", Value: "i"}}}},
			},
		})
	}

	// Starred过滤
	if starred != "" {
		if isStarred, err := strconv.ParseBool(starred); err == nil {
			filter = append(filter, bson.E{Key: "starred", Value: isStarred})
		}
	}

	return filter
}

func validateMediaSortField(sort string) string {
	validSortFields := map[string]bool{
		"index":      true,
		"play_count": true, "play_date": true, "title": true,
		"artist": true, "album": true, "year": true,
		"duration": true, "bit_rate": true, "size": true,
		"rating": true, "starred_at": true,
		"created_at": true, "updated_at": true,
	}
	if strings.ToLower(sort) == "_id" {
		return "index"
	}
	if validSortFields[strings.ToLower(sort)] {
		return strings.ToLower(sort)
	}
	return "index"
}

func buildMediaSortStage(sort, order string) bson.D {
	if sort == "_id" {
		sort = "index"
	}

	sortOrder := 1
	if order == "desc" {
		sortOrder = -1
	}

	return bson.D{
		{Key: "$sort", Value: bson.D{
			{Key: sort, Value: sortOrder},
		}},
	}
}

func (r *playlistTrackRepository) AddPlaylistTrackItems(
	ctx context.Context,
	playlistId string,
	mediaFileIds string,
) (bool, error) {
	pID, err := primitive.ObjectIDFromHex(playlistId)
	if err != nil {
		return false, errors.New("invalid playlist id format")
	}

	mediaIDs, err := splitMediaFileIds(mediaFileIds)
	if err != nil {
		return false, fmt.Errorf("invalid media file ids: %w", err)
	}

	// 获取当前最大索引（需确保空集合返回0）
	maxIndex, err := r.getCurrentMaxIndex(ctx, pID)
	if err != nil {
		return false, fmt.Errorf("获取排序索引失败: %w", err)
	}

	docs := make([]interface{}, 0, len(mediaIDs))
	for i, mediaID := range mediaIDs {
		exists, err := r.exists(ctx, pID, mediaID)
		if err != nil {
			return false, fmt.Errorf("检查存在性时出错: %w", err)
		}
		if exists {
			continue
		}

		docs = append(docs, scene_audio_route_models.PlaylistTrackMetadata{
			ID:          primitive.NewObjectID(),
			PlaylistID:  pID,
			MediaFileID: mediaID,
			Index:       maxIndex + 1 + i, // 确保连续递增
		})
	}

	if len(docs) == 0 {
		return true, nil // 所有条目已存在时正常返回
	}

	if _, err := r.db.Collection(r.collection).InsertMany(ctx, docs); err != nil {
		return false, fmt.Errorf("批量插入失败: %w", err)
	}

	return true, nil
}

func (r *playlistTrackRepository) exists(
	ctx context.Context,
	playlistID primitive.ObjectID,
	mediaID primitive.ObjectID,
) (bool, error) {
	var track scene_audio_route_models.PlaylistTrackMetadata
	err := r.db.Collection(r.collection).FindOne(
		ctx,
		bson.M{
			"playlist_id":   playlistID,
			"media_file_id": mediaID,
		},
	).Decode(&track)

	// 核心修复点：处理空查询场景
	if err != nil {
		if errors.Is(err, driver.ErrNoDocuments) {
			return false, nil // 明确返回不存在
		}
		return false, fmt.Errorf("查询失败: %w", err) // 其他错误仍抛出
	}
	return true, nil
}

// 获取当前最大排序索引
func (r *playlistTrackRepository) getCurrentMaxIndex(
	ctx context.Context,
	playlistID primitive.ObjectID,
) (int, error) {
	limit := int64(1)
	cursor, err := r.db.Collection(r.collection).Find(ctx, bson.M{
		"playlist_id": playlistID,
	}, &options.FindOptions{
		Sort:  bson.D{{Key: "index", Value: -1}},
		Limit: &limit,
	})
	if err != nil {
		return 0, err
	}
	defer cursor.Close(ctx)

	var maxDoc scene_audio_route_models.PlaylistTrackMetadata
	if cursor.Next(ctx) {
		if err := cursor.Decode(&maxDoc); err != nil {
			return 0, err
		}
		return maxDoc.Index, nil
	}

	return 0, nil // 没有记录时返回0
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
