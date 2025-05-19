package scene_audio_db_models

import "go.mongodb.org/mongo-driver/bson/primitive"

type MediaMvMetadata struct {
	ID         primitive.ObjectID `bson:"mv_id"`         // MV唯一标识[4](@ref)
	Type       string             `bson:"mv_type"`       // 竖屏/横屏[4](@ref)
	Path       string             `bson:"mv_path"`       // MV文件路径
	Resolution string             `bson:"mv_resolution"` // 分辨率
	PlayCount  int64              `bson:"mv_plays"`
}
