package scene_audio_route_models

import "go.mongodb.org/mongo-driver/bson/primitive"

type PlaylistTrackMetadata struct {
	ID          int                `bson:"_id"`
	PlaylistID  primitive.ObjectID `bson:"playlist_id"`
	MediaFileID primitive.ObjectID `bson:"media_file_id"`
	//应该仅有MediaFileID，三维播放列表应在客户端体现
	//其原理为检索当前播放列表中所有子项是否存在AlbumID、ArtistID顺序并列，如果MediaFile顺序并列就自动归类从MediaFile升级为Album，Album到Artist同理
	//PlayType string             `bson:"play_type"` // 播放类型: MediaFile, Album, Artist
}

type PlaylistTrackListResponse struct {
	PlaylistTracks []PlaylistTrackMetadata `json:"playlist_tracks"`
	Count          int                     `json:"count"`
}
