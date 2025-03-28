package usecase_file_entity_audio

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/type_audio/domain_file_entity_audio_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/type_audio/domain_file_entity_audio_models"
	"github.com/dhowden/tag"
	"os"
)

type MetadataExtractor struct{}

func (e *MetadataExtractor) Extract(path string) (*domain_file_entity_audio_interface.MediaFileMetadata, *domain_file_entity_audio_models.AlbumMetadata, *domain_file_entity_audio_models.ArtistMetadata, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, nil, nil, err
	}
	defer file.Close()

	// 提取基础元数据
	metadata, err := tag.ReadFrom(file)
	if err != nil {
		return nil, nil, nil, err
	}

	// 构建媒体文件对象
	mediaFile := &domain_file_entity_audio_interface.MediaFileMetadata{
		Path:        path,
		Title:       metadata.Title(),
		TrackNumber: metadata.Track(),
		DiscNumber:  metadata.Disc(),
		Year:        metadata.Year(),
		Genre:       metadata.Genre(),
	}

	// 构建专辑对象
	album := &domain_file_entity_audio_models.AlbumMetadata{
		Name:        metadata.Album(),
		AlbumArtist: metadata.AlbumArtist(),
		Genre:       metadata.Genre(),
	}

	// 构建艺术家对象
	artist := &domain_file_entity_audio_models.ArtistMetadata{
		Name: metadata.Artist(),
	}

	return mediaFile, album, artist, nil
}
