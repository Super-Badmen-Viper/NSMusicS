package scene_audio_db_models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// MediaFileMetadata 核心元数据结构
type MediaFileMetadata struct {
	ID                      primitive.ObjectID `bson:"_id"`                        // 系统唯一标识（MongoDB ObjectID）
	Path                    string             `bson:"path"`                       // 文件路径/流媒体URI（支持spotify:等协议）
	Title                   string             `bson:"title"`                      // 标准曲目标题（包含版本标记）
	SortTitle               string             `bson:"sort_title"`                 // 排序用标题（去除冠词）
	SubTitle                string             `bson:"sub_title"`                  // 副标题/版本说明（Live/Remix等）
	ISRC                    string             `bson:"isrc"`                       // 国际标准录音代码（ISO 3901）
	MCDI                    string             `bson:"mcdi"`                       // 音乐CD标识符（CD-TEXT标准）
	MvID                    string             `bson:"mv_id"`                      // 关联MV视频标识符（如存在）
	KaraokeID               string             `bson:"karaoke_id"`                 // 卡拉OK版本标识符（如存在）
	LyricsID                string             `bson:"lyrics_id"`                  // 关联歌词标识符（如存在）
	QualityVersion          string             `bson:"quality_version"`            // 音质版本（如320kbps/FLAC等）
	QualityVersionID        string             `bson:"quality_version_id"`         // 音质版本ID（如320kbps/FLAC等）
	QualityVersionCreatedAt time.Time          `bson:"quality_version_created_at"` // 音质版本创建时间（UTC）
	QualityVersionUpdateAt  time.Time          `bson:"quality_version_update_at"`  // 音质版本更新时间（UTC）
	Album                   string             `bson:"album"`                      // 所属专辑名称
	Artist                  string             `bson:"artist"`                     // 表演者/艺术家名称
	ArtistID                string             `bson:"artist_id"`                  // 艺术家系统唯一标识符
	AlbumArtist             string             `bson:"album_artist"`               // 专辑级艺术家（可能不同于曲目艺术家）
	AlbumID                 string             `bson:"album_id"`                   // 专辑系统唯一标识符
	AlbumArtistID           string             `bson:"album_artist_id"`            // 专辑艺术家系统唯一标识符
	TrackNumber             int                `bson:"track_number"`               // 当前轨道在专辑中的序号（从1开始）
	TotalTracks             int                `bson:"total_tracks"`               // 专辑总轨道数（用于计算光盘容量）
	DiscNumber              int                `bson:"disc_number"`                // 光盘编号（多CD专辑场景）
	TotalDiscs              int                `bson:"total_discs"`                // 总光盘数（多CD专辑场景）
	DiscSubtitle            string             `bson:"disc_subtitle"`              // 光盘副标题（特别版/纪念版等）
	Year                    int                `bson:"year"`                       // 发行年份（ISO 8601格式）
	Genre                   string             `bson:"genre"`                      // 音乐流派分类（流行/摇滚等）
	Compilation             bool               `bson:"compilation"`                // 是否为合辑（多艺术家作品合集）
	OrderTitle              string             `bson:"order_title"`                // 排序用标题（去除前缀词）
	OrderAlbumName          string             `bson:"order_album_name"`           // 排序用专辑名称（忽略冠词）
	OrderAlbumArtistName    string             `bson:"order_album_artist_name"`    // 排序用专辑艺术家名称
	OrderArtistName         string             `bson:"order_artist_name"`          // 排序用艺术家名称
	SortAlbumName           string             `bson:"sort_album_name"`            // 标准化专辑名称（去除非字母字符）
	SortArtistName          string             `bson:"sort_artist_name"`           // 标准化艺术家名称
	SortAlbumArtistName     string             `bson:"sort_album_artist_name"`     // 标准化专辑艺术家名称

	// 文件属性
	Size          int     `bson:"size"`           // 文件大小（字节单位）
	Suffix        string  `bson:"suffix"`         // 文件格式后缀（mp3/flac等）
	Duration      float64 `bson:"duration"`       // 精确到毫秒的时长
	BitRate       int     `bson:"bit_rate"`       // 平均比特率（0表示VBR）
	ChannelLayout string  `bson:"channel_layout"` // 声道布局（立体声/5.1/杜比全景声）
	Channels      int     `bson:"channels"`       // 音频通道数（立体声/单声道）
	SampleRate    int     `bson:"sample_rate"`    // 采样率
	BitDepth      int     `bson:"bit_depth"`      // 量化位深

	// 音乐属性
	BPM        int      `bson:"bpm"`         // 每分钟节拍数（自动检测值）
	InitialKey string   `bson:"initial_key"` // 音乐调式（C大调/A小调等）
	MoodTags   []string `bson:"mood_tags"`   // 心情标签
	SceneTags  []string `bson:"scene_tags"`  // 场景标签
	Language   string   `bson:"language"`    // 主要语言（ISO 639-2代码）
	Lyrics     string   `bson:"lyrics"`      // 歌词文本

	// 版权与发行
	Copyright          string    `bson:"copyright"`            // 版权声明文本
	Publisher          string    `bson:"publisher"`            // 发行机构/厂牌
	ReleaseDate        time.Time `bson:"release_date"`         // 正式发行日期（UTC）
	RecordingDate      time.Time `bson:"recording_date"`       // 原始录音时间（UTC）
	MBZTrackID         string    `bson:"mbz_track_id"`         // MusicBrainz曲目ID（MusicBrainz元数据标识）
	MBZAlbumID         string    `bson:"mbz_album_id"`         // MusicBrainz专辑ID
	MBZArtistID        string    `bson:"mbz_artist_id"`        // MusicBrainz艺术家ID
	MBZAlbumArtistID   string    `bson:"mbz_album_artist_id"`  // MusicBrainz专辑艺术家ID
	MBZAlbumType       string    `bson:"mbz_album_type"`       // 专辑类型（录音室专辑/EP等）
	MBZAlbumComment    string    `bson:"mbz_album_comment"`    // MusicBrainz专辑评论
	MBZReleaseTrackID  string    `bson:"mbz_release_track_id"` // MusicBrainz发行版曲目ID
	AcoustID           string    `bson:"acoust_id"`            // 音频指纹标识（AcoustID数据库:MusicBrainz）
	AcoustFingerprint  string    `bson:"acoust_fingerprint"`   // 音频指纹
	MIDIProgram        int       `bson:"midi_program"`         // MIDI音色库编号（GM标准）
	Producer           string    `bson:"producer"`             // 制作人
	Engineer           string    `bson:"engineer"`             // 工程师
	Studio             string    `bson:"studio"`               // 录音室
	RecordingLocation  string    `bson:"recording_location"`   // 录音地点
	CatalogNum         string    `bson:"catalog_num"`          // 唱片目录编号（发行商编码）
	EducationalContent bool      `bson:"educational_content"`  // 是否为教育内容（如有）

	// 用户行为
	UserRating int       `bson:"user_rating"` // 用户评分（0-100分制）
	PlayCount  int       `bson:"play_count"`  // 播放次数统计
	LastPlayed time.Time `bson:"last_played"` // 最后播放时间戳（UTC）
	Starred    bool      `bson:"starred"`     // 是否收藏
	StarredAt  time.Time `bson:"starred_at"`  // 收藏时间
	Comment    string    `bson:"comment"`     // 用户评论

	// 视觉元素
	HasCoverArt    bool   `bson:"has_cover_art"`    // 是否包含专辑封面图
	ThumbnailURL   string `bson:"thumbnail_url"`    // 缩略图URL（200x200px）
	HighResArtURL  string `bson:"highres_art_url"`  // 高清封面URL（不低于1200x1200px）
	MediumImageURL string `bson:"medium_image_url"` // 专辑封面中分辨率URL

	// 地理信息
	LocationName string  `bson:"location_name"` // 录制地理位置名称
	GPSLatitude  float64 `bson:"gps_lat"`       // 纬度坐标（WGS84）
	GPSLongitude float64 `bson:"gps_lng"`       // 经度坐标（WGS84）

	// 扩展存储
	CustomTags map[string]string `bson:"custom_tags"` // 自定义扩展标签（键值对存储）

	// 系统保留字段
	CreatedAt time.Time `bson:"created_at"` // 元数据创建时间（UTC）
	UpdatedAt time.Time `bson:"updated_at"` // 元数据更新时间（UTC）

	// 其他
	FullText string `bson:"full_text"` // 全文检索字段（包含歌词等信息）

	// ReplayGain
	RGAlbumGain float64 `bson:"rg_album_gain"` // ReplayGain专辑增益（音量标准化）
	RGAlbumPeak float64 `bson:"rg_album_peak"` // ReplayGain专辑峰值
	RGTrackGain float64 `bson:"rg_track_gain"` // ReplayGain曲目增益
	RGTrackPeak float64 `bson:"rg_track_peak"` // ReplayGain曲目峰值

	Index int `bson:"index" json:"Index"` // 索引（用于排序或其他目的）
}
