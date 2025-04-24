package scene_audio_route_usecase

import (
	"context"
	"errors"
	"strconv"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type mediaFileUsecase struct {
	mediaFileRepo scene_audio_route_interface.MediaFileRepository
	timeout       time.Duration
}

func NewMediaFileUsecase(repo scene_audio_route_interface.MediaFileRepository, timeout time.Duration) scene_audio_route_interface.MediaFileRepository {
	return &mediaFileUsecase{
		mediaFileRepo: repo,
		timeout:       timeout,
	}
}

func (uc *mediaFileUsecase) GetMediaFileItems(
	ctx context.Context,
	end, order, sort, start, search, starred, albumId, artistId, year string,
) ([]scene_audio_route_models.MediaFileMetadata, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// 参数验证链式处理
	validations := []func() error{
		func() error { // 分页参数校验
			if _, err := strconv.Atoi(start); err != nil && start != "" {
				return errors.New("invalid start parameter")
			}
			if _, err := strconv.Atoi(end); err != nil && end != "" {
				return errors.New("invalid end parameter")
			}
			return nil
		},
		func() error { // ID格式校验
			if albumId != "" {
				if _, err := primitive.ObjectIDFromHex(albumId); err != nil {
					return errors.New("invalid album id format")
				}
			}
			if artistId != "" {
				if _, err := primitive.ObjectIDFromHex(artistId); err != nil {
					return errors.New("invalid artist id format")
				}
			}
			return nil
		},
		func() error { // 年份格式校验
			if year != "" {
				if _, err := strconv.Atoi(year); err != nil {
					return errors.New("year must be integer")
				}
			}
			return nil
		},
	}

	for _, validate := range validations {
		if err := validate(); err != nil {
			return nil, err
		}
	}

	return uc.mediaFileRepo.GetMediaFileItems(ctx, end, order, sort, start, search, starred, albumId, artistId, year)
}
