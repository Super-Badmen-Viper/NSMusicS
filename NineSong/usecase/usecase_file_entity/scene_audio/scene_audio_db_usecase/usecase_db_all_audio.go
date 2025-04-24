package scene_audio_db_usecase

import (
	"crypto/sha256"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_models"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity"
	"github.com/dhowden/tag"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AudioMetadataExtractor struct{}

func (e *AudioMetadataExtractor) Extract(path string, fileMetadata *domain_file_entity.FileMetadata) (
	*scene_audio_db_models.MediaFileMetadata,
	*scene_audio_db_models.AlbumMetadata,
	*scene_audio_db_models.ArtistMetadata,
	error,
) {
	// 获取完整文件元数据
	if err := e.enrichFileMetadata(path, fileMetadata); err != nil {
		return nil, nil, nil, err
	}

	// 打开音频文件解析标签
	file, err := os.Open(path)
	if err != nil {
		return nil, nil, nil, fmt.Errorf("文件访问失败[%s]: %w", path, err)
	}
	defer file.Close()

	metadata, err := tag.ReadFrom(file)
	if err != nil {
		return nil, nil, nil, fmt.Errorf("标签解析失败[%s]: %w", path, err)
	}

	now := time.Now().UTC()
	rawTags := metadata.Raw()

	// 生成新的 ObjectID 用于关联关系

	// 生成确定性ID
	artistID := e.generateArtistID(metadata, rawTags)
	albumID := e.generateAlbumID(metadata, rawTags)
	albumArtistID := e.generateAlbumArtistID(metadata, rawTags)

	// 构建媒体文件元数据
	mediaFile := e.buildMediaFile(path, metadata, rawTags, fileMetadata, now, artistID, albumID, albumArtistID)

	// 构建专辑元数据
	album := e.buildAlbum(path, metadata, rawTags, now, artistID, albumID, albumArtistID)

	// 构建艺术家元数据
	artist := e.buildArtist(path, metadata, rawTags, now, artistID)

	return mediaFile, album, artist, nil
}

func (e *AudioMetadataExtractor) enrichFileMetadata(path string, fm *domain_file_entity.FileMetadata) error {
	// 计算文件校验和
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()

	hash := sha256.New()
	if _, err := io.Copy(hash, file); err != nil {
		return fmt.Errorf("校验和计算失败: %w", err)
	}
	fm.Checksum = fmt.Sprintf("%x", hash.Sum(nil))

	// 获取文件信息
	info, err := file.Stat()
	if err != nil {
		return fmt.Errorf("文件状态获取失败: %w", err)
	}

	// 填充文件元数据
	fm.FilePath = path
	fm.Size = info.Size()
	fm.ModTime = info.ModTime().UTC()
	fm.FileType = domain_file_entity.Audio

	// 设置时间戳
	if fm.CreatedAt.IsZero() {
		fm.CreatedAt = time.Now().UTC()
	}
	fm.UpdatedAt = time.Now().UTC()

	return nil
}

func (e *AudioMetadataExtractor) buildMediaFile(
	path string,
	m tag.Metadata,
	rawTags map[string]interface{},
	fm *domain_file_entity.FileMetadata,
	now time.Time,
	artistID, albumID, albumArtistID primitive.ObjectID,
) *scene_audio_db_models.MediaFileMetadata {
	currentTrack, totalTracks := m.Track()
	currentDisc, totalDiscs := m.Disc()
	coverPath := e.extractMediaCover(m, fm.ID)

	return &scene_audio_db_models.MediaFileMetadata{
		// 基础文件元数据
		ID:        fm.ID,
		Path:      fm.FilePath,
		Size:      int(fm.Size),
		CreatedAt: fm.CreatedAt,
		UpdatedAt: fm.UpdatedAt,

		ArtistID:      artistID.Hex(),      // 新增关联
		AlbumID:       albumID.Hex(),       // 新增关联
		AlbumArtistID: albumArtistID.Hex(), // 假设专辑艺术家=艺术家

		// 音频标签元数据
		Title:       m.Title(),
		Album:       m.Album(),
		Artist:      m.Artist(),
		AlbumArtist: m.AlbumArtist(),
		Genre:       m.Genre(),
		Year:        m.Year(),
		TrackNumber: currentTrack,
		TotalTracks: totalTracks,
		DiscNumber:  currentDisc,
		TotalDiscs:  totalDiscs,
		Suffix:      strings.ToLower(strings.TrimPrefix(filepath.Ext(path), ".")),

		// MusicBrainz 元数据
		MBZTrackID:        e.getTagString(rawTags, "musicbrainz_trackid"),
		MBZAlbumID:        e.getTagString(rawTags, "musicbrainz_albumid"),
		MBZArtistID:       e.getTagString(rawTags, "musicbrainz_artistid"),
		MBZAlbumArtistID:  e.getTagString(rawTags, "musicbrainz_albumartistid"),
		MBZAlbumType:      e.getTagString(rawTags, "musicbrainz_albumtype"),
		MBZAlbumComment:   e.getTagString(rawTags, "musicbrainz_albumcomment"),
		MBZReleaseTrackID: e.getTagString(rawTags, "musicbrainz_releasetrackid"),

		// 需要计算的字段
		Compilation: e.isCompilation(rawTags),

		// 默认空值字段
		HasCoverArt:          coverPath != "",
		Duration:             0,
		BitRate:              0,
		FullText:             "",
		OrderAlbumName:       e.getTagString(rawTags, "order_album_name"),
		OrderAlbumArtistName: e.getTagString(rawTags, "order_album_artist_name"),
		OrderArtistName:      e.getTagString(rawTags, "order_artist_name"),
		SortAlbumName:        e.getTagString(rawTags, "sort_album_name"),
		SortArtistName:       e.getTagString(rawTags, "sort_artist_name"),
		SortAlbumArtistName:  e.getTagString(rawTags, "sort_album_artist_name"),
		SortTitle:            e.getTagString(rawTags, "sort_title"),
		DiscSubtitle:         e.getTagString(rawTags, "discsubtitle"),
		Lyrics:               e.getTagString(rawTags, "lyrics"),
		CatalogNum:           e.getTagString(rawTags, "catalognum"),
		Comment:              e.getTagString(rawTags, "comment"),
		BPM:                  e.getTagInt(rawTags, "bpm"),
		Channels:             e.getTagInt(rawTags, "channels"),
		RGAlbumGain:          e.getTagFloat(rawTags, "replaygain_album_gain"),
		RGTrackGain:          e.getTagFloat(rawTags, "replaygain_track_gain"),
		RGAlbumPeak:          e.getTagFloat(rawTags, "replaygain_album_peak"),
		RGTrackPeak:          e.getTagFloat(rawTags, "replaygain_track_peak"),
		MediumImageURL:       coverPath,
	}
}
func (e *AudioMetadataExtractor) extractMediaCover(m tag.Metadata, ID primitive.ObjectID) string {
	if pic := m.Picture(); pic != nil && len(pic.Data) > 0 {
		// 构建标准化路径（网页2路径规范实践）
		fileName := ID.String() + ".jpg"
		targetDir := `C:\Users\Public\Documents\NineSong\MetaData` // 硬编码指定路径
		targetPath := filepath.Join(targetDir, fileName)

		// 创建目录并写入文件（网页3文件系统操作实践）
		if err := os.MkdirAll(targetDir, 0755); err == nil {
			if err := os.WriteFile(targetPath, pic.Data, 0644); err == nil {
				return targetPath
			}
		}
	}
	return ""
}

func (e *AudioMetadataExtractor) buildAlbum(
	path string,
	m tag.Metadata, rawTags map[string]interface{}, now time.Time,
	artistID, albumID, albumArtistID primitive.ObjectID,
) *scene_audio_db_models.AlbumMetadata {
	coverPath := e.extractAlbumCover(path)

	return &scene_audio_db_models.AlbumMetadata{
		ID:            albumID,             // 关键修改
		ArtistID:      artistID.Hex(),      // 新增关联
		AlbumArtistID: albumArtistID.Hex(), // 新增关联

		Name:             m.Album(),
		Artist:           m.Artist(),
		AlbumArtist:      m.AlbumArtist(),
		Genre:            m.Genre(),
		MinYear:          m.Year(),
		MaxYear:          m.Year(),
		MBZAlbumID:       e.getTagString(rawTags, "musicbrainz_albumid"),
		MBZAlbumArtistID: e.getTagString(rawTags, "musicbrainz_albumartistid"),
		MBZAlbumType:     e.getTagString(rawTags, "musicbrainz_albumtype"),
		CreatedAt:        now,
		UpdatedAt:        now,

		// 默认空值字段
		EmbedArtPath:          "",
		Compilation:           false,
		SongCount:             0,
		Duration:              0,
		FullText:              "",
		OrderAlbumName:        e.getTagString(rawTags, "order_album_name"),
		OrderAlbumArtistName:  e.getTagString(rawTags, "order_album_artist_name"),
		SortAlbumName:         e.getTagString(rawTags, "sort_album_name"),
		SortArtistName:        e.getTagString(rawTags, "sort_artist_name"),
		SortAlbumArtistName:   e.getTagString(rawTags, "sort_album_artist_name"),
		Size:                  0,
		CatalogNum:            e.getTagString(rawTags, "catalognum"),
		Comment:               e.getTagString(rawTags, "comment"),
		AllArtistIDs:          "",
		ImageFiles:            coverPath,
		Paths:                 "",
		Description:           "",
		SmallImageURL:         "",
		MediumImageURL:        "",
		LargeImageURL:         "",
		ExternalURL:           "",
		ExternalInfoUpdatedAt: time.Time{},
	}
}
func (e *AudioMetadataExtractor) extractAlbumCover(path string) string {
	// 1. 获取文件所在目录
	dir := filepath.Dir(path)

	// 2. 读取目录下所有文件
	entries, err := os.ReadDir(dir)
	if err != nil {
		return ""
	}

	// 3. 遍历检测封面文件
	var coverPath string
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		// 4. 提取文件名和扩展名
		filename := entry.Name()
		ext := strings.ToLower(filepath.Ext(filename))
		baseName := strings.TrimSuffix(filename, ext)

		// 5. 匹配cover文件名规范
		if baseName == "cover" && (ext == ".jpg" || ext == ".jpeg" || ext == ".png") {
			// 6. 优先选择jpg格式
			if coverPath == "" || (ext == ".jpg" && !strings.HasSuffix(coverPath, ".jpg")) {
				coverPath = filepath.Join(dir, filename)
			}
		}
	}

	return coverPath
}

func (e *AudioMetadataExtractor) buildArtist(
	path string,
	m tag.Metadata, rawTags map[string]interface{}, now time.Time,
	artistID primitive.ObjectID,
) *scene_audio_db_models.ArtistMetadata {
	return &scene_audio_db_models.ArtistMetadata{
		ID:          artistID,
		Name:        m.Artist(),
		MBZArtistID: e.getTagString(rawTags, "musicbrainz_artistid"),
		// 默认空值字段
		AlbumCount:            0,
		FullText:              "",
		OrderArtistName:       e.getTagString(rawTags, "order_artist_name"),
		SortArtistName:        e.getTagString(rawTags, "sort_artist_name"),
		SongCount:             0,
		Size:                  0,
		Biography:             e.getTagString(rawTags, "biography"),
		SmallImageURL:         e.getTagString(rawTags, "artist_image_small"),
		MediumImageURL:        e.getTagString(rawTags, "artist_image_medium"),
		LargeImageURL:         e.getTagString(rawTags, "artist_image_large"),
		SimilarArtists:        e.getTagString(rawTags, "similar_artists"),
		ExternalURL:           e.getTagString(rawTags, "artist_external_url"),
		ExternalInfoUpdatedAt: time.Time{},
	}
}

// 辅助方法
// 生成艺术家ID（基于MusicBrainz ID或艺术家名称）
func (e *AudioMetadataExtractor) generateArtistID(m tag.Metadata, rawTags map[string]interface{}) primitive.ObjectID {
	if mbzID := e.getTagString(rawTags, "musicbrainz_artistid"); mbzID != "" {
		return generateDeterministicID(mbzID)
	}
	return generateDeterministicID(m.Artist())
}

// 生成专辑ID（基于MusicBrainz ID或专辑名称+艺术家）
func (e *AudioMetadataExtractor) generateAlbumID(m tag.Metadata, rawTags map[string]interface{}) primitive.ObjectID {
	if mbzID := e.getTagString(rawTags, "musicbrainz_albumid"); mbzID != "" {
		return generateDeterministicID(mbzID)
	}
	return generateDeterministicID(m.Album() + "|" + m.AlbumArtist())
}

// 生成专辑艺术家ID
func (e *AudioMetadataExtractor) generateAlbumArtistID(m tag.Metadata, rawTags map[string]interface{}) primitive.ObjectID {
	if mbzID := e.getTagString(rawTags, "musicbrainz_albumartistid"); mbzID != "" {
		return generateDeterministicID(mbzID)
	}
	return generateDeterministicID(m.AlbumArtist())
}

// 确定性ID生成器（SHA256哈希前12字节）
func generateDeterministicID(seed string) primitive.ObjectID {
	hash := sha256.Sum256([]byte(seed))
	return primitive.ObjectID(hash[:12])
}

func (e *AudioMetadataExtractor) getTagString(tags map[string]interface{}, key string) string {
	if val, ok := tags[key]; ok {
		if s, ok := val.(string); ok {
			return strings.TrimSpace(s)
		}
		return fmt.Sprintf("%v", val)
	}
	return ""
}

func (e *AudioMetadataExtractor) getTagInt(tags map[string]interface{}, key string) int {
	if s := e.getTagString(tags, key); s != "" {
		var result int
		if _, err := fmt.Sscanf(s, "%d", &result); err == nil {
			return result
		}
	}
	return 0
}

func (e *AudioMetadataExtractor) getTagFloat(tags map[string]interface{}, key string) float64 {
	if s := e.getTagString(tags, key); s != "" {
		var result float64
		if _, err := fmt.Sscanf(s, "%f", &result); err == nil {
			return result
		}
	}
	return 0.0
}

func (e *AudioMetadataExtractor) isCompilation(tags map[string]interface{}) bool {
	switch {
	case e.getTagString(tags, "compilation") == "1",
		strings.Contains(strings.ToLower(e.getTagString(tags, "musicbrainz_albumtype")), "compilation"):
		return true
	default:
		return false
	}
}
