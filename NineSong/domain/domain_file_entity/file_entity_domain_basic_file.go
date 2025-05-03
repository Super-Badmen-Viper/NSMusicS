package domain_file_entity

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"path/filepath"
	"strings"
	"time"
)

type FileTypeNo int

const (
	Audio FileTypeNo = iota + 1
	Video
	Image
	Text
	Document
	Archive
	Executable
	Database
	Unknown
)

const (
	AcoustIDFingerprint       = "ACOUSTID_FINGERPRINT"
	AcoustIDID                = "ACOUSTID_ID"
	Album                     = "ALBUM"
	AlbumArtist               = "ALBUMARTIST"
	AlbumArtistSort           = "ALBUMARTISTSORT"
	AlbumSort                 = "ALBUMSORT"
	Arranger                  = "ARRANGER"
	Artist                    = "ARTIST"
	Artists                   = "ARTISTS"
	ArtistSort                = "ARTISTSORT"
	ArtistWebpage             = "ARTISTWEBPAGE"
	ASIN                      = "ASIN"
	AudioSourceWebpage        = "AUDIOSOURCEWEBPAGE"
	Barcode                   = "BARCODE"
	BPM                       = "BPM"
	CatalogNumber             = "CATALOGNUMBER"
	Comment                   = "COMMENT"
	Compilation               = "COMPILATION"
	Composer                  = "COMPOSER"
	ComposerSort              = "COMPOSERSORT"
	Conductor                 = "CONDUCTOR"
	Copyright                 = "COPYRIGHT"
	CopyrightURL              = "COPYRIGHTURL"
	Date                      = "DATE"
	DiscNumber                = "DISCNUMBER"
	DiscSubtitle              = "DISCSUBTITLE"
	DJMixer                   = "DJMIXER"
	EncodedBy                 = "ENCODEDBY"
	Encoding                  = "ENCODING"
	EncodingTime              = "ENCODINGTIME"
	Engineer                  = "ENGINEER"
	FileType                  = "FILETYPE"
	FileWebpage               = "FILEWEBPAGE"
	GaplessPlayback           = "GAPLESSPLAYBACK"
	Genre                     = "GENRE"
	Grouping                  = "GROUPING"
	InitialKey                = "INITIALKEY"
	InvolvedPeople            = "INVOLVEDPEOPLE"
	ISRC                      = "ISRC"
	Label                     = "LABEL"
	Language                  = "LANGUAGE"
	Length                    = "LENGTH"
	License                   = "LICENSE"
	Lyricist                  = "LYRICIST"
	Lyrics                    = "LYRICS"
	Media                     = "MEDIA"
	Mixer                     = "MIXER"
	Mood                      = "MOOD"
	MovementCount             = "MOVEMENTCOUNT"
	MovementName              = "MOVEMENTNAME"
	MovementNumber            = "MOVEMENTNUMBER"
	MusicBrainzAlbumID        = "MUSICBRAINZ_ALBUMID"
	MusicBrainzAlbumArtistID  = "MUSICBRAINZ_ALBUMARTISTID"
	MusicBrainzArtistID       = "MUSICBRAINZ_ARTISTID"
	MusicBrainzReleaseGroupID = "MUSICBRAINZ_RELEASEGROUPID"
	MusicBrainzReleaseTrackID = "MUSICBRAINZ_RELEASETRACKID"
	MusicBrainzTrackID        = "MUSICBRAINZ_TRACKID"
	MusicBrainzWorkID         = "MUSICBRAINZ_WORKID"
	MusicianCredits           = "MUSICIANCREDITS"
	MusicIPPUID               = "MUSICIP_PUID"
	OriginalAlbum             = "ORIGINALALBUM"
	OriginalArtist            = "ORIGINALARTIST"
	OriginalDate              = "ORIGINALDATE"
	OriginalFilename          = "ORIGINALFILENAME"
	OriginalLyricist          = "ORIGINALLYRICIST"
	Owner                     = "OWNER"
	PaymentWebpage            = "PAYMENTWEBPAGE"
	Performer                 = "PERFORMER"
	PlaylistDelay             = "PLAYLISTDELAY"
	Podcast                   = "PODCAST"
	PodcastCategory           = "PODCASTCATEGORY"
	PodcastDesc               = "PODCASTDESC"
	PodcastID                 = "PODCASTID"
	PodcastURL                = "PODCASTURL"
	ProducedNotice            = "PRODUCEDNOTICE"
	Producer                  = "PRODUCER"
	PublisherWebpage          = "PUBLISHERWEBPAGE"
	RadioStation              = "RADIOSTATION"
	RadioStationOwner         = "RADIOSTATIONOWNER"
	RadioStationWebpage       = "RADIOSTATIONWEBPAGE"
	ReleaseCountry            = "RELEASECOUNTRY"
	ReleaseDate               = "RELEASEDATE"
	ReleaseStatus             = "RELEASESTATUS"
	ReleaseType               = "RELEASETYPE"
	Remixer                   = "REMIXER"
	Script                    = "SCRIPT"
	ShowSort                  = "SHOWSORT"
	ShowWorkMovement          = "SHOWWORKMOVEMENT"
	Subtitle                  = "SUBTITLE"
	TaggingDate               = "TAGGINGDATE"
	Title                     = "TITLE"
	TitleSort                 = "TITLESORT"
	TrackNumber               = "TRACKNUMBER"
	TVEpisode                 = "TVEPISODE"
	TVEpisodeID               = "TVEPISODEID"
	TVNetwork                 = "TVNETWORK"
	TVSeason                  = "TVSEASON"
	TVShow                    = "TVSHOW"
	URL                       = "URL"
	Work                      = "WORK"
)

type FileMetadata struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	FolderID  primitive.ObjectID `bson:"folder_id"`
	FilePath  string             `bson:"file_path" validate:"filepath"`
	FileType  FileTypeNo         `bson:"file_type" validate:"min=1,max=8"`
	Size      int64              `bson:"size" validate:"min=0"`
	ModTime   time.Time          `bson:"mod_time" validate:"required"`
	Checksum  string             `bson:"checksum" validate:"sha256"`
	CreatedAt time.Time          `bson:"created_at" validate:"required"`
	UpdatedAt time.Time          `bson:"updated_at" validate:"required,gtfield=CreatedAt"`
}

type FileRepository interface {
	Upsert(ctx context.Context, file *FileMetadata) error
	FindByPath(ctx context.Context, path string) (*FileMetadata, error)
	DeleteByFolder(ctx context.Context, folderID primitive.ObjectID) error
	CountByFolderID(ctx context.Context, folderID primitive.ObjectID) (int64, error)
}

type FileDetector interface {
	DetectMediaType(filePath string) (FileTypeNo, error)
}

type FileDetectorImpl struct{}

func (fd *FileDetectorImpl) DetectMediaType(filePath string) (FileTypeNo, error) {
	ext := strings.ToLower(filepath.Ext(filePath))
	switch ext {
	// 音频类型（补充无损格式和现代编码）
	case ".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a", ".wma":
		return Audio, nil

	// 视频类型（补充主流封装格式）
	case ".mp4", ".avi", ".mkv", ".mov", ".flv", ".webm", ".wmv", ".ts":
		return Video, nil

	// 图片类型（补充RAW格式和矢量图）
	case ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tiff", ".svg":
		return Image, nil

	// 文本类型（补充代码文件）
	case ".txt", ".md", ".log", ".ini", ".cfg", ".conf", ".csv", ".xml", ".json":
		return Text, nil

	// 文档类型（补充办公文档新版格式）
	case ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".odt", ".rtf":
		return Document, nil

	// 压缩类型（补充Linux常见压缩格式）
	case ".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".xz", ".iso":
		return Archive, nil

	// 新增可执行文件类型（根据安全建议单独分类）
	case ".exe", ".msi", ".bat", ".sh", ".apk", ".dmg":
		return Executable, nil

	default:
		if isDatabaseFile(ext) { // 数据库文件检测
			return Database, nil
		}
		return Unknown, nil
	}
}
func isDatabaseFile(ext string) bool {
	switch ext {
	case ".db", ".sqlite", ".mdb", ".accdb", ".dbf":
		return true
	}
	return false
}
