package example_scene_audio_db_interface_of_media_file

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// FileHandler 文件处理接口
type FileHandler interface {
	// 路径处理
	NormalizePath(ctx context.Context, path string) (string, error)
	RelocateFile(ctx context.Context, oldPath, newPath string) error

	// 封面处理
	ExtractCoverArt(ctx context.Context, id primitive.ObjectID) ([]byte, error)
	GenerateAudioHash(ctx context.Context, id primitive.ObjectID) (string, error)

	// 文件校验
	VerifyFileIntegrity(ctx context.Context, id primitive.ObjectID) (bool, error)
}

// RelocationContext 文件迁移上下文
type RelocationContext struct {
	SourcePath          string
	TargetPath          string
	VerifyHash          bool
	PreservePermissions bool
	UpdateMetadata      bool
	ConflictHandler     RelocationConflictHandler
}
type RelocationConflictHandler struct {
	ExistingFileAction string // "overwrite", "rename", "skip"
	LogPath            string
}

//// 路径标准化配置
//type PathNormalizationRules struct {
//	ReplaceSpacesWith  string
//	RemoveSpecialChars bool
//	CaseFolding        int // 0-无 1-小写 2-大写
//}
//// 音频哈希算法配置
//type HashAlgorithmConfig struct {
//	Algorithm  string // "md5", "sha1", "xxhash"
//	BlockSize  int    // 分块大小（字节）
//	SampleRate int    // 重采样率（Hz）
//}
//// 音频指纹配置
//type AudioFingerprint struct {
//	Algorithm   string
//	Version     string
//	Data        []byte
//	ExtractedAt time.Time
//}
