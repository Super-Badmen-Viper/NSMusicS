package repository_file_entity

import (
	"context"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"path/filepath"
	"time"
)

type fileRepo struct {
	db         mongo.Database
	collection string
}

func NewFileRepo(db mongo.Database, collection string) domain_file_entity.FileRepository {
	return &fileRepo{db: db, collection: collection}
}

func (r *fileRepo) FindByPath(ctx context.Context, path string) (*domain_file_entity.FileMetadata, error) {
	collection := r.db.Collection(r.collection)

	// 清理路径并转换为斜杠格式
	normalizedPath := filepath.ToSlash(filepath.Clean(path))

	// 调试输出路径
	fmt.Printf("DEBUG - 查询路径: 原始='%s' 标准化='%s'\n", path, normalizedPath)

	// 构造查询过滤器
	filter := bson.M{"file_path": normalizedPath}

	// 执行查询
	var result domain_file_entity.FileMetadata
	err := collection.FindOne(ctx, filter).Decode(&result)

	// 错误处理
	switch {
	case err != nil:
		log.Printf("[ERROR] 文件查询失败 | 路径: %s | 错误: %v", normalizedPath, err)
		return nil, fmt.Errorf("文件查询失败: %w", err)
	default:
		log.Printf("[DEBUG] 找到已有文件记录 | ID: %s | 路径: %s", result.ID.Hex(), normalizedPath)
		return &result, nil
	}
}

func (r *fileRepo) Upsert(ctx context.Context, file *domain_file_entity.FileMetadata) error {
	filter := bson.M{"file_path": file.FilePath}
	update := bson.M{
		"$set": bson.M{
			"size":       file.Size,
			"mod_time":   file.ModTime,
			"checksum":   file.Checksum,
			"folder_id":  file.FolderID,
			"updated_at": time.Now(),
		},
		"$setOnInsert": bson.M{
			"_id":        primitive.NewObjectID(),
			"created_at": time.Now(),
		},
	}
	opts := options.Update().SetUpsert(true)
	_, err := r.db.Collection(r.collection).UpdateOne(ctx, filter, update, opts)
	return err
}

func (r *fileRepo) DeleteByFolder(ctx context.Context, folderID primitive.ObjectID) error {
	_, err := r.db.Collection(r.collection).
		DeleteMany(ctx, bson.M{"folder_id": folderID})
	return err
}

func (r *fileRepo) CountByFolderID(ctx context.Context, folderID primitive.ObjectID) (int64, error) {
	return r.db.Collection(r.collection).
		CountDocuments(ctx, bson.M{"folder_id": folderID})
}
