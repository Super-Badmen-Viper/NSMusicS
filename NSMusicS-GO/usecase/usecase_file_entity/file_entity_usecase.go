package usecase_file_entity

import (
	"context"
	"crypto/sha256"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"io"
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
}

func NewFileUsecase(
	fileRepo domain_file_entity.FileRepository,
	folderRepo domain_file_entity.FolderRepository,
	detector domain_file_entity.FileDetector,
	timeoutMinutes int,
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
	}
}

func (uc *FileUsecase) ProcessDirectory(ctx context.Context, dirPath string, targetTypes []domain_file_entity.FileType) error {
	folder, err := uc.folderRepo.FindByPath(ctx, dirPath)
	if err != nil {
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
		return fmt.Errorf("cleanup failed: %w", err)
	}

	// 并发处理管道
	var wg sync.WaitGroup
	errChan := make(chan error, 100) // 缓冲通道避免阻塞
	fileCount := 0

	// 遍历文件系统
	err = filepath.Walk(dirPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
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
		if finalErr == nil {
			finalErr = err
		} else {
			finalErr = fmt.Errorf("%v; %w", finalErr, err)
		}
	}

	// 更新文件夹统计
	if updateErr := uc.folderRepo.UpdateStats(ctx, folder.ID, fileCount); updateErr != nil {
		return fmt.Errorf("stats update failed: %w", updateErr)
	}

	return finalErr
}

func (uc *FileUsecase) shouldProcess(path string) bool {
	fileType, err := uc.detector.DetectMediaType(path)
	if err != nil {
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

	// 检查上下文状态
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

	metadata, err := uc.createMetadataBasicInfo(path, folderID)
	if err != nil {
		errChan <- fmt.Errorf("文件处理失败 %s: %w", path, err)
		return
	}

	if upsertErr := uc.fileRepo.Upsert(ctx, metadata); upsertErr != nil {
		errChan <- fmt.Errorf("数据库写入失败 %s: %w", path, upsertErr)
	}
}

func (uc *FileUsecase) createMetadataBasicInfo(
	path string,
	folderID primitive.ObjectID,
) (*domain_file_entity.FileMetadata, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	stat, err := file.Stat()
	if err != nil {
		return nil, err
	}

	fileType, err := uc.detector.DetectMediaType(path)
	if err != nil {
		return nil, err
	}

	hash := sha256.New()
	if _, err := io.CopyBuffer(hash, file, make([]byte, 32*1024)); err != nil {
		return nil, err
	}

	return &domain_file_entity.FileMetadata{
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
