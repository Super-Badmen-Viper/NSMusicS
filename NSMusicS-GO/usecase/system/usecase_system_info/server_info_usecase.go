package usecase_system_info

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/system/domain_system_info"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/system/repository_system_info"
	"time"
)

type serverInfoUsecase struct {
	repo    repository_system_info.ServerInfoRepository
	timeout time.Duration
}

func NewServerInfoUsecase(repo repository_system_info.ServerInfoRepository, timeout time.Duration) domain_system_info.ServerInfoUsecase {
	return &serverInfoUsecase{repo: repo, timeout: timeout}
}

// Get 获取信息
func (uc *serverInfoUsecase) Get(ctx context.Context) (*domain_system_info.ServerInfoResponse, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	info, err := uc.repo.Find(ctx)
	if err != nil {
		return nil, err
	}

	return &domain_system_info.ServerInfoResponse{
		ID:                         info.ID.Hex(),
		OperatingSystemDisplayName: info.OperatingSystemDisplayName,
		HasPendingRestart:          info.HasPendingRestart,
		IsShuttingDown:             info.IsShuttingDown,
		SupportsLibraryMonitor:     info.SupportsLibraryMonitor,
		WebSocketPortNumber:        info.WebSocketPortNumber,
		CompletedInstallations:     info.CompletedInstallations,
		CanSelfRestart:             info.CanSelfRestart,
		CanLaunchWebBrowser:        info.CanLaunchWebBrowser,
		ProgramDataPath:            info.ProgramDataPath,
		WebPath:                    info.WebPath,
		ItemsByNamePath:            info.ItemsByNamePath,
		CachePath:                  info.CachePath,
		LogPath:                    info.LogPath,
		InternalMetadataPath:       info.InternalMetadataPath,
		TranscodingTempPath:        info.TranscodingTempPath,
		HasUpdateAvailable:         info.HasUpdateAvailable,
		EncoderLocation:            info.EncoderLocation,
		SystemArchitecture:         info.SystemArchitecture,
		LocalAddress:               info.LocalAddress,
		ServerName:                 info.ServerName,
		Version:                    info.Version,
		OperatingSystem:            info.OperatingSystem,
	}, nil
}

// Update 更新信息
func (uc *serverInfoUsecase) Update(ctx context.Context, info *domain_system_info.ServerInfo) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()
	return uc.repo.Update(ctx, info)
}
