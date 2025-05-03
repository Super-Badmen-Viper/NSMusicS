package scene_audio_route_models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RetrievalStreamMetadata struct {
	ID        primitive.ObjectID `bson:"_id"`
	Name      string             `bson:"name"`
	Duration  float64            `bson:"duration"`
	CreatedAt time.Time          `bson:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at"`
	Path      string             `bson:"path"`
	Sync      bool               `bson:"sync"`
	Size      int                `bson:"size"`
}
type RetrievalCoverArtMetadata struct {
	ID        primitive.ObjectID `bson:"_id"`
	FileName  string             `bson:"file_name"`
	Format    string             `bson:"format"`
	CreatedAt time.Time          `bson:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at"`
	Path      string             `bson:"path"`
	Sync      bool               `bson:"sync"`
	Size      int                `bson:"size"`
	Width     int                `bson:"width"`
	Height    int                `bson:"height"`
}
type RetrievalLyricsMetadata struct {
	ID          primitive.ObjectID `bson:"_id"`
	MediaFileID primitive.ObjectID `bson:"media_file_id"`
	Lyrics      string             `bson:"lyrics"` // 直接获取媒体文件元数据内的歌词
	Name        string             `bson:"name"`
	CreatedAt   time.Time          `bson:"created_at"`
	UpdatedAt   time.Time          `bson:"updated_at"`
	Path        string             `bson:"path"` // 多歌词文件管理
}
