package scene_audio_route_usecase

import (
	"context"
	"errors"
	"strconv"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
)

type artistUsecase struct {
	artistRepo scene_audio_route_interface.ArtistRepository
	timeout    time.Duration
}

func NewArtistUsecase(repo scene_audio_route_interface.ArtistRepository, timeout time.Duration) scene_audio_route_interface.ArtistRepository {
	return &artistUsecase{
		artistRepo: repo,
		timeout:    timeout,
	}
}

func (uc *artistUsecase) GetArtistItems(
	ctx context.Context,
	end, order, sort, start, search, starred string,
) ([]scene_audio_route_models.ArtistMetadata, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// 参数验证
	if _, err := strconv.Atoi(start); err != nil && start != "" {
		return nil, errors.New("invalid start parameter")
	}
	if _, err := strconv.Atoi(end); err != nil && end != "" {
		return nil, errors.New("invalid end parameter")
	}

	return uc.artistRepo.GetArtistItems(ctx, end, order, sort, start, search, starred)
}
