package usecase_system

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_system"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_system"
	"time"
)

type systemInfoUsecase struct {
	repo    repository_system.SystemInfoRepository
	timeout time.Duration
}

func NewSystemInfoUsecase(repo repository_system.SystemInfoRepository, timeout time.Duration) domain_system.SystemInfoUsecase {
	return &systemInfoUsecase{repo: repo, timeout: timeout}
}

func (uc *systemInfoUsecase) Get(ctx context.Context) (*domain_system.SystemInfo, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	info, err := uc.repo.Find(ctx)
	if err != nil {
		return nil, err
	}

	return &domain_system.SystemInfo{
		ID:                         info.ID,
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

func (uc *systemInfoUsecase) Update(ctx context.Context, info *domain_system.SystemInfo) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()
	return uc.repo.Update(ctx, info)
}
