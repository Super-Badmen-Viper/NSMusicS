package example_scene_audio_db_interface_of_media_file

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_models"
	"time"
)

// MetadataValidator 数据校验接口
type MetadataValidator interface {
	// 基础校验
	ValidateRequiredFields(file *scene_audio_db_models.MediaFileMetadata) error
	ValidateTechnicalParams(file *scene_audio_db_models.MediaFileMetadata) error

	// 高级校验
	CheckAlbumConsistency(ctx context.Context, albumID string) error
	DetectMetadataConflicts(ctx context.Context, file *scene_audio_db_models.MediaFileMetadata) ([]Conflict, error)
}

// 元数据冲突详情
type Conflict struct {
	FieldName     string
	SourceSystem  string // "local", "mbz", "file"
	CurrentValue  interface{}
	ProposedValue interface{}
	ConflictLevel int // 0-信息 1-警告 2-错误
	Resolution    ConflictResolution
}

type ConflictResolution struct {
	Strategy      string // "auto", "manual"
	SelectedValue interface{}
	ResolvedAt    time.Time
}

//// 专辑一致性检查结果
//type AlbumConsistencyReport struct {
//	MissingTracks   []int
//	DuplicateTracks []struct {
//		Track int
//		Paths       []string
//	}
//	YearMismatch   bool
//	ArtistMismatch bool
//}
