package usecase_file_entity

import (
	"context"
	"crypto/sha256"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity"
	"github.com/fsnotify/fsnotify"
	"io"
	"log"
	"os"
	"path/filepath"
	"sync"
)

const (
	workerCount    = 10
	fileBufferSize = 100
)

type FileUsecase struct {
	repo      domain_file_entity.FileRepository
	detector  domain_file_entity.FileDetector
	Ffmpeg    domain_file_entity.FFmpegService
	watcher   *fsnotify.Watcher
	fileTypes map[domain_file_entity.FileType]struct{}
	mu        sync.RWMutex
}

func NewFileUsecase(
	repo domain_file_entity.FileRepository,
	detector domain_file_entity.FileDetector,
	ffmpeg domain_file_entity.FFmpegService,
) *FileUsecase {
	watcher, _ := fsnotify.NewWatcher()
	return &FileUsecase{
		repo:     repo,
		detector: detector,
		Ffmpeg:   ffmpeg,
		watcher:  watcher,
	}
}

func (uc *FileUsecase) ProcessDirectory(ctx context.Context, dirPath string, targetTypes []domain_file_entity.FileType) error {
	uc.mu.Lock()
	uc.fileTypes = make(map[domain_file_entity.FileType]struct{})
	for _, ft := range targetTypes {
		uc.fileTypes[ft] = struct{}{}
	}
	uc.mu.Unlock()

	jobs := make(chan string, fileBufferSize)
	var wg sync.WaitGroup

	for i := 0; i < workerCount; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for filePath := range jobs {
				uc.processFile(ctx, filePath)
			}
		}()
	}

	if err := filepath.Walk(dirPath, func(path string, info os.FileInfo, err error) error {
		if !info.IsDir() {
			jobs <- path
		}
		return nil
	}); err != nil {
		log.Printf("目录扫描失败: %v", err)
	}

	close(jobs)
	wg.Wait()
	return nil
}

func (uc *FileUsecase) processFile(ctx context.Context, filePath string) {
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		return
	}

	fileType, err := uc.detector.DetectMediaType(filePath)
	if err != nil || !uc.isTargetType(fileType) {
		return
	}

	file, err := os.Open(filePath)
	if err != nil {
		return
	}
	defer file.Close()

	hash := sha256.New()
	if _, err := io.Copy(hash, file); err != nil {
		return
	}

	stat, _ := file.Stat()
	metadata := &domain_file_entity.FileMetadata{
		FolderPath: filepath.Dir(filePath),
		FileType:   fileType,
		Size:       stat.Size(),
		ModTime:    stat.ModTime(),
		Checksum:   fmt.Sprintf("%x", hash.Sum(nil)),
	}

	uc.repo.Upsert(ctx, metadata)
}

func (uc *FileUsecase) isTargetType(fileType domain_file_entity.FileType) bool {
	uc.mu.RLock()
	defer uc.mu.RUnlock()
	_, exists := uc.fileTypes[fileType]
	return exists
}
