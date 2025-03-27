package repository_file_entity

import (
	"context"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"path/filepath"
	"strings"
	"time"
)

type folderRepo struct {
	db         mongo.Database
	collection string
}

func NewFolderRepo(db mongo.Database, collection string) domain_file_entity.FolderRepository {
	return &folderRepo{
		db:         db,
		collection: collection,
	}
}

func (r *folderRepo) FindByPath(ctx context.Context, path string) (*domain_file_entity.FolderMetadata, error) {
	collection := r.db.Collection(r.collection)

	// 增强路径标准化处理
	normalizedPath := normalizePath(path)
	fmt.Printf("DEBUG - 查询路径: 原始='%s' 标准化='%s'\n", path, normalizedPath)

	var folder domain_file_entity.FolderMetadata
	err := collection.FindOne(ctx, bson.M{"folder_path": normalizedPath}).Decode(&folder)

	if err != nil {
		// 精确错误类型判断
		if isNotFound(err) {
			fmt.Printf("DEBUG - 未找到路径: %s\n", normalizedPath)
			return nil, nil
		}
		fmt.Printf("ERROR - 数据库查询失败: %v\n", err)
		return nil, fmt.Errorf("数据库操作失败: %w", err)
	}

	// 验证查询结果
	fmt.Printf("DEBUG - 找到文件夹: ID=%s 路径=%s\n", folder.ID.Hex(), folder.FolderPath)
	return &folder, nil
}
func normalizePath(rawPath string) string {
	// 清理路径并转换分隔符
	cleaned := filepath.Clean(rawPath)
	withSlashes := filepath.ToSlash(cleaned)

	// 移除尾部斜杠
	return strings.TrimSuffix(withSlashes, "/")
}
func isNotFound(err error) bool {
	return strings.Contains(err.Error(), "no documents in result") ||
		strings.Contains(err.Error(), "not found")
}

func (r *folderRepo) Insert(ctx context.Context, folder *domain_file_entity.FolderMetadata) error {
	collection := r.db.Collection(r.collection)
	// 强制路径标准化
	folder.FolderPath = filepath.ToSlash(filepath.Clean(folder.FolderPath))
	document := bson.M{
		"_id":         folder.ID,
		"folder_path": folder.FolderPath,
		"folder_meta": bson.M{
			"file_count":   folder.FolderMeta.FileCount,
			"last_scanned": folder.FolderMeta.LastScanned,
		},
	}
	_, err := collection.InsertOne(ctx, document)
	return err
}

func (r *folderRepo) UpdateStats(ctx context.Context, folderID primitive.ObjectID, fileCount int) error {
	collection := r.db.Collection(r.collection)
	_, err := collection.UpdateByID(
		ctx,
		folderID,
		bson.M{
			"$set": bson.M{
				"folder_meta.file_count":   fileCount,
				"folder_meta.last_scanned": time.Now(),
			},
		},
	)
	return err
}

type fileRepo struct {
	db         mongo.Database
	collection string
}

func NewFileRepo(db mongo.Database, collection string) domain_file_entity.FileRepository {
	return &fileRepo{db: db, collection: collection}
}

func (r *fileRepo) Upsert(ctx context.Context, file *domain_file_entity.FileMetadata) error {
	filter := bson.M{
		"folder_id": file.FolderID,
		"file_path": file.FilePath,
	}

	update := bson.M{
		"$set": bson.M{
			"size":       file.Size,
			"mod_time":   file.ModTime,
			"updated_at": time.Now(),
			"checksum":   file.Checksum,
			"file_type":  file.FileType,
		},
		"$setOnInsert": bson.M{
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
