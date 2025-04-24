package example_scene_audio_db_interface_of_media_file

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

// CacheManager 缓存与性能接口
type CacheManager interface {
	// 缓存控制
	PreloadHotMetadata(ctx context.Context, maxItems int) error
	InvalidateCache(ctx context.Context, ids []primitive.ObjectID) error

	// 查询缓存
	CachedSearch(ctx context.Context, query string) ([]*scene_audio_db_models.MediaFileMetadata, error)
}

// CacheStrategy 缓存策略
type CacheStrategy struct {
	TTL                  time.Duration
	EvictionPolicy       string // "lru", "lfu", "random"
	MaxSizeMB            int
	HotDataRefreshPolicy RefreshPolicy
}
type RefreshPolicy struct {
	CheckInterval   time.Duration
	UpdateThreshold int // 最小变更次数触发刷新
}

//// CacheWarmupPolicy 缓存预热策略
//type CacheWarmupPolicy struct {
//	ThresholdRequests int
//	TimeWindow        time.Duration
//	Priority          int
//}
