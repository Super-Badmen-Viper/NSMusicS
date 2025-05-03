package scene_audio_db_usecase

//
//import (
//	"crypto/sha256"
//	"fmt"
//	"io"
//	"os"
//	"path/filepath"
//	"strings"
//	"time"
//
//	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity"
//	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_models"
//	"go.mongodb.org/mongo-driver/bson/primitive"
//	"go.senan.xyz/taglib" // 使用新的库
//)
//
//type AudioMetadataExtractor struct{}
//
//func (e *AudioMetadataExtractor) Extract(path string, fileMetadata *domain_file_entity.FileMetadata) (
//	*scene_audio_db_models.MediaFileMetadata,
//	*scene_audio_db_models.AlbumMetadata,
//	*scene_audio_db_models.ArtistMetadata,
//	error,
//) {
//	// 获取完整文件元数据
//	if err := e.enrichFileMetadata(path, fileMetadata); err != nil {
//		return nil, nil, nil, err
//	}
//
//	// 读取音频文件的标签和属性
//	tags, err := taglib.ReadTags(path)
//	if err != nil {
//		return nil, nil, nil, fmt.Errorf("标签解析失败[%s]: %w", path, err)
//	}
//	properties, err := taglib.ReadProperties(path)
//	if err != nil {
//		return nil, nil, nil, fmt.Errorf("属性解析失败[%s]: %w", path, err)
//	}
//
//	now := time.Now().UTC()
//
//	// 生成确定性ID
//	artistID := e.generateArtistID(tags)
//	albumID := e.generateAlbumID(tags)
//	albumArtistID := e.generateAlbumArtistID(tags)
//
//	// 构建媒体文件元数据
//	mediaFile := e.buildMediaFile(path, tags, properties, fileMetadata, now, artistID, albumID, albumArtistID)
//
//	// 构建专辑元数据
//	album := e.buildAlbum(path, tags, properties, now, artistID, albumID, albumArtistID)
//
//	// 构建艺术家元数据
//	artist := e.buildArtist(path, tags, properties, now, artistID)
//
//	return mediaFile, album, artist, nil
//}
//
//func (e *AudioMetadataExtractor) enrichFileMetadata(path string, fm *domain_file_entity.FileMetadata) error {
//	// 计算文件校验和
//	file, err := os.Open(path)
//	if err != nil {
//		return err
//	}
//	defer file.Close()
//
//	hash := sha256.New()
//	if _, err := io.Copy(hash, file); err != nil {
//		return fmt.Errorf("校验和计算失败: %w", err)
//	}
//	fm.Checksum = fmt.Sprintf("%x", hash.Sum(nil))
//
//	// 获取文件信息
//	info, err := file.Stat()
//	if err != nil {
//		return fmt.Errorf("文件状态获取失败: %w", err)
//	}
//
//	// 填充文件元数据
//	fm.FilePath = path
//	fm.Size = info.Size()
//	fm.ModTime = info.ModTime().UTC()
//	fm.FileType = domain_file_entity.Audio
//
//	// 设置时间戳
//	if fm.CreatedAt.IsZero() {
//		fm.CreatedAt = time.Now().UTC()
//	}
//	fm.UpdatedAt = time.Now().UTC()
//
//	return nil
//}
//
//func (e *AudioMetadataExtractor) buildMediaFile(
//	path string,
//	tags map[string][]string,
//	properties taglib.Properties,
//	fm *domain_file_entity.FileMetadata,
//	now time.Time,
//	artistID, albumID, albumArtistID primitive.ObjectID,
//) *scene_audio_db_models.MediaFileMetadata {
//	// 提取标签信息
//	title := e.getTagString(tags, taglib.Title)
//	album := e.getTagString(tags, taglib.Album)
//	artist := e.getTagString(tags, taglib.Artist)
//	albumArtist := e.getTagString(tags, taglib.AlbumArtist)
//	genre := e.getTagString(tags, taglib.Genre)
//	year := e.getTagInt(tags, "year")
//	currentTrack, totalTracks := e.getTagIntPair(tags, taglib.TrackNumber)
//	currentDisc, totalDiscs := e.getTagIntPair(tags, taglib.DiscNumber)
//
//	// 提取 MusicBrainz 元数据
//	mbzTrackID := e.getTagString(tags, "musicbrainz_trackid")
//	mbzAlbumID := e.getTagString(tags, "musicbrainz_albumid")
//	mbzArtistID := e.getTagString(tags, "musicbrainz_artistid")
//	mbzAlbumArtistID := e.getTagString(tags, "musicbrainz_albumartistid")
//	mbzAlbumType := e.getTagString(tags, "musicbrainz_albumtype")
//	mbzAlbumComment := e.getTagString(tags, "musicbrainz_albumcomment")
//	mbzReleaseTrackID := e.getTagString(tags, "musicbrainz_releasetrackid")
//
//	// 判断是否为合辑
//	compilation := false
//	if compilationStr := e.getTagString(tags, "compilation"); compilationStr == "1" {
//		compilation = true
//	}
//	if strings.Contains(strings.ToLower(e.getTagString(tags, "musicbrainz_albumtype")), "compilation") {
//		compilation = true
//	}
//
//	// 提取封面图片
//	coverPath := ""
//	if pic := e.extractMediaCover(tags); pic != "" {
//		coverPath = pic
//	}
//
//	return &scene_audio_db_models.MediaFileMetadata{
//		// 基础文件元数据
//		ID:        fm.ID,
//		Path:      fm.FilePath,
//		Size:      int(fm.Size),
//		CreatedAt: fm.CreatedAt,
//		UpdatedAt: fm.UpdatedAt,
//
//		ArtistID:      artistID.Hex(),
//		AlbumID:       albumID.Hex(),
//		AlbumArtistID: albumArtistID.Hex(),
//
//		// 音频标签元数据
//		Title:       title,
//		Album:       album,
//		Artist:      artist,
//		AlbumArtist: albumArtist,
//		Genre:       genre,
//		Year:        year,
//		TrackNumber: currentTrack,
//		TotalTracks: totalTracks,
//		DiscNumber:  currentDisc,
//		TotalDiscs:  totalDiscs,
//		Suffix:      strings.ToLower(strings.TrimPrefix(filepath.Ext(path), ".")),
//
//		// MusicBrainz 元数据
//		MBZTrackID:        mbzTrackID,
//		MBZAlbumID:        mbzAlbumID,
//		MBZArtistID:       mbzArtistID,
//		MBZAlbumArtistID:  mbzAlbumArtistID,
//		MBZAlbumType:      mbzAlbumType,
//		MBZAlbumComment:   mbzAlbumComment,
//		MBZReleaseTrackID: mbzReleaseTrackID,
//
//		// 音频属性
//		Duration: float64(properties.Length),
//		BitRate:  int(properties.Bitrate),
//
//		// 其他元数据
//		Compilation: compilation,
//		HasCoverArt: coverPath != "",
//
//		// 默认空值字段
//		FullText:             "",
//		OrderAlbumName:       e.getTagString(tags, "order_album_name"),
//		OrderAlbumArtistName: e.getTagString(tags, "order_album_artist_name"),
//		OrderArtistName:      e.getTagString(tags, "order_artist_name"),
//		SortAlbumName:        e.getTagString(tags, "sort_album_name"),
//		SortArtistName:       e.getTagString(tags, "sort_artist_name"),
//		SortAlbumArtistName:  e.getTagString(tags, "sort_album_artist_name"),
//		SortTitle:            e.getTagString(tags, "sort_title"),
//		DiscSubtitle:         e.getTagString(tags, "discsubtitle"),
//		Lyrics:               e.getTagString(tags, "lyrics"),
//		CatalogNum:           e.getTagString(tags, "catalognum"),
//		Comment:              e.getTagString(tags, "comment"),
//		BPM:                  e.getTagInt(tags, "bpm"),
//		Channels:             int(properties.Channels),
//		RGAlbumGain:          e.getTagFloat(tags, "replaygain_album_gain"),
//		RGTrackGain:          e.getTagFloat(tags, "replaygain_track_gain"),
//		RGAlbumPeak:          e.getTagFloat(tags, "replaygain_album_peak"),
//		RGTrackPeak:          e.getTagFloat(tags, "replaygain_track_peak"),
//		MediumImageURL:       coverPath,
//	}
//}
//
//func (e *AudioMetadataExtractor) extractMediaCover(tags map[string][]string) string {
//	// 这里需要根据你的封面提取逻辑进行实现
//	// 示例：检查是否存在封面数据
//	if _, ok := tags["COVERART"]; ok {
//		// 假设封面数据存储在 COVERART 标签中
//		return "cover_path.jpg"
//	}
//	return ""
//}
//
//func (e *AudioMetadataExtractor) buildAlbum(
//	path string,
//	tags map[string][]string,
//	properties taglib.Properties,
//	now time.Time,
//	artistID, albumID, albumArtistID primitive.ObjectID,
//) *scene_audio_db_models.AlbumMetadata {
//	// 提取标签信息
//	name := e.getTagString(tags, taglib.Album)
//	artist := e.getTagString(tags, taglib.Artist)
//	albumArtist := e.getTagString(tags, taglib.AlbumArtist)
//	genre := e.getTagString(tags, taglib.Genre)
//	year := e.getTagInt(tags, "year")
//
//	// 提取 MusicBrainz 元数据
//	mbzAlbumID := e.getTagString(tags, "musicbrainz_albumid")
//	mbzAlbumArtistID := e.getTagString(tags, "musicbrainz_albumartistid")
//	mbzAlbumType := e.getTagString(tags, "musicbrainz_albumtype")
//
//	// 提取专辑封面
//	coverPath := e.extractAlbumCover(path)
//
//	return &scene_audio_db_models.AlbumMetadata{
//		ID:            albumID,
//		ArtistID:      artistID.Hex(),
//		AlbumArtistID: albumArtistID.Hex(),
//
//		Name:             name,
//		Artist:           artist,
//		AlbumArtist:      albumArtist,
//		Genre:            genre,
//		MinYear:          year,
//		MaxYear:          year,
//		MBZAlbumID:       mbzAlbumID,
//		MBZAlbumArtistID: mbzAlbumArtistID,
//		MBZAlbumType:     mbzAlbumType,
//		CreatedAt:        now,
//		UpdatedAt:        now,
//
//		// 默认空值字段
//		Compilation:           false,
//		SongCount:             0,
//		Duration:              0,
//		FullText:              "",
//		EmbedArtPath:          coverPath,
//		OrderAlbumName:        e.getTagString(tags, "order_album_name"),
//		OrderAlbumArtistName:  e.getTagString(tags, "order_album_artist_name"),
//		SortAlbumName:         e.getTagString(tags, "sort_album_name"),
//		SortArtistName:        e.getTagString(tags, "sort_artist_name"),
//		SortAlbumArtistName:   e.getTagString(tags, "sort_album_artist_name"),
//		Size:                  0,
//		CatalogNum:            e.getTagString(tags, "catalognum"),
//		Comment:               e.getTagString(tags, "comment"),
//		AllArtistIDs:          "",
//		ImageFiles:            coverPath,
//		Paths:                 "",
//		Description:           "",
//		SmallImageURL:         "",
//		MediumImageURL:        coverPath,
//		LargeImageURL:         "",
//		ExternalURL:           "",
//		ExternalInfoUpdatedAt: time.Time{},
//	}
//}
//
//func (e *AudioMetadataExtractor) extractAlbumCover(path string) string {
//	// 这里需要根据你的专辑封面提取逻辑进行实现
//	// 示例：检查是否存在封面文件
//	dir := filepath.Dir(path)
//	coverPath := filepath.Join(dir, "cover.jpg")
//	if _, err := os.Stat(coverPath); err == nil {
//		return coverPath
//	}
//	return ""
//}
//
//func (e *AudioMetadataExtractor) buildArtist(
//	path string,
//	tags map[string][]string,
//	properties taglib.Properties,
//	now time.Time,
//	artistID primitive.ObjectID,
//) *scene_audio_db_models.ArtistMetadata {
//	// 提取标签信息
//	name := e.getTagString(tags, taglib.Artist)
//
//	return &scene_audio_db_models.ArtistMetadata{
//		ID:          artistID,
//		Name:        name,
//		MBZArtistID: e.getTagString(tags, "musicbrainz_artistid"),
//
//		// 默认空值字段
//		AlbumCount:            0,
//		FullText:              "",
//		OrderArtistName:       e.getTagString(tags, "order_artist_name"),
//		SortArtistName:        e.getTagString(tags, "sort_artist_name"),
//		SongCount:             0,
//		Size:                  0,
//		Biography:             e.getTagString(tags, "biography"),
//		SmallImageURL:         e.getTagString(tags, "artist_image_small"),
//		MediumImageURL:        e.getTagString(tags, "artist_image_medium"),
//		LargeImageURL:         e.getTagString(tags, "artist_image_large"),
//		SimilarArtists:        e.getTagString(tags, "similar_artists"),
//		ExternalURL:           e.getTagString(tags, "artist_external_url"),
//		ExternalInfoUpdatedAt: time.Time{},
//	}
//}
//
//// 辅助方法
//func (e *AudioMetadataExtractor) generateArtistID(tags map[string][]string) primitive.ObjectID {
//	mbzID := e.getTagString(tags, "musicbrainz_artistid")
//	if mbzID != "" {
//		return generateDeterministicID(mbzID)
//	}
//	return generateDeterministicID(e.getTagString(tags, taglib.Artist))
//}
//
//func (e *AudioMetadataExtractor) generateAlbumID(tags map[string][]string) primitive.ObjectID {
//	mbzID := e.getTagString(tags, "musicbrainz_albumid")
//	if mbzID != "" {
//		return generateDeterministicID(mbzID)
//	}
//	return generateDeterministicID(e.getTagString(tags, taglib.Album) + "|" + e.getTagString(tags, taglib.AlbumArtist))
//}
//
//func (e *AudioMetadataExtractor) generateAlbumArtistID(tags map[string][]string) primitive.ObjectID {
//	mbzID := e.getTagString(tags, "musicbrainz_albumartistid")
//	if mbzID != "" {
//		return generateDeterministicID(mbzID)
//	}
//	return generateDeterministicID(e.getTagString(tags, taglib.AlbumArtist))
//}
//
//func generateDeterministicID(seed string) primitive.ObjectID {
//	hash := sha256.Sum256([]byte(seed))
//	return primitive.ObjectID(hash[:12])
//}
//
//func (e *AudioMetadataExtractor) getTagString(tags map[string][]string, key string) string {
//	values := tags[key]
//	if len(values) > 0 {
//		return strings.TrimSpace(values[0])
//	}
//	return ""
//}
//
//func (e *AudioMetadataExtractor) getTagInt(tags map[string][]string, key string) int {
//	value := e.getTagString(tags, key)
//	if value != "" {
//		var result int
//		if _, err := fmt.Sscanf(value, "%d", &result); err == nil {
//			return result
//		}
//	}
//	return 0
//}
//
//func (e *AudioMetadataExtractor) getTagIntPair(tags map[string][]string, key string) (int, int) {
//	value := e.getTagString(tags, key)
//	if value != "" {
//		var current, total int
//		if _, err := fmt.Sscanf(value, "%d/%d", &current, &total); err == nil {
//			return current, total
//		}
//	}
//	return 0, 0
//}
//
//func (e *AudioMetadataExtractor) getTagFloat(tags map[string][]string, key string) float64 {
//	value := e.getTagString(tags, key)
//	if value != "" {
//		var result float64
//		if _, err := fmt.Sscanf(value, "%f", &result); err == nil {
//			return result
//		}
//	}
//	return 0.0
//}
//
//func (e *AudioMetadataExtractor) isCompilation(tags map[string][]string) bool {
//	switch {
//	case e.getTagString(tags, "compilation") == "1",
//		strings.Contains(strings.ToLower(e.getTagString(tags, "musicbrainz_albumtype")), "compilation"):
//		return true
//	default:
//		return false
//	}
//}
