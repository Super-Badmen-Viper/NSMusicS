package usecase_file_entity

import (
	"context"
	"crypto/sha256"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/type_audio/domain_file_entity_audio_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/type_audio/domain_file_entity_audio_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_file_entity/usecase_file_entity_audio_interface"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"io"
	"log"
	"os"
	"path/filepath"
	"runtime"
	"sync"
	"time"
)

type FileUsecase struct {
	fileRepo    domain_file_entity.FileRepository
	folderRepo  domain_file_entity.FolderRepository
	detector    domain_file_entity.FileDetector
	targetTypes map[domain_file_entity.FileType]struct{}
	targetMutex sync.RWMutex
	workerPool  chan struct{}
	scanTimeout time.Duration

	audioExtractor usecase_file_entity_audio_interface.AudioMetadataExtractor
	artistRepo     domain_file_entity_audio_interface.ArtistRepository
	albumRepo      domain_file_entity_audio_interface.AlbumRepository
	mediaRepo      domain_file_entity_audio_interface.MediaFileRepository
}

func NewFileUsecase(
	fileRepo domain_file_entity.FileRepository,
	folderRepo domain_file_entity.FolderRepository,
	detector domain_file_entity.FileDetector,
	timeoutMinutes int,

	// 音频处理依赖项
	artistRepo domain_file_entity_audio_interface.ArtistRepository,
	albumRepo domain_file_entity_audio_interface.AlbumRepository,
	mediaRepo domain_file_entity_audio_interface.MediaFileRepository,
) *FileUsecase {
	workerCount := runtime.NumCPU() * 2
	if workerCount < 4 {
		workerCount = 4
	}

	return &FileUsecase{
		fileRepo:    fileRepo,
		folderRepo:  folderRepo,
		detector:    detector,
		workerPool:  make(chan struct{}, workerCount),
		scanTimeout: time.Duration(timeoutMinutes) * time.Minute,
		artistRepo:  artistRepo,
		albumRepo:   albumRepo,
		mediaRepo:   mediaRepo,
	}
}

func (uc *FileUsecase) ProcessDirectory(ctx context.Context, dirPath string, targetTypes []domain_file_entity.FileType) error {
	// 防御性检查
	if uc.folderRepo == nil {
		log.Printf("folderRepo未初始化")
		return fmt.Errorf("系统未正确初始化")
	}

	folder, err := uc.folderRepo.FindByPath(ctx, dirPath)
	if err != nil {
		log.Printf("文件夹查询失败: %v", err)
		return fmt.Errorf("folder query failed: %w", err)
	}

	if folder == nil {
		newFolder := &domain_file_entity.FolderMetadata{
			ID:         primitive.NewObjectID(),
			FolderPath: dirPath,
			FolderMeta: domain_file_entity.FolderMeta{
				FileCount:   0,
				LastScanned: time.Now(),
			},
		}
		if err := uc.folderRepo.Insert(ctx, newFolder); err != nil {
			log.Printf("文件夹创建失败: %v", err)
			return fmt.Errorf("folder creation failed: %w", err)
		}
		folder = newFolder
	}

	// 设置目标文件类型
	uc.targetMutex.Lock()
	uc.targetTypes = make(map[domain_file_entity.FileType]struct{})
	for _, ft := range targetTypes {
		uc.targetTypes[ft] = struct{}{}
	}
	uc.targetMutex.Unlock()

	// 清理旧文件记录
	if err := uc.fileRepo.DeleteByFolder(ctx, folder.ID); err != nil {
		log.Printf("清理失败: %v", err)
		return fmt.Errorf("cleanup failed: %w", err)
	}

	// 并发处理管道
	var wg sync.WaitGroup
	errChan := make(chan error, 100)
	fileCount := 0

	// 遍历文件系统
	err = filepath.Walk(dirPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			log.Printf("文件遍历错误: %v", err)
			return err
		}

		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
			if info.IsDir() || !uc.shouldProcess(path) {
				return nil
			}

			wg.Add(1)
			fileCount++
			go uc.processFile(ctx, path, folder.ID, &wg, errChan)
			return nil
		}
	})

	// 等待所有任务完成
	go func() {
		wg.Wait()
		close(errChan)
	}()

	// 收集错误
	var finalErr error
	for err := range errChan {
		log.Printf("文件处理错误: %v", err)
		if finalErr == nil {
			finalErr = err
		} else {
			finalErr = fmt.Errorf("%v; %w", finalErr, err)
		}
	}

	// 更新文件夹统计
	if updateErr := uc.folderRepo.UpdateStats(ctx, folder.ID, fileCount); updateErr != nil {
		log.Printf("统计更新失败: %v", updateErr)
		return fmt.Errorf("stats update failed: %w", updateErr)
	}

	return finalErr
}

func (uc *FileUsecase) shouldProcess(path string) bool {
	fileType, err := uc.detector.DetectMediaType(path)
	if err != nil {
		log.Printf("文件类型检测失败: %v", err)
		return false
	}

	uc.targetMutex.RLock()
	defer uc.targetMutex.RUnlock()
	_, exists := uc.targetTypes[fileType]
	return exists
}

func (uc *FileUsecase) processFile(
	ctx context.Context,
	path string,
	folderID primitive.ObjectID,
	wg *sync.WaitGroup,
	errChan chan<- error,
) {
	defer wg.Done()

	select {
	case <-ctx.Done():
		errChan <- ctx.Err()
		return
	default:
	}

	// 获取工作槽
	select {
	case uc.workerPool <- struct{}{}:
		defer func() { <-uc.workerPool }()
	case <-ctx.Done():
		errChan <- ctx.Err()
		return
	}

	// 文件类型检测
	fileType, err := uc.detector.DetectMediaType(path)
	if err != nil {
		log.Printf("文件检测失败: %s | %v", path, err)
		errChan <- fmt.Errorf("文件检测失败 %s: %w", path, err)
		return
	}

	metadata, err := uc.createMetadataBasicInfo(path, folderID)
	if err != nil {
		log.Printf("元数据创建失败: %s | %v", path, err)
		errChan <- fmt.Errorf("文件处理失败 %s: %w", path, err)
		return
	}

	if upsertErr := uc.fileRepo.Upsert(ctx, metadata); upsertErr != nil {
		log.Printf("文件写入失败: %s | %v", path, upsertErr)
		errChan <- fmt.Errorf("数据库写入失败 %s: %w", path, upsertErr)
	}

	// 处理音频文件
	if fileType == domain_file_entity.Audio {
		mediaFile, album, artist, err := uc.audioExtractor.Extract(path, metadata)
		if err != nil {
			log.Printf("音频解析失败: %s | %v", path, err)
			errChan <- fmt.Errorf("元数据解析失败 %s: %w", path, err)
			return
		}

		if processErr := uc.processAudioHierarchy(ctx, artist, album, mediaFile); processErr != nil {
			log.Printf("层级处理失败: %s | %v", path, processErr)
			errChan <- fmt.Errorf("层级数据写入失败 %s: %w", path, processErr)
		}
	}
}

func (uc *FileUsecase) processAudioHierarchy(
	ctx context.Context,
	artist *domain_file_entity_audio_models.ArtistMetadata,
	album *domain_file_entity_audio_models.AlbumMetadata,
	mediaFile *domain_file_entity_audio_models.MediaFileMetadata,
) error {
	// 关键依赖检查
	if uc.mediaRepo == nil || uc.artistRepo == nil || uc.albumRepo == nil {
		log.Print("音频仓库未初始化")
		return fmt.Errorf("系统服务异常")
	}

	if mediaFile == nil {
		log.Print("媒体文件元数据为空")
		return fmt.Errorf("mediaFile cannot be nil")
	}

	// 直接保存无关联数据
	if artist == nil && album == nil {
		if err := uc.mediaRepo.Upsert(ctx, mediaFile); err != nil {
			log.Printf("歌曲保存失败: %s | %v", mediaFile.Path, err)
			return fmt.Errorf("歌曲元数据保存失败 | 路径:%s | %w", mediaFile.Path, err)
		}
		return nil
	}

	// 处理艺术家
	if artist != nil {
		if artist.Name == "" {
			log.Print("艺术家名称为空")
			return fmt.Errorf("artist name is empty")
		}
		if err := uc.upsertArtist(ctx, artist); err != nil {
			log.Printf("艺术家处理失败: %s | %v", artist.Name, err)
			return fmt.Errorf("艺术家处理失败 | 原因:%w", err)
		}
	}

	// 处理专辑
	if album != nil {
		if album.Name == "" {
			log.Print("专辑名称为空")
			return fmt.Errorf("album name is empty")
		}
		if err := uc.upsertAlbum(ctx, album); err != nil {
			log.Printf("专辑处理失败: %s | %v", album.Name, err)
			return fmt.Errorf("专辑处理失败 | 名称:%s | 原因:%w", album.Name, err)
		}
	}

	// 保存媒体文件
	if err := uc.mediaRepo.Upsert(ctx, mediaFile); err != nil {
		errorInfo := fmt.Sprintf("路径:%s", mediaFile.Path)
		if album != nil {
			errorInfo += fmt.Sprintf(" 专辑:%s", album.Name)
		}
		log.Printf("最终保存失败: %s | %v", errorInfo, err)
		return fmt.Errorf("歌曲写入失败 %s | %w", errorInfo, err)
	}

	// 异步统计更新
	go uc.safeUpdateStatistics(artist, album)
	return nil
}

func (uc *FileUsecase) safeUpdateStatistics(artist *domain_file_entity_audio_models.ArtistMetadata, album *domain_file_entity_audio_models.AlbumMetadata) {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("统计更新发生panic: %v", r)
		}
	}()

	ctx := context.Background()
	var artistID, albumID primitive.ObjectID

	if artist != nil && !artist.ID.IsZero() {
		artistID = artist.ID
	}
	if album != nil && !album.ID.IsZero() {
		albumID = album.ID
	}

	if !artistID.IsZero() {
		if _, err := uc.artistRepo.UpdateAlbumCount(ctx, artistID, 1); err != nil {
			log.Printf("艺术家统计更新失败: %v", err)
		}
	}

	if !albumID.IsZero() {
		if _, err := uc.albumRepo.UpdateSongCount(ctx, albumID, 1); err != nil {
			log.Printf("专辑统计更新失败: %v", err)
		}
	}
}

func (uc *FileUsecase) upsertArtist(
	ctx context.Context,
	artist *domain_file_entity_audio_models.ArtistMetadata,
) error {
	if uc.artistRepo == nil {
		log.Print("艺术家仓库未初始化")
		return fmt.Errorf("系统服务异常")
	}

	if artist.MBZArtistID != "" {
		existing, err := uc.artistRepo.GetByMBID(ctx, artist.MBZArtistID)
		if err != nil {
			log.Printf("MBID查询错误: %v", err)
		}
		if existing != nil {
			artist.ID = existing.ID
			return nil
		}
	}

	existing, err := uc.artistRepo.GetByName(ctx, artist.Name)
	if err != nil {
		log.Printf("名称查询错误: %v", err)
	}
	if existing != nil {
		artist.ID = existing.ID
		return nil
	}

	if err := uc.artistRepo.Upsert(ctx, artist); err != nil {
		log.Printf("艺术家创建失败: %s | %v", artist.Name, err)
		return err
	}
	return nil
}

func (uc *FileUsecase) upsertAlbum(
	ctx context.Context,
	album *domain_file_entity_audio_models.AlbumMetadata,
) error {
	if uc.albumRepo == nil {
		log.Print("专辑仓库未初始化")
		return fmt.Errorf("系统服务异常")
	}

	if album.MBZAlbumID != "" {
		existing, err := uc.albumRepo.GetByMBID(ctx, album.MBZAlbumID)
		if err != nil {
			log.Printf("MBID查询错误: %v", err)
		}
		if existing != nil {
			album.ID = existing.ID
			return nil
		}
	}

	filter := bson.M{
		"name":            album.Name,
		"album_artist_id": album.AlbumArtistID,
		"min_year":        album.MinYear,
	}

	existing, err := uc.albumRepo.GetByFilter(ctx, filter)
	if err != nil {
		log.Printf("组合查询错误: %v", err)
	}
	if existing != nil {
		album.ID = existing.ID
		return nil
	}

	if err := uc.albumRepo.Upsert(ctx, album); err != nil {
		log.Printf("专辑创建失败: %s | %v", album.Name, err)
		return err
	}
	return nil
}

func (uc *FileUsecase) createMetadataBasicInfo(
	path string,
	folderID primitive.ObjectID,
) (*domain_file_entity.FileMetadata, error) {
	file, err := os.Open(path)
	if err != nil {
		log.Printf("文件打开失败: %s | %v", path, err)
		return nil, err
	}
	defer file.Close()

	stat, err := file.Stat()
	if err != nil {
		log.Printf("文件信息获取失败: %s | %v", path, err)
		return nil, err
	}

	fileType, err := uc.detector.DetectMediaType(path)
	if err != nil {
		log.Printf("文件类型检测失败: %s | %v", path, err)
		return nil, err
	}

	hash := sha256.New()
	if _, err := io.CopyBuffer(hash, file, make([]byte, 32*1024)); err != nil {
		log.Printf("哈希计算失败: %s | %v", path, err)
		return nil, err
	}

	return &domain_file_entity.FileMetadata{
		ID:        primitive.NewObjectID(),
		FolderID:  folderID,
		FilePath:  path,
		FileType:  fileType,
		Size:      stat.Size(),
		ModTime:   stat.ModTime(),
		Checksum:  fmt.Sprintf("%x", hash.Sum(nil)),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}, nil
}
